import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, sbInsert, sbSelect } from "@/lib/server/supabase";

export interface ParentObservationRecord {
  id: string;
  child_id: string;
  parent_note: string;
  context_tag: string;
  created_at: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __weeblyParentObservations: ParentObservationRecord[] | undefined;
}

const SEED_OBSERVATIONS: ParentObservationRecord[] = [
  {
    id: "obs_seed_1",
    child_id: "child_aarav_1",
    parent_note: "Enjoyed the bilingual Urdu counting song after dinner and asked to practice with Mia again tomorrow.",
    context_tag: "home_routine",
    created_at: new Date(Date.now() - 86400 * 1000).toISOString(),
  },
  {
    id: "obs_seed_2",
    child_id: "child_aarav_1",
    parent_note: "Used the 3-breath balloon calm-down with Lumi before bedtime.",
    context_tag: "emotional_regulation",
    created_at: new Date(Date.now() - 172800 * 1000).toISOString(),
  },
];

function getMemoryStore(): ParentObservationRecord[] {
  if (!globalThis.__weeblyParentObservations) {
    globalThis.__weeblyParentObservations = [...SEED_OBSERVATIONS];
  }
  return globalThis.__weeblyParentObservations;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const childId = searchParams.get("child_id") || "child_aarav_1";

  if (isSupabaseConfigured()) {
    const dbRows = await sbSelect<ParentObservationRecord>(
      "parent_observations",
      `child_id=eq.${encodeURIComponent(childId)}&order=created_at.desc&limit=50`
    );
    if (dbRows) {
      return NextResponse.json({
        observations: dbRows.length > 0 ? dbRows : SEED_OBSERVATIONS.filter((o) => o.child_id === childId),
        storage: "supabase-postgres",
        persisted: true,
      });
    }
  }

  const store = getMemoryStore();
  return NextResponse.json({
    observations: store.filter((o) => !childId || o.child_id === childId),
    storage: "memory-fallback",
    persisted: false,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parentNote = String(body.parent_note || body.note || "").trim();
    if (!parentNote) {
      return NextResponse.json({ error: "Observation note is required" }, { status: 400 });
    }

    const record: ParentObservationRecord = {
      id: `obs_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      child_id: String(body.child_id || "child_aarav_1"),
      parent_note: parentNote.slice(0, 1000),
      context_tag: String(body.context_tag || "general"),
      created_at: new Date().toISOString(),
    };

    let persisted = false;
    if (isSupabaseConfigured()) {
      const inserted = await sbInsert<ParentObservationRecord>("parent_observations", record);
      if (inserted) persisted = true;
    }

    const store = getMemoryStore();
    store.unshift(record);

    return NextResponse.json({
      status: "recorded",
      observation: record,
      persisted,
      storage: persisted ? "supabase-postgres" : "memory-fallback",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to save parent observation", detail: err?.message },
      { status: 500 }
    );
  }
}
