"use client";

import React, { useState } from "react";
import { Layers, MessageSquare, Sparkles, VolumeX, Shield, HeartHandshake, CheckCircle2 } from "lucide-react";
import { YouthShell } from "@/components/youth/YouthShell";
import { VisualScheduleCard } from "@/components/youth/VisualScheduleCard";

interface CommunicationCard {
  id: string;
  icon: string;
  textEn: string;
  textUr: string;
  category: "sensory" | "need" | "social";
}

const CARDS: CommunicationCard[] = [
  { id: "c1", icon: "🎧", textEn: "Too loud. I need quiet headphones.", textUr: "شور زیادہ ہے۔ مجھے خاموشی چاہیے۔", category: "sensory" },
  { id: "c2", icon: "🛑", textEn: "I need 5 minutes of quiet time.", textUr: "مجھے ۵ منٹ کا پرسکون وقفہ چاہیے۔", category: "sensory" },
  { id: "c3", icon: "💧", textEn: "I need a drink of water.", textUr: "مجھے پانی پینا ہے۔", category: "need" },
  { id: "c4", icon: "🫂", textEn: "I need a gentle hug from my trusted adult.", textUr: "مجھے تسلی اور پیار چاہیے۔", category: "need" },
  { id: "c5", icon: "🤝", textEn: "I am ready to rejoin the group now.", textUr: "میں اب سب کے ساتھ شامل ہو سکتا ہوں۔", category: "social" },
  { id: "c6", icon: "⏳", textEn: "Can I please have a turn next?", textUr: "کیا اس کے بعد میری باری آ سکتی ہے؟", category: "social" },
];

export default function VisualSupportToolsPage() {
  const [selectedCard, setSelectedCard] = useState<CommunicationCard | null>(null);

  const speakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <YouthShell
      activeScreen="visual_tools"
      title="Autism-Friendly Visual Supports"
      subtitle="Structured visual tools, First-Then schedules, and tap-to-speak communication cards."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* First / Then Schedule Component */}
        <VisualScheduleCard />

        {/* Non-Verbal Tap-to-Speak Communication Cards */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-[#0F172A]">
              Tap-to-Speak Communication Cards
            </h3>
            <p className="text-sm text-[#718096]">
              When words feel hard or exhausting to speak aloud, tap a card to express your need.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CARDS.map((card) => {
              const isSelected = selectedCard?.id === card.id;
              return (
                <button
                  key={card.id}
                  onClick={() => {
                    setSelectedCard(card);
                    speakText(card.textEn);
                  }}
                  className={`p-5 rounded-2xl border-2 text-start transition-all flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? "bg-[#E0F1FE] border-[#0E87E3] ring-4 ring-[#0E87E3]/20 shadow-sm"
                      : "bg-[#FFFDF9] border-[#E2E8F0] hover:border-[#B9E2FE]"
                  }`}
                >
                  <span className="text-4xl">{card.icon}</span>
                  <div>
                    <span className="font-bold text-sm text-[#0F172A] block leading-snug">
                      {card.textEn}
                    </span>
                    <span className="text-xs font-medium text-[#718096] block mt-1" dir="rtl">
                      {card.textUr}
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0E87E3] block">
                    Tap to voice
                  </span>
                </button>
              );
            })}
          </div>

          {selectedCard && (
            <div className="p-4 rounded-2xl bg-[#E3F6EC] border border-[#C4EDD6] text-xs font-bold text-[#154D32] flex items-center justify-between animate-fade-in">
              <span>Card Voiced: &ldquo;{selectedCard.textEn}&rdquo;</span>
              <button
                onClick={() => speakText(selectedCard.textEn)}
                className="underline hover:text-black"
              >
                Voice again
              </button>
            </div>
          )}
        </div>
      </div>
    </YouthShell>
  );
}
