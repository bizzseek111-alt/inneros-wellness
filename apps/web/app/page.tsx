"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { CompanionPortrait, CompanionId } from "@/components/v9/CompanionPortrait";
import {
  WEEBLY_V9_LEARNING_WORLDS,
} from "@/design-system/weebly-v9-tokens";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Volume2,
  School,
  Play,
  BookOpen,
  Palette,
  Activity,
  CheckCircle2,
  Users,
  Lock,
  Globe,
  Send,
  Compass,
  HeartHandshake,
} from "lucide-react";

const COMPANIONS = [
  {
    id: "kai" as CompanionId,
    name: "Kai",
    role: "Explorer & Problem-Solving Guide",
    specialty: "Numbers, patterns, reading quests & outdoor action",
    badgeBg: "bg-teal-100 text-teal-900 border-teal-300",
    cardBorder: "border-teal-500",
    sampleSpeech: {
      en: "Hi! I'm Kai. Let's solve a rocket bridge puzzle together, one step at a time!",
      ur: "سلام! میں کائی ہوں۔ آؤ مل کر ریاضی اور سائنس کے دلچسپ سوالات حل کریں!",
      pa: "سلام جی! میں کائی آں۔ آؤ مل کے حساب دے سوال ہولے ہولے سمجھیئے!",
    },
    prompts: [
      "Can we share 12 mangoes among 4 friends?",
      "Give me a 60-second balance challenge!",
      "آؤ گنتی کا کھیل کھیلیں",
    ],
  },
  {
    id: "mia" as CompanionId,
    name: "Mia",
    role: "Storyteller & Creative Companion",
    specialty: "Interactive stories, drawing, music & bilingual vocabulary",
    badgeBg: "bg-pink-100 text-pink-900 border-pink-300",
    cardBorder: "border-pink-500",
    sampleSpeech: {
      en: "Hello friend! I'm Mia. Let's paint a picture or invent a story about a brave little bird!",
      ur: "ہیلو پیارے دوست! میں میا ہوں۔ کیا آپ میرے ساتھ ایک خوبصورت کہانی بنانا چاہتے ہیں؟",
      pa: "ہیلو بیلی! میں میا آں۔ آؤ رل کے اک سوہنی کہانی بنائیے!",
    },
    prompts: [
      "Let's tell a story about sharing toys",
      "What colors should I use to paint a sunset?",
      "میا، مجھے ایک کہانی سناؤ",
    ],
  },
  {
    id: "lumi" as CompanionId,
    name: "Lumi",
    role: "Calm, Feelings & Gentle Support",
    specialty: "Balloon breathing, visual daily routines & naming feelings",
    badgeBg: "bg-violet-100 text-violet-900 border-violet-300",
    cardBorder: "border-violet-500",
    sampleSpeech: {
      en: "Take a slow breath with me. Inhale like a warm balloon, and gently let it out.",
      ur: "میرے ساتھ ایک گہرا سانس لیں۔ آہستہ سے سانس اندر، اور سکون سے باہر۔",
      pa: "میرے نال اک ہولا ساہ لوو۔ ہولے جئے ساہ اندر، تے ہولے جئے باہر۔",
    },
    prompts: [
      "Can we do three slow balloon breaths?",
      "Help me plan my morning routine",
      "مجھے تھوڑا غصہ آ رہا ہے، کیا کروں؟",
    ],
  },
  {
    id: "zayn" as CompanionId,
    name: "Zayn",
    role: "Curiosity, Coding & Everyday Skills",
    specialty: "Step-by-step logic, safe tech discovery & helpful habits",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
    cardBorder: "border-amber-500",
    sampleSpeech: {
      en: "Did you know computers follow step-by-step recipes called algorithms? Let's build one!",
      ur: "کیا آپ جانتے ہیں کہ کمپیوٹر قدم بہ قدم ہدایات پر عمل کرتا ہے؟ آؤ سیکھیں!",
      pa: "کی تسیں جاندے او کمپیوٹر کیویں کم کردا اے؟ آؤ ویکھیئے!",
    },
    prompts: [
      "How does a robot know where to turn?",
      "Let's solve a pattern sequence puzzle",
      "What if someone asks me to keep a secret online?",
    ],
  },
];

