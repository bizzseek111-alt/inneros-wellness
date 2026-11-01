"""Integrations Domain API Router.
Endpoints for user-controlled third-party data preview, 8-step ingestion pipeline,
OAuth 2.0 cloud connectors, and Phase 2 architectural specifications.
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from app.domains.integrations.schemas import (
    ImportPreviewRequest,
    ImportPreviewResponse,
    ImportUploadRequest,
    ImportBatchResponse,
    BatchSelectionUpdateRequest,
    ConfirmImportRequest,
    ConfirmImportResponse,
    OAuthConnection,
    CalendarSyncResponse,
    PhaseTwoArchitectureSpec,
)
from app.domains.integrations.service import integrations_service
from app.core.security import get_current_user, UserContext

router = APIRouter(prefix="/integrations", tags=["External Integrations & Ingest"])


# --- Backward-Compatible Preview Endpoint ---

@router.post("/import/preview", response_model=ImportPreviewResponse)
async def preview_import(
    req: ImportPreviewRequest,
    user: UserContext = Depends(get_current_user),
):
    """Previews an external export (ChatGPT/Claude/Calendar/Docs) with client-side & server-side PII scrubbing."""
    return integrations_service.preview_import(req)


# --- 8-Step Pipeline Endpoints ---

@router.post("/import/upload", response_model=ImportBatchResponse, status_code=status.HTTP_201_CREATED)
async def upload_import_batch(
    req: ImportUploadRequest,
    user: UserContext = Depends(get_current_user),
):
    """Step 1 & 2: Securely uploads, parses, scrubs PII, scans prompt injections, and extracts candidate memories."""
    return integrations_service.create_upload_batch(user.user_id, req)


@router.get("/import/batches/{batch_id}", response_model=ImportBatchResponse)
async def get_staged_batch(
    batch_id: str,
    user: UserContext = Depends(get_current_user),
):
    """Step 3: Retrieves a staged batch with parsed items and candidate memories for review."""
    batch = integrations_service.get_staged_batch(user.user_id, batch_id)
    if not batch:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staged batch not found")
    return batch


@router.put("/import/batches/{batch_id}/selection", response_model=ImportBatchResponse)
async def update_batch_selection(
    batch_id: str,
    req: BatchSelectionUpdateRequest,
    user: UserContext = Depends(get_current_user),
):
    """Step 3: Updates user selective inclusion/exclusion of individual items in the staged batch."""
    batch = integrations_service.update_batch_selection(
        user.user_id, batch_id, req.item_ids_to_include, req.item_ids_to_exclude
    )
    if not batch:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staged batch not found")
    return batch


@router.post("/import/batches/{batch_id}/confirm", response_model=ConfirmImportResponse)
async def confirm_import_batch(
    batch_id: str,
    req: ConfirmImportRequest,
    user: UserContext = Depends(get_current_user),
):
    """Step 6 & 7: User explicitly approves candidate memories for long-term storage with full provenance."""
    try:
        return integrations_service.confirm_import_batch(
            user.user_id,
            batch_id,
            req.approved_candidate_ids,
            req.rejected_candidate_ids,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.delete("/import/batches/{batch_id}", response_model=Dict[str, Any])
async def revoke_import_batch(
    batch_id: str,
    user: UserContext = Depends(get_current_user),
):
    """Step 8: Revokes an import batch and executes GDPR Article 17 cascade purge of all derived memories."""
    try:
        return integrations_service.revoke_import_batch(user.user_id, batch_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# --- Google Calendar & OAuth 2.0 Connectors ---

@router.get("/oauth/connections", response_model=List[OAuthConnection])
async def list_oauth_connections(user: UserContext = Depends(get_current_user)):
    """Lists active third-party cloud OAuth connections."""
    return integrations_service.list_oauth_connections(user.user_id)


@router.post("/oauth/initiate", response_model=Dict[str, str])
async def initiate_oauth(
    provider: str = Query("google_calendar"),
    user: UserContext = Depends(get_current_user),
):
    """Generates an explicit OAuth authorization URL with minimal read-only scopes."""
    return integrations_service.initiate_oauth_flow(user.user_id, provider=provider)


@router.post("/oauth/callback", response_model=OAuthConnection)
async def complete_oauth_callback(
    provider: str = Body(..., embed=True),
    code: str = Body(..., embed=True),
    state_token: str = Body(..., embed=True),
    user: UserContext = Depends(get_current_user),
):
    """Completes OAuth handshake and securely encrypts access/refresh tokens with user DEK."""
    return integrations_service.complete_oauth_callback(
        user.user_id, provider, code, state_token
    )


@router.post("/oauth/sync/{connection_id}", response_model=CalendarSyncResponse)
async def sync_calendar(
    connection_id: str,
    user: UserContext = Depends(get_current_user),
):
    """Synchronizes Google Calendar events and computes preparation buffers without mutating external calendar."""
    try:
        return integrations_service.sync_google_calendar(user.user_id, connection_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.delete("/oauth/{connection_id}", response_model=Dict[str, Any])
async def revoke_oauth_connection(
    connection_id: str,
    purge_imported_memories: bool = Query(True),
    user: UserContext = Depends(get_current_user),
):
    """Immediately revokes access, destroys stored encrypted tokens, and disconnects provider."""
    try:
        return integrations_service.revoke_oauth_connection(
            user.user_id, connection_id, purge_imported_memories=purge_imported_memories
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# --- Phase Two Architecture Blueprint Endpoint ---

@router.get("/phase2-architecture", response_model=List[PhaseTwoArchitectureSpec])
async def get_phase2_architecture():
    """Returns technical architectural security and privacy specifications for Phase 2 integrations."""
    return integrations_service.get_phase2_architecture_spec()
