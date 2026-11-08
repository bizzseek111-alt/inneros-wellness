"use client";

import React from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { JourneyEngineInteractivePreview } from "@/components/v10/HomepageInteractiveSections";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Users, Accessibility } from "lucide-react";

export default function LearningMethodPage() {
  return (
    <MarketingShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        {/* Hero & Value Proposition */}
        <section className="rounded-3xl bg-white border-2 border-slate-900 p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-950 text-xs font-extrabold">
              <Sparkles className="w-4 h-4" />
              <span>Pillar 01 • Learn with AI • Pedagogical Architecture</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
              STATUS: LIVE AND VERIFIED (/youth/journeys)
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            The Weebly Learning Method: Watch → Learn → Play → Implement → Reflect
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            Designed for <strong>children (Ages 2–18), parents, and classroom educators</strong>, Weebly&apos;s 5-stage Learning Journey Engine transforms screen time into active comprehension, hands-on practice, real-world family or classroom transfer, and self-reflection.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/youth/journeys"
              className="px-6 py-3.5 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-black inline-flex items-center gap-2"
            >
              <span>Launch Live 5-Stage Journeys</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demos?demo=child"
              className="px-6 py-3.5 rounded-2xl bg-[#FAF7F2] border-2 border-slate-900 text-slate-900 text-xs sm:text-sm font-black"
            >
              Try Guided Child Demo
            </Link>
          </div>
        </section>

        {/* Interactive Preview */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900">
            Interactive 5-Stage Sequence Preview
          </h2>
          <JourneyEngineInteractivePreview />
        </section>

        {/* Audience, Actual Functions, Age Applicability, Accessibility & Safety */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <Users className="w-5 h-5 text-teal-700" />
            <h3 className="text-base font-black text-slate-900">Audience &amp; Age Applicability</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Ages 2–5:</strong> Caregiver-mediated picture &amp; audio stories.<br />
              <strong>Ages 6–12:</strong> Full 5-stage journeys across Math, Reading, AI Literacy &amp; Life Skills.<br />
              <strong>Ages 13–18:</strong> Socratic study &amp; project transfer.
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-black text-slate-900">Actual Verified Functions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              6 complete working journeys in `lib/v10-journey-engine.ts`, stage-skipping flexibility, save-for-later progress, and structured `journey_started` / `journey_completed` events.
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <Accessibility className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-black text-slate-900">Accessibility &amp; Languages</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Captions, full text transcripts, spoken audio guidance in English, Urdu (اردو), and Punjabi (پنجابی), AAC quick-response bar, and zero countdown pressure.
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <ShieldCheck className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-black text-slate-900">Safety &amp; Media Boundaries</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Zero unverified external YouTube/video embeds. All Watch stages use original Weebly illustrated storyboards reviewed through the 5-stage Admin CMS.
            </p>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
