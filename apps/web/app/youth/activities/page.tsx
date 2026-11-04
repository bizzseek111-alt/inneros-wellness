"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Calculator,
  Compass,
  Sparkles,
  Check,
  Heart,
  Sun,
  Cloud,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Volume2,
  CheckCircle2,
  Cpu,
  Award,
} from "lucide-react";
import { ChildNavigationShell } from "@/components/youth/ChildNavigationShell";
import { useYouth } from "@/components/youth/YouthContext";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";

interface MathQuestion {
  id: string;
  title: string;
  prompt: { en: string; ur: string; pa: string };
  visual: string;
  options: { label: string; value: number }[];
  correctValue: number;
  explanation: { en: string; ur: string; pa: string };
}

const MATH_QUESTIONS: MathQuestion[] = [
  {
    id: "math-mango-division",
    title: "The Mango Sharing Feast",
    prompt: {
      en: "Kai has 12 delicious Chaunsa mangoes. He wants to share them equally among 3 friends: Pip, Zara, and Leo. How many mangoes does each friend get?",
      ur: "کائی کے پاس 12 میٹھے چونسہ آم ہیں۔ وہ اپنے 3 دوستوں (پپ، زارا اور لیو) میں برابر تقسیم کرنا چاہتا ہے۔ ہر دوست کو کتنے آم ملیں گے؟",
      pa: "کائی کول 12 مٹھے امب نے۔ اوہ اپنے 3 بیلاں (پپ، زارا تے لیو) وچ برابر ونڈنا چاہندا اے۔ ہر اک نوں کنے امب ملن گے؟",
    },
    visual: "🥭 🥭 🥭 🥭 🥭 🥭 🥭 🥭 🥭 🥭 🥭 🥭",
    options: [
      { label: "3 mangoes", value: 3 },
      { label: "4 mangoes", value: 4 },
      { label: "6 mangoes", value: 6 },
    ],
    correctValue: 4,
    explanation: {
      en: "Correct! 12 divided by 3 is 4. Each friend receives exactly 4 sweet mangoes!",
      ur: "بالکل درست! 12 کو 3 سے تقسیم کریں تو جواب 4 آتا ہے۔ ہر دوست کو 4 میٹھے آم ملیں گے!",
      pa: "شاباش! 12 نوں 3 نال ونڈو تاں 4 آندا اے۔ سارے بیلاں نوں 4 امب ملن گے!",
    },
  },
  {
    id: "math-star-addition",
    title: "Counting the Night Sky Stars",
    prompt: {
      en: "Mia spotted 5 bright stars on the left and 4 twinkling stars on the right. How many stars did she count in all?",
      ur: "میا نے آسمان پر بائیں طرف 5 روشن ستارے اور دائیں طرف 4 ستارے دیکھے۔ اس نے کل کتنے ستارے گنے؟",
      pa: "میا نے اسمان تے کھبے پاسے 5 ستارے تے سجے پاسے 4 ستارے ویکھے۔ کل کنے ستارے ہوئے؟",
    },
    visual: "⭐ ⭐ ⭐ ⭐ ⭐  +  ⭐ ⭐ ⭐ ⭐",
    options: [
      { label: "8 stars", value: 8 },
      { label: "9 stars", value: 9 },
      { label: "10 stars", value: 10 },
    ],
    correctValue: 9,
    explanation: {
      en: "Brilliant! 5 plus 4 equals 9. The night sky is glowing bright!",
      ur: "شاباش! 5 اور 4 مل کر 9 بنتے ہیں۔ رات کا آسمان جگمگا رہا ہے!",
      pa: "بہت ودھیا! 5 تے 4 مل کے 9 بن دے نے۔ اسمان چمک رہیا اے!",
    },
  },
];

function ActivitiesContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get("category");
  const topicParam = searchParams?.get("topic");
  const { locale } = useYouth();

  const [activeTab, setActiveTab] = useState<"math" | "focus" | "tech">(
    categoryParam === "mathematics"
      ? "math"
      : categoryParam === "science" || topicParam === "how-computers-work"
      ? "tech"
      : "math"
  );

  useEffect(() => {
    if (categoryParam === "mathematics") {
      setActiveTab("math");
    } else if (categoryParam === "science" || topicParam === "how-computers-work") {
      setActiveTab("tech");
    }
  }, [categoryParam, topicParam]);

  // Math State
  const [currentMathIndex, setCurrentMathIndex] = useState(0);
  const [selectedMathAnswer, setSelectedMathAnswer] = useState<number | null>(null);
  const [mathFeedback, setMathFeedback] = useState<string | null>(null);
  const currentQ = MATH_QUESTIONS[currentMathIndex];

  // Focus Mindful State (Preserved)
  const shapes = ["⭐ Star", "🌸 Flower", "🌙 Moon", "🍃 Leaf"];
  const [targetShape, setTargetShape] = useState("⭐ Star");
  const [focusFeedback, setFocusFeedback] = useState<string | null>(null);
  const [gratitudes, setGratitudes] = useState<string[]>([
    "My warm morning blanket",
    "Listening to rain outside",
    "Sharing an apple with my friend",
  ]);
  const [newGratitude, setNewGratitude] = useState("");

  const handleSpeakMath = () => {
    const text =
      locale === "ur"
        ? `${currentQ.title}. ${currentQ.prompt.ur}`
        : locale === "pa"
        ? `${currentQ.title}. ${currentQ.prompt.pa}`
        : `${currentQ.title}. ${currentQ.prompt.en}`;

    voiceSynthesizer.speak(text, {
      lang: locale === "ur" ? "ur-PK" : locale === "pa" ? "pa-PK" : "en-US",
    });
  };

  const handleSelectMath = (val: number) => {
    setSelectedMathAnswer(val);
    if (val === currentQ.correctValue) {
      const exp =
        locale === "ur"
          ? currentQ.explanation.ur
          : locale === "pa"
          ? currentQ.explanation.pa
          : currentQ.explanation.en;
      setMathFeedback(exp);
      voiceSynthesizer.speak(exp, {
        lang: locale === "ur" ? "ur-PK" : locale === "pa" ? "pa-PK" : "en-US",
      });
    } else {
      const retryText =
        locale === "ur"
          ? "بہت قریب! آئیے دوبارہ آموں کو برابر تقسیم کر کے دیکھتے ہیں۔"
          : locale === "pa"
          ? "نیڑے ای او! دوبارہ امباں نوں برابر ونڈ کے ویکھو۔"
          : "Almost! Let's count the items together and try one more time.";
      setMathFeedback(retryText);
      voiceSynthesizer.speak(retryText, {
        lang: locale === "ur" ? "ur-PK" : locale === "pa" ? "pa-PK" : "en-US",
      });
    }
  };

  const handleNextMath = () => {
    setSelectedMathAnswer(null);
    setMathFeedback(null);
    setCurrentMathIndex((prev) => (prev + 1) % MATH_QUESTIONS.length);
  };

  const handleShapeSelect = (s: string) => {
    if (s === targetShape) {
      setFocusFeedback("Wonderful! You noticed the matching shape with great focus.");
      setTimeout(() => {
        const next = shapes[Math.floor(Math.random() * shapes.length)];
        setTargetShape(next);
        setFocusFeedback(null);
      }, 1500);
    } else {
      setFocusFeedback("Almost! Take a slow breath and look at the shapes again.");
    }
  };

  const handleAddGratitude = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGratitude.trim()) {
      setGratitudes([...gratitudes, newGratitude.trim()]);
      setNewGratitude("");
    }
  };

  return (
    <ChildNavigationShell activeTab="play">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-xs font-black text-amber-900 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Weebly Learning Activities &amp; Quests</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            Play, Learn &amp; Discover
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Step-by-step guided math missions, computer science wonders, and mindful calming focus.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center justify-center p-1.5 rounded-2xl bg-slate-200 max-w-md mx-auto shadow-inner">
          <button
            onClick={() => setActiveTab("math")}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 ${
              activeTab === "math"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Calculator className="w-4 h-4 text-amber-600" />
            <span>Math Quest</span>
          </button>

          <button
            onClick={() => setActiveTab("tech")}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 ${
              activeTab === "tech"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Cpu className="w-4 h-4 text-sky-600" />
            <span>Tech &amp; Science</span>
          </button>

          <button
            onClick={() => setActiveTab("focus")}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 ${
              activeTab === "focus"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Focus &amp; Calm</span>
          </button>
        </div>

        {/* TAB 1: MATHEMATICS QUEST (Addresses Issue 3) */}
        {activeTab === "math" && (
          <div className="rounded-[36px] bg-white border-2 border-amber-200 p-6 sm:p-10 shadow-sm space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                  Khanmigo-Inspired Guided Reasoning &bull; Question {currentMathIndex + 1} of {MATH_QUESTIONS.length}
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">
                  {currentQ.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={handleSpeakMath}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-xs transition-all active:scale-95 self-start sm:self-auto"
              >
                <Volume2 className="w-4 h-4" />
                <span>Hear Kai Read Problem</span>
              </button>
            </div>

            {/* Visual Problem Representation */}
            <div className="p-6 rounded-3xl bg-amber-50/60 border border-amber-100 text-center space-y-3">
              <div className="text-3xl sm:text-4xl tracking-widest py-2">
                {currentQ.visual}
              </div>
              <p className="text-base sm:text-lg font-bold text-slate-800 max-w-xl mx-auto leading-relaxed">
                {locale === "ur"
                  ? currentQ.prompt.ur
                  : locale === "pa"
                  ? currentQ.prompt.pa
                  : currentQ.prompt.en}
              </p>
            </div>

            {/* Answer Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {currentQ.options.map((opt) => {
                const isSelected = selectedMathAnswer === opt.value;
                const isCorrect = isSelected && opt.value === currentQ.correctValue;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectMath(opt.value)}
                    className={`p-5 rounded-2xl border-2 font-black text-base transition-all cursor-pointer ${
                      isSelected
                        ? isCorrect
                          ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm scale-102"
                          : "bg-rose-50 border-rose-400 text-rose-900 shadow-sm"
                        : "bg-white border-slate-200 hover:border-amber-400 text-slate-800 hover:bg-amber-50/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Next Button */}
            {mathFeedback && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-sm flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{mathFeedback}</span>
                </div>

                {selectedMathAnswer === currentQ.correctValue && (
                  <button
                    type="button"
                    onClick={handleNextMath}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition-all flex items-center space-x-1.5"
                  >
                    <span>Next Math Quest</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TECH & SCIENCE (Computational Thinking) */}
        {activeTab === "tech" && (
          <div className="rounded-[36px] bg-white border-2 border-sky-200 p-6 sm:p-10 shadow-sm space-y-6 animate-fade-in">
            <div className="space-y-1 border-b border-slate-100 pb-4">
              <span className="text-[11px] font-black uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full">
                MIT Day of AI &bull; Computational Thinking
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                How Do Computers Think? What is an Algorithm?
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                A computer follows clear, numbered steps called an algorithm—just like a recipe for baking cookies!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  step: 1,
                  title: "Step 1: Input",
                  desc: "You give the computer information, like pressing a button or speaking into the microphone.",
                  icon: "🎤",
                },
                {
                  step: 2,
                  title: "Step 2: Process",
                  desc: "The computer checks its instructions and matches the pattern to decide what to do.",
                  icon: "🧠",
                },
                {
                  step: 3,
                  title: "Step 3: Output",
                  desc: "The computer shows a drawing, plays a fun cartoon, or speaks friendly words back to you!",
                  icon: "✨",
                },
              ].map((item) => (
                <div key={item.step} className="p-5 rounded-2xl bg-sky-50/50 border border-sky-200 space-y-2 text-center">
                  <div className="text-4xl">{item.icon}</div>
                  <h3 className="font-black text-base text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <Link
                href="/youth/stories?story=space-voyage"
                className="inline-flex items-center space-x-2 text-sky-700 font-black text-xs hover:underline"
              >
                <span>Read the real science story: Voyage to the Rings of Saturn</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        )}

        {/* TAB 3: FOCUS & MINDFUL (Preserved Original Activities) */}
        {activeTab === "focus" && (
          <div className="space-y-6 animate-fade-in">
            {/* Pattern Focus */}
            <div className="p-8 rounded-[32px] bg-white border border-slate-200 shadow-sm space-y-6 text-center">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0E87E3]">
                  Calm Attention
                </span>
                <h3 className="text-xl font-extrabold text-[#0F172A]">
                  Find the Matching Symbol
                </h3>
                <p className="text-xs text-slate-500">
                  There is no timer or score. Take all the time you need.
                </p>
              </div>

              <div className="py-6 flex justify-center">
                <div className="px-8 py-5 rounded-3xl bg-[#F0F8FF] border-2 border-[#B9E2FE] text-3xl font-extrabold text-[#0C436F] shadow-sm animate-pulse">
                  {targetShape}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
                {shapes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleShapeSelect(s)}
                    className="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-[#0E87E3] font-bold text-sm hover:scale-103 transition-all cursor-pointer shadow-2xs"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {focusFeedback && (
                <p className="text-xs font-bold text-[#0E87E3] animate-fade-in">
                  {focusFeedback}
                </p>
              )}
            </div>

            {/* Gratitude Garden */}
            <div className="p-8 rounded-[32px] bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-[#0F172A] flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <span>Gratitude Garden</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Write or think of one small kind thing that happened today.
                </p>
              </div>

              <form onSubmit={handleAddGratitude} className="flex gap-2">
                <input
                  type="text"
                  value={newGratitude}
                  onChange={(e) => setNewGratitude(e.target.value)}
                  placeholder="e.g. My mom's warm hug..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-pink-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-xs"
                >
                  Plant Thought
                </button>
              </form>

              <div className="flex flex-wrap gap-2 pt-2">
                {gratitudes.map((g, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-full bg-pink-50 text-pink-800 border border-pink-200 text-xs font-medium"
                  >
                    🌸 {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ChildNavigationShell>
  );
}

export default function CognitiveActivitiesPage() {
  return (
    <Suspense
      fallback={
        <ChildNavigationShell activeTab="play">
          <div className="min-h-[50vh] flex items-center justify-center text-slate-500 font-bold">
            Loading Weebly Activities...
          </div>
        </ChildNavigationShell>
      }
    >
      <ActivitiesContent />
    </Suspense>
  );
}
