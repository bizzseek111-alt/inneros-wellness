"""InnerOS Relational ORM Models (SQLAlchemy 2.0).

Defines persistent tables for:
1. Users & Role-Based Access Control (`users`)
2. Server-Side Authentication Sessions (`auth_sessions`)
3. Personal Journal & Reflections (`journal_entries`)
4. Personal Growth Goals & Habit Steps (`growth_goals`)
5. Somatic & Emotional Daily Check-Ins (`check_in_records`)
6. Public Website Contact Inquiries (`contact_submissions`)
7. Platform Feature Flags (`feature_flags`)
8. Privacy-Preserving Safety Incident Logs (`safety_incident_logs`)
9. Zero-Knowledge Admin Audit Logs (`admin_audit_logs`)
10. Durable Domain State Store (`domain_state_store`)
"""

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Boolean, DateTime, Integer, String, Text, Index
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


class UserModel(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    tenant_id: Mapped[str] = mapped_column(String(64), index=True, default="tenant_inneros_default")
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String(120), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(512), nullable=False)
    role: Mapped[str] = mapped_column(String(32), default="user", nullable=False)  # user, child, teen, caregiver, teacher, clinician, safeguarding, support, content_reviewer, admin
    age_tier: Mapped[str] = mapped_column(String(16), default="adult", nullable=False)  # "child" (6-12), "teen" (13-17), "adult" (18+)
    guardian_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)  # Links child/teen to caregiver account
    locale: Mapped[str] = mapped_column(String(16), default="en-US", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    verification_token: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    reset_password_token: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    reset_token_expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, onupdate=_utc_now, nullable=False)


class AuthSessionModel(Base):
    __tablename__ = "auth_sessions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    token_hash: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    csrf_token: Mapped[str] = mapped_column(String(128), nullable=False)
    user_agent: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    ip_address: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)


class JournalEntryModel(Base):
    __tablename__ = "journal_entries"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    prompt: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    tags_json: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    mood_valence: Mapped[str] = mapped_column(String(32), default="reflective", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, onupdate=_utc_now, nullable=False)


class GrowthGoalModel(Base):
    __tablename__ = "growth_goals"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(64), default="Rest & Boundaries", nullable=False)
    why_it_matters: Mapped[str] = mapped_column(Text, default="", nullable=False)
    steps_json: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="active", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, onupdate=_utc_now, nullable=False)


class CheckInRecordModel(Base):
    __tablename__ = "check_in_records"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    energy_level: Mapped[int] = mapped_column(Integer, default=3, nullable=False)
    stress_level: Mapped[int] = mapped_column(Integer, default=2, nullable=False)
    emotions_json: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    needs_json: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    note: Mapped[str] = mapped_column(Text, default="", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)


class ContactSubmissionModel(Base):
    __tablename__ = "contact_submissions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    inquiry_type: Mapped[str] = mapped_column(String(64), default="general", nullable=False)
    organization: Mapped[Optional[str]] = mapped_column(String(160), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="received", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)


class FeatureFlagModel(Base):
    __tablename__ = "feature_flags"

    key: Mapped[str] = mapped_column(String(80), primary_key=True)
    label: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    category: Mapped[str] = mapped_column(String(64), default="general", nullable=False)
    updated_by: Mapped[str] = mapped_column(String(64), default="system", nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, onupdate=_utc_now, nullable=False)


class SafetyIncidentLogModel(Base):
    __tablename__ = "safety_incident_logs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id_hash: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    risk_tier: Mapped[str] = mapped_column(String(64), nullable=False)
    category: Mapped[str] = mapped_column(String(120), nullable=False)
    region: Mapped[str] = mapped_column(String(16), default="US", nullable=False)
    circuit_breaker_tripped: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)


class AdminAuditLogModel(Base):
    __tablename__ = "admin_audit_logs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id_hash: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    actor_role: Mapped[str] = mapped_column(String(32), default="user", nullable=False)
    action: Mapped[str] = mapped_column(String(120), nullable=False)
    resource_type: Mapped[str] = mapped_column(String(64), nullable=False)
    metadata_json: Mapped[str] = mapped_column(Text, default="{}", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)


