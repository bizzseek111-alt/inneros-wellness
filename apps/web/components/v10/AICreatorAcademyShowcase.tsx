"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CompanionPortrait, CompanionId } from "@/components/v9/CompanionPortrait";
import {
  Sparkles,
  Play,
  RotateCcw,
  BookOpen,
  Gamepad2,
  Film,
  Palette,
  Cpu,
  ArrowRight,
  Lock,
  CheckCircle2,
  Plus,
} from "lucide-react";

type ShowcaseMode = "game" | "story" | "cartoon" | "art" | "ai_project";

interface BlockStep {
  id: string;
  label: string;
  icon: string;
  dx: number;
  dy: number;
  color: string;
}

const BLOCK_PALETTE: BlockStep[] = [
  { id: "right", label: "Move Right →", icon: "➡️", dx: 1, dy: 0, color: "bg-amber-100 border-amber-400 text-amber-950" },
  { id: "up", label: "Jump Up ↑", icon: "⬆️", dx: 0, dy: -1, color: "bg-sky-100 border-sky-400 text-sky-950" },
  { id: "down", label: "Step Down ↓", icon: "⬇️", dx: 0, dy: 1, color: "bg-teal-100 border-teal-400 text-teal-950" },
  { id: "star", label: "If Touching Star → Score +1", icon: "⭐", dx: 0, dy: 0, color: "bg-purple-100 border-purple-400 text-purple-950" },
];

