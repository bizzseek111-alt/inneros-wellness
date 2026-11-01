"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { SereneLuxuryComposition } from "@/components/explore/SereneLuxuryComposition";
import { WarmFuturismComposition } from "@/components/explore/WarmFuturismComposition";
import { MinimalEQComposition } from "@/components/explore/MinimalEQComposition";
import { DirectionComparisonMatrix } from "@/components/explore/DirectionComparisonMatrix";
import { Compass, Feather, Wind, Radio, Trophy, ArrowRight } from "lucide-react";

export default function ExplorePage() {
  const [selectedDirection, setSelectedDirection] = useState<
    "luxury" | "futurism" | "minimal" | "matrix"
  >("luxury");

  return (
    <SanctuaryShell>
      <div className="max-w-6xl mx-auto space-y-6 pb-8">
        {/* Page Hero */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-[#285B55] text-[14px] font-medium">
            <Compass className="w-4 h-4" />
            <span>My Space</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#263330]">
            Personalize Your Sanctuary Atmosphere
          </h1>
          <p className="text-[15px] text-[#52625E] max-w-2xl leading-relaxed">
            Explore calm visual themes and layouts designed to make your personal space feel peaceful, warm, and inviting.
          </p>
        </div>

        {/* Direction Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white border border-[#E6E0D6] shadow-sm w-fit">
          <button
            onClick={() => setSelectedDirection("luxury")}
            className={`px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all flex items-center space-x-2 ${
              selectedDirection === "luxury"
                ? "bg-[#285B55] text-white shadow-sm"
                : "text-[#52625E] hover:text-[#263330] hover:bg-[#FAF8F4]"
            }`}
          >
            <Feather className="w-4 h-4" />
            <span>1. Serene Sanctuary</span>
          </button>

          <button
            onClick={() => setSelectedDirection("futurism")}
            className={`px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all flex items-center space-x-2 ${
              selectedDirection === "futurism"
                ? "bg-[#285B55] text-white shadow-sm"
                : "text-[#52625E] hover:text-[#263330] hover:bg-[#FAF8F4]"
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>2. Warm Futurism</span>
          </button>

          <button
            onClick={() => setSelectedDirection("minimal")}
            className={`px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all flex items-center space-x-2 ${
              selectedDirection === "minimal"
                ? "bg-[#285B55] text-white shadow-sm"
                : "text-[#52625E] hover:text-[#263330] hover:bg-[#FAF8F4]"
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>3. Minimal Calm</span>
          </button>

          <button
            onClick={() => setSelectedDirection("matrix")}
            className={`px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all flex items-center space-x-2 ${
              selectedDirection === "matrix"
                ? "bg-[#285B55] text-white shadow-sm"
                : "text-[#52625E] hover:text-[#263330] hover:bg-[#FAF8F4]"
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Compare Styles</span>
          </button>
        </div>

        {/* Selected Composition Canvas */}
        <div className="pt-1">
          {selectedDirection === "luxury" && <SereneLuxuryComposition />}
          {selectedDirection === "futurism" && <WarmFuturismComposition />}
          {selectedDirection === "minimal" && <MinimalEQComposition />}
          {selectedDirection === "matrix" && (
            <DirectionComparisonMatrix
              onAdoptRecommended={() => setSelectedDirection("luxury")}
            />
          )}
        </div>

        {/* Call to Action Banner */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-[16px] font-serif font-medium text-[#263330]">
              Want to inspect the color palette and typography system?
            </h4>
            <p className="text-[14px] text-[#52625E]">
              View our Warm Human Minimalism design tokens, buttons, cards, and accessible contrast guide.
            </p>
          </div>
          <Link
            href="/design-system"
            className="px-5 py-2.5 rounded-2xl bg-[#285B55] hover:bg-[#1F4742] text-white text-[14px] font-medium flex items-center space-x-2 transition-colors shrink-0"
          >
            <span>View Design System</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </SanctuaryShell>
  );
}
