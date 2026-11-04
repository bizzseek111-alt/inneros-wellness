"use client";

import React, { useState } from "react";
import { ArrowRight, Check, Star, Sparkles, Volume2, HeartHandshake } from "lucide-react";

interface ScheduleItem {
  id: string;
  title: string;
  urduTitle?: string;
  icon: string; // emoji or icon label
  completed: boolean;
}

export const VisualScheduleCard: React.FC = () => {
  const [firstItem, setFirstItem] = useState<ScheduleItem>({
    id: "first_1",
    title: "10-minute quiet drawing or reading",
    urduTitle: "۱۰ منٹ پرسکون تصویر کشی یا مطالعہ",
    icon: "🎨",
    completed: false,
  });

  const [thenItem, setThenItem] = useState<ScheduleItem>({
    id: "then_1",
    title: "Play outdoors or listen to Lumi story",
    urduTitle: "باہر کھیلنا یا لومی کی کہانی سننا",
    icon: "🌳",
    completed: false,
  });

  const [stars, setStars] = useState<boolean[]>([true, true, false]);

  const toggleStar = (index: number) => {
    const next = [...stars];
    next[index] = !next[index];
    setStars(next);
  };

  return (
    <div className="p-6 rounded-[28px] bg-white border border-[#E2E8F0] shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#0F172A] flex items-center space-x-2">
          <span>First &bull; Then Visual Schedule</span>
        </h3>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E0F1FE] text-[#0C436F] border border-[#B9E2FE]">
          Autism Support Tool
        </span>
      </div>

      {/* First / Then Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
        {/* FIRST Card */}
        <div
          onClick={() => setFirstItem({ ...firstItem, completed: !firstItem.completed })}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            firstItem.completed
              ? "bg-emerald-50 border-emerald-300"
              : "bg-[#FFFDF9] border-[#B9E2FE] hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#0E87E3] text-white">
              1. FIRST
            </span>
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                firstItem.completed
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "border-[#CBD5E1] bg-white"
              }`}
            >
              {firstItem.completed && <Check className="w-4 h-4 stroke-[3]" />}
            </div>
          </div>

          <div className="space-y-1 text-center py-2">
            <span className="text-4xl block mb-2">{firstItem.icon}</span>
            <span className="text-base font-bold text-[#0F172A] block leading-snug">
              {firstItem.title}
            </span>
            {firstItem.urduTitle && (
              <span className="text-xs font-medium text-[#718096] block" dir="rtl">
                {firstItem.urduTitle}
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold text-[#718096] text-center block mt-2">
            {firstItem.completed ? "Done! Tap to undo" : "Tap card when finished"}
          </span>
        </div>

        {/* THEN Card */}
        <div
          onClick={() => setThenItem({ ...thenItem, completed: !thenItem.completed })}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            thenItem.completed
              ? "bg-emerald-50 border-emerald-300"
              : "bg-[#FFFDF9] border-[#FFD9C7] hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#F36437] text-white">
              2. THEN
            </span>
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                thenItem.completed
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "border-[#CBD5E1] bg-white"
              }`}
            >
              {thenItem.completed && <Check className="w-4 h-4 stroke-[3]" />}
            </div>
          </div>

          <div className="space-y-1 text-center py-2">
            <span className="text-4xl block mb-2">{thenItem.icon}</span>
            <span className="text-base font-bold text-[#0F172A] block leading-snug">
              {thenItem.title}
            </span>
            {thenItem.urduTitle && (
              <span className="text-xs font-medium text-[#718096] block" dir="rtl">
                {thenItem.urduTitle}
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold text-[#718096] text-center block mt-2">
            {thenItem.completed ? "Done! Tap to undo" : "Waiting for First to complete"}
          </span>
        </div>
      </div>

      {/* Effort Token Stars Board */}
      <div className="p-4 rounded-2xl bg-[#F9F5EA] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-xs font-extrabold text-[#1A202C] block">
            Effort Tokens (Non-Punitive)
          </span>
          <span className="text-[11px] text-[#718096] block">
            Tap to celebrate trying your best, not perfection
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {stars.map((earned, idx) => (
            <button
              key={idx}
              onClick={() => toggleStar(idx)}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                earned
                  ? "bg-amber-400 text-amber-950 scale-105 shadow-sm"
                  : "bg-white border-2 border-dashed border-[#CBD5E1] text-[#A0AEC0]"
              }`}
            >
              <Star className={`w-5 h-5 ${earned ? "fill-amber-950" : ""}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
