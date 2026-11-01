# InnerOS — Frontend-to-Backend API Integration Report

**Version:** 2.0.0  
**Client Library:** [api-client.ts](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/lib/api-client.ts)  
**Backend Entrypoint:** [main.py](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/api/app/main.py)

---

## 1. Complete Endpoint Integration Map

| Domain | HTTP Method & Path | Frontend Consumer(s) | Persistence Backing |
| :--- | :--- | :--- | :--- |
| **System Health** | `GET /api/v1/health` | `SanctuaryShell`, `AdminOperationsConsolePage` | Live subsystem readiness probe |
| **Auth & Identity** | `POST /api/v1/auth/signup` | [signup/page.tsx](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/app/signup/page.tsx) | `users` + `auth_sessions` tables (Argon2id) |
| **Auth & Identity** | `POST /api/v1/auth/login` | [login/page.tsx](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/app/login/page.tsx) | `users` + `auth_sessions` tables |
| **Auth & Identity** | `POST /api/v1/auth/logout` | `api.logout()` | Revokes `auth_sessions` row |
| **Auth & Identity** | `GET /api/v1/auth/me` | `api.getMe()` | `users` table |
| **Companion** | `POST /api/v1/companion/chat` | [companion/chat/page.tsx](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/app/companion/chat/page.tsx) | `domain_state_store` (`companion_sessions`) |
| **Companion** | `POST /api/v1/companion/chat/stream` | `api.streamChatMessage()` | SSE Streaming + `domain_state_store` |
| **Companion** | `GET / DELETE /api/v1/companion/sessions/{id}` | [settings/privacy/page.tsx](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/app/settings/privacy/page.tsx) | `domain_state_store` (`companion_sessions`) |
| **Voice** | `POST /api/v1/voice/turn` | [companion/voice/page.tsx](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/app/companion/voice/page.tsx) | Multimodal voice turn orchestrator |
| **Memory & Graph** | `GET / POST / PUT / DELETE /api/v1/memory/records` | [memory/page.tsx](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/app/memory/page.tsx) | `domain_state_store` (`memory_records`) |
| **Memory & Graph** | `GET / POST / DELETE /api/v1/memory/life-graph/*` | [memory/page.tsx](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/app/memory/page.tsx) | `domain_state_store` (`life_graph_*`) |
| **Privacy & GDPR** | `GET / PUT /api/v1/memory/consent`, `/pause`, `/resume`, `/export`, `/purge-all` | [settings/privacy/page.tsx](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/app/settings/privacy/page.tsx) | `domain_state_store` + cascading relational purge |
| **Wellbeing** | `GET / POST / DELETE /api/v1/journal` | [journal/page.tsx](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/app/journal/page.tsx) | `journal_entries` table |
| **Wellbeing** | `GET / POST / PUT / DELETE /api/v1/growth` | [growth/page.tsx](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/app/growth/page.tsx) | `growth_goals` table |
| **Wellbeing** | `GET / POST /api/v1/check-ins` | [check-in/page.tsx](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/app/check-in/page.tsx) | `check_in_records` table |
| **Wellbeing** | `POST /api/v1/wellbeing/migrate-local` | [login/page.tsx](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/app/login/page.tsx), [signup/page.tsx](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/app/signup/page.tsx) | Migrates `localStorage` into relational tables |
| **Public Contact** | `POST /api/v1/contact` | [contact/page.tsx](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/app/contact/page.tsx) | `contact_submissions` table |
| **Knowledge** | `GET /api/v1/knowledge/records`, `/search`, `/exercises`, `POST .../review` | [knowledge/page.tsx](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/app/knowledge/page.tsx), [admin/knowledge/page.tsx](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/app/admin/knowledge/page.tsx) | 17-Department Knowledge Engine (RBAC enforced on review) |
| **Reminders** | `GET / POST / PUT / DELETE /api/v1/reminders`, `/quiet-hours`, `/dispatch` | [reminders/page.tsx](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/app/reminders/page.tsx) | Tenant-scoped Reminder & Quiet-Hours Scheduler |
| **Integrations** | `POST /api/v1/integrations/import/*`, `/oauth/*` | [integrations/page.tsx](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/app/integrations/page.tsx) | Staged import batches + AES-256-GCM OAuth tokens |
| **Admin Console** | `GET /api/v1/admin/overview`, `PUT /api/v1/admin/feature-flags/{key}`, `GET /api/v1/admin/safety-incidents`, `GET /api/v1/admin/audit-logs` | [admin/page.tsx](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/web/app/admin/page.tsx) | `feature_flags`, `safety_incident_logs`, `admin_audit_logs` tables (RBAC enforced) |
