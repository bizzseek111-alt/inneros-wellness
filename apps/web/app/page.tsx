"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { CompanionInterface } from "@/components/companion/CompanionInterface";
import { KnowledgeLibrary } from "@/components/knowledge/KnowledgeLibrary";
import { MemoryDrawer } from "@/components/memory/MemoryDrawer";
import { EmergencyModal } from "@/components/safety/EmergencyModal";
import { GentleReminderBanner } from "@/components/notifications/GentleReminderBanner";
import { MoodCheckIn } from "@/components/mood/MoodCheckIn";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";
import { api } from "@/lib/api-client";
import {
  Sparkles,
  Compass,
  Shield,
  BookOpen,
  Heart,
  Activity,
  ArrowRight,
  LayoutDashboard,
  Mic,
  GitBranch,
  Layers,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const [activeView, setActiveView] = useState<"companion" | "knowledge" | "mood">("companion");
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [isHotlinesOpen, setIsHotlinesOpen] = useState(false);
  const [customCrisisMessage, setCustomCrisisMessage] = useState<string | undefined>();
  const [backendHealthy, setBackendHealthy] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const health = await api.getHealth();
        if (health.status === "healthy") {
          setBackendHealthy(true);
        }
      } catch (e) {
        setBackendHealthy(false);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerCrisisModal = (message?: string) => {
    setCustomCrisisMessage(message);
    setIsHotlinesOpen(true);
  };

  return (
    <SanctuaryShell>
      <div className="space-y-6">
        {/* Prototype Journey Navigator Bar */}
        <div className="p-4 rounded-2xl bg-midnight-900 border border-teal-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-ivory-100 font-medium">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>Interactive UX Prototype: 17 Journeys Active</span>
            <Badge variant="teal" size="sm">
              Elena Vance Profile Loaded
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <Link href="/onboarding">
              <Button size="xs" variant="calm">
                Start Onboarding
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="xs" variant="secondary" leftIcon={<LayoutDashboard className="w-3 h-3" />}>
                Home Dashboard
              </Button>
            </Link>
            <Link href="/companion/voice">
              <Button size="xs" variant="primary" leftIcon={<Mic className="w-3 h-3" />}>
                Voice Sanctuary
              </Button>
            </Link>
            <Link href="/memory">
              <Button size="xs" variant="outline" leftIcon={<GitBranch className="w-3 h-3" />}>
                Life Graph
              </Button>
            </Link>
          </div>
        </div>

        {/* Gentle Contextual Sanctuary Banner */}
        <GentleReminderBanner
          title="Sanctuary Equilibrium"
          timeContext="Circadian Flow"
          message="Welcome to your private sanctuary space, Elena. As a non-clinical companion, InnerOS is here to listen, validate, and support your daily clarity."
        />

        {/* View Switcher Sub-Navigation */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-midnight-900/80 border border-white/[0.08] text-xs">
            <button
              onClick={() => setActiveView("companion")}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all flex items-center space-x-1.5 ${
                activeView === "companion"
                  ? "bg-teal-950/80 text-teal-200 border border-teal-700/60 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sanctuary Companion</span>
            </button>

            <button
              onClick={() => setActiveView("knowledge")}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all flex items-center space-x-1.5 ${
                activeView === "knowledge"
                  ? "bg-teal-950/80 text-teal-200 border border-teal-700/60 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Evidence Library</span>
            </button>

            <button
              onClick={() => setActiveView("mood")}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all flex items-center space-x-1.5 ${
                activeView === "mood"
                  ? "bg-teal-950/80 text-teal-200 border border-teal-700/60 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Mood Check-In</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-xs text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="font-mono text-[11px]">{backendHealthy ? "FastAPI Live" : "Offline Mock"}</span>
          </div>
        </div>

        {/* Dynamic Main Workspace Canvas */}
        <div className="flex-1 flex flex-col">
          {activeView === "companion" && (
            <CompanionInterface onTriggerEmergencyModal={handleTriggerCrisisModal} />
          )}

          {activeView === "knowledge" && <KnowledgeLibrary />}

          {activeView === "mood" && (
            <div className="py-6">
              <MoodCheckIn onConfirmCheckIn={() => setActiveView("companion")} />
            </div>
          )}
        </div>

        {/* Emergency Crisis Modal */}
        <EmergencyModal
          isOpen={isHotlinesOpen}
          onClose={() => setIsHotlinesOpen(false)}
          customMessage={customCrisisMessage}
        />
      </div>
    </SanctuaryShell>
  );
}
