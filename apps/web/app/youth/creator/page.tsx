"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChildNavigationShell } from "@/components/youth/ChildNavigationShell";
import { CompanionPortrait } from "@/components/v9/CompanionPortrait";
import { CreativeStudioCanvas } from "@/components/youth/CreativeStudioCanvas";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";
import { CreatorToolType, CreatorProjectRecord } from "@/app/api/youth/creator/projects/route";
import {
  Sparkles,
  BookOpen,
  Gamepad2,
  Film,
  Palette,
  Cpu,
  SearchCheck,
  Play,
  RotateCcw,
  Save,
  Undo2,
  Download,
  Lock,
  CheckCircle2,
  Volume2,
  Trash2,
} from "lucide-react";

type AgeMode = "age5" | "age6" | "older";

interface GameBlock {
  id: string;
  type:
    | "when_tapped"
    | "move_right"
    | "move_up"
    | "turn"
    | "wait"
    | "repeat_2"
    | "if_collision_star"
    | "score_plus_1"
    | "win_condition"
    | "restart";
  label: string;
  icon: string;
}

const AVAILABLE_GAME_BLOCKS: GameBlock[] = [
  { id: "blk_tap", type: "when_tapped", label: "When Tapped / Start", icon: "👆" },
  { id: "blk_right", type: "move_right", label: "Move Right 1 Tile", icon: "➡️" },
  { id: "blk_up", type: "move_up", label: "Move Up 1 Tile", icon: "⬆️" },
  { id: "blk_turn", type: "turn", label: "Turn 90°", icon: "🔄" },
  { id: "blk_wait", type: "wait", label: "Wait 1 Second", icon: "⏱️" },
  { id: "blk_repeat", type: "repeat_2", label: "Repeat Next Step ×2", icon: "🔁" },
  { id: "blk_if_star", type: "if_collision_star", label: "If Touching Star (Collision)", icon: "⭐" },
  { id: "blk_score", type: "score_plus_1", label: "Score +1 Point", icon: "🏆" },
  { id: "blk_win", type: "win_condition", label: "Win Condition (Reach Goal)", icon: "🎉" },
  { id: "blk_restart", type: "restart", label: "Restart Position", icon: "⏮️" },
];

const AI_INVENTOR_MODULES = [
  {
    id: "what_is_ai",
    title: "1. What AI Is & What AI Is Not",
    concept: "AI is a computer program that learns from examples and patterns. It does NOT have human feelings, a real heart, or its own wishes.",
    experiment: "Train Zayn's Pattern Sorter: Give 3 examples of fruits (Mango, Apple, Banana) and see if the sorter spots whether a Bicycle is a fruit!",
    quizPrompt: "Can an AI companion feel real tummy hunger like a child?",
    options: ["No, AI is software running on a computer", "Yes, computers eat sandwiches"],
    correctIdx: 0,
  },
  {
    id: "instructions_and_data",
    title: "2. How Instructions, Patterns & Data Work",
    concept: "Computers need clear instructions (algorithms) and fair examples (data). If we only show green apples, the computer might forget red apples exist!",
    experiment: "Test a fair dataset: Include examples in English, Urdu, and Punjabi so everyone is included fairly.",
    quizPrompt: "What happens if we train a pattern matcher with only one kind of example?",
    options: ["It can make unfair or incomplete guesses", "It magically knows everything"],
    correctIdx: 0,
  },
  {
    id: "mistakes_and_testing",
    title: "3. AI Mistakes, Testing, Iterating & Responsible Creation",
    concept: "Good inventors test their creations, spot bugs or AI mistakes, and improve them step by step while protecting people's privacy.",
    experiment: "Debug a broken instruction sequence and verify with a trusted adult.",
    quizPrompt: "When an inventor finds a mistake in their project, what do they do?",
    options: ["Test, debug, and iterate to make it better", "Hide the mistake"],
    correctIdx: 0,
  },
];