class DomainStateStoreModel(Base):
    __tablename__ = "domain_state_store"

    namespace: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    item_key: Mapped[str] = mapped_column(String(128), primary_key=True)
    payload_json: Mapped[str] = mapped_column(Text, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, onupdate=_utc_now, nullable=False)

    __table_args__ = (
        Index("ix_domain_state_ns_user", "namespace", "user_id"),
    )


# =============================================================================
# INNEROS KIDS & YOUTH RELATIONAL MODELS
# =============================================================================

class ChildProfileModel(Base):
    """Child profile with data minimization (no full legal name required)."""
    __tablename__ = "child_profiles"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    guardian_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String(120), nullable=False)  # Nickname or pseudonym
    age_tier: Mapped[str] = mapped_column(String(16), default="junior", nullable=False)  # "little" (2-5), "junior" (6-12), "teen" (13-17)
    birth_year_month: Mapped[Optional[str]] = mapped_column(String(7), nullable=True)  # "YYYY-MM" minimizing COPPA PII
    locale: Mapped[str] = mapped_column(String(16), default="en", nullable=False)
    sensory_low_stimulation: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    dyslexic_font: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    high_contrast: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    reduced_motion: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    daily_screen_time_limit_minutes: Mapped[int] = mapped_column(Integer, default=45, nullable=False)
    curfew_bedtime: Mapped[str] = mapped_column(String(8), default="20:30", nullable=False)
    voice_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, onupdate=_utc_now, nullable=False)


class CaregiverChildLinkModel(Base):
    """Verified caregiver authorization link with fine-grained permission flags."""
    __tablename__ = "caregiver_child_links"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    caregiver_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    child_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    relationship_type: Mapped[str] = mapped_column(String(32), default="parent", nullable=False)
    verification_method: Mapped[str] = mapped_column(String(64), default="verifiable_parental_attestation", nullable=False)
    verification_status: Mapped[str] = mapped_column(String(32), default="verified", nullable=False)  # verified, pending_verification, revoked
    verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    can_manage_settings: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    can_view_activity: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)


class ConsentRecordModel(Base):
    """Verifiable Parental Consent (COPPA) & Teen Digital Assent audit records."""
    __tablename__ = "consent_records"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    subject_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    subject_type: Mapped[str] = mapped_column(String(16), default="child", nullable=False)  # "child" or "teen"
    signatory_user_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    consent_type: Mapped[str] = mapped_column(String(64), nullable=False)
    policy_version: Mapped[str] = mapped_column(String(32), default="2026.1_youth_v1", nullable=False)
    is_granted: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    ip_hash: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    revoked_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)


class YouthLearningActivityModel(Base):
    """Completed educational lessons and demonstrated skills (non-diagnostic)."""
    __tablename__ = "youth_learning_activities"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    child_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    module_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    department_id: Mapped[str] = mapped_column(String(64), nullable=False)
    stage_completed: Mapped[str] = mapped_column(String(32), default="completed", nullable=False)
    session_duration_seconds: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    progress_indicator: Mapped[str] = mapped_column(Text, default="", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)


class VoiceSessionMetadataModel(Base):
    """Voice session technical and latency metadata. Raw audio is strictly NOT persisted."""
    __tablename__ = "voice_session_metadata"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_or_child_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    user_role: Mapped[str] = mapped_column(String(32), default="child", nullable=False)
    provider: Mapped[str] = mapped_column(String(32), default="synthetic_voice", nullable=False)
    detected_language: Mapped[str] = mapped_column(String(16), default="en", nullable=False)
    duration_seconds: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    latency_ms: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    audio_persisted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)


