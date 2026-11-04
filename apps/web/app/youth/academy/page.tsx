"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Compass,
  Heart,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Layers,
  Settings,
  Flame,
  Volume2,
  Smile,
  ExternalLink,
  Award,
  AlertCircle,
} from "lucide-react";
import { YouthShell } from "@/components/youth/YouthShell";
import { useYouth } from "@/components/youth/YouthContext";
import {
  apiClient,
  DepartmentInfo,
  CurriculumModule,
  RecommendationResponse,
} from "@/lib/api-client";

// Fallback seed departments if API is unreachable during offline/static rendering
const FALLBACK_DEPARTMENTS: DepartmentInfo[] = [
  {
    id: "emotional_intelligence",
    name: "Emotional Intelligence",
    name_ur: "جذباتی فہم و بصیرت",
    name_pa: "جذباتی سمجھ بوجھ",
    description: "Recognizing, understanding, and navigating one's emotional landscape.",
    competency_domain: "Self-Awareness & Self-Management",
    evidence_framework: "CASEL SEL & WHO Life Skills (2020)",
    color_accent: "#F3EDFA",
  },
  {
    id: "emotional_vocabulary",
    name: "Emotional Vocabulary",
    name_ur: "جذباتی الفاظ اور اظہاری زبان",
    name_pa: "جذباتی بول چال دے لفظ",
    description: "Expanding linguistic labels for subtle bodily feelings.",
    competency_domain: "Affect Labeling",
    evidence_framework: "Lieberman Affect Labeling (2007)",
    color_accent: "#E3F6EC",
  },
  {
    id: "self_regulation_coping",
    name: "Self-Regulation & Coping",
    name_ur: "خود اختیاری اور سکون کا طریقہ",
    name_pa: "اپنے آپ نوں سنبھالن دا طریقہ",
    description: "Somatic breathing, vagal nerve grounding, and nervous system regulation.",
    competency_domain: "Physiological Regulation",
    evidence_framework: "Harvard Center on the Developing Child (2011)",
    color_accent: "#E0F1FE",
  },
  {
    id: "empathy",
    name: "Empathy & Compassion",
    name_ur: "ہمدردی اور دوسروں کا احساس",
    name_pa: "ہمدردی تے دوجیاں دا احساس",
    description: "Understanding others' perspectives and bodily cues with healthy boundaries.",
    competency_domain: "Social Awareness",
    evidence_framework: "Decety & Jackson Empathy Architecture (2004)",
    color_accent: "#FFEEE5",
  },
  {
    id: "friendship_relationships",
    name: "Friendship & Relationships",
    name_ur: "دوستی اور باہمی تعلقات",
    name_pa: "سنگت تے آپسی رشتے",
    description: "Initiating cooperative play, active listening, and conflict resolution.",
    competency_domain: "Relationship Skills",
    evidence_framework: "CASEL Relationship Skills (2020)",
    color_accent: "#FFF9DB",
  },
  {
    id: "adhd_friendly_support",
    name: "ADHD-Friendly Support",
    name_ur: "توجہ اور سرگرمی میں مدد",
    name_pa: "دھیان تے کم کاج وچ مدد",
    description: "Micro-step pacing, low-shame transitions, and executive function scaffolding.",
    competency_domain: "Executive Accommodation",
    evidence_framework: "Barkley Neurodiversity-Affirming ADHD Model (2015)",
    color_accent: "#EBFBEE",
  },
  {
    id: "autism_friendly_support",
    name: "Autism-Friendly Support",
    name_ur: "آٹزم دوست مواصلت اور حسی سکون",
    name_pa: "آٹزم دوست گل بات تے حسی آرام",
    description: "Low-stimulation pacing, literal instructions, and sensory regulation.",
    competency_domain: "Sensory & Communication Support",
    evidence_framework: "Neurodiversity-Affirming Paradigm & Pellicano (2022)",
    color_accent: "#F0F4FF",
  },
  {
    id: "digital_safety",
    name: "Digital Safety & Ethics",
    name_ur: "ڈیجیٹل حفاظت اور آن لائن حدود",
    name_pa: "ڈیجیٹل حفاظت تے آن لائن پردہ",
    description: "Navigating screen balance, private data, and respectful online communication.",
    competency_domain: "Responsible Decision-Making",
    evidence_framework: "UNICEF Child Online Safety Guidelines (2021)",
    color_accent: "#E8F5E9",
  },
];

