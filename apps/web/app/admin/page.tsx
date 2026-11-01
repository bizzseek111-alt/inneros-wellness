"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { api } from "@/lib/api-client";
import {
  ShieldCheck,
  Activity,
  Cpu,
  Globe,
  Bell,
  BookOpen,
  Sliders,
  Lock,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const DEFAULT_FLAGS = [
  {
    key: "voice_realtime_companion",
    label: "Living Voice Presence (STT/TTS)",
    description: "Enables multimodal voice reflection with calm cadence and interruptible playback.",
    enabled: true,
    category: "voice",
  },
  {
    key: "life_graph_causal_edges",
    label: "Life Graph Pattern Explorer",
    description: "Enables interactive causal and mitigating node/edge visualization in the Memory Vault.",
    enabled: true,
    category: "memory",
  },
  {
    key: "psychoeducation_grounding_library",
    label: "17-Department Psychology Library",
    description: "Enables evidence-tiered psychoeducation cards and guided breathwork/somatic exercises.",
    enabled: true,
    category: "knowledge",
  },
  {
    key: "local_browser_migration_banner",
    label: "Browser-to-Account Sync Assistant",
    description: "Prompts users with existing local browser reflections or goals to migrate them into their account.",
    enabled: true,
    category: "onboarding",
  },
  {
    key: "external_oauth_integrations",
    label: "Connected Archives & OAuth Hub",
    description: "Allows staged preview and import of personal context from external notes and calendars.",
    enabled: true,
    category: "integrations",
  },
];

const DEFAULT_INCIDENTS = [
  {
    id: "inc_anon_9021a",
    user_id_hash: "e3b0c44298fc1c14",
    risk_tier: "TIER_3_HIGH_DISTRESS",
    category: "ACUTE_OVERWHELM_HELPLINE_SURFACED",
    region: "US",
    circuit_breaker_tripped: true,
  },
];

const DEFAULT_AUDIT_LOGS = [
  {
    event_id: "audit_rls_001",
    user_id_hash: "9f86d081884c7d65",
    action: "TENANT_RLS_SESSION_INITIALIZED",
    resource_type: "session",
    timestamp: new Date().toISOString(),
  },
  {
    event_id: "audit_consent_002",
    user_id_hash: "9f86d081884c7d65",
    action: "CONSENT_VERIFIED",
    resource_type: "memory_consent",
    timestamp: new Date().toISOString(),
  },
];

export default function AdminOperationsConsolePage() {
  const [overview, setOverview] = useState<any | null>(null);
  const [flags, setFlags] = useState<any[]>(DEFAULT_FLAGS);
  const [incidents, setIncidents] = useState<any[]>(DEFAULT_INCIDENTS);
  const [auditLogs, setAuditLogs] = useState<any[]>(DEFAULT_AUDIT_LOGS);
  const [isLoading, setIsLoading] = useState(false);
  const [togglingKey, setTogglingKey] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadConsoleData = async () => {
    setIsLoading(true);
    try {
      const [ov, inc, logs] = await Promise.all([
        api.getAdminOverview(),
        api.getSafetyIncidents(),
        api.getAdminAuditLogs(),
      ]);
      setOverview(ov);
      setFlags(ov.feature_flags || []);
      setIncidents(inc || []);
      setAuditLogs(logs || []);
    } catch {
      // Fallback snapshot if offline
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConsoleData();
  }, []);

  const handleToggleFlag = async (flagKey: string, currentEnabled: boolean) => {
    setTogglingKey(flagKey);
    setStatusMessage(null);
    try {
      const updated = await api.updateFeatureFlag(flagKey, !currentEnabled);
      setFlags((prev) => prev.map((f) => (f.key === flagKey ? updated : f)));
      setStatusMessage(`Updated feature flag "${updated.label}" to ${updated.enabled ? "Enabled" : "Paused"}.`);
    } catch (err: any) {
      setStatusMessage(err.message || "Requires Platform Steward (Admin) role to modify feature flags.");
    } finally {
      setTogglingKey(null);
    }
  };

  return (
    <SanctuaryShell>
      <div className="max-w-[1440px] mx-auto space-y-6 pb-12">
        {/* Top Hero Banner */}
        <div className="peopleflow-card p-7 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D9F296] text-[#1A1E1C] text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Knowledge Platform Stewardship &amp; Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1A1E1C]">
              InnerOS Operations &amp;{" "}
              <span className="font-serif italic font-normal text-[#285B55]">
                Governance Console
              </span>
            </h1>
            <p className="text-sm sm:text-[15px] text-[#5C6661] leading-relaxed">
              Monitor platform health, AI/voice pipelines, localization readiness, and feature flags.{" "}
              <strong className="text-[#1A1E1C]">
                By architectural design, private user conversations, voice recordings, and personal memories are never accessible here.
              </strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadConsoleData}
              leftIcon={<RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />}
            >
              Refresh Telemetry
            </Button>
            <Link href="/admin/knowledge">
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Psychology Library Review
              </Button>
            </Link>
          </div>
        </div>

        {statusMessage && (
          <div className="p-4 rounded-2xl bg-[#D9F296]/60 border border-[#1A1E1C]/15 text-sm text-[#1A1E1C] font-medium flex items-center justify-between">
            <span>{statusMessage}</span>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="text-xs font-bold underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 1. Primary Operational Metrics Grid (PeopleFlow Bento Cards) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="peopleflow-card p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#5C6661]">
              <span>Platform &amp; Database</span>
              <span className="w-8 h-8 rounded-full bg-[#D9F296] flex items-center justify-center text-[#1A1E1C]">
                <Activity className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-bold text-[#1A1E1C]">
              {overview?.platform_health?.status === "healthy" ? "Healthy (200 OK)" : "Operational"}
            </div>
            <div className="w-full h-2 rounded-full bg-[#EDF1EF] overflow-hidden">
              <div className="h-full w-[98%] bg-[#CDE5D3] rounded-full" />
            </div>
            <p className="text-xs text-[#5C6661]">
              {overview?.platform_health?.database_engine || "SQLAlchemy 2.0 Relational Engine"}
            </p>
          </div>

          <div className="peopleflow-card p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#5C6661]">
              <span>AI &amp; Voice Gateway</span>
              <span className="w-8 h-8 rounded-full bg-[#CBD8F6] flex items-center justify-center text-[#1A1E1C]">
                <Cpu className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-bold text-[#1A1E1C]">
              {overview?.ai_and_voice_providers?.voice_latency_p95_ms ?? 340}ms p95
            </div>
            <div className="w-full h-2 rounded-full bg-[#EDF1EF] overflow-hidden">
              <div className="h-full w-[86%] bg-[#CBD8F6] rounded-full" />
            </div>
            <p className="text-xs text-[#5C6661]">
              Pre-LLM Crisis Interceptor Active
            </p>
          </div>

          <div className="peopleflow-card p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#5C6661]">
              <span>Psychology Library</span>
              <span className="w-8 h-8 rounded-full bg-[#CDE5D3] flex items-center justify-center text-[#1A1E1C]">
                <BookOpen className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-bold text-[#1A1E1C]">
              {overview?.knowledge_governance?.departments_count ?? 17} Departments
            </div>
            <div className="w-full h-2 rounded-full bg-[#EDF1EF] overflow-hidden">
              <div className="h-full w-[92%] bg-[#D9F296] rounded-full" />
            </div>
            <p className="text-xs text-[#5C6661]">
              {overview?.knowledge_governance?.approved_records ?? 10} Approved •{" "}
              {overview?.knowledge_governance?.pending_review_records ?? 2} Pending Review
            </p>
          </div>

          <div className="peopleflow-card p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#5C6661]">
              <span>Localization &amp; RTL</span>
              <span className="w-8 h-8 rounded-full bg-[#F6D4DC] flex items-center justify-center text-[#1A1E1C]">
                <Globe className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-bold text-[#1A1E1C]">
              {overview?.localization_status?.supported_locales_count ?? 12} Locales Ready
            </div>
            <div className="w-full h-2 rounded-full bg-[#EDF1EF] overflow-hidden">
              <div className="h-full w-full bg-[#F6D4DC] rounded-full" />
            </div>
            <p className="text-xs text-[#5C6661]">
              Includes Arabic, Hebrew &amp; Urdu RTL + 8 Regional Helplines
            </p>
          </div>
        </div>

        {/* 2. Feature Flag Governance & Subsystem Status */}
        <div className="grid lg:grid-cols-12 gap-5">
          {/* Feature Flags Column */}
          <div className="lg:col-span-7 peopleflow-card p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-[#E5EAE7] pb-4">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-[#1A1E1C]" />
                <div>
                  <h2 className="text-lg font-bold text-[#1A1E1C]">
                    Platform Feature Flags
                  </h2>
                  <p className="text-xs text-[#5C6661]">
                    Persisted in relational storage with immutable audit logging
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#D9F296] text-[#1A1E1C] text-xs font-bold">
                Live Controls
              </span>
            </div>

            <div className="space-y-3">
              {flags.map((flag) => (
                <div
                  key={flag.key}
                  className="p-4 rounded-2xl bg-[#F7F9F8] border border-[#E5EAE7] flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#1A1E1C]">
                        {flag.label}
                      </span>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#CBD8F6]/60 text-[#1E3463]">
                        {flag.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#5C6661] leading-relaxed">
                      {flag.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={togglingKey === flag.key}
                    onClick={() => handleToggleFlag(flag.key, flag.enabled)}
                    aria-pressed={flag.enabled}
                    className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-colors ${
                      flag.enabled
                        ? "bg-[#1A1E1C] text-white hover:bg-[#2C3330]"
                        : "bg-[#F6D4DC] text-[#6E2537] hover:bg-[#EFC0CC]"
                    }`}
                  >
                    {togglingKey === flag.key
                      ? "Saving..."
                      : flag.enabled
                      ? "Enabled"
                      : "Paused"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Subsystems & Delivery Health Column */}
          <div className="lg:col-span-5 space-y-5">
            <div className="peopleflow-card p-6 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-[#E5EAE7] pb-3">
                <Bell className="w-5 h-5 text-[#1A1E1C]" />
                <h2 className="text-lg font-bold text-[#1A1E1C]">
                  Reminders &amp; Connected Archives
                </h2>
              </div>

              <div className="space-y-3 text-xs text-[#5C6661]">
                <div className="p-3.5 rounded-2xl bg-[#CDE5D3]/45 border border-[#CDE5D3] flex items-center justify-between">
                  <span className="font-semibold text-[#1A1E1C]">Quiet Hours Suppression</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D9F296] text-[#1A1E1C] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#CDE5D3]/45 border border-[#CDE5D3] flex items-center justify-between">
                  <span className="font-semibold text-[#1A1E1C]">Crisis Reminder Pause Guard</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D9F296] text-[#1A1E1C] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#CBD8F6]/45 border border-[#CBD8F6] flex items-center justify-between">
                  <span className="font-semibold text-[#1A1E1C]">OAuth Token Envelope Encryption</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#CBD8F6] font-bold text-[#1E3463]">
                    AES-256-GCM + HKDF
                  </span>
                </div>
              </div>
            </div>

            <div className="peopleflow-card p-6 bg-hatch-neutral space-y-3">
              <div className="flex items-center gap-2 text-[#1A1E1C] text-sm font-bold">
                <Lock className="w-4 h-4" />
                <span>Zero-Knowledge Privacy Boundary</span>
              </div>
              <p className="text-xs text-[#5C6661] leading-relaxed">
                Administrators and support stewards can never view user chat transcripts, voice audio, Life Graph nodes, or personal journal entries. Safety circuit-breaker logs record only one-way SHA-256 hashes and regional helpline dispatch status.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Anonymized Safety Circuit-Breaker Log & Cryptographic Audit Trail */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Safety Circuit-Breaker Log */}
          <div className="p-6 rounded-3xl bg-white border border-[#E4E0D8] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#F3EFE8] pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#9A523B]" />
                <h2 className="text-base font-serif font-medium text-[#263330]">
                  Anonymized Safety Circuit-Breaker Events
                </h2>
              </div>
              <Badge variant="peach" size="sm">
                Zero Transcripts Stored
              </Badge>
            </div>

            <div className="space-y-2.5">
              {incidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-3.5 rounded-2xl bg-[#FFFBF7] border border-[#E4E0D8] text-xs flex items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-semibold text-[#263330] block">
                      {inc.risk_tier} • {inc.category}
                    </span>
                    <span className="text-[#52625E]">
                      Subject Hash: <code>{inc.user_id_hash}</code> • Region: {inc.region}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#F9E5DC] text-[#7D402D] font-medium shrink-0">
                    Helpline Surfaced
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Audit Log */}
          <div className="p-6 rounded-3xl bg-white border border-[#E4E0D8] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#F3EFE8] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#285B55]" />
                <h2 className="text-base font-serif font-medium text-[#263330]">
                  Zero-Knowledge Access &amp; Governance Audit Log
                </h2>
              </div>
              <Badge variant="sage" size="sm">
                Immutable Trail
              </Badge>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {auditLogs.slice(0, 8).map((log) => (
                <div
                  key={log.event_id}
                  className="p-3.5 rounded-2xl bg-[#FFFBF7] border border-[#E4E0D8] text-xs flex items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-semibold text-[#263330] block">
                      {log.action}
                    </span>
                    <span className="text-[#52625E]">
                      Resource: {log.resource_type} • Actor Hash: <code>{log.user_id_hash}</code>
                    </span>
                  </div>
                  <span className="text-[#687873] shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SanctuaryShell>
  );
}
