"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/shell/Header";
import { MobileNavigation } from "@/components/shell/MobileNavigation";
import { EmergencyModal } from "@/components/safety/EmergencyModal";
import { MemoryDrawer } from "@/components/memory/MemoryDrawer";
import { Button } from "@/components/primitives/Button";
import { Input } from "@/components/primitives/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/primitives/Card";
import { Badge } from "@/components/primitives/Badge";
import { Slider } from "@/components/primitives/Slider";
import { Switch } from "@/components/primitives/Switch";
import { LivingVoicePresence } from "@/components/voice/LivingVoicePresence";
import { MoodCheckIn } from "@/components/mood/MoodCheckIn";
import { GentleReminderBanner } from "@/components/notifications/GentleReminderBanner";
import { StateShowcase } from "@/components/states/StateShowcase";
import { tokens } from "@/design-system/tokens";
import { Layers, Sparkles, Sliders, Type, Palette, Shield, ArrowRight, Check } from "lucide-react";

export default function DesignSystemPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isHotlinesOpen, setIsHotlinesOpen] = useState(false);
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [sampleSliderVal, setSampleSliderVal] = useState(70);
  const [sampleSwitchVal, setSampleSwitchVal] = useState(true);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next === "dark");
      document.documentElement.classList.toggle("light", next === "light");
    }
  };

  const toggleReducedMotion = () => {
    setIsReducedMotion(!isReducedMotion);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("reduced-motion", !isReducedMotion);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme}`}>
      <Header
        currentTheme={theme}
        onToggleTheme={toggleTheme}
        isReducedMotion={isReducedMotion}
        onToggleReducedMotion={toggleReducedMotion}
        onOpenHotlines={() => setIsHotlinesOpen(true)}
        activeTab="design-system"
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-12">
        {/* Page Hero */}
        <div className="space-y-3 border-b border-white/[0.08] pb-6">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-mono uppercase tracking-widest">
            <Layers className="w-4 h-4" />
            <span>Design System Foundation &bull; Sanctuary Modern</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-ivory-100 tracking-tight">
            Design Tokens & Component Primitives
          </h1>
          <p className="text-sm text-ivory-400 max-w-2xl leading-relaxed">
            The unified design system for InnerOS. Built with WCAG AAA contrast, editorial typography, respectful microinteractions, and strict reduced-motion accessibility standards.
          </p>
        </div>

        {/* 1. Color Palette Tokens */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase text-ivory-300">
            <Palette className="w-4 h-4 text-teal-400" />
            <span>01. Coherent Color System</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Midnight Blue */}
            <div className="p-4 rounded-2xl bg-[#070B14] border border-white/[0.1] space-y-2">
              <div className="h-10 rounded-lg bg-[#070B14] border border-white/[0.1]" />
              <div className="text-xs">
                <span className="font-semibold text-ivory-100 block">Midnight Blue</span>
                <span className="text-[11px] font-mono text-zinc-400">#070B14</span>
              </div>
              <p className="text-[10px] text-zinc-400">Canvas void & grounding depth</p>
            </div>

            {/* Soft Indigo */}
            <div className="p-4 rounded-2xl bg-midnight-900 border border-white/[0.1] space-y-2">
              <div className="h-10 rounded-lg bg-[#4F64AA]" />
              <div className="text-xs">
                <span className="font-semibold text-ivory-100 block">Soft Indigo</span>
                <span className="text-[11px] font-mono text-zinc-400">#4F64AA</span>
              </div>
              <p className="text-[10px] text-zinc-400">Contemplative evening clarity</p>
            </div>

            {/* Muted Lavender */}
            <div className="p-4 rounded-2xl bg-midnight-900 border border-white/[0.1] space-y-2">
              <div className="h-10 rounded-lg bg-[#8983B3]" />
              <div className="text-xs">
                <span className="font-semibold text-ivory-100 block">Muted Lavender</span>
                <span className="text-[11px] font-mono text-zinc-400">#8983B3</span>
              </div>
              <p className="text-[10px] text-zinc-400">Ethereal reflection & nuance</p>
            </div>

            {/* Warm Ivory */}
            <div className="p-4 rounded-2xl bg-midnight-900 border border-white/[0.1] space-y-2">
              <div className="h-10 rounded-lg bg-[#FAF8F5] border border-zinc-300" />
              <div className="text-xs">
                <span className="font-semibold text-ivory-100 block">Warm Ivory</span>
                <span className="text-[11px] font-mono text-zinc-400">#FAF8F5</span>
              </div>
              <p className="text-[10px] text-zinc-400">Tactile human warmth</p>
            </div>

            {/* Restrained Teal */}
            <div className="p-4 rounded-2xl bg-midnight-900 border border-white/[0.1] space-y-2">
              <div className="h-10 rounded-lg bg-[#348680]" />
              <div className="text-xs">
                <span className="font-semibold text-ivory-100 block">Restrained Teal</span>
                <span className="text-[11px] font-mono text-zinc-400">#348680</span>
              </div>
              <p className="text-[10px] text-zinc-400">Autonomic vagal regulation</p>
            </div>

            {/* Crisis Rose */}
            <div className="p-4 rounded-2xl bg-midnight-900 border border-white/[0.1] space-y-2">
              <div className="h-10 rounded-lg bg-[#BE123C]" />
              <div className="text-xs">
                <span className="font-semibold text-ivory-100 block">Emergency Rose</span>
                <span className="text-[11px] font-mono text-zinc-400">#BE123C</span>
              </div>
              <p className="text-[10px] text-zinc-400">988 crisis hand-off alert</p>
            </div>
          </div>
        </section>

        {/* 2. Typography Scale */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase text-ivory-300">
            <Type className="w-4 h-4 text-teal-400" />
            <span>02. Editorial Typography Scale</span>
          </div>

          <div className="p-6 rounded-3xl bg-midnight-800/80 border border-white/[0.08] space-y-6">
            <div className="border-b border-white/[0.06] pb-4">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Editorial Display (Serif)</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-ivory-100 italic">
                &ldquo;Stillness is not the absence of thought, but presence without reaction.&rdquo;
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Humanist Body Sans (15px)</span>
                <p className="text-sm text-ivory-300 leading-relaxed mt-1">
                  When you introduce psychological space between sensation and identity, you regain the sovereign choice to act in harmony with what matters most.
                </p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Data & Ledger Mono (12px)</span>
                <p className="text-xs font-mono text-teal-300 mt-1">
                  CONSENT_VERIFIED: ENVELOPE_KEY_HKDF_256 [VALIDATED]
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Component Primitives (Buttons, Badges, Inputs, Sliders) */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase text-ivory-300">
            <Sliders className="w-4 h-4 text-teal-400" />
            <span>03. Component Primitives</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Buttons & Badges */}
            <div className="p-6 rounded-3xl bg-midnight-800/80 border border-white/[0.08] space-y-6">
              <h4 className="text-sm font-semibold text-ivory-100">Buttons & Variants</h4>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary">Primary Teal</Button>
                <Button variant="secondary">Secondary Slate</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="calm">Calm Indigo</Button>
                <Button variant="emergency">Emergency 988</Button>
              </div>

              <div className="pt-4 border-t border-white/[0.06]">
                <h4 className="text-sm font-semibold text-ivory-100 mb-3">Semantic Badges</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="neutral">Neutral System</Badge>
                  <Badge variant="teal">Autonomic Calm</Badge>
                  <Badge variant="lavender">Reflective Defusion</Badge>
                  <Badge variant="indigo">Contemplation</Badge>
                  <Badge variant="ivory">Ivory Contrast</Badge>
                  <Badge variant="emergency">Crisis Safeguard</Badge>
                </div>
              </div>
            </div>

            {/* Inputs & Controls */}
            <div className="p-6 rounded-3xl bg-midnight-800/80 border border-white/[0.08] space-y-5">
              <h4 className="text-sm font-semibold text-ivory-100">Controls & Inputs</h4>
              <Input
                label="Sanctuary Keyphrase"
                placeholder="Enter personal reflection topic..."
                helperText="Protected by AES-256-GCM envelope encryption."
              />

              <Slider
                label="Attunement Sensitivity"
                value={sampleSliderVal}
                onChange={setSampleSliderVal}
                valueDisplay={`${sampleSliderVal}%`}
              />

              <div className="pt-2">
                <Switch
                  label="Adaptive Voice Modulation"
                  description="Companion dynamically adjusts speech cadence to match your respiratory phase."
                  checked={sampleSwitchVal}
                  onChange={setSampleSwitchVal}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4. Living Voice Presence */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase text-ivory-300">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>04. Living AI Companion Voice Presence</span>
          </div>

          <div className="rounded-3xl bg-midnight-900 border border-white/[0.08] overflow-hidden">
            <LivingVoicePresence />
          </div>
        </section>

        {/* 5. Mood Check-In & Reminders */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase text-ivory-300">
            <Shield className="w-4 h-4 text-teal-400" />
            <span>05. Mood Selector & Gentle Notifications</span>
          </div>

          <div className="grid md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-7">
              <MoodCheckIn />
            </div>

            <div className="md:col-span-5 space-y-4">
              <GentleReminderBanner
                title="Midday Anchor"
                message="Your schedule indicates high context-switching today. Take 60 seconds to rest your gaze."
              />

              <GentleReminderBanner
                title="Evening Curfew"
                timeContext="21:30 Anchor"
                message="Dim ambient screens to allow melatonin synthesis to commence naturally."
              />
            </div>
          </div>
        </section>

        {/* 6. State Showcases (Empty, Loading, Error, Success) */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase text-ivory-300">
            <Layers className="w-4 h-4 text-teal-400" />
            <span>06. Empty, Loading, Error & Success States</span>
          </div>

          <StateShowcase />
        </section>
      </main>

      <MobileNavigation
        activeTab="design-system"
        onOpenMemory={() => setIsMemoryOpen(true)}
        onOpenHotlines={() => setIsHotlinesOpen(true)}
      />

      <EmergencyModal isOpen={isHotlinesOpen} onClose={() => setIsHotlinesOpen(false)} />
      <MemoryDrawer isOpen={isMemoryOpen} onClose={() => setIsMemoryOpen(false)} />
    </div>
  );
}
