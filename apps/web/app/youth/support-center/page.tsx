"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Clock,
  Calendar,
  Volume2,
  VolumeX,
  Eye,
  Sliders,
  CheckCircle2,
  Circle,
  ShieldAlert,
  Info,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Compass,
  FileText,
  UserCheck,
  Heart,
  HelpCircle,
  Layers,
  Smile,
  Activity,
  Star,
  Zap,
} from "lucide-react";
import { YouthShell } from "@/components/youth/YouthShell";
import { VisualTimer } from "@/components/youth/VisualTimer";
import { VisualScheduleCard } from "@/components/youth/VisualScheduleCard";
import { useYouth } from "@/components/youth/YouthContext";
import { apiClient } from "@/lib/api-client";

type SupportModule = "adhd" | "autism" | "learning" | "cognitive" | "caregiver";

export default function YouthSupportCenterPage() {
  const { ageTier, locale, localeMeta, isLowStimulation, toggleLowStimulation } = useYouth();

  const [activeModule, setActiveModule] = useState<SupportModule>("adhd");
  const [tasks, setTasks] = useState<any[]>([]);
  const [aacSymbols, setAacSymbols] = useState<any[]>([]);
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [caregiverGuides, setCaregiverGuides] = useState<any[]>([]);
  const [regulatoryNotice, setRegulatoryNotice] = useState<any | null>(null);

  // Module A (ADHD) State
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [movementBreakActive, setMovementBreakActive] = useState(false);
  const [transitionWarningActive, setTransitionWarningActive] = useState(false);
  const [starCount, setStarCount] = useState(3);

  // Module B (Autism / AAC) State
  const [selectedAACCategory, setSelectedAACCategory] = useState<string>("all");
  const [speakingAAC, setSpeakingAAC] = useState<string | null>(null);
  const [specialInterest, setSpecialInterest] = useState<string>("space");
  const [volumeLevel, setVolumeLevel] = useState<number>(50);
  const [calmFilterActive, setCalmFilterActive] = useState(false);
  const [openDyslexicActive, setOpenDyslexicActive] = useState(false);
  const [textSizeMultiplier, setTextSizeMultiplier] = useState<number>(1.0);

  // Module C (Learning Differences) Read-Aloud State
  const [readAloudIndex, setReadAloudIndex] = useState<number>(0);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const sampleStoryWords = [
    "Little", "Lumi", "floats", "quietly", "over", "the", "green", "trees.",
    "The", "forest", "is", "peaceful,", "and", "every", "animal", "takes", "a", "calm", "belly", "breath."
  ];

  // Module D (Cognitive Practice) State
  const [sequencedSteps, setSequencedSteps] = useState<number[]>([2, 1, 3]);
  const [sequenceSuccess, setSequenceSuccess] = useState(false);
  const [backpackItems, setBackpackItems] = useState<string[]>([]);
  const [demonstratedSkills, setDemonstratedSkills] = useState<string[]>([
    "Completed 3-Step Morning Routine",
    "Used Visual AAC Symbol to Express Need",
    "Engaged in 10-Minute Focus Sprint",
  ]);

  // Load backend content
  useEffect(() => {
    async function loadData() {
      try {
        const [taskData, aacData, accData, gameData, guideData, noticeData] = await Promise.all([
          apiClient.getEducationalTasks(),
          apiClient.getAACSymbols(),
          apiClient.getClassroomAccommodations(),
          apiClient.getCognitiveGames(),
          apiClient.getCaregiverGuidance(),
          apiClient.getRegulatoryNotice(),
        ]);
        setTasks(taskData);
        setAacSymbols(aacData);
        setAccommodations(accData);
        setGames(gameData);
        setCaregiverGuides(guideData);
        setRegulatoryNotice(noticeData);
      } catch (e) {
        // Fallback gracefully to offline defaults
      }
    }
    loadData();
  }, []);

  const toggleTaskStep = (stepId: string) => {
    setCheckedSteps((prev) => {
      const next = !prev[stepId];
      if (next) setStarCount((c) => c + 1);
      return { ...prev, [stepId]: next };
    });
  };

  const speakAACPhrase = (symbol: any) => {
    setSpeakingAAC(symbol.label_en);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text = locale === "ur" ? symbol.speech_phrase_ur : locale === "pa" ? symbol.speech_phrase_pa : symbol.speech_phrase_en;
      const u = new SpeechSynthesisUtterance(text);
      u.volume = volumeLevel / 100;
      u.rate = 0.85;
      u.onend = () => setSpeakingAAC(null);
      window.speechSynthesis.speak(u);
    } else {
      setTimeout(() => setSpeakingAAC(null), 2000);
    }
  };

  const handleReadAloud = () => {
    if (isReadingAloud) {
      setIsReadingAloud(false);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    setIsReadingAloud(true);
    setReadAloudIndex(0);

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx >= sampleStoryWords.length) {
        clearInterval(interval);
        setIsReadingAloud(false);
      } else {
        setReadAloudIndex(idx);
      }
    }, 450);
  };

  const handleCheckSequence = (newOrder: number[]) => {
    setSequencedSteps(newOrder);
    if (newOrder[0] === 1 && newOrder[1] === 2 && newOrder[2] === 3) {
      setSequenceSuccess(true);
      if (!demonstratedSkills.includes("Mastered 3-Step Sequence")) {
        setDemonstratedSkills([...demonstratedSkills, "Mastered 3-Step Sequence"]);
      }
    } else {
      setSequenceSuccess(false);
    }
  };

  const toggleBackpackItem = (item: string) => {
    if (backpackItems.includes(item)) {
      setBackpackItems(backpackItems.filter((i) => i !== item));
    } else {
      setBackpackItems([...backpackItems, item]);
    }
  };

  return (
    <YouthShell
      activeScreen="support_center"
      title="Educational Support Center"
      subtitle="Neurodiversity-affirming tools for attention, communication, sensory regulation, and executive function."
    >
      <div className={`max-w-5xl mx-auto space-y-8 ${calmFilterActive ? "contrast-95 saturate-80" : ""}`}>
        {/* Ethical Non-Clinical Disclaimer Banner */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-semibold flex items-start space-x-3 shadow-xs">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-extrabold block text-amber-900">
              Educational & Accessibility Support Tool &bull; Non-Medical Sanctuary
            </span>
            <p className="leading-relaxed">
              Weebly does not diagnose ADHD, autism, or learning differences, does not generate clinical probability scores, and does not claim to cure or normalize neurodivergent minds. Harmless self-regulatory behaviors (stimming) and non-eye-contact listening are respected as natural nervous system regulation.
            </p>
          </div>
        </div>

        {/* 5-Module Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 p-1.5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs">
          {[
            { id: "adhd", label: "Module A: ADHD Routines", icon: Clock },
            { id: "autism", label: "Module B: Autism & AAC", icon: Heart },
            { id: "learning", label: "Module C: Learning Differences", icon: BookOpen },
            { id: "cognitive", label: "Module D: Cognitive Games", icon: Activity },
            { id: "caregiver", label: "Module E: Caregiver & School", icon: UserCheck },
          ].map((m) => {
            const Icon = m.icon;
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id as SupportModule)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  isActive
                    ? "bg-[#0E87E3] text-white shadow-xs scale-102"
                    : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* MODULE A: ADHD-FRIENDLY SUPPORT */}
        {/* ========================================================= */}
        {activeModule === "adhd" && (
          <div className="space-y-8 animate-fade-in">
            {/* Visual Timer Sprint & Transition Advance Warning */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <VisualTimer initialMinutes={10} label="ADHD Focus Sprint (Flexible Lengths)" />
              </div>

              {/* Movement Break & Transition Alert Card */}
              <div className="p-6 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-indigo-700 font-extrabold text-xs uppercase tracking-wider">
                    <Zap className="w-4 h-4" />
                    <span>Regulation Controls</span>
                  </div>
                  <h4 className="font-extrabold text-base text-[#0F172A]">Movement & Transition</h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Nervous systems need motor breaks. Tap below for a zero-shame wiggle break or advance transition heads-up.
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setMovementBreakActive(!movementBreakActive)}
                    className="w-full py-3 px-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-extrabold text-xs flex items-center justify-center space-x-2 hover:bg-indigo-100 transition-colors"
                  >
                    <span>🤸 2-Min Wiggle & Shake Break</span>
                  </button>

                  <button
                    onClick={() => setTransitionWarningActive(!transitionWarningActive)}
                    className="w-full py-3 px-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs flex items-center justify-center space-x-2 hover:bg-amber-100 transition-colors"
                  >
                    <span>⏳ 2-Min Advance Transition Notice</span>
                  </button>
                </div>

                {movementBreakActive && (
                  <div className="p-3 bg-indigo-100/60 rounded-xl text-xs font-bold text-indigo-950 animate-bounce">
                    🎉 Wiggle your shoulders, roll your head like a turtle, and shake your hands!
                  </div>
                )}
                {transitionWarningActive && (
                  <div className="p-3 bg-amber-100/80 rounded-xl text-xs font-bold text-amber-950 animate-pulse">
                    🔔 Gentle Heads-Up: In 2 minutes, we will finish this step and transition calmly.
                  </div>
                )}
              </div>
            </div>

            {/* Micro-Step Checklist with Star Tokens */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-[#E2E8F0]">
                <div>
                  <h3 className="text-xl font-extrabold text-[#0F172A]">Micro-Step Routine Builder</h3>
                  <p className="text-xs text-[#64748B]">Bite-sized steps broken down into non-overwhelming micro-tasks.</p>
                </div>
                <div className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{starCount} Effort Stars (Zero Streak Penalties)</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { id: "step_1", text: "Clear desk so only 1 notebook is open", icon: "📖" },
                  { id: "step_2", text: "Put phone or noisy tabs on silent", icon: "🔕" },
                  { id: "step_3", text: "Complete first 2 questions or read 1 page", icon: "✏️" },
                  { id: "step_4", text: "Take 3 deep bubble breaths with Lumi", icon: "🫧" },
                ].map((s) => {
                  const done = checkedSteps[s.id];
                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleTaskStep(s.id)}
                      className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                        done
                          ? "bg-emerald-50/60 border-emerald-300 text-emerald-900"
                          : "bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] hover:border-[#CBD5E1]"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{s.icon}</span>
                        <span className={`text-sm font-bold ${done ? "line-through text-emerald-700" : ""}`}>
                          {s.text}
                        </span>
                      </div>
                      {done ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Teacher Classroom Accommodation Suggestions */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-xs font-extrabold uppercase text-[#0E87E3] tracking-wider">
                <FileText className="w-4 h-4" />
                <span>IEP & Classroom Support</span>
              </div>
              <h3 className="text-lg font-extrabold text-[#0F172A]">Teacher Accommodation Strategies</h3>
              <p className="text-xs text-[#64748B]">Practical adjustments for the classroom to share with educators.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {accommodations.map((acc, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-[#CBD5E1] bg-[#FDFBF4] space-y-2 text-start">
                    <span className="font-extrabold text-sm text-[#0F172A] block">{acc.title}</span>
                    <p className="text-xs text-[#64748B] leading-relaxed">{acc.classroom_strategy}</p>
                    <div className="pt-2 border-t border-[#E2E8F0] text-[11px] font-bold text-indigo-700">
                      <strong>Why:</strong> {acc.why_it_helps}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE B: AUTISM-FRIENDLY & AAC SUPPORT */}
        {/* ========================================================= */}
        {activeModule === "autism" && (
          <div className="space-y-8 animate-fade-in">
            {/* Sensory Environment Tuning Controls */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-3 border-[#E2E8F0]">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-5 h-5 text-[#0E87E3]" />
                  <h3 className="font-extrabold text-base text-[#0F172A]">Sensory Stimulation Adjustments</h3>
                </div>
                <span className="text-xs font-bold text-[#64748B]">Fine-tune visual & auditory intensity</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <span className="text-xs font-extrabold text-[#0F172A] block">Sound Volume: {volumeLevel}%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volumeLevel}
                    onChange={(e) => setVolumeLevel(Number(e.target.value))}
                    className="w-full accent-[#0E87E3]"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#0F172A]">Calm Pastel Filter</span>
                  <button
                    onClick={() => setCalmFilterActive(!calmFilterActive)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      calmFilterActive ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {calmFilterActive ? "Active" : "Off"}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#0F172A]">Low Motion (No Floats)</span>
                  <button
                    onClick={() => toggleLowStimulation()}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      isLowStimulation ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {isLowStimulation ? "Active" : "Off"}
                  </button>
                </div>
              </div>
            </div>

            {/* Special Interest Theme Switcher */}
            <div className="p-6 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 block">
                Special-Interest Learning Engagement
              </span>
              <p className="text-xs text-[#64748B]">
                Learning is deeper when anchored in topics the child naturally loves. Pick a theme:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { id: "space", label: "🚀 Deep Space", icon: "🌌" },
                  { id: "dinosaurs", label: "🦖 Dinosaurs", icon: "🦴" },
                  { id: "trains", label: "🚂 Steam Trains", icon: "🛤️" },
                  { id: "ocean", label: "🐋 Ocean Marine", icon: "🌊" },
                  { id: "coding", label: "💻 Coding Blocks", icon: "⚡" },
                  { id: "stars", label: "⭐ Star Constellations", icon: "✨" },
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setSpecialInterest(th.id)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center space-x-1.5 transition-all ${
                      specialInterest === th.id
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9]"
                    }`}
                  >
                    <span>{th.icon}</span>
                    <span>{th.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Picture AAC Communication Board */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-[#E2E8F0]">
                <div>
                  <h3 className="text-xl font-extrabold text-[#0F172A]">Picture AAC Communication Board</h3>
                  <p className="text-xs text-[#64748B]">Tap any card to speak aloud in English, Urdu, or Punjabi.</p>
                </div>
                {speakingAAC && (
                  <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-extrabold animate-pulse flex items-center space-x-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Speaking: &ldquo;{speakingAAC}&rdquo;</span>
                  </div>
                )}
              </div>

              {/* AAC Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {aacSymbols.map((sym) => (
                  <button
                    key={sym.id}
                    onClick={() => speakAACPhrase(sym)}
                    className={`p-4 rounded-[24px] border-2 flex flex-col items-center justify-center space-y-2 text-center transition-all hover:scale-102 hover:shadow-sm ${sym.color_border}`}
                  >
                    <span className="text-3xl">{sym.symbol_glyph}</span>
                    <span className="font-extrabold text-sm text-[#0F172A]">{sym.label_en}</span>
                    <span className="text-[11px] font-bold text-[#64748B]">{sym.label_ur}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE C: LEARNING DIFFERENCES (Dyslexia / Processing) */}
        {/* ========================================================= */}
        {activeModule === "learning" && (
          <div className="space-y-8 animate-fade-in">
            {/* Reading Accessibility Toolbar */}
            <div className="p-6 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-[#0E87E3]" />
                <h3 className="font-extrabold text-base text-[#0F172A]">Reading Accommodation Controls</h3>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setOpenDyslexicActive(!openDyslexicActive)}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-colors ${
                    openDyslexicActive ? "bg-indigo-600 text-white" : "bg-[#F1F5F9] text-[#475569]"
                  }`}
                >
                  Dyslexia Font: {openDyslexicActive ? "ON" : "OFF"}
                </button>

                <div className="flex items-center space-x-1 text-xs font-bold text-[#64748B]">
                  <span>Text Size:</span>
                  {[1.0, 1.25, 1.5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setTextSizeMultiplier(s)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        textSizeMultiplier === s ? "bg-[#0E87E3] text-white" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Read-Aloud Story with Word-by-Word Highlight */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-[#0F172A]">Read-Aloud Story Player</h3>
                  <p className="text-xs text-[#64748B]">Multi-modal visual highlighting with zero penalty for slower reading.</p>
                </div>
                <button
                  onClick={handleReadAloud}
                  className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center space-x-1.5 transition-all ${
                    isReadingAloud ? "bg-rose-500 text-white" : "bg-[#0E87E3] text-white hover:bg-[#0C436F]"
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isReadingAloud ? "Stop Read-Aloud" : "Play Read-Aloud"}</span>
                </button>
              </div>

              {/* Story Canvas */}
              <div
                style={{ fontSize: `${textSizeMultiplier * 18}px`, lineHeight: 1.8 }}
                className={`p-6 rounded-2xl bg-[#FEFDF8] border border-[#CBD5E1] text-[#0F172A] leading-relaxed ${
                  openDyslexicActive ? "font-mono" : ""
                }`}
              >
                {sampleStoryWords.map((word, idx) => {
                  const isCurrent = isReadingAloud && readAloudIndex === idx;
                  return (
                    <span
                      key={idx}
                      className={`inline-block mr-2 px-1 rounded transition-colors ${
                        isCurrent ? "bg-amber-300 font-extrabold scale-110 shadow-xs" : ""
                      }`}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE D: COGNITIVE DEVELOPMENT & EXECUTIVE FUNCTION */}
        {/* ========================================================= */}
        {activeModule === "cognitive" && (
          <div className="space-y-8 animate-fade-in">
            {/* Story Sequencing Game */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-3 border-[#E2E8F0]">
                <div>
                  <h3 className="text-xl font-extrabold text-[#0F172A]">Morning Step Sequencing Game</h3>
                  <p className="text-xs text-[#64748B]">Executive Function: Practice putting steps in temporal order.</p>
                </div>
                {sequenceSuccess && (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold border border-emerald-300">
                    🎉 Excellent Sequencing!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { stepNum: 1, text: "Wake up & stretch like a star ⭐", icon: "🛌" },
                  { stepNum: 2, text: "Wash face & brush teeth 🪥", icon: "🚿" },
                  { stepNum: 3, text: "Put on shoes and backpack 🎒", icon: "👟" },
                ].map((s, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] text-center space-y-2">
                    <span className="text-3xl">{s.icon}</span>
                    <span className="font-extrabold text-sm text-[#0F172A] block">{s.text}</span>
                    <div className="flex justify-center gap-2 pt-2">
                      {[1, 2, 3].map((pos) => (
                        <button
                          key={pos}
                          onClick={() => {
                            const newOrder = [...sequencedSteps];
                            newOrder[pos - 1] = s.stepNum;
                            handleCheckSequence(newOrder);
                          }}
                          className={`w-7 h-7 rounded-full text-xs font-extrabold ${
                            sequencedSteps[pos - 1] === s.stepNum
                              ? "bg-[#0E87E3] text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Astronaut Backpack Planning Game */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-xs font-extrabold uppercase text-indigo-700 tracking-wider">
                <Compass className="w-4 h-4" />
                <span>Executive Function: Forward Planning</span>
              </div>
              <h3 className="text-lg font-extrabold text-[#0F172A]">Astronaut Backpack Planning</h3>
              <p className="text-xs text-[#64748B]">Select the helpful items for your calm space mission:</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { id: "water", name: "Cool Water Bottle", icon: "💧" },
                  { id: "fidget", name: "Soft Star Fidget", icon: "🧸" },
                  { id: "book", name: "Quiet Storybook", icon: "📚" },
                  { id: "soup", name: "Salty Soup (Spills!)", icon: "🥣" },
                ].map((item) => {
                  const selected = backpackItems.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleBackpackItem(item.id)}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center space-y-1.5 transition-all ${
                        selected
                          ? "bg-indigo-50 border-indigo-500 text-indigo-950 font-extrabold scale-102"
                          : "bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1]"
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-xs">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Demonstrated Skill Milestones Log (Non-Diagnostic) */}
            <div className="p-6 rounded-[32px] bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-900 font-extrabold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Demonstrated Educational Skills Log (Skill Mastery Only)</span>
              </div>
              <p className="text-xs text-emerald-950">
                Skills celebrated through organic practice. Never converted to diagnostic or probability scores.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {demonstratedSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-full bg-white border border-emerald-300 text-emerald-900 text-xs font-bold"
                  >
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE E: CAREGIVER GUIDANCE & SCHOOL COLLABORATION */}
        {/* ========================================================= */}
        {activeModule === "caregiver" && (
          <div className="space-y-8 animate-fade-in">
            <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-6">
              <div className="space-y-1 border-b pb-4 border-[#E2E8F0]">
                <h3 className="text-xl font-extrabold text-[#0F172A]">Positive Caregiver & School Collaboration</h3>
                <p className="text-xs text-[#64748B]">
                  Neurodiversity-affirming guidance for home routines, classroom advocacy, and professional referrals.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {caregiverGuides.map((guide, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-3 text-start">
                    <span className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider block">
                      {guide.category.replace("_", " ")}
                    </span>
                    <h4 className="font-extrabold text-base text-[#0F172A]">{guide.title}</h4>
                    <p className="text-xs text-[#64748B] leading-relaxed">{guide.summary}</p>
                    <ul className="text-xs text-[#475569] space-y-1 list-disc list-inside">
                      {guide.key_takeaways?.map((takeaway: string, tIdx: number) => (
                        <li key={tIdx}>{takeaway}</li>
                      ))}
                    </ul>
                    <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] text-xs text-[#0F172A] italic">
                      {guide.sample_dialogue_or_script}
                    </div>
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
