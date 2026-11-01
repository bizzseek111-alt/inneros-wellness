"""Synthetic Multilingual Voice Provider Implementation.

Simulates speech transcription, real-time synthesis, turn-taking, and streaming safety
without external cloud dependencies or API keys.
"""

import base64
import uuid
from typing import List, Optional
from app.gateways.voice.base import (
    BaseSTTProvider,
    BaseTTSProvider,
    TranscribeRequest,
    TranscribeResponse,
    SynthesizeRequest,
    SynthesizeResponse,
    VoiceProfile,
)

MULTILINGUAL_VOICE_PROFILES: List[VoiceProfile] = [
    # English Profiles
    VoiceProfile(
        id="voice_sanctuary_calm",
        name="Sanctuary Calm",
        language="en-US",
        gender="neutral",
        sample_rate_hz=24000,
        tone_characteristics=["gentle", "deliberate", "soothing"],
        pitch_semitones=0.0,
        speed_multiplier=0.95,
        regional_accent="General American",
        description="Centered, balanced pacing designed to reduce sympathetic nervous activation.",
    ),
    VoiceProfile(
        id="voice_aurora_warm",
        name="Aurora Warmth",
        language="en-US",
        gender="female",
        sample_rate_hz=24000,
        tone_characteristics=["warm", "empathetic", "compassionate"],
        pitch_semitones=1.2,
        speed_multiplier=1.0,
        regional_accent="Mid-Atlantic",
        description="Warm emotional presence with gentle inflection for self-compassion dialogue.",
    ),
    VoiceProfile(
        id="voice_atlas_ground",
        name="Atlas Ground",
        language="en-US",
        gender="male",
        sample_rate_hz=24000,
        tone_characteristics=["deep", "steady", "anchoring"],
        pitch_semitones=-2.0,
        speed_multiplier=0.92,
        regional_accent="Pacific Northwest",
        description="Resonant low timbre providing a grounding somatic anchor during overwhelm.",
    ),

    # Urdu Profiles (Nastaliq Cadence)
    VoiceProfile(
        id="voice_meher_urdu",
        name="Meher Nastaliq (مہر)",
        language="ur-PK",
        gender="female",
        sample_rate_hz=24000,
        tone_characteristics=["serene", "poetic", "respectful"],
        pitch_semitones=0.5,
        speed_multiplier=0.95,
        regional_accent="Standard Pakistani Urdu (Karachi)",
        description="Graceful, respectful Urdu cadence adhering to cultural adab in emotional dialogue.",
    ),
    VoiceProfile(
        id="voice_tariq_urdu",
        name="Tariq Khayal (طارق)",
        language="ur-PK",
        gender="male",
        sample_rate_hz=24000,
        tone_characteristics=["grounded", "gentle", "reflective"],
        pitch_semitones=-1.5,
        speed_multiplier=0.93,
        regional_accent="Pakistani Urban (Lahori standard)",
        description="Calm, unhurried Urdu presence with deep emotional containment.",
    ),

    # Bulgarian Profile (Cyrillic Cadence)
    VoiceProfile(
        id="voice_sofia_bulgarian",
        name="Sofia Spokoy (София)",
        language="bg-BG",
        gender="female",
        sample_rate_hz=24000,
        tone_characteristics=["calm", "clear", "supportive"],
        pitch_semitones=0.2,
        speed_multiplier=0.98,
        regional_accent="Standard Bulgarian (Sofia)",
        description="Clear, reassuring Bulgarian cadence calibrated for non-clinical reflective pacing.",
    ),

    # Arabic Profile (Modern Standard Arabic & Levantine Cadence)
    VoiceProfile(
        id="voice_layla_arabic",
        name="Layla Rawda (ليلى)",
        language="ar-SA",
        gender="female",
        sample_rate_hz=24000,
        tone_characteristics=["soothing", "warm", "receptive"],
        pitch_semitones=0.4,
        speed_multiplier=0.95,
        regional_accent="Modern Standard Arabic / Gulf Levantine",
        description="Gentle Arabic cadence respecting cultural emotional expression and pauses.",
    ),

    # Hindi Profile (Devanagari & Hinglish Cadence)
    VoiceProfile(
        id="voice_aarav_hindi",
        name="Aarav Shanti (आरव)",
        language="hi-IN",
        gender="male",
        sample_rate_hz=24000,
        tone_characteristics=["tranquil", "deliberate", "mindful"],
        pitch_semitones=-1.0,
        speed_multiplier=0.95,
        regional_accent="Standard Indian Hindi (Khariboli)",
        description="Tranquil Hindi voice capable of natural Hinglish conversational pacing.",
    ),
]

# Backward compatibility alias
SYNTHETIC_VOICE_PROFILES = MULTILINGUAL_VOICE_PROFILES


class SyntheticVoiceEngine(BaseSTTProvider, BaseTTSProvider):
    """Provides synthetic voice capabilities for offline development, tests, and CI."""

    async def transcribe(self, request: TranscribeRequest) -> TranscribeResponse:
        # Check for simulated noise or low confidence
        if "noise" in (request.language or "").lower():
            return TranscribeResponse(
                transcript="[Audio unclear due to background noise]",
                language=request.language or "en",
                confidence=0.45,
                provider="synthetic_stt",
                uncertainty_flag=True,
                clarification_prompt="I want to make sure I heard you clearly without assuming. The audio had background noise—could you repeat that gently, or type it below?",
            )

        # Standard simulated transcript
        default_text = "I have been feeling quite overwhelmed with my work deadlines this week."
        if request.language == "ur":
            default_text = "Main aaj bohot thaka hua hoon, kaam mein bohot tension thi."
        elif request.language == "bg":
            default_text = "Чувствам се доста изтощен от работата тази седмица."
        elif request.language == "ar":
            default_text = "أشعر بضغط كبير من العمل هذه الأيام."
        elif request.language == "hi":
            default_text = "Main is hafte kaam ke bohot pressure mein feel kar raha tha."

        return TranscribeResponse(
            transcript=default_text,
            language=request.language or "en",
            confidence=0.98,
            provider="synthetic_stt",
            uncertainty_flag=False,
        )

    async def synthesize(self, request: SynthesizeRequest) -> SynthesizeResponse:
        # Minimal valid synthetic MP3/ID3 header with frame sync
        synthetic_audio = (
            b"ID3\x04\x00\x00\x00\x00\x00#TSSE\x00\x00\x00\x0e\x00\x00\x03InnerOSVoicePayload"
            b"\xff\xfb\x90d\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
        )
        duration = max(1.2, len(request.text.split()) * 0.38)
        return SynthesizeResponse(
            audio_base64=base64.b64encode(synthetic_audio).decode("ascii"),
            format="mp3",
            duration_estimate_sec=duration,
            provider="synthetic_tts",
            sample_rate_hz=24000,
            can_interrupt=True,
        )


synthetic_voice_engine = SyntheticVoiceEngine()
