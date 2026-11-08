"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  School,
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  BarChart3,
  Award,
  ShieldCheck,
  CheckCircle2,
  Download,
  Plus,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  Layers,
  Calendar,
  Clock,
  Compass,
  FileText,
  Sliders,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";

type SchoolTab =
  | "overview"
  | "campuses"
  | "teachers"
  | "classes"
  | "adoption"
  | "curriculum"
  | "outcomes"
  | "licenses";

export default function SchoolPortalPage() {
  const [activeTab, setActiveTab] = useState<SchoolTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampus, setSelectedCampus] = useState<string>("all");

  const CAMPUSES = [
    {
      id: "north",
      name: "Oakridge North Elementary",
      grades: "Pre-K to Grade 4",
      students: 420,
      teachers: 18,
      lead: "Dr. Eleanor Vance",
      adoptionRate: "94%",
      activeWorlds: ["Creative Studio", "Brain Quest", "Move & Play"],
    },
    {
      id: "west",
      name: "Oakridge West Intermediate",
      grades: "Grade 5 to Grade 8",
      students: 380,
      teachers: 16,
      lead: "Marcus Chen",
      adoptionRate: "89%",
      activeWorlds: ["Tech & Discovery", "Life & Friendship", "Brain Quest"],
    },
    {
      id: "pinecrest",
      name: "Pinecrest Early Learning Sanctuary",
      grades: "Toddler to Kindergarten",
      students: 190,
      teachers: 10,
      lead: "Amina Al-Mansoor",
      adoptionRate: "98%",
      activeWorlds: ["Move & Play", "Story Adventure"],
    },
  ];

  const TEACHERS = [
    {
      id: "t1",
      name: "Sarah Jenkins",
      campus: "Oakridge North Elementary",
      grade: "Grade 3",
      classroom: "Room 14 - Willow Room",
      joinCode: "WB-301",
      students: 24,
      weeklyMinutes: 84,
      lastActive: "15 mins ago",
    },
    {
      id: "t2",
      name: "Tariq Mahmood",
      campus: "Oakridge North Elementary",
      grade: "Grade 4",
      classroom: "Room 22 - Explorer Cohort",
      joinCode: "WB-402",
      students: 26,
      weeklyMinutes: 92,
      lastActive: "1 hour ago",
    },
    {
      id: "t3",
      name: "Elena Rostova",
      campus: "Oakridge West Intermediate",
      grade: "Grade 6",
      classroom: "Science Lab B",
      joinCode: "WB-608",
      students: 28,
      weeklyMinutes: 76,
      lastActive: "Today, 11:30 AM",
    },
    {
      id: "t4",
      name: "David Kim",
      campus: "Pinecrest Early Learning",
      grade: "Kindergarten",
      classroom: "Sunshine Cottage",
      joinCode: "WB-105",
      students: 18,
      weeklyMinutes: 110,
      lastActive: "Today, 9:15 AM",
    },
  ];

  const CURRICULUM_DOMAINS = [
    {
      domain: "Social-Emotional Competencies (CASEL)",
      standardsCovered: "5 of 5 Core Competencies",
      coveragePercent: 96,
      questionsCompleted: 4820,
      color: "bg-emerald-500",
    },
    {
      domain: "Early & Elementary Mathematics",
      standardsCovered: "Counting, Spatial Geometry, Multiplication & Division",
      coveragePercent: 92,
      questionsCompleted: 7340,
      color: "bg-amber-500",
    },
    {
      domain: "Phonics & Story Comprehension",
      standardsCovered: "Phonological Awareness, Narrative Recall, Moral Inference",
      coveragePercent: 88,
      questionsCompleted: 5190,
      color: "bg-purple-500",
    },
    {
      domain: "Science, Nature & AI Literacy",
      standardsCovered: "Ecosystems, Astronomy, Scientific Method, AI Concepts",
      coveragePercent: 84,
      questionsCompleted: 3950,
      color: "bg-sky-500",
    },
    {
      domain: "V10 AI Creator Academy & 5-Stage Learning Journeys",
      standardsCovered: "Watch → Learn → Play → Implement → Reflect, Visual Block Games & Story Studio",
      coveragePercent: 91,
      questionsCompleted: 2680,
      color: "bg-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#0F172A] flex flex-col selection:bg-amber-200">
      {/* Top Multi-Campus Administrative Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link
              href="/schools"
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
              title="Back to Schools overview"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-xs">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-black text-slate-900">
                  Oakridge Public School District
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Institutional Pilot
                </span>
              </div>
              <p className="text-xs text-slate-500">
                School Management Portal &bull; Academic Year 2026–2027
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/schools/onboarding"
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Onboarding Wizard</span>
            </Link>
            <Link
              href="/teacher/dashboard"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition-colors"
            >
              Teacher Classroom View
            </Link>
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>FERPA &amp; COPPA Aligned Architecture</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8 flex-1">
        {/* Simulated Demonstration Data Disclaimer */}
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 flex items-start space-x-3 shadow-2xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-sm text-amber-900 block">
              Simulated Institutional Demonstration Data
            </span>
            <p className="leading-relaxed text-amber-800">
              Oakridge Public School District, student enrollment figures (990), classroom rosters, and CASEL competency outcomes are illustrative demonstration data for pilot evaluation. Live district integrations connect via OneRoster / Clever with verified administrator authorization.
            </p>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-slate-200 gap-2 pb-1">
          {[
            { id: "overview", label: "School Overview", icon: School },
            { id: "campuses", label: "Campuses (3)", icon: Building2 },
            { id: "teachers", label: "Teachers & Staff", icon: Users },
            { id: "classes", label: "Classes & Cohorts", icon: GraduationCap },
            { id: "adoption", label: "Program Adoption", icon: BarChart3 },
            { id: "curriculum", label: "Curriculum Coverage", icon: BookOpen },
            { id: "outcomes", label: "Aggregate Outcomes", icon: Award },
            { id: "licenses", label: "Licenses & Roles", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as SchoolTab)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap flex items-center space-x-2 transition-all cursor-pointer ${
                  active
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            TAB 1: SCHOOL OVERVIEW
           ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-black uppercase">Enrolled Students</span>
                  <Users className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">990</div>
                <p className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>99% active seat utilization</span>
                </p>
              </div>

              <div className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-black uppercase">Active Classrooms</span>
                  <GraduationCap className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-3xl font-black text-slate-900">44</div>
                <p className="text-xs text-slate-500 font-medium">Across 3 district campuses</p>
              </div>

              <div className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-black uppercase">Avg. Weekly Time</span>
                  <Clock className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">86 mins</div>
                <p className="text-xs text-slate-500 font-medium">Per student learning pace</p>
              </div>

              <div className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-black uppercase">Curriculum Mastery</span>
                  <Award className="w-4 h-4 text-pink-500" />
                </div>
                <div className="text-3xl font-black text-slate-900">92.4%</div>
                <p className="text-xs text-emerald-600 font-bold">CASEL &amp; Academic alignment</p>
              </div>
            </div>

            {/* Campuses Summary */}
            <div className="p-8 rounded-[36px] bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 border border-slate-200 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">District Campus Network</h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Overview of active buildings, student cohorts, and primary learning worlds
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("campuses")}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-black hover:bg-slate-50 transition-colors inline-flex items-center space-x-1.5"
                >
                  <span>Manage All Campuses &rarr;</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {CAMPUSES.map((campus) => (
                  <div
                    key={campus.id}
                    className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-2xs space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-black text-slate-900">{campus.name}</h3>
                        <span className="text-xs text-slate-500 font-medium">{campus.grades}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800">
                        {campus.adoptionRate}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Students</span>
                        <strong className="text-slate-900 font-black">{campus.students}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Teachers</span>
                        <strong className="text-slate-900 font-black">{campus.teachers}</strong>
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Top Learning Worlds
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {campus.activeWorlds.map((w, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: CAMPUSES
           ========================================================================= */}
        {activeTab === "campuses" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">District Campuses &amp; Buildings</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Configured schools with dedicated cohort join rules and grade-level boundaries
                </p>
              </div>
              <button
                type="button"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black inline-flex items-center space-x-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add District Campus</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {CAMPUSES.map((c) => (
                <div
                  key={c.id}
                  className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">{c.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Principal / Lead: <strong className="text-slate-800">{c.lead}</strong> &bull; {c.grades}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {c.activeWorlds.map((w, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700">
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 shrink-0 border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Enrolled</span>
                      <strong className="text-lg font-black text-slate-900">{c.students}</strong>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Staff</span>
                      <strong className="text-lg font-black text-slate-900">{c.teachers}</strong>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Adoption</span>
                      <strong className="text-lg font-black text-emerald-600">{c.adoptionRate}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: TEACHERS & STAFF DIRECTORY
           ========================================================================= */}
        {activeTab === "teachers" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Assigned Classroom Teachers &amp; Educators</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Educators licensed to deploy classroom quests and view authorized student progress
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search educators..."
                    className="pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black inline-flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Invite Teacher</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[28px] border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-6">Educator</th>
                      <th className="py-3.5 px-6">Campus</th>
                      <th className="py-3.5 px-6">Grade / Room</th>
                      <th className="py-3.5 px-6">Join Code</th>
                      <th className="py-3.5 px-6">Students</th>
                      <th className="py-3.5 px-6">Weekly Avg</th>
                      <th className="py-3.5 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {TEACHERS.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-900">{t.name}</td>
                        <td className="py-4 px-6 text-slate-600">{t.campus}</td>
                        <td className="py-4 px-6 text-slate-600">
                          {t.grade} &bull; {t.classroom}
                        </td>
                        <td className="py-4 px-6">
                          <code className="px-2 py-0.5 rounded bg-slate-100 font-mono font-bold text-indigo-700">
                            {t.joinCode}
                          </code>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900">{t.students}</td>
                        <td className="py-4 px-6 text-slate-600">{t.weeklyMinutes} mins</td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {t.lastActive}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: CLASSES & COHORTS
           ========================================================================= */}
        {activeTab === "classes" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Active Classroom Cohorts</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Classrooms actively participating in Weebly learning worlds
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {TEACHERS.map((c) => (
                <div key={c.id} className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900">{c.classroom}</h3>
                      <p className="text-xs text-slate-500">{c.grade} &bull; {c.name}</p>
                    </div>
                    <code className="px-2.5 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-xs font-black">
                      {c.joinCode}
                    </code>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <span>{c.students} active learners</span>
                    <strong className="text-emerald-600 font-bold">{c.weeklyMinutes} mins / wk</strong>
                  </div>

                  <Link
                    href={`/teacher/dashboard?class=${c.joinCode}`}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black text-center transition-colors block"
                  >
                    View Classroom Dashboard &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: PROGRAM ADOPTION & ENGAGEMENT
           ========================================================================= */}
        {activeTab === "adoption" && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-8 rounded-[36px] bg-white border border-slate-200 shadow-2xs space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">District Adoption Analytics</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Aggregate daily active minutes and multi-lingual participation
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                  <span className="text-xs font-black text-amber-800 uppercase">Peak Engagement Window</span>
                  <div className="text-2xl font-black text-amber-950">8:30 AM – 10:15 AM</div>
                  <p className="text-xs text-slate-600 font-medium">Morning co-regulation and homeroom advisory</p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <span className="text-xs font-black text-emerald-800 uppercase">Multi-Dialect Usage</span>
                  <div className="text-2xl font-black text-emerald-950">34% Bilingual</div>
                  <p className="text-xs text-slate-600 font-medium">Students using English + Urdu/Punjabi audio</p>
                </div>

                <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
                  <span className="text-xs font-black text-indigo-800 uppercase">Class Completion Rate</span>
                  <div className="text-2xl font-black text-indigo-950">93.8%</div>
                  <p className="text-xs text-slate-600 font-medium">Students finishing assigned world tasks</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: CURRICULUM COVERAGE
           ========================================================================= */}
        {activeTab === "curriculum" && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-black text-slate-900">Curriculum &amp; Standard Coverage</h2>
              <p className="text-xs text-slate-500 font-medium">
                Detailed progress across CASEL frameworks and state academic expectations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {CURRICULUM_DOMAINS.map((dom, i) => (
                <div key={i} className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900">{dom.domain}</h3>
                      <p className="text-xs text-slate-500 font-medium">{dom.standardsCovered}</p>
                    </div>
                    <span className="text-lg font-black text-slate-900">{dom.coveragePercent}%</span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${dom.color}`}
                      style={{ width: `${dom.coveragePercent}%` }}
                    />
                  </div>

                  <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
                    <span>{dom.questionsCompleted.toLocaleString()} questions completed</span>
                    <span className="text-emerald-600 font-bold">On Track</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: AGGREGATE LEARNING OUTCOMES
           ========================================================================= */}
        {activeTab === "outcomes" && (
          <div className="p-8 rounded-[36px] bg-white border border-slate-200 shadow-2xs space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-black text-slate-900">Aggregate Educational Outcomes</h2>
              <p className="text-xs text-slate-500 font-medium">
                Anonymized learning milestone growth without individual psychometric scoring
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-[24px] bg-[#FAF8F5] border border-slate-200 space-y-3">
                <span className="text-xs font-black uppercase text-amber-800">Math Confidence</span>
                <div className="text-3xl font-black text-slate-900">+42%</div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Reduction in student-reported math anxiety after completing Kai&apos;s mango division and pattern recognition quests.
                </p>
              </div>

              <div className="p-6 rounded-[24px] bg-[#FAF8F5] border border-slate-200 space-y-3">
                <span className="text-xs font-black uppercase text-pink-800">Emotional Naming</span>
                <div className="text-3xl font-black text-slate-900">+68%</div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Increase in students identifying nuanced feelings (e.g. frustrated vs nervous) using Mia&apos;s Feelings Wheel.
                </p>
              </div>

              <div className="p-6 rounded-[24px] bg-[#FAF8F5] border border-slate-200 space-y-3">
                <span className="text-xs font-black uppercase text-emerald-800">Classroom Transition</span>
                <div className="text-3xl font-black text-slate-900">4.2 mins</div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Average transition time from recess to seated focus when utilizing Lumi&apos;s morning somatic breathing routines.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 8: LICENSES & ROLE MANAGEMENT
           ========================================================================= */}
        {activeTab === "licenses" && (
          <div className="p-8 rounded-[36px] bg-white border border-slate-200 shadow-2xs space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-black text-slate-900">Institutional Licenses &amp; Staff Roles</h2>
              <p className="text-xs text-slate-500 font-medium">
                Seat allocations, district subscription renewal, and authorized role definitions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-[28px] bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="text-base font-black text-slate-900">Student Seat Allocation</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>990 of 1,000 Seats Assigned</span>
                    <span className="text-indigo-600 font-black">99%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: "99%" }} />
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Annual institutional license active through June 30, 2027.
                </p>
              </div>

              <div className="p-6 rounded-[28px] bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="text-base font-black text-slate-900">Role Permissions</h3>
                <div className="space-y-2 text-xs font-medium text-slate-700">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                    <span>District Administrator (Full Access)</span>
                    <strong className="text-slate-900 font-bold">2 active</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                    <span>School Principals (Campus Level)</span>
                    <strong className="text-slate-900 font-bold">3 active</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                    <span>Classroom Teachers (Classroom Level)</span>
                    <strong className="text-slate-900 font-bold">44 active</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
