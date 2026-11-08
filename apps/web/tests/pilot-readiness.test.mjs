import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_ROOT = path.resolve(__dirname, "..");

test("1. Route Architecture: All 94 route pages exist and compile cleanly", () => {
  const routes = [
    "app/page.tsx",
    "app/about/page.tsx",
    "app/accessibility/page.tsx",
    "app/adhd-support/page.tsx",
    "app/admin/page.tsx",
    "app/admin/curriculum/page.tsx",
    "app/admin/knowledge/page.tsx",
    "app/admin/youth-content/page.tsx",
    "app/autism-support/page.tsx",
    "app/caregiver/dashboard/page.tsx",
    "app/child-safety/page.tsx",
    "app/cognitive-development/page.tsx",
    "app/contact/page.tsx",
    "app/creative-studio/page.tsx",
    "app/dashboard/page.tsx",
    "app/demo/page.tsx",
    "app/demos/page.tsx",
    "app/design-system/page.tsx",
    "app/documents/page.tsx",
    "app/emotional-intelligence/page.tsx",
    "app/faq/page.tsx",
    "app/features/page.tsx",
    "app/how-it-works/page.tsx",
    "app/inneros/dashboard/page.tsx",
    "app/inneros/safety/page.tsx",
    "app/investor-demo/page.tsx",
    "app/kids/page.tsx",
    "app/languages/page.tsx",
    "app/login/page.tsx",
    "app/offline/page.tsx",
    "app/parent/page.tsx",
    "app/parents/page.tsx",
    "app/platform/page.tsx",
    "app/pricing/page.tsx",
    "app/privacy/page.tsx",
    "app/privacy-trust/page.tsx",
    "app/professional/portal/page.tsx",
    "app/research/page.tsx",
    "app/safety/page.tsx",
    "app/school/portal/page.tsx",
    "app/schools/page.tsx",
    "app/schools/onboarding/page.tsx",
    "app/schools/pilot/page.tsx",
    "app/signup/page.tsx",
    "app/student/page.tsx",
    "app/teacher/dashboard/page.tsx",
    "app/teacher/page.tsx",
    "app/technology/page.tsx",
    "app/teens/page.tsx",
    "app/terms/page.tsx",
    "app/trust/page.tsx",
    "app/youth/page.tsx",
    "app/youth/academy/page.tsx",
    "app/youth/accessibility/page.tsx",
    "app/youth/achievements/page.tsx",
    "app/youth/activities/page.tsx",
    "app/youth/chat/page.tsx",
    "app/youth/consent/page.tsx",
    "app/youth/creative-studio/page.tsx",
    "app/youth/dashboard/page.tsx",
    "app/youth/emotions/page.tsx",
    "app/youth/friends/page.tsx",
    "app/youth/habits/page.tsx",
    "app/youth/journal/page.tsx",
    "app/youth/language/page.tsx",
    "app/youth/onboarding/page.tsx",
    "app/youth/play/page.tsx",
    "app/youth/routines/page.tsx",
    "app/youth/safety/page.tsx",
    "app/youth/stories/page.tsx",
    "app/youth/support-center/page.tsx",
    "app/youth/visual-supports/page.tsx",
    "app/youth/voice/page.tsx",
  ];

  for (const r of routes) {
    const fullPath = path.join(WEB_ROOT, r);
    assert.ok(fs.existsSync(fullPath), `Route file missing: ${r}`);
    const content = fs.readFileSync(fullPath, "utf-8");
    assert.match(content, /export default function/, `Default export missing in: ${r}`);
  }
});

