"""InnerOS Memory & Life Graph Service.

Implements:
1. Strict separation of confirmed facts from tentative AI interpretations
2. Suggested memory staging and confirmation workflow
3. Provenance and uncertainty scoring
4. Granular consent and explicit opt-in for sensitive health context
5. Ephemeral/temporary conversation isolation
6. Global memory pause toggle
7. Single-memory deletion with graph cascade (GDPR Art. 17)
8. Nuclear purge of all derived memory records
9. Machine-readable data export (GDPR Art. 20)
10. Immutable audit logging
"""

import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any

from app.domains.memory.schemas import (
    MemoryCategory,
    MemoryRecordType,
    MemoryStatus,
    CertaintyLevel,
    MemoryConsentLevel,
    MemoryProvenance,
    MemoryRecord,
    MemoryCreateRequest,
    MemoryUpdateRequest,
    LifeGraphNodeType,
    LifeGraphNode,
    LifeGraphEdge,
    LifeGraphResponse,
    LifeGraphNodeCreateRequest,
    LifeGraphEdgeCreateRequest,
    UserMemoryConsent,
    MemoryAuditAction,
    MemoryAuditLogEntry,
    DataExportBundle,
)
from app.core.observability import logger

# In-memory stores partitioned by user_id for strict tenant isolation
_MEMORY_RECORDS_STORE: Dict[str, Dict[str, MemoryRecord]] = {}
_LIFE_GRAPH_NODES_STORE: Dict[str, Dict[str, LifeGraphNode]] = {}
_LIFE_GRAPH_EDGES_STORE: Dict[str, Dict[str, LifeGraphEdge]] = {}
_CONSENT_STORE: Dict[str, UserMemoryConsent] = {}
_AUDIT_LOGS_STORE: Dict[str, List[MemoryAuditLogEntry]] = {}


def _get_utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _log_audit_event(
    user_id: str,
    action: MemoryAuditAction,
    target_id: Optional[str] = None,
    target_type: str = "memory",
    actor: str = "user",
    details: Optional[Dict[str, Any]] = None,
):
    """Appends an immutable audit log entry scoped to the tenant."""
    if user_id not in _AUDIT_LOGS_STORE:
        _AUDIT_LOGS_STORE[user_id] = []

    entry = MemoryAuditLogEntry(
        id=f"audit_{uuid.uuid4().hex[:12]}",
        user_id=user_id,
        action=action,
        target_id=target_id,
        target_type=target_type,
        actor=actor,
        details=details or {},
        timestamp=_get_utc_now(),
    )
    _AUDIT_LOGS_STORE[user_id].append(entry)