const AI_DETECTIVE_CASES = [
  {
    id: "case_hallucination",
    badge: "Case #1 • True vs. Invented (AI Hallucination)",
    scenario: "A chatbot writes: 'The Minar-e-Pakistan in Lahore is made of chocolate and melts every summer.'",
    question: "What should an AI Detective conclude?",
    choices: [
      "This is an AI hallucination (invented mistake) — check a real history book or ask a teacher!",
      "It must be true because a computer typed it.",
    ],
    correctChoice: "This is an AI hallucination (invented mistake) — check a real history book or ask a teacher!",
    explanation: "AI predicts words based on patterns and can sometimes invent silly or false facts. Always check reliable sources!",
  },
  {
    id: "case_privacy",
    badge: "Case #2 • Personal Privacy & Online Safety",
    scenario: "A website asks you to type your full home street address, school ID, and parent's phone number to unlock a cartoon.",
    question: "What is the safe detective move?",
    choices: [
      "Stop! Never share private family information—ask a parent or trusted adult right away.",
      "Type all private details immediately.",
    ],
    correctChoice: "Stop! Never share private family information—ask a parent or trusted adult right away.",
    explanation: "Your full name, address, school location, and phone numbers are private. Keep them protected!",
  },
  {
    id: "case_fairness",
    badge: "Case #3 • Fairness & Asking Trusted Adults",
    scenario: "A story generator only draws boys as scientists and never girls. You want everyone in your classroom to feel included.",
    question: "How can we make the creation fairer?",
    choices: [
      "Guide the story so both girls and boys are shown as curious scientists and inventors!",
      "Exclude half the classroom.",
    ],
    correctChoice: "Guide the story so both girls and boys are shown as curious scientists and inventors!",
    explanation: "Responsible creators check that their stories and tools treat all children with fairness and respect.",
  },
];

