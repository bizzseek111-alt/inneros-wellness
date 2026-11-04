"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Shield, Sparkles, Smile, Volume2, VolumeX, Eye } from "lucide-react";
import { LumiMascot } from "@/components/youth/LumiMascot";
import { useYouth } from "@/components/youth/YouthContext";
import { YouthAgeTier } from "@/design-system/tokens";

export default function YouthOnboardingPage() {
  const router = useRouter();
  const { ageTier, setAgeTier, localeMeta, isLowStimulation, toggleLowStimulation, isAudioMuted, toggleAudioMute } = useYouth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [nickname, setNickname] = useState("");
  const [companionVibe, setCompanionVibe] = useState<"calm" | "playful" | "storyteller">("calm");

  const handleNext = () => {
    if (step < 3) {
      setStep((step + 1) as any);
    } else {
      router.push("/youth/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1A202C] px-4 py-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl mx-auto space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-between text-xs font-bold text-[#718096] px-2">
          <Link href="/youth" className="flex items-center space-x-1 text-[#0E87E3] hover:underline">
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>Back</span>
          </Link>
          <span>Step {step} of 3</span>
        </div>

        <div className="w-full h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
          <div
            className="h-full bg-[#0E87E3] transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Step 1: Age Group Selection */}
        {step === 1 && (
          <div className="p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-6 text-center animate-fade-in">
            <LumiMascot size="md" state="idle" className="mx-auto" />
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-[#0F172A]">Welcome! How old are you?</h1>
              <p className="text-sm text-[#718096]">
                This helps us tune the words, activities, and safety rules for you.
              </p>
            </div>

            <div className="space-y-3 text-start">
              <button
                onClick={() => setAgeTier("little")}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  ageTier === "little"
                    ? "bg-[#FFF7F2] border-[#FF8E68] text-[#0F172A] font-bold shadow-xs"
                    : "bg-[#FFFDF9] border-[#E2E8F0] text-[#4A5568]"
                }`}
              >
                <div>
                  <span className="text-base block font-bold">Ages 2–5 &bull; Little Explorers</span>
                  <span className="text-xs text-[#718096]">Bedtime tales, caregiver co-play, and audio songs</span>
                </div>
                {ageTier === "little" && <Check className="w-5 h-5 text-[#FF8E68]" />}
              </button>

              <button
                onClick={() => setAgeTier("junior")}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  ageTier === "junior"
                    ? "bg-[#F0F8FF] border-[#38A8F8] text-[#0F172A] font-bold shadow-xs"
                    : "bg-[#FFFDF9] border-[#E2E8F0] text-[#4A5568]"
                }`}
              >
                <div>
                  <span className="text-base block font-bold">Ages 6–12 &bull; Junior Adventurers</span>
                  <span className="text-xs text-[#718096]">Interactive voice, feelings wheel, stories, and visual tools</span>
                </div>
                {ageTier === "junior" && <Check className="w-5 h-5 text-[#0E87E3]" />}
              </button>

              <button
                onClick={() => setAgeTier("teen")}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  ageTier === "teen"
                    ? "bg-[#FAF7FD] border-[#9868CE] text-[#0F172A] font-bold shadow-xs"
                    : "bg-[#FFFDF9] border-[#E2E8F0] text-[#4A5568]"
                }`}
              >
                <div>
                  <span className="text-base block font-bold">Ages 13–18 &bull; Youth Sanctuary</span>
                  <span className="text-xs text-[#718096]">Private reflections, life skills, boundary setting, and autonomy</span>
                </div>
                {ageTier === "teen" && <Check className="w-5 h-5 text-[#9868CE]" />}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Name & Companion Tone */}
        {step === 2 && (
          <div className="p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-6 text-center animate-fade-in">
            <LumiMascot size="md" state="speaking" className="mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#0F172A]">What should Lumi call you?</h2>
              <p className="text-sm text-[#718096]">
                You can use a nickname or any friendly name you like.
              </p>
            </div>

            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Sunny or Star"
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-[#CBD5E1] text-center text-lg font-bold text-[#0F172A] focus:outline-none focus:border-[#0E87E3]"
            />

            <div className="space-y-2 text-start">
              <span className="text-xs font-bold uppercase tracking-wider text-[#718096]">
                Choose how Lumi communicates:
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold text-center">
                {(["calm", "playful", "storyteller"] as const).map((vibe) => (
                  <button
                    key={vibe}
                    onClick={() => setCompanionVibe(vibe)}
                    className={`py-3 rounded-xl border-2 capitalize transition-all ${
                      companionVibe === vibe
                        ? "bg-[#E0F1FE] border-[#0E87E3] text-[#0C436F]"
                        : "bg-[#FFFDF9] border-[#E2E8F0] text-[#4A5568]"
                    }`}
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Sensory Comfort Settings */}
        {step === 3 && (
          <div className="p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-6 text-center animate-fade-in">
            <LumiMascot size="md" state="calming" className="mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#0F172A]">Sensory Comfort Preferences</h2>
              <p className="text-sm text-[#718096]">
                Make this space feel just right for your eyes and ears.
              </p>
            </div>

            <div className="space-y-3 text-start">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F9F5EA]">
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-[#0E87E3]" />
                  <div>
                    <span className="text-sm font-bold text-[#0F172A] block">Low Stimulation Mode</span>
                    <span className="text-xs text-[#718096]">Warm muted tones, no bright colors</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isLowStimulation}
                  onChange={toggleLowStimulation}
                  className="w-5 h-5 accent-[#0E87E3] rounded-md cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F9F5EA]">
                <div className="flex items-center space-x-3">
                  {isAudioMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
                  <div>
                    <span className="text-sm font-bold text-[#0F172A] block">Audio Voice Prompts</span>
                    <span className="text-xs text-[#718096]">Read stories and directions aloud</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={!isAudioMuted}
                  onChange={toggleAudioMute}
                  className="w-5 h-5 accent-[#0E87E3] rounded-md cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 text-start flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>You can adjust these anytime in Accessibility Settings.</span>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-full bg-[#0E87E3] hover:bg-[#0C436F] text-white font-extrabold text-base transition-all shadow-md flex items-center justify-center space-x-2"
        >
          <span>{step === 3 ? "Enter Sanctuary" : "Next Step"}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}
