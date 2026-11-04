"""Schemas for InnerOS Youth Companion Domain.

Pydantic models for child-safe multilingual dialogue, voice turn processing,
safeguarding alerts, provider benchmarks, and age-aware policies.
"""

from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class YouthAgeTier(str, Enum):
    EARLY = "early"                # Ages 2–5: Caregiver-mediated stories only, NO open AI chat
    JUNIOR_YOUNG = "junior_young"  # Ages 6–9: Short sentences, 1 question at a time, simple words
    JUNIOR_OLDER = "junior_older"  # Ages 10–12: Emotional literacy, perspective-taking, problem-solving
    TEEN = "teen"                  # Ages 13–18: Respectful, mature, autonomy-supportive


class AudioDeliveryStatus(str, Enum):
    SYNTHESIZED = "synthesized"
    UNSUPPORTED_VOICE_FALLBACK_TEXT = "unsupported_voice_fallback_text"
    CLARIFICATION_NEEDED = "clarification_needed"
    SUPPRESSED_SAFETY = "suppressed_safety"


class YouthTurnRequest(BaseModel):
    session_id: str = Field(..., description="Unique ephemeral session identifier")
    user_utterance: Optional[str] = Field(None, description="Spoken transcript or text message")
    audio_base64: Optional[str] = Field(None, description="Base64 encoded audio payload")
    language: Optional[str] = Field("en", description="Selected or detected language code ('en', 'ur', 'ur-Latn', 'pa', 'pa-Latn', 'auto')")
    age_tier: str = Field("junior_young", description="Age tier: 'early' (2-5), 'junior_young' (6-9), 'junior_older' (10-12), 'teen' (13-18)")
    is_interruption: bool = Field(False, description="Whether this request signals a barge-in interruption")
    confidence_score: Optional[float] = Field(None, description="STT confidence score if client-transcribed")
    caregiver_present: bool = Field(False, description="Mandatory True for 'early' (2-5) tier")


class SafetyResource(BaseModel):
    name: str
    contact: str
    region: str = "Global / Regional"
    description: str = ""


class YouthTurnResponse(BaseModel):
    turn_id: str
    session_id: str
    transcript_user: str
    transcript_agent: str
    detected_language: str
    target_script: str  # "Nastaliq", "Shahmukhi", "Latin"
    audio_base64: Optional[str] = None
    audio_format: str = "mp3"
    audio_status: AudioDeliveryStatus = AudioDeliveryStatus.SYNTHESIZED
    voice_unavailable_reason: Optional[str] = None
    is_safety_escalation: bool = False
    safeguarding_event_id: Optional[str] = None
    safety_resources: List[SafetyResource] = Field(default_factory=list)
    clarification_requested: bool = False
    clarification_prompt: Optional[str] = None
    age_tier: str
    turn_count: int = 1
    session_limit_reached: bool = False
    wind_down_notice: Optional[str] = None
    non_diagnostic_notice: str = (
        "Lumi is an AI emotional helper friend. Lumi never diagnoses medical conditions, "
        "never infers feelings from vocal acoustics, and never keeps secrets from parents."
    )


class YouthInterruptionRequest(BaseModel):
    session_id: str
    turn_id: Optional[str] = None


class YouthInterruptionResponse(BaseModel):
    session_id: str
    halted: bool = True
    message: str = "Companion playback halted. Lumi is listening."


class SafeguardingAlertRequest(BaseModel):
    session_id: str
    child_id_hash: str
    guardian_id: Optional[str] = None
    category: str  # "abuse_disclosure", "self_harm_risk", "bullying_disclosure", "grooming_risk", "medical_probing"
    severity: str  # "critical", "high", "moderate"
    snippet_redacted: str
    action_taken: str


class SafeguardingAlertResponse(BaseModel):
    alert_id: str
    status: str
    logged_at: str
    escalation_path: str


class ProviderBenchmark(BaseModel):
    provider_name: str
    child_speech_wer_pct: float  # Word Error Rate on child acoustic phonemes
    accent_robustness_score: float  # 0-100 on Pakistani English, Urdu, Punjabi
    noise_robustness_score: float  # 0-100 in 10-15dB SNR classrooms
    latency_p50_ms: int
    latency_p95_ms: int
    cost_per_1000_minutes_usd: float
    coppa_gdprk_zero_retention: bool
    punjabi_shahmukhi_tts_supported: bool
    verdict_for_youth: str


class BenchmarkSuiteResponse(BaseModel):
    benchmarks: List[ProviderBenchmark]
    unsupported_capabilities: List[str]
    recommended_hybrid_stack: str


class YouthLanguageMeta(BaseModel):
    code: str
    name: str
    native_name: str
    direction: str  # "rtl" or "ltr"
    script: str  # "Nastaliq", "Shahmukhi", "Latin"
    stt_status: str
    tts_status: str
    safety_phrases_reviewed: bool
    cultural_notes: str
