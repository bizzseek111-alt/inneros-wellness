# Supabase (PostgreSQL) Production Migration Guide

This document defines the complete, production-grade migration plan from the local development SQLite database to a cloud-hosted Supabase PostgreSQL instance for **InnerOS**.

---

## 1. PostgreSQL Relational Schema

Below is the production DDL matching all tables, columns, constraints, foreign keys, and indexes implemented in InnerOS.

```sql
-- Enable necessary PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. USERS & ROLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'user',
    locale VARCHAR(16) NOT NULL DEFAULT 'en-US',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_token_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- ============================================================================
-- 2. FAMILIES & PROFILES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.families (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    primary_caregiver_id VARCHAR(64) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.child_profiles (
    id VARCHAR(64) PRIMARY KEY,
    caregiver_id VARCHAR(64) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    family_id VARCHAR(64) REFERENCES public.families(id) ON DELETE SET NULL,
    display_name VARCHAR(255) NOT NULL,
    age_tier VARCHAR(32) NOT NULL, -- 'little', 'middle', 'junior', 'teen'
    locale VARCHAR(16) NOT NULL DEFAULT 'en-US',
    sensory_low_stimulation BOOLEAN NOT NULL DEFAULT FALSE,
    dyslexic_font BOOLEAN NOT NULL DEFAULT FALSE,
    high_contrast BOOLEAN NOT NULL DEFAULT FALSE,
    reduced_motion BOOLEAN NOT NULL DEFAULT FALSE,
    voice_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    daily_screen_time_limit_minutes INTEGER NOT NULL DEFAULT 45,
    curfew_bedtime VARCHAR(8) NOT NULL DEFAULT '20:30',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_child_profiles_caregiver ON public.child_profiles(caregiver_id);
CREATE INDEX IF NOT EXISTS idx_child_profiles_family ON public.child_profiles(family_id);

-- ============================================================================
-- 3. CONSENT & GOVERNANCE RECORDS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.consent_records (
    id VARCHAR(64) PRIMARY KEY,
    caregiver_id VARCHAR(64) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subject_id VARCHAR(64) NOT NULL,
    subject_type VARCHAR(32) NOT NULL, -- 'child', 'teen'
    consent_type VARCHAR(64) NOT NULL, -- 'coppa_verifiable_parental_consent', 'voice_recording', etc.
    policy_version VARCHAR(32) NOT NULL,
    is_granted BOOLEAN NOT NULL,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    revoked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_consent_records_subject ON public.consent_records(subject_id);
CREATE INDEX IF NOT EXISTS idx_consent_records_caregiver ON public.consent_records(caregiver_id);

-- ============================================================================
-- 4. COMMERCE: PRODUCTS, PRICES, ORDERS, SUBSCRIPTIONS, ENTITLEMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.commerce_products (
    id VARCHAR(64) PRIMARY KEY,
    service_type VARCHAR(64) NOT NULL, -- 'family_sub', 'school_license', 'voice_pack', 'content_pack'
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    target_audience VARCHAR(32) NOT NULL, -- 'adult', 'kids', 'teens', 'schools'
    eligibility VARCHAR(32) NOT NULL DEFAULT 'universal',
    feature_entitlements JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.commerce_prices (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL REFERENCES public.commerce_products(id) ON DELETE CASCADE,
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(8) NOT NULL DEFAULT 'USD',
    billing_interval VARCHAR(32) NOT NULL DEFAULT 'month', -- 'month', 'year', 'one_time'
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.commerce_orders (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL REFERENCES public.commerce_products(id),
    price_id VARCHAR(64) NOT NULL REFERENCES public.commerce_prices(id),
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(8) NOT NULL DEFAULT 'USD',
    status VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    payment_provider VARCHAR(32) NOT NULL DEFAULT 'mock_sandbox', -- 'stripe', 'mock_sandbox'
    provider_transaction_id VARCHAR(255),
    idempotency_key VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.commerce_subscriptions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    order_id VARCHAR(64) REFERENCES public.commerce_orders(id),
    product_id VARCHAR(64) NOT NULL REFERENCES public.commerce_products(id),
    price_id VARCHAR(64) NOT NULL REFERENCES public.commerce_prices(id),
    status VARCHAR(32) NOT NULL DEFAULT 'active', -- 'active', 'past_due', 'canceled'
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.commerce_entitlements (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    feature_key VARCHAR(64) NOT NULL,
    source_order_id VARCHAR(64) REFERENCES public.commerce_orders(id),
    source_subscription_id VARCHAR(64) REFERENCES public.commerce_subscriptions(id),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_entitlements_user_key ON public.commerce_entitlements(user_id, feature_key);

-- ============================================================================
-- 5. SUPPORT & SAFEGUARDING
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'billing', 'technical', 'curriculum', 'safeguarding'
    priority VARCHAR(32) NOT NULL DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    status VARCHAR(32) NOT NULL DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.safeguarding_cases (
    id VARCHAR(64) PRIMARY KEY,
    child_id VARCHAR(64) NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
    severity VARCHAR(32) NOT NULL, -- 'tier1_mild', 'tier2_moderate', 'tier3_urgent'
    summary TEXT NOT NULL,
    crisis_referral_sent BOOLEAN NOT NULL DEFAULT FALSE,
    assigned_clinician_id VARCHAR(64) REFERENCES public.users(id),
    status VARCHAR(32) NOT NULL DEFAULT 'open', -- 'open', 'under_review', 'resolved'
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ============================================================================
-- 6. AUDIT LOGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    actor_id VARCHAR(64) NOT NULL,
    actor_role VARCHAR(32) NOT NULL,
    action VARCHAR(128) NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(64) NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
```

