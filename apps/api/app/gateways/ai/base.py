"""Modular AI Provider Gateway Base Interface.
Defines contracts for multi-model fallback, conversation modes, tone calibration,
benchmarking, and streaming dialogue generation.
"""

from abc import ABC, abstractmethod
from enum import Enum
from typing import List, Dict, Any, Optional, AsyncIterator
from pydantic import BaseModel, Field


class ConversationMode(str, Enum):
    JUST_LISTEN = "just_listen"
    HELP_ME_UNDERSTAND = "help_me_understand"
    HELP_ME_SOLVE = "help_me_solve"
    TEACH_ME = "teach_me"
    HELP_ME_SETTLE = "help_me_settle"


class Message(BaseModel):
    role: str  # "system", "user", "assistant"
    content: str


class CompletionRequest(BaseModel):
    messages: List[Message]
    mode: ConversationMode = ConversationMode.JUST_LISTEN
    warmth: float = 0.8  # 0.0 (reserved/objective) to 1.0 (deeply gentle/nurturing)
    directness: float = 0.5  # 0.0 (spacious/exploratory) to 1.0 (crisp/focused)
    allow_advice: bool = True  # Strict false in just_listen or if user declined
    language: str = "en"  # "en", "es", "fr", "de", "ar", "ja"
    temperature: float = 0.7
    max_tokens: int = 600
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    stream: bool = False
    metadata: Dict[str, Any] = Field(default_factory=dict)


class CompletionResponse(BaseModel):
    content: str
    provider: str
    model: str
    tokens_used: int
    finish_reason: str = "stop"
    mode_applied: ConversationMode = ConversationMode.JUST_LISTEN
    latency_ms: float = 0.0


class ProviderBenchmarkResult(BaseModel):
    provider_name: str
    model_name: str
    prompt: str
    response_preview: str
    tokens_used: int
    latency_ms: float
    is_safe: bool
    mode_adherent: bool


class BaseAIProvider(ABC):
    """Abstract base class for all AI model providers (Claude, OpenAI, Gemini, Synthetic)."""

    provider_name: str = "base"
    default_model: str = "unknown"

    @abstractmethod
    async def complete(self, request: CompletionRequest) -> CompletionResponse:
        """Executes a single conversational completion."""
        pass

    @abstractmethod
    async def stream_complete(self, request: CompletionRequest) -> AsyncIterator[str]:
        """Streams completion tokens as they are generated."""
        pass

    async def health_check(self) -> bool:
        """Returns True if provider backend is reachable and operating."""
        return True
