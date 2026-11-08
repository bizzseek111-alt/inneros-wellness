"use client";

import React from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import {
  Heart,
  ShieldCheck,
  Globe,
  Compass,
  Sparkles,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const ETHICAL_PRINCIPLES = [
  {
    title: "1. Respect for Human Agency",
    description:
      "You decide how your companion responds, what it is allowed to remember, and when it stays quiet. We never use dark patterns, streak penalties, or guilt-based notifications to keep you in the app.",
  },
  {
    title: "2. Honest Non-Clinical Boundaries",
    description:
      "Weebly is an AI companion for reflection, everyday stress, and personal growth. It never claims to be a licensed therapist or doctor, never diagnoses medical conditions, and always provides clear pathways to human care.",
  },
  {
    title: "3. No Secret Profiling",
    description:
      "AI observations are never treated as objective facts about who you are. Every long-term memory begins as a transparent suggestion that you can confirm, edit, or dismiss.",
  },
  {
    title: "4. Supporting Real-World Life",
    description:
      "A healthy companion helps you feel more present in your own life and human relationships—never fostering emotional dependency or possessive attachment.",
  },
];

const PRIORITY_LANGUAGES = [
  { name: "English", native: "English", status: "Primary Supported" },
  { name: "Spanish", native: "Español", status: "Primary Supported" },
  { name: "French", native: "Français", status: "Primary Supported" },
  { name: "German", native: "Deutsch", status: "Primary Supported" },
  { name: "Bulgarian", native: "Български", status: "Primary Supported" },
  { name: "Arabic (RTL)", native: "العربية", status: "Dialect & Safety Evaluation" },
  { name: "Urdu (RTL)", native: "اردو", status: "Dialect & Safety Evaluation" },
  { name: "Hindi", native: "हिन्दी", status: "Dialect & Safety Evaluation" },
];

export default function AboutMarketingPage() {
  return (
    <MarketingShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-16 space-y-20">
        {/* Hero Section */}
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E8F1EB] border border-[#CFE2D6] text-[#1F4742] text-[13.5px] font-medium">
            <Heart className="w-4 h-4 text-[#285B55]" />
            <span>About Weebly</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#263330] tracking-tight leading-tight">
            Joyful, voice-first learning that respects child development, privacy, and families.
          </h1>
          <p className="text-[18px] text-[#52625E] leading-relaxed">
            We built Weebly because children deserve a warm, trustworthy place to explore curiosity, learn curriculum concepts, practice spoken language, and build life skills—without commercial ads, addictive hooks, or clinical profiling.
          </p>
        </div>

        {/* Mission & Design Philosophy Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="p-8 sm:p-10 rounded-[32px] bg-white border border-[#E6E0D6] shadow-sm space-y-4">
            <Badge variant="sage" size="sm">
              Our Mission
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#263330]">
              Foundational literacy, creativity, and life skills made voice-first and personal.
            </h2>
            <p className="text-[16px] text-[#52625E] leading-relaxed">
              From early childhood phonics to middle school science and emotional vocabulary, Weebly provides four friendly companions (Kai, Mia, Lumi, Zayn) that guide, listen, and encourage curiosity without doing the thinking for the child.
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-[32px] bg-[#F7E7E2] border border-[#EED2C9] shadow-sm space-y-4">
            <Badge variant="peach" size="sm">
              Design Philosophy
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#263330]">
              Warm Human Minimalism &bull; Playful, Safe &amp; Calm.
            </h2>
            <p className="text-[16px] text-[#52625E] leading-relaxed">
              We rejected loud gaming slots and dopamine traps in favor of gentle pastel surfaces, tactile illustrated characters, natural audio turn-taking, and clear non-clinical boundaries. Learning should feel joyful and grounded.
            </p>
          </div>
        </div>

        {/* Ethical Principles Section */}
        <section className="space-y-8">
          <div className="max-w-2xl space-y-2">
            <Badge variant="lavender" size="md">
              Ethical Foundation
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#263330]">
              Four principles that guide every product decision
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {ETHICAL_PRINCIPLES.map((item) => (
              <div
                key={item.title}
                className="p-7 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-3"
              >
                <div className="flex items-center space-x-2.5 text-[#285B55]">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <h3 className="text-xl font-serif font-medium text-[#263330]">
                    {item.title}
                  </h3>
                </div>
                <p className="text-[15.5px] text-[#52625E] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Multilingual Commitment */}
        <section className="p-8 sm:p-12 rounded-[36px] bg-white border border-[#E6E0D6] shadow-sm space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 text-[#285B55] text-[14px] font-semibold">
              <Globe className="w-4 h-4" />
              <span>Multilingual &amp; Cultural Care</span>
            </div>
            <h2 className="text-3xl font-serif font-medium text-[#263330]">
              Architected for 30 languages—with honest readiness standards
            </h2>
            <p className="text-[16px] text-[#52625E] leading-relaxed">
              Reflecting and learning in your native language—or switching naturally between languages—is deeply personal. Weebly is architected for English, Urdu (اردو), and Pakistani Punjabi (پنجابی) with native dialect validation gating. We never claim a voice is production-ready without real acoustic evaluation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRIORITY_LANGUAGES.map((lang) => (
              <div
                key={lang.name}
                className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[15px] text-[#263330]">
                    {lang.name}
                  </span>
                  <span className="text-[14px] font-serif text-[#285B55]">
                    {lang.native}
                  </span>
                </div>
                <span className="text-[12.5px] text-[#52625E] flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#285B55] shrink-0" />
                  <span>{lang.status}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-[#E8F1EB] border border-[#CFE2D6] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#263330]">
              Explore our interactive demos or start with Weebly today.
            </h2>
            <p className="text-[16px] text-[#52625E]">
              See how Kai, Mia, Lumi, and Zayn support joyful learning and confidence.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/trust">
              <Button variant="outline" size="md">
                Trust &amp; Safeguarding
              </Button>
            </Link>
            <Link href="/demos">
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Try Interactive Demos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