def _init_synthetic_user_memory(user_id: str):
    """Initializes realistic non-clinical synthetic memory and life graph data for a user."""
    if user_id in _CONSENT_STORE:
        return

    now = _get_utc_now()
    review_due = now + timedelta(days=90)

    # 1. User Consent Settings
    _CONSENT_STORE[user_id] = UserMemoryConsent(
        user_id=user_id,
        allow_memory_system=True,
        is_memory_recording_paused=False,
        sensitive_health_consent_granted=False,  # Explicit opt-in required
        allowed_categories=[
            MemoryCategory.COMMUNICATION_PREFERENCES,
            MemoryCategory.PERSONAL_GOALS,
            MemoryCategory.USER_CONFIRMED_LIFE_EVENTS,
            MemoryCategory.HABITS_AND_ROUTINES,
            MemoryCategory.WORK_AND_CAREER_INFORMATION,
            MemoryCategory.RELATIONSHIPS_AND_FAMILY_CONTEXT,
            MemoryCategory.SELF_REPORTED_EMOTIONS,
            MemoryCategory.COPING_PREFERENCES,
        ],
        auto_expire_tentative_days=30,
        require_confirmation_for_all_suggestions=True,
        updated_at=now,
    )

    _MEMORY_RECORDS_STORE[user_id] = {}
    _LIFE_GRAPH_NODES_STORE[user_id] = {}
    _LIFE_GRAPH_EDGES_STORE[user_id] = {}
    _AUDIT_LOGS_STORE[user_id] = []

    # 2. Seeded Verified Facts
    fact_habit_id = f"mem_habit_{uuid.uuid4().hex[:6]}"
    mem_habit = MemoryRecord(
        id=fact_habit_id,
        user_id=user_id,
        category=MemoryCategory.HABITS_AND_ROUTINES,
        record_type=MemoryRecordType.STORED_FACT,
        status=MemoryStatus.CONFIRMED,
        fact_statement="Practices 10-minute morning breathwork before opening email or communication apps.",
        raw_context="Elena mentioned this routine creates psychological buffer time before daily design critiques.",
        confidence_score=1.0,
        certainty_level=CertaintyLevel.USER_VERIFIED,
        provenance=MemoryProvenance(
            source_type="explicit_user_statement",
            source_quote="I do 10 minutes of box breathing every morning before touching Slack.",
            extracted_by="user_direct",
            extracted_at=now - timedelta(days=5),
        ),
        emotional_valence="positive",
        is_sensitive=False,
        user_consent_verified=True,
        tags=["morning_routine", "breathwork", "vagal_tone"],
        created_at=now - timedelta(days=5),
        updated_at=now - timedelta(days=5),
        next_review_due_at=review_due,
    )
    _MEMORY_RECORDS_STORE[user_id][fact_habit_id] = mem_habit

    fact_role_id = f"mem_role_{uuid.uuid4().hex[:6]}"
    mem_role = MemoryRecord(
        id=fact_role_id,
        user_id=user_id,
        category=MemoryCategory.WORK_AND_CAREER_INFORMATION,
        record_type=MemoryRecordType.STORED_FACT,
        status=MemoryStatus.CONFIRMED,
        fact_statement="Staff Product Designer leading the cross-functional design system architecture.",
        raw_context="Role involves high context-switching and cross-timezone stakeholder coordination.",
        confidence_score=1.0,
        certainty_level=CertaintyLevel.USER_VERIFIED,
        provenance=MemoryProvenance(
            source_type="explicit_user_statement",
            source_quote="I lead our global design systems team as staff designer.",
            extracted_by="user_direct",
            extracted_at=now - timedelta(days=10),
        ),
        emotional_valence="neutral",
        is_sensitive=False,
        user_consent_verified=True,
        tags=["career", "leadership", "design_systems"],
        created_at=now - timedelta(days=10),
        updated_at=now - timedelta(days=10),
        next_review_due_at=review_due,
    )
    _MEMORY_RECORDS_STORE[user_id][fact_role_id] = mem_role

    fact_comm_id = f"mem_comm_{uuid.uuid4().hex[:6]}"
    mem_comm = MemoryRecord(
        id=fact_comm_id,
        user_id=user_id,
        category=MemoryCategory.COMMUNICATION_PREFERENCES,
        record_type=MemoryRecordType.STORED_FACT,
        status=MemoryStatus.CONFIRMED,
        fact_statement="Prefers concise, compassionate reflections over long unsolicited advice.",
        raw_context="Expressed preference for being heard and understood first before problem-solving.",
        confidence_score=1.0,
        certainty_level=CertaintyLevel.USER_VERIFIED,
        provenance=MemoryProvenance(
            source_type="explicit_user_statement",
            source_quote="Please don't jump into giving advice right away. Just listen and help me settle.",
            extracted_by="user_direct",
            extracted_at=now - timedelta(days=8),
        ),
        emotional_valence="positive",
        is_sensitive=False,
        user_consent_verified=True,
        tags=["preference", "listening", "boundaries"],
        created_at=now - timedelta(days=8),
        updated_at=now - timedelta(days=8),
        next_review_due_at=review_due,
    )
    _MEMORY_RECORDS_STORE[user_id][fact_comm_id] = mem_comm

    fact_rel_id = f"mem_rel_{uuid.uuid4().hex[:6]}"
    mem_rel = MemoryRecord(
        id=fact_rel_id,
        user_id=user_id,
        category=MemoryCategory.RELATIONSHIPS_AND_FAMILY_CONTEXT,
        record_type=MemoryRecordType.STORED_FACT,
        status=MemoryStatus.CONFIRMED,
        fact_statement="Shares a close bond with younger sister Maya; they hold regular Sunday telephone walks.",
        raw_context="Maya is a key supportive anchor in Elena's relational life graph.",
        confidence_score=1.0,
        certainty_level=CertaintyLevel.USER_VERIFIED,
        provenance=MemoryProvenance(
            source_type="explicit_user_statement",
            source_quote="My sister Maya and I always do a long catch-up walk on Sundays.",
            extracted_by="user_direct",
            extracted_at=now - timedelta(days=6),
        ),
        emotional_valence="positive",
        is_sensitive=False,
        user_consent_verified=True,
        tags=["family", "sister", "support_network"],
        created_at=now - timedelta(days=6),
        updated_at=now - timedelta(days=6),
        next_review_due_at=review_due,
    )
    _MEMORY_RECORDS_STORE[user_id][fact_rel_id] = mem_rel

    # 3. Seeded Tentative AI Interpretation (STAGED SUGGESTION — NOT CONFIRMED)
    sugg_walk_id = f"mem_sugg_{uuid.uuid4().hex[:6]}"
    mem_sugg = MemoryRecord(
        id=sugg_walk_id,
        user_id=user_id,
        category=MemoryCategory.HABITS_AND_ROUTINES,
        record_type=MemoryRecordType.TENTATIVE_AI_INTERPRETATION,
        status=MemoryStatus.SUGGESTED,  # Requires user confirmation!
        fact_statement="Tentative observation: User reports greatest nervous system recovery following 20-minute dusk walks in natural light.",
        raw_context="Derived from journal reflection on Oct 30 where user reported post-critique calm after an outdoor dusk walk.",
        confidence_score=0.74,
        certainty_level=CertaintyLevel.TENTATIVE,
        provenance=MemoryProvenance(
            source_type="inferred_ai_observation",
            source_quote="Took the full 20-minute walk at dusk... realized not every comment requires rebuttal.",
            extracted_by="companion_memory_extractor_v1",
            extracted_at=now - timedelta(hours=12),
        ),
        emotional_valence="positive",
        is_sensitive=False,
        user_consent_verified=False,  # Unconfirmed
        tags=["dusk_walk", "nature", "somatic_regulation"],
        created_at=now - timedelta(hours=12),
        updated_at=now - timedelta(hours=12),
        expires_at=now + timedelta(days=30),  # Auto-expires in 30 days if unconfirmed
    )
    _MEMORY_RECORDS_STORE[user_id][sugg_walk_id] = mem_sugg

    # 4. Seeded Life Graph Nodes & Edges
    node_lead_id = "node_lead_designer"
    node_breath_id = "node_morning_breathwork"
    node_critique_id = "node_critique_fatigue"
    node_maya_id = "node_sister_maya"
    node_walk_id = "node_dusk_walk"
    node_craft_id = "node_craftsmanship"

    _LIFE_GRAPH_NODES_STORE[user_id][node_lead_id] = LifeGraphNode(
        id=node_lead_id,
        user_id=user_id,
        label="Staff Design Lead",
        node_type=LifeGraphNodeType.ROLE,
        description="Leads global design systems across cross-functional product groups.",
        linked_memory_id=fact_role_id,
        record_type=MemoryRecordType.STORED_FACT,
        emotional_charge="neutral",
        is_tentative=False,
        created_at=now - timedelta(days=10),
    )

    _LIFE_GRAPH_NODES_STORE[user_id][node_breath_id] = LifeGraphNode(
        id=node_breath_id,
        user_id=user_id,
        label="10-min Morning Breathwork",
        node_type=LifeGraphNodeType.HABIT,
        description="Daily somatic grounding ritual before opening screens.",
        linked_memory_id=fact_habit_id,
        record_type=MemoryRecordType.STORED_FACT,
        emotional_charge="positive",
        is_tentative=False,
        created_at=now - timedelta(days=5),
    )

    _LIFE_GRAPH_NODES_STORE[user_id][node_critique_id] = LifeGraphNode(
        id=node_critique_id,
        user_id=user_id,
        label="Back-to-Back Critiques",
        node_type=LifeGraphNodeType.STRESS_TRIGGER,
        description="Extended review meetings without transition intervals trigger cognitive fatigue.",
        linked_memory_id=None,
        record_type=MemoryRecordType.STORED_FACT,
        emotional_charge="challenging",
        is_tentative=False,
        created_at=now - timedelta(days=7),
    )

    _LIFE_GRAPH_NODES_STORE[user_id][node_maya_id] = LifeGraphNode(
        id=node_maya_id,
        user_id=user_id,
        label="Sister Maya",
        node_type=LifeGraphNodeType.RELATIONSHIP,
        description="Younger sister; weekly telephone walks providing relational warmth.",
        linked_memory_id=fact_rel_id,
        record_type=MemoryRecordType.STORED_FACT,
        emotional_charge="positive",
        is_tentative=False,
        created_at=now - timedelta(days=6),
    )

    _LIFE_GRAPH_NODES_STORE[user_id][node_walk_id] = LifeGraphNode(
        id=node_walk_id,
        user_id=user_id,
        label="20-min Dusk Nature Walk",
        node_type=LifeGraphNodeType.HABIT,
        description="Tentative pattern: De-escalates work-day autonomic tension.",
        linked_memory_id=sugg_walk_id,
        record_type=MemoryRecordType.TENTATIVE_AI_INTERPRETATION,
        emotional_charge="positive",
        is_tentative=True,
        created_at=now - timedelta(hours=12),
    )

    _LIFE_GRAPH_NODES_STORE[user_id][node_craft_id] = LifeGraphNode(
        id=node_craft_id,
        user_id=user_id,
        label="Intentional Craftsmanship",
        node_type=LifeGraphNodeType.VALUE,
        description="Core commitment to purposeful, deliberate, human-centered design quality.",
        linked_memory_id=None,
        record_type=MemoryRecordType.STORED_FACT,
        emotional_charge="positive",
        is_tentative=False,
        created_at=now - timedelta(days=12),
    )

    # Connect Edges
    edge_1 = f"edge_{uuid.uuid4().hex[:6]}"
    edge_2 = f"edge_{uuid.uuid4().hex[:6]}"
    edge_3 = f"edge_{uuid.uuid4().hex[:6]}"
    edge_4 = f"edge_{uuid.uuid4().hex[:6]}"

    _LIFE_GRAPH_EDGES_STORE[user_id][edge_1] = LifeGraphEdge(
        id=edge_1,
        user_id=user_id,
        source_node_id=node_lead_id,
        target_node_id=node_critique_id,
        relation="triggers",
        confidence=0.9,
        is_tentative=False,
        created_at=now - timedelta(days=7),
    )

    _LIFE_GRAPH_EDGES_STORE[user_id][edge_2] = LifeGraphEdge(
        id=edge_2,
        user_id=user_id,
        source_node_id=node_breath_id,
        target_node_id=node_critique_id,
        relation="mitigates",
        confidence=0.95,
        is_tentative=False,
        created_at=now - timedelta(days=5),
    )

    _LIFE_GRAPH_EDGES_STORE[user_id][edge_3] = LifeGraphEdge(
        id=edge_3,
        user_id=user_id,
        source_node_id=node_walk_id,
        target_node_id=node_critique_id,
        relation="mitigates",
        confidence=0.74,
        is_tentative=True,
        created_at=now - timedelta(hours=12),
    )

    _LIFE_GRAPH_EDGES_STORE[user_id][edge_4] = LifeGraphEdge(
        id=edge_4,
        user_id=user_id,
        source_node_id=node_maya_id,
        target_node_id=node_walk_id,
        relation="supports",
        confidence=0.88,
        is_tentative=False,
        created_at=now - timedelta(days=6),
    )

    # Initial Seed Audit Log
    _log_audit_event(
        user_id=user_id,
        action=MemoryAuditAction.CREATED,
        target_id=fact_habit_id,
        actor="synthetic_seeder",
        details={"seed_type": "synthetic_persona_elena_vance"},
    )


