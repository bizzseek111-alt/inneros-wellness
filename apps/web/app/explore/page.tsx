"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/shell/Header";
import { MobileNavigation } from "@/components/shell/MobileNavigation";
import { EmergencyModal } from "@/components/safety/EmergencyModal";
import { MemoryDrawer } from "@/components/memory/MemoryDrawer";
import { SereneLuxuryComposition } from "@/components/explore/SereneLuxuryComposition";
import { WarmFuturismComposition } from "@/components/explore/WarmFuturismComposition";
import { MinimalEQComposition } from "@/components/explore/MinimalEQComposition";
import { DirectionComparisonMatrix } from "@/components/explore/DirectionComparisonMatrix";
import { Compass, Sparkles, Feather, Wind, Radio, Trophy, ArrowRight } from "lucide-react";

export default function ExplorePage() {
  const [selectedDirection, setSelectedDirection] = useState<
    "luxury" | "futurism" | "minimal" | "matrix"
  >("luxury");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isHotlinesOpen, setIsHotlinesOpen] = useState(false);
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next === "dark");
      document.documentElement.classList.toggle("light", next === "light");
    }
  };

  const toggleReducedMotion = () => {
    setIsReducedMotion(!isReducedMotion);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("reduced-motion", !isReducedMotion);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme}`}>
      <Header
        currentTheme={theme}
        onToggleTheme={toggleTheme}
        isReducedMotion={isReducedMotion}
        onToggleReducedMotion={toggleReducedMotion}
        onOpenHotlines={() => setIsHotlinesOpen(true)}
        activeTab="explore"
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Page Hero */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-mono uppercase tracking-widest">
            <Compass className="w-4 h-4" />
            <span>Creative Direction Lab</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-ivory-100 tracking-tight">
            Visual Explorations for InnerOS
          </h1>
          <p className="text-sm text-ivory-400 max-w-2xl leading-relaxed">
            Three distinct architectural compositions exploring emotional comfort, editorial authority, and future-forward companionship without generic AI SaaS tropes.
          </p>
        </div>

        {/* Direction Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-midnight-900/90 border border-white/[0.08] w-fit">
          <button
            onClick={() => setSelectedDirection("luxury")}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-2 ${
              selectedDirection === "luxury"
                ? "bg-teal-950/80 text-teal-200 border border-teal-700/60 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
            }`}
          >
            <Feather className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>01. Serene Luxury</span>
          </button>

          <button
            onClick={() => setSelectedDirection("futurism")}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-2 ${
              selectedDirection === "futurism"
                ? "bg-teal-950/80 text-teal-200 border border-teal-700/60 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-[#E2875F]" />
            <span>02. Warm Futurism</span>
          </button>

          <button
            onClick={() => setSelectedDirection("minimal")}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-2 ${
              selectedDirection === "minimal"
                ? "bg-teal-950/80 text-teal-200 border border-teal-700/60 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-[#4E878C]" />
            <span>03. Minimal EQ</span>
          </button>

          <button
            onClick={() => setSelectedDirection("matrix")}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-2 ${
              selectedDirection === "matrix"
                ? "bg-teal-950/80 text-teal-200 border border-teal-700/60 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-teal-400" />
            <span>Evaluation Matrix</span>
          </button>
        </div>

        {/* Selected Composition Canvas */}
        <div className="pt-2">
          {selectedDirection === "luxury" && <SereneLuxuryComposition />}
          {selectedDirection === "futurism" && <WarmFuturismComposition />}
          {selectedDirection === "minimal" && <MinimalEQComposition />}
          {selectedDirection === "matrix" && (
            <DirectionComparisonMatrix onAdoptRecommended={() => setSelectedDirection("luxury")} />
          )}
        </div>

        {/* Call to Action Banner */}
        <div className="p-6 rounded-2xl bg-midnight-850/80 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-ivory-100">
              Ready to explore the master design tokens?
            </h4>
            <p className="text-xs text-ivory-400">
              Inspect semantic colors, typography scale, buttons, switches, and voice presence primitives.
            </p>
          </div>
          <Link
            href="/design-system"
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium flex items-center space-x-1.5 transition-colors shrink-0"
          >
            <span>View Design System</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

      <MobileNavigation
        activeTab="explore"
        onOpenMemory={() => setIsMemoryOpen(true)}
        onOpenHotlines={() => setIsHotlinesOpen(true)}
      />

      <EmergencyModal isOpen={isHotlinesOpen} onClose={() => setIsHotlinesOpen(false)} />
      <MemoryDrawer isOpen={isMemoryOpen} onClose={() => setIsMemoryOpen(false)} />
    </div>
  );
}
