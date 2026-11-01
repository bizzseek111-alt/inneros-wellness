# InnerOS: System Architecture

## 1. Executive Summary & Vision

**InnerOS** is a global, AI-powered personal emotional wellbeing and life companion platform designed to help individuals build emotional clarity, cultivate healthy habits, reflect on personal growth, and navigate life's complexities through evidence-informed companionship, multimodal voice/text interaction, and a consent-based personal memory graph.

### Core Non-Negotiable Boundary
InnerOS is **not** an autonomous licensed psychologist, clinical diagnosis tool, psychiatric emergency responder, or medical software (FDA SaMD / EU MDR). It is an **educational, reflective, and supportive lifestyle companion** operating strictly within non-clinical bounds.

---

## 2. High-Level System Architecture

InnerOS adopts a modern modular architecture separating user experience presentation from high-performance, safety-gated backend domain processing.

```
+-----------------------------------------------------------------------------------+
|                                Client Layer                                       |
|  +-----------------------------------------------------------------------------+  |
|  | Next.js App Router (TypeScript, Tailwind CSS, Motion, shadcn/ui components) |  |
|  | - Multimodal Companion Interface (Voice Audio Stream + Realtime Text)      |  |
|  | - Emotion Check-in & Resonance Visualizer (Generative UI)                  |  |
|  | - Personal Memory & Consent Transparency Drawer                             |  |
|  | - Psychoeducation & Book Knowledge Library Explorer                         |  |
|  | - Crisis & Immediate Support Safety Banner (988 / Befrienders)             |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------|-----------------------------------------+
                                          | HTTPS / WSS / SSE
                                          v
+-----------------------------------------------------------------------------------+
|                            API Gateway & Ingress Layer                            |
|  +-----------------------------------------------------------------------------+  |
|  | FastAPI Core Application (Python 3.11+)                                     |  |
|  | - Zero-PII Structured Audit Logging & OpenTelemetry Tracing                |  |
|  | - Security Middleware (Tenant Isolation, Scoped JWT, Rate Limiting)        |  |
|  | - Safety Red-Line Interceptor (Pre-Execution & Post-Execution Evaluators)   |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------|-----------------------------------------+
                                          | Internal Domain Dispatcher
                                          v
+-----------------------------------------------------------------------------------+
|                              Bounded Domain Services                              |
|  +----------------+  +----------------+  +----------------+  +----------------+   |
|  | Companion      |  | Memory Engine  |  | Knowledge      |  | Voice Pipeline |   |
|  | - Persona Mgr  |  | - Episodic/Sem |  | - Psychoeduc.  |  | - VAD / STT    |   |
|  | - Dialogue     |  | - Life Graph   |  | - Evidence RAG |  | - Streaming TTS|   |
|  | - Empathy Guard|  | - Consent Tag  |  | - Citation Gen |  | - Audio Buffer |   |
|  +----------------+  +----------------+  +----------------+  +----------------+   |
|  +----------------+  +----------------+  +----------------+  +----------------+   |
|  | Reminders      |  | Integrations   |  | Safety Engine  |  | Admin & Audit  |   |
|  | - Cron / Alarm |  | - Export Parser|  | - Crisis Rules |  | - Audit Trail  |   |
|  | - Habit Triggers| | - PII Scrubber |  | - Hotline Router| | - GDPR Forget  |   |
|  | - Timezone Sync|  | - Ingestion Bus|  | - Circuit Brek |  | - Tenant Mgmt  |   |
|  +----------------+  +----------------+  +----------------+  +----------------+   |
+-----------------------------------------|-----------------------------------------+
                                          |
             +----------------------------+----------------------------+
             |                                                         |
             v                                                         v
+------------------------------------------+  +-------------------------------------+
|         Modular Provider Gateways        |  |            Storage Layer            |
| +--------------------------------------+ |  | +---------------------------------+ |
| | AI Provider Gateway                  | |  | | PostgreSQL 16 + pgvector        | |
| | - Fallback: Claude / GPT / Gemini    | |  | | - Relational Entities (Users,   | |
| | - Local LLM / Synthetic Mock Engine  | |  | |   Sessions, Reminders, Audits)  | |
| +--------------------------------------+ |  | | - pgvector: Semantic Memory &   | |
| +--------------------------------------+ |  | |   Psychoeducation Embeddings    | |
| | Voice Gateway (Replaceable)          | |  | | - Life Graph (Edge Adjacency)   | |
| | - STT: Deepgram, Whisper, Local Mock | |  | +---------------------------------+ |
| | - TTS: ElevenLabs, Cartesia, Mock    | |  | | Envelope Encryption Key Deriv.  | |
| +--------------------------------------+ |  | | User-level HKDF & Encrypted BLOB| |
+------------------------------------------+  +-------------------------------------+
```

