"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LumiMascot } from "@/components/youth/LumiMascot";
import { CharacterAvatar } from "@/components/youth/friends/CharacterAvatar";
import { InteractiveProductTutorial } from "@/components/marketing/InteractiveProductTutorial";
import { WEEBLY_THEME } from "@/design-system/weebly-tokens";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";
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
  Play,
  Flame,
} from "lucide-react";

export default function WorldClassHomePage() {
  const [selectedAgeBand, setSelectedAgeBand] = useState<"2-5" | "6-9" | "10-12" | "13-18">("6-9");
  const [previewDialect, setPreviewDialect] = useState<"ur" | "pa" | "ur-Latn" | "en">("ur");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [activeVoicePreview, setActiveVoicePreview] = useState<string | null>(null);

  const AGE_BANDS = {
    "2-5": {
      title: "Little Explorers (Ages 2–5)",
      badge: "Caregiver-Mediated & Play-Based",
      desc: "Designed to be experienced alongside a parent or educator. Large picture tiles, soothing narrated audio stories, and guided somatic breathing. No raw or unsupervised AI conversation.",
      features: [
        "Shared caregiver-child activities",
        "Large illustrated touch tiles",
        "Bedtime breathing stories",
        "Zero open-ended text chat",
      ],
      color: "from-[#FDF2F8] to-[#FFF1F2] border-[#FBCFE8] text-[#9D174D]",
      ctaLink: "/kids",
      ctaText: "Explore Early Childhood",
    },
    "6-9": {
      title: "Junior Adventurers (Ages 6–9)",
      badge: "Guided Emotion & Curiosity",
      desc: "Four animated AI companions guide children to name what they feel, explore math puzzles, and practice step-by-step problem-solving.",
      features: [
        "Voice-first interaction with Kai & Mia",
        "3,000 curriculum question bank",
        "Feelings Garden vocabulary games",
        "15-turn anti-addiction limits",
      ],
      color: "from-[#F0FDF4] to-[#ECFDF5] border-[#BBF7D0] text-[#166534]",
      ctaLink: "/kids",
      ctaText: "Explore Kids Magic Home",
    },
    "10-12": {
      title: "Growing Navigators (Ages 10–12)",
      badge: "Resilience & Academic Confidence",
      desc: "Scaffolding for pre-teens navigating school friendships, homework challenges, science mysteries, and self-regulation.",
      features: [
        "Executive function study pacing",
        "Curiosity Lab STEM questions",
        "Conflict resolution scenarios",
        "Bilingual English & Urdu support",
      ],
      color: "from-[#EFF6FF] to-[#DBEAFE] border-[#BFDBFE] text-[#1E40AF]",
      ctaLink: "/kids",
      ctaText: "Explore Pre-Teen Academy",
    },
    "13-18": {
      title: "Adolescent Navigators (Ages 13–18)",
      badge: "Autonomy, Identity & Life Skills",
      desc: "A respectful, mature experience without childish mascots. Private self-reflection journals, digital well-being tracking, exam anxiety strategies, and healthy boundary tools.",
      features: [
        "Private developmental journaling",
        "Cognitive reframing of self-criticism",
        "Digital well-being & screen balance",
        "Confidential 24/7 crisis helplines",
      ],
      color: "from-[#F5F3FF] to-[#EDE9FE] border-[#DDD6FE] text-[#6D28D9]",
      ctaLink: "/teens",
      ctaText: "Explore Weebly Teens",
    },
  };

  const MULTILINGUAL_DATA = {
    ur: {
      lang: "Urdu Pakistan (اردو)",
      direction: "rtl",
      child: "امی کہتی ہیں کہ مجھے ریاضی سے گھبرانا نہیں چاہیے۔",
      ai: "آپ کی امی بالکل ٹھیک کہہ رہی ہیں۔ جب سوال بڑا ہو تو اسے چھوٹے ٹکڑوں میں تقسیم کرنا مددگار ثابت ہوتا ہے۔ کیا ہم پہلا مرحلہ مل کر دیکھیں؟",
      note: "Live speech recognition & verified Azure ur-PK-UzmaNeural synthesis",
      sampleSpeech: "سلام! میں کائی ہوں۔ آج ہم مل کر کون سا سوال حل کریں گے؟",
      localeCode: "ur-PK",
    },
    pa: {
      lang: "Pakistani Punjabi (پنجابی)",
      direction: "rtl",
      child: "اج اسکول وچ میرے نال کوئی نئیں کھیڈیا۔",
      ai: "ایہ سن کے دکھ ہویا، پر تسیں اکلے نئیں او۔ آؤ پہلے اک لمبا ساہ لئیے، فیر گل کردے آں کہ کل کیویں نویں دوست بنائے جا سکدے نیں۔",
      note: "Verified Majhi dialect phonology & Shahmukhi script",
      sampleSpeech: "سلام جی! میں کائی آں۔ اج اسیں کیہڑا سبق مل کے سمجھنا اے؟",
      localeCode: "pa-PK",
    },
    "ur-Latn": {
      lang: "Roman Urdu",
      direction: "ltr",
      child: "Mujhe school ki presentation se darr lag raha hai.",
      ai: "Presentation se pehle nervous feel hona bilkul normal hai. Chalein 3 baar volcano breath lete hain taake dil ki raftaar calm ho sake.",
      note: "Full Romanized conversational understanding & speech support",
      sampleSpeech: "Aao mil ke sawal hal karein, koi tension nahi!",
      localeCode: "ur-PK",
    },
    en: {
      lang: "English",
      direction: "ltr",
      child: "I got upset because my tower fell down.",
      ai: "It can feel so frustrating when something you built knocks over! It is okay to take a slow breath. Would you like to build an even stronger base together?",
      note: "Full bidirectional streaming voice with real-time turn taking",
      sampleSpeech: "Hi there! I'm Kai. What question are we solving together today?",
      localeCode: "en-US",
    },
  };

  const handlePlayVoicePreview = (langKey: keyof typeof MULTILINGUAL_DATA) => {
    setActiveVoicePreview(langKey);
    const item = MULTILINGUAL_DATA[langKey];
    voiceSynthesizer.speak(item.sampleSpeech, {
      characterId: "kai",
      locale: item.localeCode,
      onEnd: () => setActiveVoicePreview(null),
    });
  };

  const currentAgeInfo = AGE_BANDS[selectedAgeBand];
  const currentLangInfo = MULTILINGUAL_DATA[previewDialect];

  return (
    <MarketingShell>
      <div className="bg-[#FFFDF9] min-h-screen text-[#0F172A] overflow-x-hidden selection:bg-amber-200">
        {/* ========================================================================= */}
        {/* SECTION 1 — HERO: Animated Weebly Hero with 4 Original AI Characters      */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 border-b border-amber-100 bg-gradient-to-b from-[#FFF7ED] via-[#FFFDF9] to-white overflow-hidden">
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-r from-emerald-100/40 via-amber-100/50 to-pink-100/40 blur-3xl pointer-events-none -z-10" />

          <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-8">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-amber-200 shadow-2xs text-xs font-black text-amber-800">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Weebly Magic World &bull; Voice-First Learning for Children Ages 2–18</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#0F172A] max-w-4xl leading-[1.1]">
              A little more clarity. <br />
              <span className="text-amber-500">A little more calm.</span>
            </h1>

            {/* Multilingual Sub-headline */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed font-medium">
              Meet four friendly AI characters who listen, speak, and guide children through homework, bedtime stories, and calm routines in English, Urdu, and Pakistani Punjabi.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/youth/dashboard"
                className="px-8 py-4 rounded-full bg-amber-500 text-white font-black text-base hover:bg-amber-600 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all inline-flex items-center space-x-2.5"
              >
                <span>Enter Kids Magic Home</span>
                <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </Link>

              <button
                type="button"
                onClick={() => setIsTutorialOpen(true)}
                className="px-7 py-4 rounded-full bg-white text-slate-800 font-bold text-base hover:bg-amber-50 border-2 border-slate-200 shadow-xs transition-all inline-flex items-center space-x-2 hover:scale-102"
              >
                <Play className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Watch Weebly in Action</span>
              </button>

              <Link
                href="/parent"
                className="px-7 py-4 rounded-full bg-white text-slate-700 font-bold text-base hover:bg-slate-50 border-2 border-slate-200 shadow-xs transition-all inline-flex items-center space-x-2"
              >
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Parent Portal</span>
              </Link>
            </div>

            {/* SECTION 2 — 4 ORIGINAL AI CHARACTERS ROW */}
            <div className="pt-8 w-full max-w-4xl">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                Tap Any Friend to Start Talking
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    id: "kai",
                    name: "Kai",
                    role: "Homework & Math",
                    color: "bg-amber-50 border-amber-300 text-amber-900",
                    accent: "#F59E0B",
                  },
                  {
                    id: "mia",
                    name: "Mia",
                    role: "Stories & Feelings",
                    color: "bg-pink-50 border-pink-300 text-pink-900",
                    accent: "#EC4899",
                  },
                  {
                    id: "lumi",
                    name: "Lumi",
                    role: "Routines & Calm",
                    color: "bg-emerald-50 border-emerald-300 text-emerald-900",
                    accent: "#10B981",
                  },
                  {
                    id: "zayn",
                    name: "Zayn",
                    role: "Science & Puzzles",
                    color: "bg-sky-50 border-sky-300 text-sky-900",
                    accent: "#0284C7",
                  },
                ].map((char) => (
                  <Link
                    key={char.id}
                    href={`/youth/friends?friend=${char.id}`}
                    className={`p-5 rounded-[28px] border-2 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col items-center space-y-2 group hover:-translate-y-1 ${char.color}`}
                  >
                    <div className="group-hover:scale-110 transition-transform">
                      <CharacterAvatar characterId={char.id as any} state="idle" size="md" />
                    </div>
                    <span className="text-base font-black text-slate-900">{char.name}</span>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">{char.role}</span>
                    <span
                      className="text-xs font-black px-3 py-1 rounded-full text-white mt-1 shadow-2xs"
                      style={{ backgroundColor: char.accent }}
                    >
                      Talk to {char.name} &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3 — 6 ORIGINAL GAMIFIED LEARNING WORLDS                           */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600">
              Interactive Learning Worlds
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
              Six magical places where curiosity flourishes
            </h2>
            <p className="text-base text-slate-600 max-w-xl mx-auto font-medium">
              Children embark on gentle learning quests without streaks, dopamine traps, or commercial ads.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WEEBLY_THEME.learningWorlds.map((world) => (
              <Link
                key={world.id}
                href={world.route}
                className={`p-7 rounded-[32px] bg-gradient-to-b ${world.bgGradient} border-2 border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 group`}
              >
                <div className="space-y-3">
                  <span className="text-5xl block group-hover:scale-110 transition-transform">
                    {world.emoji}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">{world.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                    {world.tagline}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-black/5">
                  <div className="flex flex-wrap gap-1.5">
                    {world.skills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/80 text-slate-700 shadow-2xs"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>

                  <span
                    className="w-full py-2.5 rounded-xl text-white text-xs font-black flex items-center justify-center space-x-1 shadow-2xs group-hover:opacity-95"
                    style={{ backgroundColor: world.themeColor }}
                  >
                    <span>Enter {world.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4 — NATURAL VOICES & MULTILINGUAL PLAYGROUND (EN, UR, PA)         */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-amber-100">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                Natural AI Speech Engine
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
                Authentic voices in English, Urdu, and Pakistani Punjabi
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium">
                Not a child pitch modifier. Real synthetic neural voice synthesis tailored to South Asian dialects and child speech clarity.
              </p>

              {/* Language Switcher Tabs */}
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {(["ur", "pa", "ur-Latn", "en"] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setPreviewDialect(d)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      previewDialect === d
                        ? "bg-amber-500 text-white shadow-md scale-105"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {MULTILINGUAL_DATA[d].lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Dialogue Container */}
            <div
              className="p-8 sm:p-10 rounded-[36px] bg-gradient-to-b from-amber-50/40 to-orange-50/20 border-2 border-amber-200 shadow-sm space-y-5"
              dir={currentLangInfo.direction}
            >
              <div className="flex items-center justify-between pb-2 border-b border-amber-200/60" dir="ltr">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Live Conversational Simulation
                </span>

                <button
                  type="button"
                  onClick={() => handlePlayVoicePreview(previewDialect)}
                  className={`px-4 py-1.5 rounded-full text-xs font-black flex items-center space-x-1.5 transition-all shadow-xs ${
                    activeVoicePreview === previewDialect
                      ? "bg-rose-500 text-white animate-pulse"
                      : "bg-amber-500 hover:bg-amber-600 text-white hover:scale-105"
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{activeVoicePreview === previewDialect ? "Speaking..." : "Listen to Voice"}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 text-start">
                <span className="text-[11px] font-black uppercase text-slate-400 block">Child Says:</span>
                <p className="text-base font-bold text-slate-900">{currentLangInfo.child}</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-100/60 border border-amber-200 space-y-1 text-start">
                <span className="text-[11px] font-black uppercase text-amber-800 block">Kai Responds Aloud:</span>
                <p className="text-base font-bold text-amber-950 leading-relaxed">{currentLangInfo.ai}</p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-500" dir="ltr">
                <span className="font-semibold text-emerald-700">{currentLangInfo.note}</span>
                <Link href="/languages" className="font-black text-amber-600 hover:underline inline-flex items-center space-x-1">
                  <span>Explore 3,000-question library &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5 — DEVELOPMENTAL SPECTRUM: 4 Tailored Age Bands                  */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600">
              Developmental Spectrum
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
              Matched to real child cognitive development
            </h2>
            <p className="text-base text-slate-600 max-w-xl mx-auto font-medium">
              We never treat a toddler like a pre-teen. Weebly adapts interface, voice, and boundaries per age band.
            </p>

            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {(["2-5", "6-9", "10-12", "13-18"] as const).map((band) => (
                <button
                  key={band}
                  type="button"
                  onClick={() => setSelectedAgeBand(band)}
                  className={`px-5 py-2.5 rounded-full text-xs font-black transition-all ${
                    selectedAgeBand === band
                      ? "bg-slate-900 text-white shadow-md scale-105"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  Ages {band}
                </button>
              ))}
            </div>
          </div>

          {/* Active Band Card */}
          <div className={`p-8 sm:p-12 rounded-[36px] bg-gradient-to-br ${currentAgeInfo.color} border-2 shadow-sm space-y-6 transition-all`}>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-6">
              <div>
                <span className="px-3.5 py-1 rounded-full text-xs font-black bg-white/90 border border-black/10">
                  {currentAgeInfo.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#0F172A] mt-2">
                  {currentAgeInfo.title}
                </h3>
              </div>
              <Link
                href={currentAgeInfo.ctaLink}
                className="px-6 py-3 rounded-full bg-[#0F172A] text-white text-xs font-black hover:bg-slate-800 transition-colors inline-flex items-center space-x-1.5"
              >
                <span>{currentAgeInfo.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </Link>
            </div>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl font-medium">
              {currentAgeInfo.desc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {currentAgeInfo.features.map((feat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/95 border border-black/5 shadow-2xs flex items-center space-x-2 text-xs font-black text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6 — PARENT INTELLIGENCE & OBSERVATIONS DIARY PREVIEW              */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#FAF8F5] border-t border-slate-200">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600">
                Parent Intelligence
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
                Clear family insight without psychological profiling
              </h2>
              <p className="text-base text-slate-600 max-w-xl mx-auto font-medium">
                Keep track of daily routines, sleep notes, school concerns, and completed milestones with verified data tagging.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-xs space-y-3">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  [OBSERVED FACT]
                </span>
                <h3 className="text-base font-black text-slate-900">Objective Milestone</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Verified activity completion, duration in minutes, questions practiced, and hints requested.
                </p>
              </div>

              <div className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-xs space-y-3">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300">
                  [PARENT-ENTERED NOTE]
                </span>
                <h3 className="text-base font-black text-slate-900">Daily Observations Diary</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Caregiver-entered sleep hours, morning mood, school presentation feelings, and offline bonding context.
                </p>
              </div>

              <div className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-xs space-y-3">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  [AI-GENERATED SUMMARY]
                </span>
                <h3 className="text-base font-black text-slate-900">Co-Regulation Scaffold</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Gentle curriculum progress summaries grounded in CASEL and Harvard Center on the Developing Child standards.
                </p>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/parent"
                className="px-8 py-3.5 rounded-full bg-[#0F172A] text-white text-xs font-black hover:bg-slate-800 transition-colors inline-flex items-center space-x-2"
              >
                <span>Open Parent Dashboard Demo</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7 — TRUST, SAFEGUARDING & ZERO PERSISTENT PROFILING               */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                Ethical Safeguards
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Child safety is our foundational architecture
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-slate-300">
              <div className="p-6 rounded-[28px] bg-slate-800/80 border border-slate-700 space-y-3">
                <Lock className="w-6 h-6 text-amber-400" />
                <h3 className="text-base font-black text-white">Zero Raw Audio Leaks</h3>
                <p className="text-xs leading-relaxed font-medium">
                  Spoken voice recognition runs ephemerally. Audio recordings are never retained or sold to third parties.
                </p>
              </div>

              <div className="p-6 rounded-[28px] bg-slate-800/80 border border-slate-700 space-y-3">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
                <h3 className="text-base font-black text-white">Secrecy Refusal Invariant</h3>
                <p className="text-xs leading-relaxed font-medium">
                  Companions transparently state they cannot keep secrets from parents or teachers because safety comes first.
                </p>
              </div>

              <div className="p-6 rounded-[28px] bg-slate-800/80 border border-slate-700 space-y-3">
                <Heart className="w-6 h-6 text-amber-400" />
                <h3 className="text-base font-black text-white">Non-Diagnostic Policy</h3>
                <p className="text-xs leading-relaxed font-medium">
                  Weebly strictly refuses to issue psychiatric diagnoses, ADHD/autism severity scores, or unvalidated labels.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 8 — CALL TO ACTION                                                */}
        {/* ========================================================================= */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
              Ready to give your child a calmer, more curious learning journey?
            </h2>
            <p className="text-base sm:text-lg text-amber-100 font-medium">
              Start free today. No credit card required. COPPA & GDPR-K compliant.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="px-9 py-4 rounded-full bg-white text-amber-900 font-black text-base shadow-xl hover:bg-amber-50 hover:scale-105 active:scale-95 transition-all"
              >
                Create Family Account
              </Link>
              <Link
                href="/youth/dashboard"
                className="px-9 py-4 rounded-full bg-amber-600/80 hover:bg-amber-600 text-white font-black text-base border-2 border-white/30 transition-all"
              >
                Explore Sandbox Demo
              </Link>
            </div>
          </div>
        </section>

        {/* 7-Step Interactive Product Tutorial Modal */}
        <InteractiveProductTutorial
          isOpen={isTutorialOpen}
          onClose={() => setIsTutorialOpen(false)}
        />
      </div>
    </MarketingShell>
  );
}
