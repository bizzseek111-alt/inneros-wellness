"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Gamepad2,
  Palette,
  Heart,
  Calendar,
  Volume2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Activity,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  Award,
} from "lucide-react";
import { ChildNavigationShell } from "@/components/youth/ChildNavigationShell";
import { useYouth } from "@/components/youth/YouthContext";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";
import { CreativeStudioCanvas } from "@/components/youth/CreativeStudioCanvas";
import { MoveAndPlaySection } from "@/components/youth/MoveAndPlaySection";

interface PlayTile {
  id: string;
  title: {
    en: string;
    ur: string;
    pa: string;
  };
  description: {
    en: string;
    ur: string;
    pa: string;
  };
  emoji: string;
  href: string;
  tag: string;
  gradient: string;
  badgeBg: string;
}

const PLAY_TILES: PlayTile[] = [
  {
    id: "creative-studio",
    title: {
      en: "Creative Studio",
      ur: "تخلیقی اسٹوڈیو",
      pa: "تخلیقی سٹوڈیو",
    },
    description: {
      en: "Guided drawing, dino sketchpads, and colorful painting challenges with Mia.",
      ur: "میا کے ساتھ ہاتھ سے ڈرائنگ اور خوبصورت رنگین تصویریں بنائیں۔",
      pa: "میا نال مل کے سوہنیاں تصویراں تے رنگ برنگے خاکے بناؤ۔",
    },
    emoji: "🎨",
    href: "/youth/creative-studio",
    tag: "Guided Drawing Canvas",
    gradient: "from-pink-500 via-rose-500 to-amber-500",
    badgeBg: "bg-pink-100 text-pink-800",
  },
  {
    id: "move-play",
    title: {
      en: "Move & Play",
      ur: "کھیل کود اور حرکت",
      pa: "کھیڈ کود تے دوڑاں",
    },
    description: {
      en: "Football fundamentals, coordination games, and joyful outdoor movement drills.",
      ur: "فٹ بال کے بنیادی اصول، توازن اور صحت مند جسمانی مشقیں۔",
      pa: "فٹ بال دے گُر، جسمانی توازن تے طاقت دیاں کھیڈاں۔",
    },
    emoji: "⚽",
    href: "/youth/play?world=move-play&activity=football-fundamentals",
    tag: "Sports Drills & Balance",
    gradient: "from-emerald-500 via-teal-500 to-sky-500",
    badgeBg: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "stories",
    title: {
      en: "Stories & Cartoons",
      ur: "کہانیاں اور کارٹون",
      pa: "کہانیاں تے کارٹون",
    },
    description: {
      en: "Interactive moral cartoons, soothing bedtime fables, and cultural tales.",
      ur: "سبق آموز کارٹون، نیند کی پرسکون کہانیاں اور دلچسپ داستانیں۔",
      pa: "سبق آموز کارٹون تے سون ویلے دیاں مٹھیاں کہانیاں۔",
    },
    emoji: "📖",
    href: "/youth/stories?cartoon=true",
    tag: "Bedtime & Interactive Cartoon",
    gradient: "from-purple-500 via-indigo-500 to-blue-500",
    badgeBg: "bg-purple-100 text-purple-800",
  },
  {
    id: "games",
    title: {
      en: "Brain Quest Puzzles",
      ur: "دماغی پہیلیاں",
      pa: "دماغی بجھارتاں",
    },
    description: {
      en: "Fun math missions, science curiosity challenges, and logic games with Kai & Zayn.",
      ur: "ریاضی، سائنس اور دماغی صلاحیت بڑھانے والے دلچسپ کھیل۔",
      pa: "حساب، سائنس تے سوچ سمجھ والے مزیدار چیلنج۔",
    },
    emoji: "🎮",
    href: "/youth/activities",
    tag: "Curriculum & Puzzles",
    gradient: "from-amber-500 to-orange-500",
    badgeBg: "bg-amber-100 text-amber-800",
  },
  {
    id: "calm",
    title: {
      en: "Calm & Life Skills",
      ur: "پرسکون کونا اور مشن",
      pa: "سکون دا ویلا تے مشن",
    },
    description: {
      en: "Gentle bunny breaths, feelings check-ins, and UNICEF FunDoo life missions.",
      ur: "نرم سانسیں لیں اور اپنے دل کے احساسات کو پہچانیں۔",
      pa: "ہولے ساہ لوو، سکون پاؤ تے نیکی دے مشن کرو۔",
    },
    emoji: "🌸",
    href: "/youth/emotions?world=life-friendship",
    tag: "Belly Breaths & Missions",
    gradient: "from-sky-500 to-indigo-500",
    badgeBg: "bg-sky-100 text-sky-800",
  },
  {
    id: "day",
    title: {
      en: "My Day Schedule",
      ur: "میرا دن",
      pa: "میرا اج دا دن",
    },
    description: {
      en: "Visual cards showing your daily schedule, habits, and what comes next.",
      ur: "تصویروں کی مدد سے دیکھیں کہ آج آپ نے آگے کیا کرنا ہے۔",
      pa: "تصویراں نال ویکھو اج تہاڈے اگلے کم کیہڑے نے۔",
    },
    emoji: "📅",
    href: "/youth/routines",
    tag: "Visual Schedule & Habits",
    gradient: "from-blue-600 to-cyan-600",
    badgeBg: "bg-cyan-100 text-cyan-800",
  },
];


