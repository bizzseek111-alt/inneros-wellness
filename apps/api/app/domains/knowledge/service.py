"""Knowledge Domain Service.
Facade for the Chief Psychology Knowledge Orchestrator, taxonomy registry,
and evidence-quality assurance pipeline.
"""

from typing import List, Optional, Dict, Any
from app.domains.knowledge.schemas import (
    KnowledgeRecord,
    PsychologyDepartment,
    EvidenceQualityLevel,
    ReviewStatus,
    ContextRetrievalRequest,
    ContextRetrievalResponse,
    DepartmentTaxonomyInfo,
    PsychoeducationExercise,
    ReviewActionRequest,
)
from app.domains.knowledge.orchestrator import knowledge_orchestrator
from app.domains.knowledge.taxonomy import PSYCHOLOGY_TAXONOMY, list_all_taxonomy_departments


class KnowledgeService:
    """Provides high-level knowledge domain APIs for public exploration,
    companion context retrieval, and admin review workflows.
    """

    def list_records(
        self,
        department: Optional[PsychologyDepartment] = None,
        review_status: Optional[ReviewStatus] = None,
        peer_reviewed_only: bool = False,
    ) -> List[KnowledgeRecord]:
        return knowledge_orchestrator.list_records(
            department=department,
            review_status=review_status,
            peer_reviewed_only=peer_reviewed_only,
        )

    def get_record(self, record_id: str) -> Optional[KnowledgeRecord]:
        return knowledge_orchestrator.get_record(record_id)

    def search_library(
        self,
        query: str,
        department: Optional[PsychologyDepartment] = None,
        min_evidence_level: Optional[EvidenceQualityLevel] = None,
        peer_reviewed_only: bool = False,
    ) -> List[KnowledgeRecord]:
        return knowledge_orchestrator.search_library(
            query=query,
            department=department,
            min_evidence_level=min_evidence_level,
            peer_reviewed_only=peer_reviewed_only,
        )

    def retrieve_context(self, req: ContextRetrievalRequest) -> ContextRetrievalResponse:
        return knowledge_orchestrator.retrieve_context(
            utterance=req.utterance,
            emotional_state=req.emotional_state,
            conversation_mode=req.conversation_mode,
            department=req.department,
            peer_reviewed_only=req.peer_reviewed_only,
            max_records=req.max_records,
        )

    def list_departments(self) -> List[DepartmentTaxonomyInfo]:
        return list_all_taxonomy_departments()

    def get_department(self, dept: PsychologyDepartment) -> Optional[DepartmentTaxonomyInfo]:
        return PSYCHOLOGY_TAXONOMY.get(dept)

    def execute_review(self, record_id: str, req: ReviewActionRequest) -> Optional[KnowledgeRecord]:
        return knowledge_orchestrator.execute_review_action(
            record_id=record_id,
            reviewer_id=req.reviewer_id,
            reviewer_name=req.reviewer_name,
            reviewer_credentials=req.reviewer_credentials,
            decision=req.decision,
            notes=req.notes,
            next_review_months=req.next_review_months,
        )

    def get_audit_summary(self) -> Dict[str, Any]:
        return knowledge_orchestrator.get_audit_summary()

    def list_exercises(self) -> List[PsychoeducationExercise]:
        exercises: List[PsychoeducationExercise] = []
        for r in knowledge_orchestrator.list_records():
            exercises.extend(r.exercises)
        return exercises


knowledge_service = KnowledgeService()
