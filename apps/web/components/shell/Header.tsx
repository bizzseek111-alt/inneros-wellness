"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Sun, Moon, Eye, Shield, LifeBuoy, Compass, Layers } from "lucide-react";
import { Button } from "@/components/primitives/Button";

interface HeaderProps {
  currentTheme: "dark" | "light";
  onToggleTheme: () => void;
  isReducedMotion: boolean;
  onToggleReducedMotion: () => void;
  onOpenHotlines: () => void;
  activeTab?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTheme,
  onToggleTheme,
  isReducedMotion,
  onToggleReducedMotion,
  onOpenHotlines,
  activeTab = "companion",
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-midnight-950/70 backdrop-blur-xl px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Breathing Node */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-teal-950/80 border border-teal-600/40 group-hover:border-teal-500/80 transition-colors">
            <div className="w-3 h-3 rounded-full bg-teal-400 animate-breathe shadow-[0_0_12px_rgba(52,134,128,0.8)]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif-editorial text-lg tracking-tight font-semibold text-ivory-100">
                InnerOS
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-teal-300 border border-white/[0.08]">
                v0.1
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 hidden sm:block">Sanctuary for Emotional Wellbeing</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 p-1 rounded-2xl bg-midnight-900/80 border border-white/[0.08]">
          <Link
            href="/"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "companion"
                ? "bg-teal-950/80 text-teal-200 border border-teal-700/60 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Companion
          </Link>
          <Link
            href="/explore"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "explore"
                ? "bg-teal-950/80 text-teal-200 border border-teal-700/60 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Design Directions
          </Link>
          <Link
            href="/design-system"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "design-system"
                ? "bg-teal-950/80 text-teal-200 border border-teal-700/60 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Design Tokens
          </Link>
        </nav>

        {/* Accessibility & Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Reduced Motion Toggle */}
          <button
            onClick={onToggleReducedMotion}
            className={`p-2 rounded-xl text-xs transition-colors border ${
              isReducedMotion
                ? "bg-indigo-950/70 border-indigo-700 text-indigo-300"
                : "bg-midnight-900/80 border-white/[0.08] text-zinc-400 hover:text-zinc-200"
            }`}
            title={isReducedMotion ? "Motion: Reduced (Accessible)" : "Motion: Standard"}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-midnight-900/80 border border-white/[0.08] text-zinc-400 hover:text-zinc-200 transition-colors"
            title={`Switch to ${currentTheme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {currentTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Emergency Crisis Button */}
          <Button
            size="sm"
            variant="emergency"
            onClick={onOpenHotlines}
            leftIcon={<Shield className="w-3.5 h-3.5" />}
          >
            <span className="hidden sm:inline">Crisis</span> 988
          </Button>
        </div>
      </div>
    </header>
  );
};
