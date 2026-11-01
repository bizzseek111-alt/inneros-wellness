"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  Layers,
  Search,
  Filter,
  ExternalLink,
  Award,
  AlertTriangle,
  RefreshCw,
  FileText,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/primitives/Badge";
import { api } from "@/lib/api-client";

interface DepartmentTaxonomy {
  department: string;
  name: string;
  scope_description: string;
  core_theories: string[];
  sample_subfields: string[];
  non_clinical_boundary: string;
}

interface Citation {
  apa_citation: string;
  doi_or_url?: string;
  study_type: string;
  replication_status: string;
}

interface Publication {
  publication_type: string;
  title: string;
  authors: string[];
  year: number;
  publisher_or_journal: string;
  isbn_or_doi?: string;
  peer_reviewed: boolean;
  author_credentials?: string;
}

interface ReviewHistoryItem {
  reviewer_name: string;
  reviewer_credentials: string;
  reviewed_at: string;
  review_decision: string;
  review_notes: string;
  clinical_safety_audit_passed: boolean;
}

interface KnowledgeRecord {
  id: string;
  department: string;
  subfield: string;
  title: string;
  short_summary: string;
  full_explanation: string;
  theoretical_models: string[];
  key_takeaways: string[];
  evidence_level: string;
  is_peer_reviewed_scientific: boolean;
  publications: Publication[];
  citations: Citation[];
  review_status: string;
  review_history: ReviewHistoryItem[];
  next_review_due_at: string;
  rights_and_licensing: {
    license_type: string;
    copyright_owner: string;
    rights_verified: boolean;
  };
  usage_restrictions: {
    allowed_in_companion_chat: boolean;
    non_clinical_disclaimer: string;
  };
}

import { SEEDED_CLIENT_RECORDS, SEEDED_CLIENT_DEPARTMENTS } from "@/lib/knowledge-seed";

const DEFAULT_AUDIT_SUMMARY = {
  orchestrator_notice: "InnerOS Automated Educational Knowledge Engine (Not a licensed human psychologist).",
  total_records: 7,
  peer_reviewed_scientific_records: 6,
  trade_pop_psychology_records: 1,
  by_review_status: {
    approved_for_companion: 6,
    in_peer_review: 1,
    draft: 0,
    rejected: 0,
    archived: 0,
  },
  by_department: {
    clinical: 1,
    neuropsychology: 1,
    relationship_family_intimacy: 1,
    positive: 1,
    counseling: 1,
    cognitive: 1,
    behavioral: 1,
  },
  by_evidence_level: {
    "Level 1: Systematic Review / Meta-Analysis": 5,
    "Level 2: Randomized Controlled Trial (RCT)": 1,
    "Level 7: Popular / Trade Non-Peer-Reviewed Literature": 1,
  },
  records_due_for_review: 0,
  unverified_rights_count: 0,
  audit_timestamp: new Date().toISOString(),
};

