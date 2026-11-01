"""Authentication & Identity Schemas for InnerOS."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class SignupRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=255, description="User email address")
    password: str = Field(..., min_length=8, max_length=128, description="Account password (min 8 chars)")
    display_name: str = Field(..., min_length=1, max_length=120, description="Preferred display name")
    locale: str = Field(default="en-US", max_length=16)


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=1, max_length=128)


class UserProfileResponse(BaseModel):
    user_id: str
    tenant_id: str
    email: str
    display_name: str
    role: str
    locale: str
    is_active: bool
    is_demo: bool
    created_at: datetime


class AuthSessionResponse(BaseModel):
    authenticated: bool = True
    session_token: str
    csrf_token: str
    expires_at: datetime
    user: UserProfileResponse
