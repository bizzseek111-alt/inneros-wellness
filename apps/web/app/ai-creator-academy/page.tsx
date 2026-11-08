"use client";

import React from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import {
  Sparkles,
  ShieldCheck,
  BookOpen,
  Gamepad2,
  Film,
  Palette,
  Cpu,
  SearchCheck,
  ArrowRight,
  Lock,
  CheckCircle2,
} from "lucide-react";

const AGE_PATHWAYS = [
  {
    band: "Ages 2–4",
    stage: "Caregiver-Led Play & Spoken Stories",
    understand: "Recognize familiar voices, animals, and everyday objects through picture cards.",
    apply: "Listen to bilingual audio stories and sing along with movement rhymes alongside a parent.",
    create: "Co-select story characters and colors with an adult caregiver.",
    unescoCompetency: "Human-Centric Mindset & Early Sensory Exploration",
  },
  {
    band: "Age 5",
    stage: "Picture Storytelling & Spotting AI Mistakes",
    understand: "Learn what AI is (a computer program) and what AI is not (not a real person).",
    apply: "Sequence 3-picture stories and notice when a computer makes a silly mistake.",
    create: "Supervised icon-based story and art creation with caregiver mediation.",
    unescoCompetency: "Foundational AI Awareness & Safe Adult-Guided Use",
  },
  {
    band: "Age 6",
    stage: "Visual Block Games & Character Movement",
    understand: "Understand that computers follow exact step-by-step instructions (algorithms).",
    apply: "Use 'Move', 'Turn', 'Wait', 'When Tapped', and 'If Touching Star' visual blocks.",
    create: "Build and test a playable 5×5 star-collector game and animated story scenes.",
    unescoCompetency: "Algorithmic Thinking & Visual Problem Solving",
  },
  {
    band: "Ages 7–9",
    stage: "Branching Stories, Multi-Step Logic & AI Detective",
    understand: "Explore how pattern-matching works and why AI hallucinations happen.",
    apply: "Check sources with trusted adults and protect personal privacy online.",
    create: "Design branching moral cartoons and multi-step block games.",
    unescoCompetency: "Critical Evaluation, Data Privacy & Prompt Literacy",
  },
  {
    band: "Ages 10–12",
    stage: "Block Programming, Debugging & Project Portfolios",
    understand: "Investigate training examples (datasets), fairness, and representation.",
    apply: "Debug broken block sequences and evaluate AI-assisted story drafts.",
    create: "Maintain a private Skills & Creations Passport portfolio with approved exports.",
    unescoCompetency: "Ethics of AI, Fairness & Iterative Debugging",
  },
  {
    band: "Ages 13–15",
    stage: "Programming Fundamentals & Responsible AI Tools",
    understand: "Study structured logic, state transitions, and digital citizenship.",
    apply: "Use AI companions as study and brainstorming partners without outsourcing thinking.",
    create: "Design interactive learning apps, stories, and community projects.",
    unescoCompetency: "Responsible Co-Creation & Computational Design",
  },
  {
    band: "Ages 16–18",
    stage: "Advanced Logic, Data Concepts & Model Evaluation",
    understand: "Examine model limitations, bias mitigation, and verification rubrics.",
    apply: "Audit AI outputs for factual accuracy, citations, and safety boundaries.",
    create: "Publish parent/teacher-approved capstone projects with full attribution.",
    unescoCompetency: "AI System Governance, Evaluation & Societal Impact",
  },
];

