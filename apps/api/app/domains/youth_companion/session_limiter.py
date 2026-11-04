"""Usage Controls, Anti-Addiction Safeguards, and Rate Limiting.

DEVELOPMENTAL ETHICS:
InnerOS Kids & Teens explicitly rejects dark patterns, endless chat loops,
and emotional dependency. Sessions are bounded with healthy offline transition prompts.
"""

import time
from typing import Tuple, Optional, Dict
from app.config import settings


class YouthSessionLimiter:
    """Enforces turn limits, anti-fatigue wind-downs, and rate limits."""

    def __init__(self):
        # session_id -> list of timestamps for rate-limiting
        self._request_timestamps: Dict[str, list] = {}

    def check_rate_limit(self, session_id: str, max_per_minute: int = 30) -> bool:
        """Returns True if within rate limit, False if exceeded."""
        now = time.time()
        timestamps = self._request_timestamps.get(session_id, [])
        # Keep only timestamps in last 60 seconds
        timestamps = [t for t in timestamps if now - t < 60]
        if len(timestamps) >= max_per_minute:
            return False
        timestamps.append(now)
        self._request_timestamps[session_id] = timestamps
        return True

    def check_session_limits(
        self,
        session_id: str,
        current_turn: int,
        age_tier: str
    ) -> Tuple[bool, Optional[str], Optional[str]]:
        """Checks if session limit or wind-down warning applies.

        Returns:
            (is_limit_reached, wind_down_notice, closing_agent_utterance)
        """
        max_turns = (
            settings.YOUTH_MAX_TURNS_PER_SESSION_TEENS
            if age_tier == "teen"
            else settings.YOUTH_MAX_TURNS_PER_SESSION_KIDS
        )

        # 1. Limit Reached
        if current_turn >= max_turns:
            closing = (
                "You did such a wonderful job sharing your thoughts and feelings today! "
                "Lumi is going to rest now so you can give your eyes a break. "
                "It's a great time to step outside, draw a picture, read a book, or chat with your family. "
                "See you next time!"
            )
            return True, "Session time limit reached. Time for healthy offline play!", closing

        # 2. Wind-down notification (2 turns before limit)
        if current_turn >= max_turns - 2:
            notice = "We have just a couple of turns left today before taking an offline rest break."
            return False, notice, None

        return False, None, None


youth_session_limiter = YouthSessionLimiter()
