"""Voice System Schemas & Provider Abstraction Contracts for Weebly V8 (Module 14)."""

from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class VoiceProviderType(str, Enum):
    OPENAI_REALTIME = "openai_realtime"
    ELEVENLABS = "elevenlabs"
    AZURE_SPEECH = "azure_speech"
    WEBSPEECH = "webspeech"


class CharacterVoiceProfile(BaseModel):
    character_id: str  # kai, mia, lumi, zayn
    character_name: str
    primary_provider: VoiceProviderType = VoiceProviderType.OPENAI_REALTIME
    model: str = "gpt-4o-realtime"
    voice_id: str = "alloy"
    languages_supported: List[str] = Field(default_factory=lambda: ["en", "ur", "pa"])
    speaking_rate: float = 0.95  # Slower, clearer child pace
    style_prompt: str = "warm, encouraging, cheerful, patient"
    fallback_provider: VoiceProviderType = VoiceProviderType.WEBSPEECH
    approved_status: str = "approved"  # approved, testing, drafted
    native_speaker_validated: bool = True  # Required for Pakistani Punjabi production claim
    latency_sla_ms: int = 400


class VoiceSynthesizeRequest(BaseModel):
    character_id: str = "kai"
    text: str
    language: str = "en"  # en, ur, pa
    preferred_provider: Optional[VoiceProviderType] = None
    session_id: Optional[str] = None


class VoiceSynthesizeResponse(BaseModel):
    character_id: str
    provider_used: VoiceProviderType
    audio_base64: Optional[str] = None
    audio_format: str = "audio/mp3"
    fallback_engaged: bool = False
    fallback_reason: Optional[str] = None
    language: str
    latency_ms: int
    duration_seconds: float
    is_client_webspeech_recommended: bool = False


class VoiceProviderEvaluation(BaseModel):
    provider: VoiceProviderType
    supported_languages: List[str]
    naturalness_score_mos: float  # Mean Opinion Score (1-5)
    mean_latency_ms: int
    punjabi_native_review: str
    recommended_use_case: str
