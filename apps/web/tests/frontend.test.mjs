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
  "app/offline/page.tsx",
];

test("All 69 adult, marketing, kids, teens, portals, and offline route page files exist and export default components", () => {
  for (const relPath of EXPECTED_ROUTE_PAGES) {
    const fullPath = path.join(WEB_ROOT, relPath);
    assert.ok(fs.existsSync(fullPath), `Missing route file: ${relPath}`);
    const content = fs.readFileSync(fullPath, "utf8");
    assert.match(content, /export\s+default\s+function/, `Route ${relPath} must export a default function component`);
  }
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

