"""Educational Support Center Service.

Coordinates curriculum delivery, AAC symbol catalogs, classroom accommodations,
caregiver guidance articles, and strictly non-diagnostic educational skill milestone tracking.
"""

import time
from typing import List, Dict, Optional, Any
from app.domains.educational_support.schemas import (
    TaskBreakdown,
    AACSymbol,
    ClassroomAccommodation,
    CognitiveGameItem,
    CaregiverGuidanceArticle,
    EducationalSkillRecord,
    SensoryProfile,
    SpecialInterestCategory,
)
from app.domains.educational_support.curriculum_data import (
    CURATED_TASK_BREAKDOWNS,
    CLASSROOM_ACCOMMODATIONS,
    AAC_SYMBOLS,
    COGNITIVE_GAMES,
    CAREGIVER_ARTICLES,
)


class EducationalSupportService:
    """Manages neurodiversity-affirming educational tools and demonstrated skill milestones."""

    def __init__(self):
        # In-memory store for demonstrated skills: child_id_hash -> List[EducationalSkillRecord]
        self._skills_store: Dict[str, List[EducationalSkillRecord]] = {}
        # In-memory store for caregiver sensory preferences: child_id_hash -> SensoryProfile
        self._sensory_profiles: Dict[str, SensoryProfile] = {}

    def get_task_breakdowns(self, category: Optional[str] = None) -> List[TaskBreakdown]:
        """Returns ADHD-friendly visual task breakdowns."""
        if category:
            return [t for t in CURATED_TASK_BREAKDOWNS if t.category == category]
        return CURATED_TASK_BREAKDOWNS

    def get_aac_symbols(self, category: Optional[str] = None) -> List[AACSymbol]:
        """Returns picture AAC communication symbols."""
        if category:
            return [s for s in AAC_SYMBOLS if s.category == category]
        return AAC_SYMBOLS

    def get_classroom_accommodations(self, area: Optional[str] = None) -> List[ClassroomAccommodation]:
        """Returns teacher accommodations for attention, sensory, and executive function."""
        if area:
            return [a for a in CLASSROOM_ACCOMMODATIONS if a.area == area]
        return CLASSROOM_ACCOMMODATIONS

    def get_cognitive_games(
        self,
        domain: Optional[str] = None,
        special_interest: Optional[SpecialInterestCategory] = None
    ) -> List[CognitiveGameItem]:
        """Returns untimed cognitive practice games with special interest filtering."""
        games = COGNITIVE_GAMES
        if domain:
            games = [g for g in games if g.domain == domain]
        if special_interest:
            games = [g for g in games if g.special_interest == special_interest]
        return games

    def get_caregiver_guidance(self, category: Optional[str] = None) -> List[CaregiverGuidanceArticle]:
        """Returns positive parenting, co-regulation, and IEP referral guidance articles."""
        if category:
            return [c for c in CAREGIVER_ARTICLES if c.category == category]
        return CAREGIVER_ARTICLES

    def record_skill_milestone(
        self,
        child_id_hash: str,
        skill_key: str,
        skill_category: str,
        notes: str = ""
    ) -> EducationalSkillRecord:
        """Records a demonstrated educational skill milestone.

        STRICT INVARIANT:
        Rejects diagnostic labels, ADHD/autism probability claims, or compliance tracking.
        """
        forbidden_diagnostic_terms = [
            "adhd", "autism", "asd", "disorder", "syndrome", "diagnosis",
            "severity", "probability", "compliance", "masking", "normal", "cure"
        ]
        lower_key = skill_key.lower()
        if any(term in lower_key for term in forbidden_diagnostic_terms):
            raise ValueError(
                "Diagnostic terms and probability scores are strictly prohibited. "
                "Only record demonstrated educational skills (e.g. 'completed_3_step_sequence')."
            )

        record = EducationalSkillRecord(
            child_id_hash=child_id_hash,
            skill_key=skill_key,
            skill_category=skill_category,
            demonstrated_date=time.strftime("%Y-%m-%d"),
            notes=notes,
        )

        if child_id_hash not in self._skills_store:
            self._skills_store[child_id_hash] = []
        self._skills_store[child_id_hash].append(record)
        return record

    def get_demonstrated_skills(self, child_id_hash: str) -> List[EducationalSkillRecord]:
        """Returns list of demonstrated skills for a child profile."""
        return self._skills_store.get(child_id_hash, [])

    def get_sensory_profile(self, child_id_hash: str) -> SensoryProfile:
        return self._sensory_profiles.get(child_id_hash, SensoryProfile())

    def update_sensory_profile(self, child_id_hash: str, profile: SensoryProfile) -> SensoryProfile:
        self._sensory_profiles[child_id_hash] = profile
        return profile


educational_support_service = EducationalSupportService()
