"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  BookOpen,
  Edit3,
  Archive,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  FileText,
  UserCheck,
  Check,
  X,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { apiClient, CurriculumModule, ApprovalActionRequest } from "@/lib/api-client";

export default function AdminCurriculumCMSPage() {
  const [modules, setModules] = useState<CurriculumModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedAge, setSelectedAge] = useState<string>("all");
  const [message, setMessage] = useState<string | null>(null);

  // Editing state
  const [editingModule, setEditingModule] = useState<CurriculumModule | null>(null);
  const [editTitleEn, setEditTitleEn] = useState("");
  const [editTitleUr, setEditTitleUr] = useState("");
  const [editTitlePa, setEditTitlePa] = useState("");
  const [editObjective, setEditObjective] = useState("");
  const [editDuration, setEditDuration] = useState(10);
  const [saving, setSaving] = useState(false);

  // Approval modal state
  const [approvingModule, setApprovingModule] = useState<CurriculumModule | null>(null);
  const [reviewerName, setReviewerName] = useState("Dr. Aisha Malik, Clinical Lead");
  const [reviewerNotes, setReviewerNotes] = useState(
    "Verified alignment with CASEL competencies, multilingual clarity, and neurodiversity-affirming guidelines."
  );
  const [clinicalDisclaimerSigned, setClinicalDisclaimerSigned] = useState(true);

  const loadCurriculum = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.getAcademyModules({
        is_reviewer: true, // CMS reviewer sees everything
        age_band: selectedAge !== "all" ? selectedAge : undefined,
        approval_status: selectedStatus !== "all" ? selectedStatus : undefined,
      });
      setModules(data);
    } catch (err: any) {
      console.error("Failed to load curriculum:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedAge, selectedStatus]);

  useEffect(() => {
    loadCurriculum();
  }, [loadCurriculum]);

  const handleOpenEdit = (mod: CurriculumModule) => {
    setEditingModule(mod);
    setEditTitleEn(mod.title_en);
    setEditTitleUr(mod.title_ur);
    setEditTitlePa(mod.title_pa);
    setEditObjective(mod.developmental_objective);
    setEditDuration(mod.recommended_session_duration_min);
  };

  const handleSaveEdit = async () => {
    if (!editingModule) return;
    setSaving(true);
    try {
      await apiClient.updateAcademyModule(editingModule.module_id, {
        title_en: editTitleEn,
        title_ur: editTitleUr,
        title_pa: editTitlePa,
        developmental_objective: editObjective,
        recommended_session_duration_min: editDuration,
      });
      setMessage(`Successfully updated module ${editingModule.module_id}`);
      setEditingModule(null);
      loadCurriculum();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleActionTransition = async (targetStatus: string) => {
    if (!approvingModule) return;
    try {
      const payload: ApprovalActionRequest = {
        module_id: approvingModule.module_id,
        target_status: targetStatus,
        reviewer_name: reviewerName,
        reviewer_notes: reviewerNotes,
        signed_clinical_disclaimer: clinicalDisclaimerSigned,
      };
      const res = await apiClient.approveAcademyModule(approvingModule.module_id, payload);
      setMessage(res.message);
      setApprovingModule(null);
      loadCurriculum();
    } catch (err: any) {
      setMessage(`Approval error: ${err.message}`);
    }
  };

  const handlePublishAll = async () => {
    try {
      const res = await apiClient.publishAllDemonstrationLessons();
      setMessage(`Published all ${res.published_count} demonstration lessons!`);
      loadCurriculum();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const filteredModules = modules.filter((m) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.title_en.toLowerCase().includes(q) ||
      m.module_id.toLowerCase().includes(q) ||
      m.department_id.toLowerCase().includes(q) ||
      m.developmental_objective.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">Published</span>;
      case "approved_pending_clinical_signoff":
        return <span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">Approved (Pending Signoff)</span>;
      case "under_review":
        return <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-semibold">Under Review</span>;
      case "archived":
        return <span className="px-2.5 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold">Archived</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold">Draft Educational</span>;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-10 space-y-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link
                href="/youth/academy"
                className="p-2 rounded-xl bg-card border border-border hover:bg-muted text-muted-foreground transition"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Curriculum Reviewer & CMS Studio
              </h1>
            </div>
            <p className="text-xs text-muted-foreground ml-11">
              Governance portal for the 25 Weebly Kids Development Academy departments. Review, localize, verify citations, and approve educational modules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePublishAll}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish All Demo Lessons</span>
            </button>
            <button
              onClick={loadCurriculum}
              className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground transition"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Message Notification */}
        {message && (
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage(null)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Ethical Governance Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Multidisciplinary Reviewer Mandate: </span>
            <span>
              All lessons are non-clinical educational experiences. CMS content cannot contain diagnostic classifications,
              IQ test predictions, or claims to cure autism/ADHD. Unapproved drafts remain hidden from child production accounts until signed off.
            </span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search module title, ID, or objective..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none"
            >
              <option value="all">All Approval Statuses</option>
              <option value="draft">Draft Educational</option>
              <option value="under_review">Under Review</option>
              <option value="approved_pending_clinical_signoff">Approved (Pending Signoff)</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
              className="px-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none"
            >
              <option value="all">All Age Bands</option>
              <option value="2-5">Ages 2–5</option>
              <option value="6-9">Ages 6–9</option>
              <option value="10-12">Ages 10–12</option>
              <option value="13-18">Ages 13–18</option>
            </select>
          </div>
        </div>

        {/* Curriculum Modules Table */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="p-4">Module / Department</th>
                  <th className="p-4">Age Band</th>
                  <th className="p-4">Evidence Level</th>
                  <th className="p-4">Approval Status</th>
                  <th className="p-4">Last Reviewer</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-muted-foreground">
                      Loading curriculum catalog...
                    </td>
                  </tr>
                ) : filteredModules.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-muted-foreground">
                      No modules matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredModules.map((mod) => (
                    <tr key={mod.module_id} className="hover:bg-muted/30 transition">
                      <td className="p-4 space-y-1">
                        <div className="font-bold text-foreground text-sm flex items-center gap-2">
                          <span>{mod.title_en}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground font-mono">
                            {mod.module_id}
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {mod.department_id.replace(/_/g, " ")} • {mod.title_ur}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px]">
                          Ages {mod.target_age_range}
                        </span>
                      </td>

                      <td className="p-4 font-mono text-[11px] text-muted-foreground">
                        {mod.evidence_strength.replace(/_/g, " ")}
                      </td>

                      <td className="p-4">{getStatusBadge(mod.approval_status)}</td>

                      <td className="p-4 text-muted-foreground">
                        {mod.reviewer_name || "Unassigned"}
                      </td>

                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/youth/academy/lesson/${mod.module_id}`}
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground"
                            title="Preview Lesson"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(mod)}
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground"
                            title="Edit Content"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setApprovingModule(mod)}
                            className="px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 text-[11px]"
                          >
                            Review
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* EDIT DRAWER / MODAL */}
      {editingModule && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-base font-bold text-foreground">
                Edit Curriculum Content: {editingModule.module_id}
              </h3>
              <button onClick={() => setEditingModule(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-foreground block mb-1">Title (English)</label>
                <input
                  type="text"
                  value={editTitleEn}
                  onChange={(e) => setEditTitleEn(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-muted/40 border border-border text-foreground"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Title (Urdu Nastaliq)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={editTitleUr}
                  onChange={(e) => setEditTitleUr(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-muted/40 border border-border text-foreground font-urdu"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Title (Punjabi Shahmukhi)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={editTitlePa}
                  onChange={(e) => setEditTitlePa(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-muted/40 border border-border text-foreground font-urdu"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Developmental Objective</label>
                <textarea
                  value={editObjective}
                  onChange={(e) => setEditObjective(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-muted/40 border border-border text-foreground resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Recommended Duration (minutes)</label>
                <input
                  type="number"
                  value={editDuration}
                  onChange={(e) => setEditDuration(parseInt(e.target.value) || 10)}
                  className="w-32 p-2.5 rounded-xl bg-muted/40 border border-border text-foreground"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                onClick={() => setEditingModule(null)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPROVAL / STATUS TRANSITION MODAL */}
      {approvingModule && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-base font-bold text-foreground">
                Clinical & Pedagogical Approval Signoff
              </h3>
              <button onClick={() => setApprovingModule(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-muted-foreground leading-relaxed">
                Reviewing module <span className="font-bold text-foreground">{approvingModule.title_en}</span> ({approvingModule.module_id}).
              </p>

              <div>
                <label className="font-bold text-foreground block mb-1">Reviewer Name & Credential</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-muted/40 border border-border text-foreground"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Clinical / Developmental Notes</label>
                <textarea
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-muted/40 border border-border text-foreground resize-none"
                />
              </div>

              <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/50 border border-border">
                <input
                  type="checkbox"
                  id="disclaimer"
                  checked={clinicalDisclaimerSigned}
                  onChange={(e) => setClinicalDisclaimerSigned(e.target.checked)}
                  className="mt-0.5 rounded"
                />
                <label htmlFor="disclaimer" className="text-[11px] text-muted-foreground leading-snug">
                  I confirm this lesson is non-diagnostic, complies with CASEL and WHO guidelines, and contains no manipulative hooks or clinical claims.
                </label>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-border">
              <button
                onClick={() => handleActionTransition("draft")}
                className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:bg-muted"
              >
                Mark Draft
              </button>
              <button
                onClick={() => handleActionTransition("approved_pending_clinical_signoff")}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                Approve Pending
              </button>
              <button
                onClick={() => handleActionTransition("published")}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
              >
                Publish Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