const AGE_BANDS = [
  { id: "all", label: "All Ages (2–18)", ur: "تمام عمریں", pa: "ساریاں عمراں" },
  { id: "2-5", label: "Early Childhood (2–5)", ur: "ابتدائی بچپن (۲-۵)", pa: "نکے بال (۲-۵)" },
  { id: "6-9", label: "Junior Young (6–9)", ur: "چھوٹے بچے (۶-۹)", pa: "چھوٹے بچے (۶-۹)" },
  { id: "10-12", label: "Junior Older (10–12)", ur: "بڑے بچے (۱۰-۱۲)", pa: "وڈے بچے (۱۰-۱۲)" },
  { id: "13-18", label: "Adolescents (13–18)", ur: "نوعمر و نوجوان (۱۳-۱۸)", pa: "نوجوان (۱۳-۱۸)" },
];

const GOAL_OPTIONS = [
  { id: "calm", label: "Calm & Breathing", icon: Heart },
  { id: "focus", label: "Focus & Planning", icon: Brain },
  { id: "friendship", label: "Friendship & Empathy", icon: Smile },
  { id: "emotions", label: "Emotional Vocabulary", icon: BookOpen },
  { id: "safety", label: "Safety & Boundaries", icon: ShieldCheck },
  { id: "sleep", label: "Healthy Rest & Sleep", icon: Clock },
];

