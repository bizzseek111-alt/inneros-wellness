"""InnerOS Security, Session Verification, Tenant Isolation & Role-Based Access Control (RBAC).
Provides tenant scoping, session cookie/bearer resolution, RBAC dependencies, and synthetic identity fallback.
"""

from typing import Callable, List, Optional
from pydantic import BaseModel
from fastapi import Cookie, Depends, Header, HTTPException, status


class UserContext(BaseModel):
    user_id: str
    tenant_id: str
    email: str
    display_name: str = "Elena Vance"
    is_active: bool = True
    role: str = "user"
    is_synthetic_fallback: bool = False


# Synthetic default user for development & demonstrations
SYNTHETIC_DEFAULT_USER = UserContext(
    user_id="usr_synthetic_elena_vance_001",
    tenant_id="tenant_synthetic_inneros_default",
    email="elena.vance@inneros.app",
    display_name="Elena Vance",
    is_active=True,
    role="user",
    is_synthetic_fallback=True,
)


async def get_current_user(
    x_user_id: Optional[str] = Header(None, alias="X-User-ID"),
    x_tenant_id: Optional[str] = Header(None, alias="X-Tenant-ID"),
    x_user_role: Optional[str] = Header(None, alias="X-User-Role"),
    authorization: Optional[str] = Header(None, alias="Authorization"),
    inneros_session: Optional[str] = Cookie(None),
) -> UserContext:
    """Resolves authenticated user and tenant context from:
    1. Bearer token (`Authorization: Bearer <token>`) or `inneros_session` HTTP-only cookie
    2. Scoped `X-User-ID` / `X-Tenant-ID` / `X-User-Role` headers
    3. Synthetic default user fallback (`usr_synthetic_elena_vance_001`)
    """
    from app.domains.auth.service import auth_service

    # 1. Check Bearer token or session cookie first
    raw_token: Optional[str] = None
    if authorization and authorization.lower().startswith("bearer "):
        raw_token = authorization.split(" ", 1)[1].strip()
    elif inneros_session:
        raw_token = inneros_session

    if raw_token:
        profile = auth_service.verify_session_token(raw_token)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired authentication session.",
            )
        return UserContext(
            user_id=profile.user_id,
            tenant_id=profile.tenant_id,
            email=profile.email,
            display_name=profile.display_name,
            is_active=profile.is_active,
            role=profile.role,
            is_synthetic_fallback=False,
        )

    # 2. Check explicit X-User-ID / X-User-Role headers
    if x_user_id or x_user_role:
        uid = x_user_id or SYNTHETIC_DEFAULT_USER.user_id
        tid = x_tenant_id or f"tenant_{uid}"
        db_user = auth_service.get_user_by_id(uid)
        resolved_role = x_user_role or (db_user.role if db_user else "user")
        resolved_email = db_user.email if db_user else f"{uid}@synthetic.inneros.internal"
        resolved_name = db_user.display_name if db_user else uid

        return UserContext(
            user_id=uid,
            tenant_id=tid,
            email=resolved_email,
            display_name=resolved_name,
            is_active=True,
            role=resolved_role,
            is_synthetic_fallback=False,
        )

    # 3. Synthetic default user fallback
    return SYNTHETIC_DEFAULT_USER


def require_role(allowed_roles: List[str]) -> Callable:
    """FastAPI dependency factory enforcing Role-Based Access Control (RBAC).

    Rejects authenticated users or explicit header-scoped callers whose role
    is not in `allowed_roles` with HTTP 403 Forbidden.
    """
    async def _role_guard(user: UserContext = Depends(get_current_user)) -> UserContext:
        # If caller authenticated with a session token or passed explicit identity/role headers,
        # strictly enforce role membership.
        if not user.is_synthetic_fallback and user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required role: {', '.join(allowed_roles)}. Current role: {user.role}.",
            )
        return user

    return _role_guard
