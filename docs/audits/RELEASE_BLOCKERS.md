# InnerOS — Pre-Release Blockers & Risk Register

**Audit Date:** November 2, 2026 (Updated Post-Remediation)  
**Technical Engineering Readiness:** **ALL 7 SOFTWARE & INFRASTRUCTURE BLOCKERS RESOLVED (`PASS`)**  
**External Governance Notice:** Software implementation, database persistence, authentication/RBAC, and live provider adapters are complete and verified (`151 / 151` backend tests passing, `31 / 31` Next.js routes compiled). External legal, regulatory, and clinical human sign-offs remain mandatory prior to commercial public launch.

---

## 1. Resolved Technical Release Blockers (`P0` & `P1` — `RESOLVED / PASS`)

| ID | Previously Reported Blocker | Remediation Implemented | Verification Test | Status |
| :--- | :--- | :--- | :--- | :---: |
| **BLOCKER-01** | **No Real Authentication or Session Management (`FAIL`)** | Implemented Argon2id password hashing (`pwdlib`), opaque session tokens + HTTP-only cookies stored in SQLAlchemy (`users`, `auth_sessions`), `/api/v1/auth/signup`, `/login`, `/logout`, `/me`, `/profile`, and `/login` + `/signup` + `/onboarding` frontend flows (`apps/web/lib/api-client.ts`). | `test_auth_db_and_wellbeing.py::test_auth_signup_login_me_and_logout_lifecycle` | **RESOLVED (`PASS`)** |
| **BLOCKER-02** | **Missing Role-Based Access Control (RBAC) on Admin & Clinical Review Endpoints (`FAIL`)** | Added `require_role({"admin", "clinical_reviewer"})` dependency in `apps/api/app/core/security.py` and enforced it on `/api/v1/admin/*` and `POST /api/v1/knowledge/records/{record_id}/review` (`HTTP 403 Forbidden` for regular users). Built `/admin` console with RBAC switcher. | `test_auth_db_and_wellbeing.py::test_admin_rbac_blocks_standard_user_and_allows_admin` | **RESOLVED (`PASS`)** |
| **BLOCKER-03** | **Volatile In-Memory Backend Persistence & Split Frontend `localStorage` Silos (`PARTIAL`)** | Provisioned SQLAlchemy 2.0 + Alembic migrations (`0001_initial_schema.py`) persisting Users, Auth Sessions, Companion Sessions/Messages, Memories, Life Graph Nodes/Edges, Journal Entries, Growth Goals, Daily Check-Ins, Contact Inquiries, Reminders, Quiet Hours, Integrations Batches, Encrypted OAuth Tokens, and Knowledge Reviews. Linked Journal, Growth Goals, and Check-Ins directly into Companion Chat context (`CompanionService._assemble_personal_context`). | `test_full_audit_resolution.py::test_journal_growth_and_checkins_linked_to_companion_chat` & `test_reminders_and_integrations_sql_persistence_across_cache_resets` | **RESOLVED (`PASS`)** |
| **BLOCKER-04** | **Foundation LLM Gateway (`MOCK`)** | Created `apps/api/app/gateways/ai/live_provider.py` (`OpenAICompatibleProvider` for OpenAI & Ollama, `AnthropicProvider`, and `GeminiProvider`) using `httpx.AsyncClient` with SSE streaming and automatic registration in `AIGateway` (`gateway.py`), falling back cleanly to `SyntheticMockProvider` when API keys are omitted. | `test_full_audit_resolution.py::test_playable_riff_wav_voice_synthesis_and_live_ai_provider_adapters` | **RESOLVED (`PASS`)** |
| **BLOCKER-05** | **Realtime Voice STT/TTS Pipeline (`MOCK / PARTIAL`)** | Upgraded `apps/api/app/gateways/voice/mock_voice.py` with live Deepgram Nova-2 STT (`DEEPGRAM_API_KEY`) and ElevenLabs Multilingual v2 TTS (`ELEVENLABS_API_KEY`) HTTP adapters, plus a multi-harmonic 24kHz 16-bit PCM RIFF WAV synthesizer (`_generate_harmonic_wav_bytes`) and `POST /api/v1/voice/synthesize`. | `test_full_audit_resolution.py::test_playable_riff_wav_voice_synthesis_and_live_ai_provider_adapters` | **RESOLVED (`PASS`)** |
| **BLOCKER-06** | **Google Calendar OAuth 2.0 (`MOCK`)** | Added live Google OAuth 2.0 token exchange (`https://oauth2.googleapis.com/token`) and Calendar Events sync (`https://www.googleapis.com/calendar/v3/calendars/primary/events`) in `apps/api/app/domains/integrations/service.py` when `GOOGLE_CLIENT_ID` is configured, with AES-256-GCM encrypted token persistence in SQLAlchemy (`integrations_tokens`). | `test_full_audit_resolution.py::test_reminders_and_integrations_sql_persistence_across_cache_resets` | **RESOLVED (`PASS`)** |
| **BLOCKER-07** | **Background Notification Delivery & Contact Form (`MOCK / PARTIAL`)** | Built `NotificationDispatcher` (`apps/api/app/core/dispatcher.py`) with SMTP / Resend HTTP Email delivery, VAPID Web Push subscription management (`POST /api/v1/reminders/push-subscriptions`), and a durable SQL notification outbox (`GET /api/v1/reminders/outbox`), wired into reminder dispatch and `/api/v1/contact` auto-confirmation emails. | `test_full_audit_resolution.py::test_external_web_push_email_and_contact_outbox_delivery` | **RESOLVED (`PASS`)** |

---

## 2. Mandatory Legal, Clinical & Regulatory Sign-Offs (`External Human Governance`)

Code-level verification cannot substitute for qualified human legal and clinical governance. Before commercially operating InnerOS in the **United States, United Kingdom, European Union, or Bulgaria**, the following external human sign-offs remain mandatory:

1. **External Regulatory Counsel Sign-Off (SaMD / MDR / FDA Boundary)**:
   - Formal legal review of all marketing copy, onboarding screens, system prompts, and memory features against **FDA General Wellness Policy (US)**, **UK MHRA Software and AI as a Medical Device Guidance**, and **EU MDR (Regulation 2017/745)** to ensure InnerOS remains a non-clinical wellness companion and does not cross into regulated Software as a Medical Device (SaMD).
2. **EU AI Act Transparency & Emotion Recognition Compliance Review**:
   - Legal review under **Regulation (EU) 2024/1689 (EU AI Act)** Article 50 (AI interaction transparency) and emotion-inference restrictions in voice/text analysis.
3. **GDPR / UK GDPR Data Protection Impact Assessment (DPIA) & DPO Sign-Off**:
   - Formal Article 35 DPIA covering special-category data risks (Article 9 explicit consent for wellbeing/health-adjacent reflections), processor Data Processing Agreements (DPAs), and Standard Contractual Clauses (SCCs) / UK IDTA for cross-border transfers.
4. **Licensed Clinical Psychologist Safety Protocol Sign-Off**:
   - Independent clinical review and sign-off on the crisis detection heuristics (`evaluator.py`), de-escalation scripts, regional helpline routing (`hotlines.py` for US, UK, EU, and Bulgaria), and the **Psychology Knowledge Library** (`seed_data.py`).
