"use client";

import React from "react";
import { motion } from "framer-motion";
import { CharacterVisualState } from "./KaiCharacter";

interface ZaynCharacterProps {
  state?: CharacterVisualState;
  size?: "sm" | "md" | "lg" | "hero";
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  label?: string;
}

export const ZaynCharacter: React.FC<ZaynCharacterProps> = ({
  state = "idle",
  size = "md",
  interactive = false,
  onClick,
  className = "",
  label = "Zayn the energetic explorer",
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
      {/* Energetic Cosmic Glow */}
      <motion.div
        animate={{
          scale: state === "speaking" || state === "celebrating" ? [1, 1.22, 1] : [1, 1.08, 1],
          opacity: [0.4, 0.75, 0.4],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full blur-2xl bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-300 opacity-60 pointer-events-none"
      />

      {/* Main Zayn SVG */}
      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full relative z-10 drop-shadow-[0_10px_24px_rgba(16,185,129,0.35)]"
        animate={{
          y: state === "celebrating" ? [0, -14, 0] : state === "speaking" ? [0, -4, 0] : [0, -3, 0],
          rotate: state === "listening" ? [0, 5, -4, 0] : [0, 1, -1, 0],
        }}
        transition={{
          duration: state === "celebrating" ? 1 : 2.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <defs>
          <linearGradient id="zaynBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="zaynGoggles" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
          <linearGradient id="zaynFace" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F0FDF4" />
            <stop offset="100%" stopColor="#DCFCE7" />
          </linearGradient>
        </defs>

        {/* Aviator Goggles Strap on top of head */}
        <path d="M 40 54 Q 100 40 160 54" stroke="#064E3B" strokeWidth="8" strokeLinecap="round" fill="none" />

        {/* Body */}
        <rect x="58" y="112" width="84" height="74" rx="36" fill="url(#zaynBody)" stroke="#065F46" strokeWidth="2" />

        {/* Compass / Reactor Badge on chest */}
        <circle cx="100" cy="148" r="14" fill="#064E3B" stroke="#34D399" strokeWidth="2" />
        <motion.polygon
          points="100,138 103,148 100,158 97,148"
          fill="#34D399"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "100px 148px" }}
        />

        {/* Head */}
        <rect x="42" y="44" width="116" height="84" rx="42" fill="url(#zaynBody)" stroke="#065F46" strokeWidth="2" />

        {/* Face Plate */}
        <rect x="52" y="58" width="96" height="60" rx="30" fill="url(#zaynFace)" />

        {/* Aviator Goggles (resting on forehead) */}
        <g>
          {/* Left Lens */}
          <circle cx="76" cy="48" r="16" fill="url(#zaynGoggles)" stroke="#064E3B" strokeWidth="3" />
          <path d="M 68 44 Q 76 38 84 44" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
          {/* Right Lens */}
          <circle cx="124" cy="48" r="16" fill="url(#zaynGoggles)" stroke="#064E3B" strokeWidth="3" />
          <path d="M 116 44 Q 124 38 132 44" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
          {/* Bridge */}
          <rect x="90" y="45" width="20" height="6" rx="3" fill="#064E3B" />
        </g>

        {/* Eyes: Curious and bright */}
        {state === "listening" ? (
          <g>
            <circle cx="76" cy="82" r="10" fill="#064E3B" />
            <circle cx="73" cy="79" r="4" fill="#FFFFFF" />
            <circle cx="124" cy="82" r="10" fill="#064E3B" />
            <circle cx="121" cy="79" r="4" fill="#FFFFFF" />
          </g>
        ) : state === "celebrating" ? (
          <g stroke="#064E3B" strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d="M 68 84 Q 76 74 84 84" />
            <path d="M 116 84 Q 124 74 132 84" />
          </g>
        ) : (
          <g>
            <motion.ellipse
              cx="76"
              cy="82"
              rx="9"
              ry="9"
              fill="#064E3B"
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.45, 0.48, 0.52, 1] }}
            />
            <circle cx="73" cy="79" r="3.5" fill="#FFFFFF" />
            <circle cx="78" cy="84" r="1.5" fill="#34D399" />
            <motion.ellipse
              cx="124"
              cy="82"
              rx="9"
              ry="9"
              fill="#064E3B"
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.45, 0.48, 0.52, 1] }}
            />
            <circle cx="121" cy="79" r="3.5" fill="#FFFFFF" />
            <circle cx="126" cy="84" r="1.5" fill="#34D399" />
          </g>
        )}

        {/* Whiskers */}
        <line x1="50" y1="92" x2="62" y2="92" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="97" x2="63" y2="99" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
        <line x1="150" y1="92" x2="138" y2="92" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
        <line x1="150" y1="97" x2="137" y2="99" stroke="#059669" strokeWidth="2" strokeLinecap="round" />

        {/* Nose */}
        <polygon points="100,88 95,93 105,93" fill="#047857" />

        {/* Mouth */}
        {state === "speaking" ? (
          <motion.path
            d="M 90 98 Q 100 112 110 98 Z"
            fill="#064E3B"
            stroke="#064E3B"
            strokeWidth="1.5"
            animate={{
              d: [
                "M 90 98 Q 100 112 110 98 Z",
                "M 92 98 Q 100 104 108 98 Z",
                "M 89 98 Q 100 116 111 98 Z",
                "M 90 98 Q 100 112 110 98 Z",
              ],
            }}
            transition={{ duration: 0.38, repeat: Infinity }}
          />
        ) : (
          <path d="M 91 97 Q 100 106 109 97" stroke="#064E3B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}

        {/* Curious Antenna bouncing */}
        <motion.g
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "100px 30px" }}
        >
          <line x1="100" y1="36" x2="100" y2="18" stroke="#047857" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="14" r="6" fill="#34D399" stroke="#064E3B" strokeWidth="2" />
        </motion.g>
      </motion.svg>
    </div>
  );
};
