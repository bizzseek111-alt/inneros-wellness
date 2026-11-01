"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";
import { prototypeService, PrototypeState } from "@/lib/prototype-service";
import {
  Mic,
  MessageCircle,
  BookOpen,
  Sprout,
  Clock,
  ArrowRight,
  Sun,
  Smile,
  Cloud,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const [state, setState] = useState<PrototypeState>(prototypeService.getState());
  const [selectedQuickMood, setSelectedQuickMood] = useState<string | null>(null);

  useEffect(() => {
    setState(prototypeService.getState());
  }, []);

  const quickMoodOptions = [
    { id: "calm", label: "Calm & Settled", bg: "bg-[#E8F1EB]", border: "border-[#CBE0D3]" },
    { id: "reflective", label: "Thoughtful", bg: "bg-[#EDE8F5]", border: "border-[#D8CEEA]" },
    { id: "tired", label: "Low Energy", bg: "bg-[#F3EFE8]", border: "border-[#E2DDD2]" },
    { id: "overwhelmed", label: "Carrying a Lot", bg: "bg-[#F7E7E2]", border: "border-[#E8CEC5]" },
  ];

  return (
    <SanctuaryShell>
      <div className="space-y-8 max-w-4xl">
        {/* 1. Friendly Greeting & Reassuring Header */}
        <section className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E8F1EB] border border-[#CBE0D3] text-[#1F4742] text-xs font-medium">
            <Sun className="w-3.5 h-3.5 text-[#285B55]" />
            <span>A quiet space for your day</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#263330] tracking-tight">
            Welcome back, {state.user.preferredName}.
          </h1>
          <p className="text-base sm:text-lg text-[#52625E] leading-relaxed max-w-2xl">
            Take a slow breath. There is no rush here—share what is on your mind, reflect in your journal, or simply rest.
          </p>
        </section>

        {/* 2. Prominent "Talk to Your Companion" Dual Entry Card (Voice + Text) */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E6E1D8] shadow-card space-y-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-xl">
              <div className="flex items-center space-x-2">
                <Badge variant="teal" size="sm">
                  AI Companion
                </Badge>
                <span className="text-xs text-[#52625E]">
                  Supportive, private &amp; non-judgmental
                </span>
              </div>
              <h2 className="text-2xl font-serif font-medium text-[#263330]">
                Talk to your companion
              </h2>
              <p className="text-base text-[#52625E] leading-relaxed">
                Whether you want someone to just listen, help untangle a feeling, or talk through a gentle next step, I am here whenever you are ready.
              </p>
            </div>

            {/* Soft Breathing Companion Orb Preview */}
            <div className="hidden sm:flex items-center justify-center shrink-0 pr-4">
              <Link
                href="/companion/voice"
                aria-label="Start voice conversation"
                className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-[#285B55] via-[#78AC8D] to-[#EDE8F5] flex items-center justify-center shadow-elevated animate-breathe group"
              >
                <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Mic className="w-7 h-7 text-[#285B55]" />
                </div>
              </Link>
            </div>
          </div>

          {/* Primary Voice & Text Conversation Entry Points */}
          <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-[#F3EFE8]">
            <Link
              href="/companion/voice"
              className="flex items-center justify-between p-4 rounded-2xl bg-[#285B55] hover:bg-[#1F4742] text-white transition-all shadow-sm group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 rounded-xl bg-white/15">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-medium text-base block">Start Voice Conversation</span>
                  <span className="text-xs text-white/80 block">
                    Speak naturally at your own pace
                  </span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/companion/chat"
              className="flex items-center justify-between p-4 rounded-2xl bg-[#E8F1EB] hover:bg-[#D5E6DC] text-[#263330] border border-[#CBE0D3] transition-all group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 rounded-xl bg-white text-[#285B55] shadow-xs">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-medium text-base block">Write in Text Chat</span>
                  <span className="text-xs text-[#52625E] block">
                    Quiet, thoughtful written conversation
                  </span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#285B55] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* 3. Gentle Optional Emotional Check-In */}
        <section className="p-6 rounded-3xl bg-[#FAF8F4] border border-[#E6E1D8] shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-serif font-medium text-[#263330]">
                How are you feeling right now?
              </h3>
              <p className="text-sm text-[#52625E]">
                Optional check-in — just a gentle moment to notice how you are doing.
              </p>
            </div>
            <Link
              href="/check-in"
              className="text-sm font-medium text-[#285B55] hover:underline flex items-center space-x-1 self-start sm:self-center"
            >
              <span>Full check-in</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickMoodOptions.map((mood) => {
              const isSelected = selectedQuickMood === mood.id;
              return (
                <button
                  key={mood.id}
                  onClick={() => setSelectedQuickMood(mood.id)}
                  className={`p-3.5 min-h-[52px] rounded-2xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-[#285B55] text-white border-[#285B55] shadow-sm font-medium"
                      : `${mood.bg} ${mood.border} text-[#263330] hover:shadow-xs`
                  }`}
                >
                  <span className="text-sm">{mood.label}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                </button>
              );
            })}
          </div>

          {selectedQuickMood && (
            <div className="pt-2 flex items-center justify-between text-sm text-[#285B55] bg-[#E8F1EB]/70 px-4 py-3 rounded-2xl border border-[#CBE0D3]">
              <span>Thank you for checking in with yourself. Would you like to reflect on this?</span>
              <Link href="/companion/chat" className="font-semibold underline ml-2 shrink-0">
                Talk about it
              </Link>
            </div>
          )}
        </section>

        {/* 4. Two-Column Gentle Cards: Daily Reflection + Today's Approved Reminders */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Small Daily Reflection Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#E6E1D8] shadow-card flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 text-[#263330] font-medium">
                  <div className="p-2 rounded-xl bg-[#EDE8F5] text-[#553E82]">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-base font-serif">Daily Reflection</span>
                </div>
                <span className="text-xs text-[#52625E]">
                  {state.journal[0]?.date || "Recent"}
                </span>
              </div>

              <h4 className="font-serif text-lg font-medium text-[#263330]">
                {state.journal[0]?.title || "A moment for yourself"}
              </h4>
              <p className="text-base text-[#52625E] line-clamp-3 leading-relaxed">
                {state.journal[0]?.content ||
                  "Write down a few thoughts from your day in a private, peaceful space."}
              </p>
            </div>

            <div className="pt-3 border-t border-[#F3EFE8] flex items-center justify-between">
              <span className="text-xs text-[#52625E]">Saved in your private journal</span>
              <Link
                href="/journal"
                className="text-sm font-medium text-[#285B55] hover:text-[#1F4742] flex items-center space-x-1"
              >
                <span>Open My Journal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Today's User-Approved Reminders */}
          <div className="p-6 rounded-3xl bg-white border border-[#E6E1D8] shadow-card flex flex-col justify-between space-y-5">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 text-[#263330] font-medium">
                  <div className="p-2 rounded-xl bg-[#F7E7E2] text-[#7D402D]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-base font-serif">Today&apos;s Gentle Reminders</span>
                </div>
                <Badge variant="peach" size="sm">
                  At your pace
                </Badge>
              </div>

              <div className="space-y-2.5">
                {state.reminders.slice(0, 2).map((rem) => (
                  <div
                    key={rem.id}
                    className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#EAE5DC] flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#263330]">{rem.title}</p>
                      <p className="text-xs text-[#52625E] mt-0.5 line-clamp-1">{rem.prompt}</p>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white border border-[#E4E0D8] text-[#285B55] shrink-0">
                      {rem.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#F3EFE8] flex items-center justify-between">
              <span className="text-xs text-[#52625E]">You can pause or adjust anytime</span>
              <Link
                href="/reminders"
                className="text-sm font-medium text-[#285B55] hover:text-[#1F4742] flex items-center space-x-1"
              >
                <span>Manage Reminders</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 5. One Optional Personal Growth Action */}
        <section className="p-6 rounded-3xl bg-[#E8F1EB]/60 border border-[#CBE0D3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-white text-[#285B55] border border-[#CBE0D3] shadow-xs shrink-0 mt-0.5">
              <Sprout className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#285B55]">
                  Personal Growth Focus
                </span>
              </div>
              <h3 className="text-lg font-serif font-medium text-[#263330]">
                {state.goals[0]?.horizonTitle || "Creating Space for Rest"}
              </h3>
              <p className="text-sm text-[#52625E] leading-relaxed max-w-xl">
                {state.goals[0]?.intention ||
                  "One small step today: pause for two minutes before transitioning between work and evening."}
              </p>
            </div>
          </div>

          <Link href="/growth" className="shrink-0">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View My Growth
            </Button>
          </Link>
        </section>

        {/* 6. Unobtrusive Access to Help */}
        <footer className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[#52625E] px-2">
          <div className="flex items-center space-x-2">
            <HeartHandshake className="w-4 h-4 text-[#285B55]" />
            <span>
              Looking for human support or crisis resources?{" "}
              <Link href="/safety" className="text-[#285B55] font-medium underline">
                Visit Help &amp; Support
              </Link>
            </span>
          </div>
          <Link href="/memory" className="text-[#52625E] hover:text-[#263330] underline">
            Review what InnerOS remembers
          </Link>
        </footer>
      </div>
    </SanctuaryShell>
  );
}
