"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Sparkles, Heart, Smile, Sun, CloudRain, Zap, Frown, AlertCircle, ArrowLeft } from "lucide-react";
import { tokens } from "@/design-system/tokens";

export default function KidsSanctuaryPage() {
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);

  const feelings = [
    { label: "Happy", icon: Sun, color: "bg-amber-100 text-amber-800 border-amber-300" },
    { label: "Calm", icon: Sparkles, color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
    { label: "Sad", icon: CloudRain, color: "bg-sky-100 text-sky-800 border-sky-300" },
    { label: "Angry", icon: Zap, color: "bg-rose-100 text-rose-800 border-rose-300" },
    { label: "Worried", icon: Frown, color: "bg-purple-100 text-purple-800 border-purple-300" },
    { label: "Loved", icon: Heart, color: "bg-pink-100 text-pink-800 border-pink-300" },
  ];

  return (
    <main className="min-h-screen bg-[#FEFDF8] text-[#0F172A] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation & Safety Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-[#0284C7] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Weebly Sanctuary</span>
          </Link>

          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span>Development Preview &bull; Internal Safeguarding Review Active</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <Smile className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Weebly Kids Sandbox
          </h1>
          <p className="text-base text-[#475569] max-w-xl mx-auto leading-relaxed">
            A playful, gentle emotional playground designed for ages 6–12. Helping children name what they feel, take calm belly breaths, and build lifelong emotional awareness.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
              Ages 6–12
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              COPPA / GDPR-K Scoped
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              Zero Persistent Profiling
            </span>
          </div>
          <div className="pt-4">
            <Link
              href="/youth/dashboard?tier=junior"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-bold text-base shadow-sm hover:opacity-95 transition-all"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              <span>Launch Full Kids Dashboard & AI Voice Room &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Emotion Tap Grid */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-[#0F172A] text-center">
            How are you feeling right now?
          </h2>
          <p className="text-sm text-[#64748B] text-center">
            Tap a card below to practice gentle somatic breathwork.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {feelings.map((f) => {
              const Icon = f.icon;
              const isSelected = selectedFeeling === f.label;
              return (
                <button
                  key={f.label}
                  onClick={() => setSelectedFeeling(f.label)}
                  style={{ minHeight: tokens.youth.tiers.junior.touchTargetMin }}
                  className={`p-4 rounded-[24px] border-2 flex flex-col items-center justify-center space-y-2 transition-all text-center ${
                    f.color
                  } ${isSelected ? "ring-4 ring-emerald-400 scale-102 shadow-md" : "hover:scale-101"}`}
                >
                  <Icon className="w-7 h-7" />
                  <span className="text-base font-bold">{f.label}</span>
                </button>
              );
            })}
          </div>

          {selectedFeeling && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-fade-in">
              <p className="text-sm font-semibold text-emerald-900">
                You tapped <strong>{selectedFeeling}</strong>. Let’s take 3 gentle bubble breaths together: Inhale slowly... Exhale gently...
              </p>
            </div>
          )}
        </div>

        {/* Child Safety & Guardian Mandatory Gate Notice */}
        <div className="p-6 rounded-[24px] bg-amber-50/80 border border-amber-200 space-y-3">
          <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Strict Safeguarding & Parental Consent Notice</span>
          </div>
          <p className="text-xs text-amber-950 leading-relaxed">
            Weebly Kids strictly adheres to COPPA, GDPR-K, and the UK Age-Appropriate Design Code (AADC). All public experiences require verified parental consent (VPC). Zero commercial advertising, zero automated behavioral tracking, and zero unmoderated chat with strangers.
          </p>
          <div className="text-xs text-amber-900 pt-1 font-medium">
            Emergency Child Lifelines: Childline UK: <strong>0800 1111</strong> &bull; US Childhelp: <strong>1-800-422-4453</strong> &bull; Crisis Text Line: Text <strong>HOME to 741741</strong>
          </div>
        </div>
      </div>
    </main>
  );
}
