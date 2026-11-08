/**
 * Server-only LLM adapter for Kai, Mia, Lumi and Zayn.
 *
 * Provider: Google Gemini (free tier) via REST, configured with GEMINI_API_KEY.
 * Optional fallback: Groq (GROQ_API_KEY), OpenAI-compatible chat API.
 * If no key is configured, or the provider fails/times out, callers fall back
 * to the deterministic template replies. Safety and secrecy handling always
 * runs BEFORE this adapter and is never delegated to the model.
 *
 * Privacy: only the child's current utterance, a short history and the
 * character persona are sent. No names, profile IDs or other identifiers.
 */

export type CharacterId = "kai" | "mia" | "lumi" | "zayn";
export type Lang = "en" | "ur" | "pa" | "ur-Latn" | "pa-Latn";

const PERSONAS: Record<CharacterId, string> = {
  kai: "You are Kai, a curious, upbeat learning buddy who helps with homework and maths. You guide with hints and questions instead of giving final answers straight away, but you do confirm when the child is right.",
  mia: "You are Mia, a warm storyteller who loves stories, words, drawing and imagination. You help children tell stories and express ideas.",
  lumi: "You are Lumi, a gentle, calm friend who helps with routines, naming feelings and simple breathing. You never diagnose or label anyone.",
  zayn: "You are Zayn, an excited young scientist who loves space, nature, puzzles and how things work. You explain with simple experiments and examples.",
};

const LANGUAGE_RULE: Record<string, string> = {
  en: "Reply in simple English.",
  ur: "Reply in simple Urdu using Urdu script.",
  pa: "Reply in simple Pakistani Punjabi written in Shahmukhi script. If unsure of a word, use the common Urdu word.",
  "ur-Latn": "Reply in simple Roman Urdu.",
  "pa-Latn": "Reply in simple Roman Punjabi.",
};

const AGE_RULE: Record<string, string> = {
  little: "The child is 3-5 years old: use very short sentences (max 2), very simple words.",
  junior: "The child is 6-11 years old: use short, clear sentences (max 4).",
  teen: "The user is 12-17 years old: be friendly and respectful, max 5 sentences.",
};

const SAFETY_RULES = `Rules you must always follow:
- You are an AI friend in a children's learning app called Weebly. If asked, say you are an AI, not a person.
- Never ask for or repeat personal information (full name, address, school name, phone, photos).
- Never give medical, psychological or diagnostic opinions. Never label a child with conditions.
- Do not keep secrets from parents or teachers.
- If the child seems sad, scared or unsafe, be kind and encourage them to talk to a trusted adult.
- No violence, romance, scary content, brands, or links.
- Keep replies short, warm and encouraging. Plain text only, no markdown, at most one emoji.`;

export function isLlmConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY);
}

export interface HistoryTurn {
  role: "child" | "friend";
  text: string;
}

function buildSystemPrompt(character: CharacterId, language: Lang, ageTier: string): string {
  return [
    PERSONAS[character] || PERSONAS.kai,
    LANGUAGE_RULE[language] || LANGUAGE_RULE.en,
    AGE_RULE[ageTier] || AGE_RULE.junior,
    SAFETY_RULES,
  ].join("\n\n");
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error("llm_timeout")), ms)),
  ]);
}

async function callGemini(system: string, history: HistoryTurn[], message: string): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const contents = [
    ...history.slice(-6).map((h) => ({
      role: h.role === "child" ? "user" : "model",
      parts: [{ text: h.text.slice(0, 600) }],
    })),
    { role: "user", parts: [{ text: message.slice(0, 600) }] },
  ];
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 220 },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_LOW_AND_ABOVE" },
        ],
      }),
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts
    ?.map((p: { text?: string }) => p.text || "")
    .join("");
  return text?.trim() || null;
}

async function callGroq(system: string, history: HistoryTurn[], message: string): Promise<string | null> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 220,
      messages: [
        { role: "system", content: system },
        ...history.slice(-6).map((h) => ({
          role: h.role === "child" ? "user" : "assistant",
          content: h.text.slice(0, 600),
        })),
        { role: "user", content: message.slice(0, 600) },
      ],
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() || null;
}

/** Light output filter: strip markdown/links and refuse anything that leaks contact patterns. */
function sanitizeReply(text: string): string | null {
  let t = text.replace(/[*_#`>]/g, "").replace(/https?:\/\/\S+/g, "").trim();
  if (/\b\d{10,}\b/.test(t)) return null;
  if (t.length > 700) t = t.slice(0, 700).replace(/\s+\S*$/, "") + "…";
  return t || null;
}

export interface LlmReply {
  text: string;
  provider: "gemini" | "groq";
}

export async function generateFriendReply(opts: {
  character: CharacterId;
  message: string;
  language: Lang;
  ageTier: string;
  history?: HistoryTurn[];
}): Promise<LlmReply | null> {
  if (!isLlmConfigured() || !opts.message) return null;
  const system = buildSystemPrompt(opts.character, opts.language, opts.ageTier);
  const history = Array.isArray(opts.history) ? opts.history : [];
  try {
    const g = await withTimeout(callGemini(system, history, opts.message), 8000);
    const gs = g && sanitizeReply(g);
    if (gs) return { text: gs, provider: "gemini" };
  } catch {
    /* fall through */
  }
  try {
    const q = await withTimeout(callGroq(system, history, opts.message), 8000);
    const qs = q && sanitizeReply(q);
    if (qs) return { text: qs, provider: "groq" };
  } catch {
    /* fall through */
  }
  return null;
}
