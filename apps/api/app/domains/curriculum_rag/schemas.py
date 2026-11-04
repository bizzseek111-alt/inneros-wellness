"""Pydantic Schemas for Weebly V8 Curriculum RAG Engine.

Defines data contracts for:
- Licensed content intake and metadata tagging
- Curriculum chunk indexing and review gating
- Hybrid retrieval requests and reranked results
- Anti-injection context validation
- Grounded tutoring responses with explicit citation provenance
"""

from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ReviewStatus(str, Enum):
    DRAFTED = "drafted"
    REVIEWED = "reviewed"
    APPROVED = "approved"
    REJECTED = "rejected"


class CurriculumBoard(str, Enum):
    PCTB = "Punjab Curriculum and Textbook Board (PCTB)"
    FEDERAL = "Federal Directorate of Education (Pakistan)"
    UNIVERSAL_STANDARD = "Weebly Universal Educational Standard"


class GradeLevel(str, Enum):
    GRADE_1 = "Grade 1"
    GRADE_2 = "Grade 2"
    GRADE_3 = "Grade 3"
    GRADE_4 = "Grade 4"
    GRADE_5 = "Grade 5"
    GRADE_6 = "Grade 6"
    GRADE_7 = "Grade 7"
    GRADE_8 = "Grade 8"


class CurriculumSubject(str, Enum):
    MATHEMATICS = "Mathematics"
    GENERAL_SCIENCE = "General Science"
    ENGLISH = "English"
    URDU = "Urdu"
    PUNJABI = "Punjabi"
    SOCIAL_STUDIES = "Social Studies & Life Skills"


class CurriculumSourceDocument(BaseModel):
    id: str
    source_document: str
    source_version: str = "2025-2026"
    license_permission: str = "Public Educational Standard PCTB Approved"
    board: CurriculumBoard = CurriculumBoard.PCTB
    grade: GradeLevel
    subject: CurriculumSubject
    review_status: ReviewStatus = ReviewStatus.APPROVED
    reviewer: Optional[str] = "Prof. Fatima Zahra (Punjab Curriculum Specialist)"
    citation: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CurriculumChunk(BaseModel):
    id: str
    source_id: str
    board: CurriculumBoard = CurriculumBoard.PCTB
    grade: GradeLevel
    subject: CurriculumSubject
    chapter: str
    topic: str
    learning_objective: str
    language: str = "en"  # en, ur, pa
    chunk_text: str
    embedding: List[float] = Field(default_factory=list)
    review_status: ReviewStatus = ReviewStatus.APPROVED
    reviewer: Optional[str] = "Prof. Fatima Zahra (Punjab Curriculum Specialist)"
    citation: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class GroundedCitation(BaseModel):
    chunk_id: str
    source_document: str
    source_version: str
    board: str
    grade: str
    subject: str
    chapter: str
    topic: str
    page_reference: Optional[str] = None
    citation_text: str


class RAGQueryRequest(BaseModel):
    query: str
    board: CurriculumBoard = CurriculumBoard.PCTB
    grade: GradeLevel = GradeLevel.GRADE_4
    subject: Optional[CurriculumSubject] = None
    language: str = "en"  # en, ur, pa
    character_id: str = "kai"  # kai, mia, lumi, zayn
    age_tier: str = "junior"  # little, junior, teen
    include_guided_hint: bool = True
    session_id: Optional[str] = None


class RAGQueryResponse(BaseModel):
    query: str
    tutoring_reply: str
    socratic_hint: Optional[str] = None
    citations: List[GroundedCitation] = Field(default_factory=list)
    source_count: int = 0
    language: str
    grade: str
    subject: str
    anti_injection_passed: bool = True
    provenance_verified: bool = True
    is_refusal_due_to_missing_source: bool = False
    turn_id: str


class RAGReviewRequest(BaseModel):
    chunk_id: str
    reviewer_name: str
    status: ReviewStatus
    notes: Optional[str] = None
