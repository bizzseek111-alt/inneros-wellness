"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, Wind, Clock, Users, Sparkles, Smile, ArrowRight, Play, Pause } from "lucide-react";
import { LumiMascot } from "@/components/youth/LumiMascot";

export default function TeacherDashboardPage() {
  const [breatheActive, setBreatheActive] = useState(false);
  const [breatheSeconds, setBreatheSeconds] = useState(4);

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1A202C] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E3F6EC] text-[#36A871] flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                Classroom Calming & Educator Hub
              </h1>
              <p className="text-xs sm:text-sm text-[#718096]">
                Non-clinical emotional regulation tools and group grounding for students.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/youth/dashboard"
              className="px-4 py-2 rounded-full bg-[#0E87E3] hover:bg-[#0C436F] text-white text-xs font-bold transition-all shadow-xs"
            >
              Back to Youth
            </Link>
          </div>
        </div>

        {/* Classroom Projector / Breathe-Along Module */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-gradient-to-r from-[#F0F8FF] via-white to-[#F2FAF6] border-2 border-[#B9E2FE] shadow-sm text-center space-y-6">
          <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase bg-white text-[#0E87E3] shadow-xs inline-block">
            Projector Calming Mode
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A]">
            Classroom Breathe-Along
          </h2>
          <p className="text-sm text-[#4A5568] max-w-lg mx-auto">
            Project this onto your smartboard during morning advisory, after recess, or before exams to synchronize autonomic nervous systems.
          </p>

          <div className="py-4">
            <LumiMascot size="hero" state={breatheActive ? "calming" : "idle"} />
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => setBreatheActive(!breatheActive)}
              className={`px-8 py-3 rounded-full font-extrabold text-sm transition-all shadow-sm flex items-center space-x-2 ${
                breatheActive
                  ? "bg-amber-500 text-white"
                  : "bg-[#0E87E3] hover:bg-[#0C436F] text-white"
              }`}
            >
              {breatheActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{breatheActive ? "Pause Breathe-Along" : "Start Group Breathing"}</span>
            </button>
          </div>
        </div>

        {/* Classroom Anonymous Weather Climate */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-[28px] bg-white border border-[#E2E8F0] shadow-sm space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#718096]">
              Classroom Climate
            </span>
            <span className="text-3xl font-black text-emerald-600 block">72% Calm</span>
            <span className="text-xs text-[#718096] block">
              Anonymous morning check-in aggregations
            </span>
          </div>

          <div className="p-6 rounded-[28px] bg-white border border-[#E2E8F0] shadow-sm space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#718096]">
              Restless / Need Break
            </span>
            <span className="text-3xl font-black text-amber-600 block">18%</span>
            <span className="text-xs text-[#718096] block">
              Suggested 2-minute stretch pause before math
            </span>
          </div>

          <div className="p-6 rounded-[28px] bg-white border border-[#E2E8F0] shadow-sm space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#718096]">
              Sensory Support Ready
            </span>
            <span className="text-3xl font-black text-[#0E87E3] block">Active</span>
            <span className="text-xs text-[#718096] block">
              Low-stimulation cards available for all desks
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
