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
    surface: "bg-white border-[#E6E0D6]",
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
    statusBadge: "Draft Pricing — Subject to Approval",
    monthlyPrice: "$14",
    annualPrice: "$11",
    periodLabel: "per month (draft estimate)",
    description:
      "Designed for everyday voice conversations, extended memory connections, proactive daily routines, and personal archive imports.",
    surface: "bg-[#E8F1EB] border-[#285B55]",
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
        <div className="p-5 rounded-3xl bg-[#F7E7E2] border border-[#EED2C9] flex items-start sm:items-center space-x-3.5 text-[14.5px] text-[#263330]">
          <Info className="w-5 h-5 text-[#9A5542] shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-relaxed">
            <strong>Pre-Release Draft Pricing Notice:</strong> The plans and price points shown below are <strong>draft structures</strong> for product evaluation. During the current preview environment, all features are open to explore at no cost.
          </p>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E8F1EB] border border-[#CFE2D6] text-[#1F4742] text-[13.5px] font-medium">
            <Sparkles className="w-4 h-4 text-[#285B55]" />
            <span>Simple, Transparent Structure</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#263330] tracking-tight">
            Clear plans with privacy and safety included for everyone.
          </h1>
          <p className="text-[18px] text-[#52625E] leading-relaxed">
            We never paywall your data rights, memory deletion controls, or crisis support resources.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-3 inline-flex items-center bg-white p-1.5 rounded-2xl border border-[#E6E0D6] shadow-sm">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-xl text-[14px] font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-[#285B55] text-white"
                  : "text-[#52625E] hover:text-[#263330]"
              }`}
            >
              Monthly (Draft)
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-2 rounded-xl text-[14px] font-medium transition-all ${
                billingCycle === "annual"
                  ? "bg-[#285B55] text-white"
                  : "text-[#52625E] hover:text-[#263330]"
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
              className={`p-8 sm:p-10 rounded-[36px] border ${plan.surface} shadow-sm flex flex-col justify-between space-y-8`}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-2xl font-serif font-medium text-[#263330]">
                    {plan.name}
                  </h2>
                  <Badge
                    variant={plan.highlighted ? "sage" : "neutral"}
                    size="sm"
                  >
                    {plan.statusBadge}
                  </Badge>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl sm:text-5xl font-serif font-semibold text-[#263330]">
                    {billingCycle === "monthly"
                      ? plan.monthlyPrice
                      : plan.annualPrice}
                  </span>
                  <span className="text-[14.5px] text-[#52625E]">
                    {plan.periodLabel}
                  </span>
                </div>

                <p className="text-[15.5px] text-[#52625E] leading-relaxed">
                  {plan.description}
                </p>

                <ul className="space-y-3 pt-4 border-t border-[#E6E0D6]">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start space-x-2.5 text-[15px] text-[#263330]"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#285B55] shrink-0 mt-0.5" />
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
                    className="w-full"
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
        <div className="p-8 rounded-[32px] bg-white border border-[#E6E0D6] shadow-sm grid sm:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-[#285B55] font-semibold text-[15px]">
              <ShieldCheck className="w-5 h-5" />
              <span>Privacy Is Never Paywalled</span>
            </div>
            <p className="text-[14px] text-[#52625E] leading-relaxed">
              Full data export, individual memory deletion, and complete account clearing are free for every user.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-[#285B55] font-semibold text-[15px]">
              <ShieldCheck className="w-5 h-5" />
              <span>No Surprise Renewals</span>
            </div>
            <p className="text-[14px] text-[#52625E] leading-relaxed">
              When paid plans launch, you will receive a clear reminder before any renewal and can cancel in one click.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-[#285B55] font-semibold text-[15px]">
              <ShieldCheck className="w-5 h-5" />
              <span>Not Insurance-Billed Therapy</span>
            </div>
            <p className="text-[14px] text-[#52625E] leading-relaxed">
              InnerOS is a personal wellbeing and reflection companion, not a clinical medical service.
            </p>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
