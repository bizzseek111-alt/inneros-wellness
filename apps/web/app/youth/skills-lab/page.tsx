"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChildNavigationShell } from "@/components/youth/ChildNavigationShell";
import {
  FOUNDATIONAL_SKILLS_ACTIVITIES,
  FoundationalSkillActivity,
} from "@/lib/v10-foundational-skills";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  ShieldCheck,
  Sliders,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

const AAC_FEELING_BAR = [
  { emoji: "😊", text: "I am ready to play!" },
  { emoji: "🐢", text: "Let's go slowly please." },
  { emoji: "💡", text: "Can you read the instruction aloud?" },
  { emoji: "🌿", text: "I want a 30-second movement break." },
];

function SkillsLabInner() {
  const searchParams = useSearchParams();
  const initialSkillId = searchParams?.get("skill") || "freeze_and_go";

  const [selectedSkillId, setSelectedSkillId] = useState<string>(initialSkillId);
  const [roundIdx, setRoundIdx] = useState(0);
  const [pickedOption, setPickedOption] = useState<string | null>(null);
  const [completedSkillIds, setCompletedSkillIds] = useState<string[]>([]);
  const [reducedDistraction, setReducedDistraction] = useState(false);
  const [dyslexicSpacing, setDyslexicSpacing] = useState(false);
  const [eventBanner, setEventBanner] = useState<string | null>(null);

  const activeActivity: FoundationalSkillActivity =
    FOUNDATIONAL_SKILLS_ACTIVITIES.find((a) => a.id === selectedSkillId) ||
    FOUNDATIONAL_SKILLS_ACTIVITIES[0];

  const currentRound =
    activeActivity.rounds[roundIdx] || activeActivity.rounds[0];

  const handleCompleteSkill = async () => {
    const nextDone = Array.from(new Set([...completedSkillIds, activeActivity.id]));
    setCompletedSkillIds(nextDone);

    try {
      await fetch("/api/educational/activity-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity_id: `skill_${activeActivity.id}`,
          activity_title: `Foundational Skill: ${activeActivity.title}`,
          category: activeActivity.skill_domain.toLowerCase().replace(/\s+/g, "_"),
          learning_objective: activeActivity.learning_objective,
          completion_status: "completed",
          hints_used_count: 0,
          language_used: "en",
          duration_seconds: 120,
          curriculum_version: "v10.0.0",
        }),
      });
    } catch {
      // ignore offline
    }

    setEventBanner(
      `Recorded educational practice for "${activeActivity.title}" (${activeActivity.skill_domain}) in your Skills Passport!`
    );
    setTimeout(() => setEventBanner(null), 4000);
  };

  return (
    <div
      className={`space-y-8 ${
        dyslexicSpacing ? "tracking-wide leading-relaxed" : ""
      }`}
    >
      {/* Header & Inclusive Sensory Controls */}
      <div className="rounded-3xl bg-white border-2 border-slate-900 p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phase 5 &amp; 6 • Foundational Skills Lab &amp; Inclusive Supports</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            10 Foundational Thinking, Planning &amp; Communication Activities
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            <strong>Educational Skill-Practice Notice:</strong> These activities build everyday attention, working memory, planning, and emotional vocabulary. They are educational games—never clinical assessments or medical diagnoses.
          </p>
        </div>

        {/* Inclusive Sensory & Pacing Toggles */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setReducedDistraction((v) => !v)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 ${
              reducedDistraction
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-[#FAF7F2] text-slate-800 border-slate-300"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{reducedDistraction ? "Reduced Distraction: ON" : "Reduced Distraction"}</span>
          </button>

          <button
            type="button"
            onClick={() => setDyslexicSpacing((v) => !v)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold ${
              dyslexicSpacing
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-[#FAF7F2] text-slate-800 border-slate-300"
            }`}
          >
            {dyslexicSpacing ? "Wide Reading Spacing: ON" : "Wide Reading Spacing"}
          </button>
        </div>
      </div>

      {eventBanner && (
        <div
          role="status"
          className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-900 text-xs font-bold flex items-center justify-between"
        >
          <span>🌟 {eventBanner}</span>
          <Link href="/youth/passport" className="underline font-extrabold">
            View Passport →
          </Link>
        </div>
      )}

      {/* 10 Activity Selector Grid (Hidden when Reduced Distraction is toggled ON) */}
      {!reducedDistraction && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {FOUNDATIONAL_SKILLS_ACTIVITIES.map((act) => {
            const active = act.id === activeActivity.id;
            const done = completedSkillIds.includes(act.id);
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => {
                  setSelectedSkillId(act.id);
                  setRoundIdx(0);
                  setPickedOption(null);
                }}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                  active
                    ? "bg-slate-900 text-white border-slate-900"
                    : done
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                    : "bg-white border-slate-200 text-slate-800 hover:border-slate-900"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold uppercase opacity-75">
                  <span>{act.skill_domain}</span>
                  {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <div className="text-xs font-extrabold mt-1.5">{act.title}</div>
              </button>
            );
          })}
        </div>
      )}

      {/* Active Skill Practice Stage */}
      <div className="rounded-3xl bg-white border-2 border-slate-900 p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-extrabold">
              Skill Domain: {activeActivity.skill_domain} • {activeActivity.age_appropriateness}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
              {activeActivity.title}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              <strong>Objective:</strong> {activeActivity.learning_objective}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                voiceSynthesizer.speak(
                  `${activeActivity.title}. ${activeActivity.instructions}. ${currentRound.prompt}`,
                  { characterId: "lumi", locale: "en" }
                )
              }
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" />
              <span>Read Aloud</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRoundIdx(0);
                setPickedOption(null);
              }}
              className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Round Interactive Box */}
        <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7E0D6] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-emerald-700">
              {currentRound.level} Round ({roundIdx + 1} of {activeActivity.rounds.length})
            </span>
            <span className="text-xs text-slate-500">{activeActivity.instructions}</span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
            {currentRound.prompt}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentRound.options.map((opt) => {
              const selected = pickedOption === opt;
              const isCorrect = opt === currentRound.correct_option;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPickedOption(opt)}
                  className={`p-4 rounded-2xl border-2 text-left text-sm font-extrabold transition ${
                    selected
                      ? isCorrect
                        ? "bg-emerald-600 text-white border-emerald-700"
                        : "bg-amber-50 text-amber-900 border-amber-400"
                      : "bg-white border-slate-300 text-slate-900 hover:border-slate-900"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {pickedOption && (
            <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-bold text-slate-800">
                {pickedOption === currentRound.correct_option
                  ? `🌟 ${currentRound.gentle_feedback}`
                  : "Gentle try! Take a slow breath and tap the other option whenever you're ready."}
              </p>

              {pickedOption === currentRound.correct_option && (
                <div>
                  {roundIdx < activeActivity.rounds.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setRoundIdx((i) => i + 1);
                        setPickedOption(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-extrabold"
                    >
                      Next Practice Round →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCompleteSkill}
                      className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold"
                    >
                      Record Skill Practice ✓
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Offline Extension & Accessibility Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900">
            <strong>Optional Offline Family / Classroom Activity:</strong>{" "}
            {activeActivity.optional_offline_activity}
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex flex-wrap items-center gap-1.5">
            <strong className="mr-1">Accessible Controls:</strong>
            {activeActivity.accessible_controls.map((c) => (
              <span key={c} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* AAC Communication Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase text-slate-400">
            AAC Tap-to-Speak:
          </span>
          {AAC_FEELING_BAR.map((item) => (
            <button
              key={item.text}
              type="button"
              onClick={() => voiceSynthesizer.speak(item.text, { characterId: "lumi", locale: "en" })}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1"
            >
              <span>{item.emoji}</span>
              <span>{item.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FoundationalSkillsLabPage() {
  return (
    <ChildNavigationShell activeTab="play">
      <Suspense fallback={<div className="p-8 text-center font-bold">Loading Foundational Skills Lab...</div>}>
        <SkillsLabInner />
      </Suspense>
    </ChildNavigationShell>
  );
}
