"use client";

import React from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import {
  Eye,
  Sliders,
  Volume2,
  CheckCircle2,
  Keyboard,
  Sparkles,
  ShieldCheck
} from "lucide-react";

export default function AccessibilityPublicPage() {
  const ACCESSIBILITY_FEATURES = [
    {
      title: "Contrast Ratios Exceeding 4.5:1",
      desc: "All text, interactive controls, and visual cards are tested against WCAG 2.2 AA standards for high readability.",
      icon: Eye
    },
    {
      title: "Full Keyboard & Switch Access",
      desc: "All dialogs, buttons, and visual schedules can be operated without a mouse using standard Tab and Enter keybindings.",
      icon: Keyboard
    },
    {
      title: "Prefers-Reduced-Motion Support",
      desc: "Instant suppression of kinetic transitions, spinning loaders, and parallax effects based on system preferences.",
      icon: Sliders
    },
    {
      title: "Bi-Directional Nastaliq Typography",
      desc: "Optimized line heights and kerning for Urdu and Shahmukhi Punjabi scripts, preventing visual clustering on small screens.",
      icon: Volume2
    }
  ];

  return (
    <MarketingShell>
      <div className="bg-[#FAF9F5] min-h-screen text-[#1E293B]">
        {/* Hero Section */}
        <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F0] bg-white text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>WCAG 2.2 Level AA Accessibility Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A]">
              Accessibility &amp; Inclusive Digital Design
            </h1>
            <p className="text-base sm:text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
              Every child and teenager deserves access to emotional learning tools that adapt to their sensory and motor needs.
            </p>
          </div>
        </section>

        {/* Pillars Grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {ACCESSIBILITY_FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="p-6 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold text-[#0F172A]">{feat.title}</h2>
                  <p className="text-sm text-[#475569] leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
