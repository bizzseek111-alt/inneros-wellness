"use client";

import React, { useState } from "react";
import { Smile, Sun, Sparkles, CloudRain, Zap, Frown, Heart, HelpCircle, Wind, Check } from "lucide-react";
import { useYouth } from "./YouthContext";

interface FeelingData {
  id: string;
  labelEn: string;
  labelUr: string;
  labelPa: string;
  icon: any;
  colorClass: string;
  bodySensations: string[];
  copingTip: string;
}

export const FEELINGS: FeelingData[] = [
  {
    id: "happy",
    labelEn: "Happy / Cheerful",
    labelUr: "خوش",
    labelPa: "خوش",
    icon: Sun,
    colorClass: "bg-amber-100 text-amber-900 border-amber-300",
    bodySensations: ["Light chest", "Bouncy energy", "Big smile"],
    copingTip: "Share your joy with someone or draw what made you smile!",
  },
  {
    id: "calm",
    labelEn: "Calm / Peaceful",
    labelUr: "پرسکون",
    labelPa: "ٹھنڈا ٹھار",
    icon: Sparkles,
    colorClass: "bg-emerald-100 text-emerald-900 border-emerald-300",
    bodySensations: ["Relaxed shoulders", "Slow heartbeat", "Soft belly"],
    copingTip: "Savor this calm moment. Notice three things you can hear right now.",
  },
  {
    id: "sad",
    labelEn: "Sad / Lonely",
    labelUr: "اداس / اکیلا",
    labelPa: "اداس / کلا",
    icon: CloudRain,
    colorClass: "bg-sky-100 text-sky-900 border-sky-300",
    bodySensations: ["Heavy chest", "Lump in throat", "Low energy"],
    copingTip: "It's okay to feel sad. Wrap in a cozy blanket or talk gently to Lumi.",
  },
  {
    id: "mad",
    labelEn: "Mad / Frustrated",
    labelUr: "غصہ / بیزار",
    labelPa: "غصے وچ",
    icon: Zap,
    colorClass: "bg-rose-100 text-rose-900 border-rose-300",
    bodySensations: ["Tight fists", "Hot face", "Fast breathing"],
    copingTip: "Blow out the dragon candle: 3 deep breaths pushing the air out like wind.",
  },
  {
    id: "worried",
    labelEn: "Worried / Nervous",
    labelUr: "پریشان / گھبرایا ہوا",
    labelPa: "فکرمند",
    icon: Frown,
    colorClass: "bg-purple-100 text-purple-900 border-purple-300",
    bodySensations: ["Butterflies in stomach", "Restless feet", "Racing thoughts"],
    copingTip: "Put both feet flat on the floor. Name 5 blue things you can see.",
  },
  {
    id: "loved",
    labelEn: "Safe & Loved",
    labelUr: "محفوظ اور پیارا",
    labelPa: "محفوظ تے لاڈلا",
    icon: Heart,
    colorClass: "bg-pink-100 text-pink-900 border-pink-300",
    bodySensations: ["Warm chest", "Safe feeling", "Relaxed face"],
    copingTip: "Think of a person, pet, or place that makes you feel protected.",
  },
];

export const FeelingsWheel: React.FC = () => {
  const { locale } = useYouth();
  const [selectedFeeling, setSelectedFeeling] = useState<FeelingData>(FEELINGS[0]);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);

  const getLabel = (f: FeelingData) => {
    if (locale === "ur" || locale === "ur-Latn") return `${f.labelUr} (${f.labelEn})`;
    if (locale === "pa") return `${f.labelPa} (${f.labelEn})`;
    return f.labelEn;
  };

  const bodyParts = ["Head / Thoughts", "Throat", "Chest / Heart", "Stomach / Belly", "Hands / Fists"];

  return (
    <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-6">
      <div className="text-center space-y-1">
        <h3 className="text-xl font-extrabold text-[#0F172A]">
          Emotion Learning & Bodily Awareness
        </h3>
        <p className="text-sm text-[#718096]">
          Every feeling has a name and visits our body. Tap how you feel right now.
        </p>
      </div>

      {/* Grid of Feelings */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {FEELINGS.map((f) => {
          const Icon = f.icon;
          const isSelected = selectedFeeling.id === f.id;
          return (
            <button
              key={f.id}
              onClick={() => {
                setSelectedFeeling(f);
                setSelectedBodyPart(null);
              }}
              className={`p-4 rounded-[22px] border-2 flex flex-col items-center justify-center space-y-2 text-center transition-all ${
                f.colorClass
              } ${isSelected ? "ring-4 ring-[#0E87E3] scale-102 shadow-sm font-bold" : "hover:scale-101"}`}
            >
              <Icon className="w-7 h-7" />
              <span className="text-sm font-bold block">{getLabel(f)}</span>
            </button>
          );
        })}
      </div>

      {/* Bodily Sensation Exploration */}
      <div className="p-5 rounded-2xl bg-[#F9F5EA] border border-[#E2E8F0] space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#4A5568] block">
          Where do you notice this feeling in your body?
        </span>
        <div className="flex flex-wrap gap-2">
          {bodyParts.map((part) => (
            <button
              key={part}
              onClick={() => setSelectedBodyPart(part)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                selectedBodyPart === part
                  ? "bg-[#0E87E3] text-white border-[#0E87E3] shadow-xs"
                  : "bg-white text-[#4A5568] border-[#CBD5E1] hover:bg-[#FDFBF4]"
              }`}
            >
              {part}
            </button>
          ))}
        </div>
      </div>

      {/* Gentle Coping Anchor */}
      <div className="p-5 rounded-2xl bg-[#E0F1FE] border border-[#B9E2FE] flex items-start space-x-3 rtl:space-x-reverse">
        <Wind className="w-5 h-5 text-[#0C436F] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0C436F] block">
            Gentle Idea for {selectedFeeling.labelEn}
          </span>
          <p className="text-sm text-[#0C436F] font-semibold leading-relaxed">
            {selectedFeeling.copingTip}
          </p>
        </div>
      </div>
    </div>
  );
};
