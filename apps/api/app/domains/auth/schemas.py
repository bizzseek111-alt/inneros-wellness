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
    email_verified: bool = False
    created_at: datetime


class AuthSessionResponse(BaseModel):
    authenticated: bool = True
    session_token: str
    csrf_token: str
    expires_at: datetime
    user: UserProfileResponse


class VerifyEmailRequest(BaseModel):
    token: str = Field(..., min_length=1, description="Email verification token")


class VerifyEmailResponse(BaseModel):
    success: bool
    email: str
    message: str


class SendVerificationEmailRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=255)


class ForgotPasswordRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=255)


class ForgotPasswordResponse(BaseModel):
    success: bool
    message: str
    reset_token: Optional[str] = None  # Returned in dev/sandbox mode for automated testing


class ResetPasswordRequest(BaseModel):
    token: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8, max_length=128)


class ResetPasswordResponse(BaseModel):
    success: bool
    message: str


class UpdateAccountSettingsRequest(BaseModel):
    display_name: Optional[str] = Field(None, min_length=1, max_length=120)
    locale: Optional[str] = Field(None, max_length=16)


class DeleteAccountRequest(BaseModel):
    password: str = Field(..., min_length=1)
    reason: Optional[str] = Field(None, max_length=255)


class DeleteAccountResponse(BaseModel):
    success: bool
    message: str
    deleted_user_id: str
