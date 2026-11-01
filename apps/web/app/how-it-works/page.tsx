"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import {
  MessageCircle,
  Sliders,
  BookOpen,
  Sprout,
  Bookmark,
  ArrowRight,
  CheckCircle2,
  Sun,
  Coffee,
  Moon,
  Sparkles,
} from "lucide-react";

const FIVE_STEPS = [
  {
    number: "01",
    title: "Start a conversation",
    subtitle: "Speak out loud or write a few lines whenever you need a quiet moment",
    icon: MessageCircle,
    surface: "bg-[#E8F1EB] border-[#CFE2D6]",
    description:
      "Open InnerOS and begin talking in the Voice Room or typing in the Text Companion. You don’t need a structured agenda—share a busy thought, a difficult meeting, or how your energy feels today.",
    exampleLabel: "What you might say:",
    exampleQuote:
      "“I have a lot on my plate this week and I’m not sure where to start without feeling overwhelmed.”",
    appHref: "/companion/voice",
    appCta: "Try Starting a Conversation",
  },
  {
    number: "02",
    title: "Choose your preferred communication style",
    subtitle: "Set the mode, warmth, and language that fit what you need right now",
    icon: Sliders,
    surface: "bg-[#F7E7E2] border-[#EED2C9]",
    description:
      "Before or during any conversation, select how you’d like InnerOS to respond. Pick 'Just Listen' when you want empathetic space without advice, 'Help Me Understand' for gentle reflection, or 'Help Me Solve' for practical next steps.",
    exampleLabel: "Your controls:",
    exampleQuote:
      "Mode: Just Listen (No unsolicited advice) • Voice: Sanctuary Calm • Warmth: 85%",
    appHref: "/companion/chat",
    appCta: "Explore Conversation Modes",
  },
  {
    number: "03",
    title: "Reflect and learn",
    subtitle: "Unpack your thoughts with guided journaling and psychology guides",
    icon: BookOpen,
    surface: "bg-[#EDE8F5] border-[#DDD4EC]",
    description:
      "When a conversation sparks an insight, capture it in your private Journal or explore short, evidence-informed guides on stepping back from heavy thoughts, setting healthy boundaries, and calming physical tension.",
    exampleLabel: "Guided reflection prompt:",
    exampleQuote:
      "“Write down a thought that felt heavy today. Try starting with: ‘I notice I’m having the thought that...’”",
    appHref: "/journal",
    appCta: "Open Personal Journal",
  },
  {
    number: "04",
    title: "Create meaningful goals",
    subtitle: "Turn insights into small, values-aligned steps and gentle reminders",
    icon: Sprout,
    surface: "bg-white border-[#E6E0D6]",
    description:
      "Anchor a personal intention in My Growth—like protecting twenty minutes of quiet evening time—and optionally set a rest-friendly reminder that respects your Evening Quiet Hours.",
    exampleLabel: "Gentle step:",
    exampleQuote:
      "Intention: Protect quiet evenings • Step 1: Take a 15-minute walk after work before checking messages.",
    appHref: "/growth",
    appCta: "Set a Personal Intention",
  },
  {
    number: "05",
    title: "Review progress at your own pace",
    subtitle: "Approve helpful memories and revisit your connections without pressure",
    icon: Bookmark,
    surface: "bg-[#E8F1EB] border-[#CFE2D6]",
    description:
      "In Things I Remember, review suggested notes from your conversations, confirm what you’d like your companion to remember, and explore how your habits, values, and people connect—with zero streaks or guilt.",
    exampleLabel: "Confirmed memory:",
    exampleQuote:
      "“20-minute evening walks outside help me transition out of work stress.” (Confirmed by you • Editable anytime)",
    appHref: "/memory",
    appCta: "View Things I Remember",
  },
];

