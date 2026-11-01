"""Voice Domain API Router.

Endpoints for multilingual voice companion interactions:
- Voice profiles & 30 architected languages
- Real-time turn processing with streaming crisis safety
- Barge-in interruption cancellation
- Evaluation benchmark harness
"""

import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.domains.voice.schemas import (
    VoiceSynthesizeRequest,
    VoiceSynthesizeResponse,
    VoiceTranscribeRequest,
    VoiceTranscribeResponse,
    VoiceTurnRequest,
    VoiceTurnResponse,
    VoiceInterruptionRequest,
    VoiceInterruptionResponse,
    VoiceEvaluationResponse,
)
from app.gateways.voice.base import VoiceProfile, LanguageInfo, TranscribeRequest, SynthesizeRequest
from app.gateways.voice.mock_voice import synthetic_voice_engine, MULTILINGUAL_VOICE_PROFILES
from app.domains.voice.languages import ARCHITECTED_LANGUAGES, get_language_by_code
from app.domains.voice.evaluation import voice_evaluation_harness
from app.core.security import get_current_user, UserContext

router = APIRouter(prefix="/voice", tags=["Multimodal Voice Pipeline"])


@router.get("/profiles", response_model=List[VoiceProfile])
async def list_voice_profiles(user: UserContext = Depends(get_current_user)):
    """Returns the 8 available multilingual voice profiles."""
    return MULTILINGUAL_VOICE_PROFILES


@router.get("/languages", response_model=List[LanguageInfo])
async def list_languages(user: UserContext = Depends(get_current_user)):
    """Returns the 30 architected languages with their readiness tiers and non-clinical caveats."""
    return ARCHITECTED_LANGUAGES


@router.post("/transcribe", response_model=VoiceTranscribeResponse)
async def transcribe_audio(
    req: VoiceTranscribeRequest,
    user: UserContext = Depends(get_current_user),
):
    """Transcribes an audio chunk, returning confidence and potential noise uncertainty flags."""
    sim_lang = req.language or "en"
    if req.simulate_noise:
        sim_lang = f"{sim_lang}_noise"

    res = await synthetic_voice_engine.transcribe(
        TranscribeRequest(audio_base64=req.audio_base64, language=sim_lang)
    )
    return VoiceTranscribeResponse(
        transcript=res.transcript,
        language=res.language,
        confidence=res.confidence,
        uncertainty_flag=res.uncertainty_flag,
        clarification_prompt=res.clarification_prompt,
    )


@router.post("/synthesize", response_model=VoiceSynthesizeResponse)
async def synthesize_speech(
    req: VoiceSynthesizeRequest,
    user: UserContext = Depends(get_current_user),
):
    """Synthesizes text into audio with can_interrupt barge-in support and non-diagnostic notices."""
    res = await synthetic_voice_engine.synthesize(
        SynthesizeRequest(
            text=req.text,
            voice_id=req.voice_id or "voice_sanctuary_calm",
            language=req.language or "en-US",
            speed=req.speed or 1.0,
            streaming=req.streaming or False,
        )
    )
    return VoiceSynthesizeResponse(
        audio_base64=res.audio_base64,
        format=res.format,
        duration_estimate_sec=res.duration_estimate_sec,
        voice_id=req.voice_id or "voice_sanctuary_calm",
        can_interrupt=True,
    )


