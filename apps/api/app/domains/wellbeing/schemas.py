"""Schemas for Journal Entries, Personal Growth Goals, Daily Check-Ins, Local Migration, and Contact."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


# ---------------------------------------------------------
# 1. Journal & Reflections
# ---------------------------------------------------------
class JournalEntryCreateRequest(BaseModel):
    id: Optional[str] = None
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1, max_length=20000)
    prompt: Optional[str] = Field(default=None, max_length=1000)
    tags: List[str] = Field(default_factory=list)
    mood_valence: str = Field(default="reflective", max_length=32)


class JournalEntryResponse(BaseModel):
    id: str
    user_id: str
    title: str
    content: str
    prompt: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    mood_valence: str
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------
# 2. Personal Growth Goals
# ---------------------------------------------------------
class GrowthStepItem(BaseModel):
    id: str
    label: str
    completed: bool = False


class GrowthGoalCreateRequest(BaseModel):
    id: Optional[str] = None
    title: str = Field(..., min_length=1, max_length=255)
    category: str = Field(default="Rest & Boundaries", max_length=64)
    why_it_matters: str = Field(default="", max_length=2000)
    steps: List[GrowthStepItem] = Field(default_factory=list)


class GrowthStepToggleRequest(BaseModel):
    completed: Optional[bool] = None


class GrowthGoalResponse(BaseModel):
    id: str
    user_id: str
    title: str
    category: str
    why_it_matters: str
    steps: List[GrowthStepItem]
    status: str = "active"
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------
# 3. Daily Somatic & Needs Check-Ins
# ---------------------------------------------------------
class CheckInCreateRequest(BaseModel):
    id: Optional[str] = None
    energy_level: int = Field(default=3, ge=1, le=5)
    stress_level: int = Field(default=2, ge=1, le=5)
    emotions: List[str] = Field(default_factory=list)
    needs: List[str] = Field(default_factory=list)
    note: str = Field(default="", max_length=4000)


class CheckInRecordResponse(BaseModel):
    id: str
    user_id: str
    energy_level: int
    stress_level: int
    emotions: List[str]
    needs: List[str]
    note: str
    created_at: datetime


# ---------------------------------------------------------
# 4. Browser LocalStorage Migration
# ---------------------------------------------------------
class LocalStorageMigrationRequest(BaseModel):
    journal_entries: List[JournalEntryCreateRequest] = Field(default_factory=list)
    growth_goals: List[GrowthGoalCreateRequest] = Field(default_factory=list)
    check_ins: List[CheckInCreateRequest] = Field(default_factory=list)


class LocalStorageMigrationResponse(BaseModel):
    migrated_journal_entries: int
    migrated_growth_goals: int
    migrated_check_ins: int
    total_migrated: int


# ---------------------------------------------------------
# 5. Public Website Contact Form
# ---------------------------------------------------------
class ContactSubmissionRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: str = Field(..., min_length=3, max_length=255)
    inquiry_type: str = Field(default="general", max_length=64)
    organization: Optional[str] = Field(default=None, max_length=160)
    message: str = Field(..., min_length=5, max_length=5000)


class ContactSubmissionResponse(BaseModel):
    id: str
    status: str
    received_at: datetime
    message: str
