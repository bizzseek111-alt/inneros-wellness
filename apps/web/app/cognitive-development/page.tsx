"use client";

import React from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import {
  Brain,
  Lightbulb,
  ArrowRight,
  Puzzle,
  Target,
  Sparkles,
  Layers,
  Compass,
  CheckCircle2
} from "lucide-react";

export default function CognitiveDevelopmentPage() {
  const COGNITIVE_PILLARS = [
    {
      title: "Executive Working Memory",
      desc: "Fun recall games and sequence matching grounded in Baddeley's multi-component working memory model.",
      icon: Brain
    },
    {
      title: "Flexible Problem-Solving",
      desc: "Step-by-step lateral thinking challenges that encourage multiple solutions without fear of 'wrong' answers.",
      icon: Puzzle
    },
    {
      title: "Focused Attention & Pacing",
      desc: "Attention network exercises designed to build sustained focus without digital hyperstimulation or streaks.",
      icon: Target
    },
    {
      title: "Curiosity & Inquiry-Based Thought",
      desc: "Interactive open-ended science, nature, and storytelling prompts encouraging children to ask 'Why?'.",
      icon: Lightbulb
    }
  ];

  return (
    <MarketingShell>
      <div className="bg-[#FAF9F5] min-h-screen text-[#1E293B]">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F0] bg-gradient-to-b from-[#EEF2FF] to-[#FAF9F5]">
          <div className="max-w-6xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-[#CBD5E1] shadow-xs text-xs font-semibold text-[#4F46E5]">
              <Brain className="w-4 h-4 text-[#4F46E5]" />
              <span>Cognitive Architecture &amp; Executive Functioning</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] max-w-4xl mx-auto leading-tight">
              Building curious, analytical minds through joyful inquiry.
            </h1>

            <p className="text-lg sm:text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed">
              Strengthening working memory, flexible problem-solving, and attention networks without high-dopamine gamified traps.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/youth/academy"
                className="px-8 py-3.5 rounded-full bg-[#4F46E5] text-white font-semibold text-sm hover:bg-[#4338CA] shadow-md transition-all inline-flex items-center space-x-2"
              >
                <span>Explore Academy Curriculum</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/research"
                className="px-8 py-3.5 rounded-full bg-white text-[#4F46E5] font-semibold text-sm hover:bg-[#F1F5F9] border border-[#CBD5E1] shadow-xs transition-all"
              >
                Scientific Framework
              </Link>
            </div>
          </div>
        </section>

        {/* Pillars Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COGNITIVE_PILLARS.map((sup, idx) => {
              const Icon = sup.icon;
              return (
                <div key={idx} className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A]">{sup.title}</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">{sup.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 text-center bg-white border-t border-[#E2E8F0]">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold text-[#0F172A]">Empower your child&apos;s critical thinking.</h2>
            <p className="text-sm text-[#64748B]">Explore original logic puzzles, reasoning stories, and planning tools.</p>
            <div className="pt-2">
              <Link
                href="/kids"
                className="px-8 py-3 rounded-full bg-[#4F46E5] text-white font-semibold text-sm hover:bg-[#4338CA] shadow-md transition-all inline-flex items-center space-x-2"
              >
                <span>Enter Weebly Kids</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
