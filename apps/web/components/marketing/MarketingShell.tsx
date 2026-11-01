"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  LifeBuoy,
  HeartHandshake,
  Check,
  Flower2,
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
  { href: "/", label: "Home Page" },
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/privacy-trust", label: "Privacy" },
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
  const [footerEmail, setFooterEmail] = useState("");
  const [footerSubscribed, setFooterSubscribed] = useState(false);

  const localeConfig = MARKETING_LOCALES[locale] || MARKETING_LOCALES.en;
  const isHomePage = pathname === "/";

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
        className={`min-h-screen w-full overflow-x-hidden flex flex-col ${
          isHomePage
            ? "bg-[#0D1510] text-[#F2F6F3]"
            : "bg-[#EDF1EF] text-[#1A1E1C]"
        } selection:bg-[#D9F296] selection:text-[#1A1E1C]`}
        dir={localeConfig.dir}
      >
        {/* Skip to main content for keyboard & screen-reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-5 py-3 bg-[#D9F296] text-[#1A1E1C] rounded-full text-[14px] font-semibold shadow-lg"
        >
          Skip to main content
        </a>

        {/* Subtle Non-Clinical & 24/7 Support Strip */}
        <div
          className={`px-4 sm:px-8 py-2 text-[12.5px] border-b transition-colors ${
            isHomePage
              ? "bg-[#090F0B] border-white/10 text-white/75"
              : "bg-[#E2E8E5] border-[#D3DCD7] text-[#4A5752]"
          }`}
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-[#9EE838] shrink-0" />
              <span>{localeConfig.nonClinicalNotice}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setCrisisModalOpen(true)}
                className={`hover:underline font-medium inline-flex items-center space-x-1 ${
                  isHomePage ? "text-[#F6D4DC]" : "text-[#9B2C3E]"
                }`}
              >
                <LifeBuoy className="w-3.5 h-3.5" />
                <span>24/7 Crisis Helplines</span>
              </button>
              <Link
                href="/dashboard"
                onClick={() =>
                  trackMarketingEvent("cta_open_app_click", { location: "topbar" })
                }
                className={`font-semibold hover:underline inline-flex items-center space-x-1 ${
                  isHomePage ? "text-[#D9F296]" : "text-[#1A1E1C]"
                }`}
              >
                <span>{localeConfig.ctaOpenApp}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Pill Header (Pinterest Pyko + PeopleFlow Aesthetic) */}
        <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Brand Identity (Top Left) */}
            <Link
              href="/"
              className="flex items-center space-x-2.5 shrink-0 group focus-visible:outline-none rounded-full"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isHomePage
                    ? "bg-white/12 border border-white/20 text-white group-hover:bg-[#D9F296] group-hover:text-[#1A1E1C]"
                    : "bg-[#1A1E1C] text-[#D9F296] shadow-sm"
                }`}
              >
                <Flower2 className="w-5 h-5" />
              </div>
              <span
                className={`text-xl font-semibold tracking-tight whitespace-nowrap ${
                  isHomePage ? "text-white" : "text-[#1A1E1C]"
                }`}
              >
                InnerOS
              </span>
            </Link>

            {/* Center Floating Glass Pill Navigation (Exact Pinterest Pyko / PeopleFlow Bar) */}
            <nav
              aria-label="Primary Marketing Navigation"
              className={`hidden xl:flex items-center space-x-1 px-2.5 py-1.5 rounded-full backdrop-blur-xl border transition-all ${
                isHomePage
                  ? "bg-[#1C241E]/80 border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.4)]"
                  : "bg-white/90 border-white shadow-[0_8px_28px_rgba(26,30,28,0.06)]"
              }`}
            >
              {MARKETING_NAV_LINKS.map((link) => {
                const active = isNavActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`px-3.5 py-1.5 rounded-full text-[13.5px] font-medium whitespace-nowrap transition-all ${
                      active
                        ? isHomePage
                          ? "bg-white text-[#1A1E1C] font-semibold shadow-xs"
                          : "bg-[#1A1E1C] text-white font-semibold shadow-xs"
                        : isHomePage
                          ? "text-white/80 hover:text-white hover:bg-white/10"
                          : "text-[#4A5752] hover:text-[#1A1E1C] hover:bg-[#EDF1EF]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions: Language Selector + Login + White Pill Get Started */}
            <div className="flex items-center space-x-2.5 shrink-0">
              {/* Language Switcher */}
              <div className="relative flex items-center">
                <Globe
                  className={`w-3.5 h-3.5 absolute left-3 pointer-events-none ${
                    isHomePage ? "text-white/70" : "text-[#4A5752]"
                  }`}
                />
                <select
                  aria-label="Select Language"
                  value={locale}
                  onChange={(e) =>
                    handleSetLocale(e.target.value as SupportedMarketingLocale)
                  }
                  className={`pl-8 pr-3 py-2 rounded-full text-[12.5px] font-medium focus:outline-none transition-colors cursor-pointer max-w-[115px] sm:max-w-none backdrop-blur-md ${
                    isHomePage
                      ? "bg-white/10 border border-white/20 text-white hover:bg-white/15"
                      : "bg-white border border-[#DCE3DF] text-[#1A1E1C] hover:border-[#1A1E1C]"
                  }`}
                >
                  {Object.values(MARKETING_LOCALES).map((loc) => (
                    <option
                      key={loc.code}
                      value={loc.code}
                      className="text-[#1A1E1C] bg-white"
                    >
                      {loc.nativeName} ({loc.code.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Login Link */}
              <Link
                href="/login"
                className={`hidden sm:inline-flex items-center px-3.5 py-2 rounded-full text-[13.5px] font-medium whitespace-nowrap transition-colors ${
                  isHomePage
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : "text-[#1A1E1C] hover:bg-white/80"
                }`}
              >
                Login
              </Link>

              {/* Get Started Pill CTA (Matches Pyko top-right white pill) */}
              <Link
                href="/signup"
                onClick={() =>
                  trackMarketingEvent("cta_start_journey_click", {
                    location: "header",
                  })
                }
                className={`inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full text-[13.5px] font-semibold whitespace-nowrap transition-all shadow-sm ${
                  isHomePage
                    ? "bg-white text-[#1A1E1C] hover:bg-[#D9F296]"
                    : "bg-[#1A1E1C] text-white hover:bg-[#285B55]"
                }`}
              >
                <span>Get started</span>
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label={
                  mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
                }
                className={`xl:hidden p-2.5 rounded-full border shrink-0 ${
                  isHomePage
                    ? "bg-white/10 border-white/20 text-white"
                    : "bg-white border-[#DCE3DF] text-[#1A1E1C]"
                }`}
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
            <div className="xl:hidden mt-3 p-5 rounded-3xl bg-[#162019]/95 backdrop-blur-2xl border border-white/15 text-white space-y-3 shadow-2xl">
              <nav
                aria-label="Mobile Marketing Navigation"
                className="grid sm:grid-cols-2 gap-2"
              >
                {MARKETING_NAV_LINKS.map((link) => {
                  const active = isNavActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-3 rounded-2xl text-[14.5px] font-medium flex items-center justify-between ${
                        active
                          ? "bg-[#D9F296] text-[#1A1E1C] font-semibold"
                          : "bg-white/5 border border-white/10 text-white/90 hover:bg-white/10"
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
                  href="/signup"
                  className="flex-1 py-3 px-5 rounded-full bg-white text-[#1A1E1C] text-center text-[14.5px] font-semibold"
                >
                  Get started
                </Link>
                <Link
                  href="/dashboard"
                  className="flex-1 py-3 px-5 rounded-full bg-[#D9F296] text-[#1A1E1C] text-center text-[14.5px] font-semibold"
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

        {/* Botanical Monolith Glassmorphic Footer (Inspired by Pinterest Pyko 00:53-00:57) */}
        <footer className="relative bg-[#0B120D] text-white pt-20 pb-12 overflow-hidden border-t border-white/10">
          {/* Atmospheric Moss Backdrop Glow */}
          <div
            className="absolute inset-0 opacity-35 bg-cover bg-bottom pointer-events-none"
            style={{ backgroundImage: "url('/images/hero-moss-arch.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090F0B] via-[#0B120D]/85 to-[#0B120D]" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
            {/* Large Frosted Glass Footer Container */}
            <div className="rounded-[36px] pyko-glass p-8 sm:p-12 lg:p-14 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
                {/* Column 1: Brand & Editorial Headline */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#D9F296] text-[#1A1E1C] flex items-center justify-center font-bold">
                      <Flower2 className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-semibold tracking-tight text-white">
                      InnerOS
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-white leading-[1.12]">
                    The future of <br />
                    <span className="font-serif italic font-normal text-[#D9F296]">
                      emotional clarity.
                    </span>
                  </h2>

                  <p className="text-[14.5px] text-white/75 leading-relaxed max-w-md">
                    Real-time self-awareness, adaptive voice and text reflection, personal Life Graph memory, and evidence-backed psychology in one calm sanctuary.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Link
                      href="/contact"
                      className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white text-[#1A1E1C] hover:bg-[#D9F296] text-[13.5px] font-semibold transition-all"
                    >
                      <span>Contact Us</span>
                      <span className="w-5 h-5 rounded-full bg-[#1A1E1C] text-white flex items-center justify-center">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[13.5px] font-medium transition-all"
                    >
                      <span>Open Sanctuary</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Column 2: Explore */}
                <div className="lg:col-span-2 space-y-3.5">
                  <h3 className="text-[12.5px] font-semibold uppercase tracking-widest text-white/50">
                    Explore
                  </h3>
                  <ul className="space-y-2.5 text-[14px] text-white/85">
                    <li>
                      <Link href="/" className="hover:text-[#D9F296] transition-colors">
                        Home Page
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" className="hover:text-[#D9F296] transition-colors">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/features" className="hover:text-[#D9F296] transition-colors">
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link href="/how-it-works" className="hover:text-[#D9F296] transition-colors">
                        How It Works
                      </Link>
                    </li>
                    <li>
                      <Link href="/pricing" className="hover:text-[#D9F296] transition-colors">
                        Pricing
                      </Link>
                    </li>
                    <li>
                      <Link href="/faq" className="hover:text-[#D9F296] transition-colors">
                        FAQ
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Sanctuary Suite */}
                <div className="lg:col-span-2 space-y-3.5">
                  <h3 className="text-[12.5px] font-semibold uppercase tracking-widest text-white/50">
                    Sanctuary Suite
                  </h3>
                  <ul className="space-y-2.5 text-[14px] text-white/85">
                    <li>
                      <Link href="/dashboard" className="hover:text-[#D9F296] transition-colors">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link href="/companion/voice" className="hover:text-[#D9F296] transition-colors">
                        Voice Companion
                      </Link>
                    </li>
                    <li>
                      <Link href="/companion/chat" className="hover:text-[#D9F296] transition-colors">
                        Text Companion
                      </Link>
                    </li>
                    <li>
                      <Link href="/memory" className="hover:text-[#D9F296] transition-colors">
                        Life Graph &amp; Memory
                      </Link>
                    </li>
                    <li>
                      <Link href="/journal" className="hover:text-[#D9F296] transition-colors">
                        Journal &amp; Growth
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin" className="hover:text-[#D9F296] transition-colors">
                        Admin Console
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 4: Stay in Touch & Privacy Controls */}
                <div className="lg:col-span-3 space-y-4">
                  <h3 className="text-[12.5px] font-semibold uppercase tracking-widest text-white/50">
                    Stay in Touch
                  </h3>
                  <p className="text-[13.5px] text-white/75">
                    Receive calm product dispatches and psychoeducation research updates.
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (footerEmail.trim()) {
                        setFooterSubscribed(true);
                        setFooterEmail("");
                      }
                    }}
                    className="relative flex items-center"
                  >
                    <input
                      type="email"
                      value={footerEmail}
                      onChange={(e) => setFooterEmail(e.target.value)}
                      placeholder={
                        footerSubscribed ? "Thank you for subscribing" : "Your email"
                      }
                      aria-label="Your email"
                      className="w-full pl-4 pr-12 py-3 rounded-full bg-white text-[#1A1E1C] placeholder:text-[#687670] text-[13.5px] font-medium focus:outline-none"
                    />
                    <button
                      type="submit"
                      aria-label="Subscribe"
                      className="absolute right-1.5 w-9 h-9 rounded-full bg-[#1A1E1C] text-white hover:bg-[#285B55] flex items-center justify-center transition-colors"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </form>

                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      onClick={handleToggleTelemetry}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-left text-[12px] text-white/80 hover:border-[#D9F296] transition-colors flex items-center justify-between"
                    >
                      <span>
                        Anonymous local telemetry:{" "}
                        <strong className="text-white">
                          {telemetryEnabled ? "On" : "Off"}
                        </strong>
                      </span>
                      {telemetryEnabled && (
                        <Check className="w-3.5 h-3.5 text-[#D9F296] shrink-0" />
                      )}
                    </button>
                    <div className="flex items-center gap-3 text-[12px] text-white/65 pt-1">
                      <Link href="/privacy-trust" className="hover:text-white underline">
                        Privacy Center
                      </Link>
                      <span>&bull;</span>
                      <Link href="/settings/privacy" className="hover:text-white underline">
                        Data Controls
                      </Link>
                      <span>&bull;</span>
                      <Link href="/safety" className="hover:text-white underline">
                        Safety
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Non-Clinical & 24/7 Crisis Reassurance Bar */}
              <div className="pt-6 border-t border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center space-x-3">
                  <HeartHandshake className="w-5 h-5 text-[#D9F296] shrink-0 mt-0.5 sm:mt-0" />
                  <p className="text-[13px] text-white/80 leading-relaxed">
                    <strong>Non-Clinical Companion &amp; 24/7 Crisis Support:</strong> InnerOS is not a medical device or substitute for licensed psychotherapy. Free 24/7 crisis lines: <strong>988</strong> (US/Canada), <strong>116 123</strong> (UK), <strong>112</strong> / <strong>0800 88 001</strong> (EU/Bulgaria).
                  </p>
                </div>
                <Link
                  href="/safety"
                  className="px-4 py-2 rounded-full bg-white/12 hover:bg-white/20 border border-white/20 text-white text-[12.5px] font-medium shrink-0 self-start md:self-auto"
                >
                  View All Helplines
                </Link>
              </div>
            </div>

            {/* Bottom Copyright */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px] text-white/55 px-2">
              <p>&copy; {new Date().getFullYear()} InnerOS. Botanical Glassmorphism &amp; Human-Centered Wellbeing Architecture.</p>
              <p>
                Supporting English, Español, Français, Deutsch, Български, العربية, اردو &amp; हिन्दी.
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
