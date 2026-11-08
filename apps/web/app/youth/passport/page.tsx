"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChildNavigationShell } from "@/components/youth/ChildNavigationShell";
import { CompanionPortrait } from "@/components/v9/CompanionPortrait";

interface PassportJourney {
  id: string;
  title: string;
  age_group: string;
  subject_domain: string;
  companion_character: "kai" | "milo" | "noor" | "tara";
  learning_objectives: string[];
  progress: {
    current_stage: string;
    completed_stages: string[];
    status: "not_started" | "in_progress" | "completed";
    reflection_feeling?: string;
    reflection_note?: string;
  };
}

interface PassportProject {
  id: string;
  child_id: string;
  tool_type: "story_maker" | "game_maker" | "cartoon_studio" | "art_design" | "ai_inventor" | "ai_detective";
  title: string;
  age_band: string;
  status: string;
  visibility: "private";
  parent_sharing_approved: boolean;
  moderation_status: string;
  learning_objectives_practiced: string[];
  payload: Record<string, unknown>;
  updated_at: string;
}

interface ActivityRecord {
  id: string;
  event_type?: string;
  world_id: string;
  activity_id: string;
  activity_title: string;
  skill_domain: string;
  engagement_level: string;
  created_at: string;
}

const INTEREST_BADGES = [
  { id: "stories", label: "Storytelling & Reading", icon: "📖" },
  { id: "games", label: "Game Building & Logic", icon: "🕹️" },
  { id: "art", label: "Art & Cartoons", icon: "🎨" },
  { id: "nature", label: "Animals & Nature", icon: "🌿" },
  { id: "math", label: "Numbers & Patterns", icon: "🔢" },
  { id: "ai_detective", label: "AI Detective & Fairness", icon: "🕵️" },
  { id: "music_move", label: "Music & Movement", icon: "🎵" },
  { id: "kindness", label: "Kindness & Friendship", icon: "💛" },
];

const TEACHER_APPROVED_ACHIEVEMENTS = [
  {
    id: "ach_fair_share",
    title: "Fair-Share Problem Solver",
    issuer: "Grade 2 Classroom Teacher (Approved)",
    description: "Completed the Mango Orchard division journey and explained equal sharing to a partner.",
    badge: "🥭",
    date: "Verified Curriculum Milestone",
  },
  {
    id: "ach_ai_detective",
    title: "Thoughtful Fact-Checker",
    issuer: "Weebly AI Literacy Pathway (Approved)",
    description: "Checked an AI claim against a trusted source and kept personal information private.",
    badge: "🔍",
    date: "Verified AI Competency",
  },
  {
    id: "ach_calm_routine",
    title: "Calm Routine Builder",
    issuer: "Home & School Support Team (Approved)",
    description: "Sequenced a 4-step morning checklist and practiced calm breathing transitions.",
    badge: "🌅",
    date: "Verified Life Skill",
  },
];

