"use client";

import React, { useState } from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";
import {
  LifeBuoy,
  Phone,
  MessageSquare,
  ShieldAlert,
  HeartHandshake,
  ExternalLink,
  Shield,
  Check,
  Edit3,
} from "lucide-react";
import { prototypeService } from "@/lib/prototype-service";

export default function SafetySupportPage() {
  const [safetyPlan, setSafetyPlan] = useState(prototypeService.getState().safetyPlan);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSavePlan = () => {
    const state = prototypeService.getState();
    state.safetyPlan = safetyPlan;
    prototypeService.saveState(state);
    setIsEditingPlan(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <SanctuaryShell>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-1 border-b border-white/[0.08] pb-4">
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-mono uppercase tracking-widest">
            <LifeBuoy className="w-4 h-4" />
            <span>Human-in-the-Loop Emergency Care</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-ivory-100 tracking-tight">
            Safety, Crisis Support & Human Care
          </h1>
          <p className="text-xs sm:text-sm text-ivory-400 font-light leading-relaxed">
            InnerOS is an emotional companion, not an emergency medical responder. If you or someone you know is in acute crisis, compassionate trained human support is available 24/7.
          </p>
        </div>

        {/* Immediate Emergency Action Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/60 via-midnight-900 to-midnight-950 border border-rose-800/60 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-rose-300 font-semibold text-sm">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Immediate Crisis Lifelines &bull; Free, Confidential, 24/7</span>
            </div>
            <Badge variant="emergency" size="sm">
              Emergency Escalation
            </Badge>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            {/* 988 US / Canada */}
            <div className="p-4 rounded-2xl bg-midnight-950 border border-white/[0.08] space-y-2 flex flex-col justify-between">
              <div>
                <span className="font-semibold text-ivory-100 text-sm block">
                  988 Suicide & Crisis Lifeline
                </span>
                <span className="text-[10px] font-mono text-zinc-400">United States & Canada</span>
                <p className="text-xs text-zinc-300 mt-1">Free 24/7 call and text support across North America.</p>
              </div>
              <div className="pt-2 flex gap-2">
                <a
                  href="tel:988"
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call 988</span>
                </a>
                <a
                  href="sms:988"
                  className="flex-1 py-2 rounded-xl bg-midnight-800 hover:bg-midnight-700 text-ivory-200 border border-white/[0.1] text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Text 988</span>
                </a>
              </div>
            </div>

            {/* Crisis Text Line */}
            <div className="p-4 rounded-2xl bg-midnight-950 border border-white/[0.08] space-y-2 flex flex-col justify-between">
              <div>
                <span className="font-semibold text-ivory-100 text-sm block">Crisis Text Line</span>
                <span className="text-[10px] font-mono text-zinc-400">Text HOME to 741741</span>
                <p className="text-xs text-zinc-300 mt-1">Connect with a trained crisis counselor 24/7.</p>
              </div>
              <div className="pt-2">
                <a
                  href="sms:741741?body=HOME"
                  className="w-full py-2 rounded-xl bg-midnight-800 hover:bg-midnight-700 text-ivory-200 border border-white/[0.1] text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Start Text Session</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* International Emergency Directory */}
        <div className="p-6 rounded-3xl bg-midnight-900/90 border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <span className="text-xs font-semibold text-ivory-100 uppercase tracking-wider font-mono">
              Verified International Resources
            </span>
            <span className="text-[10px] font-mono text-zinc-500">Global Coverage</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-midnight-950/80 border border-white/[0.06] space-y-1">
              <span className="font-semibold text-ivory-100 block">United Kingdom</span>
              <p className="text-zinc-400">NHS 111 / Emergency 999</p>
              <p className="text-teal-400 text-[11px]">Text SHOUT to 85258</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-midnight-950/80 border border-white/[0.06] space-y-1">
              <span className="font-semibold text-ivory-100 block">Australia</span>
              <p className="text-zinc-400">Lifeline: 13 11 14</p>
              <p className="text-teal-400 text-[11px]">Text: 0477 13 11 14</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-midnight-950/80 border border-white/[0.06] space-y-1">
              <span className="font-semibold text-ivory-100 block">Global (32 Countries)</span>
              <p className="text-zinc-400">Befrienders Worldwide</p>
              <a
                href="https://www.befrienders.org"
                target="_blank"
                rel="noreferrer"
                className="text-teal-400 text-[11px] hover:underline flex items-center space-x-1"
              >
                <span>Find Local Helpline</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Personal Grounding & Safety Plan */}
        <div className="p-6 rounded-3xl bg-midnight-900/90 border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div>
              <span className="text-xs font-semibold text-ivory-100 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-teal-400" />
                <span>Personal Grounding & Safety Plan</span>
              </span>
              <p className="text-[11px] text-zinc-400">Customized anchors created by you for difficult moments.</p>
            </div>
            <button
              onClick={() => setIsEditingPlan(!isEditingPlan)}
              className="text-xs text-teal-400 hover:text-teal-300 flex items-center space-x-1 font-medium"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingPlan ? "Cancel" : "Edit Plan"}</span>
            </button>
          </div>

          {isEditingPlan ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-ivory-300 font-medium">My Sensory Grounding Anchor:</label>
                <input
                  type="text"
                  value={safetyPlan.groundingAnchor}
                  onChange={(e) => setSafetyPlan({ ...safetyPlan, groundingAnchor: e.target.value })}
                  className="w-full text-xs bg-midnight-950 border border-white/[0.1] rounded-xl px-3 py-2 text-ivory-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-ivory-300 font-medium">My Trusted Safe Person / Contact:</label>
                <input
                  type="text"
                  value={safetyPlan.trustedContact}
                  onChange={(e) => setSafetyPlan({ ...safetyPlan, trustedContact: e.target.value })}
                  className="w-full text-xs bg-midnight-950 border border-white/[0.1] rounded-xl px-3 py-2 text-ivory-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-ivory-300 font-medium">My Boundary Affirmation:</label>
                <input
                  type="text"
                  value={safetyPlan.personalBoundaryStatement}
                  onChange={(e) => setSafetyPlan({ ...safetyPlan, personalBoundaryStatement: e.target.value })}
                  className="w-full text-xs bg-midnight-950 border border-white/[0.1] rounded-xl px-3 py-2 text-ivory-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button size="sm" variant="primary" onClick={handleSavePlan}>
                  Save Grounding Plan
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-midnight-950/80 border border-white/[0.04] space-y-1">
                <span className="text-[10px] font-mono text-teal-400 uppercase">Sensory Anchor</span>
                <p className="text-ivory-200">{safetyPlan.groundingAnchor}</p>
              </div>

              <div className="p-4 rounded-2xl bg-midnight-950/80 border border-white/[0.04] space-y-1">
                <span className="text-[10px] font-mono text-teal-400 uppercase">Trusted Ally</span>
                <p className="text-ivory-200">{safetyPlan.trustedContact}</p>
              </div>

              <div className="p-4 rounded-2xl bg-midnight-950/80 border border-white/[0.04] space-y-1">
                <span className="text-[10px] font-mono text-teal-400 uppercase">Boundary Shield</span>
                <p className="text-ivory-200">{safetyPlan.personalBoundaryStatement}</p>
              </div>
            </div>
          )}
        </div>

        {/* Non-Clinical Legal Boundary Notice */}
        <div className="p-4 rounded-2xl bg-midnight-950/60 border border-white/[0.04] text-[11px] text-zinc-500 leading-relaxed text-center">
          Regulatory Status: Complies with FDA 21 CFR Part 882 for Low Risk General Wellness Software. InnerOS does not provide clinical diagnosis, psychiatric therapy, or suicide intervention services.
        </div>
      </div>
    </SanctuaryShell>
  );
}
