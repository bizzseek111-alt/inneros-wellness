"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Shield,
  Heart,
  Smile,
  Compass,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe,
  Sliders,
  Award,
  Users,
} from "lucide-react";
import { LumiMascot } from "@/components/youth/LumiMascot";
import { useYouth } from "@/components/youth/YouthContext";

export default function YouthPublicHomePage() {
  const { ageTier, setAgeTier, locale, setLocale, localeMeta, t } = useYouth();
  const [selectedPreviewTier, setSelectedPreviewTier] = useState<"little" | "junior" | "teen">("junior");

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1A202C] flex flex-col selection:bg-[#B9E2FE]">
      {/* Navigation Header */}
      <header className="border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md px-6 py-4 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/youth" className="flex items-center space-x-2.5 rtl:space-x-reverse">
            <LumiMascot size="sm" state="idle" />
            <div>
              <span className="text-xl font-extrabold text-[#0F172A] tracking-tight block leading-tight">
                InnerOS Youth
              </span>
              <span className="text-[11px] font-bold text-[#36A871] block">
                Safe Emotional Sanctuary
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Link
              href="/caregiver/dashboard"
              className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full border border-[#CBD5E1] text-xs font-bold text-[#4A5568] hover:bg-[#FDFBF4] transition-colors"
            >
              Parents & Teachers
            </Link>
            <Link
              href="/youth/dashboard"
              className="px-4 py-2 rounded-full bg-[#0E87E3] hover:bg-[#0C436F] text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 rtl:space-x-reverse"
            >
              <span>Enter Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-6 max-w-5xl mx-auto text-center space-y-8 flex-1 flex flex-col justify-center">
        {/* Trust Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mx-auto">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Research-Backed &bull; Zero Addictive Loops &bull; COPPA & GDPR-K Certified</span>
        </div>

        {/* Mascot Centerpiece */}
        <div className="flex justify-center">
          <LumiMascot size="hero" state="idle" interactive />
        </div>

        {/* Main Headlines */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.15]">
            Emotional calm, curiosity, and confidence for every stage of growing up.
          </h1>
          <p className="text-lg sm:text-xl text-[#4A5568] leading-relaxed">
            Meet <strong className="text-[#0E87E3]">Lumi</strong>, a gentle non-human companion that listens, shares calming stories, and helps young minds name their feelings—without streaks, ads, or dark patterns.
          </p>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/youth/onboarding"
            className="px-8 py-3.5 rounded-full bg-[#0E87E3] hover:bg-[#0C436F] text-white font-extrabold text-base transition-all shadow-md flex items-center space-x-2"
          >
            <span>Start Free Journey</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
          <Link
            href="/youth/dashboard"
            className="px-8 py-3.5 rounded-full bg-white hover:bg-[#FDFBF4] text-[#0F172A] border-2 border-[#E2E8F0] font-bold text-base transition-all shadow-xs"
          >
            Explore Dashboard Demo
          </Link>
        </div>

        {/* 3 Age Tiers Interactive Showcase */}
        <div className="pt-12 text-start">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
              Designed specifically for three developmental stages
            </h2>
            <p className="text-sm text-[#718096]">
              Select an age tier below to explore how the experience adapts to child neurodevelopment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 1: Ages 2-5 */}
            <div
              onClick={() => {
                setSelectedPreviewTier("little");
                setAgeTier("little");
              }}
              className={`p-6 rounded-[30px] border-2 transition-all cursor-pointer flex flex-col justify-between ${
                selectedPreviewTier === "little"
                  ? "bg-[#FFF7F2] border-[#FF8E68] shadow-md ring-2 ring-[#FF8E68]/30"
                  : "bg-white border-[#E2E8F0] hover:border-[#FFD9C7]"
              }`}
            >
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#FFEEE5] text-[#F36437] inline-block">
                  Ages 2–5 &bull; Little Explorers
                </span>
                <h3 className="text-xl font-bold text-[#0F172A]">
                  Caregiver-Mediated Play
                </h3>
                <p className="text-xs text-[#4A5568] leading-relaxed">
                  Large tactile illustrated tiles, soothing animal audio tales, and gentle breathing exercises. Zero direct open AI chat.
                </p>
              </div>
              <ul className="mt-4 space-y-2 text-xs font-semibold text-[#718096]">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#36A871]" />
                  <span>Caregiver co-play prompts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#36A871]" />
                  <span>Bedtime story audio player</span>
                </li>
              </ul>
            </div>

            {/* Tier 2: Ages 6-12 */}
            <div
              onClick={() => {
                setSelectedPreviewTier("junior");
                setAgeTier("junior");
              }}
              className={`p-6 rounded-[30px] border-2 transition-all cursor-pointer flex flex-col justify-between ${
                selectedPreviewTier === "junior"
                  ? "bg-[#F0F8FF] border-[#38A8F8] shadow-md ring-2 ring-[#38A8F8]/30"
                  : "bg-white border-[#E2E8F0] hover:border-[#B9E2FE]"
              }`}
            >
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#E0F1FE] text-[#0C436F] inline-block">
                  Ages 6–12 &bull; Junior Adventurers
                </span>
                <h3 className="text-xl font-bold text-[#0F172A]">
                  Guided Curiosity & Literacy
                </h3>
                <p className="text-xs text-[#4A5568] leading-relaxed">
                  5 big tactile buttons: Talk, Learn, Feelings, Stories, and Activities. Visual schedules and focus activities.
                </p>
              </div>
              <ul className="mt-4 space-y-2 text-xs font-semibold text-[#718096]">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#36A871]" />
                  <span>Interactive feelings wheel</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#36A871]" />
                  <span>Safe, voice & text conversation</span>
                </li>
              </ul>
            </div>

            {/* Tier 3: Ages 13-18 */}
            <div
              onClick={() => {
                setSelectedPreviewTier("teen");
                setAgeTier("teen");
              }}
              className={`p-6 rounded-[30px] border-2 transition-all cursor-pointer flex flex-col justify-between ${
                selectedPreviewTier === "teen"
                  ? "bg-[#FAF7FD] border-[#9868CE] shadow-md ring-2 ring-[#9868CE]/30"
                  : "bg-white border-[#E2E8F0] hover:border-[#D3B9ED]"
              }`}
            >
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#F3EDFA] text-[#43256A] inline-block">
                  Ages 13–18 &bull; Youth Sanctuary
                </span>
                <h3 className="text-xl font-bold text-[#0F172A]">
                  Autonomy & Life Skills
                </h3>
                <p className="text-xs text-[#4A5568] leading-relaxed">
                  Private self-reflection journal, boundary setting scripts, study anxiety grounding, and teen-specialized crisis support.
                </p>
              </div>
              <ul className="mt-4 space-y-2 text-xs font-semibold text-[#718096]">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#36A871]" />
                  <span>Private diary with zero tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#36A871]" />
                  <span>Box breathing & somatic anchors</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Child Safety Non-Negotiable Commitment */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm text-start space-y-4">
          <div className="flex items-center space-x-2.5 text-emerald-700">
            <Shield className="w-6 h-6 shrink-0" />
            <h3 className="text-lg font-bold">Our Child-Safety & Anti-Addiction Guarantee</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2 text-xs text-[#4A5568]">
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E2E8F0] space-y-1">
              <strong className="text-[#0F172A] block font-bold">Zero Streaks or Guilt</strong>
              <span>We never penalize children for skipping days or closing the app.</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E2E8F0] space-y-1">
              <strong className="text-[#0F172A] block font-bold">No Commercial Ads</strong>
              <span>Zero profiling, data brokering, or third-party behavioral analytics.</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E2E8F0] space-y-1">
              <strong className="text-[#0F172A] block font-bold">Non-Clinical Boundary</strong>
              <span>We never diagnose conditions or replace trusted pediatricians and therapists.</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E2E8F0] space-y-1">
              <strong className="text-[#0F172A] block font-bold">Verified Parental Consent</strong>
              <span>Caregivers maintain transparent visibility and full deletion rights.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white px-6 py-6 text-center text-xs text-[#718096]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>&copy; 2026 InnerOS Youth Sanctuary &bull; Built with love for developing minds</span>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Link href="/youth/safety" className="hover:underline font-semibold text-rose-600">
              Safety Lifelines
            </Link>
            <Link href="/privacy-trust" className="hover:underline">
              Privacy & Trust
            </Link>
            <Link href="/caregiver/dashboard" className="hover:underline">
              Parent Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
