"use client";

import React from "react";
import { Circle, Radio, ArrowUpRight, Compass, Shield } from "lucide-react";

export const MinimalEQComposition: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6 md:p-10 rounded-3xl bg-[#08080A] border border-white/[0.08] shadow-2xl text-[#E2E4E9]">
      {/* Direction Manifesto Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.08] pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#9D9AB4] text-xs font-mono tracking-widest uppercase mb-2">
            <span>Direction 03</span>
            <span>•</span>
            <span>The Zen Instrument</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-medium tracking-tight text-[#E2E4E9]">
            Minimal Emotional Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-[#9D9AB4] mt-2 max-w-xl font-normal leading-relaxed">
            Monastic discipline, maximum cognitive clarity, and zero emotional manipulation. Uses obsidian void, muted lavender frost, restrained teal, and a Swiss typographic grid for pure signal without fluff.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-[#4E878C] bg-[#4E878C]/10 px-3 py-1.5 rounded-full border border-[#4E878C]/30 shrink-0">
          <span>Palette: Obsidian & Muted Lavender</span>
        </div>
      </div>

      {/* Composition: Real Interface Mockup */}
      <div className="grid md:grid-cols-12 gap-6">
        {/* Minimalist Dialogue Turn */}
        <div className="md:col-span-8 space-y-4">
          <div className="p-6 rounded-xl bg-[#101014] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#9D9AB4]">
              <span>[PROMPT_ID: 1042]</span>
              <span className="text-[#4E878C]">SIGNAL: CLEAR</span>
            </div>
            <p className="text-sm text-[#E2E4E9] font-normal leading-relaxed">
              You noted back-to-back critiques induced cognitive fatigue. Cognitive Defusion experiment: label the urge to answer immediately as &lsquo;a passing verbal reflex&rsquo;.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs text-[#9D9AB4]">
              <span>Evidence: Hayes et al. (2011)</span>
              <button className="text-xs text-[#4E878C] hover:underline flex items-center space-x-1">
                <span>View Citation</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0C0C10] border border-white/[0.04] flex items-center justify-between text-xs text-[#9D9AB4]">
            <div className="flex items-center space-x-2">
              <Circle className="w-3 h-3 text-[#4E878C] fill-[#4E878C]" />
              <span>Consent Ledger: Memory persistence active (User-revocable)</span>
            </div>
            <span className="font-mono text-[10px]">GDPR Art. 17 Compliant</span>
          </div>
        </div>

        {/* Minimalist Frequency Sonar */}
        <div className="md:col-span-4 p-6 rounded-xl bg-[#101014] border border-white/[0.06] flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#9D9AB4]">Sonar Attunement</span>
            <h4 className="text-sm font-medium text-[#E2E4E9]">Harmonic Frequency</h4>
          </div>
          <div className="h-24 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-[#4E878C]/40 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-[#9D9AB4]/50 animate-ping" />
            </div>
          </div>
          <div className="text-[11px] font-mono text-[#9D9AB4] pt-2 border-t border-white/[0.06]">
            Delta: -12% Cognitive Load
          </div>
        </div>
      </div>
    </div>
  );
};