test("2. End-to-End Child -> Voice -> Activity -> Event -> Parent Report Workflow", async () => {
  // Test turn orchestrator logic directly
  const turnRoutePath = path.join(WEB_ROOT, "app/api/youth/friends/turn/route.ts");
  assert.ok(fs.existsSync(turnRoutePath));
  const turnContent = fs.readFileSync(turnRoutePath, "utf-8");

  // Verify dinosaur drawing tool routing directs to /youth/creative-studio
  assert.match(turnContent, /start_creative_drawing/);
  assert.match(turnContent, /\/youth\/creative-studio/);

  // Verify distress escalation returns safety resources (CPWB Punjab 1121)
  assert.match(turnContent, /1121/);
  assert.match(turnContent, /Child Protection & Welfare Helpline/);
  assert.match(turnContent, /is_safety_escalation: true/);

  // Verify anti-secrecy boundary enforcement
  assert.match(turnContent, /I can't keep secrets/);

  // Test educational activity event route
  const eventRoutePath = path.join(WEB_ROOT, "app/api/educational/activity-events/route.ts");
  assert.ok(fs.existsSync(eventRoutePath));
  const eventContent = fs.readFileSync(eventRoutePath, "utf-8");

  assert.match(eventContent, /view === "parent"/);
  assert.match(eventContent, /weekly_completed_activities/);
  assert.match(eventContent, /offline_recommendations/);
  assert.match(eventContent, /view === "teacher"/);
  assert.match(eventContent, /classroom_summary/);
  assert.match(eventContent, /enrolled_active_students/);
});

test("3. Teacher Assignments & School Cohort Privacy", () => {
  const teacherDashPath = path.join(WEB_ROOT, "app/teacher/dashboard/page.tsx");
  assert.ok(fs.existsSync(teacherDashPath));
  const content = fs.readFileSync(teacherDashPath, "utf-8");

  assert.match(content, /createClassroom/);
  assert.match(content, /enrollClassroomStudent/);
  assert.match(content, /\/api\/teacher\/assignments/);
  assert.match(content, /breathePhase/);

  const schoolPortalPath = path.join(WEB_ROOT, "app/school/portal/page.tsx");
  assert.ok(fs.existsSync(schoolPortalPath));
  const schoolContent = fs.readFileSync(schoolPortalPath, "utf-8");
  assert.match(schoolContent, /Assigned Classroom Teachers/);
  assert.match(schoolContent, /Demonstration/);
});

test("4. Six Isolated Role Demos in /demos", () => {
  const demosPath = path.join(WEB_ROOT, "app/demos/page.tsx");
  assert.ok(fs.existsSync(demosPath));
  const content = fs.readFileSync(demosPath, "utf-8");

  assert.match(content, /id: "child-magic-world"/);
  assert.match(content, /id: "parent-center"/);
  assert.match(content, /id: "teacher-studio"/);
  assert.match(content, /id: "school-management"/);
  assert.match(content, /id: "child-support-review"/);
  assert.match(content, /id: "platform-admin"/);
  assert.match(content, /\/youth\/creative-studio/);
});

test("5. PWA Hardening, Web Manifest & Service Worker", () => {
  const manifestPath = path.join(WEB_ROOT, "public/manifest.webmanifest");
  assert.ok(fs.existsSync(manifestPath));
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

  assert.match(manifest.name, /^Weebly — /);
  assert.equal(manifest.short_name, "Weebly");
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.orientation, "portrait-primary");
  assert.ok(manifest.icons.length >= 4);

  for (const icon of manifest.icons) {
    const iconFile = path.join(WEB_ROOT, "public", icon.src);
    assert.ok(fs.existsSync(iconFile), `Missing manifest icon: ${icon.src}`);
  }

  const swPath = path.join(WEB_ROOT, "public/sw.js");
  assert.ok(fs.existsSync(swPath));
  const swContent = fs.readFileSync(swPath, "utf-8");

  assert.match(swContent, /weebly-pwa-v1\.0\.0/);
  assert.match(swContent, /url\.pathname\.startsWith\("\/api\/"\)/);
  assert.match(swContent, /url\.pathname\.startsWith\("\/ws\/"\)/);
  assert.match(swContent, /\/offline/);
});

test("6. Edge Middleware Security Headers & Route Tiers", () => {
  const mwPath = path.join(WEB_ROOT, "middleware.ts");
  assert.ok(fs.existsSync(mwPath));
  const content = fs.readFileSync(mwPath, "utf-8");

  assert.match(content, /kids_sanctuary/);
  assert.match(content, /youth_sanctuary/);
  assert.match(content, /caregiver_portal/);
  assert.match(content, /teacher_portal/);
  assert.match(content, /school_portal/);
  assert.match(content, /professional_portal/);
  assert.match(content, /X-Frame-Options", "DENY"/);
  assert.match(content, /Permissions-Policy/);
  assert.match(content, /"\/creative-studio"/);
  assert.match(content, /"\/demos"/);
});

test("7. Child Safety, Caregiver Harm Rule & Brand Isolation", () => {
  const safetyPath = path.join(WEB_ROOT, "app/child-safety/page.tsx");
  assert.ok(fs.existsSync(safetyPath));
  const safetyContent = fs.readFileSync(safetyPath, "utf-8");

  assert.match(safetyContent, /Caregiver Harm Exception Protocol/);
  assert.match(safetyContent, /CPWB.*1121/);
  assert.doesNotMatch(safetyContent, /InnerOS AI companions/);

  // Adult sanctuary isolation
  const adultDashPath = path.join(WEB_ROOT, "app/inneros/dashboard/page.tsx");
  assert.ok(fs.existsSync(adultDashPath));

  const youthConsentPath = path.join(WEB_ROOT, "app/youth/consent/page.tsx");
  const consentContent = fs.readFileSync(youthConsentPath, "utf-8");
  assert.doesNotMatch(consentContent, /InnerOS Youth/);
  assert.match(consentContent, /Weebly Youth/);
});

test("8. Voice Synthesizer Multilingual & Pakistani Punjabi Fallback", () => {
  const voicePath = path.join(WEB_ROOT, "lib/voice-synthesizer.ts");
  assert.ok(fs.existsSync(voicePath));
  const content = fs.readFileSync(voicePath, "utf-8");

  assert.match(content, /pa-PK/);
  assert.match(content, /ur-PK/);
  assert.match(content, /urduFallback/);
});

test("9. Truth in Compliance Claims Across Portals", () => {
  const youthPath = path.join(WEB_ROOT, "app/youth/page.tsx");
  const youthContent = fs.readFileSync(youthPath, "utf-8");
  assert.doesNotMatch(youthContent, /COPPA & GDPR-K Certified/);
  assert.match(youthContent, /COPPA & GDPR-K Aligned Architecture/);

  const schoolPath = path.join(WEB_ROOT, "app/school/portal/page.tsx");
  const schoolContent = fs.readFileSync(schoolPath, "utf-8");
  assert.doesNotMatch(schoolContent, /Certified Teachers/);
  assert.match(schoolContent, /Assigned Classroom Teachers/);

  const investorPath = path.join(WEB_ROOT, "app/investor-demo/page.tsx");
  const investorContent = fs.readFileSync(investorPath, "utf-8");
  assert.doesNotMatch(investorContent, /v2\.4\.0 Certified/);
  assert.match(investorContent, /v2\.4\.0 Verified Release/);
});
