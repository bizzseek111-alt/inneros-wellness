"""Memory Domain API Router.

Endpoints for user memory inspection, addition, staged suggestions, user edits,
provenance, life graph nodes/edges, pause memory, nuclear purge, and GDPR data export.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.domains.memory.schemas import (
    MemoryRecord,
    MemoryCreateRequest,
    MemoryUpdateRequest,
    MemorySuggestionActionRequest,
    MemoryCategory,
    MemoryRecordType,
    MemoryStatus,
    LifeGraphResponse,
    LifeGraphNode,
    LifeGraphEdge,
    LifeGraphNodeCreateRequest,
    LifeGraphEdgeCreateRequest,
    UserMemoryConsent,
    MemoryAuditLogEntry,
    DataExportBundle,
)
from app.domains.memory.service import memory_service
from app.core.security import get_current_user, UserContext

router = APIRouter(prefix="/memory", tags=["Personal Memory & Life Graph"])


# -------------------------------------------------------------
# Memory Records Endpoints (CRUD, Staging, Search, Editing)
# -------------------------------------------------------------
@router.get("/records", response_model=List[MemoryRecord])
async def list_memory_records(
    category: Optional[MemoryCategory] = Query(None, description="Filter by memory category"),
    status: Optional[MemoryStatus] = Query(None, description="Filter by status (suggested/confirmed)"),
    record_type: Optional[MemoryRecordType] = Query(None, description="Filter by stored_fact vs tentative_ai_interpretation"),
    query: Optional[str] = Query(None, description="Search query across statement, context, and tags"),
    user: UserContext = Depends(get_current_user),
):
    """Returns the user's personal memory records filtered by category, status, type, or keyword."""
    return memory_service.list_memories(
        user_id=user.user_id,
        category=category,
        status=status,
        record_type=record_type,
        search_query=query,
    )


# Backward-compatible alias for /items
@router.get("/items", response_model=List[MemoryRecord])
async def list_memories_legacy(user: UserContext = Depends(get_current_user)):
    """Backward compatible alias returning the user's active personal memory items."""
    return memory_service.list_memories(user.user_id)


@router.post("/records", response_model=MemoryRecord, status_code=status.HTTP_201_CREATED)
async def create_memory_record(
    req: MemoryCreateRequest,
    is_temporary_conversation: bool = Query(False, description="Temporary conversation isolation flag"),
    user: UserContext = Depends(get_current_user),
):
    """Creates a new memory record or stages a suggestion under strict consent rules."""
    try:
        item = memory_service.add_memory(
            user_id=user.user_id,
            req=req,
            is_temporary_conversation=is_temporary_conversation,
        )
    except PermissionError as pe:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(pe),
        )

    if not item:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Memory recording is paused or disabled in user consent preferences",
        )
    return item


# Backward-compatible alias for POST /items
@router.post("/items", response_model=MemoryRecord, status_code=status.HTTP_201_CREATED)
async def create_memory_legacy(
    req: MemoryCreateRequest,
    user: UserContext = Depends(get_current_user),
):
    return await create_memory_record(req=req, is_temporary_conversation=False, user=user)


@router.get("/records/{memory_id}", response_model=MemoryRecord)
async def get_memory_record(
    memory_id: str,
    user: UserContext = Depends(get_current_user),
):
    """Retrieves a single memory record by ID."""
    record = memory_service.get_memory(user.user_id, memory_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Memory record not found")
    return record


@router.put("/records/{memory_id}", response_model=MemoryRecord)
async def update_memory_record(
    memory_id: str,
    req: MemoryUpdateRequest,
    user: UserContext = Depends(get_current_user),
):
    """Feature 2: Updates an existing memory record (user-editable)."""
    try:
        updated = memory_service.update_memory(user.user_id, memory_id, req)
    except PermissionError as pe:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(pe))

    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Memory record not found")
    return updated


@router.post("/records/{memory_id}/action", response_model=MemoryRecord)
async def handle_suggestion_action(
    memory_id: str,
    req: MemorySuggestionActionRequest,
    user: UserContext = Depends(get_current_user),
):
    """Feature 1: Confirms or rejects a suggested memory item."""
    if req.action.lower() == "confirm":
        confirmed = memory_service.confirm_suggestion(
            user_id=user.user_id,
            memory_id=memory_id,
            adjusted_statement=req.adjusted_statement,
        )
        if not confirmed:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Suggested memory not found")
        return confirmed
    elif req.action.lower() == "reject":
        rejected = memory_service.reject_suggestion(user_id=user.user_id, memory_id=memory_id)
        if not rejected:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Suggested memory not found")
        record = memory_service.get_memory(user.user_id, memory_id)
        return record
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Action must be 'confirm' or 'reject'",
        )


