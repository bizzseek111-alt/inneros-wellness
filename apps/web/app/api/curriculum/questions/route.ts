import { NextRequest, NextResponse } from "next/server";
import manifest from "@/lib/question-bank-manifest.json";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const age = searchParams.get("age");
  const difficulty = searchParams.get("difficulty");
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.toLowerCase();
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const offset = Math.max(0, parseInt(searchParams.get("offset") || "0"));

  let filtered = manifest.questions_summary;

  if (category && category !== "all") {
    filtered = filtered.filter((q) => q.category === category);
  }
  if (age && age !== "all") {
    filtered = filtered.filter((q) => q.age_range === age);
  }
  if (difficulty && difficulty !== "all") {
    filtered = filtered.filter((q) => q.difficulty === difficulty);
  }
  if (status && status !== "all") {
    filtered = filtered.filter((q) => q.review_status === status);
  }
  if (search) {
    filtered = filtered.filter(
      (q) =>
        q.text_en.toLowerCase().includes(search) ||
        q.text_ur.includes(search) ||
        q.text_pa.includes(search) ||
        q.subcategory.toLowerCase().includes(search) ||
        q.id.toLowerCase().includes(search)
    );
  }

  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  // If a specific question ID is requested with full detail
  const questionId = searchParams.get("id");
  if (questionId) {
    const fullQuestion = manifest.sample_approved_questions.find((q) => q.id === questionId);
    if (fullQuestion) {
      return NextResponse.json(fullQuestion);
    }
  }

  return NextResponse.json({
    total,
    offset,
    limit,
    questions: paginated,
  });
}
