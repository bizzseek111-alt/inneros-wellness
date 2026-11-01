# InnerOS — Feature Status & End-to-End Verification Matrix

**Version:** 2.1.0  
**Last Verified:** 2026-11-02  
**Automated Test Suites:** `151 / 151 Passed` (`pytest`) + `5 / 5 Passed` (`node --test tests/frontend.test.mjs`) + `31 / 31 Static & Dynamic Routes Compiled` (`next build`)

---

## 1. Public Marketing Website & Authentication Routes

| Route | Feature / Screen | Persistence / Backend Integration | Status |
| :--- | :--- | :--- | :--- |
| `/` | Marketing Home Page (Hero, Interactive Companion Demo, Benefits, Trust) | Dynamic i18n + `/api/v1/health` | **PASS (Verified)** |
| `/features` | 9 Core Capabilities Showcase | Typed CMS Content ([marketing-content.ts](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/lib/marketing-content.ts)) | **PASS (Verified)** |
| `/how-it-works` | 4-Step Guided Flow & Mode Selector | Interactive Mode Preview | **PASS (Verified)** |
| `/about` | Mission, Non-Clinical Ethics & Architecture | Static + Live Safety Directory Modal | **PASS (Verified)** |
| `/privacy-trust` | Data Governance, Consent & Encryption Architecture | Linked to `/settings/privacy` | **PASS (Verified)** |
| `/pricing` | Transparent Sanctuary Tiers (Free & Living Presence Plus) | Typed CMS Content | **PASS (Verified)** |
| `/faq` | Searchable Categorized Accordion FAQ | Interactive Search & Filtering | **PASS (Verified)** |
| `/contact` | Public Contact & Crisis Support Directory | Persisted via `POST /api/v1/contact` (`contact_submissions` table) + Email Outbox Dispatch | **PASS (Verified)** |
| `/login` | Sign-In Page + One-Click Demo Personas + Local Data Sync | `POST /api/v1/auth/login` + `POST /api/v1/wellbeing/migrate-local` | **PASS (Verified)** |
| `/signup` | Account Creation + Locale Selection + Local Data Migration | `POST /api/v1/auth/signup` + Argon2id + HTTP-only Cookie | **PASS (Verified)** |
| `/onboarding` | 4-Step Personal Sanctuary Setup Wizard + Voice Preview | `PUT /api/v1/memory/consent`, `POST /api/v1/memory/records`, `POST /api/v1/voice/synthesize` | **PASS (Verified)** |

---

## 2. Personal Sanctuary Application Routes

| Route | Feature / Screen | Persistence / Backend Integration | Status |
| :--- | :--- | :--- | :--- |
| `/dashboard` | Personal Sanctuary Home (Greeting, Quick Actions, Memory & Routine Summary) | Live FastAPI `/api/v1/wellbeing/summary`, `/api/v1/memory/records` & `/api/v1/reminders` | **PASS (Verified)** |
| `/companion/chat` | Multimodal Text Companion (5 Modes, Tone Sliders, Crisis Intercept, Wellbeing Context Recall) | `POST /api/v1/companion/chat` + SQLite/Postgres + Live OpenAI/Anthropic/Gemini/Ollama Adapters | **PASS (Verified)** |
| `/companion/voice` | Living Voice Companion (30 Languages, 8 Voice Profiles, Playable 24kHz WAV & Live STT/TTS) | `POST /api/v1/voice/turn`, `POST /api/v1/voice/synthesize` + Deepgram/ElevenLabs + RIFF WAV Synth | **PASS (Verified)** |
| `/memory` | Things I Remember & Interactive Life Graph Explorer | `/api/v1/memory/records` & `/api/v1/memory/life-graph` (SQL Write-Through) | **PASS (Verified)** |
| `/journal` | Personal Reflections & Guided Prompts (Recalled in Companion Chat) | `GET / POST / DELETE /api/v1/journal` (`journal_entries` table + Companion Recall) | **PASS (Verified)** |
| `/growth` | Personal Growth Intentions & Gentle Milestone Steps (Recalled in Companion Chat) | `GET / POST / PUT / DELETE /api/v1/growth` (`growth_goals` table + Companion Recall) | **PASS (Verified)** |
| `/check-in` | Daily Somatic Energy, Tension & Emotional Needs Check-In (Recalled in Companion Chat) | `GET / POST /api/v1/check-ins` (`check_in_records` table + Companion Recall) | **PASS (Verified)** |
| `/knowledge` | 17-Department Evidence-Tiered Psychology Library & Somatic Exercises | `/api/v1/knowledge/records`, `/search`, `/exercises` | **PASS (Verified)** |
| `/reminders` | Gentle Routines, Quiet Hours, Web Push VAPID & Email Outbox | `/api/v1/reminders`, `/quiet-hours`, `/dispatch`, `/push-subscriptions`, `/outbox` (SQL Persisted) | **PASS (Verified)** |
| `/integrations` | Connected Archives (Staged Import Preview, PII Redaction, Live Google Calendar OAuth) | `/api/v1/integrations/import/*` & `/oauth/*` (SQL Persisted + AES-256-GCM Tokens) | **PASS (Verified)** |
| `/settings/privacy` | Global Pause Memory, Category Consent, JSON Export & Nuclear Purge | `/api/v1/memory/consent`, `/pause`, `/export`, `/purge-all` | **PASS (Verified)** |
| `/settings/notifications` | Circadian Quiet Hours & Notification Channel Controls | `GET / PUT /api/v1/reminders/quiet-hours` | **PASS (Verified)** |
| `/safety` | Global 24/7 Crisis Support Directory & Grounding Tools | `/api/v1/safety/helplines` | **PASS (Verified)** |
| `/explore` | Aesthetic Direction & Interactive Component Showcase | Light-Mode Sanctuary Showcase | **PASS (Verified)** |
| `/design-system` | Design System v2 Tokens, Typography & Accessibility Primitives | Live Interactive Primitives | **PASS (Verified)** |

---

## 3. Admin & Operations Console Routes

| Route | Feature / Screen | Persistence / Backend Integration | Status |
| :--- | :--- | :--- | :--- |
| `/admin` | Zero-Knowledge Operations Console (Health, AI/Voice, Feature Flags, Safety Logs, Audit Trail) | `GET /api/v1/admin/overview`, `PUT /api/v1/admin/feature-flags/{key}`, `GET /api/v1/admin/safety-incidents` (RBAC Enforced) | **PASS (Verified)** |
| `/admin/knowledge` | Credentialed Psychology Source Review & Certification Queue | `POST /api/v1/knowledge/records/{id}/review` (RBAC Enforced + SQL Persisted) | **PASS (Verified)** |
