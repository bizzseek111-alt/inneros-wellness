"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Volume2,
  Check,
  ArrowRight,
  ArrowLeft,
  Heart,
  HelpCircle,
  Zap,
  Anchor,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { Switch } from "@/components/primitives/Switch";
import { Slider } from "@/components/primitives/Slider";
import { prototypeService } from "@/lib/prototype-service";
import { api } from "@/lib/api-client";

const VOICE_OPTIONS = [
  {
    id: "voice_sanctuary_calm",
    name: "Sanctuary Calm",
    accent: "Neutral American",
    tone: "Steady, unhurried, and grounding",
  },
  {
    id: "voice_aurora_warm",
    name: "Aurora Warm",
    accent: "Gentle British",
    tone: "Warm, kind, and conversational",
  },
  {
    id: "voice_atlas_ground",
    name: "Atlas Ground",
    accent: "Deep Continental",
    tone: "Deep, soothing, and reassuring",
  },
  {
    id: "voice_serene_willow",
    name: "Serene Willow",
    accent: "Soft Australian",
    tone: "Light, airy, and peaceful",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [name, setName] = useState("Elena Vance");
  const [storeConversations, setStoreConversations] = useState(true);
  const [deriveMemory, setDeriveMemory] = useState(true);
  const [voiceProcessing, setVoiceProcessing] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState("voice_sanctuary_calm");
  const [selectedLang, setSelectedLang] = useState("en");
  const [toneMode, setToneMode] = useState<
    "grounding" | "warm" | "concise" | "inquisitive"
  >("grounding");
  const [warmthLevel, setWarmthLevel] = useState(85);
  const [pacing, setPacing] = useState(90);
  const [activeVoicePlaying, setActiveVoicePlaying] = useState<string | null>(
    null
  );

  const playVoiceSample = async (id: string) => {
    setActiveVoicePlaying(id);
    try {
      const res = await api.synthesizeSpeech({
        text: "Welcome to your calm sanctuary.",
        voiceId: id,
        language: selectedLang,
      });
      if (res.audio_base64 && typeof window !== "undefined") {
        const mime = res.format === "wav" ? "audio/wav" : "audio/mpeg";
        const audio = new Audio(`data:${mime};base64,${res.audio_base64}`);
        audio.play().catch(() => {});
      }
    } catch {
      // Offline fallback timer
    }
    setTimeout(() => setActiveVoicePlaying(null), 2200);
  };

  const handleFinishOnboarding = async () => {
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

    try {
      await api.updateConsentSettings({
        allow_memory_system: deriveMemory,
        is_memory_recording_paused: !storeConversations,
      });
      if (deriveMemory) {
        await api.createMemoryRecord({
          category: "communication_preferences",
          fact_statement: `Preferred name: ${name.trim()} | Tone style: ${toneMode} (Warmth ${warmthLevel}%, Pacing ${pacing}%)`,
          record_type: "stored_fact",
          status: "confirmed",
          emotional_valence: "positive",
          tags: ["onboarding", toneMode, selectedLang],
        });
      }
    } catch {
      // Local state already persisted if offline
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#263330] flex flex-col justify-center items-center p-4 sm:p-8">
      <div className="max-w-xl w-full bg-white border border-[#E6E0D6] rounded-3xl p-6 sm:p-10 shadow-md space-y-8">
        {/* Step Progress Tracker */}
        <div className="flex items-center justify-between border-b border-[#F3EFE8] pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-3 h-3 rounded-full bg-[#285B55]" />
            <span className="text-[14px] font-medium text-[#285B55]">
              Welcome Setup &bull; Step {step} of 4
            </span>
          </div>
          <span className="text-[14px] text-[#52625E]">
            {step === 1 && "Introduction"}
            {step === 2 && "Your Privacy"}
            {step === 3 && "Voice & Language"}
            {step === 4 && "Companion Style"}
          </span>
        </div>

        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[14px] font-medium text-[#285B55] flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4" />
                <span>A Quiet Space for Your Mind</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#263330]">
                Welcome to InnerOS
              </h1>
              <p className="text-[16px] text-[#52625E] leading-relaxed">
                InnerOS is a calm, supportive AI companion designed for everyday reflection, talking through busy thoughts, and keeping gentle routines.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#E8F1EB] border border-[#CFE2D6] space-y-1.5">
              <div className="flex items-center space-x-2 text-[#285B55] font-semibold text-[15px]">
                <Shield className="w-4 h-4" />
                <span>Important to Know</span>
              </div>
              <p className="text-[#263330] leading-relaxed text-[14px]">
                InnerOS is an AI companion for personal reflection and wellbeing—not a medical provider or human therapist.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[15px] font-medium text-[#263330] block">
                What name should your companion call you?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl bg-[#FAF8F4] border border-[#D5CFC2] text-[#263330] text-[16px] px-4 py-3 focus:outline-none focus:border-[#285B55]"
                placeholder="Your name or nickname"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                size="md"
                variant="primary"
                onClick={() => setStep(2)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: PRIVACY CHOICES */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#263330]">
                You’re in Control of Your Privacy
              </h2>
              <p className="text-[15px] text-[#52625E] leading-relaxed">
                Choose how you want your companion to remember things. You can change these settings or delete your memories at any time.
              </p>
            </div>

            <div className="space-y-4 p-5 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6]">
              <Switch
                label="Remember Current Conversation"
                description="Allows your companion to follow the context of your current chat."
                checked={storeConversations}
                onChange={setStoreConversations}
              />
              <div className="border-t border-[#E6E0D6] pt-4">
                <Switch
                  label="Suggest Helpful Things to Remember"
                  description="Suggests goals, habits, or preferences from your chats so you can approve or dismiss them."
                  checked={deriveMemory}
                  onChange={setDeriveMemory}
                />
              </div>
              <div className="border-t border-[#E6E0D6] pt-4">
                <Switch
                  label="Enable Voice Conversations"
                  description="Allows you to talk out loud with your companion whenever you choose."
                  checked={voiceProcessing}
                  onChange={setVoiceProcessing}
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setStep(1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                size="md"
                variant="primary"
                onClick={() => setStep(3)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next: Voice & Language
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: LANGUAGE & VOICE */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#263330]">
                Choose Your Language & Voice
              </h2>
              <p className="text-[15px] text-[#52625E] leading-relaxed">
                Pick the language and voice tone that feel most comfortable to listen to.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-medium text-[#263330] block">
                Preferred Language
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { code: "en", label: "English" },
                  { code: "es", label: "Español" },
                  { code: "de", label: "Deutsch" },
                  { code: "fr", label: "Français" },
                  { code: "bg", label: "Български" },
                  { code: "ar", label: "العربية" },
                ].map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setSelectedLang(l.code)}
                    className={`px-3.5 py-2.5 rounded-xl text-[14px] font-medium border transition-all ${
                      selectedLang === l.code
                        ? "bg-[#285B55] text-white border-[#285B55] shadow-sm"
                        : "bg-[#FAF8F4] text-[#52625E] border-[#E6E0D6] hover:text-[#263330]"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-medium text-[#263330] block">
                Companion Voice
              </label>
              <div className="space-y-2.5">
                {VOICE_OPTIONS.map((v) => {
                  const isSelected = selectedVoice === v.id;
                  const isPlaying = activeVoicePlaying === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVoice(v.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-[#E8F1EB] border-[#285B55] shadow-sm"
                          : "bg-[#FAF8F4] border-[#E6E0D6] hover:border-[#285B55]/40"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-[15px] font-semibold text-[#263330]">
                            {v.name}
                          </span>
                          <span className="text-[13px] text-[#52625E]">
                            &bull; {v.accent}
                          </span>
                        </div>
                        <p className="text-[13.5px] text-[#52625E]">{v.tone}</p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playVoiceSample(v.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-[13px] font-medium flex items-center space-x-1.5 transition-colors ${
                          isPlaying
                            ? "bg-[#285B55] text-white border-[#285B55]"
                            : "bg-white hover:bg-[#F3EFE8] text-[#263330] border-[#D5CFC2]"
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>{isPlaying ? "Playing..." : "Preview"}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setStep(2)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                size="md"
                variant="primary"
                onClick={() => setStep(4)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next: Conversation Style
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: CONVERSATION STYLE */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#263330]">
                How Should Your Companion Respond?
              </h2>
              <p className="text-[15px] text-[#52625E] leading-relaxed">
                Pick the conversational style that feels most natural to you.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  id: "grounding",
                  name: "Calm & Grounding",
                  icon: Anchor,
                  desc: "Steady, unhurried, and reassuring",
                },
                {
                  id: "warm",
                  name: "Warm & Kind",
                  icon: Heart,
                  desc: "Empathetic, gentle, and encouraging",
                },
                {
                  id: "concise",
                  name: "Clear & Simple",
                  icon: Zap,
                  desc: "Short, practical, and easy to read",
                },
                {
                  id: "inquisitive",
                  name: "Thoughtful Questions",
                  icon: HelpCircle,
                  desc: "Helps you explore ideas with gentle prompts",
                },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = toneMode === t.id;
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setToneMode(t.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-[#E8F1EB] border-[#285B55] text-[#263330] shadow-sm"
                        : "bg-[#FAF8F4] border-[#E6E0D6] text-[#52625E] hover:border-[#285B55]/40"
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-2 text-[#285B55]" />
                    <div className="font-semibold text-[15px] text-[#263330]">
                      {t.name}
                    </div>
                    <p className="text-[13px] text-[#52625E] mt-0.5 leading-snug">
                      {t.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="space-y-4 p-5 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6]">
              <Slider
                label="Warmth Level"
                value={warmthLevel}
                onChange={setWarmthLevel}
                valueDisplay={`${warmthLevel}%`}
              />
              <Slider
                label="Conversation Pace (Relaxed to Brisk)"
                value={pacing}
                onChange={setPacing}
                valueDisplay={`${pacing}%`}
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setStep(3)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                size="md"
                variant="primary"
                onClick={handleFinishOnboarding}
                rightIcon={<Check className="w-4 h-4" />}
              >
                Finish & Go Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
