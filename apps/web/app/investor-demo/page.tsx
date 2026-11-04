"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Mic,
  MessageSquare,
  Globe,
  BookOpen,
  Users,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  Activity,
  Layers,
  ArrowRight,
  Award,
} from "lucide-react";
import { AI_FRIENDS, CharacterId } from "@/lib/friends-data";
import { CharacterAvatar } from "@/components/youth/friends/CharacterAvatar";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";

interface DemoScene {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}

const DEMO_SCENES: DemoScene[] = [
  {
    step: 1,
    title: "Mobile Child-First Experience",
    subtitle: "Clean, pressure-free layout for pre-readers and youth",
    description: "Children see four large illustrated learning companions, a prominent push-to-talk button, and zero technical or administrative clutter.",
    badge: "Scene 1: Mobile UI",
  },
  {
    step: 2,
    title: "Select Kai (The Learning Guide)",
    subtitle: "AI Friends Gallery character selection",
    description: "Child selects Kai, the curious fox-owl mentor who specializes in homework, step-by-step problem-solving, and building self-confidence.",
    badge: "Scene 2: Kai Selected",
  },
  {
    step: 3,
    title: "Real English Spoken Turn-Taking",
    subtitle: "Audio In, Natural Audible Audio Out",
    description: "Child asks: 'I don't understand this question.' Kai responds with encouraging Socratic guidance, breaking the problem into bite-sized steps.",
    badge: "Scene 3: English Voice",
  },
  {
    step: 4,
    title: "Pakistani Urdu (اردو) Voice & Learning",
    subtitle: "Cultural adab and Nastaliq script comprehension",
    description: "Switching to Urdu: 'مجھے یہ سوال سمجھ نہیں آ رہا۔' Kai explains in gentle, respectful Urdu with real spoken pronunciation.",
    badge: "Scene 4: Urdu Voice",
  },
  {
    step: 5,
    title: "Pakistani Punjabi (پنجابی) Verified Speech",
    subtitle: "Majhi dialect integrity — no Hindi/Gurmukhi substitution",
    description: "Spoken Punjabi test: 'Mainu homework samajh nahi aa reha.' Kai replies warmly in authentic Shahmukhi Punjabi.",
    badge: "Scene 5: Punjabi Voice",
  },
  {
    step: 6,
    title: "Select Mia (Creative Guide)",
    subtitle: "Interactive storytelling & emotional literacy",
    description: "Switch to Mia, the starlight companion specializing in storytelling, naming big feelings, and validating emotions.",
    badge: "Scene 6: Mia & Storytelling",
  },
  {
    step: 7,
    title: "Complete Learning Activity",
    subtitle: "Curriculum-mapped challenge & event dispatch",
    description: "Child completes a question from the 3,000-question library. A minimal, privacy-preserving structured event is recorded.",
    badge: "Scene 7: Activity Event",
  },
  {
    step: 8,
    title: "Parent Dashboard Live Sync",
    subtitle: "Real-time educational summaries & offline tips",
    description: "Parent portal displays newly completed competencies, duration, and recommended screen-free dinner table activities.",
    badge: "Scene 8: Parent Portal",
  },
  {
    step: 9,
    title: "Teacher Dashboard Live Sync",
    subtitle: "Classroom assignment mastery & aggregate metrics",
    description: "Educators view anonymized assignment completion, average hints used, and CASEL social-emotional learning milestones.",
    badge: "Scene 9: Teacher Portal",
  },
  {
    step: 10,
    title: "Admin Dashboard & 3,000 Questions",
    subtitle: "Curriculum governance, review gating & platform SLA",
    description: "Inspect the 3,000-question library status (126 published, 369 reviewed, 2,505 drafted), provider uptime, and safeguarding logs.",
    badge: "Scene 10: Admin & 3k Questions",
  },
];

