"use client";

import React from "react";
import { Sparkles, Heart, Activity, Wind, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const WarmFuturismComposition: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6 md:p-10 rounded-3xl bg-[#0B1120] border border-[#3B497B]/40 shadow-2xl text-[#FAF8F5]">
      {/* Direction Manifesto Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.08] pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#E2875F] text-xs font-mono tracking-widest uppercase mb-2">
            <span>Direction 02</span>
            <span>•</span>
            <span>The Living Sanctuary</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-[#FAF8F5]">
            Warm Human Futurism
          </h2>
          <p className="text-xs sm:text-sm text-[#C4C0E3] mt-2 max-w-xl font-normal leading-relaxed">
            Organic empathy meets 2030 ambient intelligence. Uses twilight indigo, warm terracotta glow, soft pillowed surface elevations, and a fluid living companion sphere that breathes in circadian harmony.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-[#E2875F] bg-[#E2875F]/10 px-3 py-1.5 rounded-full border border-[#E2875F]/30 shrink-0">
          <span>Palette: Twilight Indigo & Warm Terracotta</span>
        </div>
      </div>

      {/* Composition: Real Interface Mockup */}
      <div className="grid md:grid-cols-12 gap-6">
        {/* Living Breathing Sphere */}
        <div className="md:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-[#18233C] to-[#0E1528] border border-white/[0.08] flex flex-col items-center justify-center text-center space-y-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#3D7E73] via-[#E2875F] to-[#4F5D95] p-1 shadow-[0_0_35px_rgba(226,135,95,0.35)] flex items-center justify-center"
          >
            <div className="w-full h-full rounded-full bg-[#0B1120] flex items-center justify-center">
              <Wind className="w-6 h-6 text-[#E2875F]" />
            </div>
          </motion.div>
          <div>
            <h4 className="text-sm font-semibold text-[#FAF8F5]">Living Resonance Presence</h4>
            <p className="text-xs text-[#C4C0E3] mt-0.5">Attuned to 4-4-4-4 box breathing</p>
          </div>
          <div className="text-[11px] font-mono text-[#3D7E73] bg-[#3D7E73]/15 px-2.5 py-1 rounded-full border border-[#3D7E73]/30">
            HRV Coherence: High
          </div>
        </div>

        {/* Tactile Pillowed Dialogue Card */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-[#141E34]/90 border border-white/[0.08] shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs text-[#8B9CD6]">
              <span className="font-mono text-[10px] uppercase">Companion Attunement</span>
              <span className="text-[#E2875F] font-medium">&bull; Grounding Warmth</span>
            </div>
            <p className="text-base text-[#FAF8F5] leading-relaxed">
              &ldquo;I sense the emotional residue from your workday. Let&rsquo;s gently lower your shoulders and give yourself permission to exist without solving anything for the next ten minutes.&rdquo;
            </p>
            <div className="pt-2 flex items-center justify-between text-xs text-[#8B9CD6]">
              <span>Context: 3 habit nodes referenced</span>
              <button className="px-3 py-1.5 rounded-xl bg-[#E2875F]/20 hover:bg-[#E2875F]/30 text-[#E2875F] font-medium transition-colors flex items-center space-x-1">
                <span>Breath pause</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#10192C]/70 border border-white/[0.06] flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-[#C4C0E3]">
              <Activity className="w-4 h-4 text-[#3D7E73]" />
              <span>Evening parasympathetic transition active</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">Autonomous Check-in</span>
          </div>
        </div>
      </div>
    </div>
  );
};
