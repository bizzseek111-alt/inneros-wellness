# InnerOS: Product & Engineering Milestones

```
Phase 0: Foundation & Safety        Phase 1: Realtime Voice MVP       Phase 2: Life Graph & Memory
[ COMPLETED / CURRENT ] ---------> [ Target: Milestone 1 ] --------> [ Target: Milestone 2 ]
- Repo structure & CI               - Multimodal Audio Streaming       - pgvector Hybrid Indexing
- Non-clinical safety engine        - Turn-taking & VAD                - Consent-governed recall
- ADRs & architecture docs          - Tone calibration UI              - "Forget Me" Article 17
- Working skeleton & tests          - Regional hotline hand-off        - Life graph edge navigation
                                                                                    |
                                                                                    v
Phase 5: Human Professional Circle  Phase 4: Integrations & Jobs      Phase 3: Knowledge Library RAG
[ Target: Milestone 5 ] <--------- [ Target: Milestone 4 ] <--------- [ Target: Milestone 3 ]
- Certified therapist handoff       - ChatGPT/Claude export ingest     - CBT / ACT / DBT database
- Supervised consent sharing        - Background cron reminders        - Clinical evidence citations
- HIPAA/GDPR clinical firewall      - Calendar context enrichment      - Interactive breathwork UI
```

---

## Milestone 0: Foundation, Architecture & Safety Rails (Current)
- [x] Technical architecture specification & bounded context definitions.
- [x] Architecture Decision Records (ADR 001 - ADR 005).
- [x] Monorepo structure (`apps/web` + `apps/api` + `docs` + `scripts`).
- [x] Non-clinical safety guardrails & regional crisis hotline dispatch engine.
- [x] Synthetic-only development dataset and mock providers.
- [x] Working application skeleton with Next.js frontend, FastAPI backend, and health checks.
- [x] Unit test infrastructure, linting configurations, and CI workflow.

## Milestone 1: Voice & Companion Interactive Engine
- Multimodal WebRTC / WebSocket audio streaming pipeline.
- Streaming Speech-to-Text (Deepgram / Whisper) and Voice Activity Detection (VAD).
- Streaming Text-to-Speech (ElevenLabs / Cartesia / Web Speech fallback).
- Real-time emotional resonance visualizer using Motion.
- Companion personality tone slider (Grounding, Inquisitive, Gentle, Concise).

## Milestone 2: Consent-Governed Memory & Life Graph
- Full PostgreSQL 16 + pgvector implementation with HNSW indexing.
- Asynchronous insight extractor with strict user consent verification.
- Interactive "Memory & Transparency Drawer" allowing users to inspect and revoke stored facts.
- Life graph visualization: relationships, habits, stressors, values.
- Envelope encryption implementation with KMS-backed key derivation.

## Milestone 3: Evidence-Informed Psychoeducation Library
- Searchable library of verified wellbeing techniques (ACT defusion, CBT cognitive restructuring, Polyvagal theory).
- Evidence citation engine with DOI references.
- Interactive somatic exercises (4-7-8 breathing timer, 5-4-3-2-1 grounding guide).
- Mood journaling with daily/weekly emotional resonance trends.

## Milestone 4: Integrations & Background Wellness Engine
- User archive ingestion engine (ChatGPT JSON export, Claude HTML export).
- Client-side PII scrubbing prior to ingestion.
- Background worker for proactive gentle reminders, sleep cues, and weekly reflection summaries.
- Calendar sync for contextual wellbeing support.

## Milestone 5: Professional Care Circle & Global Compliance
- Optional, user-consented export package for licensed therapists / physicians.
- Human-in-the-loop escalation pathway.
- SOC 2 Type II compliance audit and HIPAA compliance validation for clinical partner hand-offs.