class MemoryService:
    """Enterprise-grade, privacy-first personal memory and life graph service."""

    # ---------------------------------------------------------
    # Consent & Privacy Controls
    # ---------------------------------------------------------
    def get_consent(self, user_id: str) -> UserMemoryConsent:
        _init_synthetic_user_memory(user_id)
        return _CONSENT_STORE[user_id]

    def update_consent(self, user_id: str, new_settings: UserMemoryConsent) -> UserMemoryConsent:
        _init_synthetic_user_memory(user_id)
        current = _CONSENT_STORE[user_id]

        # Audit pause / resume transitions
        if current.is_memory_recording_paused != new_settings.is_memory_recording_paused:
            action = MemoryAuditAction.PAUSED if new_settings.is_memory_recording_paused else MemoryAuditAction.RESUMED
            _log_audit_event(user_id=user_id, action=action, target_type="consent_settings")

        new_settings.updated_at = _get_utc_now()
        _CONSENT_STORE[user_id] = new_settings
        logger.info(f"Memory consent updated for user {user_id}")
        return new_settings

    def pause_memory(self, user_id: str) -> UserMemoryConsent:
        consent = self.get_consent(user_id)
        consent.is_memory_recording_paused = True
        return self.update_consent(user_id, consent)

    def resume_memory(self, user_id: str) -> UserMemoryConsent:
        consent = self.get_consent(user_id)
        consent.is_memory_recording_paused = False
        return self.update_consent(user_id, consent)

    # ---------------------------------------------------------
    # Memory CRUD & Staging Workflow
    # ---------------------------------------------------------
    def list_memories(
        self,
        user_id: str,
        category: Optional[MemoryCategory] = None,
        status: Optional[MemoryStatus] = None,
        record_type: Optional[MemoryRecordType] = None,
        search_query: Optional[str] = None,
    ) -> List[MemoryRecord]:
        _init_synthetic_user_memory(user_id)
        consent = self.get_consent(user_id)

        # Global memory disabled check
        if not consent.allow_memory_system or not consent.allow_long_term_memory:
            return []

        memories = list(_MEMORY_RECORDS_STORE.get(user_id, {}).values())

        # Category filter
        if category:
            memories = [m for m in memories if m.category == category]

        # Status filter
        if status:
            memories = [m for m in memories if m.status == status]

        # Record type filter (stored fact vs tentative AI interpretation)
        if record_type:
            memories = [m for m in memories if m.record_type == record_type]

        # Keyword search
        if search_query:
            q = search_query.lower()
            memories = [
                m for m in memories
                if q in m.fact_statement.lower()
                or (m.raw_context and q in m.raw_context.lower())
                or any(q in t.lower() for t in m.tags)
            ]

        # Sort descending by updated_at
        return sorted(memories, key=lambda m: m.updated_at, reverse=True)

    def get_memory(self, user_id: str, memory_id: str) -> Optional[MemoryRecord]:
        _init_synthetic_user_memory(user_id)
        return _MEMORY_RECORDS_STORE.get(user_id, {}).get(memory_id)

    def add_memory(
        self,
        user_id: str,
        req: MemoryCreateRequest,
        is_temporary_conversation: bool = False,
    ) -> Optional[MemoryRecord]:
        """Adds a memory item or stages a suggestion under strict consent rules.

        - If is_temporary_conversation is True, zero memories are stored.
        - If memory recording is paused, request is declined.
        - Sensitive health category strictly requires sensitive_health_consent_granted.
        """
        # Feature 8: Temporary Conversation Isolation
        if is_temporary_conversation:
            logger.info(f"Temporary conversation active for user {user_id}: Memory extraction suppressed.")
            return None

        _init_synthetic_user_memory(user_id)
        consent = self.get_consent(user_id)

        # Feature 7: Memory Recording Paused Check
        if consent.is_memory_recording_paused:
            logger.warning(f"Memory recording paused for user {user_id}. Staging aborted.")
            return None

        if not consent.allow_memory_system or not consent.allow_long_term_memory:
            logger.warning(f"Memory system disabled in consent for user {user_id}")
            return None

        # Feature: Explicit Consent for Sensitive Health Category
        if req.category == MemoryCategory.OPTIONAL_SENSITIVE_HEALTH_RELATED_INFORMATION:
            if not consent.sensitive_health_consent_granted:
                logger.error(f"Sensitive health memory rejected: Explicit consent not granted for user {user_id}")
                raise PermissionError("Explicit opt-in consent is required to store sensitive health context.")

        statement = req.fact_statement or req.fact_text
        if not statement:
            raise ValueError("Memory fact_statement cannot be empty.")

        now = _get_utc_now()
        is_sensitive = req.category == MemoryCategory.OPTIONAL_SENSITIVE_HEALTH_RELATED_INFORMATION

        # Calculate expiration
        expires_at = None
        if req.expires_in_days:
            expires_at = now + timedelta(days=req.expires_in_days)
        elif req.record_type == MemoryRecordType.TENTATIVE_AI_INTERPRETATION:
            expires_at = now + timedelta(days=consent.auto_expire_tentative_days)

        memory_id = f"mem_{uuid.uuid4().hex[:8]}"
        record = MemoryRecord(
            id=memory_id,
            user_id=user_id,
            category=req.category,
            record_type=req.record_type,
            status=req.status,
            fact_statement=statement,
            raw_context=req.raw_context,
            confidence_score=req.confidence_score if req.confidence_score is not None else 1.0,
            certainty_level=req.certainty_level or CertaintyLevel.USER_VERIFIED,
            provenance=MemoryProvenance(
                source_session_id=req.source_session_id,
                source_type="explicit_user_statement" if req.record_type == MemoryRecordType.STORED_FACT else "inferred_ai_observation",
                source_quote=req.source_quote,
                extracted_by="user_direct" if req.record_type == MemoryRecordType.STORED_FACT else "companion_memory_extractor_v1",
                extracted_at=now,
            ),
            emotional_valence=req.emotional_valence or "neutral",
            is_sensitive=is_sensitive,
            user_consent_verified=True,
            tags=req.tags,
            created_at=now,
            updated_at=now,
            expires_at=expires_at,
            next_review_due_at=now + timedelta(days=90),
        )

        _MEMORY_RECORDS_STORE[user_id][memory_id] = record

        # Log audit action
        action = MemoryAuditAction.SUGGESTED if record.status == MemoryStatus.SUGGESTED else MemoryAuditAction.CREATED
        _log_audit_event(
            user_id=user_id,
            action=action,
            target_id=memory_id,
            details={
                "category": record.category.value,
                "record_type": record.record_type.value,
                "status": record.status.value,
                "certainty_level": record.certainty_level.value,
            },
        )

        return record

    def update_memory(self, user_id: str, memory_id: str, req: MemoryUpdateRequest) -> Optional[MemoryRecord]:
        """Feature 2: User-editable memory record."""
        _init_synthetic_user_memory(user_id)
        record = self.get_memory(user_id, memory_id)
        if not record:
            return None

        if req.fact_statement is not None:
            record.fact_statement = req.fact_statement
        if req.category is not None:
            # Check sensitive consent if moving to sensitive category
            if req.category == MemoryCategory.OPTIONAL_SENSITIVE_HEALTH_RELATED_INFORMATION:
                consent = self.get_consent(user_id)
                if not consent.sensitive_health_consent_granted:
                    raise PermissionError("Explicit opt-in consent is required for sensitive health information.")
            record.category = req.category
        if req.emotional_valence is not None:
            record.emotional_valence = req.emotional_valence
        if req.certainty_level is not None:
            record.certainty_level = req.certainty_level
        if req.tags is not None:
            record.tags = req.tags
        if req.next_review_due_at is not None:
            record.next_review_due_at = req.next_review_due_at

        record.updated_at = _get_utc_now()
        _MEMORY_RECORDS_STORE[user_id][memory_id] = record

        _log_audit_event(
            user_id=user_id,
            action=MemoryAuditAction.EDITED,
            target_id=memory_id,
            details={"updated_fields": [k for k, v in req.model_dump().items() if v is not None]},
        )
        return record

    def confirm_suggestion(
        self,
        user_id: str,
        memory_id: str,
        adjusted_statement: Optional[str] = None,
    ) -> Optional[MemoryRecord]:
        """Feature 1: Confirms a suggested memory, elevating it to user-verified status."""
        _init_synthetic_user_memory(user_id)
        record = self.get_memory(user_id, memory_id)
        if not record:
            return None

        if adjusted_statement:
            record.fact_statement = adjusted_statement

        record.status = MemoryStatus.CONFIRMED
        record.record_type = MemoryRecordType.STORED_FACT  # Elevate to stored fact
        record.certainty_level = CertaintyLevel.USER_VERIFIED
        record.confidence_score = 1.0
        record.user_consent_verified = True
        record.updated_at = _get_utc_now()
        record.expires_at = None  # Remove tentative auto-expiration

        _MEMORY_RECORDS_STORE[user_id][memory_id] = record

        # Also update any linked Life Graph node
        for node in _LIFE_GRAPH_NODES_STORE.get(user_id, {}).values():
            if node.linked_memory_id == memory_id:
                node.record_type = MemoryRecordType.STORED_FACT
                node.is_tentative = False

        _log_audit_event(
            user_id=user_id,
            action=MemoryAuditAction.CONFIRMED,
            target_id=memory_id,
            details={"adjusted": adjusted_statement is not None},
        )
        return record

    def reject_suggestion(self, user_id: str, memory_id: str) -> bool:
        """Rejects a suggested memory pattern, removing it from suggestions."""
        _init_synthetic_user_memory(user_id)
        record = self.get_memory(user_id, memory_id)
        if not record:
            return False

        # Mark as rejected
        record.status = MemoryStatus.REJECTED
        record.updated_at = _get_utc_now()
        _MEMORY_RECORDS_STORE[user_id][memory_id] = record

        # Remove any linked Life Graph node and incident edges
        nodes_to_delete = [
            n.id for n in _LIFE_GRAPH_NODES_STORE.get(user_id, {}).values()
            if n.linked_memory_id == memory_id
        ]
        for nid in nodes_to_delete:
            self.delete_life_graph_node(user_id, nid)

        _log_audit_event(
            user_id=user_id,
            action=MemoryAuditAction.REJECTED,
            target_id=memory_id,
        )
        return True

    def delete_memory(self, user_id: str, memory_id: str) -> bool:
        """Feature 9: Executes individual memory deletion with Life Graph cascade (GDPR Art. 17)."""
        _init_synthetic_user_memory(user_id)
        user_records = _MEMORY_RECORDS_STORE.get(user_id, {})
        if memory_id not in user_records:
            return False

        # 1. Cascade delete linked Life Graph nodes and their incident edges
        user_nodes = _LIFE_GRAPH_NODES_STORE.get(user_id, {})
        linked_node_ids = [
            nid for nid, node in user_nodes.items()
            if node.linked_memory_id == memory_id
        ]
        for nid in linked_node_ids:
            self.delete_life_graph_node(user_id, nid)

        # 2. Delete memory record
        del user_records[memory_id]

        # 3. Immutable audit log
        _log_audit_event(
            user_id=user_id,
            action=MemoryAuditAction.DELETED_SINGLE,
            target_id=memory_id,
            details={"cascaded_node_ids": linked_node_ids},
        )
        logger.info(f"Memory {memory_id} permanently forgotten for user {user_id}")
        return True

    def prune_expired_memories(self, user_id: str) -> int:
        """Feature 5: Auto-prunes expired tentative memories and unconfirmed suggestions."""
        _init_synthetic_user_memory(user_id)
        now = _get_utc_now()
        user_records = _MEMORY_RECORDS_STORE.get(user_id, {})

        expired_ids = [
            mid for mid, rec in user_records.items()
            if rec.expires_at is not None and rec.expires_at <= now
        ]

        for mid in expired_ids:
            self.delete_memory(user_id, mid)
            _log_audit_event(
                user_id=user_id,
                action=MemoryAuditAction.EXPIRED_AUTO,
                target_id=mid,
            )

        return len(expired_ids)

    # ---------------------------------------------------------
    # Life Graph Operations
    # ---------------------------------------------------------
    def get_life_graph(self, user_id: str) -> LifeGraphResponse:
        """Feature 12: Retrieves complete Life Graph nodes and edges."""
        _init_synthetic_user_memory(user_id)
        nodes = list(_LIFE_GRAPH_NODES_STORE.get(user_id, {}).values())
        edges = list(_LIFE_GRAPH_EDGES_STORE.get(user_id, {}).values())

        facts_count = sum(1 for n in nodes if n.record_type == MemoryRecordType.STORED_FACT)
        tentative_count = sum(1 for n in nodes if n.record_type == MemoryRecordType.TENTATIVE_AI_INTERPRETATION)

        return LifeGraphResponse(
            nodes=nodes,
            edges=edges,
            total_nodes=len(nodes),
            total_edges=len(edges),
            facts_count=facts_count,
            tentative_count=tentative_count,
        )

    def add_life_graph_node(self, user_id: str, req: LifeGraphNodeCreateRequest) -> LifeGraphNode:
        _init_synthetic_user_memory(user_id)
        node_id = f"node_{uuid.uuid4().hex[:8]}"
        node = LifeGraphNode(
            id=node_id,
            user_id=user_id,
            label=req.label,
            node_type=req.node_type,
            description=req.description,
            linked_memory_id=req.linked_memory_id,
            record_type=req.record_type,
            emotional_charge=req.emotional_charge,
            is_tentative=req.is_tentative,
            created_at=_get_utc_now(),
        )
        _LIFE_GRAPH_NODES_STORE[user_id][node_id] = node

        _log_audit_event(
            user_id=user_id,
            action=MemoryAuditAction.CREATED,
            target_id=node_id,
            target_type="life_graph_node",
            details={"label": req.label, "type": req.node_type.value},
        )
        return node

    def delete_life_graph_node(self, user_id: str, node_id: str) -> bool:
        """Deletes a node and cascades deletion to all connecting edges."""
        _init_synthetic_user_memory(user_id)
        user_nodes = _LIFE_GRAPH_NODES_STORE.get(user_id, {})
        if node_id not in user_nodes:
            return False

        # Cascade delete incident edges
        user_edges = _LIFE_GRAPH_EDGES_STORE.get(user_id, {})
        edges_to_remove = [
            eid for eid, edge in user_edges.items()
            if edge.source_node_id == node_id or edge.target_node_id == node_id
        ]
        for eid in edges_to_remove:
            del user_edges[eid]

        # Delete node
        del user_nodes[node_id]

        _log_audit_event(
            user_id=user_id,
            action=MemoryAuditAction.DELETED_SINGLE,
            target_id=node_id,
            target_type="life_graph_node",
            details={"incident_edges_cascaded": len(edges_to_remove)},
        )
        return True

    def add_life_graph_edge(self, user_id: str, req: LifeGraphEdgeCreateRequest) -> Optional[LifeGraphEdge]:
        _init_synthetic_user_memory(user_id)
        user_nodes = _LIFE_GRAPH_NODES_STORE.get(user_id, {})

        # Verify source and target exist
        if req.source_node_id not in user_nodes or req.target_node_id not in user_nodes:
            logger.warning(f"Edge creation rejected: Nodes do not exist for user {user_id}")
            return None

        edge_id = f"edge_{uuid.uuid4().hex[:8]}"
        edge = LifeGraphEdge(
            id=edge_id,
            user_id=user_id,
            source_node_id=req.source_node_id,
            target_node_id=req.target_node_id,
            relation=req.relation,
            confidence=req.confidence if req.confidence is not None else 1.0,
            is_tentative=req.is_tentative or False,
            created_at=_get_utc_now(),
        )
        _LIFE_GRAPH_EDGES_STORE[user_id][edge_id] = edge
        return edge

    def delete_life_graph_edge(self, user_id: str, edge_id: str) -> bool:
        _init_synthetic_user_memory(user_id)
        user_edges = _LIFE_GRAPH_EDGES_STORE.get(user_id, {})
        if edge_id in user_edges:
            del user_edges[edge_id]
            return True
        return False

    # ---------------------------------------------------------
    # Nuclear Forget & Data Export (GDPR Art. 17 & 20)
    # ---------------------------------------------------------
    def purge_all_user_memory(self, user_id: str) -> Dict[str, Any]:
        """Feature 10: Complete deletion of all memory and derived records."""
        _init_synthetic_user_memory(user_id)

        records_count = len(_MEMORY_RECORDS_STORE.get(user_id, {}))
        nodes_count = len(_LIFE_GRAPH_NODES_STORE.get(user_id, {}))
        edges_count = len(_LIFE_GRAPH_EDGES_STORE.get(user_id, {}))

        # Hard delete all data structures
        _MEMORY_RECORDS_STORE[user_id] = {}
        _LIFE_GRAPH_NODES_STORE[user_id] = {}
        _LIFE_GRAPH_EDGES_STORE[user_id] = {}

        # Log atomic purge tombstone
        _log_audit_event(
            user_id=user_id,
            action=MemoryAuditAction.PURGED_ALL,
            target_type="all_user_data",
            details={
                "records_purged": records_count,
                "nodes_purged": nodes_count,
                "edges_purged": edges_count,
            },
        )
        logger.info(f"ALL memory records purged permanently for user {user_id}")

        return {
            "success": True,
            "purged_at": _get_utc_now().isoformat(),
            "records_deleted": records_count,
            "nodes_deleted": nodes_count,
            "edges_deleted": edges_count,
        }

    def export_user_data(self, user_id: str) -> DataExportBundle:
        """Feature 11: Machine-readable JSON export bundle for personal data portability."""
        _init_synthetic_user_memory(user_id)

        memories = list(_MEMORY_RECORDS_STORE.get(user_id, {}).values())
        nodes = list(_LIFE_GRAPH_NODES_STORE.get(user_id, {}).values())
        edges = list(_LIFE_GRAPH_EDGES_STORE.get(user_id, {}).values())
        consent = self.get_consent(user_id)
        audit_trail = list(_AUDIT_LOGS_STORE.get(user_id, []))

        _log_audit_event(
            user_id=user_id,
            action=MemoryAuditAction.EXPORTED,
            target_type="all_user_data",
            details={"record_count": len(memories)},
        )

        return DataExportBundle(
            user_id=user_id,
            export_timestamp=_get_utc_now(),
            format_version="2.0.0",
            encryption_status="decrypted_for_authorized_data_subject",
            memory_records=memories,
            life_graph_nodes=nodes,
            life_graph_edges=edges,
            consent_settings=consent,
            audit_trail=audit_trail,
            summary_stats={
                "total_memories": len(memories),
                "total_nodes": len(nodes),
                "total_edges": len(edges),
                "audit_entries": len(audit_trail),
                "confirmed_facts": sum(1 for m in memories if m.record_type == MemoryRecordType.STORED_FACT),
                "tentative_interpretations": sum(1 for m in memories if m.record_type == MemoryRecordType.TENTATIVE_AI_INTERPRETATION),
            },
        )

    def get_audit_logs(self, user_id: str) -> List[MemoryAuditLogEntry]:
        """Retrieves tenant-isolated immutable audit logs."""
        _init_synthetic_user_memory(user_id)
        return list(_AUDIT_LOGS_STORE.get(user_id, []))


memory_service = MemoryService()
