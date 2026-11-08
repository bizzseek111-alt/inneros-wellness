"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Stethoscope,
  Users,
  FileText,
  AlertTriangle,
  Lock,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  Plus,
  Eye,
  Search,
  Filter,
  Check,
  Award,
  BookOpen,
} from "lucide-react";

interface SupportCase {
  id: string;
  caseNumber: string;
  childPseudonym: string;
  ageTier: string;
  referralSource: string;
  status: "intake" | "consent_verified" | "in_review" | "support_plan_active" | "closed";
  consentVerified: boolean;
  caregiverHarmSuspected: boolean;
  referralReason: string;
  assignedProfessional: string;
  lastUpdated: string;
  clinicalNotesCount: number;
}

const INITIAL_CASES: SupportCase[] = [
  {
    id: "case_01",
    caseNumber: "CASE-202611-8F3A",
    childPseudonym: "Child Horizon-7",
    ageTier: "Junior (Grade 4, Age 9)",
    referralSource: "School Teacher Observation",
    status: "in_review",
    consentVerified: true,
    caregiverHarmSuspected: false,
    referralReason: "Teacher noted difficulty maintaining attention during sustained math worksheets; responds well to visual mango counters.",
    assignedProfessional: "Dr. Sarah Jenkins, Ph.D.",
    lastUpdated: "2 hours ago",
    clinicalNotesCount: 3,
  },
  {
    id: "case_02",
    caseNumber: "CASE-202611-2C9B",
    childPseudonym: "Child Meadow-4",
    ageTier: "Little (Pre-K, Age 4)",
    referralSource: "Caregiver Concern Intake",
    status: "consent_verified",
    consentVerified: true,
    caregiverHarmSuspected: false,
    referralReason: "Parent requested sensory co-regulation strategies for morning kindergarten separation anxiety.",
    assignedProfessional: "Dr. Sarah Jenkins, Ph.D.",
    lastUpdated: "Yesterday",
    clinicalNotesCount: 1,
  },
  {
    id: "case_03",
    caseNumber: "CASE-202611-9X1L",
    childPseudonym: "Child Cedar-9",
    ageTier: "Teen (Grade 8, Age 14)",
    referralSource: "Safeguarding Protocol Escalation",
    status: "in_review",
    consentVerified: false,
    caregiverHarmSuspected: true,
    referralReason: "Student disclosed physical punishment at home. CAREGIVER NOTIFICATION SUPPRESSED to prevent retaliation. Escalated to CPWB Punjab.",
    assignedProfessional: "Dr. Sarah Jenkins, Ph.D.",
    lastUpdated: "35 mins ago",
    clinicalNotesCount: 2,
  },
];

