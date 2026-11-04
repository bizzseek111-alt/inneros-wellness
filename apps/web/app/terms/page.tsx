"use client";

import React from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { FileText, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function TermsPublicPage() {
  return (
    <MarketingShell>
      <div className="bg-[#FAF9F5] min-h-screen text-[#1E293B]">
        <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F0] bg-white text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
              Terms of Service &amp; Non-Clinical Agreement
            </h1>
            <p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto">
              Clear, transparent conditions of use for adult, teen, and child platforms.
            </p>
          </div>
        </section>

        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
          <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-[#0F172A] flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>1. Educational Nature — Not a Medical Device</span>
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              Weebly, Weebly Kids, and Weebly Teens are educational, creative, and life-skills platforms designed for conversational learning, foundational literacy, and cognitive scaffolding. InnerOS is a separate adult personal wellbeing application. <strong>Neither Weebly nor InnerOS provides psychiatric diagnoses, medical treatment, or clinical crisis stabilization.</strong>
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-[#0F172A] flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>2. Verified Guardian Responsibility</span>
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              Minor access is contingent on verified adult caregiver authorization. Caregivers agree to monitor youth usage, adhere to recommended daily screen-time turn limits, and provide real-world supervision during offline family connection exercises.
            </p>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
