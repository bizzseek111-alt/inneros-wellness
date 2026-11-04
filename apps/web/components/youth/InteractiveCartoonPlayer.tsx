"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Heart,
  Smile,
  Shield,
  HelpCircle,
} from "lucide-react";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";
import { useYouth } from "./YouthContext";

interface CartoonScene {
  id: number;
  title: string;
  illustrationEmoji: string;
  sceneNarration: {
    en: string;
    ur: string;
    pa: string;
  };
  pauseQuestion?: {
    en: string;
    ur: string;
    pa: string;
  };
  choices?: {
    id: string;
    text: { en: string; ur: string; pa: string };
    icon: string;
    consequence: { en: string; ur: string; pa: string };
    isPositive: boolean;
  }[];
}

const CARTOON_STORY: CartoonScene[] = [
  {
    id: 1,
    title: "Scene 1: Sunny Meadow Playground",
    illustrationEmoji: "⚽ 🏫 🌳",
    sceneNarration: {
      en: "It is recess time at the Sunny Meadow school. Zara and Leo are kicking a checkered soccer ball back and forth, laughing and running across the grass.",
      ur: "سنی میڈو اسکول میں آدھی چھٹی کا وقت ہے۔ زارا اور لیو میدان میں فٹ بال کھیل رہے ہیں اور ہنس رہے ہیں۔",
      pa: "سکول وچ چھٹی دا ویلا اے۔ زارا تے لیو گراؤنڈ وچ فٹ بال نال کھیڈ رہے نے تے ہنس رہے نے۔",
    },
  },
  {
    id: 2,
    title: "Scene 2: Pip Sits Alone by the Bench",
    illustrationEmoji: "🐧 🪑 🥺",
    sceneNarration: {
      en: "Over near the wooden bench, Pip is sitting all alone, hugging their school bag and watching the game quietly. Nobody has invited Pip to kick the ball yet.",
      ur: "لکڑی کے بینچ کے قریب، پپ اکیلا بیٹھا اپنا بستہ پکڑے خاموشی سے کھیل دیکھ رہا ہے۔ کسی نے پپ کو کھیلنے کے لیے نہیں بلایا۔",
      pa: "بینچ کول پپ اکلا بیٹھا چپ چاپ کھیڈ ویکھ ریا اے۔ کسے نے وی اوہنوں کھیڈن لئی نئیں بلایا۔",
    },
    pauseQuestion: {
      en: "Pause point! What could our character Zara do to help Pip feel included?",
      ur: "سوچنے کا وقت! زارا ایسا کیا کر سکتی ہے جس سے پپ خود کو تنہا محسوس نہ کرے؟",
      pa: "سوچن دا ویلا! زارا کیہڑا چنگا کم کرے تاں جے پپ اکیلا محسوس نہ کرے؟",
    },
    choices: [
      {
        id: "choice-invite",
        icon: "🤝",
        text: {
          en: "Wave and invite Pip: 'Hey Pip! Come be on my team!'",
          ur: "ہاتھ ہلا کر پپ کو بلائیں: 'آؤ پپ، میری ٹیم میں شامل ہو جاؤ!'",
          pa: "ہتھ ہلا کے بلاؤ: 'پپ، آؤ ساڈی ٹیم وچ کھیڈو!'",
        },
        consequence: {
          en: "Pip's eyes light up! Warmly welcoming someone makes them feel valued, safe, and happy to belong.",
          ur: "پپ کے چہرے پر خوشی کی چمک آ جاتی ہے! کسی کو محبت سے کھیل میں شامل کرنا اسے سکون دیتا ہے۔",
          pa: "پپ خوش ہو جاندا اے! کسے نوں پیار نال کھیڈ وچ شامل کرنا بڑی سوہنی گل اے۔",
        },
        isPositive: true,
      },
      {
        id: "choice-share",
        icon: "📖",
        text: {
          en: "Walk over, sit beside Pip, and share a picture book together.",
          ur: "پپ کے پاس جائیں، بینچ پر بیٹھیں اور مل کر تصویروں والی کتاب دیکھیں۔",
          pa: "پپ کول جا کے بینچ تے بہو تے رل کے کتاب ویکھو۔",
        },
        consequence: {
          en: "Pip smiles gently. Sometimes a quiet friend prefers gentle conversation instead of fast-paced running.",
          ur: "پپ مسکراتا ہے۔ کبھی کبھی پرسکون بچے دوڑنے کے بجائے بیٹھ کر بات کرنا پسند کرتے ہیں۔",
          pa: "پپ ہولے جئے مسکرایا۔ کجھ بچے بھجن دی بجائے آرام نال بہہ کے گلاں کرنا پسند کردے نے۔",
        },
        isPositive: true,
      },
      {
        id: "choice-coach",
        icon: "🧑‍🏫",
        text: {
          en: "Tell Coach Maya: 'Pip is sitting alone, can we organize a big team circle?'",
          ur: "کوچ مایا سے کہیں: 'پپ اکیلا ہے، کیا ہم سب مل کر ایک بڑا سرکل بنا سکتے ہیں؟'",
          pa: "استاد نوں دسو: 'پپ اکلا اے، کی اسیں سارے رل کے کھیڈ سکدے آں؟'",
        },
        consequence: {
          en: "Great thinking! Asking a trusted teacher helps make sure the whole playground plays fairly together.",
          ur: "بہترین فیصلہ! استاد کی مدد لینے سے سب بچے مل جل کر کھیلنا سیکھتے ہیں۔",
          pa: "بہت ودھیا سوچ! استاد دی مدد لین نال سارے بچے رل کے کھیڈنا سکھدے نے۔",
        },
        isPositive: true,
      },
    ],
  },
  {
    id: 3,
    title: "Scene 3: Friendship Wins the Day!",
    illustrationEmoji: "🎉 ⚽ 🐧 🦁 🦓",
    sceneNarration: {
      en: "Pip steps onto the field, smiling broadly! Zara passes the ball, Leo cheers, and together they discover that playing as a team is ten times more fun than playing alone.",
      ur: "پپ مسکراتا ہوا میدان میں آ جاتا ہے! زارا گیند آگے بڑھاتی ہے، لیو تالیاں بجاتا ہے، اور سب مل کر ہنستے کھیلتے ہیں!",
      pa: "پپ ہنسدا ہویا گراؤنڈ وچ آ گیا! زارا نے فٹ بال پاس کیتا، لیو نے نعرہ لایا، تے سب رل کے کھیڈے۔",
    },
  },
];

