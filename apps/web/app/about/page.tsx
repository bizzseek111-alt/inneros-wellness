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
      "InnerOS is an AI companion for reflection, everyday stress, and personal growth. It never claims to be a licensed therapist or doctor, never diagnoses medical conditions, and always provides clear pathways to human care.",
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
            <span>About InnerOS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#263330] tracking-tight leading-tight">
            Technology that respects your quiet moments, your privacy, and your humanity.
          </h1>
          <p className="text-[18px] text-[#52625E] leading-relaxed">
            We built InnerOS because people deserve a calm, trustworthy place to think out loud, reflect on their day, and navigate practical life challenges—without being tracked, analyzed in secret, or overwhelmed by clinical jargon.
          </p>
        </div>

        {/* Mission & Design Philosophy Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="p-8 sm:p-10 rounded-[32px] bg-white border border-[#E6E0D6] shadow-sm space-y-4">
            <Badge variant="sage" size="sm">
              Our Mission
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#263330]">
              Everyday emotional wellbeing made warm, accessible, and personal.
            </h2>
            <p className="text-[16px] text-[#52625E] leading-relaxed">
              Between busy workdays, family responsibilities, and constant digital noise, it is easy to lose touch with how you are actually feeling. InnerOS offers a steady, unhurried companion for the moments in between—helping you pause, name what is on your mind, and choose one gentle next step.
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-[32px] bg-[#F7E7E2] border border-[#EED2C9] shadow-sm space-y-4">
            <Badge variant="peach" size="sm">
              Design Philosophy
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#263330]">
              Warm Human Minimalism with Gentle Futurism.
            </h2>
            <p className="text-[16px] text-[#52625E] leading-relaxed">
              We rejected cold hospital dashboards and dark cybersecurity interfaces in favor of warm daylight surfaces (`#FAF8F4`), soft botanical accents, generous whitespace, and clear, human language. Technology should feel reassuring—not intimidating.
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
              Reflecting in your native language—or switching naturally between languages—is deeply personal. InnerOS is architected for 30 languages (including full right-to-left layout support for Arabic and Urdu), and we never claim a language is production-ready simply because a speech API supports it. Each language undergoes dialect, code-switching, and safety evaluation first.
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
              Explore our privacy controls or start using InnerOS today.
            </h2>
            <p className="text-[16px] text-[#52625E]">
              See how we protect your personal autonomy at every step.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/privacy-trust">
              <Button variant="outline" size="md">
                Privacy &amp; Trust
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
