"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export const SereneLuxuryComposition: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6 md:p-10 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm text-[#263330]">
      {/* Direction Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#F3EFE8] pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#285B55] text-[13px] font-medium mb-2">
            <span>Style 01</span>
            <span>&bull;</span>
            <span>Editorial Stillness</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight text-[#263330]">
            Serene Sanctuary
          </h2>
          <p className="text-[14.5px] text-[#52625E] mt-2 max-w-xl leading-relaxed">
            Unhurried editorial typography, warm alabaster paper surfaces, and soft botanical sage accents designed for quiet evening journaling and contemplation.
          </p>
        </div>
        <div className="text-[13px] font-medium text-[#285B55] bg-[#E8F1EB] px-3.5 py-1.5 rounded-full border border-[#CFE2D6] shrink-0">
          Palette: Warm Alabaster &amp; Soft Sage
        </div>
      </div>

      {/* Composition Mockup */}
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] space-y-3">
            <div className="flex items-center justify-between text-[13px] text-[#52625E]">
              <span className="font-medium text-[#285B55]">Evening Reflection</span>
              <span>9:15 PM</span>
            </div>
            <p className="font-serif text-lg text-[#263330] leading-relaxed italic">
              &ldquo;Notice where your mind travels when you let go of the need to solve everything tonight. What feels ready to rest?&rdquo;
            </p>
            <div className="pt-2 flex items-center justify-between text-[13px] text-[#52625E]">
              <span>2 saved notes remembered</span>
              <span className="text-[#285B55] font-medium inline-flex items-center space-x-1">
                <span>Reflect</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#E8F1EB]/50 border border-[#CFE2D6] space-y-2">
            <span className="text-[12.5px] font-semibold text-[#1F4742]">Your Reflection</span>
            <p className="text-[14.5px] text-[#263330] leading-relaxed">
              &ldquo;The design review felt busy today. Stepping outside for a 20-minute walk before dinner helped me let go of the tension.&rdquo;
            </p>
          </div>
        </div>

        <div className="md:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] flex flex-col items-center text-center space-y-3">
            <div className="w-20 h-20 rounded-full bg-[#E8F1EB] border border-[#CFE2D6] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#285B55]/20 border border-[#285B55] animate-breathe" />
            </div>
            <div>
              <h4 className="font-serif text-[16px] font-medium text-[#263330]">Calm Breathing Pace</h4>
              <p className="text-[13px] text-[#52625E] mt-0.5">Slow 4-second inhale &bull; 4-second exhale</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7E7E2]/50 border border-[#EED0C6] text-[13.5px] space-y-1">
            <span className="text-[12px] font-semibold text-[#7D402D]">Evening Quiet Hours</span>
            <h5 className="font-medium text-[#263330]">Rest is protected</h5>
            <p className="text-[13px] text-[#52625E] leading-relaxed">
              Your quiet hours begin at 10:00 PM so notifications never interrupt your sleep.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