export default function YouthAcademyPage() {
  const { ageTier, locale, isLowStimulation } = useYouth();

  const [departments, setDepartments] = useState<DepartmentInfo[]>(FALLBACK_DEPARTMENTS);
  const [modules, setModules] = useState<CurriculumModule[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);

  const [selectedAgeBand, setSelectedAgeBand] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["calm", "focus"]);
  const [loading, setLoading] = useState(true);

  // Sync initial age band from context if junior/teen
  useEffect(() => {
    if (ageTier === "little") setSelectedAgeBand("2-5");
    else if (ageTier === "junior") setSelectedAgeBand("6-9");
    else if (ageTier === "teen") setSelectedAgeBand("13-18");
  }, [ageTier]);

  useEffect(() => {
    async function loadAcademyData() {
      setLoading(true);
      try {
        const [deptList, modData] = await Promise.all([
          apiClient.getAcademyDepartments().catch(() => FALLBACK_DEPARTMENTS),
          apiClient.getAcademyModules({
            is_reviewer: true, // Allow draft demonstration lessons to be browsed
            age_band: selectedAgeBand !== "all" ? selectedAgeBand : undefined,
            department_id: selectedDepartment || undefined,
          }).catch(() => []),
        ]);
        if (deptList && deptList.length > 0) setDepartments(deptList);
        setModules(modData);

        // Fetch personalized recommendations
        const effectiveAge = selectedAgeBand !== "all" ? selectedAgeBand : "6-9";
        const rec = await apiClient.getAcademyRecommendations(
          {
            age_range: effectiveAge,
            chosen_goals: selectedGoals,
            sensory_preference: isLowStimulation ? "low_stimulation" : "standard",
            language: locale,
          },
          true
        ).catch(() => null);
        if (rec) setRecommendations(rec);
      } catch (err) {
        console.error("Failed to load academy catalog:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAcademyData();
  }, [selectedAgeBand, selectedDepartment, selectedGoals, isLowStimulation, locale]);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((g) => g !== goalId) : [...prev, goalId]
    );
  };

  const getLocalizedTitle = (mod: CurriculumModule) => {
    if (locale === "ur" && mod.title_ur) return mod.title_ur;
    if (locale === "pa" && mod.title_pa) return mod.title_pa;
    return mod.title_en;
  };

  const getLocalizedDeptName = (dept: DepartmentInfo) => {
    if (locale === "ur" && dept.name_ur) return dept.name_ur;
    if (locale === "pa" && dept.name_pa) return dept.name_pa;
    return dept.name;
  };

  return (
    <YouthShell>
      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        {/* Header Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-teal-500/10 border border-indigo-200 dark:border-indigo-900/40 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                <GraduationCap className="w-4 h-4" />
                <span>Evidence-Informed Learning Sanctuary • Ages 2–18</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Weebly Kids Development Academy
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                25 departments rooted in CASEL, WHO Life Skills, Harvard Center on the Developing Child,
                and UNICEF evidence frameworks. Trilingual interactive stories, somatic exercises, and offline caregiver connections.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/admin/curriculum"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border shadow-xs hover:bg-muted text-xs font-semibold transition"
              >
                <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Reviewer & CMS Studio</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Personalized Recommendation Engine Section */}
        <div className="rounded-2xl bg-card border border-border p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-foreground">Personalized Recommendation Explorer</h2>
            </div>
            <span className="text-xs text-muted-foreground">Select your learning goals to generate suggestions</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {GOAL_OPTIONS.map((goal) => {
              const Icon = goal.icon;
              const isSelected = selectedGoals.includes(goal.id);
              return (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{goal.label}</span>
                </button>
              );
            })}
          </div>

          {recommendations && (
            <div className="mt-3 p-4 rounded-xl bg-muted/40 border border-muted text-xs space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                <Brain className="w-4 h-4" />
                <span>Recommendation Context: {recommendations.age_band_display}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {recommendations.primary_recommendation_reason}
              </p>
            </div>
          )}
        </div>

        {/* Age Band Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {AGE_BANDS.map((band) => (
            <button
              key={band.id}
              onClick={() => {
                setSelectedAgeBand(band.id);
                setSelectedDepartment(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedAgeBand === band.id
                  ? "bg-foreground text-background shadow-xs"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {locale === "ur" ? band.ur : locale === "pa" ? band.pa : band.label}
            </button>
          ))}
        </div>

        {/* 25 Curriculum Departments Horizontal / Grid Catalog */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-wide uppercase text-muted-foreground">
              Curriculum Departments ({departments.length})
            </h2>
            {selectedDepartment && (
              <button
                onClick={() => setSelectedDepartment(null)}
                className="text-xs text-primary hover:underline font-medium"
              >
                Clear Department Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {departments.map((dept) => {
              const isSelected = selectedDepartment === dept.id;
              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(isSelected ? null : dept.id)}
                  style={{
                    backgroundColor: isSelected ? undefined : dept.color_accent || undefined,
                  }}
                  className={`p-3 rounded-2xl text-left border transition flex flex-col justify-between h-28 ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-card/70 border-border/70 hover:border-border text-foreground"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <BookOpen className={`w-4 h-4 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`} />
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 font-mono">
                      2–18
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold line-clamp-2 leading-snug">
                      {getLocalizedDeptName(dept)}
                    </h3>
                    <p className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {dept.competency_domain}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modules Catalog */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Demonstration Learning Modules ({modules.length})
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                5 original demonstration lessons per age band • Trilingual interactive scripts
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Draft educational content pending clinical signoff</span>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-muted-foreground text-sm">
              Loading curriculum modules...
            </div>
          ) : modules.length === 0 ? (
            <div className="py-16 rounded-2xl border border-dashed border-border text-center space-y-3">
              <BookOpen className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-sm font-semibold text-foreground">No modules found for current filter.</p>
              <button
                onClick={() => {
                  setSelectedAgeBand("all");
                  setSelectedDepartment(null);
                }}
                className="text-xs text-primary font-medium hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {modules.map((mod) => (
                <div
                  key={mod.module_id}
                  className="rounded-2xl bg-card border border-border p-5 flex flex-col justify-between shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px]">
                        Ages {mod.target_age_range}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{mod.recommended_session_duration_min} min</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition">
                        {getLocalizedTitle(mod)}
                      </h3>
                      {locale !== "en" && (
                        <p className="text-xs text-muted-foreground mt-0.5 italic">
                          {mod.title_en}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {mod.developmental_objective}
                    </p>

                    {/* Multi-stage indicators */}
                    <div className="pt-2 border-t border-border/60 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-indigo-500" /> Story
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-teal-500" /> Voice
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-500" /> Offline
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[150px]">
                      {mod.evidence_strength.replace(/_/g, " ")}
                    </span>
                    <Link
                      href={`/youth/academy/lesson/${mod.module_id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ethical Non-Clinical Boundary Card */}
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 p-5 flex items-start gap-4 text-xs text-amber-900 dark:text-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold">Pedagogical Framework & Non-Clinical Sanctuary Notice</h4>
            <p className="leading-relaxed text-amber-800 dark:text-amber-300">
              The Weebly Kids Development Academy is an educational curriculum platform. Modules are designed
              to cultivate emotional vocabulary, executive functioning, and somatic self-regulation.
              Weebly never generates IQ scores, diagnostic probabilities, or psychiatric labels. All content is
              draft educational material subject to ongoing clinical multidisciplinary governance.
            </p>
          </div>
        </div>
      </div>
    </YouthShell>
  );
}
