"use client";

import React, { useState } from "react";
import { Globe, Volume2, CheckCircle2, ArrowRight } from "lucide-react";
import { YouthShell } from "@/components/youth/YouthShell";
import { useYouth } from "@/components/youth/YouthContext";
import { YOUTH_LOCALES, YouthLocale } from "@/lib/youth-i18n";

export default function LanguageSelectionPage() {
  const { locale, setLocale, localeMeta } = useYouth();
  const [playingLocale, setPlayingLocale] = useState<string | null>(null);

  const sampleGreetings: Record<YouthLocale, string> = {
    en: "Hello friend! I am Lumi. How are you feeling today?",
    ur: "ہیلو دوست! میں لومی ہوں۔ آج آپ کیسا محسوس کر رہے ہیں؟",
    pa: "سلام جی! میں لومی آں۔ اج تواڈا دل کیویں اے؟",
    "ur-Latn": "Hello dost! Main Lumi hoon. Aaj aap kaisa mehsoos kar rahe hain?",
  };

  const playVoiceSample = (loc: YouthLocale) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text = sampleGreetings[loc];
      const u = new SpeechSynthesisUtterance(text);
      u.lang = loc === "ur" || loc === "pa" ? "ur-PK" : "en-US";
      u.rate = 0.9;
      u.pitch = 1.1;
      u.onstart = () => setPlayingLocale(loc);
      u.onend = () => setPlayingLocale(null);
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <YouthShell
      activeScreen="language"
      title="Language & Multilingual Voice"
      subtitle="Full support for English, Urdu, Pakistani Punjabi (Shahmukhi), and Roman Urdu with native typography."
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-[#0F172A]">
              Choose Your Companion Language
            </h3>
            <p className="text-sm text-[#718096]">
              Selecting Urdu or Shahmukhi Punjabi automatically activates bidirectional RTL layout and high-legibility Nastaliq typography.
            </p>
          </div>

          <div className="space-y-3">
            {(Object.keys(YOUTH_LOCALES) as YouthLocale[]).map((loc) => {
              const meta = YOUTH_LOCALES[loc];
              const isSelected = locale === loc;
              return (
                <div
                  key={loc}
                  onClick={() => setLocale(loc)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-[#E0F1FE] border-[#0E87E3] shadow-xs"
                      : "bg-[#FFFDF9] border-[#E2E8F0] hover:border-[#CBD5E1]"
                  }`}
                >
                  <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                        isSelected
                          ? "bg-[#0E87E3] border-[#0E87E3] text-white"
                          : "border-[#CBD5E1] bg-white"
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="font-extrabold text-base text-[#0F172A] block">
                        {meta.nativeName} ({meta.label})
                      </span>
                      <span className="text-xs text-[#718096] block">
                        Script: {meta.script} &bull; Direction: {meta.dir.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playVoiceSample(loc);
                    }}
                    className="p-2.5 rounded-xl border border-[#CBD5E1] bg-white text-[#0E87E3] hover:bg-[#FDFBF4] transition-colors"
                    title="Play voice preview sample"
                  >
                    <Volume2 className={`w-4 h-4 ${playingLocale === loc ? "animate-bounce" : ""}`} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#F2EBD7] text-xs text-[#4A5568] space-y-1">
            <span className="font-bold text-[#0F172A] block">Active Preview:</span>
            <p className="text-sm font-bold text-[#0E87E3] italic" dir={localeMeta.dir}>
              &ldquo;{sampleGreetings[locale]}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </YouthShell>
  );
}
