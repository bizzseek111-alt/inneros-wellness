"""Schemas for InnerOS Kids & Youth Governance, Safeguarding & Privacy Domain.

Defines Pydantic models for:
- Identity & Access (Adults, Children, Teens, Caregivers, Teachers, Clinicians, Safeguarding, Admins)
- Verified Caregiver-Child Relationships & Object-Level Authorization
- COPPA Verifiable Parental Consent & Teen Digital Assent
- Minimal Learning Activities & Non-Diagnostic Progress Indicators
- Ephemeral Voice Session Metadata (zero persistent raw audio)
- Safeguarding Escalation Incidents with Restricted Access
- Verified Mental Health & Youth Distress Referral Directory
- Right-to-be-Forgotten Deletion Requests & Retention Schedules
- Parent Dashboard & Admin Dashboard Aggregates
"""

from datetime import datetime
from typing import Dict, List, Optional, Any
from enum import Enum
from pydantic import BaseModel, Field


class YouthAgeTier(str, Enum):
    LITTLE = "little"    # Ages 2-5 (caregiver-mediated)
    JUNIOR = "junior"    # Ages 6-12 (playful/educational, COPPA-scoped)
    TEEN = "teen"        # Ages 13-17 (autonomous, privacy-first)
    ADULT = "adult"      # Ages 18+ (adult sanctuary)


class UserRole(str, Enum):
    CHILD = "child"
    TEEN = "teen"
    USER = "user"
    CAREGIVER = "caregiver"
    TEACHER = "teacher"
    CONTENT_REVIEWER = "content_reviewer"
    CLINICIAN = "clinician"
    SAFEGUARDING = "safeguarding"
    SUPPORT = "support"
    ADMIN = "admin"


class VerificationMethod(str, Enum):
    VERIFIABLE_PARENTAL_ATTESTATION = "verifiable_parental_attestation"
    CREDIT_CARD_VERIFICATION = "credit_card_verification"
    GOVERNMENT_ID_CHALLENGE = "government_id_challenge"
    SYNTHETIC_VERIFIED = "synthetic_verified"


class ConsentType(str, Enum):
    COPPA_VPC = "coppa_verifiable_parental_consent"
    TEEN_ASSENT = "teen_digital_assent"
    VOICE_PROCESSING = "voice_processing_consent"
    REFERRAL_SHARING = "data_sharing_referral_consent"


class IncidentSeverityTier(str, Enum):
    CRITICAL_IMMEDIATE = "critical_immediate"
    ELEVATED_SAFEGUARDING = "elevated_safeguarding"
    INFORMATIONAL_DISTRESS = "informational_distress"


# -----------------------------------------------------------------------------
# Child Profile Models
# -----------------------------------------------------------------------------

class ChildProfileCreate(BaseModel):
    display_name: str = Field(..., min_length=1, max_length=120, description="Nickname or pseudonym (data minimization)")
    age_tier: YouthAgeTier = YouthAgeTier.JUNIOR
    birth_year_month: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}$", description="YYYY-MM only, avoiding exact DOB")
    locale: str = Field("en", description="'en', 'ur', 'pa', 'ur-Latn'")
    sensory_low_stimulation: bool = False
    dyslexic_font: bool = False
    high_contrast: bool = False
    reduced_motion: bool = False
    daily_screen_time_limit_minutes: int = Field(45, ge=10, le=240)
    curfew_bedtime: str = Field("20:30", description="HH:MM bedtime boundary")
    voice_enabled: bool = True


class ChildProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    age_tier: Optional[YouthAgeTier] = None
    locale: Optional[str] = None
    sensory_low_stimulation: Optional[bool] = None
    dyslexic_font: Optional[bool] = None
    high_contrast: Optional[bool] = None
    reduced_motion: Optional[bool] = None
    daily_screen_time_limit_minutes: Optional[int] = None
    curfew_bedtime: Optional[str] = None
    voice_enabled: Optional[bool] = None
    is_active: Optional[bool] = None


class ChildProfileResponse(BaseModel):
    id: str
    guardian_id: str
    display_name: str
    age_tier: YouthAgeTier
    birth_year_month: Optional[str]
    locale: str
    sensory_low_stimulation: bool
    dyslexic_font: bool
    high_contrast: bool
    reduced_motion: bool
    daily_screen_time_limit_minutes: int
    curfew_bedtime: str
    voice_enabled: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime


# -----------------------------------------------------------------------------
# Caregiver Links & Authorization
# -----------------------------------------------------------------------------

class CaregiverChildLinkCreate(BaseModel):
    child_id: str
    relationship_type: str = "parent"
    verification_method: VerificationMethod = VerificationMethod.VERIFIABLE_PARENTAL_ATTESTATION
    can_manage_settings: bool = True
    can_view_activity: bool = True


class CaregiverChildLinkResponse(BaseModel):
    id: str
    caregiver_id: str
    child_id: str
    relationship_type: str
    verification_method: str
    verification_status: str
    verified_at: Optional[datetime]
    can_manage_settings: bool
    can_view_activity: bool
    created_at: datetime


# -----------------------------------------------------------------------------
# Consent & Digital Assent
# -----------------------------------------------------------------------------

class ConsentRecordCreate(BaseModel):
    subject_id: str
    subject_type: str = "child"  # "child" or "teen"
    consent_type: ConsentType
    policy_version: str = "2026.1_youth_v1"
    is_granted: bool = True


