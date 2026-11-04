"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Mic,
  MessageCircle,
  BookOpen,
  Heart,
  Palette,
  Activity,
  Award,
  Users,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Smile,
  Compass,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";

interface Step {
  number: string;
  title: string;
  subtitle: string;
  icon: any;
  surface: string;
  description: string;
  exampleLabel: string;
  exampleQuote: string;
  appHref: string;
  appCta: string;
}

const WEEBLY_STEPS: Step[] = [
  {
    number: "01",
    title: "Choose your learning companion",
    subtitle: "Select Kai, Mia, Lumi, or Zayn based on what you want to explore today",
    icon: Smile,
    surface: "bg-amber-50 border-amber-200",
    description:
      "Children are greeted by four friendly AI companions. Kai loves math and curiosity quests, Mia narrates bilingual stories, Lumi guides daily calm routines, and Zayn explores hands-on science and space.",
    exampleLabel: "Companion Personas:",
    exampleQuote:
      "Kai (Curiosity & STEM) • Mia (Stories & Language) • Lumi (Feelings & Calming) • Zayn (Science & Inventions)",
    appHref: "/demos",
    appCta: "Meet the AI Friends in Demo",
  },
  {
    number: "02",
    title: "Speak naturally in your language",
    subtitle: "Natural voice turn-taking in English, Urdu, and Pakistani Punjabi",
    icon: Mic,
    surface: "bg-blue-50 border-blue-200",
    description:
      "Children simply press the big microphone button and speak. Kai and Mia respond with warm, child-friendly speech, synchronized subtitles, and Socratic hints rather than just giving away direct answers.",
    exampleLabel: "What a child might ask:",
    exampleQuote:
      "“Kai, how do plants drink water through their roots?” or “Mia, ek sher aur chuhay ki kahani sunao!”",
    appHref: "/youth/dashboard",
    appCta: "Try Kids Magic Home",
  },
  {
    number: "03",
    title: "Journey through 6 learning worlds",
    subtitle: "Hands-on drawing, physical drills, coding logic, and moral adventures",
    icon: Compass,
    surface: "bg-purple-50 border-purple-200",
    description:
      "When a child wants to create, move, or practice, Weebly opens dedicated worlds: Creative Studio (guided drawing), Move & Play (sports drills), Story Adventure (branching tales), and Brain Quest (PCTB math & science).",
    exampleLabel: "Interactive Learning Worlds:",
    exampleQuote:
      "Creative Studio • Move & Play • Tech & Discovery • Life & Friendship • Story Adventure • Brain Quest",
    appHref: "/youth/play",
    appCta: "Explore Learning Worlds",
  },
  {
    number: "04",
    title: "Caregiver visibility without pressure",
    subtitle: "Weekly SMS summaries, learning diaries, and bedtime routines",
    icon: Heart,
    surface: "bg-emerald-50 border-emerald-200",
    description:
      "Parents view objective weekly learning progress, bedtime limits, and home observation notes. Weebly enforces strict non-diagnostic boundaries: we never label children with clinical psychiatric conditions.",
    exampleLabel: "Weekly Caregiver Dispatch:",
    exampleQuote:
      "“Maya completed 4 science quests on plant life cycles this week. Try asking her how leaves make food tonight!”",
    appHref: "/parent",
    appCta: "Open Parent Center",
  },
  {
    number: "05",
    title: "Empowered classroom teachers & schools",
    subtitle: "3,000-question PCTB library, instant question paper generation & roster tracking",
    icon: GraduationCap,
    surface: "bg-slate-50 border-slate-200",
    description:
      "Teachers generate printable test papers aligned with Punjab Curriculum and Textbook Board (PCTB) Student Learning Outcomes (SLOs) in seconds, reclaiming over 4 hours of grading time each week.",
    exampleLabel: "Teacher Studio Tools:",
    exampleQuote:
      "Customizable test paper builder with answer keys • Roster participation tracking • Formative mastery diagnostics",
    appHref: "/teacher/dashboard",
    appCta: "Open Teacher Studio",
  },
];

export default function HowItWorksPage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = WEEBLY_STEPS[activeStepIndex];

  return (
    <MarketingShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-16 space-y-16">
        {/* Hero Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>How Weebly Works</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Conversational learning, creativity, and family confidence.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Weebly combines natural voice companions, 3,000 curriculum questions, and safe learning worlds to help children grow with joy—supported by parents and teachers every step of the way.
          </p>
        </div>

        {/* Interactive Step Navigator */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Step Buttons (Left) */}
          <div className="lg:col-span-5 space-y-3">
            {WEEBLY_STEPS.map((step, idx) => {
              const isSelected = activeStepIndex === idx;
              const StepIcon = step.icon;
              return (
                <button
                  type="button"
                  key={step.number}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start space-x-4 ${
                    isSelected
                      ? "bg-white border-[#2B4CDE] shadow-md ring-2 ring-blue-100"
                      : "bg-slate-50/70 border-slate-200/80 hover:bg-white text-slate-600"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      isSelected
                        ? "bg-[#2B4CDE] text-white shadow-xs"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 text-sm">{step.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{step.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Step Detail Display (Right) */}
          <div className="lg:col-span-7">
            <div className={`p-8 sm:p-10 rounded-3xl border ${activeStep.surface} shadow-sm space-y-6 transition-all`}>
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full bg-white/90 border border-slate-200 text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Step {activeStep.number} of {WEEBLY_STEPS.length}
                </span>
                <span className="text-xs font-bold text-slate-500">Weebly Core Workflow</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {activeStep.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {activeStep.description}
                </p>
              </div>

              {/* Example Quote Card */}
              <div className="p-5 rounded-2xl bg-white/90 border border-slate-200/80 space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {activeStep.exampleLabel}
                </div>
                <p className="text-sm font-semibold text-slate-800 italic leading-relaxed">
                  {activeStep.exampleQuote}
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Link
                  href={activeStep.appHref}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#2B4CDE] hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all hover:shadow-lg"
                >
                  <span>{activeStep.appCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Safeguarding & Punjab Pilot Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Ethical AI Disclosure &bull; Zero Dark Patterns</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Built with care for children in Punjab and worldwide.
            </h2>
            <p className="text-sm text-slate-300">
              Explore our six interactive demonstrations or request an on-site pilot briefing for your school.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/demos"
              className="px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 text-sm transition-all shadow-md"
            >
              Explore 6 Demos
            </Link>
            <Link
              href="/schools/pilot"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all"
            >
              Punjab School Pilot
            </Link>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