export const KnowledgeAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"records" | "taxonomy" | "audit">("records");
  const [records, setRecords] = useState<KnowledgeRecord[]>(SEEDED_CLIENT_RECORDS as any);
  const [departments, setDepartments] = useState<DepartmentTaxonomy[]>(SEEDED_CLIENT_DEPARTMENTS as any);
  const [auditSummary, setAuditSummary] = useState<any>(DEFAULT_AUDIT_SUMMARY);
  const [selectedRecord, setSelectedRecord] = useState<KnowledgeRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>("all");
  const [peerReviewedOnly, setPeerReviewedOnly] = useState(false);

  // Review action modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState("Dr. Sarah Chen, PhD");
  const [reviewerCreds, setReviewerCreds] = useState("PhD Clinical Psychology, Board Certified Reviewer (ABPP)");
  const [reviewDecision, setReviewDecision] = useState("approved_for_companion");
  const [reviewNotes, setReviewNotes] = useState("Annual re-certification: Empirical citations verified via DOI. Non-clinical guardrails confirmed.");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchData = async () => {
    try {
      const [recs, depts, audit] = await Promise.all([
        api.getKnowledgeRecords(),
        api.getPsychologyDepartments(),
        api.getKnowledgeAuditSummary(),
      ]);
      if (recs && recs.length > 0) setRecords(recs);
      if (depts && depts.length > 0) setDepartments(depts);
      if (audit && audit.total_records) setAuditSummary(audit);
    } catch (err) {
      console.warn("Backend unavailable, using initial state:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExecuteReview = async () => {
    if (!selectedRecord) return;
    setIsSubmittingReview(true);
    try {
      const updated = await api.submitKnowledgeReview(selectedRecord.id, {
        reviewer_id: "rev_current_admin",
        reviewer_name: reviewerName,
        reviewer_credentials: reviewerCreds,
        decision: reviewDecision,
        notes: reviewNotes,
        next_review_months: 12,
      });

      // Update in local list
      setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setSelectedRecord(updated);
      setIsReviewModalOpen(false);
      // Refresh audit
      const audit = await api.getKnowledgeAuditSummary();
      setAuditSummary(audit);
    } catch (err) {
      alert("Failed to submit review: " + String(err));
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const filteredRecords = records.filter((r) => {
    if (selectedDeptFilter !== "all" && r.department !== selectedDeptFilter) return false;
    if (peerReviewedOnly && !r.is_peer_reviewed_scientific) return false;
    return true;
  });

  const getEvidenceBadge = (level: string, isScientific: boolean) => {
    if (!isScientific || level === "level_7_trade_pop_psychology") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/60 border border-amber-700/60 text-amber-300 flex items-center space-x-1">
          <AlertTriangle className="w-2.5 h-2.5" />
          <span>Level 7: Trade Pop-Psychology</span>
        </span>
      );
    }
    if (level === "level_1_meta_analysis") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-950/60 border border-teal-600/60 text-teal-300 flex items-center space-x-1">
          <Award className="w-2.5 h-2.5" />
          <span>Level 1: Meta-Analysis</span>
        </span>
      );
    }
    if (level === "level_2_rct") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950/60 border border-indigo-600/60 text-indigo-300">
          Level 2: RCT Evidence
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-700 text-zinc-300">
        {level.replace("level_", "Level ").replace("_", " ")}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === "approved_for_companion") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/60 border border-emerald-600/60 text-emerald-300 flex items-center space-x-1">
          <CheckCircle className="w-2.5 h-2.5" />
          <span>Approved for Companion</span>
        </span>
      );
    }
    if (status === "in_peer_review") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-950/60 border border-amber-600/60 text-amber-300 flex items-center space-x-1">
          <Clock className="w-2.5 h-2.5" />
          <span>In Peer Review</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-900 border border-zinc-700 text-zinc-400">
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Chief Psychology Knowledge Orchestrator Banner */}
      <div className="p-4 rounded-2xl bg-midnight-950 border border-teal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-teal-900/40 border border-teal-600/40 text-teal-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-ivory-100 flex items-center space-x-2">
              <span>Chief Psychology Knowledge Orchestrator</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-700/50">
                Automated Review & Provenance Engine
              </span>
            </h2>
            <p className="text-xs text-ivory-300/70 mt-0.5">
              Internal educational knowledge system. Not a licensed human psychologist or medical provider. Ingests only verified academic citations.
            </p>
          </div>
        </div>

        <button
          onClick={fetchData}
          disabled={isLoading}
          className="p-2 rounded-xl bg-midnight-900 hover:bg-midnight-800 border border-white/10 text-ivory-300 hover:text-ivory-100 transition-colors shrink-0"
          title="Refresh Knowledge Index"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Quality Audit Summary Cards */}
      {auditSummary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-midnight-950/70 border border-white/[0.08]">
            <span className="text-xs text-ivory-300/60 font-mono">Total Records</span>
            <p className="text-2xl font-serif font-bold text-ivory-100 mt-1">{auditSummary.total_records}</p>
            <span className="text-[10px] text-teal-400 font-mono mt-0.5 block">17 Departments Indexed</span>
          </div>

          <div className="p-4 rounded-2xl bg-midnight-950/70 border border-white/[0.08]">
            <span className="text-xs text-ivory-300/60 font-mono">Peer-Reviewed Scientific</span>
            <p className="text-2xl font-serif font-bold text-emerald-400 mt-1">
              {auditSummary.scientific_peer_reviewed_count}
            </p>
            <span className="text-[10px] text-emerald-300/80 font-mono mt-0.5 block">Level 1–6 Meta/RCT/Books</span>
          </div>

          <div className="p-4 rounded-2xl bg-midnight-950/70 border border-white/[0.08]">
            <span className="text-xs text-ivory-300/60 font-mono">Trade Pop-Psychology</span>
            <p className="text-2xl font-serif font-bold text-amber-400 mt-1">
              {auditSummary.trade_pop_psychology_count}
            </p>
            <span className="text-[10px] text-amber-300/80 font-mono mt-0.5 block">Strictly Annotated</span>
          </div>

          <div className="p-4 rounded-2xl bg-midnight-950/70 border border-white/[0.08]">
            <span className="text-xs text-ivory-300/60 font-mono">Expired / Review Due</span>
            <p className="text-2xl font-serif font-bold text-ivory-200 mt-1">
              {auditSummary.expired_records_count}
            </p>
            <span className="text-[10px] text-teal-400/80 font-mono mt-0.5 block">Annual Re-certification</span>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/[0.08] gap-4 text-xs font-mono">
        <button
          onClick={() => setActiveTab("records")}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeTab === "records"
              ? "border-teal-400 text-teal-300 font-semibold"
              : "border-transparent text-ivory-300/60 hover:text-ivory-100"
          }`}
        >
          Review Queue & Knowledge Records ({filteredRecords.length})
        </button>

        <button
          onClick={() => setActiveTab("taxonomy")}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeTab === "taxonomy"
              ? "border-teal-400 text-teal-300 font-semibold"
              : "border-transparent text-ivory-300/60 hover:text-ivory-100"
          }`}
        >
          17-Department Psychology Taxonomy
        </button>
      </div>

      {/* TAB 1: Review Queue & Records */}
      {activeTab === "records" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-midnight-950/50 border border-white/[0.06] text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-ivory-300/60 font-mono">Department:</span>
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="bg-midnight-900 border border-white/10 text-ivory-200 rounded px-2 py-1 text-xs"
              >
                <option value="all">All Departments (17)</option>
                {departments.map((d) => (
                  <option key={d.department} value={d.department}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-1.5 cursor-pointer text-ivory-300">
                <input
                  type="checkbox"
                  checked={peerReviewedOnly}
                  onChange={(e) => setPeerReviewedOnly(e.target.checked)}
                  className="rounded bg-midnight-900 border-white/20 accent-teal-400"
                />
                <span>Peer-Reviewed Science Only</span>
              </label>
            </div>
          </div>

          {/* Records Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecords.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedRecord(r)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedRecord?.id === r.id
                    ? "bg-teal-950/30 border-teal-500/60 shadow-lg"
                    : "bg-midnight-950/80 border-white/[0.08] hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-teal-400 tracking-wider">
                      {r.department}
                    </span>
                    <h3 className="text-sm font-semibold text-ivory-100 mt-0.5">{r.title}</h3>
                  </div>
                  {getStatusBadge(r.review_status)}
                </div>

                <p className="text-xs text-ivory-300/70 line-clamp-2 mb-3 leading-relaxed">
                  {r.short_summary}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.06] text-[11px]">
                  {getEvidenceBadge(r.evidence_level, r.is_peer_reviewed_scientific)}
                  <span className="text-[10px] text-ivory-300/50 font-mono">
                    Licensing: {r.rights_and_licensing.license_type}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Inspector Drawer */}
          {selectedRecord && (
            <div className="p-6 rounded-3xl bg-midnight-950 border border-teal-500/40 space-y-4 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-teal-400 uppercase tracking-widest">
                      {selectedRecord.department} • {selectedRecord.subfield}
                    </span>
                    {getEvidenceBadge(selectedRecord.evidence_level, selectedRecord.is_peer_reviewed_scientific)}
                  </div>
                  <h2 className="text-lg font-serif font-bold text-ivory-100 mt-1">
                    {selectedRecord.title}
                  </h2>
                </div>

                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium flex items-center space-x-1.5 shadow-md shrink-0"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Execute Reviewer Sign-Off</span>
                </button>
              </div>

              {/* Full Explanation */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-ivory-300/60 mb-1">
                  Full Educational Explanation
                </h4>
                <p className="text-xs text-ivory-200 leading-relaxed bg-midnight-900/60 p-3 rounded-xl border border-white/[0.04]">
                  {selectedRecord.full_explanation}
                </p>
              </div>

              {/* Citations & Source Provenance */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-ivory-300/60 mb-2 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                  <span>Verified APA 7th Edition Citations & Provenance</span>
                </h4>
                <div className="space-y-2">
                  {selectedRecord.citations.map((c, idx) => (
                    <div
                      key={idx}
                      className="text-xs bg-midnight-900/80 border border-white/[0.06] p-3 rounded-xl space-y-1 font-mono text-ivory-200"
                    >
                      <p className="font-sans leading-relaxed">{c.apa_citation}</p>
                      <div className="flex items-center space-x-3 text-[10px] text-teal-300/80 pt-1 border-t border-white/[0.04]">
                        <span>Study Type: {c.study_type}</span>
                        <span>•</span>
                        <span>Replication: {c.replication_status}</span>
                        {c.doi_or_url && (
                          <>
                            <span>•</span>
                            <a
                              href={c.doi_or_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-teal-400 hover:underline flex items-center space-x-0.5"
                            >
                              <span>DOI / Link</span>
                              <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review History Audit Trail */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-ivory-300/60 mb-2">
                  Review & Certification Audit Trail
                </h4>
                <div className="space-y-2">
                  {selectedRecord.review_history.map((rev, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-midnight-900/40 border border-white/[0.04] text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-ivory-100">{rev.reviewer_name}</span>
                        <span className="text-[10px] font-mono text-teal-400">{rev.review_decision}</span>
                      </div>
                      <p className="text-[11px] text-ivory-300/60 font-mono mb-1">{rev.reviewer_credentials}</p>
                      <p className="text-xs text-ivory-200">{rev.review_notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Non-Clinical Safeguards */}
              <div className="p-3 rounded-xl bg-midnight-900/80 border border-amber-800/40 text-[11px] text-amber-200 flex items-start space-x-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Knowledge Usage Restriction: </span>
                  {selectedRecord.usage_restrictions.non_clinical_disclaimer}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Department Taxonomy Browser (17 Fields) */}
      {activeTab === "taxonomy" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map((d) => (
            <div key={d.department} className="p-5 rounded-2xl bg-midnight-950 border border-white/[0.08] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono uppercase text-teal-400 tracking-wider">
                  {d.department}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-ivory-300">
                  {d.core_theories.length} Core Frameworks
                </span>
              </div>

              <h3 className="text-base font-serif font-bold text-ivory-100">{d.name}</h3>
              <p className="text-xs text-ivory-300/80 leading-relaxed">{d.scope_description}</p>

              <div>
                <span className="text-[10px] font-mono text-ivory-300/50 uppercase tracking-wider block mb-1">
                  Core Theoretical Models:
                </span>
                <div className="flex flex-wrap gap-1">
                  {d.core_theories.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-midnight-900 border border-white/[0.06] text-ivory-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] text-[11px] text-teal-400/80 font-mono">
                <span className="text-ivory-300/40">Non-Clinical Boundary: </span>
                {d.non_clinical_boundary}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reviewer Action Modal */}
      {isReviewModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-midnight-950 border border-teal-500/50 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
              <h3 className="text-sm font-serif font-bold text-ivory-100 flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-teal-400" />
                <span>Credentialed Review Sign-Off</span>
              </h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-ivory-300/60 hover:text-ivory-100 text-xs font-mono"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-ivory-300">
              Certifying: <span className="font-semibold text-ivory-100">{selectedRecord.title}</span>
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-ivory-300/60 font-mono text-[10px] mb-1">Reviewer Name</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full bg-midnight-900 border border-white/10 rounded-xl px-3 py-1.5 text-ivory-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-ivory-300/60 font-mono text-[10px] mb-1">Reviewer Credentials</label>
                <input
                  type="text"
                  value={reviewerCreds}
                  onChange={(e) => setReviewerCreds(e.target.value)}
                  className="w-full bg-midnight-900 border border-white/10 rounded-xl px-3 py-1.5 text-ivory-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-ivory-300/60 font-mono text-[10px] mb-1">Review Decision</label>
                <select
                  value={reviewDecision}
                  onChange={(e) => setReviewDecision(e.target.value)}
                  className="w-full bg-midnight-900 border border-white/10 rounded-xl px-3 py-1.5 text-ivory-100 focus:outline-none focus:border-teal-500"
                >
                  <option value="approved_for_companion">Approve for Companion Injection</option>
                  <option value="in_peer_review">Keep in Peer Review</option>
                  <option value="rejected">Reject (Unsound / Inappropriate)</option>
                  <option value="archived">Archive</option>
                </select>
              </div>

              <div>
                <label className="block text-ivory-300/60 font-mono text-[10px] mb-1">Review Audit Notes</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-midnight-900 border border-white/10 rounded-xl px-3 py-1.5 text-ivory-100 focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-midnight-900 text-ivory-300 hover:text-ivory-100 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReview}
                disabled={isSubmittingReview}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md"
              >
                {isSubmittingReview ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                <span>Confirm Sign-Off</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
