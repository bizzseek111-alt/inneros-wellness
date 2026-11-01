"""Modular Voice Gateway Interface.

Defines Speech-to-Text (STT), Text-to-Speech (TTS), Language Tiers,
and Audio Processing contracts for the InnerOS voice companion.
"""

from abc import ABC, abstractmethod
from typing import Optional, List, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field


class LanguageReadinessTier(str, Enum):
    """Rigorous classification of multilingual readiness.

    InnerOS never claims a language is production-ready merely because a speech API supports it.
    """
    TIER_1_CLINICALLY_REVIEWED = "tier_1_clinically_reviewed"  # Fully benchmarked, culturally reviewed
    TIER_2_QUALIFIED_REGIONAL = "tier_2_qualified_regional"      # Regional dialect support with caveats
    TIER_3_EXPERIMENTAL = "tier_3_experimental"                # Experimental / API-enabled only (Beta)


class VoiceProfile(BaseModel):
    id: str
    name: str
    language: str  # ISO code (e.g., "en-US", "ur-PK", "bg-BG", "ar-SA")
    gender: str
    sample_rate_hz: int = 24000
    tone_characteristics: List[str] = Field(default_factory=lambda: ["calm", "grounding"])
    pitch_semitones: float = 0.0
    speed_multiplier: float = 1.0
    regional_accent: Optional[str] = None
    description: str = ""


class TranscribeRequest(BaseModel):
    audio_base64: str
    language: Optional[str] = "en"
    format: str = "webm"
    is_stream_chunk: bool = False


class TranscribeResponse(BaseModel):
    transcript: str
    language: str
    confidence: float
    provider: str
    is_final: bool = True
    uncertainty_flag: bool = False
    clarification_prompt: Optional[str] = None


class SynthesizeRequest(BaseModel):
    text: str
    voice_id: str = "voice_sanctuary_calm"
    language: str = "en"
    speed: float = 1.0
    streaming: bool = False


class SynthesizeResponse(BaseModel):
    audio_base64: str
    format: str = "mp3"
    duration_estimate_sec: float
    provider: str
    sample_rate_hz: int = 24000
    can_interrupt: bool = True


class BaseSTTProvider(ABC):
    @abstractmethod
    async def transcribe(self, request: TranscribeRequest) -> TranscribeResponse:
        pass


class BaseTTSProvider(ABC):
    @abstractmethod
    async def synthesize(self, request: SynthesizeRequest) -> SynthesizeResponse:
        pass


class LanguageInfo(BaseModel):
    code: str
    name: str
    native_name: str
    tier: LanguageReadinessTier
    direction: str = "ltr"  # "ltr" or "rtl"
    dialects: List[str] = Field(default_factory=list)
    clinical_safety_reviewed: bool = False
    caveats: Optional[str] = None