---

## 3. End-to-End Data Flows

### 3.1 Real-Time Companion Chat Flow
1. **User Input**: Client sends text or streaming audio chunk to `/api/v1/companion/chat`.
2. **Audio Decoding (if voice)**: Voice Gateway converts audio stream to normalized text via Whisper / Deepgram interface.
3. **Safety Pre-Filter**: Safety Domain evaluates input against deterministic crisis heuristics and classified distress patterns.
   - *If crisis flagged (e.g. self-harm risk)*: Execution halts immediately. The engine returns structured crisis resources (988 Lifeline, Crisis Text Line), empathy de-escalation response, and logs an anonymized safety event.
4. **Context & Memory Assembly**:
   - Checks user consent configuration (`allow_memory_lookup = True`).
   - Retrieves active conversation buffer (working memory).
   - Queries `pgvector` for top-$K$ cosine similarity relevant episodic memories within user scope.
   - Queries Knowledge Domain for evidence-informed educational frameworks (CBT defusion, sleep hygiene, polyvagal soothing).
5. **LLM Orchestration**: Formulates system prompt with strict non-clinical boundaries, tone guidelines, and assembled context. Invokes Modular AI Gateway.
6. **Safety Post-Filter**: Inspects generated output to ensure no medical advice, medication recommendation, or diagnostic assertion is present.
7. **Streaming Response**: Transmits response stream via Server-Sent Events (SSE) or WebSocket. If voice is enabled, synthesizes speech chunks concurrently.
8. **Memory Induction**: Asynchronously extracts salient, consent-permitted personal insights and stores them in vector/graph storage.

---

## 4. Key Subsystem Specifications

### 4.1 Modular AI Provider Gateway
- Pluggable provider interface (`BaseAIProvider`) with concrete implementations:
  - `AnthropicProvider` (Claude 3.5 Sonnet / Haiku for reflective dialogue)
  - `OpenAIProvider` (GPT-4o / GPT-4o-mini)
  - `GoogleGeminiProvider` (Gemini 1.5 Pro / Flash)
  - `SyntheticMockProvider` (Deterministic, zero-cost, offline development & CI testing)
- Automatic fallback cascade with circuit breakers.

### 4.2 Replaceable Multilingual Voice Gateway
- `BaseSTTProvider` (Speech-to-Text): Whisper API, Deepgram Nova-2, Mock.
- `BaseTTSProvider` (Text-to-Speech): ElevenLabs, Cartesia, OpenAI TTS, Web Speech API fallback.
- Bidirectional streaming support with voice activity detection (VAD).

### 4.3 Storage & Retrieval Architecture
- **PostgreSQL 16**: Relational storage for tenants, user profiles, sessions, consent preferences, reminder schedules, and audit records.
- **pgvector (HNSW Index)**: Fast vector search for memory recall and knowledge retrieval.
- **Envelope Encryption**: Sensitive journal records, personal memory facts, and integration exports encrypted with per-user derived keys (`HKDF-SHA256`).

---

## 5. Non-Functional Requirements (NFRs)

| Attribute | Specification | Implementation Strategy |
| :--- | :--- | :--- |
| **P95 Latency (Text)** | < 800 ms to first token | Fast streaming SSE, optimized local context assembly |
| **P95 Latency (Voice)** | < 1200 ms end-to-end | Streaming STT + concurrent TTS sentence chunking |
| **Zero-Knowledge Privacy** | Per-user envelope encryption | Master KMS key + User Salt + PBKDF2/HKDF |
| **Availability** | 99.9% uptime | Stateless container pods, multi-AZ database clustering |
| **Auditability** | 100% consent & safety logging | Append-only audit ledger without logging raw PII/journals |
