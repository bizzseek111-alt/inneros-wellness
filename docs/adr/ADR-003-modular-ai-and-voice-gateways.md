# ADR-003: Modular AI Provider Gateway & Replaceable Voice Pipeline

## Status
Accepted

## Context
AI model capabilities, pricing, latency, and geographic availability evolve rapidly. Tying InnerOS to a single commercial LLM or speech vendor creates existential vendor lock-in risk, regional compliance vulnerabilities, and single-point-of-failure exposure.

## Decision
We define abstract provider interfaces:
- `BaseAIProvider`: Common interface for chat completion, streaming, and embeddings.
- `BaseSTTProvider`: Common interface for streaming and batch speech-to-text.
- `BaseTTSProvider`: Common interface for text-to-speech synthesis.

Concrete adapters are implemented for:
- AI: Anthropic (Claude 3.5), OpenAI (GPT-4o), Google (Gemini 1.5), and Synthetic Mock.
- Voice STT: Deepgram, Whisper API, Synthetic Mock.
- Voice TTS: ElevenLabs, Cartesia, OpenAI TTS, Synthetic Mock.

### Fallback Cascade Architecture
The AI Gateway implements an automatic fallback cascade:
1. Primary Provider (e.g., Anthropic Claude for empathetic reasoning).
2. Secondary Provider (e.g., OpenAI GPT-4o or Gemini Flash) triggered if primary returns 5xx or exceeds latency threshold (2500ms).
3. Synthetic Fallback Provider for deterministic offline testing and emergency degraded mode.

## Consequences
- Requires unified prompt normalization and token counting across distinct model APIs.
- Eliminates single vendor dependency and ensures 100% offline development using synthetic mock providers.
