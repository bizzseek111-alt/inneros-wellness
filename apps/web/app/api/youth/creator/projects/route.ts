import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, sbInsert, sbSelect } from "@/lib/server/supabase";
import { recordServerActivityEvent } from "@/lib/server/activity-events-store";

export type CreatorToolType =
  | "story_maker"
  | "game_maker"
  | "cartoon_studio"
  | "art_lab"
  | "ai_inventors"
  | "ai_detective";

export interface CreatorProjectRecord {
  id: string;
  student_pseudonymous_id: string;
  tool_type: CreatorToolType;
  title: string;
  age_band: string;
  project_state: Record<string, any>;
  learning_objectives_practiced: string[];
  moderation_status: "approved_private" | "flagged";
  parent_sharing_approved: boolean;
  teacher_visible: boolean;
  updated_at: string;
  created_at: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __weeblyV10CreatorProjects: CreatorProjectRecord[] | undefined;
}

const BANNED_PATTERNS = [
  /kill/i,
  /suicide/i,
  /hurt myself/i,
  /\b\d{10,12}\b/, // block raw phone numbers / PII
];

function sanitizeProjectContent(rawState: Record<string, any>): {
  safe: boolean;
  sanitized: Record<string, any>;
} {
  const serialized = JSON.stringify(rawState || {});
  const isFlagged = BANNED_PATTERNS.some((rx) => rx.test(serialized));
  return {
    safe: !isFlagged,
    sanitized: rawState || {},
  };
}

const DEFAULT_OBJECTIVES_BY_TOOL: Record<CreatorToolType, string[]> = {
  game_maker: ["Algorithmic sequencing", "Event-driven logic", "Rule-based game design"],
  story_maker: ["Narrative structure", "Bilingual creative expression", "Character empathy"],
  cartoon_studio: ["Visual storytelling", "Dialogue sequencing", "Scene composition"],
  art_lab: ["Pattern symmetry", "Color harmony", "Visual imagination"],
  ai_inventors: ["Pattern classification", "Training data fairness", "Decision tree logic"],
  ai_detective: ["Fact verification", "Hallucination detection", "Source evaluation"],
};

function getProjectsStore(): CreatorProjectRecord[] {
  if (!globalThis.__weeblyV10CreatorProjects) {
    globalThis.__weeblyV10CreatorProjects = [
      {
        id: "proj_seed_game_1",
        student_pseudonymous_id: "std_ayan_7y",
        tool_type: "game_maker",
        title: "Kai's Star Collector Block Game",
        age_band: "6",
        project_state: {
          character: "kai",
          winScore: 3,
          blocks: [
            { id: "b1", type: "when_tapped", label: "When Tapped / Started" },
            { id: "b2", type: "move_right", label: "Move Right 1 Step" },
            { id: "b3", type: "move_right", label: "Move Right 1 Step" },
            { id: "b4", type: "if_collision_star", label: "If Touching Star → Score +1" },
            { id: "b5", type: "win_condition", label: "If Score Reaches Goal → Win!" },
          ],
        },
        learning_objectives_practiced: DEFAULT_OBJECTIVES_BY_TOOL.game_maker,
        moderation_status: "approved_private",
        parent_sharing_approved: false,
        teacher_visible: true,
        updated_at: new Date(Date.now() - 3600000 * 3).toISOString(),
        created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
      },
      {
        id: "proj_seed_story_1",
        student_pseudonymous_id: "std_ayan_7y",
        tool_type: "story_maker",
        title: "Mia and the Singing Mango Tree",
        age_band: "5",
        project_state: {
          hero: "Mia the Songbird",
          setting: "A sunlit mango orchard in Multan",
          goal: "Help a lost firefly find its family before bedtime",
          pages: [
            "Once upon a time in a sunlit mango orchard in Multan, Mia the Songbird met a tiny glowing firefly.",
            "The firefly could not see its tree because a gentle evening mist rolled in.",
            "Mia sang a clear melody so all the other fireflies lit up like lanterns, guiding their little friend home!",
          ],
        },
        learning_objectives_practiced: DEFAULT_OBJECTIVES_BY_TOOL.story_maker,
        moderation_status: "approved_private",
        parent_sharing_approved: true,
        teacher_visible: true,
        updated_at: new Date(Date.now() - 3600000 * 8).toISOString(),
        created_at: new Date(Date.now() - 3600000 * 10).toISOString(),
      },
    ];
  }
  return globalThis.__weeblyV10CreatorProjects;
}

