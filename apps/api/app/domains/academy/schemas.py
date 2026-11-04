"""Schemas for InnerOS Kids Development Academy.

Defines Pydantic models for 25 curriculum departments, evidence-informed modules,
multilingual content, accessibility adaptations, interactive stages,
reviewer CMS workflows, and personalized recommendations.
"""

from typing import List, Dict, Optional, Any
from enum import Enum
from pydantic import BaseModel, Field


class EvidenceStrengthLevel(str, Enum):
    LEVEL_1_META_ANALYSIS = "level_1_meta_analysis"  # High: Multiple RCTs / Systematic Review
    LEVEL_2_CONTROLLED_TRIAL = "level_2_controlled_trial"  # Moderate: Quasi-experimental / Clinical trial
    LEVEL_3_FIELD_PILOT = "level_3_field_pilot"  # Emerging: Peer-reviewed field pilot / Qualitative consensus


class ApprovalStatus(str, Enum):
    DRAFT = "draft"
    UNDER_REVIEW = "under_review"
    APPROVED_PENDING_CLINICAL_SIGNOFF = "approved_pending_clinical_signoff"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class DepartmentId(str, Enum):
    EMOTIONAL_INTELLIGENCE = "emotional_intelligence"
    EMOTIONAL_VOCABULARY = "emotional_vocabulary"
    SELF_REGULATION_COPING = "self_regulation_coping"
    EMPATHY = "empathy"
    FRIENDSHIP_RELATIONSHIPS = "friendship_relationships"
    CONFIDENCE_SELF_ESTEEM = "confidence_self_esteem"
    RESILIENCE_SETBACKS = "resilience_setbacks"
    COMMUNICATION_SKILLS = "communication_skills"
    CRITICAL_THINKING = "critical_thinking"
    PROBLEM_SOLVING = "problem_solving"
    EXECUTIVE_FUNCTIONING = "executive_functioning"
    ATTENTION_PLANNING = "attention_planning"
    MEMORY_LEARNING_STRATEGIES = "memory_learning_strategies"
    LANGUAGE_DEVELOPMENT = "language_development"
    CREATIVITY_CURIOSITY = "creativity_curiosity"
    PERSONAL_SAFETY_BOUNDARIES = "personal_safety_boundaries"
    BULLYING_PREVENTION_HELP = "bullying_prevention_help"
    DIGITAL_SAFETY = "digital_safety"
    HEALTHY_HABITS_SLEEP = "healthy_habits_sleep"
    CAREGIVER_CHILD_RELATIONSHIPS = "caregiver_child_relationships"
    POSITIVE_PARENTING = "positive_parenting"
    ADHD_FRIENDLY_SUPPORT = "adhd_friendly_support"
    AUTISM_FRIENDLY_SUPPORT = "autism_friendly_support"
    INCLUSIVE_LEARNING_ACCESSIBILITY = "inclusive_learning_accessibility"
    ADOLESCENT_MENTAL_HEALTH_LITERACY = "adolescent_mental_health_literacy"


class DepartmentInfo(BaseModel):
    id: DepartmentId
    name: str
    name_ur: str
    name_pa: str
    description: str
    competency_domain: str
    evidence_framework: str  # e.g., "CASEL SEL / WHO Life Skills / Harvard Developing Child"
    color_accent: str


class AccessibilityAdaptations(BaseModel):
    visual: str = "High contrast, generous spacing, optional calm pastel filter"
    auditory: str = "Clear natural voice read-aloud, volume controls, no startling sounds"
    motor: str = "Large touch targets (>48px), keyboard navigation, untimed selection"
    sensory: str = "Low-motion option, zero flashing elements, low-stimulation theme"
    cognitive: str = "Literal instructions, visual icon cues, optional repetition without penalty"


class InteractiveChoice(BaseModel):
    choice_id: str
    text_en: str
    text_ur: str
    text_pa: str
    reflection_feedback: str


class InteractiveStory(BaseModel):
    title_en: str
    title_ur: str
    title_pa: str
    story_text_en: str
    story_text_ur: str
    story_text_pa: str
    character_name: str = "Lumi"
    choices: List[InteractiveChoice] = Field(default_factory=list)


class VoiceActivity(BaseModel):
    title: str
    audio_prompt_en: str
    audio_prompt_ur: str
    audio_prompt_pa: str
    guided_exercise_type: str  # e.g. "bunny_breaths", "belly_pause", "humming_reset", "voice_reflection"
    pacing_seconds: int = 45