export default function ProfessionalSupportPortal() {
  const [activeTab, setActiveTab] = useState<"cases" | "notes" | "safeguarding" | "audits">("cases");
  const [cases, setCases] = useState<SupportCase[]>(INITIAL_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("case_01");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteType, setNewNoteType] = useState("observation_analysis");
  const [noteSuccess, setNoteSuccess] = useState(false);

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  useEffect(() => {
    fetch("/api/parent/observations")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.observations) && data.observations.length > 0) {
          const intakeCases: SupportCase[] = data.observations.slice(0, 3).map((obs: any, idx: number) => ({
            id: `case_obs_${obs.id || idx}`,
            caseNumber: `CASE-202611-OBS${idx + 1}`,
            childPseudonym: `Authorized Child (${obs.child_id || "Family Intake"})`,
            ageTier: "Junior (Authorized Family Intake)",
            referralSource: "Caregiver Observation Diary",
            status: "consent_verified",
            consentVerified: true,
            caregiverHarmSuspected: false,
            referralReason: obs.parent_note || "Authorized parent observation intake.",
            assignedProfessional: "Dr. Sarah Jenkins, Ph.D.",
            lastUpdated: "Synced from Parent Center",
            clinicalNotesCount: 1,
          }));
          setCases((prev) => {
            const existingIds = new Set(prev.map((c) => c.id));
            const uniqueNew = intakeCases.filter((c) => !existingIds.has(c.id));
            return [...prev, ...uniqueNew];
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    setNoteSuccess(true);
    setTimeout(() => {
      setNoteSuccess(false);
      setNewNoteContent("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-teal-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black shadow-xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black text-slate-900 tracking-tight">Weebly Professional Support</span>
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider">
                  Verified Clinician Hub
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Dr. Sarah Jenkins, Ph.D. <span className="text-teal-700 font-bold">(Simulated Clinician Profile)</span> &bull; Fictional Demo License: PPA #88291-PK &bull; Punjab Healthcare Commission Sandbox
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/parent"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Parent Center
            </Link>
            <Link
              href="/school/portal"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              School Portal
            </Link>
            <Link
              href="/youth/dashboard"
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-colors"
            >
              Kids Magic Home
            </Link>
          </div>
        </div>
      </header>

      {/* Strict Non-Clinical Principle Alert Banner */}
      <div className="bg-emerald-900 text-emerald-100 px-4 sm:px-8 py-3 border-b border-emerald-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-medium">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Professional Clinical Boundary (Simulated Demonstration Environment):</strong> All patient records, clinician credentials, and case studies shown here are synthetic demonstration fixtures for stakeholder review. In production, clinical judgments and developmental evaluations belong exclusively to licensed human practitioners. Weebly AI companions NEVER generate psychiatric diagnoses or clinical pathology scores.
            </span>
          </div>
          <span className="text-[11px] text-emerald-300 uppercase font-black tracking-wider shrink-0">
            Simulated Sandbox Mode
          </span>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-black">
          <button
            onClick={() => setActiveTab("cases")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === "cases" ? "bg-teal-700 text-white shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Authorized Cases ({cases.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === "notes" ? "bg-teal-700 text-white shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Clinical Notes &amp; Support Plans</span>
          </button>
          <button
            onClick={() => setActiveTab("safeguarding")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === "safeguarding" ? "bg-rose-600 text-white shadow-xs" : "text-rose-700 hover:bg-rose-50"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Safeguarding &amp; Caregiver Harm Protocols</span>
          </button>
          <button
            onClick={() => setActiveTab("audits")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === "audits" ? "bg-teal-700 text-white shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Access Audits</span>
          </button>
        </div>

        {/* TAB 1: AUTHORIZED CASES */}
        {activeTab === "cases" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cases.map((c) => {
                const isHarm = c.caregiverHarmSuspected;
                const isSelected = c.id === selectedCaseId;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`p-6 rounded-3xl border-2 transition-all cursor-pointer space-y-4 ${
                      isSelected
                        ? "border-teal-600 bg-white shadow-md ring-2 ring-teal-500/20"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-slate-500">{c.caseNumber}</span>
                      {isHarm ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Caregiver Alert</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                          Consent Verified
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-black text-slate-900">{c.childPseudonym}</h3>
                      <p className="text-xs font-bold text-slate-500">{c.ageTier}</p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{c.referralReason}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                      <span>Source: {c.referralSource}</span>
                      <span>{c.clinicalNotesCount} clinical notes</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Case Deep Dive */}
            <div className="rounded-[32px] bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-400">Selected Case: {selectedCase.caseNumber}</span>
                  <h2 className="text-2xl font-black text-slate-900">{selectedCase.childPseudonym}</h2>
                  <p className="text-xs text-slate-600 font-medium">
                    Assigned Clinician: {selectedCase.assignedProfessional} &bull; Updated {selectedCase.lastUpdated}
                  </p>
                </div>
                {selectedCase.caregiverHarmSuspected && (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-black flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Caregiver Harm Exception: Caregiver notification suppressed by safeguarding protocol</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 space-y-2">
                  <h4 className="font-black text-slate-700 uppercase tracking-wider text-[10px]">Referral Overview</h4>
                  <p className="text-slate-800 leading-relaxed">{selectedCase.referralReason}</p>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 space-y-2">
                  <h4 className="font-black text-teal-800 uppercase tracking-wider text-[10px]">Evidence-Based Support Plan</h4>
                  <ul className="list-disc list-inside space-y-1 text-teal-900 font-medium">
                    <li>Multi-sensory math practice using visual Chaunsa mango counters</li>
                    <li>Somatic deep breathing pacing with Lumi character during transitions</li>
                    <li>Untimed classroom reading accommodations with dyslexic font toggled</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CLINICAL NOTES */}
        {activeTab === "notes" && (
          <div className="rounded-[32px] bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Add Clinical Note &bull; {selectedCase.childPseudonym}</h2>
              <p className="text-xs text-slate-500 font-medium">
                Case Number: {selectedCase.caseNumber} &bull; Clinical notes are protected and never exposed to unauthenticated parties or children.
              </p>
            </div>

            <form onSubmit={handleAddNote} className="space-y-4">
              <div className="max-w-xs">
                <label className="block text-xs font-bold text-slate-700 mb-1">Note Type</label>
                <select
                  value={newNoteType}
                  onChange={(e) => setNewNoteType(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="observation_analysis">Observation &amp; Accommodation Analysis</option>
                  <option value="intake_review">Initial Intake Evaluation</option>
                  <option value="support_plan">Individualized Support Plan (ISP)</option>
                  <option value="follow_up">Clinical Follow-up &amp; Progress Review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Observations &amp; Recommendations</label>
                <textarea
                  rows={4}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Enter objective clinical observations, environmental adaptations, and recommended accommodations..."
                  className="w-full text-xs p-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400 font-medium">
                  Protected under HIPAA / GDPR-K / Punjab Healthcare Commission standards.
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black transition-all shadow-xs flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Clinical Note</span>
                </button>
              </div>

              {noteSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Clinical note saved securely and encrypted under Case ID {selectedCase.caseNumber}.</span>
                </div>
              )}
            </form>
          </div>
        )}

        {/* TAB 3: SAFEGUARDING & CAREGIVER HARM PROTOCOL */}
        {activeTab === "safeguarding" && (
          <div className="rounded-[32px] bg-rose-50 border-2 border-rose-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 text-rose-900">
              <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0" />
              <div>
                <h2 className="text-xl font-black">Caregiver Harm Notification Exception Protocol</h2>
                <p className="text-xs text-rose-700 font-bold">
                  Child Protection &amp; Welfare Bureau (CPWB Punjab) Protocol Compliance
                </p>
              </div>
            </div>

            <p className="text-xs text-rose-900 leading-relaxed font-medium">
              Under standard COPPA/GDPR regulations, parents are notified of safety events. However, if a child or student
              discloses abuse, physical violence, or neglect where the <strong>suspected source of harm is a caregiver</strong>,
              standard parent notification is <strong>strictly suppressed</strong> to prevent retaliation or acute danger to the child.
            </p>

            <div className="p-4 rounded-2xl bg-white border border-rose-200 space-y-3">
              <h4 className="font-black text-rose-950 text-xs uppercase tracking-wider">Designated Regional Safeguarding Channels</h4>
              <ul className="text-xs space-y-2 text-slate-700">
                <li className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                  <span className="font-bold">Child Protection &amp; Welfare Bureau (Punjab)</span>
                  <span className="font-mono font-black text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">Helpline: 1121</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                  <span className="font-bold">Umang Youth Emotional Distress Support (Pakistan)</span>
                  <span className="font-mono font-black text-teal-800 bg-teal-100 px-2.5 py-1 rounded-full">0311-7786264 (24/7)</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 4: ACCESS AUDITS */}
        {activeTab === "audits" && (
          <div className="rounded-[32px] bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Clinical Data Access Audit Logs</h2>
              <p className="text-xs text-slate-500 font-medium">
                Immutable zero-knowledge audit trail verifying every authorized clinician inspection.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-black">
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Clinician ID</th>
                    <th className="pb-3">Action</th>
                    <th className="pb-3">Case ID</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  <tr>
                    <td className="py-3 font-mono">2026-11-04 21:45 UTC</td>
                    <td className="py-3">Dr. Sarah Jenkins</td>
                    <td className="py-3">Read Case Notes</td>
                    <td className="py-3 font-mono">CASE-202611-8F3A</td>
                    <td className="py-3 text-emerald-600 font-bold">Authorized</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-mono">2026-11-04 20:30 UTC</td>
                    <td className="py-3">Dr. Sarah Jenkins</td>
                    <td className="py-3">Created Clinical Note</td>
                    <td className="py-3 font-mono">CASE-202611-2C9B</td>
                    <td className="py-3 text-emerald-600 font-bold">Authorized</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-mono">2026-11-04 18:12 UTC</td>
                    <td className="py-3">System Safeguarding Guard</td>
                    <td className="py-3">Suppressed Caregiver Notice (Harm Protocol)</td>
                    <td className="py-3 font-mono">CASE-202611-9X1L</td>
                    <td className="py-3 text-rose-600 font-bold">Enforced</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
