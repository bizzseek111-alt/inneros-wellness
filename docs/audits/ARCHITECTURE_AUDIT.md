# InnerOS Architecture Audit

**Date:** November 1, 2026  
**Status:** Baseline Completed  
**Repository:** `apps/api` (FastAPI) & `apps/web` (Next.js 14)  
**Evaluator:** Principal Full-Stack Architect & AI Systems Auditor  

---

## 1. Executive Architecture Summary

InnerOS is structured as a monorepo containing a Python FastAPI backend (`apps/api`) and a Next.js 14 App Router frontend (`apps/web`). The architecture exhibits strong domain boundary design on paper, but contains a notable architectural split between client-side simulation (`prototype-service.ts`) and backend in-memory mock services (`apps/api/app/domains/`).

```
+-------------------------------------------------------------------------+
|                        InnerOS Architecture Overview                    |
+-------------------------------------------------------------------------+
|  [Next.js 14 App Router]                                                |
|  - 21 Client/Server Routes (Tailwind CSS, Framer Motion, Lucide)        |
|  - Dual State Layer:                                                    |
|     1. api-client.ts (Calls FastAPI @ http://127.0.0.1:8000)            |
|     2. prototype-service.ts (localStorage fallback / offline simulation)|
+-----------------------------------+-------------------------------------+
                                    | HTTP / JSON (Rewrites: /api/v1/*)
+-----------------------------------v-------------------------------------+
|  [FastAPI Backend - Port 8000]                                          |
|  - Routers: companion, memory, knowledge, reminders, integrations, etc. |
|  - Gateways: AIGateway (MockProvider), VoiceGateway (MockVoice)         |
|  - Persistence Reality: In-Memory Python Dicts (Zero real SQL database) |
|  - Security: Header-based synthetic user injection (No JWT/Auth0)       |
+-------------------------------------------------------------------------+
```

---

## 2. Frontend Framework & Architecture (`apps/web`)

### 2.1 Framework & Core Stack
- **Framework:** Next.js 14.2.35 (App Router).
- **Language:** TypeScript 5.4.
- **Styling:** Tailwind CSS 3.4 + Custom CSS Variables (`theme.css`).
- **Icons & Motion:** Lucide React (`0.378.0`), Framer Motion (`11.1.9`).
- **Page Generation:** All 21 routes export client or static components (`21/21 static pages prerendered`).

### 2.2 Route Inventory & Rendering Model
| Route | Component File | Client/Server | Data Source |
| :--- | :--- | :--- | :--- |
| `/` | `app/page.tsx` | Client | Static marketing / onboarding entry |
| `/dashboard` | `app/dashboard/page.tsx` | Client | `prototypeService` (localStorage) |
| `/companion/chat` | `app/companion/chat/page.tsx` | Client | `api.streamChatMessage` + fallback |
| `/companion/voice` | `app/companion/voice/page.tsx` | Client | Web Audio API + `api.voice` + mock |
| `/check-in` | `app/check-in/page.tsx` | Client | `prototypeService` (localStorage) |
| `/journal` | `app/journal/page.tsx` | Client | `prototypeService` (localStorage) |
| `/growth` | `app/growth/page.tsx` | Client | `prototypeService` (localStorage) |
| `/reminders` | `app/reminders/page.tsx` | Client | `api.reminders` + `reminders-seed.ts` |
| `/memory` | `app/memory/page.tsx` | Client | `api.memory` + `memory-seed.ts` |
| `/knowledge` | `app/knowledge/page.tsx` | Client | `api.knowledge` + `knowledge-seed.ts` |
| `/admin/knowledge` | `app/admin/knowledge/page.tsx` | Client | `api.admin` + seed |
| `/integrations` | `app/integrations/page.tsx` | Client | `api.integrations` + seed |
| `/settings/notifications`| `app/settings/notifications/page.tsx`| Client | `api.reminders` + localStorage |
| `/settings/privacy` | `app/settings/privacy/page.tsx` | Client | `prototypeService` |
| `/safety` | `app/safety/page.tsx` | Client | `api.safety` (verified hotlines) |
| `/design-system` | `app/design-system/page.tsx` | Client | Static design tokens |
| `/explore` | `app/explore/page.tsx` | Client | Direction comparison matrix |
| `/onboarding` | `app/onboarding/page.tsx` | Client | `prototypeService` |

### 2.3 State Layer Bifurcation
A major architectural anomaly exists in data persistence:
1. **`lib/prototype-service.ts`:** Holds a local persona (`Elena Vance`) in browser `localStorage`. Used exclusively by `/dashboard`, `/journal`, `/growth`, and `/check-in`.
2. **`lib/api-client.ts`:** Directly calls the FastAPI backend. Used by `/companion/chat`, `/companion/voice`, `/memory`, `/reminders`, and `/integrations`.
- **Impact:** Adding a memory or journal entry in `/journal` does NOT automatically propagate to `/memory` or the FastAPI backend unless manual bridges are invoked.

