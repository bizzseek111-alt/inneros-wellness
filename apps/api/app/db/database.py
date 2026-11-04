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
        ChildProfileModel,
        CaregiverChildLinkModel,
        ConsentRecordModel,
        YouthLearningActivityModel,
        VoiceSessionMetadataModel,
        SafetyEscalationIncidentModel,
        ReferralDirectoryResourceModel,
        DataRetentionDeletionRequestModel,
        ProductModel,
        PriceModel,
        OrderModel,
        PaymentModel,
        SubscriptionModel,
        EntitlementModel,
        SupportTicketModel,
    )

    from sqlalchemy import text

    Base.metadata.create_all(bind=engine)
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN age_tier VARCHAR(16) DEFAULT 'adult'"))
            conn.commit()
        except Exception:
            pass
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN guardian_id VARCHAR(64)"))
            conn.commit()
        except Exception:
            pass
        for col_def in [
            "email_verified BOOLEAN DEFAULT 0",
            "verification_token VARCHAR(128)",
            "reset_password_token VARCHAR(128)",
            "reset_token_expires_at TIMESTAMP",
        ]:
            try:
                conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_def}"))
                conn.commit()
            except Exception:
                pass
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
        (
            "kids_experience_enabled",
            "InnerOS Kids Sandbox (Ages 6-12)",
            "Enables development-only tactile emotional sandbox with COPPA/GDPR-K boundaries and verified parental consent gate.",
            False,
            "child_safety",
        ),
        (
            "teens_experience_enabled",
            "InnerOS Teens Sanctuary (Ages 13-17)",
            "Enables development-only adolescent emotional autonomy sanctuary with specialized crisis escalation.",
            False,
            "child_safety",
        ),
        (
            "caregiver_portal_enabled",
            "Caregiver Governance & Consent Portal",
            "Allows parents and guardians to manage consent, usage parameters, and safety notifications without violating minor privacy.",
            False,
            "child_safety",
        ),
        (
            "safeguarding_audit_enabled",
            "Safeguarding Incident & Mandatory Reporting Telemetry",
            "Enables cryptographic audit logging for child safety incidents and mandatory reporting triggers.",
            True,
            "child_safety",
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

        # ---------------------------------------------------------------------
        # Seed Youth & Oversight Demo Personas
        # ---------------------------------------------------------------------
        from app.db.models import (
            ChildProfileModel,
            CaregiverChildLinkModel,
            ConsentRecordModel,
            ReferralDirectoryResourceModel,
        )

        # 1. Caregiver Demo
        if not db.get(UserModel, "usr_caregiver_demo"):
            db.add(
                UserModel(
                    id="usr_caregiver_demo",
                    tenant_id="tenant_synthetic_inneros_default",
                    email="caregiver@inneros.app",
                    display_name="Amina Farooq (Parent)",
                    password_hash=ph.hash("InnerOS-Caregiver-2026!"),
                    role="caregiver",
                    locale="en-US",
                    is_active=True,
                    is_demo=True,
                    created_at=now,
                    updated_at=now,
                )
            )

        # 2. Teacher Demo
        if not db.get(UserModel, "usr_teacher_demo"):
            db.add(
                UserModel(
                    id="usr_teacher_demo",
                    tenant_id="tenant_synthetic_inneros_default",
                    email="teacher@inneros.app",
                    display_name="Mr. Tariq Ahmed (Classroom Teacher)",
                    password_hash=ph.hash("InnerOS-Teacher-2026!"),
                    role="teacher",
                    locale="en-US",
                    is_active=True,
                    is_demo=True,
                    created_at=now,
                    updated_at=now,
                )
            )

        # 3. Clinician / Safeguarding Lead Demo
        if not db.get(UserModel, "usr_clinician_demo"):
            db.add(
                UserModel(
                    id="usr_clinician_demo",
                    tenant_id="tenant_synthetic_inneros_default",
                    email="clinician@inneros.app",
                    display_name="Dr. Sarah Khan (Safeguarding Lead)",
                    password_hash=ph.hash("InnerOS-Clinician-2026!"),
                    role="clinician",
                    locale="en-US",
                    is_active=True,
                    is_demo=True,
                    created_at=now,
                    updated_at=now,
                )
            )

        # 4. Teen User Demo (Adolescent with Emotional Autonomy)
        if not db.get(UserModel, "usr_teen_demo"):
            db.add(
                UserModel(
                    id="usr_teen_demo",
                    tenant_id="tenant_synthetic_inneros_default",
                    email="ayaan@inneros.app",
                    display_name="Ayaan Farooq (Teen)",
                    password_hash=ph.hash("InnerOS-Teen-2026!"),
                    role="teen",
                    age_tier="teen",
                    guardian_id="usr_caregiver_demo",
                    locale="en-US",
                    is_active=True,
                    is_demo=True,
                    created_at=now,
                    updated_at=now,
                )
            )

        # 5. Child Profile Demo (Zara, Junior 6-12)
        if not db.get(ChildProfileModel, "chld_zara_demo"):
            db.add(
                ChildProfileModel(
                    id="chld_zara_demo",
                    guardian_id="usr_caregiver_demo",
                    display_name="Zara",
                    age_tier="junior",
                    birth_year_month="2017-06",
                    locale="ur",
                    sensory_low_stimulation=False,
                    daily_screen_time_limit_minutes=45,
                    curfew_bedtime="20:30",
                    voice_enabled=True,
                    is_active=True,
                    created_at=now,
                    updated_at=now,
                )
            )
            # Link to Caregiver
            db.add(
                CaregiverChildLinkModel(
                    id="ccl_zara_demo",
                    caregiver_id="usr_caregiver_demo",
                    child_id="chld_zara_demo",
                    relationship_type="parent",
                    verification_method="verifiable_parental_attestation",
                    verification_status="verified",
                    verified_at=now,
                    can_manage_settings=True,
                    can_view_activity=True,
                    created_at=now,
                )
            )
            # Verifiable Parental Consent
            db.add(
                ConsentRecordModel(
                    id="csr_zara_demo",
                    subject_id="chld_zara_demo",
                    subject_type="child",
                    signatory_user_id="usr_caregiver_demo",
                    consent_type="coppa_verifiable_parental_consent",
                    policy_version="2026.1_youth_v1",
                    is_granted=True,
                    created_at=now,
                )
            )

        # 6. Referral Directory Hotlines (PK, US, UK, CA, GLOBAL)
        existing_ref = db.scalars(select(ReferralDirectoryResourceModel).limit(1)).first()
        if not existing_ref:
            referrals = [
                ReferralDirectoryResourceModel(
                    id="ref_pk_01",
                    country_code="PK",
                    organization_name="Umang Mental Health Helpline Pakistan",
                    category="youth_crisis",
                    phone="+92-311-7786264",
                    website="https://www.umang.com.pk",
                    languages="Urdu, English, Punjabi",
                    is_24_7=True,
                    is_verified=True,
                    verified_by="Pakistan Clinical Safeguarding Board",
                    created_at=now,
                ),
                ReferralDirectoryResourceModel(
                    id="ref_pk_02",
                    country_code="PK",
                    organization_name="Rozan Emotional Health Counseling Helpline",
                    category="child_helpline",
                    phone="0800-22444",
                    website="https://rozan.org",
                    languages="Urdu, English",
                    is_24_7=False,
                    is_verified=True,
                    verified_by="National Child Rights Commission",
                    created_at=now,
                ),
                ReferralDirectoryResourceModel(
                    id="ref_us_01",
                    country_code="US",
                    organization_name="988 Suicide & Crisis Lifeline",
                    category="youth_crisis",
                    phone="988",
                    text_sms="988",
                    website="https://988lifeline.org",
                    languages="English, Spanish",
                    is_24_7=True,
                    is_verified=True,
                    verified_by="SAMHSA US",
                    created_at=now,
                ),
                ReferralDirectoryResourceModel(
                    id="ref_gb_01",
                    country_code="GB",
                    organization_name="Childline UK (NSPCC)",
                    category="child_helpline",
                    phone="0800 1111",
                    website="https://www.childline.org.uk",
                    languages="English, Welsh",
                    is_24_7=True,
                    is_verified=True,
                    verified_by="UK Department for Education",
                    created_at=now,
                ),
                ReferralDirectoryResourceModel(
                    id="ref_ca_01",
                    country_code="CA",
                    organization_name="Kids Help Phone Canada",
                    category="youth_crisis",
                    phone="1-800-668-6868",
                    text_sms="CONNECT to 686868",
                    website="https://kidshelpphone.ca",
                    languages="English, French",
                    is_24_7=True,
                    is_verified=True,
                    verified_by="Health Canada",
                    created_at=now,
                ),
            ]
            for r in referrals:
                db.add(r)

        # 7. Service Catalog Products & Pricing Plans
        from app.db.models import ProductModel, PriceModel, SubscriptionModel, EntitlementModel, SupportTicketModel

        existing_prod = db.get(ProductModel, "prod_kids_learning")
        if not existing_prod:
            catalog = [
                ProductModel(
                    id="prod_free_tier",
                    service_type="free_tier",
                    name="InnerOS Free Foundation",
                    description="Essential emotion labeling, visual schedules, and 24/7 crisis hotlines. Always free for all families.",
                    target_audience="families",
                    eligibility="universal",
                    feature_entitlements_json=json.dumps(["foundation_emotions", "first_then_basic", "crisis_helplines"]),
                    is_published=True,
                    created_at=now,
                    updated_at=now,
                ),
                ProductModel(
                    id="prod_kids_learning",
                    service_type="kids_sub",
                    name="InnerOS Kids Sanctuary",
                    description="Full access to 25 CASEL curriculum departments, animated Lumi mascot, multilingual voice room, and offline family activities.",
                    target_audience="kids",
                    eligibility="ages_2_12",
                    feature_entitlements_json=json.dumps(["lumi_voice_full", "academy_all_departments", "aac_symbols_full", "first_then_unlimited"]),
                    is_published=True,
                    created_at=now,
                    updated_at=now,
                ),
                ProductModel(
                    id="prod_teen_learning",
                    service_type="teen_sub",
                    name="InnerOS Teens Navigator",
                    description="Private self-reflection journal, cognitive defusion framing, exam pacing, and digital well-being tools for adolescents.",
                    target_audience="teens",
                    eligibility="ages_13_18",
                    feature_entitlements_json=json.dumps(["teen_private_journal", "cognitive_reframing", "study_pacing", "sleep_somatic_audio"]),
                    is_published=True,
                    created_at=now,
                    updated_at=now,
                ),
                ProductModel(
                    id="prod_family_membership",
                    service_type="family_sub",
                    name="InnerOS Family Sanctuary All-Access",
                    description="All-in-one family membership for up to 5 child and teen profiles, shared family connection cards, and parent dashboard controls.",
                    target_audience="families",
                    eligibility="guardians",
                    feature_entitlements_json=json.dumps(["kids_unlimited", "teens_unlimited", "family_multi_child", "parent_hub_full"]),
                    is_published=True,
                    created_at=now,
                    updated_at=now,
                ),
                ProductModel(
                    id="prod_school_license",
                    service_type="school_lic",
                    name="InnerOS Classroom & School License",
                    description="Institutional classroom licenses with homeroom advisory lessons, printable UDL accommodation guides, and bulk seat management.",
                    target_audience="schools",
                    eligibility="educators",
                    feature_entitlements_json=json.dumps(["teacher_portal_full", "udl_printable_guides", "classroom_bulk_seats"]),
                    is_published=True,
                    created_at=now,
                    updated_at=now,
                ),
            ]
            for p in catalog:
                db.add(p)

            prices = [
                PriceModel(
                    id="price_free",
                    product_id="prod_free_tier",
                    amount_cents=0,
                    currency="USD",
                    billing_interval="free",
                    is_active=True,
                    created_at=now,
                ),
                PriceModel(
                    id="price_kids_monthly",
                    product_id="prod_kids_learning",
                    amount_cents=999,
                    currency="USD",
                    billing_interval="monthly",
                    is_active=True,
                    created_at=now,
                ),
                PriceModel(
                    id="price_kids_annual",
                    product_id="prod_kids_learning",
                    amount_cents=7999,
                    currency="USD",
                    billing_interval="annual",
                    is_active=True,
                    created_at=now,
                ),
                PriceModel(
                    id="price_teen_monthly",
                    product_id="prod_teen_learning",
                    amount_cents=999,
                    currency="USD",
                    billing_interval="monthly",
                    is_active=True,
                    created_at=now,
                ),
                PriceModel(
                    id="price_teen_annual",
                    product_id="prod_teen_learning",
                    amount_cents=7999,
                    currency="USD",
                    billing_interval="annual",
                    is_active=True,
                    created_at=now,
                ),
                PriceModel(
                    id="price_family_monthly",
                    product_id="prod_family_membership",
                    amount_cents=1499,
                    currency="USD",
                    billing_interval="monthly",
                    is_active=True,
                    created_at=now,
                ),
                PriceModel(
                    id="price_family_annual",
                    product_id="prod_family_membership",
                    amount_cents=11999,
                    currency="USD",
                    billing_interval="annual",
                    is_active=True,
                    created_at=now,
                ),
                PriceModel(
                    id="price_school_annual",
                    product_id="prod_school_license",
                    amount_cents=29900,
                    currency="USD",
                    billing_interval="annual",
                    is_active=True,
                    created_at=now,
                ),
            ]
            for pr in prices:
                db.add(pr)

            # Seed demo active subscription for caregiver
            db.add(
                SubscriptionModel(
                    id="sub_caregiver_family_demo",
                    user_id="usr_caregiver_demo",
                    product_id="prod_family_membership",
                    price_id="price_family_annual",
                    status="active",
                    current_period_start=now,
                    current_period_end=datetime(now.year + 1, now.month, now.day, tzinfo=timezone.utc),
                    cancel_at_period_end=False,
                    created_at=now,
                    updated_at=now,
                )
            )
            db.add(
                EntitlementModel(
                    id="ent_caregiver_demo_01",
                    user_id="usr_caregiver_demo",
                    feature_key="family_multi_child",
                    granted_via="subscription",
                    is_active=True,
                    created_at=now,
                )
            )
            db.add(
                EntitlementModel(
                    id="ent_caregiver_demo_02",
                    user_id="usr_caregiver_demo",
                    feature_key="kids_unlimited",
                    granted_via="subscription",
                    is_active=True,
                    created_at=now,
                )
            )

            # Seed demo customer support ticket
            db.add(
                SupportTicketModel(
                    id="tkt_demo_001",
                    user_id="usr_caregiver_demo",
                    subject="Inquiry regarding multilingual Punjabi voice support",
                    category="technical",
                    priority="medium",
                    status="open",
                    message="Hello! I wanted to check when voice audio output for Punjabi Shahmukhi will be available alongside the text. Thank you!",
                    created_at=now,
                    updated_at=now,
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
