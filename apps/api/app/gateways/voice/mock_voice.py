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


import io
import math
import struct
import wave
import httpx
from app.config import settings


def _generate_harmonic_wav_bytes(text: str, sample_rate: int = 16000) -> bytes:
    """Synthesizes a real, browser-playable 16-bit PCM RIFF WAV buffer with soothing formant harmonics
    modulated by the word-cadence rhythm of the companion's text.
    """
    words = max(1, len(text.split()))
    duration_sec = min(2.4, max(0.8, words * 0.14))
    total_samples = int(sample_rate * duration_sec)
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)  # 16-bit PCM
        wf.setframerate(sample_rate)
        frames = bytearray()
        for i in range(total_samples):
            t = i / sample_rate
            # Word-cadence amplitude envelope with gentle fade-in / fade-out
            fade = min(1.0, t / 0.08, (duration_sec - t) / 0.12)
            syllable_env = 0.55 + 0.45 * math.sin(2.0 * math.pi * 3.2 * t)
            # Warm grounding fundamental (174 Hz) + fifth (261 Hz) + octave (348 Hz)
            signal = (
                0.60 * math.sin(2.0 * math.pi * 174.0 * t)
                + 0.25 * math.sin(2.0 * math.pi * 261.6 * t)
                + 0.15 * math.sin(2.0 * math.pi * 348.0 * t)
            )
            sample_val = int(max(-32767, min(32767, signal * fade * syllable_env * 9500)))
            frames.extend(struct.pack("<h", sample_val))
        wf.writeframes(bytes(frames))
    return buf.getvalue()


class SyntheticVoiceEngine(BaseSTTProvider, BaseTTSProvider):
    """Provides live HTTP STT/TTS (Deepgram/OpenAI/ElevenLabs) when configured, with playable PCM WAV synthesis fallback."""

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

        # Live Deepgram STT adapter when DEEPGRAM_API_KEY is configured
        if settings.DEEPGRAM_API_KEY and request.audio_base64:
            try:
                audio_bytes = base64.b64decode(request.audio_base64)
                async with httpx.AsyncClient(timeout=12.0) as client:
                    resp = await client.post(
                        "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true",
                        headers={
                            "Authorization": f"Token {settings.DEEPGRAM_API_KEY}",
                            "Content-Type": "audio/wav",
                        },
                        content=audio_bytes,
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        alt = (
                            data.get("results", {})
                            .get("channels", [{}])[0]
                            .get("alternatives", [{}])[0]
                        )
                        transcript_live = alt.get("transcript", "").strip()
                        conf = float(alt.get("confidence", 0.95))
                        if transcript_live:
                            return TranscribeResponse(
                                transcript=transcript_live,
                                language=request.language or "en",
                                confidence=conf,
                                provider="deepgram_nova2",
                                uncertainty_flag=conf < 0.65,
                            )
            except Exception:
                pass

        # Standard transcript fallback
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
        # Live ElevenLabs TTS adapter when ELEVENLABS_API_KEY is configured
        if settings.ELEVENLABS_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=15.0) as client:
                    resp = await client.post(
                        f"https://api.elevenlabs.io/v1/text-to-speech/{settings.ELEVENLABS_VOICE_ID}",
                        headers={
                            "xi-api-key": settings.ELEVENLABS_API_KEY,
                            "Content-Type": "application/json",
                        },
                        json={"text": request.text, "model_id": "eleven_multilingual_v2"},
                    )
                    if resp.status_code == 200 and resp.content:
                        duration = max(1.2, len(request.text.split()) * 0.38)
                        return SynthesizeResponse(
                            audio_base64=base64.b64encode(resp.content).decode("ascii"),
                            format="mp3",
                            duration_estimate_sec=duration,
                            provider="elevenlabs_tts",
                            sample_rate_hz=24000,
                            can_interrupt=True,
                        )
            except Exception:
                pass

        # Generate real, playable 16-bit PCM RIFF WAV harmonic audio
        wav_bytes = _generate_harmonic_wav_bytes(request.text, sample_rate=16000)
        duration = max(1.2, len(request.text.split()) * 0.38)
        return SynthesizeResponse(
            audio_base64=base64.b64encode(wav_bytes).decode("ascii"),
            format="wav",
            duration_estimate_sec=duration,
            provider="inneros_harmonic_wav_tts",
            sample_rate_hz=16000,
            can_interrupt=True,
        )


synthetic_voice_engine = SyntheticVoiceEngine()