function normalizeStudentId(rawId: string | null | undefined): string {
  if (!rawId || rawId === "child_default" || rawId === "child_aarav_1") {
    return "std_ayan_7y";
  }
  return rawId;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawStudentId = searchParams.get("student_id") || searchParams.get("child_id");
  const studentId = normalizeStudentId(rawStudentId);
  const toolType = searchParams.get("tool_type");

  let projects = getProjectsStore().filter(
    (p) => !rawStudentId || p.student_pseudonymous_id === studentId || p.student_pseudonymous_id === rawStudentId
  );

  if (isSupabaseConfigured()) {
    const dbRows = await sbSelect<CreatorProjectRecord>(
      "creator_projects",
      `student_pseudonymous_id=eq.${encodeURIComponent(studentId)}&order=updated_at.desc&limit=50`
    );
    if (dbRows && dbRows.length > 0) {
      projects = dbRows;
    }
  }

  if (toolType) {
    projects = projects.filter((p) => p.tool_type === toolType);
  }

  return NextResponse.json({
    projects,
    public_sharing_default: false,
    storage: isSupabaseConfigured() ? "supabase-postgres" : "in-memory-fallback",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || "save";
    const store = getProjectsStore();
    const targetProjectId = body.project_id || body.id;

    if (action === "delete" && targetProjectId) {
      const idx = store.findIndex((p) => p.id === targetProjectId);
      if (idx >= 0) store.splice(idx, 1);
      return NextResponse.json({ status: "deleted", project_id: targetProjectId });
    }

    if (
      (action === "toggle_parent_sharing" || action === "set_parent_sharing") &&
      targetProjectId
    ) {
      const proj = store.find((p) => p.id === targetProjectId);
      if (proj) {
        proj.parent_sharing_approved = Boolean(body.parent_sharing_approved);
        proj.updated_at = new Date().toISOString();
      }
      return NextResponse.json({ status: "updated", project: proj });
    }

    const title = String(body.title || "My Weebly Creation").trim().slice(0, 140);
    const toolType = (body.tool_type || "game_maker") as CreatorToolType;
    const studentId = normalizeStudentId(body.student_pseudonymous_id || body.child_id);
    const ageBand = String(body.age_band || "6");

    const { safe, sanitized } = sanitizeProjectContent(body.project_state || {});
    if (!safe) {
      return NextResponse.json(
        {
          error:
            "Safety & Privacy Filter: Please remove personal phone numbers or unsafe words before saving your project.",
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const existingIdx = targetProjectId ? store.findIndex((p) => p.id === targetProjectId) : -1;
    const objectives = Array.isArray(body.learning_objectives_practiced)
      ? body.learning_objectives_practiced
      : DEFAULT_OBJECTIVES_BY_TOOL[toolType] || ["Creative expression", "Problem solving"];

    const record: CreatorProjectRecord = {
      id:
        existingIdx >= 0
          ? store[existingIdx].id
          : `proj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      student_pseudonymous_id: studentId,
      tool_type: toolType,
      title,
      age_band: ageBand,
      project_state: sanitized,
      learning_objectives_practiced: objectives,
      moderation_status: "approved_private",
      parent_sharing_approved: false, // Never public by default
      teacher_visible: true,
      updated_at: now,
      created_at: existingIdx >= 0 ? store[existingIdx].created_at : now,
    };

    if (existingIdx >= 0) {
      store[existingIdx] = record;
    } else {
      store.unshift(record);
    }

    const eventType = existingIdx >= 0 ? "project_updated" : "project_created";
    const emittedEvent = recordServerActivityEvent({
      event_type: eventType,
      student_pseudonymous_id: studentId,
      activity_id: record.id,
      activity_title: `${title} (${toolType.replace("_", " ")})`,
      category: "creative_expression",
      learning_objective: objectives.join(", "),
      completion_status: "completed",
      hints_used_count: 0,
      language_used: "en",
      duration_seconds: 180,
    });

    let persisted = false;
    if (isSupabaseConfigured()) {
      const inserted = await sbInsert<CreatorProjectRecord>("creator_projects", record);
      if (inserted) persisted = true;
    }

    return NextResponse.json({
      event_type: eventType,
      project: record,
      emitted_event: emittedEvent,
      persisted,
      storage: persisted ? "supabase-postgres" : "in-memory-fallback",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to save creator project", detail: err?.message },
      { status: 500 }
    );
  }
}
