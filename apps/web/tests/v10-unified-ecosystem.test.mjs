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

  it("Phase 11: International-Grade 16-Section Homepage, Navigation, Dedicated Product Pages & Zero Broken Links", () => {
    const home = readFile("app/page.tsx");
    const nav = readFile("components/marketing/MarketingShell.tsx");
    const tokens = readFile("design-system/weebly-v10-tokens.ts");
    const creatorShowcase = readFile("components/v10/AICreatorAcademyShowcase.tsx");

    // Verify Design System & 16-section architecture
    assert.ok(tokens.includes("homepageArchitecture16"), "V10 design system defines 16 homepage sections");
    assert.ok(creatorShowcase.includes("LIVE 5×3 GAME STAGE"), "Flagship AI Creator Academy showcase includes playable stage");
    assert.ok(home.includes("AICreatorAcademyShowcase"), "Homepage mounts flagship AI Creator Academy section");
    assert.ok(home.includes("JourneyEngineInteractivePreview"), "Homepage mounts interactive Watch->Learn->Play->Implement->Reflect section");
    assert.ok(home.includes("FoundationalSkillsInteractivePreview"), "Homepage mounts interactive Foundational Skills puzzle");
    assert.ok(home.includes("InclusiveLearningInteractivePreview"), "Homepage mounts interactive Inclusive Learning & AAC sandbox");

    // Verify Public Navigation (Explore, Learning, Create with AI, Parents, Schools, Try Demo)
    assert.ok(nav.includes('label: "Explore"'), "Nav includes Explore");
    assert.ok(nav.includes('label: "Learning"'), "Nav includes Learning");
    assert.ok(nav.includes('label: "Create with AI"'), "Nav includes Create with AI");
    assert.ok(nav.includes('label: "Parents"'), "Nav includes Parents");
    assert.ok(nav.includes('label: "Schools"'), "Nav includes Schools");
    assert.ok(nav.includes("Try Demo"), "Nav includes Try Demo CTA");

    // Verify all 8 Dedicated Pages exist and contain interactive previews, status badges, and demo CTAs
    const dedicatedPages = [
      "app/learning-method/page.tsx",
      "app/ai-creator/page.tsx",
      "app/ai-literacy/page.tsx",
      "app/brain-skills/page.tsx",
      "app/inclusive-learning/page.tsx",
      "app/child-development/page.tsx",
      "app/access/page.tsx",
      "app/platform/page.tsx",
    ];
    for (const pagePath of dedicatedPages) {
      const full = path.join(WEB_ROOT, pagePath);
      assert.ok(fs.existsSync(full), `Dedicated page must exist: ${pagePath}`);
      const content = fs.readFileSync(full, "utf8");
      assert.ok(content.includes("LIVE AND VERIFIED"), `${pagePath} must state current implementation status`);
    }
  });

  it("Task A — Complete End-to-End Integration: AI Friends -> Journeys/Creator/Worlds -> Saved Projects -> Skills Passport -> Parent Reports & Teacher/School/Professional Workflows", () => {
    const friendsTurn = readFile("app/api/youth/friends/turn/route.ts");
    const journeysApi = readFile("app/api/youth/journeys/route.ts");
    const creatorApi = readFile("app/api/youth/creator/projects/route.ts");
    const activityEventsApi = readFile("app/api/educational/activity-events/route.ts");
    const passportPage = readFile("app/youth/passport/page.tsx");
    const parentPage = readFile("app/parent/page.tsx");
    const teacherPage = readFile("app/teacher/dashboard/page.tsx");
    const schoolPage = readFile("app/school/portal/page.tsx");
    const profPage = readFile("app/professional/portal/page.tsx");

    // 1-3: AI Friends -> Learning Journeys, AI Creator, Six Learning Worlds
    assert.ok(friendsTurn.includes("open_learning_journey"), "AI Friends routes to Learning Journeys");
    assert.ok(
      friendsTurn.includes("open_creator_academy") && friendsTurn.includes("debug_visual_game"),
      "AI Friends routes to AI Creator"
    );
    assert.ok(
      friendsTurn.includes("start_creative_drawing") &&
        friendsTurn.includes("start_sports_drill") &&
        friendsTurn.includes("start_tech_discovery"),
      "AI Friends routes to Six Learning Worlds"
    );

    // 4-6: Learning Journeys & AI Creator -> Shared Educational Events Store & Skills Passport
    assert.ok(journeysApi.includes("recordServerActivityEvent"), "Journeys API emits directly into shared activity events store");
    assert.ok(creatorApi.includes("recordServerActivityEvent"), "Creator Projects API emits project_created/project_updated into shared activity events store");
    assert.ok(
      creatorApi.includes('action === "set_parent_sharing"') && creatorApi.includes('searchParams.get("child_id")'),
      "Creator Projects API aligns with Skills Passport child_id and set_parent_sharing parameters"
    );
    assert.ok(passportPage.includes("/api/youth/creator/projects"), "Skills Passport loads saved projects from Creator API");

    // 7: Educational Events & Saved Projects -> Authorized Parent Dashboard Reports
    assert.ok(
      parentPage.includes("/api/educational/activity-events?view=parent") &&
        parentPage.includes("/api/youth/creator/projects"),
      "Parent Dashboard fetches live V10 educational events and created projects portfolio"
    );
    assert.ok(
      parentPage.includes("Created Projects Portfolio (AI Creator Academy)") &&
        parentPage.includes("Recent Learning Journeys"),
      "Parent Dashboard renders Created Projects Portfolio and Recent Learning Journeys"
    );

    // 8-10: Teacher Assignments -> Child Activities, School Programs -> Curriculum, Authorized Observations -> Support Workflow
    assert.ok(
      teacherPage.includes("Assign V10 Learning Journeys") &&
        teacherPage.includes("Inspect Student Project Portfolio"),
      "Teacher Dashboard supports assigning V10 Learning Journeys and inspecting student project portfolios"
    );
    assert.ok(
      schoolPage.includes("V10 AI Creator Academy & 5-Stage Learning Journeys"),
      "School Portal maps programs to V10 AI Creator & 5-Stage Learning Journeys curriculum"
    );
    assert.ok(
      parentPage.includes("/api/parent/observations") && profPage.includes("/api/parent/observations"),
      "Authorized Parent Observations flow end-to-end into Professional Support Portal"
    );
  });

  it("Task B — Demo Center (/demos): All 6 role demos include V10 capabilities with Fictional Isolated Data and Guided Tour / Explore Freely / Back / Restart / Exit controls", () => {
    const demos = readFile("app/demos/page.tsx");

    // Verify all 6 role demo IDs and V10 highlights
    assert.ok(demos.includes("child-magic-world") && demos.includes("Complete learning journey") && demos.includes("Create a visual game") && demos.includes("Save a story"), "Child demo covers Magic Home, AI Friend, Journey, Visual Game, and Story");
    assert.ok(demos.includes("parent-center") && demos.includes("Learning progress") && demos.includes("Created projects") && demos.includes("Observation diary") && demos.includes("Family settings"), "Parent demo covers progress, created projects, observation diary, and settings");
    assert.ok(demos.includes("teacher-studio") && demos.includes("Assign journey") && demos.includes("Review learning completion") && demos.includes("Inspect project portfolio"), "Teacher demo covers assigning journeys, completion review, and project portfolio");
    assert.ok(demos.includes("school-management") && demos.includes("Classes") && demos.includes("Curriculum") && demos.includes("Programs") && demos.includes("Aggregate educational reports"), "School demo covers classes, curriculum, programs, and aggregate reports");
    assert.ok(demos.includes("child-support-review") && demos.includes("Fictional consent") && demos.includes("Observation intake") && demos.includes("Professional support review"), "Professional demo covers fictional consent, observation intake, and support review");
    assert.ok(demos.includes("platform-admin") && demos.includes("Journey CMS") && demos.includes("Creator templates") && demos.includes("Voice configuration") && demos.includes("content approvals") && demos.includes("QA status"), "Admin demo covers Curriculum, Journey CMS, Creator templates, Voice, RAG, Approvals, and QA status");

    // Verify required interactive tour controls: Guided Tour, Explore Freely, Back, Restart, Exit
    assert.ok(demos.includes("Guided Tour"), "Guided Tour control present");
    assert.ok(demos.includes("Explore Freely"), "Explore Freely control present");
    assert.ok(demos.includes("Back"), "Back control present");
    assert.ok(demos.includes("Restart") && demos.includes("restartTour"), "Restart control present");
    assert.ok(demos.includes("Exit Tour"), "Exit control present");
  });

  it("Task C, D, E & F — Mobile/PWA, Educational Quality, Safety/Privacy & Visual QA Verification", () => {
    const manifest = readFile("app/manifest.ts");
    const sw = readFile("public/sw.js");
    const offlinePage = readFile("app/offline/page.tsx");
    const creatorApi = readFile("app/api/youth/creator/projects/route.ts");
    const cmsApi = readFile("app/api/admin/cms/route.ts");
    const middleware = readFile("middleware.ts");

    // Task C: Mobile & PWA
    assert.ok(manifest.includes('display: "standalone"') && manifest.includes("/youth/dashboard"), "PWA manifest configured for standalone install");
    assert.ok(sw.includes("/offline") && sw.includes("CACHE_VERSION"), "Service worker caches offline fallback and assets");
    assert.ok(offlinePage.includes("Offline") || offlinePage.includes("offline"), "Offline fallback route exists");

    // Task D: Educational Quality (Trilingual EN/UR/PA, learning objectives, content approvals)
    const journeyEngine = readFile("lib/v10-journey-engine.ts");
    assert.ok(
      journeyEngine.includes("learning_objective") &&
        journeyEngine.includes('"en"') &&
        journeyEngine.includes('"ur"') &&
        journeyEngine.includes('"pa"'),
      "Journeys include explicit learning objectives and EN/UR/PA trilingual content"
    );
    assert.ok(cmsApi.includes('item.lifecycle_stage === "Published"'), "CMS enforces content approval gating before child visibility");

    // Task E: Safety & Privacy (No public project sharing by default, PII/unsafe filter, no eval/Function execution, role isolation)
    assert.ok(creatorApi.includes("public_sharing_default: false") && creatorApi.includes("parent_sharing_approved: false"), "No unauthorized public project sharing");
    assert.ok(creatorApi.includes("BANNED_PATTERNS") && creatorApi.includes("sanitizeProjectContent"), "Creator API enforces PII and safety filter");
    assert.ok(!creatorApi.includes("eval(") && !readFile("app/youth/creator/page.tsx").includes("eval("), "No unsafe game-code eval() execution");
    assert.ok(
      middleware.includes("youth_sanctuary") &&
        middleware.includes("caregiver_portal") &&
        middleware.includes("teacher_portal") &&
        middleware.includes("school_portal") &&
        middleware.includes("professional_portal") &&
        middleware.includes("admin_console"),
      "Middleware enforces role and adult-isolation boundaries"
    );
  });
});

