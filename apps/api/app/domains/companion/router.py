"""Companion Domain API Router.
Endpoints for interactive conversational turns, SSE streaming, conversation modes,
session history management, and model benchmarking.
"""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from app.domains.companion.schemas import (
    ChatRequest,
    ChatResponse,
    ConversationMode,
    SessionHistoryResponse,
    BenchmarkRequest,
)
from app.domains.companion.service import companion_service
from app.domains.companion.session_store import session_store
from app.gateways.ai.gateway import ai_gateway
from app.core.security import get_current_user, UserContext

router = APIRouter(prefix="/companion", tags=["AI Companion & Dialogue"])


@router.post("/chat", response_model=ChatResponse)
async def companion_chat(
    req: ChatRequest,
    user: UserContext = Depends(get_current_user),
):
    """Processes an interactive companion conversation turn with non-clinical safety guardrails."""
    return await companion_service.chat(req, user)


@router.post("/chat/stream")
async def companion_chat_stream(
    req: ChatRequest,
    user: UserContext = Depends(get_current_user),
):
    """Streams companion conversational tokens via Server-Sent Events (SSE)."""
    return StreamingResponse(
        companion_service.stream_chat(req, user),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@router.get("/modes", response_model=List[Dict[str, Any]])
async def list_available_modes(user: UserContext = Depends(get_current_user)):
    """Returns the 5 defined companion conversation modes with intent, directives, and examples."""
    return [
        {
            "id": ConversationMode.JUST_LISTEN,
            "name": "Just Listen",
            "intent": "Pure, nonjudgmental presence and emotional space. Validates feelings with zero advice.",
            "allows_advice": False,
            "best_for": "Ventilating acute stress, grieving, processing difficult feelings without being 'fixed'.",
        },
        {
            "id": ConversationMode.HELP_ME_UNDERSTAND,
            "name": "Help Me Understand",
            "intent": "Clarifying exploration. Unpacks tangled thoughts, somatic triggers, and hidden needs.",
            "allows_advice": False,
            "best_for": "Reflecting on why a situation felt triggering or untangling conflicting emotions.",
        },
        {
            "id": ConversationMode.HELP_ME_SOLVE,
            "name": "Help Me Solve",
            "intent": "Values-aligned micro-action breakdown. Focuses on small, doable next steps.",
            "allows_advice": True,
            "best_for": "Overcoming paralysis on overwhelming projects or crafting respectful boundary scripts.",
        },
        {
            "id": ConversationMode.TEACH_ME,
            "name": "Teach Me",
            "intent": "Evidence-informed psychoeducation (ACT, Polyvagal Theory, cognitive reframing).",
            "allows_advice": True,
            "best_for": "Understanding the biology of stress, cognitive fusion, and psychological flexibility.",
        },
        {
            "id": ConversationMode.HELP_ME_SETTLE,
            "name": "Help Me Settle",
            "intent": "Immediate somatic regulation, 4-4-4-4 Box Breathing, and physical anchors.",
            "allows_advice": True,
            "best_for": "High physiological arousal, racing heart, restless mind before sleep, or panic sensations.",
        },
    ]


@router.get("/sessions/{session_id}", response_model=SessionHistoryResponse)
async def get_session_history(
    session_id: str,
    user: UserContext = Depends(get_current_user),
):
    """Retrieves conversational history for a persistent session."""
    session = session_store.get_or_create(session_id, user.user_id)
    return SessionHistoryResponse(
        session_id=session.session_id,
        mode=session.mode,
        messages=session.messages,
        created_at=session.created_at,
        updated_at=session.updated_at,
    )


@router.delete("/sessions/{session_id}")
async def clear_session_history(
    session_id: str,
    user: UserContext = Depends(get_current_user),
):
    """Resets conversational history for a session (safe privacy control)."""
    cleared = session_store.clear(session_id)
    if not cleared:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session '{session_id}' not found.",
        )
    return {"status": "cleared", "session_id": session_id}


@router.post("/benchmark")
async def benchmark_models(
    req: BenchmarkRequest,
    user: UserContext = Depends(get_current_user),
):
    """Runs a side-by-side benchmark across registered AI providers for a given prompt and mode."""
    results = await ai_gateway.benchmark(
        prompt=req.prompt,
        mode=req.mode or ConversationMode.JUST_LISTEN,
        language=req.language or "en",
    )
    return {"benchmark_prompt": req.prompt, "results": results}
