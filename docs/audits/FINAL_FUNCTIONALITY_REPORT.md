# InnerOS — Final Functionality & Security Audit Report

**Audit Date:** November 1, 2026  
**Roles:** Independent Senior QA Engineer, Full-Stack Code Reviewer, Application Security Engineer, and Accessibility Auditor  
**Target Environment:** Next.js 14 (`apps/web` on `:3000`) + FastAPI (`apps/api` on `:8000`)  
**Regulatory Disclaimer:** This audit evaluates software functionality, application security, data isolation, and WCAG 2.2 accessibility. **It does not constitute clinical validation, medical-device clearance, or formal legal/regulatory approval.**

---

## 1. Status Classification Legend

| Status | Definition |
| :--- | :--- |
| **PASS** | Verified working end-to-end across UI and/or API with automated and browser verification. |
| **PARTIAL** | Functional in part, but incomplete (e.g., persists only in `localStorage` or volatile RAM rather than a durable database). |
| **MOCK** | Simulated implementation using deterministic local providers, synthetic tokens, or pre-generated audio buffers. |
| **FAIL** | Missing, broken, or unaligned with production security requirements. |
| **BLOCKED** | Cannot be verified without third-party API credentials, cloud infrastructure, or external legal/clinical sign-off. |

---

## 2. Comprehensive 21-Area Functionality Matrix

