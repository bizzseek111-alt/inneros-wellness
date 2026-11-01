"""Safety Domain API Router.
Exposes real-time safety evaluation and regional emergency resource discovery.
"""

from fastapi import APIRouter, Depends
from app.domains.safety.schemas import (
    SafetyEvaluationRequest,
    SafetyEvaluationResponse,
    CrisisResource,
)
from app.domains.safety.evaluator import safety_evaluator
from app.domains.safety.hotlines import get_crisis_resources
from app.core.security import get_current_user, UserContext

router = APIRouter(prefix="/safety", tags=["Safety & Guardrails"])


@router.post("/evaluate", response_model=SafetyEvaluationResponse)
async def evaluate_safety(
    req: SafetyEvaluationRequest,
    user: UserContext = Depends(get_current_user),
):
    """Evaluates an utterance against hard non-clinical safety boundaries and crisis heuristics."""
    return safety_evaluator.evaluate(
        utterance=req.utterance,
        country_code=req.country_code or "US",
        language=req.language or "en",
        audio_snr_db=req.audio_snr_db,
        transcription_confidence=req.transcription_confidence,
    )


@router.get("/hotlines/{country_code}", response_model=list[CrisisResource])
async def list_hotlines(
    country_code: str = "US",
    user: UserContext = Depends(get_current_user),
):
    """Returns verified regional crisis hotlines for the specified ISO country code."""
    return get_crisis_resources(country_code)