class SafetyEscalationIncidentModel(Base):
    """Safeguarding escalation incidents with restricted clinical access controls."""
    __tablename__ = "safety_escalation_incidents"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    subject_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)  # User or child ID
    age_tier: Mapped[str] = mapped_column(String(16), default="junior", nullable=False)
    severity_tier: Mapped[str] = mapped_column(String(32), nullable=False)  # critical_immediate, elevated_safeguarding, informational_distress
    category: Mapped[str] = mapped_column(String(64), nullable=False)  # self_harm, abuse_disclosure, bullying_threat, severe_distress
    circuit_breaker_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    restricted_access_roles: Mapped[str] = mapped_column(String(120), default="safeguarding,clinician,admin", nullable=False)
    de_escalation_script_served: Mapped[str] = mapped_column(String(120), default="grounding_resource", nullable=False)
    human_reviewer_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    resolution_status: Mapped[str] = mapped_column(String(32), default="open", nullable=False)  # open, under_review, referred_to_professional, resolved_closed
    resolution_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class ReferralDirectoryResourceModel(Base):
    """Verified mental health and youth distress referral directory."""
    __tablename__ = "referral_directory_resources"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    country_code: Mapped[str] = mapped_column(String(8), default="GLOBAL", nullable=False)
    organization_name: Mapped[str] = mapped_column(String(160), nullable=False)
    category: Mapped[str] = mapped_column(String(64), default="youth_crisis", nullable=False)
    phone: Mapped[str] = mapped_column(String(64), nullable=False)
    text_sms: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    website: Mapped[str] = mapped_column(String(255), nullable=False)
    languages: Mapped[str] = mapped_column(String(120), default="English, Urdu, Punjabi", nullable=False)
    is_24_7: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    verified_by: Mapped[str] = mapped_column(String(64), default="Safeguarding Board", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)


class DataRetentionDeletionRequestModel(Base):
    """Right to be forgotten and data retention purge requests."""
    __tablename__ = "data_retention_deletion_requests"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    requester_user_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    target_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    request_type: Mapped[str] = mapped_column(String(32), default="child_account_deletion", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="queued", nullable=False)  # queued, processing, completed, cancelled
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)


# =============================================================================
# COMMERCE, SAAS BILLING, ENTITLEMENTS & SUPPORT MODELS
# =============================================================================

class ProductModel(Base):
    """Service catalog items for Kids, Teens, Families, and Schools."""
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    service_type: Mapped[str] = mapped_column(String(64), nullable=False)  # kids_sub, teen_sub, family_sub, school_lic, free_tier
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    target_audience: Mapped[str] = mapped_column(String(64), default="kids", nullable=False)  # kids, teens, families, schools
    eligibility: Mapped[str] = mapped_column(String(120), default="universal", nullable=False)
    feature_entitlements_json: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, onupdate=_utc_now, nullable=False)


class PriceModel(Base):
    """Configurable prices and billing intervals for service catalog products."""
    __tablename__ = "prices"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    product_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    amount_cents: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    currency: Mapped[str] = mapped_column(String(8), default="USD", nullable=False)
    billing_interval: Mapped[str] = mapped_column(String(32), default="monthly", nullable=False)  # monthly, annual, one_time, free
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)


class OrderModel(Base):
    """Customer purchase orders for plans and subscriptions."""
    __tablename__ = "orders"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    product_id: Mapped[str] = mapped_column(String(64), nullable=False)
    price_id: Mapped[str] = mapped_column(String(64), nullable=False)
    amount_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String(8), default="USD", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="completed", nullable=False)  # pending, completed, refunded, failed
    payment_provider: Mapped[str] = mapped_column(String(32), default="mock_sandbox", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, onupdate=_utc_now, nullable=False)


class PaymentModel(Base):
    """Idempotent payment transactions and receipts."""
    __tablename__ = "payments"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    order_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    provider_payment_id: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    amount_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String(8), default="USD", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="succeeded", nullable=False)  # succeeded, refunded, failed
    idempotency_key: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)


class SubscriptionModel(Base):
    """Customer active SaaS subscriptions and renewal lifecycles."""
    __tablename__ = "subscriptions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    product_id: Mapped[str] = mapped_column(String(64), nullable=False)
    price_id: Mapped[str] = mapped_column(String(64), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="active", nullable=False)  # active, past_due, cancelled, trialing
    current_period_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)
    current_period_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    cancel_at_period_end: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, onupdate=_utc_now, nullable=False)


