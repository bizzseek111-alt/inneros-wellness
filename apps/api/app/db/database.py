"""InnerOS SQLAlchemy 2.0 Database Engine, Session Factory, and State Persistence Helpers."""

import json
from contextlib import contextmanager
from datetime import datetime, timezone
from typing import Any, Dict, Generator, List, Optional

from sqlalchemy import create_engine, select, delete
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings
from app.core.observability import logger


class Base(DeclarativeBase):
    """Base declarative class for all InnerOS relational tables."""
    pass


connect_args: Dict[str, Any] = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    future=True,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
    class_=Session,
)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency providing a scoped SQLAlchemy Session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def db_session() -> Generator[Session, None, None]:
    """Context manager for internal service operations."""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def init_db() -> None:
    """Creates all database tables if they do not exist and seeds default feature flags & demo users."""
    from app.db.models import (  # noqa: F401
        UserModel,
        AuthSessionModel,
        JournalEntryModel,
        GrowthGoalModel,
        CheckInRecordModel,
        ContactSubmissionModel,
        FeatureFlagModel,
        SafetyIncidentLogModel,
        AdminAuditLogModel,
        DomainStateStoreModel,
    )

    Base.metadata.create_all(bind=engine)
    _seed_defaults()


def _seed_defaults() -> None:
    """Seeds default feature flags and demo accounts idempotently."""
    from app.db.models import FeatureFlagModel, UserModel, SafetyIncidentLogModel
    from argon2 import PasswordHasher

    ph = PasswordHasher()
    now = datetime.now(timezone.utc)

    default_flags = [
        (
            "voice_realtime_companion",
            "Living Voice Presence (STT/TTS)",
            "Enables multimodal voice reflection with calm cadence and interruptible playback.",
            True,
            "voice",
        ),
        (
            "life_graph_causal_edges",
            "Life Graph Pattern Explorer",
            "Enables interactive causal and mitigating node/edge visualization in the Memory Vault.",
            True,
            "memory",
        ),
        (
            "psychoeducation_grounding_library",
            "17-Department Psychology Library",
            "Enables evidence-tiered psychoeducation cards and guided breathwork/somatic exercises.",
            True,
            "knowledge",
        ),
        (
            "local_browser_migration_banner",
            "Browser-to-Account Sync Assistant",
            "Prompts users with existing local browser reflections or goals to migrate them into their account.",
            True,
            "onboarding",
        ),
        (
            "external_oauth_integrations",
            "Connected Archives & OAuth Hub",
            "Allows staged preview and import of personal context from external notes and calendars.",
            True,
            "integrations",
        ),
    ]

    with db_session() as db:
        for key, label, desc, enabled, category in default_flags:
            existing = db.get(FeatureFlagModel, key)
            if not existing:
                db.add(
                    FeatureFlagModel(
                        key=key,
                        label=label,
                        description=desc,
                        enabled=enabled,
                        category=category,
                        updated_by="system_seed",
                        updated_at=now,
                    )
                )

        # Ensure synthetic demo user & admin user exist
        elena = db.get(UserModel, "usr_synthetic_elena_vance_001")
        if not elena:
            db.add(
                UserModel(
                    id="usr_synthetic_elena_vance_001",
                    tenant_id="tenant_synthetic_inneros_default",
                    email="elena.vance@inneros.app",
                    display_name="Elena Vance",
                    password_hash=ph.hash("InnerOS-Demo-2026!"),
                    role="user",
                    locale="en-US",
                    is_active=True,
                    is_demo=True,
                    created_at=now,
                    updated_at=now,
                )
            )

        admin_user = db.get(UserModel, "usr_admin_inneros_001")
        if not admin_user:
            db.add(
                UserModel(
                    id="usr_admin_inneros_001",
                    tenant_id="tenant_synthetic_inneros_default",
                    email="admin@inneros.app",
                    display_name="Dr. Clara Chen (Platform Steward)",
                    password_hash=ph.hash("InnerOS-Admin-2026!"),
                    role="admin",
                    locale="en-US",
                    is_active=True,
                    is_demo=True,
                    created_at=now,
                    updated_at=now,
                )
            )

        # Seed a sample anonymized safety circuit-breaker log if empty
        existing_incident = db.scalars(select(SafetyIncidentLogModel).limit(1)).first()
        if not existing_incident:
            db.add(
                SafetyIncidentLogModel(
                    id="inc_anon_9021a",
                    user_id_hash="e3b0c44298fc1c14",
                    risk_tier="TIER_3_HIGH_DISTRESS",
                    category="ACUTE_OVERWHELM_HELPLINE_SURFACED",
                    region="US",
                    circuit_breaker_tripped=True,
                    created_at=now,
                )
            )


# ---------------------------------------------------------------------------
# Durable Domain Key-Value / Document Store Helpers
# ---------------------------------------------------------------------------
def save_domain_item(namespace: str, user_id: str, item_key: str, payload: Any) -> None:
    """Writes a Pydantic model or dict to the durable SQLite/PostgreSQL domain_state_store table."""
    from app.db.models import DomainStateStoreModel

    try:
        if hasattr(payload, "model_dump"):
            serialized = json.dumps(payload.model_dump(mode="json"))
        else:
            serialized = json.dumps(payload, default=str)

        now = datetime.now(timezone.utc)
        with db_session() as db:
            existing = db.get(DomainStateStoreModel, (namespace, user_id, item_key))
            if existing:
                existing.payload_json = serialized
                existing.updated_at = now
            else:
                db.add(
                    DomainStateStoreModel(
                        namespace=namespace,
                        user_id=user_id,
                        item_key=item_key,
                        payload_json=serialized,
                        updated_at=now,
                    )
                )
    except Exception as exc:
        logger.warning(f"Domain state persistence warning ({namespace}/{user_id}/{item_key}): {exc}")


def delete_domain_item(namespace: str, user_id: str, item_key: str) -> None:
    """Deletes a specific item from the durable domain_state_store table."""
    from app.db.models import DomainStateStoreModel

    try:
        with db_session() as db:
            existing = db.get(DomainStateStoreModel, (namespace, user_id, item_key))
            if existing:
                db.delete(existing)
    except Exception as exc:
        logger.warning(f"Domain state delete warning ({namespace}/{user_id}/{item_key}): {exc}")


def delete_domain_namespace_for_user(namespace: str, user_id: str) -> None:
    """Deletes all items in a namespace for a given user_id."""
    from app.db.models import DomainStateStoreModel

    try:
        with db_session() as db:
            db.execute(
                delete(DomainStateStoreModel).where(
                    DomainStateStoreModel.namespace == namespace,
                    DomainStateStoreModel.user_id == user_id,
                )
            )
    except Exception as exc:
        logger.warning(f"Domain namespace purge warning ({namespace}/{user_id}): {exc}")


def load_domain_items(namespace: str, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """Loads persisted items from domain_state_store for hydration."""
    from app.db.models import DomainStateStoreModel

    results: List[Dict[str, Any]] = []
    try:
        with db_session() as db:
            stmt = select(DomainStateStoreModel).where(DomainStateStoreModel.namespace == namespace)
            if user_id is not None:
                stmt = stmt.where(DomainStateStoreModel.user_id == user_id)
            rows = db.scalars(stmt).all()
            for row in rows:
                results.append(
                    {
                        "user_id": row.user_id,
                        "item_key": row.item_key,
                        "payload": json.loads(row.payload_json),
                        "updated_at": row.updated_at,
                    }
                )
    except Exception as exc:
        logger.warning(f"Domain state load warning ({namespace}): {exc}")
    return results
