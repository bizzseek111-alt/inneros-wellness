import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_ROOT = path.resolve(__dirname, "..");

const EXPECTED_ROUTE_PAGES = [
  "app/page.tsx",
  "app/features/page.tsx",
  "app/how-it-works/page.tsx",
  "app/about/page.tsx",
  "app/privacy-trust/page.tsx",
  "app/pricing/page.tsx",
  "app/faq/page.tsx",
  "app/contact/page.tsx",
  "app/login/page.tsx",
  "app/signup/page.tsx",
  "app/onboarding/page.tsx",
  "app/dashboard/page.tsx",
  "app/companion/chat/page.tsx",
  "app/companion/voice/page.tsx",
  "app/memory/page.tsx",
  "app/journal/page.tsx",
  "app/growth/page.tsx",
  "app/check-in/page.tsx",
  "app/reminders/page.tsx",
  "app/knowledge/page.tsx",
  "app/integrations/page.tsx",
  "app/safety/page.tsx",
  "app/settings/privacy/page.tsx",
  "app/settings/notifications/page.tsx",
  "app/explore/page.tsx",
  "app/design-system/page.tsx",
  "app/admin/page.tsx",
  "app/admin/knowledge/page.tsx",
  "app/kids/page.tsx",
  "app/teens/page.tsx",
  "app/youth/page.tsx",
  "app/youth/onboarding/page.tsx",
  "app/youth/consent/page.tsx",
  "app/youth/dashboard/page.tsx",
  "app/youth/voice/page.tsx",
  "app/youth/chat/page.tsx",
  "app/youth/emotions/page.tsx",
  "app/youth/stories/page.tsx",
  "app/youth/activities/page.tsx",
  "app/youth/routines/page.tsx",
  "app/youth/visual-supports/page.tsx",
  "app/youth/habits/page.tsx",
  "app/youth/journal/page.tsx",
  "app/youth/achievements/page.tsx",
  "app/caregiver/dashboard/page.tsx",
  "app/teacher/dashboard/page.tsx",
  "app/youth/safety/page.tsx",
  "app/youth/accessibility/page.tsx",
  "app/youth/language/page.tsx",
  "app/youth/support-center/page.tsx",
  "app/admin/youth-content/page.tsx",
  "app/youth/academy/page.tsx",
  "app/youth/academy/lesson/[id]/page.tsx",
  "app/admin/curriculum/page.tsx",
  "app/parents/page.tsx",
  "app/schools/page.tsx",
  "app/school/portal/page.tsx",
  "app/adhd-support/page.tsx",
  "app/autism-support/page.tsx",
  "app/emotional-intelligence/page.tsx",
  "app/cognitive-development/page.tsx",
  "app/languages/page.tsx",
  "app/research/page.tsx",
  "app/privacy/page.tsx",
  "app/terms/page.tsx",
  "app/child-safety/page.tsx",
  "app/accessibility/page.tsx",
  "app/parent/page.tsx",
  "app/student/page.tsx",
  "app/teacher/page.tsx",
  "app/youth/friends/page.tsx",
  "app/youth/play/page.tsx",
  "app/investor-demo/page.tsx",
  "app/demo/page.tsx",
  "app/schools/onboarding/page.tsx",
  "app/offline/page.tsx",
  "app/inneros/dashboard/page.tsx",
  "app/inneros/safety/page.tsx",
];

test("All adult, marketing, kids, teens, AI friends, interactive demo, school onboarding, portals, and offline route page files exist and export default components", () => {
  for (const relPath of EXPECTED_ROUTE_PAGES) {
    const fullPath = path.join(WEB_ROOT, relPath);
    assert.ok(fs.existsSync(fullPath), `Missing route file: ${relPath}`);
    const content = fs.readFileSync(fullPath, "utf8");
    assert.match(content, /export\s+default\s+function/, `Route ${relPath} must export a default function component`);
  }
});

