"""Knowledge Domain API Router.
Endpoints for Psychology Department taxonomy, evidence-quality library,
context-sensitive retrieval for the companion, and admin review workflows.
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.domains.knowledge.schemas import (
    KnowledgeRecord,
    PsychologyDepartment,
    EvidenceQualityLevel,
    ReviewStatus,
    DepartmentTaxonomyInfo,
    ContextRetrievalRequest,
    ContextRetrievalResponse,
    PsychoeducationExercise,
    ReviewActionRequest,
)
from app.domains.knowledge.service import knowledge_service
from app.core.security import get_current_user, UserContext

router = APIRouter(prefix="/knowledge", tags=["Psychology Knowledge Engine"])


@router.get("/departments", response_model=List[DepartmentTaxonomyInfo])
async def list_psychology_departments(user: UserContext = Depends(get_current_user)):
    """Returns the comprehensive 17-field Psychology Department taxonomy and non-clinical boundaries."""
    return knowledge_service.list_departments()


@router.get("/departments/{department_id}", response_model=DepartmentTaxonomyInfo)
async def get_department_details(
    department_id: PsychologyDepartment,
    user: UserContext = Depends(get_current_user),
):
    """Returns specific psychology department taxonomy metadata."""
    dept = knowledge_service.get_department(department_id)
    if not dept:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Department '{department_id}' not found.",
        )
    return dept


@router.get("/records", response_model=List[KnowledgeRecord])
async def list_knowledge_records(
    department: Optional[PsychologyDepartment] = None,
    review_status: Optional[ReviewStatus] = None,
    peer_reviewed_only: bool = Query(default=False),
    user: UserContext = Depends(get_current_user),
):
    """Returns evidence-backed psychology knowledge records filtered by department or review status."""
    return knowledge_service.list_records(
        department=department,
        review_status=review_status,
        peer_reviewed_only=peer_reviewed_only,
    )


@router.get("/topics", response_model=List[KnowledgeRecord])
async def list_topics_alias(
    department: Optional[PsychologyDepartment] = None,
    review_status: Optional[ReviewStatus] = None,
    peer_reviewed_only: bool = Query(default=False),
    user: UserContext = Depends(get_current_user),
):
    """Alias for /records to preserve backward compatibility."""
    return knowledge_service.list_records(
        department=department,
        review_status=review_status,
        peer_reviewed_only=peer_reviewed_only,
    )


@router.get("/records/{record_id}", response_model=KnowledgeRecord)
async def get_knowledge_record(
    record_id: str,
    user: UserContext = Depends(get_current_user),
):
    """Returns a specific knowledge record with publication metadata, citations, and licensing."""
    record = knowledge_service.get_record(record_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Knowledge record '{record_id}' not found.",
        )
    return record


@router.get("/search", response_model=List[KnowledgeRecord])
async def search_knowledge_library(
    q: str = Query(default="", description="Search query string"),
    department: Optional[PsychologyDepartment] = None,
    min_evidence_level: Optional[EvidenceQualityLevel] = None,
    peer_reviewed_only: bool = Query(default=False),
    user: UserContext = Depends(get_current_user),
):
    """Searches the psychology library with evidence-tier filtering and pop-psychology distinction."""
    return knowledge_service.search_library(
        query=q,
        department=department,
        min_evidence_level=min_evidence_level,
        peer_reviewed_only=peer_reviewed_only,
    )


@router.post("/retrieve-context", response_model=ContextRetrievalResponse)
async def retrieve_context_for_companion(
    req: ContextRetrievalRequest,
    user: UserContext = Depends(get_current_user),
):
    """Internal Chief Psychology Knowledge Orchestrator context retrieval.
    Matches user state and returns only approved, rights-verified, peer-reviewed records.
    """
    return knowledge_service.retrieve_context(req)


@router.post("/records/{record_id}/review", response_model=KnowledgeRecord)
async def submit_review_decision(
    record_id: str,
    req: ReviewActionRequest,
    user: UserContext = Depends(get_current_user),
):
    """Reviewer workflow: updates review status, records credentialed review sign-off, and sets re-certification date."""
    updated = knowledge_service.execute_review(record_id, req)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Knowledge record '{record_id}' not found.",
        )
    return updated


@router.get("/audit-summary", response_model=Dict[str, Any])
async def get_knowledge_quality_audit(user: UserContext = Depends(get_current_user)):
    """Returns quality assurance and licensing audit metrics across all knowledge records."""
    return knowledge_service.get_audit_summary()


@router.get("/exercises", response_model=List[PsychoeducationExercise])
async def list_exercises(user: UserContext = Depends(get_current_user)):
    """Returns guided somatic and breathwork exercises linked to evidence topics."""
    return knowledge_service.list_exercises()
