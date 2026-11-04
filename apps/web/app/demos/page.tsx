"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Gamepad2,
  Users,
  GraduationCap,
  Building2,
  Stethoscope,
  ShieldAlert,
  Clock,
  ArrowRight,
  CheckCircle2,
  Play,
  RotateCcw,
  X,
  ChevronRight,
  ChevronLeft,
  Eye,
  Lock,
  Layers,
  BookOpen,
  Award,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";

interface TourStep {
  title: string;
  description: string;
  targetFeature: string;
  badge: string;
}

interface DemoItem {
  id: string;
  number: number;
  title: string;
  roleBadge: string;
  icon: any;
  accentColor: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  tourLength: string;
  description: string;
  whatYoullSee: string[];
  exploreHref: string;
  tourSteps: TourStep[];
}

const DEMOS: DemoItem[] = [
  {
    id: "child-magic-world",
    number: 1,
    title: "Child Magic World",
    roleBadge: "Child / Student (Ages 2–12)",
    icon: Gamepad2,
    accentColor: "bg-amber-500",
    bgGradient: "from-amber-500/10 via-amber-500/5 to-transparent",
    borderColor: "border-amber-300",
    textColor: "text-amber-900",
    tourLength: "3 mins",
    description:
      "Experience the ultra-clean child interface with only three choices: Home, Talk, and Play. Talk to Kai or Mia, solve the Khanmigo-inspired Mango Sharing math quest, and explore original stories with zero overwhelming navigation.",
    whatYoullSee: [
      "Ultra-clean 3-button child navigation (Home, Talk, Play)",
      "Interactive AI Friends: Kai (Math), Mia (Stories), Lumi (Calm), Zayn (Science)",
      "Khanmigo-style guided Mango Math Quest with visual counters (🥭)",
      "Creative Studio drawing canvas with dinosaur sketchpad",
      "Celebration achievement badge and safe session ending",
    ],
    exploreHref: "/youth/dashboard",
    tourSteps: [
      {
        title: "Welcome to Kids Magic Home",
        description:
          "Children are greeted with a warm, clutter-free home world. Notice there are no complex navigation bars or overwhelming text—just clean, friendly entry points.",
        targetFeature: "Kids Magic Home (/youth/dashboard)",
        badge: "Step 1 of 5",
      },
      {
        title: "Choose Your Learning Companion",
        description:
          "Four original characters specialize in different domains: Kai (homework & curiosity), Mia (stories & art), Lumi (calming & routines), and Zayn (science & puzzles).",
        targetFeature: "AI Friends Gallery (/youth/friends)",
        badge: "Step 2 of 5",
      },
      {
        title: "Khanmigo-Inspired Math Quest",
        description:
          "Kai guides the child through the 12-mango division feast. Rather than giving away the answer, Kai asks questions and provides visual counters step-by-step.",
        targetFeature: "Mango Math Quest (/youth/activities?category=mathematics)",
        badge: "Step 3 of 5",
      },
      {
        title: "Creative Studio & Dino Drawing",
        description:
          "Children switch to the Creative Studio to draw a friendly Stegosaurus with interactive colors, stroke sizes, and undo tools.",
        targetFeature: "Creative Studio (/youth/play?world=creative-studio)",
        badge: "Step 4 of 5",
      },
      {
        title: "Joyful Achievement & Calm Exit",
        description:
          "The child earns a star milestone. When session time concludes, the character gently winds down without addictive loops.",
        targetFeature: "Achievements (/youth/achievements)",
        badge: "Step 5 of 5",
      },
    ],
  },
  {
    id: "parent-center",
    number: 2,
    title: "Parent Center",
    roleBadge: "Caregiver & Family",
    icon: Users,
    accentColor: "bg-emerald-600",
    bgGradient: "from-emerald-600/10 via-emerald-600/5 to-transparent",
    borderColor: "border-emerald-300",
    textColor: "text-emerald-900",
    tourLength: "4 mins",
    description:
      "Tour the dedicated Parent Center with fictional family data (Fatima Ahmed & children Maya and Ali). Inspect factual daily learning summaries, the non-diagnostic parent observation diary, routine tracking, and school linkages.",
    whatYoullSee: [
      "Fictional family profiles (Maya, Grade 3 & Ali, Pre-K)",
      "Daily and weekly factual learning mastery reports",
      "Parent observation diary with school-avoidance notes (zero AI diagnosis)",
      "Bedtime routine checklists and low-stimulation toggles",
      "Verifiable parental consent controls and data purge requests",
    ],
    exploreHref: "/parent",
    tourSteps: [
      {
        title: "Family Overview Dashboard",
        description:
          "Caregivers see weekly learning time, active curriculum modules, and demonstrated skills for each linked child profile.",
        targetFeature: "Parent Overview (/parent)",
        badge: "Step 1 of 5",
      },
      {
        title: "Factual Learning Progress",
        description:
          "Factual activity records show exact questions practiced, hints used, and duration. Notice these records are strictly non-diagnostic.",
        targetFeature: "Learning Progress (/parent?tab=progress)",
        badge: "Step 2 of 5",
      },
      {
        title: "Parent Observation Diary (School Avoidance)",
        description:
          "Caregivers record factual observations like morning transition resistance. Barkley & Gottman co-regulation tips provide actionable family support.",
        targetFeature: "Observation Diary (/parent?tab=observations)",
        badge: "Step 3 of 5",
      },
      {
        title: "Bedtime & Screen Time Routines",
        description:
          "Set daily screen limits (e.g. 45 mins), bedtime curfews (8:30 PM), and high-contrast or dyslexic font accommodations.",
        targetFeature: "Daily Routines (/parent?tab=routines)",
        badge: "Step 4 of 5",
      },
      {
        title: "COPPA Consent & Right to be Forgotten",
        description:
          "Audit signed parental consent timestamps, manage school permissions, or trigger one-click complete child data deletion.",
        targetFeature: "Permissions & Privacy (/parent?tab=permissions)",
        badge: "Step 5 of 5",
      },
    ],
  },
  {
    id: "teacher-studio",
    number: 3,
    title: "Teacher Studio",
    roleBadge: "Educator & Classroom",
    icon: GraduationCap,
    accentColor: "bg-blue-600",
    bgGradient: "from-blue-600/10 via-blue-600/5 to-transparent",
    borderColor: "border-blue-300",
    textColor: "text-blue-900",
    tourLength: "4 mins",
    description:
      "Explore fictional classroom 'Grade 4-B Sunflower' under Teacher Ahmed Khan. Review the 24-student roster, curriculum coverage, AI-assisted lesson planner, question paper builder from the 3,000-question bank, and classroom observations.",
    whatYoullSee: [
      "Classroom roster with 24 enrolled students and join codes",
      "Punjab Curriculum alignment across Mathematics and Science",
      "Question paper builder powered by the 3,000-question relational bank",
      "Assignment dispatching and real-time student completion tracking",
      "Classroom observations and non-clinical accommodation logs",
    ],
    exploreHref: "/teacher/dashboard",
    tourSteps: [
      {
        title: "Teacher Command Dashboard",
        description:
          "Educators monitor classroom attendance, active learning modules, and daily emotional climate check-ins at a glance.",
        targetFeature: "Teacher Dashboard (/teacher/dashboard)",
        badge: "Step 1 of 5",
      },
      {
        title: "Classroom Roster & Enrollment",
        description:
          "Manage student pseudonyms, generate join codes, and invite co-teachers with zero student PII leakage.",
        targetFeature: "Class Roster (/teacher/dashboard?tab=overview)",
        badge: "Step 2 of 5",
      },
      {
        title: "3,000-Question Relational Bank",
        description:
          "Filter approved questions by grade, subject, difficulty, and learning objective to instantly generate printable worksheets and quizzes.",
        targetFeature: "Question Bank Builder (/admin/curriculum)",
        badge: "Step 3 of 5",
      },
      {
        title: "Assign Interactive SEL & Math Quests",
        description:
          "Dispatch assignments (like Photosynthesis Drawing or Mango Sharing) directly to student tablets with custom due dates.",
        targetFeature: "Assignments (/teacher/dashboard?tab=assignments)",
        badge: "Step 4 of 5",
      },
      {
        title: "Classroom Accommodations & Observations",
        description:
          "Document untimed reading accommodations, visual timers, and sensory breaks without clinical pathology labels.",
        targetFeature: "Accommodations (/teacher/dashboard?tab=climate)",
        badge: "Step 5 of 5",
      },
    ],
  },
  {
    id: "school-management",
    number: 4,
    title: "School Management",
    roleBadge: "District & Campus Admin",
    icon: Building2,
    accentColor: "bg-indigo-600",
    bgGradient: "from-indigo-600/10 via-indigo-600/5 to-transparent",
    borderColor: "border-indigo-300",
    textColor: "text-indigo-900",
    tourLength: "5 mins",
    description:
      "Tour the institutional command center for fictional institution 'Oakridge Punjab Campuses' (North & West). Inspect multi-campus deployment, license tier allocations, curriculum participation rates, and aggregate reports with k-anonymity privacy.",
    whatYoullSee: [
      "Multi-campus administration (Oakridge North & Oakridge West)",
      "94% curriculum adoption analytics and program assignments",
      "Institutional district license pack administration (500 seats)",
      "FERPA & COPPA Aligned Architecture disclosure banner",
      "Aggregate educational summaries with k-anonymity (k≥5) privacy",
    ],
    exploreHref: "/school/portal",
    tourSteps: [
      {
        title: "Institutional Overview",
        description:
          "District administrators view campus enrollment, active teacher licenses, and curriculum coverage across schools.",
        targetFeature: "School Portal (/school/portal)",
        badge: "Step 1 of 5",
      },
      {
        title: "Campus Directory & Leadership",
        description:
          "Inspect individual campuses (North Elementary Pre-K–4 and West Intermediate 5–8) with lead administrator assignments.",
        targetFeature: "Campuses (/school/portal?tab=campuses)",
        badge: "Step 2 of 5",
      },
      {
        title: "Curriculum Program Mapping",
        description:
          "Map programs to Punjab Curriculum and Textbook Board standards across Creative Studio, Move & Play, and Brain Quest.",
        targetFeature: "Program Adoption (/school/portal?tab=adoption)",
        badge: "Step 3 of 5",
      },
      {
        title: "k-Anonymity Educational Outcomes",
        description:
          "Aggregate reports group data into cohorts of 5 or more students to ensure individual learning records cannot be unmasked.",
        targetFeature: "Outcomes (/school/portal?tab=outcomes)",
        badge: "Step 4 of 5",
      },
      {
        title: "Institutional License Administration",
        description:
          "Manage seat quotas, renewal periods, and teacher access provisions with strict multi-tenant boundary isolation.",
        targetFeature: "Licenses (/school/portal?tab=licenses)",
        badge: "Step 5 of 5",
      },
    ],
  },
  {
    id: "child-support-review",
    number: 5,
    title: "Child Support & Professional Review",
    roleBadge: "Licensed Clinician / Specialist",
    icon: Stethoscope,
    accentColor: "bg-teal-600",
    bgGradient: "from-teal-600/10 via-teal-600/5 to-transparent",
    borderColor: "border-teal-300",
    textColor: "text-teal-900",
    tourLength: "4 mins",
    description:
      "Inspect the verified professional support portal under Dr. Sarah Jenkins, Ph.D. (PPA #88291-PK). Review referral intake, parental consent audits, protected clinical notes, and the safeguarding caregiver-harm exception protocol.",
    whatYoullSee: [
      "Verified clinician credential registry (PPA #88291-PK / Punjab Healthcare)",
      "Strict non-diagnostic ethical boundary (AI never diagnoses ADHD or autism)",
      "Authorized support cases with consent audit trail (CASE-202611-8F3A)",
      "Protected clinical notes authoring with case-level encryption",
      "Caregiver Harm Exception Protocol routing to CPWB Punjab 1121",
    ],
    exploreHref: "/professional/portal",
    tourSteps: [
      {
        title: "Professional Support Hub",
        description:
          "Specialists enter an encrypted clinical environment governed by the principle: 'All clinical judgments belong to qualified humans.'",
        targetFeature: "Professional Portal (/professional/portal)",
        badge: "Step 1 of 5",
      },
      {
        title: "Referral Intake & Consent Verification",
        description:
          "Review parent-initiated concerns and teacher observations with verified parental consent audit trails.",
        targetFeature: "Authorized Cases (/professional/portal?tab=cases)",
        badge: "Step 2 of 5",
      },
      {
        title: "Protected Clinical Notes Authoring",
        description:
          "Author observation analyses, multi-sensory accommodation plans, and follow-up schedules. Notes are restricted exclusively to assigned clinicians.",
        targetFeature: "Clinical Notes (/professional/portal?tab=notes)",
        badge: "Step 3 of 5",
      },
      {
        title: "Caregiver Harm Exception Protocol",
        description:
          "When a child discloses abuse from a caregiver, caregiver notification is suppressed to prevent retaliation, routing to CPWB Punjab 1121.",
        targetFeature: "Safeguarding Protocol (/professional/portal?tab=safeguarding)",
        badge: "Step 4 of 5",
      },
      {
        title: "Zero-Knowledge Access Audits",
        description:
          "An immutable timestamped log verifies every clinician who inspected case records, maintaining strict legal compliance.",
        targetFeature: "Access Audits (/professional/portal?tab=audits)",
        badge: "Step 5 of 5",
      },
    ],
  },
  {
    id: "platform-admin",
    number: 6,
    title: "Platform Admin & Governance",
    roleBadge: "System Operations",
    icon: ShieldAlert,
    accentColor: "bg-purple-600",
    bgGradient: "from-purple-600/10 via-purple-600/5 to-transparent",
    borderColor: "border-purple-300",
    textColor: "text-purple-900",
    tourLength: "4 mins",
    description:
      "Examine operational governance with simulated data: curriculum CMS review, 3,000-question bank statistics, RAG source registries, AI character voice configurations, safeguarding circuit breakers, and zero live credential exposure.",
    whatYoullSee: [
      "Curriculum CMS review gating for Punjab Textbook Board sources",
      "3,000-question bank category distribution and review pipeline",
      "Character voice configurations across OpenAI, ElevenLabs, and Azure",
      "Real-time safety circuit breakers and distress lifeline routing",
      "Zero-credential mock operations view with tenant isolation",
    ],
    exploreHref: "/admin/curriculum",
    tourSteps: [
      {
        title: "Platform Governance Overview",
        description:
          "System operators monitor platform health, tenant isolation, active curriculum versions, and safety circuit breakers.",
        targetFeature: "Admin Dashboard (/admin)",
        badge: "Step 1 of 5",
      },
      {
        title: "Curriculum CMS & RAG Registry",
        description:
          "Inspect Punjab Curriculum source documents, chunk indices, and reviewer approvals (e.g. Prof. Fatima Zahra).",
        targetFeature: "Curriculum CMS (/admin/curriculum)",
        badge: "Step 2 of 5",
      },
      {
        title: "3,000-Question Relational Bank Statistics",
        description:
          "Audit the 3,000 questions across Emotional Vocabulary (400), Science (350), Math (350), and Life Skills (300).",
        targetFeature: "Question Bank (/admin/youth-content)",
        badge: "Step 3 of 5",
      },
      {
        title: "Multi-Provider Voice Configuration",
        description:
          "Review character voice profiles (Kai alloy, Mia warm, Lumi ur-PK, Zayn fable) and Punjabi native validation status.",
        targetFeature: "Voice Configuration (/technology)",
        badge: "Step 4 of 5",
      },
      {
        title: "Safeguarding Incident Resolution",
        description:
          "Track safety circuit breaker activations and verify that human safeguarding officers review every elevated alert.",
        targetFeature: "Safety Operations (/safety)",
        badge: "Step 5 of 5",
      },
    ],
  },
];

