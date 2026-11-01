"""Admin & Compliance Domain Schemas.
Data contracts for immutable audit trail inspection, tenant health, and GDPR export.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class AuditLogEntry(BaseModel):
    event_id: str
    user_id_hash: str
    action: str  # "CONSENT_UPDATED", "MEMORY_CREATED", "MEMORY_DELETED", "CRISIS_DETECTED"
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
