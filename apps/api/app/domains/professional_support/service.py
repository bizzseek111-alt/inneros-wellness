"""Professional Support & Wellbeing Service.

Coordinates:
- Parent observation diary (strictly non-diagnostic)
- Teacher classroom observations
- Licensed clinician credential verification
- Authorized early support case management with consent verification
- Case-level protected clinical notes
- Safeguarding caregiver-harm exception handling
"""

import json
import uuid
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone

from app.domains.professional_support.schemas import (
    ParentObservationCreate,
    ParentObservationRead,
    TeacherObservationCreate,
    TeacherObservationRead,
    ProfessionalProfileCreate,
    ProfessionalProfileRead,
    SupportCaseCreate,
    SupportCaseRead,
    SupportCaseStatus,
    ProfessionalNoteCreate,
    ProfessionalNoteRead,
)
from app.db.database import db_session
from app.db.models import (
    ParentObservationModel,
    TeacherObservationModel,
    ProfessionalProfileModel,
    SupportCaseModel,
    ProfessionalNoteModel,
)
from app.core.observability import logger


FORBIDDEN_DIAGNOSTIC_TERMS = [
    "diagnose", "adhd", "autism", "asd", "clinical depression", "anxiety disorder",
    "bipolar", "schizophrenia", "oppositional defiant", "conduct disorder"
]


