import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, sbInsert, sbSelect } from "@/lib/server/supabase";
import { WEEBLY_V10_JOURNEYS, JourneyStageId } from "@/lib/v10-journey-engine";

export interface JourneyProgressRecord {
  id: string;
  student_pseudonymous_id: string;
  journey_id: string;
  current_stage: JourneyStageId;
  completed_stages: JourneyStageId[];
  reflection_response?: string;
  caregiver_observation?: string;
  status: "in_progress" | "completed";
  language_used: "en" | "ur" | "pa";
  updated_at: string;
  created_at: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __weeblyV10JourneyProgress: JourneyProgressRecord[] | undefined;
}

function getProgressStore(): JourneyProgressRecord[] {
  if (!globalThis.__weeblyV10JourneyProgress) {
    globalThis.__weeblyV10JourneyProgress = [
      {
        id: "jprog_seed_1",
        student_pseudonymous_id: "std_ayan_7y",
        journey_id: "jrn_math_fair_share_mangoes",
        current_stage: "reflect",
        completed_stages: ["watch", "learn", "play", "implement", "reflect"],
        reflection_response: "I figured it out!",
        caregiver_observation: "Counted 12 spoons into 3 piles of 4 at the dinner table.",
        status: "completed",
        language_used: "en",
        updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ];
  }
  return globalThis.__weeblyV10JourneyProgress;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("student_id") || "std_ayan_7y";
  const subjectFilter = searchParams.get("subject");
  const includeDrafts = searchParams.get("include_drafts") === "true";

  // Filter journeys: only Published/Approved enter child learning flows unless admin requests drafts
  const journeys = WEEBLY_V10_JOURNEYS.filter((j) => {
    if (!includeDrafts && j.review_status !== "Published" && j.review_status !== "Approved") {
      return false;
    }
    if (subjectFilter && j.subject.toLowerCase() !== subjectFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  let progressList = getProgressStore().filter(
    (p) => !studentId || p.student_pseudonymous_id === studentId
  );

  if (isSupabaseConfigured()) {
    const dbRows = await sbSelect<JourneyProgressRecord>(
      "learning_journey_progress",
      `student_pseudonymous_id=eq.${encodeURIComponent(studentId)}&order=updated_at.desc&limit=50`
    );
    if (dbRows && dbRows.length > 0) {
      progressList = dbRows;
    }
  }

  return NextResponse.json({
    journeys,
    progress: progressList,
    storage: isSupabaseConfigured() ? "supabase-postgres" : "in-memory-fallback",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const journeyId = String(body.journey_id || "").trim();
    const studentId = String(body.student_pseudonymous_id || "std_ayan_7y");
    const currentStage = (body.current_stage || "watch") as JourneyStageId;
    const completedStages: JourneyStageId[] = Array.isArray(body.completed_stages)
      ? body.completed_stages
      : [currentStage];
    const status: "in_progress" | "completed" =
      body.status === "completed" ? "completed" : "in_progress";

    if (!journeyId) {
      return NextResponse.json({ error: "journey_id is required" }, { status: 400 });
    }

    const store = getProgressStore();
    const existingIdx = store.findIndex(
      (p) => p.student_pseudonymous_id === studentId && p.journey_id === journeyId
    );

    const now = new Date().toISOString();
    const record: JourneyProgressRecord = {
      id: existingIdx >= 0 ? store[existingIdx].id : `jprog_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      student_pseudonymous_id: studentId,
      journey_id: journeyId,
      current_stage: currentStage,
      completed_stages: Array.from(new Set(completedStages)),
      reflection_response: body.reflection_response,
      caregiver_observation: body.caregiver_observation,
      status,
      language_used: body.language_used || "en",
      updated_at: now,
      created_at: existingIdx >= 0 ? store[existingIdx].created_at : now,
    };

    if (existingIdx >= 0) {
      store[existingIdx] = record;
    } else {
      store.unshift(record);
    }

    let persisted = false;
    if (isSupabaseConfigured()) {
      const inserted = await sbInsert<JourneyProgressRecord>("learning_journey_progress", record);
      if (inserted) persisted = true;
    }

    return NextResponse.json({
      event_type: status === "completed" ? "journey_completed" : "journey_started",
      progress: record,
      persisted,
      storage: persisted ? "supabase-postgres" : "in-memory-fallback",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to save journey progress", detail: err?.message },
      { status: 500 }
    );
  }
}
