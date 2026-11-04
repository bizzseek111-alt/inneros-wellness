"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";
import {
  LifeBuoy,
  Phone,
  MessageSquare,
  HeartHandshake,
  ExternalLink,
  Shield,
  Edit3,
  Check,
} from "lucide-react";
import { prototypeService } from "@/lib/prototype-service";

export default function SafetySupportPage() {
  const [safetyPlan, setSafetyPlan] = useState(
    prototypeService.getState().safetyPlan
  );
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSavePlan = () => {
    const state = prototypeService.getState();
    state.safetyPlan = safetyPlan;
    prototypeService.saveState(state);
    setIsEditingPlan(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <SanctuaryShell>
      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        {/* Weebly Child & Family Safeguarding Portal Banner */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center space-x-2 text-amber-900 font-bold">
            <Shield className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Looking for Weebly Child Safeguarding, Regional Youth Helplines, or School Protocols?</span>
          </div>
          <Link
            href="/child-safety"
            className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors flex items-center space-x-1 shrink-0"
          >
            <span>Visit Child Safeguarding Hub</span>
          </Link>
        </div>

        {/* Warm, Reassuring Header */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-[#285B55] text-[14px] font-medium">
            <LifeBuoy className="w-4 h-4" />
            <span>Help & Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#263330]">
            You Don’t Have to Carry Heavy Moments Alone
          </h1>
          <p className="text-[15px] text-[#52625E] leading-relaxed">
            InnerOS is an AI companion for everyday reflection—not a medical or crisis service. Whenever you need a real human voice, free and confidential support is available 24/7.
          </p>
        </div>

        {/* Immediate Human Support Cards */}
        <div className="p-6 rounded-3xl bg-[#F7E7E2] border border-[#EED2C9] shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5 text-[#263330]">
              <HeartHandshake className="w-5 h-5 text-[#A4384B]" />
              <h2 className="text-[18px] font-serif font-medium">
                24/7 Free & Confidential Crisis Support
              </h2>
            </div>
            <Badge variant="peach" size="sm">
              Real Human Support
            </Badge>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* 988 US / Canada */}
            <div className="p-5 rounded-2xl bg-white border border-[#E6E0D6] space-y-3 flex flex-col justify-between shadow-sm">
              <div>
                <span className="font-serif font-medium text-[#263330] text-[17px] block">
                  988 Suicide & Crisis Lifeline
                </span>
                <span className="text-[13px] font-medium text-[#52625E]">
                  United States & Canada
                </span>
                <p className="text-[14px] text-[#52625E] mt-1.5 leading-relaxed">
                  Free, confidential 24/7 call and text support with trained counselors.
                </p>
              </div>
              <div className="pt-2 flex gap-2.5">
                <a
                  href="tel:988"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#A4384B] hover:bg-[#8E2F40] text-white text-[14px] font-medium flex items-center justify-center space-x-2 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call 988</span>
                </a>
                <a
                  href="sms:988"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#FAF8F4] hover:bg-[#F3EFE8] text-[#263330] border border-[#D5CFC2] text-[14px] font-medium flex items-center justify-center space-x-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Text 988</span>
                </a>
              </div>
            </div>

            {/* Crisis Text Line */}
            <div className="p-5 rounded-2xl bg-white border border-[#E6E0D6] space-y-3 flex flex-col justify-between shadow-sm">
              <div>
                <span className="font-serif font-medium text-[#263330] text-[17px] block">
                  Crisis Text Line
                </span>
                <span className="text-[13px] font-medium text-[#52625E]">
                  US, UK & Canada
                </span>
                <p className="text-[14px] text-[#52625E] mt-1.5 leading-relaxed">
                  Prefer texting? Text <strong>HOME</strong> to <strong>741741</strong> (US/Canada) or <strong>SHOUT</strong> to <strong>85258</strong> (UK).
                </p>
              </div>
              <div className="pt-2">
                <a
                  href="sms:741741?body=HOME"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#285B55] hover:bg-[#1F4742] text-white text-[14px] font-medium flex items-center justify-center space-x-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Text HOME to 741741</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Regional & International Directory */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F3EFE8] pb-3">
            <h2 className="text-[17px] font-serif font-medium text-[#263330]">
              International & Regional Helplines
            </h2>
            <span className="text-[13px] text-[#52625E]">Available 24/7</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] space-y-1.5">
              <span className="font-semibold text-[#263330] text-[15px] block">
                United Kingdom
              </span>
              <p className="text-[14px] text-[#52625E]">
                Samaritans: <strong>116 123</strong>
              </p>
              <p className="text-[13.5px] text-[#285B55]">
                NHS Mental Health: <strong>111</strong> (Emergency: <strong>999</strong>)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] space-y-1.5">
              <span className="font-semibold text-[#263330] text-[15px] block">
                European Union & Bulgaria
              </span>
              <p className="text-[14px] text-[#52625E]">
                EU Emergency: <strong>112</strong>
              </p>
              <p className="text-[13.5px] text-[#285B55]">
                BG Crisis Line: <strong>0800 88 001</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] space-y-1.5">
              <span className="font-semibold text-[#263330] text-[15px] block">
                Worldwide Directory
              </span>
              <p className="text-[14px] text-[#52625E]">
                Find verified support in your country
              </p>
              <a
                href="https://findahelpline.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[#285B55] text-[14px] font-medium hover:underline inline-flex items-center space-x-1 pt-0.5"
              >
                <span>Visit FindAHelpline.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Personal Grounding & Comfort Plan */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F3EFE8] pb-3">
            <div>
              <h2 className="text-[17px] font-serif font-medium text-[#263330] flex items-center space-x-2">
                <Shield className="w-5 h-5 text-[#285B55]" />
                <span>My Personal Comfort & Grounding Plan</span>
              </h2>
              <p className="text-[14px] text-[#52625E] mt-0.5">
                Keep your own reminders of what helps you feel steady and who you can reach out to.
              </p>
            </div>
            <Button
              size="xs"
              variant="outline"
              onClick={() => setIsEditingPlan(!isEditingPlan)}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            >
              {isEditingPlan ? "Cancel" : "Edit My Plan"}
            </Button>
          </div>

          {saved && (
            <div className="p-3 rounded-2xl bg-[#E8F1EB] border border-[#CFE2D6] text-[14px] text-[#285B55] flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Your personal comfort plan has been updated.</span>
            </div>
          )}

          {isEditingPlan ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[14px] text-[#263330] font-medium block">
                  What helps me feel grounded in the moment:
                </label>
                <input
                  type="text"
                  value={safetyPlan.groundingAnchor}
                  onChange={(e) =>
                    setSafetyPlan({
                      ...safetyPlan,
                      groundingAnchor: e.target.value,
                    })
                  }
                  className="w-full text-[15px] bg-[#FAF8F4] border border-[#D5CFC2] rounded-xl px-4 py-2.5 text-[#263330] focus:outline-none focus:border-[#285B55]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] text-[#263330] font-medium block">
                  Someone I trust and can reach out to:
                </label>
                <input
                  type="text"
                  value={safetyPlan.trustedContact}
                  onChange={(e) =>
                    setSafetyPlan({
                      ...safetyPlan,
                      trustedContact: e.target.value,
                    })
                  }
                  className="w-full text-[15px] bg-[#FAF8F4] border border-[#D5CFC2] rounded-xl px-4 py-2.5 text-[#263330] focus:outline-none focus:border-[#285B55]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] text-[#263330] font-medium block">
                  A gentle reminder to myself:
                </label>
                <input
                  type="text"
                  value={safetyPlan.personalBoundaryStatement}
                  onChange={(e) =>
                    setSafetyPlan({
                      ...safetyPlan,
                      personalBoundaryStatement: e.target.value,
                    })
                  }
                  className="w-full text-[15px] bg-[#FAF8F4] border border-[#D5CFC2] rounded-xl px-4 py-2.5 text-[#263330] focus:outline-none focus:border-[#285B55]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button size="sm" variant="primary" onClick={handleSavePlan}>
                  Save My Plan
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] space-y-1.5">
                <span className="text-[13px] font-medium text-[#285B55] block">
                  What Grounds Me
                </span>
                <p className="text-[15px] text-[#263330] leading-relaxed">
                  {safetyPlan.groundingAnchor}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] space-y-1.5">
                <span className="text-[13px] font-medium text-[#285B55] block">
                  Trusted Person
                </span>
                <p className="text-[15px] text-[#263330] leading-relaxed">
                  {safetyPlan.trustedContact}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] space-y-1.5">
                <span className="text-[13px] font-medium text-[#285B55] block">
                  Gentle Reminder
                </span>
                <p className="text-[15px] text-[#263330] leading-relaxed">
                  {safetyPlan.personalBoundaryStatement}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Honest Non-Clinical Notice */}
        <div className="p-4 rounded-2xl bg-[#F3EFE8] border border-[#E6E0D6] text-[13.5px] text-[#52625E] leading-relaxed text-center">
          InnerOS is a personal wellbeing and reflection companion. It does not provide medical advice, clinical diagnosis, psychotherapy, or emergency crisis intervention.
        </div>
      </div>
    </SanctuaryShell>
  );
}
