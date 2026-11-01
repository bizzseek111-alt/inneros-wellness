# InnerOS Feature & Functionality Audit

**Date:** November 1, 2026  
**Auditor:** Senior Full-Stack Architect & AI Application Auditor  
**Verification Target:** InnerOS Release Candidate v0.9.0-rc1  

---

## 1. Feature Status Classification Matrix

To prevent misleading claims of readiness, every feature has been audited against its true implementation level:
- **Connected & Working:** Fully integrated between Next.js frontend and FastAPI backend with active business logic.
- **Partially Implemented:** Functional logic exists in code or simulation, but relies on mock fallbacks or lacks complete pipeline integration.
- **Frontend-Only Demonstration:** Exists purely as an interactive UI in Next.js backed by `localStorage` or hardcoded fixtures.
- **Simulated / Mock Service:** Backend API exists and responds, but uses synthetic heuristic mock data rather than real third-party providers.
- **Not Implemented / Specification Only:** Documented or mentioned in UI, but nonfunctional or placeholder.

---

## 2. Granular Feature-by-Feature Breakdown

| Feature / Screen | Claimed Capability | Actual Implementation Status | Detailed Verification Notes |
| :--- | :--- | :--- | :--- |
| **Companion Text Chat** (`/companion/chat`) | 5 conversation modes, warmth/directness controls, streaming tokens, safety filter | **Connected & Working (Mock AI Provider)** | Streams tokens via FastAPI `/api/v1/companion/chat/stream`. Applies 14-domain safety heuristic. Mode advice rules enforced. Underlying LLM is rule-based `SyntheticMockProvider`. |
| **Realtime Voice Companion** (`/companion/voice`) | Microphone streaming, reactive breathing orb, barge-in interruption, text fallback | **Partially Implemented (Browser Web Audio + Mock Voice)** | Web Audio API captures microphone audio and drives volume-reactive orb CSS animations. STT uses browser API; TTS returns synthetic base64 WAV audio. True bi-directional WebRTC/WebSocket audio is simulated. |
| **Personal Memory Ledger** (`/memory`) | Staging suggestions, fact vs interpretation separation, confidence scoring | **Connected & Working (In-Memory Store)** | Connects to `/api/v1/memory/records`. Suggestions can be confirmed or rejected. Edits update in-memory store. Wiped upon server restart. |
| **Interactive Life Graph** (`/memory`) | Interactive node network, edge connections, entity inspector | **Connected & Working (SVG Canvas)** | SVG rendering with dynamic Bezier curves and node selection. Adding entities works via `/api/v1/memory/life-graph/nodes`. Complex technical graph layout can confuse non-technical users. |
| **Memory Pause & Purge** (`/memory`, `/settings/privacy`) | Pause memory recording, nuclear memory purge, JSON export | **Connected & Working** | Global pause toggle active (`/api/v1/memory/consent`). Nuclear purge wipes user store in-memory. JSON export triggers valid RFC-compliant file download in browser. |
| **Psychology Knowledge Engine** (`/knowledge`) | Peer-reviewed citations, evidence tiers (Meta-Analysis, RCT), search | **Connected & Working (Seed Data)** | Connects to `/api/v1/knowledge/records`. Filter by branch, category, and evidence quality works. Backed by seed catalog of 12 peer-reviewed psychology topics. |
| **Knowledge Admin Queue** (`/admin/knowledge`) | Reviewer workflow, clinical approval queue, version audit | **Connected & Working** | Connects to `/api/v1/admin/knowledge/reviews`. Reviewers can approve, reject, or request revisions. |
| **Proactive Reminders** (`/reminders`) | Wellbeing check-in scheduling, anti-guilt message filtering | **Connected & Working** | Connects to `/api/v1/reminders`. Anti-guilt behavioral sanitizer blocks manipulative copy. Quiet hours suppression verified. Push delivery is simulated in-app. |
| **Personal Context Hub** (`/integrations`) | ChatGPT & Claude export import, PDF/MD parsing, Google Calendar sync | **Connected & Working (Local File Parsers)** | ZIP/JSON and text parsing works in Python with regex PII scrubbing and prompt injection neutralization. Google Calendar OAuth generates synthetic token with AES-256-GCM encryption. |
| **Daily Reflection Journal** (`/journal`) | Encrypted personal journaling, somatic tags, valence scoring | **Frontend-Only Demonstration** | Reads and writes strictly to browser `localStorage` via `prototypeService`. Does not synchronize with FastAPI backend or `/memory`. |
| **Compassionate Growth Goals** (`/growth`) | Growth horizons, milestone checklists, reflection notes | **Frontend-Only Demonstration** | Persists to `localStorage` only. No backend endpoint in FastAPI. |
| **Daily Needs Check-In** (`/check-in`) | Somatic sensation wheel, emotional valence, fundamental needs | **Frontend-Only Demonstration** | Pure client-side interactive widget in `localStorage`. |
| **Emergency Crisis Support** (`/safety`) | Verified national crisis directories for US, UK, EU, and Bulgaria | **Connected & Working** | Connects to `/api/v1/safety/hotlines/{country_code}`. Verified numbers (988, 111, 112, 0800 88 001, 0800 1 86 76) display and link to real telephone URIs. |
| **Settings & Quiet Hours** (`/settings/notifications`) | DND hours, delivery throttling, channel preferences | **Partially Implemented** | Backend model exists and evaluates quiet hours, but frontend UI toggles primarily update `localStorage` state. |
| **Settings & Privacy** (`/settings/privacy`) | Data rights management, export, consent audit log | **Connected & Working** | Triggers backend export and deletion endpoints. |

---

## 3. Audit of Simulated Features & Nonfunctional Elements

1. **Authentication:**  
   - "Signed in as Elena Vance" in UI is hardcoded.
   - Profile settings modal and avatar editing do not connect to a user database.
2. **Third-Party Integrations:**  
   - Google Calendar "Connect" button runs a simulated local redirect with generated calendar events, not a live Google Cloud OAuth 2.0 flow.
   - Apple Health, Wearables, Outlook, and Notion are documented as "Phase Two Architecture Specifications" in `/integrations` and are intentionally nonfunctional in UI.
3. **Voice STT/TTS:**  
   - Voice streaming does not connect to Deepgram Nova-2 or ElevenLabs streaming APIs. Browser speech recognition or text fallback handles input; synthesized speech uses browser Web Speech API or static base64 buffers.
4. **LLM Reasoning:**  
   - Responses in chat are generated by deterministic template selection in `mock_provider.py`. While empathetic and adherence-tested, it is not an autonomous frontier foundation model.

---

## 4. Architectural Inconsistencies & Duplication

- **Duplicate Type Definitions:** `MemoryRecord`, `LifeGraphNode`, and `LifeGraphEdge` are defined in `apps/api/app/domains/memory/schemas.py`, in `apps/web/lib/api-client.ts`, and separately in `apps/web/lib/prototype-service.ts` with subtle property naming mismatches (e.g. `is_tentative` vs `isTentative`, `emotional_charge` vs `emotionalCharge`).
- **Data Silo:** The journal entries recorded in `/journal` are inaccessible to the companion chat in `/companion/chat` because `/journal` writes to `localStorage` while `/companion/chat` queries FastAPI's in-memory session store.
