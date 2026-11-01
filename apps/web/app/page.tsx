"use client";

import React from "react";
import Link from "next/link";
import {
  MarketingShell,
  useMarketingLocale,
} from "@/components/marketing/MarketingShell";
import { InteractiveHeroPreview } from "@/components/marketing/InteractiveHeroPreview";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { trackMarketingEvent } from "@/lib/marketing-analytics";
import {
  Sparkles,
  ArrowRight,
  Mic,
  MessageCircle,
  BookOpen,
  Bookmark,
  Clock,
  ShieldCheck,
  Heart,
  Compass,
  Sprout,
  Globe,
  CheckCircle2,
  Lock,
  LifeBuoy,
} from "lucide-react";

const CORE_BENEFITS = [
  {
    icon: Mic,
    badge: "Voice & Text",
    title: "Talk Out Loud or Write Quietly",
    description:
      "Switch effortlessly between a calm, natural voice companion and a thoughtful written space—whenever you want to sort through a busy day.",
    surface: "bg-[#E8F1EB] border-[#CFE2D6]",
    href: "/companion/voice",
    cta: "Try Voice Companion",
  },
  {
    icon: Bookmark,
    badge: "User-Approved Memory",
    title: "Remembers Only What You Approve",
    description:
      "InnerOS never builds secret profiles. When you mention a goal, routine, or preference, it suggests a note that you can save, edit, or dismiss.",
    surface: "bg-[#F7E7E2] border-[#EED2C9]",
    href: "/memory",
    cta: "See Things I Remember",
  },
  {
    icon: BookOpen,
    badge: "Journal & Guides",
    title: "Reflect With Gentle Prompts",
    description:
      "Unpack heavy thoughts with practical, evidence-informed reflection prompts, private journaling, and relatable wellbeing guides.",
    surface: "bg-[#EDE8F5] border-[#DDD4EC]",
    href: "/journal",
    cta: "Open Journal",
  },
  {
    icon: Clock,
    badge: "No Streak Guilt",
    title: "Routines That Respect Your Rest",
    description:
      "Set daily check-ins, reading reminders, and evening quiet hours with zero streak pressure, zero guilt, and discreet notifications.",
    surface: "bg-white border-[#E6E0D6]",
    href: "/reminders",
    cta: "Explore Reminders",
  },
];

const HOW_IT_WORKS_PREVIEW = [
  {
    step: "01",
    title: "Start a conversation",
    desc: "Speak naturally with the voice companion or write a few lines about what is on your mind.",
  },
  {
    step: "02",
    title: "Choose your style",
    desc: "Pick whether you want your companion to Just Listen, Help You Understand, or Help You Settle.",
  },
  {
    step: "03",
    title: "Reflect and learn",
    desc: "Explore gentle journaling prompts and clear, evidence-informed psychology concepts.",
  },
  {
    step: "04",
    title: "Create meaningful goals",
    desc: "Break down personal intentions into calm, realistic steps anchored to what matters to you.",
  },
  {
    step: "05",
    title: "Review at your own pace",
    desc: "Revisit your saved memories, connections, and reflections without timelines or streak anxiety.",
  },
];

