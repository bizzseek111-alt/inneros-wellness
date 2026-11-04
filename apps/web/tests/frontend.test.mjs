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
  "app/professional/portal/page.tsx",
  "app/demos/page.tsx",
  "app/platform/page.tsx",
  "app/technology/page.tsx",
  "app/trust/page.tsx",
  "app/schools/pilot/page.tsx",
  "app/documents/page.tsx",
  "app/creative-studio/page.tsx",
  "app/youth/creative-studio/page.tsx",
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

test("V8 Professional Support Portal: /professional/portal enforces clinical boundary and safeguarding protocol", () => {
  const profPath = path.join(WEB_ROOT, "app/professional/portal/page.tsx");
  const profContent = fs.readFileSync(profPath, "utf8");
  assert.match(profContent, /Professional Clinical Boundary/, "Must display clinical boundary banner");
  assert.match(profContent, /NEVER generate\s*psychiatric diagnoses/, "Must enforce non-diagnostic AI invariant");
  assert.match(profContent, /Caregiver Harm Notification Exception Protocol/, "Must include caregiver harm protocol");
  assert.match(profContent, /CPWB Punjab/, "Must reference regional Punjab child protection helpline");
});

test("V8 Demo Center: /demos provides all 6 independent role demos and interactive guided modal tour", () => {
  const demosPath = path.join(WEB_ROOT, "app/demos/page.tsx");
  const content = fs.readFileSync(demosPath, "utf8");
  assert.match(content, /Explore Weebly/, "Must display page title");
  assert.match(content, /Child Magic World/, "Must include Demo 1: Child Magic World");
  assert.match(content, /Parent Center/, "Must include Demo 2: Parent Center");
  assert.match(content, /Teacher Studio/, "Must include Demo 3: Teacher Studio");
  assert.match(content, /School Management/, "Must include Demo 4: School Management");
  assert.match(content, /Child Support (&amp;|&) Professional Review/, "Must include Demo 5: Professional Review");
  assert.match(content, /Platform Admin (&amp;|&) Governance/, "Must include Demo 6: Platform Admin");
  assert.match(content, /startTour/, "Must provide guided tour launcher");
  assert.match(content, /nextStep/, "Must support next step in guided modal");
  assert.match(content, /prevStep/, "Must support previous step in guided modal");
  assert.match(content, /Exit Tour/, "Must provide persistent exit control");
});

test("V8 Functionality Guide: /platform documents all 20 subsystems with metadata and status filters", () => {
  const platformPath = path.join(WEB_ROOT, "app/platform/page.tsx");
  const content = fs.readFileSync(platformPath, "utf8");
  assert.match(content, /Weebly\s*(—|&mdash;)\s*Complete Platform Capabilities/, "Must display platform title");
  assert.match(content, /Platform Overview/, "Section 1");
  assert.match(content, /Punjab Curriculum (&amp;|&) RAG Engine/, "Section 5");
  assert.match(content, /Six Interactive Learning Worlds/, "Section 6");
  assert.match(content, /Educator Studio/, "Section 10");
  assert.match(content, /School Command Center/, "Section 11");
  assert.match(content, /Safeguarding (&amp;|&) Privacy/, "Section 15");
  assert.match(content, /LIVE AND VERIFIED/, "Must support LIVE status pill");
  assert.match(content, /PROTOTYPE/, "Must support PROTOTYPE status pill");
  assert.match(content, /PLANNED/, "Must support PLANNED status pill");
  assert.match(content, /Intended Users/, "Must render intended user metadata");
  assert.match(content, /Backend Dependency/, "Must render backend dependency metadata");
  assert.match(content, /Documented Limitations/, "Must render limitation metadata");
});

test("V8 Technology: /technology presents visual architecture pillars and technical appendix", () => {
  const techPath = path.join(WEB_ROOT, "app/technology/page.tsx");
  const content = fs.readFileSync(techPath, "utf8");
  assert.match(content, /Weebly Technical Architecture/, "Must render tech title");
  assert.match(content, /Unified Conversational Orchestrator/, "Pillar 1: Orchestrator");
  assert.match(content, /Punjab Curriculum RAG/, "Pillar 2: RAG");
  assert.match(content, /Multi-Provider Voice Pipeline/, "Pillar 3: Voice");
  assert.match(content, /Non-Silence Safeguarding Circuit/, "Pillar 5: Safety Circuit");
  assert.match(content, /Anti-Injection Security Delimiter Protocol/, "Technical appendix must detail prompt injection defense");
  assert.match(content, /Failover &amp; Disaster Recovery Specifications/, "Technical appendix must detail failover spec");
});

