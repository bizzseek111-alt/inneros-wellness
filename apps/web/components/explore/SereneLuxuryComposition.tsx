"use client";

import React, { useState } from "react";
import { Sparkles, Compass, Shield, Feather, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/primitives/Badge";

export const SereneLuxuryComposition: React.FC = () => {
  const [activePrompt, setActivePrompt] = useState<string | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6 md:p-10 rounded-3xl bg-[#090D16] border border-[#2B354F]/40 shadow-2xl text-[#FBF9F5]">
      {/* Direction Manifesto Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.08] pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#C5A880] text-xs font-mono tracking-widest uppercase mb-2">
            <span>Direction 01</span>
            <span>•</span>
            <span>The Contemplative Salon</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-[#FBF9F5]">
            Serene Luxury
          </h2>
          <p className="text-xs sm:text-sm text-[#A9B2C8] mt-2 max-w-xl font-light leading-relaxed">
            Architectural stillness, whisper-quiet prestige, and high editorial authority. Uses deep midnight ink, warm alabaster, and hairline champagne brass borders to create a timeless sanctuary.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-[#C5A880] bg-[#C5A880]/10 px-3 py-1.5 rounded-full border border-[#C5A880]/30 shrink-0">
          <span>Palette: Midnight Ink & Warm Alabaster</span>
        </div>
      </div>

      {/* Composition: Real Interface Mockup */}
      <div className="grid md:grid-cols-12 gap-6">
        {/* Main Dialogue Panel */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-[#111726]/80 border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between text-xs text-[#8994B0]">
              <span className="font-mono uppercase tracking-wider text-[10px]">Evening Reflection</span>
              <span>21:15</span>
            </div>
            <p className="font-serif text-lg text-[#FBF9F5] leading-relaxed italic">
              &ldquo;Notice where your mind travels when you release the demand to produce. What desires stillness tonight?&rdquo;
            </p>
            <div className="pt-2 flex items-center justify-between text-xs text-[#8994B0]">
              <span className="text-[11px] text-[#C5A880]">Elena &bull; 2 memories honored</span>
              <button className="text-xs text-[#C5A880] hover:underline flex items-center space-x-1">
                <span>Respond</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* User Reflection Card */}
          <div className="p-5 rounded-2xl bg-[#182136]/50 border border-white/[0.08] space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A880]">Elena Vance</span>
            <p className="text-sm text-[#E2E6F0] leading-relaxed font-light">
              &ldquo;The executive presentation felt charged today. I noticed my impulse to defend every design choice immediately. Practicing ACT defusion helped me pause and stay curious.&rdquo;
            </p>
          </div>
        </div>

        {/* Insight & Celestial Resonance Rail */}
        <div className="md:col-span-5 space-y-4">
          {/* Celestial Resonance Node */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#141C30] to-[#0D1322] border border-[#C5A880]/20 flex flex-col items-center text-center space-y-3">
            <div className="relative w-20 h-20 rounded-full border border-[#C5A880]/40 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#C5A880]/20 border border-[#C5A880] animate-pulse" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-medium text-[#FBF9F5]">Celestial Resonance</h4>
              <p className="text-[11px] text-[#A9B2C8] mt-0.5 font-light">Grounding &bull; 0.04 Hz Cadence</p>
            </div>
          </div>

          {/* Pacing Anchor */}
          <div className="p-4 rounded-xl bg-[#111726]/60 border border-white/[0.06] text-xs space-y-1.5">
            <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-wider">Circadian Rule</span>
            <h5 className="font-medium text-[#FBF9F5]">Rest is restorative architecture</h5>
            <p className="text-[11px] text-[#8994B0] leading-relaxed">
              Biological equilibrium requires periods of zero stimulation. Your evening curfew begins in 45 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
