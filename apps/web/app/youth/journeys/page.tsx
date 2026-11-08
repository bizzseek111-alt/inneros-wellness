"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChildNavigationShell } from "@/components/youth/ChildNavigationShell";
import { useYouth } from "@/components/youth/YouthContext";
import {
  WEEBLY_V10_JOURNEYS,
  LearningJourney,
  JourneyStageId,
} from "@/lib/v10-journey-engine";
import { LearningJourneyPlayer } from "@/components/v10/LearningJourneyPlayer";
import { Sparkles, Play, BookOpen, CheckCircle2, ArrowRight } from "lucide-react";

function JourneysHubInner() {
  const searchParams = useSearchParams();
  const initialId = searchParams?.get("id");
  const initialStage = (searchParams?.get("stage") as JourneyStageId) || "watch";
  const { locale } = useYouth();

  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(initialId);
  const [subjectFilter, setSubjectFilter] = useState<string>("all");

  const activeJourney: LearningJourney | undefined = WEEBLY_V10_JOURNEYS.find(
    (j) => j.journey_id === selectedJourneyId
  );

  const normalizedLocale: "en" | "ur" | "pa" =
    locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en";

  const filteredJourneys = WEEBLY_V10_JOURNEYS.filter((j) => {
    if (subjectFilter === "all") return true;
    return j.subject.toLowerCase() === subjectFilter.toLowerCase();
  });

  if (activeJourney) {
    return (
      <div className="space-y-6">
        <LearningJourneyPlayer
          journey={activeJourney}
          initialStage={initialStage}
          locale={normalizedLocale}
          onExit={() => setSelectedJourneyId(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-white border-2 border-slate-900 p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Weebly V10 • Watch → Learn → Play → Implement → Reflect</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            Interactive Learning Journeys
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Pick a guided 5-step journey below! You can start with the animated story, jump straight into the game, or practice a real-world project at your own pace.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/youth/creator"
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-extrabold hover:bg-indigo-700"
          >
            Open AI Creator Academy →
          </Link>
          <Link
            href="/youth/passport"
            className="px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-slate-300 text-slate-900 text-xs font-bold hover:bg-slate-100"
          >
            My Skills Passport
          </Link>
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          "all",
          "Mathematics",
          "Storytelling",
          "Foundational Attention Practice",
          "AI Literacy",
          "Creative Project",
          "Life Skills",
        ].map((subj) => (
          <button
            key={subj}
            type="button"
            onClick={() => setSubjectFilter(subj)}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition ${
              subjectFilter === subj
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {subj === "all" ? "All 6 Subjects" : subj}
          </button>
        ))}
      </div>

      {/* Journey Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJourneys.map((j) => (
          <div
            key={j.journey_id}
            className="rounded-3xl bg-white border-2 border-slate-900 p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold">
                  {j.subject}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Ages {j.age_band} • {j.estimated_duration}
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 mt-4">
                {j.title}
              </h2>
              <p className="text-xs font-semibold text-indigo-700 mt-1">
                Guide: {j.learn_content.mentor.toUpperCase()} • {j.grade}
              </p>
              <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                {j.learning_objective}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {j.accessibility_options.slice(0, 3).map((acc) => (
                  <span
                    key={acc}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold"
                  >
                    {acc}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedJourneyId(j.journey_id)}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Journey</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function YouthJourneysPage() {
  return (
    <ChildNavigationShell activeTab="play">
      <Suspense fallback={<div className="p-8 text-center font-bold">Loading Learning Journeys...</div>}>
        <JourneysHubInner />
      </Suspense>
    </ChildNavigationShell>
  );
}
