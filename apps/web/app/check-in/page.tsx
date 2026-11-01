"use client";

import React, { useState } from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { Slider } from "@/components/primitives/Slider";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";
import { Activity, Compass, Heart, Check, Sparkles, Wind, ArrowRight } from "lucide-react";
import Link from "next/link";

const SOMATIC_REGIONS = [
  { id: "jaw", label: "Jaw & Face", note: "Clenching, holding words" },
  { id: "shoulders", label: "Neck & Shoulders", note: "Carrying responsibility" },
  { id: "chest", label: "Chest & Breath", note: "Shallow, guarded respiration" },
  { id: "stomach", label: "Stomach / Solar Plexus", note: "Butterflies, nervous activation" },
  { id: "grounded", label: "Settled / Neutral", note: "Soft, open posture" },
];

const EMOTIONAL_NEEDS = [
  { id: "vent", label: "Space to vent without advice" },
  { id: "ground", label: "Guided breathwork / sensory anchor" },
  { id: "clarity", label: "Thought defusion & objective reframing" },
  { id: "quiet", label: "Quiet, non-demanding presence" },
];

export default function CheckInPage() {
  const [valence, setValence] = useState(1);
  const [energy, setEnergy] = useState(6);
  const [selectedBodyPart, setSelectedBodyPart] = useState("shoulders");
  const [selectedNeed, setSelectedNeed] = useState("clarity");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <SanctuaryShell>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2 border-b border-white/[0.08] pb-4">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-mono uppercase tracking-widest">
            <Activity className="w-4 h-4" />
            <span>Circadian Attunement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-ivory-100 tracking-tight">
            Emotion, Somatics & Core Need Check-In
          </h1>
          <p className="text-xs sm:text-sm text-ivory-300 font-light leading-relaxed">
            Pause to check in with your nervous system. Recognizing where tension resides in the body helps de-escalate acute rumination.
          </p>
        </div>

        {/* 1. Valence & Energy Sliders */}
        <div className="p-6 rounded-3xl bg-midnight-900/90 border border-white/[0.08] space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <span className="text-xs font-semibold text-ivory-100">01. Emotional Coordinates</span>
            <Badge variant="teal" size="sm">
              {valence >= 0 ? "Expansive / Light" : "Contracted / Heavy"} &bull; {energy * 10}% Energy
            </Badge>
          </div>

          <div className="space-y-4">
            <Slider
              label="Valence Tone (Heavy to Expansive)"
              min={-5}
              max={5}
              value={valence}
              onChange={setValence}
              valueDisplay={valence > 0 ? `+${valence}` : valence}
            />
            <Slider
              label="Physiological Activation (Depleted to Surging)"
              min={0}
              max={10}
              value={energy}
              onChange={setEnergy}
              valueDisplay={`${energy * 10}%`}
            />
          </div>
        </div>

        {/* 2. Somatic Physical Tension Map */}
        <div className="p-6 rounded-3xl bg-midnight-900/90 border border-white/[0.08] space-y-4">
          <div className="border-b border-white/[0.06] pb-3">
            <span className="text-xs font-semibold text-ivory-100">
              02. Where does your body register tension right now?
            </span>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Somatic awareness activates the insula and shifts the nervous system away from panic loops.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-2.5">
            {SOMATIC_REGIONS.map((r) => {
              const isSelected = selectedBodyPart === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedBodyPart(r.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-teal-950/70 border-teal-600 text-teal-200 shadow-sm"
                      : "bg-midnight-950/80 border-white/[0.06] text-zinc-400 hover:text-white"
                  }`}
                >
                  <div className="text-xs font-semibold text-ivory-100">{r.label}</div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{r.note}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Identified Core Need */}
        <div className="p-6 rounded-3xl bg-midnight-900/90 border border-white/[0.08] space-y-4">
          <div className="border-b border-white/[0.06] pb-3">
            <span className="text-xs font-semibold text-ivory-100">
              03. What is your primary emotional need in this moment?
            </span>
          </div>

          <div className="space-y-2">
            {EMOTIONAL_NEEDS.map((n) => {
              const isSelected = selectedNeed === n.id;
              return (
                <div
                  key={n.id}
                  onClick={() => setSelectedNeed(n.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-indigo-950/60 border-indigo-600 text-indigo-200 shadow-sm"
                      : "bg-midnight-950/80 border-white/[0.06] text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="text-xs font-medium text-ivory-200">{n.label}</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                      isSelected ? "border-indigo-400 bg-indigo-500 text-white" : "border-zinc-600"
                    }`}
                  >
                    {isSelected ? "✓" : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-midnight-950 border border-white/[0.06]">
          <div className="text-xs text-zinc-400">
            {saved ? (
              <span className="text-teal-300 flex items-center space-x-1.5 font-medium">
                <Check className="w-4 h-4" />
                <span>Check-in anchored to local sanctuary profile</span>
              </span>
            ) : (
              <span>Your coordinates inform non-clinical companion tone calibration</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button size="sm" variant="primary" onClick={handleSave} leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
              Save Resonance
            </Button>
            <Link href="/companion/chat">
              <Button size="sm" variant="secondary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Talk with InnerOS
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </SanctuaryShell>
  );
}
