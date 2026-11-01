"""Wellbeing Service: Relational Persistence for Journal, Growth Goals, Check-Ins, Migration, and Contact."""

import json
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional

from fastapi import HTTPException, status
from sqlalchemy import select, delete

from app.db.database import db_session, init_db
from app.db.models import (
    CheckInRecordModel,
    ContactSubmissionModel,
    GrowthGoalModel,
    JournalEntryModel,
)
from app.domains.wellbeing.schemas import (
    CheckInCreateRequest,
    CheckInRecordResponse,
    ContactSubmissionRequest,
    ContactSubmissionResponse,
    GrowthGoalCreateRequest,
    GrowthGoalResponse,
    GrowthStepItem,
    JournalEntryCreateRequest,
    JournalEntryResponse,
    LocalStorageMigrationRequest,
    LocalStorageMigrationResponse,
)

_SEEDED_DEMO_USERS: set[str] = set()


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _ensure_tz(dt: datetime) -> datetime:
    return dt if dt.tzinfo is not None else dt.replace(tzinfo=timezone.utc)


class WellbeingService:
    def __init__(self) -> None:
        init_db()

    def _ensure_demo_seed_if_synthetic(self, user_id: str) -> None:
        """Seeds initial journal, growth, and check-in records for the synthetic demo user once."""
        if user_id != "usr_synthetic_elena_vance_001" or user_id in _SEEDED_DEMO_USERS:
            return
        _SEEDED_DEMO_USERS.add(user_id)

        now = _utc_now()
        with db_session() as db:
            has_journal = db.scalars(
                select(JournalEntryModel).where(JournalEntryModel.user_id == user_id).limit(1)
            ).first()
            if not has_journal:
                db.add_all(
                    [
                        JournalEntryModel(
                            id="jrn_demo_001",
                            user_id=user_id,
                            title="Creating quiet buffer space before morning critiques",
                            content=(
                                "Noticeably less jaw tension this morning when I waited 20 minutes before opening "
                                "Slack. Giving myself time to drink tea and review my own priorities first prevented "
                                "that immediate reactive urgency."
                            ),
                            prompt="What small boundary helped you feel more grounded recently?",
                            tags_json=json.dumps(["boundaries", "morning-routine", "work-pacing"]),
                            mood_valence="grounded",
                            created_at=now - timedelta(days=2),
                            updated_at=now - timedelta(days=2),
                        ),
                        JournalEntryModel(
                            id="jrn_demo_002",
                            user_id=user_id,
                            title="Letting go of over-preparing for every cross-team sync",
                            content=(
                                "I realized I spend nearly an hour rehearsing edge-case defenses before architecture "
                                "reviews. Today I brought a clearer one-page summary and allowed questions to be "
                                "collaborative rather than adversarial."
                            ),
                            prompt="Where are you carrying unnecessary cognitive load?",
                            tags_json=json.dumps(["perfectionism", "cognitive-load", "leadership"]),
                            mood_valence="reflective",
                            created_at=now - timedelta(days=5),
                            updated_at=now - timedelta(days=5),
                        ),
                    ]
                )

            has_growth = db.scalars(
                select(GrowthGoalModel).where(GrowthGoalModel.user_id == user_id).limit(1)
            ).first()
            if not has_growth:
                db.add_all(
                    [
                        GrowthGoalModel(
                            id="goal_demo_001",
                            user_id=user_id,
                            title="Protect a 25-minute device-free wind-down each evening",
                            category="Rest & Boundaries",
                            why_it_matters="Helps my nervous system transition out of problem-solving mode before sleep.",
                            steps_json=json.dumps(
                                [
                                    {"id": "st_1", "label": "Set warm lamp light at 9:30 PM", "completed": True},
                                    {"id": "st_2", "label": "Leave phone charging outside bedroom", "completed": True},
                                    {"id": "st_3", "label": "Write 3 lines of evening decompression notes", "completed": False},
                                ]
                            ),
                            status="active",
                            created_at=now - timedelta(days=7),
                            updated_at=now - timedelta(days=1),
                        ),
                        GrowthGoalModel(
                            id="goal_demo_002",
                            user_id=user_id,
                            title="Practice clear, compassionate scope boundaries in design reviews",
                            category="Mindful Work",
                            why_it_matters="Preserves deep creative energy and prevents late-week emotional depletion.",
                            steps_json=json.dumps(
                                [
                                    {"id": "st_4", "label": "Pause for 3 seconds before saying yes to urgent requests", "completed": True},
                                    {"id": "st_5", "label": "Offer realistic trade-off timelines instead of absorbing extra scope", "completed": False},
                                ]
                            ),
                            status="active",
                            created_at=now - timedelta(days=10),
                            updated_at=now - timedelta(days=2),
                        ),
                    ]
                )

            has_checkin = db.scalars(
                select(CheckInRecordModel).where(CheckInRecordModel.user_id == user_id).limit(1)
            ).first()
            if not has_checkin:
                db.add(
                    CheckInRecordModel(
                        id="chk_demo_001",
                        user_id=user_id,
                        energy_level=4,
                        stress_level=2,
                        emotions_json=json.dumps(["Grounded", "Hopeful", "Focused"]),
                        needs_json=json.dumps(["Uninterrupted focus block", "Hydration & short walk"]),
                        note="Feeling steady after morning breathwork and clear prioritization.",
                        created_at=now - timedelta(hours=6),
                    )
                )

    # ---------------------------------------------------------
    # Journal CRUD
    # ---------------------------------------------------------
    def list_journal_entries(self, user_id: str, tag: Optional[str] = None) -> List[JournalEntryResponse]:
        self._ensure_demo_seed_if_synthetic(user_id)
        with db_session() as db:
            stmt = (
                select(JournalEntryModel)
                .where(JournalEntryModel.user_id == user_id)
                .order_by(JournalEntryModel.created_at.desc())
            )
            rows = db.scalars(stmt).all()
            items: List[JournalEntryResponse] = []
            for r in rows:
                tags = json.loads(r.tags_json or "[]")
                if tag and tag.lower() not in [t.lower() for t in tags]:
                    continue
                items.append(self._to_journal_response(r))
            return items

    def create_journal_entry(self, user_id: str, req: JournalEntryCreateRequest) -> JournalEntryResponse:
        self._ensure_demo_seed_if_synthetic(user_id)
        now = _utc_now()
        entry_id = req.id or f"jrn_{uuid.uuid4().hex[:10]}"
        with db_session() as db:
            existing = db.get(JournalEntryModel, entry_id)
            if existing and existing.user_id == user_id:
                existing.title = req.title.strip()
                existing.content = req.content.strip()
                existing.prompt = req.prompt
                existing.tags_json = json.dumps(req.tags)
                existing.mood_valence = req.mood_valence
                existing.updated_at = now
                return self._to_journal_response(existing)

            if existing and existing.user_id != user_id:
                entry_id = f"jrn_{uuid.uuid4().hex[:10]}"

            row = JournalEntryModel(
                id=entry_id,
                user_id=user_id,
                title=req.title.strip(),
                content=req.content.strip(),
                prompt=req.prompt,
                tags_json=json.dumps(req.tags),
                mood_valence=req.mood_valence,
                created_at=now,
                updated_at=now,
            )
            db.add(row)
            return self._to_journal_response(row)

    def delete_journal_entry(self, user_id: str, entry_id: str) -> bool:
        with db_session() as db:
            row = db.get(JournalEntryModel, entry_id)
            if not row or row.user_id != user_id:
                return False
            db.delete(row)
            return True

    # ---------------------------------------------------------
    # Personal Growth Goals CRUD
    # ---------------------------------------------------------
    def list_growth_goals(self, user_id: str) -> List[GrowthGoalResponse]:
        self._ensure_demo_seed_if_synthetic(user_id)
        with db_session() as db:
            stmt = (
                select(GrowthGoalModel)
                .where(GrowthGoalModel.user_id == user_id)
                .order_by(GrowthGoalModel.created_at.desc())
            )
            rows = db.scalars(stmt).all()
            return [self._to_growth_response(r) for r in rows]

    def create_growth_goal(self, user_id: str, req: GrowthGoalCreateRequest) -> GrowthGoalResponse:
        self._ensure_demo_seed_if_synthetic(user_id)
        now = _utc_now()
        goal_id = req.id or f"goal_{uuid.uuid4().hex[:10]}"
        steps_payload = [s.model_dump() for s in req.steps]
        if not steps_payload:
            steps_payload = [
                {"id": f"st_{uuid.uuid4().hex[:6]}", "label": "Take the first small, low-pressure step", "completed": False}
            ]

        with db_session() as db:
            existing = db.get(GrowthGoalModel, goal_id)
            if existing and existing.user_id != user_id:
                goal_id = f"goal_{uuid.uuid4().hex[:10]}"
                existing = None

            if existing:
                existing.title = req.title.strip()
                existing.category = req.category
                existing.why_it_matters = req.why_it_matters
                existing.steps_json = json.dumps(steps_payload)
                existing.updated_at = now
                return self._to_growth_response(existing)

            row = GrowthGoalModel(
                id=goal_id,
                user_id=user_id,
                title=req.title.strip(),
                category=req.category,
                why_it_matters=req.why_it_matters,
                steps_json=json.dumps(steps_payload),
                status="active",
                created_at=now,
                updated_at=now,
            )
            db.add(row)
            return self._to_growth_response(row)

    def toggle_growth_step(
        self, user_id: str, goal_id: str, step_id: str, completed: Optional[bool] = None
    ) -> Optional[GrowthGoalResponse]:
        with db_session() as db:
            row = db.get(GrowthGoalModel, goal_id)
            if not row or row.user_id != user_id:
                return None

            steps = json.loads(row.steps_json or "[]")
            found = False
            for step in steps:
                if step.get("id") == step_id:
                    step["completed"] = (not step.get("completed", False)) if completed is None else completed
                    found = True
                    break

            if not found:
                return None

            row.steps_json = json.dumps(steps)
            row.updated_at = _utc_now()
            return self._to_growth_response(row)

    def delete_growth_goal(self, user_id: str, goal_id: str) -> bool:
        with db_session() as db:
            row = db.get(GrowthGoalModel, goal_id)
            if not row or row.user_id != user_id:
                return False
            db.delete(row)
            return True

    # ---------------------------------------------------------
    # Daily Check-Ins CRUD
    # ---------------------------------------------------------
    def list_check_ins(self, user_id: str) -> List[CheckInRecordResponse]:
        self._ensure_demo_seed_if_synthetic(user_id)
        with db_session() as db:
            stmt = (
                select(CheckInRecordModel)
                .where(CheckInRecordModel.user_id == user_id)
                .order_by(CheckInRecordModel.created_at.desc())
            )
            rows = db.scalars(stmt).all()
            return [self._to_checkin_response(r) for r in rows]

    def create_check_in(self, user_id: str, req: CheckInCreateRequest) -> CheckInRecordResponse:
        self._ensure_demo_seed_if_synthetic(user_id)
        now = _utc_now()
        chk_id = req.id or f"chk_{uuid.uuid4().hex[:10]}"
        with db_session() as db:
            existing = db.get(CheckInRecordModel, chk_id)
            if existing and existing.user_id != user_id:
                chk_id = f"chk_{uuid.uuid4().hex[:10]}"
                existing = None

            if existing:
                return self._to_checkin_response(existing)

            row = CheckInRecordModel(
                id=chk_id,
                user_id=user_id,
                energy_level=req.energy_level,
                stress_level=req.stress_level,
                emotions_json=json.dumps(req.emotions),
                needs_json=json.dumps(req.needs),
                note=req.note.strip(),
                created_at=now,
            )
            db.add(row)
            return self._to_checkin_response(row)

    # ---------------------------------------------------------
    # Browser LocalStorage Migration
    # ---------------------------------------------------------
    def migrate_local_storage(
        self, user_id: str, req: LocalStorageMigrationRequest
    ) -> LocalStorageMigrationResponse:
        j_count = 0
        g_count = 0
        c_count = 0

        for j in req.journal_entries:
            self.create_journal_entry(user_id, j)
            j_count += 1

        for g in req.growth_goals:
            self.create_growth_goal(user_id, g)
            g_count += 1

        for c in req.check_ins:
            self.create_check_in(user_id, c)
            c_count += 1

        return LocalStorageMigrationResponse(
            migrated_journal_entries=j_count,
            migrated_growth_goals=g_count,
            migrated_check_ins=c_count,
            total_migrated=j_count + g_count + c_count,
        )

    def purge_user_wellbeing_data(self, user_id: str) -> Dict[str, int]:
        """Deletes all journal entries, growth goals, and check-ins for a user (invoked on full account purge)."""
        with db_session() as db:
            j_del = db.execute(delete(JournalEntryModel).where(JournalEntryModel.user_id == user_id)).rowcount or 0
            g_del = db.execute(delete(GrowthGoalModel).where(GrowthGoalModel.user_id == user_id)).rowcount or 0
            c_del = db.execute(delete(CheckInRecordModel).where(CheckInRecordModel.user_id == user_id)).rowcount or 0
        return {
            "journal_entries_deleted": j_del,
            "growth_goals_deleted": g_del,
            "check_ins_deleted": c_del,
        }

    # ---------------------------------------------------------
    # Public Contact Submission
    # ---------------------------------------------------------
    def submit_contact_inquiry(self, req: ContactSubmissionRequest) -> ContactSubmissionResponse:
        if "@" not in req.email or "." not in req.email.split("@")[-1]:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Please provide a valid email address.",
            )
        now = _utc_now()
        sub_id = f"cnt_{uuid.uuid4().hex[:10]}"
        with db_session() as db:
            row = ContactSubmissionModel(
                id=sub_id,
                name=req.name.strip(),
                email=req.email.strip().lower(),
                inquiry_type=req.inquiry_type,
                organization=req.organization,
                message=req.message.strip(),
                status="received",
                created_at=now,
            )
            db.add(row)

        from app.core.dispatcher import notification_dispatcher
        from app.config import settings

        notification_dispatcher.dispatch_email(
            user_id="public_contact",
            recipient_email=req.email.strip().lower(),
            subject=f"InnerOS Sanctuary — Inquiry Received ({sub_id})",
            sanitized_body=(
                f"Hello {req.name.strip()},\n\n"
                f"We have received your '{req.inquiry_type}' inquiry (Ref: {sub_id}). "
                "Our team will review your message and respond within 1–2 business days.\n\n"
                "Warm regards,\nInnerOS Sanctuary Team"
            ),
            metadata={"submission_id": sub_id, "inquiry_type": req.inquiry_type},
        )
        notification_dispatcher.dispatch_email(
            user_id="public_contact",
            recipient_email=settings.SUPPORT_INBOX_EMAIL,
            subject=f"[InnerOS Contact] {req.inquiry_type} from {req.name.strip()}",
            sanitized_body=f"From: {req.name.strip()} <{req.email.strip().lower()}>\n\n{req.message.strip()}",
            metadata={"submission_id": sub_id},
        )

        return ContactSubmissionResponse(
            id=sub_id,
            status="received",
            received_at=now,
            message="Thank you for reaching out. Our team has recorded your inquiry and will respond within 1–2 business days.",
        )

    # ---------------------------------------------------------
    # Serializers
    # ---------------------------------------------------------
    def _to_journal_response(self, row: JournalEntryModel) -> JournalEntryResponse:
        return JournalEntryResponse(
            id=row.id,
            user_id=row.user_id,
            title=row.title,
            content=row.content,
            prompt=row.prompt,
            tags=json.loads(row.tags_json or "[]"),
            mood_valence=row.mood_valence,
            created_at=_ensure_tz(row.created_at),
            updated_at=_ensure_tz(row.updated_at),
        )

    def _to_growth_response(self, row: GrowthGoalModel) -> GrowthGoalResponse:
        raw_steps = json.loads(row.steps_json or "[]")
        steps = [GrowthStepItem(**s) for s in raw_steps]
        return GrowthGoalResponse(
            id=row.id,
            user_id=row.user_id,
            title=row.title,
            category=row.category,
            why_it_matters=row.why_it_matters,
            steps=steps,
            status=row.status,
            created_at=_ensure_tz(row.created_at),
            updated_at=_ensure_tz(row.updated_at),
        )

    def _to_checkin_response(self, row: CheckInRecordModel) -> CheckInRecordResponse:
        return CheckInRecordResponse(
            id=row.id,
            user_id=row.user_id,
            energy_level=row.energy_level,
            stress_level=row.stress_level,
            emotions=json.loads(row.emotions_json or "[]"),
            needs=json.loads(row.needs_json or "[]"),
            note=row.note,
            created_at=_ensure_tz(row.created_at),
        )


wellbeing_service = WellbeingService()
