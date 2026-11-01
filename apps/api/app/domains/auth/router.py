"""Authentication & Identity API Router (`/api/v1/auth`)."""

from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Cookie, Depends, Header, Request, Response, status

from app.config import settings
from app.core.security import UserContext, get_current_user
from app.domains.auth.schemas import (
    AuthSessionResponse,
    LoginRequest,
    SignupRequest,
    UserProfileResponse,
)
from app.domains.auth.service import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication & Identity"])


def _set_session_cookie(response: Response, session_token: str, csrf_token: str) -> None:
    max_age = settings.SESSION_TTL_HOURS * 3600
    is_prod = settings.ENVIRONMENT.lower() == "production"
    response.set_cookie(
        key=settings.SESSION_COOKIE_NAME,
        value=session_token,
        httponly=True,
        samesite="lax",
        secure=is_prod,
        max_age=max_age,
        path="/",
    )
    response.set_cookie(
        key="inneros_csrf",
        value=csrf_token,
        httponly=False,
        samesite="lax",
        secure=is_prod,
        max_age=max_age,
        path="/",
    )


@router.post("/signup", response_model=AuthSessionResponse, status_code=status.HTTP_201_CREATED)
async def signup_user(
    req: SignupRequest,
    request: Request,
    response: Response,
):
    """Registers a new InnerOS user account with Argon2id password hashing and creates a session."""
    user_agent = request.headers.get("user-agent")
    client_ip = request.client.host if request.client else None
    result = auth_service.signup(req, user_agent=user_agent, ip_address=client_ip)
    _set_session_cookie(response, result.session_token, result.csrf_token)
    return result


@router.post("/login", response_model=AuthSessionResponse)
async def login_user(
    req: LoginRequest,
    request: Request,
    response: Response,
):
    """Authenticates an existing user and issues an HTTP-only session cookie + Bearer token."""
    user_agent = request.headers.get("user-agent")
    client_ip = request.client.host if request.client else None
    result = auth_service.login(req, user_agent=user_agent, ip_address=client_ip)
    _set_session_cookie(response, result.session_token, result.csrf_token)
    return result


@router.post("/logout")
async def logout_user(
    response: Response,
    inneros_session: Optional[str] = Cookie(None),
    authorization: Optional[str] = Header(None),
):
    """Revokes the active server-side session and clears authentication cookies."""
    token = inneros_session
    if not token and authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1].strip()
    revoked = auth_service.logout(token)
    response.delete_cookie(key=settings.SESSION_COOKIE_NAME, path="/")
    response.delete_cookie(key="inneros_csrf", path="/")
    return {"success": True, "session_revoked": revoked}


@router.get("/me", response_model=UserProfileResponse)
async def get_authenticated_profile(
    user: UserContext = Depends(get_current_user),
):
    """Returns the currently authenticated user's profile and role."""
    db_profile = auth_service.get_user_by_id(user.user_id)
    if db_profile:
        return db_profile

    return UserProfileResponse(
        user_id=user.user_id,
        tenant_id=user.tenant_id,
        email=user.email,
        display_name=user.display_name,
        role=user.role,
        locale="en-US",
        is_active=user.is_active,
        is_demo=user.is_synthetic_fallback,
        created_at=datetime.now(timezone.utc),
    )
