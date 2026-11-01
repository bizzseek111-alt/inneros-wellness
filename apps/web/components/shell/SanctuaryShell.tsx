"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  Mic,
  MessageSquare,
  Activity,
  BookOpen,
  Target,
  Clock,
  Library,
  GitBranch,
  Puzzle,
  Bell,
  Lock,
  LifeBuoy,
  Sun,
  Moon,
  Eye,
  Languages,
  Menu,
  X,
  Database,
  ArrowRight,
  Shield,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/primitives/Button";
import { EmergencyModal } from "@/components/safety/EmergencyModal";
import { prototypeService } from "@/lib/prototype-service";

interface SanctuaryShellProps {
  children: React.ReactNode;
}

export const SanctuaryShell: React.FC<SanctuaryShellProps> = ({ children }) => {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const state = prototypeService.getState();
    setLanguage(state.user.language || "en");
    setDirection(state.user.direction || "ltr");
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", state.user.direction || "ltr");
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next === "dark");
      document.documentElement.classList.toggle("light", next === "light");
    }
  };

  const toggleDirection = () => {
    const nextDir = direction === "ltr" ? "rtl" : "ltr";
    const nextLang = nextDir === "rtl" ? "ar" : "en";
    setDirection(nextDir);
    setLanguage(nextLang);
    prototypeService.setLanguage(nextLang);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", nextDir);
    }
  };

  const toggleReducedMotion = () => {
    setIsReducedMotion(!isReducedMotion);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("reduced-motion", !isReducedMotion);
    }
  };

  const navSections = [
    {
      group: "Sanctuary Living",
      items: [
        { href: "/dashboard", label: "Home Sanctuary", icon: LayoutDashboard },
        { href: "/companion/voice", label: "Voice Companion", icon: Mic },
        { href: "/companion/chat", label: "Text Sanctuary", icon: MessageSquare },
        { href: "/check-in", label: "Resonance Check-In", icon: Activity },
      ],
    },
    {
      group: "Inner Growth",
      items: [
        { href: "/journal", label: "Daily Reflection", icon: BookOpen },
        { href: "/growth", label: "Compassionate Growth", icon: Target },
        { href: "/reminders", label: "Mindful Pacing", icon: Clock },
      ],
    },
    {
      group: "Wisdom & Memory",
      items: [
        { href: "/knowledge", label: "Evidence Library", icon: Library },
        { href: "/memory", label: "Life Graph & Memory", icon: GitBranch },
      ],
    },
    {
      group: "Agency & Privacy",
      items: [
        { href: "/integrations", label: "Connected Archives", icon: Puzzle },
        { href: "/settings/notifications", label: "Quiet Hours", icon: Bell },
        { href: "/settings/privacy", label: "Envelope Privacy", icon: Lock },
        { href: "/safety", label: "Crisis & Human Care", icon: LifeBuoy },
      ],
    },
  ];

  return (
    <div className={cn("min-h-screen flex flex-col transition-colors duration-300", theme)} dir={direction}>
      {/* Skip-to-content accessibility standard */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 z-50 px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold shadow-lg"
      >
        Skip to main content
      </a>

      {/* Top Universal Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-midnight-950/80 backdrop-blur-xl px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Mobile menu toggle & Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              className="md:hidden p-2 rounded-xl bg-midnight-900 border border-white/[0.08] text-zinc-300"
              aria-label="Toggle navigation drawer"
            >
              {isMobileDrawerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-teal-950/80 border border-teal-600/40 group-hover:border-teal-400 transition-colors">
                <div className="w-3 h-3 rounded-full bg-teal-400 animate-breathe shadow-[0_0_12px_rgba(52,134,128,0.8)]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-serif-editorial text-lg tracking-tight font-semibold text-ivory-100">
                    InnerOS
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/60">
                    Prototype
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 hidden sm:block">Sanctuary for Emotional Wellbeing</p>
              </div>
            </Link>
          </div>

          {/* Quick Header Controls */}
          <div className="flex items-center space-x-2">
            {/* Direction / Language Toggle (RTL Demo) */}
            <button
              onClick={toggleDirection}
              className="p-2 rounded-xl bg-midnight-900/90 border border-white/[0.08] text-zinc-400 hover:text-ivory-100 transition-colors flex items-center space-x-1"
              title={`Switch Layout: currently ${direction.toUpperCase()}`}
            >
              <Languages className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase hidden sm:inline">{direction}</span>
            </button>

            {/* Reduced Motion Toggle */}
            <button
              onClick={toggleReducedMotion}
              className={`p-2 rounded-xl border transition-colors ${
                isReducedMotion
                  ? "bg-indigo-950 border-indigo-700 text-indigo-300"
                  : "bg-midnight-900/90 border-white/[0.08] text-zinc-400 hover:text-ivory-100"
              }`}
              title={isReducedMotion ? "Reduced Motion Active" : "Standard Motion"}
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-midnight-900/90 border border-white/[0.08] text-zinc-400 hover:text-ivory-100 transition-colors"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Universal Crisis Support Button */}
            <Button
              size="sm"
              variant="emergency"
              onClick={() => setIsEmergencyOpen(true)}
              leftIcon={<Shield className="w-3.5 h-3.5" />}
            >
              <span className="hidden sm:inline">Crisis</span> 988
            </Button>
          </div>
        </div>
      </header>

      {/* Main Responsive Grid Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 gap-8">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 space-y-6">
          {navSections.map((sec) => (
            <div key={sec.group} className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 px-3 block">
                {sec.group}
              </span>
              <nav className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 select-none",
                        isActive
                          ? "bg-teal-950/80 text-teal-200 border border-teal-700/60 shadow-sm"
                          : "text-zinc-400 hover:text-ivory-100 hover:bg-white/[0.04]"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-teal-400" : "text-zinc-500")} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}

          {/* Synthetic User Footer Card */}
          <div className="mt-auto p-3.5 rounded-2xl bg-midnight-900/70 border border-white/[0.06] space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-zinc-300">
              <div className="w-2 h-2 rounded-full bg-teal-400" />
              <span className="font-medium text-ivory-100">Elena Vance</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-tight">
              Synthetic Persona &bull; Zero Real PHI Recorded
            </p>
            <div className="pt-1 flex items-center justify-between text-[11px] text-teal-400/90 font-mono">
              <span>AES-256 HKDF</span>
              <span>Encrypted</span>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md md:hidden flex">
            <div className="w-72 bg-midnight-950 h-full p-6 border-r border-white/[0.1] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <span className="font-serif-editorial text-base text-ivory-100 font-semibold">
                  InnerOS Navigation
                </span>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {navSections.map((sec) => (
                <div key={sec.group} className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                    {sec.group}
                  </span>
                  <div className="space-y-1">
                    {sec.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileDrawerOpen(false)}
                          className={cn(
                            "flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium",
                            isActive
                              ? "bg-teal-950 text-teal-200 border border-teal-700"
                              : "text-zinc-400 hover:text-white"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core Workspace Canvas */}
        <main id="main-content" className="flex-1 flex flex-col min-w-0 pb-16 md:pb-6">
          {children}
        </main>
      </div>

      {/* Emergency Crisis Modal */}
      <EmergencyModal isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} />
    </div>
  );
};
