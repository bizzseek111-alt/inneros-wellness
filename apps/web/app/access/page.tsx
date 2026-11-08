"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";
import { Smartphone, WifiOff, Globe, Lock, ShieldCheck, Users, Volume2, ArrowRight } from "lucide-react";

export default function AccessAndSafetyDedicatedPage() {
  const [sampleLang, setSampleLang] = useState<"en" | "ur" | "pa">("en");
  const [lowDataPreview, setLowDataPreview] = useState(false);

  const sampleText = {
    en: "Weebly works offline as an installable Progressive Web App with English, Urdu, and Punjabi voice support.",
    ur: "ویبلی انگریزی، اردو اور پنجابی آواز کے ساتھ کم ڈیٹا اور آف لائن موڈ میں بھی کام کرتا ہے۔",
    pa: "ویبلی انگریزی، اردو تے پنجابی آواز نال گھٹ نیٹ تے آف لائن وی کم کردا اے۔",
  };

  return (
    <MarketingShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        <section className="rounded-3xl bg-white border-2 border-slate-900 p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-900 text-xs font-extrabold">
              <Smartphone className="w-4 h-4" />
              <span>PWA, Low-Data Resilience, Languages, Privacy &amp; Human Oversight</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
              STATUS: LIVE AND VERIFIED (/manifest.webmanifest &amp; /sw.js)
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Built for Every Family &amp; Classroom: Access, Privacy &amp; Offline PWA
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            Designed for <strong>families, schools, and regional education ministries</strong> operating across diverse devices and network conditions. Weebly combines installable PWA caching, English/Urdu/Punjabi localization, private-by-default child data governance, and human review.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/demos"
              className="px-6 py-3.5 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-black inline-flex items-center gap-2"
            >
              <span>Try Interactive Demo Center</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/trust"
              className="px-6 py-3.5 rounded-2xl bg-[#FAF7F2] border-2 border-slate-900 text-slate-900 text-xs sm:text-sm font-black"
            >
              Inspect Trust &amp; Safeguarding Policy
            </Link>
          </div>
        </section>

        {/* Interactive Trilingual & Low-Data Preview */}
        <section className="rounded-3xl bg-white border-2 border-slate-900 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl font-black text-slate-900">
              Interactive Preview: Trilingual Voice &amp; Low-Bandwidth Mode
            </h2>
            <p className="text-sm text-slate-600">
              Switch between English, Urdu (اردو), and Punjabi (پنجابی) below, or toggle Low-Data Mode to see how Weebly prioritizes lightweight vector assets and offline-first state queues:
            </p>
            <div className="flex flex-wrap gap-2">
              {(["en", "ur", "pa"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setSampleLang(l)}
                  className={`px-4 py-2 rounded-xl border-2 text-xs font-black ${
                    sampleLang === l
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-[#FAF7F2] text-slate-800 border-slate-200"
                  }`}
                >
                  {l === "en" ? "English (EN)" : l === "ur" ? "اردو (Urdu)" : "پنجابی (Punjabi)"}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setLowDataPreview((v) => !v)}
                className={`px-4 py-2 rounded-xl border-2 text-xs font-black ${
                  lowDataPreview
                    ? "bg-emerald-700 text-white border-emerald-700"
                    : "bg-white text-slate-700 border-slate-300"
                }`}
              >
                {lowDataPreview ? "✓ Low-Data Vector Mode Active" : "Simulate Low-Data Mode"}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-2xl bg-[#FAF7F2] border border-slate-200 p-6 space-y-4">
            <p
              className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed"
              dir={sampleLang === "en" ? "ltr" : "rtl"}
            >
              &ldquo;{sampleText[sampleLang]}&rdquo;
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => voiceSynthesizer.speak(sampleText[sampleLang], { locale: sampleLang })}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-extrabold inline-flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" />
                <span>Speak Sample Aloud</span>
              </button>
              <span className="text-xs font-bold text-slate-500">
                {lowDataPreview
                  ? "Payload: ~14 KB JSON + Inline SVG (Zero Heavy Video)"
                  : "Standard Mode: PWA Service Worker Caching Active"}
              </span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <WifiOff className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-black text-slate-900">Offline Sync &amp; Logout Purge</h3>
            <p className="text-xs text-slate-600">
              `lib/offline-sync.ts` queues completed milestones locally when offline and purges local state on shared-device logout.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <Lock className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-black text-slate-900">Strict API Cache Exclusion</h3>
            <p className="text-xs text-slate-600">
              `public/sw.js` strictly excludes `/api/` and `/ws/` routes from browser caching so private family records never leak across sessions.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <ShieldCheck className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-black text-slate-900">Human Governance &amp; Edge Headers</h3>
            <p className="text-xs text-slate-600">
              `middleware.ts` enforces route-tier isolation (`kids_sanctuary`, `caregiver_portal`, `teacher_portal`) and `X-Frame-Options: DENY`.
            </p>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
