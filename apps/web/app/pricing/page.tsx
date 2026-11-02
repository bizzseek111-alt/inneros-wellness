"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import {
  CheckCircle2,
  Info,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const DRAFT_PLANS = [
  {
    id: "starter",
    name: "Personal Sanctuary",
    statusBadge: "Draft Plan — Free Tier",
    monthlyPrice: "$0",
    annualPrice: "$0",
    periodLabel: "Always free for core reflection",
    description:
      "Everything you need to check in with your mood, write in your private journal, and experience calm text and voice conversations.",
    surface: "bg-white border-[#DCE7FE] text-[#0F172A] shadow-[0_8px_30px_rgba(43,76,222,0.05)]",
    ctaLabel: "Try Free Preview",
    ctaHref: "/onboarding",
    features: [
      "Daily emotional & body comfort check-ins",
      "Private Journal with guided reflection prompts",
      "Text Companion with all 5 response modes",
      "Introductory Voice Companion sessions",
      "Things I Remember (confirm, edit, forget, export)",
      "Full privacy controls & 24/7 crisis helpline directory",
    ],
  },
  {
    id: "plus",
    name: "Companion Plus",
    statusBadge: "Draft Pricing — Most Popular",
    monthlyPrice: "$14",
    annualPrice: "$11",
    periodLabel: "per month (draft estimate)",
    description:
      "Designed for everyday voice conversations, extended memory connections, proactive daily routines, and personal archive imports.",
    surface: "bg-gradient-to-br from-[#2B4CDE] to-[#1E3A8A] border-[#2B4CDE] text-white shadow-[0_20px_50px_rgba(43,76,222,0.22)]",
    ctaLabel: "Explore in Sandbox",
    ctaHref: "/dashboard",
    highlighted: true,
    features: [
      "Everything in Personal Sanctuary",
      "Extended real-time Voice Companion conversations",
      "All 4 calming voice timbres & multilingual switching",
      "Visual Connections (Life Graph) view in Memories",
      "Custom recurring reminders & Quiet Hours scheduling",
      "User-controlled imports (ChatGPT/Claude exports, Markdown, Calendar)",
      "Full psychology knowledge library & guided exercises",
    ],
  },
];

export default function PricingMarketingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );

  return (
    <MarketingShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-16 space-y-14">
        {/* Transparent Draft Pricing Banner */}
        <div className="p-5 rounded-3xl bg-[#EEF4FF] border border-[#DCE7FE] flex items-start sm:items-center space-x-3.5 text-[14.5px] text-[#0F172A]">
          <Info className="w-5 h-5 text-[#2B4CDE] shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-relaxed">
            <strong>Pre-Release Draft Pricing Notice:</strong> The plans and price points shown below are <strong>draft structures</strong> for product evaluation. During the current preview environment, all features are open to explore at no cost.
          </p>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#EEF4FF] border border-[#DCE7FE] text-[#2B4CDE] text-[13.5px] font-semibold">
            <Sparkles className="w-4 h-4 text-[#2B4CDE]" />
            <span>Simple, Transparent Structure</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#0F172A] tracking-tight">
            Clear plans with privacy and safety included for everyone.
          </h1>
          <p className="text-[18px] text-[#475569] leading-relaxed">
            We never paywall your data rights, memory deletion controls, or crisis support resources.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-3 inline-flex items-center bg-white p-1.5 rounded-full border border-[#DCE7FE] shadow-xs">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-[13.5px] font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "bg-[#2B4CDE] text-white shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Monthly (Draft)
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`px-5 py-2 rounded-full text-[13.5px] font-semibold transition-all ${
                billingCycle === "annual"
                  ? "bg-[#2B4CDE] text-white shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Annual (Draft)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {DRAFT_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`p-8 sm:p-10 rounded-[36px] border ${plan.surface} flex flex-col justify-between space-y-8`}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-2xl font-bold">
                    {plan.name}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      plan.highlighted
                        ? "bg-white/20 text-white border border-white/20"
                        : "bg-[#EEF4FF] text-[#2B4CDE] border border-[#DCE7FE]"
                    }`}
                  >
                    {plan.statusBadge}
                  </span>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl sm:text-5xl font-bold">
                    {billingCycle === "monthly"
                      ? plan.monthlyPrice
                      : plan.annualPrice}
                  </span>
                  <span className={`text-[14.5px] ${plan.highlighted ? "text-white/80" : "text-[#64748B]"}`}>
                    {plan.periodLabel}
                  </span>
                </div>

                <p className={`text-[15.5px] leading-relaxed ${plan.highlighted ? "text-white/90" : "text-[#475569]"}`}>
                  {plan.description}
                </p>

                <ul className={`space-y-3 pt-4 border-t ${plan.highlighted ? "border-white/20" : "border-[#EEF2F6]"}`}>
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start space-x-2.5 text-[15px]"
                    >
                      <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${plan.highlighted ? "text-[#38BDF8]" : "text-[#059669]"}`} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                <Link href={plan.ctaHref}>
                  <Button
                    variant={plan.highlighted ? "primary" : "outline"}
                    size="lg"
                    className={`w-full ${
                      plan.highlighted
                        ? "bg-white text-[#2B4CDE] hover:bg-[#EEF4FF] border-white font-bold"
                        : "bg-[#EEF4FF] text-[#2B4CDE] hover:bg-[#2B4CDE] hover:text-white border-[#DCE7FE] font-bold"
                    }`}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    {plan.ctaLabel}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Ethical Pricing Commitments */}
        <div className="p-8 rounded-[32px] bg-white border border-[#DCE7FE] shadow-[0_8px_30px_rgba(43,76,222,0.05)] grid sm:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-[#2B4CDE] font-bold text-[15px]">
              <ShieldCheck className="w-5 h-5" />
              <span>Privacy Is Never Paywalled</span>
            </div>
            <p className="text-[14px] text-[#475569] leading-relaxed">
              Full data export, individual memory deletion, and complete account clearing are free for every user.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-[#2B4CDE] font-bold text-[15px]">
              <ShieldCheck className="w-5 h-5" />
              <span>No Surprise Renewals</span>
            </div>
            <p className="text-[14px] text-[#475569] leading-relaxed">
              Transparent reminders before any annual billing. Cancel with a single click at any time.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-[#2B4CDE] font-bold text-[15px]">
              <ShieldCheck className="w-5 h-5" />
              <span>Safety Never Gated</span>
            </div>
            <p className="text-[14px] text-[#475569] leading-relaxed">
              24/7 crisis helplines and immediate human safety directories are always free and readily accessible.
            </p>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
