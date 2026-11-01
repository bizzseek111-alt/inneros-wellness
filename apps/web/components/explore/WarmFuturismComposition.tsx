"use client";

import React from "react";
import { Activity, Wind, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const WarmFuturismComposition: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6 md:p-10 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm text-[#263330]">
      {/* Direction Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#F3EFE8] pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#7D402D] text-[13px] font-medium mb-2">
            <span>Style 02</span>
            <span>&bull;</span>
            <span>Gentle Presence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight text-[#263330]">
            Warm Human Futurism
          </h2>
          <p className="text-[14.5px] text-[#52625E] mt-2 max-w-xl leading-relaxed">
            Soft peach and sage gradients, tactile rounded cards, and a responsive breathing companion orb that moves gently with your voice.
          </p>
        </div>
        <div className="text-[13px] font-medium text-[#7D402D] bg-[#F7E7E2] px-3.5 py-1.5 rounded-full border border-[#EED0C6] shrink-0">
          Palette: Warm Peach &amp; Botanical Teal
        </div>
      </div>

      {/* Composition Mockup */}
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-[#F7E7E2]/60 via-[#FAF8F4] to-[#E8F1EB]/70 border border-[#E6E0D6] flex flex-col items-center justify-center text-center space-y-4">
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#E8F1EB] via-[#F7E7E2] to-[#EDE8F5] p-1.5 shadow-sm border border-[#CFE2D6] flex items-center justify-center"
          >
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <Wind className="w-6 h-6 text-[#285B55]" />
            </div>
          </motion.div>
          <div>
            <h4 className="text-[15px] font-serif font-medium text-[#263330]">Breathing Companion Orb</h4>
            <p className="text-[13px] text-[#52625E] mt-0.5">Paced to 4-4-4-4 box breathing</p>
          </div>
          <div className="text-[12.5px] font-medium text-[#1F4742] bg-[#E8F1EB] px-3 py-1 rounded-full border border-[#CFE2D6]">
            Mode: Help Me Settle
          </div>
        </div>

        <div className="md:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-[#FAF8F4] border border-[#E6E0D6] space-y-3">
            <div className="flex items-center justify-between text-[13px] text-[#52625E]">
              <span className="font-medium text-[#285B55]">Companion Response</span>
              <span className="text-[#7D402D] font-medium">&bull; Warm &amp; Grounding</span>
            </div>
            <p className="text-[15px] text-[#263330] leading-relaxed">
              &ldquo;It sounds like today asked a lot of you. Let&rsquo;s lower your shoulders together and take ten quiet minutes where nothing needs to be fixed.&rdquo;
            </p>
            <div className="pt-2 flex items-center justify-between text-[13px] text-[#52625E]">
              <span>3 personal routines remembered</span>
              <span className="px-3 py-1.5 rounded-xl bg-[#E8F1EB] text-[#1F4742] font-medium inline-flex items-center space-x-1">
                <span>Start breathing exercise</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#EDE8F5]/50 border border-[#DCD3EC] flex items-center justify-between text-[13.5px]">
            <div className="flex items-center space-x-2 text-[#263330]">
              <Activity className="w-4 h-4 text-[#553E82]" />
              <span>Evening wind-down routine active</span>
            </div>
            <span className="text-[12.5px] text-[#553E82] font-medium">Gentle Check-in</span>
          </div>
        </div>
      </div>
    </div>
  );
};
