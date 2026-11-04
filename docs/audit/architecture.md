# Weebly Platform V8 — Unified Architecture & System Design

```
+-----------------------------------------------------------------------------------+
|                                  WEEBLY PLATFORM                                   |
|                                                                                   |
|  [ Public Marketing & Trust ]         [ Child Magic Experience ]                  |
|  - Next.js 14 App Router              - Simplified 3-Action UI (Home, Talk, Play) |
|  - Tailwind CSS + Tokens              - 4 AI Friends (Kai, Mia, Lumi, Zayn)       |
|  - 10 Govt Briefing Documents         - 6 Global Learning Worlds                  |
|                                                                                   |
|  [ Family & School Portals ]          [ Unified Conversation Engine ]             |
|  - Parent Center (/parent)            - Turn Orchestrator (/api/youth/friends/turn)|
|  - Teacher Studio (/teacher/dashboard)- Multi-engine Voice Synthesizer            |
|  - School Portal (/school/portal)     - Trilingual Prompt Matrix (EN, UR, PA)     |
|  - Professional Portal                - Safeguarding Classifier & Calming Voice   |
+-----------------------------------------+-----------------------------------------+
                                          |
                      REST / JSON API     |     Secure Bearer Auth
                                          v
+-----------------------------------------------------------------------------------+
|                           WEEBLY FASTAPI BACKEND SERVICES                         |
|                                                                                   |
|  [ Relational Question Bank (3,000) ]      [ Safeguarding & Emergency Dispatch ]  |
|  - 10 Subject Categorizations              - Punjab CPWB 1121 Direct Gateway      |
|  - Blooms Taxonomy Scaffolding             - Caregiver Harm Protocol Exception    |
|  - SQLite / PostgreSQL Persistence         - Audit Logging & Incident Ledger      |
|                                                                                   |
|  [ School Cohort & Teacher Studio ]        [ PWA Offline Sync Manager ]           |
|  - PCTB SLO Alignment Index                - Service Worker Pre-cache (sw.js)     |
|  - Engagement Aggregation Engine           - IndexedDB Milestone Outbox Queue     |
+-----------------------------------------------------------------------------------+
                                          |
                   Physical & Logical Separation Boundary
                                          v
+-----------------------------------------------------------------------------------+
|                        ISOLATED INNEROS ADULT SANCTUARY                           |
|                                                                                   |
|  - Dedicated Namespace: /inneros/* and /dashboard role-gated bridge               |
|  - Adult Emotional Grounding, Somatic Reflection & Private Growth Goals           |
|  - Separate Database Tables & Zero Data Indexing with Child Contexts              |
+-----------------------------------------------------------------------------------+
```

## 1. Key Architectural Invariants
1. **Total Isolation of Adult InnerOS**: Child learning sessions are strictly segregated from adult personal wellbeing records.
2. **Deterministic Safeguarding Pipeline**: Inbound student text and voice transcriptions pass through strict safeguarding regexes and keyword categorizers before generating responses.
3. **Multi-tier Voice Fallback**: Real-time voice uses Web Speech API client synthesis first, cascading gracefully to serverless TTS and visual subtitles.
4. **App-like PWA Hardening**: Service worker excludes all dynamic `/api/*` endpoints from disk caching to ensure zero retention of child voice data.\n