"use client";

import React, { useState } from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { Button } from "@/components/primitives/Button";
import { Input } from "@/components/primitives/Input";
import { Badge } from "@/components/primitives/Badge";
import { Slider } from "@/components/primitives/Slider";
import { Switch } from "@/components/primitives/Switch";
import { MoodCheckIn } from "@/components/mood/MoodCheckIn";
import { GentleReminderBanner } from "@/components/notifications/GentleReminderBanner";
import { StateShowcase } from "@/components/states/StateShowcase";
import { Layers, Sliders, Type, Palette, Shield } from "lucide-react";

const WARM_PALETTE = [
  {
    name: "Warm Alabaster",
    hex: "#FAF8F4",
    role: "Primary background canvas",
    swatchClass: "bg-[#FAF8F4] border border-[#E6E0D6]",
  },
  {
    name: "Soft Sage",
    hex: "#E8F1EB",
    role: "Grounding cards & active states",
    swatchClass: "bg-[#E8F1EB] border border-[#CFE2D6]",
  },
  {
    name: "Warm Peach",
    hex: "#F7E7E2",
    role: "Gentle warmth & suggested notes",
    swatchClass: "bg-[#F7E7E2] border border-[#EED2C9]",
  },
  {
    name: "Gentle Lavender",
    hex: "#EDE8F5",
    role: "Reflective prompts & evening calm",
    swatchClass: "bg-[#EDE8F5] border border-[#DDD4EC]",
  },
  {
    name: "Deep Forest Teal",
    hex: "#285B55",
    role: "Primary interactive accent (7.4:1 AAA)",
    swatchClass: "bg-[#285B55]",
  },
  {
    name: "Rich Charcoal",
    hex: "#263330",
    role: "Primary body & heading text (11.2:1 AAA)",
    swatchClass: "bg-[#263330]",
  },
];

