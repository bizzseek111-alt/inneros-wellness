"use client";

import React from "react";
import { Trophy, Star, Sparkles, Award, Heart, Shield, CheckCircle2 } from "lucide-react";
import { YouthShell } from "@/components/youth/YouthShell";
import { LumiMascot } from "@/components/youth/LumiMascot";

interface Milestone {
  id: string;
  title: string;
  urduTitle: string;
  description: string;
  earned: boolean;
  icon: string;
  badgeColor: string;
}

const MILESTONES: Milestone[] = [
  { id: "m1", title: "The Calm Breather", urduTitle: "پرسکون سانس لینے والا", description: "Practiced 3 deep calming breaths when feeling overwhelmed.", earned: true, icon: "🌬️", badgeColor: "bg-[#E0F1FE] text-[#0C436F]" },
  { id: "m2", title: "Emotion Detective", urduTitle: "جذبات کو پہچاننے والا", description: "Identified and named 4 different feelings on the wheel.", earned: true, icon: "🔍", badgeColor: "bg-[#F3EDFA] text-[#43256A]" },
  { id: "m3", title: "Story Explorer", urduTitle: "کہانیوں کا سیاح", description: "Listened to folk stories from Pakistan and around the globe.", earned: true, icon: "📖", badgeColor: "bg-[#FFEEE5] text-[#F36437]" },
  { id: "m4", title: "Kind Heart Star", urduTitle: "مہربان دل کا ستارہ", description: "Recorded one deliberate act of kindness toward a peer or sibling.", earned: false, icon: "💖", badgeColor: "bg-[#E3F6EC] text-[#154D32]" },
];

export default function AchievementsPage() {
  return (
    <YouthShell
      activeScreen="achievements"
      title="Growth & Celebrations"
      subtitle="Celebrating your effort, patience, and emotional growth. Zero leaderboards or comparisons."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Anti-Leaderboard Ethical Commitment */}
        <div className="p-6 rounded-[28px] bg-gradient-to-r from-[#FAF7FD] to-[#F0F8FF] border border-[#E2E8F0] flex items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#9868CE]">
              Growth Over Competition
            </span>
            <h3 className="text-xl font-extrabold text-[#0F172A]">
              Every child grows on their own unique timeline
            </h3>
            <p className="text-xs text-[#4A5568]">
              Weebly never displays public leaderboards or ranks children against each other.
            </p>
          </div>
          <LumiMascot size="sm" state="celebrating" />
        </div>

        {/* Milestones Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MILESTONES.map((m) => (
            <div
              key={m.id}
              className={`p-6 rounded-[28px] border-2 transition-all flex items-start space-x-4 rtl:space-x-reverse ${
                m.earned
                  ? "bg-white border-[#B9E2FE] shadow-sm"
                  : "bg-[#FDFBF4] border-dashed border-[#CBD5E1] opacity-75"
              }`}
            >
              <div className="text-4xl p-2 rounded-2xl bg-[#FFFDF9] border border-[#E2E8F0] shrink-0">
                {m.icon}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-base text-[#0F172A]">{m.title}</h4>
                  {m.earned && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Earned
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-[#718096] block" dir="rtl">
                  {m.urduTitle}
                </span>
                <p className="text-xs text-[#4A5568] leading-relaxed pt-1">{m.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Certificate of Effort Banner */}
        <div className="p-8 rounded-[32px] bg-white border-2 border-[#FEF08A] shadow-sm text-center space-y-4">
          <Award className="w-12 h-12 text-[#CA8A04] mx-auto" />
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-[#0F172A]">
              Certificate of Mindful Effort
            </h3>
            <p className="text-xs text-[#718096] max-w-md mx-auto">
              Show your caregiver or teacher that you practiced taking slow breaths and being kind to yourself this week.
            </p>
          </div>
          <button
            onClick={() => alert("Certificate printed or saved to device successfully!")}
            className="px-6 py-2.5 rounded-full bg-[#CA8A04] hover:bg-[#855800] text-white font-extrabold text-xs transition-colors shadow-xs"
          >
            Download Certificate
          </button>
        </div>
      </div>
    </YouthShell>
  );
}
