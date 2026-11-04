"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import {
  GraduationCap,
  BookOpen,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  School,
  Sparkles,
  Heart,
  Sliders,
  FileText,
  Mail
} from "lucide-react";

export default function SchoolsPage() {
  const [inquirySent, setInquirySent] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [workEmail, setWorkEmail] = useState("");

  const CLASSROOM_PROGRAMMES = [
    {
      title: "Morning Emotional Co-Regulation",
      ages: "Ages 4–11",
      desc: "5-minute somatic breathing exercises and visual feeling check-ins to transition smoothly from playground to desk.",
      badge: "Tier 1 Universal"
    },
    {
      title: "Neurodiversity Inclusive Classrooms",
      ages: "Ages 5–16",
      desc: "ADHD task chunking schedules, autism low-stimulation adjustments, and AAC communication aids for non-speaking students.",
      badge: "Universal Design for Learning"
    },
    {
      title: "Adolescent Digital Well-Being & Stress",
      ages: "Ages 12–18",
      desc: "Evidence-based curriculum on navigating peer dynamics, exam anxiety, sleep hygiene, and cyber-boundary protection.",
      badge: "CASEL Aligned"
    }
  ];

  return (
    <MarketingShell>
      <div className="bg-[#FAF9F5] min-h-screen text-[#1E293B]">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F0] bg-gradient-to-b from-[#F0FDF4] to-[#FAF9F5]">
          <div className="max-w-6xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-[#CBD5E1] shadow-xs text-xs font-semibold text-[#15803D]">
              <School className="w-4 h-4 text-[#15803D]" />
              <span>Institutional School Programme &amp; Classroom Accommodations</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] max-w-4xl mx-auto leading-tight">
              Calm, inclusive classrooms where every learner feels understood.
            </h1>

            <p className="text-lg sm:text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed">
              Equip your educators with research-backed social-emotional learning activities, ADHD-friendly task breakdown templates, and zero-PII student privacy protections.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/school/portal"
                className="px-8 py-3.5 rounded-full bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-md transition-all inline-flex items-center space-x-2"
              >
                <span>Access School Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/teacher/dashboard"
                className="px-8 py-3.5 rounded-full bg-[#15803D] text-white font-semibold text-sm hover:bg-[#166534] shadow-md transition-all inline-flex items-center space-x-2"
              >
                <span>Teacher Hub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#inquiry"
                className="px-8 py-3.5 rounded-full bg-white text-[#15803D] font-semibold text-sm hover:bg-[#F1F5F9] border border-[#CBD5E1] shadow-xs transition-all"
              >
                Institutional Pilot Inquiry
              </a>
            </div>
          </div>
        </section>

        {/* Classroom Pillars */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              Designed for busy educators and diverse classrooms
            </h2>
            <p className="text-base text-[#64748B] max-w-xl mx-auto">
              Our curriculum integrates seamlessly into homeroom periods and advisory blocks without increasing grading burdens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CLASSROOM_PROGRAMMES.map((prog, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {prog.badge}
                </span>
                <h3 className="text-lg font-bold text-[#0F172A]">{prog.title}</h3>
                <p className="text-xs font-semibold text-[#0F766E]">{prog.ages}</p>
                <p className="text-sm text-[#475569] leading-relaxed">{prog.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Accommodation Guides for Special Needs */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto bg-white rounded-3xl border border-[#CBD5E1] shadow-xs my-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#15803D]">Educator Toolkit</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                Classroom Accommodation Suggestions Without Stigma
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Download printable First/Then boards, visual transition cards, and sensory overload de-escalation scripts tested in public and private school environments.
              </p>
              <ul className="space-y-2 text-sm text-[#334155]">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Universal Design for Learning (UDL) framework alignment</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Multilingual support: English, Urdu, and Shahmukhi Punjabi handouts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero student health records stored on school servers</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <span className="text-xs font-bold text-[#0F172A]">Sample Classroom Card</span>
                <span className="text-xs text-[#059669] font-medium">Ready to Print</span>
              </div>
              <p className="text-sm font-semibold text-[#0F172A]">First: Math Warm-Up (10 min) &rarr; Then: 2-Minute Desk Stretch</p>
              <p className="text-xs text-[#64748B]">
                &ldquo;When transitions feel abrupt, pair structured tasks with immediate somatic release.&rdquo;
              </p>
              <Link
                href="/teacher/dashboard"
                className="w-full py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-xs font-bold hover:bg-[#F1F5F9] transition-colors flex items-center justify-center space-x-1"
              >
                <span>View Full Teacher Library</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Institutional Inquiry Form */}
        <section id="inquiry" className="py-16 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto">
          <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#0F172A]">Request a School Pilot Pack</h3>
            <p className="text-sm text-[#64748B]">
              Inquire about pilot licenses for your district, academy, or homeschool cooperative.
            </p>

            {inquirySent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold">
                Thank you! Our education partnership team will contact you within 1 business day.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (schoolName && workEmail) setInquirySent(true);
                }}
                className="space-y-4 text-left"
              >
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">School / Organization Name</label>
                  <input
                    type="text"
                    required
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. Lahore Grammar School / Beaconhouse"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:border-[#15803D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    placeholder="teacher@school.edu"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:border-[#15803D]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#15803D] text-white font-semibold text-sm hover:bg-[#166534] shadow-md transition-all"
                >
                  Submit Pilot Inquiry
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
