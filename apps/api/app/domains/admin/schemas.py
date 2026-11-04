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


class CustomerItem(BaseModel):
    id: str
    email: str
    display_name: str
    role: str
    age_tier: str
    locale: str
    is_active: bool
    is_demo: bool
    created_at: datetime
    active_subscriptions_count: int = 0


class FamilyItem(BaseModel):
    guardian_id: str
    guardian_name: str
    guardian_email: str
    dependents: List[Dict[str, Any]] = Field(default_factory=list)
    consent_status: str = "active_consent"
    daily_screen_time_limit_minutes: int = 45
    co_learning_reminders_enabled: bool = True


class ChildProfileAdminItem(BaseModel):
    id: str
    display_name: str
    age_tier: str
    guardian_id: Optional[str] = None
    locale: str
    accessibility_mode: str = "sensory_calm"
    completed_activities_count: int = 0
    created_at: datetime


class TeenProfileAdminItem(BaseModel):
    id: str
    display_name: str
    age_tier: str
    guardian_id: Optional[str] = None
    locale: str
    autonomy_level: str = "collaborative"
    active_goals_count: int = 0
    created_at: datetime


class SchoolItem(BaseModel):
    id: str
    school_name: str
    license_tier: str
    licensed_seats: int
    active_students: int
    lead_educator_email: str
    status: str
    created_at: datetime


class SubscriptionAdminItem(BaseModel):
    id: str
    user_id: str
    user_email: Optional[str] = None
    product_id: str
    product_name: str
    price_id: str
    amount_cents: int
    currency: str
    status: str
    current_period_start: datetime
    current_period_end: datetime
    cancel_at_period_end: bool


class OrderAdminItem(BaseModel):
    id: str
    user_id: str
    user_email: Optional[str] = None
    product_id: str
    product_name: str
    amount_cents: int
    currency: str
    status: str
    payment_provider: str
    created_at: datetime


class PaymentAdminItem(BaseModel):
    id: str
    order_id: str
    provider_payment_id: str
    amount_cents: int
    currency: str
    status: str
    created_at: datetime


class RefundRequest(BaseModel):
    reason: str = "Customer requested cancellation within 30-day satisfaction window"


class RefundResponse(BaseModel):
    order_id: str
    refund_id: str
    status: str
    amount_refunded_cents: int
    currency: str
    reason: str


class SupportTicketAdminItem(BaseModel):
    id: str
    user_id: str
    subject: str
    category: str
    priority: str
    status: str
    message: str
    assigned_to: Optional[str] = None
    resolution_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class SupportTicketUpdateRequest(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    resolution_notes: Optional[str] = None


class BusinessReportResponse(BaseModel):
    generated_at: datetime
    mrr_cents: int
    annual_run_rate_cents: int
    active_subscriptions: int
    total_orders: int
    total_revenue_cents: int
    churn_rate_percent: float
    active_families: int
    school_districts: int
    plan_breakdown: Dict[str, int]
    retention_by_age_band: Dict[str, float]


class AiUsageResponse(BaseModel):
    generated_at: datetime
    providers: List[Dict[str, Any]]
    monthly_token_estimate: int
    monthly_cost_estimate_usd: float
    speech_duration_minutes: int
    average_latency_ms: int
    privacy_policy_adherence: str = "Zero raw audio or child utterances logged or retained"


class VoiceProviderStatusItem(BaseModel):
    provider_name: str
    engine: str
    supported_locales: List[str]
    status: str
    latency_p95_ms: int
    cost_per_minute_usd: float
    is_active: bool


class ProductCreateRequest(BaseModel):
    id: Optional[str] = None
    service_type: str  # kids_sub, teen_sub, family_sub, school_lic, content_pack, free_tier
    name: str
    description: str
    target_audience: str = "kids"
    eligibility: str = "universal"
    feature_entitlements: List[str] = Field(default_factory=list)
    is_published: bool = True


class ProductUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    target_audience: Optional[str] = None
    eligibility: Optional[str] = None
    feature_entitlements: Optional[List[str]] = None
    is_published: Optional[bool] = None


class PriceCreateRequest(BaseModel):
    id: Optional[str] = None
    product_id: str
    amount_cents: int
    currency: str = "USD"
    billing_interval: str = "monthly"  # monthly, annual, one_time, free
    is_active: bool = True


class PriceUpdateRequest(BaseModel):
    amount_cents: Optional[int] = None
    currency: Optional[str] = None
    billing_interval: Optional[str] = None
    is_active: Optional[bool] = None


class TeamMemberItem(BaseModel):
    id: str
    email: str
    display_name: str
    role: str
    is_active: bool
    created_at: datetime
    permissions: List[str] = Field(default_factory=list)


class TeamInviteRequest(BaseModel):
    email: str
    display_name: str
    role: str = "support"  # admin, support, content_reviewer, safeguarding, clinician, teacher


class TeamRoleUpdateRequest(BaseModel):
    role: str
    is_active: Optional[bool] = None


class CurriculumModuleCreateRequest(BaseModel):
    module_id: Optional[str] = None
    department_id: str
    title_en: str
    title_ur: Optional[str] = None
    title_pa: Optional[str] = None
    target_age_range: str = "6-12"
    difficulty: str = "beginner"
    developmental_objective: str
    research_references: List[str] = Field(default_factory=list)
    is_published: bool = False


class ActivityCreateRequest(BaseModel):
    title: str
    modality: str  # story, voice, breathwork, offline_caregiver
    target_age_range: str = "6-12"
    prompt_en: str
    prompt_ur: Optional[str] = None
    prompt_pa: Optional[str] = None


class ContentApprovalItem(BaseModel):
    module_id: str
    department_id: str
    title_en: str
    target_age_range: str
    status: str
    version: str
    reviewer_name: Optional[str] = None
    evidence_strength: str
    updated_at: datetime


class ContentApprovalActionRequest(BaseModel):
    module_id: str
    decision: str  # approved, rejected, revision_requested, published
    reviewer_notes: str
    reviewer_credentials: str = "Clinical Psychologist / Senior Educator"


class SafeguardingCaseItem(BaseModel):
    id: str
    subject_id: str
    age_tier: str
    severity_tier: str
    category: str
    circuit_breaker_active: bool
    resolution_status: str
    resolution_notes: Optional[str] = None
    created_at: datetime


class SafeguardingCaseUpdateRequest(BaseModel):
    resolution_status: str  # under_review, referred_to_professional, resolved_closed
    resolution_notes: str


class PlatformSettingsUpdateRequest(BaseModel):
    max_requests_per_minute: Optional[int] = None
    parental_consent_gate: Optional[str] = None
    billing_provider: Optional[str] = None

