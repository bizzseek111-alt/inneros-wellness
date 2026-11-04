"use client";

import React from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import {
  ShieldAlert,
  PhoneCall,
  Heart,
  Lock,
  ArrowRight,
  LifeBuoy,
  Users
} from "lucide-react";

export default function ChildSafetyPublicPage() {
  const EMERGENCY_RESOURCES = [
    {
      country: "Pakistan",
      service: "Child Protection Bureau & National Helpline",
      number: "1121",
      note: "Emergency child safety, legal protection, and family assistance."
    },
    {
      country: "Pakistan",
      service: "Emergency Rescue & Medical Ambulance",
      number: "1122",
      note: "Urgent physical safety and medical response across all districts."
    },
    {
      country: "United States & Canada",
      service: "Suicide & Crisis Lifeline",
      number: "988",
      note: "Free, confidential 24/7 crisis support via call or text."
    },
    {
      country: "United Kingdom",
      service: "Childline (NSPCC)",
      number: "0800 1111",
      note: "24-hour dedicated youth support line and trained counselors."
    }
  ];

  return (
    <MarketingShell>
      <div className="bg-[#FAF9F5] min-h-screen text-[#1E293B]">
        {/* Hero Section */}
        <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F0] bg-rose-50 text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-rose-200 text-xs font-semibold text-rose-800">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Multi-Layered Safeguarding &amp; Escalation Framework</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A]">
              Child Safety &amp; Human Safeguarding
            </h1>
            <p className="text-base sm:text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
              How Weebly protects young users, prevents emotional manipulation, refuses secrets, and connects children to real-world help.
            </p>
          </div>
        </section>

        {/* Safeguarding Principles */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
          <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-[#0F172A]">1. The Secrecy Refusal Invariant</h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              Weebly AI companions are hardcoded to refuse any request to hide disclosures from caregivers. If a child asks, <em>&ldquo;Promise you won&apos;t tell my parents,&rdquo;</em> the AI gently declines and encourages open family communication.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1] shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-[#0F172A]">2. Calm Reassurance &amp; Immediate Escalation</h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              If an utterance reveals distress, abuse, or self-harm ideation, the AI provides calm, spoken reassurance rather than abrupt silence. Trusted human crisis contacts are immediately displayed on screen, and case escalation triggers notify designated safeguarding specialists.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-rose-900">3. Caregiver Harm Exception Protocol</h2>
            <p className="text-sm text-rose-800 leading-relaxed">
              If a minor reports abuse or endangerment by a primary caregiver, standard parent notification is actively suppressed to prevent domestic retaliation. The case is forwarded directly to the Punjab Child Protection &amp; Welfare Bureau (CPWB Helpline 1121).
            </p>
          </div>

          {/* Emergency Hotlines Directory */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-rose-200 shadow-xs space-y-6">
            <h2 className="text-xl font-bold text-[#0F172A] flex items-center space-x-2">
              <PhoneCall className="w-5 h-5 text-rose-600" />
              <span>24/7 Verified Emergency &amp; Child Helplines</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EMERGENCY_RESOURCES.map((res, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#FFF1F2] border border-rose-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-rose-700">{res.country}</span>
                    <span className="text-sm font-extrabold text-rose-900">{res.number}</span>
                  </div>
                  <p className="text-xs font-bold text-[#0F172A]">{res.service}</p>
                  <p className="text-[11px] text-[#64748B]">{res.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
