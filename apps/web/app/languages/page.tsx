"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import {
  Globe,
  Mic,
  MessageCircle,
  Volume2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function LanguagesPublicPage() {
  const [selectedLang, setSelectedLang] = useState<"ur" | "pa" | "ur-Latn" | "en">("ur");

  const DIALECT_PREVIEWS = {
    ur: {
      name: "اردو (Urdu Nastaliq)",
      direction: "RTL",
      prompt: "امی، مجھے اسکول سے خوف محسوس ہوتا ہے۔",
      reply: "آپ کا پریشان ہونا بالکل قدرتی ہے۔ کیا آپ مجھے بتانا چاہیں گے کہ اسکول میں کس چیز سے آپ کو گھبراہٹ ہوتی ہے؟",
      status: "Functional AI Text & Natural Speech Active"
    },
    pa: {
      name: "پنجابی (Pakistani Punjabi Shahmukhi)",
      direction: "RTL",
      prompt: "مینوں اج بڑا غصہ آیا سی۔",
      reply: "غصہ آونا کوئی بری گل نئیں۔ آؤ پہلے اک لمبا ساہ لئیے، فیر گل کردے آں۔",
      status: "Functional AI Text & Honest Text-Only Fallback (Speech synthesis in progress)"
    },
    "ur-Latn": {
      name: "Roman Urdu",
      direction: "LTR",
      prompt: "Mujhe lagta hai koi mera dost nahi hai.",
      reply: "Aisa mehsos hona mushkil ho sakta hai. Lekin aap akele nahi hain. Kya hua aaj lunch break mein?",
      status: "Functional AI Text & Roman Transliteration Active"
    },
    en: {
      name: "English",
      direction: "LTR",
      prompt: "I feel like giving up on my math homework.",
      reply: "It makes total sense to feel stuck right now. Let's take a 30-second breath and break problem number one into two tiny steps.",
      status: "Full Streaming STT & TTS Active"
    }
  };

  const preview = DIALECT_PREVIEWS[selectedLang];

  return (
    <MarketingShell>
      <div className="bg-[#FAF9F5] min-h-screen text-[#1E293B]">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F0] bg-gradient-to-b from-[#F0FDF4] to-[#FAF9F5]">
          <div className="max-w-6xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-[#CBD5E1] shadow-xs text-xs font-semibold text-[#0F766E]">
              <Globe className="w-4 h-4 text-[#0F766E]" />
              <span>Native South Asian Dialect &amp; Code-Switching Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] max-w-4xl mx-auto leading-tight">
              Honoring children in the language of their homes and hearts.
            </h1>

            <p className="text-lg sm:text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed">
              Full bi-directional Nastaliq script support for Urdu and Shahmukhi Punjabi, Romanized transliterations, and natural code-switching.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/youth/language"
                className="px-8 py-3.5 rounded-full bg-[#0F766E] text-white font-semibold text-sm hover:bg-[#115E59] shadow-md transition-all inline-flex items-center space-x-2"
              >
                <span>Open Language Settings</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/youth/voice"
                className="px-8 py-3.5 rounded-full bg-white text-[#0F766E] font-semibold text-sm hover:bg-[#F1F5F9] border border-[#CBD5E1] shadow-xs transition-all"
              >
                Enter Lumi Voice Room
              </Link>
            </div>
          </div>
        </section>

        {/* Dialect Switcher Showcase */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">Interactive Preview</span>
                <h3 className="text-2xl font-bold text-[#0F172A]">Real-Time Multilingual Dialogue</h3>
              </div>
              <div className="flex flex-wrap gap-1 p-1 bg-[#F1F5F9] rounded-xl text-xs font-semibold">
                {(["ur", "pa", "ur-Latn", "en"] as const).map((langKey) => (
                  <button
                    key={langKey}
                    type="button"
                    onClick={() => setSelectedLang(langKey)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedLang === langKey ? "bg-white text-[#0F172A] shadow-xs font-bold" : "text-[#64748B]"
                    }`}
                  >
                    {DIALECT_PREVIEWS[langKey].name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Display */}
            <div className="space-y-4 pt-2" dir={preview.direction === "RTL" ? "rtl" : "ltr"}>
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <span className="text-xs font-bold text-[#64748B]">Child:</span>
                <p className="text-base font-semibold text-[#0F172A]">{preview.prompt}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-1">
                <span className="text-xs font-bold text-[#15803D]">Lumi (Companion):</span>
                <p className="text-base text-[#166534] leading-relaxed">{preview.reply}</p>
              </div>
            </div>

            {/* Honest Speech Status Badge */}
            <div className="pt-2 flex items-center justify-between text-xs text-[#64748B] border-t border-[#F1F5F9]">
              <span className="font-semibold">{preview.status}</span>
              <span className="px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#334155] font-bold">
                Direction: {preview.direction}
              </span>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 text-center bg-white border-t border-[#E2E8F0]">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold text-[#0F172A]">Experience culturally grounded conversation.</h2>
            <p className="text-sm text-[#64748B]">Full accessibility with screen reader landmarks in Urdu and English.</p>
            <div className="pt-2">
              <Link
                href="/kids"
                className="px-8 py-3 rounded-full bg-[#0F766E] text-white font-semibold text-sm hover:bg-[#115E59] shadow-md transition-all inline-flex items-center space-x-2"
              >
                <span>Try Multilingual Voice Room</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
