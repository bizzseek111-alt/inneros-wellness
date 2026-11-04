"use client";

import React from "react";
import { motion } from "framer-motion";
import { CharacterVisualState } from "./KaiCharacter";

interface MiaCharacterProps {
  state?: CharacterVisualState;
  size?: "sm" | "md" | "lg" | "hero";
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  label?: string;
}

export const MiaCharacter: React.FC<MiaCharacterProps> = ({
  state = "idle",
  size = "md",
  interactive = false,
  onClick,
  className = "",
  label = "Mia the warm creative guide",
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
      {/* Warm Ambient Heart Glow */}
      <motion.div
        animate={{
          scale: state === "listening" ? [1, 1.15, 1] : state === "speaking" ? [1, 1.1, 1] : [1, 1.05, 1],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full blur-2xl bg-gradient-to-tr from-pink-300 via-rose-300 to-purple-300 opacity-60 pointer-events-none"
      />

      {/* Main Mia SVG */}
      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full relative z-10 drop-shadow-[0_10px_24px_rgba(236,72,153,0.35)]"
        animate={{
          y: state === "celebrating" ? [0, -10, 0] : state === "speaking" ? [0, -3, 0] : [0, -4, 0],
          rotate: state === "listening" ? [0, -3, 3, 0] : 0,
        }}
        transition={{
          duration: state === "celebrating" ? 1.2 : 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <defs>
          <linearGradient id="miaBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="60%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#DB2777" />
          </linearGradient>
          <linearGradient id="miaFace" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF1F2" />
            <stop offset="100%" stopColor="#FFE4E6" />
          </linearGradient>
          <linearGradient id="miaEar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#E879F9" />
          </linearGradient>
        </defs>

        {/* Swirl Ears / Creative Antenna */}
        <motion.g
          animate={{
            rotate: state === "listening" ? [3, -5, 3] : [0, 2, 0],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Left Swirl Ear */}
          <path d="M 60 55 C 40 25 30 15 50 10 C 65 5 70 35 70 50 Z" fill="url(#miaEar)" />
          {/* Right Swirl Ear */}
          <path d="M 140 55 C 160 25 170 15 150 10 C 135 5 130 35 130 50 Z" fill="url(#miaEar)" />
        </motion.g>

        {/* Body Base */}
        <rect x="58" y="112" width="84" height="74" rx="36" fill="url(#miaBody)" stroke="#BE185D" strokeWidth="2" />

        {/* Empathy Heart Emblem on Chest */}
        <motion.path
          d="M 100 144 C 95 136, 85 138, 85 148 C 85 158, 100 168, 100 168 C 100 168, 115 158, 115 148 C 115 138, 105 136, 100 144 Z"
          fill="#FFF1F2"
          stroke="#F43F5E"
          strokeWidth="1.5"
          animate={{
            scale: state === "listening" || state === "speaking" ? [1, 1.15, 1] : [1, 1.05, 1],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "100px 150px" }}
        />

        {/* Head */}
        <rect x="42" y="44" width="116" height="84" rx="42" fill="url(#miaBody)" stroke="#BE185D" strokeWidth="2" />

        {/* Face Plate */}
        <rect x="52" y="54" width="96" height="64" rx="32" fill="url(#miaFace)" />

        {/* Warm Cheeks */}
        <ellipse cx="66" cy="94" rx="8" ry="5" fill="#FB7185" opacity="0.6" />
        <ellipse cx="134" cy="94" rx="8" ry="5" fill="#FB7185" opacity="0.6" />

        {/* Eyes: Expressive & Warm */}
        {state === "listening" ? (
          <g>
            <circle cx="78" cy="78" r="9.5" fill="#4C1D95" />
            <circle cx="75" cy="75" r="3.5" fill="#FFFFFF" />
            <circle cx="122" cy="78" r="9.5" fill="#4C1D95" />
            <circle cx="119" cy="75" r="3.5" fill="#FFFFFF" />
          </g>
        ) : state === "celebrating" ? (
          <g stroke="#831843" strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d="M 70 80 Q 78 70 86 80" />
            <path d="M 114 80 Q 122 70 130 80" />
          </g>
        ) : (
          <g>
            <motion.ellipse
              cx="78"
              cy="78"
              rx="8.5"
              ry="8.5"
              fill="#4C1D95"
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.48, 0.52, 1] }}
            />
            <circle cx="75" cy="75" r="3" fill="#FFFFFF" />
            <circle cx="80" cy="80" r="1.5" fill="#FFFFFF" />
            <motion.ellipse
              cx="122"
              cy="78"
              rx="8.5"
              ry="8.5"
              fill="#4C1D95"
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.48, 0.52, 1] }}
            />
            <circle cx="119" cy="75" r="3" fill="#FFFFFF" />
            <circle cx="124" cy="80" r="1.5" fill="#FFFFFF" />
          </g>
        )}

        {/* Sweet Nose */}
        <ellipse cx="100" cy="85" rx="3.5" ry="2.5" fill="#EC4899" />

        {/* Mouth */}
        {state === "speaking" ? (
          <motion.path
            d="M 92 94 Q 100 106 108 94 Z"
            fill="#9D174D"
            stroke="#831843"
            strokeWidth="1.5"
            animate={{
              d: [
                "M 92 94 Q 100 106 108 94 Z",
                "M 94 94 Q 100 99 106 94 Z",
                "M 91 94 Q 100 110 109 94 Z",
                "M 92 94 Q 100 106 108 94 Z",
              ],
            }}
            transition={{ duration: 0.45, repeat: Infinity }}
          />
        ) : (
          <path d="M 93 94 Q 100 102 107 94" stroke="#9D174D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}

        {/* Storytelling Magic Sparkles */}
        {(state === "speaking" || state === "celebrating") && (
          <motion.g
            animate={{ opacity: [0.4, 1, 0.4], y: [-2, -8, -2] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <path d="M 32 40 L 34 32 L 42 34 L 34 36 Z" fill="#F472B6" />
            <path d="M 164 42 L 166 34 L 174 36 L 166 38 Z" fill="#F472B6" />
          </motion.g>
        )}
      </motion.svg>
    </div>
  );
};
