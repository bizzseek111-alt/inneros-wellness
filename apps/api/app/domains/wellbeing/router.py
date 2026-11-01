"""Wellbeing & Contact API Router (`/api/v1/journal`, `/api/v1/growth`, `/api/v1/check-ins`, `/api/v1/contact`)."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.security import UserContext, get_current_user
from app.domains.wellbeing.schemas import (
    CheckInCreateRequest,
    CheckInRecordResponse,
    ContactSubmissionRequest,
    ContactSubmissionResponse,
    GrowthGoalCreateRequest,
    GrowthGoalResponse,
    GrowthStepToggleRequest,
    JournalEntryCreateRequest,
    JournalEntryResponse,
    LocalStorageMigrationRequest,
    LocalStorageMigrationResponse,
)
from app.domains.wellbeing.service import wellbeing_service

router = APIRouter(tags=["Wellbeing: Journal, Growth, Check-Ins & Contact"])


# ---------------------------------------------------------
# Journal Endpoints
# ---------------------------------------------------------
@router.get("/journal", response_model=List[JournalEntryResponse])
async def list_journal_entries(
    tag: Optional[str] = Query(None, description="Optional tag filter"),
    user: UserContext = Depends(get_current_user),
):
    """Returns all personal journal entries for the authenticated user."""
    return wellbeing_service.list_journal_entries(user.user_id, tag=tag)


@router.post("/journal", response_model=JournalEntryResponse, status_code=status.HTTP_201_CREATED)
async def create_journal_entry(
    req: JournalEntryCreateRequest,
    user: UserContext = Depends(get_current_user),
):
    """Creates or updates a personal journal reflection in the relational database."""
    return wellbeing_service.create_journal_entry(user.user_id, req)


@router.delete("/journal/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_journal_entry(
    entry_id: str,
    user: UserContext = Depends(get_current_user),
):
    """Permanently deletes a journal entry belonging to the authenticated user."""
    deleted = wellbeing_service.delete_journal_entry(user.user_id, entry_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Journal entry not found.")
    return None


# ---------------------------------------------------------
# Personal Growth Endpoints
# ---------------------------------------------------------
@router.get("/growth", response_model=List[GrowthGoalResponse])
async def list_growth_goals(
    user: UserContext = Depends(get_current_user),
):
    """Returns all personal growth goals and habit milestones for the authenticated user."""
    return wellbeing_service.list_growth_goals(user.user_id)


@router.post("/growth", response_model=GrowthGoalResponse, status_code=status.HTTP_201_CREATED)
async def create_growth_goal(
    req: GrowthGoalCreateRequest,
    user: UserContext = Depends(get_current_user),
):
    """Creates a new personal growth goal with small, low-pressure milestone steps."""
    return wellbeing_service.create_growth_goal(user.user_id, req)


@router.put("/growth/{goal_id}/steps/{step_id}", response_model=GrowthGoalResponse)
async def toggle_growth_goal_step(
    goal_id: str,
    step_id: str,
    req: Optional[GrowthStepToggleRequest] = None,
    user: UserContext = Depends(get_current_user),
):
    """Toggles or updates completion status for a specific step inside a growth goal."""
    completed = req.completed if req is not None else None
    updated = wellbeing_service.toggle_growth_step(user.user_id, goal_id, step_id, completed=completed)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Growth goal or step not found.")
    return updated


@router.delete("/growth/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_growth_goal(
    goal_id: str,
    user: UserContext = Depends(get_current_user),
):
    """Deletes a personal growth goal belonging to the authenticated user."""
    deleted = wellbeing_service.delete_growth_goal(user.user_id, goal_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Growth goal not found.")
    return None


# ---------------------------------------------------------
# Daily Check-In Endpoints
# ---------------------------------------------------------
@router.get("/check-ins", response_model=List[CheckInRecordResponse])
async def list_check_ins(
    user: UserContext = Depends(get_current_user),
):
    """Returns daily somatic energy, stress, emotion, and need check-ins for the authenticated user."""
    return wellbeing_service.list_check_ins(user.user_id)


@router.post("/check-ins", response_model=CheckInRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_check_in(
    req: CheckInCreateRequest,
    user: UserContext = Depends(get_current_user),
):
    """Saves a new daily check-in record for the authenticated user."""
    return wellbeing_service.create_check_in(user.user_id, req)


# ---------------------------------------------------------
# Browser LocalStorage Migration Endpoint
# ---------------------------------------------------------
@router.post("/wellbeing/migrate-local", response_model=LocalStorageMigrationResponse)
async def migrate_local_browser_data(
    req: LocalStorageMigrationRequest,
    user: UserContext = Depends(get_current_user),
):
    """Idempotently imports browser localStorage journal entries, growth goals, and check-ins into the database."""
    return wellbeing_service.migrate_local_storage(user.user_id, req)


# ---------------------------------------------------------
# Public Website Contact Submission Endpoint
# ---------------------------------------------------------
@router.post("/contact", response_model=ContactSubmissionResponse, status_code=status.HTTP_201_CREATED)
async def submit_contact_form(req: ContactSubmissionRequest):
    """Persists a public website contact inquiry in the database."""
    return wellbeing_service.submit_contact_inquiry(req)
