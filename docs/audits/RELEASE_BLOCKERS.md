# InnerOS — Pre-Release Blockers & Risk Register

**Audit Date:** November 1, 2026  
**Overall Release Readiness Verdict:** **NO-GO FOR PUBLIC PRODUCTION LAUNCH (PROTOTYPE / PREVIEW ONLY)**  

While InnerOS has a cohesive **Warm Human Minimalism** UI across all 28 routes, strong deterministic safety circuit-breakers, and `143 / 143` passing backend unit and isolation tests, **critical infrastructure, authentication, persistence, and regulatory blockers** must be resolved before real users or real personal wellbeing data are onboarded in production.

---

## 1. Critical Technical Release Blockers (`P0` — Must Fix Before Public Launch)

### BLOCKER-01: No Real Authentication or Session Management (`FAIL`)
- **Affected Files:** `apps/api/app/core/security.py`, `apps/web/lib/api-client.ts`
- **Current Behavior:**
  - There are no `/login` or `/signup` routes, no password/passkey or OAuth user authentication, and no signed JWT or session cookie validation.
  - `get_current_user` in `apps/api/app/core/security.py` trusts raw `X-User-ID` and `X-Tenant-ID` headers directly from the client and silently defaults to `usr_synthetic_elena_vance_001` whenever those headers are absent.
  - Because `apps/web/lib/api-client.ts` does not send authentication tokens, all unauthenticated browser visitors share the `usr_synthetic_elena_vance_001` identity on the backend.
- **Security Impact:** **Critical (`CVSS 9.8`)** — Complete authentication bypass and shared-identity data exposure if deployed to a public server.
- **Required Remediation:**
  1. Integrate production authentication (e.g., NextAuth/Auth.js, Clerk, or Supabase Auth with HTTP-only `SameSite=Lax`/`Strict` session cookies and short-lived RS256/ES256 JWTs).
  2. Remove the `SYNTHETIC_DEFAULT_USER` fallback in `apps/api/app/core/security.py` outside of explicit `ENVIRONMENT=test` runs and return `HTTP 401 Unauthorized` for unauthenticated requests.
  3. Build `/login` and `/signup` flows and protect authenticated Next.js routes via `middleware.ts`.

---

### BLOCKER-02: Missing Role-Based Access Control (RBAC) on Admin & Clinical Review Endpoints (`FAIL`)
- **Affected Files:** `apps/api/app/domains/admin/router.py`, `apps/api/app/domains/knowledge/router.py` (`POST /api/v1/knowledge/records/{record_id}/review`), `apps/web/app/admin/knowledge/page.tsx`
- **Current Behavior:**
  - Any caller with `role="user"` (including the default synthetic user) can access `/api/v1/admin/status`, `/api/v1/admin/audit-logs`, and `POST /api/v1/knowledge/records/{record_id}/review` to approve or reject psychology knowledge records.
- **Security Impact:** **High (`CVSS 8.1`)** — Broken Function Level Authorization (OWASP API5:2023) allowing unprivileged users to modify the clinical review status of psychoeducation records used by the companion.
- **Required Remediation:**
  1. Add a `require_role({"admin", "clinical_reviewer"})` FastAPI dependency on `/api/v1/admin/*` and `POST /api/v1/knowledge/records/{record_id}/review` that raises `HTTP 403 Forbidden` for standard users.
  2. Gate `/admin/knowledge` in Next.js behind admin role verification.

---

### BLOCKER-03: Volatile In-Memory Backend Persistence & Split Frontend `localStorage` Silos (`PARTIAL`)
- **Affected Files:**
  - Backend RAM stores: `apps/api/app/domains/memory/service.py`, `apps/api/app/domains/companion/session_store.py`, `apps/api/app/domains/reminders/service.py`, `apps/api/app/domains/integrations/service.py`
  - Frontend `localStorage` silos: `apps/web/app/journal/page.tsx`, `apps/web/app/growth/page.tsx`, `apps/web/app/check-in/page.tsx`, `apps/web/lib/prototype-service.ts`
- **Current Behavior:**
  - All backend records (memories, Life Graph nodes/edges, chat sessions, reminders, notifications, staged imports, OAuth tokens) live in Python process RAM dictionaries and are wiped whenever the FastAPI server restarts or scales horizontally.
  - Meanwhile, `/journal`, `/growth`, and `/check-in` persist strictly to browser `localStorage` (`prototypeService`), meaning journal entries and goals are lost if the user clears browser storage or switches devices, and cannot be referenced by the backend companion chat.
