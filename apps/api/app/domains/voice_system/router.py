"""FastAPI Router for Voice System Provider Abstraction."""

from typing import List
from fastapi import APIRouter, HTTPException, status

from app.domains.voice_system.schemas import (
    CharacterVoiceProfile,
    VoiceSynthesizeRequest,
    VoiceSynthesizeResponse,
    VoiceProviderEvaluation,
)
from app.domains.voice_system.service import voice_system_service

router = APIRouter(prefix="/voice-system", tags=["Voice System & Character Profiles"])


@router.get("/profiles", response_model=List[CharacterVoiceProfile])
async def list_voice_profiles():
    """Lists voice profiles for all 4 AI friends (Kai, Mia, Lumi, Zayn)."""
    return voice_system_service.list_character_profiles()


@router.get("/profiles/{character_id}", response_model=CharacterVoiceProfile)
async def get_voice_profile(character_id: str):
    """Retrieves voice profile, provider settings, and SLA for a specific character."""
    profile = voice_system_service.get_character_profile(character_id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character profile not found")
    return profile


@router.post("/synthesize", response_model=VoiceSynthesizeResponse)
async def synthesize_speech(req: VoiceSynthesizeRequest):
    """Synthesizes speech with multi-provider failover (OpenAI, ElevenLabs, Azure, WebSpeech)."""
    try:
        return await voice_system_service.synthesize(req)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/evaluations", response_model=List[VoiceProviderEvaluation])
async def get_provider_evaluations():
    """Returns comparative latency, MOS naturalness scores, and Punjabi review criteria."""
    return voice_system_service.get_evaluations()
