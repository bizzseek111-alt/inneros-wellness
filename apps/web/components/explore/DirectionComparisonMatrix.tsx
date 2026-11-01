"use client";

import React from "react";
import { Check, Star, ShieldCheck, Trophy, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/primitives/Badge";

export const DirectionComparisonMatrix: React.FC<{ onAdoptRecommended?: () => void }> = ({
  onAdoptRecommended,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6 md:p-8 rounded-3xl bg-midnight-900/90 border border-white/[0.08] shadow-2xl">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400">
            Creative Direction Evaluation
          </span>
          <h3 className="text-xl font-semibold text-ivory-100 font-sans-ui mt-0.5">
            Architectural Direction Matrix
          </h3>
        </div>
        <Badge variant="teal" size="md">
          Evaluation Verdict: Synthesized Sanctuary
        </Badge>
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] text-ivory-400 font-mono">
              <th className="py-3 px-3">Criteria</th>
              <th className="py-3 px-3">01. Serene Luxury</th>
              <th className="py-3 px-3">02. Warm Futurism</th>
              <th className="py-3 px-3">03. Minimal EQ</th>
              <th className="py-3 px-3 text-teal-300 font-semibold bg-teal-950/30 rounded-t-xl">
                Synthesis (Adopted)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-ivory-200">
            <tr>
              <td className="py-3.5 px-3 font-medium text-ivory-300">Emotional Comfort</td>
              <td className="py-3.5 px-3">Contemplative, quiet</td>
              <td className="py-3.5 px-3">Deeply nurturing & organic</td>
              <td className="py-3.5 px-3">Sterile / intellectual</td>
              <td className="py-3.5 px-3 font-semibold text-teal-200 bg-teal-950/20">
                Balanced: Warm & Grounded
              </td>
            </tr>
            <tr>
              <td className="py-3.5 px-3 font-medium text-ivory-300">Visual Sophistication</td>
              <td className="py-3.5 px-3">Very High (Editorial serif)</td>
              <td className="py-3.5 px-3">High (Neo-tactile)</td>
              <td className="py-3.5 px-3">Moderate (Swiss utility)</td>
              <td className="py-3.5 px-3 font-semibold text-teal-200 bg-teal-950/20">
                Ultra-High (Editorial + Modern)
              </td>
            </tr>
            <tr>
              <td className="py-3.5 px-3 font-medium text-ivory-300">Cognitive Load</td>
              <td className="py-3.5 px-3">Very Low</td>
              <td className="py-3.5 px-3">Low</td>
              <td className="py-3.5 px-3">Lowest</td>
              <td className="py-3.5 px-3 font-semibold text-teal-200 bg-teal-950/20">
                Low (Zero clutter or hype)
              </td>
            </tr>
            <tr>
              <td className="py-3.5 px-3 font-medium text-ivory-300">WCAG Contrast</td>
              <td className="py-3.5 px-3">AAA (High contrast)</td>
              <td className="py-3.5 px-3">AA+</td>
              <td className="py-3.5 px-3">AAA</td>
              <td className="py-3.5 px-3 font-semibold text-teal-200 bg-teal-950/20">
                WCAG AAA Compliant
              </td>
            </tr>
            <tr>
              <td className="py-3.5 px-3 font-medium text-ivory-300">Color Resonance</td>
              <td className="py-3.5 px-3">Midnight Ink & Brass</td>
              <td className="py-3.5 px-3">Twilight & Terracotta</td>
              <td className="py-3.5 px-3">Obsidian & Lavender</td>
              <td className="py-3.5 px-3 font-semibold text-teal-200 bg-teal-950/20">
                Midnight, Indigo, Lavender & Ivory
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Synthesis Verdict Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950/50 via-midnight-850 to-indigo-950/40 border border-teal-600/40 space-y-4">
        <div className="flex items-center space-x-2 text-teal-400 font-medium text-xs">
          <Trophy className="w-4 h-4" />
          <span>Recommended Architecture: &ldquo;Sanctuary Modern&rdquo;</span>
        </div>
        <h4 className="text-base font-semibold text-ivory-100 font-sans-ui">
          The Harmonious Synthesis of Serene Luxury + Warm Human Futurism
        </h4>
        <p className="text-xs text-ivory-300/90 leading-relaxed max-w-2xl">
          By combining the timeless editorial prestige of <strong>Serene Luxury</strong> with the tactile, biological empathy of <strong>Warm Human Futurism</strong>, InnerOS avoids both the sterility of clinical apps and the frivolousness of casual therapy chat bots. It delivers an authoritative sanctuary where users feel instantly safe, respected, and clear-minded.
        </p>
      </div>
    </div>
  );
};
