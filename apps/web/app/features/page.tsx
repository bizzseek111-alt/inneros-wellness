"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import {
  Mic,
  MessageCircle,
  Heart,
  BookOpen,
  Bookmark,
  PenTool,
  Sprout,
  Clock,
  Link2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface FeatureItem {
  id: string;
  title: string;
  subtitle: string;
  category: "talk" | "reflect" | "organize";
  badge: string;
  icon: React.ElementType;
  surface: string;
  description: string;
  highlights: string[];
  appHref: string;
  appCta: string;
}

const FEATURES_LIST: FeatureItem[] = [
  {
    id: "voice-companion",
    title: "Voice Companion",
    subtitle: "Natural, low-latency spoken conversations with a calm visual presence",
    category: "talk",
    badge: "Real-Time Audio",
    icon: Mic,
    surface: "bg-[#E8F1EB] border-[#CFE2D6]",
    description:
      "Talk through your thoughts aloud without staring at a keyboard. The Voice Companion features smooth turn-taking, interruptible responses, live streaming transcripts, and a gentle breathing orb that respects reduced-motion preferences.",
    highlights: [
      "4 calming voice options (Sanctuary Calm, Aurora Warm, Atlas Ground, Serene Willow)",
      "Mute, pause, interrupt, or switch to text fallback at any moment",
      "Multilingual voice recognition and synthesis architecture",
    ],
    appHref: "/companion/voice",
    appCta: "Open Voice Companion",
  },
  {
    id: "text-conversations",
    title: "Text Conversations",
    subtitle: "Spacious written dialogue where you choose how your companion responds",
    category: "talk",
    badge: "5 Response Modes",
    icon: MessageCircle,
    surface: "bg-white border-[#E6E0D6]",
    description:
      "Whether you want to vent without receiving advice or break a complicated challenge into manageable steps, you can set the conversational mode with a single click.",
    highlights: [
      "Modes: Just Listen, Help Me Understand, Help Me Solve, Teach Me, Help Me Settle",
      "Warmth and directness sliders to calibrate tone",
      "Clear AI identity and immediate crisis helpline handoff when needed",
    ],
    appHref: "/companion/chat",
    appCta: "Start Text Chat",
  },
  {
    id: "daily-reflections",
    title: "Daily Reflections & Check-Ins",
    subtitle: "Notice your mood, energy, and what your body needs right now",
    category: "reflect",
    badge: "Gentle Check-In",
    icon: Heart,
    surface: "bg-[#F7E7E2] border-[#EED2C9]",
    description:
      "Pause for sixty seconds to check in with your mood, energy level, physical tension areas, and primary emotional need—helping you slow down before jumping into the next task.",
    highlights: [
      "Simple mood & energy sliders with plain-language descriptions",
      "Body comfort check-in (jaw, shoulders, breath, stomach, settled)",
      "Identifies whether you need quiet company, venting space, or clarity",
    ],
    appHref: "/check-in",
    appCta: "Try a Check-In",
  },
  {
    id: "psychology-library",
    title: "Psychology Knowledge Library",
    subtitle: "Evidence-informed guides for everyday stress, boundaries, and rest",
    category: "reflect",
    badge: "Evidence-Informed",
    icon: BookOpen,
    surface: "bg-[#EDE8F5] border-[#DDD4EC]",
    description:
      "Explore practical, jargon-free guides drawing from Cognitive Behavioral principles, Acceptance & Commitment practices, and nervous-system grounding—curated with clear source attribution.",
    highlights: [
      "Step-by-step exercises for stepping back from heavy thoughts",
      "Clear distinction between educational concepts and clinical therapy",
      "Searchable by topic, mood, or time available",
    ],
    appHref: "/knowledge",
    appCta: "Browse Wellbeing Guides",
  },
  {
    id: "personal-memory",
    title: "Personal Memory (“Things I Remember”)",
    subtitle: "User-approved context with an optional visual connections view",
    category: "organize",
    badge: "100% User-Controlled",
    icon: Bookmark,
    surface: "bg-[#E8F1EB] border-[#CFE2D6]",
    description:
      "InnerOS remembers what matters to you—like important people, routines, communication preferences, and personal goals—only after you confirm it.",
    highlights: [
      "Readable Saved Memories card list organized into everyday categories",
      "Suggested notes require explicit confirmation before saving",
      "Optional 'View Connections' graph, 1-click edit, forget, pause, and JSON export",
    ],
    appHref: "/memory",
    appCta: "Explore Things I Remember",
  },
  {
    id: "journaling",
    title: "Journaling",
    subtitle: "A peaceful, private notebook with guided reflection prompts",
    category: "reflect",
    badge: "Private Notebook",
    icon: PenTool,
    surface: "bg-white border-[#E6E0D6]",
    description:
      "Write freely or start from a gentle prompt like 'Three Small Good Moments' or 'Setting Down Today’s Worries.' Tag entries and revisit your reflections whenever you choose.",
    highlights: [
      "One-click guided writing prompts for busy or heavy days",
      "Optional mood and body-check notes alongside your writing",
      "Delete individual entries or export your entire journal anytime",
    ],
    appHref: "/journal",
    appCta: "Open My Journal",
  },
  {
    id: "personal-growth",
    title: "Personal Growth",
    subtitle: "Values-based intentions and small steps without performance pressure",
    category: "organize",
    badge: "At Your Own Pace",
    icon: Sprout,
    surface: "bg-[#FAF8F4] border-[#E6E0D6]",
    description:
      "Set meaningful personal intentions—like protecting quiet evenings or practicing calmer boundaries—broken down into small, realistic milestones.",
    highlights: [
      "Zero punitive streaks or gamified guilt",
      "Connects every goal to a personal value that matters to you",
      "Simple milestone checklists you can update at your own pace",
    ],
    appHref: "/growth",
    appCta: "View My Growth",
  },
  {
    id: "reminders-routines",
    title: "Reminders and Routines",
    subtitle: "Supportive daily check-ins, habit reminders, and protected quiet hours",
    category: "organize",
    badge: "Rest-Friendly",
    icon: Clock,
    surface: "bg-[#EDE8F5] border-[#DDD4EC]",
    description:
      "Schedule one-time or recurring reminders for reading, hydration, mood journaling, or goal follow-ups—with automatic evening quiet hours and discreet lock-screen previews.",
    highlights: [
      "Built-in anti-guilt filter prevents manipulative or possessive phrasing",
      "Time-zone-aware Quiet Hours protect your evening wind-down and sleep",
      "Snooze, pause, or dismiss any reminder without penalty",
    ],
    appHref: "/reminders",
    appCta: "Manage Reminders",
  },
  {
    id: "integrations",
    title: "User-Controlled Integrations",
    subtitle: "Bring your past exports, notes, and calendar together safely",
    category: "organize",
    badge: "Preview Before Saving",
    icon: Link2,
    surface: "bg-[#F7E7E2] border-[#EED2C9]",
    description:
      "Import selected ChatGPT or Claude conversation exports, Markdown/TXT notes, or read-only Google Calendar availability—with automatic personal-detail redaction and item-by-item approval.",
    highlights: [
      "Never asks for third-party passwords or scrapes accounts",
      "Interactive preview lets you exclude any item before import",
      "One-click batch revocation deletes all associated memories",
    ],
    appHref: "/integrations",
    appCta: "Open Connected Apps",
  },
];

