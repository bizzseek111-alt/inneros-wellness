"""Child Memory Isolation and Ephemeral Context Store.

STRICT ISOLATION GUARANTEES:
1. Adult memories and personal growth graphs are NEVER loaded or merged into child/teen sessions.
2. Conversation turns are stored in an in-memory, auto-expiring ephemeral store (24 hours TTL).
3. Raw audio is NEVER written to disk or permanent databases.
4. Caregiver visibility is strictly aggregated to non-sensitive themes (e.g., 'Emotion naming practice')
   without exposing private journal or chat transcripts, protecting developmental autonomy.
"""

import time
import hashlib
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field


class EphemeralTurn(BaseModel):
    turn_id: str
    timestamp: float
    user_snippet: str
    agent_snippet: str
    detected_language: str
    age_tier: str


class ChildEphemeralSession(BaseModel):
    session_id: str
    child_id_hash: str
    created_at: float
    last_activity_at: float
    turns: List[EphemeralTurn] = Field(default_factory=list)
    preferred_language: str = "en"
    turn_count: int = 0
    emotion_categories_touched: List[str] = Field(default_factory=list)


class YouthMemoryIsolationService:
    """Provides isolated, privacy-preserving ephemeral memory for youth companion turns."""

    def __init__(self, ttl_seconds: int = 86400):  # 24 hour TTL
        self._ttl_seconds = ttl_seconds
        # In-memory dictionary: session_id -> ChildEphemeralSession
        self._sessions: Dict[str, ChildEphemeralSession] = {}

    def _hash_id(self, identifier: str) -> str:
        return hashlib.sha256(identifier.encode("utf-8")).hexdigest()[:16]

    def get_or_create_session(
        self,
        session_id: str,
        user_id: str,
        preferred_language: str = "en"
    ) -> ChildEphemeralSession:
        """Retrieves or creates an isolated session context."""
        now = time.time()
        # Clean expired sessions first
        self._purge_expired(now)

        if session_id in self._sessions:
            session = self._sessions[session_id]
            session.last_activity_at = now
            return session

        child_hash = self._hash_id(user_id)
        session = ChildEphemeralSession(
            session_id=session_id,
            child_id_hash=child_hash,
            created_at=now,
            last_activity_at=now,
            preferred_language=preferred_language,
        )
        self._sessions[session_id] = session
        return session

    def record_turn(
        self,
        session_id: str,
        turn_id: str,
        user_utterance: str,
        agent_reply: str,
        language: str,
        age_tier: str,
        emotion_theme: Optional[str] = None
    ) -> int:
        """Records an ephemeral turn without persisting sensitive PII."""
        session = self._sessions.get(session_id)
        if not session:
            session = self.get_or_create_session(session_id=session_id, user_id="ephemeral_child", preferred_language=language)

        # Redact long text in ephemeral memory to minimize data surface
        user_redacted = user_utterance[:120] if user_utterance else ""
        agent_redacted = agent_reply[:140] if agent_reply else ""

        turn = EphemeralTurn(
            turn_id=turn_id,
            timestamp=time.time(),
            user_snippet=user_redacted,
            agent_snippet=agent_redacted,
            detected_language=language,
            age_tier=age_tier,
        )
        session.turns.append(turn)
        session.turn_count += 1
        session.last_activity_at = time.time()

        if emotion_theme and emotion_theme not in session.emotion_categories_touched:
            session.emotion_categories_touched.append(emotion_theme)

        # Enforce max 30 turns kept in memory window
        if len(session.turns) > 30:
            session.turns.pop(0)

        return session.turn_count

    def get_session_turn_count(self, session_id: str) -> int:
        session = self._sessions.get(session_id)
        return session.turn_count if session else 0

    def get_caregiver_theme_summary(self, session_id: str) -> Dict[str, Any]:
        """Provides non-sensitive aggregate emotional categories for the parent dashboard."""
        session = self._sessions.get(session_id)
        if not session:
            return {"active_themes": [], "total_turns": 0, "safety_status": "normal"}

        return {
            "active_themes": session.emotion_categories_touched,
            "total_turns": session.turn_count,
            "preferred_language": session.preferred_language,
            "safety_status": "normal",
        }

    def _purge_expired(self, current_time: float) -> None:
        expired_keys = [
            sid for sid, sess in self._sessions.items()
            if current_time - sess.last_activity_at > self._ttl_seconds
        ]
        for key in expired_keys:
            del self._sessions[key]


youth_memory_service = YouthMemoryIsolationService()
