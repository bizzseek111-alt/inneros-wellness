# InnerOS — Feature Status & End-to-End Verification Matrix

**Version:** 2.0.0  
**Last Verified:** 2026-11-01  
**Automated Backend Test Suite:** `147 / 147 Passed` (`pytest`)

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
| `/contact` | Public Contact & Crisis Support Directory | Persisted via `POST /api/v1/contact` (`contact_submissions` table) | **PASS (Verified)** |
| `/login` | Sign-In Page + One-Click Demo Personas + Local Data Sync | `POST /api/v1/auth/login` + `POST /api/v1/wellbeing/migrate-local` | **PASS (Verified)** |
| `/signup` | Account Creation + Locale Selection + Local Data Migration | `POST /api/v1/auth/signup` + Argon2id + HTTP-only Cookie | **PASS (Verified)** |

---

## 2. Personal Sanctuary Application Routes

| Route | Feature / Screen | Persistence / Backend Integration | Status |
| :--- | :--- | :--- | :--- |
| `/dashboard` | Personal Sanctuary Home (Greeting, Quick Actions, Memory & Routine Summary) | Live FastAPI `/api/v1/memory/records` & `/api/v1/reminders` | **PASS (Verified)** |
| `/companion/chat` | Multimodal Text Companion (5 Modes, Tone Sliders, Crisis Intercept) | `POST /api/v1/companion/chat` + SQLite/Postgres `domain_state_store` | **PASS (Verified)** |
| `/companion/voice` | Living Voice Companion (12 Languages, Voice Profiles, Transcript Drawer) | `POST /api/v1/voice/turn` + Web Speech / Synthetic Audio Pipeline | **PASS (Verified)** |
| `/memory` | Things I Remember & Interactive Life Graph Explorer | `/api/v1/memory/records` & `/api/v1/memory/life-graph` (DB Write-Through) | **PASS (Verified)** |
| `/journal` | Personal Reflections & Guided Prompts | `GET / POST / DELETE /api/v1/journal` (`journal_entries` table) | **PASS (Verified)** |
| `/growth` | Personal Growth Intentions & Gentle Milestone Steps | `GET / POST / PUT / DELETE /api/v1/growth` (`growth_goals` table) | **PASS (Verified)** |
| `/check-in` | Daily Somatic Energy, Tension & Emotional Needs Check-In | `GET / POST /api/v1/check-ins` (`check_in_records` table) | **PASS (Verified)** |
| `/knowledge` | 17-Department Evidence-Tiered Psychology Library & Somatic Exercises | `/api/v1/knowledge/records`, `/search`, `/exercises` | **PASS (Verified)** |
| `/reminders` | Gentle Routines, Quiet Hours & Lock-Screen Privacy Preview | `/api/v1/reminders`, `/quiet-hours`, `/dispatch` | **PASS (Verified)** |
| `/integrations` | Connected Archives (Staged Import Preview, PII Redaction, OAuth) | `/api/v1/integrations/import/*` & `/oauth/*` (AES-256-GCM Tokens) | **PASS (Verified)** |
| `/settings/privacy` | Global Pause Memory, Category Consent, JSON Export & Nuclear Purge | `/api/v1/memory/consent`, `/pause`, `/export`, `/purge-all` | **PASS (Verified)** |
| `/safety` | Global 24/7 Crisis Support Directory & Grounding Tools | `/api/v1/safety/helplines` | **PASS (Verified)** |

---

## 3. Admin & Operations Console Routes

| Route | Feature / Screen | Persistence / Backend Integration | Status |
| :--- | :--- | :--- | :--- |
| `/admin` | Zero-Knowledge Operations Console (Health, AI/Voice, Feature Flags, Safety Logs, Audit Trail) | `GET /api/v1/admin/overview`, `PUT /api/v1/admin/feature-flags/{key}`, `GET /api/v1/admin/safety-incidents` (RBAC Enforced) | **PASS (Verified)** |
| `/admin/knowledge` | Credentialed Psychology Source Review & Certification Queue | `POST /api/v1/knowledge/records/{id}/review` (RBAC Enforced) | **PASS (Verified)** |