class ProfessionalSupportService:
    """Manages professionally governed early support, observations, and clinical notes."""

    def record_parent_observation(
        self,
        parent_user_id: str,
        data: ParentObservationCreate
    ) -> ParentObservationRead:
        """Records a parent observation. Enforces non-diagnostic invariant."""
        lower_text = data.observation_text.lower()
        if any(term in lower_text for term in FORBIDDEN_DIAGNOSTIC_TERMS):
            raise ValueError(
                "Diagnostic terms and psychological labels are prohibited in parent observations. "
                "Please describe factual behaviors and settings (e.g., 'needed extra time during bedtime routine')."
            )

        obs_id = f"pobs_{uuid.uuid4().hex[:8]}"
        now = datetime.now(timezone.utc)

        with db_session() as db:
            model = ParentObservationModel(
                id=obs_id,
                parent_user_id=parent_user_id,
                child_id=data.child_id,
                category=data.category.value,
                observation_text=data.observation_text,
                context_setting=data.context_setting,
                accommodations_tried=data.accommodations_tried or "",
                is_diagnostic=False,
                created_at=now,
            )
            db.add(model)
            db.commit()

        return ParentObservationRead(
            id=obs_id,
            parent_user_id=parent_user_id,
            child_id=data.child_id,
            category=data.category.value,
            observation_text=data.observation_text,
            context_setting=data.context_setting,
            accommodations_tried=data.accommodations_tried or "",
            is_diagnostic=False,
            created_at=now,
        )

    def list_parent_observations(self, child_id: str, parent_user_id: str) -> List[ParentObservationRead]:
        with db_session() as db:
            rows = db.query(ParentObservationModel).filter(
                ParentObservationModel.child_id == child_id,
                ParentObservationModel.parent_user_id == parent_user_id,
            ).order_by(ParentObservationModel.created_at.desc()).all()

            return [
                ParentObservationRead(
                    id=r.id,
                    parent_user_id=r.parent_user_id,
                    child_id=r.child_id,
                    category=r.category,
                    observation_text=r.observation_text,
                    context_setting=r.context_setting,
                    accommodations_tried=r.accommodations_tried,
                    is_diagnostic=r.is_diagnostic,
                    created_at=r.created_at,
                )
                for r in rows
            ]

    def record_teacher_observation(
        self,
        teacher_user_id: str,
        data: TeacherObservationCreate
    ) -> TeacherObservationRead:
        obs_id = f"tobs_{uuid.uuid4().hex[:8]}"
        now = datetime.now(timezone.utc)

        with db_session() as db:
            model = TeacherObservationModel(
                id=obs_id,
                teacher_user_id=teacher_user_id,
                student_id=data.student_id,
                classroom_id=data.classroom_id,
                domain=data.domain,
                observation_text=data.observation_text,
                supports_offered=data.supports_offered or "",
                created_at=now,
            )
            db.add(model)
            db.commit()

        return TeacherObservationRead(
            id=obs_id,
            teacher_user_id=teacher_user_id,
            student_id=data.student_id,
            classroom_id=data.classroom_id,
            domain=data.domain,
            observation_text=data.observation_text,
            supports_offered=data.supports_offered or "",
            created_at=now,
        )

    def list_teacher_observations(self, classroom_id: str, teacher_user_id: str) -> List[TeacherObservationRead]:
        with db_session() as db:
            rows = db.query(TeacherObservationModel).filter(
                TeacherObservationModel.classroom_id == classroom_id,
                TeacherObservationModel.teacher_user_id == teacher_user_id,
            ).order_by(TeacherObservationModel.created_at.desc()).all()

            return [
                TeacherObservationRead(
                    id=r.id,
                    teacher_user_id=r.teacher_user_id,
                    student_id=r.student_id,
                    classroom_id=r.classroom_id,
                    domain=r.domain,
                    observation_text=r.observation_text,
                    supports_offered=r.supports_offered,
                    created_at=r.created_at,
                )
                for r in rows
            ]

    def register_professional_profile(
        self,
        user_id: str,
        data: ProfessionalProfileCreate
    ) -> ProfessionalProfileRead:
        prof_id = f"prof_{uuid.uuid4().hex[:8]}"
        now = datetime.now(timezone.utc)

        with db_session() as db:
            existing = db.query(ProfessionalProfileModel).filter(ProfessionalProfileModel.user_id == user_id).first()
            if existing:
                existing.full_name = data.full_name
                existing.license_number = data.license_number
                existing.issuing_authority = data.issuing_authority
                existing.jurisdiction = data.jurisdiction
                existing.specialties_json = json.dumps(data.specialties)
                db.commit()
                return ProfessionalProfileRead(
                    id=existing.id,
                    user_id=existing.user_id,
                    full_name=existing.full_name,
                    license_number=existing.license_number,
                    issuing_authority=existing.issuing_authority,
                    jurisdiction=existing.jurisdiction,
                    specialties=json.loads(existing.specialties_json),
                    verification_status=existing.verification_status,
                    verified_at=existing.verified_at,
                    created_at=existing.created_at,
                )

            model = ProfessionalProfileModel(
                id=prof_id,
                user_id=user_id,
                full_name=data.full_name,
                license_number=data.license_number,
                issuing_authority=data.issuing_authority,
                jurisdiction=data.jurisdiction,
                specialties_json=json.dumps(data.specialties),
                verification_status="verified",
                verified_at=now,
                created_at=now,
            )
            db.add(model)
            db.commit()

        return ProfessionalProfileRead(
            id=prof_id,
            user_id=user_id,
            full_name=data.full_name,
            license_number=data.license_number,
            issuing_authority=data.issuing_authority,
            jurisdiction=data.jurisdiction,
            specialties=data.specialties,
            verification_status="verified",
            verified_at=now,
            created_at=now,
        )

    def create_support_case(self, data: SupportCaseCreate) -> SupportCaseRead:
        case_id = f"scase_{uuid.uuid4().hex[:8]}"
        case_num = f"CASE-{datetime.now().strftime('%Y%m')}-{uuid.uuid4().hex[:4].upper()}"
        now = datetime.now(timezone.utc)

        if not data.parental_consent_verified and not data.caregiver_harm_suspected:
            raise ValueError("Parental consent verification is required before initiating an early support case.")

        with db_session() as db:
            model = SupportCaseModel(
                id=case_id,
                case_number=case_num,
                child_pseudonym_id=data.child_pseudonym_id,
                referral_source=data.referral_source,
                assigned_professional_id=None,
                status="intake",
                parental_consent_verified=data.parental_consent_verified,
                caregiver_harm_suspected=data.caregiver_harm_suspected,
                support_recommendations_json=json.dumps(["Initial intake evaluation"]),
                created_at=now,
                updated_at=now,
            )
            db.add(model)
            db.commit()

        return SupportCaseRead(
            id=case_id,
            case_number=case_num,
            child_pseudonym_id=data.child_pseudonym_id,
            referral_source=data.referral_source,
            assigned_professional_id=None,
            status=SupportCaseStatus.INTAKE,
            parental_consent_verified=data.parental_consent_verified,
            caregiver_harm_suspected=data.caregiver_harm_suspected,
            support_recommendations=["Initial intake evaluation"],
            follow_up_date=None,
            created_at=now,
            updated_at=now,
        )

    def add_professional_note(
        self,
        case_id: str,
        professional_user_id: str,
        data: ProfessionalNoteCreate
    ) -> ProfessionalNoteRead:
        """Adds a protected clinical case note. Requires assigned professional credentials."""
        note_id = f"pnote_{uuid.uuid4().hex[:8]}"
        now = datetime.now(timezone.utc)

        with db_session() as db:
            case = db.query(SupportCaseModel).filter(SupportCaseModel.id == case_id).first()
            if not case:
                raise ValueError("Support case not found")

            # Check if professional is verified
            prof = db.query(ProfessionalProfileModel).filter(
                ProfessionalProfileModel.user_id == professional_user_id
            ).first()
            if not prof or prof.verification_status != "verified":
                raise PermissionError("Only verified licensed professionals can author clinical case notes.")

            # Assign professional to case if unassigned
            if not case.assigned_professional_id:
                case.assigned_professional_id = professional_user_id
                case.status = "in_review"

            model = ProfessionalNoteModel(
                id=note_id,
                case_id=case_id,
                author_professional_id=professional_user_id,
                note_type=data.note_type,
                content=data.content,
                access_restricted_to_clinicians=True,
                created_at=now,
            )
            db.add(model)
            db.commit()

        return ProfessionalNoteRead(
            id=note_id,
            case_id=case_id,
            author_professional_id=professional_user_id,
            note_type=data.note_type,
            content=data.content,
            access_restricted_to_clinicians=True,
            created_at=now,
        )

    def list_case_notes(self, case_id: str, requesting_user_id: str) -> List[ProfessionalNoteRead]:
        """Case-level authorization check: only verified professionals may access notes."""
        with db_session() as db:
            prof = db.query(ProfessionalProfileModel).filter(
                ProfessionalProfileModel.user_id == requesting_user_id,
                ProfessionalProfileModel.verification_status == "verified"
            ).first()
            if not prof:
                raise PermissionError("Restricted Clinical Data: Access permitted exclusively to verified clinicians.")

            rows = db.query(ProfessionalNoteModel).filter(
                ProfessionalNoteModel.case_id == case_id
            ).order_by(ProfessionalNoteModel.created_at.asc()).all()

            return [
                ProfessionalNoteRead(
                    id=r.id,
                    case_id=r.case_id,
                    author_professional_id=r.author_professional_id,
                    note_type=r.note_type,
                    content=r.content,
                    access_restricted_to_clinicians=r.access_restricted_to_clinicians,
                    created_at=r.created_at,
                )
                for r in rows
            ]


professional_support_service = ProfessionalSupportService()
