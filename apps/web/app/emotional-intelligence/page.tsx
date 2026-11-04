"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import {
  Heart,
  Smile,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Sparkles,
  Users,
  Compass,
  CheckCircle2
} from "lucide-react";

export default function EmotionalIntelligencePage() {
  const [activeAge, setActiveAge] = useState<"2-5" | "6-12" | "13-18">("6-12");

  const EMOTION_AGE_TRACKS = {
    "2-5": {
      title: "Early Emotional Naming (Ages 2–5)",
      focus: "Caregiver-mediated somatic stories and large picture tiles.",
      skills: ["Big feeling identification (Happy, Mad, Sad, Scared)", "Belly breathing with stuffed animal", "Gentle boundary awareness"]
    },
    "6-12": {
      title: "Nuanced Affect Labeling (Ages 6–12)",
      focus: "Interactive Feelings Wheel, conflict resolution games, and empathy journeys.",
      skills: ["Expanding vocabulary (Frustrated vs. Disappointed)", "Vagal nerve double-inhale reset", "Perspective taking in school situations"]
    },
    "13-18": {
      title: "Adolescent Self-Regulation & Social Dynamics (Ages 13–18)",
      focus: "Private reflective journaling, relationship boundaries, and cognitive defusion.",
      skills: ["Navigating peer comparison and digital pressure", "Deconstructing all-or-nothing self-criticism", "Healthy help-seeking and boundary setting"]
    }
  };

  const selectedTrack = EMOTION_AGE_TRACKS[activeAge];

  return (
    <MarketingShell>
      <div className="bg-[#FAF9F5] min-h-screen text-[#1E293B]">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F0] bg-gradient-to-b from-[#FDF2F8] to-[#FAF9F5]">
          <div className="max-w-6xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-[#CBD5E1] shadow-xs text-xs font-semibold text-[#BE185D]">
              <Heart className="w-4 h-4 text-[#BE185D]" />
              <span>Social-Emotional Learning (CASEL 5 Aligned)</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] max-w-4xl mx-auto leading-tight">
              Giving children words for what they feel inside their bodies.
            </h1>

            <p className="text-lg sm:text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed">
              Based on Lieberman’s affect labeling research and CASEL competencies. Moving from reactive behavioral meltdowns to articulate emotional literacy.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/youth/emotions"
                className="px-8 py-3.5 rounded-full bg-[#BE185D] text-white font-semibold text-sm hover:bg-[#9D174D] shadow-md transition-all inline-flex items-center space-x-2"
              >
                <span>Explore Feelings Wheel</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/youth/academy"
                className="px-8 py-3.5 rounded-full bg-white text-[#BE185D] font-semibold text-sm hover:bg-[#F1F5F9] border border-[#CBD5E1] shadow-xs transition-all"
              >
                Curriculum Academy
              </Link>
            </div>
          </div>
        </section>

        {/* Age Band Progression */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              Emotional Literacy Scaled to Child Development
            </h2>
            <div className="flex justify-center gap-2 pt-2">
              {(["2-5", "6-12", "13-18"] as const).map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setActiveAge(age)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                    activeAge === age
                      ? "bg-[#BE185D] text-white shadow-xs"
                      : "bg-white text-[#64748B] border border-[#CBD5E1] hover:bg-[#F8FAFC]"
                  }`}
                >
                  Ages {age}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs space-y-6">
            <div className="border-b border-[#E2E8F0] pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#BE185D]">Developmental Focus</span>
              <h3 className="text-2xl font-bold text-[#0F172A] mt-1">{selectedTrack.title}</h3>
              <p className="text-sm text-[#475569] mt-2">{selectedTrack.focus}</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Core Competencies Practiced:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {selectedTrack.skills.map((skill, idx) => (
                  <li key={idx} className="p-4 rounded-2xl bg-[#FDF2F8] border border-[#FBCFE8] text-xs font-semibold text-[#831843] flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#BE185D] shrink-0" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 text-center bg-white border-t border-[#E2E8F0]">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold text-[#0F172A]">Start naming feelings with confidence.</h2>
            <p className="text-sm text-[#64748B]">Explore original stories, feeling wheels, and guided breathing exercises.</p>
            <div className="pt-2">
              <Link
                href="/kids"
                className="px-8 py-3 rounded-full bg-[#BE185D] text-white font-semibold text-sm hover:bg-[#9D174D] shadow-md transition-all inline-flex items-center space-x-2"
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