const SIX_ROLE_DEMOS = [
  {
    id: "child",
    number: "01",
    role: "Child Experience (Ages 3–12)",
    title: "Voice Companion & Learning World",
    summary: "Talk with Kai or Mia, solve an interactive quest, and earn a skill badge.",
    href: "/demos?demo=child",
    directHref: "/youth/dashboard",
    accent: "bg-sky-50 border-sky-200 text-sky-900",
  },
  {
    id: "teen",
    number: "02",
    role: "Teen Experience (Ages 13–16)",
    title: "Study Habits, Coding & Calm Reflection",
    summary: "Age-appropriate academic problem-solving, digital literacy, and calm focus tools.",
    href: "/demos?demo=teen",
    directHref: "/youth/friends?friend=zayn",
    accent: "bg-indigo-50 border-indigo-200 text-indigo-900",
  },
  {
    id: "parent",
    number: "03",
    role: "Parent & Caregiver Center",
    title: "Developmental Insights & Home Routines",
    summary: "Review learning milestones, language preferences, and record home observations.",
    href: "/demos?demo=parent",
    directHref: "/parent",
    accent: "bg-emerald-50 border-emerald-200 text-emerald-900",
  },
  {
    id: "teacher",
    number: "04",
    role: "Teacher Studio",
    title: "Classroom Quests & Curriculum Alignment",
    summary: "Assign bilingual learning worlds to a class and track participation by skill domain.",
    href: "/demos?demo=teacher",
    directHref: "/teacher/dashboard",
    accent: "bg-amber-50 border-amber-200 text-amber-900",
  },
  {
    id: "school",
    number: "05",
    role: "School Leadership Portal",
    title: "Cohort Overview & Safeguarding Governance",
    summary: "Monitor grade-level engagement, teacher adoption, and school-wide safety protocols.",
    href: "/demos?demo=school",
    directHref: "/school/portal",
    accent: "bg-purple-50 border-purple-200 text-purple-900",
  },
  {
    id: "professional",
    number: "06",
    role: "Wellbeing & Safeguarding Review",
    title: "Non-Clinical Support & 1121 Escalation",
    summary: "Inspect how distress or caregiver-harm disclosures trigger immediate human safeguarding.",
    href: "/demos?demo=professional",
    directHref: "/professional/portal",
    accent: "bg-rose-50 border-rose-200 text-rose-900",
  },
];