export default function DemosPage() {
  const [activeTourDemo, setActiveTourDemo] = useState<DemoItem | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const startTour = (demo: DemoItem) => {
    setActiveTourDemo(demo);
    setCurrentStepIndex(0);
  };

  const nextStep = () => {
    if (activeTourDemo && currentStepIndex < activeTourDemo.tourSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const currentStep = activeTourDemo?.tourSteps[currentStepIndex];

  return (
    <MarketingShell>
      <div className="min-h-screen bg-[#FDFCFB] text-[#0F172A] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header Title & Subtitle */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Interactive Demonstration Center</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
              Explore Weebly
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
              See how Weebly helps children learn, create, grow and receive appropriate support.
              Explore all six independent platform roles with simulated, privacy-safe demonstration data.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-bold text-slate-500">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Account Creation Required</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Fictional Demonstration Data Only</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center space-x-1">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Strict Tenant &amp; Role Isolation</span>
              </span>
            </div>
          </div>

          {/* Six Independently Accessible Demo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {DEMOS.map((demo) => {
              const Icon = demo.icon;
              return (
                <div
                  key={demo.id}
                  className={`rounded-[36px] bg-white border-2 ${demo.borderColor} p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 relative group overflow-hidden`}
                >
                  {/* Top Highlight Background */}
                  <div
                    className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${demo.bgGradient} pointer-events-none opacity-60`}
                  />

                  <div className="space-y-5 relative z-10">
                    {/* Top Row: Icon, Role Badge & Length */}
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className={`w-12 h-12 rounded-2xl ${demo.accentColor} text-white flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-800">
                          {demo.roleBadge}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 mt-1 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Tour: {demo.tourLength}</span>
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <span className="text-xs font-mono font-black text-slate-400 uppercase tracking-widest">
                        Demo #{demo.number}
                      </span>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                        {demo.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mt-2 font-medium">
                        {demo.description}
                      </p>
                    </div>

                    {/* What You'll See Checklist */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                        What You&apos;ll See
                      </h4>
                      <ul className="text-xs space-y-1.5 text-slate-700">
                        {demo.whatYoullSee.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-emerald-600 font-bold shrink-0 mt-0.5">&bull;</span>
                            <span className="font-medium text-slate-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions: Start Guided Tour & Explore Freely */}
                  <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-2.5 relative z-10 mt-6">
                    <button
                      type="button"
                      onClick={() => startTour(demo)}
                      className={`px-3 py-2.5 rounded-xl ${demo.accentColor} hover:opacity-90 text-white text-xs font-black transition-all flex items-center justify-center space-x-1.5 shadow-xs`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Guided Tour</span>
                    </button>

                    <Link
                      href={demo.exploreHref}
                      className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black transition-all flex items-center justify-center space-x-1"
                    >
                      <span>Explore Freely</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Government & Stakeholder Review Banner */}
          <div className="rounded-[36px] bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-black uppercase tracking-wider">
                  Government &amp; Private School Delegations
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Evaluator Documentation &amp; Technical Briefings
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Review our complete architectural specifications, Punjab Curriculum and Textbook Board (PCTB)
                  RAG mappings, FERPA/COPPA aligned data handling frameworks, and pilot school proposals.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/platform"
                  className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all shadow-md"
                >
                  Platform Capabilities Guide &rarr;
                </Link>
                <Link
                  href="/schools/pilot"
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-black transition-all border border-white/20"
                >
                  Punjab Pilot Proposal &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guided Tour Interactive Modal Walkthrough */}
      {activeTourDemo && currentStep && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[36px] border-2 border-slate-200 max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm">
                  {activeTourDemo.number}
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-none">
                    {activeTourDemo.title} Tour
                  </h3>
                  <span className="text-[11px] font-bold text-amber-700 tracking-wide uppercase mt-0.5 block">
                    {currentStep.badge}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTourDemo(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                aria-label="Exit Guided Tour"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Body */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs font-mono font-bold text-amber-900 flex items-center space-x-2">
                <Eye className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Feature: {currentStep.targetFeature}</span>
              </div>

              <h4 className="text-xl font-black text-slate-900">{currentStep.title}</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {currentStep.description}
              </p>
            </div>

            {/* Progress Dots */}
            <div className="flex items-center justify-center space-x-1.5 py-1">
              {activeTourDemo.tourSteps.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentStepIndex ? "w-6 bg-amber-500" : "w-2 bg-slate-200"
                  }`}
                />
              ))}
            </div>

            {/* Modal Controls: Prev, Next, Skip, Explore Live */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTourDemo(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Exit Tour
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  disabled={currentStepIndex === 0}
                  onClick={prevStep}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentStepIndex < activeTourDemo.tourSteps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center space-x-1 shadow-xs"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    href={activeTourDemo.exploreHref}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all flex items-center space-x-1 shadow-xs"
                  >
                    <span>Open Live Demo</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </MarketingShell>
  );
}
