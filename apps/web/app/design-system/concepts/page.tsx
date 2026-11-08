"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { CompanionPortrait, CompanionId } from "@/components/v9/CompanionPortrait";
import {
  WEEBLY_V9_PALETTE,
  WEEBLY_V9_COMPANION_TOKENS,
  WEEBLY_V9_LEARNING_WORLDS,
} from "@/design-system/weebly-v9-tokens";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";

type ConceptKey = "concept-a" | "concept-b" | "concept-c";

export default function DesignSystemConceptsPage() {
  const [activeConcept, setActiveConcept] = useState<ConceptKey>("concept-a");
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionId>("kai");
  const [speakingCompanion, setSpeakingCompanion] = useState<CompanionId | null>(null);

  const handlePlayVoice = async (id: CompanionId) => {
    setSpeakingCompanion(id);
    await voiceSynthesizer.playVoiceSample(id, "en");
    setSpeakingCompanion(null);
  };

  return (
    <MarketingShell>
      <div className="min-h-screen bg-[#FAF7F2] text-[#0F172A]">
        {/* Header Bar */}
        <section className="border-b border-[#E7E0D6] bg-white/85 backdrop-blur-md sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                Checkpoint 2 • Art Direction & Design System
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Weebly V9 — Three Original Homepage Art-Direction Concepts
              </h1>
            </div>

            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Art Direction Concepts">
              <button
                role="tab"
                aria-selected={activeConcept === "concept-a"}
                onClick={() => setActiveConcept("concept-a")}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeConcept === "concept-a"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Concept A: Warm Editorial Storybook (Selected)
              </button>
              <button
                role="tab"
                aria-selected={activeConcept === "concept-b"}
                onClick={() => setActiveConcept("concept-b")}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeConcept === "concept-b"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Concept B: Tactile Play Studio
              </button>
              <button
                role="tab"
                aria-selected={activeConcept === "concept-c"}
                onClick={() => setActiveConcept("concept-c")}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeConcept === "concept-c"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Concept C: Kinetic Constellation
              </button>
            </div>
          </div>
        </section>

        {/* Concept Preview Stage */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {activeConcept === "concept-a" && (
            <div className="rounded-3xl border border-[#E7E0D6] bg-[#FAF7F2] p-6 sm:p-12 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E7E0D6]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                    Selected Production Direction — Score: 96/100
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold mt-2">
                    Concept A: Warm Editorial Storybook & Living Companion Stage
                  </h2>
                  <p className="text-slate-600 mt-1 max-w-3xl">
                    Pairs warm ivory editorial typography (`#FAF7F2` & `#0F172A`) with an interactive live voice stage on the right. High trust for parents and school principals, immediate tactile delight for children.
                  </p>
                </div>
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                >
                  View Live on Homepage →
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-semibold">
                    <span>Ages 3–16 • English, Urdu & Punjabi Support</span>
                  </div>
                  <h3 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
                    Learning begins with a{" "}
                    <span className="text-indigo-600 underline decoration-amber-400 decoration-wavy decoration-2 underline-offset-8">
                      conversation.
                    </span>
                  </h3>
                  <p className="text-lg sm:text-xl text-slate-700 leading-relaxed max-w-2xl">
                    Weebly is a safe, voice-first learning and development world where children talk with four caring AI companions, explore six interactive learning worlds, and build real-world skills—guided by parents and teachers.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link
                      href="/demos"
                      className="px-6 py-3.5 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition shadow-sm"
                    >
                      Try Interactive Demo
                    </Link>
                    <Link
                      href="/youth/dashboard"
                      className="px-6 py-3.5 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 font-semibold hover:bg-slate-50 transition"
                    >
                      Enter Kids World
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-3xl bg-white border-2 border-slate-900 p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Interactive Companion Stage
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        Voice Ready
                      </span>
                    </div>

                    <div className="flex flex-col items-center text-center py-4">
                      <CompanionPortrait
                        character={selectedCompanion}
                        size={112}
                        state={speakingCompanion === selectedCompanion ? "speaking" : "idle"}
                      />
                      <h4 className="text-xl font-bold text-slate-900 mt-3">
                        {WEEBLY_V9_COMPANION_TOKENS[selectedCompanion].name}
                      </h4>
                      <p className="text-xs font-semibold text-indigo-600">
                        {WEEBLY_V9_COMPANION_TOKENS[selectedCompanion].role}
                      </p>
                      <p className="text-sm text-slate-600 mt-2 max-w-xs">
                        {WEEBLY_V9_COMPANION_TOKENS[selectedCompanion].tagline}
                      </p>
                      <button
                        type="button"
                        onClick={() => handlePlayVoice(selectedCompanion)}
                        className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                      >
                        🔊 Hear {WEEBLY_V9_COMPANION_TOKENS[selectedCompanion].name}&apos;s Voice
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-100">
                      {(["kai", "mia", "lumi", "zayn"] as CompanionId[]).map((id) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setSelectedCompanion(id)}
                          className={`p-2 rounded-xl border text-center transition ${
                            selectedCompanion === id
                              ? "border-slate-900 bg-slate-900 text-white font-bold"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <span className="text-xs capitalize">{id}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeConcept === "concept-b" && (
            <div className="rounded-3xl border-2 border-slate-900 bg-[#E0F2FE] p-6 sm:p-12">
              <div className="pb-6 mb-8 border-b border-sky-300">
                <span className="text-xs font-bold uppercase tracking-widest text-sky-900 bg-white px-3 py-1 rounded-full">
                  Concept B — Score: 88/100 (Adopted for Kids Magic Home `/youth/dashboard`)
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold mt-2 text-slate-900">
                  Concept B: Tactile Play Studio & Oversized Bento Tiles
                </h2>
                <p className="text-slate-700 mt-1 max-w-3xl">
                  Designed around oversized 88px touch orbs, chunky neo-brutalist cards, and zero-text navigation icons for early learners (ages 3–7). Adopted directly into the Kids Magic Home experience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {WEEBLY_V9_LEARNING_WORLDS.slice(0, 3).map((world) => (
                  <div
                    key={world.id}
                    className="rounded-3xl bg-white border-2 border-slate-900 p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between"
                  >
                    <div>
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: world.bgTint, color: world.color }}
                      >
                        Ages {world.ageBands.join(", ")}
                      </span>
                      <h3 className="text-2xl font-extrabold text-slate-900 mt-3">{world.title}</h3>
                      <p className="text-sm text-slate-600 mt-2">{world.description}</p>
                    </div>
                    <Link
                      href={world.href}
                      className="mt-6 inline-flex items-center justify-center px-5 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-sm"
                    >
                      Play in {world.title} →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeConcept === "concept-c" && (
            <div className="rounded-3xl bg-[#0F172A] text-white p-6 sm:p-12 border border-slate-800">
              <div className="pb-6 mb-8 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 bg-indigo-950 border border-indigo-700 px-3 py-1 rounded-full">
                  Concept C — Score: 82/100 (Adopted for Dark/Calm Evening Mode & Teen Focus)
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold mt-2">
                  Concept C: Kinetic Constellation & Deep Ink Observatory
                </h2>
                <p className="text-slate-300 mt-1 max-w-3xl">
                  High-contrast midnight canvas (`#0F172A`) with luminous companion constellations and calm sensory pacing. Ideal for older youth (13–16) and evening wind-down routines, while Concept A serves as the warm daytime default.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {(["kai", "mia", "lumi", "zayn"] as CompanionId[]).map((id) => {
                  const token = WEEBLY_V9_COMPANION_TOKENS[id];
                  return (
                    <div
                      key={id}
                      className="rounded-2xl bg-slate-900/90 border border-slate-700 p-5 flex flex-col items-center text-center"
                    >
                      <CompanionPortrait character={id} size={84} />
                      <h3 className="text-lg font-bold text-white mt-3">{token.name}</h3>
                      <p className="text-xs text-emerald-400 font-medium">{token.role}</p>
                      <p className="text-xs text-slate-400 mt-2">{token.tagline}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Token & Component Specification Matrix */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-10">
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 sm:p-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Weebly V9 Color & Surface Token System
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Calibrated for WCAG AA/AAA contrast, warm daytime readability, and zero visual fatigue.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
              {Object.entries(WEEBLY_V9_PALETTE).map(([name, hex]) => (
                <div key={name} className="rounded-2xl border border-slate-200 p-3 bg-slate-50/50">
                  <div
                    className="h-14 w-full rounded-xl border border-black/10"
                    style={{ backgroundColor: hex }}
                  />
                  <div className="mt-2 text-xs font-bold text-slate-900 truncate">{name}</div>
                  <div className="text-xs font-mono text-slate-500">{hex}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
