"use client";

import React from "react";
import { motion } from "framer-motion";

export type CharacterVisualState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "celebrating"
  | "paused";

interface KaiCharacterProps {
  state?: CharacterVisualState;
  size?: "sm" | "md" | "lg" | "hero";
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  label?: string;
}

export const KaiCharacter: React.FC<KaiCharacterProps> = ({
  state = "idle",
  size = "md",
  interactive = false,
  onClick,
  className = "",
  label = "Kai the curious learning guide",
}) => {
  const dimensions = {
    sm: "w-12 h-12",
    md: "w-24 h-24",
    lg: "w-44 h-44",
    hero: "w-56 h-56 sm:w-72 sm:h-72",
  }[size];

  return (
    <div
      onClick={interactive ? onClick : undefined}
      role={interactive ? "button" : "img"}
      aria-label={label}
      tabIndex={interactive ? 0 : undefined}
      className={`relative inline-flex items-center justify-center select-none ${dimensions} ${
        interactive ? "cursor-pointer transition-transform hover:scale-105 active:scale-95" : ""
      } ${className}`}
    >
      {/* Ambient Confidence Glow */}
      <motion.div
        animate={{
          scale: state === "listening" ? [1, 1.18, 1] : state === "thinking" ? [1, 1.08, 1.15, 1] : [1, 1.05, 1],
          opacity: state === "speaking" ? [0.5, 0.85, 0.5] : [0.35, 0.6, 0.35],
        }}
        transition={{
          duration: state === "listening" ? 2.5 : state === "thinking" ? 2 : 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full blur-2xl bg-gradient-to-tr from-amber-400 via-orange-300 to-yellow-200 opacity-60 pointer-events-none"
      />

      {/* Main Kai SVG Illustration */}
      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full relative z-10 drop-shadow-[0_10px_24px_rgba(245,158,11,0.35)]"
        animate={{
          y: state === "celebrating" ? [0, -12, 0] : state === "speaking" ? [0, -4, 0] : [0, -3, 0],
          rotate: state === "listening" ? [0, 4, -2, 0] : 0,
        }}
        transition={{
          duration: state === "celebrating" ? 1.2 : state === "speaking" ? 1.5 : 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <defs>
          <linearGradient id="kaiBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="kaiFacePlate" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="100%" stopColor="#FEF3C7" />
          </linearGradient>
          <linearGradient id="kaiBelly" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>
          <linearGradient id="kaiEarInside" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="100%" stopColor="#FDBA74" />
          </linearGradient>
          <radialGradient id="kaiEyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="70%" stopColor="#0369A1" />
            <stop offset="100%" stopColor="#075985" />
          </radialGradient>
        </defs>

        {/* Ears / Antennas with lively bounce */}
        <motion.g
          animate={{
            rotate: state === "listening" ? [-4, 6, -4] : [0, 2, 0],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Left Ear */}
          <polygon points="46,65 32,18 78,48" fill="url(#kaiBody)" rx="8" />
          <polygon points="50,60 40,28 72,48" fill="url(#kaiEarInside)" />
          {/* Right Ear */}
          <polygon points="154,65 168,18 122,48" fill="url(#kaiBody)" rx="8" />
          <polygon points="150,60 160,28 128,48" fill="url(#kaiEarInside)" />
        </motion.g>

        {/* Body Base */}
        <rect
          x="55"
          y="108"
          width="90"
          height="78"
          rx="38"
          fill="url(#kaiBody)"
          stroke="#D97706"
          strokeWidth="2.5"
        />

        {/* Glowing Belly Meter (Confidence Indicator) */}
        <ellipse cx="100" cy="146" rx="28" ry="24" fill="url(#kaiBelly)" stroke="#F59E0B" strokeWidth="2" />
        <motion.path
          d="M 85 146 Q 100 138 115 146"
          stroke="#D97706"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          animate={{
            d:
              state === "speaking" || state === "celebrating"
                ? "M 85 143 Q 100 134 115 143"
                : "M 85 146 Q 100 138 115 146",
          }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Little Paws / Hands */}
        <motion.circle
          cx="48"
          cy="138"
          r="10"
          fill="#F59E0B"
          stroke="#D97706"
          strokeWidth="2"
          animate={{
            y: state === "celebrating" ? [-8, 0, -8] : 0,
          }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        <motion.circle
          cx="152"
          cy="138"
          r="10"
          fill="#F59E0B"
          stroke="#D97706"
          strokeWidth="2"
          animate={{
            y: state === "celebrating" ? [-8, 0, -8] : 0,
          }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />

        {/* Head / Helmet */}
        <rect
          x="38"
          y="42"
          width="124"
          height="88"
          rx="44"
          fill="url(#kaiBody)"
          stroke="#D97706"
          strokeWidth="2.5"
        />

        {/* Friendly Face Plate */}
        <rect
          x="48"
          y="52"
          width="104"
          height="68"
          rx="34"
          fill="url(#kaiFacePlate)"
        />

        {/* Rosy Cheeks */}
        <ellipse cx="64" cy="94" rx="7" ry="4.5" fill="#FDA4AF" opacity="0.75" />
        <ellipse cx="136" cy="94" rx="7" ry="4.5" fill="#FDA4AF" opacity="0.75" />

        {/* Eyes: Adaptive per visual state */}
        {state === "listening" ? (
          // Listening: Attentive, wide curious eyes
          <g>
            <circle cx="76" cy="78" r="10" fill="url(#kaiEyeGlow)" />
            <circle cx="73" cy="75" r="3.5" fill="#FFFFFF" />
            <circle cx="124" cy="78" r="10" fill="url(#kaiEyeGlow)" />
            <circle cx="121" cy="75" r="3.5" fill="#FFFFFF" />
          </g>
        ) : state === "thinking" ? (
          // Thinking: Eyes looking up thoughtfully with a soft blink
          <g>
            <motion.ellipse
              cx="76"
              cy="76"
              rx="9"
              ry="7"
              fill="url(#kaiEyeGlow)"
              animate={{ cy: [76, 73, 76] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <circle cx="78" cy="73" r="3" fill="#FFFFFF" />
            <motion.ellipse
              cx="124"
              cy="76"
              rx="9"
              ry="7"
              fill="url(#kaiEyeGlow)"
              animate={{ cy: [76, 73, 76] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <circle cx="126" cy="73" r="3" fill="#FFFFFF" />
          </g>
        ) : state === "celebrating" ? (
          // Celebrating: Joyful arched happy eyes
          <g stroke="#0369A1" strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d="M 68 80 Q 76 70 84 80" />
            <path d="M 116 80 Q 124 70 132 80" />
          </g>
        ) : (
          // Idle / Speaking: Natural blinking eyes
          <g>
            <motion.ellipse
              cx="76"
              cy="78"
              rx="8.5"
              ry={state === "speaking" ? 8.5 : 8.5}
              fill="url(#kaiEyeGlow)"
              animate={{
                scaleY: [1, 1, 0.1, 1, 1],
              }}
              transition={{
                duration: 3.8,
                repeat: Infinity,
                times: [0, 0.45, 0.48, 0.52, 1],
              }}
            />
            <circle cx="73.5" cy="75.5" r="3" fill="#FFFFFF" />
            <motion.ellipse
              cx="124"
              cy="78"
              rx="8.5"
              ry={state === "speaking" ? 8.5 : 8.5}
              fill="url(#kaiEyeGlow)"
              animate={{
                scaleY: [1, 1, 0.1, 1, 1],
              }}
              transition={{
                duration: 3.8,
                repeat: Infinity,
                times: [0, 0.45, 0.48, 0.52, 1],
              }}
            />
            <circle cx="121.5" cy="75.5" r="3" fill="#FFFFFF" />
          </g>
        )}

        {/* Cute Nose */}
        <polygon points="100,85 96,89 104,89" fill="#D97706" />

        {/* Mouth: Reacts dynamically to state */}
        {state === "speaking" ? (
          <motion.path
            d="M 91 94 Q 100 106 109 94 Z"
            fill="#B45309"
            stroke="#92400E"
            strokeWidth="1.5"
            animate={{
              d: [
                "M 91 94 Q 100 106 109 94 Z",
                "M 93 94 Q 100 100 107 94 Z",
                "M 90 94 Q 100 110 110 94 Z",
                "M 91 94 Q 100 106 109 94 Z",
              ],
            }}
            transition={{ duration: 0.4, repeat: Infinity }}
          />
        ) : state === "thinking" ? (
          <path d="M 94 96 Q 100 98 106 95" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : state === "celebrating" ? (
          <path d="M 88 93 Q 100 112 112 93 Z" fill="#B45309" stroke="#92400E" strokeWidth="1.5" />
        ) : (
          <path d="M 92 95 Q 100 102 108 95" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}

        {/* Thought Sparks / Curiosity Bulb when Thinking */}
        {state === "thinking" && (
          <motion.g
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.1, 0.9], y: [-2, -6, -2] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Sparkle 1 */}
            <circle cx="100" cy="18" r="7" fill="#FDE047" stroke="#F59E0B" strokeWidth="1.5" />
            <path d="M 100 8 L 100 12 M 100 24 L 100 28 M 90 18 L 94 18 M 106 18 L 110 18" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            {/* Little side sparks */}
            <circle cx="82" cy="24" r="2.5" fill="#F59E0B" />
            <circle cx="118" cy="24" r="2.5" fill="#F59E0B" />
          </motion.g>
        )}

        {/* Audio Wave Waves when Speaking */}
        {state === "speaking" && (
          <motion.g
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <path d="M 28 85 Q 24 100 28 115" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M 22 78 Q 16 100 22 122" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.35" />
            <path d="M 172 85 Q 176 100 172 115" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M 178 78 Q 184 100 178 122" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.35" />
          </motion.g>
        )}
      </motion.svg>
    </div>
  );
};
