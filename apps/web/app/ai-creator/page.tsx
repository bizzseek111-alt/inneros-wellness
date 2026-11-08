"use client";

import React from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { AICreatorAcademyShowcase } from "@/components/v10/AICreatorAcademyShowcase";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Users, Accessibility } from "lucide-react";

export default function AICreatorDedicatedPage() {
  return (
    <MarketingShell>
      <div className="space-y-14 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="rounded-3xl bg-white border-2 border-slate-900 p-8 sm:p-10 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-950 text-xs font-extrabold">
                <Sparkles className="w-4 h-4" />
                <span>Pillar 02 • Create with AI • Dedicated Product Page</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
                STATUS: LIVE AND VERIFIED (/youth/creator)
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Weebly AI Creator Academy: Human Imagination First
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Built for <strong>young creators (Ages 5–18), parents, and STEM/literacy teachers</strong>. Children author illustrated stories, program playable visual block games, direct 3-scene cartoons, paint original artwork, and investigate how AI works—stored privately by default in their Skills &amp; Creations Passport.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/youth/creator"
                className="px-6 py-3.5 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-black inline-flex items-center gap-2"
              >
                <span>Open Child AI Creator Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/ai-creator-academy"
                className="px-6 py-3.5 rounded-2xl bg-[#FAF7F2] border-2 border-slate-900 text-slate-900 text-xs sm:text-sm font-black"
              >
                View Age 2–18 Competency Matrix
              </Link>
              <Link
                href="/demos?demo=child"
                className="px-5 py-3.5 rounded-2xl bg-amber-400 text-slate-950 text-xs sm:text-sm font-black"
              >
                Try Interactive Demo
              </Link>
            </div>
          </div>
        </div>

        {/* Full Interactive Flagship Workbench */}
        <AICreatorAcademyShowcase />

        {/* Specifications Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <Users className="w-5 h-5 text-amber-700" />
            <h3 className="text-base font-black text-slate-900">Age Applicability</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Age 5:</strong> Icon &amp; caregiver story mode.<br />
              <strong>Age 6:</strong> Visual block game maker (`Move`, `Jump`, `Collision`).<br />
              <strong>Ages 7–18:</strong> Multi-step branching cartoons, debugging &amp; portfolios.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-black text-slate-900">Actual Functions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              6 live tools in `/youth/creator`, undo stacks, playable 5×5 block grid, JSON export, and `/api/youth/creator/projects` persistence.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <Accessibility className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-black text-slate-900">Accessibility</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tap-to-snap blocks (no fine-motor drag required), spoken block labels, high-contrast tiles, and trilingual story prompts.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <ShieldCheck className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-black text-slate-900">Safety &amp; Privacy Boundaries</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Server-side PII/safety moderation filter; `parent_sharing_approved: false` by default; zero public social feed or unmoderated web generation.
            </p>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
