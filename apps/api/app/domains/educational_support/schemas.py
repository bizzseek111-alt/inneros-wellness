"""Schemas for InnerOS Educational Support Center.

Defines models for:
- Module A: ADHD-Friendly Support (Visual schedules, micro-steps, timers, accommodations)
- Module B: Autism-Friendly Support (AAC symbols, sensory adjustments, special interests)
- Module C: Learning Differences (Dyslexia/Dyscalculia accommodations, multi-modal literacy)
- Module D: Cognitive Development (Executive function, sequencing, working memory)
- Module E: Caregiver Guidance (Positive parenting, IEP templates, referral pathways)
- Demonstrated Skill Milestones (strictly non-diagnostic)
"""

from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field


class SpecialInterestCategory(str, Enum):
    SPACE = "space"
    DINOSAURS = "dinosaurs"
    TRAINS = "trains"
    OCEAN = "ocean"
    CODING = "coding"
    STARS = "stars"
    NATURE = "nature"


class SensoryProfile(BaseModel):
    sound_volume_level: int = Field(50, ge=0, le=100)
    low_motion_enabled: bool = False
    calm_color_filter: bool = False
    high_contrast_enabled: bool = False
    open_dyslexic_font: bool = False
    text_size_multiplier: float = 1.0  # 1.0, 1.25, 1.5


class MicroStep(BaseModel):
    id: str
    step_number: int
    title: str
    title_ur: str
    title_pa: str
    visual_icon: str
    completed: bool = False


class TaskBreakdown(BaseModel):
    id: str
    task_name: str
    category: str  # "morning", "homework", "bedtime", "classroom"
    estimated_minutes: int
    micro_steps: List[MicroStep]


class AACSymbol(BaseModel):
    id: str
    category: str  # "sensory", "physical_need", "emotions", "social_boundaries", "choices"
    symbol_glyph: str
    label_en: str
    label_ur: str
    label_pa: str
    speech_phrase_en: str
    speech_phrase_ur: str
    speech_phrase_pa: str
    color_border: str


class ClassroomAccommodation(BaseModel):
    id: str
    area: str  # "attention_focus", "sensory_regulation", "instruction_delivery", "executive_function"
    title: str
    description: str
    classroom_strategy: str
    why_it_helps: str
    printable_iep_note: str


class CognitiveGameItem(BaseModel):
    id: str
    title: str
    domain: str  # "working_memory", "sequencing", "planning", "flexible_shifting", "emotional_vocab"
    difficulty: str  # "gentle", "intermediate", "reflective"
    special_interest: Optional[SpecialInterestCategory] = None
    instruction_literal: str
    instruction_ur: str
    cards_or_steps: List[Dict[str, Any]]


class CaregiverGuidanceArticle(BaseModel):
    id: str
    title: str
    category: str  # "co_regulation", "routine_building", "school_advocacy", "referral_guidance"
    summary: str
    key_takeaways: List[str]
    sample_dialogue_or_script: str
    professional_disclaimer: str = (
        "Educational information for developmental support. Consult a qualified developmental pediatrician, "
        "child psychologist, or occupational therapist for individualized clinical assessment."
    )


class EducationalSkillRecord(BaseModel):
    child_id_hash: str
    skill_key: str  # e.g., "completed_3_step_morning_sequence", "named_bodily_emotion_sensation"
    skill_category: str  # "executive_function", "communication", "emotional_literacy"
    demonstrated_date: str
    notes: str = ""
    # STRICT INVARIANT: No medical probability scores or diagnostic tags allowed


# =============================================================================
# CLASSROOM & EDUCATOR SCHEMAS
# =============================================================================

class ClassroomCreateRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=160, description="e.g. Grade 4 Willow Room")
    grade_level: str = Field(default="Grade 4", max_length=32)
    institution_name: str = Field(default="Weebly Community School", max_length=160)


class ClassroomResponse(BaseModel):
    id: str
    teacher_id: str
    name: str
    grade_level: str
    institution_name: str
    join_code: str
    student_count: int = 0
    is_active: bool = True
    created_at: str


class ClassroomStudentEnrollRequest(BaseModel):
    classroom_id: str
    student_display_name: str = Field(..., min_length=1, max_length=120)


class ClassroomStudentResponse(BaseModel):
    id: str
    classroom_id: str
    student_id: str
    student_display_name: str
    status: str
    enrolled_at: str


class ClassroomAssignmentCreateRequest(BaseModel):
    classroom_id: str
    title: str = Field(..., min_length=3, max_length=255)
    department_id: str = Field(default="emotional_intelligence", max_length=64)
    activity_type: str = Field(default="feelings_wheel", max_length=64)
    instructions: str = Field(default="", max_length=1000)
    due_date: Optional[str] = None


class ClassroomAssignmentResponse(BaseModel):
    id: str
    classroom_id: str
    title: str
    department_id: str
    activity_type: str
    instructions: str
    due_date: Optional[str] = None
    created_at: str


class ClassroomClimateReport(BaseModel):
    classroom_id: str
    classroom_name: str
    total_students: int
    calm_percentage: int
    restless_percentage: int
    focus_percentage: int
    active_assignments_count: int
    privacy_notice: str = "Aggregated anonymous emotional climate. Strictly no private student journals or personal chat records are exposed to educators."

