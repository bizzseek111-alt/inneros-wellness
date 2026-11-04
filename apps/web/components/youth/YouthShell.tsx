"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  Mic,
  MessageSquare,
  Smile,
  BookOpen,
  Calendar,
  Compass,
  CheckCircle2,
  PenTool,
  Trophy,
  Users,
  GraduationCap,
  ShieldAlert,
  Settings2,
  Globe,
  LogOut,
  Eye,
  Volume2,
  VolumeX,
  Type,
  Sun,
  Layers,
  ChevronDown,
  X,
  Menu,
} from "lucide-react";
import { useYouth } from "./YouthContext";
import { LumiMascot } from "./LumiMascot";
import { YouthAgeTier } from "@/design-system/tokens";
import { YouthLocale, YOUTH_LOCALES } from "@/lib/youth-i18n";

export interface YouthShellProps {
  children: React.ReactNode;
  activeScreen?: string;
  title?: string;
  subtitle?: string;
}

export const YouthShell: React.FC<YouthShellProps> = ({
  children,
  activeScreen,
  title,
  subtitle,
}) => {
  const {
    ageTier,
    setAgeTier,
    locale,
    setLocale,
    localeMeta,
    t,
    isLowStimulation,
    toggleLowStimulation,
    isHighContrast,
    toggleHighContrast,
    isReducedMotion,
    toggleReducedMotion,
    fontSize,
    setFontSize,
    isDyslexicFont,
    toggleDyslexicFont,
    isAudioMuted,
    toggleAudioMute,
  } = useYouth();

  const pathname = usePathname();
  const router = useRouter();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isAccDrawerOpen, setIsAccDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isRTL = localeMeta.dir === "rtl";

  // Navigation Items with role/age filtering
  const navItems = [
    { href: "/youth/dashboard", label: t("nav_home"), icon: Sparkles, id: "dashboard" },
    {
      href: "/youth/voice",
      label: t("nav_talk"),
      icon: Mic,
      id: "voice",
      badge: ageTier === "little" ? "Voice Play" : undefined,
    },
    {
      href: "/youth/chat",
      label: t("nav_chat"),
      icon: MessageSquare,
      id: "chat",
      hideForLittle: true,
    },
    { href: "/youth/emotions", label: t("nav_emotions"), icon: Smile, id: "emotions" },
    { href: "/youth/stories", label: t("nav_stories"), icon: BookOpen, id: "stories" },
    { href: "/youth/activities", label: t("nav_activities"), icon: Compass, id: "activities" },
    { href: "/youth/routines", label: t("nav_routines"), icon: Calendar, id: "routines" },
    { href: "/youth/visual-supports", label: t("nav_visual_tools"), icon: Layers, id: "visual_tools" },
    { href: "/youth/support-center", label: "Support Center", icon: Sparkles, id: "support_center" },
    { href: "/youth/habits", label: t("nav_habits"), icon: CheckCircle2, id: "habits" },
    { href: "/youth/journal", label: t("nav_journal"), icon: PenTool, id: "journal" },
    { href: "/youth/achievements", label: t("nav_achievements"), icon: Trophy, id: "achievements" },
    { href: "/caregiver/dashboard", label: t("nav_parent"), icon: Users, id: "parent" },
    { href: "/teacher/dashboard", label: t("nav_teacher"), icon: GraduationCap, id: "teacher" },
    { href: "/youth/safety", label: t("nav_safety"), icon: ShieldAlert, id: "safety", alert: true },
  ];

  const visibleNav = navItems.filter((item) => {
    if (ageTier === "little" && item.hideForLittle) return false;
    return true;
  });

  return (
    <div
      dir={localeMeta.dir}
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isLowStimulation
          ? "bg-[#F7F6F2] text-[#2D3748]"
          : "bg-[#FFFDF9] text-[#1A202C]"
      }`}
    >
      {/* 1. Top Accessibility & Safety Quick Banner */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 py-2.5 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Brand & Age Switcher */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#4A5568] hover:bg-[#F2EBD7] transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link
              href="/youth/dashboard"
              className="flex items-center space-x-2.5 rtl:space-x-reverse group"
            >
              <LumiMascot size="sm" state="idle" />
              <div>
                <span className="text-lg font-extrabold tracking-tight text-[#0F172A] group-hover:text-[#0E87E3] transition-colors block leading-tight">
                  {t("brand_name")}
                </span>
                <span className="text-[10px] font-bold text-[#36A871] uppercase tracking-wider block">
                  {t(`age_tier_${ageTier}`)}
                </span>
              </div>
            </Link>

            {/* Age Segment Control (Quick Toggle) */}
            <div className="hidden md:flex items-center p-1 rounded-2xl bg-[#F9F5EA] border border-[#E2E8F0] text-xs font-semibold">
              <button
                onClick={() => setAgeTier("little")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  ageTier === "little"
                    ? "bg-white text-[#F36437] shadow-xs font-bold"
                    : "text-[#718096] hover:text-[#1A202C]"
                }`}
              >
                Ages 2–5
              </button>
              <button
                onClick={() => setAgeTier("junior")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  ageTier === "junior"
                    ? "bg-white text-[#0E87E3] shadow-xs font-bold"
                    : "text-[#718096] hover:text-[#1A202C]"
                }`}
              >
                Ages 6–12
              </button>
              <button
                onClick={() => setAgeTier("teen")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  ageTier === "teen"
                    ? "bg-white text-[#9868CE] shadow-xs font-bold"
                    : "text-[#718096] hover:text-[#1A202C]"
                }`}
              >
                Ages 13–18
              </button>
            </div>
          </div>

          {/* Right: Language, Accessibility, Sound & Safety Exit */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="px-2.5 py-1.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#FDFBF4] text-xs font-bold text-[#1A202C] flex items-center space-x-1.5 rtl:space-x-reverse transition-all shadow-xs"
                aria-expanded={isLangMenuOpen}
              >
                <Globe className="w-3.5 h-3.5 text-[#0E87E3]" />
                <span>{localeMeta.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-[#718096]" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute top-full mt-1.5 right-0 rtl:right-auto rtl:left-0 w-44 rounded-2xl bg-white border border-[#E2E8F0] shadow-lg py-1.5 z-50 animate-fade-in">
                  {(Object.keys(YOUTH_LOCALES) as YouthLocale[]).map((loc) => {
                    const meta = YOUTH_LOCALES[loc];
                    return (
                      <button
                        key={loc}
                        onClick={() => {
                          setLocale(loc);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full px-3.5 py-2 text-start text-xs font-semibold flex items-center justify-between hover:bg-[#F3EDFA] transition-colors ${
                          locale === loc ? "text-[#0E87E3] bg-[#F0F8FF]" : "text-[#2D3748]"
                        }`}
                      >
                        <span>{meta.nativeName}</span>
                        <span className="text-[10px] text-[#A0AEC0]">{meta.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Accessibility Drawer Toggle */}
            <button
              onClick={() => setIsAccDrawerOpen(true)}
              className="p-2 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#FDFBF4] text-[#4A5568] transition-colors shadow-xs"
              title="Accessibility & Sensory Settings"
              aria-label="Open accessibility options"
            >
              <Eye className="w-4 h-4 text-[#9868CE]" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleAudioMute}
              className={`p-2 rounded-xl border border-[#E2E8F0] transition-colors shadow-xs ${
                isAudioMuted ? "bg-rose-50 text-rose-600" : "bg-white text-[#36A871]"
              }`}
              title={isAudioMuted ? "Unmute audio prompts" : "Mute audio prompts"}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Prominent Quick-Help Button */}
            <Link
              href="/youth/safety"
              className="px-3 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center space-x-1 rtl:space-x-reverse transition-all shadow-sm"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("safety_emergency")}</span>
              <span className="sm:hidden">Help</span>
            </Link>

            {/* Safe Quick Exit to Adult Home */}
            <Link
              href="/"
              className="p-2 rounded-xl text-[#718096] hover:text-[#1A202C] hover:bg-[#F2EBD7] transition-colors"
              title="Exit to InnerOS Main Sanctuary"
              aria-label="Exit youth sanctuary"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full flex">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col w-64 border-e border-[#E2E8F0] bg-white/70 p-4 space-y-1.5 shrink-0">
          <div className="pb-3 px-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#718096]">
              {ageTier === "little"
                ? "Play & Stories"
                : ageTier === "junior"
                ? "Adventurer Tools"
                : "Youth Sanctuary"}
            </span>
          </div>

          <nav className="space-y-1">
            {visibleNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || activeScreen === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[#E0F1FE] text-[#0C436F] font-bold shadow-xs"
                      : "text-[#4A5568] hover:bg-[#FDFBF4] hover:text-[#1A202C]"
                  } ${item.alert ? "text-rose-700 bg-rose-50/60 hover:bg-rose-100/60" : ""}`}
                >
                  <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#0E87E3]" : "text-[#718096]"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFEEE5] text-[#F36437]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Mascot Breathing Anchor */}
          <div className="mt-auto p-4 rounded-3xl bg-gradient-to-tr from-[#FAF7FD] to-[#E0F1FE] border border-[#E2E8F0] text-center space-y-2">
            <LumiMascot size="sm" state="idle" className="mx-auto" />
            <p className="text-xs font-semibold text-[#4A5568] leading-relaxed">
              Take a slow breath with Lumi when you need a pause.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12 min-w-0">
          {(title || subtitle) && (
            <div className="mb-6 space-y-1">
              {title && (
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  {title}
                </h1>
              )}
              {subtitle && <p className="text-sm sm:text-base text-[#4A5568]">{subtitle}</p>}
            </div>
          )}
          {children}
        </main>
      </div>

      {/* Mobile Drawer Menu (When open) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full p-5 flex flex-col space-y-4 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center space-x-2">
                <LumiMascot size="sm" />
                <span className="font-extrabold text-[#0F172A]">{t("brand_name")}</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-[#718096] hover:bg-[#F2EBD7]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Age Picker */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#F9F5EA] rounded-xl text-xs font-bold text-center">
              <button
                onClick={() => setAgeTier("little")}
                className={`py-1.5 rounded-lg ${
                  ageTier === "little" ? "bg-white text-[#F36437] shadow-xs" : "text-[#718096]"
                }`}
              >
                2–5
              </button>
              <button
                onClick={() => setAgeTier("junior")}
                className={`py-1.5 rounded-lg ${
                  ageTier === "junior" ? "bg-white text-[#0E87E3] shadow-xs" : "text-[#718096]"
                }`}
              >
                6–12
              </button>
              <button
                onClick={() => setAgeTier("teen")}
                className={`py-1.5 rounded-lg ${
                  ageTier === "teen" ? "bg-white text-[#9868CE] shadow-xs" : "text-[#718096]"
                }`}
              >
                13–18
              </button>
            </div>

            <nav className="space-y-1">
              {visibleNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2.5 rtl:space-x-reverse px-3 py-2 rounded-xl text-sm font-semibold text-[#2D3748] hover:bg-[#F3EDFA]"
                  >
                    <Icon className="w-4 h-4 text-[#0E87E3]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Age-Appropriate Tactile Touch Targets & Safe-Area Insets) */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] z-30 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-lg flex items-center justify-around"
      >
        {ageTier === "little" ? (
          <>
            {/* AGES 2–5: Caregiver-mediated, large buttons, routines, stories, voice play, NO text chat */}
            <Link
              href="/youth/routines"
              className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-2 rounded-2xl text-xs font-bold transition-transform active:scale-95 ${
                pathname === "/youth/routines" ? "text-[#F36437] bg-orange-50" : "text-[#718096]"
              }`}
            >
              <Calendar className="w-6 h-6 mb-0.5" />
              <span>Routines</span>
            </Link>
            <Link
              href="/youth/voice"
              className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-2 rounded-2xl text-xs font-bold transition-transform active:scale-95 ${
                pathname === "/youth/voice" ? "text-[#F36437] bg-orange-50" : "text-[#718096]"
              }`}
            >
              <Mic className="w-6 h-6 mb-0.5" />
              <span>Voice Play</span>
            </Link>
            <Link
              href="/youth/stories"
              className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-2 rounded-2xl text-xs font-bold transition-transform active:scale-95 ${
                pathname === "/youth/stories" ? "text-[#F36437] bg-orange-50" : "text-[#718096]"
              }`}
            >
              <BookOpen className="w-6 h-6 mb-0.5" />
              <span>Stories</span>
            </Link>
            <Link
              href="/youth/emotions"
              className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-2 rounded-2xl text-xs font-bold transition-transform active:scale-95 ${
                pathname === "/youth/emotions" ? "text-[#F36437] bg-orange-50" : "text-[#718096]"
              }`}
            >
              <Smile className="w-6 h-6 mb-0.5" />
              <span>Feelings</span>
            </Link>
            <Link
              href="/youth/safety"
              className="flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-2 rounded-2xl text-xs font-bold text-rose-600 transition-transform active:scale-95"
            >
              <ShieldAlert className="w-6 h-6 mb-0.5" />
              <span>Help</span>
            </Link>
          </>
        ) : ageTier === "teen" ? (
          <>
            {/* AGES 13–18: Mature navigation for reflection, chat, academy, feelings, help */}
            <Link
              href="/teens"
              className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-2 rounded-2xl text-xs font-bold transition-transform active:scale-95 ${
                pathname === "/teens" ? "text-[#2B4CDE] bg-blue-50" : "text-[#718096]"
              }`}
            >
              <Sparkles className="w-5 h-5 mb-0.5" />
              <span>Reflect</span>
            </Link>
            <Link
              href="/youth/chat"
              className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-2 rounded-2xl text-xs font-bold transition-transform active:scale-95 ${
                pathname === "/youth/chat" ? "text-[#2B4CDE] bg-blue-50" : "text-[#718096]"
              }`}
            >
              <MessageSquare className="w-5 h-5 mb-0.5" />
              <span>Chat</span>
            </Link>
            <Link
              href="/youth/academy"
              className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-2 rounded-2xl text-xs font-bold transition-transform active:scale-95 ${
                pathname === "/youth/academy" ? "text-[#2B4CDE] bg-blue-50" : "text-[#718096]"
              }`}
            >
              <GraduationCap className="w-5 h-5 mb-0.5" />
              <span>Learn</span>
            </Link>
            <Link
              href="/youth/emotions"
              className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-2 rounded-2xl text-xs font-bold transition-transform active:scale-95 ${
                pathname === "/youth/emotions" ? "text-[#2B4CDE] bg-blue-50" : "text-[#718096]"
              }`}
            >
              <Smile className="w-5 h-5 mb-0.5" />
              <span>Feelings</span>
            </Link>
            <Link
              href="/youth/safety"
              className="flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-2 rounded-2xl text-xs font-bold text-rose-600 transition-transform active:scale-95"
            >
              <ShieldAlert className="w-5 h-5 mb-0.5" />
              <span>Help</span>
            </Link>
          </>
        ) : (
          <>
            {/* AGES 6–12: Home, Talk, Stories, Feelings, Academy, Help */}
            <Link
              href="/youth/dashboard"
              className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-2 rounded-2xl text-xs font-bold transition-transform active:scale-95 ${
                pathname === "/youth/dashboard" ? "text-[#0E87E3] bg-sky-50" : "text-[#718096]"
              }`}
            >
              <Sparkles className="w-5 h-5 mb-0.5" />
              <span>{t("nav_home")}</span>
            </Link>
            <Link
              href="/youth/voice"
              className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-2 rounded-2xl text-xs font-bold transition-transform active:scale-95 ${
                pathname === "/youth/voice" ? "text-[#0E87E3] bg-sky-50" : "text-[#718096]"
              }`}
            >
              <Mic className="w-5 h-5 mb-0.5" />
              <span>{t("nav_talk")}</span>
            </Link>
            <Link
              href="/youth/stories"
              className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-2 rounded-2xl text-xs font-bold transition-transform active:scale-95 ${
                pathname === "/youth/stories" ? "text-[#0E87E3] bg-sky-50" : "text-[#718096]"
              }`}
            >
              <BookOpen className="w-5 h-5 mb-0.5" />
              <span>{t("nav_stories")}</span>
            </Link>
            <Link
              href="/youth/academy"
              className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-2 rounded-2xl text-xs font-bold transition-transform active:scale-95 ${
                pathname === "/youth/academy" ? "text-[#0E87E3] bg-sky-50" : "text-[#718096]"
              }`}
            >
              <GraduationCap className="w-5 h-5 mb-0.5" />
              <span>Learn</span>
            </Link>
            <Link
              href="/youth/safety"
              className="flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-2 rounded-2xl text-xs font-bold text-rose-600 transition-transform active:scale-95"
            >
              <ShieldAlert className="w-5 h-5 mb-0.5" />
              <span>Help</span>
            </Link>
          </>
        )}
      </nav>

      {/* Accessibility Side Drawer (Sensory & Neurodiversity Controls) */}
      {isAccDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs"
            onClick={() => setIsAccDrawerOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] bg-white h-full p-6 shadow-2xl space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-[#9868CE]" />
                <h3 className="font-bold text-[#0F172A]">Accessibility & Sensory</h3>
              </div>
              <button
                onClick={() => setIsAccDrawerOpen(false)}
                className="p-1 rounded-lg text-[#718096] hover:bg-[#F2EBD7]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              {/* Low-Stimulation Mode */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F9F5EA]">
                <div>
                  <span className="font-bold text-[#1A202C] block">Low-Stimulation Mode</span>
                  <span className="text-xs text-[#718096]">Soft warm grays, zero bright flashes</span>
                </div>
                <input
                  type="checkbox"
                  checked={isLowStimulation}
                  onChange={toggleLowStimulation}
                  className="w-5 h-5 accent-[#0E87E3] rounded-md cursor-pointer"
                />
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F9F5EA]">
                <div>
                  <span className="font-bold text-[#1A202C] block">High Contrast Mode</span>
                  <span className="text-xs text-[#718096]">Enhanced borders and text contrast</span>
                </div>
                <input
                  type="checkbox"
                  checked={isHighContrast}
                  onChange={toggleHighContrast}
                  className="w-5 h-5 accent-[#0E87E3] rounded-md cursor-pointer"
                />
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F9F5EA]">
                <div>
                  <span className="font-bold text-[#1A202C] block">Reduced Motion</span>
                  <span className="text-xs text-[#718096]">Stops ambient pulses & rotations</span>
                </div>
                <input
                  type="checkbox"
                  checked={isReducedMotion}
                  onChange={toggleReducedMotion}
                  className="w-5 h-5 accent-[#0E87E3] rounded-md cursor-pointer"
                />
              </div>

              {/* Dyslexia-Friendly Font */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F9F5EA]">
                <div>
                  <span className="font-bold text-[#1A202C] block">Dyslexia-Friendly Font</span>
                  <span className="text-xs text-[#718096]">High-legibility letter spacing</span>
                </div>
                <input
                  type="checkbox"
                  checked={isDyslexicFont}
                  onChange={toggleDyslexicFont}
                  className="w-5 h-5 accent-[#0E87E3] rounded-md cursor-pointer"
                />
              </div>

              {/* Text Size */}
              <div className="p-3 rounded-2xl bg-[#F9F5EA] space-y-2">
                <span className="font-bold text-[#1A202C] block">Text Size</span>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold text-center">
                  <button
                    onClick={() => setFontSize("normal")}
                    className={`py-1.5 rounded-lg border ${
                      fontSize === "normal"
                        ? "bg-white text-[#0E87E3] border-[#0E87E3] shadow-xs"
                        : "bg-[#FDFBF4] text-[#4A5568] border-[#E2E8F0]"
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setFontSize("large")}
                    className={`py-1.5 rounded-lg border ${
                      fontSize === "large"
                        ? "bg-white text-[#0E87E3] border-[#0E87E3] shadow-xs"
                        : "bg-[#FDFBF4] text-[#4A5568] border-[#E2E8F0]"
                    }`}
                  >
                    Large
                  </button>
                  <button
                    onClick={() => setFontSize("extra-large")}
                    className={`py-1.5 rounded-lg border ${
                      fontSize === "extra-large"
                        ? "bg-white text-[#0E87E3] border-[#0E87E3] shadow-xs"
                        : "bg-[#FDFBF4] text-[#4A5568] border-[#E2E8F0]"
                    }`}
                  >
                    Extra Large
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] text-center">
              <button
                onClick={() => setIsAccDrawerOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#0E87E3] text-white font-bold text-sm shadow-sm hover:bg-[#0C436F] transition-colors"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
