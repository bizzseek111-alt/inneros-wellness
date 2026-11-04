"use client";

import React from "react";
import { motion } from "framer-motion";
import { useYouth } from "./YouthContext";

export type MascotState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "celebrating"
  | "calming"
  | "comforting"
  | "guiding";

interface LumiMascotProps {
  state?: MascotState;
  size?: "sm" | "md" | "lg" | "hero";
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  label?: string;
}

export const LumiMascot: React.FC<LumiMascotProps> = ({
  state = "idle",
  size = "md",
  interactive = false,
  onClick,
  className = "",
  label = "Lumi the calm companion",
}) => {
  const { isReducedMotion, isLowStimulation } = useYouth();

  const dimensions = {
    sm: "w-10 h-10",
    md: "w-20 h-20",
    lg: "w-36 h-36",
    hero: "w-52 h-52 sm:w-64 sm:h-64",
  }[size];

  // Colors based on state
  const stateGradients = {
    idle: "from-[#B9E2FE] via-[#E6D7F5] to-[#FFD9C7]",
    listening: "from-[#98DEB8] via-[#B9E2FE] to-[#D3B9ED]",
    thinking: "from-[#EDE9FE] via-[#E0F2FE] to-[#FEF3C7]",
    speaking: "from-[#FFB99D] via-[#FEF08A] to-[#B9E2FE]",
    celebrating: "from-[#FDE047] via-[#FFB99D] to-[#E6D7F5]",
    calming: "from-[#C4EDD6] via-[#B9E2FE] to-[#E6D7F5]",
    comforting: "from-[#FED7AA] via-[#FBCFE8] to-[#E0E7FF]",
    guiding: "from-[#BAE6FD] via-[#DDD6FE] to-[#FEF08A]",
  };

  const currentGradient = isLowStimulation
    ? "from-[#E2E0D8] via-[#D8D5CC] to-[#C9C5BC]"
    : stateGradients[state] || stateGradients.idle;

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
      {/* Outer Ambient Breathing Glow */}
      {!isReducedMotion && (
        <motion.div
          animate={{
            scale: state === "listening" ? [1, 1.15, 1] : state === "calming" ? [1, 1.25, 1] : [1, 1.08, 1],
            opacity: isLowStimulation ? [0.3, 0.45, 0.3] : [0.45, 0.8, 0.45],
          }}
          transition={{
            duration: state === "calming" ? 6 : 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute inset-0 rounded-full blur-xl bg-gradient-to-tr ${currentGradient} opacity-60 pointer-events-none`}
        />
      )}

      {/* Main Mascot Body (Luminous Celestial Cloud / Star Friend) */}
      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full relative z-10 drop-shadow-[0_8px_20px_rgba(185,226,254,0.35)]"
        animate={
          !isReducedMotion
            ? {
                y: state === "celebrating" ? [0, -10, 0] : [0, -4, 0],
                rotate: state === "listening" ? [0, 3, -3, 0] : 0,
              }
            : {}
        }
        transition={{
          duration: state === "celebrating" ? 1.5 : 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <defs>
          <linearGradient id="lumiGrad" x1="20%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%" stopColor={isLowStimulation ? "#E2E8F0" : "#B9E2FE"} />
            <stop offset="50%" stopColor={isLowStimulation ? "#CBD5E1" : "#E6D7F5"} />
            <stop offset="100%" stopColor={isLowStimulation ? "#94A3B8" : "#FFD9C7"} />
          </linearGradient>
          <radialGradient id="innerGlow" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft Cloud-Star Petals */}
        <g>
          {/* Main Organic Cloud Silhouette */}
          <path
            d="M 100,28 
               C 125,28 142,42 154,60 
               C 174,68 184,88 180,110 
               C 176,134 158,154 135,160 
               C 118,172 82,172 65,160 
               C 42,154 24,134 20,110 
               C 16,88 26,68 46,60 
               C 58,42 75,28 100,28 Z"
            fill="url(#lumiGrad)"
          />
          {/* Internal Shimmer Layer */}
          <path
            d="M 100,34 
               C 120,34 135,46 145,62 
               C 162,70 170,86 166,105 
               C 162,125 148,142 128,148 
               C 114,158 86,158 72,148 
               C 52,142 38,125 34,105 
               C 30,86 38,70 55,62 
               C 65,46 80,34 100,34 Z"
            fill="url(#innerGlow)"
          />
        </g>

        {/* Expressive Features for Thinking / Guiding / Comforting */}
        {state === "thinking" && !isReducedMotion && (
          <g>
            <circle cx="150" cy="40" r="5" fill="#FEF08A" opacity="0.8" />
            <circle cx="165" cy="28" r="7" fill="#BAE6FD" opacity="0.85" />
            <circle cx="180" cy="18" r="9" fill="#DDD6FE" opacity="0.9" />
          </g>
        )}

        {state === "guiding" && (
          <g>
            <path
              d="M 100,12 L 104,22 L 114,24 L 106,30 L 109,40 L 100,34 L 91,40 L 94,30 L 86,24 L 96,22 Z"
              fill="#FEF08A"
              opacity="0.9"
            />
          </g>
        )}

        {state === "comforting" && (
          <g>
            <path
              d="M 100,24 C 95,16 82,16 82,27 C 82,36 100,48 100,48 C 100,48 118,36 118,27 C 118,16 105,16 100,24 Z"
              fill="#F472B6"
              opacity="0.85"
            />
          </g>
        )}

        {/* Friendly Expressive Eyes (Gentle arcs, non-creepy, peaceful) */}
        <g fill="#2D3748">
          {/* Left Eye */}
          {state === "calming" || state === "idle" || state === "comforting" ? (
            <path
              d="M 68,96 C 74,90 84,90 90,96"
              stroke="#2D3748"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
          ) : state === "thinking" ? (
            <ellipse cx="78" cy="90" rx="6" ry="7" />
          ) : (
            <ellipse cx="78" cy="94" rx="6" ry="8" />
          )}

          {/* Right Eye */}
          {state === "calming" || state === "idle" || state === "comforting" ? (
            <path
              d="M 110,96 C 116,90 126,90 132,96"
              stroke="#2D3748"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
          ) : state === "thinking" ? (
            <ellipse cx="122" cy="90" rx="6" ry="7" />
          ) : (
            <ellipse cx="122" cy="94" rx="6" ry="8" />
          )}

          {/* Cheerful Eye Sparkles if Open */}
          {state !== "calming" && state !== "idle" && state !== "comforting" && (
            <>
              <circle cx="76" cy={state === "thinking" ? 87 : 91} r="2" fill="#FFFFFF" />
              <circle cx="120" cy={state === "thinking" ? 87 : 91} r="2" fill="#FFFFFF" />
            </>
          )}

          {/* Soft Cheeks */}
          <circle cx="64" cy="106" r="8" fill="#FF8E68" opacity="0.35" />
          <circle cx="136" cy="106" r="8" fill="#FF8E68" opacity="0.35" />

          {/* Gentle Smile */}
          <path
            d={
              state === "celebrating"
                ? "M 88,112 Q 100,126 112,112"
                : state === "speaking"
                ? "M 92,114 Q 100,124 108,114"
                : state === "comforting"
                ? "M 89,112 Q 100,122 111,112"
                : state === "thinking"
                ? "M 93,114 Q 100,118 107,114"
                : "M 90,112 Q 100,120 110,112"
            }
            stroke="#2D3748"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </motion.svg>
    </div>
  );
};
