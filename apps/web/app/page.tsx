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
  ChevronDown,
} from "lucide-react";

const HOW_IT_WORKS_PREVIEW = [
  {
    step: "01",
    title: "Check in with your voice",
    desc: "Speak naturally with the voice companion or write a few lines about what is on your mind in any of 8 languages.",
    accent: "bg-[#EEF4FF] text-[#2B4CDE] border border-[#DCE7FE]",
  },
  {
    step: "02",
    title: "Choose your companion style",
    desc: "Pick whether you want your companion to Just Listen, Help You Understand, Help You Settle, or Guide Problem-Solving.",
    accent: "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]",
  },
  {
    step: "03",
    title: "Reflect and uncover patterns",
    desc: "Explore gentle journaling prompts, emotional wave graphs, and evidence-informed psychology concepts.",
    accent: "bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]",
  },
  {
    step: "04",
    title: "Set values-aligned intentions",
    desc: "Break down personal growth milestones into calm, realistic steps anchored to what truly matters to you.",
    accent: "bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]",
  },
  {
    step: "05",
    title: "Review your Life Graph memory",
    desc: "Revisit your user-approved memories, connections, and reflections without streak guilt or anxiety.",
    accent: "bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3]",
  },
];

const PSYCHOLOGY_PILLARS = [
  {
    dept: "Acceptance & Commitment (ACT)",
    summary: "Step back from heavy thoughts with cognitive defusion, mindfulness, and values-aligned action.",
    tier: "Tier 1 Meta-Analysis",
    pillBg: "bg-[#EEF4FF] text-[#2B4CDE] border border-[#DCE7FE]",
  },
  {
    dept: "Somatic & Polyvagal Regulation",
    summary: "Settle sympathetic nervous system activation through paced breathwork, vagus nerve cues, and grounding.",
    tier: "Peer-Reviewed Clinical",
    pillBg: "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]",
  },
  {
    dept: "Cognitive Behavioral Framing",
    summary: "Identify all-or-nothing cognitive distortions gently without self-judgment or rigid grading.",
    tier: "Tier 1 Systematic Review",
    pillBg: "bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]",
  },
  {
    dept: "Relational & Attachment Clarity",
    summary: "Navigate interpersonal boundaries, difficult conversations, and attachment styles with warmth.",
    tier: "Evidence-Graded Guide",
    pillBg: "bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]",
  },
];

const FAQS = [
  {
    q: "How does the AI voice companion understand my emotions?",
    a: "InnerOS pairs acoustic cadence detection and semantic emotional analysis in real-time. It notices shifts like fatigue, hesitation, or anxiety and adjusts its vocal warmth and pacing naturally—just like speaking with a thoughtful, attentive friend.",
  },
  {
    q: "Can I speak to InnerOS in different languages?",
    a: "Yes. InnerOS natively detects and responds in your language without requiring manual switching, supporting English, Spanish, French, German, Arabic, Urdu, Bulgarian, and Hindi across 30 spoken accents.",
  },
  {
    q: "Is my personal reflection data kept private and confidential?",
    a: "Strictly. Your reflections, journal entries, and voice transcripts are encrypted and stored in your private sanctuary. We never sell your data, never display third-party advertisements, and never use personal reflections to train public models.",
  },
  {
    q: "What is the difference between Core and Full Adaptive Sanctuary?",
    a: "Core is 100% free forever and includes daily check-ins, private journaling, text companion with 5 modes, and full GDPR export. Full Adaptive Sanctuary adds unlimited real-time voice sessions, the interactive Visual Life Graph, and the 17-department evidence psychology library.",
  },
  {
    q: "Is InnerOS a replacement for professional therapy or medical care?",
    a: "No. InnerOS is an evidence-informed reflective companion and wellness tracking sanctuary. It provides evidence-graded self-reflection tools, but does not provide psychiatric diagnoses or medical treatments. 24/7 crisis helplines are prominently accessible worldwide at any time.",
  },
];

