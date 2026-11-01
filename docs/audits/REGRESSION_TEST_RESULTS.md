# InnerOS — Automated & Browser Regression Test Results

**Execution Date:** November 1, 2026  
**Test Harnesses Executed:**
1. **Backend Automated Test Suite (`pytest`)**: `apps/api/tests/` — **143 / 143 tests PASSED** (`1.27s`)
2. **Frontend Static & Type Verification (`next build`)**: `apps/web` — **28 / 28 routes compiled cleanly** (`0` TypeScript errors, `0` ESLint errors)
3. **Live HTTP & Headless Chrome Browser Verification**: **25 / 25 web routes returned `HTTP 200`** and rendered without runtime exceptions.

---

## 1. Backend Pytest Suite Summary (`143 Passed, 0 Failed`)

Command executed:
```bash
apps/api/.venv/bin/pytest apps/api/tests -v --tb=short
```

| Test Module | Tests | Result | Coverage Focus |
| :--- | :---: | :---: | :--- |
| `test_companion.py` | 2 | **PASS** | Basic companion chat completion and acute crisis interception. |
| `test_companion_modes.py` | 12 | **PASS** | All 5 conversation modes (*Just Listen* zero-advice rule, *Help Me Understand*, *Help Me Solve*, *Teach Me*, *Help Me Settle*), warmth/directness controls, SSE streaming, session history, and model benchmarking. |
| `test_context_hub_integrations.py` | 8 | **PASS** | 8-step import pipeline (ChatGPT JSON, Claude JSON, Markdown, ICS), regex PII redaction, prompt-injection disarming, selective exclusion, candidate memory confirmation, batch revocation, and Google Calendar OAuth token encryption. |
| `test_encryption.py` | 2 | **PASS** | AES-256-GCM + PBKDF2-HMAC-SHA256 payload encryption, authentication tag verification, and per-user key isolation. |
| `test_health.py` | 2 | **PASS** | Liveness (`/health`) and readiness (`/api/v1/health`) probes and truthful non-clinical metadata. |
| `test_knowledge_engine.py` | 12 | **PASS** | 17 psychology departments, evidence quality hierarchy, pop-psychology filtering (`peer_reviewed_only`), companion context retrieval, and reviewer sign-off workflow. |
| `test_memory.py` | 1 | **PASS** | Legacy `/api/v1/memory/items` compatibility contract. |
| `test_memory_life_graph.py` | 12 | **PASS** | Fact vs. tentative AI interpretation separation, suggestion confirmation/rejection, inline editing, sensitive health consent enforcement (`HTTP 403`), pause/resume recording, single-record cascade deletion, nuclear purge, and GDPR Art. 20 export. |
| `test_other_domains.py` | 5 | **PASS** | Cross-domain smoke tests for Knowledge, Voice, Reminders, Integrations, and Admin exports. |
| `test_prerelease_audit_evals.py` | 23 | **PASS** | Pre-release safety evaluations across suicidal ideation, self-harm, IPV/domestic abuse, acute psychosis/delusions, mania, addiction, eating disorders, minor safety, and emotional dependency across 6 languages. |
| `test_reminders_proactive.py` | 10 | **PASS** | Anti-guilt behavioral filter (`HTTP 400` on streak/possessive copy), lockscreen privacy sanitization, circadian quiet hours (overnight spans), idempotent background dispatch, snooze/dismiss, and missed check-in non-escalation (`MISSED_NO_DANGER`). |
| `test_safety.py` | 5 | **PASS** | Tier-1 pre-execution safety evaluator and regional hotline lookup (`US`, `GB`, `BG`, `DE`). |
| `test_safety_fixtures.py` | 35 | **PASS** | Parameterized red-team safety fixture corpus verifying zero false negatives on crisis utterances. |
| `test_security_and_isolation.py` | 6 | **PASS** | **New QA Regression Suite:** Cross-user companion session isolation (`User A` vs `User B` on `session_default`), cross-user reminder idempotency cache isolation, cross-user Memory/Life Graph CRUD isolation, cross-user import batch isolation, sensitive health `HTTP 403` enforcement, and security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`). |
| `test_voice_companion.py` | 8 | **PASS** | 8 voice profiles, 30 architected languages with readiness tiers, voice turn execution, pre-TTS crisis audio suppression, low-confidence noise clarification fallback, barge-in interruption, and dialect/code-switching evaluation harness. |
| **TOTAL** | **143** | **100% PASS** | Executed in `1.27s` on Python `3.12.13`. |

---

## 2. Frontend Build & Static Analysis Results (`28 / 28 Static Pages`)

Command executed:
```bash
pnpm --filter web build
```

- **TypeScript Compiler (`tsc --noEmit`)**: `PASS` (`0` errors)
- **Next.js ESLint**: `PASS` (`0` warnings, `0` errors)
- **Static Page Generation**: `28 / 28` pages prerendered cleanly (`First Load JS shared by all: 87.3 kB`).

---

## 3. Live Browser & HTTP Route Verification (`25 / 25 Routes HTTP 200`)

### 3.1 Public Marketing Website Routes (`MarketingShell`)
| Route | HTTP Status | Desktop (`1440px`) | Tablet (`768px`) | Mobile (`390px`) | Interactive Elements Verified |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `/` | `200 OK` | **PASS** | **PASS** | **PASS** | Hero Voice/Chat/Memory preview tabs, 8-locale switcher, 24/7 Crisis Helplines modal, footer telemetry opt-out switch. |
| `/features` | `200 OK` | **PASS** | **PASS** | **PASS** | Category filter pills (*All*, *Voice & Text*, *Reflection & Memory*, *Growth & Routines*, *Control & Archives*) and deep links into app routes. |
| `/how-it-works` | `200 OK` | **PASS** | **PASS** | **PASS** | 5-step interactive walkthrough selector, communication style preview, Morning/Midday/Evening cards. |
| `/about` | `200 OK` | **PASS** | **PASS** | **PASS** | Mission, design philosophy, 4 ethical principles, 8 priority language badges, and 30-language readiness standards. |
| `/privacy-trust` | `200 OK` | **PASS** | **PASS** | **PASS** | Data choice cards, memory control summary, AI transparency boundary table, and crisis helplines trigger. |
| `/pricing` | `200 OK` | **PASS** | **PASS** | **PASS** | **Draft Pricing — Pre-Release Preview** banner, Monthly/Annual billing toggle, 3 tier cards, and ethical monetization commitments. |
| `/faq` | `200 OK` | **PASS** | **PASS** | **PASS** | Live search input, 5 topic filter pills, `aria-expanded` accordion toggles, and empty-search reset state. |
| `/contact` | `200 OK` | **PASS** | **PASS** | **PASS** | Top 24/7 crisis support banner (`988`, `116 123`, `112`, `0800 88 001`), form validation on empty fields, and submission confirmation card. |

### 3.2 Authenticated Companion Application Routes (`SanctuaryShell`)
| Route | HTTP Status | Backend API Connected? | Regression Result & Notes |
| :--- | :---: | :---: | :--- |
| `/onboarding` | `200 OK` | No (`localStorage`) | **PASS (Local)** — 4-step wizard saves name, privacy toggles, language, voice, and warmth to `prototypeService` and routes to `/dashboard`. |
| `/dashboard` | `200 OK` | Partial (`localStorage` + links) | **PASS** — Displays time-of-day greeting, quick check-in card, mode shortcuts, and navigation into Voice, Chat, Journal, and Memory. |
| `/companion/chat` | `200 OK` | Yes (`/api/v1/companion/*`) | **PASS** — Streams SSE tokens, switches between 5 modes, adjusts warmth/directness, loads/clears session history, and opens `EmergencyModal` on crisis input. |
| `/companion/voice` | `200 OK` | Yes (`/api/v1/voice/*`) | **PASS (Simulated Audio)** — Loads 8 voices and 30 languages, toggles mic/mute/pause, supports barge-in interruption, and provides text fallback. |
| `/memory` | `200 OK` | Yes (`/api/v1/memory/*`) | **PASS** — *Saved Notes*, *Visual Map* (Life Graph SVG), and *Privacy & Controls* tabs all connect to FastAPI for CRUD, suggestion confirmation, pause/resume, export, and purge. |
| `/journal` | `200 OK` | No (`localStorage`) | **PARTIAL** — Writes/reads journal reflections and mood tags in `localStorage` (`prototypeService`); not synced to FastAPI. |
| `/growth` | `200 OK` | No (`localStorage`) | **PARTIAL** — Writes/reads personal goals and step checkboxes in `localStorage` (`prototypeService`); not synced to FastAPI. |
| `/check-in` | `200 OK` | No (`localStorage`) | **PARTIAL** — Saves 3-step mood, body sensation, and needs check-ins to `localStorage` (`prototypeService`); not synced to FastAPI. |
| `/reminders` | `200 OK` | Yes (`/api/v1/reminders/*`) | **PASS** — Lists, creates, pauses, snoozes, dispatches, and deletes reminders; configures quiet hours and views notification center. |
| `/knowledge` | `200 OK` | Yes (`/api/v1/knowledge/*`) | **PASS** — Filters 17 psychology departments, searches evidence-backed guides, and runs interactive 4-4-4-4 breathing exercises. |
| `/integrations` | `200 OK` | Yes (`/api/v1/integrations/*`) | **PASS** — Uploads/parses exports, redacts PII, disarms prompt injections, stages candidate memories, and simulates Google Calendar sync. |
| `/safety` | `200 OK` | Yes (`/api/v1/safety/*`) | **PASS** — Displays verified crisis helplines by country (`US`, `GB`, `BG`, `EU`) with direct `tel:` links and grounding steps. |
| `/settings/privacy` | `200 OK` | **Yes (Fixed in Audit)** | **PASS** — Syncs memory consent with FastAPI, exports unified Server + Browser JSON archive with file download, and purges both backend and local stores. |
| `/settings/notifications` | `200 OK` | Yes (`/api/v1/reminders/quiet-hours`) | **PASS** — Loads and updates circadian quiet hours and daily check-in limits against FastAPI. |
| `/explore` | `200 OK` | Static UI | **PASS (Fixed in Audit)** — All 4 style tabs (*Serene Sanctuary*, *Warm Futurism*, *Minimal Calm*, *Compare Styles*) now render in cohesive light-mode cards. |
| `/design-system` | `200 OK` | Static UI | **PASS** — Displays Warm Human Minimalism color tokens, typography scale, primitives, and state showcase. |
| `/admin/knowledge` | `200 OK` | Yes (`/api/v1/knowledge/*`) | **PASS (UI Fixed)** — Connects to reviewer workflow and audit summary; header updated to light theme. *(Note: Backend lacks RBAC check; tracked in `RELEASE_BLOCKERS.md`).* |
