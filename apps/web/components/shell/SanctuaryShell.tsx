"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageCircle,
  BookOpen,
  Sprout,
  Compass,
  Heart,
  Clock,
  Bookmark,
  Link2,
  ShieldCheck,
  Sliders,
  LifeBuoy,
  Sun,
  Moon,
  Eye,
  Languages,
  Menu,
  X,
  MoreHorizontal,
  Sparkles,
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
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
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
    const next = theme === "light" ? "dark" : "light";
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

  const primaryNav = [
    { href: "/dashboard", label: "Home", icon: Home, match: ["/dashboard"] },
    {
      href: "/companion/voice",
      label: "Talk",
      icon: MessageCircle,
      match: ["/companion/voice", "/companion/chat"],
    },
    { href: "/journal", label: "My Journal", icon: BookOpen, match: ["/journal"] },
    { href: "/growth", label: "My Growth", icon: Sprout, match: ["/growth"] },
    { href: "/knowledge", label: "Explore", icon: Compass, match: ["/knowledge", "/explore"] },
    { href: "/check-in", label: "My Space", icon: Heart, match: ["/check-in"] },
  ];

  const secondaryNav = [
    { href: "/reminders", label: "Reminders", icon: Clock },
    { href: "/memory", label: "Memories", icon: Bookmark },
    { href: "/integrations", label: "Connected Apps", icon: Link2 },
    { href: "/settings/privacy", label: "Privacy", icon: ShieldCheck },
    { href: "/settings/notifications", label: "Settings", icon: Sliders },
    { href: "/admin", label: "Admin Console", icon: Sparkles },
    { href: "/safety", label: "Help and Support", icon: LifeBuoy },
  ];

  const mobileBottomTabs = [
    { href: "/dashboard", label: "Home", icon: Home, match: ["/dashboard"] },
    {
      href: "/companion/voice",
      label: "Talk",
      icon: MessageCircle,
      match: ["/companion/voice", "/companion/chat"],
    },
    { href: "/journal", label: "My Journal", icon: BookOpen, match: ["/journal"] },
    { href: "/memory", label: "Memories", icon: Bookmark, match: ["/memory"] },
  ];

  const isRouteActive = (href: string, matches?: string[]) => {
    if (matches) {
      return matches.some((m) => pathname === m || pathname?.startsWith(m + "/"));
    }
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <div
      className={cn(
        "min-h-screen w-full overflow-x-hidden flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors duration-300",
        theme
      )}
      dir={direction}
    >
      {/* Skip-to-content accessibility link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-5 py-3 bg-[#285B55] text-white rounded-2xl text-sm font-medium shadow-elevated"
      >
        Skip to main content
      </a>

      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full border-b border-[#E6E1D8] bg-[#FAF8F4]/90 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Brand Logo */}
          <Link
            href="/dashboard"
            className="flex items-center space-x-3.5 group focus-visible:rounded-2xl"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#E8F1EB] border border-[#CBE0D3] group-hover:bg-[#D5E6DC] transition-colors">
              <div className="w-3.5 h-3.5 rounded-full bg-[#285B55] animate-breathe" />
            </div>
            <div>
              <span className="font-serif text-xl tracking-tight font-semibold text-[#263330] block leading-none">
                InnerOS
              </span>
              <span className="text-xs text-[#52625E] mt-1 block">
                Your personal wellbeing space
              </span>
            </div>
          </Link>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language / RTL Toggle */}
            <button
              onClick={toggleDirection}
              className="px-3 py-2 min-h-[40px] rounded-xl bg-white border border-[#E4E0D8] text-[#52625E] hover:text-[#263330] hover:bg-[#F3EFE8] transition-colors flex items-center space-x-1.5 text-xs font-medium"
              title="Switch reading direction or language"
              aria-label="Switch reading direction or language"
            >
              <Languages className="w-4 h-4 text-[#285B55]" />
              <span className="hidden sm:inline">{direction === "ltr" ? "EN" : "AR (RTL)"}</span>
            </button>

            {/* Reduced Motion Toggle */}
            <button
              onClick={toggleReducedMotion}
              className={cn(
                "px-3 py-2 min-h-[40px] rounded-xl border transition-colors flex items-center space-x-1.5 text-xs font-medium",
                isReducedMotion
                  ? "bg-[#EDE8F5] border-[#D0C4E8] text-[#423166]"
                  : "bg-white border-[#E4E0D8] text-[#52625E] hover:text-[#263330] hover:bg-[#F3EFE8]"
              )}
              title={isReducedMotion ? "Calm motion active" : "Pause animations"}
              aria-pressed={isReducedMotion}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden md:inline">
                {isReducedMotion ? "Calm Motion" : "Motion"}
              </span>
            </button>

            {/* Optional Light / Dark Mode Switch */}
            <button
              onClick={toggleTheme}
              className="p-2.5 min-h-[40px] min-w-[40px] rounded-xl bg-white border border-[#E4E0D8] text-[#52625E] hover:text-[#263330] hover:bg-[#F3EFE8] transition-colors flex items-center justify-center"
              title={theme === "light" ? "Switch to evening dark mode" : "Switch to warm light mode"}
              aria-label={theme === "light" ? "Switch to evening dark mode" : "Switch to warm light mode"}
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Unobtrusive, accessible Help & Support button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEmergencyOpen(true)}
              leftIcon={<LifeBuoy className="w-4 h-4 text-[#9B1C31]" />}
              className="border-[#E8D5D5] hover:bg-[#FDF2F2] text-[#263330]"
            >
              <span className="hidden sm:inline">Need Support?</span>
              <span className="sm:hidden">Help</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Layout with Desktop Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 gap-8 pb-28 md:pb-12">
        {/* Desktop Sidebar */}
        <aside
          aria-label="Main Navigation"
          className="hidden md:flex flex-col w-64 shrink-0 space-y-8"
        >
          {/* Primary Navigation */}
          <nav className="space-y-1.5">
            <p className="px-3.5 text-xs font-semibold text-[#52625E] tracking-wide mb-2">
              Your Space
            </p>
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const active = isRouteActive(item.href, item.match);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center space-x-3.5 px-4 py-3 min-h-[46px] rounded-2xl text-base font-medium transition-all",
                    active
                      ? "bg-[#285B55] text-white shadow-sm"
                      : "text-[#263330] hover:bg-[#E8F1EB]/70 hover:text-[#1F4742]"
                  )}
                >
                  <Icon
                    className={cn("w-5 h-5 shrink-0", active ? "text-white" : "text-[#285B55]")}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Secondary Navigation */}
          <nav className="space-y-1.5 pt-4 border-t border-[#E6E1D8]">
            <p className="px-3.5 text-xs font-semibold text-[#52625E] tracking-wide mb-2">
              Library & Controls
            </p>
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const active = isRouteActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center space-x-3.5 px-4 py-2.5 min-h-[44px] rounded-2xl text-sm font-medium transition-all",
                    active
                      ? "bg-[#E8F1EB] text-[#1F4742] font-semibold border border-[#CBE0D3]"
                      : "text-[#52625E] hover:bg-[#F3EFE8] hover:text-[#263330]"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0",
                      active ? "text-[#285B55]" : "text-[#6E7E7A]"
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Reassuring AI Transparency Card */}
          <div className="p-4 rounded-2xl bg-[#E8F1EB]/60 border border-[#D2E4DA] space-y-1.5">
            <div className="flex items-center space-x-2 text-[#1F4742] font-medium text-sm">
              <Sparkles className="w-4 h-4 text-[#285B55] shrink-0" />
              <span>AI Wellbeing Companion</span>
            </div>
            <p className="text-xs text-[#52625E] leading-relaxed">
              InnerOS is a supportive AI space for reflection. For medical advice or crisis care, human help is always one click away.
            </p>
            <div className="pt-1 border-t border-[#CFE2D6]">
              <Link
                href="/"
                className="text-xs font-semibold text-[#285B55] hover:underline inline-flex items-center space-x-1"
              >
                <span>Visit Public Website &amp; Guide &rarr;</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Page View */}
        <main id="main-content" className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E6E1D8] px-2 py-1.5 shadow-elevated"
      >
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          {mobileBottomTabs.map((item) => {
            const Icon = item.icon;
            const active = isRouteActive(item.href, item.match);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 min-h-[52px] rounded-2xl text-xs font-medium transition-colors",
                  active
                    ? "text-[#285B55] bg-[#E8F1EB]/70 font-semibold"
                    : "text-[#52625E] hover:text-[#263330]"
                )}
              >
                <Icon className={cn("w-5 h-5 mb-1", active ? "text-[#285B55]" : "text-[#52625E]")} />
                <span className="truncate max-w-full">{item.label}</span>
              </Link>
            );
          })}

          {/* Mobile More Drawer Trigger */}
          <button
            onClick={() => setIsMobileMoreOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center py-2 px-1 min-h-[52px] rounded-2xl text-xs font-medium transition-colors",
              isMobileMoreOpen
                ? "text-[#285B55] bg-[#E8F1EB]/70 font-semibold"
                : "text-[#52625E] hover:text-[#263330]"
            )}
            aria-expanded={isMobileMoreOpen}
            aria-label="More destinations and settings"
          >
            <MoreHorizontal className="w-5 h-5 mb-1" />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* Mobile More Sheet */}
      {isMobileMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#263330]/40 backdrop-blur-xs flex items-end">
          <div className="w-full bg-[#FAF8F4] rounded-t-3xl border-t border-[#E6E1D8] p-6 space-y-6 max-h-[85vh] overflow-y-auto shadow-elevated">
            <div className="flex items-center justify-between border-b border-[#E6E1D8] pb-4">
              <div>
                <h2 className="text-lg font-serif font-semibold text-[#263330]">
                  More Destinations
                </h2>
                <p className="text-sm text-[#52625E]">Explore tools, privacy, and support</p>
              </div>
              <button
                onClick={() => setIsMobileMoreOpen(false)}
                className="p-2.5 rounded-xl bg-white border border-[#E4E0D8] text-[#263330]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[...primaryNav.slice(3), ...secondaryNav].map((item) => {
                const Icon = item.icon;
                const active = isRouteActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMoreOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 p-3.5 rounded-2xl border text-sm font-medium transition-all",
                      active
                        ? "bg-[#285B55] text-white border-[#285B55]"
                        : "bg-white text-[#263330] border-[#E6E1D8] hover:bg-[#E8F1EB]/50"
                    )}
                  >
                    <Icon className={cn("w-5 h-5 shrink-0", active ? "text-white" : "text-[#285B55]")} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Emergency Support Modal */}
      <EmergencyModal isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} />
    </div>
  );
};
