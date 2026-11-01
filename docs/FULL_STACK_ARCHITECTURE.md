# InnerOS — Full-Stack Architecture & Persistence Specification

**Version:** 2.0.0  
**Branch:** `modernization-fullstack`  
**Regulatory Classification:** Non-Clinical AI Emotional Wellbeing, Psychoeducation & Personal Life Companion (Not a Medical Device; Not FDA Cleared)

---

## 1. Architectural Overview

InnerOS is architected as a modular full-stack monorepo combining a **Next.js 14 App Router** frontend (`apps/web`) with a **FastAPI + SQLAlchemy 2.0 + Alembic** relational backend (`apps/api`).

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        Next.js 14 App Router (apps/web)                    │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────┐ │
│  │ Public Marketing Site   │  │ Personal Sanctuary App  │  │ Zero-Knowl. │ │
│  │ /, /features, /pricing, │  │ /dashboard, /companion, │  │ Admin & Ops │ │
│  │ /how-it-works, /about,  │  │ /memory, /journal,      │  │ /admin,     │ │
│  │ /privacy-trust, /faq,   │  │ /growth, /check-in,     │  │ /admin/     │ │
│  │ /contact, /login,       │  │ /knowledge, /reminders, │  │  knowledge  │ │
│  │ /signup                 │  │ /integrations, /safety  │  │             │ │
│  └───────────┬─────────────┘  └────────────┬────────────┘  └──────┬──────┘ │
└──────────────┼─────────────────────────────┼──────────────────────┼────────┘
               │Typed REST + SSE Client (apps/web/lib/api-client.ts)│
               ▼                             ▼                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                     FastAPI Core Engine (apps/api/app/main.py)             │
│  • SecurityHeadersMiddleware (CSP, HSTS, X-Frame-Options, Referrer-Policy) │
│  • SafeAuditLoggingMiddleware (Zero-PII Request Telemetry)                 │
│  • Auth & RBAC Dependency Injection (app/core/security.py)                 │
├──────────────┬──────────────┬──────────────┬───────────────┬───────────────┤
│ Auth Domain  │ Companion &  │ Memory &     │ Wellbeing     │ Admin, Safety │
│ (/auth/*)    │ Voice Domain │ Life Graph   │ (/journal,    │ & Knowledge   │
│ Argon2id +   │ (/companion, │ (/memory/*)  │  /growth,     │ (/admin/*,    │
│ DB Sessions  │  /voice/*)   │ Consent,     │  /check-ins,  │  /safety/*,   │
│ + RBAC       │ 5 Modes +    │ Provenance,  │  /contact)    │  /knowledge)  │
│              │ Crisis Guard │ GDPR Export  │               │               │
└──────────────┴──────┬───────┴──────┬───────┴───────┬───────┴───────────────┘
                      │              │               │
                      ▼              ▼               ▼
┌────────────────────────────────────────────────────────────────────────────┐
│        SQLAlchemy 2.0 Relational Layer + Alembic Migrations (app/db)       │
│  Tables: users, auth_sessions, journal_entries, growth_goals,              │
│          check_in_records, contact_submissions, feature_flags,             │
│          safety_incident_logs, admin_audit_logs, domain_state_store        │
│  Engine: SQLite (inneros.db) in dev/CI • PostgreSQL 16 in staging/prod     │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Relational Database Schema & Persistence (`apps/api/app/db`)

All core application domains persist to a relational database managed via **SQLAlchemy 2.0** ([database.py](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/api/app/db/database.py), [models.py](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/api/app/db/models.py)) and versioned with **Alembic** ([0001_initial_schema.py](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/api/migrations/versions/0001_initial_schema.py)):

| Table Name | Primary Key | Purpose & Isolation Model |
| :--- | :--- | :--- |
| `users` | `id` (`usr_*`) | Stores user identity, `tenant_id`, unique `email`, Argon2id `password_hash`, `role` (`user`, `support`, `content_reviewer`, `admin`), and `locale`. |
| `auth_sessions` | `id` (`sess_*`) | Stores SHA-256 hashed session tokens (`token_hash`), CSRF tokens, expiration timestamps, and revocation flags. |
| `journal_entries` | `id` (`jrn_*`) | User-scoped personal reflections, guided prompts, somatic notes, mood valence, and tags. |
| `growth_goals` | `id` (`goal_*`) | User-scoped personal growth intentions, values (`category`), and milestone step checklists (`steps_json`). |
| `check_in_records` | `id` (`chk_*`) | User-scoped daily somatic energy/stress levels, emotions, and supportive needs. |
| `contact_submissions` | `id` (`cnt_*`) | Public website contact inquiries with validation and status tracking. |
| `feature_flags` | `key` | Platform-wide operational feature flags with live admin toggling and audit attribution. |
| `safety_incident_logs` | `id` (`inc_*`) | Anonymized metadata-only safety circuit-breaker log (stores SHA-256 `user_id_hash`, risk tier, and region—never raw chat transcripts). |
| `admin_audit_logs` | `id` (`audit_*`) | Zero-knowledge administrative and authentication audit trail. |
| `domain_state_store` | `(namespace, user_id, item_key)` | Relational write-through and boot hydration store for `memory_records`, `memory_consent`, `life_graph_nodes`, `life_graph_edges`, and `companion_sessions`. |

---

## 3. Authentication, Session Security & Role-Based Access Control (RBAC)

- **Password Hashing:** `argon2-cffi` (Argon2id) with per-password random salts in [auth/service.py](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/api/app/domains/auth/service.py).
- **Session Management:** Server-side session tokens (`inos_*`) stored as SHA-256 digests in `auth_sessions`, delivered via HTTP-only `SameSite=Lax` cookies (`inneros_session`) and Bearer token headers.
- **Brute-Force Protection:** Per-account failed login rate limiting (`429 Too Many Requests` after repeated failures within a 5-minute window).
- **RBAC Enforcement:** `require_role(allowed_roles)` in [security.py](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/api/app/core/security.py) protects `/api/v1/admin/*` and `/api/v1/knowledge/records/{id}/review`, returning `403 Forbidden` to unprivileged roles.

---

## 4. Safety Pre-Classifier & Non-Clinical Boundary

1. **Deterministic Pre-LLM Safety Gate:** Every text and voice turn passes through `safety_service.evaluate_utterance()` before any model invocation or memory extraction.
2. **Crisis Memory & Reminder Suppression:** When acute distress is detected, speculative memory extraction and routine reminders are suppressed automatically, and localized 24/7 crisis helplines (988, 116 123, 112, etc.) are surfaced immediately.
3. **Browser-to-Account Migration:** Existing `localStorage` journal entries, growth goals, and check-ins are automatically synced to `/api/v1/wellbeing/migrate-local` upon login or signup so zero user data is lost.
