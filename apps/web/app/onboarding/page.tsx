"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Shield,
  Volume2,
  Sliders,
  Check,
  ArrowRight,
  ArrowLeft,
  Lock,
  Languages,
  Heart,
  HelpCircle,
  Zap,
  Anchor,
  Play,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { Switch } from "@/components/primitives/Switch";
import { Slider } from "@/components/primitives/Slider";
import { Badge } from "@/components/primitives/Badge";
import { prototypeService } from "@/lib/prototype-service";

const VOICE_OPTIONS = [
  {
    id: "voice_sanctuary_calm",
    name: "Sanctuary Calm",
    accent: "Neutral American",
    tone: "Deliberate, low-pitch, steady cadence",
    sampleText: "Welcome to this space. Notice your shoulders, and give yourself permission to simply be.",
  },
  {
    id: "voice_aurora_warm",
    name: "Aurora Warm",
    accent: "Gentle British",
    tone: "Warm, empathetic, resonant cadence",
    sampleText: "I am listening with you. There is no rush, and nothing you have to prove here.",
  },
  {
    id: "voice_atlas_ground",
    name: "Atlas Ground",
    accent: "Deep Continental",
    tone: "Deep, soothing, anchored bass tone",
    sampleText: "Take a slow breath. Whatever feels complicated today can wait for your energy tomorrow.",
  },
  {
    id: "voice_serene_willow",
    name: "Serene Willow",
    accent: "Australian Soft",
    tone: "Light, airy, mindful presence",
    sampleText: "Notice the rhythm of your breath as we step into this quiet moment together.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [name, setName] = useState("Elena Vance");
  const [storeConversations, setStoreConversations] = useState(true);
  const [deriveMemory, setDeriveMemory] = useState(true);
  const [voiceProcessing, setVoiceProcessing] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("voice_sanctuary_calm");
  const [selectedLang, setSelectedLang] = useState("en");
  const [toneMode, setToneMode] = useState<"grounding" | "warm" | "concise" | "inquisitive">("grounding");
  const [warmthLevel, setWarmthLevel] = useState(85);
  const [pacing, setPacing] = useState(90);
  const [activeVoicePlaying, setActiveVoicePlaying] = useState<string | null>(null);

  const playVoiceSample = (id: string) => {
    setActiveVoicePlaying(id);
    setTimeout(() => setActiveVoicePlaying(null), 2500);
  };

  const handleFinishOnboarding = () => {
    const state = prototypeService.getState();
    state.user.name = name;
    state.user.preferredName = name.split(" ")[0];
    state.user.language = selectedLang;
    state.user.direction = selectedLang === "ar" ? "rtl" : "ltr";
    state.consent.storeConversations = storeConversations;
    state.consent.deriveLongTermMemory = deriveMemory;
    state.consent.voiceAudioProcessing = voiceProcessing;
    state.companionConfig.voiceId = selectedVoice;
    state.companionConfig.toneMode = toneMode;
    state.companionConfig.warmthLevel = warmthLevel / 100;
    state.companionConfig.pacing = pacing / 100;
    prototypeService.saveState(state);

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-midnight-950 text-ivory-100 flex flex-col justify-center items-center p-4 sm:p-8">
      {/* Container */}
      <div className="max-w-xl w-full bg-midnight-900/90 border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Step Progress Tracker */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-breathe" />
            <span className="text-xs font-mono uppercase tracking-wider text-teal-300">
              InnerOS Sanctuary Setup &bull; Step {step} of 4
            </span>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {step === 1 && "Welcome"}
            {step === 2 && "Privacy Consent"}
            {step === 3 && "Voice & Language"}
            {step === 4 && "Personality"}
          </span>
        </div>

        {/* STEP 1: WELCOME & FIRST IMPRESSION */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-teal-400 uppercase tracking-widest">
                First Impression
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-normal text-ivory-100 tracking-tight">
                Welcome to your emotional sanctuary.
              </h1>
              <p className="text-xs sm:text-sm text-ivory-300/90 leading-relaxed font-light">
                InnerOS is a non-clinical lifestyle companion designed to cultivate mental clarity, emotional equilibrium, and thoughtful reflection.
              </p>
            </div>

            {/* Non-clinical explicit disclosure */}
            <div className="p-4 rounded-2xl bg-midnight-950/80 border border-teal-800/30 text-xs text-ivory-300 space-y-2">
              <div className="flex items-center space-x-2 text-teal-400 font-medium">
                <Shield className="w-4 h-4" />
                <span>Our Ethical Non-Clinical Boundary</span>
              </div>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                InnerOS is not a licensed medical provider, does not offer psychiatric diagnosis, and does not replace human clinical therapy. It provides active empathetic listening, evidence-informed psychoeducation, and quiet reflection tools.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ivory-300">How would you like to be addressed?</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-midnight-950 border border-white/[0.1] text-ivory-100 text-sm px-4 py-2.5 focus:outline-none focus:border-teal-500"
                placeholder="Your name or pseudonym"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button size="md" variant="primary" onClick={() => setStep(2)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Continue to Privacy Consent
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: REGISTRATION & PRIVACY CONSENT */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-teal-400 uppercase tracking-widest">
                Sanctuary Computing
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-ivory-100 tracking-tight">
                Your agency. Your explicit consent.
              </h2>
              <p className="text-xs sm:text-sm text-ivory-300/90 leading-relaxed font-light">
                Unlike traditional advertising or surveillance apps, InnerOS never sells your data, trains public foundation models on your journals, or shares memories without permission.
              </p>
            </div>

            {/* Granular Consent Ledger Switches */}
            <div className="space-y-4 p-4 rounded-2xl bg-midnight-950 border border-white/[0.08]">
              <Switch
                label="Conversational Working Memory"
                description="Allows the companion to recall statements within your current session."
                checked={storeConversations}
                onChange={setStoreConversations}
              />
              <div className="border-t border-white/[0.06] pt-3">
                <Switch
                  label="Long-Term Life Graph Formation"
                  description="Derives salient personal habits and values with 1-click 'Forget Me' deletion (GDPR Art. 17)."
                  checked={deriveMemory}
                  onChange={setDeriveMemory}
                />
              </div>
              <div className="border-t border-white/[0.06] pt-3">
                <Switch
                  label="Streaming Voice Synthesis"
                  description="Processes audio frames for real-time speech. Raw audio buffers are discarded immediately."
                  checked={voiceProcessing}
                  onChange={setVoiceProcessing}
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-midnight-950/60 border border-white/[0.06] flex items-center space-x-2 text-[11px] text-zinc-400">
              <Lock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>All reflections stored using AES-256-GCM envelope encryption.</span>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button size="sm" variant="ghost" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
                Back
              </Button>
              <Button size="md" variant="primary" onClick={() => setStep(3)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Voice & Language
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: LANGUAGE & VOICE SELECTION */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-teal-400 uppercase tracking-widest">
                Acoustic Resonance
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-ivory-100 tracking-tight">
                Attune language & voice cadence.
              </h2>
              <p className="text-xs sm:text-sm text-ivory-300/90 leading-relaxed font-light">
                Select your preferred locale and companion auditory timbre. All voices are designed for low autonomic stress.
              </p>
            </div>

            {/* Language Selector (Includes RTL preview) */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ivory-300">Sanctuary Interface Language</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: "en", label: "English (US)" },
                  { code: "es", label: "Español" },
                  { code: "de", label: "Deutsch" },
                  { code: "fr", label: "Français" },
                  { code: "ja", label: "日本語" },
                  { code: "ar", label: "العربية (RTL)" },
                ].map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setSelectedLang(l.code)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                      selectedLang === l.code
                        ? "bg-teal-950 text-teal-200 border-teal-600 shadow-sm"
                        : "bg-midnight-950 text-zinc-400 border-white/[0.08] hover:text-white"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Cards with Auditory Sample Player */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-ivory-300">Companion Voice Timbre</label>
              <div className="space-y-2">
                {VOICE_OPTIONS.map((v) => {
                  const isSelected = selectedVoice === v.id;
                  const isPlaying = activeVoicePlaying === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVoice(v.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-teal-950/50 border-teal-600/70 shadow-sm"
                          : "bg-midnight-950/70 border-white/[0.06] hover:border-white/[0.12]"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-ivory-100">{v.name}</span>
                          <span className="text-[10px] font-mono text-zinc-400">{v.accent}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400">{v.tone}</p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playVoiceSample(v.id);
                        }}
                        className={`p-2 rounded-xl border text-xs flex items-center space-x-1.5 transition-colors ${
                          isPlaying
                            ? "bg-teal-500 text-white border-teal-400 animate-pulse"
                            : "bg-white/[0.05] hover:bg-white/[0.1] text-ivory-200 border-white/[0.08]"
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="text-[10px]">{isPlaying ? "Playing..." : "Sample"}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button size="sm" variant="ghost" onClick={() => setStep(2)} leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
                Back
              </Button>
              <Button size="md" variant="primary" onClick={() => setStep(4)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Personality Customization
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: COMPANION PERSONALITY CUSTOMIZATION */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-teal-400 uppercase tracking-widest">
                Personality & Pacing
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-ivory-100 tracking-tight">
                Calibrate conversational presence.
              </h2>
              <p className="text-xs sm:text-sm text-ivory-300/90 leading-relaxed font-light">
                Customize how InnerOS interacts with you. Choose your preferred tone and conversational speed.
              </p>
            </div>

            {/* Tone Presets */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: "grounding", name: "Grounding", icon: Anchor, desc: "Somatic, steady, calming presence" },
                { id: "warm", name: "Warm", icon: Heart, desc: "Deeply compassionate and validating" },
                { id: "concise", name: "Concise", icon: Zap, desc: "Clear, direct, and zero filler" },
                { id: "inquisitive", name: "Curious", icon: HelpCircle, desc: "Reflective inquiry & gentle questions" },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = toneMode === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setToneMode(t.id as any)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-teal-950/60 border-teal-600 text-teal-200 shadow-sm"
                        : "bg-midnight-950 border-white/[0.06] text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1.5 text-teal-400" />
                    <div className="font-semibold text-xs text-ivory-100">{t.name}</div>
                    <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">{t.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Warmth & Pacing Sliders */}
            <div className="space-y-4 p-4 rounded-2xl bg-midnight-950 border border-white/[0.08]">
              <Slider
                label="Empathic Warmth Level"
                value={warmthLevel}
                onChange={setWarmthLevel}
                valueDisplay={`${warmthLevel}%`}
              />
              <Slider
                label="Conversational Pacing (Deliberate to Brisk)"
                value={pacing}
                onChange={setPacing}
                valueDisplay={`${pacing}%`}
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button size="sm" variant="ghost" onClick={() => setStep(3)} leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
                Back
              </Button>
              <Button size="md" variant="primary" onClick={handleFinishOnboarding} rightIcon={<Check className="w-4 h-4" />}>
                Enter My Sanctuary
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
