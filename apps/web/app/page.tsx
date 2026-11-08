"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { CompanionPortrait, CompanionId } from "@/components/v9/CompanionPortrait";
import { WEEBLY_V9_LEARNING_WORLDS } from "@/design-system/weebly-v9-tokens";
import { WEEBLY_V10_DESIGN_SYSTEM } from "@/design-system/weebly-v10-tokens";
import { AICreatorAcademyShowcase } from "@/components/v10/AICreatorAcademyShowcase";
import {
  JourneyEngineInteractivePreview,
  FoundationalSkillsInteractivePreview,
  InclusiveLearningInteractivePreview,
} from "@/components/v10/HomepageInteractiveSections";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Volume2,
  School,
  Play,
  BookOpen,
  CheckCircle2,
  Lock,
  Send,
  Compass,
  HeartHandshake,
  Brain,
  SearchCheck,
  WifiOff,
  Smartphone,
  Globe,
  Users,
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

const AGE_AI_PATHWAYS = [
  {
    age: "Age 5",
    focus: "Picture Storytelling & Spotting Silly AI Mistakes",
    exampleCreation: "3-panel narrated picture story about a friendly mango tree (Caregiver-guided).",
    skills: "Understand that AI is software on a computer, not a real person with feelings.",
  },
  {
    age: "Age 6",
    focus: "Visual Block Games & Character Movement",
    exampleCreation: "Playable 5×5 Star Collector game using Move Right, Jump Up, and Touching Star blocks.",
    skills: "Sequencing step-by-step instructions (algorithms) and predicting character motion.",
  },
  {
    age: "Ages 7–9",
    focus: "Branching Cartoons & AI Detective Fact-Checking",
    exampleCreation: "Interactive 3-scene moral cartoon where characters choose how to share playground equipment.",
    skills: "Spotting AI hallucinations, checking trusted sources, and keeping family info private.",
  },
  {
    age: "Ages 10–12",
    focus: "Multi-Rule Game Debugging & Dataset Fairness",
    exampleCreation: "Custom block game with repeat loops, collision scoring, and a tested fairness checklist.",
    skills: "Inspecting why incomplete training examples lead to biased guesses and debugging logic.",
  },
  {
    age: "Ages 13–15",
    focus: "Structured Logic, Study Habits & Co-Creation",
    exampleCreation: "Interactive science explainer project with cited textbook sources and reflection notes.",
    skills: "Using AI companions for Socratic brainstorming without outsourcing critical thinking.",
  },
  {
    age: "Ages 16–18",
    focus: "Advanced Logic, Data Concepts & Verification Rubrics",
    exampleCreation: "Parent/teacher-approved capstone portfolio analyzing model boundaries and community impact.",
    skills: "Evaluating AI accuracy, attribution, privacy governance, and real-world problem solving.",
  },
];

