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
      gradient: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #EEF4FF 45%, #93C5FD 100%)",
      ringColor: "rgba(43, 76, 222, 0.25)",
      glowColor: "rgba(43, 76, 222, 0.15)",
      iconColor: "text-[#2B4CDE]",
      icon: Sparkles,
      label: "Ready When You Are",
      subtext: "Tap the microphone or orb to begin speaking",
    },
    connecting: {
      gradient: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #F0F5FF 50%, #93C5FD 100%)",
      ringColor: "rgba(43, 76, 222, 0.30)",
      glowColor: "rgba(43, 76, 222, 0.18)",
      iconColor: "text-[#2B4CDE]",
      icon: Radio,
      label: "Connecting...",
      subtext: "Preparing your quiet voice space",
    },
    listening: {
      gradient: "radial-gradient(circle at 35% 35%, #60A5FA 0%, #2B4CDE 55%, #1E3A8A 100%)",
      ringColor: "rgba(43, 76, 222, 0.50)",
      glowColor: "rgba(56, 189, 248, 0.35)",
      iconColor: "text-white",
      icon: Mic,
      label: "Listening to You",
      subtext: "Speak naturally at your own pace",
    },
    thinking: {
      gradient: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #EDE9FE 50%, #8B5CF6 100%)",
      ringColor: "rgba(139, 92, 246, 0.35)",
      glowColor: "rgba(139, 92, 246, 0.20)",
      iconColor: "text-[#6D28D9]",
      icon: Sparkles,
      label: "Reflecting",
      subtext: "Taking a thoughtful moment...",
    },
    speaking: {
      gradient: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #E0E7FF 45%, #3B82F6 100%)",
      ringColor: "rgba(43, 76, 222, 0.40)",
      glowColor: "rgba(43, 76, 222, 0.25)",
      iconColor: "text-[#2B4CDE]",
      icon: Volume2,
      label: "Speaking Gently",
      subtext: "You can interrupt or pause anytime",
    },
    interrupted: {
      gradient: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #FFF1F2 60%, #FDA4AF 100%)",
      ringColor: "rgba(225, 29, 72, 0.35)",
      glowColor: "rgba(225, 29, 72, 0.18)",
      iconColor: "text-[#E11D48]",
      icon: AlertCircle,
      label: "Paused for You",
      subtext: "I stopped speaking so I can listen to you",
    },
    reconnecting: {
      gradient: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #FFFBEB 60%, #FDE68A 100%)",
      ringColor: "rgba(217, 119, 6, 0.35)",
      glowColor: "rgba(217, 119, 6, 0.15)",
      iconColor: "text-[#D97706]",
      icon: WifiOff,
      label: "Reconnecting Audio",
      subtext: "Restoring your voice connection...",
    },
    resting: {
      gradient: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #F1F5F9 65%, #CBD5E1 100%)",
      ringColor: "rgba(100, 116, 139, 0.20)",
      glowColor: "rgba(100, 116, 139, 0.08)",
      iconColor: "text-[#64748B]",
      icon: Moon,
      label: "Conversation Paused",
      subtext: "Take all the time you need",
    },
    muted: {
      gradient: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #FFF1F2 65%, #FECDD3 100%)",
      ringColor: "rgba(225, 29, 72, 0.30)",
      glowColor: "rgba(225, 29, 72, 0.12)",
      iconColor: "text-[#E11D48]",
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
