"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Play,
  BookOpen,
  Gamepad2,
  Hammer,
  HeartHandshake,
  ArrowRight,
  Brain,
  Sliders,
  Volume2,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";

/* ============================================================================
 * SECTION 03 INTERACTIVE PREVIEW: WATCH → LEARN → PLAY → IMPLEMENT → REFLECT
 * ========================================================================== */
const JOURNEY_STEPS = [
  {
    id: "watch",
    step: "01",
    name: "WATCH",
    title: "Illustrated Storyboard & Calm Audio",
    desc: "Children begin with a short, original illustrated story with captions and trilingual narration—never unverified external video embeds.",
    example: "Mango Orchard Scene: Kai & Mia have 12 ripe mangoes and 3 woven baskets.",
    badge: "Original Accessible Media",
    color: "bg-teal-600 text-white",
    panelBg: "bg-teal-50 border-teal-300",
  },
  {
    id: "learn",
    step: "02",
    name: "LEARN",
    title: "Companion-Guided Visual Concept",
    desc: "Kai explains equal sharing step by step, adapting the vocabulary to the child's age band and language preference (EN / اردو / پنجابی).",
    example: "“When we place 1 mango into each of the 3 baskets four times, every friend gets 4!”",
    badge: "Character-Guided Explanation",
    color: "bg-indigo-600 text-white",
    panelBg: "bg-indigo-50 border-indigo-300",
  },
  {
    id: "play",
    step: "03",
    name: "PLAY",
    title: "Interactive Practice & Decision Puzzle",
    desc: "Children actively solve a hands-on puzzle, quiz, or block sequence with gentle, non-punitive hints.",
    example: "Interactive Check: If 4 friends share 12 mangoes equally, how many does each friend receive? (Answer: 3)",
    badge: "Active Problem Solving",
    color: "bg-amber-500 text-slate-950",
    panelBg: "bg-amber-50 border-amber-300",
  },
  {
    id: "implement",
    step: "04",
    name: "IMPLEMENT",
    title: "Real-World Family or Digital Transfer",
    desc: "Learning moves beyond the screen—children apply the concept in a physical home activity, classroom task, or Creator Studio project.",
    example: "Offline Task: Count 12 spoons or blocks at home and share them equally among family members.",
    badge: "Screen-to-Life Transfer",
    color: "bg-emerald-600 text-white",
    panelBg: "bg-emerald-50 border-emerald-300",
  },
  {
    id: "reflect",
    step: "05",
    name: "REFLECT",
    title: "Child Feeling Check-In & Caregiver Summary",
    desc: "Children choose how the activity felt, log their milestone to the private Skills Passport, and share an optional summary with parents.",
    example: "Child Reflection: “🌟 Proud — I explained fair sharing to my younger brother!”",
    badge: "Metacognition & Portfolio",
    color: "bg-rose-600 text-white",
    panelBg: "bg-rose-50 border-rose-300",
  },
];