class EntitlementModel(Base):
    """Active feature entitlements unlocked by subscriptions or institutional grants."""
    __tablename__ = "entitlements"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    feature_key: Mapped[str] = mapped_column(String(64), index=True, nullable=False)  # kids_unlimited, family_tier, classroom_pack
    granted_via: Mapped[str] = mapped_column(String(64), default="subscription", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)


class SupportTicketModel(Base):
    """Customer and caregiver support inquiries with strict role authorization."""
    __tablename__ = "support_tickets"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(64), default="general", nullable=False)  # billing, technical, account, safeguarding
    priority: Mapped[str] = mapped_column(String(32), default="medium", nullable=False)  # low, medium, high, urgent
    status: Mapped[str] = mapped_column(String(32), default="open", nullable=False)  # open, in_progress, resolved, closed
    message: Mapped[str] = mapped_column(Text, nullable=False)
    assigned_to: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    resolution_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, onupdate=_utc_now, nullable=False)


# =============================================================================
# EDUCATOR, SCHOOLS & CLASSROOM MODELS
# =============================================================================

class ClassroomModel(Base):
    """Educator classroom roster and cohort settings."""
    __tablename__ = "classrooms"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    teacher_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    grade_level: Mapped[str] = mapped_column(String(32), default="Grade 3", nullable=False)
    institution_name: Mapped[str] = mapped_column(String(160), default="Weebly Elementary", nullable=False)
    join_code: Mapped[str] = mapped_column(String(16), unique=True, index=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, onupdate=_utc_now, nullable=False)


class ClassroomEnrollmentModel(Base):
    """Student membership in educator classrooms (strictly non-clinical)."""
    __tablename__ = "classroom_enrollments"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    classroom_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    student_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    student_display_name: Mapped[str] = mapped_column(String(120), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="enrolled", nullable=False)  # enrolled, pending, inactive
    enrolled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)


class ClassroomAssignmentModel(Base):
    """SEL activity or developmental story assigned to a classroom."""
    __tablename__ = "classroom_assignments"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    classroom_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    department_id: Mapped[str] = mapped_column(String(64), default="emotional_intelligence", nullable=False)
    activity_type: Mapped[str] = mapped_column(String(64), default="feelings_wheel", nullable=False)
    instructions: Mapped[str] = mapped_column(Text, default="", nullable=False)
    due_date: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)


class EducationalQuestionModel(Base):
    """3,000-Question Relational Bank for Child Learning & Speech Diagnostics."""
    __tablename__ = "educational_questions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    category: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    subcategory: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    age_range: Mapped[str] = mapped_column(String(16), index=True, nullable=False)
    learning_objective: Mapped[str] = mapped_column(String(255), nullable=False)
    difficulty: Mapped[str] = mapped_column(String(16), default="beginner", nullable=False)
    text_en: Mapped[str] = mapped_column(Text, nullable=False)
    text_ur: Mapped[str] = mapped_column(Text, nullable=False)
    text_pa: Mapped[str] = mapped_column(Text, nullable=False)
    text_roman: Mapped[str] = mapped_column(Text, nullable=False)
    correct_answer_or_rubric: Mapped[str] = mapped_column(Text, nullable=False)
    hints_json: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    follow_up_questions_json: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    accessibility_notes: Mapped[str] = mapped_column(Text, default="", nullable=False)
    review_status: Mapped[str] = mapped_column(String(24), default="drafted", index=True, nullable=False)
    curriculum_version: Mapped[str] = mapped_column(String(32), default="v2.4.0", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)
    reviewed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    approved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class EducationalActivityEventModel(Base):
    """Structured minimal analytics event recorded after approved learning activities."""
    __tablename__ = "educational_activity_events"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    student_pseudonymous_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    activity_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    learning_objective: Mapped[str] = mapped_column(String(255), nullable=False)
    completion_status: Mapped[str] = mapped_column(String(32), default="completed", nullable=False)
    hints_used_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    language_used: Mapped[str] = mapped_column(String(16), default="en", nullable=False)
    duration_seconds: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    curriculum_version: Mapped[str] = mapped_column(String(32), default="v2.4.0", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utc_now, nullable=False)



