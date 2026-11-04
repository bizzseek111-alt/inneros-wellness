"use client";

import React, { useState } from "react";
import { Eye, Type, Volume2, Sparkles, Check, Sun, Shield } from "lucide-react";
import { YouthShell } from "@/components/youth/YouthShell";
import { useYouth } from "@/components/youth/YouthContext";

export default function AccessibilitySettingsPage() {
  const {
    isLowStimulation,
    toggleLowStimulation,
    isHighContrast,
    toggleHighContrast,
    isReducedMotion,
    toggleReducedMotion,
    fontSize,
    setFontSize,
    isDyslexicFont,
    toggleDyslexicFont,
    isAudioMuted,
    toggleAudioMute,
  } = useYouth();

  const [announcementMsg, setAnnouncementMsg] = useState("");

  const testScreenReader = () => {
    setAnnouncementMsg("Screen reader live announcement verified: InnerOS Youth accessibility features active.");
    setTimeout(() => setAnnouncementMsg(""), 4000);
  };

  return (
    <YouthShell
      activeScreen="accessibility"
      title="Accessibility & Sensory Comfort"
      subtitle="Tailor visual contrast, motion, sound, and fonts for your personal neurotype."
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Screen Reader Live Region */}
        <div role="status" aria-live="polite" className="sr-only">
          {announcementMsg}
        </div>

        <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-6">
          <h3 className="text-xl font-extrabold text-[#0F172A]">Sensory Preferences</h3>

          <div className="space-y-4">
            {/* Low Stimulation */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F9F5EA]">
              <div>
                <span className="font-extrabold text-sm text-[#0F172A] block">Low-Stimulation Mode</span>
                <span className="text-xs text-[#718096]">Soft warm grays, reduces sensory overload and bright saturation</span>
              </div>
              <input
                type="checkbox"
                checked={isLowStimulation}
                onChange={toggleLowStimulation}
                className="w-5 h-5 accent-[#0E87E3] rounded cursor-pointer"
              />
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F9F5EA]">
              <div>
                <span className="font-extrabold text-sm text-[#0F172A] block">High Contrast Mode</span>
                <span className="text-xs text-[#718096]">Sharper borders, enhanced black-on-white text ratios</span>
              </div>
              <input
                type="checkbox"
                checked={isHighContrast}
                onChange={toggleHighContrast}
                className="w-5 h-5 accent-[#0E87E3] rounded cursor-pointer"
              />
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F9F5EA]">
              <div>
                <span className="font-extrabold text-sm text-[#0F172A] block">Reduced Motion</span>
                <span className="text-xs text-[#718096]">Pauses glowing animations and rotating mascots</span>
              </div>
              <input
                type="checkbox"
                checked={isReducedMotion}
                onChange={toggleReducedMotion}
                className="w-5 h-5 accent-[#0E87E3] rounded cursor-pointer"
              />
            </div>

            {/* Dyslexia-Friendly Font */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F9F5EA]">
              <div>
                <span className="font-extrabold text-sm text-[#0F172A] block">Dyslexia-Friendly Font</span>
                <span className="text-xs text-[#718096]">Specialized weighted letterforms and generous spacing</span>
              </div>
              <input
                type="checkbox"
                checked={isDyslexicFont}
                onChange={toggleDyslexicFont}
                className="w-5 h-5 accent-[#0E87E3] rounded cursor-pointer"
              />
            </div>

            {/* Audio Prompts */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F9F5EA]">
              <div>
                <span className="font-extrabold text-sm text-[#0F172A] block">Voice Prompts & Sound Cues</span>
                <span className="text-xs text-[#718096]">Read titles and cards aloud automatically</span>
              </div>
              <input
                type="checkbox"
                checked={!isAudioMuted}
                onChange={toggleAudioMute}
                className="w-5 h-5 accent-[#0E87E3] rounded cursor-pointer"
              />
            </div>

            {/* Font Scale Buttons */}
            <div className="p-4 rounded-2xl bg-[#F9F5EA] space-y-2">
              <span className="font-extrabold text-sm text-[#0F172A] block">Display Text Size</span>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold text-center">
                <button
                  onClick={() => setFontSize("normal")}
                  className={`py-2 rounded-xl border ${
                    fontSize === "normal"
                      ? "bg-white text-[#0E87E3] border-[#0E87E3] shadow-xs"
                      : "bg-[#FFFDF9] text-[#718096] border-[#E2E8F0]"
                  }`}
                >
                  Standard (16px)
                </button>
                <button
                  onClick={() => setFontSize("large")}
                  className={`py-2 rounded-xl border ${
                    fontSize === "large"
                      ? "bg-white text-[#0E87E3] border-[#0E87E3] shadow-xs"
                      : "bg-[#FFFDF9] text-[#718096] border-[#E2E8F0]"
                  }`}
                >
                  Large (18px)
                </button>
                <button
                  onClick={() => setFontSize("extra-large")}
                  className={`py-2 rounded-xl border ${
                    fontSize === "extra-large"
                      ? "bg-white text-[#0E87E3] border-[#0E87E3] shadow-xs"
                      : "bg-[#FFFDF9] text-[#718096] border-[#E2E8F0]"
                  }`}
                >
                  Extra Large (20px)
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={testScreenReader}
              className="px-4 py-2 rounded-full border border-[#CBD5E1] bg-white text-xs font-bold text-[#4A5568] hover:bg-[#FDFBF4]"
            >
              Test Screen Reader Announcement
            </button>
          </div>
        </div>
      </div>
    </YouthShell>
  );
}