function PlayHubContent({
  initialWorld,
  initialActivity,
}: {
  initialWorld?: string;
  initialActivity?: string;
}) {
  const searchParams = useSearchParams();
  const world = searchParams?.get("world") || initialWorld;
  const activity = searchParams?.get("activity") || initialActivity;
  const { locale } = useYouth();

  const [activeWorldOverride, setActiveWorldOverride] = useState<string | null>(null);

  const effectiveWorld = activeWorldOverride || world;

  const handleSpeakTile = (tile: PlayTile, e: React.MouseEvent) => {
    e.stopPropagation();
    const titleText = tile.title[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"];
    const descText = tile.description[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"];
    const text = `${titleText}! ${descText}`;
    voiceSynthesizer.speak(text, {
      lang: locale === "ur" ? "ur-PK" : locale === "pa" ? "pa-PK" : "en-US",
    });
  };

  if (effectiveWorld === "creative-studio") {
    return (
      <ChildNavigationShell activeTab="play">
        <div className="space-y-6">
          <CreativeStudioCanvas
            initialActivity={activity || "draw-dinosaur"}
            onComplete={() => setActiveWorldOverride(null)}
          />
        </div>
      </ChildNavigationShell>
    );
  }

  if (effectiveWorld === "move-play") {
    return (
      <ChildNavigationShell activeTab="play">
        <MoveAndPlaySection onBack={() => setActiveWorldOverride(null)} />
      </ChildNavigationShell>
    );
  }

  return (
    <ChildNavigationShell activeTab="play">
      <div className="space-y-8 animate-fade-in">
        {/* Header Hero */}
        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-xs font-black text-amber-900 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Weebly Global Play Worlds</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            What would you like to explore today?
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto font-medium">
            Choose a world below to start drawing, moving, listening, or solving puzzles!
          </p>
        </div>

        {/* V10 Unified 4-Pillar Quick Launch Strip (Learn, Create, Think, Grow) */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <Link
            href="/youth/journeys"
            className="rounded-3xl border-2 border-teal-200 bg-teal-50/80 hover:bg-teal-100/80 p-4 flex flex-col justify-between transition shadow-2xs"
          >
            <div>
              <span className="inline-block rounded-full bg-teal-200/80 px-2.5 py-0.5 text-[10px] font-black uppercase text-teal-950">
                1 · Learn with AI
              </span>
              <h2 className="mt-2 text-base font-black text-slate-900">🧭 5-Stage Journeys</h2>
              <p className="mt-1 text-xs font-semibold text-slate-600">
                Watch → Learn → Play → Implement → Reflect
              </p>
            </div>
            <span className="mt-3 text-xs font-extrabold text-teal-800">Open Journeys →</span>
          </Link>

          <Link
            href="/youth/creator"
            className="rounded-3xl border-2 border-amber-200 bg-amber-50/80 hover:bg-amber-100/80 p-4 flex flex-col justify-between transition shadow-2xs"
          >
            <div>
              <span className="inline-block rounded-full bg-amber-200/80 px-2.5 py-0.5 text-[10px] font-black uppercase text-amber-950">
                2 · Create with AI
              </span>
              <h2 className="mt-2 text-base font-black text-slate-900">🚀 AI Creator Academy</h2>
              <p className="mt-1 text-xs font-semibold text-slate-600">
                Story Maker, Block Game Maker &amp; Cartoon Studio
              </p>
            </div>
            <span className="mt-3 text-xs font-extrabold text-amber-900">Create Now →</span>
          </Link>

          <Link
            href="/youth/skills-lab"
            className="rounded-3xl border-2 border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100/80 p-4 flex flex-col justify-between transition shadow-2xs"
          >
            <div>
              <span className="inline-block rounded-full bg-indigo-200/80 px-2.5 py-0.5 text-[10px] font-black uppercase text-indigo-950">
                3 · Foundational Skills
              </span>
              <h2 className="mt-2 text-base font-black text-slate-900">🧠 Skills Lab (10 Games)</h2>
              <p className="mt-1 text-xs font-semibold text-slate-600">
                Attention, memory, sequencing &amp; strategy
              </p>
            </div>
            <span className="mt-3 text-xs font-extrabold text-indigo-900">Practice Skills →</span>
          </Link>

          <Link
            href="/youth/passport"
            className="rounded-3xl border-2 border-rose-200 bg-rose-50/80 hover:bg-rose-100/80 p-4 flex flex-col justify-between transition shadow-2xs"
          >
            <div>
              <span className="inline-block rounded-full bg-rose-200/80 px-2.5 py-0.5 text-[10px] font-black uppercase text-rose-950">
                4 · Grow with Support
              </span>
              <h2 className="mt-2 text-base font-black text-slate-900">🏅 Skills Passport</h2>
              <p className="mt-1 text-xs font-semibold text-slate-600">
                Your private portfolio, badges &amp; creations
              </p>
            </div>
            <span className="mt-3 text-xs font-extrabold text-rose-900">View Passport →</span>
          </Link>
        </div>

        {/* Big Illustrated Tiles Grid (Six Connected Worlds) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {PLAY_TILES.map((tile) => {
            const title = tile.title[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"];
            const desc = tile.description[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"];

            return (
              <div
                key={tile.id}
                className="relative rounded-[36px] bg-white border-2 border-slate-200 hover:border-amber-400 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                {/* Card Top: Tag + Spoken Audio Button */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${tile.badgeBg}`}>
                    {tile.tag}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleSpeakTile(tile, e)}
                    className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs transition-transform active:scale-95"
                    title={`Hear what ${title} is`}
                    aria-label={`Listen to description of ${title}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Center: Giant Emoji & Title */}
                <div className="flex flex-col items-center text-center py-6 space-y-3">
                  <span className="text-6xl sm:text-7xl block group-hover:scale-115 transition-transform duration-300">
                    {tile.emoji}
                  </span>

                  <h2 className="text-2xl font-black text-[#0F172A]">
                    {title}
                  </h2>

                  <p
                    className={`text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold max-w-xs ${
                      locale === "ur" || locale === "pa" ? "font-serif text-base" : ""
                    }`}
                  >
                    {desc}
                  </p>
                </div>

                {/* Big Action Link */}
                <Link
                  href={tile.href}
                  className={`w-full py-4 rounded-2xl text-white font-black text-sm flex items-center justify-center space-x-2 shadow-md hover:opacity-95 active:scale-98 transition-all bg-gradient-to-r ${tile.gradient}`}
                >
                  <span>Open {title}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </ChildNavigationShell>
  );
}

export default function PlayHubPage({
  searchParams,
}: {
  searchParams?: { world?: string; activity?: string };
}) {
  const initialWorld = searchParams?.world;
  const initialActivity = searchParams?.activity;

  return (
    <Suspense
      fallback={
        <ChildNavigationShell activeTab="play">
          {initialWorld === "creative-studio" ? (
            <div className="space-y-6">
              <CreativeStudioCanvas initialActivity={initialActivity || "draw-dinosaur"} />
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in text-center pt-8">
              <h1 className="text-3xl font-black text-slate-900">Weebly Global Play Worlds</h1>
              <p className="text-sm text-slate-600">Loading creative studio canvas &amp; play worlds...</p>
            </div>
          )}
        </ChildNavigationShell>
      }
    >
      <PlayHubContent initialWorld={initialWorld} initialActivity={initialActivity} />
    </Suspense>
  );
}
