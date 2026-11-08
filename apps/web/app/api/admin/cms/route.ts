import { NextRequest, NextResponse } from "next/server";
import { sbSelect, sbInsert, isSupabaseConfigured } from "@/lib/server/supabase";

export type CmsLifecycleStage = "Draft" | "Under Review" | "Approved" | "Published" | "Archived";

export type CmsContentCategory =
  | "Journey templates"
  | "Watch content"
  | "AI Creator templates"
  | "Foundational skills activities"
  | "AI literacy curriculum"
  | "Age pathways"
  | "Question bank"
  | "RAG sources";

export interface CmsContentItem {
  id: string;
  category: CmsContentCategory;
  title: string;
  age_band: string;
  language_support: string[];
  lifecycle_stage: CmsContentStageAlias | CmsLifecycleStage;
  licensing_status: "Original Weebly Asset" | "Open Educational Resource (CC-BY)" | "Licensed Partner Content";
  reviewer_notes: string;
  updated_at: string;
}

type CmsContentStageAlias = CmsLifecycleStage;

const IN_MEMORY_CMS_ITEMS: CmsContentItem[] = [
  {
    id: "cms_jrn_mangoes",
    category: "Journey templates",
    title: "The Fair-Share Mango Orchard (5-Stage Math Journey)",
    age_band: "6-9",
    language_support: ["en", "ur", "pa"],
    lifecycle_stage: "Published",
    licensing_status: "Original Weebly Asset",
    reviewer_notes: "Verified accessible Watch storyboard and non-clinical reflection prompts.",
    updated_at: new Date().toISOString(),
  },
  {
    id: "cms_watch_lantern",
    category: "Watch content",
    title: "Noor's Calm Lantern (Illustrated Animated Storyboard + Captions)",
    age_band: "5-9",
    language_support: ["en", "ur", "pa"],
    lifecycle_stage: "Published",
    licensing_status: "Original Weebly Asset",
    reviewer_notes: "No unverified external embeds; includes transcript and calm audio description.",
    updated_at: new Date().toISOString(),
  },
  {
    id: "cms_creator_block_game",
    category: "AI Creator templates",
    title: "Star Catcher 5x5 Visual Block Game Starter",
    age_band: "6-12",
    language_support: ["en", "ur", "pa"],
    lifecycle_stage: "Published",
    licensing_status: "Original Weebly Asset",
    reviewer_notes: "Tested Age 5 icon mode and Age 6-12 block logic.",
    updated_at: new Date().toISOString(),
  },
  {
    id: "cms_skill_switch_rule",
    category: "Foundational skills activities",
    title: "Switch the Rule (Cognitive Flexibility Card Sort)",
    age_band: "6-12",
    language_support: ["en", "ur", "pa"],
    lifecycle_stage: "Published",
    licensing_status: "Original Weebly Asset",
    reviewer_notes: "Non-diagnostic executive function practice; zero clinical claims.",
    updated_at: new Date().toISOString(),
  },
  {
    id: "cms_ai_detective_cases",
    category: "AI literacy curriculum",
    title: "AI Detective: Spot the Hallucination & Protect Privacy",
    age_band: "7-15",
    language_support: ["en", "ur", "pa"],
    lifecycle_stage: "Published",
    licensing_status: "Original Weebly Asset",
    reviewer_notes: "Aligned with Understand / Apply / Create AI competency themes.",
    updated_at: new Date().toISOString(),
  },
  {
    id: "cms_age_pathway_matrix",
    category: "Age pathways",
    title: "Ages 2-18 Developmental & AI Competency Progression Matrix",
    age_band: "2-18",
    language_support: ["en", "ur", "pa"],
    lifecycle_stage: "Approved",
    licensing_status: "Original Weebly Asset",
    reviewer_notes: "Approved by curriculum lead for school pilot.",
    updated_at: new Date().toISOString(),
  },
  {
    id: "cms_qbank_3000",
    category: "Question bank",
    title: "Weebly 3,000 Bilingual Guided Question Library (v2.4.0)",
    age_band: "3-16",
    language_support: ["en", "ur", "pa"],
    lifecycle_stage: "Published",
    licensing_status: "Original Weebly Asset",
    reviewer_notes: "Full 3,000-item bank verified across 10 domains.",
    updated_at: new Date().toISOString(),
  },
  {
    id: "cms_rag_punjab_pctb",
    category: "RAG sources",
    title: "Punjab Curriculum & Textbook Board (PCTB) Early Math & Literacy Alignment",
    age_band: "5-12",
    language_support: ["en", "ur", "pa"],
    lifecycle_stage: "Under Review",
    licensing_status: "Open Educational Resource (CC-BY)",
    reviewer_notes: "Pending final Grade 5 Punjabi vocabulary spot-check before publishing to children.",
    updated_at: new Date().toISOString(),
  },
];

