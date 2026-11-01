"use client";

import React from "react";
import { Circle, ArrowUpRight } from "lucide-react";

export const MinimalEQComposition: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6 md:p-10 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm text-[#263330]">
      {/* Direction Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#F3EFE8] pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#553E82] text-[13px] font-medium mb-2">
            <span>Style 03</span>
            <span>&bull;</span>
            <span>Focused Clarity</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight text-[#263330]">
            Minimal Calm
          </h2>
          <p className="text-[14.5px] text-[#52625E] mt-2 max-w-xl leading-relaxed">
            Spacious layout, gentle lavender accents, and distraction-free reading cards for exploring evidence-informed psychology and clear next steps.
          </p>
        </div>
        <div className="text-[13px] font-medium text-[#553E82] bg-[#EDE8F5] px-3.5 py-1.5 rounded-full border border-[#DCD3EC] shrink-0">
          Palette: Gentle Lavender &amp; Warm Ivory
        </div>
      </div>

      {/* Composition Mockup */}
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-4">
          <div className="p-6 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] space-y-3">
            <div className="flex items-center justify-between text-[13px] text-[#52625E]">
              <span className="font-medium text-[#553E82]">Psychology Insight &bull; Teach Me Mode</span>
              <span className="text-[#285B55] font-medium">Peer-Reviewed</span>
            </div>
            <p className="text-[15px] text-[#263330] leading-relaxed">
              When back-to-back meetings leave your mind racing, try <strong>Cognitive Defusion</strong>: instead of fighting a stressful thought, gently name it as &ldquo;a passing thought my mind is having right now.&rdquo;
            </p>
            <div className="pt-2 flex items-center justify-between text-[13px] text-[#52625E]">
              <span>Source: Acceptance &amp; Commitment Therapy (Hayes et al.)</span>
              <span className="text-[#285B55] font-medium inline-flex items-center space-x-1">
                <span>Read Guide</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#E8F1EB]/60 border border-[#CFE2D6] flex items-center justify-between text-[13.5px] text-[#1F4742]">
            <div className="flex items-center space-x-2">
              <Circle className="w-3 h-3 text-[#285B55] fill-[#285B55]" />
              <span>Memory Privacy: Only saves notes you explicitly approve</span>
            </div>
            <span className="font-medium text-[12.5px]">User-Controlled</span>
          </div>
        </div>

        <div className="md:col-span-4 p-6 rounded-2xl bg-[#EDE8F5]/50 border border-[#DCD3EC] flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-[12.5px] font-medium text-[#553E82]">Quiet Focus</span>
            <h4 className="text-[16px] font-serif font-medium text-[#263330]">Low Visual Noise</h4>
          </div>
          <div className="h-24 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white border border-[#DCD3EC] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#EDE8F5] border border-[#856BB8]" />
            </div>
          </div>
          <div className="text-[13px] text-[#52625E] pt-2 border-t border-[#DCD3EC]">
            Supports reduced motion &amp; high-contrast reading
          </div>
        </div>
      </div>
    </div>
  );
};
