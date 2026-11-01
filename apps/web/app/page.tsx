"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MarketingShell,
  useMarketingLocale,
} from "@/components/marketing/MarketingShell";
import { InteractiveHeroPreview } from "@/components/marketing/InteractiveHeroPreview";
import { trackMarketingEvent } from "@/lib/marketing-analytics";
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
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
  Activity,
  Calendar,
  Layers,
  Sliders,
} from "lucide-react";

const HOW_IT_WORKS_PREVIEW = [
  {
    step: "01",
    title: "Start a conversation",
    desc: "Speak naturally with the voice companion or write a few lines about what is on your mind.",
    accent: "bg-[#D9F296] text-[#1A1E1C]",
  },
  {
    step: "02",
    title: "Choose your style",
    desc: "Pick whether you want your companion to Just Listen, Help You Understand, or Help You Settle.",
    accent: "bg-[#CBD8F6] text-[#1A1E1C]",
  },
  {
    step: "03",
    title: "Reflect and learn",
    desc: "Explore gentle journaling prompts and clear, evidence-informed psychology concepts.",
    accent: "bg-[#CDE5D3] text-[#1A1E1C]",
  },
  {
    step: "04",
    title: "Create meaningful goals",
    desc: "Break down personal intentions into calm, realistic steps anchored to what matters to you.",
    accent: "bg-[#F6D4DC] text-[#1A1E1C]",
  },
  {
    step: "05",
    title: "Review at your own pace",
    desc: "Revisit your saved memories, connections, and reflections without timelines or streak anxiety.",
    accent: "bg-[#EAE4F7] text-[#1A1E1C]",
  },
];

const PSYCHOLOGY_PILLARS = [
  {
    dept: "Acceptance & Commitment (ACT)",
    summary: "Step back from heavy thoughts with cognitive defusion and values-aligned action.",
    tier: "Tier 1 Meta-Analysis",
    pillBg: "bg-[#D9F296]",
  },
  {
    dept: "Somatic & Polyvagal Regulation",
    summary: "Settle sympathetic nervous system activation through paced breathwork and grounding.",
    tier: "Peer-Reviewed Clinical",
    pillBg: "bg-[#CDE5D3]",
  },
  {
    dept: "Cognitive Behavioral Framing",
    summary: "Identify all-or-nothing thinking loops gently without self-judgment or rigid grading.",
    tier: "Tier 1 Systematic Review",
    pillBg: "bg-[#CBD8F6]",
  },
  {
    dept: "Relational & Attachment Clarity",
    summary: "Navigate boundaries, difficult conversations, and interpersonal patterns with warmth.",
    tier: "Evidence-Graded Guide",
    pillBg: "bg-[#F6D4DC]",
  },
];

