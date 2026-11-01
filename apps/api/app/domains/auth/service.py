"""InnerOS Authentication & Session Management Service.

Implements:
- Argon2id password hashing (`argon2-cffi`)
- Server-side session tokens hashed with SHA-256 in `auth_sessions`
- Brute-force login rate limiting
- Audit trail logging for authentication events
"""

import hashlib
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional, Tuple

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHashError
from fastapi import HTTPException, status
from sqlalchemy import select

from app.config import settings
from app.db.database import db_session, init_db
from app.db.models import AdminAuditLogModel, AuthSessionModel, UserModel
from app.domains.auth.schemas import (
    AuthSessionResponse,
    LoginRequest,
    SignupRequest,
    UserProfileResponse,
)

_ph = PasswordHasher()

# Brute-force protection: track failed login timestamps per normalized email
_FAILED_LOGIN_ATTEMPTS: Dict[str, List[datetime]] = {}
_MAX_FAILED_ATTEMPTS = 8
_LOCKOUT_WINDOW_SECONDS = 300


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _hash_token(raw_token: str) -> str:
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()


def _normalize_email(email: str) -> str:
    return email.strip().lower()


def _check_rate_limit(email: str) -> None:
    now = _utc_now()
    cutoff = now - timedelta(seconds=_LOCKOUT_WINDOW_SECONDS)
    attempts = [t for t in _FAILED_LOGIN_ATTEMPTS.get(email, []) if t > cutoff]
    _FAILED_LOGIN_ATTEMPTS[email] = attempts
    if len(attempts) >= _MAX_FAILED_ATTEMPTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed sign-in attempts. Please wait 5 minutes before trying again.",
        )


def _record_failed_attempt(email: str) -> None:
    now = _utc_now()
    _FAILED_LOGIN_ATTEMPTS.setdefault(email, []).append(now)


def _clear_failed_attempts(email: str) -> None:
    _FAILED_LOGIN_ATTEMPTS.pop(email, None)


def _to_profile(user: UserModel) -> UserProfileResponse:
    created = user.created_at
    if created.tzinfo is None:
        created = created.replace(tzinfo=timezone.utc)
    return UserProfileResponse(
        user_id=user.id,
        tenant_id=user.tenant_id,
        email=user.email,
        display_name=user.display_name,
        role=user.role,
        locale=user.locale,
        is_active=user.is_active,
        is_demo=user.is_demo,
        created_at=created,
    )


