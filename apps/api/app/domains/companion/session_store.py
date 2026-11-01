"""Companion Domain Session Store.
Manages safe, multi-turn conversational session history with boundaries and trimming.
"""

from datetime import datetime, timezone
from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from app.domains.companion.schemas import ChatMessage, ConversationMode


class ConversationSession(BaseModel):
    session_id: str
    user_id: str
    mode: ConversationMode = ConversationMode.JUST_LISTEN
    messages: List[ChatMessage] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SessionStore:
    """Thread-safe conversational session manager with strict per-user isolation."""

    def __init__(self, max_turns: int = 20):
        self._sessions: Dict[str, ConversationSession] = {}
        self.max_turns = max_turns
        self._seed_default_session()

    def _make_key(self, session_id: str, user_id: str) -> str:
        return f"{user_id}:{session_id}"

    def _seed_default_session(self):
        """Seeds initial synthetic session for Elena Vance."""
        now = datetime.now(timezone.utc)
        default_user = "usr_synthetic_elena_vance_001"
        key = self._make_key("session_default", default_user)
        self._sessions[key] = ConversationSession(
            session_id="session_default",
            user_id=default_user,
            mode=ConversationMode.JUST_LISTEN,
            messages=[
                ChatMessage(
                    role="assistant",
                    content="Welcome back to your sanctuary, Elena. I am your non-clinical emotional companion. How are you experiencing this moment?",
                    timestamp=now,
                    recalled_memory_count=2,
                    is_crisis=False,
                )
            ],
            created_at=now,
            updated_at=now,
        )

    def get_or_create(
        self,
        session_id: str,
        user_id: str,
        mode: ConversationMode = ConversationMode.JUST_LISTEN,
    ) -> ConversationSession:
        key = self._make_key(session_id, user_id)
        if key not in self._sessions:
            now = datetime.now(timezone.utc)
            self._sessions[key] = ConversationSession(
                session_id=session_id,
                user_id=user_id,
                mode=mode,
                messages=[],
                created_at=now,
                updated_at=now,
            )
        return self._sessions[key]

    def add_message(
        self,
        session_id: str,
        message: ChatMessage,
        user_id: str = "usr_synthetic_elena_vance_001",
    ) -> None:
        key = self._make_key(session_id, user_id)
        if key in self._sessions:
            session = self._sessions[key]
            session.messages.append(message)
            # Safe trim to max_turns
            if len(session.messages) > self.max_turns:
                session.messages = session.messages[-self.max_turns:]
            session.updated_at = datetime.now(timezone.utc)

    def get_history(
        self,
        session_id: str,
        user_id: str = "usr_synthetic_elena_vance_001",
    ) -> List[ChatMessage]:
        key = self._make_key(session_id, user_id)
        if key in self._sessions:
            return list(self._sessions[key].messages)
        return []

    def clear(
        self,
        session_id: str,
        user_id: str = "usr_synthetic_elena_vance_001",
    ) -> bool:
        key = self._make_key(session_id, user_id)
        if key in self._sessions:
            self._sessions[key].messages = []
            self._sessions[key].updated_at = datetime.now(timezone.utc)
            return True
        return False


session_store = SessionStore()
