"use client";

import React from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  Trash2,
  Download,
  AlertCircle
} from "lucide-react";

export default function PrivacyPublicPage() {
  return (
    <MarketingShell>
      <div className="bg-[#FAF9F5] min-h-screen text-[#1E293B]">
        <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F0] bg-white text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>COPPA &amp; GDPR-K Aligned Child Data Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
              Weebly Privacy Policy &amp; Child Data Safeguards
            </h1>
            <p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto">
              Last updated: November 2026. Zero persistent child audio retention. Strict adult/child database isolation.
            </p>
          </div>
        </section>

        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
          <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-[#0F172A] flex items-center space-x-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              <span>1. Strict Child &amp; Adult Data Isolation</span>
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              Adult InnerOS personal growth graphs, therapy check-ins, and journal entries are physically and logically segregated from child profiles. At no point is adult data ever indexed or shared with youth AI conversational contexts.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-[#0F172A] flex items-center space-x-2">
              <EyeOff className="w-5 h-5 text-emerald-600" />
              <span>2. 24-Hour Ephemeral Memory for Children</span>
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              Conversational turns in Weebly Kids and Teens reside in an isolated, in-memory ephemeral store that automatically purges after 24 hours. Voice audio is streamed live for synthesis and is never written to disk or permanent storage.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-[#0F172A] flex items-center space-x-2">
              <Trash2 className="w-5 h-5 text-emerald-600" />
              <span>3. Right-to-be-Forgotten &amp; One-Click Export</span>
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              Parents retain unconditional rights to export their child&apos;s educational milestone history or permanently delete all associated profiles with a single click from the caregiver dashboard. Cascade deletion purges all tokens and progress records.
            </p>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
