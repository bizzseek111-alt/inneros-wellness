"use client";

import React from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import {
  Sparkles,
  VolumeX,
  Layers,
  ArrowRight,
  Eye,
  Sliders,
  CheckCircle2,
  Heart,
  AlertCircle
} from "lucide-react";

export default function AutismSupportPage() {
  const AUTISM_PILLARS = [
    {
      title: "Picture-Based AAC Symbols",
      desc: "Tap-to-communicate visual picture tiles with multilingual text (English, Urdu, and Punjabi) for non-speaking or speech-fatigued children.",
      icon: Layers
    },
    {
      title: "Low-Sensory Stimulation Mode",
      desc: "Instant toggle to soften bright contrasts, remove animations, and silence background audio to prevent sensory overload.",
      icon: VolumeX
    },
    {
      title: "Literal, Clear Dialogue",
      desc: "Concrete communication that completely avoids confusing sarcasm, idioms, or metaphors, making interaction safe and predictable.",
      icon: Eye
    },
    {
      title: "Visual Transition Warnings",
      desc: "Gentle 5-minute and 2-minute visual cues before activities conclude, eliminating transition anxiety and sudden surprises.",
      icon: Sliders
    }
  ];

  return (
    <MarketingShell>
      <div className="bg-[#FAF9F5] min-h-screen text-[#1E293B]">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F0] bg-gradient-to-b from-[#F0FDF4] to-[#FAF9F5]">
          <div className="max-w-6xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-[#CBD5E1] shadow-xs text-xs font-semibold text-[#0F766E]">
              <Sparkles className="w-4 h-4 text-[#0F766E]" />
              <span>Autism-Affirming Sensory &amp; Communication Space</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] max-w-4xl mx-auto leading-tight">
              Predictable, respectful learning that never forces neurotypical masking.
            </h1>

            <p className="text-lg sm:text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed">
              AAC-compatible picture symbols, adjustable sensory settings, and literal communication designed with autistic self-advocacy principles.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/youth/visual-supports"
                className="px-8 py-3.5 rounded-full bg-[#0F766E] text-white font-semibold text-sm hover:bg-[#115E59] shadow-md transition-all inline-flex items-center space-x-2"
              >
                <span>Open Picture AAC Symbol Board</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/youth/accessibility"
                className="px-8 py-3.5 rounded-full bg-white text-[#0F766E] font-semibold text-sm hover:bg-[#F1F5F9] border border-[#CBD5E1] shadow-xs transition-all"
              >
                Sensory Preferences
              </Link>
            </div>
          </div>
        </section>

        {/* Sensory Regulatory Disclaimer */}
        <section className="max-w-4xl mx-auto px-4 -mt-6">
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs sm:text-sm flex items-start space-x-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <p>
              <strong>Neurodiversity Commitment:</strong> InnerOS never diagnoses autism, calculates &quot;autism risk&quot;, or uses coercive behavioral suppression. We honor harmless self-soothing behaviors, special interests, and diverse communication methods.
            </p>
          </div>
        </section>

        {/* Pillars Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AUTISM_PILLARS.map((sup, idx) => {
              const Icon = sup.icon;
              return (
                <div key={idx} className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A]">{sup.title}</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">{sup.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* AAC Symbols Showcase */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="p-8 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">AAC Symbol Board</span>
                <h3 className="text-2xl font-bold text-[#0F172A]">Sample Communication Tiles</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Tap to Select
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50 text-center space-y-2">
                <div className="text-2xl">🛑</div>
                <p className="text-xs font-bold text-emerald-900">Need a Break</p>
                <p className="text-[11px] text-emerald-700">مجھے وقفہ چاہیے</p>
              </div>
              <div className="p-4 rounded-2xl border border-[#CBD5E1] bg-white text-center space-y-2">
                <div className="text-2xl">💧</div>
                <p className="text-xs font-bold text-[#0F172A]">Water</p>
                <p className="text-[11px] text-[#64748B]">پانی</p>
              </div>
              <div className="p-4 rounded-2xl border border-[#CBD5E1] bg-white text-center space-y-2">
                <div className="text-2xl">🎧</div>
                <p className="text-xs font-bold text-[#0F172A]">Too Loud</p>
                <p className="text-[11px] text-[#64748B]">بہت شور ہے</p>
              </div>
              <div className="p-4 rounded-2xl border border-[#CBD5E1] bg-white text-center space-y-2">
                <div className="text-2xl">🫂</div>
                <p className="text-xs font-bold text-[#0F172A]">Want Hug / Space</p>
                <p className="text-[11px] text-[#64748B]">جگہ چاہیے</p>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/youth/visual-supports"
                className="inline-flex items-center space-x-2 text-sm font-bold text-[#0F766E] hover:underline"
              >
                <span>View Full AAC Communication Suite in InnerOS Kids</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 text-center bg-white border-t border-[#E2E8F0]">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold text-[#0F172A]">A calmer, more predictable digital environment.</h2>
            <p className="text-sm text-[#64748B]">Designed to lower cognitive load and celebrate diverse learning pathways.</p>
            <div className="pt-2">
              <Link
                href="/signup?role=caregiver"
                className="px-8 py-3 rounded-full bg-[#0F766E] text-white font-semibold text-sm hover:bg-[#115E59] shadow-md transition-all inline-flex items-center space-x-2"
              >
                <span>Create Caregiver Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
