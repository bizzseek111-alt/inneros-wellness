"""InnerOS Memory & Life Graph Domain Schemas.

Enforces strict separation between verified stored facts and tentative AI interpretations,
explicit opt-in consent for sensitive health context, comprehensive provenance,
uncertainty metrics, audit logging, and GDPR Article 17/20 data portability.
"""

from enum import Enum
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, model_validator


class MemoryCategory(str, Enum):
    """The 9 official InnerOS personal memory categories plus legacy aliases."""
    COMMUNICATION_PREFERENCES = "communication_preferences"
    PERSONAL_GOALS = "personal_goals"
    USER_CONFIRMED_LIFE_EVENTS = "user_confirmed_life_events"
    HABITS_AND_ROUTINES = "habits_and_routines"
    WORK_AND_CAREER_INFORMATION = "work_and_career_information"
    RELATIONSHIPS_AND_FAMILY_CONTEXT = "relationships_and_family_context"
    SELF_REPORTED_EMOTIONS = "self_reported_emotions"
    COPING_PREFERENCES = "coping_preferences"
    OPTIONAL_SENSITIVE_HEALTH_RELATED_INFORMATION = "optional_sensitive_health_related_information"

    # Backward compatibility aliases
    HABIT = "habit"
    RELATIONSHIP = "relationship"
    VALUE = "value"
    STRESS_TRIGGER = "stress_trigger"
    WORK_LIFE = "work_life"
    PERSONAL_GOAL = "personal_goal"


class MemoryRecordType(str, Enum):
    """Strict separation of confirmed ground facts from tentative AI hypotheses."""
    STORED_FACT = "stored_fact"  # Directly confirmed or asserted by user
    TENTATIVE_AI_INTERPRETATION = "tentative_ai_interpretation"  # Tentative model hypothesis


class MemoryStatus(str, Enum):
    """Lifecycle status for consent-governed memory items."""
    SUGGESTED = "suggested"  # Staged for confirmation; withheld from companion context
    CONFIRMED = "confirmed"  # Approved by user; active in context assembly
    REJECTED = "rejected"  # Dismissed by user; withheld and slated for purge
    ARCHIVED = "archived"  # Historical reference; inactive in live context


class CertaintyLevel(str, Enum):
    """Uncertainty indicators accompanying all memory items."""
    TENTATIVE = "tentative"  # < 0.6 confidence or unconfirmed pattern
    MODERATE = "moderate"    # 0.6 - 0.85 confidence
    HIGH = "high"            # 0.85 - 0.99 confidence
    USER_VERIFIED = "user_verified"  # 1.0 explicit user confirmation


class MemoryConsentLevel(str, Enum):
    """Legacy backward-compatible consent level."""
    STRICTLY_PRIVATE = "strictly_private"  # Stored encrypted, never recalled by AI
    COMPANION_RECALLABLE = "companion_recallable"  # Available for context assembly
    EPHEMERAL = "ephemeral"  # Cleared after session termination


class MemoryProvenance(BaseModel):
    """Full provenance tracking for auditability and explainability."""
    source_session_id: Optional[str] = None
    source_type: str = "explicit_user_statement"  # explicit_user_statement, inferred_ai_observation, manual_user_entry
    source_quote: Optional[str] = None
    extracted_by: str = "user_direct"  # user_direct, companion_memory_extractor_v1
    extracted_at: datetime = Field(default_factory=datetime.utcnow)


class MemoryRecord(BaseModel):
    """Core memory item with fact/interpretation isolation and provenance."""
    id: str
    user_id: str
    category: MemoryCategory
    record_type: MemoryRecordType = MemoryRecordType.STORED_FACT
    status: MemoryStatus = MemoryStatus.CONFIRMED
    fact_statement: str
    fact_text: str = ""  # Serialized backward-compatible field
    consent_level: MemoryConsentLevel = MemoryConsentLevel.COMPANION_RECALLABLE
    raw_context: Optional[str] = None
    confidence_score: float = Field(ge=0.0, le=1.0, default=1.0)
    certainty_level: CertaintyLevel = CertaintyLevel.USER_VERIFIED
    provenance: MemoryProvenance
    emotional_valence: Optional[str] = "neutral"  # positive, neutral, challenging, reflective
    is_sensitive: bool = False
    user_consent_verified: bool = True
    tags: List[str] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime
    expires_at: Optional[datetime] = None  # TTL expiration timestamp
    next_review_due_at: Optional[datetime] = None  # Periodic review timestamp
    encryption_metadata: Dict[str, str] = Field(default_factory=lambda: {
        "storage_mode": "aes_256_gcm_encrypted",
        "envelope_id": "dek_user_primary",
    })

    @model_validator(mode="before")
    @classmethod
    def populate_compat_fields(cls, values):
        if isinstance(values, dict):
            if "fact_statement" in values and not values.get("fact_text"):
                values["fact_text"] = values["fact_statement"]
            elif "fact_text" in values and not values.get("fact_statement"):
                values["fact_statement"] = values["fact_text"]
            if "status" in values and not values.get("consent_level"):
                values["consent_level"] = (
                    MemoryConsentLevel.COMPANION_RECALLABLE
                    if values.get("status") == MemoryStatus.CONFIRMED
                    else MemoryConsentLevel.STRICTLY_PRIVATE
                )
        return values


