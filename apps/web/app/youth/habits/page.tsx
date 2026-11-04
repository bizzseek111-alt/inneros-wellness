"use client";

import React, { useState } from "react";
import { CheckCircle2, Circle, Droplets, Sun, Sparkles, Moon, Heart, Shield } from "lucide-react";
import { YouthShell } from "@/components/youth/YouthShell";
import { LumiMascot } from "@/components/youth/LumiMascot";

interface Habit {
  id: string;
  name: string;
  urduName: string;
  icon: any;
  color: string;
  completed: boolean;
}

export default function DailyHabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: "h1", name: "Drink Fresh Water", urduName: "تازہ پانی پینا", icon: Droplets, color: "text-[#0E87E3] bg-[#E0F1FE]", completed: true },
    { id: "h2", name: "Feel Sunlight on Skin", urduName: "دھوپ اور کھلی ہوا", icon: Sun, color: "text-[#CA8A04] bg-[#FEF9C3]", completed: true },
    { id: "h3", name: "20-Min Screen Rest", urduName: "اسکرین سے وقفہ", icon: Moon, color: "text-[#9868CE] bg-[#F3EDFA]", completed: false },
    { id: "h4", name: "One Act of Kindness", urduName: "کسی کی چھوٹی سی مدد", icon: Heart, color: "text-[#E11D48] bg-[#FFE4E6]", completed: false },
  ]);

  const toggleHabit = (id: string) => {
    setHabits(habits.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h)));
  };

  const completedCount = habits.filter((h) => h.completed).length;

  return (
    <YouthShell
      activeScreen="habits"
      title="Gentle Daily Habits"
      subtitle="Small daily moments of nourishment with zero streaks or pressure."
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Anti-Streak Ethical Banner */}
        <div className="p-6 rounded-[28px] bg-gradient-to-r from-[#F0F8FF] to-[#F2FAF6] border border-[#E2E8F0] flex items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#36A871]">
              Healthy Routine
            </span>
            <h3 className="text-xl font-extrabold text-[#0F172A]">
              {completedCount} of {habits.length} Habits Explored Today
            </h3>
            <p className="text-xs text-[#4A5568]">
              Weebly never tracks streaks. Every day is a fresh, gentle beginning without guilt.
            </p>
          </div>
          <LumiMascot size="sm" state={completedCount === habits.length ? "celebrating" : "idle"} />
        </div>

        {/* Habits Checklist */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-3">
          {habits.map((h) => {
            const Icon = h.icon;
            return (
              <div
                key={h.id}
                onClick={() => toggleHabit(h.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  h.completed
                    ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                    : "bg-[#FFFDF9] border-[#E2E8F0] text-[#1A202C] hover:border-[#CBD5E1]"
                }`}
              >
                <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${h.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-sm block">{h.name}</span>
                    <span className="text-xs font-semibold text-[#718096] block" dir="rtl">
                      {h.urduName}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                    h.completed
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-[#CBD5E1] bg-white"
                  }`}
                >
                  {h.completed && <CheckCircle2 className="w-5 h-5" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </YouthShell>
  );
}
