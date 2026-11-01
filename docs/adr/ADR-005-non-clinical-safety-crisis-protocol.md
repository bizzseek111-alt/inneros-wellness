# ADR-005: Non-Clinical Safety Guardrails & Crisis Escalation Protocol

## Status
Accepted

## Context
InnerOS serves as an emotional wellbeing companion, but individuals experiencing acute crisis (active suicidal ideation, self-harm, psychosis, medical emergency) may turn to digital interfaces. InnerOS must have deterministic, unbypassable safety protocols to protect vulnerable users and direct them immediately to human professional help.

## Decision
1. **Deterministic Pre-Execution Safety Filter**:
   - Evaluates incoming prompts using curated heuristic regexes and semantic classifiers before any LLM inference occurs.
   - If an acute crisis is detected, LLM generation is completely bypassed.
2. **Immediate Regional Resource Dispatch**:
   - The platform surfaces dedicated, verified crisis telephone and text resources (US/CA: 988, UK: 111/999/85258, AU: 13 11 14, International: Befrienders Worldwide).
3. **Compassionate Grounding Response**:
   - Returns a pre-approved, clinically reviewed de-escalation message that validates feelings without attempting psychotherapy or arguing against suicidal intent.
4. **Post-Execution Medical Advice Filter**:
   - Output guardrail scans for diagnostic language (DSM-5 assertions) or prescription medication advice, replacing infringing outputs with educational disclaimers.

## Consequences
- Zero hallucination risk during critical safety events because Tier 1 bypasses the generative LLM.
- Clear legal and regulatory distinction establishing InnerOS as a non-clinical wellness companion under FDA and EU MDR regulations.
