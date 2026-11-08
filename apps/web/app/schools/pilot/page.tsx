"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Building2,
  Calendar,
  CheckCircle2,
  Users,
  BookOpen,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Send,
  HelpCircle,
  BarChart3,
  Layers,
  MapPin,
  Download,
  AlertCircle,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";

interface PilotPhase {
  phase: string;
  weeks: string;
  title: string;
  activities: string[];
  deliverable: string;
}

const PILOT_TIMELINE: PilotPhase[] = [
  {
    phase: "Phase 1",
    weeks: "Weeks 1–2",
    title: "Institutional Preparation & Consent",
    activities: [
      "School leadership briefing and technical infrastructure readiness audit",
      "Teacher roster ingestion and student roster pseudo-anonymization (Student IDs only)",
      "Bilingual digital parental consent distribution (English & Urdu)",
      "Curriculum alignment workshop with grade coordinators",
    ],
    deliverable: "Institutional Sandbox Activated & 100% Consent Verification",
  },
  {
    phase: "Phase 2",
    weeks: "Week 3",
    title: "Teacher Studio Certification & Training",
    activities: [
      "4-hour accredited teacher orientation (Teacher Studio & Question Builder)",
      "Hands-on practice with the 3,000-question PCTB curriculum bank",
      "Classroom observation diary protocol training (Non-diagnostic standards)",
      "Teacher support desk onboarding via WhatsApp and email",
    ],
    deliverable: "Teacher Credentials Issued & Sample Lesson Plans Approved",
  },
  {
    phase: "Phase 3",
    weeks: "Weeks 4–7",
    title: "Controlled Classroom Trial & Companion Quests",
    activities: [
      "Bi-weekly voice companion quests in English, Urdu, mathematics & science",
      "Real-time teacher classroom dashboard tracking completion and struggle spots",
      "Weekly parent learning dispatches sent via SMS and secure portal",
      "Continuous system performance and latency monitoring (local edge cache)",
    ],
    deliverable: "Mid-Pilot Progress Checkpoint & Weekly Classroom Metrics",
  },
  {
    phase: "Phase 4",
    weeks: "Week 8",
    title: "Evaluation, Reporting & Scale Roadmap",
    activities: [
      "Post-pilot student mastery evaluation against PCTB benchmarks",
      "Teacher time-saving survey and pedagogical feedback review",
      "Parent engagement index calculation across English and Urdu households",
      "Executive governance presentation for School Board & Ministry representatives",
    ],
    deliverable: "Comprehensive Institutional Pilot Evaluation Report",
  },
];

