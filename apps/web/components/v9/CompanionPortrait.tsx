"use client";

import React from "react";

export type CompanionId = "kai" | "mia" | "lumi" | "zayn";
export type CompanionState = "idle" | "listening" | "speaking" | "celebrating";

interface CompanionPortraitProps {
  character: CompanionId;
  size?: number;
  state?: CompanionState;
  className?: string;
}

/**
 * Custom hand-crafted SVG character portraits for Kai, Mia, Lumi, and Zayn.
 * Replaces generic emoji avatars with expressive, accessible vector artwork.
 */
export function CompanionPortrait({
  character,
  size = 96,
  state = "idle",
  className = "",
}: CompanionPortraitProps) {
  const pulseClass =
    state === "speaking"
      ? "animate-bounce"
      : state === "listening"
      ? "animate-pulse"
      : "";

  if (character === "kai") {
    // Kai: Explorer Otter/Cub with adventure compass goggles & teal scarf
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Kai — Explorer & Problem-Solving Guide"
        className={`select-none ${pulseClass} ${className}`}
      >
        <defs>
          <radialGradient id="kaiBg" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#CCFBF1" />
            <stop offset="100%" stopColor="#5EEAD4" />
          </radialGradient>
          <linearGradient id="kaiGoggle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="56" fill="url(#kaiBg)" stroke="#0D9488" strokeWidth="3" />
        {/* Ears */}
        <circle cx="30" cy="36" r="12" fill="#0F766E" />
        <circle cx="30" cy="36" r="6" fill="#99F6E4" />
        <circle cx="90" cy="36" r="12" fill="#0F766E" />
        <circle cx="90" cy="36" r="6" fill="#99F6E4" />
        {/* Head */}
        <rect x="26" y="30" width="68" height="62" rx="32" fill="#14B8A6" />
        <ellipse cx="60" cy="66" rx="24" ry="20" fill="#F0FDFA" />
        {/* Explorer Goggles on Forehead */}
        <rect x="30" y="33" width="60" height="14" rx="7" fill="#0F172A" />
        <circle cx="45" cy="40" r="7" fill="url(#kaiGoggle)" stroke="#F8FAFC" strokeWidth="2" />
        <circle cx="75" cy="40" r="7" fill="url(#kaiGoggle)" stroke="#F8FAFC" strokeWidth="2" />
        {/* Eyes */}
        <circle cx="46" cy="58" r="5" fill="#0F172A" />
        <circle cx="48" cy="56" r="1.8" fill="#FFFFFF" />
        <circle cx="74" cy="58" r="5" fill="#0F172A" />
        <circle cx="76" cy="56" r="1.8" fill="#FFFFFF" />
        {/* Nose & Smile */}
        <ellipse cx="60" cy="65" rx="5" ry="3.5" fill="#0F172A" />
        {state === "speaking" ? (
          <ellipse cx="60" cy="74" rx="6" ry="4.5" fill="#0F766E" />
        ) : (
          <path
            d="M52 72C54.5 76 65.5 76 68 72"
            stroke="#0F172A"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
        {/* Adventure Scarf */}
        <path d="M34 86C44 93 76 93 86 86L82 98C68 103 52 103 38 98L34 86Z" fill="#F59E0B" />
      </svg>
    );
  }

  if (character === "mia") {
    // Mia: Storyteller Songbird/Fox with painter beret & warm magenta palette
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Mia — Storyteller & Creative Companion"
        className={`select-none ${pulseClass} ${className}`}
      >
        <defs>
          <radialGradient id="miaBg" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FCE7F3" />
            <stop offset="100%" stopColor="#F9A8D4" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="56" fill="url(#miaBg)" stroke="#DB2777" strokeWidth="3" />
        {/* Artist Beret */}
        <ellipse cx="62" cy="28" rx="28" ry="11" fill="#9D174D" />
        <path d="M60 15L63 20" stroke="#9D174D" strokeWidth="3.5" strokeLinecap="round" />
        {/* Head */}
        <rect x="28" y="32" width="64" height="60" rx="30" fill="#EC4899" />
        <ellipse cx="60" cy="65" rx="23" ry="19" fill="#FFF1F2" />
        {/* Cheeks */}
        <circle cx="40" cy="66" r="4.5" fill="#F472B6" opacity="0.6" />
        <circle cx="80" cy="66" r="4.5" fill="#F472B6" opacity="0.6" />
        {/* Eyes */}
        <circle cx="46" cy="56" r="5" fill="#0F172A" />
        <circle cx="47.5" cy="54.5" r="1.8" fill="#FFFFFF" />
        <circle cx="74" cy="56" r="5" fill="#0F172A" />
        <circle cx="75.5" cy="54.5" r="1.8" fill="#FFFFFF" />
        {/* Smile */}
        {state === "speaking" ? (
          <ellipse cx="60" cy="71" rx="6" ry="4.5" fill="#BE185D" />
        ) : (
          <path
            d="M51 69C54 74 66 74 69 69"
            stroke="#0F172A"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
        {/* Star Badge */}
        <path
          d="M84 32L86.2 36.5L91 37.2L87.5 40.6L88.3 45.4L84 43.1L79.7 45.4L80.5 40.6L77 37.2L81.8 36.5L84 32Z"
          fill="#FBBF24"
        />
      </svg>
    );
  }

  if (character === "lumi") {
    // Lumi: Gentle Cloud-Lantern Spirit with soothing lavender halo
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Lumi — Calm, Feelings & Gentle Support"
        className={`select-none ${pulseClass} ${className}`}
      >
        <defs>
          <radialGradient id="lumiBg" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#F5F3FF" />
            <stop offset="100%" stopColor="#C4B5FD" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="56" fill="url(#lumiBg)" stroke="#7C3AED" strokeWidth="3" />
        {/* Gentle Halo */}
        <ellipse cx="60" cy="24" rx="18" ry="4.5" stroke="#F59E0B" strokeWidth="3" />
        {/* Soft Cloud Form */}
        <circle cx="42" cy="62" r="20" fill="#8B5CF6" />
        <circle cx="78" cy="62" r="20" fill="#8B5CF6" />
        <circle cx="60" cy="52" r="26" fill="#8B5CF6" />
        <rect x="34" y="54" width="52" height="34" rx="17" fill="#EDE9FE" />
        {/* Calm Eyes */}
        <path d="M43 64C45 61 49 61 51 64" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" />
        <path d="M69 64C71 61 75 61 77 64" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" />
        {/* Gentle Smile */}
        {state === "speaking" ? (
          <circle cx="60" cy="74" r="4.5" fill="#6D28D9" />
        ) : (
          <path d="M54 73C56.5 76.5 63.5 76.5 66 73" stroke="#1E1B4B" strokeWidth="2.8" strokeLinecap="round" />
        )}
        {/* Heart Emblem */}
        <path
          d="M60 95C60 95 51 89 51 84.5C51 82 53 80 55.5 80C57.2 80 58.8 81 60 82.5C61.2 81 62.8 80 64.5 80C67 80 69 82 69 84.5C69 89 60 95 60 95Z"
          fill="#EC4899"
        />
      </svg>
    );
  }

  // Zayn: Curiosity & Tech Owl-Bot with warm amber antenna & friendly visor
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Zayn — Curiosity, Coding & Everyday Skills"
      className={`select-none ${pulseClass} ${className}`}
    >
      <defs>
        <radialGradient id="zaynBg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FCD34D" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#zaynBg)" stroke="#D97706" strokeWidth="3" />
      {/* Spark Antenna */}
      <line x1="60" y1="18" x2="60" y2="32" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="16" r="6" fill="#10B981" stroke="#0F172A" strokeWidth="2.5" />
      {/* Head */}
      <rect x="26" y="32" width="68" height="60" rx="24" fill="#F59E0B" stroke="#0F172A" strokeWidth="2.5" />
      {/* Friendly Visor */}
      <rect x="34" y="42" width="52" height="26" rx="13" fill="#0F172A" />
      {/* Glowing LED Eyes */}
      <circle cx="48" cy="55" r="5.5" fill="#34D399" />
      <circle cx="72" cy="55" r="5.5" fill="#34D399" />
      {/* Smile */}
      {state === "speaking" ? (
        <rect x="52" y="74" width="16" height="7" rx="3.5" fill="#0F172A" />
      ) : (
        <path d="M50 76C54 81 66 81 70 76" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
      )}
    </svg>
  );
}