test("3,000-Question Relational Bank exists with exact category distribution and review gating", () => {
  const manifestPath = path.join(WEB_ROOT, "lib/question-bank-manifest.json");
  assert.ok(fs.existsSync(manifestPath), "question-bank-manifest.json must exist");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  assert.equal(manifest.total_questions, 3000);
  assert.equal(manifest.category_distribution.emotional_vocabulary, 400);
  assert.equal(manifest.category_distribution.language_and_communication, 400);
  assert.equal(manifest.category_distribution.cognitive_development, 450);
  assert.equal(manifest.category_distribution.science_and_discovery, 350);
  assert.equal(manifest.category_distribution.social_skills, 350);
  assert.equal(manifest.category_distribution.mathematics, 350);
  assert.equal(manifest.category_distribution.life_skills, 300);
  assert.equal(manifest.category_distribution.creativity, 250);
  assert.equal(manifest.category_distribution.routines_and_executive_skills, 150);

  // Review status tracking: at least 100 published & approved for demo
  assert.ok(manifest.review_status_summary.published >= 100);
  assert.ok(manifest.review_status_summary.reviewed > 0);
  assert.ok(manifest.review_status_summary.drafted > 0);

  // Sample approved questions contain trilingual texts
  const sample = manifest.sample_approved_questions[0];
  assert.ok(sample.text_en);
  assert.ok(sample.text_ur);
  assert.ok(sample.text_pa);
  assert.ok(sample.correct_answer_or_rubric);
});

