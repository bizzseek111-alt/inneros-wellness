import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, sbInsert, sbSelect } from "@/lib/server/supabase";

export interface ClassroomAssignmentRecord {
  id: string;
  classroom_id: string;
  title: string;
  world_id: string;
  skill_domain: string;
  language: string;
  age_band: string;
  assigned_by: string;
  due_date?: string;
  created_at: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __weeblyTeacherAssignments: ClassroomAssignmentRecord[] | undefined;
}

const SEED_ASSIGNMENTS: ClassroomAssignmentRecord[] = [
  {
    id: "asgn_seed_1",
    classroom_id: "class_g2_lahore",
    title: "Number Bridge & Bilingual Counting (1–20)",
    world_id: "learning-quest",
    skill_domain: "numeracy",
    language: "ur",
    age_band: "6-9",
    assigned_by: "Ms. Nadia Tariq",
    due_date: new Date(Date.now() + 3 * 86400 * 1000).toISOString().slice(0, 10),
    created_at: new Date(Date.now() - 86400 * 1000).toISOString(),
  },
  {
    id: "asgn_seed_2",
    classroom_id: "class_g2_lahore",
    title: "Kindness & Sharing Story Studio with Mia",
    world_id: "creative-studio",
    skill_domain: "literacy_sel",
    language: "en",
    age_band: "6-9",
    assigned_by: "Ms. Nadia Tariq",
    due_date: new Date(Date.now() + 5 * 86400 * 1000).toISOString().slice(0, 10),
    created_at: new Date(Date.now() - 172800 * 1000).toISOString(),
  },
];

function getAssignmentStore(): ClassroomAssignmentRecord[] {
  if (!globalThis.__weeblyTeacherAssignments) {
    globalThis.__weeblyTeacherAssignments = [...SEED_ASSIGNMENTS];
  }
  return globalThis.__weeblyTeacherAssignments;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const classroomId = searchParams.get("classroom_id") || "class_g2_lahore";

  if (isSupabaseConfigured()) {
    const dbRows = await sbSelect<ClassroomAssignmentRecord>(
      "classroom_assignments",
      `classroom_id=eq.${encodeURIComponent(classroomId)}&order=created_at.desc&limit=50`
    );
    if (dbRows) {
      return NextResponse.json({
        assignments: dbRows.length > 0 ? dbRows : SEED_ASSIGNMENTS,
        storage: "supabase-postgres",
        persisted: true,
      });
    }
  }

  const store = getAssignmentStore();
  return NextResponse.json({
    assignments: store.filter((a) => !classroomId || a.classroom_id === classroomId),
    storage: "memory-fallback",
    persisted: false,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = String(body.title || "").trim();
    if (!title) {
      return NextResponse.json({ error: "Assignment title is required" }, { status: 400 });
    }

    const record: ClassroomAssignmentRecord = {
      id: `asgn_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      classroom_id: String(body.classroom_id || "class_g2_lahore"),
      title: title.slice(0, 200),
      world_id: String(body.world_id || "learning-quest"),
      skill_domain: String(body.skill_domain || "literacy"),
      language: String(body.language || "en"),
      age_band: String(body.age_band || "6-9"),
      assigned_by: String(body.assigned_by || "Classroom Teacher"),
      due_date: body.due_date || new Date(Date.now() + 4 * 86400 * 1000).toISOString().slice(0, 10),
      created_at: new Date().toISOString(),
    };

    let persisted = false;
    if (isSupabaseConfigured()) {
      const inserted = await sbInsert<ClassroomAssignmentRecord>("classroom_assignments", record);
      if (inserted) persisted = true;
    }

    const store = getAssignmentStore();
    store.unshift(record);

    return NextResponse.json({
      status: "assigned",
      assignment: record,
      persisted,
      storage: persisted ? "supabase-postgres" : "memory-fallback",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to create classroom assignment", detail: err?.message },
      { status: 500 }
    );
  }
}