export default function DesignSystemPage() {
  const [sampleSliderVal, setSampleSliderVal] = useState(75);
  const [sampleSwitchVal, setSampleSwitchVal] = useState(true);

  return (
    <SanctuaryShell>
      <div className="max-w-6xl mx-auto space-y-10 pb-10">
        {/* Page Hero */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-[#285B55] text-[14px] font-medium">
            <Layers className="w-4 h-4" />
            <span>Weebly Design System &bull; Warm Human Minimalism</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#263330]">
            Warm Human Minimalism with Gentle Futurism
          </h1>
          <p className="text-[16px] text-[#52625E] max-w-2xl leading-relaxed">
            Built for emotional comfort, clarity, and calm readability—combining warm daylight surfaces, generous breathing room, and WCAG AAA text contrast.
          </p>
        </div>

        {/* 1. Color Palette Tokens */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-[15px] font-serif font-medium text-[#263330]">
            <Palette className="w-5 h-5 text-[#285B55]" />
            <span>1. Warm Daylight Color System</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {WARM_PALETTE.map((token) => (
              <div
                key={token.hex}
                className="p-4 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-2.5"
              >
                <div className={`h-14 rounded-2xl ${token.swatchClass}`} />
                <div>
                  <span className="font-semibold text-[14px] text-[#263330] block">
                    {token.name}
                  </span>
                  <span className="text-[13px] font-mono text-[#52625E]">
                    {token.hex}
                  </span>
                </div>
                <p className="text-[13px] text-[#52625E] leading-snug">
                  {token.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Typography Scale */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-[15px] font-serif font-medium text-[#263330]">
            <Type className="w-5 h-5 text-[#285B55]" />
            <span>2. Readable Editorial Typography</span>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-6">
            <div className="border-b border-[#F3EFE8] pb-5 space-y-1">
              <span className="text-[13px] font-medium text-[#285B55]">
                Editorial Serif Heading (Newsreader / Georgia)
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#263330] italic">
                &ldquo;A peaceful, reassuring space to pause, reflect, and feel heard.&rdquo;
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <span className="text-[13px] font-medium text-[#285B55]">
                  Readable Body Copy (17px / 1.65 Line Height)
                </span>
                <p className="text-[16.5px] text-[#263330] leading-relaxed mt-1.5">
                  Every screen is designed with comfortable line lengths (60–72ch), high-contrast charcoal text on warm alabaster paper, and zero tiny technical labels.
                </p>
              </div>
              <div>
                <span className="text-[13px] font-medium text-[#285B55]">
                  Secondary Supporting Copy (#52625E &bull; 5.6:1 AA+)
                </span>
                <p className="text-[15px] text-[#52625E] leading-relaxed mt-1.5">
                  Supporting hints and timestamps remain warm, legible, and approachable without competing with your primary conversation or journal reflection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Component Primitives */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-[15px] font-serif font-medium text-[#263330]">
            <Sliders className="w-5 h-5 text-[#285B55]" />
            <span>3. Accessible Buttons, Badges &amp; Controls</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-6">
              <h3 className="text-[16px] font-serif font-medium text-[#263330]">
                Buttons (44px+ Touch Targets)
              </h3>
              <div className="flex flex-wrap gap-2.5">
                <Button variant="primary">Primary Forest Teal</Button>
                <Button variant="secondary">Soft Sage</Button>
                <Button variant="outline">Warm Outline</Button>
                <Button variant="ghost">Subtle Ghost</Button>
                <Button variant="calm">Gentle Lavender</Button>
                <Button variant="emergency">Support Rose</Button>
              </div>

              <div className="pt-4 border-t border-[#F3EFE8]">
                <h3 className="text-[16px] font-serif font-medium text-[#263330] mb-3">
                  Soft Category Pills
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="sage">Confirmed by You</Badge>
                  <Badge variant="peach">Suggested Note</Badge>
                  <Badge variant="lavender">Evening Reflection</Badge>
                  <Badge variant="neutral">Daily Routine</Badge>
                  <Badge variant="emergency">24/7 Helpline</Badge>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-5">
              <h3 className="text-[16px] font-serif font-medium text-[#263330]">
                Inputs, Sliders &amp; Switches
              </h3>
              <Input
                label="Journal Reflection Title"
                placeholder="Write a gentle intention for today..."
                helperText="Your notes are private and editable anytime."
              />

              <Slider
                label="Companion Warmth"
                value={sampleSliderVal}
                onChange={setSampleSliderVal}
                valueDisplay={`${sampleSliderVal}%`}
              />

              <div className="pt-2">
                <Switch
                  label="Evening Quiet Hours"
                  description="Pauses routine check-ins while you rest."
                  checked={sampleSwitchVal}
                  onChange={setSampleSwitchVal}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4. Mood Check-In & Gentle Reminders */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-[15px] font-serif font-medium text-[#263330]">
            <Shield className="w-5 h-5 text-[#285B55]" />
            <span>4. Wellbeing Check-In &amp; Gentle Reminders</span>
          </div>

          <div className="grid md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-7">
              <MoodCheckIn />
            </div>

            <div className="md:col-span-5 space-y-4">
              <GentleReminderBanner
                title="Midday Breather"
                message="You’ve had a busy morning. Would you like to take 60 seconds to rest your eyes?"
              />
              <GentleReminderBanner
                title="Evening Wind-Down"
                timeContext="9:30 PM"
                message="Your quiet hours begin soon. Take a slow breath and let today’s unfinished tasks wait until tomorrow."
              />
            </div>
          </div>
        </section>

        {/* 5. Empty, Loading, Error & Success States */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-[15px] font-serif font-medium text-[#263330]">
            <Layers className="w-5 h-5 text-[#285B55]" />
            <span>5. Calm Empty, Loading &amp; Feedback States</span>
          </div>
          <StateShowcase />
        </section>
      </div>
    </SanctuaryShell>
  );
}
