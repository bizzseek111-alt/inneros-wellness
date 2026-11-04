"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Smile, Sparkles, Wind, Heart, Shield, RefreshCw, Compass } from "lucide-react";
import { YouthShell } from "@/components/youth/YouthShell";
import { FeelingsWheel } from "@/components/youth/FeelingsWheel";
import { LumiMascot } from "@/components/youth/LumiMascot";
import { LifeSkillsMissions } from "@/components/youth/LifeSkillsMissions";

function EmotionLearningCenterContent() {
  const searchParams = useSearchParams();
  const worldParam = searchParams?.get("world");
  const topicParam = searchParams?.get("topic");

  const [activeTab, setActiveTab] = useState<"feelings" | "missions">(
    worldParam === "life-friendship" ? "missions" : "feelings"
  );
  const [activeStrategy, setActiveStrategy] = useState<string>("dragon");

  useEffect(() => {
    if (worldParam === "life-friendship") {
      setActiveTab("missions");
    }
  }, [worldParam]);

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
      title="Calm Corner &amp; Life Skills"
      subtitle="Discovering what our feelings tell us, finding calm, and completing kind real-world missions."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-center p-1.5 rounded-2xl bg-slate-200 max-w-md mx-auto shadow-inner">
          <button
            onClick={() => setActiveTab("feelings")}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 ${
              activeTab === "feelings"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Heart className="w-4 h-4 text-pink-500" />
            <span>Feelings &amp; Calm</span>
          </button>

          <button
            onClick={() => setActiveTab("missions")}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 ${
              activeTab === "missions"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Compass className="w-4 h-4 text-amber-500" />
            <span>Life Skills Missions</span>
          </button>
        </div>

        {activeTab === "missions" ? (
          <div className="space-y-6">
            <LifeSkillsMissions />
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
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
        )}
      </div>
    </YouthShell>
  );
}

export default function EmotionLearningCenterPage() {
  return (
    <Suspense
      fallback={
        <YouthShell
          activeScreen="emotions"
          title="Calm Corner &amp; Life Skills"
          subtitle="Loading calm corner..."
        >
          <div className="min-h-[50vh] flex items-center justify-center text-slate-500 font-bold">
            Loading Calm Corner &amp; Life Skills...
          </div>
        </YouthShell>
      }
    >
      <EmotionLearningCenterContent />
    </Suspense>
  );
}
