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
];

test("All 28 application and marketing route page files exist and export default components", () => {
  for (const relPath of EXPECTED_ROUTE_PAGES) {
    const fullPath = path.join(WEB_ROOT, relPath);
    assert.ok(fs.existsSync(fullPath), `Missing route file: ${relPath}`);
    const content = fs.readFileSync(fullPath, "utf8");
    assert.match(content, /export\s+default\s+function/, `Route ${relPath} must export a default function component`);
  }
});

test("Next.js Edge middleware exists and configures security headers & route tiers", () => {
  const mwPath = path.join(WEB_ROOT, "middleware.ts");
  assert.ok(fs.existsSync(mwPath), "middleware.ts must exist");
  const mwContent = fs.readFileSync(mwPath, "utf8");
  assert.match(mwContent, /X-InnerOS-Route-Tier/);
  assert.match(mwContent, /X-Content-Type-Options/);
  assert.match(mwContent, /X-Frame-Options/);
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
