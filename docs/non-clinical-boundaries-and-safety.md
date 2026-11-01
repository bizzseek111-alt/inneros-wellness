# InnerOS: Non-Clinical Product Boundaries & Hard Safety Guardrails

## 1. Non-Clinical Position Statement

> [!IMPORTANT]
> **InnerOS is strictly an emotional wellbeing, habit reflection, and psychoeducation companion.**
> It is **NOT** a healthcare provider, does not offer clinical psychotherapy, does not diagnose medical or psychiatric conditions, and does not prescribe medication or emergency crisis intervention.

### Clear Product Scope
| Permitted in InnerOS | Prohibited in InnerOS |
| :--- | :--- |
| Active listening & empathetic validation | Diagnosing DSM-5 or ICD-11 disorders |
| Psychoeducation (explaining CBT defusion, sleep hygiene) | Delivering clinical psychotherapy treatment plans |
| Guided relaxation, breathwork & grounding | Advising on prescription psychiatric medications |
| Long-term habit tracking & personal growth reflection | Crisis counseling during active suicide attempts |
| Immediate handoff to qualified emergency hotlines | Replacing licensed human mental health care |

---

## 2. Regulatory Boundary Analysis (SaMD & Privacy)

### US FDA Guidance on Software as a Medical Device (SaMD)
InnerOS is engineered to qualify under the **FDA General Wellness Policy for Low Risk Devices** (21 CFR Part 882):
- InnerOS focuses exclusively on promoting a healthy lifestyle (stress management, mindfulness, habit tracking, educational literature).
- InnerOS makes **no disease claims** (e.g., does not claim to "cure Major Depressive Disorder" or "treat Generalized Anxiety Disorder").
- Claims are limited to: "Promotes mindful reflection", "Supports daily stress management", and "Fosters emotional self-awareness".

### EU Medical Device Regulation (MDR 2017/745)
- Does not process physiological diagnostic signals.
- Explicitly disclaimed as non-medical wellness software under EU MDR Annex VIII Rule 11.

---

## 3. Hard Safety Protocols & Red-Lines

InnerOS implements a **Two-Tier Safety Engine**:
1. **Tier 1 (Deterministic Heuristic Classifier)**: Instant, zero-latency regex and semantic token matching executed before any LLM inference.
2. **Tier 2 (Model-based Safety Guardrail)**: Secondary evaluation running in parallel with response generation.

```
Incoming Utterance
       |
       v
+-------------------------------+
| Tier 1: Deterministic Filter  |
+-------------------------------+
       |
       +---> [CRISIS DETECTED?] ---> YES ---> Freeze Session & Return Crisis Modal (988)
       |                                      (Zero LLM Risk)
       v NO
+-------------------------------+
| Context Assembly & LLM Call   |
+-------------------------------+
       |
       v
+-------------------------------+
| Tier 2: Output Guardrail      |
+-------------------------------+
       |
       +---> [MEDICAL ADVICE / DIAGNOSIS DETECTED?] ---> YES ---> Replace with Non-Clinical Fallback
       v NO
Emit Streaming Tokens to Client
```

### 3.1 Crisis Categories & Immediate Actions

| Category | Definition / Trigger Indicators | System Action |
| :--- | :--- | :--- |
| **Acute Suicidality / Self-Harm** | Expressing direct intent, plan, or means to end life or inflict self-harm | Instant session pause. Immediate display of regional emergency helpline (e.g., 988 in US/Canada, 111 in UK, Befrienders Worldwide). Empathetic static message. |
| **Violence / Harm to Others** | Threats of physical violence, domestic abuse, child endangerment | Discontinuation of encouragement. Warning and guidance towards human intervention. |
| **Medical / Prescription Queries** | Requests for drug dosages, tapering, clinical diagnoses | Clear boundary message: "I cannot provide medical advice. Please consult a qualified doctor or psychiatrist." |
| **Severe Dissociation / Psychosis** | Active hallucinations, paranoia, disoriented reality testing | Grounding sensory anchor (5-4-3-2-1 exercise) and immediate referral to human care. |

---

## 4. International Crisis Support Routing

The platform dynamically surfaces crisis helpline resources matched to the user's country code (or international fallbacks):

| Country / Region | Primary Phone Resource | Text / Chat Resource | URL |
| :--- | :--- | :--- | :--- |
| **United States & Canada** | `988` (Suicide & Crisis Lifeline) | Text `HOME` to `741741` | [988lifeline.org](https://988lifeline.org) |
| **United Kingdom** | `111` (NHS Mental Health) / `999` (Emergency) | Text `SHOUT` to `85258` | [giveusashout.org](https://giveusashout.org) |
| **Australia** | `13 11 14` (Lifeline) | Text `0477 13 11 14` | [lifeline.org.au](https://www.lifeline.org.au) |
| **International / Global** | Local emergency services | [befrienders.org](https://www.befrienders.org) | [findahelpline.com](https://findahelpline.com) |

---

## 5. Synthetic Development Data Guardrail

> [!CAUTION]
> **Zero Real Patient Data Rule**: Under no circumstances should real personal health information (PHI), real therapy notes, or identifying personal trauma records be used in tests, fixtures, or local databases.
> All development databases, automated tests, and demo seeds must utilize 100% synthetic, procedurally generated personas (e.g., Persona "Elena Vance", Persona "Marcus Chen").
