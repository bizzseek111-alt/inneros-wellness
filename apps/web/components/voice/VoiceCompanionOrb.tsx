"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  audioLevel?: number; // 0.0 to 1.0
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

  // Visual State Palette Mapping
  const stateConfig: Record<
    VoiceCompanionVisualState,
    {
      primaryColor: string;
      secondaryColor: string;
      glowColor: string;
      borderColor: string;
      icon: React.ComponentType<{ className?: string }>;
      label: string;
      subtext: string;
    }
  > = {
    idle: {
      primaryColor: "rgba(52, 134, 128, 0.4)",
      secondaryColor: "rgba(30, 27, 75, 0.6)",
      glowColor: "rgba(52, 134, 128, 0.2)",
      borderColor: "rgba(52, 134, 128, 0.3)",
      icon: Sparkles,
      label: "Sanctuary Presence",
      subtext: "Calm, receptive stillness",
    },
    connecting: {
      primaryColor: "rgba(129, 140, 248, 0.4)",
      secondaryColor: "rgba(30, 27, 75, 0.7)",
      glowColor: "rgba(129, 140, 248, 0.25)",
      borderColor: "rgba(129, 140, 248, 0.4)",
      icon: Radio,
      label: "Establishing Connection",
      subtext: "Negotiating low-latency audio stream",
    },
    listening: {
      primaryColor: "rgba(20, 184, 166, 0.6)",
      secondaryColor: "rgba(45, 212, 191, 0.25)",
      glowColor: "rgba(20, 184, 166, 0.4)",
      borderColor: "rgba(45, 212, 191, 0.7)",
      icon: Mic,
      label: "Active Listening",
      subtext: "Attuned to your vocal presence",
    },
    thinking: {
      primaryColor: "rgba(167, 139, 250, 0.5)",
      secondaryColor: "rgba(99, 102, 241, 0.35)",
      glowColor: "rgba(167, 139, 250, 0.3)",
      borderColor: "rgba(167, 139, 250, 0.6)",
      icon: Radio,
      label: "Synthesizing Reflection",
      subtext: "Grounded in non-clinical emotional presence",
    },
    speaking: {
      primaryColor: "rgba(45, 212, 191, 0.65)",
      secondaryColor: "rgba(247, 245, 240, 0.35)",
      glowColor: "rgba(52, 134, 128, 0.5)",
      borderColor: "rgba(45, 212, 191, 0.8)",
      icon: Volume2,
      label: "Empathic Voice",
      subtext: "Speaking gently &bull; Interrupt anytime",
    },
    interrupted: {
      primaryColor: "rgba(245, 158, 11, 0.6)",
      secondaryColor: "rgba(217, 119, 6, 0.3)",
      glowColor: "rgba(245, 158, 11, 0.35)",
      borderColor: "rgba(245, 158, 11, 0.8)",
      icon: AlertCircle,
      label: "Speech Interrupted",
      subtext: "Audio paused immediately &bull; Listening to you",
    },
    reconnecting: {
      primaryColor: "rgba(245, 158, 11, 0.4)",
      secondaryColor: "rgba(180, 83, 9, 0.3)",
      glowColor: "rgba(245, 158, 11, 0.2)",
      borderColor: "rgba(245, 158, 11, 0.5)",
      icon: WifiOff,
      label: "Recovering Stream",
      subtext: "Restoring audio buffers safely",
    },
    resting: {
      primaryColor: "rgba(40, 44, 52, 0.4)",
      secondaryColor: "rgba(20, 22, 28, 0.7)",
      glowColor: "rgba(255, 255, 255, 0.05)",
      borderColor: "rgba(255, 255, 255, 0.1)",
      icon: Moon,
      label: "Resting Sanctuary",
      subtext: "Conserving emotional energy",
    },
    muted: {
      primaryColor: "rgba(225, 29, 72, 0.3)",
      secondaryColor: "rgba(30, 27, 75, 0.6)",
      glowColor: "rgba(225, 29, 72, 0.2)",
      borderColor: "rgba(225, 29, 72, 0.4)",
      icon: Moon,
      label: "Microphone Muted",
      subtext: "Zero audio captured &bull; Privacy protected",
    },
  };

  const current = stateConfig[state] || stateConfig.idle;
  const StateIcon = current.icon;

  // Dynamic audio scale booster for speaking and listening
  const dynamicAudioScale = 1 + Math.min(0.25, audioLevel * 0.4);

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${current.label}: ${current.subtext}`}
      className={`flex flex-col items-center justify-center p-6 select-none cursor-pointer group focus:outline-none focus:ring-2 focus:ring-teal-500/40 rounded-3xl ${className}`}
    >
      {/* Central Living Atmospheric Orb Container */}
      <div className="relative w-52 h-52 sm:w-64 sm:h-64 flex items-center justify-center">
        {/* If Reduced Motion is active, render peaceful static atmospheric aura */}
        {isReducedMotion ? (
          <div
            style={{
              boxShadow: `0 0 60px ${current.glowColor}`,
              borderColor: current.borderColor,
            }}
            className="absolute inset-2 rounded-full border-2 bg-midnight-950/90 flex items-center justify-center transition-all duration-700"
          >
            <div
              style={{
                background: `radial-gradient(circle at 40% 40%, ${current.primaryColor}, ${current.secondaryColor}, rgba(11, 15, 25, 0.95))`,
              }}
              className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-white/[0.1] flex items-center justify-center shadow-inner"
            >
              <StateIcon className="w-10 h-10 text-ivory-100/90" />
            </div>
          </div>
        ) : (
          <>
            {/* Animated Waveform Outermost Echo Ring */}
            <motion.div
              animate={{
                scale:
                  state === "speaking"
                    ? [1, 1.25 * dynamicAudioScale, 1.05, 1.28 * dynamicAudioScale, 1]
                    : state === "listening"
                    ? [1, 1.15 * dynamicAudioScale, 1]
                    : state === "thinking"
                    ? [1.02, 1.08, 1.02]
                    : state === "interrupted"
                    ? [1.1, 1]
                    : [1, 1.05, 1],
                opacity: state === "resting" || state === "muted" ? 0.2 : [0.35, 0.7, 0.35],
              }}
              transition={{
                duration:
                  state === "speaking"
                    ? 2.2
                    : state === "listening"
                    ? 1.6
                    : state === "thinking"
                    ? 3.2
                    : state === "interrupted"
                    ? 0.4
                    : 6.5,
                repeat: state === "interrupted" ? 0 : Infinity,
                ease: "easeInOut",
              }}
              style={{
                borderColor: current.borderColor,
                boxShadow: `0 0 50px ${current.glowColor}`,
              }}
              className="absolute inset-0 rounded-full border blur-[2px] transition-colors duration-500"
            />

            {/* Secondary Orbital Dashed Halo */}
            <motion.div
              animate={{
                rotate: 360,
                scale: state === "speaking" ? [1, 1.08, 1] : 1,
              }}
              transition={{
                rotate: { duration: 32, repeat: Infinity, ease: "linear" },
                scale: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute inset-3 rounded-full border border-dashed border-white/[0.12] pointer-events-none"
            />

            {/* Core Layered Atmospheric Gradient Orb */}
            <motion.div
              animate={{
                scale:
                  state === "speaking"
                    ? [1, 1.08 * dynamicAudioScale, 1.02, 1.1 * dynamicAudioScale, 1]
                    : state === "listening"
                    ? [1, 1.04, 1]
                    : [1, 1.03, 1],
              }}
              transition={{
                duration: state === "speaking" ? 2.2 : 5.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: `radial-gradient(circle at 35% 35%, ${current.primaryColor}, ${current.secondaryColor}, rgba(8, 11, 20, 0.98))`,
                boxShadow: `inset 0 0 35px rgba(255, 255, 255, 0.08), 0 0 40px ${current.glowColor}`,
              }}
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-white/[0.18] flex items-center justify-center relative overflow-hidden backdrop-blur-md transition-all duration-500"
            >
              {/* Internal Caustic Lighting Reflection */}
              <div className="absolute top-2 left-6 w-16 h-8 rounded-full bg-white/[0.15] blur-[8px] transform -rotate-12 pointer-events-none" />

              {/* State Glyphic Presence */}
              <motion.div
                key={state}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 flex flex-col items-center justify-center text-ivory-100"
              >
                <StateIcon className="w-9 h-9 sm:w-11 sm:h-11 drop-shadow-md text-ivory-100 transition-all duration-300" />
              </motion.div>
            </motion.div>
          </>
        )}
      </div>

      {/* State Caption & Pacing Subtitle */}
      <div className="mt-4 text-center space-y-1">
        <h3 className="text-sm sm:text-base font-serif font-normal text-ivory-100 tracking-tight transition-colors">
          {current.label}
        </h3>
        <p className="text-xs text-ivory-400 font-light flex items-center justify-center space-x-1.5">
          <span dangerouslySetInnerHTML={{ __html: current.subtext }} />
        </p>
      </div>
    </div>
  );
};
