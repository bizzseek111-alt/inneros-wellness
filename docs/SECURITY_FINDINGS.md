# InnerOS — Application Security, Privacy & Isolation Findings

**Version:** 2.0.0  
**Security Test Suite:** [test_security_and_isolation.py](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/api/tests/test_security_and_isolation.py) & [test_auth_db_and_wellbeing.py](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/api/tests/test_auth_db_and_wellbeing.py)

---

## 1. Resolved Security & Isolation Vulnerabilities

| ID | Severity | Finding | Resolution Implemented | Verification |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | **HIGH** | Cross-user conversational `SessionStore` IDOR (session keys were indexed solely by `session_id`) | Scoped all session keys by `f"{user_id}:{session_id}"` in [session_store.py](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/api/app/domains/companion/session_store.py) and persisted per-user sessions to SQLite/PostgreSQL. | Verified in `test_cross_user_companion_session_isolation` |
| **SEC-02** | **HIGH** | Lack of first-party authentication and server-side session verification | Implemented Argon2id password hashing (`argon2-cffi`), SHA-256 hashed session tokens in `auth_sessions`, HTTP-only `SameSite=Lax` cookies, and per-account brute-force lockout in [auth/service.py](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/api/app/domains/auth/service.py). | Verified in `test_signup_login_me_and_logout_flow` |
| **SEC-03** | **MEDIUM** | Admin and knowledge review endpoints lacked Role-Based Access Control (RBAC) | Added `require_role(allowed_roles)` in [security.py](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/api/app/core/security.py) enforcing `admin`, `support`, and `content_reviewer` roles on `/api/v1/admin/*` and `/api/v1/knowledge/records/{id}/review`. | Verified in `test_rbac_enforcement_on_admin_and_knowledge_review` (`403 Forbidden` for standard users) |
| **SEC-04** | **MEDIUM** | Global reminder dispatch `_IDEMPOTENCY_CACHE` was not user-scoped | Scoped idempotency cache keys by `f"{user_id}:{req.idempotency_key}"` in [reminders/service.py](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/api/app/domains/reminders/service.py). | Verified in `test_cross_user_reminder_isolation` |
| **SEC-05** | **LOW** | Journal, Growth, and Check-In data resided only in browser `localStorage` | Created relational tables (`journal_entries`, `growth_goals`, `check_in_records`) with strict `user_id` scoping and included them in GDPR data export and nuclear purge. | Verified in `test_journal_growth_and_check_in_crud_with_user_isolation` |

---

## 2. Cryptographic & Privacy Controls

1. **Password Storage:** Argon2id (`argon2-cffi`) with memory-hard parameters.
2. **OAuth Token Envelope Encryption:** AES-256-GCM with per-tenant HKDF-SHA256 key derivation in [encryption.py](file:///Users/macbookpro/.gemini/antigravity/scratch/inneros/apps/api/app/core/encryption.py).
3. **Zero-Knowledge Admin Telemetry:** Admin endpoints (`GET /api/v1/admin/overview`, `/safety-incidents`, `/audit-logs`) expose only aggregate operational counts and one-way SHA-256 pseudonymized subject hashes (`user_id_hash`). Private chat messages, voice transcripts, and personal reflections are never exposed to administrators.
4. **Prompt Injection & PII Scrubbing on Imports:** External archive imports (`POST /api/v1/integrations/import/upload`) neutralize instruction-override patterns and redact emails, phone numbers, and SSNs before staging candidate memories.