function MarketingHomeContent() {
  const { localeConfig } = useMarketingLocale();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "InnerOS",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    description:
      "Multilingual AI emotional wellbeing and personal life companion supporting reflection, personal growth, everyday stress, and gentle routines.",
  };

  return (
    <div className="space-y-24 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-10 sm:pt-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Copy Column */}
          <div className="lg:col-span-6 space-y-7">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#E8F1EB] border border-[#CFE2D6] text-[#1F4742] text-[14px] font-medium">
              <Sparkles className="w-4 h-4 text-[#285B55]" />
              <span>{localeConfig.heroBadge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-medium text-[#263330] tracking-tight leading-[1.12]">
              {localeConfig.heroHeadline}
            </h1>

            <p className="text-[18px] sm:text-[19px] text-[#52625E] leading-relaxed max-w-xl">
              {localeConfig.heroSubheadline}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/onboarding"
                onClick={() =>
                  trackMarketingEvent("cta_start_journey_click", {
                    location: "hero",
                  })
                }
              >
                <Button
                  size="lg"
                  variant="primary"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  {localeConfig.ctaStart}
                </Button>
              </Link>

              <Link
                href="/features"
                onClick={() =>
                  trackMarketingEvent("cta_explore_features_click", {
                    location: "hero",
                  })
                }
              >
                <Button size="lg" variant="secondary">
                  {localeConfig.ctaExplore}
                </Button>
              </Link>
            </div>

            {/* Trust Micro-Indicators */}
            <div className="pt-4 border-t border-[#E6E0D6] grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13.5px] text-[#52625E]">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#285B55] shrink-0" />
                <span>User-confirmed memory</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#285B55] shrink-0" />
                <span>No streak guilt or pressure</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#285B55] shrink-0" />
                <span>Voice &amp; text in 8+ languages</span>
              </div>
            </div>
          </div>

          {/* Right Interactive Product Preview Column */}
          <div className="lg:col-span-6">
            <InteractiveHeroPreview />
          </div>
        </div>
      </section>

      {/* 2. CLEAR PRODUCT VALUE PROPOSITION */}
      <section className="px-4 sm:px-8">
        <div className="max-w-7xl mx-auto p-8 sm:p-12 rounded-[36px] bg-white border border-[#E6E0D6] shadow-sm space-y-10">
          <div className="max-w-3xl space-y-3">
            <Badge variant="sage" size="md">
              Designed for Everyday Human Life
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#263330]">
              A thoughtful companion for busy minds, quiet reflections, and practical next steps.
            </h2>
            <p className="text-[17px] text-[#52625E] leading-relaxed">
              Most digital tools compete for your attention with noisy feeds, rigid productivity streaks, or cold technical dashboards. InnerOS is built to feel like a calm, sunlit room where you can slow down and hear yourself think.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_BENEFITS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`p-6 rounded-3xl border ${item.surface} flex flex-col justify-between space-y-5 transition-all hover:shadow-md`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-white border border-[#E6E0D6] flex items-center justify-center text-[#285B55] shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[12.5px] font-semibold px-3 py-1 rounded-full bg-white/80 text-[#263330] border border-[#E6E0D6]">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-medium text-[#263330]">
                      {item.title}
                    </h3>
                    <p className="text-[15px] text-[#52625E] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <Link
                    href={item.href}
                    className="inline-flex items-center space-x-1.5 text-[14px] font-semibold text-[#285B55] hover:underline pt-2"
                  >
                    <span>{item.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. VOICE & TEXT CONVERSATION PREVIEWS */}
      <section className="px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="lavender" size="md">
              Two Natural Ways to Connect
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#263330]">
              Speak aloud when your hands are full, or write when you want quiet stillness.
            </h2>
            <p className="text-[17px] text-[#52625E] leading-relaxed">
              Your companion adapts to how you prefer to communicate—and lets you switch between voice and text at any moment.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Voice Companion Showcase Card */}
            <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#E8F1EB] via-white to-[#FAF8F4] border border-[#CFE2D6] shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="sage" size="sm">
                    Real-Time Voice Companion
                  </Badge>
                  <span className="text-[13.5px] text-[#52625E]">
                    Calm pacing &bull; Reduced-motion friendly
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-medium text-[#263330]">
                  Unrushed conversations with a gentle visual presence
                </h3>
                <p className="text-[15.5px] text-[#52625E] leading-relaxed">
                  Speak naturally while walking,resting your eyes, or winding down for the evening. Pause, mute, interrupt, or read live transcripts whenever you like.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#E8F1EB] via-[#F7E7E2] to-[#EDE8F5] border border-[#CFE2D6] flex items-center justify-center shrink-0">
                    <Mic className="w-6 h-6 text-[#285B55]" />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-[#263330]">
                      4 Calming Voice Timbres
                    </div>
                    <p className="text-[13.5px] text-[#52625E]">
                      Sanctuary Calm &bull; Aurora Warm &bull; Atlas Ground &bull; Serene Willow
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#F3EFE8] flex items-center justify-between text-[14px]">
                  <span className="text-[#52625E]">
                    Includes one-tap text fallback
                  </span>
                  <Link
                    href="/companion/voice"
                    className="font-semibold text-[#285B55] hover:underline inline-flex items-center space-x-1"
                  >
                    <span>Open Voice Room</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Text Conversation Showcase Card */}
            <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#FAF8F4] via-white to-[#EDE8F5]/50 border border-[#E6E0D6] shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="lavender" size="sm">
                    Thoughtful Text Companion
                  </Badge>
                  <span className="text-[13.5px] text-[#52625E]">
                    5 user-selected response modes
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-medium text-[#263330]">
                  You set the boundaries for every conversation
                </h3>
                <p className="text-[15.5px] text-[#52625E] leading-relaxed">
                  Sometimes you want practical problem-solving; other times you just want to feel heard without someone trying to fix things. Choose your mode before or during any chat.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] space-y-3">
                <div className="flex flex-wrap gap-2">
                  {[
                    "Just Listen (No Advice)",
                    "Help Me Understand",
                    "Help Me Solve",
                    "Teach Me Psychology",
                    "Help Me Settle",
                  ].map((modeLabel, idx) => (
                    <span
                      key={modeLabel}
                      className={`px-3 py-1.5 rounded-xl text-[13px] font-medium border ${
                        idx === 0
                          ? "bg-[#285B55] text-white border-[#285B55]"
                          : "bg-[#FAF8F4] text-[#263330] border-[#E6E0D6]"
                      }`}
                    >
                      {modeLabel}
                    </span>
                  ))}
                </div>
                <div className="pt-3 border-t border-[#F3EFE8] flex items-center justify-between text-[14px]">
                  <span className="text-[#52625E]">
                    Adjustable warmth &amp; directness sliders
                  </span>
                  <Link
                    href="/companion/chat"
                    className="font-semibold text-[#285B55] hover:underline inline-flex items-center space-x-1"
                  >
                    <span>Start Text Chat</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (5-STEP JOURNEY) */}
      <section className="px-4 sm:px-8">
        <div className="max-w-7xl mx-auto p-8 sm:p-12 rounded-[36px] bg-[#F3EFE8] border border-[#E6E0D6] space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <Badge variant="peach" size="md">
                Simple, Unhurried Rhythm
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#263330]">
                How InnerOS fits into your everyday life
              </h2>
            </div>
            <Link href="/how-it-works">
              <Button
                variant="outline"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                See Full Walkthrough
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {HOW_IT_WORKS_PREVIEW.map((item) => (
              <div
                key={item.step}
                className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#E8F1EB] text-[#285B55] font-serif font-semibold text-[15px]">
                    {item.step}
                  </span>
                  <h3 className="text-[18px] font-serif font-medium text-[#263330]">
                    {item.title}
                  </h3>
                  <p className="text-[14.5px] text-[#52625E] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRIVACY, TRUST & ETHICAL TRANSPARENCY */}
      <section className="px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-[32px] bg-white border border-[#E6E0D6] shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 text-[#285B55] text-[14px] font-semibold">
                <Lock className="w-4 h-4" />
                <span>Privacy &amp; Personal Agency</span>
              </div>
              <h2 className="text-3xl font-serif font-medium text-[#263330]">
                Built on explicit permission—never hidden profiling.
              </h2>
              <p className="text-[16px] text-[#52625E] leading-relaxed">
                Your thoughts and reflections belong to you. InnerOS separates tentative AI suggestions from confirmed facts, lets you pause memory recording anytime, and gives you one-click tools to download or clear your data.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] space-y-1">
                <span className="font-semibold text-[15px] text-[#263330] block">
                  You Approve Every Memory
                </span>
                <p className="text-[13.5px] text-[#52625E] leading-relaxed">
                  Nothing is added to your permanent memories unless you confirm it.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] space-y-1">
                <span className="font-semibold text-[15px] text-[#263330] block">
                  Preview Imported Archives
                </span>
                <p className="text-[13.5px] text-[#52625E] leading-relaxed">
                  Scrub personal identifiers and select individual notes before importing.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/privacy-trust">
                <Button
                  variant="secondary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore Privacy &amp; Trust
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 p-8 sm:p-10 rounded-[32px] bg-[#F7E7E2] border border-[#EED2C9] shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 text-[#7A4434] text-[14px] font-semibold">
                <LifeBuoy className="w-4 h-4" />
                <span>Honest Boundaries &amp; Human Care</span>
              </div>
              <h3 className="text-2xl font-serif font-medium text-[#263330]">
                Clear about what AI can do—and when human support matters most.
              </h3>
              <p className="text-[15.5px] text-[#52625E] leading-relaxed">
                InnerOS is designed for everyday reflection, stress management, and personal habits. It never pretends to be a human therapist, never diagnoses medical conditions, and always keeps 24/7 crisis support within reach.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E6E0D6] space-y-2">
              <span className="text-[14px] font-semibold text-[#263330] block">
                Our Commitment Against Emotional Dependency
              </span>
              <p className="text-[13.5px] text-[#52625E] leading-relaxed">
                InnerOS never uses guilt-based notifications, possessive language, or artificial attachment loops. Our goal is to support your real-world life and relationships.
              </p>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center space-x-1.5 text-[14.5px] font-semibold text-[#285B55] hover:underline"
            >
              <span>Read Our Ethical Principles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION */}
      <section className="px-4 sm:px-8">
        <div className="max-w-5xl mx-auto p-10 sm:p-14 rounded-[40px] bg-gradient-to-br from-[#E8F1EB] via-white to-[#F7E7E2] border border-[#CFE2D6] shadow-md text-center space-y-6">
          <Badge variant="sage" size="md">
            Ready When You Are
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#263330] max-w-2xl mx-auto leading-tight">
            Step into a quieter, more thoughtful space today.
          </h2>
          <p className="text-[17px] text-[#52625E] max-w-xl mx-auto leading-relaxed">
            Personalize your companion’s voice, language, and privacy preferences in under two minutes—or jump straight into your space.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/onboarding"
              onClick={() =>
                trackMarketingEvent("cta_start_journey_click", {
                  location: "footer_cta",
                })
              }
            >
              <Button
                size="lg"
                variant="primary"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                {localeConfig.ctaStart}
              </Button>
            </Link>
            <Link
              href="/dashboard"
              onClick={() =>
                trackMarketingEvent("cta_open_app_click", {
                  location: "footer_cta",
                })
              }
            >
              <Button size="lg" variant="outline">
                Open Live Companion App
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function MarketingHomePage() {
  return (
    <MarketingShell>
      <MarketingHomeContent />
    </MarketingShell>
  );
}