class ConsentRecordResponse(BaseModel):
    id: str
    subject_id: str
    subject_type: str
    signatory_user_id: str
    consent_type: str
    policy_version: str
    is_granted: bool
    ip_hash: Optional[str]
    revoked_at: Optional[datetime]
    created_at: datetime


# -----------------------------------------------------------------------------
# Learning Activities & Progress
# -----------------------------------------------------------------------------

class YouthActivityCreate(BaseModel):
    child_id: str
    module_id: str
    department_id: str
    stage_completed: str = "completed"
    session_duration_seconds: int = 0
    progress_indicator: str


class YouthActivityResponse(BaseModel):
    id: str
    child_id: str
    module_id: str
    department_id: str
    stage_completed: str
    session_duration_seconds: int
    progress_indicator: str
    created_at: datetime


# -----------------------------------------------------------------------------
# Voice Session Metadata (Zero Raw Audio Persistence)
# -----------------------------------------------------------------------------

class VoiceSessionMetadataCreate(BaseModel):
    user_or_child_id: str
    user_role: str = "child"
    provider: str = "synthetic_voice"
    detected_language: str = "en"
    duration_seconds: int = 0
    latency_ms: int = 0
    audio_persisted: bool = False  # Strictly False by default


class VoiceSessionMetadataResponse(BaseModel):
    id: str
    user_or_child_id: str
    user_role: str
    provider: str
    detected_language: str
    duration_seconds: int
    latency_ms: int
    audio_persisted: bool
    created_at: datetime


# -----------------------------------------------------------------------------
# Safety Escalation Incidents & Safeguarding
# -----------------------------------------------------------------------------

class SafetyEscalationIncidentCreate(BaseModel):
    subject_id: str
    age_tier: YouthAgeTier
    severity_tier: IncidentSeverityTier
    category: str
    circuit_breaker_active: bool = True
    de_escalation_script_served: str = "grounding_resource"


class SafetyEscalationIncidentUpdate(BaseModel):
    human_reviewer_id: Optional[str] = None
    resolution_status: Optional[str] = None  # open, under_review, referred_to_professional, resolved_closed
    resolution_notes: Optional[str] = None


class SafetyEscalationIncidentResponse(BaseModel):
    id: str
    subject_id: str
    age_tier: str
    severity_tier: str
    category: str
    circuit_breaker_active: bool
    restricted_access_roles: str
    de_escalation_script_served: str
    human_reviewer_id: Optional[str]
    resolution_status: str
    resolution_notes: Optional[str]
    created_at: datetime
    resolved_at: Optional[datetime]


# -----------------------------------------------------------------------------
# Referral Directory Resources
# -----------------------------------------------------------------------------

class ReferralResourceCreate(BaseModel):
    country_code: str = "GLOBAL"
    organization_name: str
    category: str = "youth_crisis"
    phone: str
    text_sms: Optional[str] = None
    website: str
    languages: str = "English, Urdu, Punjabi"
    is_24_7: bool = True
    is_verified: bool = True
    verified_by: str = "Safeguarding Board"


class ReferralResourceResponse(BaseModel):
    id: str
    country_code: str
    organization_name: str
    category: str
    phone: str
    text_sms: Optional[str]
    website: str
    languages: str
    is_24_7: bool
    is_verified: bool
    verified_by: str
    created_at: datetime


# -----------------------------------------------------------------------------
# Data Retention & Deletion Requests
# -----------------------------------------------------------------------------

class DeletionRequestCreate(BaseModel):
    target_id: str  # child_profile id or user id
    request_type: str = "child_account_deletion"


class DeletionRequestResponse(BaseModel):
    id: str
    requester_user_id: str
    target_id: str
    request_type: str
    status: str
    completed_at: Optional[datetime]
    created_at: datetime


# -----------------------------------------------------------------------------
# Dashboards Aggregations
# -----------------------------------------------------------------------------

class FamilySharedExercise(BaseModel):
    id: str
    title: str
    description: str
    target_age: str
    duration_minutes: int


class ParentDashboardSummary(BaseModel):
    caregiver_id: str
    caregiver_name: str
    linked_children: List[ChildProfileResponse]
    recent_activities: List[YouthActivityResponse]
    shared_family_exercises: List[FamilySharedExercise]
    screen_time_boundaries: Dict[str, int]
    consent_overview: List[ConsentRecordResponse]
    educational_guidance_articles: List[Dict[str, str]]
    teen_privacy_shield_notice: str = (
        "In accordance with developmental psychology principles and child-protection governance, "
        "adolescents (ages 13–17) have confidential emotional autonomy. Raw teen conversations are "
        "not shared with parents. Only safety escalations with imminent harm involve adult intervention."
    )


class VoiceProviderBenchmark(BaseModel):
    provider_name: str
    stt_latency_ms: int
    tts_naturalness_score: float
    supports_shahmukhi_punjabi: bool
    privacy_retention_policy: str


class AdminDashboardSummary(BaseModel):
    total_users_by_role: Dict[str, int]
    child_profiles_count: int
    verified_caregivers_count: int
    curriculum_modules_count: int
    unresolved_safety_incidents: List[SafetyEscalationIncidentResponse]
    voice_benchmarks: List[VoiceProviderBenchmark]
    referral_directory_count: int
    pending_deletion_requests_count: int
    feature_flags_status: Dict[str, bool]