- **Impact:** **High (Data Loss & Split State)** — Unsuitable for production user data retention or multi-worker deployment.
- **Required Remediation:**
  1. Provision PostgreSQL with SQLAlchemy 2.0 / Alembic migrations and Row-Level Security (RLS) policies scoped by `user_id` and `tenant_id`.
  2. Implement envelope encryption at rest (AES-256-GCM with KMS-managed KEK and per-user DEKs) for stored memories, journal entries, and chat transcripts.
  3. Create FastAPI endpoints for `/api/v1/journal`, `/api/v1/growth`, and `/api/v1/check-ins` and migrate `/journal`, `/growth`, and `/check-in` off `prototypeService`.

---

## 2. External Provider & Integration Blockers (`P1` — `MOCK` / `BLOCKED`)

| ID | Subsystem | Current State | Required for Production |
| :--- | :--- | :--- | :--- |
| **BLOCKER-04** | **Foundation LLM Gateway** (`apps/api/app/gateways/ai/mock_provider.py`) | **MOCK** — Uses deterministic rule-based `SyntheticMockProvider`. | Configure live OpenAI / Anthropic zero-data-retention (ZDR) enterprise endpoints with streaming output guardrails and semantic crisis classification. |
| **BLOCKER-05** | **Realtime Voice STT/TTS Pipeline** (`apps/api/app/gateways/voice/mock_voice.py`) | **MOCK / PARTIAL** — Browser Web Audio + synthetic base64 WAV buffer generation. | Connect streaming WebRTC/WebSocket STT (e.g., Deepgram Nova-2) and low-latency streaming TTS (e.g., ElevenLabs / Cartesia) with live dialect & code-switching evaluation across all 8 priority languages. |
| **BLOCKER-06** | **Google Calendar OAuth 2.0** (`apps/api/app/domains/integrations/service.py`) | **MOCK** — Generates `synthetic_inneros_client_id` URL and exchanges simulated refresh tokens. | Register production Google Cloud OAuth 2.0 credentials (`calendar.events.readonly`), verify CASA Tier 2 security assessment if required, and enforce server-side `state` token validation against Redis/DB. |
| **BLOCKER-07** | **Background Notification Delivery & Contact Form** (`apps/api/app/domains/reminders/service.py`, `apps/web/app/contact/page.tsx`) | **MOCK / PARTIAL** — Dispatch runs on manual API trigger; Web Push, Email, and `/contact` form submissions are simulated in-app. | Provision Celery/Temporal background workers with Redis, Web Push VAPID keys, and transactional email delivery (Postmark/AWS SES) for both reminder emails and `/contact` support tickets. |

---

## 3. Mandatory Legal, Clinical & Regulatory Sign-Offs (`BLOCKED` — Non-Negotiable)

Code-level tests cannot substitute for qualified human governance. Before releasing InnerOS in the **United States, United Kingdom, European Union, or Bulgaria**, the following external sign-offs are mandatory:

1. **External Regulatory Counsel Sign-Off (SaMD / MDR / FDA Boundary)**:
   - Formal legal review of all marketing copy, onboarding screens, system prompts, and memory features against **FDA General Wellness Policy (US)**, **UK MHRA Software and AI as a Medical Device Guidance**, and **EU MDR (Regulation 2017/745)** to ensure InnerOS remains a non-clinical wellness companion and does not cross into unregulated Software as a Medical Device (SaMD).
2. **EU AI Act Transparency & Emotion Recognition Compliance Review**:
   - Legal review under **Regulation (EU) 2024/1689 (EU AI Act)** Articles 50 (AI interaction transparency) and emotion-inference restrictions in voice/text analysis.
3. **GDPR / UK GDPR Data Protection Impact Assessment (DPIA) & DPO Sign-Off**:
   - Formal Article 35 DPIA covering special-category data risks (Article 9 explicit consent for wellbeing/health-adjacent reflections), processor Data Processing Agreements (DPAs), Standard Contractual Clauses (SCCs) / UK IDTA for cross-border transfers, and verifiable cryptographic erasure.
4. **Licensed Clinical Psychologist Safety Protocol Sign-Off**:
   - Independent clinical review and sign-off on the crisis detection heuristics (`evaluator.py`), de-escalation scripts, regional helpline routing (`hotlines.py` for US, UK, EU, and Bulgaria), and the **Psychology Knowledge Library** (`seed_data.py`).