| # | Audit Area | Route / Endpoint | Status | Technical Evidence & Verification Notes |
| :- | :--- | :--- | :--- | :--- |
| **1** | **Public Marketing Website Routes** | `/`, `/features`, `/how-it-works`, `/about`, `/privacy-trust`, `/pricing`, `/faq`, `/contact` | **PASS** | All 8 routes return `HTTP 200`, render cleanly in SSR light mode (`#FAF8F4`), include JSON-LD structured data (`SoftwareApplication`, `FAQPage`), support 8-locale switching (`EN`, `ES`, `FR`, `DE`, `BG`, `AR` RTL, `UR` RTL, `HI`), and maintain strict non-clinical positioning. |
| **2** | **Signup & Login** | `/onboarding` (exists); `/login`, `/signup` (missing) | **FAIL** / **MOCK** | `/onboarding` provides a working 4-step local setup flow that saves preferences to `localStorage` (`prototypeService`). However, real `/login` and `/signup` pages, password/passkey flows, and session cookies do **not** exist (`HTTP 404`). |
| **3** | **Application Navigation** | `SanctuaryShell.tsx`, `MarketingShell.tsx`, `MobileNavigation.tsx` | **PASS** | Desktop sidebar (`SanctuaryShell`), mobile bottom bar + drawer (`MobileNavigation`), public marketing header (`MarketingShell`), keyboard *"Skip to main content"* links, and cross-links between the public website and companion app all work cleanly. |
| **4** | **Companion Text Chat** | `/companion/chat`, `POST /api/v1/companion/chat`, `POST /api/v1/companion/chat/stream` | **PASS** (Pipeline) / **MOCK** (LLM) | SSE streaming and synchronous chat endpoints work end-to-end. All 5 modes (*Just Listen*, *Help Me Understand*, *Help Me Solve*, *Teach Me*, *Help Me Settle*), warmth/directness sliders, advice suppression in *Just Listen*, and Tier-1/Tier-2 crisis circuit breakers are verified. Underlying LLM is the deterministic `SyntheticMockProvider` (`mock_provider.py`). |
| **5** | **Voice Permissions & Audio Behavior** | `/companion/voice`, `/api/v1/voice/profiles`, `/languages`, `/turn`, `/session/interruption` | **PARTIAL** / **MOCK** | Browser Web Audio API microphone permission requests, mute/pause/end controls, barge-in interruption (`/api/v1/voice/session/interruption`), text fallback, noisy-audio clarification prompt (`confidence < 0.65`), and pre-TTS crisis audio suppression work. Speech synthesis returns synthetic base64 WAV audio (`mock_voice.py`); live cloud STT/TTS is **BLOCKED** pending Deepgram/ElevenLabs API keys. |
| **6** | **Conversation History** | `GET / DELETE /api/v1/companion/sessions/{session_id}` | **PASS** (Fixed IDOR) / **PARTIAL** (RAM) | Multi-turn history (`max_turns=20`) loads and clears via UI and API. **Fixed during audit:** `SessionStore` previously keyed sessions only by `session_id` (allowing cross-user IDOR on `session_default`); now strictly scoped by `f"{user_id}:{session_id}"`. History is stored in volatile process RAM and resets on server restart. |
| **7** | **Memory Saving, Editing & Deletion** | `/memory`, `GET/POST/PUT/DELETE /api/v1/memory/records`, `POST .../action` | **PASS** (Fixed) / **PARTIAL** (RAM) | Creating memories, editing statements inline, confirming or rejecting tentative AI suggestions, filtering by category/tentative status, and single-record GDPR Art. 17 deletion with Life Graph cascade all work end-to-end against FastAPI. Persisted in process RAM (`_MEMORY_RECORDS_STORE`). |
| **8** | **Life Graph Interactions** | `/memory` (Visual Map tab), `GET/POST/DELETE /api/v1/memory/life-graph/nodes` & `/edges` | **PASS** | Interactive SVG graph renders nodes and Bezier edges, supports node selection in the side inspector, node creation modal, and cascading edge deletion when a node or linked memory is deleted. |
| **9** | **Journaling & Reflections** | `/journal`, `/check-in` | **PARTIAL** (Local-Only) | Creating journal entries, mood tags, prompt selection, search filtering, and daily somatic/needs check-ins work in the browser and persist to `localStorage` (`prototypeService`), but have **no backend API persistence** and are not automatically ingested into `/api/v1/memory`. |
| **10** | **Goal Tracking** | `/growth` | **PARTIAL** (Local-Only) | Adding goals, toggling step completion checkboxes, and filtering by life area work in the browser via `localStorage` (`prototypeService`), but are not persisted to the FastAPI backend. |
| **11** | **Reminders & Notifications** | `/reminders`, `/api/v1/reminders/*` | **PASS** (In-App) / **MOCK** (Push/Email) | CRUD for reminders, snooze (`15m`), dismiss, idempotent background dispatch, anti-guilt behavioral filter (HTTP 400 on streak/guilt language), circadian quiet-hours suppression, lockscreen privacy sanitization, and missed check-in non-escalation (`MISSED_NO_DANGER`) all pass. **Fixed during audit:** scoped `_IDEMPOTENCY_CACHE` by `user_id`. External Web Push/Email delivery is simulated. |
| **12** | **Knowledge Library Retrieval** | `/knowledge`, `/admin/knowledge`, `/api/v1/knowledge/*` | **PASS** | 17 psychology departments, evidence-tier badges, pop-psychology filtering (`peer_reviewed_only`), companion context retrieval (`/retrieve-context`), guided breathwork/somatic exercises (`/exercises`), and reviewer status updates (`/review`) work end-to-end. |
| **13** | **Consent & Privacy Settings** | `/settings/privacy`, `/memory` (Privacy tab), `GET/PUT /api/v1/memory/consent`, `/pause`, `/resume` | **PASS** (Fixed Disconnect) | Enforces pause/resume memory recording and blocks `optional_sensitive_health_related_information` with HTTP 403 unless explicit opt-in is granted. **Fixed during audit:** `/settings/privacy` previously updated only `localStorage`; it is now wired to `api.getMemoryConsent()`, `api.pauseMemory()`, and `api.resumeMemory()`. |
| **14** | **Export & Deletion Flows** | `/settings/privacy`, `/memory`, `GET /api/v1/memory/export`, `POST /api/v1/memory/purge-all` | **PASS** (Fixed Disconnect) | **Fixed during audit:** `/settings/privacy` now fetches the backend `DataExportBundle` (`/api/v1/memory/export`), merges it with local journal/growth data, displays the preview, provides a downloadable `.json` file, and invokes `api.purgeAllMemory()` + `api.clearSessionHistory()` when deleting all data. |
| **15** | **Connected-App Integration States** | `/integrations`, `/api/v1/integrations/*` | **PASS** (Parsers) / **MOCK** (OAuth) / **BLOCKED** (Phase 2) | 8-step import pipeline (ChatGPT JSON, Claude JSON, Markdown/TXT, ICS calendar) with regex PII scrubbing, prompt-injection disarming, selective item exclusion, candidate memory approval, and batch revocation (`DELETE /batches/{id}`) works end-to-end. Google Calendar OAuth uses simulated token exchange (encrypted at rest with AES-256-GCM + PBKDF2). Phase 2 integrations (Gmail, Notion, Apple Health, Wearables, Slack) are architecture specifications only. |
| **16** | **Responsive Layouts** | Desktop (`1440px`), Tablet (`768px`), Mobile (`390px`) | **PASS** | Verified via headless Chrome across desktop, tablet, and mobile viewports. **Fixed during audit:** added `whitespace-nowrap` and `shrink-0` to `MarketingShell` navigation items so desktop headers never wrap awkwardly. |
| **17** | **Keyboard & Screen-Reader Accessibility** | App-wide & Public Website | **PASS** | Semantic landmarks (`<header>`, `<nav>`, `<main id="main-content">`, `<footer>`), keyboard *"Skip to main content"* link, `aria-expanded` / `aria-controls` on accordions and drawers, `role="dialog" aria-modal="true"` on crisis and purge modals, WCAG AAA primary text contrast (`12.8:1`), and `prefers-reduced-motion` support verified. |
| **18** | **API & Database Connectivity** | FastAPI `apps/api` <-> Next.js `apps/web` | **PARTIAL** | Next.js communicates cleanly with FastAPI over REST and SSE (`http://127.0.0.1:8000`). However, FastAPI uses **in-memory Python dictionaries** (`_MEMORY_RECORDS_STORE`, `_REMINDERS_STORE`, `_STAGED_BATCHES`, `SessionStore`) rather than a persistent PostgreSQL/SQLite database; all backend state resets when the uvicorn process restarts. |
| **19** | **Errors, Loading States & Empty States** | App-wide & `/design-system` | **PASS** | API validation errors (HTTP 400/403/404/422) return structured JSON details; frontend pages gracefully fall back when offline and provide clear empty states (e.g., FAQ search zero-results reset, empty notifications state, paused memory banner). |
| **20** | **Authentication & Authorization** | `apps/api/app/core/security.py`, `/admin/*`, `/knowledge/records/{id}/review` | **FAIL** | `get_current_user` trusts unverified `X-User-ID` and `X-Tenant-ID` HTTP headers and falls back to `usr_synthetic_elena_vance_001` when omitted. Furthermore, `/api/v1/admin/*` and `POST /api/v1/knowledge/records/{id}/review` do not enforce Role-Based Access Control (`user.role == "admin"` / `"reviewer"`). |
| **21** | **Data Isolation Between Users** | All domain services (`memory`, `companion`, `reminders`, `integrations`) | **PASS** (Fixed in API) | When distinct `X-User-ID` headers are supplied, memory records, Life Graph nodes/edges, consent settings, reminders, notifications, import batches, OAuth connections, **and (fixed during audit) companion chat sessions and reminder idempotency keys** are strictly isolated per `user_id`. |