test("V8 Trust & Safeguarding: /trust enforces non-clinical boundaries, CPWB 1121 and truth in compliance", () => {
  const trustPath = path.join(WEB_ROOT, "app/trust/page.tsx");
  const content = fs.readFileSync(trustPath, "utf8");
  assert.match(content, /Trust, Safety &amp; Safeguarding/, "Must render title");
  assert.match(content, /Child-Centered Design/, "Pillar 1");
  assert.match(content, /Clear AI Disclosure/, "Pillar 2");
  assert.match(content, /Strict Non-Diagnostic Boundaries/, "Pillar 3");
  assert.match(content, /Weebly NEVER generates psychiatric diagnoses/, "Non-clinical invariant");
  assert.match(content, /Data Handling &amp; Zero PII Guarantee/, "Pillar 4");
  assert.match(content, /School Access Controls/, "Pillar 5");
  assert.match(content, /Human Safeguarding Protocols/, "Pillar 6");
  assert.match(content, /Punjab CPWB Helpline/, "Must display CPWB 1121 helpline");
  assert.match(content, /1121/, "Helpline number 1121");
  assert.match(content, /0311-7786264/, "Umang helpline");
  assert.match(content, /Caregiver Harm &amp; Domestic Endangerment Exception/, "Caregiver harm exception");
  assert.match(content, /standard parent notification is actively suppressed/, "Active parent suppression");
  assert.match(content, /Truth in Compliance/, "Pillar 7");
});

test("V8 Punjab School Pilot: /schools/pilot features 8-week timeline, PCTB SLO alignment, and briefing form", () => {
  const pilotPath = path.join(WEB_ROOT, "app/schools/pilot/page.tsx");
  const content = fs.readFileSync(pilotPath, "utf8");
  assert.match(content, /Punjab School Pilot Program/, "Must render title");
  assert.match(content, /Measurable Academic &amp; Confidence Gains/, "Section 1: Objectives");
  assert.match(content, /Target Groups: Developmental Adaptations/, "Section 2: Age Tiers");
  assert.match(content, /Teacher Training Modules: 4-Hour Rapid Onboarding/, "Section 3: Teacher PD");
  assert.match(content, /Parent Onboarding &amp; Consent/, "Section 4: Consent");
  assert.match(content, /3,000 Questions Mapped to PCTB SLOs/, "Section 5: Curriculum");
  assert.match(content, /Observation &amp; Support Workflows/, "Section 6: Observations");
  assert.match(content, /Evaluation Metrics: Four Pillar Institutional Impact/, "Section 7: Metrics");
  assert.match(content, /Phased 8-Week Roadmap/, "Section 8: Timeline");
  assert.match(content, /Request an On-Site Pilot Briefing/, "Section 9: Request Form");
  assert.match(content, /handleSubmit/, "Form submission handler");
  assert.match(content, /Pilot Reference ID/, "Generates confirmation reference ID");
});

test("V8 Government Documents: /documents provides 10 printable documents with markdown copy and print CSS", () => {
  const docPath = path.join(WEB_ROOT, "app/documents/page.tsx");
  const content = fs.readFileSync(docPath, "utf8");
  assert.match(content, /Weebly Platform Executive Overview/, "Doc 1");
  assert.match(content, /Weebly Complete Functionality Guide/, "Doc 2");
  assert.match(content, /Weebly Technical Architecture (&amp;|&) Security Whitepaper/, "Doc 3");
  assert.match(content, /Punjab School Pilot Program: Formal Implementation Proposal/, "Doc 4");
  assert.match(content, /Weebly Child Safeguarding (&amp;|&) Safety Governance Policy/, "Doc 5");
  assert.match(content, /Weebly Pilot Evaluation Plan (&amp;|&) KPI Methodology/, "Doc 6");
  assert.match(content, /Weebly Accessibility Compliance Summary/, "Doc 7");
  assert.match(content, /Weebly Platform Demonstration Guide/, "Doc 8");
  assert.match(content, /Weebly Product Readiness (&amp;|&) Verification Matrix/, "Doc 9");
  assert.match(content, /Weebly Verified Evidence (&amp;|&) Curriculum References/, "Doc 10");
  assert.match(content, /@media print/, "Must contain print-optimized CSS");
  assert.match(content, /handlePrint/, "Print trigger function");
  assert.match(content, /handleCopy/, "Markdown copy function");
  assert.match(content, /handleDownload/, "File download trigger");
});

test("V8 Public Navigation: MarketingShell links Explore and Try Demo to /demos, and provides government footer links", () => {
  const shellPath = path.join(WEB_ROOT, "components/marketing/MarketingShell.tsx");
  const content = fs.readFileSync(shellPath, "utf8");
  assert.match(content, /\{\s*href:\s*"\/demos",\s*label:\s*"Explore"\s*\}/, "Explore link must point to /demos");
  assert.match(content, /href="\/demos"[^>]*>[\s\S]*?Try Demo/, "Primary CTA must point to /demos");
  assert.match(content, /href="\/platform"/, "Footer must link to /platform");
  assert.match(content, /href="\/technology"/, "Footer must link to /technology");
  assert.match(content, /href="\/trust"/, "Footer must link to /trust");
  assert.match(content, /href="\/schools\/pilot"/, "Footer must link to /schools/pilot");
  assert.match(content, /href="\/documents"/, "Footer must link to /documents");
});



