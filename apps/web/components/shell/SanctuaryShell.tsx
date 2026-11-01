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
  X,
  MoreHorizontal,
  Sparkles,
  Flower2,
  Search,
  Bell,
  AlertCircle,
  Mic,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [userName, setUserName] = useState("Elena");

  useEffect(() => {
    const state = prototypeService.getState();
    setLanguage(state.user.language || "en");
    setDirection(state.user.direction || "ltr");
    setUserName(state.user.preferredName || "Elena");
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

  // Top PeopleFlow Pill Navigation Tabs
  const topPillNav = [
    { href: "/dashboard", label: "Dashboard", icon: Home, match: ["/dashboard"] },
    {
      href: "/companion/chat",
      label: "Companion",
      icon: MessageCircle,
      match: ["/companion/chat"],
    },
    {
      href: "/companion/voice",
      label: "Voice",
      icon: Mic,
      match: ["/companion/voice"],
    },
    { href: "/memory", label: "Memory", icon: Bookmark, match: ["/memory"] },
    { href: "/journal", label: "Journal", icon: BookOpen, match: ["/journal"] },
    { href: "/growth", label: "Growth", icon: Sprout, match: ["/growth"] },
    { href: "/reminders", label: "Routines", icon: Clock, match: ["/reminders"] },
    {
      href: "/settings/privacy",
      label: "Settings",
      icon: Sliders,
      match: ["/settings/privacy", "/settings/notifications"],
    },
  ];

  // Secondary Quick-Access Pills
  const secondaryNav = [
    { href: "/check-in", label: "Daily Check-In", icon: Heart, badgeBg: "bg-[#D9F296]" },
    { href: "/knowledge", label: "Psychology Library", icon: Compass, badgeBg: "bg-[#CBD8F6]" },
    { href: "/integrations", label: "Connected Archives", icon: Link2, badgeBg: "bg-[#CDE5D3]" },
    { href: "/admin", label: "Admin Console", icon: Sparkles, badgeBg: "bg-[#F6D4DC]" },
    { href: "/safety", label: "24/7 Support", icon: LifeBuoy, badgeBg: "bg-[#EAE4F7]" },
  ];

  const mobileBottomTabs = [
    { href: "/dashboard", label: "Dashboard", icon: Home, match: ["/dashboard"] },
    {
      href: "/companion/voice",
      label: "Talk",
      icon: MessageCircle,
      match: ["/companion/voice", "/companion/chat"],
    },
    { href: "/journal", label: "Journal", icon: BookOpen, match: ["/journal"] },
    { href: "/memory", label: "Memory", icon: Bookmark, match: ["/memory"] },
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
        "min-h-screen w-full overflow-x-hidden flex flex-col bg-[#EDF1EF] text-[#1A1E1C] transition-colors duration-300 selection:bg-[#D9F296] selection:text-[#1A1E1C]",
        theme === "dark" && "dark bg-[#0E1510] text-[#F2F6F3]"
      )}
      dir={direction}
    >
      {/* Skip-to-content accessibility link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-5 py-3 bg-[#1A1E1C] text-[#D9F296] rounded-full text-sm font-semibold shadow-elevated"
      >
        Skip to main content
      </a>

      {/* =====================================================================
          PEOPLEFLOW TOP FLOATING PILL HEADER (Matches Attached Reference Image)
          ===================================================================== */}
      <header className="sticky top-0 z-30 w-full px-4 sm:px-8 pt-4 pb-2 bg-[#EDF1EF]/85 backdrop-blur-xl">
        <div className="max-w-[1380px] mx-auto flex items-center justify-between gap-4">
          {/* Left: Geometric Flower Logo + InnerOS Wordmark */}
          <Link
            href="/dashboard"
            className="flex items-center space-x-2.5 group focus-visible:rounded-full shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-white border border-white shadow-xs flex items-center justify-center text-[#1A1E1C] group-hover:bg-[#D9F296] transition-colors">
              <Flower2 className="w-5 h-5" />
            </div>
            <span className="text-[19px] font-semibold tracking-tight text-[#1A1E1C]">
              InnerOS
            </span>
          </Link>

          {/* Center: Floating White Pill Bar with Solid Charcoal Active Pill */}
          <nav
            aria-label="Main Navigation"
            className="hidden xl:flex items-center space-x-1 bg-white/95 border border-white rounded-full p-1.5 shadow-[0_8px_26px_rgba(26,30,28,0.045)]"
          >
            {topPillNav.map((item) => {
              const Icon = item.icon;
              const active = isRouteActive(item.href, item.match);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center space-x-2 px-4 py-2 rounded-full text-[13.5px] font-medium transition-all whitespace-nowrap",
                    active
                      ? "bg-[#1A1E1C] text-white font-semibold shadow-xs"
                      : "text-[#4A5752] hover:text-[#1A1E1C] hover:bg-[#F4F6F5]"
                  )}
                >
                  {active && <Icon className="w-3.5 h-3.5 text-[#D9F296] shrink-0" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Floating Utility Pill + Circular Avatar (Matches PeopleFlow Top-Right) */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="flex items-center space-x-1 bg-white/95 border border-white rounded-full p-1.5 shadow-[0_8px_26px_rgba(26,30,28,0.045)]">
              {/* Search / Psychology Library */}
              <Link
                href="/knowledge"
                title="Search Psychology Library"
                aria-label="Search Psychology Library"
                className="w-9 h-9 rounded-full hover:bg-[#F4F6F5] flex items-center justify-center text-[#1A1E1C] transition-colors"
              >
                <Search className="w-4 h-4" />
              </Link>

              {/* Notification Bell with Coral Dot */}
              <Link
                href="/reminders"
                title="Reminders & Notification Outbox"
                aria-label="Reminders and Notification Outbox"
                className="relative w-9 h-9 rounded-full hover:bg-[#F4F6F5] flex items-center justify-center text-[#1A1E1C] transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E85C5C] ring-2 ring-white" />
              </Link>

              {/* 24/7 Crisis Support Trigger */}
              <button
                type="button"
                onClick={() => setIsEmergencyOpen(true)}
                title="24/7 Crisis Support & Helplines"
                aria-label="Need Support? Open 24/7 Crisis Helplines"
                className="w-9 h-9 rounded-full hover:bg-[#F6D4DC]/50 flex items-center justify-center text-[#1A1E1C] transition-colors"
              >
                <AlertCircle className="w-4 h-4 text-[#9B1C31]" />
              </button>

              {/* Language / RTL Toggle */}
              <button
                type="button"
                onClick={toggleDirection}
                title="Switch reading direction or language"
                aria-label="Switch reading direction or language"
                className="hidden sm:flex px-2.5 h-9 rounded-full hover:bg-[#F4F6F5] items-center space-x-1 text-[11.5px] font-semibold text-[#4A5752]"
              >
                <Languages className="w-3.5 h-3.5 text-[#285B55]" />
                <span>{direction === "ltr" ? "EN" : "AR"}</span>
              </button>

              {/* Calm Motion Toggle */}
              <button
                type="button"
                onClick={toggleReducedMotion}
                title={isReducedMotion ? "Calm motion active" : "Pause animations"}
                aria-pressed={isReducedMotion}
                className={cn(
                  "hidden md:flex w-9 h-9 rounded-full items-center justify-center transition-colors",
                  isReducedMotion
                    ? "bg-[#D9F296] text-[#1A1E1C]"
                    : "hover:bg-[#F4F6F5] text-[#4A5752]"
                )}
              >
                <Eye className="w-4 h-4" />
              </button>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                className="w-9 h-9 rounded-full hover:bg-[#F4F6F5] flex items-center justify-center text-[#4A5752] transition-colors"
              >
                {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
            </div>

            {/* Circular Avatar Pill (Matches PeopleFlow Blue-Ringed Avatar) */}
            <Link
              href="/login"
              title={`Signed in as ${userName} — Switch Persona`}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#CBD8F6] via-[#D9F296] to-[#CDE5D3] p-0.5 shadow-xs hover:scale-105 transition-transform shrink-0"
            >
              <div className="w-full h-full rounded-full bg-[#1A1E1C] text-white flex items-center justify-center text-xs font-bold">
                {userName.slice(0, 2).toUpperCase()}
              </div>
            </Link>
          </div>
        </div>

        {/* Sub-Bar: Quick Destination Pills (Check-In, Library, Archives, Admin, Public Website) */}
        <div className="max-w-[1380px] mx-auto pt-3 pb-1 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-2">
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const active = isRouteActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-all whitespace-nowrap border",
                    active
                      ? "bg-[#1A1E1C] text-white border-[#1A1E1C]"
                      : "bg-white/80 hover:bg-white text-[#4A5752] hover:text-[#1A1E1C] border-white"
                  )}
                >
                  <span className={cn("w-2 h-2 rounded-full", item.badgeBg)} />
                  <Icon className="w-3.5 h-3.5 opacity-75" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center space-x-3 text-[12px] text-[#687670] shrink-0">
            <Link href="/" className="hover:text-[#1A1E1C] font-medium underline underline-offset-4">
              Public Website &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <div className="flex-1 w-full max-w-[1380px] mx-auto px-4 sm:px-8 py-5 pb-28 md:pb-12">
        <main id="main-content" className="w-full min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#DCE3DF] px-2 py-1.5 shadow-elevated"
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
                    ? "text-white bg-[#1A1E1C] font-semibold"
                    : "text-[#4A5752] hover:text-[#1A1E1C]"
                )}
              >
                <Icon
                  className={cn("w-5 h-5 mb-1", active ? "text-[#D9F296]" : "text-[#4A5752]")}
                />
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
                ? "text-white bg-[#1A1E1C] font-semibold"
                : "text-[#4A5752] hover:text-[#1A1E1C]"
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
        <div className="md:hidden fixed inset-0 z-50 bg-[#1A1E1C]/45 backdrop-blur-xs flex items-end">
          <div className="w-full bg-[#EDF1EF] rounded-t-3xl border-t border-white p-6 space-y-6 max-h-[85vh] overflow-y-auto shadow-elevated">
            <div className="flex items-center justify-between border-b border-[#DCE3DF] pb-4">
              <div>
                <h2 className="text-lg font-semibold text-[#1A1E1C]">
                  All Sanctuary Spaces
                </h2>
                <p className="text-sm text-[#4A5752]">
                  Explore tools, privacy controls, and 24/7 support
                </p>
              </div>
              <button
                onClick={() => setIsMobileMoreOpen(false)}
                className="p-2.5 rounded-full bg-white text-[#1A1E1C]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[...topPillNav, ...secondaryNav].map((item) => {
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
                        ? "bg-[#1A1E1C] text-white border-[#1A1E1C]"
                        : "bg-white text-[#1A1E1C] border-white hover:bg-[#D9F296]/30"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 shrink-0",
                        active ? "text-[#D9F296]" : "text-[#285B55]"
                      )}
                    />
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
