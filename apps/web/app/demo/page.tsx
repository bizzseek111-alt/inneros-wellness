"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Users,
  GraduationCap,
  School,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  ArrowRight,
  BookOpen,
  Clock,
  Activity,
  Heart,
  Lock,
  Layers,
  FileText,
  AlertCircle,
  Award,
  Play,
  RotateCcw,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { CharacterAvatar } from "@/components/youth/friends/CharacterAvatar";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";

type DemoRole = "child" | "parent" | "teacher" | "school_admin" | "platform_admin";

export default function DemoCenterPage() {
  const [activeRole, setActiveRole] = useState<DemoRole>("child");
  const [childStep, setChildStep] = useState<number>(1);
  const [activeSpeech, setActiveSpeech] = useState<string | null>(null);

  // Child Demo Math Challenge
  const [userMathAnswer, setUserMathAnswer] = useState<string>("");
  const [mathFeedback, setMathFeedback] = useState<string | null>(null);

  const handlePlayVoice = (text: string, charId: string = "kai") => {
    setActiveSpeech(charId);
    voiceSynthesizer.speak(text, {
      characterId: charId as any,
      locale: "en-US",
      onEnd: () => setActiveSpeech(null),
    });
  };

  const handleCheckMath = () => {
    if (userMathAnswer.trim() === "3") {
      setMathFeedback("Spot on! 12 mangoes divided among 4 friends is exactly 3 mangoes each!");
      handlePlayVoice("Spot on! Twelve mangoes divided among 4 friends is exactly 3 mangoes each! You did it!", "kai");
    } else {
      setMathFeedback("Almost there! Try thinking: what number times 4 gives 12?");
      handlePlayVoice("Almost there! What number times 4 gives 12? Let's count together!", "kai");
    }
  };

  return (
    <MarketingShell>
      <div className="bg-[#FFFDF9] min-h-screen text-[#0F172A] py-12 px-4 sm:px-6 lg:px-8 space-y-10 selection:bg-amber-200">
        {/* Header Banner */}
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-xs font-black text-amber-900 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Demo Center &bull; Fictional Sandbox Data</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
            Explore Weebly in Action
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium">
            Test real workflows across four fictional role playgrounds. All demonstration data is strictly isolated and non-persistent.
          </p>

          {/* Role Switcher Tabs */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {[
              { id: "child", label: "1. Child Demo", icon: Sparkles, color: "text-amber-600" },
              { id: "parent", label: "2. Parent Demo", icon: Users, color: "text-indigo-600" },
              { id: "teacher", label: "3. Teacher Demo", icon: GraduationCap, color: "text-emerald-600" },
              { id: "school_admin", label: "4. School Admin Demo", icon: School, color: "text-purple-600" },
              { id: "platform_admin", label: "5. Platform Admin", icon: ShieldCheck, color: "text-slate-600" },
            ].map((role) => {
              const Icon = role.icon;
              const active = activeRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setActiveRole(role.id as DemoRole)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer ${
                    active
                      ? "bg-slate-900 text-white shadow-md scale-102"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-white" : role.color}`} />
                  <span>{role.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            ROLE 1: CHILD DEMO
           ========================================================================= */}
        {activeRole === "child" && (
          <div className="max-w-4xl mx-auto p-6 sm:p-10 rounded-[40px] bg-white border-2 border-amber-300 shadow-md space-y-8 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center">
                  1
                </span>
                <div>
                  <h2 className="text-base font-black text-slate-900">Child Experience: Meet Kai &amp; Socratic Math</h2>
                  <p className="text-xs text-slate-500 font-medium">Demonstration Profile: Maya (Age 7)</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                Live Voice Synthesis Enabled
              </span>
            </div>

            {/* Step Progression */}
            <div className="p-6 rounded-3xl bg-amber-50/60 border border-amber-200 space-y-6">
              <div className="flex items-start space-x-4">
                <CharacterAvatar characterId="kai" state={activeSpeech === "kai" ? "speaking" : "idle"} size="md" />
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase text-amber-800">Kai Speaks Aloud:</span>
                  <p className="text-sm font-bold text-slate-900 leading-relaxed">
                    &ldquo;Hi Maya! Let&apos;s imagine we picked 12 sweet mangoes from the orchard, and we want to share them equally among 4 friends. How many mangoes will each friend receive?&rdquo;
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    handlePlayVoice(
                      "Hi Maya! Let's imagine we picked 12 sweet mangoes from the orchard, and we want to share them equally among 4 friends. How many mangoes will each friend receive?",
                      "kai"
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-xs flex items-center space-x-1.5 transition-transform active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{activeSpeech === "kai" ? "Speaking..." : "Hear Kai Ask Question"}</span>
                </button>
              </div>

              {/* Child Answer Interaction */}
              <div className="p-4 rounded-2xl bg-white border border-amber-200 space-y-3">
                <span className="text-xs font-black uppercase text-slate-400 block">Your Answer (Enter a number):</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={userMathAnswer}
                    onChange={(e) => setUserMathAnswer(e.target.value)}
                    placeholder="e.g. 3"
                    className="w-24 p-2.5 rounded-xl border-2 border-slate-200 text-sm font-bold text-center focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleCheckMath}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-colors"
                  >
                    Check with Kai
                  </button>
                </div>

                {mathFeedback && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-950 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{mathFeedback}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/youth/dashboard"
                className="px-7 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-sm inline-flex items-center space-x-2 transition-transform active:scale-95"
              >
                <span>Launch Full Kids Magic Home Demo</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================================
            ROLE 2: PARENT DEMO
           ========================================================================= */}
        {activeRole === "parent" && (
          <div className="max-w-4xl mx-auto p-6 sm:p-10 rounded-[40px] bg-white border-2 border-indigo-200 shadow-md space-y-8 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-900 font-black text-xs flex items-center justify-center">
                  2
                </span>
                <div>
                  <h2 className="text-base font-black text-slate-900">Parent Experience: Insight Without Profiling</h2>
                  <p className="text-xs text-slate-500 font-medium">Demonstration Profile: The Rahman Family (Maya, 7 &amp; Rayyan, 11)</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-800">
                Non-Clinical Tagging Verified
              </span>
            </div>

            {/* Daily Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400">Total Learning Today</span>
                <div className="text-2xl font-black text-slate-900">22 mins</div>
                <p className="text-xs text-emerald-600 font-bold">Within 30m screen-time goal</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400">Active Worlds</span>
                <div className="text-2xl font-black text-indigo-600">Brain Quest &bull; Mia</div>
                <p className="text-xs text-slate-500 font-medium">Math &amp; Bedtime story</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400">Bedtime Shutdown</span>
                <div className="text-2xl font-black text-slate-900">7:30 PM</div>
                <p className="text-xs text-slate-500 font-medium">Automatic night routine locked</p>
              </div>
            </div>

            {/* Observation Diary Feed Sample */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Verified Observation Diary Timeline:
              </h3>
              <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                    [OBSERVED FACT]
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Today, 4:15 PM</span>
                </div>
                <p className="text-xs font-bold text-slate-800">
                  Maya completed 4 mango division puzzles with Kai in 8 minutes. 0 hints requested.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-indigo-100 text-indigo-800">
                    [PARENT-ENTERED NOTE]
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Today, 8:30 AM</span>
                </div>
                <p className="text-xs font-bold text-slate-800">
                  Caregiver noted Maya slept 9 hours peacefully; excited to bring her dinosaur drawing to school show-and-tell.
                </p>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/parent"
                className="px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-sm inline-flex items-center space-x-2 transition-transform active:scale-95"
              >
                <span>Open Full Parent Portal Demo</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================================
            ROLE 3: TEACHER DEMO
           ========================================================================= */}
        {activeRole === "teacher" && (
          <div className="max-w-4xl mx-auto p-6 sm:p-10 rounded-[40px] bg-white border-2 border-emerald-200 shadow-md space-y-8 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center">
                  3
                </span>
                <div>
                  <h2 className="text-base font-black text-slate-900">Teacher Experience: Classroom Co-Regulation &amp; Assignments</h2>
                  <p className="text-xs text-slate-500 font-medium">Demonstration Profile: Sarah Jenkins (Grade 3 Willow Cohort &bull; Join Code: WB-301)</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                24 Students Enrolled
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                <span className="text-xs font-black uppercase text-emerald-800">Active Classroom Task</span>
                <h4 className="text-base font-black text-slate-900">Morning Somatic Bunny Breathing</h4>
                <p className="text-xs text-slate-600 font-medium">
                  5-minute co-regulation transition exercise before daily math block.
                </p>
                <div className="flex items-center justify-between pt-2 text-xs font-bold text-slate-700">
                  <span>Completion Rate:</span>
                  <span className="text-emerald-700 font-black">22 / 24 Students (91%)</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-black uppercase text-slate-500">Universal Design Accommodations</span>
                <h4 className="text-base font-black text-slate-900">Low-Stimulation Mode</h4>
                <p className="text-xs text-slate-600 font-medium">
                  3 students configured with reduced motion, high-contrast text, and pre-reader voice prompts.
                </p>
                <span className="text-[11px] font-bold text-indigo-600 block pt-1">
                  Non-clinical authorized adjustments &bull; Zero PII leaked
                </span>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/teacher/dashboard"
                className="px-7 py-3 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-black shadow-sm inline-flex items-center space-x-2 transition-transform active:scale-95"
              >
                <span>Open Full Teacher Hub Demo</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================================
            ROLE 4: SCHOOL ADMIN DEMO
           ========================================================================= */}
        {activeRole === "school_admin" && (
          <div className="max-w-4xl mx-auto p-6 sm:p-10 rounded-[40px] bg-white border-2 border-purple-200 shadow-md space-y-8 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-900 font-black text-xs flex items-center justify-center">
                  4
                </span>
                <div>
                  <h2 className="text-base font-black text-slate-900">School Admin Experience: Multi-Campus Oversight</h2>
                  <p className="text-xs text-slate-500 font-medium">Demonstration Profile: Oakridge Public District (3 Campuses &bull; 990 Students)</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-purple-100 text-purple-800">
                District License Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2">
                <span className="text-[10px] font-black uppercase text-purple-800">Campus Adoption</span>
                <div className="text-2xl font-black text-purple-950">94.2%</div>
                <p className="text-xs text-slate-600 font-medium">Active classroom participation rate</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-500">Curriculum Standards</span>
                <div className="text-2xl font-black text-slate-900">CASEL &amp; Grade Math</div>
                <p className="text-xs text-slate-600 font-medium">4 domains tracked district-wide</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-500">Seat Utilization</span>
                <div className="text-2xl font-black text-emerald-600">990 / 1,000</div>
                <p className="text-xs text-slate-600 font-medium">Institutional pilot quota</p>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/school/portal"
                className="px-7 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-sm inline-flex items-center space-x-2 transition-transform active:scale-95"
              >
                <span>Open Multi-Campus School Portal Demo</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================================
            ROLE 5: PLATFORM ADMIN PREVIEW
           ========================================================================= */}
        {activeRole === "platform_admin" && (
          <div className="max-w-4xl mx-auto p-6 sm:p-10 rounded-[40px] bg-slate-900 text-white border-2 border-slate-700 shadow-md space-y-8 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <span className="w-8 h-8 rounded-full bg-slate-800 text-amber-400 font-black text-xs flex items-center justify-center">
                  5
                </span>
                <div>
                  <h2 className="text-base font-black text-white">Platform Administration &amp; Curriculum CMS</h2>
                  <p className="text-xs text-slate-400 font-medium">System Operator View &bull; 23 Management Sections</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500 text-slate-950">
                Restricted Sandbox
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300">
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <span className="text-[10px] font-black uppercase text-amber-400">Curriculum CMS</span>
                <div className="text-2xl font-black text-white">3,000 Questions</div>
                <p className="text-xs">Mapped across 9 categories and 3 languages (EN, UR, PA).</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <span className="text-[10px] font-black uppercase text-amber-400">Voice Synthesis Latency</span>
                <div className="text-2xl font-black text-white">&lt; 380 ms</div>
                <p className="text-xs">Azure Neural + Web Speech provider fallback.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <span className="text-[10px] font-black uppercase text-amber-400">Safeguarding Log</span>
                <div className="text-2xl font-black text-emerald-400">0 Leaks &bull; 100% Invariants</div>
                <p className="text-xs">Secrecy refusal &amp; human escalation protocols active.</p>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/admin"
                className="px-7 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-black shadow-sm inline-flex items-center space-x-2 transition-transform active:scale-95"
              >
                <span>Open Full Platform Admin Console</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </MarketingShell>
  );
}
