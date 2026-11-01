# ADR-001: Monorepo Architecture with Next.js App Router and Python FastAPI

## Status
Accepted

## Context
InnerOS requires a seamless, high-performance user experience for real-time emotional reflection, multimodal audio interaction, and responsive visualizations, coupled with an AI engineering backend capable of running data pipelines, vector operations, and safety classifiers.

Options considered:
1. Pure TypeScript (Next.js frontend + Node.js backend)
2. Polyglot Monorepo (Next.js App Router frontend + Python FastAPI backend)
3. Separate Repositories

## Decision
We adopt a **Polyglot Monorepo** organized as:
- `apps/web`: Next.js 14/15 with App Router, TypeScript, Tailwind CSS, Motion, and shadcn/ui.
- `apps/api`: Python FastAPI backend.
- `docs/`: Shared architectural specifications and ADRs.
- `scripts/`: Unified developer automation.

### Rationale
- **Next.js with App Router**: Delivers world-class web performance, SSR, progressive enhancement, and first-class animation capabilities with Motion.
- **Python FastAPI**: Python remains the premier ecosystem for AI gateways, vector manipulation (pgvector, NumPy, LangChain/LlamaIndex primitives), scientific psychoeducation text analysis, and real-time async streaming. FastAPI offers native async, Pydantic type validation, and automatic OpenAPI generation.
- **Monorepo**: Keeps data contracts, API schemas, design systems, and documentation synchronized in a single cohesive repository.

## Consequences
- Requires polyglot local tooling (`pnpm` + `uv` / Python virtual environment).
- Unified CI workflow must test both TypeScript and Python pipelines.
