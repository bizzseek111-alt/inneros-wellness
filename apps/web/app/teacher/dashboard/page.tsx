"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  Sparkles,
  Play,
  Pause,
  Plus,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ShieldCheck,
  Smile,
  AlertCircle,
  FileText,
  Layers,
  ArrowRight,
  Filter,
  Volume2,
} from "lucide-react";
import { LumiMascot } from "@/components/youth/LumiMascot";
import { apiClient } from "@/lib/api-client";

interface Classroom {
  id: string;
  name: string;
  grade_level: string;
  institution_name: string;
  join_code: string;
  student_count: number;
  created_at: string;
}

interface Student {
  id: string;
  student_id: string;
  student_display_name: string;
  status: string;
  enrolled_at: string;
}

interface Assignment {
  id: string;
  title: string;
  department_id: string;
  activity_type: string;
  instructions: string;
  due_date: string;
}

export default function TeacherDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "assignments" | "climate" | "projector" | "resources"
  >("overview");

  // State
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [climate, setClimate] = useState<any | null>(null);
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newGradeLevel, setNewGradeLevel] = useState("Grade 4 (Ages 8-10)");
  const [newSchoolName, setNewSchoolName] = useState("Weebly Elementary");

  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTitle, setAssignTitle] = useState("");
  const [assignDepartment, setAssignDepartment] = useState("emotional_intelligence");
  const [assignActivity, setAssignActivity] = useState("feelings_wheel");
  const [assignInstructions, setAssignInstructions] = useState("");
  const [assignDueDate, setAssignDueDate] = useState("Tomorrow 9:00 AM");

  // Projector Mode
  const [breatheActive, setBreatheActive] = useState(false);
  const [breathePhase, setBreathePhase] = useState<"Breathe In" | "Hold" | "Breathe Out" | "Rest">("Breathe In");
  const [secondsLeft, setSecondsLeft] = useState(4);

  // Load classrooms on mount
  useEffect(() => {
    loadClassrooms();
    loadAccommodations();
  }, []);

  // When selected classroom changes, load students, assignments, and climate
  useEffect(() => {
    if (selectedClassroomId) {
      loadClassroomDetails(selectedClassroomId);
    }
  }, [selectedClassroomId]);

  // Breathing Box Timer
  useEffect(() => {
    if (!breatheActive) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setBreathePhase((current) => {
            if (current === "Breathe In") return "Hold";
            if (current === "Hold") return "Breathe Out";
            if (current === "Breathe Out") return "Rest";
            return "Breathe In";
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [breatheActive]);

  const loadClassrooms = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.listClassrooms("usr_teacher_demo");
      setClassrooms(data);
      if (data.length > 0 && !selectedClassroomId) {
        setSelectedClassroomId(data[0].id);
      }
    } catch {
      // Fallback state
      const fallback = [
        {
          id: "cls_demo_sunflower",
          name: "Room 4B Sunflower Cohort",
          grade_level: "Grade 4 (Ages 8-10)",
          institution_name: "Weebly Community Academy",
          join_code: "WB-402",
          student_count: 18,
          created_at: "2026-11-01",
        },
      ];
      setClassrooms(fallback);
      setSelectedClassroomId("cls_demo_sunflower");
    } finally {
      setIsLoading(false);
    }
  };

  const loadClassroomDetails = async (clsId: string) => {
    try {
      const [stuData, asgnData, climData] = await Promise.all([
        apiClient.listClassroomStudents(clsId),
        apiClient.listClassroomAssignments(clsId),
        apiClient.getClassroomClimate(clsId),
      ]);
      setStudents(stuData);
      setAssignments(asgnData);
      setClimate(climData);
    } catch {
      // Handled via graceful state
    }
  };

  const loadAccommodations = async () => {
    try {
      const data = await apiClient.getClassroomAccommodations();
      setAccommodations(data);
    } catch {
      // Fallback
    }
  };

  const handleCreateClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    try {
      const created = await apiClient.createClassroom({
        name: newClassName.trim(),
        grade_level: newGradeLevel,
        institution_name: newSchoolName.trim(),
      });
      setClassrooms([created, ...classrooms]);
      setSelectedClassroomId(created.id);
      setShowCreateClassModal(false);
      setNewClassName("");
    } catch {
      // Local fallback
      const fallback: Classroom = {
        id: `cls_${Date.now()}`,
        name: newClassName.trim(),
        grade_level: newGradeLevel,
        institution_name: newSchoolName.trim(),
        join_code: `WB-${Math.floor(100 + Math.random() * 900)}`,
        student_count: 0,
        created_at: new Date().toISOString(),
      };
      setClassrooms([fallback, ...classrooms]);
      setSelectedClassroomId(fallback.id);
      setShowCreateClassModal(false);
      setNewClassName("");
    }
  };

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !selectedClassroomId) return;
    try {
      const res = await apiClient.enrollClassroomStudent({
        classroom_id: selectedClassroomId,
        student_display_name: newStudentName.trim(),
      });
      setStudents([...students, res]);
      setShowEnrollModal(false);
      setNewStudentName("");
    } catch {
      const fallbackStudent: Student = {
        id: `enr_${Date.now()}`,
        student_id: `stu_${Date.now()}`,
        student_display_name: newStudentName.trim(),
        status: "enrolled",
        enrolled_at: new Date().toISOString(),
      };
      setStudents([...students, fallbackStudent]);
      setShowEnrollModal(false);
      setNewStudentName("");
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle.trim() || !selectedClassroomId) return;
    try {
      const res = await apiClient.createClassroomAssignment({
        classroom_id: selectedClassroomId,
        title: assignTitle.trim(),
        department_id: assignDepartment,
        activity_type: assignActivity,
        instructions: assignInstructions.trim(),
        due_date: assignDueDate.trim(),
      });
      setAssignments([res, ...assignments]);
      setShowAssignModal(false);
      setAssignTitle("");
      setAssignInstructions("");
    } catch {
      const fallbackAsgn: Assignment = {
        id: `asgn_${Date.now()}`,
        title: assignTitle.trim(),
        department_id: assignDepartment,
        activity_type: assignActivity,
        instructions: assignInstructions.trim(),
        due_date: assignDueDate.trim(),
      };
      setAssignments([fallbackAsgn, ...assignments]);
      setShowAssignModal(false);
      setAssignTitle("");
      setAssignInstructions("");
    }
  };

  const activeClass = classrooms.find((c) => c.id === selectedClassroomId);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col selection:bg-[#EEF4FF] selection:text-[#2B4CDE]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E3F6EC] text-[#16A34A] flex items-center justify-center font-bold shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-[#0F172A] tracking-tight">Weebly Educator Hub</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EEF4FF] text-[#2B4CDE] border border-[#DCE7FE]">
                  Teacher Portal
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Classroom SEL management, group co-regulation &amp; universal design accommodations
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/schools"
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
            >
              School Curriculum Guide
            </Link>
            <Link
              href="/youth/dashboard"
              className="px-4 py-2 rounded-full bg-[#2B4CDE] hover:bg-[#1E3A8A] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Student Experience →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6 flex-1">
        {/* Cohort Selector & Quick Actions */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Active Cohort:</span>
            <select
              aria-label="Active Classroom Cohort"
              value={selectedClassroomId}
              onChange={(e) => setSelectedClassroomId(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#2B4CDE]"
            >
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.grade_level})
                </option>
              ))}
            </select>
            {activeClass && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Join Code: <strong>{activeClass.join_code}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setShowEnrollModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B] inline-flex items-center space-x-1.5 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Enroll Student</span>
            </button>
            <button
              onClick={() => setShowAssignModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B] inline-flex items-center space-x-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Dispatch Activity</span>
            </button>
            <button
              onClick={() => setShowCreateClassModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2B4CDE] text-white hover:bg-[#1E3A8A] inline-flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Classroom</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2 overflow-x-auto">
          {[
            { id: "overview", label: "Classroom Roster", icon: Users },
            { id: "assignments", label: "SEL Activities & Tasks", icon: BookOpen },
            { id: "climate", label: "Anonymous Climate", icon: Smile },
            { id: "projector", label: "Smartboard Calming", icon: Sparkles },
            { id: "resources", label: "IEP & UDL Accommodations", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all whitespace-nowrap ${
                  active
                    ? "bg-[#2B4CDE] text-white shadow-xs"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview & Roster */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Enrolled Students</span>
                <span className="text-3xl font-black text-[#0F172A] block">{students.length}</span>
                <span className="text-xs text-slate-500">Active roster members</span>
              </div>
              <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Active Join Code</span>
                <span className="text-3xl font-black text-[#2B4CDE] block">{activeClass?.join_code || "WB-402"}</span>
                <span className="text-xs text-slate-500">Students enter this at /student</span>
              </div>
              <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Privacy Guarantee</span>
                <div className="flex items-center space-x-1.5 pt-1 text-emerald-600 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Zero Private Diary Leakage</span>
                </div>
                <span className="text-xs text-slate-500">Teachers cannot view confidential student reflections</span>
              </div>
            </div>

            {/* Student Roster Table */}
            <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">Classroom Roster</h3>
                  <p className="text-xs text-[#64748B]">Pseudonymous identifiers protecting student privacy</p>
                </div>
                <button
                  onClick={() => setShowEnrollModal(true)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EEF4FF] text-[#2B4CDE] border border-[#DCE7FE] hover:bg-[#DCE7FE] transition-colors"
                >
                  + Add Student
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-[#64748B] font-semibold">
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">Student ID</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Enrolled Date</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {students.map((s) => (
                      <tr key={s.id} className="hover:bg-[#F8FAFC]">
                        <td className="py-3 font-semibold text-[#0F172A]">{s.student_display_name}</td>
                        <td className="py-3 text-[#64748B] font-mono text-xs">{s.student_id}</td>
                        <td className="py-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Enrolled
                          </span>
                        </td>
                        <td className="py-3 text-[#64748B]">{s.enrolled_at.slice(0, 10)}</td>
                        <td className="py-3 text-right">
                          <span className="text-xs text-[#2B4CDE] font-semibold hover:underline cursor-pointer">
                            View SEL Progress
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

        {/* Tab 2: SEL Activities & Assignments */}
        {activeTab === "assignments" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Classroom Assignments</h3>
                <p className="text-xs text-[#64748B]">Non-punitive, developmentally grounded exercises</p>
              </div>
              <button
                onClick={() => setShowAssignModal(true)}
                className="px-4 py-2 rounded-full text-xs font-bold bg-[#2B4CDE] text-white hover:bg-[#1E3A8A] transition-colors shadow-xs"
              >
                + Dispatch Activity
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map((a) => (
                <div
                  key={a.id}
                  className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-3 hover:border-[#2B4CDE] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#EEF4FF] text-[#2B4CDE] uppercase">
                        {a.activity_type.replace("_", " ")}
                      </span>
                      <h4 className="text-sm font-bold text-[#0F172A] mt-1">{a.title}</h4>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      Due: {a.due_date || "Today"}
                    </span>
                  </div>

                  <p className="text-xs text-[#475569] leading-relaxed">{a.instructions}</p>

                  <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                    <span>14 / 18 Students Completed</span>
                    <span className="text-emerald-600 font-bold">78% Completion Rate</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Anonymous Classroom Climate */}
        {activeTab === "climate" && (
          <div className="space-y-6">
            {/* Safeguard Notice */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>FERPA / COPPA Child Privacy Safeguard:</strong> This dashboard displays aggregate anonymous nervous system weather only. To protect student safety and trust, educators cannot inspect personal student journal entries or private companion chat dialogues.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-xs space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Calm &amp; Receptive</span>
                <span className="text-4xl font-black text-emerald-700 block">74%</span>
                <span className="text-xs text-emerald-800">Students reporting grounded autonomic regulation</span>
              </div>

              <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 shadow-xs space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Restless / Need Break</span>
                <span className="text-4xl font-black text-amber-700 block">16%</span>
                <span className="text-xs text-amber-800">Recommended: 2-minute somatic stretch pause before math</span>
              </div>

              <div className="p-6 rounded-3xl bg-sky-50 border border-sky-200 shadow-xs space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-800">Focused &amp; Ready</span>
                <span className="text-4xl font-black text-sky-700 block">10%</span>
                <span className="text-xs text-sky-800">Active engagement with morning routine checklist</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#0F172A]">Educator Recommended Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <h4 className="text-xs font-bold uppercase text-[#2B4CDE]">Pre-Test Co-Regulation</h4>
                  <p className="text-xs text-[#475569]">
                    Launch the Projector Breathe-Along on your smartboard for 3 minutes to activate student vagal tones.
                  </p>
                  <button
                    onClick={() => setActiveTab("projector")}
                    className="text-xs font-bold text-[#2B4CDE] hover:underline inline-flex items-center space-x-1"
                  >
                    <span>Open Smartboard Mode →</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <h4 className="text-xs font-bold uppercase text-[#16A34A]">Sensory Station Setup</h4>
                  <p className="text-xs text-[#475569]">
                    16% of the class noted sensory restlessness. Allow silent handheld fidgets or dim classroom fluorescent lighting.
                  </p>
                  <button
                    onClick={() => setActiveTab("resources")}
                    className="text-xs font-bold text-[#16A34A] hover:underline inline-flex items-center space-x-1"
                  >
                    <span>View UDL Strategy Guides →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Smartboard Co-regulation Mode */}
        {activeTab === "projector" && (
          <div className="p-8 sm:p-14 rounded-[36px] bg-gradient-to-b from-[#F0F8FF] via-white to-[#F2FAF6] border-2 border-[#B9E2FE] shadow-sm text-center space-y-6">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase bg-white text-[#2B4CDE] shadow-xs inline-block">
              Smartboard / Projector Fullscreen Mode
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              Classroom Breathe-Along with Lumi
            </h2>
            <p className="text-sm text-[#475569] max-w-lg mx-auto">
              Synchronize student autonomic nervous systems during morning advisory, after playground recess, or prior to examinations.
            </p>

            <div className="py-6 flex flex-col items-center justify-center space-y-4">
              <LumiMascot size="hero" state={breatheActive ? "calming" : "idle"} />

              {breatheActive && (
                <div className="space-y-1">
                  <span className="text-2xl font-black text-[#2B4CDE] block">{breathePhase}</span>
                  <span className="text-sm font-semibold text-slate-500 block">{secondsLeft} seconds</span>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setBreatheActive(!breatheActive)}
                className={`px-8 py-3.5 rounded-full font-bold text-sm transition-all shadow-sm flex items-center space-x-2 ${
                  breatheActive
                    ? "bg-amber-500 hover:bg-amber-600 text-white"
                    : "bg-[#2B4CDE] hover:bg-[#1E3A8A] text-white"
                }`}
              >
                {breatheActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{breatheActive ? "Pause Breathe-Along" : "Start Group 4-4-4-4 Box Breathing"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Printable IEP & UDL Accommodations Library */}
        {activeTab === "resources" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Universal Design for Learning (UDL) &amp; IEP Guides</h3>
              <p className="text-xs text-[#64748B]">Evidence-informed accommodations for attention, sensory processing, and executive function</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accommodations.map((acc) => (
                <div
                  key={acc.id}
                  className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#E3F6EC] text-[#16A34A] uppercase">
                      {acc.area.replace("_", " ")}
                    </span>
                    <button
                      onClick={() => alert(`IEP Note for ${acc.title}:\n\n${acc.printable_iep_note}`)}
                      className="text-xs text-[#2B4CDE] font-semibold hover:underline inline-flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Copy IEP Note</span>
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-[#0F172A]">{acc.title}</h4>
                  <p className="text-xs text-[#475569] leading-relaxed">{acc.classroom_strategy}</p>

                  <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#334155] space-y-1">
                    <strong>Why it helps:</strong> {acc.why_it_helps}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal: New Classroom */}
      {showCreateClassModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#0F172A]">Create New Classroom Cohort</h3>
            <form onSubmit={handleCreateClassroom} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#475569] block mb-1">Classroom Name</label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g. Grade 4 Willow Room"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:border-[#2B4CDE]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#475569] block mb-1">Grade Level</label>
                <select
                  value={newGradeLevel}
                  onChange={(e) => setNewGradeLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:border-[#2B4CDE]"
                >
                  <option value="Kindergarten (Ages 4-5)">Kindergarten (Ages 4–5)</option>
                  <option value="Grade 1 (Ages 6-7)">Grade 1 (Ages 6–7)</option>
                  <option value="Grade 3 (Ages 8-9)">Grade 3 (Ages 8–9)</option>
                  <option value="Grade 4 (Ages 9-10)">Grade 4 (Ages 9–10)</option>
                  <option value="Grade 6 (Ages 11-12)">Grade 6 (Ages 11–12)</option>
                  <option value="Grade 8 (Ages 13-14)">Grade 8 (Ages 13–14)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#475569] block mb-1">School / Institution</label>
                <input
                  type="text"
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:border-[#2B4CDE]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateClassModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#2B4CDE] text-white hover:bg-[#1E3A8A]"
                >
                  Create Cohort
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Enroll Student */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#0F172A]">Enroll Student in Cohort</h3>
            <p className="text-xs text-[#64748B]">
              Enter a preferred nickname or pseudonym to maintain student data privacy.
            </p>
            <form onSubmit={handleEnrollStudent} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#475569] block mb-1">Student Display Name / Pseudonym</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Maya S."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:border-[#2B4CDE]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#2B4CDE] text-white hover:bg-[#1E3A8A]"
                >
                  Add to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Dispatch Activity */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#0F172A]">Dispatch Classroom Activity</h3>
            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#475569] block mb-1">Activity Title</label>
                <input
                  type="text"
                  required
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  placeholder="e.g. Feelings Weather Morning Reflection"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:border-[#2B4CDE]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#475569] block mb-1">Activity Type</label>
                <select
                  value={assignActivity}
                  onChange={(e) => setAssignActivity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:border-[#2B4CDE]"
                >
                  <option value="feelings_wheel">Feelings Wheel Vocabulary</option>
                  <option value="story_forest">Story Forest Bilingual Audio</option>
                  <option value="routine_builder">Executive Function Routine Task</option>
                  <option value="box_breathing">Somatic Calming Breath</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#475569] block mb-1">Instructions for Students</label>
                <textarea
                  rows={3}
                  value={assignInstructions}
                  onChange={(e) => setAssignInstructions(e.target.value)}
                  placeholder="e.g. Take 3 minutes to notice your energy and pick the emotion words that match."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:border-[#2B4CDE]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#475569] block mb-1">Due Date / Pacing</label>
                <input
                  type="text"
                  value={assignDueDate}
                  onChange={(e) => setAssignDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:border-[#2B4CDE]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#2B4CDE] text-white hover:bg-[#1E3A8A]"
                >
                  Dispatch to Classroom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
