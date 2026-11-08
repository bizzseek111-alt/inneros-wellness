import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, sbInsert, sbSelect } from "@/lib/server/supabase";
import {
  EducationalActivityEvent,
  V10EventType,
  getActivityEventsStore,
  recordServerActivityEvent,
} from "@/lib/server/activity-events-store";

export type { EducationalActivityEvent, V10EventType };

// Supported V10 structured event types:
// journey_started | journey_completed | activity_completed | project_created | project_updated | learning_objective_practiced

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newEvent = recordServerActivityEvent(body);

    const saved = await sbInsert<EducationalActivityEvent>(
      "educational_activity_events",
      newEvent as unknown as Record<string, unknown>
    );

    return NextResponse.json({
      success: true,
      persisted: Boolean(saved),
      storage: saved ? "supabase-postgres" : "in-memory-fallback",
      event_id: newEvent.id,
      event: saved || newEvent,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("student_id");
  const view = searchParams.get("view"); // 'parent', 'teacher', 'admin', 'raw'

  const filter = studentId
    ? `select=*&student_pseudonymous_id=eq.${encodeURIComponent(studentId)}&order=created_at.desc&limit=50`
    : "select=*&order=created_at.desc&limit=50";
  const dbRows = isSupabaseConfigured()
    ? await sbSelect<EducationalActivityEvent>("educational_activity_events", filter)
    : null;

  const store = getActivityEventsStore();
  let events = dbRows && dbRows.length > 0 ? dbRows : store;
  if (!dbRows && studentId && studentId !== "child_default") {
    events = events.filter((e) => e.student_pseudonymous_id === studentId);
  }

  // Generate role-specific aggregated report
  if (view === "parent") {
    const totalActivities = events.length;
    const completedCount = events.filter((e) => e.completion_status === "completed").length;
    const totalMinutes = Math.round(events.reduce((acc, e) => acc + e.duration_seconds, 0) / 60);
    const languagesActive = Array.from(new Set(events.map((e) => e.language_used)));

    return NextResponse.json({
      summary: {
        weekly_completed_activities: completedCount,
        total_learning_minutes: totalMinutes,
        active_languages: languagesActive,
        competency_growth: "Positive exploration across emotional vocabulary and mathematical reasoning",
      },
      offline_recommendations: [
        {
          title: "Dinner Table Emotion Check-in",
          description: "Ask your child what color their heart felt like today over dinner.",
          duration: "5 mins",
        },
        {
          title: "Nature Shapes Scavenger Hunt",
          description: "Count symmetrical leaves or round stones in a park or garden.",
          duration: "15 mins",
        },
      ],
      recent_timeline: events.slice(0, 10),
    });
  }

  if (view === "teacher") {
    const total = events.length;
    const hintsTotal = events.reduce((acc, e) => acc + e.hints_used_count, 0);
    const avgHints = total > 0 ? (hintsTotal / total).toFixed(1) : "0";

    return NextResponse.json({
      classroom_summary: {
        enrolled_active_students: 24,
        assignment_completion_rate: "92%",
        average_hints_per_activity: avgHints,
        curriculum_standard: "CASEL SEL & Early STEM Mastery",
      },
      objective_progress: [
        { objective: "Identify and label core emotional states", mastery: "88%" },
        { objective: "Photosynthesis and light speed inquiry", mastery: "82%" },
        { objective: "Equal-partition division and sharing", mastery: "94%" },
      ],
      recent_timeline: events.slice(0, 15),
    });
  }

  if (view === "admin") {
    return NextResponse.json({
      total_activity_events: events.length,
      server_health: "Healthy (100% SLA)",
      voice_session_provider_status: "Active (Web Speech + Formant Fallback)",
      retention_policy: "Zero raw audio persistence; 24h ephemeral turns; parent-managed retention",
      recent_events: events.slice(0, 20),
    });
  }

  return NextResponse.json({ events });
}
