"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  LifeBuoy,
  Phone,
  HeartHandshake,
  Check,
} from "lucide-react";
import {
  MARKETING_LOCALES,
  SupportedMarketingLocale,
  LocaleConfig,
} from "@/lib/marketing-i18n";
import {
  trackMarketingEvent,
  isTelemetryAllowed,
  setTelemetryPreference,
} from "@/lib/marketing-analytics";
import { EmergencyModal } from "@/components/safety/EmergencyModal";

interface MarketingLocaleContextValue {
  locale: SupportedMarketingLocale;
  localeConfig: LocaleConfig;
  setLocale: (loc: SupportedMarketingLocale) => void;
  openCrisisModal: () => void;
}

const MarketingLocaleContext = createContext<MarketingLocaleContextValue>({
  locale: "en",
  localeConfig: MARKETING_LOCALES.en,
  setLocale: () => {},
  openCrisisModal: () => {},
});

export const useMarketingLocale = () => useContext(MarketingLocaleContext);

const MARKETING_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/privacy-trust", label: "Privacy & Trust" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export const MarketingShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<SupportedMarketingLocale>("en");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [crisisModalOpen, setCrisisModalOpen] = useState(false);
  const [telemetryEnabled, setTelemetryEnabled] = useState(true);

  const localeConfig = MARKETING_LOCALES[locale] || MARKETING_LOCALES.en;

  useEffect(() => {
    setTelemetryEnabled(isTelemetryAllowed());
    trackMarketingEvent("marketing_page_view", { path: pathname || "/" });
  }, [pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSetLocale = (nextLocale: SupportedMarketingLocale) => {
    setLocaleState(nextLocale);
    const cfg = MARKETING_LOCALES[nextLocale];
    if (typeof document !== "undefined" && cfg) {
      document.documentElement.lang = nextLocale;
      document.documentElement.dir = cfg.dir;
    }
    trackMarketingEvent("language_switched", { locale: nextLocale });
  };

  const handleToggleTelemetry = () => {
    const next = !telemetryEnabled;
    setTelemetryEnabled(next);
    setTelemetryPreference(next);
  };

  const isNavActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <MarketingLocaleContext.Provider
      value={{
        locale,
        localeConfig,
        setLocale: handleSetLocale,
        openCrisisModal: () => setCrisisModalOpen(true),
      }}
    >
      <div
        className="min-h-screen w-full overflow-x-hidden flex flex-col bg-[#FAF8F4] text-[#263330] selection:bg-[#E8F1EB] selection:text-[#285B55]"
        dir={localeConfig.dir}
      >
        {/* Skip to main content for keyboard & screen-reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-5 py-3 bg-[#285B55] text-white rounded-2xl text-[15px] font-medium shadow-md"
        >
          Skip to main content
        </a>

        {/* Top Reassurance Bar */}
        <div className="bg-[#F3EFE8] border-b border-[#E6E0D6] px-4 sm:px-8 py-2 text-[13.5px] text-[#52625E]">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-[#285B55] shrink-0" />
              <span>{localeConfig.nonClinicalNotice}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setCrisisModalOpen(true)}
                className="text-[#9B2C3E] hover:underline font-medium inline-flex items-center space-x-1"
              >
                <LifeBuoy className="w-3.5 h-3.5" />
                <span>24/7 Crisis Helplines</span>
              </button>
              <Link
                href="/dashboard"
                onClick={() => trackMarketingEvent("cta_open_app_click", { location: "topbar" })}
                className="text-[#285B55] font-semibold hover:underline inline-flex items-center space-x-1"
              >
                <span>{localeConfig.ctaOpenApp}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Sticky Primary Navigation Header */}
        <header className="sticky top-0 z-40 w-full bg-[#FAF8F4]/95 backdrop-blur-md border-b border-[#E6E0D6] px-4 sm:px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Brand Identity */}
            <Link
              href="/"
              className="flex items-center space-x-2.5 sm:space-x-3 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#285B55] rounded-2xl"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#E8F1EB] border border-[#CFE2D6] flex items-center justify-center group-hover:bg-[#D5E6DC] transition-colors shrink-0">
                <div className="w-3.5 h-3.5 rounded-full bg-[#285B55] animate-breathe" />
              </div>
              <div>
                <span className="font-serif text-lg sm:text-xl font-semibold text-[#263330] tracking-tight block leading-none whitespace-nowrap">
                  InnerOS
                </span>
                <span className="hidden sm:block text-[12px] text-[#52625E] mt-0.5 whitespace-nowrap">
                  Personal Wellbeing Companion
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav
              aria-label="Primary Marketing Navigation"
              className="hidden xl:flex items-center space-x-0.5 shrink-0"
            >
              {MARKETING_NAV_LINKS.map((link) => {
                const active = isNavActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`px-2.5 py-2 rounded-xl text-[14px] font-medium whitespace-nowrap transition-colors ${
                      active
                        ? "bg-[#E8F1EB] text-[#285B55] font-semibold"
                        : "text-[#52625E] hover:text-[#263330] hover:bg-[#F3EFE8]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions: Language Selector + App & Onboarding CTAs */}
            <div className="flex items-center space-x-2 shrink-0">
              {/* Language Switcher */}
              <div className="relative flex items-center">
                <Globe className="w-3.5 h-3.5 text-[#52625E] absolute left-2.5 pointer-events-none" />
                <select
                  aria-label="Select Language"
                  value={locale}
                  onChange={(e) =>
                    handleSetLocale(e.target.value as SupportedMarketingLocale)
                  }
                  className="pl-7 pr-2.5 py-2 rounded-xl bg-white border border-[#E2DDD2] text-[13px] font-medium text-[#263330] hover:border-[#285B55] focus:outline-none focus:border-[#285B55] transition-colors cursor-pointer max-w-[130px] sm:max-w-none"
                >
                  {Object.values(MARKETING_LOCALES).map((loc) => (
                    <option key={loc.code} value={loc.code}>
                      {loc.nativeName} ({loc.code.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sign In Link */}
              <Link
                href="/login"
                className="hidden lg:inline-flex items-center px-3 py-2 rounded-xl text-[#263330] hover:bg-[#F3EFE8] text-[13.5px] font-medium whitespace-nowrap transition-colors shrink-0"
              >
                Sign In
              </Link>

              {/* Open Companion App Button */}
              <Link
                href="/dashboard"
                onClick={() =>
                  trackMarketingEvent("cta_open_app_click", { location: "header" })
                }
                className="hidden md:inline-flex items-center px-3.5 py-2 rounded-2xl bg-[#E8F1EB] hover:bg-[#D5E6DC] text-[#1F4742] border border-[#CFE2D6] text-[13.5px] font-medium whitespace-nowrap transition-colors shrink-0"
              >
                {localeConfig.ctaOpenApp}
              </Link>

              {/* Start Your Journey Primary CTA */}
              <Link
                href="/signup"
                onClick={() =>
                  trackMarketingEvent("cta_start_journey_click", {
                    location: "header",
                  })
                }
                className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-[#285B55] hover:bg-[#1F4742] text-white text-[13.5px] font-medium shadow-sm whitespace-nowrap transition-all shrink-0"
              >
                <span>{localeConfig.ctaStart}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                className="xl:hidden p-2 rounded-xl bg-white border border-[#E2DDD2] text-[#263330] hover:bg-[#F3EFE8] shrink-0"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="xl:hidden mt-4 pt-4 border-t border-[#E6E0D6] space-y-3 pb-2">
              <nav
                aria-label="Mobile Marketing Navigation"
                className="grid sm:grid-cols-2 gap-1.5"
              >
                {MARKETING_NAV_LINKS.map((link) => {
                  const active = isNavActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-3 rounded-2xl text-[15px] font-medium flex items-center justify-between ${
                        active
                          ? "bg-[#285B55] text-white"
                          : "bg-white border border-[#E6E0D6] text-[#263330] hover:bg-[#F3EFE8]"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-4 h-4 opacity-70" />
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <Link
                  href="/onboarding"
                  className="flex-1 py-3 px-5 rounded-2xl bg-[#285B55] text-white text-center text-[15px] font-medium shadow-sm"
                >
                  {localeConfig.ctaStart}
                </Link>
                <Link
                  href="/dashboard"
                  className="flex-1 py-3 px-5 rounded-2xl bg-[#E8F1EB] text-[#1F4742] border border-[#CFE2D6] text-center text-[15px] font-medium"
                >
                  {localeConfig.ctaOpenApp}
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* Main Page Content */}
        <main id="main-content" className="flex-1">
          {children}
        </main>

        {/* Comprehensive Semantic Footer */}
        <footer className="bg-[#F3EFE8] border-t border-[#E6E0D6] text-[#263330] mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 space-y-12">
            {/* Top Footer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
              {/* Column 1: Brand & Ethical Positioning */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#E8F1EB] border border-[#CFE2D6] flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#285B55]" />
                  </div>
                  <span className="font-serif text-xl font-semibold text-[#263330]">
                    InnerOS
                  </span>
                </div>
                <p className="text-[15px] text-[#52625E] leading-relaxed max-w-md">
                  A calm, multilingual AI companion for everyday reflection, emotional clarity, personal growth, and supportive daily routines.
                </p>
                <div className="p-4 rounded-2xl bg-white border border-[#E6E0D6] space-y-1.5 max-w-md">
                  <div className="flex items-center space-x-2 text-[13.5px] font-semibold text-[#285B55]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Clear Non-Clinical Boundary</span>
                  </div>
                  <p className="text-[13px] text-[#52625E] leading-relaxed">
                    InnerOS is not a medical device, healthcare provider, or substitute for licensed psychotherapy.
                  </p>
                </div>
              </div>

              {/* Column 2: Explore Website */}
              <div className="space-y-3">
                <h3 className="text-[14px] font-semibold uppercase tracking-wider text-[#263330]">
                  Explore InnerOS
                </h3>
                <ul className="space-y-2.5 text-[14.5px] text-[#52625E]">
                  <li>
                    <Link href="/features" className="hover:text-[#285B55] transition-colors">
                      Features Overview
                    </Link>
                  </li>
                  <li>
                    <Link href="/how-it-works" className="hover:text-[#285B55] transition-colors">
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-[#285B55] transition-colors">
                      About &amp; Mission
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="hover:text-[#285B55] transition-colors">
                      Pricing (Draft Preview)
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="hover:text-[#285B55] transition-colors">
                      Frequently Asked Questions
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-[#285B55] transition-colors">
                      Contact &amp; Support
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Direct App Experiences */}
              <div className="space-y-3">
                <h3 className="text-[14px] font-semibold uppercase tracking-wider text-[#263330]">
                  Companion App
                </h3>
                <ul className="space-y-2.5 text-[14.5px] text-[#52625E]">
                  <li>
                    <Link href="/dashboard" className="hover:text-[#285B55] transition-colors">
                      App Home Space
                    </Link>
                  </li>
                  <li>
                    <Link href="/companion/voice" className="hover:text-[#285B55] transition-colors">
                      Voice Companion
                    </Link>
                  </li>
                  <li>
                    <Link href="/companion/chat" className="hover:text-[#285B55] transition-colors">
                      Text Conversation
                    </Link>
                  </li>
                  <li>
                    <Link href="/memory" className="hover:text-[#285B55] transition-colors">
                      Things I Remember
                    </Link>
                  </li>
                  <li>
                    <Link href="/journal" className="hover:text-[#285B55] transition-colors">
                      Personal Journal
                    </Link>
                  </li>
                  <li>
                    <Link href="/reminders" className="hover:text-[#285B55] transition-colors">
                      Gentle Reminders
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 4: Privacy, Trust & Safety */}
              <div className="space-y-3">
                <h3 className="text-[14px] font-semibold uppercase tracking-wider text-[#263330]">
                  Privacy &amp; Care
                </h3>
                <ul className="space-y-2.5 text-[14.5px] text-[#52625E]">
                  <li>
                    <Link href="/privacy-trust" className="hover:text-[#285B55] transition-colors">
                      Privacy &amp; Trust Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/settings/privacy" className="hover:text-[#285B55] transition-colors">
                      Data &amp; Memory Controls
                    </Link>
                  </li>
                  <li>
                    <Link href="/safety" className="hover:text-[#285B55] transition-colors">
                      24/7 Crisis Support Directory
                    </Link>
                  </li>
                  <li>
                    <Link href="/design-system" className="hover:text-[#285B55] transition-colors">
                      Design System &amp; Accessibility
                    </Link>
                  </li>
                </ul>

                {/* Privacy-Respecting Analytics Control */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleToggleTelemetry}
                    className="w-full p-3 rounded-xl bg-white border border-[#E2DDD2] text-left text-[12.5px] text-[#52625E] hover:border-[#285B55] transition-colors flex items-center justify-between"
                  >
                    <span>
                      Anonymous page telemetry:{" "}
                      <strong className="text-[#263330]">
                        {telemetryEnabled ? "On (Local)" : "Off"}
                      </strong>
                    </span>
                    {telemetryEnabled && (
                      <Check className="w-3.5 h-3.5 text-[#285B55] shrink-0" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 24/7 Human Crisis Support Reassurance Strip */}
            <div className="p-5 rounded-3xl bg-[#F7E7E2] border border-[#EED2C9] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center space-x-3">
                <HeartHandshake className="w-5 h-5 text-[#A4384B] shrink-0 mt-0.5 sm:mt-0" />
                <p className="text-[14px] text-[#263330] leading-relaxed">
                  <strong>Need immediate human support?</strong> Free, confidential 24/7 crisis lines: Call or text{" "}
                  <strong>988</strong> (US/Canada), call <strong>116 123</strong> or <strong>111</strong> (UK), or call{" "}
                  <strong>112</strong> / <strong>0800 88 001</strong> (EU/Bulgaria).
                </p>
              </div>
              <Link
                href="/safety"
                className="px-4 py-2 rounded-xl bg-white border border-[#E6E0D6] text-[#263330] hover:bg-[#FAF8F4] text-[13.5px] font-medium shrink-0 self-start md:self-auto"
              >
                View All Helplines
              </Link>
            </div>

            {/* Bottom Copyright & Multilingual Notice */}
            <div className="pt-4 border-t border-[#E6E0D6] flex flex-col sm:flex-row items-center justify-between gap-4 text-[13.5px] text-[#52625E]">
              <p>&copy; {new Date().getFullYear()} InnerOS. Designed with Warm Human Minimalism.</p>
              <p>
                Multilingual architecture supporting English, Español, Français, Deutsch, Български, العربية, اردو &amp; हिन्दी.
              </p>
            </div>
          </div>
        </footer>

        <EmergencyModal
          isOpen={crisisModalOpen}
          onClose={() => setCrisisModalOpen(false)}
        />
      </div>
    </MarketingLocaleContext.Provider>
  );
};
