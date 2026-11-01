# ADR-002: PostgreSQL with pgvector for Hybrid Relational & Vector Memory

## Status
Accepted

## Context
InnerOS manages both structured relational data (users, auth sessions, consent settings, reminder crons, audit events) and high-dimensional semantic embeddings (personal memory facts, life graph connections, psychoeducational literature citations).

Options considered:
1. Dedicated vector database (Pinecone, Qdrant, Weaviate) + Relational database (Postgres)
2. Single unified storage engine: PostgreSQL 16 with the `pgvector` extension

## Decision
We select **PostgreSQL 16 with `pgvector`** as the single primary data store for both relational records and semantic vector representations.

### Rationale
- **Atomic Transactions (ACID)**: When a user deletes a memory or exercises their GDPR "Right to be Forgotten", the relational record, graph edges, and vector embedding are pruned in a single atomic transaction. In dual-database setups, partial deletions risk orphan vectors remaining searchable.
- **Unified Row-Level Security (RLS)**: PostgreSQL native RLS guarantees that vector similarity queries (`<=>` cosine distance) are automatically restricted to the authenticated user's tenant scope.
- **Operational Simplicity**: Eliminates synchronization lag, dual-database consistency issues, and redundant infrastructure overhead.
- **HNSW Indexing**: `pgvector` supports Hierarchical Navigable Small World (HNSW) graph indexing, providing sub-10ms recall latency for high-dimensional vectors.

## Consequences
- Requires PostgreSQL hosting with `pgvector` enabled (standard on Supabase, AWS Aurora, GCP Cloud SQL, Neon, or self-hosted Docker).
- Heavy vector workloads must be monitored for memory cache sizing (`shared_buffers` / `work_mem`).