class MemoryCreateRequest(BaseModel):
    category: MemoryCategory
    fact_statement: Optional[str] = None
    fact_text: Optional[str] = None
    record_type: MemoryRecordType = MemoryRecordType.STORED_FACT
    status: MemoryStatus = MemoryStatus.CONFIRMED
    confidence_score: Optional[float] = 1.0
    certainty_level: Optional[CertaintyLevel] = CertaintyLevel.USER_VERIFIED
    emotional_valence: Optional[str] = "neutral"
    raw_context: Optional[str] = None
    source_session_id: Optional[str] = None
    source_quote: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    expires_in_days: Optional[int] = None
    consent_level: Optional[MemoryConsentLevel] = None

    @model_validator(mode="before")
    @classmethod
    def check_statement_or_text(cls, values):
        if isinstance(values, dict):
            stmt = values.get("fact_statement") or values.get("fact_text")
            if not stmt:
                raise ValueError("Either fact_statement or fact_text must be provided.")
            values["fact_statement"] = stmt
            values["fact_text"] = stmt
        return values


class MemoryUpdateRequest(BaseModel):
    fact_statement: Optional[str] = None
    category: Optional[MemoryCategory] = None
    emotional_valence: Optional[str] = None
    certainty_level: Optional[CertaintyLevel] = None
    tags: Optional[List[str]] = None
    next_review_due_at: Optional[datetime] = None


class MemorySuggestionActionRequest(BaseModel):
    action: str  # "confirm" or "reject"
    adjusted_statement: Optional[str] = None


# Life Graph Entities & Relationships
class LifeGraphNodeType(str, Enum):
    ROLE = "role"
    HABIT = "habit"
    GOAL = "goal"
    RELATIONSHIP = "relationship"
    STRESS_TRIGGER = "stress_trigger"
    COPING_STRATEGY = "coping_strategy"
    LIFE_EVENT = "life_event"
    VALUE = "value"
    HEALTH_CONTEXT = "health_context"


class LifeGraphNode(BaseModel):
    id: str
    user_id: str
    label: str
    node_type: LifeGraphNodeType
    description: str
    linked_memory_id: Optional[str] = None
    record_type: MemoryRecordType = MemoryRecordType.STORED_FACT
    emotional_charge: str = "neutral"  # positive, neutral, challenging
    is_tentative: bool = False
    created_at: datetime


class LifeGraphEdge(BaseModel):
    id: str
    user_id: str
    source_node_id: str
    target_node_id: str
    relation: str  # supports, mitigates, triggers, reinforces, relates_to, anchors
    confidence: float = 1.0
    is_tentative: bool = False
    created_at: datetime


class LifeGraphResponse(BaseModel):
    nodes: List[LifeGraphNode]
    edges: List[LifeGraphEdge]
    total_nodes: int
    total_edges: int
    facts_count: int
    tentative_count: int


class LifeGraphNodeCreateRequest(BaseModel):
    label: str
    node_type: LifeGraphNodeType
    description: str = ""
    linked_memory_id: Optional[str] = None
    record_type: MemoryRecordType = MemoryRecordType.STORED_FACT
    emotional_charge: str = "neutral"
    is_tentative: bool = False


class LifeGraphEdgeCreateRequest(BaseModel):
    source_node_id: str
    target_node_id: str
    relation: str
    confidence: Optional[float] = 1.0
    is_tentative: Optional[bool] = False


# Privacy, Consent & Audit Schemas
class UserMemoryConsent(BaseModel):
    user_id: str
    allow_memory_system: bool = True
    is_memory_recording_paused: bool = False  # Global pause memory toggle
    sensitive_health_consent_granted: bool = False  # Explicit opt-in for health category
    allowed_categories: List[MemoryCategory] = Field(default_factory=lambda: [
        MemoryCategory.COMMUNICATION_PREFERENCES,
        MemoryCategory.PERSONAL_GOALS,
        MemoryCategory.USER_CONFIRMED_LIFE_EVENTS,
        MemoryCategory.HABITS_AND_ROUTINES,
        MemoryCategory.WORK_AND_CAREER_INFORMATION,
        MemoryCategory.RELATIONSHIPS_AND_FAMILY_CONTEXT,
        MemoryCategory.SELF_REPORTED_EMOTIONS,
        MemoryCategory.COPING_PREFERENCES,
    ])
    auto_expire_tentative_days: int = 30
    require_confirmation_for_all_suggestions: bool = True
    updated_at: datetime

    # Backward compatibility with initial skeleton
    allow_long_term_memory: bool = True
    allow_life_graph_links: bool = True
    allow_voice_analysis: bool = False
    allow_calendar_context: bool = False


# Backward compatibility alias
UserConsentSettings = UserMemoryConsent


class MemoryAuditAction(str, Enum):
    CREATED = "created"
    SUGGESTED = "suggested"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"
    EDITED = "edited"
    DELETED_SINGLE = "deleted_single"
    PURGED_ALL = "purged_all"
    EXPORTED = "exported"
    PAUSED = "paused"
    RESUMED = "resumed"
    EXPIRED_AUTO = "expired_auto"


class MemoryAuditLogEntry(BaseModel):
    id: str
    user_id: str
    action: MemoryAuditAction
    target_id: Optional[str] = None
    target_type: str = "memory"  # memory, life_graph_node, all_user_data, consent_settings
    actor: str = "user"  # user, companion_system, retrieval_engine
    details: Dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime


class DataExportBundle(BaseModel):
    """GDPR Article 20 / CCPA machine-readable personal data export bundle."""
    user_id: str
    export_timestamp: datetime
    format_version: str = "2.0.0"
    encryption_status: str = "decrypted_for_authorized_data_subject"
    memory_records: List[MemoryRecord]
    life_graph_nodes: List[LifeGraphNode]
    life_graph_edges: List[LifeGraphEdge]
    consent_settings: UserMemoryConsent
    audit_trail: List[MemoryAuditLogEntry]
    summary_stats: Dict[str, Any]