export default function HowItWorksPage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  return (
    <MarketingShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-16 space-y-20">
        {/* Hero Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E8F1EB] border border-[#CFE2D6] text-[#1F4742] text-[13.5px] font-medium">
            <Sparkles className="w-4 h-4 text-[#285B55]" />
            <span>How InnerOS Works</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#263330] tracking-tight">
            A calm, five-step rhythm designed around your pace.
          </h1>
          <p className="text-[18px] text-[#52625E] leading-relaxed">
            There is no complicated setup or rigid daily quota. Whether you visit for two minutes to breathe or twenty minutes to reflect, you are always in control.
          </p>
        </div>

        {/* Interactive Step Selector + Detailed View */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Step Navigation List */}
          <div className="lg:col-span-5 space-y-3">
            {FIVE_STEPS.map((step, idx) => {
              const isSelected = activeStepIndex === idx;
              return (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`w-full p-5 rounded-3xl border text-left transition-all flex items-start space-x-4 ${
                    isSelected
                      ? "bg-[#285B55] text-white border-[#285B55] shadow-md"
                      : "bg-white text-[#263330] border-[#E6E0D6] hover:border-[#285B55]/50"
                  }`}
                >
                  <span
                    className={`w-9 h-9 rounded-xl font-serif font-semibold text-[15px] flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-[#E8F1EB] text-[#285B55]"
                    }`}
                  >
                    {step.number}
                  </span>
                  <div className="space-y-1">
                    <h2 className="text-[17px] font-serif font-medium">
                      {step.title}
                    </h2>
                    <p
                      className={`text-[13.5px] leading-snug ${
                        isSelected ? "text-white/85" : "text-[#52625E]"
                      }`}
                    >
                      {step.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Active Step Spotlight Card */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-[36px] bg-white border border-[#E6E0D6] shadow-sm space-y-6">
            {(() => {
              const step = FIVE_STEPS[activeStepIndex];
              const Icon = step.icon;
              return (
                <>
                  <div className="flex items-center justify-between border-b border-[#F3EFE8] pb-5">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 rounded-2xl border ${step.surface} flex items-center justify-center text-[#285B55]`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[13px] font-semibold uppercase tracking-wider text-[#285B55]">
                          Step {step.number} of 05
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-serif font-medium text-[#263330]">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-[16.5px] text-[#263330] leading-relaxed">
                    {step.description}
                  </p>

                  <div className="p-6 rounded-3xl bg-[#FAF8F4] border border-[#E6E0D6] space-y-2">
                    <span className="text-[13px] font-semibold text-[#285B55] block">
                      {step.exampleLabel}
                    </span>
                    <p className="text-[16px] font-serif italic text-[#263330] leading-relaxed">
                      {step.exampleQuote}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                    <Link href={step.appHref}>
                      <Button
                        variant="primary"
                        size="md"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        {step.appCta}
                      </Button>
                    </Link>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={activeStepIndex === 0}
                        onClick={() =>
                          setActiveStepIndex(Math.max(0, activeStepIndex - 1))
                        }
                      >
                        Previous Step
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={activeStepIndex === FIVE_STEPS.length - 1}
                        onClick={() =>
                          setActiveStepIndex(
                            Math.min(FIVE_STEPS.length - 1, activeStepIndex + 1)
                          )
                        }
                      >
                        Next Step
                      </Button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* All 5 Steps Overview Cards */}
        <section className="space-y-8">
          <div className="space-y-2">
            <Badge variant="sage" size="sm">
              A Day with InnerOS
            </Badge>
            <h2 className="text-3xl font-serif font-medium text-[#263330]">
              How people use InnerOS across morning, afternoon, and evening
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-7 rounded-3xl bg-[#E8F1EB] border border-[#CFE2D6] space-y-3">
              <div className="flex items-center space-x-2 text-[#1F4742] font-semibold text-[15px]">
                <Sun className="w-5 h-5 text-[#285B55]" />
                <span>Morning Intention (2 mins)</span>
              </div>
              <h3 className="text-xl font-serif font-medium text-[#263330]">
                Start the day with clarity
              </h3>
              <p className="text-[14.5px] text-[#52625E] leading-relaxed">
                Complete a quick 4-choice mood check-in on the Home screen and choose one gentle focus for the day before opening work messages.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#E6E0D6] space-y-3 shadow-sm">
              <div className="flex items-center space-x-2 text-[#285B55] font-semibold text-[15px]">
                <Coffee className="w-5 h-5 text-[#285B55]" />
                <span>Midday Reset (5 mins)</span>
              </div>
              <h3 className="text-xl font-serif font-medium text-[#263330]">
                Untangle a busy afternoon
              </h3>
              <p className="text-[14.5px] text-[#52625E] leading-relaxed">
                Use the Voice Companion in &ldquo;Just Listen&rdquo; or &ldquo;Help Me Solve&rdquo; mode to talk through a stressful meeting and step back from heavy thoughts.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#EDE8F5] border border-[#DDD4EC] space-y-3">
              <div className="flex items-center space-x-2 text-[#423166] font-semibold text-[15px]">
                <Moon className="w-5 h-5 text-[#5A4878]" />
                <span>Evening Wind-Down (5 mins)</span>
              </div>
              <h3 className="text-xl font-serif font-medium text-[#263330]">
                Set down today’s worries
              </h3>
              <p className="text-[14.5px] text-[#52625E] leading-relaxed">
                Write a brief evening reflection in your Journal while Quiet Hours automatically silence routine notifications until morning.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-white border border-[#E6E0D6] shadow-sm text-center space-y-5">
          <h2 className="text-3xl font-serif font-medium text-[#263330]">
            Begin at your own pace
          </h2>
          <p className="text-[16px] text-[#52625E] max-w-xl mx-auto">
            Set up your preferred name, voice, and privacy choices in a few calm steps.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/onboarding">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Start Your Journey
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary" size="lg">
                Open Companion App
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
