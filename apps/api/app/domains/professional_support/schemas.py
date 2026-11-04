"""Schemas for Weebly V8 Wellbeing, Early Support & Professional Support Layer (Modules 8 & 12)."""

from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ObservationCategory(str, Enum):
    FOCUS = "focus"
    SLEEP = "sleep"
    SENSORY = "sensory"
    SOCIAL = "social"
    EMOTION = "emotion"
    GENERAL = "general"


class SupportCaseStatus(str, Enum):
    INTAKE = "intake"
    CONSENT_VERIFIED = "consent_verified"
    IN_REVIEW = "in_review"
    SUPPORT_PLAN_ACTIVE = "support_plan_active"
    CLOSED = "closed"


class ParentObservationCreate(BaseModel):
    child_id: str
    category: ObservationCategory = ObservationCategory.GENERAL
    observation_text: str
    context_setting: str = "home"
    accommodations_tried: Optional[str] = ""


class ParentObservationRead(BaseModel):
    id: str
    parent_user_id: str
    child_id: str
    category: str
    observation_text: str
    context_setting: str
    accommodations_tried: str
    is_diagnostic: bool = False
    created_at: datetime


class TeacherObservationCreate(BaseModel):
    student_id: str
    classroom_id: str
    domain: str = "engagement"
    observation_text: str
    supports_offered: Optional[str] = ""


class TeacherObservationRead(BaseModel):
    id: str
    teacher_user_id: str
    student_id: str
    classroom_id: str
    domain: str
    observation_text: str
    supports_offered: str
    created_at: datetime


class ProfessionalProfileCreate(BaseModel):
    full_name: str
    license_number: str
    issuing_authority: str
    jurisdiction: str
    specialties: List[str] = Field(default_factory=list)


class ProfessionalProfileRead(BaseModel):
    id: str
    user_id: str
    full_name: str
    license_number: str
    issuing_authority: str
    jurisdiction: str
    specialties: List[str]
    verification_status: str
    verified_at: Optional[datetime]
    created_at: datetime


class SupportCaseCreate(BaseModel):
    child_pseudonym_id: str
    referral_source: str = "parent"  # parent, school, caregiver
    parental_consent_verified: bool = True
    caregiver_harm_suspected: bool = False
    initial_notes: Optional[str] = ""


class SupportCaseRead(BaseModel):
    id: str
    case_number: str
    child_pseudonym_id: str
    referral_source: str
    assigned_professional_id: Optional[str]
    status: SupportCaseStatus
    parental_consent_verified: bool
    caregiver_harm_suspected: bool
    support_recommendations: List[str] = Field(default_factory=list)
    follow_up_date: Optional[str]
    created_at: datetime
    updated_at: datetime


class ProfessionalNoteCreate(BaseModel):
    note_type: str = "observation_analysis"  # intake_review, observation_analysis, support_plan, follow_up
    content: str


class ProfessionalNoteRead(BaseModel):
    id: str
    case_id: str
    author_professional_id: str
    note_type: str
    content: str
    access_restricted_to_clinicians: bool
    created_at: datetime
