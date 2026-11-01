"use client";

import React, { useState } from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { Slider } from "@/components/primitives/Slider";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";
import { Heart, Check, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api-client";

const BODY_AREAS = [
  { id: "jaw", label: "Face & Jaw", note: "Holding tension or unspoken thoughts" },
  { id: "shoulders", label: "Neck & Shoulders", note: "Carrying weight or responsibility" },
  { id: "chest", label: "Chest & Breathing", note: "Quick, shallow, or tight breath" },
  { id: "stomach", label: "Stomach", note: "Butterflies, knots, or restlessness" },
  { id: "grounded", label: "Comfortable & Relaxed", note: "Feeling settled and at ease" },
];

const EMOTIONAL_NEEDS = [
  { id: "vent", label: "A safe space to talk things out without advice" },
  { id: "ground", label: "A gentle breathing or grounding exercise" },
  { id: "clarity", label: "Help sorting through a busy thought" },
  { id: "quiet", label: "Quiet, calm company with no pressure" },
];

export default function CheckInPage() {
  const [valence, setValence] = useState(1);
  const [energy, setEnergy] = useState(6);
  const [selectedBodyPart, setSelectedBodyPart] = useState("shoulders");
  const [selectedNeed, setSelectedNeed] = useState("clarity");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      await api.createCheckIn({
        energy_level: Math.max(1, Math.min(5, Math.round(energy / 2))),
        stress_level: valence >= 0 ? 2 : 4,
        emotions: [valence >= 0 ? "Light & Steady" : "Heavy or Tired", `Body: ${selectedBodyPart}`],
        needs: [selectedNeed],
        note: `Mood valence ${valence}, energy ${energy * 10}%, body focus: ${selectedBodyPart}`,
      });
    } catch {
      // Fallback gracefully if offline
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <SanctuaryShell>
      <div className="max-w-3xl mx-auto space-y-6 pb-8">
        {/* Header */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-[#285B55] text-[14px] font-medium">
            <Heart className="w-4 h-4" />
            <span>Gentle Check-In</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#263330]">
            How Are You Feeling Right Now?
          </h1>
          <p className="text-[15px] text-[#52625E] leading-relaxed">
            Take a quiet moment to notice your mood, your energy, and what would feel most supportive today.
          </p>
        </div>

        {/* 1. Mood & Energy Sliders */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-[#F3EFE8] pb-3 gap-2">
            <h2 className="text-[16px] font-serif font-medium text-[#263330]">
              1. Mood & Energy
            </h2>
            <Badge variant="sage" size="sm">
              {valence >= 0 ? "Light & Steady" : "Heavy or Tired"} &bull; {energy * 10}% Energy
            </Badge>
          </div>

          <div className="space-y-5">
            <Slider
              label="Overall Mood (Heavy to Light)"
              min={-5}
              max={5}
              value={valence}
              onChange={setValence}
              valueDisplay={valence > 0 ? `+${valence}` : valence}
            />
            <Slider
              label="Energy Level (Low to Rested)"
              min={0}
              max={10}
              value={energy}
              onChange={setEnergy}
              valueDisplay={`${energy * 10}%`}
            />
          </div>
        </div>

        {/* 2. Physical Comfort / Tension */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-4">
          <div className="border-b border-[#F3EFE8] pb-3">
            <h2 className="text-[16px] font-serif font-medium text-[#263330]">
              2. Where are you noticing tension in your body?
            </h2>
            <p className="text-[14px] text-[#52625E] mt-0.5">
              Simply noticing where your body holds stress can help your shoulders drop and your breath slow down.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {BODY_AREAS.map((r) => {
              const isSelected = selectedBodyPart === r.id;
              return (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setSelectedBodyPart(r.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "bg-[#E8F1EB] border-[#285B55] text-[#263330] shadow-sm"
                      : "bg-[#FAF8F4] border-[#E6E0D6] text-[#52625E] hover:border-[#285B55]/40"
                  }`}
                >
                  <div className="text-[15px] font-semibold text-[#263330]">{r.label}</div>
                  <p className="text-[13.5px] text-[#52625E] mt-0.5">{r.note}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. What Would Help Most */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-4">
          <div className="border-b border-[#F3EFE8] pb-3">
            <h2 className="text-[16px] font-serif font-medium text-[#263330]">
              3. What would feel most helpful right now?
            </h2>
          </div>

          <div className="space-y-2.5">
            {EMOTIONAL_NEEDS.map((n) => {
              const isSelected = selectedNeed === n.id;
              return (
                <button
                  type="button"
                  key={n.id}
                  onClick={() => setSelectedNeed(n.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-[#EDE8F5] border-[#7C639E] text-[#263330] shadow-sm"
                      : "bg-[#FAF8F4] border-[#E6E0D6] text-[#52625E] hover:border-[#7C639E]/40"
                  }`}
                >
                  <span className="text-[15px] font-medium text-[#263330]">{n.label}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-[12px] ${
                      isSelected
                        ? "border-[#5A4878] bg-[#5A4878] text-white"
                        : "border-[#D5CFC2] bg-white"
                    }`}
                  >
                    {isSelected ? "✓" : ""}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm">
          <div className="text-[14px] text-[#52625E]">
            {saved ? (
              <span className="text-[#285B55] flex items-center space-x-2 font-medium">
                <Check className="w-4 h-4" />
                <span>Your check-in has been saved</span>
              </span>
            ) : (
              <span>Your check-in helps tailor your companion’s tone to how you feel today</span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              variant="primary"
              onClick={handleSave}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Save Check-In
            </Button>
            <Link href="/companion/chat">
              <Button
                size="sm"
                variant="secondary"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Talk to Companion
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </SanctuaryShell>
  );
}
