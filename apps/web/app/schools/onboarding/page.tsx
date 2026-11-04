"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import {
  School,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  FileCheck,
  GraduationCap,
  Sparkles,
  Download,
  Upload,
  UserCheck,
  BookOpen,
  Laptop,
  Heart,
  Palette,
  Activity,
  Award,
} from "lucide-react";

interface StepInfo {
  number: number;
  title: string;
  shortDesc: string;
}

const STEPS: StepInfo[] = [
  { number: 1, title: "School Profile", shortDesc: "Institutional details" },
  { number: 2, title: "Account & Security", shortDesc: "Admin credentials" },
  { number: 3, title: "Authorization", shortDesc: "Principal sign-off" },
  { number: 4, title: "Staff Directory", shortDesc: "Teacher invitations" },
  { number: 5, title: "Class Cohorts", shortDesc: "Classrooms & grades" },
  { number: 6, title: "Parent Consent", shortDesc: "Safeguarding pack" },
  { number: 7, title: "Student Access", shortDesc: "Zero-PII picture PINs" },
  { number: 8, title: "Curriculum Tracks", shortDesc: "Worlds & learning paths" },
];

export default function SchoolOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    // Step 1: School Profile
    schoolName: "Oakridge Model School",
    districtCity: "Lahore / Gulberg District",
    institutionType: "hybrid",
    studentCount: "450",
    // Step 2: Account & Security
    adminFullName: "Dr. Eleanor Vance",
    workEmail: "e.vance@oakridge.edu",
    password: "••••••••••••",
    enforce2FA: true,
    // Step 3: Authorization & Safeguarding Lead
    principalName: "Tariq Mahmood",
    dslName: "Amina Farooq (Designated Safeguarding Lead)",
    dslEmail: "dsl@oakridge.edu",
    agreeCharter: true,
    // Step 4: Teachers
    teachersList: [
      { name: "Ms. Sarah Chen", email: "s.chen@oakridge.edu", grade: "Grade 4" },
      { name: "Mr. Hamza Ali", email: "h.ali@oakridge.edu", grade: "Grade 3" },
      { name: "Mrs. Fatima Noor", email: "f.noor@oakridge.edu", grade: "Grade 5" },
    ],
    // Step 5: Cohorts
    cohorts: [
      { name: "Grade 4 Willow", students: 28, room: "B-201", teacher: "Ms. Sarah Chen" },
      { name: "Grade 3 Jasmine", students: 25, room: "A-104", teacher: "Mr. Hamza Ali" },
      { name: "Grade 5 Cedar", students: 30, room: "B-305", teacher: "Mrs. Fatima Noor" },
    ],
    // Step 6: Parent Consent
    consentModel: "digital_optin",
    parentLetterLanguage: "trilingual", // English, Urdu, Punjabi
    zeroPiiAcknowledged: true,
    // Step 7: Student Access
    authMethod: "picture_password", // picture_password or anonymous_pin
    // Step 8: Curriculum Tracks
    selectedWorlds: [
      "creative_studio",
      "move_play",
      "story_theater",
      "tech_discovery",
      "life_skills",
      "brain_quest",
    ],
  });

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        router.push("/school/portal?onboarded=true");
      }, 1000);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <MarketingShell>
      <div className="bg-[#FAF9F5] min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-[#1E293B]">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-900 shadow-2xs">
              <School className="w-4 h-4 text-emerald-700" />
              <span>Weebly Institutional School Setup</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              School Onboarding &amp; Deployment Wizard
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium">
              8-step streamlined launch for administrators, educators, safeguarding leads, and cohorts.
            </p>
          </div>

          {/* Progress Bar & Steps Indicator */}
          <div className="rounded-3xl bg-white border border-slate-200 p-4 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                Step {currentStep} of 8: {STEPS[currentStep - 1].title}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {Math.round((currentStep / 8) * 100)}% Completed
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden mb-5">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 8) * 100}%` }}
              />
            </div>

            {/* Step Pills (Desktop) */}
            <div className="hidden sm:grid grid-cols-4 md:grid-cols-8 gap-2">
              {STEPS.map((step) => {
                const isActive = step.number === currentStep;
                const isPassed = step.number < currentStep;

                return (
                  <button
                    key={step.number}
                    onClick={() => setCurrentStep(step.number)}
                    className={`flex flex-col items-center p-2 rounded-xl text-center transition-all ${
                      isActive
                        ? "bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-black shadow-xs"
                        : isPassed
                        ? "bg-slate-50 border border-slate-200 text-slate-700 font-bold hover:bg-slate-100"
                        : "opacity-50 text-slate-400 font-medium cursor-not-allowed"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 ${
                        isPassed
                          ? "bg-emerald-600 text-white"
                          : isActive
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.number}
                    </div>
                    <span className="text-[10px] truncate max-w-full">{step.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Step Body */}
          <div className="rounded-[32px] bg-white border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
            {/* Step 1: School Profile */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <span>Institutional Profile &amp; Location</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    Provide basic identifying details for your educational campus or district.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">School / District Name</label>
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">City &amp; Region</label>
                    <input
                      type="text"
                      value={formData.districtCity}
                      onChange={(e) => setFormData({ ...formData, districtCity: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Institution Type</label>
                    <select
                      value={formData.institutionType}
                      onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-emerald-600"
                    >
                      <option value="private">Private Primary / Secondary</option>
                      <option value="public">Public District School</option>
                      <option value="hybrid">International / Dual Curriculum</option>
                      <option value="ngo">Community Learning Center / NGO</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Estimated Student Roster</label>
                    <select
                      value={formData.studentCount}
                      onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-emerald-600"
                    >
                      <option value="150">50 – 200 Students</option>
                      <option value="450">200 – 600 Students</option>
                      <option value="1200">600 – 1,500 Students</option>
                      <option value="3000">1,500+ District Wide</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Account & Security */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
                    <Lock className="w-5 h-5 text-emerald-600" />
                    <span>Administrator Credentials &amp; 2FA Enforcement</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    Configure institutional master account security. School accounts require enterprise encryption.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Admin Lead Full Name</label>
                    <input
                      type="text"
                      value={formData.adminFullName}
                      onChange={(e) => setFormData({ ...formData, adminFullName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Institutional Work Email</label>
                    <input
                      type="email"
                      value={formData.workEmail}
                      onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">Master Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-emerald-900">Mandatory Multi-Factor Authentication (2FA)</h4>
                    <p className="text-xs text-emerald-800">
                      All educator and administrative accounts enforce time-based one-time password (TOTP) verification to safeguard student data under FERPA and COPPA guidelines.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Authorization & Safeguarding Lead */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                    <span>Principal Authorization &amp; Designated Safeguarding Lead</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    Every school instance requires verified leadership sign-off and an active safeguarding contact.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Principal / Head of Institution</label>
                    <input
                      type="text"
                      value={formData.principalName}
                      onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Designated Safeguarding Lead (DSL)</label>
                    <input
                      type="text"
                      value={formData.dslName}
                      onChange={(e) => setFormData({ ...formData, dslName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">DSL Direct Emergency / Escalation Email</label>
                    <input
                      type="email"
                      value={formData.dslEmail}
                      onChange={(e) => setFormData({ ...formData, dslEmail: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <label className="flex items-start space-x-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeCharter}
                    onChange={(e) => setFormData({ ...formData, agreeCharter: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="text-xs text-slate-700 space-y-1">
                    <span className="font-bold block text-slate-900">
                      Weebly School Non-Clinical Safeguarding Agreement
                    </span>
                    <p>
                      I confirm that our institution understands Weebly is an educational and developmental learning platform, not a psychiatric diagnostic tool. Escalations will be directed to human school counselors and designated safeguarding leads.
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Step 4: Staff Directory */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <span>Educator Roster &amp; Teacher Invitations</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    Add classroom teachers who will monitor student cohorts and assign developmental missions.
                  </p>
                </div>

                <div className="space-y-3">
                  {formData.teachersList.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="text-xs font-black text-slate-900">{t.name}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{t.email}</div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold self-start sm:self-auto">
                        {t.grade} Lead
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center space-y-2">
                  <p className="text-xs font-bold text-slate-700">Need to invite a whole department?</p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs hover:bg-slate-50 flex items-center space-x-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Staff CSV</span>
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs hover:bg-slate-50 flex items-center space-x-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Sample CSV</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Class Cohorts */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                    <span>Classroom Cohorts &amp; Homerooms</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    Map out grade cohorts. Cohorts isolate student activity and provide collective learning summaries.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {formData.cohorts.map((c, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-emerald-700">{c.room}</span>
                        <span className="text-xs font-bold text-slate-500">{c.students} Learners</span>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900">{c.name}</h4>
                      <p className="text-xs text-slate-600 font-medium">
                        Homeroom: <span className="font-bold text-slate-800">{c.teacher}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Parent Consent Tracking */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Parent Consent &amp; Trilingual Safeguarding Notices</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    Ensure parents are informed with clear, zero-jargon notices in English, Urdu, and Punjabi.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setFormData({ ...formData, consentModel: "digital_optin" })}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.consentModel === "digital_optin"
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Mail className="w-4 h-4 text-emerald-700" />
                      <h4 className="text-sm font-black text-slate-900">Digital Parent Email Portal</h4>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Parents receive an instant digital consent link via SMS/Email with transparent summaries and granular audio controls.
                    </p>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, consentModel: "physical_pack" })}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.consentModel === "physical_pack"
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Download className="w-4 h-4 text-emerald-700" />
                      <h4 className="text-sm font-black text-slate-900">Printable Trilingual Slip Pack</h4>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Download pre-translated Urdu, Punjabi, and English school slips to send home in student bags.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-950 flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    <span className="font-bold">Zero-PII Guarantee:</span> Weebly does not collect student real names, home addresses, phone numbers, or facial photos. All student data is identified solely via anonymous internal tokens.
                  </p>
                </div>
              </div>
            )}

            {/* Step 7: Student Access */}
            {currentStep === 7 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-emerald-600" />
                    <span>Zero-PII Student Access: Picture Passwords &amp; PINs</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    Young children do not need email addresses or complicated passwords. Select their access mechanism.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setFormData({ ...formData, authMethod: "picture_password" })}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.authMethod === "picture_password"
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="text-2xl mb-1">🦁 🎨 🚀</div>
                    <h4 className="text-sm font-black text-slate-900">Picture Passwords (Recommended for Ages 4–9)</h4>
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      Learners log in by selecting their assigned avatar animal and color icon. Fast, memorable, and fun.
                    </p>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, authMethod: "anonymous_pin" })}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.authMethod === "anonymous_pin"
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="text-2xl mb-1">🔢 🛡️ 🏫</div>
                    <h4 className="text-sm font-black text-slate-900">4-Digit Privacy PINs (Ages 10–14)</h4>
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      Learners enter an easy numeric code issued on their physical classroom badge.
                    </p>
                  </div>
                </div>

                {/* Sample Badge Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-center space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Sample Student Badge</span>
                  <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-2xs space-y-1">
                    <div className="text-xs font-bold text-emerald-800">Willow Cohort &bull; Learner #04</div>
                    <div className="text-3xl py-1">🐯 🔵</div>
                    <div className="text-[11px] font-medium text-slate-500">Tiger + Blue Circle</div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 8: Curriculum Track Selection */}
            {currentStep === 8 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <span>Curriculum Track &amp; Learning World Activation</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    Choose which global learning worlds are enabled for your school cohorts.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      id: "creative_studio",
                      name: "Creative Studio",
                      desc: "Guided drawing, animation, storytelling, and music exploration.",
                      icon: "🎨",
                    },
                    {
                      id: "move_play",
                      name: "Move & Play",
                      desc: "Football drills, physical coordination, balance, and sportsmanship.",
                      icon: "⚽",
                    },
                    {
                      id: "story_theater",
                      name: "Story & Cartoon Theater",
                      desc: "Interactive moral cartoons, soothing bedtime fables, and cultural tales.",
                      icon: "📖",
                    },
                    {
                      id: "tech_discovery",
                      name: "Tech & Discovery",
                      desc: "MIT Day of AI concepts, age-appropriate robotics, and digital citizenship.",
                      icon: "🤖",
                    },
                    {
                      id: "life_skills",
                      name: "Life & Friendship",
                      desc: "UNICEF FunDoo practical missions, empathy bridges, and emotional vocabulary.",
                      icon: "🌱",
                    },
                    {
                      id: "brain_quest",
                      name: "Brain Quest Puzzles",
                      desc: "Curriculum puzzles, mango division math, and curiosity challenges.",
                      icon: "🧩",
                    },
                  ].map((track) => {
                    const isSelected = formData.selectedWorlds.includes(track.id);

                    return (
                      <div
                        key={track.id}
                        onClick={() => {
                          const updated = isSelected
                            ? formData.selectedWorlds.filter((w) => w !== track.id)
                            : [...formData.selectedWorlds, track.id];
                          setFormData({ ...formData, selectedWorlds: updated });
                        }}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <span className="text-3xl">{track.icon}</span>
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-black text-slate-900">{track.name}</h4>
                          <p className="text-xs text-slate-600 font-medium leading-relaxed">
                            {track.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Wizard Navigation Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-5 py-2.5 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs disabled:opacity-30 hover:bg-slate-50 transition-all flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                <span>Previous Step</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md transition-all flex items-center space-x-2 active:scale-95"
              >
                <span>
                  {isSubmitting
                    ? "Provisioning School Instance..."
                    : currentStep === 8
                    ? "Finish & Launch School Portal"
                    : `Next: ${STEPS[currentStep].title}`}
                </span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
