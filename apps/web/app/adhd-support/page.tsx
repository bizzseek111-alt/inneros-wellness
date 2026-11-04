"use client";

import React from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import {
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Flame,
  LayoutGrid,
  HeartHandshake,
  AlertCircle
} from "lucide-react";

export default function ADHDSupportPage() {
  const ADHD_SUPPORTS = [
    {
      title: "Task Chunking & Micro-Steps",
      desc: "Deconstructs large, intimidating homework or chores into bite-sized 3–5 minute steps, preventing executive paralysis.",
      icon: LayoutGrid
    },
    {
      title: "First / Then Task Boards",
      desc: "Visually pairs a required focus activity with an immediate rewarding offline pause, eliminating power struggles.",
      icon: CheckCircle2
    },
    {
      title: "Visual Circular Timers",
      desc: "Non-stressful countdowns that represent time as an expanding pie chart rather than an alarming ticking clock.",
      icon: Clock
    },
    {
      title: "Kinesthetic Movement Breaks",
      desc: "Gentle physical prompts to jump, stretch, or do deep belly breathing to reset dopamine levels between learning modules.",
      icon: Zap
    }
  ];

  return (
    <MarketingShell>
      <div className="bg-[#FAF9F5] min-h-screen text-[#1E293B]">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F0] bg-gradient-to-b from-[#FFFBEB] to-[#FAF9F5]">
          <div className="max-w-6xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-[#CBD5E1] shadow-xs text-xs font-semibold text-[#B45309]">
              <Zap className="w-4 h-4 text-[#B45309]" />
              <span>Neurodiversity-Affirming Executive Function Center</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] max-w-4xl mx-auto leading-tight">
              Executive-function supports that honor how fast, creative minds work.
            </h1>

            <p className="text-lg sm:text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed">
              Visual schedules, micro-step task breakdowns, and positive reinforcement without shame, punishment, or clinical diagnosis.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/youth/routines"
                className="px-8 py-3.5 rounded-full bg-[#B45309] text-white font-semibold text-sm hover:bg-[#92400E] shadow-md transition-all inline-flex items-center space-x-2"
              >
                <span>Try First / Then Task Board</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/youth/support-center"
                className="px-8 py-3.5 rounded-full bg-white text-[#B45309] font-semibold text-sm hover:bg-[#F1F5F9] border border-[#CBD5E1] shadow-xs transition-all"
              >
                Explore Support Center
              </Link>
            </div>
          </div>
        </section>

        {/* Regulatory Disclosure Banner */}
        <section className="max-w-4xl mx-auto px-4 -mt-6">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start space-x-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Educational Support Disclaimer:</strong> Weebly provides organizational and psychological learning aids inspired by Universal Design for Learning. It is not an ADHD diagnosis tool, medical treatment, or prescription therapy.
            </p>
          </div>
        </section>

        {/* 4 Pillars */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADHD_SUPPORTS.map((sup, idx) => {
              const Icon = sup.icon;
              return (
                <div key={idx} className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A]">{sup.title}</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">{sup.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Interactive Feature Demo */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="p-8 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Interactive Preview</span>
            <h3 className="text-2xl font-bold text-[#0F172A]">How Micro-Step Chunking Works in Practice</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-amber-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-800">Step 1 of 3 (3 Minutes)</p>
                  <p className="text-sm font-semibold text-[#0F172A]">Clear desk: Put just pencils and one workbook on the table.</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-amber-600" />
              </div>
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between opacity-80">
                <div>
                  <p className="text-xs font-bold text-[#64748B]">Step 2 of 3 (10 Minutes)</p>
                  <p className="text-sm font-semibold text-[#0F172A]">Answer first 3 math problems, then celebrate with a high five.</p>
                </div>
                <Clock className="w-5 h-5 text-[#94A3B8]" />
              </div>
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between opacity-60">
                <div>
                  <p className="text-xs font-bold text-[#64748B]">Step 3 of 3 (2 Minutes)</p>
                  <p className="text-sm font-semibold text-[#0F172A]">Reward: 5-minute freeze dance or water break!</p>
                </div>
                <Zap className="w-5 h-5 text-[#94A3B8]" />
              </div>
            </div>

            <div className="pt-2 text-center">
              <Link
                href="/youth/routines"
                className="inline-flex items-center space-x-2 text-sm font-bold text-amber-700 hover:underline"
              >
                <span>Launch Interactive Task Tool in Weebly Kids</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 text-center bg-white border-t border-[#E2E8F0]">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold text-[#0F172A]">Support focus without the fighting.</h2>
            <p className="text-sm text-[#64748B]">Free, non-pathologizing visual supports for homes and classrooms.</p>
            <div className="pt-2">
              <Link
                href="/signup?role=caregiver"
                className="px-8 py-3 rounded-full bg-[#B45309] text-white font-semibold text-sm hover:bg-[#92400E] shadow-md transition-all inline-flex items-center space-x-2"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
