"""FastAPI Router for Wellbeing, Early Support & Professional Support Layer."""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, Header, status

from app.domains.professional_support.schemas import (
    ParentObservationCreate,
    ParentObservationRead,
    TeacherObservationCreate,
    TeacherObservationRead,
    ProfessionalProfileCreate,
    ProfessionalProfileRead,
    SupportCaseCreate,
    SupportCaseRead,
    ProfessionalNoteCreate,
    ProfessionalNoteRead,
)
from app.domains.professional_support.service import professional_support_service

router = APIRouter(prefix="/support", tags=["Wellbeing & Professional Support"])


@router.post("/parent-observations", response_model=ParentObservationRead)
async def create_parent_observation(
    data: ParentObservationCreate,
    x_user_id: Optional[str] = Header("parent_demo", alias="X-User-Id"),
):
    """Parent records factual, non-diagnostic behavioral observations."""
    try:
        return professional_support_service.record_parent_observation(
            parent_user_id=x_user_id or "parent_demo",
            data=data,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/parent-observations", response_model=List[ParentObservationRead])
async def list_parent_observations(
    child_id: str,
    x_user_id: Optional[str] = Header("parent_demo", alias="X-User-Id"),
):
    """Retrieves parent observation diary entries for a given child."""
    return professional_support_service.list_parent_observations(
        child_id=child_id,
        parent_user_id=x_user_id or "parent_demo",
    )


@router.post("/teacher-observations", response_model=TeacherObservationRead)
async def create_teacher_observation(
    data: TeacherObservationCreate,
    x_user_id: Optional[str] = Header("teacher_demo", alias="X-User-Id"),
):
    """Teacher records classroom engagement or accommodation observations."""
    return professional_support_service.record_teacher_observation(
        teacher_user_id=x_user_id or "teacher_demo",
        data=data,
    )


@router.get("/teacher-observations", response_model=List[TeacherObservationRead])
async def list_teacher_observations(
    classroom_id: str,
    x_user_id: Optional[str] = Header("teacher_demo", alias="X-User-Id"),
):
    """Lists teacher observations for a classroom roster."""
    return professional_support_service.list_teacher_observations(
        classroom_id=classroom_id,
        teacher_user_id=x_user_id or "teacher_demo",
    )


@router.post("/professionals/register", response_model=ProfessionalProfileRead)
async def register_professional(
    data: ProfessionalProfileCreate,
    x_user_id: Optional[str] = Header("prof_demo", alias="X-User-Id"),
):
    """Registers and verifies licensed child specialist or psychologist credentials."""
    return professional_support_service.register_professional_profile(
        user_id=x_user_id or "prof_demo",
        data=data,
    )


@router.post("/cases", response_model=SupportCaseRead)
async def initiate_support_case(data: SupportCaseCreate):
    """Initiates an authorized early support case with consent verification."""
    try:
        return professional_support_service.create_support_case(data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/cases/{case_id}/notes", response_model=ProfessionalNoteRead)
async def add_clinical_case_note(
    case_id: str,
    data: ProfessionalNoteCreate,
    x_user_id: Optional[str] = Header("prof_demo", alias="X-User-Id"),
):
    """Adds a protected clinical case note. Requires verified professional credentials."""
    try:
        return professional_support_service.add_professional_note(
            case_id=case_id,
            professional_user_id=x_user_id or "prof_demo",
            data=data,
        )
    except PermissionError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/cases/{case_id}/notes", response_model=List[ProfessionalNoteRead])
async def list_case_notes(
    case_id: str,
    x_user_id: Optional[str] = Header("prof_demo", alias="X-User-Id"),
):
    """Retrieves protected case notes. Requires verified clinician authorization."""
    try:
        return professional_support_service.list_case_notes(
            case_id=case_id,
            requesting_user_id=x_user_id or "prof_demo",
        )
    except PermissionError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
