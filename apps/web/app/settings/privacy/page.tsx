"use client";

import React, { useState } from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { Switch } from "@/components/primitives/Switch";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";
import { Lock, Download, Trash2, Key, ShieldCheck, AlertTriangle, FileText, Check } from "lucide-react";
import { prototypeService } from "@/lib/prototype-service";

export default function PrivacySettingsPage() {
  const [consent, setConsent] = useState(prototypeService.getState().consent);
  const [exportPreview, setExportPreview] = useState<string | null>(null);
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purged, setPurged] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleConsent = (key: keyof typeof consent) => {
    const updated = prototypeService.updateConsent({ [key]: !consent[key] });
    setConsent(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExportData = () => {
    const jsonStr = prototypeService.exportGdprArticle15Archive();
    setExportPreview(jsonStr);
  };

  const handlePurgeAccount = () => {
    prototypeService.purgeAllDataPermanently();
    setShowPurgeModal(false);
    setPurged(true);
    setTimeout(() => {
      setPurged(false);
      window.location.reload();
    }, 2000);
  };

  return (
    <SanctuaryShell>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-1 border-b border-white/[0.08] pb-4">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-mono uppercase tracking-widest">
            <Lock className="w-4 h-4" />
            <span>Sovereign Data Rights &bull; GDPR & CCPA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-ivory-100 tracking-tight">
            Privacy, Envelope Encryption & Data Controls
          </h1>
          <p className="text-xs sm:text-sm text-ivory-400 font-light leading-relaxed">
            InnerOS treats privacy as an architectural guarantee, not a legal afterthought. All entries are encrypted with per-user derived keys.
          </p>
        </div>

        {/* Cryptographic Architecture Card */}
        <div className="p-6 rounded-3xl bg-midnight-900/90 border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <span className="text-xs font-semibold text-ivory-100 flex items-center space-x-2">
              <Key className="w-4 h-4 text-teal-400" />
              <span>Two-Tier Envelope Encryption Architecture</span>
            </span>
            <Badge variant="teal" size="sm">
              AES-256-GCM Active
            </Badge>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-midnight-950/80 border border-white/[0.04] space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Master KMS Key</span>
              <p className="font-mono text-teal-300 text-[11px] truncate">0123456789abcdef...[HSM Secured]</p>
              <p className="text-[10px] text-zinc-400">Isolated server vault key</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-midnight-950/80 border border-white/[0.04] space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Key Derivation</span>
              <p className="font-mono text-indigo-300 text-[11px]">HKDF-SHA256 (User Salt)</p>
              <p className="text-[10px] text-zinc-400">Unique per-user Data Encryption Key</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-midnight-950/80 border border-white/[0.04] space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Vector Index Isolation</span>
              <p className="font-mono text-lavender-300 text-[11px]">PostgreSQL RLS Scoped</p>
              <p className="text-[10px] text-zinc-400">Cross-tenant queries physically barred</p>
            </div>
          </div>
        </div>

        {/* Active Consent Ledger */}
        <div className="p-6 rounded-3xl bg-midnight-900/90 border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <span className="text-xs font-semibold text-ivory-100 uppercase tracking-wider font-mono">
              Active Consent Ledger
            </span>
            <span className="text-[10px] font-mono text-zinc-500">Last Modified: {consent.updatedAt}</span>
          </div>

          <div className="space-y-4">
            <Switch
              label="Retain Active Session Working Memory"
              description="Companion references statements within the immediate conversation turn."
              checked={consent.storeConversations}
              onChange={() => toggleConsent("storeConversations")}
            />
            <div className="border-t border-white/[0.06] pt-3">
              <Switch
                label="Derive Long-Term Life Graph Nodes"
                description="Extracts recurring habits, values, and stress triggers into your private graph."
                checked={consent.deriveLongTermMemory}
                onChange={() => toggleConsent("deriveLongTermMemory")}
              />
            </div>
            <div className="border-t border-white/[0.06] pt-3">
              <Switch
                label="Voice Audio Streaming Processing"
                description="Transcribes live audio frames. Raw audio buffers are deleted immediately post-synthesis."
                checked={consent.voiceAudioProcessing}
                onChange={() => toggleConsent("voiceAudioProcessing")}
              />
            </div>
          </div>
        </div>

        {/* Data Portability (GDPR Article 15) & Deletion (Article 17) */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Article 15 Data Portability */}
          <div className="p-6 rounded-3xl bg-midnight-900/80 border border-white/[0.08] space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold">
                <Download className="w-4 h-4" />
                <span>GDPR Article 15: Right of Access</span>
              </div>
              <h4 className="text-sm font-semibold text-ivory-100">Export Complete Personal Archive</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Download a cryptographically verifiable JSON archive containing every stored reflection, life graph node, and consent log.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={handleExportData} leftIcon={<FileText className="w-3.5 h-3.5" />}>
              Generate Data Archive
            </Button>
          </div>

          {/* Article 17 Right to be Forgotten */}
          <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-900/40 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2 text-rose-400 text-xs font-semibold">
                <Trash2 className="w-4 h-4" />
                <span>GDPR Article 17: Right to be Forgotten</span>
              </div>
              <h4 className="text-sm font-semibold text-rose-100">Permanent Account & Data Purge</h4>
              <p className="text-xs text-rose-200/80 leading-relaxed">
                Irrevocably deletes all personal memories, vector embeddings, journal records, and credentials from the system.
              </p>
            </div>
            <Button size="sm" variant="emergency" onClick={() => setShowPurgeModal(true)}>
              Purge All Data Permanently
            </Button>
          </div>
        </div>

        {/* Export Data Modal Preview */}
        {exportPreview && (
          <div className="p-5 rounded-2xl bg-midnight-950 border border-teal-700/60 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-teal-300">GDPR Article 15 Archive Generated</span>
              <button onClick={() => setExportPreview(null)} className="text-zinc-500 hover:text-white">
                Close Preview
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-midnight-900 border border-white/[0.04] text-[10px] font-mono text-zinc-300 overflow-x-auto max-h-60 leading-snug">
              {exportPreview}
            </pre>
          </div>
        )}

        {/* Confirmation Modal for Permanent Purge */}
        {showPurgeModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-md w-full p-6 rounded-3xl bg-midnight-950 border border-rose-800 shadow-2xl space-y-4">
              <div className="flex items-center space-x-2.5 text-rose-400 font-semibold text-base">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>Confirm Irreversible Purge</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Are you sure you want to delete all personal reflections and life graph connections for <strong>Elena Vance</strong>? This action conforms to GDPR Article 17 and cannot be undone.
              </p>
              <div className="flex justify-end space-x-2 pt-2">
                <Button size="sm" variant="ghost" onClick={() => setShowPurgeModal(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="emergency" onClick={handlePurgeAccount}>
                  Confirm Permanent Deletion
                </Button>
              </div>
            </div>
          </div>
        )}

        {purged && (
          <div className="p-4 rounded-2xl bg-rose-950 border border-rose-700 text-center text-xs text-rose-200">
            All synthetic persona records have been purged. Resetting sanctuary environment...
          </div>
        )}
      </div>
    </SanctuaryShell>
  );
}
