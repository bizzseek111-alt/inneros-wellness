"""Voice Domain Schemas.

Data contracts for speech transcription, real-time audio synthesis,
turn-taking, barge-in interruptions, and multilingual evaluation.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.gateways.voice.base import VoiceProfile, LanguageInfo, LanguageReadinessTier


class VoiceSynthesizeRequest(BaseModel):
    text: str
    voice_id: Optional[str] = "voice_sanctuary_calm"
    language: Optional[str] = "en-US"
    speed: Optional[float] = 1.0
    streaming: Optional[bool] = False


class VoiceSynthesizeResponse(BaseModel):
    audio_base64: str
    format: str
    duration_estimate_sec: float
    voice_id: str
    can_interrupt: bool = True
    non_diagnostic_notice: str = "Voice synthesis is purely psychoeducational; does not diagnose or detect emotion."


class VoiceTranscribeRequest(BaseModel):
    audio_base64: str
    language: Optional[str] = "en"
    simulate_noise: Optional[bool] = False


class VoiceTranscribeResponse(BaseModel):
    transcript: str
    language: str
    confidence: float
    uncertainty_flag: bool = False
    clarification_prompt: Optional[str] = None


class VoiceTurnRequest(BaseModel):
    """Real-time voice turn exchange."""
    user_utterance: Optional[str] = None
    audio_base64: Optional[str] = None
    voice_id: Optional[str] = "voice_sanctuary_calm"
    language: Optional[str] = "en"
    is_interruption: bool = False
    session_id: Optional[str] = None


class VoiceTurnResponse(BaseModel):
    turn_id: str
    transcript_user: str
    transcript_companion: str
    audio_base64: Optional[str] = None
    audio_format: str = "mp3"
    duration_estimate_sec: float = 2.5
    is_safety_escalation: bool = False
    safety_resources: List[Dict[str, str]] = Field(default_factory=list)
    clarification_requested: bool = False
    confidence_score: float = 1.0
    non_diagnostic_notice: str = "InnerOS never diagnoses mental health conditions or infers hidden emotion from vocal features."
    interruption_acknowledged: bool = False


class VoiceInterruptionRequest(BaseModel):
    session_id: str
    playback_position_ms: Optional[float] = 0.0


class VoiceInterruptionResponse(BaseModel):
    session_id: str
    audio_halted: bool = True
    resumed_listening: bool = True
    message: str = "Barge-in detected: Companion audio playback cancelled immediately."


class VoiceEvaluationResponse(BaseModel):
    total_cases: int
    passed_cases: int
    pass_rate_pct: float
    priority_languages_tested: List[str]
    results: List[Any]
