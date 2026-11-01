"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, Sparkles, Moon, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

export type CompanionVoiceState = "idle" | "listening" | "thinking" | "speaking" | "resting";

interface LivingVoicePresenceProps {
  state?: CompanionVoiceState;
  onStateChange?: (newState: CompanionVoiceState) => void;
  className?: string;
}

export const LivingVoicePresence: React.FC<LivingVoicePresenceProps> = ({
  state: controlledState,
  onStateChange,
  className,
}) => {
  const [internalState, setInternalState] = useState<CompanionVoiceState>("idle");
  const currentState = controlledState || internalState;

  const handleStateClick = (next: CompanionVoiceState) => {
    setInternalState(next);
    onStateChange?.(next);
  };

  const stateLabels: Record<CompanionVoiceState, { title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }> = {
    idle: { title: "Sanctuary Presence", subtitle: "Calm, receptive stillness", icon: Sparkles },
    listening: { title: "Active Listening", subtitle: "Attuned to your vocal cadence", icon: Mic },
    thinking: { title: "Synthesizing Insight", subtitle: "Consulting evidence-informed memory", icon: Radio },
    speaking: { title: "Empathic Voice", subtitle: "Warm, deliberate audio resonance", icon: Volume2 },
    resting: { title: "Restorative Silence", subtitle: "Conserving emotional space", icon: Moon },
  };

  const CurrentIcon = stateLabels[currentState].icon;

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 relative", className)}>
      {/* Living Atmospheric Orb Container */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
        {/* Outer Harmonic Resonance Ring (Animated) */}
        <motion.div
          animate={{
            scale:
              currentState === "speaking"
                ? [1, 1.25, 1.05, 1.28, 1]
                : currentState === "listening"
                ? [1, 1.15, 1]
                : currentState === "thinking"
                ? [1.02, 1.08, 1.02]
                : [1, 1.06, 1],
            opacity: currentState === "resting" ? 0.2 : [0.35, 0.65, 0.35],
          }}
          transition={{
            duration: currentState === "speaking" ? 2.5 : currentState === "listening" ? 1.8 : 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={cn(
            "absolute inset-0 rounded-full border border-teal-500/30 blur-[2px]",
            currentState === "listening" && "border-indigo-400/50",
            currentState === "speaking" && "border-teal-400/60 shadow-[0_0_50px_rgba(52,134,128,0.35)]",
            currentState === "thinking" && "border-lavender-400/50"
          )}
        />

        {/* Secondary Counter-Rotating Orbital Ring */}
        <motion.div
          animate={{
            rotate: 360,
            scale: currentState === "speaking" ? [1, 1.12, 1] : 1,
          }}
          transition={{
            rotate: { duration: 28, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute inset-4 rounded-full border border-dashed border-white/[0.08]"
        />

        {/* Core Living Sanctuary Orb */}
        <motion.div
          animate={{
            scale:
              currentState === "listening"
                ? [1, 1.08, 1]
                : currentState === "speaking"
                ? [1.02, 1.12, 1.04]
                : currentState === "resting"
                ? 0.94
                : [1, 1.05, 1],
          }}
          transition={{
            duration: currentState === "speaking" ? 2 : 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={cn(
            "relative w-32 h-32 sm:w-36 sm:h-36 rounded-full flex items-center justify-center shadow-2xl transition-all duration-700 overflow-hidden",
            currentState === "idle" &&
              "bg-gradient-to-tr from-midnight-950 via-teal-900/60 to-indigo-900/50 border border-teal-500/40 shadow-[0_0_40px_rgba(52,134,128,0.25)]",
            currentState === "listening" &&
              "bg-gradient-to-tr from-midnight-950 via-indigo-900/70 to-teal-800/60 border border-indigo-400/60 shadow-[0_0_50px_rgba(79,100,170,0.35)]",
            currentState === "thinking" &&
              "bg-gradient-to-tr from-midnight-950 via-lavender-900/60 to-indigo-800/50 border border-lavender-400/50 shadow-[0_0_40px_rgba(137,131,179,0.3)]",
            currentState === "speaking" &&
              "bg-gradient-to-tr from-midnight-950 via-teal-800/80 to-teal-600/40 border border-teal-300/70 shadow-[0_0_60px_rgba(52,134,128,0.45)]",
            currentState === "resting" &&
              "bg-midnight-900 border border-white/[0.06] opacity-75 shadow-none"
          )}
        >
          {/* Internal Harmonic Waves */}
          <div className="absolute inset-0 bg-radial from-white/[0.15] to-transparent pointer-events-none" />

          {/* Central State Icon */}
          <CurrentIcon
            className={cn(
              "w-8 h-8 transition-all duration-300",
              currentState === "speaking" && "text-teal-200 animate-pulse",
              currentState === "listening" && "text-indigo-200",
              currentState === "thinking" && "text-lavender-200",
              currentState === "idle" && "text-teal-300/80",
              currentState === "resting" && "text-zinc-500"
            )}
          />
        </motion.div>
      </div>

      {/* Voice State Context & Subtitle */}
      <div className="text-center mt-4 space-y-1" role="status" aria-live="polite">
        <h4 className="text-sm font-semibold tracking-tight text-ivory-100 font-sans-ui">
          {stateLabels[currentState].title}
        </h4>
        <p className="text-xs text-ivory-400 max-w-xs">{stateLabels[currentState].subtitle}</p>
      </div>

      {/* Interactive State Demo Switcher */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-2xl bg-midnight-900/90 border border-white/[0.08]">
        {(["idle", "listening", "thinking", "speaking", "resting"] as CompanionVoiceState[]).map(
          (s) => (
            <button
              key={s}
              onClick={() => handleStateClick(s)}
              className={cn(
                "px-2.5 py-1 rounded-xl text-[11px] font-medium capitalize transition-all select-none",
                currentState === s
                  ? "bg-teal-950/80 text-teal-200 border border-teal-700/60 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              )}
            >
              {s}
            </button>
          )
        )}
      </div>
    </div>
  );
};