export interface InteractiveCartoonPlayerProps {
  onFinish?: () => void;
}

export const InteractiveCartoonPlayer: React.FC<InteractiveCartoonPlayerProps> = ({ onFinish }) => {
  const { locale } = useYouth();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const scene = CARTOON_STORY[currentSceneIndex];
  const narration = scene.sceneNarration[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"];
  const question = scene.pauseQuestion?.[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"];

  const handleSpeakScene = () => {
    setIsPlayingAudio(true);
    const textToSpeak = question ? `${narration} ... ${question}` : narration;
    voiceSynthesizer.speak(textToSpeak, {
      characterId: "mia",
      locale: locale === "ur" ? "ur-PK" : locale === "pa" ? "pa-PK" : "en-US",
      onEnd: () => setIsPlayingAudio(false),
    });
  };

  const handleSelectChoice = (choiceId: string) => {
    setSelectedChoice(choiceId);
    const chosen = scene.choices?.find((c) => c.id === choiceId);
    if (chosen) {
      const consequenceText = chosen.consequence[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"];
      voiceSynthesizer.speak(consequenceText, {
        characterId: "mia",
        locale: locale === "ur" ? "ur-PK" : locale === "pa" ? "pa-PK" : "en-US",
      });
    }
  };

  const handleNextScene = () => {
    if (currentSceneIndex < CARTOON_STORY.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
      setSelectedChoice(null);
    }
  };

  const handleRestart = () => {
    setCurrentSceneIndex(0);
    setSelectedChoice(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-purple-50 border-2 border-purple-200">
        <div className="flex items-center space-x-3">
          <Link
            href="/youth/stories"
            className="p-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 shadow-2xs font-bold text-xs inline-flex items-center space-x-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stories</span>
          </Link>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">🎬</span>
              <h2 className="text-base font-black text-slate-900">
                Interactive Cartoon Theater
              </h2>
            </div>
            <p className="text-xs text-purple-900 font-medium">
              &ldquo;The Playground Friend&rdquo; &bull; Original Moral Animation &bull; Narrated by Mia
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSpeakScene}
          className={`px-4 py-2 rounded-xl text-xs font-black shadow-xs flex items-center space-x-2 transition-transform active:scale-95 ${
            isPlayingAudio ? "bg-purple-600 text-white animate-pulse" : "bg-purple-500 hover:bg-purple-600 text-white"
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>{isPlayingAudio ? "Speaking..." : "Read Scene Aloud"}</span>
        </button>
      </div>

      {/* Main Animated Stage Container */}
      <div className="rounded-[40px] bg-gradient-to-b from-[#FFFDF9] via-purple-50/40 to-white border-4 border-purple-200 shadow-md p-6 sm:p-10 space-y-8 text-center">
        {/* Scene Badge & Title */}
        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase bg-white border border-purple-200 text-purple-800 shadow-2xs">
            {scene.title}
          </span>
        </div>

        {/* Big Animated Emoji Stage */}
        <div className="py-8 bg-white/80 rounded-3xl border-2 border-dashed border-purple-200 text-7xl sm:text-8xl tracking-widest flex items-center justify-center select-none shadow-2xs">
          {scene.illustrationEmoji}
        </div>

        {/* Scene Narration */}
        <div className="max-w-2xl mx-auto space-y-2">
          <p className="text-base sm:text-lg text-slate-800 font-bold leading-relaxed">
            {narration}
          </p>
        </div>

        {/* Pause Point & Visual Choices (If Scene has a decision point) */}
        {scene.pauseQuestion && (
          <div className="p-6 rounded-3xl bg-amber-50/80 border-2 border-amber-300 text-left space-y-5 animate-fade-in">
            <div className="flex items-center space-x-2.5 text-amber-900 font-black text-sm sm:text-base">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              <span>{question}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {scene.choices?.map((c) => {
                const choiceText = c.text[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"];
                const isSelected = selectedChoice === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectChoice(c.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between space-y-2 cursor-pointer ${
                      isSelected
                        ? "bg-white border-amber-500 shadow-md scale-102 ring-2 ring-amber-300"
                        : "bg-white/90 border-slate-200 hover:border-amber-400 hover:shadow-xs"
                    }`}
                  >
                    <span className="text-3xl block">{c.icon}</span>
                    <p className="text-xs font-bold text-slate-800 leading-snug">
                      {choiceText}
                    </p>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md inline-block w-fit ${
                        isSelected ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {isSelected ? "Selected ✓" : "Choose this"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Consequence Explanation Feedback */}
            {selectedChoice && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold space-y-1 animate-fade-in">
                <div className="flex items-center space-x-1.5 text-emerald-800 uppercase text-[10px] font-black">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Consequence Explained Gently:</span>
                </div>
                <p className="leading-relaxed">
                  {scene.choices?.find((c) => c.id === selectedChoice)?.consequence[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"]}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bottom Progression Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-purple-100">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
            <span>Scene {currentSceneIndex + 1} of {CARTOON_STORY.length}</span>
          </div>

          <div className="flex items-center space-x-3">
            {currentSceneIndex > 0 && (
              <button
                type="button"
                onClick={() => setCurrentSceneIndex(currentSceneIndex - 1)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Previous Scene
              </button>
            )}

            {currentSceneIndex < CARTOON_STORY.length - 1 ? (
              <button
                type="button"
                onClick={handleNextScene}
                disabled={scene.pauseQuestion && !selectedChoice}
                className={`px-6 py-2.5 rounded-xl text-white text-xs font-black shadow-xs flex items-center space-x-1.5 transition-all ${
                  scene.pauseQuestion && !selectedChoice
                    ? "bg-slate-300 cursor-not-allowed opacity-60"
                    : "bg-purple-600 hover:bg-purple-700 active:scale-95"
                }`}
              >
                <span>Next Scene</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Watch Story Again</span>
                </button>
                {onFinish && (
                  <button
                    type="button"
                    onClick={onFinish}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-xs flex items-center space-x-1.5"
                  >
                    <span>Exit Theater</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
