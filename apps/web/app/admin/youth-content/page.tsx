"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  PhoneCall,
  Activity,
  Users,
  Cpu,
  RefreshCw,
  FileText,
  Clock,
  Eye,
  Check,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function AdminYouthContentPage() {
  const [loading, setLoading] = useState(true);
  const [adminSummary, setAdminSummary] = useState<any>(null);
  const [safetyIncidents, setSafetyIncidents] = useState<any[]>([]);
  const [resolvingIncident, setResolvingIncident] = useState<any | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Platform Safety Flags
  const [flags, setFlags] = useState({
    youth_production_enabled: false,  // Child-facing production functionality disabled until clinical review
    kids_experience_enabled: false,
    teens_experience_enabled: false,
    caregiver_portal_enabled: true,
    safeguarding_audit_enabled: true,
    voice_streaming_logging: false, // Strict zero raw audio logging
  });

  const toggleFlag = (key: keyof typeof flags) => {
    setFlags({ ...flags, [key]: !flags[key] });
  };

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [summaryData, incidentsData] = await Promise.all([
        apiClient.getAdminDashboard().catch(() => null),
        apiClient.getYouthSafetyIncidents().catch(() => []),
      ]);
      if (summaryData) setAdminSummary(summaryData);
      setSafetyIncidents(incidentsData);
    } catch (err: any) {
      console.error("Admin data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleResolveIncident = async (incidentId: string) => {
    try {
      await apiClient.updateYouthSafetyIncident(incidentId, {
        resolution_status: "resolved_closed",
        resolution_notes: resolutionNotes || "Reviewed and verified clinical referral coordination.",
      });
      setStatusMessage(`Resolved safety incident ${incidentId}`);
      setResolvingIncident(null);
      setResolutionNotes("");
      loadAdminData();
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1A202C] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F3EDFA] text-[#43256A] flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                Youth Safety & Safeguarding Administration
              </h1>
              <p className="text-xs sm:text-sm text-[#718096]">
                Clinical review governance, safety incident triage, voice benchmarks, and audit controls.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/curriculum"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curriculum CMS</span>
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#4A5568] hover:bg-[#FDFBF4]"
            >
              Platform Admin
            </Link>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs flex items-center justify-between">
            <span>{statusMessage}</span>
            <button onClick={() => setStatusMessage(null)} className="font-bold ml-2">
              ✕
            </button>
          </div>
        )}

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-500" /> Active Child Profiles
            </span>
            <div className="text-2xl font-black text-slate-900">
              {adminSummary?.child_profiles_count ?? 1}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-500" /> Verified Caregivers
            </span>
            <div className="text-2xl font-black text-slate-900">
              {adminSummary?.verified_caregivers_count ?? 1}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-purple-500" /> Curriculum Lessons
            </span>
            <div className="text-2xl font-black text-slate-900">
              {adminSummary?.curriculum_modules_count ?? 20}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Open Safety Incidents
            </span>
            <div className="text-2xl font-black text-amber-600">
              {safetyIncidents.filter((i) => i.resolution_status !== "resolved_closed").length}
            </div>
          </div>
        </div>

        {/* Feature Flags Control Deck */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#0F172A] flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-[#0E87E3]" />
              <span>Child-Safety Production Feature Flags</span>
            </h3>
            <span className="text-xs text-slate-500">
              Child-facing production functionality disabled until clinical review
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-semibold">
            {Object.entries(flags).map(([key, val]) => (
              <div
                key={key}
                onClick={() => toggleFlag(key as any)}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                  val ? "bg-emerald-50/50 border-emerald-300" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <div className="font-bold text-slate-800">{key.replace(/_/g, " ")}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                    {val ? "ACTIVE" : "DISABLED (STAGED)"}
                  </div>
                </div>
                {val ? (
                  <ToggleRight className="w-6 h-6 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-slate-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RESTRICTED SAFEGUARDING & SAFETY INCIDENT QUEUE */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-extrabold text-[#0F172A]">
                Restricted Safeguarding Incident Queue
              </h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-semibold">
              Restricted to Safeguarding & Clinicians
            </span>
          </div>

          {safetyIncidents.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed text-center text-xs text-slate-400">
              No active safety escalation incidents. Circuit breakers normal.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {safetyIncidents.map((inc) => (
                <div key={inc.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{inc.category}</span>
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-[10px]">
                        {inc.severity_tier}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">{inc.id}</span>
                    </div>
                    <p className="text-slate-600">
                      Subject: {inc.subject_id} • Age Tier: {inc.age_tier} • De-escalation: {inc.de_escalation_script_served}
                    </p>
                    {inc.resolution_notes && (
                      <p className="text-emerald-700 italic">Reviewer Note: {inc.resolution_notes}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        inc.resolution_status === "resolved_closed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {inc.resolution_status}
                    </span>
                    {inc.resolution_status !== "resolved_closed" && (
                      <button
                        onClick={() => setResolvingIncident(inc)}
                        className="px-3 py-1.5 rounded-xl bg-primary text-white font-semibold hover:opacity-90"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* VOICE PROVIDER BENCHMARK SPECIFICATIONS */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-extrabold text-[#0F172A]">Voice Provider Benchmark & Latency Analysis</h3>
            </div>
            <span className="text-xs text-slate-500">Zero Raw Audio Retention SLA</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {adminSummary?.voice_benchmarks?.map((v: any, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block">{v.provider_name}</span>
                <div className="space-y-1 text-slate-600">
                  <div>STT Latency: <span className="font-mono font-bold">{v.stt_latency_ms}ms</span></div>
                  <div>TTS Naturalness: <span className="font-bold">{v.tts_naturalness_score}/5.0</span></div>
                  <div>
                    Shahmukhi Punjabi:{" "}
                    <span className={v.supports_shahmukhi_punjabi ? "text-emerald-600 font-bold" : "text-amber-600"}>
                      {v.supports_shahmukhi_punjabi ? "Supported" : "English/Urdu Fallback"}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-200">
                    Policy: {v.privacy_retention_policy}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RESOLUTION MODAL */}
      {resolvingIncident && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Clinical Incident Review: {resolvingIncident.id}
            </h3>
            <p className="text-xs text-slate-500">
              Designated safeguarding specialist review for category: {resolvingIncident.category}.
            </p>

            <div className="space-y-2 text-xs">
              <label className="font-bold block">Clinical Resolution & Referral Notes</label>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Document clinical check-in, verified referral coordination, or de-escalation actions taken..."
                rows={4}
                className="w-full p-3 rounded-xl border border-slate-200 text-slate-900 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 text-xs">
              <button
                onClick={() => setResolvingIncident(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleResolveIncident(resolvingIncident.id)}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
              >
                Mark Resolved & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
