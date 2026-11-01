"use client";

import React from "react";
import Link from "next/link";
import { Sun, Moon, Eye, Shield } from "lucide-react";
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
    <header className="sticky top-0 z-40 w-full border-b border-[#E4E0D8] bg-[#FFFBF7]/90 backdrop-blur-xl px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Breathing Node */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-2xl bg-[#E5F1E8] border border-[#285B55]/25 group-hover:border-[#285B55]/50 transition-colors">
            <div className="w-3 h-3 rounded-full bg-[#285B55] animate-breathe" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif-editorial text-lg tracking-tight font-semibold text-[#263330]">
                InnerOS
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#E5F1E8] text-[#285B55]">
                v2.0
              </span>
            </div>
            <p className="text-xs text-[#52625E] hidden sm:block">Sanctuary for Emotional Wellbeing</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 p-1 rounded-2xl bg-[#F3EFE8] border border-[#E4E0D8]">
          <Link
            href="/dashboard"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "companion"
                ? "bg-[#285B55] text-white shadow-sm"
                : "text-[#52625E] hover:text-[#263330]"
            }`}
          >
            Companion
          </Link>
          <Link
            href="/explore"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "explore"
                ? "bg-[#285B55] text-white shadow-sm"
                : "text-[#52625E] hover:text-[#263330]"
            }`}
          >
            Design Directions
          </Link>
          <Link
            href="/design-system"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "design-system"
                ? "bg-[#285B55] text-white shadow-sm"
                : "text-[#52625E] hover:text-[#263330]"
            }`}
          >
            Design Tokens
          </Link>
        </nav>

        {/* Accessibility & Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleReducedMotion}
            className={`p-2 rounded-xl text-xs transition-colors border ${
              isReducedMotion
                ? "bg-[#EEE7FA] border-[#6B519E]/30 text-[#553E82]"
                : "bg-white border-[#E4E0D8] text-[#52625E] hover:text-[#263330]"
            }`}
            title={isReducedMotion ? "Motion: Reduced (Accessible)" : "Motion: Standard"}
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-white border border-[#E4E0D8] text-[#52625E] hover:text-[#263330] transition-colors"
            title={`Switch to ${currentTheme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {currentTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Button
            size="sm"
            variant="emergency"
            onClick={onOpenHotlines}
            leftIcon={<Shield className="w-3.5 h-3.5" />}
          >
            <span className="hidden sm:inline">Support</span> 988
          </Button>
        </div>
      </div>
    </header>
  );
};