class AuthService:
    def __init__(self) -> None:
        init_db()

    def signup(
        self,
        req: SignupRequest,
        user_agent: Optional[str] = None,
        ip_address: Optional[str] = None,
    ) -> AuthSessionResponse:
        email = _normalize_email(req.email)
        if "@" not in email or "." not in email.split("@")[-1]:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Please provide a valid email address.",
            )

        now = _utc_now()
        with db_session() as db:
            existing = db.scalars(select(UserModel).where(UserModel.email == email)).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="An account with this email address already exists.",
                )

            user_id = f"usr_{uuid.uuid4().hex[:12]}"
            tenant_id = f"tenant_{user_id}"
            pw_hash = _ph.hash(req.password)

            user = UserModel(
                id=user_id,
                tenant_id=tenant_id,
                email=email,
                display_name=req.display_name.strip(),
                password_hash=pw_hash,
                role="user",
                locale=req.locale or "en-US",
                is_active=True,
                is_demo=False,
                created_at=now,
                updated_at=now,
            )
            db.add(user)

            raw_token, csrf_token, expires_at = self._create_session_row(
                db, user.id, user_agent=user_agent, ip_address=ip_address
            )
            self._log_admin_audit(db, user.id, user.role, "USER_SIGNUP_COMPLETED", "auth_session")
            profile = _to_profile(user)

        return AuthSessionResponse(
            authenticated=True,
            session_token=raw_token,
            csrf_token=csrf_token,
            expires_at=expires_at,
            user=profile,
        )

    def login(
        self,
        req: LoginRequest,
        user_agent: Optional[str] = None,
        ip_address: Optional[str] = None,
    ) -> AuthSessionResponse:
        email = _normalize_email(req.email)
        _check_rate_limit(email)

        with db_session() as db:
            user = db.scalars(select(UserModel).where(UserModel.email == email)).first()
            if not user or not user.is_active:
                _record_failed_attempt(email)
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password.",
                )

            try:
                _ph.verify(user.password_hash, req.password)
            except (VerifyMismatchError, InvalidHashError):
                _record_failed_attempt(email)
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password.",
                )

            _clear_failed_attempts(email)
            raw_token, csrf_token, expires_at = self._create_session_row(
                db, user.id, user_agent=user_agent, ip_address=ip_address
            )
            self._log_admin_audit(db, user.id, user.role, "USER_LOGIN_SUCCEEDED", "auth_session")
            profile = _to_profile(user)

        return AuthSessionResponse(
            authenticated=True,
            session_token=raw_token,
            csrf_token=csrf_token,
            expires_at=expires_at,
            user=profile,
        )

    def logout(self, raw_token: Optional[str]) -> bool:
        if not raw_token:
            return False
        token_hash = _hash_token(raw_token)
        with db_session() as db:
            sess = db.scalars(
                select(AuthSessionModel).where(AuthSessionModel.token_hash == token_hash)
            ).first()
            if sess and not sess.revoked:
                sess.revoked = True
                self._log_admin_audit(db, sess.user_id, "user", "USER_LOGOUT", "auth_session")
                return True
        return False

    def verify_session_token(self, raw_token: str) -> Optional[UserProfileResponse]:
        if not raw_token:
            return None
        token_hash = _hash_token(raw_token)
        now = _utc_now()
        with db_session() as db:
            sess = db.scalars(
                select(AuthSessionModel).where(
                    AuthSessionModel.token_hash == token_hash,
                    AuthSessionModel.revoked.is_(False),
                )
            ).first()
            if not sess:
                return None

            expires = sess.expires_at
            if expires.tzinfo is None:
                expires = expires.replace(tzinfo=timezone.utc)
            if expires < now:
                sess.revoked = True
                return None

            user = db.get(UserModel, sess.user_id)
            if not user or not user.is_active:
                return None
            return _to_profile(user)

    def get_user_by_id(self, user_id: str) -> Optional[UserProfileResponse]:
        with db_session() as db:
            user = db.get(UserModel, user_id)
            if not user:
                return None
            return _to_profile(user)

    def _create_session_row(
        self,
        db,
        user_id: str,
        user_agent: Optional[str] = None,
        ip_address: Optional[str] = None,
    ) -> Tuple[str, str, datetime]:
        now = _utc_now()
        expires_at = now + timedelta(hours=settings.SESSION_TTL_HOURS)
        raw_token = f"inos_{secrets.token_urlsafe(32)}"
        csrf_token = secrets.token_hex(24)
        sess = AuthSessionModel(
            id=f"sess_{uuid.uuid4().hex[:12]}",
            user_id=user_id,
            token_hash=_hash_token(raw_token),
            csrf_token=csrf_token,
            user_agent=(user_agent or "")[:250],
            ip_address=(ip_address or "")[:60],
            expires_at=expires_at,
            revoked=False,
            created_at=now,
        )
        db.add(sess)
        return raw_token, csrf_token, expires_at

    def _log_admin_audit(
        self, db, user_id: str, role: str, action: str, resource_type: str
    ) -> None:
        hashed_uid = hashlib.sha256(user_id.encode("utf-8")).hexdigest()[:16]
        db.add(
            AdminAuditLogModel(
                id=f"audit_{uuid.uuid4().hex[:10]}",
                user_id_hash=hashed_uid,
                actor_role=role,
                action=action,
                resource_type=resource_type,
                metadata_json='{"zero_knowledge": true}',
                created_at=_utc_now(),
            )
        )


auth_service = AuthService()
