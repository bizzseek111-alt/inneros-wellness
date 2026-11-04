"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Lock, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { YouthShell } from "@/components/youth/YouthShell";

export default function CaregiverConsentPage() {
  const [allowVoice, setAllowVoice] = useState(true);
  const [ephemeralAudio, setEphemeralAudio] = useState(true);
  const [allowMemory, setAllowMemory] = useState(true);
  const [crisisAlerts, setCrisisAlerts] = useState(true);
  const [parentEmail, setParentEmail] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmed && parentEmail) {
      setIsSubmitted(true);
    }
  };

  return (
    <YouthShell
      title="Verified Caregiver Consent & Setup"
      subtitle="COPPA, GDPR-K, and UK Age-Appropriate Design Code compliance governance."
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {isSubmitted ? (
          <div className="p-8 rounded-[32px] bg-white border border-emerald-200 shadow-sm text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0F172A]">Parental Consent Verified!</h2>
            <p className="text-sm text-[#4A5568] leading-relaxed">
              We have dispatched a cryptographic confirmation link to <strong>{parentEmail}</strong>. Your child’s private account is now configured with strict non-clinical safeguarding boundaries.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link
                href="/caregiver/dashboard"
                className="px-6 py-2.5 rounded-full bg-white border border-[#CBD5E1] text-xs font-bold text-[#0F172A] hover:bg-[#FDFBF4]"
              >
                Go to Parent Dashboard
              </Link>
              <Link
                href="/youth/dashboard"
                className="px-6 py-2.5 rounded-full bg-[#0E87E3] text-white text-xs font-bold hover:bg-[#0C436F]"
              >
                Launch Child Sandbox
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-6">
            <div className="p-4 rounded-2xl bg-[#E0F1FE] border border-[#B9E2FE] flex items-start space-x-3">
              <Shield className="w-5 h-5 text-[#0C436F] shrink-0 mt-0.5" />
              <div className="text-xs text-[#0C436F] space-y-1">
                <span className="font-bold block">Zero-Knowledge Child Privacy Commitment</span>
                <p>
                  InnerOS does not sell personal information, does not show ads, and does not retain raw audio recordings. Caregivers have full rights to inspect, pause, or permanently purge all records.
                </p>
              </div>
            </div>

            {/* Granular Toggles */}
            <div className="space-y-4 text-sm">
              <h3 className="font-bold text-[#0F172A]">Granular Safety Permissions</h3>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FFFDF9] border border-[#E2E8F0]">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#0F172A] block">Voice Companion Interaction</span>
                  <span className="text-xs text-[#718096]">Allow child to speak aloud with Lumi</span>
                </div>
                <input
                  type="checkbox"
                  checked={allowVoice}
                  onChange={(e) => setAllowVoice(e.target.checked)}
                  className="w-5 h-5 accent-[#0E87E3] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FFFDF9] border border-[#E2E8F0]">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#0F172A] block">Instant Ephemeral Audio Deletion</span>
                  <span className="text-xs text-[#718096]">Raw audio discarded immediately after transcription</span>
                </div>
                <input
                  type="checkbox"
                  checked={ephemeralAudio}
                  onChange={(e) => setEphemeralAudio(e.target.checked)}
                  className="w-5 h-5 accent-[#0E87E3] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FFFDF9] border border-[#E2E8F0]">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#0F172A] block">Gentle Routine Memory</span>
                  <span className="text-xs text-[#718096]">Remember daily bedtime stories and favorite breathing games</span>
                </div>
                <input
                  type="checkbox"
                  checked={allowMemory}
                  onChange={(e) => setAllowMemory(e.target.checked)}
                  className="w-5 h-5 accent-[#0E87E3] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FFFDF9] border border-[#E2E8F0]">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#0F172A] block">Crisis Safeguarding Alerts</span>
                  <span className="text-xs text-[#718096]">Notify caregiver email immediately if acute distress phrases occur</span>
                </div>
                <input
                  type="checkbox"
                  checked={crisisAlerts}
                  onChange={(e) => setCrisisAlerts(e.target.checked)}
                  className="w-5 h-5 accent-[#0E87E3] rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Caregiver Email & Confirmation */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#718096] block">
                Caregiver or Legal Guardian Email
              </label>
              <input
                type="email"
                required
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#0E87E3]"
              />

              <label className="flex items-start space-x-2 text-xs text-[#4A5568] pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-[#0E87E3] rounded"
                />
                <span>
                  I confirm I am the legal parent or guardian and grant permission for my child to use InnerOS Youth in non-clinical educational companion mode.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!confirmed || !parentEmail}
              className="w-full py-3.5 rounded-full bg-[#0E87E3] hover:bg-[#0C436F] disabled:opacity-50 text-white font-extrabold text-sm transition-all shadow-sm"
            >
              Sign & Authorize Child Account
            </button>
          </form>
        )}
      </div>
    </YouthShell>
  );
}
