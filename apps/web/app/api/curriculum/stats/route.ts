import { NextResponse } from "next/server";
import manifest from "@/lib/question-bank-manifest.json";

export async function GET() {
  return NextResponse.json({
    total_questions: manifest.total_questions,
    curriculum_version: manifest.curriculum_version,
    generated_at: manifest.generated_at,
    category_distribution: manifest.category_distribution,
    review_status_summary: manifest.review_status_summary,
  });
}
