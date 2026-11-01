"""Companion Domain Schemas.
Data contracts for interactive multimodal dialogue, conversation modes,
tone calibration, session history, and benchmarking.
"""

from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from app.gateways.ai.base import ConversationMode
from app.domains.safety.schemas import SafetyEvaluationResponse


class ToneConfig(BaseModel):
    warmth_level: float = 0.8  # 0.0 (reserved/objective) to 1.0 (deeply gentle/nurturing)
    directness_level: float = 0.5  # 0.0 (spacious/exploratory) to 1.0 (crisp/focused)
    allow_advice: bool = True  # Explicit flag; forced false in just_listen or if user declined


class ChatMessage(BaseModel):
    role: str  # "user", "assistant", "system"
    content: str
    timestamp: Optional[datetime] = None
    is_crisis: Optional[bool] = False
    recalled_memory_count: Optional[int] = 0


class ChatRequest(BaseModel):
    session_id: Optional[str] = "session_default"
    utterance: str
    mode: ConversationMode = ConversationMode.JUST_LISTEN
    tone: ToneConfig = Field(default_factory=ToneConfig)
    language: Optional[str] = "en"
    country_code: Optional[str] = "US"
    stream: Optional[bool] = False


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    mode_used: ConversationMode
    safety_evaluation: SafetyEvaluationResponse
    recalled_memory_count: int = 0
    provider_used: str = "synthetic"
    model_used: str = "synthetic-inneros-v1"
    timestamp: datetime
    advice_omitted: bool = False


class SessionHistoryResponse(BaseModel):
    session_id: str
    mode: ConversationMode
    messages: List[ChatMessage]
    created_at: datetime
    updated_at: datetime


class BenchmarkRequest(BaseModel):
    prompt: str
    mode: Optional[ConversationMode] = ConversationMode.JUST_LISTEN
    language: Optional[str] = "en"
