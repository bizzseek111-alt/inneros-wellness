import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_ROOT = path.resolve(__dirname, "..");

test("V9.1: Design System Tokens & Custom SVG Companion Portraits exist", () => {
  const tokensPath = path.join(WEB_ROOT, "design-system/weebly-v9-tokens.ts");
  assert.ok(fs.existsSync(tokensPath), "weebly-v9-tokens.ts must exist");
  const tokensContent = fs.readFileSync(tokensPath, "utf8");
  assert.match(tokensContent, /WEEBLY_V9_PALETTE/);
  assert.match(tokensContent, /#FAF7F2/);
  assert.match(tokensContent, /WEEBLY_V9_LEARNING_WORLDS/);

  const portraitPath = path.join(WEB_ROOT, "components/v9/CompanionPortrait.tsx");
  assert.ok(fs.existsSync(portraitPath), "CompanionPortrait.tsx must exist");
  const portraitContent = fs.readFileSync(portraitPath, "utf8");
  assert.match(portraitContent, /<svg/);
  assert.match(portraitContent, /character === "kai"/);
  assert.match(portraitContent, /character === "mia"/);
  assert.match(portraitContent, /character === "lumi"/);
});

test("V9.2: Three Homepage Art-Direction Concepts page exists at /design-system/concepts", () => {
  const conceptsPath = path.join(WEB_ROOT, "app/design-system/concepts/page.tsx");
  assert.ok(fs.existsSync(conceptsPath), "/design-system/concepts/page.tsx must exist");
  const content = fs.readFileSync(conceptsPath, "utf8");
  assert.match(content, /Concept A: Warm Editorial Storybook/);
  assert.match(content, /Concept B: Tactile Play Studio/);
  assert.match(content, /Concept C: Kinetic Constellation/);
});

test("V9.3: 12-Section Homepage & Global Navigation Links", () => {
  const homePath = path.join(WEB_ROOT, "app/page.tsx");
  const homeContent = fs.readFileSync(homePath, "utf8");
  assert.match(homeContent, /Learning begins with/);
  assert.match(homeContent, /\/api\/youth\/friends\/turn/);
  assert.match(homeContent, /WEEBLY_V9_LEARNING_WORLDS/);
  assert.match(homeContent, /SIX_ROLE_DEMOS/);

  const navPath = path.join(WEB_ROOT, "components/marketing/MarketingShell.tsx");
  const navContent = fs.readFileSync(navPath, "utf8");
  assert.match(navContent, /label: "Explore"/);
  assert.match(navContent, /label: "How It Works"/);
  assert.match(navContent, /label: "Parents"/);
  assert.match(navContent, /label: "Schools"/);
  assert.match(navContent, /label: "Research"/);
  assert.match(navContent, /label: "Sign In"/);
  assert.match(navContent, /Try Demo/);
});

test("V9.4: Free-Tier Server Adapters (Gemini/Groq LLM, Supabase PostgREST, Azure Neural TTS)", () => {
  const llmPath = path.join(WEB_ROOT, "lib/server/llm.ts");
  assert.ok(fs.existsSync(llmPath));
  assert.match(fs.readFileSync(llmPath, "utf8"), /generateFriendReply/);

  const sbPath = path.join(WEB_ROOT, "lib/server/supabase.ts");
  assert.ok(fs.existsSync(sbPath));
  assert.match(fs.readFileSync(sbPath, "utf8"), /sbInsert/);

  const ttsRoute = path.join(WEB_ROOT, "app/api/voice/tts/route.ts");
  assert.ok(fs.existsSync(ttsRoute));
  assert.match(fs.readFileSync(ttsRoute, "utf8"), /ur-PK-UzmaNeural/);

  const statusRoute = path.join(WEB_ROOT, "app/api/system/status/route.ts");
  assert.ok(fs.existsSync(statusRoute));

  const obsRoute = path.join(WEB_ROOT, "app/api/parent/observations/route.ts");
  assert.ok(fs.existsSync(obsRoute));

  const asgnRoute = path.join(WEB_ROOT, "app/api/teacher/assignments/route.ts");
  assert.ok(fs.existsSync(asgnRoute));

  const inqRoute = path.join(WEB_ROOT, "app/api/pilot/inquiries/route.ts");
  assert.ok(fs.existsSync(inqRoute));
});

test("V9.5: Child Shell Unification & SEO Sitemap/Robots", () => {
  const youthShellPath = path.join(WEB_ROOT, "components/youth/YouthShell.tsx");
  const youthShellContent = fs.readFileSync(youthShellPath, "utf8");
  assert.match(youthShellContent, /ChildNavigationShell/);
  assert.doesNotMatch(youthShellContent, /\/caregiver\/dashboard/);

  assert.ok(fs.existsSync(path.join(WEB_ROOT, "app/sitemap.ts")));
  assert.ok(fs.existsSync(path.join(WEB_ROOT, "app/robots.ts")));
});
