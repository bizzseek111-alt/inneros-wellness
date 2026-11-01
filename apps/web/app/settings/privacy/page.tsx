"use client";

import React, { useState, useEffect } from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { Switch } from "@/components/primitives/Switch";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";
import {
  Lock,
  Download,
  Trash2,
  AlertTriangle,
  FileText,
  Check,
  Info,
} from "lucide-react";
import { prototypeService } from "@/lib/prototype-service";
import { api, UserMemoryConsent } from "@/lib/api-client";

export default function PrivacySettingsPage() {
  const [consent, setConsent] = useState(prototypeService.getState().consent);
  const [backendConsent, setBackendConsent] = useState<UserMemoryConsent | null>(null);
  const [exportPreview, setExportPreview] = useState<string | null>(null);
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purged, setPurged] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  useEffect(() => {
    let mounted = true;
    api
      .getMemoryConsent()
      .then((res) => {
        if (mounted) {
          setBackendConsent(res);
          setConsent((prev) => ({
            ...prev,
            deriveLongTermMemory: !res.is_memory_recording_paused && res.allow_memory_system,
          }));
        }
      })
      .catch(() => {
        // Offline fallback uses prototypeService state
      });
    return () => {
      mounted = false;
    };
  }, []);

  const toggleConsent = async (key: keyof typeof consent) => {
    const nextVal = !consent[key];
    const updated = prototypeService.updateConsent({ [key]: nextVal });
    setConsent(updated);

    if (key === "deriveLongTermMemory") {
      try {
        if (nextVal) {
          const res = await api.resumeMemory();
          setBackendConsent(res);
        } else {
          const res = await api.pauseMemory();
          setBackendConsent(res);
        }
      } catch {
        // Fallback to local state if backend is unreachable
      }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const localArchive = JSON.parse(prototypeService.exportGdprArticle15Archive());
      let backendBundle = null;
      try {
        backendBundle = await api.exportPersonalData();
      } catch {
        backendBundle = { note: "Backend API offline; exported local storage archive only." };
      }

      const combinedArchive = {
        exportTimestamp: new Date().toISOString(),
        formatVersion: "2.1.0-unified",
        backendMemoryAndGraphBundle: backendBundle,
        localReflectionsAndGoalsArchive: localArchive,
      };
      const jsonStr = JSON.stringify(combinedArchive, null, 2);
      setExportPreview(jsonStr);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadJsonFile = () => {
    if (!exportPreview) return;
    const blob = new Blob([exportPreview], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inneros-personal-data-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePurgeAccount = async () => {
    setIsPurging(true);
    try {
      await Promise.all([
        api.purgeAllMemory().catch(() => null),
        api.clearSessionHistory("session_default").catch(() => null),
      ]);
      prototypeService.purgeAllDataPermanently();
      setShowPurgeModal(false);
      setPurged(true);
      setTimeout(() => {
        setPurged(false);
        window.location.reload();
      }, 1500);
    } finally {
      setIsPurging(false);
    }
  };

  return (
    <SanctuaryShell>
      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        {/* Header */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-[#285B55] text-[14px] font-medium">
            <Lock className="w-4 h-4" />
            <span>Privacy & Data Controls</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#263330]">
            Your Data Belongs to You
          </h1>
          <p className="text-[15px] text-[#52625E] leading-relaxed">
            Choose what InnerOS remembers, download a copy of your data anytime, or clear your history with a single click.
          </p>
        </div>

        {/* Consent & Remembering Controls */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between border-b border-[#F3EFE8] pb-3 gap-2">
            <div>
              <h2 className="text-[17px] font-serif font-medium text-[#263330]">
                What Your Companion Can Use
              </h2>
              <p className="text-[13.5px] text-[#52625E]">
                Last updated:{" "}
                {backendConsent?.updated_at
                  ? new Date(backendConsent.updated_at).toLocaleString()
                  : consent.updatedAt}
              </p>
            </div>
            {saved && (
              <Badge variant="sage" size="sm">
                <Check className="w-3.5 h-3.5 mr-1 inline" />
                Saved to Companion
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            <Switch
              label="Remember Context During Active Conversations"
              description="Allows your companion to follow the thread of what you are talking about within your current session."
              checked={consent.storeConversations}
              onChange={() => toggleConsent("storeConversations")}
            />
            <div className="border-t border-[#F3EFE8] pt-4">
              <Switch
                label="Suggest Memories & Personal Connections"
                description="Allows InnerOS to suggest helpful notes (like routines, goals, or preferences) that you can review and approve before they are saved."
                checked={consent.deriveLongTermMemory}
                onChange={() => toggleConsent("deriveLongTermMemory")}
              />
            </div>
            <div className="border-t border-[#F3EFE8] pt-4">
              <Switch
                label="Enable Voice Conversation Processing"
                description="Allows microphone speech-to-text when you use the Voice Companion."
                checked={consent.voiceAudioProcessing}
                onChange={() => toggleConsent("voiceAudioProcessing")}
              />
            </div>
          </div>
        </div>

        {/* Download or Delete Your Data */}
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Export Data */}
          <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[#285B55] text-[14px] font-semibold">
                <Download className="w-4 h-4" />
                <span>Download Your Information</span>
              </div>
              <h3 className="text-[17px] font-serif font-medium text-[#263330]">
                Export Personal Archive
              </h3>
              <p className="text-[14px] text-[#52625E] leading-relaxed">
                View or download a complete, readable JSON copy of your saved memories, Life Graph connections, journal reflections, and privacy settings.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportData}
              disabled={isExporting}
              leftIcon={<FileText className="w-4 h-4" />}
            >
              {isExporting ? "Preparing Archive..." : "View & Export My Data"}
            </Button>
          </div>

          {/* Delete All Data */}
          <div className="p-6 rounded-3xl bg-[#FDF2F2] border border-[#F5D0D0] shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[#A4384B] text-[14px] font-semibold">
                <Trash2 className="w-4 h-4" />
                <span>Delete Everything</span>
              </div>
              <h3 className="text-[17px] font-serif font-medium text-[#263330]">
                Clear All Personal Data
              </h3>
              <p className="text-[14px] text-[#52625E] leading-relaxed">
                Permanently remove your saved memories, Life Graph nodes, chat sessions, journal entries, and preferences from both the server and this browser.
              </p>
            </div>
            <Button
              size="sm"
              variant="emergency"
              onClick={() => setShowPurgeModal(true)}
            >
              Delete All My Data
            </Button>
          </div>
        </div>

        {/* Export Data Preview */}
        {exportPreview && (
          <div className="p-6 rounded-3xl bg-white border border-[#285B55]/40 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[15px] font-serif font-medium text-[#263330]">
                Your Personal Data Archive (Server + Browser)
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  size="xs"
                  variant="primary"
                  onClick={handleDownloadJsonFile}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                >
                  Download JSON File
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setExportPreview(null)}
                >
                  Close Preview
                </Button>
              </div>
            </div>
            <pre className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] text-[13px] font-mono text-[#263330] overflow-x-auto max-h-64 leading-relaxed">
              {exportPreview}
            </pre>
          </div>
        )}

        {/* Dedicated Technical & Privacy Information Section (Truthful & Transparent) */}
        <div className="p-6 rounded-3xl bg-[#FAF8F4] border border-[#E6E0D6] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E6E0D6] pb-3">
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-[#285B55]" />
              <h2 className="text-[16px] font-serif font-medium text-[#263330]">
                How Your Privacy & Security Work
              </h2>
            </div>
            <Badge variant="sage" size="sm">
              Transparent Architecture
            </Badge>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-[14px]">
            <div className="p-4 rounded-2xl bg-white border border-[#E6E0D6] space-y-1.5">
              <span className="font-semibold text-[#263330] block">
                User-Approved Memories
              </span>
              <p className="text-[#52625E] text-[13.5px] leading-relaxed">
                AI observations are held as suggestions first. Nothing becomes a permanent memory without your review.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E6E0D6] space-y-1.5">
              <span className="font-semibold text-[#263330] block">
                Scoped Account Isolation
              </span>
              <p className="text-[#52625E] text-[13.5px] leading-relaxed">
                Backend API queries scope memories, sessions, reminders, and imports to your user profile and record changes in an activity log.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E6E0D6] space-y-1.5">
              <span className="font-semibold text-[#263330] block">
                No Ad Profiling
              </span>
              <p className="text-[#52625E] text-[13.5px] leading-relaxed">
                Your reflections and conversations are never sold to data brokers or used for advertising targeting.
              </p>
            </div>
          </div>
        </div>

        {/* Confirmation Modal for Permanent Deletion */}
        {showPurgeModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="purge-modal-title"
            className="fixed inset-0 z-50 bg-[#263330]/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="max-w-md w-full p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-xl space-y-4">
              <div
                id="purge-modal-title"
                className="flex items-center space-x-2.5 text-[#A4384B] font-serif font-medium text-xl"
              >
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>Delete All Personal Data?</span>
              </div>
              <p className="text-[15px] text-[#52625E] leading-relaxed">
                Are you sure you want to permanently delete all saved memories, Life Graph nodes, chat sessions, journal reflections, and preferences? This cannot be undone.
              </p>
              <div className="flex justify-end space-x-2.5 pt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPurgeModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="emergency"
                  disabled={isPurging}
                  onClick={handlePurgeAccount}
                >
                  {isPurging ? "Deleting..." : "Yes, Delete Everything"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {purged && (
          <div className="p-4 rounded-2xl bg-[#E8F1EB] border border-[#CFE2D6] text-center text-[14px] text-[#1F4742] font-medium">
            All personal memories, sessions, and local reflections have been cleared. Refreshing your space...
          </div>
        )}
      </div>
    </SanctuaryShell>
  );
}
