import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_ROOT = path.resolve(__dirname, "..");

test("1. Production Route Baseline: All 11 Core URLs and 13 Key Route Files Exist", () => {
  const CORE_11_ROUTES = [
    "app/page.tsx",
    "app/creative-studio/page.tsx",
    "app/youth/dashboard/page.tsx",
    "app/demos/page.tsx",
    "app/parent/page.tsx",
    "app/teacher/dashboard/page.tsx",
    "app/school/portal/page.tsx",
    "app/professional/portal/page.tsx",
    "app/schools/pilot/page.tsx",
    "app/documents/page.tsx",
    "app/inneros/dashboard/page.tsx",
  ];

  const KEY_13_ROUTES = [
    "app/child-safety/page.tsx",
    "app/technology/page.tsx",
    "app/privacy/page.tsx",
    "app/terms/page.tsx",
    "app/youth/routines/page.tsx",
    "app/youth/emotions/page.tsx",
    "app/youth/stories/page.tsx",
    "app/youth/play/page.tsx",
    "app/admin/curriculum/page.tsx",
    "app/parents/page.tsx",
    "app/schools/page.tsx",
    "app/platform/page.tsx",
    "app/how-it-works/page.tsx",
  ];

  for (const route of [...CORE_11_ROUTES, ...KEY_13_ROUTES]) {
    const filePath = path.join(WEB_ROOT, route);
    assert.ok(fs.existsSync(filePath), `Target route file must exist: ${route}`);
  }
});

test("2. Brand Isolation: No Adult InnerOS cross-links inside WeeblyParentShell or Homepage child safety notice", () => {
  const parentShellPath = path.join(WEB_ROOT, "components/shell/WeeblyParentShell.tsx");
  const parentShellContent = fs.readFileSync(parentShellPath, "utf8");
  assert.ok(!parentShellContent.includes("/inneros/dashboard"), "WeeblyParentShell footer must not cross-link to /inneros/dashboard");

  const marketingShellPath = path.join(WEB_ROOT, "components/marketing/MarketingShell.tsx");
  const marketingShellContent = fs.readFileSync(marketingShellPath, "utf8");
  assert.ok(
    !marketingShellContent.includes("InnerOS Adult Sanctuary"),
    "MarketingShell child safety notice must not contain adult InnerOS links"
  );

  // Adult InnerOS dashboard remains preserved at /inneros/dashboard
  const innerosPath = path.join(WEB_ROOT, "app/inneros/dashboard/page.tsx");
  assert.ok(fs.existsSync(innerosPath), "Adult InnerOS dashboard must be preserved");
});

test("3. Child Layout Consolidation: Routines, Emotions, Stories, Play use ChildNavigationShell (Home, Talk, Play)", () => {
  const childPages = [
    "app/youth/routines/page.tsx",
    "app/youth/emotions/page.tsx",
    "app/youth/stories/page.tsx",
    "app/youth/play/page.tsx",
  ];

  for (const relPath of childPages) {
    const fullPath = path.join(WEB_ROOT, relPath);
    const content = fs.readFileSync(fullPath, "utf8");
    assert.match(
      content,
      /ChildNavigationShell/,
      `${relPath} must use unified ChildNavigationShell`
    );
    assert.ok(
      !content.includes("import { YouthShell }"),
      `${relPath} must not import old Adventurer Tools YouthShell`
    );
  }

  // Verify MoveAndPlaySection is shared
  const routinesPath = path.join(WEB_ROOT, "app/youth/routines/page.tsx");
  const routinesContent = fs.readFileSync(routinesPath, "utf8");
  assert.match(routinesContent, /MoveAndPlaySection/, "Routines page must handle world=move-play via MoveAndPlaySection");
});

test("4. Demo & Admin Security: Admin Curriculum and Professional Portal are gated/simulated for guest reviewers", () => {
  const adminCurriculumPath = path.join(WEB_ROOT, "app/admin/curriculum/page.tsx");
  const adminContent = fs.readFileSync(adminCurriculumPath, "utf8");
  assert.match(adminContent, /isDemoReviewer/, "Admin curriculum page must check for guest reviewer mode");
  assert.match(adminContent, /Reviewer Demonstration Sandbox/, "Admin curriculum must display Guest Sandbox banner");

  const profPortalPath = path.join(WEB_ROOT, "app/professional/portal/page.tsx");
  const profContent = fs.readFileSync(profPortalPath, "utf8");
  assert.match(profContent, /Simulated Clinician Profile/, "Professional portal must explicitly label clinician profile as simulated");
  assert.match(profContent, /Simulated Demonstration Environment/, "Professional portal must state simulated demonstration environment");
});

test("5. Central Claims Registry: Registry exists and records all 6 core public claims with evidence", () => {
  const registryPath = path.join(WEB_ROOT, "lib/claims-registry.ts");
  assert.ok(fs.existsSync(registryPath), "Central claims registry must exist");
  const content = fs.readFileSync(registryPath, "utf8");
  assert.match(content, /curriculum_3000_questions/);
  assert.match(content, /voice_latency_280ms/);
  assert.match(content, /punjabi_voice_localization/);
  assert.match(content, /clinical_oversight_boundary/);
  assert.match(content, /data_privacy_envelope_encryption/);
  assert.match(content, /safeguarding_caregiver_harm_exception/);
});

test("6. Curriculum Reconciliation: Question bank manifest contains exactly 3,000 questions across 9 categories", () => {
  const manifestPath = path.join(WEB_ROOT, "lib/question-bank-manifest.json");
  assert.ok(fs.existsSync(manifestPath), "Question bank manifest must exist");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  assert.equal(manifest.total_questions, 3000);

  const sumCategories = Object.values(manifest.category_distribution).reduce((a, b) => a + b, 0);
  assert.equal(sumCategories, 3000, "Sum of category question counts must equal 3,000");

  const sumStatuses = Object.values(manifest.review_status_summary).reduce((a, b) => a + b, 0);
  assert.equal(sumStatuses, 3000, "Sum of review status counts must equal 3,000");
  assert.equal(manifest.review_status_summary.published, 126);
});

test("7. Safeguarding Invariant: Both /child-safety and /technology agree on spoken reassurance aloud rather than muting", () => {
  const safetyPath = path.join(WEB_ROOT, "app/child-safety/page.tsx");
  const safetyContent = fs.readFileSync(safetyPath, "utf8");
  assert.match(safetyContent, /spoken reassurance rather than abrupt silence/);
  assert.match(safetyContent, /Caregiver Harm Exception Protocol/);
  assert.match(safetyContent, /1121/);

  const techPath = path.join(WEB_ROOT, "app/technology/page.tsx");
  const techContent = fs.readFileSync(techPath, "utf8");
  assert.match(techContent, /speaks reassuring words aloud[\s\S]*rather than muting/);
  assert.match(techContent, /Caregiver Harm Alert Exception/);
});
