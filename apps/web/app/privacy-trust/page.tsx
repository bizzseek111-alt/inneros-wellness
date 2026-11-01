"use client";

import React from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import {
  ShieldCheck,
  Lock,
  Bookmark,
  Eye,
  HeartHandshake,
  Phone,
  CheckCircle2,
  Trash2,
  Download,
  PauseCircle,
  ArrowRight,
  LifeBuoy,
} from "lucide-react";

export default function PrivacyAndTrustPage() {
  return (
    <MarketingShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-16 space-y-20">
        {/* Page Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E8F1EB] border border-[#CFE2D6] text-[#1F4742] text-[13.5px] font-medium">
            <ShieldCheck className="w-4 h-4 text-[#285B55]" />
            <span>Privacy, Transparency &amp; Safety</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#263330] tracking-tight">
            Trust is built through clear choices and honest boundaries.
          </h1>
          <p className="text-[18px] text-[#52625E] leading-relaxed">
            When you share personal thoughts with an AI companion, you should know exactly what is saved, how to edit or delete it, and where AI support ends and human care begins.
          </p>
        </div>

        {/* 1. Data Choices & Memory Controls */}
        <section className="grid lg:grid-cols-2 gap-8">
          {/* Card A: Data Choices */}
          <div className="p-8 sm:p-10 rounded-[32px] bg-white border border-[#E6E0D6] shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F1EB] border border-[#CFE2D6] flex items-center justify-center text-[#285B55]">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#263330]">
                1. Your Data Choices
              </h2>
              <p className="text-[15.5px] text-[#52625E] leading-relaxed">
                Every category of data processing is controlled by plain-language toggles that you can change at any time:
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-start space-x-2.5 text-[15px] text-[#263330]">
                  <CheckCircle2 className="w-5 h-5 text-[#285B55] shrink-0 mt-0.5" />
                  <span>
                    <strong>Temporary or Paused Chats:</strong> Pause memory recording whenever you want to talk without creating new memory suggestions.
                  </span>
                </li>
                <li className="flex items-start space-x-2.5 text-[15px] text-[#263330]">
                  <CheckCircle2 className="w-5 h-5 text-[#285B55] shrink-0 mt-0.5" />
                  <span>
                    <strong>Optional Wellbeing Notes:</strong> Remembering sleep habits or stress patterns requires separate, explicit opt-in permission.
                  </span>
                </li>
                <li className="flex items-start space-x-2.5 text-[15px] text-[#263330]">
                  <CheckCircle2 className="w-5 h-5 text-[#285B55] shrink-0 mt-0.5" />
                  <span>
                    <strong>No Advertising Profiling:</strong> Your reflections and memories are never sold to third-party data brokers or used for ad targeting.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-[#F3EFE8]">
              <Link
                href="/settings/privacy"
                className="inline-flex items-center space-x-1.5 text-[14.5px] font-semibold text-[#285B55] hover:underline"
              >
                <span>Open Privacy Controls in App</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card B: Memory Controls */}
          <div className="p-8 sm:p-10 rounded-[32px] bg-white border border-[#E6E0D6] shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F7E7E2] border border-[#EED2C9] flex items-center justify-center text-[#7A4434]">
                <Bookmark className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#263330]">
                2. Transparent Memory Controls
              </h2>
              <p className="text-[15.5px] text-[#52625E] leading-relaxed">
                In <strong>Things I Remember</strong>, we strictly separate tentative AI suggestions from your confirmed facts:
              </p>

              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] space-y-1">
                  <div className="flex items-center space-x-1.5 text-[14px] font-semibold text-[#263330]">
                    <PauseCircle className="w-4 h-4 text-[#285B55]" />
                    <span>Confirm or Dismiss</span>
                  </div>
                  <p className="text-[13px] text-[#52625E]">
                    Suggested notes wait for your approval before becoming saved memories.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] space-y-1">
                  <div className="flex items-center space-x-1.5 text-[14px] font-semibold text-[#263330]">
                    <Eye className="w-4 h-4 text-[#285B55]" />
                    <span>Clear Provenance</span>
                  </div>
                  <p className="text-[13px] text-[#52625E]">
                    See where each memory came from and edit the wording anytime.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] space-y-1">
                  <div className="flex items-center space-x-1.5 text-[14px] font-semibold text-[#263330]">
                    <Download className="w-4 h-4 text-[#285B55]" />
                    <span>Download Your Data</span>
                  </div>
                  <p className="text-[13px] text-[#52625E]">
                    Export a complete, readable JSON copy of your memories and notes.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] space-y-1">
                  <div className="flex items-center space-x-1.5 text-[14px] font-semibold text-[#263330]">
                    <Trash2 className="w-4 h-4 text-[#A4384B]" />
                    <span>Forget Anytime</span>
                  </div>
                  <p className="text-[13px] text-[#52625E]">
                    Delete individual memories or clear your entire history in one click.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F3EFE8]">
              <Link
                href="/memory"
                className="inline-flex items-center space-x-1.5 text-[14.5px] font-semibold text-[#285B55] hover:underline"
              >
                <span>Inspect Things I Remember</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 3. AI Transparency & Safety Boundaries */}
        <section className="p-8 sm:p-12 rounded-[36px] bg-[#EDE8F5] border border-[#DDD4EC] space-y-8">
          <div className="max-w-3xl space-y-3">
            <Badge variant="lavender" size="md">
              3. AI Transparency &amp; Safety Boundaries
            </Badge>
            <h2 className="text-3xl font-serif font-medium text-[#263330]">
              What InnerOS is—and what it will never claim to be
            </h2>
            <p className="text-[16px] text-[#52625E] leading-relaxed">
              We believe trustworthy AI starts with honesty about its capabilities and limitations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] space-y-2">
              <h3 className="text-[18px] font-serif font-medium text-[#263330]">
                Clear AI Identity
              </h3>
              <p className="text-[14.5px] text-[#52625E] leading-relaxed">
                InnerOS always identifies itself clearly as an AI wellbeing companion—never impersonating a human counselor or licensed clinician.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] space-y-2">
              <h3 className="text-[18px] font-serif font-medium text-[#263330]">
                Non-Clinical Scope
              </h3>
              <p className="text-[14.5px] text-[#52625E] leading-relaxed">
                InnerOS does not diagnose mental health conditions, prescribe treatments, or interpret clinical assessments.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] space-y-2">
              <h3 className="text-[18px] font-serif font-medium text-[#263330]">
                Healthy Autonomy
              </h3>
              <p className="text-[14.5px] text-[#52625E] leading-relaxed">
                Our reminders and conversations are checked against anti-guilt rules so the app never uses possessive language or manufactures emotional dependency.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Human Support Pathways */}
        <section className="p-8 sm:p-12 rounded-[36px] bg-[#F7E7E2] border border-[#EED2C9] space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center space-x-2 text-[#A4384B] text-[14px] font-semibold">
                <HeartHandshake className="w-5 h-5" />
                <span>4. Human Support Pathways</span>
              </div>
              <h2 className="text-3xl font-serif font-medium text-[#263330]">
                Immediate access to trained human support 24/7
              </h2>
              <p className="text-[16px] text-[#52625E] leading-relaxed">
                If you or someone you know is going through a crisis or severe distress, real human support is always available and easy to reach from every screen in InnerOS.
              </p>
            </div>
            <Link href="/safety">
              <Button
                variant="primary"
                size="md"
                leftIcon={<LifeBuoy className="w-4 h-4" />}
              >
                Open Full Support Directory
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] space-y-2">
              <span className="text-[13px] font-semibold uppercase tracking-wider text-[#285B55]">
                United States &amp; Canada
              </span>
              <h3 className="text-xl font-serif font-medium text-[#263330]">
                988 Suicide &amp; Crisis Lifeline
              </h3>
              <p className="text-[14px] text-[#52625E]">
                Call or text <strong>988</strong>, or text <strong>HOME</strong> to <strong>741741</strong> (24/7, free &amp; confidential).
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] space-y-2">
              <span className="text-[13px] font-semibold uppercase tracking-wider text-[#285B55]">
                United Kingdom
              </span>
              <h3 className="text-xl font-serif font-medium text-[#263330]">
                Samaritans &amp; NHS 111
              </h3>
              <p className="text-[14px] text-[#52625E]">
                Call <strong>116 123</strong> (Samaritans), call <strong>111</strong> (NHS Mental Health), or text <strong>SHOUT</strong> to <strong>85258</strong>.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] space-y-2">
              <span className="text-[13px] font-semibold uppercase tracking-wider text-[#285B55]">
                European Union &amp; Bulgaria
              </span>
              <h3 className="text-xl font-serif font-medium text-[#263330]">
                112 &amp; National Helplines
              </h3>
              <p className="text-[14px] text-[#52625E]">
                Call <strong>112</strong> across the EU or <strong>0800 88 001</strong> in Bulgaria for free crisis support.
              </p>
            </div>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
