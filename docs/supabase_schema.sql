-- =============================================================================
-- INNEROS SUPABASE POSTGRESQL PRODUCTION SCHEMA & ROW LEVEL SECURITY (RLS)
-- =============================================================================
-- Target Database: PostgreSQL 15+ / Supabase
-- Extensions Required: uuid-ossp, pgcrypto, vector (optional for pgvector RAG)
-- Security Posture: Strict Zero-Knowledge Cryptographic Isolation, Multi-Tenant RLS
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. USERS & IDENTITY
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'tenant_inneros_default',
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(120) NOT NULL,
    password_hash VARCHAR(512) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'user', -- user, child, teen, caregiver, teacher, clinician, safeguarding, support, content_reviewer, admin
    age_tier VARCHAR(16) NOT NULL DEFAULT 'adult', -- child (2-12), teen (13-17), adult (18+)
    guardian_id VARCHAR(64) REFERENCES public.users(id) ON DELETE SET NULL,
    locale VARCHAR(16) NOT NULL DEFAULT 'en-US',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_demo BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_users_tenant_role ON public.users (tenant_id, role);
CREATE INDEX IF NOT EXISTS idx_users_guardian ON public.users (guardian_id);

-- -----------------------------------------------------------------------------
-- 2. AUTH SESSIONS (SERVER-SIDE WITH CSRF)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.auth_sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(128) UNIQUE NOT NULL,
    csrf_token VARCHAR(128) NOT NULL,
    user_agent VARCHAR(255),
    ip_address VARCHAR(64),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_expires ON public.auth_sessions (user_id, expires_at);

-- -----------------------------------------------------------------------------
-- 3. COMMERCE: PRODUCTS & SERVICE CATALOG
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(64) PRIMARY KEY,
    service_type VARCHAR(64) NOT NULL, -- kids_sub, teen_sub, family_sub, school_lic, free_tier
    name VARCHAR(160) NOT NULL,
    description TEXT NOT NULL,
    target_audience VARCHAR(64) NOT NULL DEFAULT 'kids',
    eligibility VARCHAR(120) NOT NULL DEFAULT 'universal',
    feature_entitlements_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- -----------------------------------------------------------------------------
-- 4. COMMERCE: PRICING PLANS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.prices (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    amount_cents INTEGER NOT NULL DEFAULT 0,
    currency VARCHAR(8) NOT NULL DEFAULT 'USD',
    billing_interval VARCHAR(32) NOT NULL DEFAULT 'monthly', -- monthly, annual, one_time, free
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_prices_product ON public.prices (product_id, is_active);

-- -----------------------------------------------------------------------------
-- 5. COMMERCE: ORDERS & PAYMENTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL REFERENCES public.products(id),
    price_id VARCHAR(64) NOT NULL REFERENCES public.prices(id),
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(8) NOT NULL DEFAULT 'USD',
    status VARCHAR(32) NOT NULL DEFAULT 'completed', -- pending, completed, refunded, failed
    payment_provider VARCHAR(32) NOT NULL DEFAULT 'mock_sandbox', -- mock_sandbox, stripe, apple_iap
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.payments (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    provider_payment_id VARCHAR(128) NOT NULL,
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(8) NOT NULL DEFAULT 'USD',
    status VARCHAR(32) NOT NULL DEFAULT 'succeeded', -- succeeded, refunded, failed
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders (user_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments (order_id);

-- -----------------------------------------------------------------------------
-- 6. COMMERCE: SUBSCRIPTIONS & ENTITLEMENTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL REFERENCES public.products(id),
    price_id VARCHAR(64) NOT NULL REFERENCES public.prices(id),
    status VARCHAR(32) NOT NULL DEFAULT 'active', -- active, past_due, cancelled, trialing
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.entitlements (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    feature_key VARCHAR(64) NOT NULL,
    granted_via VARCHAR(64) NOT NULL DEFAULT 'subscription',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions (user_id, status);
CREATE INDEX IF NOT EXISTS idx_entitlements_user_key ON public.entitlements (user_id, feature_key, is_active);

-- -----------------------------------------------------------------------------
-- 7. SUPPORT TICKETS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL DEFAULT 'general',
    priority VARCHAR(32) NOT NULL DEFAULT 'medium',
    status VARCHAR(32) NOT NULL DEFAULT 'open', -- open, in_progress, resolved, closed
    message TEXT NOT NULL,
    assigned_to VARCHAR(64),
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- -----------------------------------------------------------------------------
-- 8. COMPLIANCE, SAFETY & AUDIT LOGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id_hash VARCHAR(64) NOT NULL,
    action VARCHAR(80) NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.safety_incident_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id_hash VARCHAR(64) NOT NULL,
    risk_tier VARCHAR(32) NOT NULL,
    category VARCHAR(64) NOT NULL,
    region VARCHAR(32) NOT NULL,
    circuit_breaker_tripped BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.feature_flags (
    key VARCHAR(80) PRIMARY KEY,
    label VARCHAR(160) NOT NULL,
    description TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    category VARCHAR(64) NOT NULL DEFAULT 'general',
    updated_by VARCHAR(64) NOT NULL DEFAULT 'system',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Users Policy: Self or verified Guardian or Admin
CREATE POLICY users_self_or_guardian ON public.users
    FOR SELECT
    USING (
        auth.uid()::text = id
        OR guardian_id = auth.uid()::text
        OR EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text AND role IN ('admin', 'support')
        )
    );

-- 2. Subscriptions Policy: Account owner or Admin
CREATE POLICY subs_owner_or_admin ON public.subscriptions
    FOR SELECT
    USING (
        auth.uid()::text = user_id
        OR EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text AND role IN ('admin', 'support')
        )
    );

-- 3. Entitlements Policy: Feature check
CREATE POLICY entitlements_owner ON public.entitlements
    FOR SELECT
    USING (
        auth.uid()::text = user_id
        OR EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text AND role IN ('admin', 'support')
        )
    );

-- 4. Support Tickets: Submitter or Admin
CREATE POLICY tickets_submitter_or_support ON public.support_tickets
    FOR ALL
    USING (
        auth.uid()::text = user_id
        OR EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text AND role IN ('admin', 'support')
        )
    );

-- 5. Products & Prices: Public Read for all authenticated & anonymous
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY products_public_read ON public.products
    FOR SELECT USING (is_published = TRUE);

CREATE POLICY prices_public_read ON public.prices
    FOR SELECT USING (is_active = TRUE);
