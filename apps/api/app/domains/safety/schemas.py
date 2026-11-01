"""Safety Domain Schemas.
Data contracts for risk evaluation, non-clinical policy enforcement,
multilingual crisis interception, and jurisdictional emergency routing.
"""

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class RiskLevel(str, Enum):
    NONE = "none"
    MILD_DISTRESS = "mild_distress"
    MODERATE_RISK = "moderate_risk"
    ACUTE_CRISIS = "acute_crisis"


class SafetyCategory(str, Enum):
    BENIGN = "benign"
    SELF_HARM_SUICIDAL_IDEATION = "self_harm_suicidal_ideation"
    VIOLENCE_HARM_TO_OTHERS = "violence_harm_to_others"
    MEDICAL_OR_PRESCRIPTION_QUERY = "medical_or_prescription_query"
    SEVERE_DISSOCIATION_PSYCHOSIS = "severe_dissociation_psychosis"
    DELUSION_PARANOIA_REINFORCEMENT = "delusion_paranoia_reinforcement"
    AI_CODEPENDENCY_ISOLATION = "ai_codependency_isolation"
    FALSE_CLINICAL_RECOVERY_PROMISE = "false_clinical_recovery_promise"
    UNSOLICITED_ADVICE_REJECTION = "unsolicited_advice_rejection"
    # Pre-Release Regulatory & Safety Expanded Categories
    DOMESTIC_ABUSE_COERCION = "domestic_abuse_coercion"
    MANIA_BIPOLAR_RISK = "mania_bipolar_risk"
    SUBSTANCE_ADDICTION_WITHDRAWAL = "substance_addiction_withdrawal"
    EATING_DISORDER_HARM = "eating_disorder_harm"
    SEXUAL_RELATIONSHIP_SAFETY = "sexual_relationship_safety"
    MANIPULATIVE_OR_JAILBREAK = "manipulative_or_jailbreak"
    SEVERE_DEPRESSION_DISTRESS = "severe_depression_distress"
    UNRELIABLE_TRANSCRIPTION = "unreliable_transcription"


class CrisisResource(BaseModel):
    country_code: str
    country_name: str
    phone: str
    text_channel: Optional[str] = None
    website: str
    description: str
    languages: List[str] = Field(default_factory=lambda: ["en"])
    is_24_7: bool = True
    resource_type: Optional[str] = "crisis_helpline"  # e.g., "crisis_helpline", "domestic_violence", "substance_abuse", "youth"


class SafetyEvaluationRequest(BaseModel):
    utterance: str
    country_code: Optional[str] = "US"
    language: Optional[str] = "en"
    audio_snr_db: Optional[float] = None
    transcription_confidence: Optional[float] = None


class SafetyEvaluationResponse(BaseModel):
    is_safe_to_proceed: bool
    risk_level: RiskLevel
    primary_category: SafetyCategory
    matched_heuristics: List[str] = Field(default_factory=list)
    de_escalation_message: Optional[str] = None
    crisis_resources: List[CrisisResource] = Field(default_factory=list)
    requires_human_escalation: bool = False
    refuse_advice: bool = False
    requires_clinical_handoff: bool = False
    jurisdiction_evaluated: str = "US"


class OutputSafetyEvaluation(BaseModel):
    is_safe: bool
    violations: List[str] = Field(default_factory=list)
    sanitized_output: Optional[str] = None