const VALID_STAGES: CmsLifecycleStage[] = [
  "Draft",
  "Under Review",
  "Approved",
  "Published",
  "Archived",
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const stage = searchParams.get("stage");
  const childFacingOnly = searchParams.get("child_facing") === "true";

  let items = [...IN_MEMORY_CMS_ITEMS];

  if (isSupabaseConfigured()) {
    const dbRows = await sbSelect<CmsContentItem>("cms_content_items", "select=*");
    if (dbRows && dbRows.length > 0) {
      const map = new Map<string, CmsContentItem>();
      items.forEach((i) => map.set(i.id, i));
      dbRows.forEach((r) => map.set(r.id, r));
      items = Array.from(map.values());
    }
  }

  // Only Published content is visible to children
  if (childFacingOnly) {
    items = items.filter((item) => item.lifecycle_stage === "Published");
  } else {
    if (category) items = items.filter((item) => item.category === category);
    if (stage) items = items.filter((item) => item.lifecycle_stage === stage);
  }

  return NextResponse.json({
    ok: true,
    lifecycle_stages: VALID_STAGES,
    child_visibility_rule: "Only Published content is visible to children.",
    total: items.length,
    items,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "transition_stage") {
      const { id, next_stage, reviewer_notes } = body;
      if (!VALID_STAGES.includes(next_stage)) {
        return NextResponse.json({ ok: false, error: "Invalid lifecycle stage" }, { status: 400 });
      }
      const idx = IN_MEMORY_CMS_ITEMS.findIndex((i) => i.id === id);
      if (idx === -1) {
        return NextResponse.json({ ok: false, error: "CMS item not found" }, { status: 404 });
      }
      IN_MEMORY_CMS_ITEMS[idx] = {
        ...IN_MEMORY_CMS_ITEMS[idx],
        lifecycle_stage: next_stage,
        reviewer_notes: reviewer_notes || IN_MEMORY_CMS_ITEMS[idx].reviewer_notes,
        updated_at: new Date().toISOString(),
      };
      return NextResponse.json({
        ok: true,
        item: IN_MEMORY_CMS_ITEMS[idx],
        visible_to_children: IN_MEMORY_CMS_ITEMS[idx].lifecycle_stage === "Published",
      });
    }

    // Create new CMS content item (defaults to Draft)
    const newItem: CmsContentItem = {
      id: body.id || `cms_${Date.now()}`,
      category: body.category || "Journey templates",
      title: String(body.title || "Untitled Curriculum Item").slice(0, 140),
      age_band: body.age_band || "6-9",
      language_support: Array.isArray(body.language_support) ? body.language_support : ["en", "ur", "pa"],
      lifecycle_stage: VALID_STAGES.includes(body.lifecycle_stage) ? body.lifecycle_stage : "Draft",
      licensing_status: body.licensing_status || "Original Weebly Asset",
      reviewer_notes: body.reviewer_notes || "Created in Draft stage.",
      updated_at: new Date().toISOString(),
    };

    IN_MEMORY_CMS_ITEMS.unshift(newItem);
    if (isSupabaseConfigured()) {
      await sbInsert("cms_content_items", newItem as unknown as Record<string, unknown>);
    }

    return NextResponse.json({
      ok: true,
      item: newItem,
      visible_to_children: newItem.lifecycle_stage === "Published",
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Invalid request" }, { status: 400 });
  }
}
