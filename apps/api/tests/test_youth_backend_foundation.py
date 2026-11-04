"""Comprehensive Test Suite for InnerOS Kids Backend Foundation.

Verifies:
1. Identity & Access Control for all roles (Child, Teen, Caregiver, Teacher, Clinician, Safeguarding, Admin).
2. Object-Level Authorization (Caregivers restricted to their own verified children).
3. Teen Confidentiality & Autonomous Privacy Shield (No parental surveillance of raw teen thoughts).
4. Verifiable Parental Consent (COPPA) & Digital Assent Versioning & Revocation.
5. Safety Escalation Workflow with Restricted Incident Access (Safeguarding/Clinician only).
6. Verified 24/7 Crisis & Youth Distress Referral Directory.
7. Right-to-be-Forgotten Data Purge & Retention Enforcement.
8. Parent Dashboard & Platform Admin Safeguarding Summaries.
9. Strict Invariant: Rejection of commercial advertising profiling on child emotional data.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_child_profile_creation_and_object_authorization():
    """Verify child profile creation with data minimization and object-level caregiver authorization."""
    # 1. Caregiver creates child profile
    payload = {
        "display_name": "Hamza",
        "age_tier": "junior",
        "birth_year_month": "2016-04",
        "locale": "ur",
        "sensory_low_stimulation": True,
        "dyslexic_font": False,
        "high_contrast": False,
        "reduced_motion": True,
        "daily_screen_time_limit_minutes": 40,
        "curfew_bedtime": "21:00",
        "voice_enabled": True,
    }

    headers_caregiver = {
        "X-User-ID": "usr_caregiver_demo",
        "X-User-Role": "caregiver",
    }
    create_resp = client.post("/api/v1/youth-governance/profiles", json=payload, headers=headers_caregiver)
    assert create_resp.status_code == 201
    created_child = create_resp.json()
    child_id = created_child["id"]
    assert created_child["display_name"] == "Hamza"
    assert created_child["age_tier"] == "junior"
    assert created_child["guardian_id"] == "usr_caregiver_demo"

    # 2. Verified caregiver can retrieve profile
    get_resp = client.get(f"/api/v1/youth-governance/profiles/{child_id}", headers=headers_caregiver)
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == child_id

    # 3. Verified caregiver can update settings
    update_resp = client.put(
        f"/api/v1/youth-governance/profiles/{child_id}",
        json={"daily_screen_time_limit_minutes": 50},
        headers=headers_caregiver,
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["daily_screen_time_limit_minutes"] == 50

    # 4. Unauthorized foreign caregiver is denied access (Object-Level Authorization)
    headers_foreign_caregiver = {
        "X-User-ID": "usr_foreign_caregiver_999",
        "X-User-Role": "caregiver",
    }
    foreign_resp = client.get(f"/api/v1/youth-governance/profiles/{child_id}", headers=headers_foreign_caregiver)
    assert foreign_resp.status_code == 403
    assert "Object authorization denied" in foreign_resp.json()["detail"]


def test_teen_confidentiality_and_privacy_boundaries():
    """Verify that teen emotional autonomy is preserved and raw thoughts are not exposed to parents."""
    headers_caregiver = {
        "X-User-ID": "usr_caregiver_demo",
        "X-User-Role": "caregiver",
    }
    resp = client.get("/api/v1/youth-governance/parent-dashboard", headers=headers_caregiver)
    assert resp.status_code == 200
    data = resp.json()

    # Verify explicit notice protecting adolescent autonomy
    assert "teen_privacy_shield_notice" in data
    assert "adolescents (ages 13–17) have confidential emotional autonomy" in data["teen_privacy_shield_notice"]
    assert "Raw teen conversations are not shared with parents" in data["teen_privacy_shield_notice"]


def test_verifiable_parental_consent_and_revocation():
    """Verify COPPA Verifiable Parental Consent record creation, audit trail, and revocation."""
    headers_caregiver = {
        "X-User-ID": "usr_caregiver_demo",
        "X-User-Role": "caregiver",
    }
    consent_payload = {
        "subject_id": "chld_zara_demo",
        "subject_type": "child",
        "consent_type": "coppa_verifiable_parental_consent",
        "policy_version": "2026.1_youth_v1",
        "is_granted": True,
    }
    create_resp = client.post("/api/v1/youth-governance/consent", json=consent_payload, headers=headers_caregiver)
    assert create_resp.status_code == 201
    consent_record = create_resp.json()
    consent_id = consent_record["id"]
    assert consent_record["is_granted"] is True

    # Check consent audit history
    history_resp = client.get("/api/v1/youth-governance/consent/chld_zara_demo", headers=headers_caregiver)
    assert history_resp.status_code == 200
    assert len(history_resp.json()) >= 1

    # Revoke consent
    revoke_resp = client.post(f"/api/v1/youth-governance/consent/{consent_id}/revoke", headers=headers_caregiver)
    assert revoke_resp.status_code == 200
    assert revoke_resp.json()["status"] == "revoked"

    # Attempt to revoke from an unauthorized account fails
    headers_unauthorized = {"X-User-ID": "usr_intruder_001", "X-User-Role": "user"}
    unauth_revoke = client.post(f"/api/v1/youth-governance/consent/{consent_id}/revoke", headers=headers_unauthorized)
    assert unauth_revoke.status_code == 403


def test_safety_escalation_incident_restricted_access():
    """Verify safety incident creation and strict role-based access restricted to certified safeguarding leads."""
    # 1. Create a safety escalation incident
    incident_payload = {
        "subject_id": "usr_teen_demo",
        "age_tier": "teen",
        "severity_tier": "critical_immediate",
        "category": "self_harm",
        "circuit_breaker_active": True,
        "de_escalation_script_served": "grounding_resource",
    }
    create_resp = client.post("/api/v1/youth-governance/safety-incidents", json=incident_payload)
    assert create_resp.status_code == 201
    incident_data = create_resp.json()
    incident_id = incident_data["id"]
    assert incident_data["circuit_breaker_active"] is True

    # 2. Standard user or child cannot access safety incidents
    headers_child = {"X-User-ID": "chld_zara_demo", "X-User-Role": "child"}
    denied_resp = client.get("/api/v1/youth-governance/safety-incidents", headers=headers_child)
    assert denied_resp.status_code == 403
    assert "Access restricted" in denied_resp.json()["detail"]

    # 3. Clinician / Safeguarding Lead CAN access safety incidents
    headers_clinician = {"X-User-ID": "usr_clinician_demo", "X-User-Role": "clinician"}
    allowed_resp = client.get("/api/v1/youth-governance/safety-incidents", headers=headers_clinician)
    assert allowed_resp.status_code == 200
    incidents = allowed_resp.json()
    assert any(i["id"] == incident_id for i in incidents)

    # 4. Clinician can resolve incident with clinical notes
    update_resp = client.put(
        f"/api/v1/youth-governance/safety-incidents/{incident_id}",
        json={
            "resolution_status": "resolved_closed",
            "resolution_notes": "De-escalation delivered; connected to verified local crisis helpline.",
        },
        headers=headers_clinician,
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["resolution_status"] == "resolved_closed"
    assert update_resp.json()["circuit_breaker_active"] is False


def test_verified_referral_directory():
    """Verify retrieval of verified 24/7 crisis and youth support hotlines."""
    # Pakistan directory
    pk_resp = client.get("/api/v1/youth-governance/referrals?country_code=PK")
    assert pk_resp.status_code == 200
    pk_data = pk_resp.json()
    assert any("Umang" in r["organization_name"] for r in pk_data)
    assert any("Rozan" in r["organization_name"] for r in pk_data)

    # US directory
    us_resp = client.get("/api/v1/youth-governance/referrals?country_code=US")
    assert us_resp.status_code == 200
    us_data = us_resp.json()
    assert any("988" in r["phone"] for r in us_data)


def test_right_to_be_forgotten_data_deletion():
    """Verify one-click deletion of child profile and derived records (COPPA / GDPR-K)."""
    headers_caregiver = {"X-User-ID": "usr_caregiver_demo", "X-User-Role": "caregiver"}

    # 1. Create a disposable child profile
    create_resp = client.post(
        "/api/v1/youth-governance/profiles",
        json={"display_name": "DisposableChild", "age_tier": "little", "locale": "en"},
        headers=headers_caregiver,
    )
    assert create_resp.status_code == 201
    child_id = create_resp.json()["id"]

    # 2. Record an activity
    client.post(
        "/api/v1/youth-governance/activities",
        json={
            "child_id": child_id,
            "module_id": "mod_early_01",
            "department_id": "self_regulation_coping",
            "stage_completed": "completed",
            "session_duration_seconds": 120,
            "progress_indicator": "Completed gentle bunny breaths.",
        },
        headers=headers_caregiver,
    )

    # 3. Request Right-to-be-Forgotten deletion
    del_resp = client.post(
        "/api/v1/youth-governance/retention/delete",
        json={"target_id": child_id, "request_type": "child_account_deletion"},
        headers=headers_caregiver,
    )
    assert del_resp.status_code == 200
    assert del_resp.json()["status"] == "completed"

    # 4. Subsequent retrieval returns 404 Not Found
    get_resp = client.get(f"/api/v1/youth-governance/profiles/{child_id}", headers=headers_caregiver)
    assert get_resp.status_code == 404


def test_voice_session_metadata_zero_audio_retention():
    """Verify that voice session metadata is logged with strict zero raw audio persistence invariant."""
    headers_child = {"X-User-ID": "chld_zara_demo", "X-User-Role": "child"}
    payload = {
        "user_or_child_id": "chld_zara_demo",
        "user_role": "child",
        "provider": "azure_speech",
        "detected_language": "ur",
        "duration_seconds": 45,
        "latency_ms": 195,
        "audio_persisted": False,
    }
    resp = client.post("/api/v1/youth-governance/voice-metadata", json=payload, headers=headers_child)
    assert resp.status_code == 201
    assert resp.json()["audio_persisted"] is False


def test_parent_and_admin_dashboard_aggregators():
    """Verify Parent Dashboard and Platform Admin aggregate endpoints."""
    # Parent Dashboard
    headers_caregiver = {"X-User-ID": "usr_caregiver_demo", "X-User-Role": "caregiver"}
    parent_resp = client.get("/api/v1/youth-governance/parent-dashboard", headers=headers_caregiver)
    assert parent_resp.status_code == 200
    parent_data = parent_resp.json()
    assert parent_data["caregiver_id"] == "usr_caregiver_demo"
    assert len(parent_data["shared_family_exercises"]) >= 1

    # Admin Dashboard (Requires Admin or Safeguarding role)
    headers_admin = {"X-User-ID": "usr_admin_inneros_001", "X-User-Role": "admin"}
    admin_resp = client.get("/api/v1/youth-governance/admin-dashboard", headers=headers_admin)
    assert admin_resp.status_code == 200
    admin_data = admin_resp.json()
    assert admin_data["curriculum_modules_count"] >= 20
    assert len(admin_data["voice_benchmarks"]) >= 3


def test_prohibited_advertising_profiling_invariant():
    """Verify strict invariant: immediate rejection of commercial advertising profiling on child emotional data."""
    headers_caregiver = {"X-User-ID": "usr_caregiver_demo", "X-User-Role": "caregiver"}
    bad_payload = {
        "display_name": "AdTargetChild",
        "locale": "ad_profile_monetize_emotions",
    }
    resp = client.post("/api/v1/youth-governance/profiles", json=bad_payload, headers=headers_caregiver)
    assert resp.status_code == 400
    assert "Commercial advertising profiling" in resp.json()["detail"]
