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
  { href: "/", label: "Home" },
  { href: "/kids", label: "Kids" },
  { href: "/teens", label: "Teens" },
  { href: "/parents", label: "Parents" },
  { href: "/schools", label: "Schools" },
  { href: "/teacher/dashboard", label: "Teacher Hub" },
  { href: "/youth/dashboard", label: "Student Zone" },
  { href: "/adhd-support", label: "ADHD Support" },
  { href: "/autism-support", label: "Autism Support" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
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
        className="min-h-screen w-full overflow-x-hidden flex flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-[#EEF4FF] selection:text-[#2B4CDE]"
        dir={localeConfig.dir}
      >
        {/* Skip to main content for keyboard & screen-reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-5 py-3 bg-[#2B4CDE] text-white rounded-full text-[14px] font-semibold shadow-lg"
        >
          Skip to main content
        </a>

        {/* Subtle Brand & Multi-Portal Navigation Strip */}
        <div className="px-4 sm:px-8 py-2 text-[12.5px] border-b bg-[#EEF4FF] border-[#DCE7FE] text-[#334155] transition-colors">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-[#2B4CDE] shrink-0" />
              <span>Weebly: Safe, multilingual learning for children &amp; teens.</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/parent"
                className="font-medium hover:text-[#2B4CDE] hover:underline"
              >
                Parent Portal
              </Link>
              <Link
                href="/teacher/dashboard"
                className="font-medium hover:text-[#2B4CDE] hover:underline"
              >
                Teacher Hub
              </Link>
              <Link
                href="/youth/dashboard"
                className="font-medium hover:text-[#2B4CDE] hover:underline"
              >
                Student Zone
              </Link>
              <span className="text-slate-300">|</span>
              <Link
                href="/dashboard"
                title="Existing adult wellbeing sanctuary"
                className="font-medium text-slate-500 hover:text-slate-700 hover:underline"
              >
                Adult Sanctuary (InnerOS)
              </Link>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => setCrisisModalOpen(true)}
                className="hover:underline font-semibold inline-flex items-center space-x-1 text-[#E11D48]"
              >
                <LifeBuoy className="w-3.5 h-3.5" />
                <span>24/7 Crisis</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Pill Header (AI Mental Wellness Dribbble Aesthetic) */}
        <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3.5 bg-[#F8FAFC]/85 backdrop-blur-xl border-b border-[#DCE7FE]/40 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Brand Identity (Top Left) */}
            <Link
              href="/"
              className="flex items-center space-x-2.5 shrink-0 group focus-visible:outline-none rounded-full"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#2B4CDE] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(43,76,222,0.28)] group-hover:scale-105 transition-transform">
                <Flower2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#0F172A]">
                Weebly
              </span>
            </Link>

            {/* Center Floating Glass Pill Navigation */}
            <nav
              aria-label="Primary Marketing Navigation"
              className="hidden xl:flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white/95 border border-[#DCE7FE] shadow-[0_8px_30px_rgba(43,76,222,0.06)] backdrop-blur-xl"
            >
              {MARKETING_NAV_LINKS.map((link) => {
                const active = isNavActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`px-4 py-2 rounded-full text-[13.5px] font-medium whitespace-nowrap transition-all ${
                      active
                        ? "bg-[#2B4CDE] text-white font-semibold shadow-xs"
                        : "text-[#475569] hover:text-[#2B4CDE] hover:bg-[#EEF4FF]"
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
                      className="text-[#0F172A] bg-white"
                    >
                      {loc.nativeName} ({loc.code.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Login Link */}
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-[13.5px] font-semibold whitespace-nowrap text-[#334155] hover:text-[#2B4CDE] hover:bg-[#EEF4FF] transition-colors"
              >
                Login
              </Link>

              {/* Get Started Pill CTA (Royal Blue Pill from Dribbble shot) */}
              <Link
                href="/signup"
                onClick={() =>
                  trackMarketingEvent("cta_start_journey_click", {
                    location: "header",
                  })
                }
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full text-[13.5px] font-semibold whitespace-nowrap bg-[#2B4CDE] text-white hover:bg-[#1E3A8A] transition-all shadow-[0_4px_14px_rgba(43,76,222,0.25)] hover:shadow-[0_6px_20px_rgba(43,76,222,0.35)]"
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
                className="xl:hidden p-2.5 rounded-full border border-[#DCE7FE] bg-white text-[#0F172A] shadow-xs"
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
            <div className="xl:hidden mt-3 p-5 rounded-3xl bg-white/95 backdrop-blur-2xl border border-[#DCE7FE] text-[#0F172A] space-y-3 shadow-2xl">
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
                          ? "bg-[#2B4CDE] text-white font-semibold"
                          : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155] hover:bg-[#EEF4FF] hover:text-[#2B4CDE]"
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
                  className="flex-1 py-3 px-5 rounded-full bg-[#2B4CDE] text-white text-center text-[14.5px] font-semibold hover:bg-[#1E3A8A] transition-all shadow-md"
                >
                  Get started
                </Link>
                <Link
                  href="/dashboard"
                  className="flex-1 py-3 px-5 rounded-full bg-[#EEF4FF] text-[#2B4CDE] border border-[#DCE7FE] text-center text-[14.5px] font-semibold hover:bg-[#DCE7FE] transition-all"
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

        {/* Modern AI Mental Wellness Footer (Dribbble 27821075 Aesthetic) */}
        <footer className="relative bg-[#0F172A] text-white pt-20 pb-12 overflow-hidden border-t border-[#1E293B]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(43,76,222,0.18),rgba(15,23,42,0))]" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
            {/* Large Frosted Glass Footer Container */}
            <div className="rounded-[36px] bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl p-8 sm:p-12 lg:p-14 space-y-12 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
                {/* Column 1: Brand & Editorial Headline */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#2B4CDE] text-white flex items-center justify-center font-bold shadow-[0_4px_16px_rgba(43,76,222,0.35)]">
                      <Flower2 className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                      Weebly
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-[1.14]">
                    Empowering minds through <br />
                    <span className="text-[#38BDF8]">
                      AI-driven mental wellness.
                    </span>
                  </h2>

                  <p className="text-[14.5px] text-slate-300 leading-relaxed max-w-md">
                    Real-time self-awareness, adaptive voice and text reflection, personalized Life Graph insights, and evidence-backed psychology in one calming sanctuary.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Link
                      href="/contact"
                      className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#2B4CDE] text-white hover:bg-[#1E3A8A] text-[13.5px] font-semibold transition-all shadow-[0_4px_14px_rgba(43,76,222,0.25)]"
                    >
                      <span>Contact Us</span>
                      <span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white text-[13.5px] font-medium transition-all"
                    >
                      <span>Open Sanctuary</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Column 2: Kids, Teens & Ecosystem */}
                <div className="lg:col-span-2 space-y-3.5">
                  <h3 className="text-[12.5px] font-semibold uppercase tracking-widest text-slate-400">
                    Kids &amp; Teens
                  </h3>
                  <ul className="space-y-2.5 text-[14px] text-slate-300">
                    <li>
                      <Link href="/kids" className="hover:text-[#38BDF8] transition-colors">
                        Weebly Kids (2–12)
                      </Link>
                    </li>
                    <li>
                      <Link href="/teens" className="hover:text-[#38BDF8] transition-colors">
                        Weebly Teens (13–18)
                      </Link>
                    </li>
                    <li>
                      <Link href="/parents" className="hover:text-[#38BDF8] transition-colors">
                        Caregiver Guidance
                      </Link>
                    </li>
                    <li>
                      <Link href="/schools" className="hover:text-[#38BDF8] transition-colors">
                        Schools &amp; Teachers
                      </Link>
                    </li>
                    <li>
                      <Link href="/caregiver/dashboard" className="hover:text-[#38BDF8] transition-colors">
                        Parent Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link href="/child-safety" className="hover:text-[#38BDF8] transition-colors">
                        Child Safeguarding
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Developmental Learning */}
                <div className="lg:col-span-2 space-y-3.5">
                  <h3 className="text-[12.5px] font-semibold uppercase tracking-widest text-slate-400">
                    Development
                  </h3>
                  <ul className="space-y-2.5 text-[14px] text-slate-300">
                    <li>
                      <Link href="/emotional-intelligence" className="hover:text-[#38BDF8] transition-colors">
                        Emotional Intelligence
                      </Link>
                    </li>
                    <li>
                      <Link href="/cognitive-development" className="hover:text-[#38BDF8] transition-colors">
                        Cognitive Development
                      </Link>
                    </li>
                    <li>
                      <Link href="/adhd-support" className="hover:text-[#38BDF8] transition-colors">
                        ADHD Executive Hub
                      </Link>
                    </li>
                    <li>
                      <Link href="/autism-support" className="hover:text-[#38BDF8] transition-colors">
                        Autism &amp; Sensory
                      </Link>
                    </li>
                    <li>
                      <Link href="/languages" className="hover:text-[#38BDF8] transition-colors">
                        Multilingual AI
                      </Link>
                    </li>
                    <li>
                      <Link href="/research" className="hover:text-[#38BDF8] transition-colors">
                        Research &amp; Evidence
                      </Link>
                    </li>
                    <li>
                      <Link href="/accessibility" className="hover:text-[#38BDF8] transition-colors">
                        WCAG 2.2 Accessibility
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 4: Stay in Touch & Privacy Controls */}
                <div className="lg:col-span-3 space-y-4">
                  <h3 className="text-[12.5px] font-semibold uppercase tracking-widest text-slate-400">
                    Stay in Touch
                  </h3>
                  <p className="text-[13.5px] text-slate-300">
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
                      className="w-full pl-4 pr-12 py-3 rounded-full bg-slate-800 text-white placeholder:text-slate-400 border border-slate-700 text-[13.5px] font-medium focus:outline-none focus:border-[#2B4CDE]"
                    />
                    <button
                      type="submit"
                      aria-label="Subscribe"
                      className="absolute right-1.5 w-9 h-9 rounded-full bg-[#2B4CDE] text-white hover:bg-[#1E3A8A] flex items-center justify-center transition-colors"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </form>

                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      onClick={handleToggleTelemetry}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-800/70 border border-slate-700 text-left text-[12px] text-slate-300 hover:border-[#2B4CDE] transition-colors flex items-center justify-between"
                    >
                      <span>
                        Anonymous local telemetry:{" "}
                        <strong className="text-white">
                          {telemetryEnabled ? "On" : "Off"}
                        </strong>
                      </span>
                      {telemetryEnabled && (
                        <Check className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                      )}
                    </button>
                    <div className="flex items-center gap-3 text-[12px] text-slate-400 pt-1">
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
              <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center space-x-3">
                  <HeartHandshake className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5 sm:mt-0" />
                  <p className="text-[13px] text-slate-300 leading-relaxed">
                    <strong>Child Safety &amp; Non-Clinical Notice:</strong> Weebly provides supportive, developmental learning and emotional literacy scaffolding for children and teens. It is not medical treatment or psychotherapy. Existing adult users can access the <Link href="/dashboard" className="text-sky-300 underline font-medium">InnerOS Adult Sanctuary</Link>. Free 24/7 crisis lines: <strong>988</strong> (US/Canada), <strong>116 123</strong> (UK), <strong>112</strong> (EU).
                  </p>
                </div>
                <Link
                  href="/safety"
                  className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-[12.5px] font-medium shrink-0 self-start md:self-auto"
                >
                  View All Helplines
                </Link>
              </div>
            </div>

            {/* Bottom Copyright */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px] text-slate-400 px-2">
              <p>&copy; {new Date().getFullYear()} Weebly. Multilingual Developmental Learning &amp; Emotional Intelligence Platform.</p>
              <p>
                Spoken &amp; Written Support in English, Urdu (اردو), and Pakistani Punjabi (پنجابی).
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