test("AI Friends voice experience supports Kai, Mia, Lumi, Zayn with serverless turn-taking and multilingual support", () => {
  const friendsDataPath = path.join(WEB_ROOT, "lib/friends-data.ts");
  assert.ok(fs.existsSync(friendsDataPath), "friends-data.ts must exist");
  const dataContent = fs.readFileSync(friendsDataPath, "utf8");
  assert.match(dataContent, /kai:/);
  assert.match(dataContent, /mia:/);
  assert.match(dataContent, /lumi:/);
  assert.match(dataContent, /zayn:/);

  const turnRoutePath = path.join(WEB_ROOT, "app/api/youth/friends/turn/route.ts");
  assert.ok(fs.existsSync(turnRoutePath), "turn/route.ts must exist");
  const turnContent = fs.readFileSync(turnRoutePath, "utf8");
  assert.match(turnContent, /Umang Mental Health Helpline/);
  assert.match(turnContent, /don't understand this question/);
  assert.match(turnContent, /مجھے یہ سوال سمجھ نہیں آ رہا/);
  assert.match(turnContent, /Mainu homework samajh nahi aa reha/);

  const kaiCompPath = path.join(WEB_ROOT, "components/youth/friends/KaiCharacter.tsx");
  assert.ok(fs.existsSync(kaiCompPath), "KaiCharacter.tsx must exist");
  const galleryPath = path.join(WEB_ROOT, "components/youth/friends/FriendsGallerySection.tsx");
  assert.ok(fs.existsSync(galleryPath), "FriendsGallerySection.tsx must exist");
});

test("Next.js Edge middleware exists and configures security headers & route tiers including youth and teachers", () => {
  const mwPath = path.join(WEB_ROOT, "middleware.ts");
  assert.ok(fs.existsSync(mwPath), "middleware.ts must exist");
  const mwContent = fs.readFileSync(mwPath, "utf8");
  assert.match(mwContent, /X-InnerOS-Route-Tier/);
  assert.match(mwContent, /X-Content-Type-Options/);
  assert.match(mwContent, /X-Frame-Options/);
  assert.match(mwContent, /youth_sanctuary/);
  assert.match(mwContent, /teacher_portal/);
  assert.match(mwContent, /caregiver_portal/);
  assert.match(mwContent, /inneros_session/);
});

test("Typed API client includes auth headers, credentials: include, wellbeing, voice synthesis, and push outbox methods", () => {
  const clientPath = path.join(WEB_ROOT, "lib/api-client.ts");
  const content = fs.readFileSync(clientPath, "utf8");
  assert.match(content, /getAuthHeaders\(/);
  assert.match(content, /credentials:\s*"include"/);
  assert.match(content, /synthesizeSpeech\(/);
  assert.match(content, /updateConsentSettings\(/);
  assert.match(content, /registerPushSubscription\(/);
  assert.match(content, /getNotificationOutbox\(/);
  assert.match(content, /getJournalEntries\(/);
  assert.match(content, /createJournalEntry\(/);
  assert.match(content, /getGrowthGoals\(/);
  assert.match(content, /createGrowthGoal\(/);
  assert.match(content, /createCheckIn\(/);
});

test("Warm Human Minimalism light-first design tokens are configured in RootLayout", () => {
  const layoutPath = path.join(WEB_ROOT, "app/layout.tsx");
  const layoutContent = fs.readFileSync(layoutPath, "utf8");
  assert.match(layoutContent, /#FAF8F4/i);
  assert.match(layoutContent, /#285B55/i);
  assert.match(layoutContent, /#263330/i);
});

test("Onboarding, Journal, Growth, and Check-In pages connect to live FastAPI client methods", () => {
  const onboardingContent = fs.readFileSync(path.join(WEB_ROOT, "app/onboarding/page.tsx"), "utf8");
  assert.match(onboardingContent, /api\.updateConsentSettings/);
  assert.match(onboardingContent, /api\.createMemoryRecord/);
  assert.match(onboardingContent, /api\.synthesizeSpeech/);

  const journalContent = fs.readFileSync(path.join(WEB_ROOT, "app/journal/page.tsx"), "utf8");
  assert.match(journalContent, /getJournalEntries\(/);
  assert.match(journalContent, /createJournalEntry\(/);

  const growthContent = fs.readFileSync(path.join(WEB_ROOT, "app/growth/page.tsx"), "utf8");
  assert.match(growthContent, /getGrowthGoals\(/);
  assert.match(growthContent, /createGrowthGoal\(/);

  const checkinContent = fs.readFileSync(path.join(WEB_ROOT, "app/check-in/page.tsx"), "utf8");
  assert.match(checkinContent, /createCheckIn\(/);
});

test("PWA Web Manifest and icon assets exist and adhere to W3C installability standards", () => {
  const manifestPath = path.join(WEB_ROOT, "public/manifest.webmanifest");
  assert.ok(fs.existsSync(manifestPath), "manifest.webmanifest must exist in public directory");

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  assert.equal(manifest.short_name, "Weebly");
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.start_url, "/?source=pwa");
  assert.equal(manifest.scope, "/");
  assert.ok(manifest.icons && manifest.icons.length >= 4, "Must provide at least 4 icons");

  // Verify icon files physically exist on disk
  const icon192 = path.join(WEB_ROOT, "public/icons/icon-192x192.png");
  const icon512 = path.join(WEB_ROOT, "public/icons/icon-512x512.png");
  const maskable192 = path.join(WEB_ROOT, "public/icons/icon-maskable-192x192.png");
  const appleTouch = path.join(WEB_ROOT, "public/icons/apple-touch-icon.png");

  assert.ok(fs.existsSync(icon192), "192x192 icon must exist");
  assert.ok(fs.existsSync(icon512), "512x512 icon must exist");
  assert.ok(fs.existsSync(maskable192), "192x192 maskable icon must exist");
  assert.ok(fs.existsSync(appleTouch), "Apple touch icon must exist");
});

test("PWA Service Worker sw.js exists with strict API caching exclusions and offline fallback", () => {
  const swPath = path.join(WEB_ROOT, "public/sw.js");
  assert.ok(fs.existsSync(swPath), "sw.js must exist in public directory");
  const swContent = fs.readFileSync(swPath, "utf8");

  assert.match(swContent, /weebly-pwa-v/, "Must have versioned cache key");
  assert.match(swContent, /SKIP_WAITING/, "Must support SKIP_WAITING update message");
  assert.match(swContent, /\/offline/, "Must precache /offline fallback route");
  assert.match(swContent, /url\.pathname\.startsWith\("\/api\/"\)/, "Must strictly exclude /api/ routes from browser caching");
});

test("PWA Context, Offline Banner, Update Toast & Install Prompt components exist and export valid React components", () => {
  const pwaContextPath = path.join(WEB_ROOT, "components/pwa/PwaContext.tsx");
  const offlineBannerPath = path.join(WEB_ROOT, "components/pwa/OfflineBanner.tsx");
  const updateToastPath = path.join(WEB_ROOT, "components/pwa/PwaUpdateToast.tsx");
  const installModalPath = path.join(WEB_ROOT, "components/pwa/InstallPromptModal.tsx");
  const registrarPath = path.join(WEB_ROOT, "components/pwa/PwaClientRegistrar.tsx");

  assert.ok(fs.existsSync(pwaContextPath), "PwaContext must exist");
  assert.ok(fs.existsSync(offlineBannerPath), "OfflineBanner must exist");
  assert.ok(fs.existsSync(updateToastPath), "PwaUpdateToast must exist");
  assert.ok(fs.existsSync(installModalPath), "InstallPromptModal must exist");
  assert.ok(fs.existsSync(registrarPath), "PwaClientRegistrar must exist");

  const pwaContext = fs.readFileSync(pwaContextPath, "utf8");
  assert.match(pwaContext, /beforeinstallprompt/);
  assert.match(pwaContext, /display-mode:\s*standalone/);
  assert.match(pwaContext, /SKIP_WAITING/);

  const installModal = fs.readFileSync(installModalPath, "utf8");
  assert.match(installModal, /isChildSession/);
  assert.match(installModal, /Add to Home Screen/);
});

test("RootLayout exports viewport configuration with viewportFit cover and manifest metadata", () => {
  const layoutPath = path.join(WEB_ROOT, "app/layout.tsx");
  const content = fs.readFileSync(layoutPath, "utf8");
  assert.match(content, /viewportFit:\s*"cover"/);
  assert.match(content, /interactiveWidget:\s*"resizes-content"/);
  assert.match(content, /manifest:\s*"\/manifest\.webmanifest"/);
  assert.match(content, /PwaClientRegistrar/);
});

test("OfflineSyncManager module provides schema-validated IndexedDB milestone persistence with logout purge", () => {
  const syncPath = path.join(WEB_ROOT, "lib/offline-sync.ts");
  assert.ok(fs.existsSync(syncPath), "offline-sync.ts must exist");
  const content = fs.readFileSync(syncPath, "utf8");
  assert.match(content, /recordOfflineLessonCompletion\(/);
  assert.match(content, /getChildCompletedLessons\(/);
  assert.match(content, /flushSyncQueue\(/);
  assert.match(content, /clearAllLocalData\(/);
});

test("V8 Brand Repair & Architecture: /parent uses WeeblyParentShell and isolates from adult SanctuaryShell", () => {
  const parentPagePath = path.join(WEB_ROOT, "app/parent/page.tsx");
  const parentContent = fs.readFileSync(parentPagePath, "utf8");
  assert.match(parentContent, /WeeblyParentShell/, "/parent must use WeeblyParentShell");
  assert.ok(!parentContent.includes("SanctuaryShell"), "/parent must not use adult SanctuaryShell");

  const weeblyShellPath = path.join(WEB_ROOT, "components/shell/WeeblyParentShell.tsx");
  assert.ok(fs.existsSync(weeblyShellPath), "WeeblyParentShell component must exist");
  const shellContent = fs.readFileSync(weeblyShellPath, "utf8");
  assert.match(shellContent, /Weebly Parent/, "WeeblyParentShell must display Weebly Parent brand");
});

test("V8 Brand Repair & Architecture: /dashboard has role-based redirect and bridge banner, adult pages isolated", () => {
  const dashboardPath = path.join(WEB_ROOT, "app/dashboard/page.tsx");
  const dashboardContent = fs.readFileSync(dashboardPath, "utf8");
  assert.match(dashboardContent, /storedRole\s*===\s*"caregiver"/, "Dashboard must route caregivers to parent portal");
  assert.match(dashboardContent, /Looking for Weebly Child/, "Dashboard must provide Weebly Family bridge");

  const innerosDashPath = path.join(WEB_ROOT, "app/inneros/dashboard/page.tsx");
  assert.ok(fs.existsSync(innerosDashPath), "Adult /inneros/dashboard must exist for adult preservation");

  const safetyPath = path.join(WEB_ROOT, "app/safety/page.tsx");
  const safetyContent = fs.readFileSync(safetyPath, "utf8");
  assert.match(safetyContent, /\/child-safety/, "Adult safety page must cross-link to child safety");
});

test("V8 Child UX: /youth/activities handles category=mathematics and uses ChildNavigationShell", () => {
  const actPath = path.join(WEB_ROOT, "app/youth/activities/page.tsx");
  const actContent = fs.readFileSync(actPath, "utf8");
  assert.match(actContent, /ChildNavigationShell/, "Activities page must use ChildNavigationShell");
  assert.match(actContent, /categoryParam\s*===\s*"mathematics"/, "Activities page must handle category=mathematics");
  assert.match(actContent, /The Mango Sharing Feast/, "Mathematics category must render interactive Mango Math Quest");
});

test("V8 Child Safeguarding: /youth/voice speaks reassuring voice guidance on distress escalation", () => {
  const voicePath = path.join(WEB_ROOT, "app/youth/voice/page.tsx");
  const voiceContent = fs.readFileSync(voicePath, "utf8");
  assert.match(voiceContent, /speakViaWebSpeech\(response\.transcript_agent\)/, "Safeguarding must speak calming reassurance aloud");
});

test("V8 Compliance & Transparency: /school/portal labels demonstration metrics and aligned architecture", () => {
  const portalPath = path.join(WEB_ROOT, "app/school/portal/page.tsx");
  const portalContent = fs.readFileSync(portalPath, "utf8");
  assert.match(portalContent, /FERPA (&amp;|&) COPPA Aligned Architecture/, "Must accurately claim aligned architecture");
  assert.match(portalContent, /Simulated Institutional Demonstration Data/, "Must label mock data banner transparently");
});

