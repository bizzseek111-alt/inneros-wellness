# InnerOS

> **A global, AI-powered personal emotional wellbeing and life companion platform.**
> Designed as an evidence-informed, consent-governed sanctuary for emotional clarity, mindful reflection, and personal growth.

---

> [!IMPORTANT]
> **NON-CLINICAL PRODUCT BOUNDARY**:
> InnerOS is **strictly an emotional wellbeing, habit reflection, and psychoeducation companion**.
> It is **NOT** a healthcare provider, does not offer clinical psychotherapy, does not diagnose medical or psychiatric conditions, and does not prescribe medication or emergency crisis intervention.
> In situations of acute distress or self-harm ideation, deterministic circuit breakers immediately freeze generative AI and present verified human crisis resources (US/CA: 988, UK: 111, International: Befrienders Worldwide).

---

## Architecture Overview

InnerOS adopts a modern polyglot monorepo architecture:

- **`apps/web`**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Motion + shadcn-style sanctuary UI components.
- **`apps/api`**: High-performance Python FastAPI backend partitioned into 8 Domain-Driven Design (DDD) bounded contexts.
- **`docs/`**: Comprehensive system architecture, ADRs, security & privacy analysis, and safety policies.
- **`scripts/`**: Developer automation and synthetic test suite runners.

### Bounded Domain Services (`apps/api/app/domains/`)
1. **Safety Domain**: Deterministic Tier 1 heuristic classification, crisis de-escalation, and regional emergency routing.
2. **Companion Domain**: Multimodal conversational turn management, tone calibration (Grounding, Warm, Concise, Inquisitive), and empathy boundaries.
3. **Memory Domain**: Consent-gated personal memory formation, life graph connections, and GDPR Article 17 "Forget Me" deletion.
4. **Knowledge Domain**: Curated evidence-informed psychoeducation library (ACT Cognitive Defusion, Polyvagal Theory, Sleep Architecture) and somatic exercises (4-4-4-4 Box Breathing).
5. **Voice Domain**: Replaceable streaming Speech-to-Text (STT) and Text-to-Speech (TTS) pipeline.
6. **Reminders Domain**: Mindful habit loops, circadian prompts, and timezone-aware schedules.
7. **Integrations Domain**: User-controlled archive ingestion (ChatGPT/Claude exports, Calendar) with client-side PII scrubbing.
8. **Admin Domain**: Tenant Row-Level Security (RLS) status, zero-PII audit logging, and GDPR Article 15 compliance export.

---

## Security & Privacy: Sanctuary Computing

- **Two-Tier Envelope Encryption**: Master KMS Key + User Salt $\to$ HKDF-SHA256 $\to$ per-user Data Encryption Key (DEK) $\to$ AES-256-GCM encryption for all personal notes.
- **Zero-PII Logging**: Server logs redact emotional messages, journal bodies, and voice buffers from standard log outputs.
- **User Agency**: 1-click memory inspection and deletion directly in the user-facing "Memory Transparency Drawer".
- **Synthetic Development Only**: 100% synthetic development data (Persona *Elena Vance*); zero real patient health information (PHI) is ever used.

---

## Quickstart Guide

### Prerequisites
- Node.js $\ge 18$ and `pnpm`
- Python $\ge 3.10$ and `uv` (recommended) or `python3 -m venv`

### 1. Clone & Configure Environment
```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

### 2. Start Both Web and API (Development Mode)
```bash
make dev
```
- Web Application: [http://localhost:3000](http://localhost:3000)
- FastAPI Swagger Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- API Liveness Probe: [http://localhost:8000/health](http://localhost:8000/health)
- API Readiness Probe: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

Alternatively, run each service independently:
```bash
# Start FastAPI backend
make dev-api

# Start Next.js web application
make dev-web
```

---

## Testing & Quality Assurance

### Run All Backend and Frontend Tests
```bash
make test
```

### Run Backend Pytest Suite
```bash
make test-api
```
Includes:
- Health probe liveness and readiness tests
- Safety guardrail deterministic suicide crisis classification
- Medical advice disclaimer enforcement
- Consent-gated memory storage and GDPR Article 17 deletion
- Envelope encryption and key isolation tests
- Knowledge, voice, reminders, integrations, and admin tests

---

## Architecture Decision Records (ADRs)

Detailed records of engineering choices are documented in `docs/adr/`:
- [ADR-001: Monorepo with Next.js App Router and FastAPI](docs/adr/ADR-001-monorepo-nextjs-fastapi.md)
- [ADR-002: PostgreSQL with pgvector for Hybrid Memory](docs/adr/ADR-002-pgvector-hybrid-memory.md)
- [ADR-003: Modular AI Provider Gateway & Voice Pipeline](docs/adr/ADR-003-modular-ai-and-voice-gateways.md)
- [ADR-004: Consent-First Audit & Envelope Encryption](docs/adr/ADR-004-consent-first-audit-envelope-encryption.md)
- [ADR-005: Non-Clinical Safety Guardrails & Crisis Escalation Protocol](docs/adr/ADR-005-non-clinical-safety-crisis-protocol.md)

---

## Implementation Milestones & Roadmap

- **Milestone 0 (Current)**: Foundation architecture, non-clinical safety guardrails, domain bounded contexts, working application skeleton, and synthetic test suites.
- **Milestone 1**: Real-time WebRTC audio streaming, Voice Activity Detection (VAD), and streaming TTS playback.
- **Milestone 2**: PostgreSQL 16 + pgvector production deployment with HNSW indexing and life graph edge navigation.
- **Milestone 3**: Book knowledge RAG engine with DOI citations and expanded somatic breathwork library.
- **Milestone 4**: Background cron workers for gentle proactive reminders and ChatGPT/Claude export parsers.
- **Milestone 5**: Optional certified human professional care circles and SOC 2 Type II compliance.

---

## Known Limitations of Initial Release Skeleton
1. **AI Providers**: Runs in `synthetic` mode by default using offline deterministic fixtures; production LLM connectors (Claude, GPT-4o, Gemini) are pluggable via `app/gateways/ai/gateway.py`.
2. **Audio Streaming**: Initial skeleton delivers simulated base64 audio frames; full WebRTC bidirectional media streaming pipeline is scheduled for Milestone 1.
3. **Database**: In-memory repository with synthetic fixtures utilized for local skeleton verification; production requires PostgreSQL 16 + `pgvector` container as detailed in [ADR-002](docs/adr/ADR-002-pgvector-hybrid-memory.md).