export default function PublicAICreatorAcademyPage() {
  return (
    <MarketingShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {/* Hero */}
        <section className="rounded-3xl bg-white border-2 border-slate-900 p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-extrabold">
            <Sparkles className="w-4 h-4" />
            <span>Weebly V10 • Learn. Create. Think. Grow.</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-4xl">
            AI Creator Academy &amp; Readiness-Based AI Learning Pathway
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            Weebly teaches children to be active inventors, critical thinkers, and creators—never passive consumers. Every tool puts human imagination first, enforces strict privacy boundaries, and progresses by readiness across{" "}
            <strong>Understand → Apply → Create</strong>.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/youth/creator"
              className="px-6 py-3.5 rounded-2xl bg-slate-900 text-white text-sm font-extrabold hover:bg-slate-800 inline-flex items-center gap-2"
            >
              <span>Launch AI Creator Academy</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/youth/journeys"
              className="px-6 py-3.5 rounded-2xl bg-[#FAF7F2] border-2 border-slate-900 text-slate-900 text-sm font-extrabold hover:bg-amber-50"
            >
              Explore 5-Stage Learning Journeys
            </Link>
          </div>
        </section>

        {/* Six Creator Tools Overview */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
              Six Guided Creation Studios
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Built for Safe, Editable, Private-by-Default Creation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "1. AI Story Maker",
                icon: BookOpen,
                desc: "Choose characters, setting, and kind goals. Co-write bilingual stories with spoken narration and private export.",
                href: "/youth/creator?tool=story_maker",
              },
              {
                title: "2. AI Game Maker",
                icon: Gamepad2,
                desc: "Snap visual blocks (Move, Turn, Wait, Repeat, When Tapped, If/Then Collision, Score, Win) to build a real playable game.",
                href: "/youth/creator?tool=game_maker",
              },
              {
                title: "3. AI Cartoon Studio",
                icon: Film,
                desc: "Arrange multi-scene storyboards, backgrounds, character dialogue, and transitions with timeline playback.",
                href: "/youth/creator?tool=cartoon_studio",
              },
              {
                title: "4. AI Art & Design Lab",
                icon: Palette,
                desc: "Human creativity first—finger-painting, color harmony, character sketching, and guided creative prompts.",
                href: "/youth/creator?tool=art_lab",
              },
              {
                title: "5. Young AI Inventors",
                icon: Cpu,
                desc: "Hands-on lessons on what AI is, what AI is not, how training examples work, fairness, testing, and iteration.",
                href: "/youth/creator?tool=ai_inventors",
              },
              {
                title: "6. AI Detective",
                icon: SearchCheck,
                desc: "Interactive cases teaching children to spot AI hallucinations, protect personal privacy, check sources, and ask trusted adults.",
                href: "/youth/creator?tool=ai_detective",
              },
            ].map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.title}
                  className="rounded-3xl bg-white border border-[#E7E0D6] p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-4">{tool.title}</h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{tool.desc}</p>
                  </div>
                  <Link
                    href={tool.href}
                    className="mt-5 pt-4 border-t border-slate-100 text-xs font-extrabold text-indigo-600 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Open Tool in Creator Academy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Phase 4: Age-Based AI Learning Pathway Matrix */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
              Phase 4 • Readiness-Based Progression (Ages 2–18)
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Understand • Apply • Create Curriculum Model
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Progression is guided by individual readiness and parent/teacher adjustments—never rigid chronological guarantees. Competency concepts are mapped to international student AI literacy principles (aligned with UNESCO student AI competency themes without claiming official UNESCO endorsement).
            </p>
          </div>

          <div className="space-y-4">
            {AGE_PATHWAYS.map((row) => (
              <div
                key={row.band}
                className="rounded-2xl bg-white border border-slate-200 p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start"
              >
                <div className="lg:col-span-3">
                  <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-extrabold">
                    {row.band}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-2">{row.stage}</h3>
                  <p className="text-[11px] font-semibold text-indigo-600 mt-1">
                    {row.unescoCompetency}
                  </p>
                </div>
                <div className="lg:col-span-3 text-xs text-slate-700">
                  <strong className="uppercase text-slate-400 block mb-1">1. Understand</strong>
                  {row.understand}
                </div>
                <div className="lg:col-span-3 text-xs text-slate-700">
                  <strong className="uppercase text-slate-400 block mb-1">2. Apply</strong>
                  {row.apply}
                </div>
                <div className="lg:col-span-3 text-xs text-slate-700">
                  <strong className="uppercase text-slate-400 block mb-1">3. Create</strong>
                  {row.create}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Safety & Privacy Guarantees */}
        <section className="rounded-3xl bg-slate-900 text-white p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Lock className="w-6 h-6 text-emerald-400" />
            <h3 className="text-base font-extrabold">Private by Default</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Children&apos;s stories, games, and cartoons are stored in their private Skills &amp; Creations Passport—never published to a public feed.
            </p>
          </div>
          <div className="space-y-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <h3 className="text-base font-extrabold">No Unrestricted Web or Raw Model Access</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Younger learners use curated visual blocks and moderated templates with zero exposure to external APIs or unmoderated internet searches.
            </p>
          </div>
          <div className="space-y-2">
            <CheckCircle2 className="w-6 h-6 text-sky-400" />
            <h3 className="text-base font-extrabold">Zero Unnecessary Biometric/Photo Collection</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Projects use vector illustrations, block sprites, and text/voice synthesis without collecting identifiable child photographs.
            </p>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
