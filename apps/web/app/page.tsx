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
  Volume2,
  Lock,
  ChevronDown,
  School,
  Check,
  Play,
  Flame,
  Award,
  BookOpen,
  Headphones,
  FileText,
  HelpCircle,
  Activity,
  Sliders,
  Palette,
  Smile,
  Shield,
  Layers,
  Sparkle,
} from "lucide-react";

export default function WeeblyV5HomePage() {
  const [selectedFriend, setSelectedFriend] = useState<"kai" | "mia" | "lumi" | "zayn">("kai");
  const [activeVoicePreview, setActiveVoicePreview] = useState<string | null>(null);
  const [previewLanguage, setPreviewLanguage] = useState<"en" | "ur" | "pa">("en");
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [pricingCycle, setPricingCycle] = useState<"monthly" | "annual">("annual");

  const AI_FRIENDS = [
    {
      id: "kai" as const,
      name: "Kai",
      title: "Curious Learning Guide",
      role: "Homework, tricky questions, math, and curiosity",
      color: "from-amber-500/10 to-orange-500/20 border-amber-300 text-amber-900",
      accent: "#F59E0B",
      sampleSpeech: {
        en: "Hi! I'm Kai. Let's solve tricky homework questions together, step by step!",
        ur: "سلام! میں کائی ہوں۔ آئیے مل کر ہوم ورک کے مشکل سوالات آسانی سے حل کریں!",
        pa: "سلام جی! میں کائی آں۔ آؤ مل کے حساب دے سوال ہولے ہولے سمجھیئے!",
      },
      localeCode: { en: "en-US", ur: "ur-PK", pa: "pa-PK" },
      specialties: ["Step-by-step Math", "Curiosity Questions", "Homework Confidence"],
    },
    {
      id: "mia" as const,
      name: "Mia",
      title: "Warm Creative Guide",
      role: "Bedtime stories, big feelings, imagination, and friendship",
      color: "from-pink-500/10 to-rose-500/20 border-pink-300 text-pink-900",
      accent: "#EC4899",
      sampleSpeech: {
        en: "Hello, friend! I'm Mia. Would you like to create a magical bedtime story together?",
        ur: "ہیلو پیارے دوست! میں میا ہوں۔ کیا آپ میرے ساتھ ایک پیاری کہانی سننا چاہتے ہیں؟",
        pa: "ہیلو بیلی! میں میا آں۔ آؤ رل کے اک سوہنی کہانی بنائیے!",
      },
      localeCode: { en: "en-US", ur: "ur-PK", pa: "pa-PK" },
      specialties: ["Interactive Stories", "Feelings Vocabulary", "Art & Imagination"],
    },
    {
      id: "lumi" as const,
      name: "Lumi",
      title: "Calm Gentle Guide",
      role: "Daily routines, bunny breaths, quiet resets, and bedtime calm",
      color: "from-emerald-500/10 to-teal-500/20 border-emerald-300 text-emerald-900",
      accent: "#10B981",
      sampleSpeech: {
        en: "Take a slow breath with me. Breathe in like a bunny, and gently let it out.",
        ur: "میرے ساتھ ایک گہرا سانس لیں۔ خرگوش کی طرح ناک سے سانس اندر، اور آہستہ سے باہر۔",
        pa: "میرے نال اک ہولا ساہ لوو۔ ہولے جئے ساہ اندر، تے ہولے جئے باہر۔",
      },
      localeCode: { en: "en-US", ur: "ur-PK", pa: "pa-PK" },
      specialties: ["Somatic Breathing", "Visual Daily Schedules", "Bedtime Co-Regulation"],
    },
    {
      id: "zayn" as const,
      name: "Zayn",
      title: "Energetic Explorer",
      role: "Cool science, space mysteries, animal facts, and puzzles",
      color: "from-sky-500/10 to-blue-500/20 border-sky-300 text-sky-900",
      accent: "#0284C7",
      sampleSpeech: {
        en: "Did you know planets can have diamond rain? Let's explore the cosmos together!",
        ur: "کیا آپ جانتے ہیں کہ کچھ سیاروں پر ہیروں کی بارش ہوتی ہے؟ آؤ خلا کی سیر کریں!",
        pa: "کی تسیں جاندے او کہ کجھ سیاریاں تے ہیریاں دا مینہہ وسدا اے؟ آؤ خلا نوں ویکھیئے!",
      },
      localeCode: { en: "en-US", ur: "ur-PK", pa: "pa-PK" },
      specialties: ["Planetary Science", "Ecosystem Mysteries", "Logical Brain Puzzles"],
    },
  ];

  const handlePlayVoice = (charId: string, speech: string, locale: string) => {
    setActiveVoicePreview(charId);
    voiceSynthesizer.speak(speech, {
      characterId: charId as any,
      locale,
      onEnd: () => setActiveVoicePreview(null),
    });
  };

  const activeFriendData = AI_FRIENDS.find((f) => f.id === selectedFriend) || AI_FRIENDS[0];

  return (
    <MarketingShell>
      <div className="bg-[#FFFDF9] min-h-screen text-[#0F172A] overflow-x-hidden selection:bg-amber-200">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION                                                           */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 border-b border-amber-100 bg-gradient-to-b from-[#FFF7ED] via-[#FFFDF9] to-white overflow-hidden">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-amber-200/30 via-pink-100/40 to-emerald-100/30 blur-3xl pointer-events-none -z-10" />

          <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-8">
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-amber-200 shadow-2xs text-xs font-black text-amber-800">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Voice-First Multilingual Learning Platform &bull; Ages 2–18</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#0F172A] max-w-4xl leading-[1.08]">
              Learning begins with <br />
              <span className="text-amber-500 underline decoration-amber-300 decoration-wavy decoration-from-font">
                a conversation.
              </span>
            </h1>

            {/* One Sentence Explanation */}
            <p className="text-lg sm:text-2xl text-slate-600 max-w-3xl leading-relaxed font-medium">
              Weebly gives children friendly animated AI guides who listen, speak, and guide them through academic homework, creative arts, somatic movement, and life skills in English, Urdu, and Pakistani Punjabi.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/youth/dashboard"
                className="px-9 py-4 rounded-full bg-amber-500 text-white font-black text-base hover:bg-amber-600 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all inline-flex items-center space-x-2.5"
              >
                <Sparkles className="w-5 h-5 text-white" />
                <span>Try the Demo</span>
                <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </Link>

              <Link
                href="/schools"
                className="px-8 py-4 rounded-full bg-white text-slate-800 font-bold text-base hover:bg-amber-50 border-2 border-slate-200 shadow-xs transition-all inline-flex items-center space-x-2 hover:scale-102"
              >
                <School className="w-5 h-5 text-indigo-600" />
                <span>For Schools</span>
              </Link>
            </div>

            {/* Original Character Animation Stage */}
            <div className="pt-10 w-full max-w-4xl">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5">
                Meet Your Child&apos;s Four Learning Companions
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {AI_FRIENDS.map((friend) => (
                  <button
                    key={friend.id}
                    type="button"
                    onClick={() => setSelectedFriend(friend.id)}
                    className={`p-5 rounded-[32px] border-2 transition-all duration-300 flex flex-col items-center space-y-2 group cursor-pointer ${
                      selectedFriend === friend.id
                        ? "bg-white border-amber-500 shadow-lg scale-105 -translate-y-1"
                        : "bg-white/80 border-slate-200 hover:border-amber-300 hover:shadow-md"
                    }`}
                  >
                    <div className="group-hover:scale-110 transition-transform">
                      <CharacterAvatar characterId={friend.id} state="idle" size="md" />
                    </div>
                    <span className="text-lg font-black text-slate-900">{friend.name}</span>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">{friend.title}</span>
                    <span
                      className="text-xs font-black px-3 py-1 rounded-full text-white mt-1 shadow-2xs"
                      style={{ backgroundColor: friend.accent }}
                    >
                      {selectedFriend === friend.id ? "Selected" : "Say Hello"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. WATCH WEEBLY WORK                                                      */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600">
              Interactive Flow Simulation
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
              Watch Weebly Work
            </h2>
            <p className="text-base text-slate-600 max-w-xl mx-auto font-medium">
              See how a child chooses Kai, asks a homework question, solves it step-by-step, and receives encouraging spoken guidance.
            </p>
          </div>

          <div className="p-8 sm:p-12 rounded-[40px] bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-white border-2 border-amber-200 shadow-sm space-y-8">
            {/* 4-Step Interactive Progression */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-amber-100 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center">
                  1
                </div>
                <h4 className="text-sm font-black text-slate-900">Child Chooses Kai</h4>
                <p className="text-xs text-slate-500">Taps Kai&apos;s friendly portrait on Kids Magic Home.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-amber-100 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center">
                  2
                </div>
                <h4 className="text-sm font-black text-slate-900">Asks by Voice</h4>
                <p className="text-xs text-slate-500">&ldquo;Can we divide 12 mangoes among 4 friends?&rdquo;</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-amber-100 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center">
                  3
                </div>
                <h4 className="text-sm font-black text-slate-900">Activity Opens</h4>
                <p className="text-xs text-slate-500">Brain Quest interactive basket visualizer opens automatically.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-amber-100 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center">
                  4
                </div>
                <h4 className="text-sm font-black text-slate-900">Spoken Guidance</h4>
                <p className="text-xs text-slate-500">Kai speaks aloud: &ldquo;Spot on! 3 mangoes each! Great job!&rdquo;</p>
              </div>
            </div>

            {/* Interactive Audio Player & Demo Trigger */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-amber-200/70">
              <div className="flex items-center space-x-3">
                <CharacterAvatar characterId="kai" state="speaking" size="sm" />
                <div>
                  <span className="text-xs font-black uppercase text-amber-800">Spoken Audio Sample (English &amp; Urdu)</span>
                  <p className="text-sm font-bold text-slate-800">
                    &ldquo;12 mangoes divided by 4 equals 3 for each friend!&rdquo;
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() =>
                    handlePlayVoice(
                      "kai",
                      "Twelve mangoes divided by 4 equals 3 mangoes for each friend! You solved it so fast!",
                      "en-US"
                    )
                  }
                  className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-black flex items-center space-x-2 shadow-xs transition-transform active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{activeVoicePreview === "kai" ? "Playing..." : "Hear Kai Speak"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsTutorialOpen(true)}
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-amber-50 text-slate-700 border border-slate-300 text-xs font-black flex items-center space-x-2 shadow-2xs transition-transform active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Launch 7-Step Walkthrough</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. SIX LEARNING WORLDS                                                    */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600">
              Comprehensive Curriculum
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
              Six Learning Worlds
            </h2>
            <p className="text-base text-slate-600 max-w-xl mx-auto font-medium">
              Every subject, routine, and emotional milestone is organized into a magical, non-addictive world without ads or doom-scrolling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WEEBLY_THEME.learningWorlds.map((world) => (
              <Link
                key={world.id}
                href={world.route}
                className={`p-7 rounded-[32px] bg-gradient-to-b ${world.bgGradient} border-2 border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-5 group`}
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
        {/* 4. MEET THE AI FRIENDS                                                    */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-amber-100">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                Ethical Companionship
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
                Meet the AI Friends
              </h2>
              <p className="text-base text-slate-600 max-w-xl mx-auto font-medium">
                Four original characters, each with distinct teaching strengths, speech clarity, and strict child-safeguarding guardrails.
              </p>

              {/* Language Selector for Character Audios */}
              <div className="flex justify-center gap-2 pt-2">
                {(["en", "ur", "pa"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setPreviewLanguage(lang)}
                    className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${
                      previewLanguage === lang
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {lang === "en" ? "English" : lang === "ur" ? "Urdu (اردو)" : "Punjabi (پنجابی)"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {AI_FRIENDS.map((friend) => {
                const speech = friend.sampleSpeech[previewLanguage];
                const loc = friend.localeCode[previewLanguage];
                return (
                  <div
                    key={friend.id}
                    className="p-6 rounded-[32px] bg-[#FAF8F5] border-2 border-slate-200/80 hover:border-amber-400 transition-all flex flex-col justify-between space-y-4 group hover:shadow-lg"
                  >
                    <div className="space-y-3 text-center flex flex-col items-center">
                      <div className="group-hover:scale-105 transition-transform">
                        <CharacterAvatar characterId={friend.id} state="idle" size="lg" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900">{friend.name}</h3>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                        {friend.title}
                      </span>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {friend.role}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-200">
                      <div className="space-y-1">
                        {friend.specialties.map((spec, i) => (
                          <div key={i} className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-700">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePlayVoice(friend.id, speech, loc)}
                        className="w-full py-2.5 rounded-xl text-white text-xs font-black flex items-center justify-center space-x-1.5 shadow-2xs active:scale-95 transition-transform"
                        style={{ backgroundColor: friend.accent }}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{activeVoicePreview === friend.id ? "Speaking..." : `Hear ${friend.name}`}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. HOW IT WORKS                                                           */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600">
              Simple 4-Step Journey
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
              How It Works
            </h2>
            <p className="text-base text-slate-600 max-w-xl mx-auto font-medium">
              Designed from the ground up so even pre-readers can navigate effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-7 rounded-[32px] bg-white border-2 border-amber-200 shadow-xs space-y-4">
              <span className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 font-black text-lg flex items-center justify-center">
                1
              </span>
              <h3 className="text-xl font-black text-slate-900">Choose a Friend</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Tap Kai for homework, Mia for stories, Lumi for calm routines, or Zayn for science puzzles.
              </p>
            </div>

            <div className="p-7 rounded-[32px] bg-white border-2 border-pink-200 shadow-xs space-y-4">
              <span className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-900 font-black text-lg flex items-center justify-center">
                2
              </span>
              <h3 className="text-xl font-black text-slate-900">Talk or Play</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Press the big glowing mic to speak freely, or tap visual tiles to launch an interactive game.
              </p>
            </div>

            <div className="p-7 rounded-[32px] bg-white border-2 border-sky-200 shadow-xs space-y-4">
              <span className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-900 font-black text-lg flex items-center justify-center">
                3
              </span>
              <h3 className="text-xl font-black text-slate-900">Learn and Create</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Complete bite-sized challenges, draw on the digital canvas, and solve 3,000 curriculum questions.
              </p>
            </div>

            <div className="p-7 rounded-[32px] bg-white border-2 border-emerald-200 shadow-xs space-y-4">
              <span className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 font-black text-lg flex items-center justify-center">
                4
              </span>
              <h3 className="text-xl font-black text-slate-900">Parents See Progress</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Caregivers receive daily learning logs, observation notes, and weekly summaries without ad tracking.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. FOR PARENTS                                                            */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAF8F5] to-white border-t border-slate-200">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600">
                Peace of Mind
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
                For Parents
              </h2>
              <p className="text-base text-slate-600 max-w-xl mx-auto font-medium">
                Simple, actionable learning reports, routine observations, and total control over screen time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-7 rounded-[32px] bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Daily Learning Summaries</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Review time spent across mathematics, reading, and somatic calming. Never worry about what your child is doing online.
                </p>
              </div>

              <div className="p-7 rounded-[32px] bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Parent Observation Diary</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Record daily sleep duration, morning mood, and school notes with strict non-clinical data tagging.
                </p>
              </div>

              <div className="p-7 rounded-[32px] bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Screen-Time &amp; Bedtime Controls</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Configure 15-turn conversation limits and set automatic bedtime shutdowns to encourage healthy offline family routines.
                </p>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/parent"
                className="px-8 py-3.5 rounded-full bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition-colors inline-flex items-center space-x-2"
              >
                <span>Open Parent Portal</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. FOR SCHOOLS                                                            */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                Classroom &amp; District Infrastructure
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                For Schools &amp; Educators
              </h2>
              <p className="text-base text-slate-300 max-w-xl mx-auto font-medium">
                Equip your teachers with zero-grading social-emotional check-ins, classroom projector tools, and multi-campus district analytics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-300">
              <div className="p-7 rounded-[32px] bg-slate-800/80 border border-slate-700 space-y-4">
                <School className="w-8 h-8 text-amber-400" />
                <h3 className="text-lg font-black text-white">Classroom Management</h3>
                <p className="text-xs leading-relaxed font-medium">
                  Generate secure classroom join codes (e.g., WB-402), assign curriculum quests, and monitor student engagement.
                </p>
              </div>

              <div className="p-7 rounded-[32px] bg-slate-800/80 border border-slate-700 space-y-4">
                <BookOpen className="w-8 h-8 text-amber-400" />
                <h3 className="text-lg font-black text-white">CASEL &amp; Grade Alignment</h3>
                <p className="text-xs leading-relaxed font-medium">
                  3,000 curriculum questions mapped to state academic frameworks and social-emotional competencies.
                </p>
              </div>

              <div className="p-7 rounded-[32px] bg-slate-800/80 border border-slate-700 space-y-4">
                <Users className="w-8 h-8 text-amber-400" />
                <h3 className="text-lg font-black text-white">Multi-Campus District Portal</h3>
                <p className="text-xs leading-relaxed font-medium">
                  Centralized school portal for principals to manage campus licenses, teacher allocations, and aggregate outcomes.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="/teacher/dashboard"
                className="px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-black transition-colors inline-flex items-center space-x-2"
              >
                <span>Access Teacher Hub</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>

              <Link
                href="/school/portal"
                className="px-8 py-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-black border border-slate-600 transition-colors inline-flex items-center space-x-2"
              >
                <span>Explore School Portal</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. SAFETY AND ACCESSIBILITY                                               */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
              Foundational Safeguards
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
              Safety and Accessibility
            </h2>
            <p className="text-base text-slate-600 max-w-xl mx-auto font-medium">
              We protect children by design. No ads, no data broker sales, and verified WCAG 2.2 AA accessibility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-xs space-y-3">
              <Lock className="w-6 h-6 text-amber-500" />
              <h3 className="text-base font-black text-slate-900">Zero Audio Retention</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Voice recognition processes ephemerally. Audio recordings are never retained or used to train third-party models.
              </p>
              <Link href="/child-safety" className="text-xs font-black text-amber-600 hover:underline block pt-1">
                Read Child Safety Policy &rarr;
              </Link>
            </div>

            <div className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-xs space-y-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <h3 className="text-base font-black text-slate-900">Non-Clinical Boundary</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Weebly never issues medical diagnoses or behavioral pathology labels. We focus purely on pedagogical scaffolding.
              </p>
              <Link href="/safety" className="text-xs font-black text-emerald-600 hover:underline block pt-1">
                Explore Clinical Invariants &rarr;
              </Link>
            </div>

            <div className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-xs space-y-3">
              <Heart className="w-6 h-6 text-pink-600" />
              <h3 className="text-base font-black text-slate-900">WCAG 2.2 AA Accessible</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                High contrast ratios, reduced-motion controls, screen-reader semantic landmarks, and pre-reader voice navigation.
              </p>
              <Link href="/accessibility" className="text-xs font-black text-pink-600 hover:underline block pt-1">
                View Accessibility Statement &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. PRICING AND SIGNUP                                                     */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFFDF9] via-[#FAF8F5] to-white border-t border-slate-200">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600">
                Transparent Plans
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
                Clear, Verified Pricing
              </h2>
              <p className="text-base text-slate-600 max-w-xl mx-auto font-medium">
                Start with full access to our demo. No hidden fees or predatory upselling.
              </p>

              {/* Billing Cycle Switcher */}
              <div className="flex justify-center items-center space-x-2 pt-2">
                <span className={`text-xs font-bold ${pricingCycle === "monthly" ? "text-slate-900" : "text-slate-500"}`}>
                  Monthly
                </span>
                <button
                  type="button"
                  onClick={() => setPricingCycle(pricingCycle === "monthly" ? "annual" : "monthly")}
                  className="w-12 h-6 rounded-full bg-slate-200 p-1 transition-colors relative"
                  aria-label="Toggle annual billing discount"
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-amber-500 transition-transform ${
                      pricingCycle === "annual" ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className={`text-xs font-bold ${pricingCycle === "annual" ? "text-slate-900" : "text-slate-500"}`}>
                  Annual <span className="text-emerald-600 font-black">(Save 25%)</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Free Sandbox */}
              <div className="p-8 rounded-[32px] bg-white border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700">
                    Free Sandbox
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">Explorer</h3>
                  <div className="text-3xl font-black text-slate-900">$0</div>
                  <p className="text-xs text-slate-500">Perfect for trying Weebly with your child today.</p>
                  <ul className="space-y-2 pt-2 text-xs font-semibold text-slate-700">
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Full access to Kids Magic Home</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>15 daily voice turns with Kai &amp; Mia</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>100 starter curriculum questions</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/youth/dashboard"
                  className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black text-center transition-colors block"
                >
                  Try Explorer Free
                </Link>
              </div>

              {/* Family Sanctuary */}
              <div className="p-8 rounded-[32px] bg-gradient-to-b from-amber-50 to-orange-50/50 border-2 border-amber-400 shadow-md space-y-5 flex flex-col justify-between relative">
                <span className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white shadow-2xs">
                  Most Popular
                </span>
                <div className="space-y-3">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-200 text-amber-900">
                    Family Plan
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">Family Sanctuary</h3>
                  <div className="text-3xl font-black text-slate-900">
                    {pricingCycle === "annual" ? "$9" : "$12"}
                    <span className="text-xs text-slate-500 font-bold"> / month</span>
                  </div>
                  <p className="text-xs text-slate-600">Comprehensive learning, stories, and routine support.</p>
                  <ul className="space-y-2 pt-2 text-xs font-semibold text-slate-700">
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Up to 4 child &amp; teen profiles</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Unlimited voice conversations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>3,000 full curriculum question bank</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Parent Observation Diary &amp; controls</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/signup"
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black text-center shadow-xs transition-colors block"
                >
                  Start 14-Day Free Trial
                </Link>
              </div>

              {/* School District */}
              <div className="p-8 rounded-[32px] bg-white border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-900">
                    School &amp; District
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">School Pilot</h3>
                  <div className="text-3xl font-black text-slate-900">Custom</div>
                  <p className="text-xs text-slate-500">For elementary schools and school districts.</p>
                  <ul className="space-y-2 pt-2 text-xs font-semibold text-slate-700">
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Teacher classroom management portals</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Multi-campus administrative dashboard</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Classroom projector &amp; group activities</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>FERPA &amp; COPPA institutional compliance</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/schools"
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black text-center transition-colors block"
                >
                  Request School Pilot
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10. FOOTER IS INCLUDED VIA MARKETING SHELL                                */}
        {/* ========================================================================= */}
        <InteractiveProductTutorial
          isOpen={isTutorialOpen}
          onClose={() => setIsTutorialOpen(false)}
        />
      </div>
    </MarketingShell>
  );
}
