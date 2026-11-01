"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { GentleReminderBanner } from "@/components/notifications/GentleReminderBanner";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";
import { prototypeService, PrototypeState } from "@/lib/prototype-service";
import {
  Sparkles,
  Mic,
  BookOpen,
  Target,
  Wind,
  Shield,
  Clock,
  ArrowRight,
  GitBranch,
  Lock,
  Calendar,
  Activity,
} from "lucide-react";

export default function DashboardPage() {
  const [state, setState] = useState<PrototypeState>(prototypeService.getState());

  useEffect(() => {
    setState(prototypeService.getState());
  }, []);

  return (
    <SanctuaryShell>
      <div className="space-y-8">
        {/* Circadian Hero Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-midnight-900 via-midnight-850 to-indigo-950/40 border border-white/[0.08] shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-mono uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Circadian Sanctuary Window &bull; Evening Reflection</span>
            </div>
            <Badge variant="teal" size="sm">
              Non-Clinical Companion Live
            </Badge>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-normal text-ivory-100 tracking-tight">
              Good evening, {state.user.preferredName}.
            </h1>
            <p className="text-xs sm:text-sm text-ivory-300 font-light max-w-2xl leading-relaxed">
              Your evening winding down window is active. What desires stillness before you close the day?
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            <Link href="/companion/voice">
              <Button size="sm" variant="primary" leftIcon={<Mic className="w-3.5 h-3.5" />}>
                Voice Sanctuary
              </Button>
            </Link>
            <Link href="/journal">
              <Button size="sm" variant="secondary" leftIcon={<BookOpen className="w-3.5 h-3.5" />}>
                Record Daily Reflection
              </Button>
            </Link>
            <Link href="/check-in">
              <Button size="sm" variant="calm" leftIcon={<Activity className="w-3.5 h-3.5" />}>
                Quick Mood Check-In
              </Button>
            </Link>
          </div>
        </div>

        {/* Gentle Notification Alert */}
        <GentleReminderBanner
          title="Evening Accommodation Pause"
          timeContext="21:15 Anchor"
          message="Notice your jaw and shoulders. If you are holding tension from the day's critique, try three elongated exhalations."
        />

        {/* Core Dashboard Bento Grid */}
        <div className="grid md:grid-cols-12 gap-6">
          {/* Active Growth Horizon Card */}
          <div className="md:col-span-7 p-6 rounded-3xl bg-midnight-900/90 border border-white/[0.08] shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center space-x-2 text-ivory-100 font-semibold text-sm">
                <Target className="w-4 h-4 text-teal-400" />
                <span>Active Growth Horizon</span>
              </div>
              <Badge variant="lavender" size="sm">
                Pacing & Boundaries
              </Badge>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-serif text-ivory-100">
                {state.goals[0]?.horizonTitle || "Non-Reactive Work Pacing"}
              </h3>
              <p className="text-xs text-ivory-300 font-light leading-relaxed">
                {state.goals[0]?.intention}
              </p>
            </div>

            {/* Milestones checklist preview */}
            <div className="space-y-2 pt-2">
              {state.goals[0]?.milestones.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center space-x-2.5 p-2 rounded-xl bg-midnight-950/60 border border-white/[0.04] text-xs text-ivory-200"
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      m.completed ? "bg-teal-900 text-teal-300 border border-teal-700" : "border border-zinc-600"
                    }`}
                  >
                    {m.completed ? "✓" : ""}
                  </div>
                  <span className={m.completed ? "line-through text-zinc-500" : ""}>{m.label}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href="/growth"
                className="text-xs text-teal-400 hover:text-teal-300 flex items-center space-x-1 font-medium"
              >
                <span>View Growth Horizons</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Recent Encrypted Reflection Preview */}
          <div className="md:col-span-5 p-6 rounded-3xl bg-midnight-900/90 border border-white/[0.08] shadow-md space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center space-x-2 text-ivory-100 font-semibold text-sm">
                  <Lock className="w-4 h-4 text-teal-400" />
                  <span>Recent Encrypted Journal</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">
                  {state.journal[0]?.date || "2026-10-31"}
                </span>
              </div>

              <h4 className="font-serif text-sm font-medium text-ivory-100 leading-snug">
                {state.journal[0]?.title}
              </h4>
              <p className="text-xs text-ivory-300/80 line-clamp-3 font-light leading-relaxed">
                {state.journal[0]?.content}
              </p>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center space-x-1 text-[11px] text-zinc-500 font-mono">
                <span>AES-256 HKDF</span>
              </div>
              <Link
                href="/journal"
                className="text-xs text-teal-400 hover:text-teal-300 flex items-center space-x-1 font-medium"
              >
                <span>Full Journal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Life Graph & Evidence Strip */}
        <div className="grid sm:grid-cols-2 gap-6">
          <Link
            href="/memory"
            className="p-5 rounded-2xl bg-midnight-900/70 border border-white/[0.06] hover:border-white/[0.14] transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-teal-950 text-teal-300 border border-teal-800">
                <GitBranch className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-ivory-100 group-hover:text-teal-300 transition-colors">
                  Personal Life Graph
                </h4>
                <p className="text-xs text-zinc-400">
                  {state.lifeGraph.nodes.length} consent nodes &bull; {state.lifeGraph.edges.length} edges
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-teal-400 transition-colors" />
          </Link>

          <Link
            href="/knowledge"
            className="p-5 rounded-2xl bg-midnight-900/70 border border-white/[0.06] hover:border-white/[0.14] transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-800">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-ivory-100 group-hover:text-indigo-300 transition-colors">
                  Psychology & Breathwork Library
                </h4>
                <p className="text-xs text-zinc-400">
                  ACT Defusion, Polyvagal Theory & Box Breathing
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
          </Link>
        </div>
      </div>
    </SanctuaryShell>
  );
}
