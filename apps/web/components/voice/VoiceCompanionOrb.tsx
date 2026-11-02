"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Volume2, Sparkles, Moon, Radio, AlertCircle, WifiOff } from "lucide-react";

export type VoiceCompanionVisualState =
  | "idle"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "interrupted"
  | "reconnecting"
  | "resting"
  | "muted";

interface VoiceCompanionOrbProps {
  state: VoiceCompanionVisualState;
  audioLevel?: number;
  prefersReducedMotion?: boolean;
  className?: string;
  onClick?: () => void;
}

export const VoiceCompanionOrb: React.FC<VoiceCompanionOrbProps> = ({
  state,
  audioLevel = 0,
  prefersReducedMotion: propReducedMotion,
  className = "",
  onClick,
}) => {
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setSystemReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setSystemReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  const isReducedMotion = propReducedMotion !== undefined ? propReducedMotion : systemReducedMotion;

  const stateConfig: Record<
    VoiceCompanionVisualState,
    {
      gradient: string;
      ringColor: string;
      glowColor: string;
      iconColor: string;
      icon: React.ComponentType<{ className?: string }>;
      label: string;
      subtext: string;
    }
  > = {
    idle: {
      gradient: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #E8F1EB 45%, #A8CBB5 100%)",
      ringColor: "rgba(40, 91, 85, 0.25)",
      glowColor: "rgba(40, 91, 85, 0.14)",
      iconColor: "text-[#285B55]",
      icon: Sparkles,
      label: "Ready When You Are",
      subtext: "Tap the microphone or orb to begin speaking",
    },
    connecting: {
      gradient: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #EDE8F5 50%, #C2B3DF 100%)",
      ringColor: "rgba(107, 81, 158, 0.30)",
      glowColor: "rgba(107, 81, 158, 0.16)",
      iconColor: "text-[#553E82]",
      icon: Radio,
      label: "Connecting...",
      subtext: "Preparing your quiet voice space",
    },
    listening: {
      gradient: "radial-gradient(circle at 35% 35%, #E8F1EB 0%, #78AC8D 55%, #285B55 100%)",
      ringColor: "rgba(40, 91, 85, 0.45)",
      glowColor: "rgba(40, 91, 85, 0.24)",
      iconColor: "text-white",
      icon: Mic,
      label: "Listening to You",
      subtext: "Speak naturally at your own pace",
    },
    thinking: {
      gradient: "radial-gradient(circle at 35% 35%, #FAF8F4 0%, #EDE8F5 50%, #A38ECF 100%)",
      ringColor: "rgba(107, 81, 158, 0.35)",
      glowColor: "rgba(107, 81, 158, 0.20)",
      iconColor: "text-[#423166]",
      icon: Sparkles,
      label: "Reflecting",
      subtext: "Taking a thoughtful moment...",
    },
    speaking: {
      gradient: "radial-gradient(circle at 35% 35%, #FAF8F4 0%, #F7E7E2 45%, #E8F1EB 100%)",
      ringColor: "rgba(40, 91, 85, 0.40)",
      glowColor: "rgba(40, 91, 85, 0.22)",
      iconColor: "text-[#285B55]",
      icon: Volume2,
      label: "Speaking Gently",
      subtext: "You can interrupt or pause anytime",
    },
    interrupted: {
      gradient: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #F7E7E2 60%, #E0B0A0 100%)",
      ringColor: "rgba(184, 107, 82, 0.40)",
      glowColor: "rgba(184, 107, 82, 0.18)",
      iconColor: "text-[#7D402D]",
      icon: AlertCircle,
      label: "Paused for You",
      subtext: "I stopped speaking so I can listen to you",
    },
    reconnecting: {
      gradient: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #F7E7E2 60%, #EED0C6 100%)",
      ringColor: "rgba(184, 107, 82, 0.35)",
      glowColor: "rgba(184, 107, 82, 0.15)",
      iconColor: "text-[#7D402D]",
      icon: WifiOff,
      label: "Reconnecting Audio",
      subtext: "Restoring your voice connection...",
    },
    resting: {
      gradient: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #F3EFE8 65%, #E4E0D8 100%)",
      ringColor: "rgba(38, 51, 48, 0.15)",
      glowColor: "rgba(38, 51, 48, 0.06)",
      iconColor: "text-[#52625E]",
      icon: Moon,
      label: "Conversation Paused",
      subtext: "Take all the time you need",
    },
    muted: {
      gradient: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #F7E7E2 65%, #EED0C6 100%)",
      ringColor: "rgba(155, 28, 49, 0.28)",
      glowColor: "rgba(155, 28, 49, 0.10)",
      iconColor: "text-[#9B1C31]",
      icon: Moon,
      label: "Microphone Muted",
      subtext: "Your microphone is off and private",
    },
  };

  const current = stateConfig[state] || stateConfig.idle;
  const StateIcon = current.icon;
  const dynamicAudioScale = 1 + Math.min(0.18, audioLevel * 0.3);

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* Central Soft Gradient Orb Interactive Button */}
      <button
        type="button"
        onClick={onClick}
        aria-label={`${current.label}: ${current.subtext}`}
        className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center rounded-full outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 border-none cursor-pointer group transition-transform active:scale-[0.98]"
      >
        {isReducedMotion ? (
          <div
            style={{
              boxShadow: `0 12px 48px ${current.glowColor}`,
              borderColor: current.ringColor,
              background: current.gradient,
            }}
            className="w-44 h-44 sm:w-52 sm:h-52 rounded-full border-2 flex items-center justify-center transition-all duration-500"
          >
            <StateIcon className={`w-12 h-12 ${current.iconColor}`} />
          </div>
        ) : (
          <>
            {/* Soft Outer Breathing Halo */}
            <motion.div
              animate={{
                scale:
                  state === "speaking"
                    ? [1, 1.18 * dynamicAudioScale, 1.04, 1.2 * dynamicAudioScale, 1]
                    : state === "listening"
                    ? [1, 1.12 * dynamicAudioScale, 1]
                    : [1, 1.06, 1],
                opacity: state === "resting" || state === "muted" ? 0.3 : [0.45, 0.8, 0.45],
              }}
              transition={{
                duration: state === "speaking" ? 2.6 : state === "listening" ? 2.0 : 5.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                borderColor: current.ringColor,
                backgroundColor: current.glowColor,
              }}
              className="absolute inset-2 rounded-full border transition-colors duration-500"
            />

            {/* Core Soft Gradient Companion Orb */}
            <motion.div
              animate={{
                scale:
                  state === "speaking"
                    ? [1, 1.06 * dynamicAudioScale, 1.01, 1.07 * dynamicAudioScale, 1]
                    : state === "listening"
                    ? [1, 1.04, 1]
                    : [1, 1.025, 1],
              }}
              transition={{
                duration: state === "speaking" ? 2.4 : 5.0,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: current.gradient,
                boxShadow: `0 16px 48px ${current.glowColor}, inset 0 2px 16px rgba(255, 255, 255, 0.75)`,
                borderColor: current.ringColor,
              }}
              className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-2 flex items-center justify-center relative overflow-hidden transition-all duration-500"
            >
              <motion.div
                key={state}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="relative z-10 flex flex-col items-center justify-center"
              >
                <StateIcon className={`w-10 h-10 sm:w-12 sm:h-12 ${current.iconColor} transition-all`} />
              </motion.div>
            </motion.div>
          </>
        )}
      </button>

      {/* Clear, Friendly State Caption */}
      <div className="mt-5 text-center space-y-1">
        <h2 className="text-xl font-serif font-medium text-[#1A1E1C]">{current.label}</h2>
        <p className="text-sm sm:text-base text-[#4A5752]">{current.subtext}</p>
      </div>
    </div>
  );
};