---

## 3. Safe, Bounded Defects Remediated During This Audit

1. **Fixed Cross-User Companion Session IDOR (`apps/api/app/domains/companion/session_store.py`, `service.py`, `router.py`)**:
   - *Root Cause*: `SessionStore._sessions` was indexed solely by `session_id` (`"session_default"`), allowing User B to read, append to, or clear User A's conversation history.
   - *Fix*: Scoped all session keys by `f"{user_id}:{session_id}"` and enforced `user.user_id` across `get_or_create`, `add_message`, `get_history`, and `clear`.
2. **Fixed Cross-User Reminder Idempotency Cache Collision (`apps/api/app/domains/reminders/service.py`)**:
   - *Root Cause*: `_IDEMPOTENCY_CACHE` used `req.idempotency_key` globally across all users.
   - *Fix*: Scoped cache keys to `f"{user_id}:{req.idempotency_key}"`.
3. **Removed Overstated Regulatory & Encryption Claims in Health Probe (`apps/api/app/main.py`)**:
   - *Root Cause*: `GET /api/v1/health` returned `"regulatory_status": "Non-Clinical Wellness Software (FDA 21 CFR 882 compliant)"` and `"memory_encryption": "AES-256-GCM + HKDF active"`.
   - *Fix*: Updated to `"Non-Clinical Wellness Companion (Not a Medical Device; Not FDA Cleared)"` and `"In-Memory Tenant-Scoped Store (OAuth Tokens AES-256-GCM + HKDF Encrypted)"`.
4. **Connected `/settings/privacy` to Live FastAPI Backend (`apps/web/app/settings/privacy/page.tsx`)**:
   - *Root Cause*: The Privacy Settings page only read/wrote `localStorage` (`prototypeService`) and ignored the FastAPI `/api/v1/memory/*` endpoints.
   - *Fix*: Wired `/settings/privacy` to `api.getMemoryConsent()`, `api.pauseMemory()`, `api.resumeMemory()`, `api.exportPersonalData()`, `api.purgeAllMemory()`, and `api.clearSessionHistory("session_default")`, and added a downloadable `.json` archive button.
5. **Fixed Light-Mode UI Regressions on `/explore` and `/admin/knowledge`**:
   - *Root Cause*: `SereneLuxuryComposition.tsx`, `WarmFuturismComposition.tsx`, `MinimalEQComposition.tsx`, and `app/admin/knowledge/page.tsx` retained legacy dark-mode `#090D16` / `#0B1120` / `#08080A` boxes and `text-ivory-100` classes.
   - *Fix*: Updated all four files to Warm Human Minimalism light cards (`#FAF8F4`, `#FFFFFF`, `#E8F1EB`, `#F7E7E2`, `#EDE8F5`) with accessible `#263330` / `#52625E` typography.
