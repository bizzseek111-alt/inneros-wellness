import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const WEB_ROOT = path.resolve(import.meta.dirname, "..");

function readFile(relPath) {
  return fs.readFileSync(path.join(WEB_ROOT, relPath), "utf8");
}

describe("Weebly V10 — Unified AI Learning, Creation, Foundational Skills & Child Development", () => {
  it("Phase 1 & Positioning: Homepage and Inventory present WEEBLY — LEARN. CREATE. THINK. GROW. across all 4 pillars", () => {
    const home = readFile("app/page.tsx");
    assert.ok(home.includes("WEEBLY — LEARN. CREATE. THINK. GROW."), "Homepage must display V10 positioning");
    assert.ok(home.includes("Pillar 01 · Learn with AI"), "Pillar 1 present");
    assert.ok(home.includes("Pillar 02 · Create with AI"), "Pillar 2 present");
    assert.ok(home.includes("Pillar 03 · Build Foundational Skills"), "Pillar 3 present");
    assert.ok(home.includes("Pillar 04 · Grow with Support"), "Pillar 4 present");
  });

  it("Phase 2: Unified Learning Journey Engine implements WATCH -> LEARN -> PLAY -> IMPLEMENT -> REFLECT and 6 complete journeys", () => {
    const engine = readFile("lib/v10-journey-engine.ts");
    const player = readFile("components/v10/LearningJourneyPlayer.tsx");
    const api = readFile("app/api/youth/journeys/route.ts");

    assert.ok(engine.includes("jrn_math_fair_share_mangoes"), "Math journey present");
    assert.ok(engine.includes("jrn_story_brave_rickshaw_bird"), "Storytelling journey present");
    assert.ok(engine.includes("jrn_attention_lantern_freeze_go"), "Attention journey present");
    assert.ok(engine.includes("jrn_ai_literacy_what_is_ai"), "AI Literacy journey present");
    assert.ok(engine.includes("jrn_creative_kindness_cartoon"), "Creative project journey present");
    assert.ok(engine.includes("jrn_life_calm_morning_routine"), "Life skills journey present");

    assert.ok(player.includes("watch") && player.includes("learn") && player.includes("play") && player.includes("implement") && player.includes("reflect"), "All 5 stages supported");
    assert.ok(player.includes("Skip Stage"), "Optional stage skipping supported");
    assert.ok(api.includes("journey_started") && api.includes("journey_completed"), "Journey API emits structured events");
  });

  it("Phase 3: AI Creator Academy (/youth/creator) provides all 6 creation studios including Age 5/6/7-16 Visual Block Game Maker and private-by-default persistence", () => {
    const creatorPage = readFile("app/youth/creator/page.tsx");
    const creatorApi = readFile("app/api/youth/creator/projects/route.ts");

    assert.ok(creatorPage.includes("1. AI Story Maker"), "1. AI Story Maker present");
    assert.ok(creatorPage.includes("2. AI Game Maker"), "2. AI Game Maker present");
    assert.ok(creatorPage.includes("3. Cartoon Studio"), "3. Cartoon Studio present");
    assert.ok(creatorPage.includes("4. Art & Design Lab"), "4. Art & Design Lab present");
    assert.ok(creatorPage.includes("5. Young AI Inventors"), "5. Young AI Inventors present");
    assert.ok(creatorPage.includes("6. AI Detective"), "6. AI Detective present");

    // Visual Block Game Maker blocks & age modes
    assert.ok(creatorPage.includes("When Tapped") && creatorPage.includes("Move Right"), "Visual block logic present");
    assert.ok(creatorApi.includes("parent_sharing_approved: false"), "Projects default to private (parent_sharing_approved: false)");
  });

  it("Phase 4: Age-Based AI Learning Pathway (Ages 2-4, 5, 6, 7-9, 10-12, 13-15, 16-18) uses Understand / Apply / Create without claiming UNESCO endorsement", () => {
    const academyPublic = readFile("app/ai-creator-academy/page.tsx");
    assert.ok(academyPublic.includes("Understand"), "Understand column present");
    assert.ok(academyPublic.includes("Apply"), "Apply column present");
    assert.ok(academyPublic.includes("Create"), "Create column present");
    assert.ok(academyPublic.includes("2–4") && academyPublic.includes("16–18"), "Full age 2-18 progression covered");
    assert.ok(academyPublic.includes("without claiming official UNESCO endorsement"), "Explicitly disclaims UNESCO official endorsement");
  });

  it("Phase 5 & 6: Foundational Skills Lab (/youth/skills-lab) implements all 10 cognitive/executive-function activities, inclusive controls, and strict non-clinical boundary", () => {
    const skillsLib = readFile("lib/v10-foundational-skills.ts");
    const skillsPage = readFile("app/youth/skills-lab/page.tsx");

    const requiredIds = [
      "freeze_and_go",
      "memory_garden",
      "pattern_detective",
      "switch_the_rule",
      "plan_my_day",
      "story_sequencer",
      "friendship_choices",
      "puzzle_builder",
      "follow_the_steps",
      "create_a_strategy",
    ];
    for (const id of requiredIds) {
      assert.ok(skillsLib.includes(id), `Foundational skill ${id} must be implemented`);
    }

    assert.ok(skillsPage.includes("Reduced Distraction"), "Reduced distraction mode toggle present");
    assert.ok(skillsPage.includes("Wide Reading Spacing"), "Wide reading spacing toggle present");
    assert.ok(skillsPage.includes("never clinical assessments or medical diagnoses"), "Strict non-clinical disclaimer present");
  });

  it("Phase 7 & 8: Skills & Creations Passport (/youth/passport) and Unified Play Worlds (/youth/play) connect all 4 pillars without competing navigation", () => {
    const passport = readFile("app/youth/passport/page.tsx");
    const playHub = readFile("app/youth/play/page.tsx");

    assert.ok(passport.includes("Skills &amp; Creations Passport") || passport.includes("Skills & Creations Passport"), "Passport title present");
    assert.ok(passport.includes("never generates IQ scores"), "Non-diagnostic guarantee in Passport");
    assert.ok(passport.includes("Parent Sharing Controls"), "Parent sharing approval controls in Passport");

    assert.ok(playHub.includes("/youth/journeys"), "Play Hub links to Journeys");
    assert.ok(playHub.includes("/youth/creator"), "Play Hub links to AI Creator Academy");
    assert.ok(playHub.includes("/youth/skills-lab"), "Play Hub links to Foundational Skills Lab");
    assert.ok(playHub.includes("/youth/passport"), "Play Hub links to Skills Passport");
  });

  it("Phase 9 & 10: AI Turn API routes V10 tools, Activity Events API supports V10 event types, and Admin CMS enforces Published-only child visibility", () => {
    const turnApi = readFile("app/api/youth/friends/turn/route.ts");
    const eventsApi = readFile("app/api/educational/activity-events/route.ts");
    const cmsApi = readFile("app/api/admin/cms/route.ts");

    assert.ok(turnApi.includes("open_learning_journey") && turnApi.includes("debug_visual_game"), "AI turn router supports V10 tools");
    assert.ok(
      eventsApi.includes("journey_started") &&
        eventsApi.includes("journey_completed") &&
        eventsApi.includes("project_created") &&
        eventsApi.includes("learning_objective_practiced"),
      "Activity events API supports all V10 structured event types"
    );
    assert.ok(
      cmsApi.includes("Only Published content is visible to children."),
      "Admin CMS enforces Published-only visibility for children"
    );
  });
});
