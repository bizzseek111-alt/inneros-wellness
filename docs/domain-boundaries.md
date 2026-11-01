# InnerOS: Domain Boundaries & Bounded Contexts

InnerOS applies Domain-Driven Design (DDD) principles to maintain strict separation of concerns, enforce data encapsulation, and guarantee that safety and consent policies cannot be bypassed.

---

## Domain Overview

```
                      +-------------------+
                      |   Safety Domain   | <--- Cross-cutting Guardrail
                      +-------------------+
                                ^
                                | (Validates Every Input/Output)
  +-------------+       +---------------+       +---------------+
  |  Companion  | <---> | Memory Engine | <---> |   Knowledge   |
  +-------------+       +---------------+       +---------------+
         ^                      ^                       ^
         |                      |                       |
  +-------------+       +---------------+       +---------------+
  |    Voice    |       | Integrations  |       |   Reminders   |
  +-------------+       +---------------+       +---------------+
         \                      |                      /
          +---------------------+---------------------+
                                v
                      +-------------------+
                      |   Admin & Audit   |
                      +-------------------+
```

---

## 1. Companion Domain (`domains/companion`)

### Purpose
Manages real-time conversational encounters, persona calibration, tone reflection, and multi-turn empathetic dialogue.

### Entities & Value Objects
- **`CompanionSession`**: Ephemeral interactive session with state, emotional baseline, and turn history.
- **`DialogueTurn`**: Immutable record of user utterance, companion response, sentiment shift, and safety token.
- **`ToneConfig`**: Calibration settings for companion voice (e.g., warmth, grounding, brevity, reflective inquiry).

### Hard Boundaries
- **Must NOT**: Provide psychiatric diagnosis, recommend medication, formulate formal treatment plans, or simulate romantic/codependent dependency.
- **Enforces**: Empathy within boundaries; transparently reminds the user of its AI nature when prompted.

---

## 2. Memory Domain (`domains/memory`)

### Purpose
Consent-governed personal memory formation, episodic recall, semantic indexing, and personal life graph navigation.

### Entities & Value Objects
- **`MemoryNode`**: Individual memory item with category (e.g., habit, relationship, value, project, emotional pattern).
- **`MemoryConsentLevel`**: Granular consent tag (`StrictlyPrivate`, `CompanionRecallable`, `Archived`, `Ephemeral`).
- **`LifeGraphEdge`**: Semantic link between nodes (e.g., `Person -> works_with -> User`, `StressTrigger -> mitigated_by -> MorningWalk`).
- **`VectorEmbedding`**: 1536-dim or 768-dim vector stored in pgvector.

### Hard Boundaries
- **Must NOT**: Retain memory items without explicit user consent or user review visibility.
- **Enforces**: Real-time user visibility in the "Memory Transparency Drawer" and instant 1-click deletion ("Forget Me" / GDPR Article 17).

---

## 3. Knowledge Domain (`domains/knowledge`)

### Purpose
Curates, verifies, and serves evidence-informed psychoeducation, cognitive reframing frameworks, somatic exercises, and verified mental wellbeing literature.

### Entities & Value Objects
- **`KnowledgeArticle`**: Peer-reviewed or expert-curated psychoeducation concept (CBT cognitive distortions, ACT acceptance defusion, sleep hygiene, polyvagal soothing).
- **`EvidenceCitation`**: Academic or literature citation backing educational concepts.
- **`PsychoeducationalExercise`**: Guided, interactive exercise (e.g., Box Breathing 4-4-4-4, 5-4-3-2-1 Sensory Grounding, Gratitude Inventory).

### Hard Boundaries
- **Must NOT**: Present psychoeducation as clinical psychotherapy.
- **Enforces**: Strict inclusion of literature citations and disclaimer that exercises are wellness aids, not clinical prescriptions.

---

## 4. Voice Domain (`domains/voice`)

### Purpose
Handles real-time audio ingest, speech-to-text (STT) transcription, Voice Activity Detection (VAD), and text-to-speech (TTS) synthesis.

### Entities & Value Objects
- **`AudioFrame`**: Raw PCM/Opus audio buffer with timestamp.
- **`VoiceProfile`**: Persona voice settings (pitch, cadence, multilingual locale, e.g., `en-US`, `es-ES`, `de-DE`, `ja-JP`).
- **`SpeechStream`**: Bidirectional async iterator for streaming audio.

### Hard Boundaries
- **Must NOT**: Persist raw user audio permanently unless explicit optional voice-note consent is granted.
- **Enforces**: Immediate memory cleanup of audio buffers post-transcription.

---

## 5. Reminders Domain (`domains/reminders`)

### Purpose
Manages mindful habit prompts, emotional check-in notifications, sleep preparation cues, and recurring wellbeing routines.

### Entities & Value Objects
- **`ReminderSchedule`**: Cron or time-offset specification with user timezone awareness.
- **`WellbeingPrompt`**: Context-aware reflection prompt (e.g., "Take three deep breaths before your 2 PM meeting").
- **`DeliveryChannel`**: Web Push, In-App Modal, Mobile OS notification.

### Hard Boundaries
- **Must NOT**: Spam the user or generate hyper-vigilant anxiety cues.
- **Enforces**: Frequency capping (max 3 unsolicited gentle prompts per day) and user do-not-disturb (DND) respect.

---

## 6. Integrations Domain (`domains/integrations`)

### Purpose
Ingests and normalizes user-provided personal data archives (ChatGPT conversations, Claude exports, calendar ICS files, health habits) under complete user control.

### Entities & Value Objects
- **`ImportBatch`**: Metadata tracking an imported file archive.
- **`SanitizedRecord`**: Anonymized, PII-scrubbed record extracted from external files.
- **`IngestionPipeline`**: Stepwise parser: Unzip -> Tokenize -> Scrub PII -> User Preview -> Selective Vectorization.

### Hard Boundaries
- **Must NOT**: Ingest third-party archives without explicit preview, selection, and confirmation by the user.
- **Enforces**: Local/client-side PII scrubbing prior to vector persistence.

---

## 7. Safety Domain (`domains/safety`)

### Purpose
The non-negotiable safety guardrail for all interactions. Classifies acute distress, suicidal ideation, abuse, medical queries, and routes immediately to human support resources.

### Entities & Value Objects
- **`SafetyEvaluation`**: Assessment with risk score (`None`, `MildDistress`, `ModerateRisk`, `AcuteCrisis`), category, and triggered triggers.
- **`CrisisResource`**: Verified emergency hotline/textline data categorized by ISO country code (e.g., US: 988, UK: 111/999, CA: 988, AU: 13 11 14, International: Befrienders Worldwide).
- **`DeEscalationPlan`**: Immediate compassionate, grounding script and crisis card payload.

### Hard Boundaries
- **Must NOT**: Attempt to "talk someone out of suicide" through prolonged AI dialogue or debate.
- **Enforces**: Immediate presentation of human emergency help, short empathetic grounding message, and session freeze if acute self-harm is imminent.

---

## 8. Admin & Audit Domain (`domains/admin`)

### Purpose
Provides zero-knowledge audit trails, tenant isolation controls, subscription status, and compliance reporting (GDPR, CCPA).

### Entities & Value Objects
- **`AuditEvent`**: Cryptographically verifiable event log (Timestamp, User UUID hash, Action Type, Policy Version).
- **`ConsentLedgerEntry`**: Immutable record of consent grants and revocations.
- **`TenantConfig`**: Multi-tenant or single-tenant configuration settings.

### Hard Boundaries
- **Must NOT**: Log raw conversation transcripts or decrypted personal memories in server log files.
