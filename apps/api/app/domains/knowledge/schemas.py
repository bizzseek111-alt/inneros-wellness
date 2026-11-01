"""Knowledge Domain Schemas.
Data contracts for Psychology Department taxonomy, evidence-quality grading,
publication metadata, peer-reviewed citations, licensing, review workflows,
and context-sensitive retrieval.
"""

from enum import Enum
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class PsychologyDepartment(str, Enum):
    CLINICAL = "clinical"
    COUNSELING = "counseling"
    COGNITIVE = "cognitive"
    BEHAVIORAL = "behavioral"
    SOCIAL = "social"
    PERSONALITY = "personality"
    DEVELOPMENTAL = "developmental"
    RELATIONSHIP_FAMILY_INTIMACY = "relationship_family_intimacy"
    ORGANIZATIONAL = "organizational"
    HEALTH = "health"
    NEUROPSYCHOLOGY = "neuropsychology"
    ADDICTION = "addiction"
    TRAUMA_CRISIS = "trauma_crisis"
    CULTURAL = "cultural"
    EDUCATIONAL = "educational"
    PERFORMANCE_SPORT = "performance_sport"
    POSITIVE = "positive"


class EvidenceQualityLevel(str, Enum):
    LEVEL_1_META_ANALYSIS = "level_1_meta_analysis"  # Cochrane reviews, systematic reviews with meta-analyses
    LEVEL_2_RCT = "level_2_rct"  # Randomized controlled trials
    LEVEL_3_QUASI_EXPERIMENTAL = "level_3_quasi_experimental"  # Controlled trials, longitudinal cohorts
    LEVEL_4_OBSERVATIONAL = "level_4_observational"  # Correlational, cross-sectional, survey studies
    LEVEL_5_CLINICAL_GUIDELINE = "level_5_clinical_guideline"  # APA, NICE, WHO expert consensus guidelines
    LEVEL_6_ACADEMIC_TEXTBOOK = "level_6_academic_textbook"  # University press peer-reviewed textbooks
    LEVEL_7_TRADE_POP_PSYCHOLOGY = "level_7_trade_pop_psychology"  # Commercial self-help / non-peer-reviewed


class ReviewStatus(str, Enum):
    DRAFT = "draft"
    IN_PEER_REVIEW = "in_peer_review"
    APPROVED_FOR_COMPANION = "approved_for_companion"
    REJECTED = "rejected"
    EXPIRED_PENDING_REVIEW = "expired_pending_review"
    ARCHIVED = "archived"


class LicenseType(str, Enum):
    OPEN_ACCESS_CC_BY = "open_access_cc_by"
    ACADEMIC_FAIR_USE_SUMMARY = "academic_fair_use_summary"
    ORIGINAL_PROPRIETARY = "original_proprietary"
    COMMERCIAL_RIGHTS_VERIFIED = "commercial_rights_verified"
    PUBLIC_DOMAIN = "public_domain"


class PublicationMetadata(BaseModel):
    publication_type: str  # "peer_reviewed_journal_article", "academic_textbook", "clinical_guideline", "trade_self_help_book"
    title: str
    authors: List[str]
    year: int
    publisher_or_journal: str
    isbn_or_doi: Optional[str] = None
    peer_reviewed: bool = True
    author_credentials: Optional[str] = None


class PeerReviewedCitation(BaseModel):
    apa_citation: str
    doi_or_url: Optional[str] = None
    study_type: str  # "meta_analysis", "systematic_review", "rct", "longitudinal_cohort", "clinical_consensus", "trade_book"
    sample_size: Optional[int] = None
    replication_status: str = "established_consensus"  # "replicated", "established_consensus", "preliminary", "under_debate"


class ReviewMetadata(BaseModel):
    reviewer_id: str
    reviewer_name: str
    reviewer_credentials: str  # e.g. "PhD in Clinical Psychology, Licensed Psychologist"
    reviewed_at: datetime
    review_decision: ReviewStatus
    review_notes: str
    clinical_safety_audit_passed: bool = True


class LicensingMetadata(BaseModel):
    license_type: LicenseType
    copyright_owner: str
    commercial_use_permitted: bool = True
    rights_verified: bool = True
    attribution_required: bool = True
    license_verification_date: Optional[datetime] = None


class KnowledgeUsageRestrictions(BaseModel):
    allowed_in_companion_chat: bool = True
    allowed_in_psychoeducation_library: bool = True
    prohibited_for_diagnosis: bool = True
    prohibited_for_prescription: bool = True
    requires_human_clinician_supervision: bool = False
    non_clinical_disclaimer: str = (
        "Educational and self-reflection material only. Not clinical medical advice or DSM diagnostic evaluation."
    )


class ExerciseStep(BaseModel):
    step_number: int
    instruction: str
    duration_seconds: Optional[int] = None


class PsychoeducationExercise(BaseModel):
    id: str
    title: str
    type: str  # "breathwork", "somatic_grounding", "reflective_inquiry", "defusion_exercise"
    target_state: str  # e.g. "Anxiety de-escalation", "Sleep preparation"
    duration_minutes: int
    guidance: str
    steps: List[ExerciseStep]


class KnowledgeRecord(BaseModel):
    id: str
    department: PsychologyDepartment
    subfield: str
    title: str
    short_summary: str
    full_explanation: str
    theoretical_models: List[str] = Field(default_factory=list)
    key_takeaways: List[str] = Field(default_factory=list)
    practical_reflection_prompts: List[str] = Field(default_factory=list)
    exercises: List[PsychoeducationExercise] = Field(default_factory=list)
    contraindications: List[str] = Field(default_factory=list)
    target_emotional_states: List[str] = Field(default_factory=list)
    
    # Evidence & Provenance
    evidence_level: EvidenceQualityLevel
    is_peer_reviewed_scientific: bool = True
    publications: List[PublicationMetadata] = Field(default_factory=list)
    citations: List[PeerReviewedCitation] = Field(default_factory=list)
    
    # Review & Lifecycle
    review_status: ReviewStatus = ReviewStatus.APPROVED_FOR_COMPANION
    review_history: List[ReviewMetadata] = Field(default_factory=list)
    version: str = "1.0.0"
    created_at: datetime
    last_reviewed_at: datetime
    next_review_due_at: datetime
    
    # Rights & Safety
    rights_and_licensing: LicensingMetadata
    usage_restrictions: KnowledgeUsageRestrictions = Field(default_factory=KnowledgeUsageRestrictions)
    tags: List[str] = Field(default_factory=list)


class DepartmentTaxonomyInfo(BaseModel):
    department: PsychologyDepartment
    name: str
    scope_description: str
    core_theories: List[str]
    sample_subfields: List[str]
    non_clinical_boundary: str


class ContextRetrievalRequest(BaseModel):
    utterance: str
    emotional_state: Optional[str] = None
    conversation_mode: Optional[str] = "just_listen"
    department: Optional[PsychologyDepartment] = None
    min_evidence_level: Optional[EvidenceQualityLevel] = None
    peer_reviewed_only: bool = True
    max_records: int = 3


class ContextRetrievalResponse(BaseModel):
    query_analyzed: str
    orchestrator_notice: str = (
        "Internal Chief Psychology Knowledge Orchestrator. Educational knowledge engine; "
        "not a human licensed psychologist. All returned resources are peer-reviewed and rights-verified."
    )
    records: List[KnowledgeRecord]
    retrieved_count: int
    context_synthesis: str


class ReviewActionRequest(BaseModel):
    reviewer_id: str
    reviewer_name: str
    reviewer_credentials: str
    decision: ReviewStatus
    notes: str
    next_review_months: int = 12
