import { NextResponse } from "next/server";
import { isSupabaseConfigured, sbSelect } from "@/lib/server/supabase";
import { isLlmConfigured } from "@/lib/server/llm";

/**
 * Honest runtime status endpoint. Reports only what is actually configured
 * and reachable in the current environment — never exposes secret values.
 */
export async function GET() {
  const supabaseConfigured = isSupabaseConfigured();
  let supabaseReachable = false;
  if (supabaseConfigured) {
    const probe = await sbSelect("educational_activity_events", "select=id&limit=1");
    supabaseReachable = Array.isArray(probe);
  }

  return NextResponse.json({
    ok: true,
    database: {
      provider: supabaseConfigured ? "supabase-postgres" : "in-memory-fallback",
      configured: supabaseConfigured,
      reachable: supabaseReachable,
    },
    ai: {
      provider: process.env.GEMINI_API_KEY
        ? "google-gemini"
        : process.env.GROQ_API_KEY
        ? "groq"
        : "template-fallback",
      configured: isLlmConfigured(),
    },
    voice: {
      provider:
        process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION
          ? "azure-neural-with-webspeech-fallback"
          : "browser-webspeech-only",
      azure_configured: Boolean(process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION),
      punjabi_note: "Punjabi text uses Pakistani Urdu (ur-PK) voice; no native Shahmukhi neural voice is claimed.",
    },
  });
}
