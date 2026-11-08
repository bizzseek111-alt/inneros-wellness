import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side Azure Cognitive Services TTS proxy (free F0 tier).
 *
 * Env vars (set in Vercel, never in code):
 *   AZURE_SPEECH_KEY     — subscription key
 *   AZURE_SPEECH_REGION  — e.g. "centralindia", "eastus", "westeurope"
 *
 * Voices used:
 *   en -> en-US-AnaNeural (child-friendly) / en-US-JennyNeural / en-US-GuyNeural
 *   ur -> ur-PK-UzmaNeural (female) / ur-PK-AsadNeural (male)
 *   pa -> ur-PK-UzmaNeural (Azure has no native Shahmukhi Punjabi neural voice;
 *         we disclose this honestly in the UI and response headers).
 *
 * If Azure is not configured or fails, returns 204 so the client uses
 * browser Web Speech immediately without an error in the console.
 */

const VOICE_MAP: Record<string, Record<string, { voice: string; locale: string }>> = {
  en: {
    kai: { voice: "en-US-AnaNeural", locale: "en-US" },
    mia: { voice: "en-US-JennyNeural", locale: "en-US" },
    lumi: { voice: "en-US-AriaNeural", locale: "en-US" },
    zayn: { voice: "en-US-GuyNeural", locale: "en-US" },
  },
  ur: {
    kai: { voice: "ur-PK-AsadNeural", locale: "ur-PK" },
    mia: { voice: "ur-PK-UzmaNeural", locale: "ur-PK" },
    lumi: { voice: "ur-PK-UzmaNeural", locale: "ur-PK" },
    zayn: { voice: "ur-PK-AsadNeural", locale: "ur-PK" },
  },
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function POST(req: NextRequest) {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region) {
    return new NextResponse(null, {
      status: 204,
      headers: { "x-voice-provider": "unconfigured-fallback-webspeech" },
    });
  }

  try {
    const body = await req.json();
    const rawText = String(body.text || "").trim().slice(0, 500);
    if (!rawText) return new NextResponse(null, { status: 204 });

    const lang = String(body.lang || "en").toLowerCase();
    const character = String(body.character || "kai").toLowerCase();
    const isPunjabi = lang.startsWith("pa");
    const bucket = lang.startsWith("ur") || isPunjabi ? "ur" : "en";
    const chosen = VOICE_MAP[bucket][character] || VOICE_MAP[bucket].kai;

    const ssml = `<speak version="1.0" xml:lang="${chosen.locale}"><voice name="${chosen.voice}"><prosody rate="0.95">${escapeXml(rawText)}</prosody></voice></speak>`;

    const res = await fetch(
      `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": key,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
          "User-Agent": "weebly-web",
        },
        body: ssml,
      }
    );

    if (!res.ok) {
      return new NextResponse(null, {
        status: 204,
        headers: { "x-voice-provider": "azure-error-fallback-webspeech" },
      });
    }

    const audio = await res.arrayBuffer();
    return new NextResponse(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
        "x-voice-provider": "azure-neural",
        "x-voice-name": chosen.voice,
        "x-voice-punjabi-fallback": isPunjabi ? "ur-PK" : "false",
      },
    });
  } catch {
    return new NextResponse(null, {
      status: 204,
      headers: { "x-voice-provider": "exception-fallback-webspeech" },
    });
  }
}
