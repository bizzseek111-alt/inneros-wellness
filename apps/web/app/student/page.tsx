"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  Smile,
  Mic,
  BookOpen,
  Calendar,
  ShieldCheck,
  Check,
  Volume2,
} from "lucide-react";
import { LumiMascot } from "@/components/youth/LumiMascot";
import { useYouth } from "@/components/youth/YouthContext";

export default function StudentPortalEntryPage() {
  const router = useRouter();
  const { ageTier, setAgeTier, locale, setLocale } = useYouth();
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);

  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    const clean = joinCode.trim().toUpperCase();
    if (clean.length < 4) {
      setJoinError("Please enter a valid classroom code (e.g. WB-402)");
      return;
    }
    // Redirect to youth dashboard with classroom session
    router.push(`/youth/dashboard?class=${encodeURIComponent(clean)}`);
  };

  const handleSelectTier = (tier: "little" | "junior" | "teen") => {
    setAgeTier(tier);
    if (tier === "little") {
      router.push("/kids");
    } else if (tier === "teen") {
      router.push("/teens");
    } else {
      router.push("/youth/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#0F172A] flex flex-col selection:bg-[#EEF4FF] selection:text-[#2B4CDE]">
      {/* Top Header */}
      <header className="px-4 sm:px-8 py-4 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#2B4CDE] text-white flex items-center justify-center font-black shadow-xs">
              W
            </div>
            <div>
              <span className="font-extrabold text-lg text-[#0F172A] tracking-tight block leading-none">
                Weebly
              </span>
              <span className="text-[11px] font-semibold text-[#64748B] block mt-0.5">
                Student Learning Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3 text-xs">
            <Link
              href="/parent"
              className="font-semibold text-[#64748B] hover:text-[#0F172A] hover:underline"
            >
              Parent Portal
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href="/teacher/dashboard"
              className="font-semibold text-[#64748B] hover:text-[#0F172A] hover:underline"
            >
              Teacher Hub
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10 flex-1">
        {/* Welcome Mascot Banner */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <LumiMascot size="lg" state="guiding" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            Welcome to Your Learning World!
          </h1>
          <p className="text-sm sm:text-base text-[#475569] max-w-lg mx-auto">
            Choose your learning space below or type in your classroom code from your teacher.
          </p>
        </div>

        {/* Join Code Box */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-[#EFF6FF] via-white to-[#F0FDF4] border-2 border-[#BFDBFE] shadow-sm text-center space-y-4 max-w-md mx-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-[#2B4CDE] shadow-xs inline-block">
            School or Classroom Code
          </span>
          <h2 className="text-lg font-bold text-[#0F172A]">Have a code from your teacher?</h2>
          <form onSubmit={handleJoinClass} className="space-y-3">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => {
                setJoinCode(e.target.value);
                setJoinError(null);
              }}
              placeholder="e.g. WB-402"
              className="w-full text-center tracking-widest text-lg font-black uppercase py-3 rounded-2xl border-2 border-[#93C5FD] focus:outline-none focus:border-[#2B4CDE] bg-white"
            />
            {joinError && <p className="text-xs text-rose-600 font-semibold">{joinError}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl font-bold text-sm bg-[#2B4CDE] text-white hover:bg-[#1E3A8A] transition-all shadow-xs flex items-center justify-center space-x-2"
            >
              <span>Join Class Learning →</span>
            </button>
          </form>
        </div>

        {/* Age-Tier Explorer Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#0F172A] text-center">
            Or pick your age learning space:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 2-5 Little Explorers */}
            <div
              onClick={() => handleSelectTier("little")}
              className="p-6 rounded-[28px] bg-[#FFF1F2] border-2 border-[#FECDD3] hover:border-[#FB7185] cursor-pointer transition-all hover:scale-[1.02] shadow-xs space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-white text-[#E11D48] flex items-center justify-center font-bold">
                🧸
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#9F1239]">
                Ages 2–5
              </span>
              <h3 className="text-lg font-bold text-[#881337]">Little Explorers</h3>
              <p className="text-xs text-[#9F1239] leading-relaxed">
                Picture cards, gentle audio stories, bedtime breathing, and parent-guided games.
              </p>
              <div className="pt-2 text-xs font-bold text-[#E11D48] flex items-center space-x-1">
                <span>Start Little Explorers →</span>
              </div>
            </div>

            {/* 6-12 Curious Kids */}
            <div
              onClick={() => handleSelectTier("junior")}
              className="p-6 rounded-[28px] bg-[#F0FDF4] border-2 border-[#BBF7D0] hover:border-[#4ADE80] cursor-pointer transition-all hover:scale-[1.02] shadow-xs space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-white text-[#16A34A] flex items-center justify-center font-bold">
                🌟
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#166534]">
                Ages 6–12
              </span>
              <h3 className="text-lg font-bold text-[#14532D]">Curious Kids &amp; Pre-Teens</h3>
              <p className="text-xs text-[#166534] leading-relaxed">
                Talk with Lumi, Feelings Garden, Story Forest, visual schedules, and memory challenges.
              </p>
              <div className="pt-2 text-xs font-bold text-[#16A34A] flex items-center space-x-1">
                <span>Open Kids Sanctuary →</span>
              </div>
            </div>

            {/* 13-18 Teens */}
            <div
              onClick={() => handleSelectTier("teen")}
              className="p-6 rounded-[28px] bg-[#F5F3FF] border-2 border-[#DDD6FE] hover:border-[#8B5CF6] cursor-pointer transition-all hover:scale-[1.02] shadow-xs space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-white text-[#7C3AED] flex items-center justify-center font-bold">
                🎧
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#5B21B6]">
                Ages 13–18
              </span>
              <h3 className="text-lg font-bold text-[#4C1D95]">Teens Studio</h3>
              <p className="text-xs text-[#5B21B6] leading-relaxed">
                Private self-reflection journal, exam stress management, goal setting, and boundary tools.
              </p>
              <div className="pt-2 text-xs font-bold text-[#7C3AED] flex items-center space-x-1">
                <span>Enter Teen Studio →</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sensory & Language Preferences Bar */}
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-[#2B4CDE]" />
            <span>Spoken voice available in English, Urdu (اردو), and Pakistani Punjabi (پنجابی)</span>
          </div>
          <Link
            href="/youth/accessibility"
            className="text-xs font-bold text-[#2B4CDE] hover:underline"
          >
            Sensory &amp; Dyslexia Settings →
          </Link>
        </div>
      </main>
    </div>
  );
}