@router.delete("/records/{memory_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_memory_record(
    memory_id: str,
    user: UserContext = Depends(get_current_user),
):
    """Feature 9: Executes GDPR Article 17 deletion for an individual memory and cascades graph edges."""
    deleted = memory_service.delete_memory(user.user_id, memory_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Memory record not found")
    return None


# Backward-compatible alias for DELETE /items/{id}
@router.delete("/items/{memory_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_memory_legacy(
    memory_id: str,
    user: UserContext = Depends(get_current_user),
):
    return await delete_memory_record(memory_id=memory_id, user=user)


@router.post("/prune-expired", response_model=dict)
async def prune_expired_memories(user: UserContext = Depends(get_current_user)):
    """Feature 5: Auto-prunes expired tentative memories and stale suggestions."""
    count = memory_service.prune_expired_memories(user.user_id)
    return {"pruned_count": count}


# -------------------------------------------------------------
# Life Graph Endpoints
# -------------------------------------------------------------
@router.get("/life-graph", response_model=LifeGraphResponse)
async def get_life_graph(user: UserContext = Depends(get_current_user)):
    """Feature 12: Retrieves complete Life Graph nodes, causal/mitigating edges, and counts."""
    return memory_service.get_life_graph(user.user_id)


@router.post("/life-graph/nodes", response_model=LifeGraphNode, status_code=status.HTTP_201_CREATED)
async def create_life_graph_node(
    req: LifeGraphNodeCreateRequest,
    user: UserContext = Depends(get_current_user),
):
    """Creates a new node in the user's Life Graph."""
    return memory_service.add_life_graph_node(user.user_id, req)


@router.delete("/life-graph/nodes/{node_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_life_graph_node(
    node_id: str,
    user: UserContext = Depends(get_current_user),
):
    """Deletes a node and cascades deletion of all connecting edges."""
    deleted = memory_service.delete_life_graph_node(user.user_id, node_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Node not found")
    return None


@router.post("/life-graph/edges", response_model=LifeGraphEdge, status_code=status.HTTP_201_CREATED)
async def create_life_graph_edge(
    req: LifeGraphEdgeCreateRequest,
    user: UserContext = Depends(get_current_user),
):
    """Creates a directed causal or mitigating edge between two Life Graph nodes."""
    edge = memory_service.add_life_graph_edge(user.user_id, req)
    if not edge:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Source or target node not found in user Life Graph",
        )
    return edge


@router.delete("/life-graph/edges/{edge_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_life_graph_edge(
    edge_id: str,
    user: UserContext = Depends(get_current_user),
):
    """Deletes a single edge from the user's Life Graph."""
    deleted = memory_service.delete_life_graph_edge(user.user_id, edge_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Edge not found")
    return None


# -------------------------------------------------------------
# Privacy, Consent, Pause, Purge & Export Endpoints
# -------------------------------------------------------------
@router.get("/consent", response_model=UserMemoryConsent)
async def get_consent_settings(user: UserContext = Depends(get_current_user)):
    """Returns active privacy, pause status, and category consent settings."""
    return memory_service.get_consent(user.user_id)


@router.put("/consent", response_model=UserMemoryConsent)
async def update_consent_settings(
    settings: UserMemoryConsent,
    user: UserContext = Depends(get_current_user),
):
    """Updates privacy preferences, category permissions, and sensitive opt-in."""
    return memory_service.update_consent(user.user_id, settings)


@router.post("/pause", response_model=UserMemoryConsent)
async def pause_memory_recording(user: UserContext = Depends(get_current_user)):
    """Feature 7: Pauses memory extraction and long-term staging."""
    return memory_service.pause_memory(user.user_id)


@router.post("/resume", response_model=UserMemoryConsent)
async def resume_memory_recording(user: UserContext = Depends(get_current_user)):
    """Resumes memory recording."""
    return memory_service.resume_memory(user.user_id)


@router.post("/purge-all", response_model=dict)
async def purge_all_memory(user: UserContext = Depends(get_current_user)):
    """Feature 10: Complete deletion of all memories, life graph nodes, and derived edges."""
    return memory_service.purge_all_user_memory(user.user_id)


@router.get("/export", response_model=DataExportBundle)
async def export_user_data(user: UserContext = Depends(get_current_user)):
    """Feature 11: Machine-readable JSON export bundle for personal data portability (GDPR Art. 20)."""
    return memory_service.export_user_data(user.user_id)


@router.get("/audit-logs", response_model=List[MemoryAuditLogEntry])
async def get_audit_logs(user: UserContext = Depends(get_current_user)):
    """Retrieves immutable audit logs for the current user."""
    return memory_service.get_audit_logs(user.user_id)
