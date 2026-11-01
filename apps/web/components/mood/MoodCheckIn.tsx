"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/primitives/Slider";
import { Badge } from "@/components/primitives/Badge";
import { Sparkles, Sun, Compass, BatteryCharging, Heart, Check } from "lucide-react";

export interface MoodCoordinates {
  valence: number; // -5 (difficult/heavy) to +5 (light/uplifted)
  energy: number; // 0 (restful/depleted) to 10 (vibrant/activated)
  selectedTags: string[];
}

interface MoodCheckInProps {
  onConfirmCheckIn?: (data: MoodCoordinates) => void;
  className?: string;
}

const MOOD_TAGS = [
  "Centered",
  "Grounded",
  "Reflective",
  "Vulnerable",
  "Overstimulated",
  "Foggy",
  "Grateful",
  "Tense",
  "Seeking Clarity",
  "Peaceful",
];

export const MoodCheckIn: React.FC<MoodCheckInProps> = ({ onConfirmCheckIn, className }) => {
  const [valence, setValence] = useState<number>(1);
  const [energy, setEnergy] = useState<number>(6);
  const [selectedTags, setSelectedTags] = useState<string[]>(["Grounded", "Reflective"]);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const getQuadrantLabel = () => {
    if (valence >= 0 && energy >= 5) return "Vibrant & Centered";
    if (valence >= 0 && energy < 5) return "Restorative & Peaceful";
    if (valence < 0 && energy >= 5) return "Activated & Seeking Grounding";
    return "Depleted & Requiring Gentle Care";
  };

  const handleSave = () => {
    setConfirmed(true);
    onConfirmCheckIn?.({ valence, energy, selectedTags });
    setTimeout(() => setConfirmed(false), 3000);
  };

  return (
    <div
      className={cn(
        "rounded-3xl p-6 bg-midnight-800/90 border border-white/[0.08] shadow-xl space-y-6 max-w-lg mx-auto",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400">
            Circadian Check-In
          </span>
          <h3 className="text-base font-semibold text-ivory-100 font-sans-ui mt-0.5">
            Emotional Resonance
          </h3>
        </div>
        <Badge variant="teal" size="sm">
          {getQuadrantLabel()}
        </Badge>
      </div>

      {/* Valence (Emotional Tone) Slider */}
      <div className="space-y-1.5">
        <Slider
          label="Internal Tone (Heavy to Light)"
          min={-5}
          max={5}
          step={1}
          value={valence}
          onChange={setValence}
          valueDisplay={valence > 0 ? `+${valence}` : valence}
        />
        <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
          <span>Heavy / Contracted</span>
          <span>Neutral</span>
          <span>Light / Expansive</span>
        </div>
      </div>

      {/* Energy Slider */}
      <div className="space-y-1.5">
        <Slider
          label="Physiological Energy Level"
          min={0}
          max={10}
          step={1}
          value={energy}
          onChange={setEnergy}
          valueDisplay={`${energy * 10}%`}
        />
        <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
          <span>Depleted</span>
          <span>Balanced</span>
          <span>Surging</span>
        </div>
      </div>

      {/* Granular Reflective Tags */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-ivory-300">Resonant Descriptors</label>
        <div className="flex flex-wrap gap-1.5">
          {MOOD_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  "px-3 py-1 rounded-xl text-xs font-medium transition-all duration-150 select-none",
                  isSelected
                    ? "bg-teal-900/60 text-teal-200 border border-teal-600/70 shadow-sm"
                    : "bg-midnight-900/80 text-zinc-400 hover:text-zinc-200 border border-white/[0.06] hover:border-white/[0.12]"
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action / Confirmation */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleSave}
          className={cn(
            "w-full py-2.5 rounded-xl font-medium text-xs flex items-center justify-center space-x-2 transition-all duration-200 shadow-sm",
            confirmed
              ? "bg-emerald-950 text-emerald-300 border border-emerald-700/60"
              : "bg-teal-600 hover:bg-teal-500 text-white shadow-teal-900/30"
          )}
        >
          {confirmed ? (
            <>
              <Check className="w-4 h-4" />
              <span>Resonance Logged to Sanctuary</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Anchor This State</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
