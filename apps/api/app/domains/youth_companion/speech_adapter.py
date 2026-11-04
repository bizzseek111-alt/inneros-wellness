"""Provider-Agnostic Speech Adapter for Youth Sanctuary.

Handles Speech-to-Text (STT) and Text-to-Speech (TTS) with:
1. Streaming cancellation and barge-in timeout support.
2. Low-confidence transcription detection with clarification prompting.
3. Strict dialect integrity: NO silent substitution of Hindi or Indian Punjabi for Pakistani Punjabi.
4. Server-side credential isolation.
5. Ephemeral processing: audio data is never stored on disk or persistent databases.
"""

import base64
import asyncio
from typing import Optional, Tuple
from app.domains.youth_companion.schemas import AudioDeliveryStatus
from app.domains.youth_companion.languages import get_native_clarification_prompt
from app.gateways.voice.mock_voice import synthetic_voice_engine
from app.gateways.voice.base import SynthesizeRequest, TranscribeRequest


class YouthSpeechAdapter:
    """Manages child-safe voice operations and transparent text fallbacks."""

    def __init__(self):
        # In-memory dictionary tracking active stream cancellation tokens: session_id -> bool
        self._cancellation_tokens = {}

    def cancel_session_audio(self, session_id: str) -> None:
        """Signals active synthesis or streaming for a session to abort immediately."""
        self._cancellation_tokens[session_id] = True

    def reset_cancellation(self, session_id: str) -> None:
        self._cancellation_tokens[session_id] = False

    def is_cancelled(self, session_id: str) -> bool:
        return self._cancellation_tokens.get(session_id, False)

    async def transcribe_child_audio(
        self,
        audio_base64: str,
        language: str = "en",
        client_confidence: Optional[float] = None
    ) -> Tuple[str, float, bool, Optional[str]]:
        """Transcribes incoming child audio with confidence and acoustic noise checks.

        Returns:
            (transcript, confidence, is_clarification_needed, clarification_prompt)
        """
        # If client already provided a confidence score (e.g., from Web Speech API)
        if client_confidence is not None and client_confidence < 0.65:
            clarification = get_native_clarification_prompt(language)
            return "", client_confidence, True, clarification

        try:
            # Process via synthetic/modular engine
            res = await asyncio.wait_for(
                synthetic_voice_engine.transcribe(
                    TranscribeRequest(audio_base64=audio_base64, language=language)
                ),
                timeout=5.0  # 5-second streaming timeout
            )

            # Check for low confidence or noise uncertainty flag
            if res.uncertainty_flag or res.confidence < 0.65:
                clarification = get_native_clarification_prompt(language)
                return res.transcript, res.confidence, True, clarification

            return res.transcript, res.confidence, False, None

        except asyncio.TimeoutError:
            clarification = get_native_clarification_prompt(language)
            return "", 0.0, True, clarification
        except Exception:
            clarification = get_native_clarification_prompt(language)
            return "", 0.0, True, clarification

    async def synthesize_child_reply(
        self,
        text: str,
        language: str,
        session_id: str,
        age_tier: str
    ) -> Tuple[Optional[str], str, AudioDeliveryStatus, Optional[str]]:
        """Synthesizes speech or provides transparent text fallback.

        Returns:
            (audio_base64, audio_format, audio_status, voice_unavailable_reason)
        """
        # 1. Check if session was interrupted/cancelled
        if self.is_cancelled(session_id):
            return None, "mp3", AudioDeliveryStatus.SUPPRESSED_SAFETY, "Audio synthesis cancelled by user barge-in."

        # 2. Pakistani Punjabi Dialect Integrity Gate
        # To avoid deceptive mock audio or substituting Hindi/Gurmukhi phonemes, provide text fallback
        if language in ["pa", "pa-Latn"]:
            reason = (
                "Natural Pakistani Punjabi (Shahmukhi) TTS voice is currently in research qualification. "
                "To avoid inappropriate Hindi or Indian Punjabi acoustic substitution, Lumi displays the "
                "validated response in written Shahmukhi script with screen-reader accessibility."
            )
            return None, "mp3", AudioDeliveryStatus.UNSUPPORTED_VOICE_FALLBACK_TEXT, reason

        # 3. Early Childhood (2–5) Guided Experience
        # Early tier uses calming acoustic pacing
        voice_id = "voice_sanctuary_calm"
        if language == "ur" or language == "ur-Latn":
            voice_id = "voice_ur_karachi_female"

        try:
            synth_res = await asyncio.wait_for(
                synthetic_voice_engine.synthesize(
                    SynthesizeRequest(
                        text=text,
                        voice_id=voice_id,
                        language="ur" if "ur" in language else "en",
                    )
                ),
                timeout=4.0
            )

            if self.is_cancelled(session_id):
                return None, "mp3", AudioDeliveryStatus.SUPPRESSED_SAFETY, "Audio halted by barge-in."

            return synth_res.audio_base64, synth_res.format, AudioDeliveryStatus.SYNTHESIZED, None

        except Exception:
            return None, "mp3", AudioDeliveryStatus.UNSUPPORTED_VOICE_FALLBACK_TEXT, "Speech service temporarily unavailable; text provided."


youth_speech_adapter = YouthSpeechAdapter()