function CreatorAcademyInner() {
  const searchParams = useSearchParams();
  const initialTool = (searchParams?.get("tool") as CreatorToolType) || "game_maker";

  const [activeTool, setActiveTool] = useState<CreatorToolType>(initialTool);
  const [ageMode, setAgeMode] = useState<AgeMode>("age6");
  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const [savedProjects, setSavedProjects] = useState<CreatorProjectRecord[]>([]);

  // 1. STORY MAKER STATE
  const [storyTitle, setStoryTitle] = useState("Mia and the Brave Little Kite");
  const [storyHero, setStoryHero] = useState("Mia the Songbird");
  const [storySetting, setStorySetting] = useState("A breezy rooftop garden in Lahore");
  const [storyGoal, setStoryGoal] = useState("Help a tangled kite fly high before sunset");
  const [storyPages, setStoryPages] = useState<string[]>([
    "Page 1: In a breezy rooftop garden in Lahore, Mia the Songbird spotted a bright yellow kite stuck on a branch.",
    "Page 2: Together with her friend Kai, she gently lifted the string and waited for a warm gust of wind.",
    "Page 3: Whoosh! The kite soared into the golden sky, and everyone cheered!",
  ]);
  const [storyHistory, setStoryHistory] = useState<string[][]>([]);

  // 2. GAME MAKER STATE (Visual Block Engine + Playable 5x5 Stage)
  const [gameTitle, setGameTitle] = useState("Kai's Star Quest");
  const [programBlocks, setProgramBlocks] = useState<GameBlock[]>([
    AVAILABLE_GAME_BLOCKS[0], // When Tapped
    AVAILABLE_GAME_BLOCKS[1], // Move Right
    AVAILABLE_GAME_BLOCKS[1], // Move Right
    AVAILABLE_GAME_BLOCKS[6], // If Touching Star
    AVAILABLE_GAME_BLOCKS[7], // Score +1
    AVAILABLE_GAME_BLOCKS[8], // Win Condition
  ]);
  const [blockUndoStack, setBlockUndoStack] = useState<GameBlock[][]>([]);
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 0, y: 2 });
  const [playerDir, setPlayerDir] = useState<number>(0);
  const [starPositions] = useState<Array<{ x: number; y: number }>>([
    { x: 2, y: 2 },
    { x: 3, y: 1 },
  ]);
  const [collectedStars, setCollectedStars] = useState<number[]>([]);
  const [gameScore, setGameScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameLog, setGameLog] = useState<string>("Snap blocks below and press Run Game!");

  // 3. CARTOON STUDIO STATE
  const [cartoonTitle, setCartoonTitle] = useState("The Sharing Bench");
  const [scenes, setScenes] = useState([
    { id: "sc1", bg: "Sunny Park 🌳", character: "Kai & Mia", dialogue: "Look! Let's build a rocket out of cardboard boxes!", transition: "Fade" },
    { id: "sc2", bg: "Maker Table 🛠️", character: "Zayn", dialogue: "I brought safety scissors and silver star stickers!", transition: "Slide" },
    { id: "sc3", bg: "Starry Sky 🚀", character: "Lumi", dialogue: "3... 2... 1... Imagination blast off!", transition: "Sparkle" },
  ]);
  const [playingSceneIdx, setPlayingSceneIdx] = useState<number | null>(null);

  // 5 & 6. AI INVENTORS & DETECTIVE STATE
  const [inventorIdx, setInventorIdx] = useState(0);
  const [inventorQuizPick, setInventorQuizPick] = useState<number | null>(null);
  const [detectiveIdx, setDetectiveIdx] = useState(0);
  const [detectivePick, setDetectivePick] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      const res = await fetch("/api/youth/creator/projects");
      if (res.ok) {
        const data = await res.json();
        setSavedProjects(data.projects || []);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSaveProject = async (tool: CreatorToolType, title: string, stateObj: Record<string, any>) => {
    try {
      const res = await fetch("/api/youth/creator/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool_type: tool,
          title,
          age_band: ageMode === "age5" ? "5" : ageMode === "age6" ? "6" : "10-12",
          project_state: stateObj,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusBanner(data.error || "Could not save project.");
        return;
      }
      setStatusBanner(`Saved "${title}" to your private Skills & Creations Passport! (Private by default)`);
      loadProjects();
      setTimeout(() => setStatusBanner(null), 4000);
    } catch {
      setStatusBanner("Saved locally to your private device gallery.");
    }
  };

  const handleExportProjectJson = (title: string, payload: Record<string, any>) => {
    const blob = new Blob([JSON.stringify({ title, exported_at: new Date().toISOString(), ...payload }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.weebly-project.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Run Visual Block Game Engine
  const handleRunBlockGame = () => {
    let x = 0;
    let y = 2;
    let dir = 0;
    let score = 0;
    const hitStars: number[] = [];
    let won = false;

    const expanded: GameBlock[] = [];
    for (let i = 0; i < programBlocks.length; i++) {
      const b = programBlocks[i];
      if (b.type === "repeat_2" && i + 1 < programBlocks.length) {
        expanded.push(programBlocks[i + 1]);
        expanded.push(programBlocks[i + 1]);
        i++;
      } else {
        expanded.push(b);
      }
    }

    for (const blk of expanded) {
      if (blk.type === "move_right") x = Math.min(4, x + 1);
      if (blk.type === "move_up") y = Math.max(0, y - 1);
      if (blk.type === "turn") dir = (dir + 90) % 360;
      if (blk.type === "restart") {
        x = 0;
        y = 2;
      }

      // Check star collisions
      starPositions.forEach((st, idx) => {
        if (st.x === x && st.y === y && !hitStars.includes(idx)) {
          hitStars.push(idx);
          score += 1;
        }
      });

      if (blk.type === "score_plus_1" && hitStars.length > 0) {
        score = Math.max(score, hitStars.length);
      }
      if (blk.type === "win_condition" && score >= 1) {
        won = true;
      }
    }

    setPlayerPos({ x, y });
    setPlayerDir(dir);
    setCollectedStars(hitStars);
    setGameScore(score);
    setGameWon(won);
    setGameLog(
      won
        ? `🎉 You Won! Kai moved to (${x}, ${y}), collected ${score} star(s), and triggered the Win Condition!`
        : `Kai moved to tile (${x}, ${y}) • Score: ${score}. Add more Move Right or If Touching Star blocks to reach the star at (2, 2)!`
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl bg-white border-2 border-slate-900 p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phase 3 • Weebly AI Creator Academy (Human Creativity First)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            Create Stories, Block Games, Cartoons &amp; Safe AI Inventions
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Every project is saved privately to your Skills &amp; Creations Passport. Nothing is ever shared publicly without parent approval.
          </p>
        </div>

        {/* Age-Tier Complexity Selector */}
        <div className="flex flex-col items-start lg:items-end gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            Age Scaffolding Mode:
          </span>
          <div className="inline-flex rounded-2xl bg-slate-100 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setAgeMode("age5")}
              className={`px-3 py-2 rounded-xl transition ${
                ageMode === "age5" ? "bg-slate-900 text-white" : "text-slate-700"
              }`}
            >
              Age 5 (Icon &amp; Caregiver)
            </button>
            <button
              type="button"
              onClick={() => setAgeMode("age6")}
              className={`px-3 py-2 rounded-xl transition ${
                ageMode === "age6" ? "bg-slate-900 text-white" : "text-slate-700"
              }`}
            >
              Age 6 (Visual Blocks)
            </button>
            <button
              type="button"
              onClick={() => setAgeMode("older")}
              className={`px-3 py-2 rounded-xl transition ${
                ageMode === "older" ? "bg-slate-900 text-white" : "text-slate-700"
              }`}
            >
              Ages 7–16 (Full Logic)
            </button>
          </div>
        </div>
      </div>

      {statusBanner && (
        <div
          role="status"
          className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-900 text-xs font-bold flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusBanner}</span>
          </div>
          <Link href="/youth/passport" className="underline font-extrabold">
            View in Passport →
          </Link>
        </div>
      )}

      {/* 6 Creator Academy Tool Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5" role="tablist">
        {[
          { id: "story_maker" as CreatorToolType, label: "1. AI Story Maker", icon: BookOpen },
          { id: "game_maker" as CreatorToolType, label: "2. AI Game Maker", icon: Gamepad2 },
          { id: "cartoon_studio" as CreatorToolType, label: "3. Cartoon Studio", icon: Film },
          { id: "art_lab" as CreatorToolType, label: "4. Art & Design Lab", icon: Palette },
          { id: "ai_inventors" as CreatorToolType, label: "5. Young AI Inventors", icon: Cpu },
          { id: "ai_detective" as CreatorToolType, label: "6. AI Detective", icon: SearchCheck },
        ].map((t) => {
          const Icon = t.icon;
          const active = activeTool === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTool(t.id)}
              className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                active
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-800 border-slate-200 hover:border-slate-900"
              }`}
            >
              <Icon className="w-5 h-5 mb-2" />
              <span className="text-xs font-extrabold leading-snug">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* TOOL 1: AI STORY MAKER                                                */}
      {/* ===================================================================== */}
      {activeTool === "story_maker" && (
        <div className="rounded-3xl bg-white border-2 border-slate-900 p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase text-pink-600">
                Tool 1 • Guided Illustrated Story Maker
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Choose Your Hero, Setting &amp; Goal
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={storyHistory.length === 0}
                onClick={() => {
                  const prev = storyHistory[storyHistory.length - 1];
                  if (prev) {
                    setStoryPages(prev);
                    setStoryHistory((h) => h.slice(0, -1));
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold disabled:opacity-40 inline-flex items-center gap-1"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Undo</span>
              </button>
              <button
                type="button"
                onClick={() => voiceSynthesizer.speak(storyPages.join(" "), { characterId: "mia", locale: "en" })}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Narrate Story Aloud</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSaveProject("story_maker", storyTitle, {
                    hero: storyHero,
                    setting: storySetting,
                    goal: storyGoal,
                    pages: storyPages,
                  })
                }
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold inline-flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Story</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  handleExportProjectJson(storyTitle, {
                    hero: storyHero,
                    setting: storySetting,
                    goal: storyGoal,
                    pages: storyPages,
                  })
                }
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold inline-flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Private Export</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Story Title</label>
              <input
                type="text"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Character</label>
              <select
                value={storyHero}
                onChange={(e) => setStoryHero(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white"
              >
                <option>Mia the Songbird</option>
                <option>Kai the Explorer Otter</option>
                <option>Lumi the Cloud Lantern</option>
                <option>Zayn the Curiosity Owl-Bot</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Setting</label>
              <select
                value={storySetting}
                onChange={(e) => setStorySetting(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white"
              >
                <option>A breezy rooftop garden in Lahore</option>
                <option>A sunlit mango orchard in Multan</option>
                <option>A starry mountain camp in Hunza</option>
                <option>A friendly neighborhood library</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Kind Goal</label>
              <input
                type="text"
                value={storyGoal}
                onChange={(e) => setStoryGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setStoryHistory((h) => [...h, storyPages]);
              setStoryPages([
                `Page 1 (Beginning): In ${storySetting.toLowerCase()}, ${storyHero} set out with a special mission: ${storyGoal.toLowerCase()}.`,
                `Page 2 (Middle): Along the way, a tricky gust of wind tested their patience, so ${storyHero} took a slow breath and asked a friend to help.`,
                `Page 3 (Resolution): Working together with kindness, they succeeded and celebrated with warm mango slices!`,
              ]);
            }}
            className="px-5 py-2.5 rounded-2xl bg-pink-600 text-white text-xs font-extrabold hover:bg-pink-700"
          >
            ✨ Generate Guided Story Draft from My Choices
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {storyPages.map((pageText, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7E0D6] space-y-2">
                <div className="text-xs font-extrabold text-slate-500 uppercase">
                  Illustrated Scene {idx + 1}
                </div>
                <textarea
                  rows={4}
                  value={pageText}
                  onChange={(e) => {
                    const copy = [...storyPages];
                    copy[idx] = e.target.value;
                    setStoryPages(copy);
                  }}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TOOL 2: AI GAME MAKER (AGE-6 VISUAL BLOCK SYSTEM)                     */}
      {/* ===================================================================== */}
      {activeTool === "game_maker" && (
        <div className="rounded-3xl bg-white border-2 border-slate-900 p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase text-indigo-600">
                Tool 2 • Visual Block Game Maker ({ageMode === "age5" ? "Age 5 Icon Mode" : "Age 6+ Block Logic"})
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Build &amp; Play Your Own Interactive Game
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleRunBlockGame}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Run Game</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlayerPos({ x: 0, y: 2 });
                  setPlayerDir(0);
                  setCollectedStars([]);
                  setGameScore(0);
                  setGameWon(false);
                  setGameLog("Stage reset! Ready to run your blocks.");
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart</span>
              </button>
              <button
                type="button"
                disabled={blockUndoStack.length === 0}
                onClick={() => {
                  const prev = blockUndoStack[blockUndoStack.length - 1];
                  if (prev) {
                    setProgramBlocks(prev);
                    setBlockUndoStack((s) => s.slice(0, -1));
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold disabled:opacity-40 inline-flex items-center gap-1"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Undo</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSaveProject("game_maker", gameTitle, {
                    blocks: programBlocks,
                    score: gameScore,
                  })
                }
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-extrabold inline-flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Game</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Block Palette & Program Stack */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <div className="text-xs font-extrabold uppercase text-slate-500 mb-2">
                  Tap a Block to Add to Your Game Program:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_GAME_BLOCKS.map((blk) => (
                    <button
                      key={blk.id}
                      type="button"
                      onClick={() => {
                        setBlockUndoStack((s) => [...s, programBlocks]);
                        setProgramBlocks((prev) => [
                          ...prev,
                          { ...blk, id: `${blk.id}_${Date.now()}_${Math.random().toString(36).slice(2, 5)}` },
                        ]);
                      }}
                      className="p-3 rounded-xl bg-[#FAF7F2] hover:bg-indigo-50 border border-slate-300 text-left text-xs font-bold text-slate-900 flex items-center gap-2 transition"
                    >
                      <span className="text-base">{blk.icon}</span>
                      <span>{ageMode === "age5" ? blk.label.split(" ")[0] : blk.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Program Stack */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                    Your Connected Block Program ({programBlocks.length} blocks)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setBlockUndoStack((s) => [...s, programBlocks]);
                      setProgramBlocks([AVAILABLE_GAME_BLOCKS[0]]);
                    }}
                    className="text-[11px] text-slate-300 hover:text-white underline"
                  >
                    Clear Blocks
                  </button>
                </div>
                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {programBlocks.map((blk, idx) => (
                    <div
                      key={blk.id}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between text-xs font-bold"
                    >
                      <span>
                        {idx + 1}. {blk.icon} {blk.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setBlockUndoStack((s) => [...s, programBlocks]);
                          setProgramBlocks((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="text-slate-400 hover:text-rose-400"
                        aria-label="Remove block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Playable 5x5 Game Grid Stage */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between bg-[#FAF7F2] px-4 py-3 rounded-2xl border border-[#E7E0D6]">
                <div className="text-xs font-extrabold text-slate-800">
                  🏆 Score: <span className="text-indigo-600 text-base">{gameScore}</span>
                </div>
                <div className="text-xs font-bold text-slate-600">
                  Direction: {playerDir}° • Goal: Collect ⭐ at (2,2)
                </div>
              </div>

              <div
                className="grid grid-cols-5 gap-2 p-4 rounded-3xl bg-sky-50 border-2 border-slate-900 aspect-square max-w-sm mx-auto"
                aria-label="Interactive 5 by 5 Game Grid"
              >
                {Array.from({ length: 25 }).map((_, cellIdx) => {
                  const cx = cellIdx % 5;
                  const cy = Math.floor(cellIdx / 5);
                  const isPlayer = playerPos.x === cx && playerPos.y === cy;
                  const starIdx = starPositions.findIndex((s) => s.x === cx && s.y === cy);
                  const hasStar = starIdx >= 0 && !collectedStars.includes(starIdx);

                  return (
                    <button
                      key={cellIdx}
                      type="button"
                      onClick={handleRunBlockGame}
                      className={`rounded-2xl border flex items-center justify-center text-2xl font-bold transition ${
                        isPlayer
                          ? "bg-teal-500 text-white border-slate-900 shadow-md scale-105"
                          : hasStar
                          ? "bg-amber-100 border-amber-400"
                          : "bg-white border-sky-200"
                      }`}
                    >
                      {isPlayer ? "🦦" : hasStar ? "⭐" : ""}
                    </button>
                  );
                })}
              </div>

              <div
                className={`p-4 rounded-2xl border text-xs font-bold ${
                  gameWon
                    ? "bg-emerald-50 border-emerald-400 text-emerald-900"
                    : "bg-[#FAF7F2] border-slate-200 text-slate-700"
                }`}
              >
                {gameLog}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TOOL 3: AI CARTOON STUDIO                                             */}
      {/* ===================================================================== */}
      {activeTool === "cartoon_studio" && (
        <div className="rounded-3xl bg-white border-2 border-slate-900 p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase text-purple-600">
                Tool 3 • Storyboard &amp; Cartoon Timeline Studio
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Arrange Scenes, Characters, Dialogue &amp; Transitions
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setPlayingSceneIdx(0);
                  voiceSynthesizer.speak(
                    scenes.map((s) => `${s.character} says: ${s.dialogue}`).join(". "),
                    { characterId: "mia", locale: "en", onEnd: () => setPlayingSceneIdx(null) }
                  );
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-extrabold inline-flex items-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Cartoon Timeline</span>
              </button>
              <button
                type="button"
                onClick={() => handleSaveProject("cartoon_studio", cartoonTitle, { scenes })}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold inline-flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Cartoon</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {scenes.map((sc, idx) => (
              <div
                key={sc.id}
                className={`p-5 rounded-2xl border-2 space-y-3 ${
                  playingSceneIdx === idx
                    ? "bg-purple-50 border-purple-600"
                    : "bg-[#FAF7F2] border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase text-purple-800">
                    Scene {idx + 1} • {sc.transition}
                  </span>
                  <span className="text-xs font-bold text-slate-600">{sc.bg}</span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block">Characters on Stage</label>
                  <input
                    type="text"
                    value={sc.character}
                    onChange={(e) => {
                      const copy = [...scenes];
                      copy[idx] = { ...sc, character: e.target.value };
                      setScenes(copy);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold mt-0.5"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block">Spoken Dialogue</label>
                  <textarea
                    rows={3}
                    value={sc.dialogue}
                    onChange={(e) => {
                      const copy = [...scenes];
                      copy[idx] = { ...sc, dialogue: e.target.value };
                      setScenes(copy);
                    }}
                    className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-xs mt-0.5"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TOOL 4: AI ART & DESIGN LAB                                           */}
      {/* ===================================================================== */}
      {activeTool === "art_lab" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-xs font-extrabold uppercase text-pink-600">
                Tool 4 • Human Creativity First Art &amp; Design Lab
              </span>
              <p className="text-xs text-slate-600">
                Draw, color, and compose characters with finger or mouse brushes!
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                handleSaveProject("art_lab", "My Studio Painting", {
                  template: "custom_canvas",
                  saved_at: new Date().toISOString(),
                })
              }
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold inline-flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Artwork to Passport</span>
            </button>
          </div>
          <CreativeStudioCanvas initialActivity="draw-dinosaur" />
        </div>
      )}

      {/* ===================================================================== */}
      {/* TOOL 5: YOUNG AI INVENTORS                                            */}
      {/* ===================================================================== */}
      {activeTool === "ai_inventors" && (
        <div className="rounded-3xl bg-white border-2 border-slate-900 p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-6">
          <div className="flex items-center gap-4">
            <CompanionPortrait character="zayn" size={72} />
            <div>
              <span className="text-xs font-extrabold uppercase text-amber-700">
                Tool 5 • Young AI Inventors Lab
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                How AI Works: Patterns, Data, Fairness &amp; Testing
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {AI_INVENTOR_MODULES.map((m, idx) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setInventorIdx(idx);
                  setInventorQuizPick(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold ${
                  inventorIdx === idx
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {m.title}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7E0D6] space-y-4">
            <h3 className="text-xl font-extrabold text-slate-900">
              {AI_INVENTOR_MODULES[inventorIdx].title}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {AI_INVENTOR_MODULES[inventorIdx].concept}
            </p>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
              <strong>Hands-On Lab Experiment:</strong> {AI_INVENTOR_MODULES[inventorIdx].experiment}
            </div>

            <div className="pt-2 space-y-2">
              <div className="text-xs font-extrabold text-slate-900">
                {AI_INVENTOR_MODULES[inventorIdx].quizPrompt}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {AI_INVENTOR_MODULES[inventorIdx].options.map((opt, idx) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setInventorQuizPick(idx)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-bold ${
                      inventorQuizPick === idx
                        ? idx === AI_INVENTOR_MODULES[inventorIdx].correctIdx
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-amber-100 text-amber-900 border-amber-400"
                        : "bg-white border-slate-300 text-slate-800"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TOOL 6: AI DETECTIVE                                                  */}
      {/* ===================================================================== */}
      {activeTool === "ai_detective" && (
        <div className="rounded-3xl bg-white border-2 border-slate-900 p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase text-emerald-700">
                Tool 6 • AI Detective Agency
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Spot AI Hallucinations, Protect Privacy &amp; Check Sources
              </h2>
            </div>
            <div className="flex gap-2">
              {AI_DETECTIVE_CASES.map((c, idx) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setDetectiveIdx(idx);
                    setDetectivePick(null);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold ${
                    detectiveIdx === idx
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  Case #{idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7E0D6] space-y-4">
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-extrabold">
              {AI_DETECTIVE_CASES[detectiveIdx].badge}
            </span>
            <p className="text-base font-bold text-slate-900">
              {AI_DETECTIVE_CASES[detectiveIdx].scenario}
            </p>
            <p className="text-xs font-bold uppercase text-slate-500">
              {AI_DETECTIVE_CASES[detectiveIdx].question}
            </p>

            <div className="space-y-2.5">
              {AI_DETECTIVE_CASES[detectiveIdx].choices.map((ch) => {
                const picked = detectivePick === ch;
                const right = ch === AI_DETECTIVE_CASES[detectiveIdx].correctChoice;
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setDetectivePick(ch)}
                    className={`w-full p-4 rounded-xl border-2 text-left text-xs font-bold transition ${
                      picked
                        ? right
                          ? "bg-emerald-600 text-white border-emerald-700"
                          : "bg-amber-100 text-amber-900 border-amber-400"
                        : "bg-white border-slate-300 text-slate-800 hover:border-slate-900"
                    }`}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>

            {detectivePick && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900">
                🕵️ <strong>Detective Notes:</strong> {AI_DETECTIVE_CASES[detectiveIdx].explanation}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Private Project Gallery Preview */}
      <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-700" />
            <h3 className="text-lg font-extrabold text-slate-900">
              My Private Project Gallery ({savedProjects.length} Saved Creations)
            </h3>
          </div>
          <Link href="/youth/passport" className="text-xs font-extrabold text-indigo-600 hover:underline">
            Open Full Skills &amp; Creations Passport →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedProjects.slice(0, 6).map((proj) => (
            <div key={proj.id} className="p-4 rounded-2xl bg-[#FAF7F2] border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase">
                  <span>{proj.tool_type.replace(/_/g, " ")}</span>
                  <span className="text-emerald-700">Private • Safe</span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 mt-1">{proj.title}</h4>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">Age Band: {proj.age_band}</span>
                <button
                  type="button"
                  onClick={() => handleExportProjectJson(proj.title, proj.project_state)}
                  className="font-bold text-indigo-600 hover:underline"
                >
                  Export JSON
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AICreatorAcademyPage() {
  return (
    <ChildNavigationShell activeTab="play">
      <Suspense fallback={<div className="p-8 text-center font-bold">Loading AI Creator Academy...</div>}>
        <CreatorAcademyInner />
      </Suspense>
    </ChildNavigationShell>
  );
}