export const JourneyEngineInteractivePreview: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = JOURNEY_STEPS[activeIdx];

  return (
    <div className="rounded-[32px] bg-white border-2 border-slate-900 p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-6">
      {/* Connected 5-Stage Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5" role="tablist" aria-label="Learning Journey Stages">
        {JOURNEY_STEPS.map((st, idx) => {
          const isCurrent = idx === activeIdx;
          return (
            <button
              key={st.id}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              onClick={() => setActiveIdx(idx)}
              className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                isCurrent
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-[#FAF7F2] text-slate-800 border-slate-200 hover:border-slate-900"
              }`}
            >
              <span className={`text-[10px] font-black uppercase ${isCurrent ? "text-amber-300" : "text-slate-400"}`}>
                Stage {st.step}
              </span>
              <span className="text-sm font-black mt-1">{st.name}</span>
            </button>
          );
        })}
      </div>

      {/* Stage Detail Card */}
      <div className={`rounded-3xl border-2 p-6 sm:p-8 transition-all ${current.panelBg}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold ${current.color}`}>
              Stage {current.step}: {current.name} • {current.badge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{current.title}</h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{current.desc}</p>
          </div>
          <div className="lg:col-span-5 rounded-2xl bg-white border-2 border-slate-900 p-5 space-y-3 shadow-sm">
            <div className="text-xs font-black uppercase text-slate-400">Live Journey Example</div>
            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">{current.example}</p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveIdx((prev) => (prev + 1) % JOURNEY_STEPS.length)}
                className="text-xs font-extrabold text-indigo-600 hover:underline inline-flex items-center gap-1"
              >
                <span>Next Stage ({JOURNEY_STEPS[(activeIdx + 1) % JOURNEY_STEPS.length].name})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <Link
                href="/youth/journeys"
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-extrabold"
              >
                Try Full Journey →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * SECTION 07 INTERACTIVE PREVIEW: FOUNDATIONAL SKILLS TRANSFORMING PUZZLE
 * ========================================================================== */
export const FoundationalSkillsInteractivePreview: React.FC = () => {
  const [ruleMode, setRuleMode] = useState<"color" | "shape">("color");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const targetCard = { label: "Blue Star", icon: "💙⭐", colorMatch: "Blue Circle 💙⚪", shapeMatch: "Gold Star 💛⭐" };
  const options = ["Blue Circle 💙⚪", "Gold Star 💛⭐", "Green Leaf 💚🌿"];
  const expected = ruleMode === "color" ? targetCard.colorMatch : targetCard.shapeMatch;

  return (
    <div className="rounded-[32px] bg-white border-2 border-slate-900 p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <div className="lg:col-span-6 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-extrabold">
          <Brain className="w-3.5 h-3.5" />
          <span>Interactive Preview • “Switch the Rule” (Cognitive Flexibility)</span>
        </div>
        <h3 className="text-2xl font-black text-slate-900">
          Practice Attention, Working Memory, Planning &amp; Flexible Thinking
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Try flipping the sorting rule below! When the rule switches from <strong>Match by Color</strong> to <strong>Match by Shape</strong>, the child practices inhibiting their previous habit and adapting to a new rule—without timers, stress, or clinical scoring.
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setRuleMode("color");
              setSelectedAnswer(null);
            }}
            className={`px-4 py-2.5 rounded-xl border-2 text-xs font-black transition ${
              ruleMode === "color"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-slate-50 text-slate-700 border-slate-300"
            }`}
          >
            Rule A: Match by COLOR 🎨
          </button>
          <button
            type="button"
            onClick={() => {
              setRuleMode("shape");
              setSelectedAnswer(null);
            }}
            className={`px-4 py-2.5 rounded-xl border-2 text-xs font-black transition ${
              ruleMode === "shape"
                ? "bg-amber-500 text-slate-950 border-amber-500"
                : "bg-slate-50 text-slate-700 border-slate-300"
            }`}
          >
            Rule B: Switch to SHAPE ⭐
          </button>
        </div>
      </div>

      <div className="lg:col-span-6 rounded-3xl bg-[#FAF7F2] border-2 border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase text-slate-500">
            Target Card: <strong className="text-slate-900">{targetCard.label} {targetCard.icon}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold">
            Active Rule: {ruleMode.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {options.map((opt) => {
            const picked = selectedAnswer === opt;
            const isCorrect = opt === expected;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setSelectedAnswer(opt)}
                className={`p-4 rounded-2xl border-2 text-center text-xs font-black transition ${
                  picked
                    ? isCorrect
                      ? "bg-emerald-100 border-emerald-600 text-emerald-950"
                      : "bg-amber-100 border-amber-500 text-amber-950"
                    : "bg-white border-slate-200 hover:border-slate-900 text-slate-800"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {selectedAnswer && (
          <div className="rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800">
            {selectedAnswer === expected
              ? `✨ Spot on! Under the ${ruleMode.toUpperCase()} rule, "${selectedAnswer}" matches the ${targetCard.label}!`
              : `💡 Gentle Hint: Check the active rule (${ruleMode.toUpperCase()}). Try selecting "${expected}"!`}
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
 * SECTION 09 INTERACTIVE PREVIEW: INCLUSIVE LEARNING & AAC SANDBOX
 * ========================================================================== */
const AAC_TILES = [
  { emoji: "🐢", label: "Go Slowly Please", speech: "Let's go slowly please, one step at a time." },
  { emoji: "🎧", label: "Quiet Sensory Mode", speech: "I would like quiet sensory mode right now." },
  { emoji: "🤝", label: "Help Me Start", speech: "Can you help me start the first step?" },
  { emoji: "🌿", label: "Breathing Break", speech: "I need a calm breathing break." },
];

export const InclusiveLearningInteractivePreview: React.FC = () => {
  const [calmSurface, setCalmSurface] = useState(false);
  const [wideSpacing, setWideSpacing] = useState(false);
  const [spokenPhrase, setSpokenPhrase] = useState<string | null>(null);

  const triggerAac = (phrase: string) => {
    setSpokenPhrase(phrase);
    voiceSynthesizer.speak(phrase, { locale: "en" });
  };

  return (
    <div
      className={`rounded-[32px] border-2 border-slate-900 p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] transition-all ${
        calmSurface ? "bg-[#F3EFE6]" : "bg-white"
      } ${wideSpacing ? "tracking-wide leading-relaxed" : ""}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold">
            <Sliders className="w-3.5 h-3.5" />
            <span>Live Adjustable Interface &amp; Visual Communication</span>
          </span>
          <h3 className="text-2xl font-black text-slate-900">
            Designed for Neurodivergent Comfort, Predictability &amp; Agency
          </h3>
          <p className="text-sm text-slate-600">
            Every child learns differently. Weebly provides ADHD-friendly single-task focus, autism-affirming visual schedules, dyslexic-friendly reading spacing, and tap-to-speak AAC communication tiles—celebrating neurodiversity without ever framing autism as something to &ldquo;cure.&rdquo;
          </p>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => setCalmSurface((v) => !v)}
              className={`px-4 py-2.5 rounded-xl border-2 text-xs font-black transition ${
                calmSurface
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-[#FAF7F2] text-slate-800 border-slate-300"
              }`}
            >
              {calmSurface ? "✓ Low-Stimulation Surface ON" : "Toggle Low-Stimulation Surface"}
            </button>
            <button
              type="button"
              onClick={() => setWideSpacing((v) => !v)}
              className={`px-4 py-2.5 rounded-xl border-2 text-xs font-black transition ${
                wideSpacing
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-[#FAF7F2] text-slate-800 border-slate-300"
              }`}
            >
              {wideSpacing ? "✓ Wide Reading Spacing ON" : "Toggle Wide Reading Spacing"}
            </button>
          </div>
        </div>

        {/* AAC Tap-to-Speak Board */}
        <div className="lg:col-span-6 rounded-3xl bg-[#FAF7F2] border-2 border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-slate-500">
              AAC Tap-to-Speak Communication Strip
            </span>
            <Volume2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {AAC_TILES.map((tile) => (
              <button
                key={tile.label}
                type="button"
                onClick={() => triggerAac(tile.speech)}
                className="p-3.5 rounded-2xl bg-white border-2 border-slate-200 hover:border-indigo-500 text-left flex items-center gap-3 transition"
              >
                <span className="text-2xl">{tile.emoji}</span>
                <div>
                  <div className="text-xs font-black text-slate-900">{tile.label}</div>
                  <div className="text-[11px] text-slate-500">Tap to speak aloud</div>
                </div>
              </button>
            ))}
          </div>
          {spokenPhrase && (
            <div className="rounded-xl bg-indigo-50 border border-indigo-200 px-3.5 py-2 text-xs font-bold text-indigo-950">
              🔊 Spoken Aloud: &ldquo;{spokenPhrase}&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
