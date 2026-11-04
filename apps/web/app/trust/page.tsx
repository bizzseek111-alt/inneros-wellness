"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Heart,
  FileText,
  PhoneCall,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Info,
  Clock,
  Sparkles,
  BookOpen,
  EyeOff,
  UserCheck,
  Building2,
  Phone,
  Scale,
  Download,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";

interface SafeguardingRule {
  id: string;
  triggerCategory: string;
  actionTaken: string;
  notificationTarget: string;
  clinicalBoundary: string;
}

const SAFEGUARDING_MATRIX: SafeguardingRule[] = [
  {
    id: "RULE-01",
    triggerCategory: "Acute Self-Harm or Crisis Disclosure",
    actionTaken: "Instant conversation suspension, de-escalation prompt, emergency contacts displayed",
    notificationTarget: "Parent/Caregiver SMS & Portal Alert, Designated Safeguarding Officer",
    clinicalBoundary: "AI refuses psychiatric intervention; routes to human professional (Umang / 988)",
  },
  {
    id: "RULE-02",
    triggerCategory: "Caregiver Abuse or Domestic Endangerment Disclosure",
    actionTaken: "Conversation gently safely diverted; standard parent alert SUPPRESSED",
    notificationTarget: "Direct escalation to Punjab Child Protection & Welfare Bureau (CPWB 1121)",
    clinicalBoundary: "Strict suppression of caregiver notice to prevent immediate domestic retaliation",
  },
  {
    id: "RULE-03",
    triggerCategory: "Classroom Peer Conflict / School Anxiety",
    actionTaken: "Socratic empathy scaffolding; non-diagnostic observation log generated",
    notificationTarget: "Teacher Studio Observation Queue & Parent Weekly Summary",
    clinicalBoundary: "No pathological labels (e.g. 'conduct disorder'); factual behavioral notes only",
  },
  {
    id: "RULE-04",
    triggerCategory: "Commercial Solicitation or PII Extraction Attempt",
    actionTaken: "Zero PII logging, automatic redacting of phone numbers, addresses, school names",
    notificationTarget: "Security Audit Telemetry (Anonymized)",
    clinicalBoundary: "Strict zero-data-monetization architecture; no behavioral advertising profiles",
  },
];

