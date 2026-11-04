"use client";

import React, { useState } from "react";
import { Compass, Sparkles, Check, Heart, Sun, Cloud, RefreshCw } from "lucide-react";
import { YouthShell } from "@/components/youth/YouthShell";
import { LumiMascot } from "@/components/youth/LumiMascot";

export default function CognitiveActivitiesPage() {
  const [activeTab, setActiveTab] = useState<"patterns" | "gratitude" | "tracing">("patterns");

  // Pattern Matching State
  const shapes = ["⭐ Star", "🌸 Flower", "🌙 Moon", "🍃 Leaf"];
  const [targetShape, setTargetShape] = useState("⭐ Star");
  const [feedback, setFeedback] = useState<string | null>(null);

  // Gratitude Garden State
  const [gratitudes, setGratitudes] = useState<string[]>([
    "My warm morning blanket",
    "Listening to rain outside",
    "Sharing an apple with my friend",
  ]);
  const [newGratitude, setNewGratitude] = useState("");

  const handleShapeSelect = (s: string) => {
    if (s === targetShape) {
      setFeedback("Wonderful! You noticed the matching shape with great focus.");
      setTimeout(() => {
        const next = shapes[Math.floor(Math.random() * shapes.length)];
        setTargetShape(next);
        setFeedback(null);
      }, 1500);
    } else {
      setFeedback("Almost! Take a slow breath and look at the shapes again.");
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
    <YouthShell
      activeScreen="activities"
      title="Cognitive Calm & Mindful Play"
      subtitle="Gentle focus games, pattern matching, and gratitude anchors with zero pressure."
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Activity Tab Bar */}
        <div className="flex border-b border-[#E2E8F0] gap-4">
          <button
            onClick={() => setActiveTab("patterns")}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "patterns"
                ? "border-[#0E87E3] text-[#0E87E3]"
                : "border-transparent text-[#718096] hover:text-[#0F172A]"
            }`}
          >
            Pattern Focus
          </button>
          <button
            onClick={() => setActiveTab("gratitude")}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "gratitude"
                ? "border-[#0E87E3] text-[#0E87E3]"
                : "border-transparent text-[#718096] hover:text-[#0F172A]"
            }`}
          >
            Gratitude Garden
          </button>
          <button
            onClick={() => setActiveTab("tracing")}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "tracing"
                ? "border-[#0E87E3] text-[#0E87E3]"
                : "border-transparent text-[#718096] hover:text-[#0F172A]"
            }`}
          >
            Breath Wave Tracing
          </button>
        </div>

        {/* Tab 1: Pattern Focus */}
        {activeTab === "patterns" && (
          <div className="p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-6 text-center animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E87E3]">
                Calm Attention
              </span>
              <h3 className="text-xl font-extrabold text-[#0F172A]">
                Find the Matching Symbol
              </h3>
              <p className="text-xs text-[#718096]">
                There is no timer or score. Take all the time you need.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F0F8FF] border border-[#B9E2FE] inline-block">
              <span className="text-xs font-bold text-[#0C436F] block mb-2">Target Symbol:</span>
              <span className="text-4xl font-extrabold">{targetShape}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
              {shapes.map((s) => (
                <button
                  key={s}
                  onClick={() => handleShapeSelect(s)}
                  className="p-4 rounded-2xl border-2 border-[#E2E8F0] hover:border-[#38A8F8] bg-[#FFFDF9] text-base font-bold text-[#0F172A] transition-all hover:scale-102"
                >
                  {s}
                </button>
              ))}
            </div>

            {feedback && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold animate-fade-in">
                {feedback}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Gratitude Garden */}
        {activeTab === "gratitude" && (
          <div className="p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-6 animate-fade-in">
            <div className="space-y-1 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#36A871]">
                Emotional Grounding
              </span>
              <h3 className="text-xl font-extrabold text-[#0F172A]">
                My Gratitude Garden
              </h3>
              <p className="text-xs text-[#718096]">
                Planting small things that made your day gentle.
              </p>
            </div>

            <form onSubmit={handleAddGratitude} className="flex gap-2 max-w-md mx-auto">
              <input
                type="text"
                value={newGratitude}
                onChange={(e) => setNewGratitude(e.target.value)}
                placeholder="What is one kind thing you noticed?"
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-2 focus:ring-[#0E87E3]"
              />
              <button
                type="submit"
                disabled={!newGratitude.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#36A871] hover:bg-[#154D32] disabled:opacity-50 text-white font-bold text-xs"
              >
                Plant Seed
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {gratitudes.map((g, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#F2FAF6] border border-[#C4EDD6] flex items-center space-x-3"
                >
                  <span className="text-2xl">🌱</span>
                  <span className="text-xs font-bold text-[#154D32]">{g}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Breath Wave Tracing */}
        {activeTab === "tracing" && (
          <div className="p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-6 text-center animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9868CE]">
                Sensory Rhythm
              </span>
              <h3 className="text-xl font-extrabold text-[#0F172A]">
                Finger Wave Breath Tracing
              </h3>
              <p className="text-xs text-[#718096]">
                Trace the gentle wave with your finger: breathe in going up, breathe out going down.
              </p>
            </div>

            <div className="relative h-44 rounded-2xl bg-[#FAF7FD] border border-[#E6D7F5] flex items-center justify-center p-4">
              <svg className="w-full h-full" viewBox="0 0 500 120">
                <path
                  d="M 10 60 Q 70 10 130 60 T 250 60 T 370 60 T 490 60"
                  fill="none"
                  stroke="#9868CE"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-x-0 bottom-3 flex justify-around text-[11px] font-bold text-[#9868CE]">
                <span>Inhale (Up)</span>
                <span>Exhale (Down)</span>
                <span>Inhale (Up)</span>
                <span>Exhale (Down)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </YouthShell>
  );
}
