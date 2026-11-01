"""Chief Psychology Knowledge Orchestrator.
Coordinates the InnerOS Psychology Knowledge Engine, evidence-quality grading,
context-sensitive companion retrieval, source provenance attribution, and review workflows.

EXPLICIT ARCHITECTURAL NOTICE:
The Chief Psychology Knowledge Orchestrator is an internal educational retrieval engine and knowledge system.
It does NOT claim to be a licensed chief psychologist, clinician, or medical provider.
"""

from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from app.domains.knowledge.schemas import (
    KnowledgeRecord,
    PsychologyDepartment,
    EvidenceQualityLevel,
    ReviewStatus,
    ContextRetrievalResponse,
    ReviewMetadata,
)
from app.domains.knowledge.seed_data import SEEDED_KNOWLEDGE_RECORDS
from app.domains.knowledge.taxonomy import PSYCHOLOGY_TAXONOMY, DepartmentTaxonomyInfo
from app.db.database import save_domain_item, load_domain_items
from app.core.observability import logger


class ChiefPsychologyKnowledgeOrchestrator:
    """Internal orchestrator managing peer-reviewed evidence curation,
    contextual retrieval for the companion, and content lifecycle review.
    """

    ORCHESTRATOR_DISCLAIMER = (
        "InnerOS Chief Psychology Knowledge Orchestrator: Internal automated educational knowledge engine. "
        "Not a licensed human psychologist or healthcare provider. All served records are peer-reviewed and rights-verified."
    )

    def __init__(self):
        # Seeded baseline repository hydrated with any persisted SQL review overrides
        self._records: Dict[str, KnowledgeRecord] = {r.id: r.model_copy(deep=True) for r in SEEDED_KNOWLEDGE_RECORDS}
        try:
            persisted = load_domain_items("knowledge_records")
            for p in persisted:
                rec = KnowledgeRecord.model_validate(p.get("payload", p))
                self._records[rec.id] = rec
        except Exception:
            pass

    def list_records(
        self,
        department: Optional[PsychologyDepartment] = None,
        review_status: Optional[ReviewStatus] = None,
        peer_reviewed_only: bool = False,
    ) -> List[KnowledgeRecord]:
        records = list(self._records.values())
        if department:
            records = [r for r in records if r.department == department]
        if review_status:
            records = [r for r in records if r.review_status == review_status]
        if peer_reviewed_only:
            records = [r for r in records if r.is_peer_reviewed_scientific]
        return records

    def get_record(self, record_id: str) -> Optional[KnowledgeRecord]:
        return self._records.get(record_id)

    def search_library(
        self,
        query: str,
        department: Optional[PsychologyDepartment] = None,
        min_evidence_level: Optional[EvidenceQualityLevel] = None,
        peer_reviewed_only: bool = False,
    ) -> List[KnowledgeRecord]:
        q = query.lower().strip()
        results: List[KnowledgeRecord] = []

        for r in self._records.values():
            if department and r.department != department:
                continue
            if peer_reviewed_only and not r.is_peer_reviewed_scientific:
                continue

            # Textual matching in title, summary, explanation, tags, and theoretical models
            text_corpus = (
                f"{r.title} {r.short_summary} {r.full_explanation} "
                f"{' '.join(r.tags)} {' '.join(r.theoretical_models)} {r.subfield}"
            ).lower()

            if not q or q in text_corpus:
                results.append(r)

        return results

    def retrieve_context(
        self,
        utterance: str,
        emotional_state: Optional[str] = None,
        conversation_mode: Optional[str] = "just_listen",
        department: Optional[PsychologyDepartment] = None,
        peer_reviewed_only: bool = True,
        max_records: int = 2,
    ) -> ContextRetrievalResponse:
        """Context-sensitive retrieval for companion dialogue turns.
        Enforces strict safety: Only returns approved, unexpired records with verified usage rights.
        """
        now = datetime.now(timezone.utc)
        u_lower = utterance.lower()
        emo_lower = (emotional_state or "").lower()

        candidate_scores: List[tuple[int, KnowledgeRecord]] = []

        for record in self._records.values():
            # 1. HARD GATE: Review Status must be APPROVED_FOR_COMPANION
            if record.review_status != ReviewStatus.APPROVED_FOR_COMPANION:
                continue

            # 2. HARD GATE: Rights must be verified
            if not record.rights_and_licensing.rights_verified:
                continue

            # 3. HARD GATE: Allowed in companion chat
            if not record.usage_restrictions.allowed_in_companion_chat:
                continue

            # 4. HARD GATE: Check expiration (annual re-certification required)
            if now > record.next_review_due_at:
                logger.warning(f"Knowledge record '{record.id}' has expired. Withholding from companion context.")
                continue

            # 5. HARD GATE: Filter out non-peer-reviewed trade literature if requested
            if peer_reviewed_only and not record.is_peer_reviewed_scientific:
                continue

            # 6. Filter by department if specified
            if department and record.department != department:
                continue

            # Scoring heuristics
            score = 0

            # Match emotional states
            for target_emo in record.target_emotional_states:
                if target_emo in emo_lower or target_emo in u_lower:
                    score += 5

            # Match tags and subfield
            for tag in record.tags:
                if tag in u_lower:
                    score += 3
            if record.subfield.lower() in u_lower:
                score += 4

            # Mode affinities
            if conversation_mode == "teach_me" and record.department in [
                PsychologyDepartment.CLINICAL,
                PsychologyDepartment.NEUROPSYCHOLOGY,
                PsychologyDepartment.POSITIVE,
            ]:
                score += 2
            elif conversation_mode == "help_me_settle" and "polyvagal" in record.tags:
                score += 6
            elif conversation_mode == "help_me_solve" and record.department in [
                PsychologyDepartment.COUNSELING,
                PsychologyDepartment.COGNITIVE,
            ]:
                score += 3

            # Baseline relevancy if user has stress/overwhelm keywords
            if ("stress" in u_lower or "overwhelm" in u_lower or "anxious" in u_lower) and record.id in [
                "record_act_cognitive_defusion",
                "record_polyvagal_vagal_brake",
            ]:
                score += 2

            if score > 0:
                candidate_scores.append((score, record))

        # Sort by score descending
        candidate_scores.sort(key=lambda x: x[0], reverse=True)
        top_records = [r for _, r in candidate_scores[:max_records]]

        # Synthesize context snippet for companion
        synthesis_lines = []
        for r in top_records:
            synthesis_lines.append(
                f"[{r.department.value.upper()} | {r.evidence_level.value}] {r.title}:\n"
                f"- Concept: {r.short_summary}\n"
                f"- Primary Citation: {r.citations[0].apa_citation if r.citations else 'N/A'}\n"
                f"- Non-Clinical Boundary: {r.usage_restrictions.non_clinical_disclaimer}"
            )

        context_synthesis = "\n\n".join(synthesis_lines) if synthesis_lines else "No specific knowledge records retrieved."

        return ContextRetrievalResponse(
            query_analyzed=f"{utterance} (Emotional State: {emotional_state or 'N/A'})",
            orchestrator_notice=self.ORCHESTRATOR_DISCLAIMER,
            records=top_records,
            retrieved_count=len(top_records),
            context_synthesis=context_synthesis,
        )

    def execute_review_action(
        self,
        record_id: str,
        reviewer_id: str,
        reviewer_name: str,
        reviewer_credentials: str,
        decision: ReviewStatus,
        notes: str,
        next_review_months: int = 12,
    ) -> Optional[KnowledgeRecord]:
        """Reviewer sign-off workflow updating review status and expiration dates."""
        record = self._records.get(record_id)
        if not record:
            return None

        now = datetime.now(timezone.utc)
        record.review_status = decision
        record.last_reviewed_at = now
        record.next_review_due_at = now + timedelta(days=next_review_months * 30)

        review_entry = ReviewMetadata(
            reviewer_id=reviewer_id,
            reviewer_name=reviewer_name,
            reviewer_credentials=reviewer_credentials,
            reviewed_at=now,
            review_decision=decision,
            review_notes=notes,
            clinical_safety_audit_passed=(decision == ReviewStatus.APPROVED_FOR_COMPANION),
        )
        record.review_history.append(review_entry)
        save_domain_item(
            "knowledge_records",
            reviewer_id,
            record.id,
            record.model_dump(mode="json"),
        )
        logger.info(f"Knowledge record '{record_id}' updated to status '{decision}' by {reviewer_name}.")
        return record

    def get_audit_summary(self) -> Dict[str, Any]:
        """Provides quality metrics for admin dashboard."""
        now = datetime.now(timezone.utc)
        all_records = list(self._records.values())

        by_dept = {}
        for r in all_records:
            by_dept[r.department.value] = by_dept.get(r.department.value, 0) + 1

        by_evidence_tier = {}
        for r in all_records:
            by_evidence_tier[r.evidence_level.value] = by_evidence_tier.get(r.evidence_level.value, 0) + 1

        by_status = {}
        for r in all_records:
            by_status[r.review_status.value] = by_status.get(r.review_status.value, 0) + 1

        expired_count = sum(1 for r in all_records if now > r.next_review_due_at)
        scientific_count = sum(1 for r in all_records if r.is_peer_reviewed_scientific)
        trade_pop_count = sum(1 for r in all_records if not r.is_peer_reviewed_scientific)

        return {
            "total_records": len(all_records),
            "scientific_peer_reviewed_count": scientific_count,
            "trade_pop_psychology_count": trade_pop_count,
            "expired_records_count": expired_count,
            "by_department": by_dept,
            "by_evidence_tier": by_evidence_tier,
            "by_review_status": by_status,
            "orchestrator_notice": self.ORCHESTRATOR_DISCLAIMER,
        }


knowledge_orchestrator = ChiefPsychologyKnowledgeOrchestrator()
