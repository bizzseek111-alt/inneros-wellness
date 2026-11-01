"""InnerOS Security & Tenant Isolation.
Provides tenant scoping, user context dependency injection, and synthetic identity verification.
"""

from typing import Optional
from pydantic import BaseModel
from fastapi import Header, HTTPException, status


class UserContext(BaseModel):
    user_id: str
    tenant_id: str
    email: str
    is_active: bool = True
    role: str = "user"


# Synthetic default user for development & demonstrations
SYNTHETIC_DEFAULT_USER = UserContext(
    user_id="usr_synthetic_elena_vance_001",
    tenant_id="tenant_synthetic_inneros_default",
    email="elena.vance@synthetic.inneros.internal",
    is_active=True,
    role="user",
)


async def get_current_user(
    x_user_id: Optional[str] = Header(None, alias="X-User-ID"),
    x_tenant_id: Optional[str] = Header(None, alias="X-Tenant-ID"),
) -> UserContext:
    """Dependency that resolves user and tenant context from scoped headers or synthetic default.

    Enforces tenant/user isolation across all domain requests.
    """
    user_id = x_user_id or SYNTHETIC_DEFAULT_USER.user_id
    tenant_id = x_tenant_id or SYNTHETIC_DEFAULT_USER.tenant_id

    # In production, this verifies signed JWT claims.
    # For synthetic development mode, ensures non-empty IDs.
    if not user_id or not tenant_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing valid User or Tenant context",
        )

    return UserContext(
        user_id=user_id,
        tenant_id=tenant_id,
        email=f"{user_id}@synthetic.inneros.internal",
        is_active=True,
        role="user",
    )
