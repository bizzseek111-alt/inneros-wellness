"use client";

import React from "react";
import { Anchor, Heart, Zap, HelpCircle } from "lucide-react";

export interface ToneSetting {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const TONES: ToneSetting[] = [
  { id: "grounding", name: "Grounding", icon: Anchor, description: "Somatic, steady, calming presence" },
  { id: "warm", name: "Warm", icon: Heart, description: "Deeply validating and compassionate" },
  { id: "concise", name: "Concise", icon: Zap, description: "Clear, direct, and focused reflection" },
  { id: "inquisitive", name: "Curious", icon: HelpCircle, description: "Reflective inquiry & gentle questions" },
];

interface ToneSelectorProps {
  currentTone: string;
  onSelectTone: (toneId: string) => void;
}

export const ToneSelector: React.FC<ToneSelectorProps> = ({
  currentTone,
  onSelectTone,
}) => {
  return (
    <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
      {TONES.map((t) => {
        const Icon = t.icon;
        const isSelected = currentTone === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onSelectTone(t.id)}
            title={t.description}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs transition-all duration-150 ${
              isSelected
                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 font-medium"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
            }`}
          >
            <Icon className="w-3 h-3" />
            <span>{t.name}</span>
          </button>
        );
      })}
    </div>
  );
};
