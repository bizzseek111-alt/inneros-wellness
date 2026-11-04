"""FastAPI Router for Curriculum RAG Engine."""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status

from app.domains.curriculum_rag.schemas import (
    CurriculumSourceDocument,
    CurriculumChunk,
    CurriculumBoard,
    GradeLevel,
    CurriculumSubject,
    RAGQueryRequest,
    RAGQueryResponse,
    RAGReviewRequest,
)
from app.domains.curriculum_rag.service import curriculum_rag_service

router = APIRouter(prefix="/curriculum/rag", tags=["Curriculum RAG Engine"])


@router.post("/query", response_model=RAGQueryResponse)
async def query_curriculum_rag(req: RAGQueryRequest):
    """Retrieves grounded curriculum content and returns a Socratic tutoring response with citations."""
    return curriculum_rag_service.answer_tutoring_query(req)


@router.get("/sources", response_model=List[CurriculumSourceDocument])
async def list_curriculum_sources():
    """Lists registered curriculum source documents with copyright and edition metadata."""
    return curriculum_rag_service.get_sources()


@router.get("/chunks", response_model=List[CurriculumChunk])
async def list_approved_chunks(
    grade: Optional[GradeLevel] = None,
    subject: Optional[CurriculumSubject] = None,
    language: Optional[str] = Query(None, description="en, ur, or pa"),
):
    """Lists approved curriculum chunks for verified tutoring and practice."""
    return curriculum_rag_service.get_approved_chunks(grade=grade, subject=subject, language=language)


@router.post("/review", response_model=CurriculumChunk)
async def review_curriculum_chunk(req: RAGReviewRequest):
    """Allows qualified curriculum reviewers to approve, review, or reject chunks."""
    updated = curriculum_rag_service.update_chunk_review(req)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chunk ID not found")
    return updated
