"""FastAPI Router for Educational Support Domain.

Mounts endpoints for:
- ADHD-friendly visual task breakdowns
- Autism-friendly AAC symbols & sensory preferences
- Learning difference multi-modal accommodations
- Cognitive executive function practice games
- Caregiver guidance articles & IEP templates
- Strictly non-diagnostic skill milestone tracking
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status

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
from app.domains.educational_support.service import educational_support_service

router = APIRouter(prefix="/educational-support", tags=["Educational Support & Accommodations"])


@router.get("/tasks", response_model=List[TaskBreakdown])
async def get_tasks(category: Optional[str] = Query(None)):
    """Returns ADHD-friendly visual task breakdowns."""
    return educational_support_service.get_task_breakdowns(category=category)


@router.get("/aac-symbols", response_model=List[AACSymbol])
async def get_aac_symbols(category: Optional[str] = Query(None)):
    """Returns picture AAC communication symbols with English, Urdu, and Shahmukhi Punjabi phrases."""
    return educational_support_service.get_aac_symbols(category=category)


@router.get("/accommodations", response_model=List[ClassroomAccommodation])
async def get_classroom_accommodations(area: Optional[str] = Query(None)):
    """Returns teacher classroom accommodation strategies and printable IEP notes."""
    return educational_support_service.get_classroom_accommodations(area=area)


@router.get("/games", response_model=List[CognitiveGameItem])
async def get_cognitive_games(
    domain: Optional[str] = Query(None),
    special_interest: Optional[SpecialInterestCategory] = Query(None),
):
    """Returns untimed cognitive practice games with special interest filtering."""
    return educational_support_service.get_cognitive_games(
        domain=domain,
        special_interest=special_interest,
    )


@router.get("/guidance", response_model=List[CaregiverGuidanceArticle])
async def get_caregiver_guidance(category: Optional[str] = Query(None)):
    """Returns positive parenting, co-regulation, and IEP referral guidance articles."""
    return educational_support_service.get_caregiver_guidance(category=category)


@router.post("/skill-milestone", response_model=EducationalSkillRecord)
async def record_skill_milestone(
    child_id_hash: str,
    skill_key: str,
    skill_category: str,
    notes: str = "",
):
    """Records an educational skill milestone.

    STRICT INVARIANT:
    Rejects diagnostic labels, ADHD/autism probability claims, or compliance tracking.
    """
    try:
        return educational_support_service.record_skill_milestone(
            child_id_hash=child_id_hash,
            skill_key=skill_key,
            skill_category=skill_category,
            notes=notes,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get("/skills/{child_id_hash}", response_model=List[EducationalSkillRecord])
async def get_demonstrated_skills(child_id_hash: str):
    """Returns demonstrated educational skills for a child profile."""
    return educational_support_service.get_demonstrated_skills(child_id_hash=child_id_hash)


@router.get("/sensory-profile/{child_id_hash}", response_model=SensoryProfile)
async def get_sensory_profile(child_id_hash: str):
    """Retrieves sensory preferences (sound, motion, color, font)."""
    return educational_support_service.get_sensory_profile(child_id_hash=child_id_hash)


@router.put("/sensory-profile/{child_id_hash}", response_model=SensoryProfile)
async def update_sensory_profile(child_id_hash: str, profile: SensoryProfile):
    """Updates sensory preferences."""
    return educational_support_service.update_sensory_profile(child_id_hash=child_id_hash, profile=profile)


@router.get("/regulatory-notice")
async def get_regulatory_notice():
    """Explicit disclosure on non-clinical educational status and specialist review requirements."""
    return {
        "classification": "Educational & Accessibility Support Tool (Non-Medical)",
        "diagnostic_claim_policy": "STRICTLY PROHIBITED: InnerOS never diagnoses ADHD, autism, or learning differences.",
        "treatment_claim_policy": "STRICTLY PROHIBITED: InnerOS does not claim to cure, treat, or normalize neurodivergent children.",
        "behavioral_ethics": "Harmless self-regulatory behaviors (stimming) and non-eye-contact listening are respected as valid nervous system regulation.",
        "professional_review_status": "Clinical adaptations require multidisciplinary developmental specialist review prior to public release.",
    }