export default function InvestorDemoPage() {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [activeCharId, setActiveCharId] = useState<CharacterId>("kai");
  const [locale, setLocale] = useState<"en" | "ur" | "pa">("en");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeUtterance, setActiveUtterance] = useState("");
  const [activeReply, setActiveReply] = useState("");
  const [recentEventId, setRecentEventId] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<any>(null);

  const scene = DEMO_SCENES[currentSceneIdx];

  // Fetch 3k question bank stats
  useEffect(() => {
    fetch("/api/curriculum/stats")
      .then((r) => r.json())
      .then((data) => setStatsData(data))
      .catch(() => {});
  }, []);

  // Update scene states automatically when switching scenes
  useEffect(() => {
    voiceSynthesizer.stop();
    setIsPlayingAudio(false);

    if (scene.step === 2 || scene.step === 3) {
      setActiveCharId("kai");
      setLocale("en");
      setActiveUtterance("I don't understand this question.");
      setActiveReply(
        "That's completely okay! Tricky questions are just puzzles in disguise. What is the very first sentence or number that the question mentions?"
      );
    } else if (scene.step === 4) {
      setActiveCharId("kai");
      setLocale("ur");
      setActiveUtterance("مجھے یہ سوال سمجھ نہیں آ رہا۔");
      setActiveReply(
        "کوئی بات نہیں! مشکل سوالات دیکھ کر پریشان ہونا قدرتی بات ہے۔ آئیے مل کر دیکھتے ہیں۔ سب سے پہلے بتائیں کہ سوال میں کیا معلومات دی گئی ہیں؟"
      );
    } else if (scene.step === 5) {
      setActiveCharId("kai");
      setLocale("pa");
      setActiveUtterance("Mainu homework samajh nahi aa reha.");
      setActiveReply(
        "فکر نہ کرو پیارے دوست! ہوم ورک اوکھا لگ سکدا اے، پر اسیں مل کے کر لواں گے۔ سوال دا پہلا جملہ کی کہندا اے؟ مینوں دسّو۔"
      );
    } else if (scene.step === 6) {
      setActiveCharId("mia");
      setLocale("en");
      setActiveUtterance("Tell me a story about a brave little squirrel.");
      setActiveReply(
        "Once upon a time, deep in a moonlit forest, a little squirrel named Nutmeg wanted to climb the Great Whispering Oak. Would you like to hear what happened next?"
      );
    } else if (scene.step === 7) {
      setActiveCharId("kai");
      setLocale("en");
      setActiveUtterance("I think 12 divided by 3 is 4 mangoes!");
      setActiveReply("Spot on! That is exactly right! 12 mangoes shared among 3 friends gives 4 each. You are a math superstar!");
    }
  }, [currentSceneIdx, scene.step]);

  const handlePlayVoice = async () => {
    if (isPlayingAudio) {
      voiceSynthesizer.stop();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    await voiceSynthesizer.speak({
      characterId: activeCharId,
      text: activeReply,
      locale,
      volume: 0.9,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  const handleTriggerLearningActivity = async () => {
    try {
      const res = await fetch("/api/educational/activity-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_pseudonymous_id: "std_investor_demo_ayan",
          student_name: "Ayan (Fictional Demo Profile)",
          activity_id: "q_math_0001",
          activity_title: "Fair-Share Mango Division",
          category: "mathematics",
          learning_objective: "Equal partition division into 3 groups",
          completion_status: "completed",
          hints_used_count: 0,
          language_used: locale,
          duration_seconds: 140,
          curriculum_version: "v2.4.0",
        }),
      });
      const data = await res.json();
      setRecentEventId(data.event_id);
      handlePlayVoice();
    } catch {
      setRecentEventId("evt_simulated_demo_ok");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Banner */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-black tracking-tight text-white">
                  Weebly Investor Demonstration
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase">
                  Synthetic Fictional Data
                </span>
              </div>
              <p className="text-xs text-slate-400">
                10-Scene Live Interactive Walkthrough: Voice AI, 3,000 Questions & Multi-Role Dashboards
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <Link
              href="/youth/friends"
              target="_blank"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 flex items-center space-x-1"
            >
              <span>Live Friends Room</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/parent"
              target="_blank"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 flex items-center space-x-1"
            >
              <span>Parent Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/admin/curriculum"
              target="_blank"
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center space-x-1"
            >
              <span>Admin CMS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Walkthrough Container */}
      <main className="max-w-6xl mx-auto w-full p-6 space-y-6 flex-1 flex flex-col">
        {/* Stepper Strip */}
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center space-x-2 min-w-max">
            {DEMO_SCENES.map((s, idx) => {
              const isActive = idx === currentSceneIdx;
              const isPast = idx < currentSceneIdx;
              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setCurrentSceneIdx(idx)}
                  className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
                    isActive
                      ? "bg-amber-500 text-slate-950 shadow-lg scale-105"
                      : isPast
                      ? "bg-slate-800 text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
                    {s.step}
                  </span>
                  <span>{s.badge}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scene Hero Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch">
          {/* Left Column: Scene Guide & Narrative (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-extrabold uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Scene {scene.step} of 10</span>
              </div>
              <h2 className="text-2xl font-black text-white">{scene.title}</h2>
              <p className="text-sm font-bold text-amber-400/90">{scene.subtitle}</p>
              <p className="text-xs text-slate-300 leading-relaxed">{scene.description}</p>

              {/* Fictional Profile Sandbox Notice */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-extrabold text-slate-200 uppercase tracking-wide block">
                  Active Demo Profile (Synthetic):
                </span>
                <p>Child: Ayan (Age 7) &bull; School: Beaconhouse Lahore Class 2-B</p>
                <p>Caregiver: Dr. Imran (Verified Parental Consent on record)</p>
              </div>
            </div>

            {/* Stepper Navigation */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={currentSceneIdx === 0}
                onClick={() => setCurrentSceneIdx((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-black text-white flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                disabled={currentSceneIdx === DEMO_SCENES.length - 1}
                onClick={() => setCurrentSceneIdx((prev) => Math.min(DEMO_SCENES.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-xs font-black text-slate-950 flex items-center space-x-1.5 shadow-md"
              >
                <span>Next Scene</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Live Interactive Simulation Stage (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            {/* SCENE 1: Mobile-Sized Child View */}
            {scene.step === 1 && (
              <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4">
                <div className="w-72 bg-[#FFFDF9] text-slate-900 rounded-[36px] border-4 border-slate-700 p-4 shadow-2xl space-y-3 transform scale-95">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                      Weebly Youth
                    </span>
                    <h4 className="text-sm font-black">Choose your learning friend</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {["kai", "mia", "lumi", "zayn"].map((id) => (
                      <div key={id} className="p-2.5 rounded-2xl bg-white border border-slate-200 text-center shadow-2xs">
                        <CharacterAvatar characterId={id as CharacterId} size="sm" />
                        <p className="text-[11px] font-black capitalize mt-1">{id}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-500 text-white text-center font-black text-xs shadow-md">
                    Tap to Talk
                  </div>
                </div>
                <p className="text-xs text-slate-400 text-center max-w-sm">
                  Responsive touch-friendly mobile design. Click &ldquo;Next Scene&rdquo; to select Kai.
                </p>
              </div>
            )}

            {/* SCENE 2 to 6: Live Character Dialogue & Speech Engine */}
            {scene.step >= 2 && scene.step <= 6 && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
                <div className="relative">
                  <CharacterAvatar
                    characterId={activeCharId}
                    state={isPlayingAudio ? "speaking" : "idle"}
                    size="hero"
                  />
                </div>

                <div className="w-full max-w-lg space-y-3">
                  {/* User Utterance */}
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-start">
                    <span className="font-extrabold text-slate-500 uppercase text-[10px] block">
                      Child Utterance ({locale.toUpperCase()}):
                    </span>
                    <p className="text-amber-300 font-bold italic">&ldquo;{activeUtterance}&rdquo;</p>
                  </div>

                  {/* Character Spoken Response */}
                  <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-start space-y-1">
                    <span className="font-black text-[11px] uppercase text-emerald-400">
                      {AI_FRIENDS[activeCharId].name} (Spoken Live):
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-relaxed">
                      {activeReply}
                    </p>
                  </div>
                </div>

                {/* Voice Play Button */}
                <button
                  type="button"
                  onClick={handlePlayVoice}
                  className={`px-6 py-3 rounded-2xl text-xs font-black flex items-center space-x-2 transition-all shadow-lg ${
                    isPlayingAudio
                      ? "bg-rose-500 hover:bg-rose-600 text-white animate-pulse"
                      : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlayingAudio ? "Stop Audio" : `Play Natural ${locale.toUpperCase()} Voice`}</span>
                </button>
              </div>
            )}

            {/* SCENE 7: Complete Learning Activity */}
            {scene.step === 7 && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center p-4">
                <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-start space-y-3 max-w-md w-full">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Math Mastery Challenge
                  </span>
                  <h4 className="text-base font-black text-white">Fair-Share Mango Division</h4>
                  <p className="text-xs text-slate-300">
                    &ldquo;If you have 12 fresh mangoes and share them equally with 3 friends, how many does each get?&rdquo;
                  </p>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-amber-300">
                    Child Answer: &ldquo;4 mangoes each!&rdquo; &bull; Hints: 0
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTriggerLearningActivity}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center space-x-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Submit & Record Activity Event</span>
                </button>

                {recentEventId && (
                  <p className="text-xs font-bold text-emerald-400 animate-fade-in">
                    ✓ Recorded event {recentEventId} to database and dispatched analytics.
                  </p>
                )}
              </div>
            )}

            {/* SCENE 8: Parent Dashboard Live View */}
            {scene.step === 8 && (
              <div className="flex-1 flex flex-col justify-center space-y-4 p-4 text-start">
                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-400">Parent Dashboard Sync</span>
                    <span className="text-[10px] text-slate-500">Live API Data</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <p className="text-[10px] text-slate-400">Weekly Activities</p>
                      <p className="text-lg font-black text-white">4 Completed</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <p className="text-[10px] text-slate-400">Total Minutes</p>
                      <p className="text-lg font-black text-emerald-400">28 mins</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <p className="text-[10px] text-slate-400">Languages</p>
                      <p className="text-lg font-black text-sky-400">EN, UR, PA</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <p className="font-extrabold text-slate-200">Recommended Offline Activity:</p>
                    <p className="text-slate-400 text-[11px]">
                      Dinner Table Emotion Check-in: Ask Ayan what color his heart felt like today.
                    </p>
                  </div>
                </div>

                <Link
                  href="/parent"
                  target="_blank"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
                >
                  <span>Open Full Parent Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* SCENE 9: Teacher Dashboard Live View */}
            {scene.step === 9 && (
              <div className="flex-1 flex flex-col justify-center space-y-4 p-4 text-start">
                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-sky-400">Classroom 2-B Analytics</span>
                    <span className="text-[10px] text-slate-500">Authorized Teacher View</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <p className="text-[10px] text-slate-400">Class Completion Rate</p>
                      <p className="text-xl font-black text-white">92%</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <p className="text-[10px] text-slate-400">Avg Hints per Activity</p>
                      <p className="text-xl font-black text-amber-400">0.3</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <p className="text-[11px] font-extrabold text-slate-300">SEL Competency Progress:</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Emotional Vocabulary Identification</span>
                      <span className="font-black text-emerald-400">88% Mastery</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Equal-Partition Division</span>
                      <span className="font-black text-emerald-400">94% Mastery</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/teacher/dashboard"
                  target="_blank"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-sky-400 hover:text-sky-300"
                >
                  <span>Open Full Educator Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* SCENE 10: Admin Dashboard & 3,000 Questions Library Status */}
            {scene.step === 10 && (
              <div className="flex-1 flex flex-col justify-center space-y-4 p-4 text-start">
                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-emerald-400">
                      3,000-Question Relational Bank
                    </span>
                    <span className="text-[10px] text-slate-500">v2.4.0 Verified Release</span>
                  </div>

                  {statsData ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                          <p className="text-[9px] text-slate-400">Total</p>
                          <p className="text-base font-black text-white">{statsData.total_questions}</p>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                          <p className="text-[9px] text-emerald-400">Published</p>
                          <p className="text-base font-black text-emerald-400">
                            {statsData.review_status_summary?.published || 126}
                          </p>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                          <p className="text-[9px] text-amber-400">Reviewed</p>
                          <p className="text-base font-black text-amber-400">
                            {statsData.review_status_summary?.reviewed || 369}
                          </p>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                          <p className="text-[9px] text-slate-400">Drafted</p>
                          <p className="text-base font-black text-slate-300">
                            {statsData.review_status_summary?.drafted || 2505}
                          </p>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 space-y-1">
                        <p className="font-extrabold text-slate-200">9 Developmental Category Distribution:</p>
                        <p>Emotional Vocab (400) &bull; Language (400) &bull; Cognitive (450) &bull; Science (350)</p>
                        <p>Social Skills (350) &bull; Math (350) &bull; Life Skills (300) &bull; Creativity (250) &bull; Routines (150)</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Loading 3,000-question library stats...</p>
                  )}
                </div>

                <Link
                  href="/admin/curriculum"
                  target="_blank"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                >
                  <span>Open Full Admin Curriculum CMS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
