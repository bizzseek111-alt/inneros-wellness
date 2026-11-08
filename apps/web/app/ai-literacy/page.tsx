"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { SearchCheck, ArrowRight, ShieldCheck, CheckCircle2, Users, Accessibility } from "lucide-react";

const DETECTIVE_CASES = [
  {
    id: "hallucination",
    title: "Case 01 • Spotting AI Hallucinations",
    claim: "A computer bot says: 'Elephants can fly over the Karakoram mountains using their ears as propellers.'",
    correctAction: "Verify with a science book or teacher — AI predicts words from patterns and can invent false facts!",
  },
  {
    id: "privacy",
    title: "Case 02 • Protecting Family Privacy",
    claim: "An online puzzle asks for your home street address, school name, and parent's phone number.",
    correctAction: "Stop immediately! Never share private personal or family information online.",
  },
  {
    id: "fairness",
    title: "Case 03 • Dataset Fairness & Inclusion",
    claim: "A sorting program only trained on green apples marks a red apple as 'not a fruit'.",
    correctAction: "Add diverse examples to the training set so the program treats every example fairly.",
  },
];

export default function AILiteracyPage() {
  const [selectedCase, setSelectedCase] = useState(0);
  const [revealed, setRevealed] = useState(false);

  return (
    <MarketingShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        <section className="rounded-3xl bg-white border-2 border-slate-900 p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-950 text-xs font-extrabold">
              <SearchCheck className="w-4 h-4" />
              <span>AI Literacy &amp; Responsible AI Curriculum • Ages 5–18</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
              STATUS: LIVE AND VERIFIED (/youth/creator?tool=ai_detective)
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Understand AI. Create with AI. Detect Mistakes. Protect Privacy.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            Built for <strong>students (Ages 5–18), parents, and school leaders</strong>. Weebly demystifies artificial intelligence so children recognize that AI is software—never a sentient friend—and develop lifelong habits of source verification, privacy protection, and critical thinking (aligned with international student AI competency themes without claiming official UNESCO endorsement).
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/youth/creator?tool=ai_detective"
              className="px-6 py-3.5 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-black inline-flex items-center gap-2"
            >
              <span>Launch AI Detective Cases</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demos?demo=teen"
              className="px-6 py-3.5 rounded-2xl bg-[#FAF7F2] border-2 border-slate-900 text-slate-900 text-xs sm:text-sm font-black"
            >
              Try Guided AI Literacy Demo
            </Link>
          </div>
        </section>

        {/* Interactive AI Detective Case Explorer */}
        <section className="rounded-3xl bg-white border-2 border-slate-900 p-6 sm:p-8 space-y-6">
          <h2 className="text-2xl font-black text-slate-900">
            Interactive Preview: AI Detective Investigation Lab
          </h2>
          <div className="flex flex-wrap gap-2">
            {DETECTIVE_CASES.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedCase(idx);
                  setRevealed(false);
                }}
                className={`px-4 py-2.5 rounded-xl border-2 text-xs font-black ${
                  selectedCase === idx
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-[#FAF7F2] text-slate-800 border-slate-200"
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>

          <div className="rounded-2xl bg-[#FAF7F2] border border-slate-200 p-6 space-y-4">
            <p className="text-sm sm:text-base font-bold text-slate-900">{DETECTIVE_CASES[selectedCase].claim}</p>
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="px-5 py-2.5 rounded-xl bg-teal-700 text-white text-xs font-black"
            >
              🔍 Reveal AI Detective Conclusion
            </button>
            {revealed && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs sm:text-sm font-bold text-emerald-950">
                ✓ {DETECTIVE_CASES[selectedCase].correctAction}
              </div>
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <Users className="w-5 h-5 text-teal-700" />
            <h3 className="text-base font-black text-slate-900">Age Applicability</h3>
            <p className="text-xs text-slate-600">
              Readiness-based progression from Age 5 (spotting silly computer mistakes) to Ages 16–18 (model evaluation &amp; verification rubrics).
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-black text-slate-900">Actual Functions</h3>
            <p className="text-xs text-slate-600">
              <em>Young AI Inventors</em> &amp; <em>AI Detective</em> modules in `/youth/creator`, plus the 5-stage AI Literacy Journey (`jrn_ai_literacy_what_is_ai`).
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <Accessibility className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-black text-slate-900">Accessibility</h3>
            <p className="text-xs text-slate-600">
              Audio read-aloud for every case, clear visual badges, and bilingual vocabulary explanations in English, Urdu, and Punjabi.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <ShieldCheck className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-black text-slate-900">Safety Boundaries</h3>
            <p className="text-xs text-slate-600">
              Explicit AI disclosure on every companion screen; strict anti-secrecy rule (&ldquo;I can&apos;t keep secrets from your parents or teachers&rdquo;).
            </p>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