---

## 2. Supabase Auth Integration Strategy

### Mapping Supabase Auth (`auth.users`) to `public.users`
1. When a user registers or logs in via Supabase Auth, a Postgres trigger synchronizes `auth.users` with `public.users`:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, hashed_password, display_name, role, locale, email_verified, created_at, updated_at)
  VALUES (
    new.id::text,
    new.email,
    'managed_by_supabase_auth',
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'user'),
    COALESCE(new.raw_user_meta_data->>'locale', 'en-US'),
    (new.email_confirmed_at IS NOT NULL),
    new.created_at,
    new.updated_at
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    email_verified = (new.email_confirmed_at IS NOT NULL),
    updated_at = timezone('utc', now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### Password Migration vs. Reset Strategy
- Existing local SQLite accounts use `argon2id`.
- Supabase Auth uses `bcrypt` internally.
- **Recommended Strategy**: 
  - To guarantee zero cryptographic compromise and comply with modern zero-trust standards, send an automated password-reset notification to existing accounts on first login (`auth.resetPasswordForEmail`).
  - Alternatively, if transparent migration is required, install the `pgcrypto` / custom Argon2 hash verifier hook in Supabase Auth to verify Argon2 on first login and silently upgrade the hash to Supabase's format.

### Session Handling via Supabase JWTs
- The FastAPI backend validates the JWT issued by Supabase (`Authorization: Bearer <supabase_access_token>`) using `PyJWT` with the Supabase JWT Secret (`SUPABASE_JWT_SECRET`).
- The JWT payload provides `sub` (User ID), `email`, and `user_metadata` (including `role`).
- The frontend Next.js middleware and API client forward the JWT in the `Authorization` header.

---

## 3. Row-Level Security (RLS) Policies

Enable Row-Level Security across all tables to enforce isolation at the database layer:

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commerce_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commerce_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commerce_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commerce_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commerce_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safeguarding_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
```

### 3.1 Public Read Tables (Services & Pricing)
```sql
-- Anyone (even unauthenticated) can read published products and active prices
CREATE POLICY "Public can view published products"
ON public.commerce_products FOR SELECT
USING (is_published = TRUE);

CREATE POLICY "Public can view active prices"
ON public.commerce_prices FOR SELECT
USING (is_active = TRUE);

-- Only admins can modify products and prices
CREATE POLICY "Admins can manage products"
ON public.commerce_products FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role') = 'admin' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can manage prices"
ON public.commerce_prices FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role') = 'admin' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
```

### 3.2 Caregiver / Family Isolation Policies
```sql
-- Caregivers can only select, insert, update, or delete their own child profiles
CREATE POLICY "Caregivers manage their children"
ON public.child_profiles FOR ALL
TO authenticated
USING (caregiver_id = auth.uid()::text OR (auth.jwt() ->> 'role') = 'admin')
WITH CHECK (caregiver_id = auth.uid()::text);

-- Caregivers can only view and grant consent for their own children
CREATE POLICY "Caregivers manage consent"
ON public.consent_records FOR ALL
TO authenticated
USING (caregiver_id = auth.uid()::text OR (auth.jwt() ->> 'role') = 'admin')
WITH CHECK (caregiver_id = auth.uid()::text);

-- Users can only view their own orders, invoices, and entitlements
CREATE POLICY "Users view their own orders"
ON public.commerce_orders FOR SELECT
TO authenticated
USING (user_id = auth.uid()::text OR (auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Users view their own subscriptions"
ON public.commerce_subscriptions FOR SELECT
TO authenticated
USING (user_id = auth.uid()::text OR (auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Users view their own entitlements"
ON public.commerce_entitlements FOR SELECT
TO authenticated
USING (user_id = auth.uid()::text OR (auth.jwt() ->> 'role') = 'admin');

-- Support tickets isolated to owner
CREATE POLICY "Users view and submit their own support tickets"
ON public.support_tickets FOR ALL
TO authenticated
USING (user_id = auth.uid()::text OR (auth.jwt() ->> 'role') IN ('admin', 'support'))
WITH CHECK (user_id = auth.uid()::text);
```

### 3.3 Strict Administrative and Safeguarding Isolation
```sql
-- Safeguarding cases restricted to safeguarding clinicians and administrators
CREATE POLICY "Safeguarding restricted to clinical staff"
ON public.safeguarding_cases FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'role') IN ('safeguarding_clinician', 'admin') OR
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('safeguarding_clinician', 'admin')
);

-- Audit logs strictly appendable and viewable only by admins
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (
  (auth.jwt() ->> 'role') = 'admin' OR
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);
```

---

## 4. File Storage Strategy

### Buckets Configuration
1. **`avatars`** (Public):
   - Stores user and child profile avatar icons.
   - Max file size: 2MB. MIME types: `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml`.
2. **`activity-assets`** (Public):
   - Educational illustrations, flashcards, visual schedule symbols.
   - Cached globally via Supabase CDN.
3. **`child-voice-recordings`** (Private & Encrypted):
   - Ephemeral child voice practice and check-in audio.
   - Strictly private. Zero public access.
   - Access is restricted exclusively via Time-Limited Signed URLs (valid for max 5 minutes).
   - Subject to automated 30-day retention purge script.

### Signed URL Access Flow for Child Audio
```typescript
// Backend or authorized caregiver client fetches time-limited signed URL
const { data, error } = await supabase.storage
  .from('child-voice-recordings')
  .createSignedUrl(`audio/${childId}/${turnId}.mp3`, 300); // 300 seconds expiry
```

---

## 5. Environment Variable Changes

Update `.env.production` in `apps/api` and `apps/web`:

### Backend (`apps/api/.env`)
```bash
# Database
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Supabase Auth & JWT
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_KEY=[YOUR-SUPABASE-SERVICE-ROLE-KEY]
SUPABASE_JWT_SECRET=[YOUR-SUPABASE-JWT-SECRET]

# Storage
SUPABASE_STORAGE_BUCKET_VOICE=child-voice-recordings
SUPABASE_STORAGE_BUCKET_ASSETS=activity-assets
```

### Frontend (`apps/web/.env.local`)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-SUPABASE-ANON-KEY]
NEXT_PUBLIC_API_URL=https://api.inneros.com
```

---

## 6. Migration Script (SQLite to Supabase PostgreSQL)

A dedicated script `scripts/migrate_sqlite_to_supabase.py` handles the data extraction and load:

```python
"""Extracts data from local SQLite database and loads into Supabase PostgreSQL."""
import sqlite3
import psycopg2
import json

SQLITE_PATH = "apps/api/inneros.db"
PG_CONN_STR = "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

def migrate():
    s_conn = sqlite3.connect(SQLITE_PATH)
    s_conn.row_factory = sqlite3.Row
    s_cur = s_conn.cursor()

    p_conn = psycopg2.connect(PG_CONN_STR)
    p_cur = p_conn.cursor()

    tables = [
        "users", "families", "child_profiles", "consent_records",
        "commerce_products", "commerce_prices", "commerce_orders",
        "commerce_subscriptions", "commerce_entitlements",
        "support_tickets", "safeguarding_cases", "audit_logs"
    ]

    for table in tables:
        print(f"Migrating {table}...")
        s_cur.execute(f"SELECT * FROM {table}")
        rows = s_cur.fetchall()
        if not rows:
            continue

        columns = rows[0].keys()
        col_names = ", ".join(columns)
        placeholders = ", ".join(["%s"] * len(columns))
        insert_query = f"INSERT INTO {table} ({col_names}) VALUES ({placeholders}) ON CONFLICT DO NOTHING"

        for row in rows:
            values = []
            for col in columns:
                val = row[col]
                if isinstance(val, str) and (val.startswith("[") or val.startswith("{")):
                    try:
                        val = json.dumps(json.loads(val))
                    except Exception:
                        pass
                values.append(val)
            p_cur.execute(insert_query, values)

        p_conn.commit()
        print(f"Successfully migrated {len(rows)} rows for {table}.")

    s_conn.close()
    p_conn.close()

if __name__ == "__main__":
    migrate()
```

---

## 7. Post-Migration Verification Checklist

- [ ] **DDL & Constraints**: Verify all 12 tables exist with foreign keys, checks, and unique constraints active.
- [ ] **RLS Enforcement**:
  - [ ] Anonymous user queries on `child_profiles` return empty/forbidden.
  - [ ] Caregiver A cannot view Child B from another family.
  - [ ] Non-admin user cannot access `admin_logs` or `safeguarding_cases`.
- [ ] **Auth Synchronization**: Verify `handle_new_user()` trigger correctly mirrors new signups into `public.users`.
- [ ] **Purchases & Entitlements**: Verify sandbox checkout inserts order, creates entitlement, and grants access.
- [ ] **Storage Security**: Confirm child audio bucket is non-public and rejects direct unauthenticated access.
- [ ] **Voice Synthesis & AI**: Test multilingual voice companion endpoints against Supabase PostgreSQL.

---

## 8. Rollback Strategy

If critical migration anomalies occur during production cutover:
1. **Instant DNS / App Traffic Reversion**: Revert API traffic to the staging/backup SQLite instance.
2. **Database Snapshot**: SQLite database file (`inneros.db`) is snapshot-backed and preserved prior to cutover.
3. **Dual-Write Pause**: Disable database write-forwarding to PostgreSQL by restoring `DATABASE_URL=sqlite:///./inneros.db`.
4. **Log Reconciliation**: Replay missing transactions from `audit_logs` created during cutover window.