export const AICreatorAcademyShowcase: React.FC = () => {
  const [activeMode, setActiveMode] = useState<ShowcaseMode>("game");
  const [selectedHero, setSelectedHero] = useState<CompanionId>("kai");

  // Interactive Game Builder State (5x3 stage)
  const [blocks, setBlocks] = useState<BlockStep[]>([
    BLOCK_PALETTE[0], // Right
    BLOCK_PALETTE[0], // Right
    BLOCK_PALETTE[1], // Up
    BLOCK_PALETTE[3], // Collect Star
  ]);
  const [heroPos, setHeroPos] = useState<{ x: number; y: number }>({ x: 0, y: 1 });
  const [starCollected, setStarCollected] = useState(false);
  const [gameStatus, setGameStatus] = useState("Ready! Snap a block or press Run Creation to test your game.");

  // Story Maker Preview State
  const [storySetting, setStorySetting] = useState("Lahore Rooftop Kite Festival");
  const [storyMoral, setStoryMoral] = useState("Sharing tools so everyone's kite can fly");

  const runMiniGame = () => {
    let x = 0;
    let y = 1;
    let gotStar = false;
    for (const b of blocks) {
      x = Math.max(0, Math.min(4, x + b.dx));
      y = Math.max(0, Math.min(2, y + b.dy));
      if (x === 2 && y === 0) {
        gotStar = true;
      }
    }
    setHeroPos({ x, y });
    setStarCollected(gotStar);
    setGameStatus(
      gotStar
        ? `🎉 Goal Reached! ${selectedHero.toUpperCase()} reached tile (2, 0), collected the Golden Star, and unlocked the next level!`
        : `${selectedHero.toUpperCase()} moved to (${x}, ${y}). Try adding 'Move Right →' twice and 'Jump Up ↑' to reach the star at (2, 0)!`
    );
  };

  const resetMiniGame = () => {
    setHeroPos({ x: 0, y: 1 });
    setStarCollected(false);
    setGameStatus("Stage reset to starting tile (0, 1).");
  };

  return (
    <section
      id="ai-creator-academy"
      className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#0F172A] text-white border-y-2 border-slate-900"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Section 05 • Flagship Studio • Create with AI</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.08]">
              AI Creator Academy: Children Don&apos;t Just Watch Screen Content — They Build It.
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              In Weebly&apos;s Creator Academy, AI never replaces the child&apos;s imagination. Children choose their character, snap visual logic blocks, write bilingual stories, direct multi-scene cartoons, and test simple AI pattern inventions—saved privately by default.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/youth/creator"
              className="px-6 py-3.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-sm hover:bg-amber-300 transition inline-flex items-center gap-2 shadow-lg"
            >
              <span>Open Full Creator Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/ai-creator"
              className="px-5 py-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-white font-bold text-sm hover:bg-slate-700 transition"
            >
              Explore Creator Curriculum
            </Link>
          </div>
        </div>

        {/* 5 Creation Mode Switcher Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5" role="tablist" aria-label="Creator Academy Modes">
          {[
            { id: "game" as ShowcaseMode, label: "1. Visual Block Games", sub: "Ages 5–16 Logic", icon: Gamepad2 },
            { id: "story" as ShowcaseMode, label: "2. Illustrated Stories", sub: "EN • اردو • پنجابی", icon: BookOpen },
            { id: "cartoon" as ShowcaseMode, label: "3. Cartoon Studio", sub: "3-Scene Storyboard", icon: Film },
            { id: "art" as ShowcaseMode, label: "4. Art & Design Lab", sub: "Guided Drawing", icon: Palette },
            { id: "ai_project" as ShowcaseMode, label: "5. Simple AI Projects", sub: "Pattern & Fairness", icon: Cpu },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveMode(tab.id)}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                  active
                    ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md"
                    : "bg-slate-900/90 text-slate-200 border-slate-800 hover:border-slate-600"
                }`}
              >
                <Icon className={`w-5 h-5 mb-2 ${active ? "text-slate-950" : "text-amber-400"}`} />
                <div>
                  <div className="text-xs sm:text-sm font-black leading-tight">{tab.label}</div>
                  <div className={`text-[11px] mt-0.5 font-semibold ${active ? "text-slate-800" : "text-slate-400"}`}>
                    {tab.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Workbench Stage */}
        <div className="rounded-[32px] bg-[#FAF7F2] text-slate-900 border-4 border-amber-400 p-6 sm:p-8 shadow-2xl">
          {activeMode === "game" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: Step 1 Pick Hero + Step 2 Snap Visual Blocks */}
              <div className="lg:col-span-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-800">
                      Interactive Workbench • Try It Live
                    </span>
                    <h3 className="text-xl font-black text-slate-900">
                      Step 1: Choose Your Game Hero &amp; Snap Blocks
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold">
                    Ages 6–12 Block Mode
                  </span>
                </div>

                {/* Character Picker */}
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-extrabold text-slate-600">Hero:</span>
                  {(["kai", "mia", "lumi", "zayn"] as CompanionId[]).map((cid) => (
                    <button
                      key={cid}
                      type="button"
                      onClick={() => setSelectedHero(cid)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold capitalize flex items-center gap-1.5 transition ${
                        selectedHero === cid
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      <CompanionPortrait character={cid} size={22} />
                      <span>{cid}</span>
                    </button>
                  ))}
                </div>

                {/* Add Block Palette */}
                <div className="space-y-2">
                  <div className="text-xs font-extrabold text-slate-600">
                    Tap a command block to add it to your program:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {BLOCK_PALETTE.map((blk) => (
                      <button
                        key={blk.id}
                        type="button"
                        onClick={() =>
                          setBlocks((prev) => (prev.length < 7 ? [...prev, blk] : prev))
                        }
                        className={`px-3 py-2 rounded-xl border-2 text-xs font-extrabold inline-flex items-center gap-1.5 hover:scale-102 transition ${blk.color}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{blk.icon}</span>
                        <span>{blk.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Program Sequence */}
                <div className="rounded-2xl bg-white border-2 border-slate-200 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>WHEN TAPPED RUN SEQUENCE ({blocks.length}/7 blocks):</span>
                    <button
                      type="button"
                      onClick={() => setBlocks([BLOCK_PALETTE[0], BLOCK_PALETTE[0], BLOCK_PALETTE[1], BLOCK_PALETTE[3]])}
                      className="text-indigo-600 hover:underline font-extrabold"
                    >
                      Reset Default Blocks
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {blocks.map((b, i) => (
                      <span
                        key={`${b.id}-${i}`}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold inline-flex items-center gap-1.5 ${b.color}`}
                      >
                        <span>{i + 1}.</span>
                        <span>{b.icon}</span>
                        <span>{b.label}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Run / Reset Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={runMiniGame}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm inline-flex items-center gap-2 shadow-md transition"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Run Creation on Stage</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetMiniGame}
                    className="px-4 py-3 rounded-2xl bg-white border border-slate-300 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 hover:bg-slate-100"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Stage</span>
                  </button>
                </div>
              </div>

              {/* Right: Live 5x3 Visual Stage */}
              <div className="lg:col-span-6 space-y-4">
                <div className="rounded-3xl bg-slate-900 text-white p-5 border-2 border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-amber-300">LIVE 5×3 GAME STAGE • STAR QUEST</span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-emerald-300">
                      Score: {starCollected ? "1 / 1 ⭐" : "0 / 1 ⭐"}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2.5">
                    {Array.from({ length: 15 }).map((_, idx) => {
                      const gx = idx % 5;
                      const gy = Math.floor(idx / 5);
                      const isHero = heroPos.x === gx && heroPos.y === gy;
                      const isStar = gx === 2 && gy === 0 && !starCollected;
                      return (
                        <div
                          key={idx}
                          className={`h-16 sm:h-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                            isHero
                              ? "bg-amber-400/20 border-amber-400 scale-105"
                              : isStar
                              ? "bg-indigo-950/80 border-indigo-400/60"
                              : "bg-slate-800/70 border-slate-700"
                          }`}
                        >
                          {isHero ? (
                            <CompanionPortrait character={selectedHero} size={42} />
                          ) : isStar ? (
                            <span className="text-2xl animate-pulse" aria-label="Target Star">
                              ⭐
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-500">
                              ({gx},{gy})
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-2xl bg-slate-800/90 px-4 py-3 text-xs font-bold text-amber-200 flex items-center justify-between gap-2">
                    <span>{gameStatus}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMode === "story" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-black uppercase text-pink-700">
                  Interactive Bilingual Story Maker
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Co-Author Illustrated 3-Scene Stories in English, Urdu &amp; Punjabi
                </h3>
                <p className="text-sm text-slate-600">
                  Children pick their hero, setting, and kind goal. Mia helps structure a beginning, middle, and end—while the child edits every sentence and records their own voice narration.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                    <label className="text-[11px] font-extrabold uppercase text-slate-400 block">
                      Story Setting
                    </label>
                    <select
                      value={storySetting}
                      onChange={(e) => setStorySetting(e.target.value)}
                      className="mt-1 w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
                    >
                      <option value="Lahore Rooftop Kite Festival">Lahore Rooftop Kite Festival</option>
                      <option value="Margalla Hills Whispering Forest">Margalla Hills Whispering Forest</option>
                      <option value="Moonlight Science Observatory">Moonlight Science Observatory</option>
                    </select>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                    <label className="text-[11px] font-extrabold uppercase text-slate-400 block">
                      Kind Goal
                    </label>
                    <select
                      value={storyMoral}
                      onChange={(e) => setStoryMoral(e.target.value)}
                      className="mt-1 w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
                    >
                      <option value="Sharing tools so everyone's kite can fly">Sharing tools so everyone&apos;s kite can fly</option>
                      <option value="Helping a nervous classmate join the game">Helping a nervous classmate join the game</option>
                      <option value="Checking facts before believing a rumor">Checking facts before believing a rumor</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6 rounded-3xl bg-white border-2 border-slate-900 p-6 space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-900 text-xs font-extrabold">
                    Live Storyboard Preview
                  </span>
                  <span className="text-xs font-bold text-slate-500">EN • اردو • پنجابی</span>
                </div>
                <h4 className="text-lg font-black text-slate-900">
                  {selectedHero.toUpperCase()} at the {storySetting}
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
                  <strong>Scene 1:</strong> At the {storySetting}, Mia and {selectedHero.toUpperCase()} practiced{" "}
                  <em>{storyMoral.toLowerCase()}</em>. Together they discovered that teamwork makes every adventure brighter!
                </p>
                <div className="flex justify-end">
                  <Link
                    href="/youth/creator?tool=story_maker"
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-extrabold"
                  >
                    Edit &amp; Narrate in Story Maker →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeMode === "cartoon" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { scene: "Scene 1 • Setup", bg: "Sunny Courtyard 🌳", line: "Kai & Mia spot a puzzle bridge that needs 3 equal planks." },
                { scene: "Scene 2 • Action", bg: "Maker Workbench 🛠️", line: "Zayn measures 12 blocks and divides them into 3 fair groups of 4." },
                { scene: "Scene 3 • Reflection", bg: "Starlight Stage 🌟", line: "Lumi leads a celebratory breath and saves the cartoon to the Passport!" },
              ].map((sc) => (
                <div key={sc.scene} className="rounded-2xl bg-white border-2 border-slate-200 p-5 space-y-2">
                  <span className="text-xs font-black uppercase text-indigo-600">{sc.scene}</span>
                  <div className="text-sm font-extrabold text-slate-900">{sc.bg}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">&ldquo;{sc.line}&rdquo;</p>
                </div>
              ))}
            </div>
          )}

          {activeMode === "art" && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <span className="text-xs font-black uppercase text-rose-600">Human Creativity First</span>
                <h3 className="text-2xl font-black text-slate-900">
                  Guided Finger-Painting, Symmetry &amp; Dinosaur Sketchpads
                </h3>
                <p className="text-sm text-slate-600">
                  Children draw with their own hands using step-by-step visual guides, symmetry mirrors, and natural color palettes—never replacing child artwork with one-click synthetic images.
                </p>
              </div>
              <Link
                href="/youth/creative-studio"
                className="px-6 py-3.5 rounded-2xl bg-rose-600 text-white font-black text-xs sm:text-sm shrink-0"
              >
                Launch Guided Drawing Canvas →
              </Link>
            </div>
          )}

          {activeMode === "ai_project" && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <span className="text-xs font-black uppercase text-teal-700">Young AI Inventors &amp; AI Detective</span>
                <h3 className="text-2xl font-black text-slate-900">
                  Train a Pattern Sorter &amp; Spot AI Hallucinations
                </h3>
                <p className="text-sm text-slate-600">
                  Children test how training examples affect computer guesses, why skewed examples cause unfair mistakes, and how to fact-check AI answers with a trusted adult.
                </p>
              </div>
              <Link
                href="/youth/creator?tool=ai_inventors"
                className="px-6 py-3.5 rounded-2xl bg-teal-700 text-white font-black text-xs sm:text-sm shrink-0"
              >
                Try Pattern Sorter Lab →
              </Link>
            </div>
          )}

          {/* Bottom Privacy & Pedagogical Guarantee Strip */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Private by Default: Saved to the child&apos;s Passport (`parent_sharing_approved: false`). Never shared publicly without parent approval.</span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>PII &amp; Safety Moderation Filter Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