---

## 3. Backend Architecture & Services (`apps/api`)

### 3.1 Framework & Dependencies
- **Runtime:** Python 3.12 (CPython aarch64 on macOS).
- **Framework:** FastAPI `0.111.0` + Starlette `0.37.2` + Pydantic v2 `2.7.1`.
- **Server:** Uvicorn `0.29.0`.
- **Crypto:** PyCryptodome `3.20.0` (AES-256-GCM, PBKDF2).

### 3.2 Service Layer Breakdown
1. **Safety Domain (`app/domains/safety`):**
   - Heuristic regular expressions covering 14 clinical and behavioral risk categories.
   - Verified regional emergency directories for US, UK, EU, and Bulgaria.
   - Deterministic interception prior to any LLM prompt evaluation.
2. **Companion Domain (`app/domains/companion`):**
   - Session store in memory.
   - Orchestrates conversation modes (`just_listen`, `help_me_understand`, `help_me_solve`, `teach_me`, `help_me_settle`).
3. **Memory & Life Graph Domain (`app/domains/memory`):**
   - In-memory dictionaries partitioned by `user_id`.
   - Distinguishes `stored_fact` vs `tentative_ai_interpretation`.
   - Node and edge graph manipulation with geometric coordinate calculation.
4. **Knowledge Engine (`app/domains/knowledge`):**
   - Domain taxonomy across 17 psychology branches.
   - Evidence tier classification (Meta-Analysis, Systematic Review, RCT, Expert Consensus).
5. **Reminders & Life Assistance (`app/domains/reminders`):**
   - Time-zone-aware reminder manager, quiet hours check, anti-guilt message sanitizer.
6. **Integrations & Context Hub (`app/domains/integrations`):**
   - Parsers for ChatGPT export ZIP/JSON, Claude export JSON, iCal ICS, markdown notes, PDF text.
   - AES-256-GCM token encryption (`crypto.py`).

---

## 4. Database Schema vs. Actual Persistence Reality

### 4.1 Specification vs Reality Gap
- **SQL Migration:** A complete PostgreSQL schema with Row-Level Security exists at `apps/api/app/domains/memory/migrations/001_memory_and_life_graph.sql`.
- **Actual Runtime Persistence:** **Zero database connectivity**. The application runs on in-memory Python structures:
  ```python
  _MEMORY_RECORDS_STORE: Dict[str, Dict[str, MemoryRecord]] = {}
  _LIFE_GRAPH_NODES_STORE: Dict[str, Dict[str, LifeGraphNode]] = {}
  _LIFE_GRAPH_EDGES_STORE: Dict[str, Dict[str, LifeGraphEdge]] = {}
  ```
- **Finding:** A backend process restart wipes all newly created user memories, nodes, and reminder schedules, reverting to initial synthetic seed data.

---

## 5. AI & Voice Gateways

### 5.1 AI Provider Gateway (`apps/api/app/gateways/ai`)
- **Status:** Fully mocked (`SyntheticMockProvider`, `FastMockProvider`).
- **Functionality:** Rule-based heuristic pattern matching generates compassionate responses based on selected mode.
- **Limitation:** No connection to external LLMs (OpenAI GPT-4o, Anthropic Claude 3.5, Google Gemini). No API keys or external network requests are made.

### 5.2 Voice Gateway (`apps/api/app/gateways/voice`)
- **Status:** Fully simulated (`SyntheticMultilingualVoiceProvider`).
- **Functionality:** Returns pre-recorded synthetic base64 audio and metadata for 30 language profiles.
- **Frontend Behavior:** Web Audio API (`AudioContext`, `createMediaStreamSource`) captures microphone input and calculates volume for reactive orb animation, but speech-to-text relies on browser `webkitSpeechRecognition` or falls back to text.

---

## 6. Authentication & Tenant Security

- **Status:** Simulated / Header Injection.
- **Implementation (`core/security.py`):**
  ```python
  user_id = x_user_id or SYNTHETIC_DEFAULT_USER.user_id
  tenant_id = x_tenant_id or SYNTHETIC_DEFAULT_USER.tenant_id
  ```
- **Finding:** No password authentication, OAuth session tokens, or JWT verification are enforced. Any request without headers is automatically assigned to `usr_synthetic_elena_vance_001`.

---

## 7. Testing & Quality Assurance

- **Backend Pytest Suite:** 137 passing tests across 12 test files (`test_safety.py`, `test_prerelease_audit_evals.py`, `test_memory_life_graph.py`, `test_encryption.py`, etc.).
- **Frontend Verification:** Build-time static compilation passing (`next build`). No automated frontend unit or E2E tests exist.
