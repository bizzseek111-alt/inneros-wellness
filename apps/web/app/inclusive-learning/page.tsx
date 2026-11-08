"use client";

import React from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { InclusiveLearningInteractivePreview } from "@/components/v10/HomepageInteractiveSections";
import { Sliders, ArrowRight, ShieldCheck, CheckCircle2, Users, Accessibility } from "lucide-react";

export default function InclusiveLearningDedicatedPage() {
  return (
    <MarketingShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        <section className="rounded-3xl bg-white border-2 border-slate-900 p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-950 text-xs font-extrabold">
              <Sliders className="w-4 h-4" />
              <span>Pillar 04 • Inclusive Learning &amp; Neurodiversity-Affirming Design</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
              STATUS: LIVE AND VERIFIED (/youth/visual-supports &amp; /youth/routines)
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Inclusive Learning: ADHD-Friendly Focus, Autism-Affirming Routines &amp; AAC
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            Built for <strong>neurodivergent and neurotypical learners (Ages 2–18), families, and inclusive classrooms</strong>. Weebly adapts to the learner with predictable visual schedules, single-task focus modes, tap-to-speak AAC boards, and reading accessibility—never framing autism as a disorder to &ldquo;cure.&rdquo;
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/youth/visual-supports"
              className="px-6 py-3.5 rounded-2xl bg-emerald-800 text-white text-xs sm:text-sm font-black inline-flex items-center gap-2"
            >
              <span>Open AAC &amp; Visual Supports</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/youth/routines"
              className="px-6 py-3.5 rounded-2xl bg-[#FAF7F2] border-2 border-slate-900 text-slate-900 text-xs sm:text-sm font-black"
            >
              Open Visual Daily Routines
            </Link>
            <Link
              href="/demos?demo=child"
              className="px-5 py-3.5 rounded-2xl bg-amber-400 text-slate-950 text-xs sm:text-sm font-black"
            >
              Try Guided Demo
            </Link>
          </div>
        </section>

        {/* Interactive AAC & Sensory Sandbox */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900">
            Interactive Preview: Sensory Controls &amp; Tap-to-Speak AAC Strip
          </h2>
          <InclusiveLearningInteractivePreview />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <Users className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-black text-slate-900">Audience &amp; Ages</h3>
            <p className="text-xs text-slate-600">
              Ages 2–18 across home and school settings, supporting ADHD focus needs, autistic predictability, and emergent bilingual speakers.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-black text-slate-900">Actual Functions</h3>
            <p className="text-xs text-slate-600">
              `/youth/visual-supports`, `/youth/routines`, `/youth/accessibility`, and built-in AAC bars in `/youth/journeys` and `/youth/skills-lab`.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <Accessibility className="w-5 h-5 text-teal-700" />
            <h3 className="text-base font-black text-slate-900">Sensory &amp; Reading</h3>
            <p className="text-xs text-slate-600">
              Reduced-motion compliance (`prefers-reduced-motion`), low-stimulation warm paper surfaces, and adjustable reading spacing.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <ShieldCheck className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-black text-slate-900">Affirming Boundary</h3>
            <p className="text-xs text-slate-600">
              Strength-based educational accommodation—never medical treatment, speech therapy replacement, or diagnostic screening.
            </p>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