class TextActivity(BaseModel):
    title: str
    prompt_en: str
    prompt_ur: str
    prompt_pa: str
    suggested_chips: List[str] = Field(default_factory=list)
    reflective_guidance: str = ""


class OfflineActivity(BaseModel):
    title: str
    instructions_en: str
    instructions_ur: str
    instructions_pa: str
    materials_needed: List[str] = Field(default_factory=list)
    caregiver_or_peer_role: str = "Caregiver participates as an empathetic listening partner."


class KnowledgeCheck(BaseModel):
    question_en: str
    question_ur: str
    question_pa: str
    options: List[Dict[str, str]]  # list of {"id": "opt_1", "text": "...", "is_helpful": True}
    affirmation_en: str
    affirmation_ur: str
    affirmation_pa: str


class CurriculumModule(BaseModel):
    module_id: str = Field(..., description="Unique immutable module identifier")
    department_id: DepartmentId
    title_en: str
    title_ur: str
    title_pa: str
    target_age_range: str = Field(..., description="'2-5', '6-9', '10-12', '13-18'")
    difficulty: str = Field("gentle", description="'gentle', 'intermediate', 'reflective'")
    developmental_objective: str
    research_references: List[str] = Field(default_factory=list)
    evidence_strength: EvidenceStrengthLevel = EvidenceStrengthLevel.LEVEL_1_META_ANALYSIS
    reviewer_name: str = "Multidisciplinary Clinical Review Board"
    approval_status: ApprovalStatus = ApprovalStatus.DRAFT
    version: str = "1.0.0"
    recommended_session_duration_min: int = 10
    accessibility_adaptations: AccessibilityAdaptations = Field(default_factory=AccessibilityAdaptations)
    interactive_story: InteractiveStory
    voice_based_activity: VoiceActivity
    text_based_activity: TextActivity
    offline_activity: OfflineActivity
    knowledge_check: KnowledgeCheck
    non_diagnostic_progress_indicator: str
    safety_and_escalation: Dict[str, Any] = Field(default_factory=dict)
    is_published: bool = False
    created_at: str = ""
    updated_at: str = ""


class CurriculumModuleCreate(BaseModel):
    module_id: str
    department_id: DepartmentId
    title_en: str
    title_ur: str
    title_pa: str
    target_age_range: str
    difficulty: str = "gentle"
    developmental_objective: str
    research_references: List[str]
    evidence_strength: EvidenceStrengthLevel
    reviewer_name: str
    recommended_session_duration_min: int = 10
    interactive_story: InteractiveStory
    voice_based_activity: VoiceActivity
    text_based_activity: TextActivity
    offline_activity: OfflineActivity
    knowledge_check: KnowledgeCheck
    non_diagnostic_progress_indicator: str


class CurriculumModuleUpdate(BaseModel):
    title_en: Optional[str] = None
    title_ur: Optional[str] = None
    title_pa: Optional[str] = None
    developmental_objective: Optional[str] = None
    research_references: Optional[List[str]] = None
    evidence_strength: Optional[EvidenceStrengthLevel] = None
    reviewer_name: Optional[str] = None
    approval_status: Optional[ApprovalStatus] = None
    version: Optional[str] = None
    recommended_session_duration_min: Optional[int] = None
    is_published: Optional[bool] = None


class RecommendationRequest(BaseModel):
    age_range: str  # "2-5", "6-9", "10-12", "13-18"
    chosen_goals: List[str] = Field(default_factory=list)  # e.g., ["focus", "friendship", "calm", "sleep"]
    completed_module_ids: List[str] = Field(default_factory=list)
    sensory_preference: Optional[str] = "standard"  # "standard", "low_stimulation", "dyslexia_font"
    language: Optional[str] = "en"  # "en", "ur", "pa"


class RecommendationResponse(BaseModel):
    recommended_modules: List[CurriculumModule]
    primary_recommendation_reason: str
    age_band_display: str


class ApprovalActionRequest(BaseModel):
    module_id: str
    target_status: ApprovalStatus
    reviewer_name: str
    reviewer_notes: str
    signed_clinical_disclaimer: bool = True


class ApprovalActionResponse(BaseModel):
    module_id: str
    previous_status: ApprovalStatus
    new_status: ApprovalStatus
    timestamp: str
    message: str
