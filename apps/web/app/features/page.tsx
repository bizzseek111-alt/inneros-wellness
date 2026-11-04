"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import {
  Mic,
  Smile,
  BookOpen,
  Palette,
  Activity,
  Heart,
  GraduationCap,
  Building2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Compass,
} from "lucide-react";

interface FeatureItem {
  id: string;
  title: string;
  subtitle: string;
  category: "friends" | "worlds" | "portals";
  badge: string;
  icon: React.ElementType;
  surface: string;
  description: string;
  highlights: string[];
  appHref: string;
  appCta: string;
}

const WEEBLY_FEATURES: FeatureItem[] = [
  {
    id: "ai-friends",
    title: "Four Illustrated AI Friends",
    subtitle: "Conversational companions with distinct personalities and pedagogical roles",
    category: "friends",
    badge: "Voice-First Companions",
    icon: Smile,
    surface: "bg-amber-50 border-amber-200",
    description:
      "Children choose Kai, Mia, Lumi, or Zayn. Each companion provides Socratic guidance, gentle encouragement, and spoken turn-taking in English, Urdu, and Pakistani Punjabi.",
    highlights: [
      "Kai: STEM problem solving and confidence without giving away answers",
      "Mia: Bilingual storytelling, oral vocabulary, and creative writing",
      "Lumi: Emotional labeling, daily morning/bedtime routines, and calming",
      "Zayn: Science experiments, natural world phenomena, and space exploration",
    ],
    appHref: "/demos",
    appCta: "Meet the AI Friends",
  },
  {
    id: "curriculum-rag",
    title: "Punjab Curriculum RAG Engine",
    subtitle: "3,000 PCTB-aligned questions with anti-injection context delimiters",
    category: "friends",
    badge: "Zero-Hallucination Tutoring",
    icon: BookOpen,
    surface: "bg-blue-50 border-blue-200",
    description:
      "Our hybrid lexical and dense vector search engine grounds conversational tutoring in official Punjab Curriculum and Textbook Board (PCTB) Student Learning Outcomes across Grades 1–8.",
    highlights: [
      "Explicit XML context boundaries preventing prompt injection",
      "Socratic progressive hints rather than automatic answer-giving",
      "Polite missing-source refusals when curriculum evidence is absent",
    ],
    appHref: "/platform",
    appCta: "Inspect RAG Architecture",
  },
  {
    id: "creative-studio",
    title: "Creative Studio & Guided Drawing",
    subtitle: "Tactile HTML5 canvas, dino sketchpads, and artistic confidence",
    category: "worlds",
    badge: "World 1",
    icon: Palette,
    surface: "bg-pink-50 border-pink-200",
    description:
      "Children sketch, paint, and follow step-by-step drawing tutorials with Mia. Features full touch support, brush palette, undo/redo, and PNG export.",
    highlights: [
      "Step-by-step dinosaur drawing and storytelling prompts",
      "Custom color palette with variable brush widths and clear canvas tools",
      "Zero commercial ads and zero manipulative reward mechanics",
    ],
    appHref: "/youth/play?world=creative-studio",
    appCta: "Open Creative Studio",
  },
  {
    id: "move-and-play",
    title: "Move & Play Sports Fundamentals",
    subtitle: "Indoor physical coordination drills and athletic sportsmanship",
    category: "worlds",
    badge: "World 2",
    icon: Activity,
    surface: "bg-emerald-50 border-emerald-200",
    description:
      "Children take active movement breaks guided by friendly coaches. Includes football footwork drills, balance exercises, stretching, and hydration reminders.",
    highlights: [
      "Bilingual coach audio guidance in English, Urdu, and Punjabi",
      "Safety tips accompanying every physical exercise",
      "Sensory-friendly options for children with motor challenges",
    ],
    appHref: "/youth/play?world=move-play",
    appCta: "Open Move & Play",
  },
  {
    id: "parent-intelligence",
    title: "Parent Center & Observation Diary",
    subtitle: "Weekly learning summaries, bedtime settings, and non-diagnostic diaries",
    category: "portals",
    badge: "Caregiver Governance",
    icon: Heart,
    surface: "bg-rose-50 border-rose-200",
    description:
      "Parents inspect daily learning quests, set healthy screen-time limits, and log factual behavioral observations without harmful clinical psychiatric labels.",
    highlights: [
      "Automated weekly learning dispatches via SMS and portal",
      "Granular consent controls for microphone, audio, and school sharing",
      "Caregiver Harm Exception safeguarding child disclosures (CPWB 1121)",
    ],
    appHref: "/parent",
    appCta: "Open Parent Center",
  },
  {
    id: "teacher-studio",
    title: "Teacher Studio & Assessment Generator",
    subtitle: "Automated test authoring from 3,000 PCTB questions and classroom telemetry",
    category: "portals",
    badge: "Educator Workspace",
    icon: GraduationCap,
    surface: "bg-purple-50 border-purple-200",
    description:
      "Teachers generate printable test papers with answer rubrics in seconds, manage classroom rosters, and track student quest completion in real-time.",
    highlights: [
      "Reclaims over 4 hours of weekly assessment preparation time",
      "Customizable difficulty filters and SLO curriculum topic matching",
      "Non-diagnostic classroom observation diary with student support links",
    ],
    appHref: "/teacher/dashboard",
    appCta: "Open Teacher Studio",
  },
];

export default function FeaturesPage() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "friends" | "worlds" | "portals">("all");

  const filteredFeatures =
    selectedCategory === "all"
      ? WEEBLY_FEATURES
      : WEEBLY_FEATURES.filter((f) => f.category === selectedCategory);

  return (
    <MarketingShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-16 space-y-16">
        {/* Hero Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-[#2B4CDE]" />
            <span>Weebly Platform Capabilities</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Features engineered for joyful learning and child safety.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Every feature in Weebly works together—giving children a playful AI friend, families honest visibility, and teachers automated classroom tools.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Capabilities" },
            { id: "friends", label: "AI Friends & RAG" },
            { id: "worlds", label: "Learning Worlds" },
            { id: "portals", label: "Parent & Teacher Portals" },
          ].map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? "bg-[#2B4CDE] text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feat) => {
            const FeatIcon = feat.icon;
            return (
              <div
                key={feat.id}
                className={`p-6 sm:p-8 rounded-3xl border ${feat.surface} shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-bold shadow-xs">
                      <FeatIcon className="w-5 h-5 text-[#2B4CDE]" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-[11px] font-black uppercase text-slate-700">
                      {feat.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-extrabold text-slate-900">{feat.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">{feat.subtitle}</p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {feat.description}
                  </p>

                  <ul className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200/60 pt-3">
                    {feat.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={feat.appHref}
                  className="w-full py-3 rounded-xl bg-white border border-slate-300 hover:border-[#2B4CDE] hover:text-[#2B4CDE] text-slate-800 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-2xs"
                >
                  <span>{feat.appCta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Institutional Callout */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to explore Weebly in action?
            </h2>
            <p className="text-sm text-slate-300">
              Try the interactive six-role demonstration center or review our complete 20-subsystem functionality guide.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/demos"
              className="px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 text-sm transition-all shadow-md"
            >
              Try Interactive Demos
            </Link>
            <Link
              href="/platform"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all"
            >
              Complete Functionality Guide
            </Link>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
