"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LumiMascot } from "@/components/youth/LumiMascot";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Brain,
  MessageCircle,
  Users,
  Compass,
  CheckCircle2,
  Clock,
  Layers,
  Volume2,
  Lock,
  ChevronDown,
  Smile,
  Zap,
  Globe,
  School,
  Check,
  AlertCircle,
  Calendar,
  VolumeX,
  Eye,
  Sliders,
  HelpCircle,
  ArrowUpRight
} from "lucide-react";

export default function WorldClassHomePage() {
  // State for interactive sections
  const [selectedAgeBand, setSelectedAgeBand] = useState<"2-5" | "6-9" | "10-12" | "13-18">("6-9");
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>("Calm");
  const [previewDialect, setPreviewDialect] = useState<"ur" | "pa" | "ur-Latn" | "en">("ur");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Section 2: Who It Is For Cards
  const AGE_BANDS = {
    "2-5": {
      title: "Little Explorers (Ages 2–5)",
      badge: "Caregiver-Mediated & Play-Based",
      desc: "Designed to be experienced alongside a parent or educator. Large picture tiles, soothing narrated audio stories, and guided somatic breathing. No raw or unsupervised AI conversation.",
      features: [
        "Shared caregiver-child activities",
        "Large illustrated touch tiles",
        "Bedtime breathing stories",
        "Zero open-ended text chat"
      ],
      color: "from-[#FDF2F8] to-[#FFF1F2] border-[#FBCFE8] text-[#9D174D]",
      ctaLink: "/kids",
      ctaText: "Explore Early Childhood"
    },
    "6-9": {
      title: "Curious Learners (Ages 6–9)",
      badge: "Guided Emotion Discovery",
      desc: "Friendly mascot Lumi guides children to name what they feel, explore visual routines, and learn empathy through interactive moral dilemma stories.",
      features: [
        "Feelings Wheel vocabulary games",
        "First / Then routine task boards",
        "Friendly mascot co-regulation",
        "15-turn anti-addiction limits"
      ],
      color: "from-[#F0FDF4] to-[#ECFDF5] border-[#BBF7D0] text-[#166534]",
      ctaLink: "/kids",
      ctaText: "Explore Kids Sanctuary"
    },
    "10-12": {
      title: "Growing Navigators (Ages 10–12)",
      badge: "Resilience & Peer Dynamics",
      desc: "Scaffolding for pre-teens navigating school friendships, academic pressure, emotional self-awareness, and step-by-step problem-solving.",
      features: [
        "Executive function study pacing",
        "Conflict resolution scenarios",
        "Perspective-taking exercises",
        "Bilingual English & Urdu support"
      ],
      color: "from-[#EFF6FF] to-[#DBEAFE] border-[#BFDBFE] text-[#1E40AF]",
      ctaLink: "/kids",
      ctaText: "Explore Pre-Teen Academy"
    },
    "13-18": {
      title: "Adolescent Navigators (Ages 13–18)",
      badge: "Autonomy, Identity & Life Skills",
      desc: "A respectful, mature experience without childish mascots. Private self-reflection journals, digital well-being tracking, exam anxiety strategies, and healthy boundary tools.",
      features: [
        "Private developmental journaling",
        "Cognitive reframing of self-criticism",
        "Digital well-being & screen balance",
        "Confidential 24/7 crisis helplines"
      ],
      color: "from-[#F5F3FF] to-[#EDE9FE] border-[#DDD6FE] text-[#6D28D9]",
      ctaLink: "/teens",
      ctaText: "Explore Weebly Teens"
    }
  };

  // Section 4: Developmental Areas
  const DEVELOPMENTAL_AREAS = [
    {
      title: "Emotional Intelligence",
      icon: Heart,
      desc: "Affect labeling, somatic breath resets, and self-compassion inspired by Lieberman & CASEL frameworks.",
      accent: "bg-[#FDF2F8] text-[#BE185D] border-[#FCE7F3]",
      link: "/emotional-intelligence"
    },
    {
      title: "Cognitive Problem-Solving",
      icon: Brain,
      desc: "Working memory recall, sequential planning, and lateral inquiry grounded in Baddeley's memory model.",
      accent: "bg-[#EEF2FF] text-[#4F46E5] border-[#E0E7FF]",
      link: "/cognitive-development"
    },
    {
      title: "Communication & Empathy",
      icon: MessageCircle,
      desc: "Active listening, perspective taking, and non-violent communication across diverse peer groups.",
      accent: "bg-[#ECFDF5] text-[#059669] border-[#D1FAE5]",
      link: "/emotional-intelligence"
    },
    {
      title: "ADHD Executive Support",
      icon: Zap,
      desc: "Micro-step task breakdowns, visual circular timers, and dopamine-friendly movement breaks.",
      accent: "bg-[#FFFBEB] text-[#D97706] border-[#FEF3C7]",
      link: "/adhd-support"
    },
    {
      title: "Autism & AAC Picture Symbols",
      icon: Layers,
      desc: "Tap-to-communicate visual tiles, literal clear instructions, and low-stimulation sensory modes.",
      accent: "bg-[#F0FDFA] text-[#0D9488] border-[#CCFBF1]",
      link: "/autism-support"
    },
    {
      title: "Multilingual Voice & Text",
      icon: Globe,
      desc: "Culturally natural dialogue in Urdu, Pakistani Punjabi Shahmukhi, Roman transliterations, and English.",
      accent: "bg-[#F8FAFC] text-[#334155] border-[#E2E8F0]",
      link: "/languages"
    }
  ];

  // Section 6: Multilingual Previews
  const MULTILINGUAL_DATA = {
    ur: {
      lang: "Urdu (اردو)",
      direction: "rtl",
      child: "امی کہتی ہیں کہ مجھے ریاضی سے گھبرانا نہیں چاہیے۔",
      ai: "آپ کی امی بالکل ٹھیک کہہ رہی ہیں۔ جب سوال بڑا ہو تو اسے چھوٹے ٹکڑوں میں تقسیم کرنا مددگار ثابت ہوتا ہے۔ کیا ہم پہلا مرحلہ مل کر دیکھیں؟",
      note: "Live text & natural Urdu voice synthesis active"
    },
    pa: {
      lang: "Punjabi Shahmukhi (پنجابی)",
      direction: "rtl",
      child: "اج اسکول وچ میرے نال کوئی نئیں کھیڈیا۔",
      ai: "ایہ سن کے دکھ ہویا، پر تسیں اکلے نئیں او۔ آؤ پہلے اک لمبا ساہ لئیے، فیر گل کردے آں کہ کل کیویں نویں دوست بنائے جا سکدے نیں۔",
      note: "Honest text-only fallback status (Audio synthesis in validation)"
    },
    "ur-Latn": {
      lang: "Roman Urdu",
      direction: "ltr",
      child: "Mujhe school ki presentation se darr lag raha hai.",
      ai: "Presentation se pehle nervous feel hona bilkul normal hai. Chalein 3 baar volcano breath lete hain taake dil ki raftaar calm ho sake.",
      note: "Full Romanized conversational understanding"
    },
    en: {
      lang: "English",
      direction: "ltr",
      child: "I got upset because my tower fell down.",
      ai: "It can feel so frustrating when something you built knocks over! It is okay to take a slow breath. Would you like to build an even stronger base together?",
      note: "Full bidirectional streaming voice & text"
    }
  };

  // Section 10: FAQ items
  const HOMEPAGE_FAQS = [
    {
      q: "How does Weebly preserve the adult application?",
      a: "Weebly Adults remains completely functional and architecturally segregated. Adult personal growth graphs, journal entries, and check-ins reside in isolated database schemas and are never shared or indexed with child or teen profiles."
    },
    {
      q: "Does the AI ever diagnose psychological conditions?",
      a: "Never. Under our strict ethical invariants, Weebly AI is hardcoded to refuse any request to diagnose ADHD, autism, depression, or calculate IQ scores. It acts strictly as an educational learning companion and organizational scaffold."
    },
    {
      q: "Can children become addicted or form an unhealthy bond with Lumi?",
      a: "We actively guard against compulsive use. Lumi explicitly identifies itself as an AI learning tool, refuses to pretend to be human, and never asks for secrets. Sessions enforce a strict 15-turn ceiling that guides children back to offline play and family conversation."
    },
    {
      q: "How do parents verify consent and supervise their children?",
      a: "In compliance with COPPA and GDPR-K, parents must authenticate their adult account and provide explicit parental consent before any child profile can be activated. Parents can configure daily screen limits and view aggregate learning milestones without violating teen privacy."
    }
  ];

  const currentAgeInfo = AGE_BANDS[selectedAgeBand];
  const currentLangInfo = MULTILINGUAL_DATA[previewDialect];

  return (
    <MarketingShell>
      <div className="bg-[#FAF8F5] min-h-screen text-[#1E293B] overflow-x-hidden">
        {/* ========================================================================= */}
        {/* SECTION 1 — HERO: Responsive Hero with Lumi Mascot & Multilingual Intro   */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F0] bg-gradient-to-b from-[#F5EFE6] via-[#FAF8F5] to-white overflow-hidden">
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-emerald-100/40 via-sky-100/40 to-amber-100/40 blur-3xl pointer-events-none -z-10" />

          <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-8">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-[#CBD5E1] shadow-xs text-xs font-semibold text-[#0F766E]">
              <Sparkles className="w-4 h-4 text-[#0F766E]" />
              <span>Weebly Youth &bull; Multilingual Developmental Learning for Ages 2–18</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0F172A] max-w-4xl leading-[1.1]">
              Emotional intelligence, cognitive growth, and calm routines for every child.
            </h1>

            {/* Multilingual Sub-headline */}
            <p className="text-lg sm:text-xl text-[#475569] max-w-2xl leading-relaxed">
              Safe, non-addictive AI learning companions in English, Urdu, and Pakistani Punjabi. Designed with pediatric psychologists and grounded in CASEL evidence.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/kids"
                className="px-8 py-4 rounded-full bg-[#0F766E] text-white font-bold text-base hover:bg-[#115E59] shadow-lg hover:shadow-xl transition-all inline-flex items-center space-x-2.5"
              >
                <span>Explore Weebly Kids</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/caregiver/dashboard"
                className="px-8 py-4 rounded-full bg-white text-[#0F766E] font-bold text-base hover:bg-[#F8FAFC] border-2 border-[#CBD5E1] shadow-xs transition-all inline-flex items-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>Create Parent Account</span>
              </Link>
            </div>

            {/* Interactive Mascot Spotlight */}
            <div className="pt-6 flex flex-col items-center space-y-3">
              <LumiMascot size="lg" state="celebrating" interactive label="Lumi the calm companion" />
              <p className="text-xs font-semibold text-[#64748B] flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Meet Lumi &bull; Non-human, non-prescriptive AI companion</span>
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2 — WHO IT IS FOR: Interactive 4 Age-Band Experience Cards        */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">Developmental Spectrum</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
              Three tailored experiences, matched to real child development
            </h2>
            <p className="text-base text-[#64748B] max-w-xl mx-auto">
              We never treat a 3-year-old like a teenager. Explore how Weebly adapts to each age bracket.
            </p>

            {/* Age Band Selector Buttons */}
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {(["2-5", "6-9", "10-12", "13-18"] as const).map((band) => (
                <button
                  key={band}
                  type="button"
                  onClick={() => setSelectedAgeBand(band)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                    selectedAgeBand === band
                      ? "bg-[#0F766E] text-white shadow-md scale-105"
                      : "bg-white text-[#475569] border border-[#CBD5E1] hover:bg-[#F1F5F9]"
                  }`}
                >
                  Ages {band}
                </button>
              ))}
            </div>
          </div>

          {/* Active Age Band Detailed Card */}
          <div className={`p-8 sm:p-12 rounded-3xl bg-gradient-to-br ${currentAgeInfo.color} border shadow-sm space-y-6 transition-all`}>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-6">
              <div>
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-white/80 border border-black/10">
                  {currentAgeInfo.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-2">
                  {currentAgeInfo.title}
                </h3>
              </div>
              <Link
                href={currentAgeInfo.ctaLink}
                className="px-6 py-3 rounded-full bg-[#0F172A] text-white text-xs font-bold hover:bg-slate-800 transition-colors inline-flex items-center space-x-1.5"
              >
                <span>{currentAgeInfo.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-base sm:text-lg text-[#334155] leading-relaxed max-w-3xl">
              {currentAgeInfo.desc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {currentAgeInfo.features.map((feat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/90 border border-black/5 shadow-xs flex items-center space-x-2 text-xs font-bold text-[#0F172A]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3 — HOW IT WORKS: 4-Step Animated Journey                         */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">Journey to Calm</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
                How Weebly works for your family in 4 simple steps
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Caregiver Setup & Consent",
                  desc: "Parent authenticates their account and configures verified age-appropriate preferences, screen-time caps, and language settings."
                },
                {
                  step: "02",
                  title: "Gentle Feeling Check-in",
                  desc: "Child taps the Feelings Wheel or talks with Lumi in English or Urdu to name what they feel inside their body."
                },
                {
                  step: "03",
                  title: "Evidence-Based Activity",
                  desc: "Engage in a 5-minute somatic breathing exercise, visual First/Then routine task, or narrated social story."
                },
                {
                  step: "04",
                  title: "Warm Offline Wind-Down",
                  desc: "After 15 turns, Lumi guides the child to take an eye break and do an offline family drawing or outdoor play challenge."
                }
              ].map((st, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#CBD5E1] space-y-3 relative">
                  <div className="w-10 h-10 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center font-extrabold text-sm">
                    {st.step}
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A]">{st.title}</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4 — DEVELOPMENTAL AREAS: 6 Interactive Focus Areas                */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">Curriculum Pillars</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
              Comprehensive developmental scaffolding across 6 core domains
            </h2>
            <p className="text-base text-[#64748B] max-w-xl mx-auto">
              Original educational activities grounded in CASEL, WHO, and Harvard Center on the Developing Child research.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEVELOPMENTAL_AREAS.map((area, idx) => {
              const Icon = area.icon;
              return (
                <Link
                  key={idx}
                  href={area.link}
                  className="p-8 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all space-y-4 group"
                >
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${area.accent}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#0F766E] transition-colors flex items-center justify-between">
                    <span>{area.title}</span>
                    <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0F766E] transition-colors" />
                  </h3>
                  <p className="text-xs text-[#475569] leading-relaxed">{area.desc}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5 — INCLUSIVE LEARNING: ADHD, Autism & Sensory Accommodations     */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#F0FDFA] border-t border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0D9488]">Neurodiversity-Affirming Space</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
                Inclusive learning designed for diverse attention and sensory needs
              </h2>
              <p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto">
                No pathology labels, no forced eye contact, and no coercive compliance. Real accommodations for executive function and sensory differences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white border border-teal-200 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">ADHD Task Chunking</h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  First/Then boards and 3-step micro-tasks break down overwhelming homework into bite-sized actions with positive reinforcement.
                </p>
                <Link href="/adhd-support" className="inline-flex items-center space-x-1 text-xs font-bold text-teal-700 hover:underline">
                  <span>Explore ADHD Tools</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-teal-200 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">Autism-Friendly AAC Symbols</h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  High-contrast picture communication tiles in Urdu and English for non-speaking children or times of verbal fatigue.
                </p>
                <Link href="/autism-support" className="inline-flex items-center space-x-1 text-xs font-bold text-teal-700 hover:underline">
                  <span>Explore AAC Board</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-teal-200 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <VolumeX className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">Low Sensory Stimulation Mode</h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  One-tap setting softens bright saturation, suppresses kinetic animations, and mutes non-essential audio.
                </p>
                <Link href="/youth/accessibility" className="inline-flex items-center space-x-1 text-xs font-bold text-teal-700 hover:underline">
                  <span>Accessibility Preferences</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6 — MULTILINGUAL EXPERIENCE: English, Urdu & Punjabi Previews     */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">Culturally Grounded AI</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
              Speaks the languages of South Asian homes
            </h2>
            <p className="text-sm text-[#64748B]">
              True bi-directional Nastaliq script for Urdu, Shahmukhi Punjabi, Roman Urdu, and English.
            </p>

            {/* Dialect Buttons */}
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {(["ur", "pa", "ur-Latn", "en"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setPreviewDialect(d)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    previewDialect === d
                      ? "bg-[#0F766E] text-white shadow-xs"
                      : "bg-white text-[#475569] border border-[#CBD5E1] hover:bg-[#F1F5F9]"
                  }`}
                >
                  {MULTILINGUAL_DATA[d].lang}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Dialogue Container */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs space-y-4" dir={currentLangInfo.direction}>
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <span className="text-xs font-bold text-[#64748B]">Child:</span>
              <p className="text-base font-semibold text-[#0F172A]">{currentLangInfo.child}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-1">
              <span className="text-xs font-bold text-[#15803D]">Lumi (Learning Companion):</span>
              <p className="text-base text-[#166534] leading-relaxed">{currentLangInfo.ai}</p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-[#64748B] border-t border-[#F1F5F9]" dir="ltr">
              <span className="font-semibold text-emerald-700">{currentLangInfo.note}</span>
              <Link href="/languages" className="font-bold text-[#0F766E] hover:underline inline-flex items-center space-x-1">
                <span>View Full Language Architecture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7 — INTERACTIVE PRODUCT PREVIEW: Real Feelings Wheel Demonstration */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#E2E8F0]">
          <div className="max-w-4xl mx-auto space-y-8 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">Live Product Demo</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
              Try a Feelings Check-In Right Now
            </h2>
            <p className="text-sm text-[#64748B] max-w-xl mx-auto">
              Tap an emotion tile to see how Lumi responds with non-judgmental affective grounding.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-4">
              {[
                { label: "Happy", emoji: "😊", color: "bg-amber-50 border-amber-300 text-amber-900" },
                { label: "Calm", emoji: "🌿", color: "bg-emerald-50 border-emerald-300 text-emerald-900" },
                { label: "Frustrated", emoji: "😤", color: "bg-rose-50 border-rose-300 text-rose-900" },
                { label: "Worried", emoji: "🌧️", color: "bg-sky-50 border-sky-300 text-sky-900" },
                { label: "Tired", emoji: "🥱", color: "bg-purple-50 border-purple-300 text-purple-900" },
                { label: "Curious", emoji: "✨", color: "bg-indigo-50 border-indigo-300 text-indigo-900" }
              ].map((em) => (
                <button
                  key={em.label}
                  type="button"
                  onClick={() => setSelectedFeeling(em.label)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center space-y-2 ${
                    selectedFeeling === em.label
                      ? `${em.color} shadow-md scale-105 font-bold`
                      : "bg-[#FAF8F5] border-[#CBD5E1] text-[#475569] hover:bg-white"
                  }`}
                >
                  <span className="text-2xl">{em.emoji}</span>
                  <span className="text-xs font-semibold">{em.label}</span>
                </button>
              ))}
            </div>

            {selectedFeeling && (
              <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#CBD5E1] max-w-2xl mx-auto text-left space-y-2">
                <span className="text-xs font-bold text-[#0F766E] uppercase">Lumi&apos;s Thoughtful Reflection:</span>
                <p className="text-sm text-[#0F172A] leading-relaxed">
                  {selectedFeeling === "Frustrated" && "It is completely okay to feel frustrated. Frustration is just your body telling you that something matters to you. Would you like to do a 3-breath volcano reset with me?"}
                  {selectedFeeling === "Calm" && "Feeling calm is a wonderful place to be. Your body is relaxed and ready to learn, create, or listen to a story!"}
                  {selectedFeeling === "Worried" && "When worries visit our minds, they feel heavy. But you don't have to carry them alone. Would you like to share your worry with a caregiver or draw it on paper?"}
                  {selectedFeeling === "Happy" && "Joy is infectious! What was your favorite moment of today that brought this smile to your face?"}
                  {selectedFeeling === "Tired" && "Rest is productive! Your brain does its most important memory organizing while you sleep. Time to settle down with a calm audio story."}
                  {selectedFeeling === "Curious" && "Curiosity is the superpower of every great scientist and artist! What question is sparkling in your mind today?"}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 8 — CAREGIVERS AND SCHOOLS: Portals & Shared Growth              */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">Family &amp; Classroom Ecosystem</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
              Connecting the adults who nurture young minds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#0F172A]">For Parents &amp; Guardians</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                View your child&apos;s active learning milestones, set daily screen-time turn boundaries, practice shared dinner conversation cards, and manage verified consent.
              </p>
              <div className="pt-2">
                <Link href="/parents" className="px-6 py-2.5 rounded-full bg-[#0F766E] text-white text-xs font-bold hover:bg-[#115E59] transition-colors inline-flex items-center space-x-1.5">
                  <span>Caregiver Portal Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                <School className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#0F172A]">For Educators &amp; Classrooms</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Actionable lesson plans for homeroom advisory, ADHD classroom accommodation templates, and zero-PII student privacy protections for districts.
              </p>
              <div className="pt-2">
                <Link href="/schools" className="px-6 py-2.5 rounded-full bg-[#4F46E5] text-white text-xs font-bold hover:bg-[#4338CA] transition-colors inline-flex items-center space-x-1.5">
                  <span>Institutional School Programme</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 9 — TRUST, RESEARCH AND SAFETY: Safeguarding & Ethical Boundaries */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#38BDF8]">Safety By Design</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Child protection is not an afterthought. It is our core architecture.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-slate-300">
              <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-3">
                <Lock className="w-6 h-6 text-[#38BDF8]" />
                <h3 className="text-base font-bold text-white">Zero Adult Data Cross-Contamination</h3>
                <p className="text-xs leading-relaxed">
                  Adult Weebly mental health check-ins and journals are strictly segregated. Child sessions exist in a 24-hour auto-expiring ephemeral store.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-3">
                <ShieldCheck className="w-6 h-6 text-[#38BDF8]" />
                <h3 className="text-base font-bold text-white">The Secrecy Refusal Invariant</h3>
                <p className="text-xs leading-relaxed">
                  Lumi refuses any request to hide disclosures from parents and directs children to talk with trusted adults whenever big things happen.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-3">
                <AlertCircle className="w-6 h-6 text-[#38BDF8]" />
                <h3 className="text-base font-bold text-white">24/7 Human Emergency Helplines</h3>
                <p className="text-xs leading-relaxed">
                  Severe disclosures immediately suppress synthesized voice and display verified emergency lifelines (Pakistan 1121, 1122, and US 988).
                </p>
              </div>
            </div>

            <div className="text-center pt-4">
              <Link
                href="/child-safety"
                className="inline-flex items-center space-x-2 text-xs font-bold text-[#38BDF8] hover:underline"
              >
                <span>Read Full Child Safeguarding &amp; Escalation Policy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 10 — PRICING, FAQ AND FINAL CTA                                   */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-16">
          {/* FAQ Accordion */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold text-[#0F172A]">Frequently Asked Questions</h2>
              <p className="text-sm text-[#64748B]">Transparent answers about how Weebly operates.</p>
            </div>

            <div className="space-y-3">
              {HOMEPAGE_FAQS.map((faq, idx) => (
                <div key={idx} className="rounded-2xl bg-white border border-[#CBD5E1] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-[#0F172A]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#64748B] transition-transform ${
                        openFaq === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 text-sm text-[#475569] leading-relaxed border-t border-[#F1F5F9] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Final Call to Action */}
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-[#0F766E] to-[#115E59] text-white text-center space-y-6 shadow-xl">
            <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight">
              Give your child the gift of emotional confidence.
            </h2>
            <p className="text-base sm:text-lg text-emerald-100 max-w-xl mx-auto">
              Start free with foundation emotion naming, visual schedules, and multilingual stories. Free for families.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/signup?role=caregiver"
                className="px-8 py-4 rounded-full bg-white text-[#0F766E] font-extrabold text-base hover:bg-emerald-50 shadow-md transition-all inline-flex items-center space-x-2"
              >
                <span>Create Free Caregiver Account</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/kids"
                className="px-8 py-4 rounded-full bg-emerald-800/80 text-white font-bold text-base hover:bg-emerald-800 border border-emerald-600 transition-all"
              >
                Launch Kids Sandbox
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