export default function TrustAndSafetyPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(id);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  return (
    <MarketingShell>
      <div className="bg-[#F8FAFC] min-h-screen pb-24 text-slate-800">
        {/* Hero Header */}
        <div className="bg-gradient-to-b from-[#EEF4FF] via-[#F8FAFC] to-[#F8FAFC] border-b border-indigo-100/60 pt-16 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safety-First Architecture &bull; Ethical AI Disclosure</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Trust, Safety &amp; Safeguarding
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
              Our verifiable commitment to children&apos;s physical safety, psychological wellbeing, absolute data privacy, and ethical AI in Pakistan and globally.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                href="/documents?doc=child-safeguarding"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#2B4CDE] text-white hover:bg-blue-700 text-sm font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Download Safeguarding Policy (PDF)</span>
              </Link>
              <Link
                href="/demos"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 text-sm font-semibold transition-all shadow-xs"
              >
                <Shield className="w-4 h-4 text-[#2B4CDE]" />
                <span>Explore Interactive Demos</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Emergency Hotlines Floating Banner */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
          <div className="bg-white rounded-2xl border-2 border-rose-200 shadow-xl p-5 sm:p-7 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>Immediate Crisis &amp; Child Protection Escalation</span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-xs font-bold uppercase">24/7 Available</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  If a child is in immediate danger or distress, contact verified human crisis support immediately. Weebly is an educational companion, never a medical or emergency intervention service.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0">
              {/* Pakistan CPWB 1121 */}
              <div className="flex-1 sm:flex-none p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Punjab CPWB Helpline</div>
                  <div className="text-lg font-black text-rose-900">1121</div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard("1121", "cpwb")}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
                >
                  {copiedNumber === "cpwb" ? "Copied!" : "Call 1121"}
                </button>
              </div>

              {/* Umang Mental Health Helpline */}
              <div className="flex-1 sm:flex-none p-3 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider">Umang Pakistan</div>
                  <div className="text-sm font-black text-indigo-950">0311-7786264</div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard("03117786264", "umang")}
                  className="px-3 py-1.5 rounded-lg bg-[#2B4CDE] hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                >
                  {copiedNumber === "umang" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Core Seven Safeguarding Pillars */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-16">

          {/* Section 1: Child-Centered Design */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 text-emerald-600">
              <Heart className="w-7 h-7" />
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Pillar 1 &bull; Safe Environment
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              1. Child-Centered Design: Wholesome, Ad-Free &amp; Calm
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              Children deserve spaces designed for their natural development rather than commercial engagement maximization. Weebly is fundamentally engineered to safeguard attention, prevent cognitive fatigue, and foster real-world agency.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">0%</div>
                <h4 className="font-bold text-slate-900">Zero Commercial Ads</h4>
                <p className="text-sm text-slate-600">No banner ads, pop-ups, sponsored content, or product placements anywhere across child interfaces.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <Clock className="w-8 h-8 text-indigo-600" />
                <h4 className="font-bold text-slate-900">Gentle Time Boundaries</h4>
                <p className="text-sm text-slate-600">Default 25-minute soft breaks with Kai and Mia encouraging physical movement, hydration, and restful eye breaks.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <EyeOff className="w-8 h-8 text-amber-600" />
                <h4 className="font-bold text-slate-900">No Dark Patterns</h4>
                <p className="text-sm text-slate-600">No manipulative streak penalties, artificial urgency timers, loot-boxes, or psychological hooks designed to keep children glued.</p>
              </div>
            </div>
          </section>

          {/* Section 2: Clear AI Disclosure */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 text-indigo-600">
              <Sparkles className="w-7 h-7" />
              <span className="text-xs font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                Pillar 2 &bull; Honest Artificial Intelligence
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              2. Clear AI Disclosure: Honest, Transparent Companionship
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              Children and caregivers must always know without ambiguity when they are interacting with artificial intelligence. Weebly companions explicitly affirm their synthetic nature and celebrate human relationships.
            </p>
            <div className="bg-indigo-50/70 rounded-2xl border border-indigo-100 p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                <div className="space-y-1 text-sm text-indigo-950">
                  <div className="font-bold">Explicit AI Self-Identity in Every Prompt:</div>
                  <p className="leading-relaxed">
                    Kai, Mia, Lumi, and Zayn never claim to have biological bodies, real feelings, or sentience. They say: <em className="font-semibold">&ldquo;I&apos;m Kai, your AI learning buddy! I run on computer code to help you explore science and math!&rdquo;</em>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-indigo-200/60 text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-indigo-900">Emotional Transparency</div>
                  <p>Characters do not simulate grief, rejection, or dependency. They do not say &ldquo;I missed you so much, I was sad without you&rdquo;.</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-indigo-200/60 text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-indigo-900">Fosters Real Human Connections</div>
                  <p>When children discuss difficult social situations, companions encourage speaking with parents, teachers, school counselors, or trusted elders.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Strict Non-Diagnostic Boundaries */}
          <section className="bg-white rounded-3xl border-2 border-amber-300 p-8 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 text-amber-600">
              <Scale className="w-7 h-7" />
              <span className="text-xs font-bold uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Pillar 3 &bull; Non-Clinical Boundary Invariant
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              3. Strict Non-Diagnostic Boundaries: Zero Psychiatric Labels
            </h2>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-700" />
              <span>Weebly NEVER generates psychiatric diagnoses, therapeutic prescriptions, or clinical pathology labels.</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-base">
              The distinction between educational scaffolding and medical diagnosis is absolute. Clinical psychiatric assessments require comprehensive, licensed in-person psychological evaluation. Weebly strictly confines its outputs to objective learning observations.
            </p>
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="min-w-full text-left text-sm divide-y divide-slate-200">
                <thead className="bg-slate-50 text-slate-700 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Prohibited in Weebly (Clinical / Pathological)</th>
                    <th className="py-3 px-4">Permitted in Weebly (Educational / Observational)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                  <tr>
                    <td className="py-3 px-4 text-rose-700 font-medium bg-rose-50/40">
                      &times; &ldquo;Student exhibits signs of Major Depressive Disorder or ADHD&rdquo;
                    </td>
                    <td className="py-3 px-4 text-emerald-800 font-medium bg-emerald-50/40">
                      &check; &ldquo;Student completed 2 science quests and paused during multi-step fractions&rdquo;
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-rose-700 font-medium bg-rose-50/40">
                      &times; &ldquo;Prescribing 30 minutes of CBT behavioral modification therapy&rdquo;
                    </td>
                    <td className="py-3 px-4 text-emerald-800 font-medium bg-emerald-50/40">
                      &check; &ldquo;Offering breathing rhythm visualizer (Lumi Calm Box) to practice deep exhalation&rdquo;
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-rose-700 font-medium bg-rose-50/40">
                      &times; &ldquo;Predicting psychiatric risk scores or developmental delays&rdquo;
                    </td>
                    <td className="py-3 px-4 text-emerald-800 font-medium bg-emerald-50/40">
                      &check; &ldquo;Highlighting vocabulary growth in Urdu stories and story adventure completion&rdquo;
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: Data Handling & Zero PII Guarantee */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 text-sky-600">
              <Lock className="w-7 h-7" />
              <span className="text-xs font-bold uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                Pillar 4 &bull; Cryptographic Privacy
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              4. Data Handling &amp; Zero PII Guarantee: Minimal Footprint
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              Student privacy is guaranteed through structural software architecture, not just legal promises. All data storage adheres to strict minimization principles.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 text-slate-900 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Automated Voice Audio Purge</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Voice audio recordings are processed ephemeral in-memory for speech-to-text. Raw audio buffers are purged within 90 seconds. Weebly does NOT train public foundation models on student voice or transcripts.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 text-slate-900 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Zero Student Data Monetization</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Weebly never sells, leases, or trades student, parent, or school data. No third-party marketing SDKs, trackers, or behavioral profiling tools are loaded in child or school sessions.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 text-slate-900 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Field-Level Encryption (AES-256)</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Caregiver observation notes and student profiles utilize AES-256-GCM encryption at rest with tenant-isolated database keys. Transmissions enforce TLS 1.3 with strict HSTS.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 text-slate-900 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Right to Immediate Erasure</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Parents and schools maintain unconditional data deletion controls. One-click purge irreversibly scrubs child profile logs, activity histories, and observation diaries.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: School Access Controls */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 text-purple-600">
              <Building2 className="w-7 h-7" />
              <span className="text-xs font-bold uppercase tracking-wider bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                Pillar 5 &bull; Institutional Sandboxing
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              5. School Access Controls: Secure Multi-Tenant Governance
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              Schools in Punjab deploy Weebly in hermetically isolated organizational sandboxes. Student records, curriculum assignments, and teacher observations remain strictly contained within the school boundary.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-5 rounded-2xl border border-slate-200 space-y-2">
                <UserCheck className="w-7 h-7 text-purple-600" />
                <h4 className="font-bold text-slate-900">Role-Based Access (RBAC)</h4>
                <p className="text-xs text-slate-600">Teachers access only their assigned classroom rosters. Campus principals view aggregate grade-level trends with k &ge; 5 anonymization.</p>
              </div>
              <div className="p-5 rounded-2xl border border-slate-200 space-y-2">
                <FileText className="w-7 h-7 text-purple-600" />
                <h4 className="font-bold text-slate-900">Immutable Audit Logging</h4>
                <p className="text-xs text-slate-600">Every teacher query, curriculum assignment, and student score revision is recorded in append-only cryptographic audit logs.</p>
              </div>
              <div className="p-5 rounded-2xl border border-slate-200 space-y-2">
                <Lock className="w-7 h-7 text-purple-600" />
                <h4 className="font-bold text-slate-900">Campus Tenant Isolation</h4>
                <p className="text-xs text-slate-600">Cross-tenant queries are blocked at the ORM layer. Oakridge Lahore North cannot inspect Oakridge Lahore West data without explicit federation.</p>
              </div>
            </div>
          </section>

          {/* Section 6: Human Safeguarding Protocols & CPWB 1121 */}
          <section className="bg-white rounded-3xl border-2 border-rose-300 p-8 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 text-rose-600">
              <ShieldAlert className="w-7 h-7" />
              <span className="text-xs font-bold uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                Pillar 6 &bull; Child Protection Protocol
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              6. Human Safeguarding Protocols &amp; Punjab CPWB 1121 Integration
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              Automated safety circuit breakers inspect child conversations in real-time. When a critical safety trigger is tripped, execution halts and designated human authorities are notified according to protocol.
            </p>

            {/* Safeguarding Matrix Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl mt-4">
              <table className="min-w-full text-left text-xs sm:text-sm divide-y divide-slate-200">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Trigger Category</th>
                    <th className="py-3 px-4">Platform Action</th>
                    <th className="py-3 px-4">Target Recipient</th>
                    <th className="py-3 px-4">Clinical Boundary Rule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                  {SAFEGUARDING_MATRIX.map((rule) => (
                    <tr key={rule.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-bold text-slate-900">{rule.triggerCategory}</td>
                      <td className="py-3 px-4 text-slate-600">{rule.actionTaken}</td>
                      <td className="py-3 px-4 text-indigo-700 font-semibold">{rule.notificationTarget}</td>
                      <td className="py-3 px-4 text-rose-700 font-medium">{rule.clinicalBoundary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Caregiver Harm Exception Callout */}
            <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2 text-sm text-rose-950">
              <div className="font-bold flex items-center gap-2 text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Special Protocol: Caregiver Harm &amp; Domestic Endangerment Exception</span>
              </div>
              <p className="leading-relaxed">
                Standard parental notification represents a critical child-protection hazard when a minor reports physical abuse, violence, or neglect occurring at the hands of a primary caregiver. In these specific circumstances, <strong>standard parent notification is actively suppressed</strong> and the case is forwarded directly to certified child safeguarding specialists and the <strong>Punjab Child Protection &amp; Welfare Bureau (Helpline 1121)</strong> to prevent retaliatory violence against the minor.
              </p>
            </div>
          </section>

          {/* Section 7: Truth in Compliance */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 text-emerald-600">
              <CheckCircle2 className="w-7 h-7" />
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Pillar 7 &bull; Truth in Compliance
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              7. Truth in Compliance: Architectural Integrity vs. Marketing Fiction
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              Weebly operates with complete regulatory honesty. We explicitly distinguish between our implemented software engineering controls, our design alignments with international standards, and active regulatory filings.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                <div className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wide inline-block">
                  Verified Technical Controls
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Implemented &amp; Auditable</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Zero third-party trackers, 90-second audio purge, bcrypt hashed passwords, role-based database constraints, anti-injection XML chunk delimiters, and CPWB 1121 emergency handlers.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-200 space-y-2">
                <div className="px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 font-bold text-xs uppercase tracking-wide inline-block">
                  Architectural Alignment
                </div>
                <h4 className="font-bold text-slate-900 text-sm">COPPA &amp; FERPA Principles</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Parental consent gating, institutional directory data protection, and WCAG 2.1 AA accessibility are designed into the core schema according to international child safety frameworks.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                <div className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 font-bold text-xs uppercase tracking-wide inline-block">
                  Transparent Regulatory Status
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Pakistan Institutional Filings</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Weebly pilot agreements are tailored for Punjab school districts in coordination with local school leadership, without misleading claims of global unverified governmental certifications.
                </p>
              </div>
            </div>
          </section>

          {/* Institutional Trust CTA Card */}
          <div className="rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Review Our Formal School Safeguarding Protocol
              </h3>
              <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
                Download the complete 12-page Safeguarding &amp; Institutional Compliance Briefing prepared for Punjab school administrators and education boards.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <Link
                href="/documents?doc=child-safeguarding"
                className="px-6 py-3.5 rounded-xl bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-all shadow-md text-sm"
              >
                Download Safeguarding Brief (PDF)
              </Link>
              <Link
                href="/schools/pilot"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition-all text-sm"
              >
                View Punjab School Pilot
              </Link>
            </div>
          </div>

        </div>
      </div>
    </MarketingShell>
  );
}
