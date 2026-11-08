"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { HeartHandshake, ArrowRight, ShieldCheck, CheckCircle2, Users, Accessibility } from "lucide-react";

export default function ChildDevelopmentDedicatedPage() {
  const [selectedFeeling, setSelectedFeeling] = useState("Calm & Curious 🌿");

  return (
    <MarketingShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        <section className="rounded-3xl bg-white border-2 border-slate-900 p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-950 text-xs font-extrabold">
              <HeartHandshake className="w-4 h-4" />
              <span>Pillar 04 • Child Wellbeing, Early Support &amp; Safeguarding</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
              STATUS: LIVE AND VERIFIED (/youth/emotions, /parent &amp; /professional/portal)
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Child Wellbeing, Parent/Teacher Observations &amp; Human Safeguarding
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            Built for <strong>children (Ages 3–18), parents, educators, and school counselors</strong>. Weebly supports everyday emotional literacy, connects adult observations across home and school, and enforces immediate human safeguarding escalation (CPWB 1121 &amp; Umang)—with zero AI diagnostic claims.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/youth/emotions"
              className="px-6 py-3.5 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-black inline-flex items-center gap-2"
            >
              <span>Open Child Feelings &amp; Calm Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demos?demo=professional"
              className="px-6 py-3.5 rounded-2xl bg-[#FAF7F2] border-2 border-slate-900 text-slate-900 text-xs sm:text-sm font-black"
            >
              Try Safeguarding &amp; Support Demo
            </Link>
          </div>
        </section>

        {/* Interactive Preview: Child Feeling Check-In -> Non-Diagnostic Adult Context */}
        <section className="rounded-3xl bg-white border-2 border-slate-900 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl font-black text-slate-900">
              Interactive Preview: Child Feeling Check-In &amp; Caregiver Support Tip
            </h2>
            <p className="text-sm text-slate-600">
              Select a child feeling check-in below to see how Weebly responds with a gentle regulation activity and a non-clinical caregiver tip:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Calm & Curious 🌿",
                "Butterflies in My Tummy 🦋",
                "Frustrated with a Puzzle 😤",
                "Tired & Ready to Rest 🌙",
              ].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSelectedFeeling(f)}
                  className={`px-4 py-2.5 rounded-xl border-2 text-xs font-black ${
                    selectedFeeling === f
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-[#FAF7F2] text-slate-800 border-slate-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 rounded-2xl bg-[#FAF7F2] border border-slate-200 p-6 space-y-3">
            <div className="text-xs font-black uppercase text-rose-700">Selected State: {selectedFeeling}</div>
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              Companion Response (Lumi): &ldquo;Thank you for sharing how your body and heart feel! Let&apos;s take three slow balloon breaths together before we choose our next step.&rdquo;
            </p>
            <p className="text-xs text-slate-600 bg-white p-3.5 rounded-xl border border-slate-200">
              <strong>Parent/Teacher Context Note (Non-Diagnostic):</strong> Logged as an everyday self-reflection check-in. Zero clinical labels or psychological scores are generated.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <Users className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-black text-slate-900">Age Applicability</h3>
            <p className="text-xs text-slate-600">
              Ages 3–18 for age-tiered feelings check-ins; adults use `/parent`, `/teacher/dashboard`, and `/professional/portal`.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-black text-slate-900">Actual Functions</h3>
            <p className="text-xs text-slate-600">
              Live observation persistence via `/api/parent/observations`, Skills Passport reflections, and 1121 distress escalation in `/api/youth/friends/turn`.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <Accessibility className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-black text-slate-900">Accessibility</h3>
            <p className="text-xs text-slate-600">
              Spoken reassurance aloud (never abrupt silence) during distress, illustrated emotion cards, and trilingual support.
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 space-y-2">
            <ShieldCheck className="w-5 h-5 text-amber-700" />
            <h3 className="text-base font-black text-slate-900">Safeguarding Boundary</h3>
            <p className="text-xs text-slate-600">
              Enforces the Caregiver Harm Exception Protocol (suppressing parent notification if domestic harm is disclosed) and never performs AI diagnosis.
            </p>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
