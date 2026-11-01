"""Admin & Compliance Domain Schemas.
Data contracts for zero-knowledge audit trail inspection, tenant health, GDPR export,
feature flag governance, anonymized safety incident logs, and operational telemetry.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class AuditLogEntry(BaseModel):
    event_id: str
    user_id_hash: str
    action: str
    resource_type: str
    timestamp: datetime
    metadata: Dict[str, Any] = Field(default_factory=dict)


class TenantStatus(BaseModel):
    tenant_id: str
    isolation_mode: str = "RowLevelSecurity"
    encryption_algorithm: str = "AES-256-GCM"
    active_users_synthetic: int = 1
    safety_guardrail_active: bool = True
    pgvector_extension_status: str = "healthy"


class ComplianceExportResponse(BaseModel):
    user_id: str
    export_generated_at: datetime
    data_retention_policy: str
    gdpr_article_15_access: Dict[str, Any]


class FeatureFlagItem(BaseModel):
    key: str
    label: str
    description: str
    enabled: bool
    category: str
    updated_by: str
    updated_at: datetime


class FeatureFlagUpdateRequest(BaseModel):
    enabled: bool


class SafetyIncidentItem(BaseModel):
    id: str
    user_id_hash: str
    risk_tier: str
    category: str
    region: str
    circuit_breaker_tripped: bool
    created_at: datetime


class AdminPlatformOverviewResponse(BaseModel):
    generated_at: datetime
    privacy_guarantee: str = "Zero-Knowledge Operations: Private conversations, voice audio, and personal memories are never accessible to administrators."
    platform_health: Dict[str, Any]
    ai_and_voice_providers: Dict[str, Any]
    knowledge_governance: Dict[str, Any]
    localization_status: Dict[str, Any]
    notification_delivery: Dict[str, Any]
    integrations_health: Dict[str, Any]
    safety_circuit_breaker: Dict[str, Any]
    feature_flags: List[FeatureFlagItem]
