"use client";

import React from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { FoundationalSkillsInteractivePreview } from "@/components/v10/HomepageInteractiveSections";
import { FOUNDATIONAL_SKILLS_ACTIVITIES } from "@/lib/v10-foundational-skills";
import { Brain, ArrowRight, ShieldCheck, CheckCircle2, Users, Accessibility } from "lucide-react";

export default function BrainSkillsDedicatedPage() {
  return (
    <MarketingShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        <section className="rounded-3xl bg-white border-2 border-slate-900 p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-950 text-xs font-extrabold">
              <Brain className="w-4 h-4" />
              <span>Pillar 03 • Build Foundational Skills • 10 Non-Clinical Activities</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
              STATUS: LIVE AND VERIFIED (/youth/skills-lab)
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Foundational Skills Lab: Attention, Memory, Planning &amp; Flexible Thinking
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            Built for <strong>children (Ages 4–14), parents, and learning support teachers</strong>. Weebly&apos;s Foundational Skills Lab offers 10 playful, low-stress practice games that exercise everyday executive function, working memory, sequencing, and self-regulation—without clinical diagnosis claims or IQ scoring.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/youth/skills-lab"
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 text-white text-xs sm:text-sm font-black inline-flex items-center gap-2"
            >
              <span>Open Foundational Skills Lab</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demos?demo=child"
              className="px-6 py-3.5 rounded-2xl bg-[#FAF7F2] border-2 border-slate-900 text-slate-900 text-xs sm:text-sm font-black"
            >
              Try Guided Demo
            </Link>
          </div>
        </section>

        {/* Interactive Transforming Puzzle Preview */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900">
            Interactive Preview: “Switch the Rule” Cognitive Flexibility Puzzle
          </h2>
          <FoundationalSkillsInteractivePreview />
        </section>

        {/* All 10 Verified Activities Directory */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900">
            All 10 Live Foundational Skill Activities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {FOUNDATIONAL_SKILLS_ACTIVITIES.map((act, idx) => (
              <Link
                key={act.id}
                href={`/youth/skills-lab?skill=${act.id}`}
                className="rounded-2xl bg-white border-2 border-slate-200 hover:border-indigo-600 p-4 flex flex-col justify-between transition"
              >
                <div>
                  <span className="text-[10px] font-black uppercase text-indigo-600">
                    0{idx + 1} • {act.skill_domain}
                  </span>
                  <h3 className="text-sm font-black text-slate-900 mt-1">{act.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{act.learning_objective}</p>
                </div>
                <span className="mt-3 text-[11px] font-extrabold text-indigo-700">Play Activity →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-black text-slate-900">Age Applicability</h3>
            <p className="text-xs text-slate-600">
              Ages 4–14 with calm, untimed rounds and optional offline home transfer tasks.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-slate-900">Actual Functions</h3>
            <p className="text-xs text-slate-600">
              10 interactive games in `/youth/skills-lab` logging `activity_completed` events to the Skills Passport.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <Accessibility className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-black text-slate-900">Accessibility</h3>
            <p className="text-xs text-slate-600">
              Built-in Reduced Distraction toggle, Wide Reading Spacing toggle, and AAC quick-feeling strip.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <ShieldCheck className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-black text-slate-900">Non-Clinical Boundary</h3>
            <p className="text-xs text-slate-600">
              Educational practice only. Never claims to diagnose ADHD/autism, rewire brains, or generate clinical psychometric scores.
            </p>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
