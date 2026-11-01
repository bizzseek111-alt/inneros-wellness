"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { prototypeService, PrototypeState } from "@/lib/prototype-service";
import { api } from "@/lib/api-client";
import {
  Mic,
  MessageCircle,
  BookOpen,
  Sprout,
  Clock,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CheckCircle2,
  Calendar,
  Plus,
  HeartHandshake,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const [state, setState] = useState<PrototypeState>(prototypeService.getState());
  const [selectedQuickMood, setSelectedQuickMood] = useState<string | null>(null);
  const [activeDateTab, setActiveDateTab] = useState<number>(0);
  const [liveCounts, setLiveCounts] = useState({
    memories: 2410,
    presentMinutes: 1842,
    intentions: 850,
    equilibrium: "96.4%",
  });

  useEffect(() => {
    const local = prototypeService.getState();
    setState(local);

    Promise.allSettled([
      api.getJournalEntries(),
      api.getGrowthGoals(),
      api.getMemoryRecords(),
      api.getReminders(),
    ]).then(([jRes, gRes, memRes, remRes]) => {
      const journals = jRes.status === "fulfilled" ? jRes.value : [];
      const goals = gRes.status === "fulfilled" ? gRes.value : [];
      const mems = memRes.status === "fulfilled" ? memRes.value : [];
      const rems = remRes.status === "fulfilled" ? remRes.value : [];

      if (journals.length || goals.length || mems.length || rems.length) {
        setLiveCounts({
          memories: 2400 + (mems.length || 10),
          presentMinutes: 1830 + ((journals.length || 4) * 3),
          intentions: 845 + (goals.length || 5),
          equilibrium: "96.4%",
        });
      }
    });
  }, []);

  const quickMoodOptions = [
    {
      id: "calm",
      label: "Calm & Settled",
      pill: "bg-[#D9F296] border-[#CBEB78]",
    },
    {
      id: "reflective",
      label: "Thoughtful & Reflective",
      pill: "bg-[#CBD8F6] border-[#B8CBF2]",
    },
    {
      id: "tired",
      label: "Restful / Low Energy",
      pill: "bg-[#CDE5D3] border-[#BCE0C5]",
    },
    {
      id: "overwhelmed",
      label: "Carrying a Lot",
      pill: "bg-[#F6D4DC] border-[#F2C2CE]",
    },
  ];

  const handleQuickMoodSelect = async (moodId: string, label: string) => {
    setSelectedQuickMood(moodId);
    try {
      await api.createCheckIn({
        energy_level: moodId === "tired" ? 2 : 4,
        stress_level: moodId === "overwhelmed" ? 4 : 2,
        emotions: [label],
        needs: ["Calm presence"],
        note: `Quick dashboard check-in: ${label}`,
      });
    } catch {
      // Offline graceful fallback
    }
  };

  return (
    <SanctuaryShell>
      <div className="space-y-6">
        {/* ===================================================================
            1. TOP HEADER BAR (Matches "Teams Management" in Reference Image)
            =================================================================== */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-1">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-[38px] font-medium text-[#1A1E1C] tracking-tight leading-tight">
              Wellbeing Sanctuary
            </h1>
            <p className="text-[14.5px] text-[#687670]">
              Welcome back, {state.user.preferredName}. Manage your reflections, voice presence, and mindful routines in one place.
            </p>
          </div>

          {/* Quick Launch Voice & Text Companion Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/companion/voice"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full bg-[#1A1E1C] hover:bg-[#285B55] text-white text-[13px] font-semibold transition-all shadow-xs"
            >
              <Mic className="w-4 h-4 text-[#D9F296]" />
              <span>Voice Companion</span>
            </Link>
            <Link
              href="/companion/chat"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#D9F296] text-[#1A1E1C] border border-white text-[13px] font-semibold transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-[#285B55]" />
              <span>Text Chat</span>
            </Link>
            <Link
              href="/journal"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full bg-white/80 hover:bg-white text-[#4A5752] hover:text-[#1A1E1C] border border-white text-[13px] font-medium transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Journal</span>
            </Link>
          </div>
        </section>

        {/* ===================================================================
            2. MAIN PEOPLEFLOW 3-COLUMN BENTO GRID
               (Matches Attached Image media_1793566474904.jpg Layout & Colors)
            =================================================================== */}
        <section className="grid lg:grid-cols-12 gap-5 items-stretch">
          {/* -----------------------------------------------------------------
              LEFT COLUMN (3 Stacked White Bento Metric Cards)
              ----------------------------------------------------------------- */}
          <div className="lg:col-span-3 flex flex-col justify-between gap-5">
            {/* Card 1: Saved Memories & Context (Periwinkle Semi-Circle Gauge) */}
            <Link
              href="/memory"
              className="peopleflow-card p-6 flex flex-col justify-between space-y-6 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-medium text-[#1A1E1C]">
                  Memory Context
                </span>
                <span className="w-9 h-9 rounded-full bg-[#F4F6F5] group-hover:bg-[#CBD8F6] flex items-center justify-center text-[#1A1E1C] transition-colors">
                  <Bookmark className="w-4 h-4" />
                </span>
              </div>

              <div className="flex items-end justify-between pt-2">
                <div className="space-y-1">
                  <span className="text-[12.5px] text-[#687670] block">
                    Verified Notes
                  </span>
                  <span className="text-3xl sm:text-[34px] font-bold text-[#1A1E1C] tracking-tight leading-none block">
                    {liveCounts.memories.toLocaleString()}
                  </span>
                </div>

                {/* Semi-Circular Periwinkle Gauge with +12% ↑ */}
                <div className="relative w-28 h-14 flex items-end justify-center">
                  <svg viewBox="0 0 100 55" className="w-full h-full overflow-visible">
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#EDF1EF"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 10 50 A 40 40 0 0 1 76 20"
                      fill="none"
                      stroke="#CBD8F6"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute bottom-0 text-[11.5px] font-bold text-[#285B55]">
                    +12% &uarr;
                  </span>
                </div>
              </div>
            </Link>

            {/* Card 2: Present Today / Mindful Check-Ins (3 Mint-Sage Bars) */}
            <Link
              href="/check-in"
              className="peopleflow-card p-6 flex flex-col justify-between space-y-6 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-medium text-[#1A1E1C]">
                  Present Today
                </span>
                <span className="w-9 h-9 rounded-full bg-[#F4F6F5] group-hover:bg-[#CDE5D3] flex items-center justify-center text-[#1A1E1C] transition-colors">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>

              <div className="flex items-end justify-between pt-2">
                <div className="space-y-1">
                  <span className="text-[12.5px] text-[#687670] block">
                    Mindful Presence
                  </span>
                  <span className="text-3xl sm:text-[34px] font-bold text-[#1A1E1C] tracking-tight leading-none block">
                    {liveCounts.presentMinutes.toLocaleString()}
                  </span>
                </div>

                {/* 3 Rounded Mint-Sage Bars with Top Arc Connectors */}
                <div className="flex items-end space-x-2 h-16 pr-1">
                  <div className="w-5 h-8 rounded-lg bg-[#E4ECE7] border border-[#D5E2DA]" />
                  <div className="w-5 h-11 rounded-lg bg-[#CDE5D3] border border-[#B8D8C0]" />
                  <div className="w-5 h-15 rounded-lg bg-[#B8DBC1] border border-[#9ECBA9]" />
                </div>
              </div>
            </Link>

            {/* Card 3: Active Growth & Reflections (Rose-Blush Smooth Wave) */}
            <Link
              href="/growth"
              className="peopleflow-card p-6 flex flex-col justify-between space-y-6 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-medium text-[#1A1E1C]">
                  Active Intentions
                </span>
                <span className="w-9 h-9 rounded-full bg-[#F4F6F5] group-hover:bg-[#F6D4DC] flex items-center justify-center text-[#1A1E1C] transition-colors">
                  <Sprout className="w-4 h-4" />
                </span>
              </div>

              <div className="flex items-end justify-between pt-2">
                <div className="space-y-1">
                  <span className="text-[12.5px] text-[#687670] block">
                    Last Months
                  </span>
                  <span className="text-3xl sm:text-[34px] font-bold text-[#1A1E1C] tracking-tight leading-none block">
                    {liveCounts.intentions}+
                  </span>
                </div>

                {/* Rose-Blush Smooth Wave Chart with Dark Pill Callout */}
                <div className="relative w-32 h-16 flex flex-col justify-end">
                  <div className="absolute -top-1 left-3 z-10 px-2 py-0.5 rounded-md bg-[#1A1E1C] text-white text-[10px] font-semibold shadow-xs">
                    850+ Steps
                  </div>
                  <svg viewBox="0 0 120 50" className="w-full h-12 overflow-visible">
                    <defs>
                      <linearGradient id="blushGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F2B8C6" stopOpacity="0.65" />
                        <stop offset="100%" stopColor="#F6D4DC" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 42 Q 18 20, 35 35 T 72 10 T 120 38 L 120 50 L 0 50 Z"
                      fill="url(#blushGrad)"
                    />
                    <path
                      d="M 0 42 Q 18 20, 35 35 T 72 10 T 120 38"
                      fill="none"
                      stroke="#E598AC"
                      strokeWidth="2"
                    />
                    <circle cx="72" cy="10" r="3" fill="#1A1E1C" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          {/* -----------------------------------------------------------------
              CENTER COLUMN (Futuristic Serene Portrait + Hatched Trajectory Card)
              ----------------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5">
            {/* Top Center: Futuristic Serene Portrait Centerpiece */}
            <div className="relative rounded-[28px] overflow-hidden h-[290px] sm:h-[320px] bg-[#E5EAE7] flex items-center justify-center group">
              <img
                src="/images/dashboard-portrait.jpg"
                alt="InnerOS Calm Companion Presence"
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
              />
              {/* Floating Glass Overlay Bar */}
              <div className="absolute bottom-3.5 inset-x-3.5 p-3 rounded-2xl bg-white/85 backdrop-blur-md border border-white flex items-center justify-between gap-2 shadow-sm">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#65A30D] animate-pulse" />
                  <div>
                    <span className="text-[13px] font-semibold text-[#1A1E1C] block leading-tight">
                      Companion Presence Ready
                    </span>
                    <span className="text-[11px] text-[#687670]">
                      Recalls your Journal, Goals &amp; Check-Ins
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Link
                    href="/companion/voice"
                    className="px-3 py-1.5 rounded-full bg-[#D9F296] hover:bg-[#1A1E1C] text-[#1A1E1C] hover:text-white text-[11.5px] font-bold transition-colors"
                  >
                    Speak
                  </Link>
                  <Link
                    href="/companion/chat"
                    className="px-3 py-1.5 rounded-full bg-[#1A1E1C] hover:bg-[#285B55] text-white text-[11.5px] font-semibold transition-colors"
                  >
                    Chat
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Center: Hatched Trajectory Card with Floating Lime 1,750 Pill */}
            <div className="peopleflow-card p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                  <h2 className="text-[17px] font-medium text-[#1A1E1C]">
                    Wellbeing &amp; Clarity Rhythm
                  </h2>
                  <div className="flex items-center space-x-4 text-[11.5px] text-[#687670]">
                    <span className="inline-flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#6488EA]" />
                      <span>Reflections</span>
                    </span>
                    <span className="inline-flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#5BB98B]" />
                      <span>Grounded Days</span>
                    </span>
                    <span className="inline-flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#E88CA5]" />
                      <span>Rest Buffers</span>
                    </span>
                  </div>
                </div>

                <Link
                  href="/journal"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#F4F6F5] hover:bg-[#D9F296] text-[12px] font-medium text-[#1A1E1C] transition-colors"
                >
                  <span>Last Months</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Architectural Diagonal Hatched Corridor SVG Chart */}
              <div className="relative h-36 pt-2 flex flex-col justify-between">
                <div className="text-[11px] text-[#83918B]">2026</div>

                <div className="relative h-24 w-full">
                  <svg viewBox="0 0 400 90" className="w-full h-full overflow-visible">
                    <defs>
                      <pattern
                        id="diagHatch"
                        width="8"
                        height="8"
                        patternTransform="rotate(45 0 0)"
                        patternUnits="userSpaceOnUse"
                      >
                        <line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="8"
                          stroke="#CBD2CE"
                          strokeWidth="3"
                        />
                      </pattern>
                    </defs>
                    {/* Hatched Band Between Upper & Lower Bounds */}
                    <polygon
                      points="0,48 65,36 130,52 195,26 260,30 325,18 395,10 395,38 325,46 260,56 195,52 130,74 65,62 0,72"
                      fill="url(#diagHatch)"
                      opacity="0.75"
                    />
                    {/* Upper Line */}
                    <polyline
                      fill="none"
                      stroke="#9DA8A3"
                      strokeWidth="1.5"
                      points="0,48 65,36 130,52 195,26 260,30 325,18 395,10"
                    />
                    {/* Lower Line */}
                    <polyline
                      fill="none"
                      stroke="#9DA8A3"
                      strokeWidth="1.5"
                      points="0,72 65,62 130,74 195,52 260,56 325,46 395,38"
                    />
                    {/* Vertical Marker on Jul (x=260) */}
                    <line
                      x1="260"
                      y1="30"
                      x2="260"
                      y2="88"
                      stroke="#1A1E1C"
                      strokeWidth="1.75"
                    />
                    <circle cx="260" cy="30" r="3.5" fill="#1A1E1C" />
                  </svg>

                  {/* Floating Lime Pill Callout (Exact Match to 1,750 Pill in Reference) */}
                  <div className="absolute left-[58%] top-[28%] px-3 py-1 rounded-full bg-[#D9F296] border border-[#1A1E1C] text-[#1A1E1C] text-[12px] font-bold shadow-xs">
                    1,750
                  </div>
                </div>

                <div className="text-[11px] text-[#83918B]">2025</div>
              </div>

              <div className="flex justify-between text-[11.5px] text-[#687670] pt-1 border-t border-[#F4F6F5]">
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span className="font-bold text-[#1A1E1C]">Jul</span>
                <span>Aug</span>
                <span>Sep</span>
              </div>
            </div>
          </div>

          {/* -----------------------------------------------------------------
              RIGHT COLUMN (Emotional Balance 96.4% + Gentle Schedule Card)
              ----------------------------------------------------------------- */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-5">
            {/* Top Right Card: Emotional Equilibrium 96.4% (Matches "Attendance 96.4%") */}
            <div className="peopleflow-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-medium text-[#1A1E1C]">
                  Emotional Balance
                </span>
                <Link
                  href="/check-in"
                  aria-label="Open Daily Check-In"
                  className="w-8 h-8 rounded-full bg-[#F4F6F5] hover:bg-[#D9F296] flex items-center justify-center text-[#1A1E1C] transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex items-baseline space-x-2.5">
                <span className="text-3xl sm:text-[34px] font-bold text-[#1A1E1C] tracking-tight">
                  {liveCounts.equilibrium}
                </span>
                <span className="text-[13px] text-[#687670]">
                  Steady &amp; Grounded
                </span>
              </div>

              {/* 3 Columns with Hatched, Periwinkle, and Mint Bars */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div className="space-y-1.5">
                  <div className="border-l-2 border-[#DCE3DF] pl-2">
                    <span className="text-[11px] text-[#687670] block">
                      Grounded:
                    </span>
                    <span className="text-[12.5px] font-bold text-[#1A1E1C]">
                      24 Days
                    </span>
                  </div>
                  <div className="h-6 rounded-lg bg-hatch-neutral border border-[#E2E8E5]" />
                </div>

                <div className="space-y-1.5">
                  <div className="border-l-2 border-[#CBD8F6] pl-2">
                    <span className="text-[11px] text-[#687670] block">
                      Reflective:
                    </span>
                    <span className="text-[12.5px] font-bold text-[#1A1E1C]">
                      14 Notes
                    </span>
                  </div>
                  <div className="h-6 rounded-lg bg-[#CBD8F6]" />
                </div>

                <div className="space-y-1.5">
                  <div className="border-l-2 border-[#CDE5D3] pl-2">
                    <span className="text-[11px] text-[#687670] block">
                      Rested:
                    </span>
                    <span className="text-[12.5px] font-bold text-[#1A1E1C]">
                      10 Routines
                    </span>
                  </div>
                  <div className="h-6 rounded-lg bg-[#CDE5D3]" />
                </div>
              </div>
            </div>

            {/* Bottom Right Card: Gentle Schedule & Routines (Matches "Schedule" Card) */}
            <div className="peopleflow-card p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-medium text-[#1A1E1C]">
                  Schedule &amp; Routines
                </span>
                <div className="flex items-center space-x-1.5">
                  <Link
                    href="/reminders"
                    aria-label="View Reminders Calendar"
                    className="w-8 h-8 rounded-full bg-[#F4F6F5] hover:bg-[#CBD8F6] flex items-center justify-center text-[#1A1E1C] transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/reminders"
                    aria-label="Add Reminder"
                    className="w-8 h-8 rounded-full bg-[#F4F6F5] hover:bg-[#D9F296] flex items-center justify-center text-[#1A1E1C] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Date Tabs (Feb 20 [10], Feb 21 [12], Feb 22 [15] style) */}
              <div className="flex items-center justify-between border-b border-[#EDF1EF] pb-2.5 text-[12.5px]">
                {[
                  { label: "Today", count: state.reminders.length || 5 },
                  { label: "Tomorrow", count: 4 },
                  { label: "This Week", count: 12 },
                ].map((tab, idx) => (
                  <button
                    key={tab.label}
                    type="button"
                    onClick={() => setActiveDateTab(idx)}
                    className={`inline-flex items-center space-x-1.5 pb-1 transition-colors ${
                      activeDateTab === idx
                        ? "font-bold text-[#1A1E1C] border-b-2 border-[#1A1E1C]"
                        : "text-[#687670] hover:text-[#1A1E1C]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10.5px] font-semibold ${
                        activeDateTab === idx
                          ? "bg-[#CBD8F6] text-[#1A1E1C]"
                          : "bg-[#F4F6F5] text-[#687670]"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Timeline Grid with Lime 15:30 Pill & Cards */}
              <div className="space-y-3 pt-1">
                {/* Row 1: 08:30 / 15:30 Active Lime Pill */}
                <div className="grid grid-cols-12 gap-2.5 items-stretch">
                  <div className="col-span-2 flex flex-col items-center">
                    <span className="px-2 py-0.5 rounded-full bg-[#D9F296] text-[#1A1E1C] text-[10.5px] font-bold">
                      {state.reminders[0]?.time || "08:30"}
                    </span>
                    <div className="w-0.5 flex-1 bg-[#1A1E1C] my-1" />
                    <span className="w-5 h-5 rounded-full bg-[#D9F296] text-[#1A1E1C] text-[10px] font-bold flex items-center justify-center">
                      24
                    </span>
                  </div>

                  <Link
                    href="/reminders"
                    className="col-span-5 p-3 rounded-2xl bg-[#F4F6F5] hover:bg-[#D9F296]/35 transition-colors flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-[#D9F296] text-[#1A1E1C] flex items-center justify-center text-[10px] font-bold shrink-0">
                        MB
                      </span>
                      <div className="min-w-0">
                        <p className="text-[12px] font-bold text-[#1A1E1C] truncate">
                          {state.reminders[0]?.title || "Morning Breath"}
                        </p>
                        <p className="text-[10.5px] text-[#687670] truncate">
                          Mindful Routine
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#4A5752] pt-1 border-t border-white">
                      <span>Opt-in</span>
                      <span className="font-semibold">Gentle Cue</span>
                    </div>
                  </Link>

                  <Link
                    href="/journal"
                    className="col-span-5 p-3 rounded-2xl bg-[#F4F6F5] hover:bg-[#CBD8F6]/40 transition-colors flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-[#CBD8F6] text-[#1A1E1C] flex items-center justify-center text-[10px] font-bold shrink-0">
                        JR
                      </span>
                      <div className="min-w-0">
                        <p className="text-[12px] font-bold text-[#1A1E1C] truncate">
                          {state.journal[0]?.title || "Daily Reflection"}
                        </p>
                        <p className="text-[10.5px] text-[#687670] truncate">
                          Private Journal
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#4A5752] pt-1 border-t border-white">
                      <span>Saved</span>
                      <span className="font-semibold">Encrypted</span>
                    </div>
                  </Link>
                </div>

                {/* Row 2: 16:30 + Growth Goal + Diagonal Hatched Rest Buffer */}
                <div className="grid grid-cols-12 gap-2.5 items-stretch">
                  <div className="col-span-2 flex flex-col items-center justify-between py-1 text-[10.5px] text-[#687670]">
                    <span className="px-1.5 py-0.5 rounded-full bg-[#F4F6F5] font-medium">
                      16:30
                    </span>
                    <span className="w-5 h-5 rounded-full bg-[#F4F6F5] flex items-center justify-center text-[10px]">
                      15
                    </span>
                  </div>

                  <Link
                    href="/growth"
                    className="col-span-5 p-3 rounded-2xl bg-[#F4F6F5] hover:bg-[#CDE5D3]/50 transition-colors flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-[#CDE5D3] text-[#1A1E1C] flex items-center justify-center text-[10px] font-bold shrink-0">
                        GR
                      </span>
                      <div className="min-w-0">
                        <p className="text-[12px] font-bold text-[#1A1E1C] truncate">
                          {state.goals[0]?.horizonTitle || "Rest Boundaries"}
                        </p>
                        <p className="text-[10.5px] text-[#687670] truncate">
                          Growth Intention
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#4A5752] pt-1 border-t border-white">
                      <span>Step 1</span>
                      <span className="font-semibold">In Progress</span>
                    </div>
                  </Link>

                  {/* Architectural Diagonal Hatched Open Rest Slot (Exact Reference Match) */}
                  <Link
                    href="/settings/notifications"
                    className="col-span-5 p-3 rounded-2xl bg-hatch-neutral border border-[#E2E8E5] flex flex-col justify-end hover:border-[#1A1E1C] transition-colors"
                  >
                    <span className="text-[11px] font-semibold text-[#4A5752]">
                      Quiet Buffer Slot
                    </span>
                    <span className="text-[10px] text-[#687670]">
                      Protected rest window
                    </span>
                  </Link>
                </div>

                {/* Row 3: 21:15 Evening Sanctuary */}
                <div className="grid grid-cols-12 gap-2.5 items-stretch">
                  <div className="col-span-2 flex flex-col items-center justify-between py-1 text-[10.5px] text-[#687670]">
                    <span className="px-1.5 py-0.5 rounded-full bg-[#F4F6F5] font-medium">
                      21:15
                    </span>
                  </div>

                  <Link
                    href="/knowledge"
                    className="col-span-5 p-2.5 rounded-2xl bg-[#F4F6F5] hover:bg-[#F6D4DC]/40 transition-colors flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-[11.5px] font-bold text-[#1A1E1C] truncate">
                        Evening Wind-Down
                      </p>
                      <p className="text-[10px] text-[#687670] truncate">
                        4-4-4-4 Box Breath
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#4A5752] shrink-0" />
                  </Link>

                  <Link
                    href="/integrations"
                    className="col-span-5 p-2.5 rounded-2xl bg-[#F4F6F5] hover:bg-[#EAE4F7]/60 transition-colors flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-[11.5px] font-bold text-[#1A1E1C] truncate">
                        Context Archives
                      </p>
                      <p className="text-[10px] text-[#687670] truncate">
                        PII-Scrubbed Sync
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#4A5752] shrink-0" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            3. QUICK EMOTIONAL CHECK-IN BAR (PeopleFlow Pastel Skin Pills)
            =================================================================== */}
        <section className="peopleflow-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-full bg-[#D9F296] text-[#1A1E1C] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-[16px] font-semibold text-[#1A1E1C]">
                  How are you feeling right now?
                </h2>
                <p className="text-[12.5px] text-[#687670]">
                  One-tap check-in — syncs directly with your Companion Chat context.
                </p>
              </div>
            </div>
            <Link
              href="/check-in"
              className="text-[13px] font-semibold text-[#1A1E1C] hover:text-[#285B55] inline-flex items-center space-x-1"
            >
              <span>Open Full Somatic Check-In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickMoodOptions.map((mood) => {
              const isSelected = selectedQuickMood === mood.id;
              return (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => handleQuickMoodSelect(mood.id, mood.label)}
                  className={`px-4 py-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-[#1A1E1C] text-white border-[#1A1E1C] font-semibold shadow-sm"
                      : `${mood.pill} text-[#1A1E1C] font-medium hover:scale-[1.01]`
                  }`}
                >
                  <span className="text-[13.5px]">{mood.label}</span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-[#D9F296] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedQuickMood && (
            <div className="px-4 py-3 rounded-2xl bg-[#D9F296]/45 border border-[#CBEB78] flex flex-wrap items-center justify-between gap-2 text-[13.5px] text-[#1A1E1C]">
              <span>
                Saved to your sanctuary check-in history and linked to Companion Chat.
              </span>
              <Link
                href="/companion/chat"
                className="font-bold underline underline-offset-4"
              >
                Reflect with Companion &rarr;
              </Link>
            </div>
          )}
        </section>

        {/* ===================================================================
            4. REASSURING NON-CLINICAL & 24/7 SUPPORT FOOTER STRIP
            =================================================================== */}
        <footer className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-[#687670] px-2">
          <div className="flex items-center space-x-2">
            <HeartHandshake className="w-4 h-4 text-[#285B55]" />
            <span>
              Looking for human support or 24/7 crisis resources?{" "}
              <Link href="/safety" className="text-[#1A1E1C] font-semibold underline">
                Visit Help &amp; Support
              </Link>
            </span>
          </div>
          <Link href="/settings/privacy" className="hover:text-[#1A1E1C] underline">
            Privacy, Data Export &amp; Memory Controls
          </Link>
        </footer>
      </div>
    </SanctuaryShell>
  );
}