const SIX_ROLE_DEMOS = [
  {
    id: "child",
    number: "01",
    role: "Child Experience (Ages 3–12)",
    title: "Voice Companion & Learning World",
    summary: "Talk with Kai or Mia, solve an interactive quest, and build a block game.",
    href: "/demos?demo=child",
    directHref: "/youth/dashboard",
    accent: "bg-sky-50 border-sky-200 text-sky-900",
  },
  {
    id: "teen",
    number: "02",
    role: "Teen Experience (Ages 13–18)",
    title: "Study Habits, Coding & Calm Reflection",
    summary: "Age-appropriate academic problem-solving, AI literacy, and calm focus tools.",
    href: "/demos?demo=teen",
    directHref: "/youth/friends?friend=zayn",
    accent: "bg-indigo-50 border-indigo-200 text-indigo-900",
  },
  {
    id: "parent",
    number: "03",
    role: "Parent & Caregiver Center",
    title: "Skills Passport & Home Routines",
    summary: "Review learning milestones, approve portfolio creations, and log home observations.",
    href: "/demos?demo=parent",
    directHref: "/parent",
    accent: "bg-emerald-50 border-emerald-200 text-emerald-900",
  },
  {
    id: "teacher",
    number: "04",
    role: "Teacher Studio",
    title: "Classroom Quests & Curriculum Alignment",
    summary: "Assign bilingual learning journeys to a class and track participation by skill domain.",
    href: "/demos?demo=teacher",
    directHref: "/teacher/dashboard",
    accent: "bg-amber-50 border-amber-200 text-amber-900",
  },
  {
    id: "school",
    number: "05",
    role: "School Leadership Portal",
    title: "Cohort Overview & Pilot Governance",
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

export default function WeeblyV10HomePage() {
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionId>("kai");
  const [previewLang, setPreviewLang] = useState<"en" | "ur" | "pa">("en");
  const [speakingCompanion, setSpeakingCompanion] = useState<CompanionId | null>(null);
  const [selectedAgePathway, setSelectedAgePathway] = useState<number>(1); // Age 6 default
  const [detectiveAnswer, setDetectiveAnswer] = useState<"fact" | "hallucination" | null>(null);

  // Live Interactive Turn State
  const [demoInput, setDemoInput] = useState("");
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoHistory, setDemoHistory] = useState<
    Array<{
      role: "child" | "companion";
      speaker: string;
      text: string;
      actionLabel?: string;
      actionRoute?: string;
    }>
  >([
    {
      role: "companion",
      speaker: "Kai",
      text: "Assalam-o-Alaikum! Hi friend! Pick a question or ask me to open a 5-stage Learning Journey or Block Game!",
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
    setDemoHistory((prev) => [...prev, { role: "child", speaker: "Child", text: clean }]);

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
        data.reply || "Let's explore that together! Tap below to open our learning activity.";
      setDemoHistory((prev) => [
        ...prev,
        {
          role: "companion",
          speaker: activeCompanion.name,
          text: replyText,
          actionLabel: data.action?.label,
          actionRoute: data.action?.route,
        },
      ]);
      handlePlaySample(selectedCompanion, replyText, previewLang);
    } catch {
      setDemoHistory((prev) => [
        ...prev,
        {
          role: "companion",
          speaker: activeCompanion.name,
          text: "I'm ready to help! Let's step into a Learning Journey together.",
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
        {/* 01. HERO: LEARN. CREATE. THINK. GROW.                                 */}
        {/* ===================================================================== */}
        <section className="relative pt-10 pb-20 sm:pt-14 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#E7E0D6] overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E7E0D6] shadow-2xs text-xs font-extrabold text-slate-900">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>WEEBLY — LEARN. CREATE. THINK. GROW. • {WEEBLY_V10_DESIGN_SYSTEM.brand.ageRange}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-[62px] font-black tracking-tight text-[#0F172A] leading-[1.05]">
                Learn. Create.{" "}
                <span className="text-indigo-600 underline decoration-amber-400 decoration-wavy decoration-2 underline-offset-8">
                  Think. Grow.
                </span>
              </h1>

              <p className="text-base sm:text-xl text-[#334155] leading-relaxed max-w-2xl">
                Learning begins with a conversation. Weebly is an international-grade AI learning, creation, and child-development ecosystem where children talk with four caring AI companions, build their own stories and block games, practice foundational thinking skills, and grow with parent and teacher support in{" "}
                <strong className="text-slate-900">English, Urdu (اردو), and Punjabi (پنجابی)</strong>.
              </p>

              {/* 4 Connected Pillar Quick-Jump Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <Link
                  href="/learning-method"
                  className="p-3 rounded-2xl bg-teal-50/90 border border-teal-300 hover:border-teal-600 transition"
                >
                  <div className="text-[10px] font-black uppercase text-teal-800">Pillar 01 · Learn with AI</div>
                  <div className="text-xs font-black text-slate-900 mt-0.5">5-Stage Journeys →</div>
                </Link>
                <Link
                  href="/ai-creator"
                  className="p-3 rounded-2xl bg-amber-50/90 border border-amber-300 hover:border-amber-600 transition"
                >
                  <div className="text-[10px] font-black uppercase text-amber-900">Pillar 02 · Create with AI</div>
                  <div className="text-xs font-black text-slate-900 mt-0.5">Creator Academy →</div>
                </Link>
                <Link
                  href="/brain-skills"
                  className="p-3 rounded-2xl bg-indigo-50/90 border border-indigo-300 hover:border-indigo-600 transition"
                >
                  <div className="text-[10px] font-black uppercase text-indigo-900">Pillar 03 · Build Foundational Skills</div>
                  <div className="text-xs font-black text-slate-900 mt-0.5">10 Thinking Games →</div>
                </Link>
                <Link
                  href="/inclusive-learning"
                  className="p-3 rounded-2xl bg-rose-50/90 border border-rose-300 hover:border-rose-600 transition"
                >
                  <div className="text-[10px] font-black uppercase text-rose-900">Pillar 04 · Grow with Support</div>
                  <div className="text-xs font-black text-slate-900 mt-0.5">Inclusive &amp; Passport →</div>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/demos"
                  className="px-7 py-4 rounded-2xl bg-[#0F172A] text-white font-black text-base hover:bg-slate-800 transition shadow-sm inline-flex items-center gap-2.5"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Try Interactive Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/youth/dashboard"
                  className="px-6 py-4 rounded-2xl bg-white border-2 border-[#0F172A] text-[#0F172A] font-black text-base hover:bg-amber-50 transition inline-flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Enter Kids World</span>
                </Link>
                <Link
                  href="/youth/creator"
                  className="px-5 py-4 rounded-2xl bg-amber-400 text-slate-950 font-black text-sm hover:bg-amber-300 transition inline-flex items-center gap-1.5"
                >
                  <span>Launch AI Creator Academy</span>
                </Link>
              </div>
            </div>

            {/* Right Interactive Companion Stage */}
            <div className="lg:col-span-5">
              <div className="rounded-[32px] bg-white border-2 border-[#0F172A] p-6 sm:p-7 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Animated Companion Voice Stage
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

                <div className="rounded-2xl bg-[#FAF7F2] border border-[#E7E0D6] p-5 flex flex-col items-center text-center">
                  <CompanionPortrait
                    character={activeCompanion.id}
                    size={112}
                    state={speakingCompanion === activeCompanion.id ? "speaking" : "idle"}
                  />
                  <span className={`mt-3 px-3 py-0.5 rounded-full text-xs font-bold border ${activeCompanion.badgeBg}`}>
                    {activeCompanion.role}
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-2">{activeCompanion.name}</h2>
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
        {/* 02. THE PROBLEM: EVIDENCE-BASED BARRIERS TO LEARNING & GROWTH         */}
        {/* ===================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E7E0D6] bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-rose-600">
                Section 02 • The Challenge We Address
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                Passive Screen Time &amp; One-Size-Fits-All Instruction Leave Millions Behind.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Across classrooms and homes, children face three compounding barriers: noisy, overstimulating video feeds that reward passive scrolling; language gaps between home mother tongues and textbook English; and a lack of patient, individualized scaffolding for executive function and emotional regulation.
              </p>
              <p className="text-xs font-bold text-slate-500 bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E7E0D6]">
                <strong>Evidence-Based Boundary:</strong> Weebly provides structured educational practice, language scaffolding, and calm routines. We never claim guaranteed &ldquo;brain rewiring,&rdquo; IQ inflation, or clinical treatment.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="rounded-3xl bg-rose-50/60 border-2 border-rose-200 p-6 space-y-3">
                <span className="text-xs font-black uppercase text-rose-800">Typical Screen Experience</span>
                <h3 className="text-lg font-black text-slate-900">Passive Consumption &amp; Sensory Overload</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <li>• Endless algorithmic autoplay feeds designed to maximize screen time</li>
                  <li>• Unmoderated chat boxes that give answers instead of teaching steps</li>
                  <li>• English-only interfaces that exclude Urdu and Punjabi-speaking families</li>
                  <li>• High-stress countdown timers that penalize neurodivergent learners</li>
                </ul>
              </div>

              <div className="rounded-3xl bg-emerald-50/70 border-2 border-emerald-400 p-6 space-y-3">
                <span className="text-xs font-black uppercase text-emerald-900">The Weebly V10 Approach</span>
                <h3 className="text-lg font-black text-slate-900">Active Creation, Calm Pacing &amp; Real-World Transfer</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-800 font-medium">
                  <li>✓ Structured 5-stage journeys ending with offline family/classroom tasks</li>
                  <li>✓ Human creativity first: children build their own stories and block games</li>
                  <li>✓ Spoken &amp; written guidance in English, Urdu (اردو), and Punjabi (پنجابی)</li>
                  <li>✓ Built-in session wind-downs and neurodiversity-affirming sensory controls</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 03. WATCH → LEARN → PLAY → IMPLEMENT → REFLECT                        */}
        {/* ===================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-3xl">
              <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700">
                Section 03 • Pillar 01: Learn with AI
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                The 5-Stage Learning Journey Engine: Watch → Learn → Play → Implement → Reflect
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                A flexible pedagogical sequence that turns screen concepts into active practice, real-world family or classroom implementation, and thoughtful reflection. Learners can skip or replay any stage at their own pace.
              </p>
            </div>
            <Link
              href="/learning-method"
              className="px-5 py-3 rounded-2xl bg-slate-900 text-white text-xs font-extrabold hover:bg-slate-800 shrink-0 inline-flex items-center gap-1.5"
            >
              <span>Explore Learning Method</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <JourneyEngineInteractivePreview />
        </section>

        {/* ===================================================================== */}
        {/* 04. FOUR AI FRIENDS: KAI, MIA, LUMI, ZAYN + LIVE VOICE TURN           */}
        {/* ===================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#E7E0D6]">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="max-w-3xl">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
                Section 04 • Expressive Voice Mentors
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                Meet Your Child&apos;s Four AI Friends
              </h2>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                Original illustrated companions with distinct pedagogical roles, verified trilingual voice synthesis, and strict anti-secrecy and session-limit guardrails.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {COMPANIONS.map((friend) => (
                <div
                  key={friend.id}
                  className="rounded-3xl bg-[#FAF7F2] border-2 border-slate-900 p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between"
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
                        className="w-11 h-11 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-800 flex items-center justify-center transition"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mt-4">{friend.name}</h3>
                    <p className="text-xs font-bold text-indigo-600 mt-0.5">{friend.role}</p>
                    <p className="text-sm text-slate-600 mt-3 leading-relaxed">{friend.specialty}</p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-200 flex items-center justify-between">
                    <Link
                      href={`/youth/friends?friend=${friend.id}`}
                      className="text-xs font-extrabold text-slate-900 hover:text-indigo-600 inline-flex items-center gap-1"
                    >
                      <span>Talk to {friend.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-[11px] font-semibold text-slate-500">EN • اردو • پنجابی</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Conversational Turn Sandbox */}
            <div className="rounded-3xl bg-[#FAF7F2] border-2 border-slate-900 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-3">
                <span className="text-xs font-black uppercase text-indigo-700">
                  Live Server-Validated Voice &amp; Tool Routing
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Test How {activeCompanion.name} Guides Learning &amp; Launches Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Let's start a learning journey",
                    "Help me build a block game",
                    ...activeCompanion.prompts.slice(0, 2),
                  ].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleRunLiveTurn(p)}
                      className="px-3 py-2 rounded-xl bg-white border border-slate-300 hover:border-slate-900 text-xs font-bold text-slate-800 text-left"
                    >
                      &ldquo;{p}&rdquo;
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 space-y-3">
                <div className="rounded-2xl bg-white border border-slate-200 p-4 max-h-48 overflow-y-auto space-y-2.5">
                  {demoHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-xs ${
                        item.role === "child"
                          ? "bg-slate-900 text-white ml-8"
                          : "bg-amber-50/90 border border-amber-200 text-slate-900 mr-8"
                      }`}
                    >
                      <div className="font-black text-[10px] uppercase opacity-75 mb-0.5">
                        {item.speaker}
                      </div>
                      <div>{item.text}</div>
                      {item.actionRoute && (
                        <Link
                          href={item.actionRoute}
                          className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 text-white font-extrabold text-[11px]"
                        >
                          <span>{item.actionLabel || "Open Activity"}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRunLiveTurn(demoInput);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                    placeholder={`Ask ${activeCompanion.name} a question or say "build a block game"...`}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-900"
                  />
                  <button
                    type="submit"
                    disabled={demoLoading}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-extrabold inline-flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Ask</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 05. FLAGSHIP SECTION: AI CREATOR ACADEMY                              */}
        {/* ===================================================================== */}
        <AICreatorAcademyShowcase />

        {/* ===================================================================== */}
        {/* 06. AGE-BASED AI PATHWAYS (AGES 5 TO 16–18)                           */}
        {/* ===================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-3xl">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-800">
                Section 06 • Readiness-Based Progression
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                Age-Based AI Pathways: Example Creations from Age 5 to 18
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                Structured around <strong>Understand → Apply → Create</strong> (aligned with international student AI competency themes without claiming official UNESCO endorsement). Shows example projects children can build at their own pace—never rigid chronological promises.
              </p>
            </div>
            <Link
              href="/ai-creator-academy"
              className="px-5 py-3 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 text-xs font-extrabold hover:bg-amber-50 shrink-0"
            >
              View Full Age 2–18 Matrix →
            </Link>
          </div>

          {/* Interactive Age Selector */}
          <div className="flex flex-wrap gap-2" role="tablist">
            {AGE_AI_PATHWAYS.map((item, idx) => (
              <button
                key={item.age}
                type="button"
                role="tab"
                aria-selected={selectedAgePathway === idx}
                onClick={() => setSelectedAgePathway(idx)}
                className={`px-5 py-3 rounded-2xl border-2 text-xs sm:text-sm font-black transition ${
                  selectedAgePathway === idx
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white text-slate-800 border-slate-200 hover:border-slate-900"
                }`}
              >
                {item.age}
              </button>
            ))}
          </div>

          <div className="rounded-3xl bg-white border-2 border-slate-900 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-amber-700">Developmental Focus</span>
              <h3 className="text-xl font-black text-slate-900">{AGE_AI_PATHWAYS[selectedAgePathway].focus}</h3>
              <p className="text-xs text-slate-500">Ages 2–4 begin with caregiver-mediated audio stories and songs.</p>
            </div>
            <div className="space-y-2 bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
              <span className="text-xs font-black uppercase text-amber-900">Example Child Creation</span>
              <p className="text-sm font-bold text-slate-900 leading-relaxed">
                {AGE_AI_PATHWAYS[selectedAgePathway].exampleCreation}
              </p>
            </div>
            <div className="space-y-2 bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200">
              <span className="text-xs font-black uppercase text-indigo-900">Practiced AI &amp; Thinking Skill</span>
              <p className="text-sm font-bold text-slate-900 leading-relaxed">
                {AGE_AI_PATHWAYS[selectedAgePathway].skills}
              </p>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 07. FOUNDATIONAL SKILLS LAB                                           */}
        {/* ===================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#EEF2FF]/60 border-y border-[#E7E0D6]">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="max-w-3xl">
                <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-700">
                  Section 07 • Pillar 03: Build Foundational Skills
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                  10 Foundational Thinking, Memory &amp; Self-Regulation Games
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mt-2">
                  Playful, non-clinical practice across Attention (<em>Freeze &amp; Go</em>), Working Memory (<em>Memory Garden</em>), Cognitive Flexibility (<em>Switch the Rule</em>), Planning (<em>Plan My Day</em>), Communication, and Self-Regulation.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  href="/youth/skills-lab"
                  className="px-5 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-extrabold hover:bg-indigo-700"
                >
                  Open Skills Lab (10 Games) →
                </Link>
                <Link
                  href="/brain-skills"
                  className="px-4 py-3 rounded-2xl bg-white border border-slate-300 text-slate-800 text-xs font-extrabold"
                >
                  Methodology
                </Link>
              </div>
            </div>

            <FoundationalSkillsInteractivePreview />
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 08. SIX LEARNING WORLDS (PRESERVING ALL ROUTES)                       */}
        {/* ===================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700">
                Section 08 • Six Interactive Learning Worlds
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                Six Connected Worlds Backed by 3,000+ Guided Questions
              </h2>
            </div>
            <Link
              href="/youth/play"
              className="px-5 py-3 rounded-2xl bg-slate-900 text-white text-xs font-extrabold"
            >
              Open Child Play Hub →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WEEBLY_V9_LEARNING_WORLDS.map((world) => (
              <div
                key={world.id}
                className="rounded-3xl bg-white border-2 border-slate-900 p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <CompanionPortrait character={world.mentor} size={40} />
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-extrabold capitalize">
                      Guide: {world.mentor}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-3">{world.title}</h3>
                  <p className="text-xs font-bold text-indigo-600 mt-0.5">{world.subtitle}</p>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">{world.description}</p>
                </div>
                <Link
                  href={world.href}
                  className="mt-5 pt-3 border-t border-slate-100 text-xs font-extrabold text-slate-900 hover:text-indigo-600 inline-flex items-center justify-between"
                >
                  <span>Enter {world.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 09. INCLUSIVE LEARNING & NEURODIVERSITY-AFFIRMING SUPPORTS            */}
        {/* ===================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#ECFDF5]/60 border-y border-[#E7E0D6]">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="max-w-3xl">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800">
                  Section 09 • Pillar 04: Inclusive Learning
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                  ADHD-Friendly Focus, Autism-Affirming Routines &amp; AAC Communication
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mt-2">
                  Built with predictable visual schedules, sensory-friendly low-stimulation palettes, tap-to-speak AAC boards, and reading accessibility—never framing autism or neurodivergence as a disease to cure.
                </p>
              </div>
              <Link
                href="/inclusive-learning"
                className="px-5 py-3 rounded-2xl bg-emerald-800 text-white text-xs font-extrabold shrink-0"
              >
                Explore Inclusive Design →
              </Link>
            </div>

            <InclusiveLearningInteractivePreview />
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 10. CHILD WELLBEING, EARLY SUPPORT & SAFEGUARDING BOUNDARIES          */}
        {/* ===================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-3xl">
              <span className="text-xs font-extrabold uppercase tracking-widest text-rose-700">
                Section 10 • Child Wellbeing &amp; Human Safeguarding
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                Emotional Literacy, Adult Observations &amp; Strict Clinical Boundaries
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                Weebly helps children name everyday feelings and helps parents and teachers record structured behavioural observations—while strictly prohibiting AI psychiatric diagnoses and routing distress to human professionals and helplines (CPWB 1121 &amp; Umang).
              </p>
            </div>
            <Link
              href="/child-development"
              className="px-5 py-3 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 text-xs font-extrabold shrink-0"
            >
              Wellbeing &amp; Safety Architecture →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl bg-white border-2 border-slate-200 p-6 space-y-2">
              <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-black">
                Tier 1 • Everyday Emotional Literacy
              </span>
              <h3 className="text-lg font-black text-slate-900 pt-1">Feelings Check-Ins &amp; Calm Breaths</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Lumi guides children through balloon breathing, visual emotion cards, and transition routines.
              </p>
            </div>
            <div className="rounded-3xl bg-white border-2 border-slate-200 p-6 space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
                Tier 2 • Parent &amp; Teacher Observations
              </span>
              <h3 className="text-lg font-black text-slate-900 pt-1">Non-Diagnostic Observation Logs</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Caregivers and teachers log context notes to share with qualified human specialists—zero automated DSM/ICD screening.
              </p>
            </div>
            <div className="rounded-3xl bg-rose-50/70 border-2 border-rose-300 p-6 space-y-2">
              <span className="px-3 py-1 rounded-full bg-rose-200 text-rose-950 text-xs font-black">
                Tier 3 • Crisis &amp; Caregiver-Harm Guardrail
              </span>
              <h3 className="text-lg font-black text-slate-900 pt-1">Spoken Reassurance &amp; 1121 Escalation</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Immediate spoken reassurance aloud, CPWB 1121 / Umang lifelines, and caregiver-alert suppression if domestic harm is disclosed.
              </p>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 11. AI LITERACY & RESPONSIBLE AI DETECTIVE                            */}
        {/* ===================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#E7E0D6]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700">
                Section 11 • AI Literacy &amp; Critical Thinking
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                Teach Children to Understand AI, Detect Mistakes &amp; Protect Privacy
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Children learn that AI is a pattern-predicting tool that can hallucinate false facts. Through the <strong>AI Detective</strong> studio, students practice verifying claims with books and teachers and keeping personal data private.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/ai-literacy"
                  className="px-5 py-3 rounded-2xl bg-slate-900 text-white text-xs font-extrabold"
                >
                  Explore AI Literacy Curriculum →
                </Link>
                <Link
                  href="/youth/creator?tool=ai_detective"
                  className="px-5 py-3 rounded-2xl bg-teal-50 border border-teal-300 text-teal-950 text-xs font-extrabold"
                >
                  Play AI Detective Cases
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-3xl bg-[#FAF7F2] border-2 border-slate-900 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-extrabold">
                  Mini AI Detective Challenge
                </span>
                <SearchCheck className="w-5 h-5 text-teal-700" />
              </div>
              <p className="text-sm font-bold text-slate-900 bg-white p-4 rounded-2xl border border-slate-200">
                Chatbot Claim: &ldquo;The Minar-e-Pakistan in Lahore is made of solid chocolate and melts every July.&rdquo;
              </p>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => setDetectiveAnswer("hallucination")}
                  className={`px-4 py-2.5 rounded-xl border-2 text-xs font-black ${
                    detectiveAnswer === "hallucination"
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-slate-800 border-slate-300"
                  }`}
                >
                  🕵️ Spot AI Hallucination (Check a Real Book!)
                </button>
                <button
                  type="button"
                  onClick={() => setDetectiveAnswer("fact")}
                  className={`px-4 py-2.5 rounded-xl border-2 text-xs font-black ${
                    detectiveAnswer === "fact"
                      ? "bg-amber-500 text-slate-950 border-amber-500"
                      : "bg-white text-slate-800 border-slate-300"
                  }`}
                >
                  Believe Without Checking
                </button>
              </div>
              {detectiveAnswer && (
                <p className="text-xs font-bold text-emerald-950 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  {detectiveAnswer === "hallucination"
                    ? "✓ Great Detective Work! AI can invent silly falsehoods. Always verify facts with trusted sources!"
                    : "💡 Detective Tip: Even confident computer text can be wrong! Let's check a real history book."}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 12 & 13. PARENT CENTER + TEACHER STUDIO & SCHOOL COMMAND              */}
        {/* ===================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section 12: Parent Center */}
          <div className="rounded-[32px] bg-white border-2 border-slate-900 p-7 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
                Section 12 • Parent &amp; Caregiver Center
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Full Visibility, Skills Passport &amp; Family Sharing Controls
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Parents review completed learning journeys, approve or lock portfolio sharing on the child&apos;s Skills &amp; Creations Passport, manage language preferences, and receive offline dinner-table conversation ideas.
              </p>
              <ul className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-800 pt-2">
                <li className="p-2.5 rounded-xl bg-emerald-50">✓ Educational Progress</li>
                <li className="p-2.5 rounded-xl bg-emerald-50">✓ Creations Portfolio</li>
                <li className="p-2.5 rounded-xl bg-emerald-50">✓ Visual Home Routines</li>
                <li className="p-2.5 rounded-xl bg-emerald-50">✓ Consent &amp; Sharing Gates</li>
              </ul>
            </div>
            <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
              <Link
                href="/parent"
                className="px-5 py-3 rounded-2xl bg-emerald-700 text-white text-xs font-extrabold"
              >
                Open Parent Dashboard →
              </Link>
              <Link
                href="/youth/passport"
                className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-900 text-xs font-extrabold"
              >
                Preview Skills Passport
              </Link>
            </div>
          </div>

          {/* Section 13: Teacher & School */}
          <div className="rounded-[32px] bg-white border-2 border-slate-900 p-7 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-700">
                Section 13 • Teacher Studio &amp; School Command
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Curriculum Alignment, Classroom Assignments &amp; School Pilots
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Teachers assign bilingual learning quests mapped to Punjab PCTB SLOs and CASEL competencies, while school leaders monitor cohort participation and safeguarding governance.
              </p>
              <ul className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-800 pt-2">
                <li className="p-2.5 rounded-xl bg-indigo-50">✓ 3,000+ Guided Questions</li>
                <li className="p-2.5 rounded-xl bg-indigo-50">✓ 1-Click Class Assignments</li>
                <li className="p-2.5 rounded-xl bg-indigo-50">✓ Cohort Analytics</li>
                <li className="p-2.5 rounded-xl bg-indigo-50">✓ 8-Week School Pilot Kit</li>
              </ul>
            </div>
            <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
              <Link
                href="/teacher/dashboard"
                className="px-5 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-extrabold"
              >
                Open Teacher Studio →
              </Link>
              <Link
                href="/school/portal"
                className="px-4 py-3 rounded-2xl bg-slate-100 text-slate-900 text-xs font-extrabold"
              >
                School Portal
              </Link>
              <Link
                href="/schools/pilot"
                className="px-4 py-3 rounded-2xl bg-amber-100 text-amber-950 text-xs font-extrabold"
              >
                Punjab School Pilot
              </Link>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 14. DEMO CENTER: SIX ROLE-BASED DEMOS                                 */}
        {/* ===================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#E7E0D6]">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
                  Section 14 • Interactive Evaluation Sandbox
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                  Six Role-Based Demos with Guided Tours
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  All demo environments use clearly marked fictional demonstration records to protect real student privacy.
                </p>
              </div>
              <Link
                href="/demos"
                className="px-6 py-3.5 rounded-2xl bg-slate-900 text-white text-xs font-extrabold shrink-0"
              >
                Launch Full Demo Center →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SIX_ROLE_DEMOS.map((demo) => (
                <div
                  key={demo.id}
                  className="rounded-3xl bg-[#FAF7F2] border-2 border-slate-200 hover:border-slate-900 p-6 flex flex-col justify-between transition"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-black border ${demo.accent}`}>
                        Demo {demo.number} • {demo.role}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-slate-400">Fictional Data</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mt-3">{demo.title}</h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{demo.summary}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-extrabold">
                    <Link href={demo.href} className="text-indigo-600 hover:underline">
                      Guided Tour →
                    </Link>
                    <Link href={demo.directHref} className="text-slate-700 hover:text-slate-900">
                      Direct View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 15. SAFETY, LOW-DATA PWA & MULTILINGUAL ACCESS                        */}
        {/* ===================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-600">
                Section 15 • Built for Real-World Connectivity &amp; Trust
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                Installable Offline PWA, Low-Data Resilience &amp; Human Oversight
              </h2>
            </div>
            <Link
              href="/access"
              className="px-5 py-3 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 text-xs font-extrabold"
            >
              Explore Access &amp; Safety Specs →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Smartphone,
                title: "Installable Android & iOS PWA",
                desc: "Works from the home screen with offline lesson caching and strict API cache exclusions for private data.",
              },
              {
                icon: WifiOff,
                title: "Low-Data & Offline Queue",
                desc: "Vector illustrations and lightweight JSON state sync gracefully over 3G or intermittent school Wi-Fi.",
              },
              {
                icon: Globe,
                title: "English, Urdu & Punjabi",
                desc: "Full Nastaliq/Gurmukhi typography and neural/browser voice synthesis across all four companions.",
              },
              {
                icon: Lock,
                title: "Private by Default & Zero Ad-Tech",
                desc: "Children's projects stay private until a parent explicitly approves sharing. Zero third-party ad trackers.",
              },
              {
                icon: ShieldCheck,
                title: "WCAG 2.1 AA+ & Sensory Modes",
                desc: "Reduced motion, low-stimulation surfaces, dyslexic spacing, and keyboard/screen-reader navigation.",
              },
              {
                icon: Users,
                title: "5-Stage Human Content Governance",
                desc: "Every curriculum module moves through Draft → Under Review → Approved → Published → Archived.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
                  <Icon className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-base font-black text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 16. FINAL CTA                                                         */}
        {/* ===================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto rounded-[40px] bg-[#0F172A] text-white p-8 sm:p-14 border-4 border-amber-400 shadow-2xl text-center space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
              Section 16 • Ready for Families, Classrooms &amp; School Pilots
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
              Start Exploring Weebly Today.
            </h2>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
              Experience the interactive 6-role demo, step into the child&apos;s Magic Home and AI Creator Academy, or request a school pilot briefing.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/demos"
                className="px-8 py-4 rounded-2xl bg-amber-400 text-slate-950 font-black text-sm sm:text-base hover:bg-amber-300 transition inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Try Weebly Interactive Demo</span>
              </Link>
              <Link
                href="/schools/pilot"
                className="px-7 py-4 rounded-2xl bg-white text-slate-950 font-black text-sm sm:text-base hover:bg-slate-100 transition inline-flex items-center gap-2"
              >
                <School className="w-5 h-5 text-indigo-600" />
                <span>Explore School Pilot</span>
              </Link>
              <Link
                href="/contact"
                className="px-7 py-4 rounded-2xl bg-slate-800 border border-slate-700 text-white font-bold text-sm sm:text-base hover:bg-slate-700 transition"
              >
                Contact Team
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
