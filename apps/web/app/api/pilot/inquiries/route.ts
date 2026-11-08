import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, sbInsert, sbSelect } from "@/lib/server/supabase";

export interface PilotInquiryRecord {
  id: string;
  organization_name: string;
  contact_name: string;
  contact_email: string;
  role: string;
  student_count_estimate?: string;
  message?: string;
  created_at: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __weeblyPilotInquiries: PilotInquiryRecord[] | undefined;
}

function getInquiryStore(): PilotInquiryRecord[] {
  if (!globalThis.__weeblyPilotInquiries) {
    globalThis.__weeblyPilotInquiries = [];
  }
  return globalThis.__weeblyPilotInquiries;
}

export async function GET() {
  if (isSupabaseConfigured()) {
    const dbRows = await sbSelect<PilotInquiryRecord>("pilot_inquiries", "order=created_at.desc&limit=50");
    if (dbRows) {
      return NextResponse.json({
        inquiries: dbRows,
        storage: "supabase-postgres",
        persisted: true,
      });
    }
  }
  return NextResponse.json({
    inquiries: getInquiryStore(),
    storage: "memory-fallback",
    persisted: false,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const contactName = String(body.contact_name || body.name || "").trim();
    const contactEmail = String(body.contact_email || body.email || "").trim();
    const orgName = String(body.organization_name || body.school_name || body.organization || "Family / Individual").trim();

    if (!contactName || !contactEmail || !contactEmail.includes("@")) {
      return NextResponse.json(
        { error: "Valid contact name and email address are required" },
        { status: 400 }
      );
    }

    const record: PilotInquiryRecord = {
      id: `inq_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      organization_name: orgName.slice(0, 200),
      contact_name: contactName.slice(0, 140),
      contact_email: contactEmail.slice(0, 180),
      role: String(body.role || "school_leader").slice(0, 80),
      student_count_estimate: String(body.student_count_estimate || body.students || "50-200").slice(0, 80),
      message: String(body.message || body.notes || "").slice(0, 1500),
      created_at: new Date().toISOString(),
    };

    let persisted = false;
    if (isSupabaseConfigured()) {
      const inserted = await sbInsert<PilotInquiryRecord>("pilot_inquiries", record);
      if (inserted) persisted = true;
    }

    getInquiryStore().unshift(record);

    return NextResponse.json({
      status: "received",
      inquiry: record,
      persisted,
      storage: persisted ? "supabase-postgres" : "memory-fallback",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to submit inquiry", detail: err?.message },
      { status: 500 }
    );
  }
}