@router.post("/turn", response_model=VoiceTurnResponse)
async def execute_voice_turn(
    req: VoiceTurnRequest,
    user: UserContext = Depends(get_current_user),
):
    """Executes a real-time conversational voice turn.

    CRITICAL SAFETY & GOVERNANCE:
    1. High-priority crisis safety check is evaluated BEFORE audio generation.
    2. If crisis detected, immediately interrupts speech synthesis and returns crisis hotlines.
    3. Low confidence transcription triggers gentle safe clarification rather than guessing.
    4. Explicit non-diagnostic notice disclaims clinical voice emotion detection.
    """
    user_text = req.user_utterance or ""

    # If audio was sent without pre-transcribed text, transcribe first
    confidence = 1.0
    clarification_requested = False
    if req.audio_base64 and not user_text:
        trans_res = await synthetic_voice_engine.transcribe(
            TranscribeRequest(audio_base64=req.audio_base64, language=req.language)
        )
        user_text = trans_res.transcript
        confidence = trans_res.confidence
        if trans_res.uncertainty_flag:
            clarification_requested = True

    # 1. High-Priority Safety Check (Evaluated before speech synthesis)
    crisis_keywords = [
        "end it", "pills", "zindagi khatam", "край на живота", "إنهاء حياتي",
        "jaan lene", "quitarme la vida", "terminar con mi vida", "me suicider",
        "leben ein ende", "beende mein leben", "nicht mehr leben", "die tonight",
        "suicide", "kill myself", "want to die"
    ]
    is_crisis = any(k in user_text.lower() for k in crisis_keywords)

    if is_crisis:
        # Emergency safety intervention
        return VoiceTurnResponse(
            turn_id=f"turn_{uuid.uuid4().hex[:8]}",
            transcript_user=user_text,
            transcript_companion="I hear how much pain you are holding right now. Your safety and life matter deeply to me. Please connect with emergency human support immediately.",
            audio_base64=None,  # Audio generation intentionally suppressed for crisis safety
            is_safety_escalation=True,
            safety_resources=[
                {"name": "988 Suicide & Crisis Lifeline (US/CA)", "contact": "Call or Text 988"},
                {"name": "Umang Mental Health Helpline (Pakistan)", "contact": "0311-7786264"},
                {"name": "Bulgaria National Emergency", "contact": "Dial 112"},
                {"name": "AASRA Helpline (India)", "contact": "91-9820466726"},
                {"name": "Crisis Text Line", "contact": "Text HOME to 741741"},
            ],
            confidence_score=confidence,
            non_diagnostic_notice="InnerOS never diagnoses mental health conditions from vocal features.",
        )

    # 2. Low-Confidence / Noisy Audio Clarification Fallback
    if clarification_requested or confidence < 0.65:
        return VoiceTurnResponse(
            turn_id=f"turn_{uuid.uuid4().hex[:8]}",
            transcript_user=user_text,
            transcript_companion="I want to make sure I heard you clearly without assuming. The audio was a bit unclear—could you repeat that gently, or type it below?",
            audio_base64=None,
            clarification_requested=True,
            confidence_score=confidence,
        )

    # 3. Handle Barge-in Interruption
    if req.is_interruption:
        return VoiceTurnResponse(
            turn_id=f"turn_{uuid.uuid4().hex[:8]}",
            transcript_user=user_text,
            transcript_companion="I stopped speaking. I'm listening to you.",
            interruption_acknowledged=True,
            confidence_score=confidence,
        )

    # 4. Standard Companion Reflective Response
    lang_info = get_language_by_code(req.language or "en")
    companion_reply = "I hear you. It sounds like you are carrying significant demands today. Let's take a calm pause together."
    if lang_info.code == "ur":
        companion_reply = "Main aap ki baat samajh raha hoon. Lagta hai aaj aap par kafi bojh hai. Chaliye ek lamha sakoon se thehertay hain."
    elif lang_info.code == "bg":
        companion_reply = "Чувам те. Изглежда носиш голямо напрежение днес. Нека спрем за миг и поемем дълбоко дъх заедно."
    elif lang_info.code == "ar":
        companion_reply = "أنا أسمعك بكل هدوء. يبدو أنك تحمل الكثير اليوم. دعنا نأخذ وقفة هادئة معاً."
    elif lang_info.code == "hi":
        companion_reply = "Main aapki baat samajh raha hoon. Aaj kafi tanaav mehsoos ho raha hai. Chaliye thoda ruk kar shaanti se sochte hain."
    elif lang_info.code == "es":
        companion_reply = "Te escucho con calma. Parece que ha sido un día con bastante peso emocional. Tomemos una pausa juntos."
    elif lang_info.code == "fr":
        companion_reply = "Je vous écoute avec bienveillance. On ressent la fatigue de cette journée. Prenons un instant de répit ensemble."
    elif lang_info.code == "de":
        companion_reply = "Ich höre dir in Ruhe zu. Es klingt, als hättest du heute viel getragen. Lass uns einen Moment durchatmen."

    # Synthesize audio
    synth_res = await synthetic_voice_engine.synthesize(
        SynthesizeRequest(
            text=companion_reply,
            voice_id=req.voice_id or "voice_sanctuary_calm",
            language=req.language or "en",
        )
    )

    return VoiceTurnResponse(
        turn_id=f"turn_{uuid.uuid4().hex[:8]}",
        transcript_user=user_text,
        transcript_companion=companion_reply,
        audio_base64=synth_res.audio_base64,
        duration_estimate_sec=synth_res.duration_estimate_sec,
        confidence_score=confidence,
    )


@router.post("/session/interruption", response_model=VoiceInterruptionResponse)
async def handle_voice_interruption(
    req: VoiceInterruptionRequest,
    user: UserContext = Depends(get_current_user),
):
    """Barge-In endpoint: Immediately halts companion audio playback and resumes listening."""
    return VoiceInterruptionResponse(
        session_id=req.session_id,
        audio_halted=True,
        resumed_listening=True,
    )


@router.get("/evaluation/benchmarks", response_model=VoiceEvaluationResponse)
async def get_voice_evaluation_benchmarks(user: UserContext = Depends(get_current_user)):
    """Runs the voice evaluation harness across dialects, code-switching, noise, barge-in, and crisis."""
    results = voice_evaluation_harness.run_all()
    passed_count = sum(1 for r in results if r.passed)
    return VoiceEvaluationResponse(
        total_cases=len(results),
        passed_cases=passed_count,
        pass_rate_pct=round((passed_count / len(results)) * 100, 1),
        priority_languages_tested=["en", "ur", "bg", "ar", "hi", "es", "fr", "de"],
        results=results,
    )
