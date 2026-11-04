"use client";

import React, { useState } from "react";
import { Calendar, CheckCircle2, Circle, Clock, Sparkles, ArrowRight, Sun, Sunset, BookOpen } from "lucide-react";
import { YouthShell } from "@/components/youth/YouthShell";
import { VisualTimer } from "@/components/youth/VisualTimer";

interface RoutineStep {
  id: string;
  text: string;
  urduText: string;
  completed: boolean;
}

export default function ADHDRoutinesPage() {
  const [activeRoutine, setActiveRoutine] = useState<"morning" | "homework" | "bedtime">("morning");

  const [morningSteps, setMorningSteps] = useState<RoutineStep[]>([
    { id: "m1", text: "Stretch arms high like a tall tree", urduText: "ہاتھ اونچے کر کے انگڑائی لیں", completed: true },
    { id: "m2", text: "Drink a full glass of cool water", urduText: "ٹھنڈے پانی کا ایک گلاس پییں", completed: true },
    { id: "m3", text: "Put shoes and backpack by the door", urduText: "جوتے اور بستہ دروازے کے قریب رکھیں", completed: false },
    { id: "m4", text: "Take 3 deep belly breaths with Lumi", urduText: "لومی کے ساتھ ۳ گہری سانسیں لیں", completed: false },
  ]);

  const [homeworkSteps, setHomeworkSteps] = useState<RoutineStep[]>([
    { id: "h1", text: "Clear desk so only 1 book is in front of you", urduText: "میز صاف کریں تاکہ صرف ایک کتاب سامنے ہو", completed: false },
    { id: "h2", text: "Set Visual Timer for 10 minutes", urduText: "۱۰ منٹ کا ٹائمر آن کریں", completed: false },
    { id: "h3", text: "Stretch body and drink water during break", urduText: "وقفے میں پانی پییں اور ہاتھ ہلائیں", completed: false },
  ]);

  const toggleStep = (list: "morning" | "homework", id: string) => {
    if (list === "morning") {
      setMorningSteps(
        morningSteps.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
      );
    } else {
      setHomeworkSteps(
        homeworkSteps.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
      );
    }
  };

  return (
    <YouthShell
      activeScreen="routines"
      title="ADHD-Friendly Visual Routines"
      subtitle="Bite-sized micro-steps with visual timers to make daily transitions smooth and calm."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Visual Timer Embed */}
        <VisualTimer initialMinutes={10} label="ADHD Focus Interval (10m Sprint)" />

        {/* Routine Switcher */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-[#0E87E3]" />
              <h3 className="font-extrabold text-base text-[#0F172A]">Micro-Step Routine Builder</h3>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveRoutine("morning")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeRoutine === "morning"
                    ? "bg-[#FFEEE5] text-[#F36437] border border-[#FF8E68]"
                    : "bg-[#F9F5EA] text-[#4A5568]"
                }`}
              >
                Morning
              </button>
              <button
                onClick={() => setActiveRoutine("homework")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeRoutine === "homework"
                    ? "bg-[#E0F1FE] text-[#0C436F] border border-[#38A8F8]"
                    : "bg-[#F9F5EA] text-[#4A5568]"
                }`}
              >
                Homework Sprint
              </button>
            </div>
          </div>

          {/* Routine Steps List */}
          <div className="space-y-3">
            {(activeRoutine === "morning" ? morningSteps : homeworkSteps).map((step) => (
              <div
                key={step.id}
                onClick={() => toggleStep(activeRoutine === "morning" ? "morning" : "homework", step.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  step.completed
                    ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                    : "bg-[#FFFDF9] border-[#E2E8F0] text-[#1A202C] hover:border-[#CBD5E1]"
                }`}
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                      step.completed
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-[#CBD5E1] bg-white"
                    }`}
                  >
                    {step.completed && <CheckCircle2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="font-bold text-sm block">{step.text}</span>
                    <span className="text-xs text-[#718096] block" dir="rtl">
                      {step.urduText}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#718096]">
                  {step.completed ? "Done" : "Tap to complete"}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#FEFCE8] border border-[#FEF08A] text-xs text-[#613E02] font-semibold">
            Tip: Doing even 1 step is a huge success. If energy is low today, it is completely okay to stop here.
          </div>
        </div>
      </div>
    </YouthShell>
  );
}
