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

const FOOTBALL_DRILLS = [
  {
    step: 1,
    title: "Drill 1: High Knees & Flamingo Balance Warm-Up",
    instruction: "Stand tall! Lift your right knee high to your hip for 5 seconds, then switch to your left leg like a gentle flamingo.",
    ur: "سیدھے کھڑے ہوں! اپنا دایاں گھٹنا اوپر اٹھائیں اور 5 سیکنڈ بیلنس بنائیں، پھر بایاں پاؤں اٹھائیں۔",
    pa: "سدھے کھلوو! پہلاں سجا گوڈا اتے چکو 5 سیکنڈ لئی، فیر کھبا گوڈا چکو۔",
    tip: "Keep your chest high and breathe slowly through your nose.",
    emoji: "🦩",
  },
  {
    step: 2,
    title: "Drill 2: The Inside Foot Pass Touch",
    instruction: "Place a soft ball or rolled socks in front of you. Tap it gently with the flat inside part of your sneaker.",
    ur: "ایک نرم گیند اپنے سامنے رکھیں۔ اپنے جوتے کے اندرونی حصے سے گیند کو پیار سے آگے بڑھائیں۔",
    pa: "اک نرم گیند اگے رکھو تے جوتی دے اندرلے پاسے نال ہولی جئی کِک مارو۔",
    tip: "Never kick with only your toes! The inside of your foot gives you super control.",
    emoji: "👟",
  },
  {
    step: 3,
    title: "Drill 3: Toe Taps & Little Dance",
    instruction: "Alternate tapping the top of the ball with the bottom of your right foot, then your left foot, like a light dance!",
    ur: "باری باری اپنے دائیں اور بائیں جوتے کے تلوے سے گیند کے اوپر ہلکا سا ہاتھ یا پاؤں چھوئیں جیسے رقص کر رہے ہوں۔",
    pa: "واری واری سجے تے کھبے پیر نال گیند نوں اتے توں چھوہو، جیویں ہلکا ناچ ہووے۔",
    tip: "Count 10 light taps together out loud!",
    emoji: "⚽",
  },
  {
    step: 4,
    title: "Drill 4: Sportsmanship & Team High Five",
    instruction: "Raise your hands, give your teammate or family member an imaginary high-five, and say 'Great game, friend!'",
    ur: "دونوں ہاتھ اٹھائیں، اپنے ساتھی کو ہائی فائیو دیں اور کہیں 'بہت زبردست کھیل، دوست!'",
    pa: "دونوں ہتھ اتے چکو، اپنے یار نوں تالی مارو تے آکھو 'شاباش دوست!'",
    tip: "True champions celebrate their friends and play with kind hearts.",
    emoji: "🤝",
  },
];

function MoveAndPlaySection({ onBack }: { onBack: () => void }) {
  const { locale } = useYouth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const activeDrill = FOOTBALL_DRILLS[currentStep];

  const handleSpeakDrill = () => {
    const text =
      locale === "ur"
        ? `${activeDrill.title}. ${activeDrill.ur}`
        : locale === "pa"
        ? `${activeDrill.title}. ${activeDrill.pa}`
        : `${activeDrill.title}. ${activeDrill.instruction} Coach Tip: ${activeDrill.tip}`;

    voiceSynthesizer.speak(text, {
      lang: locale === "ur" ? "ur-PK" : locale === "pa" ? "pa-PK" : "en-US",
    });
  };

  const handleNextDrill = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }
    if (currentStep < FOOTBALL_DRILLS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowCelebration(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>Back to Play Room</span>
        </button>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-black">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>Move &amp; Play: Sports Fundamentals</span>
        </div>
      </div>

      {/* Main Interactive Card */}
      <div className="rounded-[36px] bg-white border-2 border-emerald-200 p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs">
              <span>Drill {currentStep + 1} of {FOOTBALL_DRILLS.length}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {activeDrill.title}
            </h2>
          </div>

          <button
            onClick={handleSpeakDrill}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm active:scale-95 transition-all self-start sm:self-auto"
          >
            <Volume2 className="w-4 h-4" />
            <span>Hear Coach Instructions</span>
          </button>
        </div>

        {/* Drill Hero Display */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-8 text-center space-y-4">
          <div className="text-7xl sm:text-8xl animate-bounce">
            {activeDrill.emoji}
          </div>

          <p className="text-lg sm:text-xl font-extrabold text-slate-800 max-w-xl mx-auto leading-relaxed">
            {locale === "ur"
              ? activeDrill.ur
              : locale === "pa"
              ? activeDrill.pa
              : activeDrill.instruction}
          </p>

          <div className="p-4 rounded-2xl bg-white/80 border border-emerald-200 max-w-md mx-auto text-xs font-bold text-emerald-900 flex items-center justify-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Safety Tip: {activeDrill.tip}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-5 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-black text-sm disabled:opacity-40 hover:bg-slate-50 transition-all"
          >
            Previous Drill
          </button>

          <button
            onClick={handleNextDrill}
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm shadow-md hover:opacity-95 active:scale-95 transition-all"
          >
            <span>
              {currentStep === FOOTBALL_DRILLS.length - 1
                ? "Finish Football Mission!"
                : "I Did It! Next Drill"}
            </span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* Completion Modal */}
      {showCelebration && (
        <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto text-3xl">
            🏆
          </div>
          <h3 className="text-2xl sm:text-3xl font-black">
            Awesome Job, Sports Champion!
          </h3>
          <p className="text-sm sm:text-base font-medium max-w-md mx-auto text-emerald-50">
            You completed the Football Fundamentals drill with great balance, focus, and sportsmanship!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setCurrentStep(0);
                setShowCelebration(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs"
            >
              Play Drills Again
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl bg-white text-emerald-800 font-black text-xs shadow-md"
            >
              Back to Play Room
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