export default function FeaturesMarketingPage() {
  const [filter, setFilter] = useState<"all" | "talk" | "reflect" | "organize">(
    "all"
  );

  const visibleFeatures =
    filter === "all"
      ? FEATURES_LIST
      : FEATURES_LIST.filter((f) => f.category === filter);

  return (
    <MarketingShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-16 space-y-14">
        {/* Page Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#EEF4FF] border border-[#DCE7FE] text-[#2B4CDE] text-[13.5px] font-semibold">
            <Sparkles className="w-4 h-4 text-[#2B4CDE]" />
            <span>Complete Platform Capabilities</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#0F172A] tracking-tight">
            Thoughtfully designed tools for reflection, calm, and everyday life.
          </h1>
          <p className="text-[18px] text-[#64748B] leading-relaxed">
            Every feature in InnerOS works together harmoniously—giving you a supportive voice or text companion, a private journal, user-approved memory, and gentle daily routines.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { id: "all", label: "All 9 Features" },
              { id: "talk", label: "Voice & Text Companion" },
              { id: "reflect", label: "Reflection & Guides" },
              { id: "organize", label: "Memory, Routines & Imports" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-[14px] font-semibold transition-all ${
                  filter === tab.id
                    ? "bg-[#2B4CDE] text-white shadow-xs"
                    : "bg-white border border-[#DCE7FE] text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {visibleFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <article
                key={feat.id}
                className="p-7 rounded-[32px] bg-white border border-[#DCE7FE] shadow-[0_8px_30px_rgba(43,76,222,0.05)] hover:shadow-[0_12px_36px_rgba(43,76,222,0.1)] transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-[#EEF4FF] border border-[#DCE7FE] flex items-center justify-center text-[#2B4CDE]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF4FF] text-[#2B4CDE] border border-[#DCE7FE]">
                      {feat.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-2xl font-bold text-[#0F172A]">
                      {feat.title}
                    </h2>
                    <p className="text-[14.5px] font-semibold text-[#2B4CDE]">
                      {feat.subtitle}
                    </p>
                  </div>

                  <p className="text-[15px] text-[#64748B] leading-relaxed">
                    {feat.description}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-[#F1F5F9]">
                    {feat.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start space-x-2 text-[13.5px] text-[#334155]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-[#F1F5F9]">
                  <Link
                    href={feat.appHref}
                    className="w-full py-2.5 px-4 rounded-2xl bg-[#EEF4FF] hover:bg-[#2B4CDE] border border-[#DCE7FE] text-[#2B4CDE] hover:text-white text-[14px] font-semibold flex items-center justify-between transition-colors shadow-xs"
                  >
                    <span>{feat.appCta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-gradient-to-r from-[#2B4CDE] via-[#3B82F6] to-[#1E3A8A] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(43,76,222,0.25)]">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Want to see how all 9 features work together in a single day?
            </h2>
            <p className="text-[16px] text-white/90">
              Explore our step-by-step walkthrough or jump directly into the live companion space.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/how-it-works">
              <button
                type="button"
                className="px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-sm transition-all"
              >
                How It Works
              </button>
            </Link>
            <Link href="/onboarding">
              <button
                type="button"
                className="px-6 py-2.5 rounded-full bg-white text-[#2B4CDE] hover:bg-[#EEF4FF] font-bold text-sm shadow-md transition-all flex items-center space-x-2"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