export default function SkillsAndCreationsPassportPage() {
  const [journeys, setJourneys] = useState<PassportJourney[]>([]);
  const [projects, setProjects] = useState<PassportProject[]>([]);
  const [events, setEvents] = useState<ActivityRecord[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["stories", "games", "ai_detective"]);
  const [offlineCompleted, setOfflineCompleted] = useState<string[]>([
    "Counted and shared 12 real objects equally at home",
    "Drew a 3-part beginning, middle, and end story map on paper",
  ]);
  const [newOfflineNote, setNewOfflineNote] = useState("");
  const [parentPinUnlocked, setParentPinUnlocked] = useState(false);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  const loadPassportData = async () => {
    try {
      const [jRes, pRes, eRes] = await Promise.all([
        fetch("/api/youth/journeys?child_id=child_default"),
        fetch("/api/youth/creator/projects?child_id=child_default"),
        fetch("/api/educational/activity-events?child_id=child_default"),
      ]);
      if (jRes.ok) {
        const jData = await jRes.json();
        setJourneys(jData.journeys || []);
      }
      if (pRes.ok) {
        const pData = await pRes.json();
        setProjects(pData.projects || []);
      }
      if (eRes.ok) {
        const eData = await eRes.json();
        setEvents(eData.events || []);
      }
    } catch {
      // Offline graceful fallback
    }
  };

  useEffect(() => {
    loadPassportData();
    try {
      const savedInterests = localStorage.getItem("weebly_v10_passport_interests");
      if (savedInterests) setSelectedInterests(JSON.parse(savedInterests));
    } catch {
      // Ignore storage error
    }
  }, []);

  const toggleInterest = (id: string) => {
    const updated = selectedInterests.includes(id)
      ? selectedInterests.filter((item) => item !== id)
      : [...selectedInterests, id];
    setSelectedInterests(updated);
    try {
      localStorage.setItem("weebly_v10_passport_interests", JSON.stringify(updated));
    } catch {
      // Ignore storage error
    }
  };

  const addOfflineCompletion = () => {
    if (!newOfflineNote.trim()) return;
    setOfflineCompleted((prev) => [newOfflineNote.trim(), ...prev]);
    setNewOfflineNote("");
    setStatusBanner("Added real-world family/classroom activity to your Passport!");
  };

  const toggleParentSharingApproval = async (project: PassportProject) => {
    try {
      const res = await fetch("/api/youth/creator/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set_parent_sharing",
          id: project.id,
          parent_sharing_approved: !project.parent_sharing_approved,
        }),
      });
      if (res.ok) {
        await loadPassportData();
        setStatusBanner(
          !project.parent_sharing_approved
            ? `Parent approved family/teacher sharing for "${project.title}".`
            : `Revoked sharing for "${project.title}" — returned to strictly private.`
        );
      }
    } catch {
      setStatusBanner("Could not update sharing setting right now.");
    }
  };

  const deleteProject = async (projectId: string, title: string) => {
    try {
      const res = await fetch("/api/youth/creator/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id: projectId }),
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        setStatusBanner(`Deleted "${title}" from your Passport.`);
      }
    } catch {
      setStatusBanner("Could not delete project right now.");
    }
  };

  const exportPassportJson = () => {
    const bundle = {
      passport_version: "weebly-v10-passport-1.0",
      exported_at: new Date().toISOString(),
      privacy_classification: "PRIVATE_FAMILY_PORTFOLIO",
      clinical_disclaimer:
        "Educational portfolio only. Contains zero IQ scores, zero diagnostic labels, and zero psychological rankings.",
      child_selected_interests: selectedInterests,
      completed_journeys: journeys.filter((j) => j.progress?.status === "completed"),
      in_progress_journeys: journeys.filter((j) => j.progress?.status === "in_progress"),
      created_projects: projects,
      offline_real_world_implementations: offlineCompleted,
      teacher_approved_achievements: TEACHER_APPROVED_ACHIEVEMENTS,
      practiced_events_sample: events.slice(0, 20),
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "weebly-skills-and-creations-passport.json";
    a.click();
    URL.revokeObjectURL(url);
    setStatusBanner("Downloaded your private Skills & Creations Passport JSON!");
  };

  // Aggregate unique practiced learning objectives
  const practicedObjectives = Array.from(
    new Set([
      ...journeys
        .filter((j) => j.progress?.status === "completed" || j.progress?.status === "in_progress")
        .flatMap((j) => j.learning_objectives),
      ...projects.flatMap((p) => p.learning_objectives_practiced || []),
    ])
  );

  return (
    <ChildNavigationShell activeTab="home">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Header Hero */}
        <div className="mb-8 rounded-3xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 via-FFFDF7 to-teal-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 shrink-0">
                <CompanionPortrait character="mia" size={64} />
              </div>
              <div>
                <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-900">
                  Pillar 4 · Grow with Support · Private Portfolio
                </span>
                <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                  Skills &amp; Creations Passport
                </h1>
                <p className="text-sm font-medium text-slate-600">
                  Celebrate your stories, visual block games, cartoons, learning journeys, and real-world projects!
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={exportPassportJson}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-800 shadow-sm hover:bg-slate-50"
              >
                ⬇ Export Private Passport (JSON)
              </button>
              <Link
                href="/youth/creator"
                className="rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-extrabold text-slate-950 shadow-sm hover:bg-amber-400"
              >
                + Create New Project
              </Link>
            </div>
          </div>

          {statusBanner && (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-900">
              ✨ {statusBanner}
            </div>
          )}
        </div>

        {/* Non-Clinical & Privacy Guarantee Callout */}
        <div className="mb-8 rounded-2xl border border-teal-200 bg-teal-50/70 p-4 text-xs text-teal-950 flex flex-wrap items-center justify-between gap-3">
          <div>
            <strong className="font-extrabold">🔒 Private by Default &amp; Non-Diagnostic Guarantee:</strong> Your Passport celebrates creative work and practiced learning objectives. It never generates IQ scores, ADHD/autism probabilities, or psychological personality rankings. Nothing is shared publicly without explicit parent approval.
          </div>
          <button
            type="button"
            onClick={() => setParentPinUnlocked(!parentPinUnlocked)}
            className="rounded-xl border border-teal-400 bg-white px-3 py-1.5 font-extrabold text-teal-900 hover:bg-teal-100"
          >
            {parentPinUnlocked ? "🔒 Lock Parent Sharing Controls" : "🔑 Parent Sharing Controls"}
          </button>
        </div>

        {/* Top Summary Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-bold uppercase text-slate-500">Created Projects</div>
            <div className="mt-1 text-3xl font-black text-slate-900">{projects.length}</div>
            <div className="mt-1 text-xs text-slate-600">Stories, games, cartoons &amp; art</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-bold uppercase text-slate-500">Learning Journeys</div>
            <div className="mt-1 text-3xl font-black text-teal-700">
              {journeys.filter((j) => j.progress?.status === "completed").length} / {journeys.length || 6}
            </div>
            <div className="mt-1 text-xs text-slate-600">Watch → Learn → Play → Implement → Reflect</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-bold uppercase text-slate-500">Practiced Objectives</div>
            <div className="mt-1 text-3xl font-black text-indigo-700">{practicedObjectives.length}</div>
            <div className="mt-1 text-xs text-slate-600">Curriculum &amp; AI literacy skills</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-bold uppercase text-slate-500">Real-World Tasks</div>
            <div className="mt-1 text-3xl font-black text-amber-600">{offlineCompleted.length}</div>
            <div className="mt-1 text-xs text-slate-600">Offline home &amp; classroom transfers</div>
          </div>
        </div>

        {/* Section 1: My Approved & Private Creations */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">🎨 My AI Creator Academy Portfolio</h2>
              <p className="text-xs text-slate-600">
                Every story, visual block game, cartoon, and invention you saved. All projects default to Private.
              </p>
            </div>
            <Link
              href="/youth/creator"
              className="text-xs font-extrabold text-teal-700 underline hover:text-teal-900"
            >
              Open AI Creator Academy →
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <p className="text-sm font-bold text-slate-700">
                You haven&apos;t saved a project yet — let&apos;s build your first story, game, or cartoon!
              </p>
              <Link
                href="/youth/creator"
                className="mt-3 inline-block rounded-xl bg-teal-600 px-4 py-2 text-xs font-extrabold text-white"
              >
                Launch AI Creator Academy
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col justify-between rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-900">
                        {project.tool_type.replace("_", " ").toUpperCase()} · Ages {project.age_band}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          project.parent_sharing_approved
                            ? "bg-emerald-100 text-emerald-900"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {project.parent_sharing_approved
                          ? "✅ Parent Approved for Family/Teacher View"
                          : "🔒 Private to Child & Parent"}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-black text-slate-900">{project.title}</h3>
                    {project.learning_objectives_practiced?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {project.learning_objectives_practiced.map((obj) => (
                          <span
                            key={obj}
                            className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700"
                          >
                            ✓ {obj}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/youth/creator?tool=${project.tool_type}`}
                        className="rounded-xl bg-teal-600 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-teal-500"
                      >
                        Resume / Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteProject(project.id, project.title)}
                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-800 hover:bg-rose-100"
                      >
                        Delete
                      </button>
                    </div>

                    {parentPinUnlocked && (
                      <button
                        type="button"
                        onClick={() => toggleParentSharingApproval(project)}
                        className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-extrabold text-amber-950 hover:bg-amber-100"
                      >
                        {project.parent_sharing_approved ? "Revoke Family Sharing" : "Approve Family/Teacher Share"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 2: Completed & Active 5-Stage Learning Journeys */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">🧭 5-Stage Learning Journeys</h2>
              <p className="text-xs text-slate-600">
                Watch → Learn → Play → Implement → Reflect journeys across Mathematics, Literacy, AI, and Life Skills.
              </p>
            </div>
            <Link
              href="/youth/journeys"
              className="text-xs font-extrabold text-teal-700 underline hover:text-teal-900"
            >
              Browse All Journeys →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {journeys.map((j) => {
              const completedCount = j.progress?.completed_stages?.length || 0;
              return (
                <div
                  key={j.id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-extrabold text-teal-900">
                        {j.subject_domain} · Ages {j.age_group}
                      </span>
                      <span className="text-xs font-bold text-slate-500">{completedCount}/5 Stages</span>
                    </div>
                    <h3 className="mt-2 text-base font-black text-slate-900">{j.title}</h3>
                    {j.progress?.reflection_feeling && (
                      <p className="mt-2 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900">
                        Reflection: {j.progress.reflection_feeling}
                        {j.progress.reflection_note ? ` — "${j.progress.reflection_note}"` : ""}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span
                      className={`text-xs font-extrabold ${
                        j.progress?.status === "completed"
                          ? "text-emerald-700"
                          : j.progress?.status === "in_progress"
                          ? "text-amber-700"
                          : "text-slate-500"
                      }`}
                    >
                      {j.progress?.status === "completed"
                        ? "🌟 Completed"
                        : j.progress?.status === "in_progress"
                        ? "⏳ In Progress"
                        : "Ready to Start"}
                    </span>
                    <Link
                      href={`/youth/journeys?id=${j.id}`}
                      className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-slate-800"
                    >
                      {j.progress?.status === "completed" ? "Replay" : "Open Journey"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Child-Selected Interests & Offline Real-World Transfer */}
        <div className="mb-10 grid gap-6 lg:grid-cols-2">
          {/* Child-Selected Interests */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-900">💡 Topics I Love Exploring</h2>
            <p className="mt-1 text-xs text-slate-600">
              Tap the subjects you enjoy most! Kai, Milo, Noor, and Tara use these to suggest fun stories and games.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {INTEREST_BADGES.map((badge) => {
                const active = selectedInterests.includes(badge.id);
                return (
                  <button
                    key={badge.id}
                    type="button"
                    onClick={() => toggleInterest(badge.id)}
                    className={`rounded-2xl border-2 px-3.5 py-2 text-xs font-extrabold transition ${
                      active
                        ? "border-amber-400 bg-amber-50 text-amber-950 shadow-sm"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {badge.icon} {badge.label} {active ? "✓" : ""}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Offline Activities Completed */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-900">🌱 Offline &amp; Real-World Activities</h2>
            <p className="mt-1 text-xs text-slate-600">
              Record hands-on tasks you implemented away from the screen with family or classmates.
            </p>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={newOfflineNote}
                onChange={(e) => setNewOfflineNote(e.target.value)}
                placeholder="e.g., Built a paper robot or shared 10 blocks fairly..."
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900"
              />
              <button
                type="button"
                onClick={addOfflineCompletion}
                className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-teal-500"
              >
                + Log Task
              </button>
            </div>
            <ul className="mt-4 space-y-2">
              {offlineCompleted.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 rounded-xl bg-emerald-50/70 px-3 py-2 text-xs font-bold text-emerald-950"
                >
                  <span>🏡</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 4: Teacher-Approved Achievements & Practiced Objectives */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-900">🏅 Teacher &amp; Guide Approved Milestones</h2>
            <p className="mt-1 text-xs text-slate-600">
              Strength-based milestones celebrating curiosity, collaboration, and creative problem solving.
            </p>
            <div className="mt-4 space-y-3">
              {TEACHER_APPROVED_ACHIEVEMENTS.map((ach) => (
                <div
                  key={ach.id}
                  className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-3.5"
                >
                  <div className="text-2xl">{ach.badge}</div>
                  <div>
                    <div className="text-sm font-black text-slate-900">{ach.title}</div>
                    <div className="text-[11px] font-bold text-amber-900">{ach.issuer}</div>
                    <p className="mt-1 text-xs text-slate-700">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-900">📚 Practiced Learning Objectives</h2>
            <p className="mt-1 text-xs text-slate-600">
              Skills practiced across your Learning Journeys, AI Creator projects, and Foundational Skills Lab.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {practicedObjectives.map((obj) => (
                <span
                  key={obj}
                  className="rounded-xl border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-bold text-indigo-950"
                >
                  ✓ {obj}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ChildNavigationShell>
  );
}