export default function WeeblyV9HomePage() {
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionId>("kai");
  const [previewLang, setPreviewLang] = useState<"en" | "ur" | "pa">("en");
  const [speakingCompanion, setSpeakingCompanion] = useState<CompanionId | null>(null);

  // Live Interactive Product Demo State (Section 3)
  const [demoInput, setDemoInput] = useState("");
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoHistory, setDemoHistory] = useState<
    Array<{
      role: "child" | "companion";
      speaker: string;
      text: string;
      actionLabel?: string;
      actionRoute?: string;
      provider?: string;
    }>
  >([
    {
      role: "companion",
      speaker: "Kai",
      text: "Assalam-o-Alaikum! Hi friend! Pick a question below or type your own to see how I guide learning and open activities.",
      provider: "ready",
    },
  ]);

  const activeCompanion =
    COMPANIONS.find((c) => c.id === selectedCompanion) || COMPANIONS[0];

  const handlePlaySample = (id: CompanionId, text: string, lang: "en" | "ur" | "pa") => {
    setSpeakingCompanion(id);
    voiceSynthesizer.speak(text, {
      characterId: id,
      locale: lang,
      onEnd: () => setSpeakingCompanion(null),
    });
  };

  const handleRunLiveTurn = async (promptText: string) => {
    const clean = promptText.trim();
    if (!clean || demoLoading) return;

    setDemoLoading(true);
    setDemoInput("");
    setDemoHistory((prev) => [
      ...prev,
      { role: "child", speaker: "Child", text: clean },
    ]);

    try {
      const res = await fetch("/api/youth/friends/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character_id: selectedCompanion,
          message: clean,
          language: previewLang,
          age_tier: "junior",
        }),
      });
      const data = await res.json();
      const replyText =
        data.reply ||
        "Let's explore that together! Tap below to open our learning activity.";
      setDemoHistory((prev) => [
        ...prev,
        {
          role: "companion",
          speaker: activeCompanion.name,
          text: replyText,
          actionLabel: data.action?.label,
          actionRoute: data.action?.route,
          provider: data.ai_provider || "template-fallback",
        },
      ]);
      handlePlaySample(selectedCompanion, replyText, previewLang);
    } catch {
      setDemoHistory((prev) => [
        ...prev,
        {
          role: "companion",
          speaker: activeCompanion.name,
          text: "I'm ready to help! Let's step into Learning Quest together.",
        },
      ]);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <MarketingShell>
      <div className="bg-[#FAF7F2] text-[#0F172A] min-h-screen">
        {/* ===================================================================== */}
        {/* SECTION 1: CINEMATIC HERO & INTERACTIVE COMPANION STAGE               */}
        {/* ===================================================================== */}
        <section className="relative pt-10 pb-20 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#E7E0D6] overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Editorial Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E7E0D6] shadow-2xs text-xs font-bold text-slate-800">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Ages 3–16 • Voice-First Learning, Creativity &amp; Child Development</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight text-[#0F172A] leading-[1.06]">
                Learning begins with{" "}
                <span className="text-indigo-600 underline decoration-amber-400 decoration-wavy decoration-2 underline-offset-8">
                  a conversation.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-[#334155] leading-relaxed max-w-2xl">
                Weebly is a calm, joyful digital world where children talk with four caring AI companions, explore six interactive learning worlds, and build academic, creative, and everyday life skills—connected with parents and teachers in{" "}
                <strong className="text-slate-900">English, Urdu (اردو), and Punjabi (پنجابی)</strong>.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/demos"
                  className="px-7 py-4 rounded-2xl bg-[#0F172A] text-white font-bold text-base hover:bg-slate-800 transition shadow-sm inline-flex items-center gap-2.5"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Try Interactive Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/youth/dashboard"
                  className="px-7 py-4 rounded-2xl bg-white border-2 border-[#0F172A] text-[#0F172A] font-bold text-base hover:bg-amber-50 transition inline-flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Enter Kids World</span>
                </Link>

                <Link
                  href="/schools"
                  className="px-5 py-4 rounded-2xl text-slate-700 hover:text-slate-900 font-semibold text-sm inline-flex items-center gap-1.5 underline underline-offset-4"
                >
                  <School className="w-4 h-4 text-indigo-600" />
                  <span>For Schools &amp; Pilots</span>
                </Link>
              </div>

              {/* Key Trust Pills */}
              <div className="pt-4 grid grid-cols-3 gap-3 max-w-xl border-t border-[#E7E0D6]">
                <div>
                  <div className="text-lg font-extrabold text-slate-900">4 Companions</div>
                  <div className="text-xs text-slate-600">Kai, Mia, Lumi &amp; Zayn</div>
                </div>
                <div>
                  <div className="text-lg font-extrabold text-slate-900">6 Worlds</div>
                  <div className="text-xs text-slate-600">3,000+ Guided Prompts</div>
                </div>
                <div>
                  <div className="text-lg font-extrabold text-slate-900">Safety First</div>
                  <div className="text-xs text-slate-600">Non-clinical • 1121 Guardrails</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Companion Stage */}
            <div className="lg:col-span-5">
              <div className="rounded-[32px] bg-white border-2 border-[#0F172A] p-6 sm:p-7 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Live Companion Voice Stage
                  </span>
                  <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs font-bold">
                    {(["en", "ur", "pa"] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setPreviewLang(lang)}
                        className={`px-2.5 py-1 rounded-full transition ${
                          previewLang === lang
                            ? "bg-slate-900 text-white"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {lang === "en" ? "EN" : lang === "ur" ? "اردو" : "پنجابی"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Companion Spotlight */}
                <div className="rounded-2xl bg-[#FAF7F2] border border-[#E7E0D6] p-5 flex flex-col items-center text-center">
                  <CompanionPortrait
                    character={activeCompanion.id}
                    size={112}
                    state={speakingCompanion === activeCompanion.id ? "speaking" : "idle"}
                  />
                  <span
                    className={`mt-3 px-3 py-0.5 rounded-full text-xs font-bold border ${activeCompanion.badgeBg}`}
                  >
                    {activeCompanion.role}
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                    {activeCompanion.name}
                  </h2>
                  <p
                    className="text-sm text-slate-700 mt-2 leading-relaxed font-medium"
                    dir={previewLang === "en" ? "ltr" : "rtl"}
                  >
                    &ldquo;{activeCompanion.sampleSpeech[previewLang]}&rdquo;
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        handlePlaySample(
                          activeCompanion.id,
                          activeCompanion.sampleSpeech[previewLang],
                          previewLang
                        )
                      }
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-xs"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>
                        {speakingCompanion === activeCompanion.id
                          ? "Speaking..."
                          : `Hear ${activeCompanion.name}`}
                      </span>
                    </button>
                    <Link
                      href={`/youth/friends?friend=${activeCompanion.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-slate-300 text-slate-900 text-xs font-bold hover:bg-slate-50 transition"
                    >
                      <span>Talk to {activeCompanion.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Companion Switcher Pills */}
                <div className="grid grid-cols-4 gap-2">
                  {COMPANIONS.map((comp) => (
                    <button
                      key={comp.id}
                      type="button"
                      onClick={() => setSelectedCompanion(comp.id)}
                      className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                        selectedCompanion === comp.id
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <CompanionPortrait character={comp.id} size={40} />
                      <span className="text-xs font-bold">{comp.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* V10 UNIFIED ECOSYSTEM: WEEBLY — LEARN. CREATE. THINK. GROW.           */}
        {/* ===================================================================== */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-[#E7E0D6] bg-white">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="inline-block rounded-full bg-amber-100 border border-amber-300 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-950">
                  WEEBLY — LEARN. CREATE. THINK. GROW.
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                  Four Connected Product Pillars for Ages 2–18
                </h2>
                <p className="text-slate-600 mt-1 text-sm sm:text-base max-w-2xl">
                  A unified international-grade learning, AI creation, foundational thinking, and child-development ecosystem—exceptionally simple for children, richly structured for families and schools.
                </p>
              </div>
              <Link
                href="/ai-creator-academy"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-xs font-extrabold text-white hover:bg-slate-800 transition"
              >
                <span>Explore Age 2–18 AI Pathway &amp; Creator Academy</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-3xl border-2 border-teal-300 bg-teal-50/60 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase text-teal-800">Pillar 01 · Learn with AI</span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">5-Stage Learning Journeys</h3>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                    Structured <strong>WATCH → LEARN → PLAY → IMPLEMENT → REFLECT</strong> journeys across math, reading, AI literacy, and life skills.
                  </p>
                </div>
                <Link
                  href="/youth/journeys"
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-extrabold text-teal-900 underline underline-offset-4"
                >
                  <span>Open Learning Journeys</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="rounded-3xl border-2 border-amber-300 bg-amber-50/60 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase text-amber-900">Pillar 02 · Create with AI</span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">AI Creator Academy</h3>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                    AI Story Maker, Visual Block Game Maker (Ages 5–16), Cartoon Studio, Art Lab, Young AI Inventors, and AI Detective.
                  </p>
                </div>
                <Link
                  href="/youth/creator"
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-950 underline underline-offset-4"
                >
                  <span>Launch AI Creator Academy</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="rounded-3xl border-2 border-indigo-300 bg-indigo-50/60 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase text-indigo-900">Pillar 03 · Build Foundational Skills</span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">Foundational Skills Lab</h3>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                    10 non-clinical cognitive &amp; executive-function activities: Freeze &amp; Go, Memory Garden, Switch the Rule, and Story Sequencer.
                  </p>
                </div>
                <Link
                  href="/youth/skills-lab"
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-950 underline underline-offset-4"
                >
                  <span>Practice Foundational Skills</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="rounded-3xl border-2 border-rose-300 bg-rose-50/60 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase text-rose-900">Pillar 04 · Grow with Support</span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">Skills &amp; Creations Passport</h3>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                    Private-by-default child portfolio, ADHD/autism-friendly calm pacing, AAC tap-to-speak boards, and parent sharing controls.
                  </p>
                </div>
                <Link
                  href="/youth/passport"
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-extrabold text-rose-950 underline underline-offset-4"
                >
                  <span>View Skills Passport</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* SECTION 2: MEET THE FOUR AI FRIENDS                                   */}
        {/* ===================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
              Section 02 • Expressive Voice Mentors
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Meet Your Child&apos;s Four AI Learning Friends
            </h2>
            <p className="text-slate-600 mt-2 text-base sm:text-lg">
              Each companion has a distinct pedagogical specialty, calm vocal cadence, and strict child-safety boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {COMPANIONS.map((friend) => (
              <div
                key={friend.id}
                className="rounded-3xl bg-white border-2 border-slate-900 p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <CompanionPortrait
                      character={friend.id}
                      size={76}
                      state={speakingCompanion === friend.id ? "speaking" : "idle"}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handlePlaySample(
                          friend.id,
                          friend.sampleSpeech[previewLang],
                          previewLang
                        )
                      }
                      aria-label={`Play ${friend.name} voice sample`}
                      className="w-11 h-11 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center justify-center transition"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  <h3 className="text-2xl font-extrabold text-slate-900 mt-4">
                    {friend.name}
                  </h3>
                  <p className="text-xs font-bold text-indigo-600 mt-0.5">
                    {friend.role}
                  </p>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                    {friend.specialty}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/youth/friends?friend=${friend.id}`}
                    className="text-xs font-extrabold text-slate-900 hover:text-indigo-600 inline-flex items-center gap-1"
                  >
                    <span>Start Conversation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-[11px] font-semibold text-slate-400">
                    EN • اردو • پنجابی
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* SECTION 3: LIVE INTERACTIVE PRODUCT DEMONSTRATION                     */}
        {/* ===================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#E7E0D6]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Section 03 • Real API Walkthrough
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Try a Live Conversation Right Here
              </h2>
              <p className="text-slate-600 leading-relaxed">
                This is not a static screenshot. Pick a companion prompt or type a question in English, Urdu, or Punjabi. Watch how Weebly responds, routes to an interactive learning activity, and enforces safety guardrails.
              </p>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Quick Prompts for {activeCompanion.name}:
                </div>
                <div className="flex flex-col gap-2">
                  {activeCompanion.prompts.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleRunLiveTurn(p)}
                      className="text-left px-4 py-3 rounded-2xl bg-[#FAF7F2] hover:bg-indigo-50 border border-[#E7E0D6] hover:border-indigo-300 text-sm font-semibold text-slate-800 transition flex items-center justify-between"
                    >
                      <span>&ldquo;{p}&rdquo;</span>
                      <ArrowRight className="w-4 h-4 text-indigo-600 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-[#FAF7F2] border-2 border-slate-900 p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D6]">
                  <div className="flex items-center gap-3">
                    <CompanionPortrait character={selectedCompanion} size={44} />
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">
                        Talking with {activeCompanion.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        Connected to `/api/youth/friends/turn` • Safe Turn Limit Active
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/youth/friends?friend=${selectedCompanion}`}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    Open Full Screen →
                  </Link>
                </div>

                {/* Conversation Transcript */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {demoHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl text-sm ${
                        item.role === "child"
                          ? "bg-slate-900 text-white ml-8"
                          : "bg-white border border-[#E7E0D6] text-slate-800 mr-8"
                      }`}
                    >
                      <div className="text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">
                        {item.speaker}
                      </div>
                      <p className="leading-relaxed">{item.text}</p>
                      {item.actionRoute && (
                        <Link
                          href={item.actionRoute}
                          className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                        >
                          <span>{item.actionLabel || "Open Activity"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  ))}
                  {demoLoading && (
                    <div className="p-3 rounded-2xl bg-white border border-[#E7E0D6] text-xs font-semibold text-slate-500">
                      {activeCompanion.name} is thinking...
                    </div>
                  )}
                </div>

                {/* Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRunLiveTurn(demoInput);
                  }}
                  className="flex gap-2 pt-2"
                >
                  <input
                    type="text"
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                    placeholder={`Ask ${activeCompanion.name} a question...`}
                    aria-label={`Ask ${activeCompanion.name} a question`}
                    className="flex-1 px-4 py-3 rounded-2xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                  <button
                    type="submit"
                    disabled={demoLoading}
                    className="px-5 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* SECTION 4: SIX INTERACTIVE LEARNING WORLDS                            */}
        {/* ===================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
                Section 04 • Holistic Curriculum
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                Six Interactive Learning Worlds
              </h2>
              <p className="text-slate-600 mt-2 max-w-2xl">
                Every conversation can launch a hands-on activity across literacy, numeracy, creative arts, movement, moral stories, coding, and emotional regulation.
              </p>
            </div>
            <Link
              href="/youth/play"
              className="px-5 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition self-start"
            >
              Explore All 6 Worlds →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {WEEBLY_V9_LEARNING_WORLDS.map((world) => (
              <div
                key={world.id}
                className="rounded-3xl bg-white border-2 border-slate-900 p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-extrabold"
                      style={{ backgroundColor: world.bgTint, color: world.color }}
                    >
                      Ages {world.ageBands.join(" • ")}
                    </span>
                    <span className="text-xs font-bold text-slate-500 capitalize">
                      Guide: {world.mentor}
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-slate-900 mt-4">
                    {world.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">
                    {world.subtitle}
                  </p>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                    {world.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {world.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={world.href}
                    className="inline-flex items-center gap-1.5 text-sm font-extrabold text-indigo-600 hover:text-indigo-800"
                  >
                    <span>Open {world.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* SECTION 5: VOICE-FIRST MULTILINGUAL LEARNING (HONEST STATUS)          */}
        {/* ===================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#EDE9FE]/50 border-y border-[#E7E0D6]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-violet-700">
                Section 05 • Multilingual Inclusion
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Built for English, Urdu &amp; Pakistani Punjabi Households
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Children learn best when they can ask questions in the language they speak at home. Weebly supports code-switching, Nastaliq &amp; Shahmukhi right-to-left typography, and transparent voice synthesis modes.
              </p>
              <div className="pt-2">
                <Link
                  href="/youth/language"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold"
                >
                  <Globe className="w-4 h-4" />
                  <span>Test Language &amp; Voice Studio</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white border border-slate-200 p-5">
                <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Native Neural &amp; OS Voice
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-3">English</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Full speech recognition, neural TTS (`en-US`), and 3,000+ curriculum prompts.
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 p-5">
                <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Nastaliq RTL + Neural TTS
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-3">اردو (Urdu)</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Full Urdu conversational support (`ur-PK` neural voices Uzma &amp; Asad + Roman Urdu input).
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 p-5">
                <span className="text-xs font-bold uppercase text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                  Shahmukhi Text + Phonetic TTS
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-3">پنجابی (Punjabi)</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Written Shahmukhi &amp; Roman Punjabi dialogue with `ur-PK` phonetic speech synthesis fallback.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* SECTION 6 & 7: CREATIVE STUDIO & UNIFIED CHILD DEVELOPMENT LOOP       */}
        {/* ===================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Section 6: Learning & Creativity */}
            <div className="rounded-3xl bg-white border-2 border-slate-900 p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-pink-700">
                <Palette className="w-4 h-4" />
                <span>Section 06 • Creative Studio &amp; Active Play</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Screen Time That Leads to Drawing, Storytelling &amp; Offline Movement
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Instead of passive video scrolling, children paint on an interactive canvas, compose rhythms, act out moral story choices, and complete 60-second physical balance drills away from the screen.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/creative-studio"
                  className="px-5 py-2.5 rounded-xl bg-pink-600 text-white text-xs font-bold hover:bg-pink-700"
                >
                  Open Creative Studio →
                </Link>
                <Link
                  href="/youth/play?world=sports-movement"
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200"
                >
                  Try Movement Drills →
                </Link>
              </div>
            </div>

            {/* Section 7: Unified Child Development Architecture */}
            <div className="rounded-3xl bg-white border-2 border-slate-900 p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                <Activity className="w-4 h-4" />
                <span>Section 07 • Unified Learning Loop</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                One Connected Loop: Child → Companion → Activity → Adult Insight
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                When a child finishes a reading quest or calm-breathing exercise, Weebly logs a developmental milestone event (`/api/educational/activity-events`) that parents and teachers can review—without ever exposing private emotional journals or making clinical diagnoses.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/how-it-works"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  See How the Loop Works →
                </Link>
                <Link
                  href="/technology"
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200"
                >
                  Inspect Architecture →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* SECTION 8 & 9: FOR PARENTS AND FOR SCHOOLS PREVIEWS                   */}
        {/* ===================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#E7E0D6]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Section 8: For Parents */}
            <div className="rounded-3xl bg-[#FAF7F2] border border-[#E7E0D6] p-8 space-y-5">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
                Section 08 • For Parents &amp; Caregivers
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Peace of Mind, Home Routines &amp; Clear Progress
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>See which worlds and skills your child practiced today.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Set preferred household languages (English, Urdu, Punjabi) and calm sensory modes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Built-in 15-turn gentle screen-break reminders prevent compulsive use.</span>
                </li>
              </ul>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/parent"
                  className="px-5 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                >
                  Open Parent Portal →
                </Link>
                <Link
                  href="/parents"
                  className="px-5 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-50"
                >
                  Parent Guide
                </Link>
              </div>
            </div>

            {/* Section 9: For Schools & Teachers */}
            <div className="rounded-3xl bg-[#FAF7F2] border border-[#E7E0D6] p-8 space-y-5">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
                Section 09 • For Schools, Teachers &amp; Pilots
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Classroom Assignments, Cohort Analytics &amp; Safeguarding
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Assign age-banded learning quests aligned with ECCE, Primary, and Middle curricula.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Low-bandwidth PWA works on shared classroom tablets and Android phones.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Role-isolated portals for Teachers, Principals, and Safeguarding Leads.</span>
                </li>
              </ul>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/teacher/dashboard"
                  className="px-5 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                >
                  Open Teacher Studio →
                </Link>
                <Link
                  href="/school/portal"
                  className="px-5 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-50"
                >
                  School Portal →
                </Link>
                <Link
                  href="/schools/pilot"
                  className="px-5 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold hover:bg-emerald-100"
                >
                  School Pilot Program
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* SECTION 10: CHILD SAFETY, PRIVACY & NON-CLINICAL GOVERNANCE           */}
        {/* ===================================================================== */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded-3xl bg-[#0F172A] text-white p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Section 10 • Safeguarding by Architecture</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold">
                Strict Child-Safety Guardrails. Zero Clinical Profiling.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Weebly is an educational and developmental support platform—never a medical device or diagnostic tool. AI companions refuse secrecy requests (&ldquo;Can you keep a secret?&rdquo;), never label children with psychological conditions, and immediately route distress or abuse disclosures to verified human lifelines including{" "}
                <strong className="text-white">Child Protection &amp; Welfare Bureau (1121)</strong> and{" "}
                <strong className="text-white">Umang Pakistan (0311-7786264)</strong>.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                href="/trust"
                className="px-6 py-3.5 rounded-2xl bg-white text-slate-900 font-bold text-sm text-center hover:bg-slate-100"
              >
                Read Trust &amp; Safety Architecture →
              </Link>
              <Link
                href="/child-safety"
                className="px-6 py-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-white font-bold text-sm text-center hover:bg-slate-700"
              >
                Safeguarding &amp; 1121 Protocol →
              </Link>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* SECTION 11: SIX ROLE-BASED INTERACTIVE DEMOS                          */}
        {/* ===================================================================== */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
                Section 11 • Complete Role Walkthroughs
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                Six Isolated Role Demonstrations
              </h2>
              <p className="text-slate-600 mt-1 max-w-2xl">
                Test Weebly from every perspective—Child, Teen, Parent, Teacher, School Principal, and Safeguarding Reviewer.
              </p>
            </div>
            <Link
              href="/demos"
              className="px-5 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700"
            >
              Open Full Demo Center →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {SIX_ROLE_DEMOS.map((demo) => (
              <div
                key={demo.id}
                className="rounded-3xl bg-white border border-[#E7E0D6] p-6 hover:border-slate-900 transition flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${demo.accent}`}>
                      Demo {demo.number} • {demo.role}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-4">
                    {demo.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {demo.summary}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={demo.href}
                    className="text-xs font-extrabold text-indigo-600 hover:underline"
                  >
                    Guided Walkthrough →
                  </Link>
                  <Link
                    href={demo.directHref}
                    className="text-xs font-bold text-slate-700 hover:text-slate-900"
                  >
                    Live Workspace ↗
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* SECTION 12: FINAL CALL TO ACTION                                      */}
        {/* ===================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#E7E0D6] bg-gradient-to-b from-[#FAF7F2] to-[#EDE9FE]/60">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Start a Conversation That Helps Every Child Grow
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Explore the interactive demos immediately with zero login required, or request a guided school pilot for your classrooms.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/demos"
                className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold text-base hover:bg-slate-800 shadow-sm"
              >
                Launch Interactive Demo Center
              </Link>
              <Link
                href="/youth/dashboard"
                className="px-8 py-4 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 font-bold text-base hover:bg-amber-50"
              >
                Open Kids Magic Home
              </Link>
              <Link
                href="/contact"
                className="px-6 py-4 rounded-2xl text-indigo-700 font-bold text-sm hover:underline"
              >
                Contact School Pilot Team →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
