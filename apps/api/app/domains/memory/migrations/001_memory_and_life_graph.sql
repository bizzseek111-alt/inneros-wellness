-- InnerOS Personal Memory and Life Graph Schema Migration
-- Migration 001: memory_and_life_graph.sql
-- Enforces:
-- 1. Fact vs. AI Interpretation isolation
-- 2. Suggested vs. Confirmed staging workflow
-- 3. Life Graph nodes and edges with foreign key cascades
-- 4. Granular consent and explicit opt-in for sensitive health categories
-- 5. Append-only memory audit log
-- 6. PostgreSQL Row-Level Security (RLS) for tenant isolation

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Memory Consent Table
CREATE TABLE IF NOT EXISTS user_memory_consents (
    user_id VARCHAR(128) PRIMARY KEY,
    allow_memory_system BOOLEAN NOT NULL DEFAULT TRUE,
    is_memory_recording_paused BOOLEAN NOT NULL DEFAULT FALSE,
    sensitive_health_consent_granted BOOLEAN NOT NULL DEFAULT FALSE,
    allowed_categories JSONB NOT NULL DEFAULT '["communication_preferences", "personal_goals", "user_confirmed_life_events", "habits_and_routines", "work_and_career_information", "relationships_and_family_context", "self_reported_emotions", "coping_preferences"]'::jsonb,
    auto_expire_tentative_days INTEGER NOT NULL DEFAULT 30,
    require_confirmation_for_all_suggestions BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Memory Records Table
CREATE TABLE IF NOT EXISTS memory_records (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL,
    record_type VARCHAR(32) NOT NULL DEFAULT 'stored_fact' CHECK (record_type IN ('stored_fact', 'tentative_ai_interpretation')),
    status VARCHAR(32) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('suggested', 'confirmed', 'rejected', 'archived')),
    fact_statement TEXT NOT NULL,
    raw_context TEXT,
    confidence_score NUMERIC(3, 2) NOT NULL DEFAULT 1.0 CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    certainty_level VARCHAR(32) NOT NULL DEFAULT 'user_verified' CHECK (certainty_level IN ('tentative', 'moderate', 'high', 'user_verified')),
    source_session_id VARCHAR(64),
    source_type VARCHAR(64) NOT NULL DEFAULT 'explicit_user_statement',
    source_quote TEXT,
    extracted_by VARCHAR(64) NOT NULL DEFAULT 'user_direct',
    extracted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    emotional_valence VARCHAR(32) DEFAULT 'neutral',
    is_sensitive BOOLEAN NOT NULL DEFAULT FALSE,
    user_consent_verified BOOLEAN NOT NULL DEFAULT TRUE,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    next_review_due_at TIMESTAMP WITH TIME ZONE,
    encryption_metadata JSONB NOT NULL DEFAULT '{"storage_mode": "aes_256_gcm_encrypted", "envelope_id": "dek_user_primary"}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_memory_records_user_status ON memory_records (user_id, status);
CREATE INDEX IF NOT EXISTS idx_memory_records_user_category ON memory_records (user_id, category);
CREATE INDEX IF NOT EXISTS idx_memory_records_user_type ON memory_records (user_id, record_type);
CREATE INDEX IF NOT EXISTS idx_memory_records_expires ON memory_records (expires_at) WHERE expires_at IS NOT NULL;

-- 3. Life Graph Nodes Table
CREATE TABLE IF NOT EXISTS life_graph_nodes (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    label VARCHAR(255) NOT NULL,
    node_type VARCHAR(32) NOT NULL CHECK (node_type IN ('role', 'habit', 'goal', 'relationship', 'stress_trigger', 'coping_strategy', 'life_event', 'value', 'health_context')),
    description TEXT NOT NULL DEFAULT '',
    linked_memory_id VARCHAR(64) REFERENCES memory_records(id) ON DELETE SET NULL,
    record_type VARCHAR(32) NOT NULL DEFAULT 'stored_fact' CHECK (record_type IN ('stored_fact', 'tentative_ai_interpretation')),
    emotional_charge VARCHAR(32) NOT NULL DEFAULT 'neutral' CHECK (emotional_charge IN ('positive', 'neutral', 'challenging')),
    is_tentative BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_life_graph_nodes_user ON life_graph_nodes (user_id);
CREATE INDEX IF NOT EXISTS idx_life_graph_nodes_type ON life_graph_nodes (user_id, node_type);

-- 4. Life Graph Edges Table
CREATE TABLE IF NOT EXISTS life_graph_edges (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    source_node_id VARCHAR(64) NOT NULL REFERENCES life_graph_nodes(id) ON DELETE CASCADE,
    target_node_id VARCHAR(64) NOT NULL REFERENCES life_graph_nodes(id) ON DELETE CASCADE,
    relation VARCHAR(64) NOT NULL,
    confidence NUMERIC(3, 2) NOT NULL DEFAULT 1.0,
    is_tentative BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_different_nodes CHECK (source_node_id <> target_node_id)
);

CREATE INDEX IF NOT EXISTS idx_life_graph_edges_user ON life_graph_edges (user_id);
CREATE INDEX IF NOT EXISTS idx_life_graph_edges_source ON life_graph_edges (source_node_id);
CREATE INDEX IF NOT EXISTS idx_life_graph_edges_target ON life_graph_edges (target_node_id);

-- 5. Memory Audit Logs (Immutable Append-Only Log)
CREATE TABLE IF NOT EXISTS memory_audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    action VARCHAR(32) NOT NULL CHECK (action IN ('created', 'suggested', 'confirmed', 'rejected', 'edited', 'deleted_single', 'purged_all', 'exported', 'paused', 'resumed', 'expired_auto')),
    target_id VARCHAR(64),
    target_type VARCHAR(32) NOT NULL DEFAULT 'memory',
    actor VARCHAR(64) NOT NULL DEFAULT 'user',
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_memory_audit_logs_user_time ON memory_audit_logs (user_id, timestamp DESC);

-- 6. Row-Level Security (RLS) Policies
ALTER TABLE user_memory_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_graph_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_graph_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_audit_logs ENABLE ROW LEVEL SECURITY;

-- Note: In production PostgreSQL, app.current_user_id is set per session via connection pooler
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_memory_consent_isolation') THEN
        CREATE POLICY user_memory_consent_isolation ON user_memory_consents
            FOR ALL USING (user_id = CURRENT_USER OR user_id = current_setting('app.current_user_id', true));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'memory_records_isolation') THEN
        CREATE POLICY memory_records_isolation ON memory_records
            FOR ALL USING (user_id = CURRENT_USER OR user_id = current_setting('app.current_user_id', true));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'life_graph_nodes_isolation') THEN
        CREATE POLICY life_graph_nodes_isolation ON life_graph_nodes
            FOR ALL USING (user_id = CURRENT_USER OR user_id = current_setting('app.current_user_id', true));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'life_graph_edges_isolation') THEN
        CREATE POLICY life_graph_edges_isolation ON life_graph_edges
            FOR ALL USING (user_id = CURRENT_USER OR user_id = current_setting('app.current_user_id', true));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'memory_audit_logs_isolation') THEN
        CREATE POLICY memory_audit_logs_isolation ON memory_audit_logs
            FOR ALL USING (user_id = CURRENT_USER OR user_id = current_setting('app.current_user_id', true));
    END IF;
END $$;
