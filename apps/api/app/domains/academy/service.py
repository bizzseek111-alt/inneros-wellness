"""Service layer for InnerOS Kids Development Academy.

Manages the 25 curriculum departments, 20+ evidence-informed demonstration modules,
reviewer approval workflows (CMS), and recommendation engine.

STRICT INVARIANTS:
- Explicitly rejects any request or payload containing diagnostic scores,
  IQ estimations, or clinical classifications.
- Preserves child-safety by hiding unapproved draft content from standard
  child accounts unless a reviewer role is asserted.
"""

from datetime import datetime, timezone
from typing import List, Optional, Dict
from fastapi import HTTPException

from app.domains.academy.schemas import (
    DepartmentInfo,
    DepartmentId,
    CurriculumModule,
    CurriculumModuleCreate,
    CurriculumModuleUpdate,
    ApprovalStatus,
    ApprovalActionRequest,
    ApprovalActionResponse,
    RecommendationRequest,
    RecommendationResponse,
)
from app.domains.academy.departments import ACADEMY_DEPARTMENTS
from app.domains.academy.seed_curriculum import DEMONSTRATION_CURRICULUM_MODULES
from app.domains.academy.recommender import recommend_modules


class AcademyService:
    def __init__(self):
        # In-memory curriculum catalog keyed by module_id
        self._modules: Dict[str, CurriculumModule] = {}
        self._departments: List[DepartmentInfo] = list(ACADEMY_DEPARTMENTS)
        self._load_seed_curriculum()

    def _load_seed_curriculum(self):
        """Populate repository with original demonstration lessons."""
        now_iso = datetime.now(timezone.utc).isoformat()
        for mod in DEMONSTRATION_CURRICULUM_MODULES:
            # Clone module to avoid mutation across instances
            mod_copy = mod.model_copy(deep=True)
            if not mod_copy.created_at:
                mod_copy.created_at = now_iso
            if not mod_copy.updated_at:
                mod_copy.updated_at = now_iso
            self._modules[mod_copy.module_id] = mod_copy

    def _assert_no_diagnostic_invariants(self, text_payload: str):
        """Strict invariant check: rejects clinical diagnosing or IQ score generation."""
        forbidden_terms = [
            "iq score",
            "iq test",
            "adhd probability",
            "autism probability",
            "clinical diagnosis",
            "diagnose adhd",
            "cure autism",
            "depression score",
        ]
        lower_payload = text_payload.lower()
        for term in forbidden_terms:
            if term in lower_payload:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        f"Prohibited action: '{term}' violates InnerOS Kids ethical boundaries. "
                        "The Academy is an educational learning center, not a diagnostic or clinical treatment tool."
                    ),
                )

    def list_departments(self) -> List[DepartmentInfo]:
        """Return all 25 curriculum departments."""
        return self._departments

    def list_modules(
        self,
        department_id: Optional[str] = None,
        age_band: Optional[str] = None,
        approval_status: Optional[str] = None,
        is_reviewer: bool = False,
    ) -> List[CurriculumModule]:
        """List curriculum modules with role-aware publication filtering."""
        results = []
        for mod in self._modules.values():
            # If not a reviewer, only published modules or draft demonstration preview
            # Note: For educational demo purposes, if none are yet published,
            # allow draft preview if reviewer OR explicitly requested.
            if not is_reviewer and mod.approval_status != ApprovalStatus.PUBLISHED:
                continue

            if department_id and mod.department_id.value != department_id:
                continue

            if age_band and mod.target_age_range != age_band:
                continue

            if approval_status and mod.approval_status.value != approval_status:
                continue

            results.append(mod)

        # Sort by module_id
        results.sort(key=lambda m: (m.target_age_range, m.module_id))
        return results

    def get_module(self, module_id: str, is_reviewer: bool = False) -> CurriculumModule:
        """Fetch single module by ID with access control."""
        mod = self._modules.get(module_id)
        if not mod:
            raise HTTPException(status_code=404, detail=f"Curriculum module '{module_id}' not found.")

        if not is_reviewer and mod.approval_status != ApprovalStatus.PUBLISHED:
            # Check if learner is accessing draft content
            raise HTTPException(
                status_code=403,
                detail="This curriculum module is currently in draft review and pending clinical multidisciplinary signoff.",
            )

        return mod

    def create_module(self, data: CurriculumModuleCreate, reviewer_name: str = "Curriculum Designer") -> CurriculumModule:
        """Create a new curriculum module in DRAFT status."""
        # Validate invariants
        combined_text = (
            f"{data.title_en} {data.developmental_objective} {data.interactive_story.story_text_en} "
            f"{data.non_diagnostic_progress_indicator}"
        )
        self._assert_no_diagnostic_invariants(combined_text)

        if data.module_id in self._modules:
            raise HTTPException(status_code=409, detail=f"Module with ID '{data.module_id}' already exists.")

        now_iso = datetime.now(timezone.utc).isoformat()
        new_module = CurriculumModule(
            module_id=data.module_id,
            department_id=data.department_id,
            title_en=data.title_en,
            title_ur=data.title_ur,
            title_pa=data.title_pa,
            target_age_range=data.target_age_range,
            difficulty=data.difficulty,
            developmental_objective=data.developmental_objective,
            research_references=data.research_references,
            evidence_strength=data.evidence_strength,
            reviewer_name=reviewer_name,
            approval_status=ApprovalStatus.DRAFT,
            version="1.0.0",
            recommended_session_duration_min=data.recommended_session_duration_min,
            interactive_story=data.interactive_story,
            voice_based_activity=data.voice_based_activity,
            text_based_activity=data.text_based_activity,
            offline_activity=data.offline_activity,
            knowledge_check=data.knowledge_check,
            non_diagnostic_progress_indicator=data.non_diagnostic_progress_indicator,
            is_published=False,
            created_at=now_iso,
            updated_at=now_iso,
        )

        self._modules[new_module.module_id] = new_module
        return new_module

    def update_module(self, module_id: str, updates: CurriculumModuleUpdate) -> CurriculumModule:
        """Update fields of an existing curriculum module."""
        mod = self._modules.get(module_id)
        if not mod:
            raise HTTPException(status_code=404, detail=f"Module '{module_id}' not found.")

        update_dict = updates.model_dump(exclude_unset=True)
        # Check invariants
        combined_text = " ".join(str(v) for v in update_dict.values())
        self._assert_no_diagnostic_invariants(combined_text)

        for key, value in update_dict.items():
            if hasattr(mod, key) and value is not None:
                setattr(mod, key, value)

        mod.updated_at = datetime.now(timezone.utc).isoformat()
        if mod.approval_status == ApprovalStatus.PUBLISHED:
            mod.is_published = True
        elif mod.approval_status in [ApprovalStatus.DRAFT, ApprovalStatus.UNDER_REVIEW, ApprovalStatus.ARCHIVED]:
            mod.is_published = False

        self._modules[module_id] = mod
        return mod

    def approve_module(self, action: ApprovalActionRequest) -> ApprovalActionResponse:
        """Reviewer workflow: approve, publish, archive or request revisions on curriculum content."""
        mod = self._modules.get(action.module_id)
        if not mod:
            raise HTTPException(status_code=404, detail=f"Module '{action.module_id}' not found.")

        previous_status = mod.approval_status
        mod.approval_status = action.target_status
        mod.reviewer_name = action.reviewer_name
        mod.is_published = action.target_status == ApprovalStatus.PUBLISHED
        mod.updated_at = datetime.now(timezone.utc).isoformat()

        # Update metadata notes in safety_and_escalation
        if not mod.safety_and_escalation:
            mod.safety_and_escalation = {}
        mod.safety_and_escalation["last_reviewer_notes"] = action.reviewer_notes
        mod.safety_and_escalation["clinical_disclaimer_signed"] = action.signed_clinical_disclaimer

        self._modules[action.module_id] = mod

        return ApprovalActionResponse(
            module_id=mod.module_id,
            previous_status=previous_status,
            new_status=mod.approval_status,
            timestamp=mod.updated_at,
            message=f"Module '{mod.module_id}' transitioned from {previous_status.value} to {mod.approval_status.value} by {action.reviewer_name}.",
        )

    def publish_all_demonstration_lessons(self) -> int:
        """Helper for development & testing: marks all 20 demonstration lessons as PUBLISHED."""
        count = 0
        for mod in self._modules.values():
            mod.approval_status = ApprovalStatus.PUBLISHED
            mod.is_published = True
            count += 1
        return count

    def get_recommendations(
        self, request: RecommendationRequest, is_reviewer: bool = False
    ) -> RecommendationResponse:
        """Generate personalized recommendations for a child/teen or caregiver."""
        self._assert_no_diagnostic_invariants(" ".join(request.chosen_goals) + " " + request.age_range)
        all_mods = list(self._modules.values())
        return recommend_modules(request, all_mods, include_drafts=is_reviewer)


# Singleton instance
academy_service = AcademyService()
