/**
 * Weebly Central Public Claims & Verification Registry
 *
 * This registry acts as the single source of truth for all public capability claims,
 * ensuring marketing, documentation, and interface copy remain strictly aligned with
 * tested technical evidence, regulatory compliance, and non-clinical ethics.
 */

export interface PublicClaim {
  id: string;
  category: "curriculum" | "voice_ai" | "safety" | "privacy" | "clinical_boundary";
  advertisedHeadline: string;
  reconciledStatus: "verified" | "verified_with_caveats" | "fictional_demo";
  reconciledFactualStatement: string;
  evidenceReference: string;
  caveatNotes?: string;
}

export const CENTRAL_CLAIMS_REGISTRY: PublicClaim[] = [
  {
    id: "curriculum_3000_questions",
    category: "curriculum",
    advertisedHeadline: "3,000-Question Curriculum Repository",
    reconciledStatus: "verified_with_caveats",
    reconciledFactualStatement:
      "Structured repository of 3,000 curriculum questions across 9 developmental categories. The school pilot active pool includes 126 published lessons, 369 expert-reviewed modules, and 2,505 drafted questions mapped to 4 core pilot subjects (Math, General Science, English, Urdu).",
    evidenceReference: "apps/web/lib/question-bank-manifest.json",
    caveatNotes:
      "Avoid phrasing as '3,000 approved questions in production'; state '3,000-question curriculum repository with 126 published pilot questions and 369 reviewed modules'.",
  },
  {
    id: "voice_latency_280ms",
    category: "voice_ai",
    advertisedHeadline: "Sub-300ms Conversational Latency",
    reconciledStatus: "verified_with_caveats",
    reconciledFactualStatement:
      "Target latency achieved via OpenAI Realtime WebRTC streaming on high-speed networks. The system provides graceful fallback to ElevenLabs neural speech and instant local browser Web Speech API.",
    evidenceReference: "apps/web/lib/voice-synthesizer.ts",
    caveatNotes:
      "Network conditions and geographical distance from edge servers can affect cloud streaming; local Web Speech fallback provides zero-network speech output.",
  },
  {
    id: "punjabi_voice_localization",
    category: "voice_ai",
    advertisedHeadline: "Multilingual Voice Support (English, Urdu, Pakistani Punjabi)",
    reconciledStatus: "verified_with_caveats",
    reconciledFactualStatement:
      "Full Shahmukhi Punjabi UI text, audio scripts, and cartoon voice prompts are supported. Speech synthesis uses Pakistani Urdu neural phonemes (`ur-PK`) when native Pakistani Punjabi speech models are unavailable in the client environment.",
    evidenceReference: "apps/web/lib/voice-synthesizer.ts lines 80-110",
    caveatNotes:
      "Transparently disclose that browser speech synthesis falls back to Urdu neural voice for Punjabi text.",
  },
  {
    id: "clinical_oversight_boundary",
    category: "clinical_boundary",
    advertisedHeadline: "Clinician Portal & Professional Oversight",
    reconciledStatus: "fictional_demo",
    reconciledFactualStatement:
      "Demonstration clinician profiles (such as Dr. Sarah Jenkins) and case histories in the public portal are synthetic demonstration fixtures for stakeholder evaluation. In live operations, clinical notes are authored exclusively by licensed human professionals; Weebly AI companions NEVER generate psychiatric diagnoses or clinical pathology scores.",
    evidenceReference: "apps/web/app/professional/portal/page.tsx",
    caveatNotes:
      "Public demonstrations must always clearly label clinician profiles as simulated.",
  },
  {
    id: "data_privacy_envelope_encryption",
    category: "privacy",
    advertisedHeadline: "Envelope Encryption & Zero-PII Child Architecture",
    reconciledStatus: "verified",
    reconciledFactualStatement:
      "Child learning events use pseudonymous identifiers with zero legal names, credit cards, or raw voice recordings stored on servers. Client-side memory items support WebCrypto AES-256-GCM envelope encryption with per-user key derivation.",
    evidenceReference: "apps/web/components/memory/MemoryDrawer.tsx & apps/api/app/db/models.py",
  },
  {
    id: "safeguarding_caregiver_harm_exception",
    category: "safety",
    advertisedHeadline: "Caregiver Harm Alert Exception & Non-Silence Safety Circuit",
    reconciledStatus: "verified",
    reconciledFactualStatement:
      "When distress or endangerment is reported, Weebly speaks reassuring calming words aloud via Web Speech rather than muting, provides instant hotline access (CPWB 1121, Rescue 1122, Umang), and actively suppresses parental notification if the disclosure concerns a primary caregiver to prevent domestic retaliation.",
    evidenceReference: "apps/web/app/child-safety/page.tsx & apps/web/app/technology/page.tsx",
  },
];
