# InnerOS — Supabase PostgreSQL Production Migration Architecture & Roadmap

This technical specification details the complete engineering strategy for migrating the InnerOS Relational Persistence layer from the local development SQLite engine to **Supabase Managed PostgreSQL 15+** with Row-Level Security (RLS), connection pooling, and multi-tenant cryptographic isolation.

---

## 1. Architectural Overview & Separation of Concerns

```mermaid
flowchart TD
    Client[Next.js 14 Frontend / Mobile PWA] -->|HTTPS / WSS| FastAPI[FastAPI Core Backend]
    FastAPI -->|SQLAlchemy 2.0 ORM| ConnectionPool[Supavisor / PgBouncer Pool]
    ConnectionPool -->|Port 6543 / 5432| SupabasePG[(Supabase PostgreSQL 15+)]
    SupabasePG -->|Row Level Security| Tables[Users, Commerce, Sessions, Audits]
    
    subgraph ZeroKnowledge [Zero-Knowledge Isolation]
        Tables -.->|Encrypted At Rest| Vault[AES-256-GCM Personal Reflections]
        FastAPI -.->|HMAC SHA-256| AnonymizedLogs[Safety Circuit Breaker Logs]
    end
```

### Development vs Production Target

| Layer | Local Development (Current) | Production Staging (Target) |
| :--- | :--- | :--- |
| **Database Engine** | SQLite 3 (`inneros.db`) | Supabase PostgreSQL 15+ |
| **Connection Protocol** | Local POSIX file I/O | PostgreSQL TCP with SSL (`sslmode=require`) |
| **Connection Pooling** | Single-threaded NullPool | Supavisor (Port 6543 Transaction Mode) |
| **Multi-Tenancy Isolation** | Application-level filter & TenantID | PostgreSQL Native Row-Level Security (RLS) |
| **Vector Storage** | In-memory cosine similarity | PostgreSQL `pgvector` Extension |
| **Backups & DR** | `backup_restore.py` Point-in-Time CLI | Continuous WAL archiving + Daily automated snapshots |

---

## 2. Environment Configuration Matrix

To switch from local development to production Supabase, update the backend environment variables in `apps/api/.env`:

```bash
# Database Backend Connection
# Local Development:
# DATABASE_URL="sqlite:///./inneros.db"

# Production Supabase PostgreSQL (via Supavisor Transaction Pooler):
DATABASE_URL="postgresql+psycopg2://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require"

# Direct Connection (for Alembic migrations only):
DIRECT_DATABASE_URL="postgresql+psycopg2://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?sslmode=require"

# Supabase Auth & Storage Integration
SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 3. Migration Execution Procedure

### Step 1: Provision Supabase Infrastructure
1. Create a new Supabase organization and project in your chosen regulatory region (e.g., `eu-west-1` for GDPR or `us-east-1` for COPPA compliance).
2. Enable required extensions in the Supabase SQL editor:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE EXTENSION IF NOT EXISTS "pgcrypto";
   CREATE EXTENSION IF NOT EXISTS "vector";
   ```

### Step 2: Apply the Schema DDL and RLS Policies
Execute the supplied production schema script:
```bash
psql "$DIRECT_DATABASE_URL" -f docs/supabase_schema.sql
```

### Step 3: Data Migration (SQLite to PostgreSQL)
Use the automated data pipeline or `pgloader` utility to transfer records without downtime:
```bash
pgloader ./apps/api/inneros.db "$DIRECT_DATABASE_URL"
```

### Step 4: Validate Row-Level Security (RLS)
Verify that users cannot view records outside their family unit or account:
```sql
-- Test 1: Caregiver accessing their own child
SET ROLE authenticated;
SET request.jwt.claim.sub = 'usr_caregiver_demo';
SELECT * FROM public.users WHERE guardian_id = 'usr_caregiver_demo'; -- Returns child profiles

-- Test 2: Child cannot access another family's data
SET request.jwt.claim.sub = 'usr_child_zara';
SELECT * FROM public.subscriptions; -- Returns 0 rows (isolated)
```

---

## 4. Inviolable Security & Privacy Guarantees

1. **Non-Paywalled Crisis Guardrails**: Regardless of database tier or subscription state, `crisis_helplines` and fundamental emotional de-escalation tools are hardcoded to return `is_entitled = True`.
2. **Zero-Knowledge Chat Transcripts**: Youth companion conversations and audio recordings are processed in ephemeral streams and are never persisted in plain SQL text tables.
3. **Audit Trail Immutability**: All admin actions (such as order refunds, flag modifications, and role reassignments) append append-only records to `admin_audit_logs`.