function MarketingHomeContent() {
  const { localeConfig, openCrisisModal } = useMarketingLocale();
  const [billingAnnual, setBillingAnnual] = useState(true);
  const [activeModeIdx, setActiveModeIdx] = useState(0);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const lifeGraphVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    [heroVideoRef, lifeGraphVideoRef].forEach((ref) => {
      if (ref.current) {
        ref.current.muted = true;
        ref.current.defaultMuted = true;
        const playPromise = ref.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }
    });
  }, []);

  const modes = [
    {
      name: "Just Listen",
      desc: "Zero unsolicited advice. Warm, validating presence when you simply need to be heard.",
      angle: "25%",
    },
    {
      name: "Help Me Understand",
      desc: "Gentle Socratic questions that help untangle complex emotions and recurring patterns.",
      angle: "50%",
    },
    {
      name: "Help Me Settle",
      desc: "Slow somatic pacing, 4-4-4-4 box breathing, and sensory grounding when overwhelmed.",
      angle: "75%",
    },
    {
      name: "Help Me Solve",
      desc: "Practical, low-pressure next steps and boundary scripts when you are ready for action.",
      angle: "100%",
    },
  ];

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
    <div className="space-y-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* =====================================================================
          SECTION 1: HERO SECTION WITH LOOPING BACKGROUND VIDEO & LIQUID GLASS
          ===================================================================== */}
      <section className="relative min-h-screen flex flex-col justify-between pt-36 pb-16 px-4 sm:px-8 overflow-hidden bg-black">
        {/* Full-Screen 4K Ultra-Clear Looping Background Video */}
        <video
          ref={heroVideoRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          autoPlay
          muted
          loop
          playsInline
          style={{
            imageRendering: "-webkit-optimize-contrast",
            WebkitBackfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_230229_7c9bc431-46cf-489a-948d-e8144d8eb5d4.mp4"
            type="video/mp4"
          />
        </video>

        <div className="relative z-10 max-w-6xl mx-auto w-full pt-6 sm:pt-12 text-center space-y-6">
          {/* Uppercase Micro Eyebrow */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11.5px] uppercase tracking-[0.22em] font-medium shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#D9F296]" />
            <span>{localeConfig.heroBadge} &bull; FOR MINDS THAT SEEK CLARITY</span>
          </div>

          {/* Giant Editorial Headline (Geometric Sans + Italic Serif) with crisp contrast */}
          <h1 className="text-4xl sm:text-6xl lg:text-[74px] font-medium text-white tracking-tight leading-[1.04] max-w-4xl mx-auto drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            Become the most aware{" "}
            <span className="font-serif italic font-normal text-[#ECF4E8] block mt-1 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              version of yourself.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-[16.5px] sm:text-[18px] text-white max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            {localeConfig.heroSubheadline}
          </p>

          {/* Centered Translucent Glass Pill Button */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/onboarding"
              onClick={() =>
                trackMarketingEvent("cta_start_journey_click", {
                  location: "hero",
                })
              }
              className="inline-flex items-center space-x-2.5 px-6 py-3 rounded-full bg-white/20 hover:bg-[#D9F296] text-white hover:text-[#1A1E1C] backdrop-blur-xl border border-white/30 text-[14px] font-semibold transition-all shadow-lg group"
            >
              <span>{localeConfig.ctaStart}</span>
              <span className="w-6 h-6 rounded-full bg-[#1A1E1C] text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/dashboard"
              onClick={() =>
                trackMarketingEvent("cta_open_app_click", { location: "hero" })
              }
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#1A1E1C]/75 hover:bg-white text-white hover:text-[#1A1E1C] backdrop-blur-xl border border-white/20 text-[14px] font-medium transition-all"
            >
              <span>{localeConfig.ctaOpenApp}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Centerpiece Floating Glassmorphic Card + Callout Pills (Exact Pyko Hero Composition) */}
        <div className="relative z-10 max-w-7xl mx-auto w-full mt-12 grid lg:grid-cols-12 gap-8 items-end">
          {/* Bottom-Left Editorial Statement */}
          <div className="lg:col-span-4 space-y-3 text-left order-2 lg:order-1">
            <p className="text-[14.5px] text-white/85 leading-relaxed">
              There are two ways to move through a demanding week: reacting to every pressure, or pausing to understand what you feel. InnerOS gives you calm reflection, voice presence, and user-approved memory.
            </p>
            <Link
              href="/features"
              onClick={() =>
                trackMarketingEvent("cta_explore_features_click", {
                  location: "hero",
                })
              }
              className="inline-block text-[13.5px] font-semibold text-[#D9F296] underline underline-offset-4 hover:text-white transition-colors"
            >
              {localeConfig.ctaExplore}
            </Link>
          </div>

          {/* Center Glassmorphic Predictive / Emotional Clarity Card */}
          <div className="lg:col-span-4 flex justify-center relative order-1 lg:order-2">
            {/* Floating Left Callout Bubble */}
            <div className="hidden sm:block absolute -left-24 top-12 z-20 px-4 py-3 rounded-2xl bg-white/95 text-[#1A1E1C] shadow-2xl border border-white max-w-[205px] animate-float">
              <p className="text-[12.5px] font-medium leading-snug">
                &ldquo;You will never reflect on your day the same way again.&rdquo;
              </p>
            </div>

            {/* Central Glass Card */}
            <div className="w-full max-w-[310px] rounded-[28px] overflow-hidden pyko-glass border border-white/30 shadow-2xl bg-gradient-to-b from-white/25 via-[#2C3B2D]/70 to-[#111913]/95 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] uppercase tracking-widest text-white/75 font-semibold">
                  InnerOS Sanctuary
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D9F296] text-[#1A1E1C] text-[11px] font-bold">
                  Live Sync
                </span>
              </div>

              <div className="h-28 rounded-2xl bg-gradient-to-tr from-[#354835] via-[#6B875E] to-[#D9F296]/70 p-4 flex flex-col justify-end relative overflow-hidden border border-white/20">
                <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/20 blur-xl" />
                <span className="font-serif italic text-2xl text-white drop-shadow-xs">
                  Emotional Clarity
                </span>
                <span className="text-[12px] text-white/85">
                  Voice &bull; Journal &bull; Life Graph
                </span>
              </div>

              <div className="space-y-3 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-[12px] text-white/85">
                    <span>Mindful Grounding</span>
                    <span className="text-[#D9F296] font-semibold">96.4%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/15 overflow-hidden">
                    <div className="w-[86%] h-full rounded-full bg-[#9EE838]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[12px] text-white/85">
                    <span>Daily Intentions</span>
                    <span className="text-[#F6D4DC] font-semibold">Calm Pace</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/15 overflow-hidden">
                    <div className="w-[74%] h-full rounded-full bg-[#E5B869]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Right White Metric Card */}
            <div className="hidden sm:block absolute -right-24 bottom-8 z-20 p-4 rounded-2xl bg-white/95 text-[#1A1E1C] shadow-2xl border border-white w-[195px] space-y-2.5">
              <div>
                <div className="text-xl font-bold text-[#1A1E1C]">96.4%</div>
                <div className="text-[11.5px] text-[#687670]">
                  Emotional Balance Index
                </div>
              </div>
              <Link
                href="/dashboard"
                className="w-full inline-flex items-center justify-between px-3 py-1.5 rounded-full bg-[#1A1E1C] text-white text-[11.5px] font-semibold hover:bg-[#285B55] transition-colors"
              >
                <span>Explore the suite</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Bottom-Right Scroll Indicator */}
          <div className="lg:col-span-4 flex lg:justify-end items-center space-x-2 text-white/75 text-[13px] order-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D9F296]" />
            <span className="font-serif italic">Scroll to explore 13 sections</span>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: ABOUT US / AWARENESS IS YOUR GREATEST STRENGTH (PYKO 00:10)
          ===================================================================== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-8 bg-gradient-to-b from-[#0D1510] via-[#273528] to-[#1A241B] text-white overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="text-[11.5px] uppercase tracking-[0.24em] text-[#D9F296] font-semibold block">
            ABOUT INNEROS
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.08]">
            Awareness is your <br />
            <span className="font-serif italic font-normal text-[#E8F3E4]">
              greatest inner strength.
            </span>
          </h2>
          <p className="text-[16.5px] sm:text-[18px] text-white/80 leading-relaxed max-w-2xl mx-auto">
            Most wellness tools track surface streaks. Few help you understand what drives them. InnerOS turns everyday conversations, voice reflections, and somatic check-ins into gentle self-awareness—revealing the connections behind your energy, boundaries, and relationships.
          </p>
          <div className="pt-3">
            <Link
              href="/about"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white text-[#1A1E1C] hover:bg-[#D9F296] text-[14px] font-semibold transition-all shadow-md"
            >
              <span>Read our philosophy</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: OPERATE WITH INTENT — 3 GLASSMORPHIC ANALYTICS CARDS (PYKO 00:18)
          ===================================================================== */}
      <section className="relative py-24 px-4 sm:px-8 bg-[#0E1611] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-14 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[11.5px] uppercase tracking-[0.24em] text-[#D9F296] font-semibold block">
              REFLECT WITH INTENT
            </span>
            <h2 className="text-4xl sm:text-5xl font-medium tracking-tight leading-[1.1]">
              Notice your emotional shifts <br />
              <span className="font-serif italic font-normal text-[#D9F296]">
                before burnout reaches you.
              </span>
            </h2>
            <p className="text-[16px] text-white/75 leading-relaxed">
              Instead of reacting after exhaustion sets in, InnerOS gently connects your daily check-ins, journal reflections, and sleep-friendly quiet hours so you can rest with intention.
            </p>
          </div>

          {/* 3 Frosted Glassmorphic Cards from Pyko 00:18 */}
          <div className="grid md:grid-cols-3 gap-7">
            {/* Card 1: Emotional Clarity Index (Bar Chart) */}
            <div className="rounded-[32px] pyko-glass p-7 flex flex-col justify-between space-y-8 hover:border-[#D9F296]/50 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[13px] text-white/75">
                  <span>Equilibrium Rhythm</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[#D9F296] font-medium">
                    +14% Steady
                  </span>
                </div>
                <div className="text-4xl font-semibold text-white">4.6 / 5</div>

                {/* Vertical Rounded Bar Chart */}
                <div className="h-36 flex items-end justify-between gap-2.5 pt-6 px-2">
                  {[45, 58, 52, 70, 66, 82, 92, 88].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div
                        className={`w-full rounded-t-lg transition-all ${
                          i >= 6
                            ? "bg-[#D9F296]"
                            : i >= 4
                              ? "bg-[#CDE5D3]/80"
                              : "bg-white/25"
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-4 border-t border-white/15">
                <h3 className="font-serif italic text-2xl text-white">
                  Emotional Clarity
                </h3>
                <p className="text-[13.5px] text-white/70 leading-relaxed">
                  Shows how consistent check-ins and unhurried journaling support your week-to-week calm.
                </p>
              </div>
            </div>

            {/* Card 2: Next Energy Drop (Light Card with Green SVG Wave) */}
            <div className="rounded-[32px] bg-[#F4F6F5] text-[#1A1E1C] p-7 flex flex-col justify-between space-y-8 shadow-2xl border border-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[13px] text-[#4A5752]">
                  <span>Rest Window Forecast</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D9F296] text-[#1A1E1C] font-semibold">
                    77% &rarr; 24% Tension
                  </span>
                </div>

                {/* Smooth SVG Curve with Callout */}
                <div className="relative h-44 bg-white rounded-2xl border border-[#E2E8E5] p-4 flex flex-col justify-between overflow-hidden">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-[#1A1E1C]">24%</span>
                    <span className="block text-[11.5px] text-[#687670]">
                      Afternoon Shoulder &amp; Jaw Tension
                    </span>
                  </div>
                  <svg viewBox="0 0 240 70" className="w-full h-20 overflow-visible">
                    <path
                      d="M 0 55 Q 40 15, 85 35 T 165 20 T 240 45"
                      fill="none"
                      stroke="#65A30D"
                      strokeWidth="3"
                    />
                    <circle cx="165" cy="20" r="5" fill="#1A1E1C" stroke="#D9F296" strokeWidth="3" />
                  </svg>
                  <div className="text-[11.5px] text-center text-[#4A5752]">
                    Gentle 2-minute breathwork pause suggested at 15:30
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-4 border-t border-[#E2E8E5]">
                <h3 className="font-serif italic text-2xl text-[#1A1E1C]">
                  Somatic Pacing Cue
                </h3>
                <p className="text-[13.5px] text-[#4A5752] leading-relaxed">
                  Anticipates afternoon cognitive fatigue and prepares buffer time around busy meetings.
                </p>
              </div>
            </div>

            {/* Card 3: Routine Stability Readout */}
            <div className="rounded-[32px] pyko-glass p-7 flex flex-col justify-between space-y-8 hover:border-[#D9F296]/50 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[13px] text-white/75">
                  <span>Sanctuary Rhythm</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D9F296]/20 text-[#D9F296] font-semibold text-[11.5px]">
                    ACTIVE
                  </span>
                </div>
                <div className="text-4xl font-semibold text-white">79%</div>

                <div className="space-y-2.5 pt-2">
                  {[
                    { label: "Morning Breath & Grounding", checked: false },
                    { label: "Afternoon Boundary Buffer", checked: false },
                    { label: "Evening Sanctuary Reflection", checked: true },
                    { label: "Circadian Quiet Hours (22:00)", checked: true },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`px-3.5 py-2.5 rounded-xl border text-[13px] flex items-center space-x-2.5 ${
                        item.checked
                          ? "bg-[#D9F296]/20 border-[#D9F296]/40 text-white font-medium"
                          : "bg-white/5 border-white/10 text-white/65"
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          item.checked ? "text-[#D9F296]" : "text-white/30"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-4 border-t border-white/15">
                <h3 className="font-serif italic text-2xl text-white">
                  Stability Readout
                </h3>
                <p className="text-[13.5px] text-white/70 leading-relaxed">
                  Celebrates your gentle daily rhythms with zero streak shaming or guilt if you miss a day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: PEOPLEFLOW ALABASTER-SAGE BENTO DASHBOARD PREVIEW
          (Matches Attached Image media_1793566474904.jpg Colors & Layout)
          ===================================================================== */}
      <section className="py-24 px-4 sm:px-8 bg-[#EDF1EF] text-[#1A1E1C]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#1A1E1C] text-[#D9F296] text-[12px] font-semibold uppercase tracking-wider">
                <span>Sanctuary Workspace Preview</span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#1A1E1C] leading-[1.1]">
                Wellbeing Management,{" "}
                <span className="font-serif italic font-normal text-[#285B55]">
                  designed for calm clarity.
                </span>
              </h2>
              <p className="text-[16px] text-[#4A5752] leading-relaxed">
                Step inside a bright, serene personal workspace where your reflections, emotional balance, daily rhythm, and growth intentions live in one harmonious Bento view.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-full bg-[#1A1E1C] text-white hover:bg-[#285B55] text-[14px] font-semibold transition-all self-start lg:self-auto shadow-sm"
            >
              <span>Open Live Dashboard</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Exact PeopleFlow 3-Column Bento Grid Preview */}
          <div className="p-6 sm:p-8 rounded-[36px] bg-[#E5EAE7] border border-white shadow-xl">
            <div className="grid lg:grid-cols-12 gap-5 items-stretch">
              {/* Left Column: 3 Metric Cards */}
              <div className="lg:col-span-3 flex flex-col justify-between gap-5">
                {/* Card A: Semi-Circular Periwinkle Gauge */}
                <div className="peopleflow-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-semibold text-[#1A1E1C]">
                      Saved Memories
                    </span>
                    <span className="w-8 h-8 rounded-full bg-[#F4F6F5] flex items-center justify-center text-[#4A5752]">
                      <Bookmark className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex items-end justify-between pt-2">
                    <div>
                      <span className="text-[12px] text-[#687670] block">
                        User-Verified
                      </span>
                      <span className="text-3xl font-bold text-[#1A1E1C]">
                        148
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-12 rounded-t-full border-[10px] border-[#CBD8F6] border-b-0 flex items-end justify-center pb-0.5">
                        <span className="text-[11px] font-bold text-[#285B55]">
                          +12% &uarr;
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card B: Mint-Sage Vertical Bars */}
                <div className="peopleflow-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-semibold text-[#1A1E1C]">
                      Present Today
                    </span>
                    <span className="w-8 h-8 rounded-full bg-[#F4F6F5] flex items-center justify-center text-[#4A5752]">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex items-end justify-between pt-2">
                    <div>
                      <span className="text-[12px] text-[#687670] block">
                        Mindful Minutes
                      </span>
                      <span className="text-3xl font-bold text-[#1A1E1C]">
                        42m
                      </span>
                    </div>
                    <div className="flex items-end space-x-2 h-14">
                      <div className="w-4 h-7 rounded-t-md bg-[#E4ECE7]" />
                      <div className="w-4 h-10 rounded-t-md bg-[#CDE5D3]" />
                      <div className="w-4 h-14 rounded-t-md bg-[#B5D8BE]" />
                    </div>
                  </div>
                </div>

                {/* Card C: Soft Rose-Blush Smooth Wave */}
                <div className="peopleflow-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-semibold text-[#1A1E1C]">
                      Active Intentions
                    </span>
                    <span className="w-8 h-8 rounded-full bg-[#F4F6F5] flex items-center justify-center text-[#4A5752]">
                      <Sprout className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex items-end justify-between pt-2">
                    <div>
                      <span className="text-[12px] text-[#687670] block">
                        This Month
                      </span>
                      <span className="text-3xl font-bold text-[#1A1E1C]">
                        18+
                      </span>
                    </div>
                    <div className="w-28 h-12 rounded-xl bg-gradient-to-t from-[#F6D4DC]/80 to-transparent flex items-start justify-center pt-1 border-b-2 border-[#E89EB1]">
                      <span className="px-2 py-0.5 rounded-full bg-[#1A1E1C] text-white text-[10px] font-semibold">
                        Calm Pace
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Column: Futuristic Portrait + Hatched Trajectory Chart */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-5">
                <div className="relative rounded-[28px] overflow-hidden h-64 sm:h-72 bg-[#E5EAE7] flex items-center justify-center">
                  <img
                    src="/images/dashboard-portrait.jpg"
                    alt="InnerOS Mindful Companion Presence"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute bottom-3 left-3 right-3 px-4 py-2.5 rounded-2xl bg-white/85 backdrop-blur-md flex items-center justify-between text-[12.5px]">
                    <span className="font-semibold text-[#1A1E1C]">
                      Living Voice &amp; Text Presence
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D9F296] text-[#1A1E1C] font-bold">
                      8 Voices Ready
                    </span>
                  </div>
                </div>

                {/* Bottom Center Card: Hatched Trajectory Chart with Lime 1,750 Pill */}
                <div className="peopleflow-card p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[16px] font-semibold text-[#1A1E1C]">
                        Wellbeing &amp; Clarity Trajectory
                      </h3>
                      <div className="flex items-center space-x-3 text-[11.5px] text-[#687670] mt-1">
                        <span className="inline-flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-[#6488EA]" />
                          <span>Clarity</span>
                        </span>
                        <span className="inline-flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-[#5BB98B]" />
                          <span>Energy</span>
                        </span>
                        <span className="inline-flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-[#E88CA5]" />
                          <span>Rest</span>
                        </span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#F4F6F5] text-[12px] font-medium text-[#1A1E1C]">
                      Last Months
                    </span>
                  </div>

                  <div className="relative h-28 rounded-2xl bg-hatch-neutral border border-[#E5EAE7] p-3 flex items-center justify-center">
                    <div className="px-3.5 py-1 rounded-full bg-[#D9F296] border border-[#1A1E1C] text-[#1A1E1C] text-[12.5px] font-bold shadow-sm">
                      94.2% Calm
                    </div>
                  </div>

                  <div className="flex justify-between text-[11.5px] text-[#687670] pt-1">
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span className="font-bold text-[#1A1E1C]">Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Emotional Balance & Daily Schedule Timeline */}
              <div className="lg:col-span-4 flex flex-col justify-between gap-5">
                {/* Top Right Card: 96.4% Balance */}
                <div className="peopleflow-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-semibold text-[#1A1E1C]">
                      Emotional Balance
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-[#687670]" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-[#1A1E1C]">
                      96.4%
                    </span>
                    <span className="text-[12.5px] text-[#687670]">
                      Steady &amp; Grounded
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-[11.5px]">
                    <div className="space-y-1.5">
                      <span className="text-[#687670] block">Grounded</span>
                      <span className="font-semibold text-[#1A1E1C] block">
                        24 Days
                      </span>
                      <div className="h-5 rounded-md bg-hatch-neutral border border-[#DCE3DF]" />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[#687670] block">Reflective</span>
                      <span className="font-semibold text-[#1A1E1C] block">
                        5 Days
                      </span>
                      <div className="h-5 rounded-md bg-[#CBD8F6]" />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[#687670] block">Rested</span>
                      <span className="font-semibold text-[#1A1E1C] block">
                        10 Hrs
                      </span>
                      <div className="h-5 rounded-md bg-[#CDE5D3]" />
                    </div>
                  </div>
                </div>

                {/* Bottom Right Card: Daily Schedule with Lime 15:30 Pill */}
                <div className="peopleflow-card p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-semibold text-[#1A1E1C]">
                      Gentle Schedule
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-7 h-7 rounded-full bg-[#F4F6F5] flex items-center justify-center text-[#1A1E1C]">
                        <Calendar className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 rounded-full bg-[#D9F296] text-[#1A1E1C] text-[11.5px] font-bold">
                        08:30
                      </span>
                      <div className="flex-1 p-3 rounded-2xl bg-[#F4F6F5] flex items-center justify-between">
                        <div>
                          <span className="text-[13px] font-semibold text-[#1A1E1C] block">
                            Morning Breath &amp; Check-In
                          </span>
                          <span className="text-[11.5px] text-[#687670]">
                            3 slow physical sensations
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-white text-[11px] font-medium text-[#285B55]">
                          Opt-in
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 rounded-full bg-[#F4F6F5] text-[#4A5752] text-[11.5px] font-semibold">
                        15:30
                      </span>
                      <div className="flex-1 p-3 rounded-2xl bg-hatch-neutral border border-[#E5EAE7] flex items-center justify-between">
                        <div>
                          <span className="text-[13px] font-semibold text-[#1A1E1C] block">
                            Afternoon Boundary Buffer
                          </span>
                          <span className="text-[11.5px] text-[#687670]">
                            15m quiet transition pause
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#CBD8F6] text-[11px] font-semibold text-[#1A1E1C]">
                          Synced
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 rounded-full bg-[#F4F6F5] text-[#4A5752] text-[11.5px] font-semibold">
                        21:15
                      </span>
                      <div className="flex-1 p-3 rounded-2xl bg-[#F4F6F5] flex items-center justify-between">
                        <div>
                          <span className="text-[13px] font-semibold text-[#1A1E1C] block">
                            Evening Sanctuary Reflection
                          </span>
                          <span className="text-[11.5px] text-[#687670]">
                            Quiet hours begin at 22:00
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#CDE5D3] text-[11px] font-semibold text-[#1A1E1C]">
                          Protected
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5: INTERACTIVE LIVE PRODUCT SANDBOX (VOICE, CHAT & MEMORY)
          ===================================================================== */}
      <section className="py-24 px-4 sm:px-8 bg-[#F4F6F5] text-[#1A1E1C] border-t border-[#E2E8E5]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#CDE5D3] text-[#1A1E1C] text-[12px] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Companion Sandbox</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#1A1E1C] leading-[1.12]">
              Experience Voice, Text &amp;{" "}
              <span className="font-serif italic font-normal text-[#285B55]">
                User-Approved Memory.
              </span>
            </h2>
            <p className="text-[16px] text-[#4A5752] leading-relaxed">
              Test how InnerOS responds in real time. Switch between the Voice Room, Text Conversation modes, and transparent Memory approval right here before creating your account.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 text-[14.5px] text-[#1A1E1C]">
                <span className="w-6 h-6 rounded-full bg-[#D9F296] flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <span>Recalls your Journal, Growth Goals &amp; Daily Check-Ins</span>
              </div>
              <div className="flex items-center space-x-3 text-[14.5px] text-[#1A1E1C]">
                <span className="w-6 h-6 rounded-full bg-[#CBD8F6] flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <span>Separates tentative AI hypotheses from verified facts</span>
              </div>
              <div className="flex items-center space-x-3 text-[14.5px] text-[#1A1E1C]">
                <span className="w-6 h-6 rounded-full bg-[#F6D4DC] flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <span>Built-in Tier-1 &amp; Tier-2 crisis safety circuit breakers</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <InteractiveHeroPreview />
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 6: THE MIND BEHIND INNEROS — BIOLUMINESCENT LIFE GRAPH (PYKO 00:22)
          ===================================================================== */}
      <section id="life-graph" className="relative py-28 px-4 sm:px-8 bg-[#070E09] text-white overflow-hidden">
        {/* High-Resolution Bioluminescent Life Graph Looping Background Video */}
        <video
          ref={lifeGraphVideoRef}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          autoPlay
          muted
          loop
          playsInline
          style={{
            imageRendering: "-webkit-optimize-contrast",
            WebkitBackfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
        >
          <source src="/videos/lifegraph-sphere.mp4" type="video/mp4" />
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_102608_5fa1187d-9ac6-44fb-82ab-54376200abc0.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#070E09] via-transparent to-[#070E09] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <span className="text-[11.5px] uppercase tracking-[0.24em] text-[#9EE838] font-semibold block">
            THE MEMORY ENGINE BEHIND INNEROS
          </span>
          <h2 className="text-4xl sm:text-6xl font-medium tracking-tight leading-[1.08]">
            Life Graph understands <br />
            <span className="font-serif italic font-normal text-[#D9F296]">
              what matters to you.
            </span>
          </h2>

          {/* Floating Orbital Node Tags around the Sphere */}
          <div className="py-16 sm:py-24 relative flex items-center justify-center">
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl">
              {[
                "PERSONAL GOALS",
                "COPING PREFERENCES",
                "RELATIONSHIPS",
                "HABITS & ROUTINES",
                "WORK CONTEXT",
                "EXPLICIT CONSENT",
              ].map((tag, idx) => (
                <span
                  key={tag}
                  className={`px-4 py-2 rounded-full text-[12px] font-semibold tracking-wider backdrop-blur-xl border ${
                    idx % 2 === 0
                      ? "bg-[#D9F296]/20 border-[#D9F296]/50 text-[#D9F296]"
                      : "bg-white/10 border-white/25 text-white"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p className="text-[16.5px] text-white/80 max-w-2xl mx-auto leading-relaxed">
            InnerOS connects your approved memories, journal entries, and personal intentions into an inspectable visual Life Graph. Every node is transparent, editable, and erasable with a single click.
          </p>

          <div>
            <Link
              href="/memory"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white text-[#1A1E1C] hover:bg-[#D9F296] text-[14px] font-semibold transition-all"
            >
              <span>Explore Life Graph</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 7: SMARTER WAY TO TRACK YOUR PROGRESS (PYKO 00:26)
          ===================================================================== */}
      <section className="relative py-24 px-4 sm:px-8 bg-[#0A130D] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Floating Glass Card */}
          <div className="lg:col-span-4 rounded-[32px] pyko-glass p-7 space-y-5">
            <div className="w-10 h-10 rounded-2xl bg-[#D9F296]/20 border border-[#D9F296]/40 flex items-center justify-center text-[#D9F296]">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-serif italic text-2xl text-white">
              Real-Time Context Recall
            </h3>
            <p className="text-[14.5px] text-white/75 leading-relaxed">
              Ask your companion about what you wrote in your journal, your active growth steps, or your recent energy check-ins—and receive grounded, context-aware reflections immediately.
            </p>
          </div>

          {/* Center Headline */}
          <div className="lg:col-span-4 text-center space-y-4 px-2">
            <span className="text-[11.5px] uppercase tracking-[0.24em] text-[#D9F296] font-semibold block">
              AWARENESS DASHBOARD
            </span>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight leading-[1.1]">
              Smarter way to <br />
              <span className="font-serif italic font-normal text-[#E5F2E0]">
                Honour your Growth
              </span>
            </h2>
            <p className="text-[14.5px] text-white/75 leading-relaxed">
              See the gentle patterns behind your mood, energy, and boundaries without rigid productivity scores.
            </p>
          </div>

          {/* Right Floating Glass Card */}
          <div className="lg:col-span-4 rounded-[32px] pyko-glass p-7 space-y-5">
            <div className="w-10 h-10 rounded-2xl bg-[#CBD8F6]/20 border border-[#CBD8F6]/40 flex items-center justify-center text-[#CBD8F6]">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="font-serif italic text-2xl text-white">
              Somatic &amp; Energy Pacing
            </h3>
            <p className="text-[14.5px] text-white/75 leading-relaxed">
              Measures how restorative your daily routines feel and automatically silences non-urgent prompts during your circadian quiet hours.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 8: THE ENGINE THAT ADAPTS TO HOW YOU FEEL (PYKO 00:33)
          ===================================================================== */}
      <section className="relative py-28 px-4 sm:px-8 bg-gradient-to-b from-[#1F2C21] via-[#344635] to-[#1A241B] text-white overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[11.5px] uppercase tracking-[0.24em] text-[#D9F296] font-semibold block">
              MULTIMODAL COMPANION ENGINE
            </span>
            <h2 className="text-4xl sm:text-5xl font-medium tracking-tight leading-[1.1]">
              The companion that adapts <br />
              <span className="font-serif italic font-normal text-[#ECF4E8]">
                to how you feel.
              </span>
            </h2>
            <p className="text-[16px] text-white/80 leading-relaxed">
              InnerOS adjusts its warmth, directness, and conversational mode around your emotional state—whether you want quiet listening or structured problem-solving.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Glass Card: Semi-Circular Adaptive Dial */}
            <div className="rounded-[32px] pyko-glass p-8 flex flex-col justify-between space-y-8">
              <div className="flex flex-col items-center justify-center pt-4">
                <div className="w-56 h-28 rounded-t-full border-[6px] border-[#9EE838] border-b-0 relative flex items-end justify-center pb-2">
                  <div className="text-center">
                    <span className="text-[11px] uppercase tracking-widest text-[#D9F296] block">
                      Active Mode
                    </span>
                    <span className="text-lg font-semibold text-white">
                      {modes[activeModeIdx].name}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-5">
                  {modes.map((m, idx) => (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => setActiveModeIdx(idx)}
                      className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-all ${
                        activeModeIdx === idx
                          ? "bg-[#D9F296] text-[#1A1E1C] font-semibold"
                          : "bg-white/10 text-white/80 hover:bg-white/20"
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center space-y-2 pt-2 border-t border-white/15">
                <h3 className="font-serif italic text-2xl text-white">
                  Adaptive Companion Modes
                </h3>
                <p className="text-[14px] text-white/80 leading-relaxed">
                  {modes[activeModeIdx].desc}
                </p>
              </div>
            </div>

            {/* Right Glass Card: 4-Stage Reflection Cycle */}
            <div className="rounded-[32px] pyko-glass p-8 flex flex-col justify-between space-y-8">
              <div className="flex items-center justify-center py-4">
                <div className="relative w-48 h-48 rounded-full border border-white/25 flex items-center justify-center">
                  <span className="px-3 py-1 rounded-full bg-white/15 text-[11.5px] font-semibold text-[#D9F296]">
                    Voice &amp; Text Loop
                  </span>
                  <span className="absolute -top-3 px-3 py-1 rounded-full bg-[#1A241B] border border-white/25 text-[11.5px]">
                    Express
                  </span>
                  <span className="absolute -bottom-3 px-3 py-1 rounded-full bg-[#1A241B] border border-white/25 text-[11.5px]">
                    Integrate
                  </span>
                  <span className="absolute -left-6 px-3 py-1 rounded-full bg-[#1A241B] border border-white/25 text-[11.5px]">
                    Settle
                  </span>
                  <span className="absolute -right-6 px-3 py-1 rounded-full bg-[#D9F296] text-[#1A1E1C] font-semibold text-[11.5px]">
                    Reflect
                  </span>
                </div>
              </div>

              <div className="text-center space-y-2 pt-2 border-t border-white/15">
                <h3 className="font-serif italic text-2xl text-white">
                  Seamless Voice &amp; Text Continuity
                </h3>
                <p className="text-[14px] text-white/80 leading-relaxed">
                  Start speaking out loud on an evening walk and continue in written chat or your private journal without losing context.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 9: INNEROS EVOLVES WITH YOU + 5-STEP RHYTHM (PYKO 00:40)
          ===================================================================== */}
      <section className="py-24 px-4 sm:px-8 bg-[#0B120D] text-white overflow-hidden border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Kinetic Giant Display Banner */}
          <div className="border-b border-white/15 pb-10">
            <div className="text-5xl sm:text-7xl lg:text-[92px] font-semibold tracking-tight leading-none">
              <span className="text-[#9EE838]">InnerOS</span> evolves{" "}
              <span className="text-white/30 font-light">&mdash;</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[11.5px] uppercase tracking-[0.24em] text-[#D9F296] font-semibold block">
                ADAPTIVE SANCTUARY
              </span>
              <h2 className="text-3xl sm:text-5xl font-medium tracking-tight leading-[1.12]">
                A platform that <br />
                <span className="font-serif italic font-normal text-[#D9F296]">
                  evolves with you.
                </span>
              </h2>
              <p className="text-[15.5px] text-white/75 leading-relaxed">
                InnerOS continuously honours your boundaries, preferred tone, and personal intentions—transforming into a calmer, more relevant space without ever using manipulative engagement tricks.
              </p>
              <ul className="space-y-3 text-[14.5px] text-white/85 pt-2">
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full bg-[#9EE838]" />
                  <span>Learns your preferred conversational warmth and directness</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full bg-[#9EE838]" />
                  <span>Connects journal reflections and growth steps into chat</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full bg-[#9EE838]" />
                  <span>Respects circadian quiet hours and lock-screen privacy</span>
                </li>
              </ul>
            </div>

            {/* 5-Step Journey Cards */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {HOW_IT_WORKS_PREVIEW.map((item) => (
                <div
                  key={item.step}
                  className="p-6 rounded-[28px] pyko-glass space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-[12px] font-bold ${item.accent}`}
                    >
                      Step {item.step}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-white/40" />
                  </div>
                  <h3 className="text-xl font-serif italic text-white">
                    {item.title}
                  </h3>
                  <p className="text-[13.5px] text-white/75 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 10: 17-DEPARTMENT EVIDENCE-GRADED PSYCHOLOGY LIBRARY
          ===================================================================== */}
      <section className="py-24 px-4 sm:px-8 bg-[#EDF1EF] text-[#1A1E1C]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#CBD8F6] text-[#1A1E1C] text-[12px] font-semibold">
                <Compass className="w-3.5 h-3.5" />
                <span>17 Psychology Departments</span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#1A1E1C] leading-[1.1]">
                Peer-reviewed wisdom,{" "}
                <span className="font-serif italic font-normal text-[#285B55]">
                  never pop-psychology.
                </span>
              </h2>
              <p className="text-[16px] text-[#4A5752] leading-relaxed">
                Every educational guide and grounding exercise in InnerOS is graded by evidence quality, cited with APA provenance, and separated from unverified trade literature.
              </p>
            </div>
            <Link
              href="/knowledge"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#1A1E1C] text-white hover:bg-[#285B55] text-[14px] font-semibold transition-all self-start md:self-auto"
            >
              <span>Browse Psychology Library</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PSYCHOLOGY_PILLARS.map((item) => (
              <div
                key={item.dept}
                className="peopleflow-card p-6 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[11.5px] font-bold text-[#1A1E1C] ${item.pillBg}`}
                  >
                    {item.tier}
                  </span>
                  <h3 className="text-xl font-semibold text-[#1A1E1C]">
                    {item.dept}
                  </h3>
                  <p className="text-[14px] text-[#4A5752] leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                <Link
                  href="/knowledge"
                  className="inline-flex items-center space-x-1.5 text-[13.5px] font-semibold text-[#1A1E1C] hover:text-[#285B55]"
                >
                  <span>Read guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 11: CONNECTED ARCHIVES & MULTILINGUAL FLUENCY
          ===================================================================== */}
      <section className="py-24 px-4 sm:px-8 bg-[#E5EAE7] text-[#1A1E1C] border-t border-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Card 1: 8-Step PII-Scrubbed Context Hub */}
          <div className="peopleflow-card p-8 sm:p-10 space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#D9F296] text-[#1A1E1C] text-[12px] font-bold">
                User-Controlled Integrations
              </span>
              <h3 className="text-2xl sm:text-3xl font-medium text-[#1A1E1C]">
                Bring your past reflections{" "}
                <span className="font-serif italic font-normal text-[#285B55]">
                  with full PII scrubbing.
                </span>
              </h3>
              <p className="text-[15px] text-[#4A5752] leading-relaxed">
                Import ChatGPT or Claude archives, Markdown journals, or read-only Google Calendar events. InnerOS automatically redacts emails, phone numbers, and street addresses, disarms prompt injections, and stages candidate memories for your review.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                "ChatGPT JSON",
                "Claude Export",
                "Markdown / TXT",
                "Google Calendar OAuth 2.0",
                "GDPR Art. 17 Revocation",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full bg-[#F4F6F5] border border-[#DCE3DF] text-[12.5px] font-medium text-[#1A1E1C]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div>
              <Link
                href="/integrations"
                className="inline-flex items-center space-x-2 text-[14px] font-semibold text-[#1A1E1C] hover:text-[#285B55] underline underline-offset-4"
              >
                <span>Open Connected Archives</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: 30-Language Readiness & Cultural Empathy */}
          <div className="peopleflow-card p-8 sm:p-10 space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#F6D4DC] text-[#1A1E1C] text-[12px] font-bold">
                Global Multilingual Architecture
              </span>
              <h3 className="text-2xl sm:text-3xl font-medium text-[#1A1E1C]">
                Express yourself in the{" "}
                <span className="font-serif italic font-normal text-[#285B55]">
                  language of your home.
                </span>
              </h3>
              <p className="text-[15px] text-[#4A5752] leading-relaxed">
                Built with native-level cultural nuance, full RTL layout support for Arabic and Urdu, and localized crisis support routing across 8 priority languages and 30 voice locales.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {[
                "English (EN)",
                "Español (ES)",
                "Français (FR)",
                "Deutsch (DE)",
                "Български (BG)",
                "العربية (AR)",
                "اردو (UR)",
                "हिन्दी (HI)",
              ].map((lang) => (
                <div
                  key={lang}
                  className="px-3 py-2 rounded-xl bg-[#F4F6F5] text-[12.5px] font-semibold text-[#1A1E1C] text-center"
                >
                  {lang}
                </div>
              ))}
            </div>
            <div>
              <Link
                href="/companion/voice"
                className="inline-flex items-center space-x-2 text-[14px] font-semibold text-[#1A1E1C] hover:text-[#285B55] underline underline-offset-4"
              >
                <span>Explore Multilingual Voice Room</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 12: YOU ARE NOT LIKE EVERYONE ELSE + TRANSPARENT PRICING (PYKO 00:45-00:50)
          ===================================================================== */}
      <section className="relative py-28 px-4 sm:px-8 bg-[#09110B] text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none"
          style={{ backgroundImage: "url('/images/hero-moss-arch.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#09110B] via-[#0F1D13]/85 to-[#0B120D] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto space-y-20">
          {/* Statement Block (Pyko 00:45) */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="text-[11.5px] uppercase tracking-[0.24em] text-[#D9F296] font-semibold block">
              INNEROS HONOURS YOUR AUTONOMY
            </span>
            <h2 className="text-4xl sm:text-6xl font-medium tracking-tight leading-[1.08]">
              You are not like everyone else.{" "}
              <span className="font-serif italic font-normal text-[#D9F296] block mt-1">
                Your companion should not be either.
              </span>
            </h2>
            <p className="text-[16.5px] text-white/80 leading-relaxed max-w-xl mx-auto">
              Start with a private sanctuary that respects your consent, never sells or trains on your personal reflections, and keeps 24/7 crisis support free for everyone.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white text-[#1A1E1C] hover:bg-[#D9F296] text-[14px] font-semibold transition-all"
              >
                <span>Enter InnerOS</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={openCrisisModal}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white text-[14px] font-medium transition-all"
              >
                <LifeBuoy className="w-4 h-4 text-[#F6D4DC]" />
                <span>24/7 Crisis Helplines</span>
              </button>
            </div>
          </div>

          {/* Two Frosted Glass Pricing Cards Over Moss Canopy (Pyko 00:49) */}
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="inline-flex items-center p-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setBillingAnnual(true)}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                    billingAnnual
                      ? "bg-[#D9F296] text-[#1A1E1C]"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  Annual (Save 20%)
                </button>
                <button
                  type="button"
                  onClick={() => setBillingAnnual(false)}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                    !billingAnnual
                      ? "bg-[#D9F296] text-[#1A1E1C]"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Card 1: Core Sanctuary */}
              <div className="rounded-[32px] pyko-glass p-8 sm:p-10 flex flex-col justify-between space-y-8">
                <div className="space-y-5">
                  <span className="font-serif italic text-xl text-white/90 block">
                    Core Sanctuary
                  </span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-5xl font-semibold text-white">
                      $0.00
                    </span>
                    <span className="text-[14px] text-white/65">/forever</span>
                  </div>
                  <ul className="space-y-3 text-[14.5px] text-white/85 pt-2">
                    <li className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D9F296] shrink-0" />
                      <span>Daily check-ins, private journal &amp; growth goals</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D9F296] shrink-0" />
                      <span>5-Mode Text Companion &amp; Crisis Support Directory</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D9F296] shrink-0" />
                      <span>Full GDPR data export &amp; one-click memory deletion</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/15">
                  <p className="text-[12.5px] text-white/65">
                    Safety tools and privacy controls are never paywalled.
                  </p>
                  <Link
                    href="/signup"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white text-[#1A1E1C] hover:bg-[#D9F296] text-[13.5px] font-semibold transition-all"
                  >
                    <span>Start with Core</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Card 2: Living Presence Plus */}
              <div className="rounded-[32px] pyko-glass p-8 sm:p-10 flex flex-col justify-between space-y-8 border-[#D9F296]/40">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="font-serif italic text-xl text-[#D9F296] block">
                      Full Adaptive Sanctuary
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D9F296] text-[#1A1E1C] text-[11px] font-bold">
                      Preview
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-5xl font-semibold text-white">
                      {billingAnnual ? "$12.30" : "$15.00"}
                    </span>
                    <span className="text-[14px] text-white/65">/month</span>
                  </div>
                  <ul className="space-y-3 text-[14.5px] text-white/85 pt-2">
                    <li className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D9F296] shrink-0" />
                      <span>Unlimited Real-Time Voice Companion in 30 languages</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D9F296] shrink-0" />
                      <span>Interactive Visual Life Graph &amp; Archive Imports</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D9F296] shrink-0" />
                      <span>17-Department Peer-Reviewed Psychology Library</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/15">
                  <p className="text-[12.5px] text-white/65">
                    Cancel anytime with one click &bull; Zero lock-in
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#D9F296] text-[#1A1E1C] hover:bg-white text-[13.5px] font-semibold transition-all"
                  >
                    <span>Explore Full Suite</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
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
