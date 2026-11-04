"use client";

import React, { useState } from "react";
import { Smile, Sparkles, Wind, Heart, Shield, RefreshCw } from "lucide-react";
import { YouthShell } from "@/components/youth/YouthShell";
import { FeelingsWheel } from "@/components/youth/FeelingsWheel";
import { LumiMascot } from "@/components/youth/LumiMascot";

export default function EmotionLearningCenterPage() {
  const [activeStrategy, setActiveStrategy] = useState<string>("dragon");

  const copingStrategies = [
    {
      id: "dragon",
      title: "Dragon Breath",
      urduTitle: "ڈریکن والی گہری سانس",
      description: "Deep breath in through your nose, then open wide and blow out long and soft like breathing gentle fire.",
      icon: "🐉",
      color: "bg-[#FFF7F2] border-[#FFD9C7] text-[#6B240E]",
    },
    {
      id: "grounding",
      title: "5-4-3-2-1 Grounding",
      urduTitle: "حواس خمسہ کا دھیان",
      description: "Notice 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 kind thought.",
      icon: "👀",
      color: "bg-[#F0F8FF] border-[#B9E2FE] text-[#0C436F]",
    },
    {
      id: "turtle",
      title: "The Patient Turtle",
      urduTitle: "کچھوے کی طرح سنبھلنا",
      description: "Pull your shoulders into your safe shell, take 3 slow heartbeats, and slowly step back out.",
      icon: "🐢",
      color: "bg-[#F2FAF6] border-[#C4EDD6] text-[#154D32]",
    },
    {
      id: "butterfly",
      title: "Butterfly Hug",
      urduTitle: "تتلی والی گلے ملنا",
      description: "Cross your hands over your chest and alternate tapping your shoulders gently like butterfly wings.",
      icon: "🦋",
      color: "bg-[#FAF7FD] border-[#D3B9ED] text-[#43256A]",
    },
  ];

  return (
    <YouthShell
      activeScreen="emotions"
      title="Emotion Learning Center"
      subtitle="Discovering what our feelings tell us and how to help our bodies stay calm and safe."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Feelings Wheel Section */}
        <FeelingsWheel />

        {/* Coping Strategies Deck */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-[#0F172A]">
              Somatic Coping Flashcards
            </h3>
            <p className="text-sm text-[#718096]">
              Simple exercises children can do in school, at home, or before bed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {copingStrategies.map((strat) => (
              <div
                key={strat.id}
                onClick={() => setActiveStrategy(strat.id)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  strat.color
                } ${activeStrategy === strat.id ? "ring-4 ring-[#0E87E3] scale-101 shadow-sm" : "hover:scale-101"}`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-3xl">{strat.icon}</span>
                  <div>
                    <h4 className="font-extrabold text-base text-[#0F172A]">{strat.title}</h4>
                    <span className="text-xs font-semibold text-[#718096]" dir="rtl">
                      {strat.urduTitle}
                    </span>
                  </div>
                </div>
                <p className="text-xs font-medium text-[#4A5568] leading-relaxed">
                  {strat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </YouthShell>
  );
}