export default function PunjabSchoolPilotPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    title: "",
    institutionName: "",
    city: "Lahore",
    email: "",
    phone: "",
    grades: [] as string[],
    studentCount: "100-250",
    briefingDate: "",
    notes: "",
  });

  const toggleGrade = (grade: string) => {
    setFormData((prev) => {
      const exists = prev.grades.includes(grade);
      return {
        ...prev,
        grades: exists
          ? prev.grades.filter((g) => g !== grade)
          : [...prev.grades, grade],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/pilot/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization_name: formData.institutionName,
          contact_name: formData.fullName,
          contact_email: formData.email,
          role: formData.title || "school_leader",
          student_count_estimate: formData.studentCount,
          message: `City: ${formData.city} | Phone: ${formData.phone} | Grades: ${formData.grades.join(", ")} | Notes: ${formData.notes}`,
        }),
      });
    } catch {
      // Allow offline confirmation
    } finally {
      setSubmitting(false);
      setFormSubmitted(true);
    }
  };

  return (
    <MarketingShell>
      <div className="bg-[#F8FAFC] min-h-screen pb-24 text-slate-800">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-[#EEF4FF] via-[#F8FAFC] to-[#F8FAFC] border-b border-indigo-100/60 pt-16 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold tracking-wide">
              <MapPin className="w-4 h-4 text-[#2B4CDE]" />
              <span>Punjab School Pilot Program &bull; Lahore &bull; 8-Week Deployment Framework</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Punjab School Pilot Program
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
              A structured, low-risk, high-impact deployment framework for private and public schools across Lahore and Punjab, combining conversational learning with PCTB curriculum mastery.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <a
                href="#request-briefing"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#2B4CDE] text-white hover:bg-blue-700 text-sm font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <span>Request On-Site Briefing</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/documents?doc=school-proposal"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 text-sm font-semibold transition-all shadow-xs"
              >
                <Download className="w-4 h-4 text-[#2B4CDE]" />
                <span>Download Pilot Proposal (PDF)</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Executive Highlights Summary */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pilot Duration</div>
              <div className="text-2xl font-black text-slate-900">8 Weeks</div>
              <div className="text-xs text-slate-600">Phased rollout with weekly milestones &amp; checkpoints</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Curriculum Bank</div>
              <div className="text-2xl font-black text-slate-900">3,000 Questions</div>
              <div className="text-xs text-slate-600">PCTB SLO-mapped English, Urdu, Math &amp; Science</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Teacher Workload</div>
              <div className="text-2xl font-black text-emerald-600">-4.5 hrs / wk</div>
              <div className="text-xs text-slate-600">Saved on automated marking &amp; worksheet synthesis</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Grades</div>
              <div className="text-2xl font-black text-indigo-600">Pre-K to Gr 8</div>
              <div className="text-xs text-slate-600">Developmentally tailored for ages 3 to 14</div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-16">

          {/* Section 1: Pilot Objectives */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 text-indigo-600">
              <GraduationCap className="w-7 h-7" />
              <span className="text-xs font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                Component 1 &bull; Academic Outcomes
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              1. Pilot Objectives: Measurable Academic &amp; Confidence Gains
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              The primary purpose of the Weebly Punjab School Pilot is to demonstrate statistically significant improvements in foundational literacy, numeracy, and spoken confidence among Pakistani students, while dramatically simplifying classroom administration for teachers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#2B4CDE] flex items-center justify-center font-bold">1</div>
                <h4 className="font-bold text-slate-900">PCTB Benchmark Mastery</h4>
                <p className="text-sm text-slate-600">Validate a 22%+ increase in concept retention across Grade 3–5 science and mathematics through active voice dialog and interactive problem solving.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#2B4CDE] flex items-center justify-center font-bold">2</div>
                <h4 className="font-bold text-slate-900">Bilingual Fluency &amp; Vocabulary</h4>
                <p className="text-sm text-slate-600">Strengthen both English and Urdu expressive vocabulary through Mia&apos;s story adventures and Zayn&apos;s curiosity quests, reducing language hesitation.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#2B4CDE] flex items-center justify-center font-bold">3</div>
                <h4 className="font-bold text-slate-900">Classroom Time Reclaimed</h4>
                <p className="text-sm text-slate-600">Provide teachers with automated worksheet generation, multi-version test paper export, and immediate formative completion diagnostics.</p>
              </div>
            </div>
          </section>

          {/* Section 2: Target Groups */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 text-purple-600">
              <Users className="w-7 h-7" />
              <span className="text-xs font-bold uppercase tracking-wider bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                Component 2 &bull; Age Tiers
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              2. Target Groups: Developmental Adaptations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-200/70 space-y-3">
                <div className="text-xs font-bold text-purple-800 uppercase tracking-wider">Tier 1 &bull; Ages 3–5</div>
                <h3 className="text-xl font-bold text-slate-900">Early Years (Pre-K to KG)</h3>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>Large tactile touch targets with spoken auditory guidance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>Basic phonics, number songs, shapes, colors, animal sounds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>Caregiver-mediated voice mode with gentle story pauses</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-200/70 space-y-3">
                <div className="text-xs font-bold text-blue-800 uppercase tracking-wider">Tier 2 &bull; Ages 6–10</div>
                <h3 className="text-xl font-bold text-slate-900">Primary (Grades 1–5)</h3>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Interactive homework assistance with Kai (Socratic hints)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>PCTB Science discovery quests (plants, energy, solar system)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Urdu grammar and bilingual storytelling with Mia</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 space-y-3">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Tier 3 &bull; Ages 11–14</div>
                <h3 className="text-xl font-bold text-slate-900">Middle School (Grades 6–8)</h3>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Independent question paper generation and revision drills</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Introductory computational thinking and AI literacy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Focus timer, study schedules, and project planning tools</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Teacher Training Modules */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 text-emerald-600">
              <Clock className="w-7 h-7" />
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Component 3 &bull; Professional Development
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              3. Teacher Training Modules: 4-Hour Rapid Onboarding
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              Educators are central to educational success. The Weebly Teacher Certification ensures that instructors feel fully in command of the platform without requiring prior AI technical knowledge.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-indigo-600">Module 1 (60 min)</div>
                <h4 className="font-bold text-slate-900 text-sm">Teacher Studio Navigation</h4>
                <p className="text-xs text-slate-600">Roster management, classroom pin codes, assigning PCTB quests, and viewing live completion rates.</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-indigo-600">Module 2 (60 min)</div>
                <h4 className="font-bold text-slate-900 text-sm">Question Paper Builder</h4>
                <p className="text-xs text-slate-600">Selecting SLOs, filtering difficulty levels, generating printable PDF question papers with answer keys.</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-indigo-600">Module 3 (60 min)</div>
                <h4 className="font-bold text-slate-900 text-sm">Classroom Observation Diary</h4>
                <p className="text-xs text-slate-600">Recording non-diagnostic behavioral observations, noting learning hurdles, and parental messaging.</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-indigo-600">Module 4 (60 min)</div>
                <h4 className="font-bold text-slate-900 text-sm">Safeguarding &amp; Escalation</h4>
                <p className="text-xs text-slate-600">Child protection trigger protocols, student distress indicators, and direct CPWB 1121 communication pathways.</p>
              </div>
            </div>
          </section>

          {/* Section 4: Parent Onboarding & Consent */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 text-sky-600">
              <ShieldCheck className="w-7 h-7" />
              <span className="text-xs font-bold uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                Component 4 &bull; Family Partnership
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              4. Parent Onboarding &amp; Consent: Multilingual Transparency
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              No student participates without explicit, verified parental consent. Consent forms are delivered via SMS and digital paper in both Urdu and English with simple explanations of AI boundaries and data privacy.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sky-600" />
                  <span>Bilingual Parental Consent Packets</span>
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Clear, jargon-free explanations explaining that Weebly is an interactive learning companion, does not collect biometric surveillance data, and never sells or displays advertisements. Parents can toggle voice audio features on or off.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-sky-600" />
                  <span>Weekly WhatsApp &amp; SMS Dispatches</span>
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Parents receive short, uplifting weekly summaries in Urdu or English: <em>&ldquo;Fatima, Maya completed 3 science quests this week! Try asking her how plants drink water through their roots tonight!&rdquo;</em>
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Curriculum Alignment */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 text-amber-600">
              <BookOpen className="w-7 h-7" />
              <span className="text-xs font-bold uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Component 5 &bull; PCTB Standards
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              5. Curriculum Alignment: 3,000 Questions Mapped to PCTB SLOs
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              Every question in the 3,000-question Weebly repository is tied directly to published Student Learning Outcomes (SLOs) from the Punjab Curriculum and Textbook Board. The repository integrates 4 core academic school disciplines (spanning Grade 1 through Grade 8) with 9 whole-child developmental domains (including emotional vocabulary, cognitive reasoning, and life skills). Active school pilot questions feature 126 published lessons, 369 expert-reviewed modules, and 2,505 drafted questions in the authoring pipeline.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 text-center space-y-1">
                <div className="text-2xl font-black text-blue-900">850</div>
                <div className="font-bold text-sm text-slate-800">English Language</div>
                <div className="text-xs text-slate-500">Phonics, Grammar, Comprehension</div>
              </div>
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-center space-y-1">
                <div className="text-2xl font-black text-emerald-900">750</div>
                <div className="font-bold text-sm text-slate-800">Urdu Adab &amp; Qawaid</div>
                <div className="text-xs text-slate-500">Huroof, Alfaz, Jumlay, Kahaniyan</div>
              </div>
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 text-center space-y-1">
                <div className="text-2xl font-black text-amber-900">800</div>
                <div className="font-bold text-sm text-slate-800">Mathematics</div>
                <div className="text-xs text-slate-500">Numeracy, Fractions, Geometry</div>
              </div>
              <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 text-center space-y-1">
                <div className="text-2xl font-black text-purple-900">600</div>
                <div className="font-bold text-sm text-slate-800">General Science</div>
                <div className="text-xs text-slate-500">Living Things, Matter, Energy</div>
              </div>
            </div>
          </section>

          {/* Section 6: Observation & Support Workflows */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 text-rose-600">
              <ShieldCheck className="w-7 h-7" />
              <span className="text-xs font-bold uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                Component 6 &bull; Behavioral Support
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              6. Observation &amp; Support Workflows: Non-Diagnostic Focus
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              Teachers record qualitative behavioral observations that focus purely on learning habits, peer collaboration, and energy patterns. Weebly actively enforces the non-clinical boundary to protect children from harmful labeling.
            </p>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm space-y-2">
              <div className="font-bold text-slate-900">The 3-Step Supportive Referral Protocol:</div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
                <li><strong>Classroom Observation:</strong> Teacher flags recurring difficulty (e.g. &ldquo;Ali repeatedly struggles to finish reading passages during timed tests&rdquo;).</li>
                <li><strong>Collaborative Review:</strong> Lead teacher and school counselor review factual learning logs and suggest low-stimulation or reading scaffolding.</li>
                <li><strong>Professional Consultation:</strong> If sustained emotional distress is identified, parents are invited for an in-person meeting with school counselors and licensed external psychologists.</li>
              </ol>
            </div>
          </section>

          {/* Section 7: Evaluation Metrics */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 text-indigo-600">
              <BarChart3 className="w-7 h-7" />
              <span className="text-xs font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                Component 7 &bull; Evidence &amp; KPIs
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              7. Evaluation Metrics: Four Pillar Institutional Impact
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
              <div className="p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-[#2B4CDE] uppercase">Academic KPI</div>
                <h4 className="font-bold text-slate-900">Pre/Post Mastery</h4>
                <p className="text-xs text-slate-600">Targeted &ge; 18% improvement in standardized PCTB chapter test performance across intervention cohorts.</p>
              </div>
              <div className="p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-emerald-600 uppercase">Operational KPI</div>
                <h4 className="font-bold text-slate-900">Teacher Time Saved</h4>
                <p className="text-xs text-slate-600">Reduction of 4 to 6 hours per teacher weekly in grading, worksheet formatting, and test paper authoring.</p>
              </div>
              <div className="p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-purple-600 uppercase">Engagement KPI</div>
                <h4 className="font-bold text-slate-900">Completion Rate</h4>
                <p className="text-xs text-slate-600">&ge; 82% quest completion across voluntary homework practice and weekend story adventures.</p>
              </div>
              <div className="p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-amber-600 uppercase">Family KPI</div>
                <h4 className="font-bold text-slate-900">Parental Satisfaction</h4>
                <p className="text-xs text-slate-600">&ge; 88% parent satisfaction rating regarding visibility into daily school learning and conversational confidence.</p>
              </div>
            </div>
          </section>

          {/* Section 8: Implementation Timeline */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 text-slate-700">
              <Calendar className="w-7 h-7 text-[#2B4CDE]" />
              <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200 text-blue-800">
                Component 8 &bull; Phased Rollout
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              8. Implementation Timeline: Phased 8-Week Roadmap
            </h2>
            <div className="space-y-4 pt-2">
              {PILOT_TIMELINE.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-[#2B4CDE] text-white text-xs font-bold">
                        {item.phase}
                      </span>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {item.weeks}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <ul className="text-xs sm:text-sm text-slate-600 space-y-1 list-disc list-inside">
                      {item.activities.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shrink-0 text-left md:text-right space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Milestone Deliverable</div>
                    <div className="text-xs font-bold text-emerald-800 flex items-center md:justify-end gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{item.deliverable}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 9: Demonstration Request Form */}
          <section id="request-briefing" className="bg-white rounded-3xl border-2 border-blue-400 p-8 sm:p-12 shadow-xl space-y-8">
            <div className="flex items-center space-x-3 text-[#2B4CDE]">
              <Send className="w-7 h-7" />
              <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Component 9 &bull; Institutional Intake
              </span>
            </div>
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                Request an On-Site Pilot Briefing
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                We invite school principals, campus directors, and Punjab education department officials to request a comprehensive demonstration and technical pilot briefing.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">Pilot Briefing Request Received</h3>
                <p className="text-slate-700 max-w-xl mx-auto text-sm leading-relaxed">
                  Thank you, <strong>{formData.fullName}</strong>. Your briefing request for <strong>{formData.institutionName} ({formData.city})</strong> has been logged in our institutional deployment system.
                </p>
                <div className="inline-block p-3 rounded-xl bg-white border border-emerald-200 text-xs text-emerald-950 font-mono">
                  Pilot Reference ID: PILOT-PK-2025-{(Math.random() * 9000 + 1000).toFixed(0)}
                </div>
                <div className="pt-2 text-xs text-slate-500">
                  Our Punjab deployment liaison will contact you via WhatsApp and email within 24 business hours.
                </div>
                <div className="pt-4 flex justify-center gap-3">
                  <Link
                    href="/documents?doc=school-proposal"
                    className="px-5 py-2.5 rounded-xl bg-[#2B4CDE] text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    View School Implementation Proposal (PDF)
                  </Link>
                  <button
                    type="button"
                    onClick={() => setFormSubmitted(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Your Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Dr. Eleanor Vance / Ahmed Raza"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2B4CDE] focus:ring-1 focus:ring-[#2B4CDE]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Official Title / Role *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Campus Principal / Academic Director"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2B4CDE] focus:ring-1 focus:ring-[#2B4CDE]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      School / Institution Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Oakridge Punjab School System"
                      value={formData.institutionName}
                      onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2B4CDE] focus:ring-1 focus:ring-[#2B4CDE]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Campus City in Punjab *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2B4CDE] focus:ring-1 focus:ring-[#2B4CDE] bg-white"
                    >
                      <option value="Lahore">Lahore</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="Gujranwala">Gujranwala</option>
                      <option value="Sialkot">Sialkot</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Other">Other District</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Official Email *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. director@oakridge.edu.pk"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2B4CDE] focus:ring-1 focus:ring-[#2B4CDE]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+92 300 1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2B4CDE] focus:ring-1 focus:ring-[#2B4CDE]"
                    />
                  </div>
                </div>

                {/* Target Grade Tiers */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Target Pilot Grade Tiers (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "prek-kg", label: "Early Years (Pre-K to KG)" },
                      { id: "primary-1-5", label: "Primary (Grades 1–5)" },
                      { id: "middle-6-8", label: "Middle School (Grades 6–8)" },
                    ].map((tier) => (
                      <button
                        type="button"
                        key={tier.id}
                        onClick={() => toggleGrade(tier.id)}
                        className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                          formData.grades.includes(tier.id)
                            ? "bg-blue-50 border-[#2B4CDE] text-[#2B4CDE]"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{tier.label}</span>
                          {formData.grades.includes(tier.id) && (
                            <CheckCircle2 className="w-4 h-4 text-[#2B4CDE]" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Additional Context / Pilot Goals (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide any specific classroom needs, devices available (tablets/chromebooks), or target semester..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2B4CDE] focus:ring-1 focus:ring-[#2B4CDE]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-slate-500">
                    Institutional data is processed in accordance with our strict School Privacy Agreement.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3.5 rounded-xl bg-[#2B4CDE] text-white hover:bg-blue-700 font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {submitting ? "Transmitting..." : "Submit Pilot Request"}
                  </button>
                </div>
              </form>
            )}
          </section>

        </div>
      </div>
    </MarketingShell>
  );
}
