"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import {
  ShieldCheck,
  Heart,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  Lock,
  ChevronDown,
  EyeOff,
  Sliders,
  CheckCircle2,
  Calendar,
  BookOpen,
  MessageCircle,
  AlertCircle
} from "lucide-react";

export default function ParentsPage() {
  const [activeTab, setActiveTab] = useState<"onboarding" | "controls" | "activities">("onboarding");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const PARENT_FAQS = [
    {
      q: "Can I see what my child says to the AI companion?",
      a: "For younger children (ages 2–12), you have full visibility into aggregate themes, active feelings explored, and completed learning milestones. For teenagers (ages 13–18), InnerOS protects adolescent developmental autonomy by keeping reflective journals private, while alerting you if any severe safety concern or crisis trigger occurs."
    },
    {
      q: "How does verified parental consent work?",
      a: "In compliance with COPPA and GDPR-K, a parent or legal guardian must authenticate their adult account and provide verified consent before any child profile can begin learning activities. No biometric voice data or sensitive PII is permanently stored."
    },
    {
      q: "Can I set daily screen time limits?",
      a: "Yes. From your parent portal, you can set daily conversational turn limits (defaulting to 15 turns per session) and configure bedtime shutdown windows to ensure balanced screen use and healthy offline play."
    },
    {
      q: "Is InnerOS a replacement for child therapy?",
      a: "No. InnerOS is an educational psychoeducational platform designed to foster emotional vocabulary, routines, and cognitive resilience. It does not diagnose, treat, or claim to cure mental health conditions. If clinical support is needed, we provide accredited professional referral pathways."
    }
  ];

  return (
    <MarketingShell>
      <div className="bg-[#FAF8F5] min-h-screen text-[#1E293B]">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F0] bg-gradient-to-b from-[#F5EFE6] to-[#FAF8F5]">
          <div className="max-w-6xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-[#CBD5E1] shadow-xs text-xs font-semibold text-[#0F766E]">
              <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
              <span>Caregiver Guidance &amp; Family Co-Regulation</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] max-w-4xl mx-auto leading-tight">
              Partnering with parents to raise emotionally resilient, curious kids.
            </h1>

            <p className="text-lg sm:text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed">
              InnerOS gives caregivers transparent oversight, shared connection exercises, and peace of mind. Zero dark patterns, zero ad tracking, and complete privacy separation.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/caregiver/dashboard"
                className="px-8 py-3.5 rounded-full bg-[#0F766E] text-white font-semibold text-sm hover:bg-[#115E59] shadow-md transition-all inline-flex items-center space-x-2"
              >
                <span>Open Parent Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/signup?role=caregiver"
                className="px-8 py-3.5 rounded-full bg-white text-[#0F766E] font-semibold text-sm hover:bg-[#F1F5F9] border border-[#CBD5E1] shadow-xs transition-all"
              >
                Create Free Caregiver Account
              </Link>
            </div>
          </div>
        </section>

        {/* Core Pillars for Parents */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              Built with parents at the center, not on the sidelines
            </h2>
            <p className="text-base text-[#64748B] max-w-xl mx-auto">
              We believe AI should strengthen real-world family bonds, not substitute for them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Parental Consent &amp; Safety Gate</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Children cannot access unsupervised AI. Verified guardian consent is required before any child profile is activated.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
                <EyeOff className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Age-Appropriate Privacy</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                High transparency for young children (ages 2–12), balanced with appropriate developmental privacy for adolescents (ages 13–18).
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Anti-Addiction Turn Limits</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Sessions naturally wind down after 15 turns with warm prompts encouraging offline play, drawing, or family conversations.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Parent Controls Showcase */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#CBD5E1] shadow-sm space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
              <div>
                <h3 className="text-2xl font-bold text-[#0F172A]">Parent Control Panel Preview</h3>
                <p className="text-sm text-[#64748B]">See what you control in your caregiver dashboard.</p>
              </div>

              <div className="flex p-1 bg-[#F1F5F9] rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab("onboarding")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeTab === "onboarding" ? "bg-white text-[#0F172A] shadow-xs" : "text-[#64748B]"
                  }`}
                >
                  Child Profiles
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("controls")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeTab === "controls" ? "bg-white text-[#0F172A] shadow-xs" : "text-[#64748B]"
                  }`}
                >
                  Screen Boundaries
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("activities")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeTab === "activities" ? "bg-white text-[#0F172A] shadow-xs" : "text-[#64748B]"
                  }`}
                >
                  Shared Activities
                </button>
              </div>
            </div>

            {activeTab === "onboarding" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      Z
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0F172A]">Zara (Age 8)</p>
                      <p className="text-xs text-[#64748B]">Tier: Explorer (Ages 6–12) &bull; Language: Urdu &amp; English</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Consent Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      H
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0F172A]">Hamza (Age 14)</p>
                      <p className="text-xs text-[#64748B]">Tier: Navigator (Ages 13–18) &bull; Language: English</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                    Private Journal Mode
                  </span>
                </div>
              </div>
            )}

            {activeTab === "controls" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <span className="text-xs font-bold uppercase text-[#059669]">Session Cap</span>
                  <p className="text-sm font-semibold text-[#0F172A]">15 Turns per Sitting</p>
                  <p className="text-xs text-[#64748B]">Automatic pause with calming breath and offline game reminder.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <span className="text-xs font-bold uppercase text-[#4F46E5]">Bedtime Window</span>
                  <p className="text-sm font-semibold text-[#0F172A]">8:00 PM – 7:00 AM</p>
                  <p className="text-xs text-[#64748B]">App locks gently into night mode with somatic relaxation audio only.</p>
                </div>
              </div>
            )}

            {activeTab === "activities" && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#065F46]">Volcano Belly Breath Double-Inhale</p>
                    <p className="text-xs text-[#047857]">Practice vagal nerve co-regulation together for 3 minutes before bed.</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                </div>
                <div className="p-4 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#3730A3]">The Gratitude Rose &amp; Thorn Game</p>
                    <p className="text-xs text-[#4338CA]">Dinner conversation card: share one rose (joy) and one thorn (challenge).</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-[#4F46E5]" />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Parent FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              Frequently Asked Questions by Parents
            </h2>
          </div>

          <div className="space-y-4">
            {PARENT_FAQS.map((faq, idx) => (
              <div key={idx} className="rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-sm sm:text-base text-[#0F172A]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#64748B] transition-transform ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-[#475569] leading-relaxed border-t border-[#F1F5F9] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 text-center bg-white border-t border-[#E2E8F0]">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-extrabold text-[#0F172A]">
              Ready to support your child&apos;s emotional growth?
            </h2>
            <p className="text-base text-[#64748B]">
              Set up your parent account in less than 2 minutes. Free access to foundation modules and family routines.
            </p>
            <div>
              <Link
                href="/signup?role=caregiver"
                className="px-8 py-3.5 rounded-full bg-[#0F766E] text-white font-semibold text-sm hover:bg-[#115E59] shadow-md transition-all inline-flex items-center space-x-2"
              >
                <span>Create Caregiver Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
