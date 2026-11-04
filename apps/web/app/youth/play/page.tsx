"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Gamepad2,
  Palette,
  Heart,
  Calendar,
  Volume2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { ChildNavigationShell } from "@/components/youth/ChildNavigationShell";
import { useYouth } from "@/components/youth/YouthContext";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";

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
    id: "stories",
    title: {
      en: "Stories",
      ur: "پیاری کہانیاں",
      pa: "سوہنیاں کہانیاں",
    },
    description: {
      en: "Magical fairy tales and soothing bedtime stories narrated aloud.",
      ur: "نیند کی پرسکون کہانیاں اور سبق آموز داستانیں سنیں۔",
      pa: "سون لئی مٹھی مٹھی کہانیاں تے سوہنے قصے سنو۔",
    },
    emoji: "📖",
    href: "/youth/stories",
    tag: "Bedtime & Moral Stories",
    gradient: "from-pink-500 to-rose-500",
    badgeBg: "bg-pink-100 text-pink-800",
  },
  {
    id: "games",
    title: {
      en: "Games & Quizzes",
      ur: "کھیل اور کوئز",
      pa: "کھیڈاں تے سوال",
    },
    description: {
      en: "Fun puzzles, math missions, and science curiosity challenges.",
      ur: "ریاضی، سائنس اور دماغی صلاحیت بڑھانے والے دلچسپ کھیل۔",
      pa: "حساب، سائنس تے دماغی پہیلیاں دے مزیدار کھیل۔",
    },
    emoji: "🎮",
    href: "/youth/activities",
    tag: "Curriculum & Puzzles",
    gradient: "from-amber-500 to-orange-500",
    badgeBg: "bg-amber-100 text-amber-800",
  },
  {
    id: "draw",
    title: {
      en: "Draw & Create",
      ur: "ڈرائنگ اور تخلیق",
      pa: "تصویراں تے ڈرائنگ",
    },
    description: {
      en: "Express your ideas with colorful drawing, visual cards, and communication tools.",
      ur: "رنگوں کے ساتھ تصویریں بنائیں اور اپنے خیالات کا اظہار کریں۔",
      pa: "سوچاں نوں رنگاں نال سجاؤ تے تصویراں بناؤ۔",
    },
    emoji: "🎨",
    href: "/youth/visual-supports",
    tag: "Visual Tools & AAC",
    gradient: "from-purple-500 to-indigo-500",
    badgeBg: "bg-purple-100 text-purple-800",
  },
  {
    id: "calm",
    title: {
      en: "Calm Corner",
      ur: "پرسکون کونا",
      pa: "سکون دا ویلا",
    },
    description: {
      en: "Gentle bunny breaths, soothing sounds, and naming your feelings.",
      ur: "نرم سانسیں لیں اور اپنے دل کے احساسات کو پہچانیں۔",
      pa: "ہولے ساہ لوو، سکون پاؤ تے دل دا حال دسو۔",
    },
    emoji: "🌸",
    href: "/youth/emotions",
    tag: "Belly Breaths & Feelings",
    gradient: "from-emerald-500 to-teal-500",
    badgeBg: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "day",
    title: {
      en: "My Day",
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
    gradient: "from-sky-500 to-blue-500",
    badgeBg: "bg-sky-100 text-sky-800",
  },
];

export default function PlayHubPage() {
  const { locale } = useYouth();

  const handleSpeakTile = (tile: PlayTile, e: React.MouseEvent) => {
    e.stopPropagation();
    const titleText = tile.title[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"];
    const descText = tile.description[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"];
    const text = `${titleText}! ${descText}`;
    voiceSynthesizer.speak(text, {
      lang: locale === "ur" ? "ur-PK" : locale === "pa" ? "pa-PK" : "en-US",
    });
  };

  return (
    <ChildNavigationShell activeTab="play">
      <div className="space-y-8 animate-fade-in">
        {/* Header Hero */}
        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-xs font-black text-amber-900 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Weebly Play Room</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            What would you like to play?
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto font-medium">
            Tap any big card below to start playing, reading, or relaxing!
          </p>
        </div>

        {/* Big Illustrated Tiles Grid */}
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