function MarketingHomeContent() {
  const { localeConfig, openCrisisModal } = useMarketingLocale();
  const [billingAnnual, setBillingAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
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
          SECTION 1: HERO SECTION — AI MENTAL WELLNESS PLATFORM (DRIBBLE 27821075)
          ===================================================================== */}
      <section className="relative min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-16 px-4 sm:px-8 overflow-hidden bg-[#F8FAFC]">
        {/* Ambient Calming Background Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(43,76,222,0.12),rgba(220,231,254,0.3)_40%,rgba(248,250,252,0)_75%)] blur-2xl" />
          <div className="absolute top-1/3 left-10 w-96 h-96 bg-[radial-gradient(circle,rgba(56,189,248,0.12),transparent_70%)] blur-3xl" />
          <div className="absolute top-1/2 right-10 w-96 h-96 bg-[radial-gradient(circle,rgba(139,92,246,0.10),transparent_70%)] blur-3xl" />
        </div>

        {/* Optional High-Res Hero Video Background with Gentle Soft-Light Overlay */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none overflow-hidden mix-blend-multiply">
          <video
            ref={heroVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/videos/hero-background.mp4" type="video/mp4" />
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_230229_7c9bc431-46cf-489a-948d-e8144d8eb5d4.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto w-full pt-4 sm:pt-8 text-center space-y-6">
          {/* Eyebrow Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#EEF4FF] border border-[#DCE7FE] text-[#2B4CDE] text-[12.5px] font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#2B4CDE]" />
            <span>AI-Driven Mental Health &bull; Personalized Wellness Sanctuary</span>
          </div>

          {/* Clean Sans Hero Headline with Royal Blue Gradient Accent */}
          <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-bold text-[#0F172A] tracking-tight leading-[1.06] max-w-4xl mx-auto">
            Empower your mind with{" "}
            <span className="text-[#2B4CDE] block mt-1">
              AI-driven emotional clarity.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-[17px] sm:text-[19px] text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Talk naturally with your empathetic voice companion, track your daily mood shifts, navigate life transitions, and discover science-backed serenity—all in a private, encrypted sanctuary.
          </p>

          {/* Centered Pill Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/onboarding"
              onClick={() =>
                trackMarketingEvent("cta_start_journey_click", {
                  location: "hero",
                })
              }
              className="inline-flex items-center space-x-2.5 px-7 py-3.5 rounded-full bg-[#2B4CDE] hover:bg-[#1E3A8A] text-white text-[14.5px] font-semibold transition-all shadow-[0_8px_24px_rgba(43,76,222,0.28)] hover:shadow-[0_12px_32px_rgba(43,76,222,0.38)] group"
            >
              <span>{localeConfig.ctaStart}</span>
              <span className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/companion/voice"
              onClick={() =>
                trackMarketingEvent("cta_open_app_click", { location: "hero" })
              }
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#EEF4FF] text-[#0F172A] hover:text-[#2B4CDE] border border-[#DCE7FE] text-[14.5px] font-semibold transition-all shadow-xs"
            >
              <Mic className="w-4 h-4 text-[#2B4CDE]" />
              <span>Explore Voice Companion</span>
            </Link>
          </div>

          {/* Trust / Privacy Proof Strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[12.5px] text-[#64748B]">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="text-[#F59E0B]">★</span> 4.9/5 from 15,000+ mindful members
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
              100% HIPAA &amp; GDPR Private
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Lock className="w-3.5 h-3.5 text-[#2B4CDE]" />
              Zero Model Retraining
            </span>
          </div>
        </div>

        {/* Centerpiece Floating AI Wellness Mockup Bento (Matches Imran Hossen Dribbble Shot) */}
        <div className="relative z-10 max-w-7xl mx-auto w-full mt-12 grid lg:grid-cols-12 gap-6 items-center">
          {/* Left Card: Emotional Balance & Wave Analytics */}
          <div className="lg:col-span-3 rounded-[32px] bg-white border border-[#DCE7FE] p-6 shadow-[0_12px_36px_rgba(43,76,222,0.06)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] uppercase tracking-wider font-semibold text-[#64748B]">
                Equilibrium Rhythm
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] text-[11px] font-bold border border-[#A7F3D0]">
                +14% Steady
              </span>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#0F172A]">96.4%</div>
              <div className="text-[12.5px] text-[#64748B]">
                Emotional Balance Index
              </div>
            </div>

            {/* Smooth SVG Wave Graph */}
            <div className="h-24 bg-[#F8FAFC] rounded-2xl p-2.5 flex flex-col justify-end border border-[#E2E8F0] relative overflow-hidden">
              <svg viewBox="0 0 200 60" className="w-full h-16 overflow-visible">
                <defs>
                  <linearGradient id="heroWaveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2B4CDE" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#2B4CDE" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 45 Q 35 15, 70 30 T 140 15 T 200 35 L 200 60 L 0 60 Z"
                  fill="url(#heroWaveGrad)"
                />
                <path
                  d="M 0 45 Q 35 15, 70 30 T 140 15 T 200 35"
                  fill="none"
                  stroke="#2B4CDE"
                  strokeWidth="2.5"
                />
                <circle cx="140" cy="15" r="4" fill="#FFFFFF" stroke="#2B4CDE" strokeWidth="2.5" />
              </svg>
            </div>
            <div className="text-[12px] text-[#475569] leading-relaxed">
              Consistently peaceful morning &amp; evening transitions recorded.
            </div>
          </div>

          {/* Center Card: Live AI Mental Health Companion Chat Showcase */}
          <div className="lg:col-span-6 rounded-[32px] bg-white border border-[#DCE7FE] p-7 shadow-[0_20px_50px_rgba(43,76,222,0.10)] space-y-5">
            {/* Companion Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2B4CDE] text-white flex items-center justify-center font-bold shadow-xs">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#0F172A] flex items-center space-x-2">
                    <span>InnerOS Companion</span>
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  </div>
                  <div className="text-[12px] text-[#64748B]">
                    Active Sanctuary &bull; 8 Languages Live
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#EEF4FF] text-[#2B4CDE] text-[12px] font-semibold border border-[#DCE7FE]">
                Just Listen Mode
              </span>
            </div>

            {/* Conversation Bubbles */}
            <div className="space-y-3.5">
              {/* User Bubble */}
              <div className="flex justify-end">
                <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-br-sm bg-[#EEF4FF] border border-[#DCE7FE] text-[14.5px] text-[#0F172A] leading-relaxed">
                  I&apos;ve been feeling quite overwhelmed with work deadlines this week and need a quiet space to reset...
                </div>
              </div>

              {/* Companion Bubble */}
              <div className="flex justify-start">
                <div className="max-w-[90%] px-4 py-3 rounded-2xl rounded-bl-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[14.5px] text-[#0F172A] leading-relaxed space-y-2">
                  <p>
                    I hear you completely. Carrying competing deadlines is exhausting, and you don&apos;t have to solve anything right now.
                  </p>
                  <p className="text-[#475569]">
                    Let&apos;s take a slow breath together. Would you like to unpack what part of today felt the heaviest, or shall we do a 2-minute somatic reset?
                  </p>
                </div>
              </div>

              {/* Detected Emotion Chip */}
              <div className="flex items-center justify-between pt-1 text-[12px]">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] font-semibold border border-[#A7F3D0]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Detected State: Work Strain &bull; Compassionate Pacing Active</span>
                </span>
                <span className="text-[#64748B]">Auto-detected</span>
              </div>
            </div>

            {/* Simulated Voice Waveform Bar */}
            <div className="pt-2 flex items-center justify-between p-3 rounded-2xl bg-[#EEF4FF]/70 border border-[#DCE7FE]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#2B4CDE] text-white flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <span className="text-[13px] font-semibold text-[#0F172A]">
                  Natural Voice Turn-Taking
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-1 h-3 rounded-full bg-[#2B4CDE]/60 animate-pulse" />
                <span className="w-1 h-5 rounded-full bg-[#2B4CDE] animate-pulse" />
                <span className="w-1 h-7 rounded-full bg-[#2B4CDE] animate-pulse" />
                <span className="w-1 h-4 rounded-full bg-[#2B4CDE]/80 animate-pulse" />
                <span className="w-1 h-2 rounded-full bg-[#2B4CDE]/40 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right Card: Mindful Somatic Reset & Sleep */}
          <div className="lg:col-span-3 space-y-5">
            {/* Top Right: Box Breathing Somatic Cue */}
            <div className="rounded-[32px] bg-white border border-[#DCE7FE] p-6 shadow-[0_12px_36px_rgba(43,76,222,0.06)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] uppercase tracking-wider font-semibold text-[#64748B]">
                  Somatic Reset
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EEF4FF] text-[#2B4CDE] text-[11px] font-bold border border-[#DCE7FE]">
                  Box Pacing
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative w-14 h-14 rounded-full border-4 border-[#2B4CDE]/20 flex items-center justify-center shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#EEF4FF] flex items-center justify-center text-[#2B4CDE] font-bold text-xs animate-breathe">
                    4s
                  </div>
                </div>
                <div>
                  <div className="text-[14px] font-bold text-[#0F172A]">
                    4-4-4-4 Breathwork
                  </div>
                  <div className="text-[12px] text-[#64748B]">
                    Settles vagus nerve in 60s
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Right: Sleep & Circadian Rhythm */}
            <div className="rounded-[32px] bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.12)] space-y-4">
              <div className="flex items-center justify-between text-[12px] text-slate-300">
                <span>Rest &amp; Circadian Rhythm</span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[#38BDF8] font-medium text-[11px]">
                  Protected
                </span>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">8h 12m</div>
                <div className="text-[12.5px] text-slate-400">
                  Rest Window &bull; Quiet Hours active
                </div>
              </div>
              <div className="text-[12px] text-slate-300 leading-relaxed pt-1 border-t border-slate-700">
                Non-urgent prompts automatically paused between 22:00 and 08:00.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: TRUST & CLINICAL CREDIBILITY METRICS BAR
          ===================================================================== */}
      <section className="py-12 px-4 sm:px-8 bg-white border-y border-[#DCE7FE]/60">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#2B4CDE]">
              120,000+
            </div>
            <div className="text-[13.5px] font-medium text-[#475569]">
              Mindful Reflections Supported
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#059669]">
              96.4%
            </div>
            <div className="text-[13.5px] font-medium text-[#475569]">
              Reported Emotional Calm
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#7C3AED]">
              17 Departments
            </div>
            <div className="text-[13.5px] font-medium text-[#475569]">
              Evidence-Graded Psychology
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
              100% Private
            </div>
            <div className="text-[13.5px] font-medium text-[#475569]">
              HIPAA &amp; GDPR Data Ownership
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: ABOUT US / EMPOWER YOUR INNER STRENGTH (DRIBBLE AESTHETIC)
          ===================================================================== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-8 bg-[#F0F5FF] text-[#0F172A] overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#EEF4FF] text-[#2B4CDE] border border-[#DCE7FE] text-[12px] font-bold uppercase tracking-wider">
            <span>Our Philosophy</span>
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] text-[#0F172A]">
            Awareness is your <br />
            <span className="text-[#2B4CDE] font-semibold">
              greatest inner strength.
            </span>
          </h2>
          <p className="text-[17px] sm:text-[19px] text-[#475569] leading-relaxed max-w-2xl mx-auto">
            Most wellbeing tools track rigid streaks and numbers. Few help you understand what drives how you feel. InnerOS turns everyday conversations, voice reflections, and somatic check-ins into gentle self-awareness—revealing the connections behind your energy, boundaries, and calm.
          </p>
          <div className="pt-3">
            <Link
              href="/about"
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full bg-[#2B4CDE] text-white hover:bg-[#1E3A8A] text-[14.5px] font-semibold transition-all shadow-md"
            >
              <span>Read Our Philosophy</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: OPERATE WITH INTENT — 3 WELLNESS ANALYTICS CARDS
          ===================================================================== */}
      <section className="relative py-24 px-4 sm:px-8 bg-[#F8FAFC] text-[#0F172A] overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-14 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#EEF4FF] text-[#2B4CDE] border border-[#DCE7FE] text-[12px] font-bold uppercase tracking-wider">
              <span>Reflect With Intent</span>
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] text-[#0F172A]">
              Notice your emotional shifts <br />
              <span className="text-[#2B4CDE]">
                before burnout reaches you.
              </span>
            </h2>
            <p className="text-[17px] text-[#475569] leading-relaxed">
              Instead of reacting after exhaustion sets in, InnerOS connects your daily check-ins, journal reflections, and sleep-friendly quiet hours so you can rest with intention.
            </p>
          </div>

          {/* 3 Crisp Wellness Cards (Dribbble 27821075) */}
          <div className="grid md:grid-cols-3 gap-7">
            {/* Card 1: Emotional Clarity Index (Bar Chart) */}
            <div className="rounded-[32px] bg-white border border-[#DCE7FE] p-7 flex flex-col justify-between space-y-8 shadow-[0_12px_36px_rgba(43,76,222,0.06)] hover:border-[#2B4CDE]/50 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[13px] text-[#64748B]">
                  <span className="font-medium">Equilibrium Rhythm</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EEF4FF] text-[#2B4CDE] font-bold text-[11.5px] border border-[#DCE7FE]">
                    +14% Steady
                  </span>
                </div>
                <div className="text-4xl font-extrabold text-[#0F172A]">4.6 / 5</div>

                {/* Vertical Rounded Bar Chart in Royal Blue & Cyan */}
                <div className="h-36 flex items-end justify-between gap-2.5 pt-6 px-2 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
                  {[45, 58, 52, 70, 66, 82, 92, 88].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div
                        className={`w-full rounded-t-lg transition-all ${
                          i >= 6
                            ? "bg-[#2B4CDE]"
                            : i >= 4
                              ? "bg-[#38BDF8]"
                              : "bg-[#DCE7FE]"
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-4 border-t border-[#E2E8F0]">
                <h3 className="text-xl font-bold text-[#0F172A]">
                  Emotional Clarity
                </h3>
                <p className="text-[13.5px] text-[#475569] leading-relaxed">
                  Shows how consistent check-ins and unhurried journaling support your week-to-week calm.
                </p>
              </div>
            </div>

            {/* Card 2: Next Energy Drop (SVG Wave) */}
            <div className="rounded-[32px] bg-white text-[#0F172A] p-7 flex flex-col justify-between space-y-8 shadow-[0_12px_36px_rgba(43,76,222,0.06)] border border-[#DCE7FE]">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[13px] text-[#64748B]">
                  <span className="font-medium">Rest Window Forecast</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] font-bold text-[11.5px] border border-[#A7F3D0]">
                    77% &rarr; 24% Tension
                  </span>
                </div>

                {/* Smooth SVG Curve with Callout */}
                <div className="relative h-44 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-4 flex flex-col justify-between overflow-hidden">
                  <div className="text-center">
                    <span className="text-3xl font-extrabold text-[#0F172A]">24%</span>
                    <span className="block text-[11.5px] text-[#64748B]">
                      Afternoon Shoulder &amp; Jaw Tension
                    </span>
                  </div>
                  <svg viewBox="0 0 240 70" className="w-full h-20 overflow-visible">
                    <path
                      d="M 0 55 Q 40 15, 85 35 T 165 20 T 240 45"
                      fill="none"
                      stroke="#2B4CDE"
                      strokeWidth="3"
                    />
                    <circle cx="165" cy="20" r="5" fill="#FFFFFF" stroke="#2B4CDE" strokeWidth="3" />
                  </svg>
                  <div className="text-[11.5px] text-center text-[#475569]">
                    Gentle 2-minute breathwork pause suggested at 15:30
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-4 border-t border-[#E2E8F0]">
                <h3 className="text-xl font-bold text-[#0F172A]">
                  Somatic Pacing Cue
                </h3>
                <p className="text-[13.5px] text-[#475569] leading-relaxed">
                  Anticipates afternoon cognitive fatigue and prepares buffer time around busy schedules.
                </p>
              </div>
            </div>

            {/* Card 3: Routine Stability Readout */}
            <div className="rounded-[32px] bg-white border border-[#DCE7FE] p-7 flex flex-col justify-between space-y-8 shadow-[0_12px_36px_rgba(43,76,222,0.06)] hover:border-[#2B4CDE]/50 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[13px] text-[#64748B]">
                  <span className="font-medium">Sanctuary Rhythm</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EEF4FF] text-[#2B4CDE] font-bold text-[11.5px] border border-[#DCE7FE]">
                    ACTIVE
                  </span>
                </div>
                <div className="text-4xl font-extrabold text-[#0F172A]">79%</div>

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
                          ? "bg-[#EEF4FF] border-[#DCE7FE] text-[#0F172A] font-semibold"
                          : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]"
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          item.checked ? "text-[#2B4CDE]" : "text-[#94A3B8]"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-4 border-t border-[#E2E8F0]">
                <h3 className="text-xl font-bold text-[#0F172A]">
                  Stability Readout
                </h3>
                <p className="text-[13.5px] text-[#475569] leading-relaxed">
                  Celebrates your gentle daily rhythms with zero streak shaming or guilt if you miss a day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* =====================================================================
          SECTION 5: AI WELLNESS DASHBOARD BENTO PREVIEW (DRIBBLE 27821075)
          ===================================================================== */}
      <section className="py-24 px-4 sm:px-8 bg-[#F0F5FF] text-[#0F172A]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#EEF4FF] text-[#2B4CDE] border border-[#DCE7FE] text-[12px] font-bold uppercase tracking-wider">
                <span>Sanctuary Workspace Preview</span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F172A] leading-[1.1]">
                Wellbeing Management,{" "}
                <span className="text-[#2B4CDE]">
                  designed for calm clarity.
                </span>
              </h2>
              <p className="text-[17px] text-[#475569] leading-relaxed">
                Step inside a bright, serene personal workspace where your reflections, emotional balance, daily rhythm, and growth intentions live in one harmonious Bento view.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full bg-[#2B4CDE] text-white hover:bg-[#1E3A8A] text-[14.5px] font-semibold transition-all self-start lg:self-auto shadow-md"
            >
              <span>Open Live Dashboard</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Dribbble 3-Column Bento Grid Preview */}
          <div className="p-6 sm:p-8 rounded-[36px] bg-white border border-[#DCE7FE] shadow-[0_20px_60px_rgba(43,76,222,0.06)]">
            <div className="grid lg:grid-cols-12 gap-5 items-stretch">
              {/* Left Column: 3 Metric Cards */}
              <div className="lg:col-span-3 flex flex-col justify-between gap-5">
                {/* Card A: Semi-Circular Periwinkle Gauge */}
                <div className="rounded-[28px] bg-[#F8FAFC] border border-[#DCE7FE] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-bold text-[#0F172A]">
                      Saved Memories
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#2B4CDE] border border-[#DCE7FE]">
                      <Bookmark className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex items-end justify-between pt-2">
                    <div>
                      <span className="text-[12px] text-[#64748B] block font-medium">
                        User-Verified
                      </span>
                      <span className="text-3xl font-extrabold text-[#0F172A]">
                        148
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-12 rounded-t-full border-[10px] border-[#2B4CDE] border-b-0 flex items-end justify-center pb-0.5">
                        <span className="text-[11px] font-bold text-[#2B4CDE]">
                          +12% &uarr;
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card B: Mint-Cyan Vertical Bars */}
                <div className="rounded-[28px] bg-[#F8FAFC] border border-[#DCE7FE] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-bold text-[#0F172A]">
                      Present Today
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#059669] border border-[#A7F3D0]">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex items-end justify-between pt-2">
                    <div>
                      <span className="text-[12px] text-[#64748B] block font-medium">
                        Mindful Minutes
                      </span>
                      <span className="text-3xl font-extrabold text-[#0F172A]">
                        42m
                      </span>
                    </div>
                    <div className="flex items-end space-x-2 h-14">
                      <div className="w-4 h-7 rounded-t-md bg-[#DCE7FE]" />
                      <div className="w-4 h-10 rounded-t-md bg-[#38BDF8]" />
                      <div className="w-4 h-14 rounded-t-md bg-[#059669]" />
                    </div>
                  </div>
                </div>

                {/* Card C: Soft Lavender-Rose Smooth Wave */}
                <div className="rounded-[28px] bg-[#F8FAFC] border border-[#DCE7FE] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-bold text-[#0F172A]">
                      Active Intentions
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#7C3AED] border border-[#DDD6FE]">
                      <Sprout className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex items-end justify-between pt-2">
                    <div>
                      <span className="text-[12px] text-[#64748B] block font-medium">
                        This Month
                      </span>
                      <span className="text-3xl font-extrabold text-[#0F172A]">
                        18+
                      </span>
                    </div>
                    <div className="w-28 h-12 rounded-xl bg-gradient-to-t from-[#F5F3FF] to-transparent flex items-start justify-center pt-1 border-b-2 border-[#7C3AED]">
                      <span className="px-2 py-0.5 rounded-full bg-[#7C3AED] text-white text-[10.5px] font-bold">
                        Calm Pace
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Column: Portrait + Trajectory Chart */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-5">
                <div className="relative rounded-[28px] overflow-hidden h-64 sm:h-72 bg-[#EEF4FF] flex items-center justify-center border border-[#DCE7FE]">
                  <img
                    src="/images/dashboard-portrait.jpg"
                    alt="InnerOS Mindful Companion Presence"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute bottom-3 left-3 right-3 px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-between text-[12.5px] border border-white">
                    <span className="font-bold text-[#0F172A]">
                      Living Voice &amp; Text Presence
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EEF4FF] text-[#2B4CDE] font-bold border border-[#DCE7FE]">
                      8 Voices Ready
                    </span>
                  </div>
                </div>

                {/* Bottom Center Card: Trajectory Chart */}
                <div className="rounded-[28px] bg-[#F8FAFC] border border-[#DCE7FE] p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[16px] font-bold text-[#0F172A]">
                        Wellbeing &amp; Clarity Trajectory
                      </h3>
                      <div className="flex items-center space-x-3 text-[11.5px] text-[#64748B] mt-1 font-medium">
                        <span className="inline-flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-[#2B4CDE]" />
                          <span>Clarity</span>
                        </span>
                        <span className="inline-flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-[#059669]" />
                          <span>Energy</span>
                        </span>
                        <span className="inline-flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                          <span>Rest</span>
                        </span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white border border-[#DCE7FE] text-[12px] font-semibold text-[#0F172A]">
                      Recent Weeks
                    </span>
                  </div>

                  <div className="relative h-28 rounded-2xl bg-white border border-[#DCE7FE] p-3 flex items-center justify-center">
                    <div className="px-4 py-1.5 rounded-full bg-[#EEF4FF] border border-[#DCE7FE] text-[#2B4CDE] text-[13px] font-bold shadow-xs">
                      94.2% Steady &bull; Emotionally Grounded
                    </div>
                  </div>

                  <div className="flex justify-between text-[11.5px] text-[#64748B] pt-1 font-medium">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span className="font-bold text-[#2B4CDE]">Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Emotional Balance & Daily Schedule */}
              <div className="lg:col-span-4 flex flex-col justify-between gap-5">
                {/* Top Right Card: 96.4% Balance */}
                <div className="rounded-[28px] bg-[#F8FAFC] border border-[#DCE7FE] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-bold text-[#0F172A]">
                      Emotional Balance
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-[#2B4CDE]" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-[#0F172A]">
                      96.4%
                    </span>
                    <span className="text-[12.5px] text-[#059669] font-bold">
                      Steady &amp; Grounded
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-[11.5px]">
                    <div className="space-y-1.5">
                      <span className="text-[#64748B] block font-medium">Grounded</span>
                      <span className="font-bold text-[#0F172A] block">
                        24 Days
                      </span>
                      <div className="h-4 rounded-md bg-[#EEF4FF] border border-[#DCE7FE]" />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[#64748B] block font-medium">Reflective</span>
                      <span className="font-bold text-[#0F172A] block">
                        5 Days
                      </span>
                      <div className="h-4 rounded-md bg-[#ECFDF5] border border-[#A7F3D0]" />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[#64748B] block font-medium">Rested</span>
                      <span className="font-bold text-[#0F172A] block">
                        10 Hrs
                      </span>
                      <div className="h-4 rounded-md bg-[#F5F3FF] border border-[#DDD6FE]" />
                    </div>
                  </div>
                </div>

                {/* Bottom Right Card: Gentle Daily Schedule */}
                <div className="rounded-[28px] bg-[#F8FAFC] border border-[#DCE7FE] p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-bold text-[#0F172A]">
                      Gentle Schedule
                    </span>
                    <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#2B4CDE] border border-[#DCE7FE]">
                      <Calendar className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 rounded-full bg-[#EEF4FF] text-[#2B4CDE] text-[11.5px] font-bold border border-[#DCE7FE]">
                        08:30
                      </span>
                      <div className="flex-1 p-3 rounded-2xl bg-white border border-[#DCE7FE] flex items-center justify-between">
                        <div>
                          <span className="text-[13px] font-bold text-[#0F172A] block">
                            Morning Breath &amp; Check-In
                          </span>
                          <span className="text-[11.5px] text-[#64748B]">
                            3 slow physical sensations
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[11px] font-bold text-[#059669]">
                          Done
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#059669] text-[11.5px] font-bold border border-[#A7F3D0]">
                        15:30
                      </span>
                      <div className="flex-1 p-3 rounded-2xl bg-white border border-[#DCE7FE] flex items-center justify-between">
                        <div>
                          <span className="text-[13px] font-bold text-[#0F172A] block">
                            Afternoon Boundary Buffer
                          </span>
                          <span className="text-[11.5px] text-[#64748B]">
                            15m quiet transition pause
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#EEF4FF] text-[11px] font-bold text-[#2B4CDE]">
                          Synced
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 rounded-full bg-[#F5F3FF] text-[#7C3AED] text-[11.5px] font-bold border border-[#DDD6FE]">
                        21:15
                      </span>
                      <div className="flex-1 p-3 rounded-2xl bg-white border border-[#DCE7FE] flex items-center justify-between">
                        <div>
                          <span className="text-[13px] font-bold text-[#0F172A] block">
                            Evening Sanctuary Reflection
                          </span>
                          <span className="text-[11.5px] text-[#64748B]">
                            Quiet hours begin at 22:00
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#F5F3FF] text-[11px] font-bold text-[#7C3AED]">
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
          SECTION 6: INTERACTIVE LIVE PRODUCT SANDBOX (VOICE, CHAT & MEMORY)
          ===================================================================== */}
      <section className="py-24 px-4 sm:px-8 bg-[#F8FAFC] text-[#0F172A] border-t border-[#DCE7FE]/60">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#EEF4FF] text-[#2B4CDE] border border-[#DCE7FE] text-[12px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Companion Sandbox</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A] leading-[1.12]">
              Experience Voice, Text &amp;{" "}
              <span className="text-[#2B4CDE]">
                User-Approved Memory.
              </span>
            </h2>
            <p className="text-[17px] text-[#475569] leading-relaxed">
              Test how InnerOS responds in real time. Switch between the Voice Room, Text Conversation modes, and transparent Memory approval right here before creating your account.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 text-[14.5px] text-[#0F172A]">
                <span className="w-6 h-6 rounded-full bg-[#EEF4FF] text-[#2B4CDE] border border-[#DCE7FE] flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <span>Recalls your Journal, Growth Goals &amp; Daily Check-Ins</span>
              </div>
              <div className="flex items-center space-x-3 text-[14.5px] text-[#0F172A]">
                <span className="w-6 h-6 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <span>Separates tentative AI hypotheses from verified facts</span>
              </div>
              <div className="flex items-center space-x-3 text-[14.5px] text-[#0F172A]">
                <span className="w-6 h-6 rounded-full bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE] flex items-center justify-center font-bold text-xs">
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
      {/* =====================================================================
          SECTION 7: THE MIND BEHIND INNEROS — VISUAL LIFE GRAPH
          ===================================================================== */}
      <section id="life-graph" className="relative py-28 px-4 sm:px-8 bg-[#0F172A] text-white overflow-hidden">
        {/* High-Resolution Bioluminescent Life Graph Looping Background Video */}
        <video
          ref={lifeGraphVideoRef}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-40 mix-blend-screen"
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-transparent to-[#0F172A] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-slate-800 text-[#38BDF8] border border-slate-700 text-[12px] font-bold uppercase tracking-wider">
            <span>The Memory Engine Behind InnerOS</span>
          </span>
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.08]">
            Life Graph understands <br />
            <span className="text-[#38BDF8]">
              what truly matters to you.
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
                  className={`px-4 py-2 rounded-full text-[12px] font-bold tracking-wider backdrop-blur-xl border ${
                    idx % 2 === 0
                      ? "bg-[#2B4CDE]/40 border-[#38BDF8]/60 text-white"
                      : "bg-slate-800/80 border-slate-700 text-slate-200"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p className="text-[17px] text-slate-300 max-w-2xl mx-auto leading-relaxed">
            InnerOS connects your approved memories, journal reflections, and personal intentions into an inspectable visual Life Graph. Every node is transparent, editable, and erasable with a single click.
          </p>

          <div>
            <Link
              href="/memory"
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full bg-[#2B4CDE] text-white hover:bg-[#1E3A8A] text-[14.5px] font-semibold transition-all shadow-md"
            >
              <span>Explore Life Graph</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 8: SMARTER WAY TO TRACK YOUR PROGRESS (DRIBBLE 27821075)
          ===================================================================== */}
      <section className="relative py-24 px-4 sm:px-8 bg-[#F8FAFC] text-[#0F172A] border-t border-[#DCE7FE]/60">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Card */}
          <div className="lg:col-span-4 rounded-[32px] bg-white border border-[#DCE7FE] p-7 space-y-5 shadow-[0_12px_36px_rgba(43,76,222,0.06)]">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF4FF] border border-[#DCE7FE] flex items-center justify-center text-[#2B4CDE]">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A]">
              Real-Time Context Recall
            </h3>
            <p className="text-[14.5px] text-[#475569] leading-relaxed">
              Ask your companion about what you wrote in your journal, your active growth steps, or your recent energy check-ins—and receive grounded, context-aware reflections immediately.
            </p>
          </div>

          {/* Center Headline */}
          <div className="lg:col-span-4 text-center space-y-4 px-2">
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#EEF4FF] text-[#2B4CDE] border border-[#DCE7FE] text-[12px] font-bold uppercase tracking-wider">
              <span>Awareness Dashboard</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.1] text-[#0F172A]">
              Smarter way to <br />
              <span className="text-[#2B4CDE]">
                honour your growth
              </span>
            </h2>
            <p className="text-[15px] text-[#475569] leading-relaxed">
              See the gentle patterns behind your mood, energy, and boundaries without rigid productivity scores.
            </p>
          </div>

          {/* Right Card */}
          <div className="lg:col-span-4 rounded-[32px] bg-white border border-[#DCE7FE] p-7 space-y-5 shadow-[0_12px_36px_rgba(43,76,222,0.06)]">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF4FF] border border-[#DCE7FE] flex items-center justify-center text-[#2B4CDE]">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A]">
              Somatic &amp; Energy Pacing
            </h3>
            <p className="text-[14.5px] text-[#475569] leading-relaxed">
              Measures how restorative your daily routines feel and automatically silences non-urgent prompts during your circadian quiet hours.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 9: THE COMPANION ENGINE THAT ADAPTS TO HOW YOU FEEL
          ===================================================================== */}
      <section className="relative py-28 px-4 sm:px-8 bg-[#EEF4FF]/70 text-[#0F172A] overflow-hidden border-t border-[#DCE7FE]/60">
        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-white text-[#2B4CDE] border border-[#DCE7FE] text-[12px] font-bold uppercase tracking-wider shadow-xs">
              <span>Multimodal Companion Engine</span>
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] text-[#0F172A]">
              The companion that adapts <br />
              <span className="text-[#2B4CDE]">
                to how you feel.
              </span>
            </h2>
            <p className="text-[17px] text-[#475569] leading-relaxed">
              InnerOS adjusts its warmth, directness, and conversational mode around your emotional state—whether you want quiet listening, gentle perspective, or structured problem-solving.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Card: Semi-Circular Adaptive Dial */}
            <div className="rounded-[32px] bg-white border border-[#DCE7FE] p-8 flex flex-col justify-between space-y-8 shadow-[0_12px_36px_rgba(43,76,222,0.06)]">
              <div className="flex flex-col items-center justify-center pt-4">
                <div className="w-56 h-28 rounded-t-full border-[8px] border-[#2B4CDE] border-b-0 relative flex items-end justify-center pb-2 bg-[#F8FAFC]">
                  <div className="text-center">
                    <span className="text-[11px] uppercase tracking-widest text-[#2B4CDE] font-bold block">
                      Active Mode
                    </span>
                    <span className="text-xl font-bold text-[#0F172A]">
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
                      className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                        activeModeIdx === idx
                          ? "bg-[#2B4CDE] text-white shadow-xs"
                          : "bg-[#F8FAFC] border border-[#DCE7FE] text-[#475569] hover:bg-[#EEF4FF] hover:text-[#2B4CDE]"
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center space-y-2 pt-2 border-t border-[#E2E8F0]">
                <h3 className="text-xl font-bold text-[#0F172A]">
                  Adaptive Companion Modes
                </h3>
                <p className="text-[14.5px] text-[#475569] leading-relaxed">
                  {modes[activeModeIdx].desc}
                </p>
              </div>
            </div>

            {/* Right Card: 4-Stage Reflection Cycle */}
            <div className="rounded-[32px] bg-white border border-[#DCE7FE] p-8 flex flex-col justify-between space-y-8 shadow-[0_12px_36px_rgba(43,76,222,0.06)]">
              <div className="flex items-center justify-center py-4">
                <div className="relative w-48 h-48 rounded-full border-2 border-[#DCE7FE] flex items-center justify-center bg-[#F8FAFC]">
                  <span className="px-3.5 py-1.5 rounded-full bg-[#EEF4FF] text-[12px] font-bold text-[#2B4CDE] border border-[#DCE7FE]">
                    Voice &amp; Text Loop
                  </span>
                  <span className="absolute -top-3 px-3 py-1 rounded-full bg-white border border-[#DCE7FE] text-[11.5px] font-semibold text-[#0F172A]">
                    Express
                  </span>
                  <span className="absolute -bottom-3 px-3 py-1 rounded-full bg-white border border-[#DCE7FE] text-[11.5px] font-semibold text-[#0F172A]">
                    Integrate
                  </span>
                  <span className="absolute -left-6 px-3 py-1 rounded-full bg-white border border-[#DCE7FE] text-[11.5px] font-semibold text-[#0F172A]">
                    Settle
                  </span>
                  <span className="absolute -right-6 px-3 py-1 rounded-full bg-[#2B4CDE] text-white font-bold text-[11.5px] shadow-xs">
                    Reflect
                  </span>
                </div>
              </div>

              <div className="text-center space-y-2 pt-2 border-t border-[#E2E8F0]">
                <h3 className="text-xl font-bold text-[#0F172A]">
                  Seamless Voice &amp; Text Continuity
                </h3>
                <p className="text-[14.5px] text-[#475569] leading-relaxed">
                  Start speaking out loud on an evening walk and continue in written chat or your private journal without losing context.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 10: INNEROS EVOLVES WITH YOU + 5-STEP RHYTHM
          ===================================================================== */}
      <section className="py-24 px-4 sm:px-8 bg-[#F8FAFC] text-[#0F172A] border-t border-[#DCE7FE]/60">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Display Header */}
          <div className="border-b border-[#DCE7FE] pb-10">
            <div className="text-4xl sm:text-6xl lg:text-[76px] font-bold tracking-tight text-[#0F172A] leading-tight">
              InnerOS <span className="text-[#2B4CDE]">evolves</span>{" "}
              <span className="text-[#94A3B8] font-light">&mdash;</span> at your own rhythm.
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#EEF4FF] text-[#2B4CDE] text-[12px] font-semibold border border-[#DCE7FE]">
                Adaptive Sanctuary
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A] leading-[1.15]">
                A platform that <br />
                <span className="text-[#2B4CDE]">
                  adapts to you.
                </span>
              </h2>
              <p className="text-[15.5px] text-[#475569] leading-relaxed">
                InnerOS continuously honours your boundaries, preferred conversational tone, and personal intentions—transforming into a calmer, more relevant space without ever using manipulative gamification or streak pressure.
              </p>
              <ul className="space-y-3.5 text-[14.5px] text-[#334155] pt-2">
                <li className="flex items-center space-x-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2B4CDE] shrink-0" />
                  <span>Learns your preferred conversational warmth and directness</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2B4CDE] shrink-0" />
                  <span>Connects journal reflections and growth steps into chat</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2B4CDE] shrink-0" />
                  <span>Respects circadian quiet hours and lock-screen privacy</span>
                </li>
              </ul>
            </div>

            {/* 5-Step Journey Cards */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {HOW_IT_WORKS_PREVIEW.map((item) => (
                <div
                  key={item.step}
                  className="p-6 rounded-[24px] bg-white border border-[#DCE7FE] shadow-[0_4px_20px_rgba(43,76,222,0.04)] space-y-3 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(43,76,222,0.08)] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-[12px] font-bold ${item.accent}`}
                    >
                      Step {item.step}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-[#94A3B8]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">
                    {item.title}
                  </h3>
                  <p className="text-[13.5px] text-[#64748B] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 11: 17-DEPARTMENT EVIDENCE-GRADED PSYCHOLOGY LIBRARY
          ===================================================================== */}
      <section className="py-24 px-4 sm:px-8 bg-[#F0F5FF] text-[#0F172A]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#EEF4FF] text-[#2B4CDE] text-[12px] font-semibold border border-[#DCE7FE]">
                <Compass className="w-3.5 h-3.5" />
                <span>17 Psychology Departments</span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F172A] leading-[1.12]">
                Peer-reviewed wisdom,{" "}
                <span className="text-[#2B4CDE]">
                  never pop-psychology.
                </span>
              </h2>
              <p className="text-[16px] text-[#475569] leading-relaxed">
                Every educational guide and grounding exercise in InnerOS is graded by evidence quality, cited with APA provenance, and separated from unverified trade literature.
              </p>
            </div>
            <Link
              href="/knowledge"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#2B4CDE] text-white hover:bg-[#1E3A8A] text-[14px] font-semibold shadow-sm hover:shadow-md transition-all self-start md:self-auto"
            >
              <span>Browse Psychology Library</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PSYCHOLOGY_PILLARS.map((item) => (
              <div
                key={item.dept}
                className="bg-white rounded-[24px] p-6 border border-[#DCE7FE] shadow-[0_4px_20px_rgba(43,76,222,0.04)] hover:shadow-[0_8px_30px_rgba(43,76,222,0.08)] transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[11.5px] font-bold ${item.pillBg}`}
                  >
                    {item.tier}
                  </span>
                  <h3 className="text-lg font-bold text-[#0F172A]">
                    {item.dept}
                  </h3>
                  <p className="text-[14px] text-[#64748B] leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                <Link
                  href="/knowledge"
                  className="inline-flex items-center space-x-1.5 text-[13.5px] font-semibold text-[#2B4CDE] hover:text-[#1E3A8A]"
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
          SECTION 12: CONNECTED ARCHIVES & MULTILINGUAL FLUENCY
          ===================================================================== */}
      <section className="py-24 px-4 sm:px-8 bg-[#F8FAFC] text-[#0F172A] border-t border-[#DCE7FE]/60">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Card 1: 8-Step PII-Scrubbed Context Hub */}
          <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-[#DCE7FE] shadow-[0_8px_30px_rgba(43,76,222,0.05)] space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#ECFDF5] text-[#059669] text-[12px] font-bold border border-[#A7F3D0]">
                User-Controlled Integrations
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
                Bring your past reflections{" "}
                <span className="text-[#2B4CDE]">
                  with full PII scrubbing.
                </span>
              </h3>
              <p className="text-[15px] text-[#475569] leading-relaxed">
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
                  className="px-3 py-1.5 rounded-full bg-[#F0F5FF] border border-[#DCE7FE] text-[12.5px] font-medium text-[#1E293B]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div>
              <Link
                href="/integrations"
                className="inline-flex items-center space-x-2 text-[14px] font-semibold text-[#2B4CDE] hover:text-[#1E3A8A] underline underline-offset-4"
              >
                <span>Open Connected Archives</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: 30-Language Readiness & Cultural Empathy */}
          <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-[#DCE7FE] shadow-[0_8px_30px_rgba(43,76,222,0.05)] space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#EEF4FF] text-[#2B4CDE] text-[12px] font-bold border border-[#DCE7FE]">
                Global Multilingual Architecture
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
                Express yourself in the{" "}
                <span className="text-[#2B4CDE]">
                  language of your home.
                </span>
              </h3>
              <p className="text-[15px] text-[#475569] leading-relaxed">
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
                  className="px-3 py-2 rounded-xl bg-[#F0F5FF] text-[12.5px] font-semibold text-[#1E293B] text-center border border-[#DCE7FE]/60"
                >
                  {lang}
                </div>
              ))}
            </div>
            <div>
              <Link
                href="/companion/voice"
                className="inline-flex items-center space-x-2 text-[14px] font-semibold text-[#2B4CDE] hover:text-[#1E3A8A] underline underline-offset-4"
              >
                <span>Explore Multilingual Voice Room</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 13: YOU ARE NOT LIKE EVERYONE ELSE + TRANSPARENT PRICING
          ===================================================================== */}
      <section className="relative py-28 px-4 sm:px-8 bg-[#F0F5FF] text-[#0F172A] overflow-hidden border-t border-[#DCE7FE]/70">
        <div className="relative z-10 max-w-6xl mx-auto space-y-20">
          {/* Statement Block */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white text-[#2B4CDE] text-[12px] font-semibold border border-[#DCE7FE] shadow-xs">
              InnerOS Honours Your Autonomy
            </span>
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#0F172A] leading-[1.1]">
              You are not like everyone else.{" "}
              <span className="text-[#2B4CDE] block mt-1">
                Your companion should not be either.
              </span>
            </h2>
            <p className="text-[16.5px] text-[#475569] leading-relaxed max-w-xl mx-auto">
              Start with a private sanctuary that respects your consent, never sells or trains on your personal reflections, and keeps 24/7 crisis support free for everyone.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full bg-[#2B4CDE] text-white hover:bg-[#1E3A8A] text-[14px] font-semibold shadow-[0_8px_20px_rgba(43,76,222,0.25)] hover:shadow-[0_12px_28px_rgba(43,76,222,0.35)] transition-all"
              >
                <span>Enter InnerOS Free</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={openCrisisModal}
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#F8FAFC] border border-[#DCE7FE] text-[#0F172A] text-[14px] font-medium shadow-xs transition-all"
              >
                <LifeBuoy className="w-4 h-4 text-[#E11D48]" />
                <span>24/7 Crisis Helplines</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="inline-flex items-center p-1.5 rounded-full bg-white border border-[#DCE7FE] shadow-xs">
                <button
                  type="button"
                  onClick={() => setBillingAnnual(true)}
                  className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${
                    billingAnnual
                      ? "bg-[#2B4CDE] text-white shadow-xs"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  Annual (Save 20%)
                </button>
                <button
                  type="button"
                  onClick={() => setBillingAnnual(false)}
                  className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${
                    !billingAnnual
                      ? "bg-[#2B4CDE] text-white shadow-xs"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
              {/* Card 1: Core Sanctuary */}
              <div className="rounded-[32px] bg-white p-8 sm:p-10 flex flex-col justify-between space-y-8 border border-[#DCE7FE] shadow-[0_8px_30px_rgba(43,76,222,0.05)]">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#0F172A] block">
                      Core Sanctuary
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] text-[12px] font-bold border border-[#A7F3D0]">
                      Free Forever
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-5xl font-bold text-[#0F172A]">
                      $0.00
                    </span>
                    <span className="text-[14px] text-[#64748B]">/forever</span>
                  </div>
                  <ul className="space-y-3 text-[14.5px] text-[#334155] pt-2">
                    <li className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                      <span>Daily check-ins, private journal &amp; growth goals</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                      <span>5-Mode Text Companion &amp; Crisis Support Directory</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                      <span>Full GDPR data export &amp; one-click memory deletion</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3 pt-6 border-t border-[#EEF2F6]">
                  <p className="text-[12.5px] text-[#64748B]">
                    Safety tools and privacy controls are never paywalled.
                  </p>
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center space-x-2 w-full py-3 rounded-full bg-[#EEF4FF] hover:bg-[#2B4CDE] text-[#2B4CDE] hover:text-white text-[13.5px] font-semibold transition-all"
                  >
                    <span>Start with Core</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Card 2: Full Adaptive Sanctuary */}
              <div className="rounded-[32px] bg-gradient-to-br from-[#2B4CDE] to-[#1E3A8A] text-white p-8 sm:p-10 flex flex-col justify-between space-y-8 shadow-[0_20px_50px_rgba(43,76,222,0.25)] border border-[#2B4CDE]">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white block">
                      Full Adaptive Sanctuary
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold backdrop-blur-sm border border-white/20">
                      Most Popular
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-5xl font-bold text-white">
                      {billingAnnual ? "$12.30" : "$15.00"}
                    </span>
                    <span className="text-[14px] text-white/80">/month</span>
                  </div>
                  <ul className="space-y-3 text-[14.5px] text-white/90 pt-2">
                    <li className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                      <span>Unlimited Real-Time Voice Companion in 30 languages</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                      <span>Interactive Visual Life Graph &amp; Archive Imports</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                      <span>17-Department Peer-Reviewed Psychology Library</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3 pt-6 border-t border-white/20">
                  <p className="text-[12.5px] text-white/75">
                    Cancel anytime with one click &bull; Zero lock-in
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center space-x-2 w-full py-3 rounded-full bg-white text-[#2B4CDE] hover:bg-[#EEF4FF] text-[13.5px] font-semibold shadow-md transition-all"
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

      {/* =====================================================================
          SECTION 14: FREQUENTLY ASKED QUESTIONS + CLOSING CTA BANNER
          ===================================================================== */}
      <section className="py-24 px-4 sm:px-8 bg-[#F8FAFC] text-[#0F172A] border-t border-[#DCE7FE]/60">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#EEF4FF] text-[#2B4CDE] text-[12px] font-semibold border border-[#DCE7FE]">
              Common Questions
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F172A]">
              Frequently Asked Questions
            </h2>
            <p className="text-[15.5px] text-[#64748B] max-w-xl mx-auto">
              Clear, transparent answers about how InnerOS operates, keeps your reflections private, and handles clinical boundaries.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-[20px] border border-[#DCE7FE] overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left space-x-4 hover:bg-[#F8FAFC] transition-colors"
                  >
                    <span className="font-semibold text-[16px] text-[#0F172A]">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#2B4CDE] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-[14.5px] text-[#475569] leading-relaxed border-t border-[#F1F5F9]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* High-Converting Sanctuary CTA Banner */}
          <div className="relative rounded-[36px] bg-gradient-to-r from-[#2B4CDE] via-[#3B82F6] to-[#1E3A8A] text-white p-10 sm:p-14 shadow-[0_24px_60px_rgba(43,76,222,0.28)] overflow-hidden">
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl space-y-6">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-white/20 text-white text-[12px] font-semibold border border-white/30 backdrop-blur-sm">
                Join 120,000+ Mindful Reflectors
              </span>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Begin your journey to emotional calm and clarity today.
              </h3>
              <p className="text-[16px] text-white/90 leading-relaxed">
                Experience a companion that truly listens, understands your voice across 30 languages, and never judges your feelings.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/signup"
                  className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full bg-white text-[#2B4CDE] hover:bg-[#EEF4FF] text-[14.5px] font-bold shadow-lg transition-all"
                >
                  <span>Start Free Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/companion/voice"
                  className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white text-[14.5px] font-semibold backdrop-blur-md transition-all"
                >
                  <Mic className="w-4 h-4 text-white" />
                  <span>Try Voice Companion</span>
                </Link>
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
