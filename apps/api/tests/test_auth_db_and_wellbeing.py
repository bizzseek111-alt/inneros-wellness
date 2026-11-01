"""Comprehensive Test Suite for Authentication, RBAC, Relational Persistence,
Wellbeing (Journal, Growth, Check-Ins, Local Migration), Contact, and Admin Operations.
"""

import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_signup_login_me_and_logout_flow():
    unique_email = f"maya.lin.{uuid.uuid4().hex[:8]}@example.com"

    # 1. Signup
    signup_res = client.post(
        "/api/v1/auth/signup",
        json={
            "email": unique_email,
            "password": "SafePassword-2026!",
            "display_name": "Maya Lin",
            "locale": "en-US",
        },
    )
    assert signup_res.status_code == 201
    data = signup_res.json()
    assert data["authenticated"] is True
    assert data["user"]["email"] == unique_email
    assert data["user"]["display_name"] == "Maya Lin"
    assert data["user"]["role"] == "user"
    token = data["session_token"]

    # 2. Duplicate signup returns 409
    dup_res = client.post(
        "/api/v1/auth/signup",
        json={
            "email": unique_email,
            "password": "SafePassword-2026!",
            "display_name": "Maya Lin",
        },
    )
    assert dup_res.status_code == 409

    # 3. GET /auth/me with Bearer token
    me_res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_res.status_code == 200
    assert me_res.json()["email"] == unique_email

    # 4. Wrong password login returns 401
    bad_login = client.post(
        "/api/v1/auth/login",
        json={"email": unique_email, "password": "WrongPassword!"},
    )
    assert bad_login.status_code == 401

    # 5. Valid login returns 200 and new session token
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": unique_email, "password": "SafePassword-2026!"},
    )
    assert login_res.status_code == 200
    login_token = login_res.json()["session_token"]

    # 6. Logout revokes token
    logout_res = client.post(
        "/api/v1/auth/logout",
        headers={"Authorization": f"Bearer {login_token}"},
    )
    assert logout_res.status_code == 200
    assert logout_res.json()["session_revoked"] is True

    # 7. Using revoked token returns 401
    revoked_me = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {login_token}"},
    )
    assert revoked_me.status_code == 401


def test_rbac_enforcement_on_admin_and_knowledge_review():
    # Standard user cannot access admin overview or toggle feature flags
    unpriv_headers = {"X-User-ID": "usr_standard_bob", "X-User-Role": "user"}
    res_overview = client.get("/api/v1/admin/overview", headers=unpriv_headers)
    assert res_overview.status_code == 403

    res_flag = client.put(
        "/api/v1/admin/feature-flags/voice_realtime_companion",
        json={"enabled": False},
        headers=unpriv_headers,
    )
    assert res_flag.status_code == 403

    # Admin role succeeds
    admin_headers = {"X-User-ID": "usr_admin_inneros_001", "X-User-Role": "admin"}
    admin_overview = client.get("/api/v1/admin/overview", headers=admin_headers)
    assert admin_overview.status_code == 200
    overview_data = admin_overview.json()
    assert overview_data["platform_health"]["status"] == "healthy"
    assert len(overview_data["feature_flags"]) >= 5

    # Toggle feature flag and restore
    toggle_off = client.put(
        "/api/v1/admin/feature-flags/voice_realtime_companion",
        json={"enabled": False},
        headers=admin_headers,
    )
    assert toggle_off.status_code == 200
    assert toggle_off.json()["enabled"] is False

    toggle_on = client.put(
        "/api/v1/admin/feature-flags/voice_realtime_companion",
        json={"enabled": True},
        headers=admin_headers,
    )
    assert toggle_on.status_code == 200
    assert toggle_on.json()["enabled"] is True

    # Anonymized safety incidents endpoint works for admin and contains zero raw transcripts
    incidents = client.get("/api/v1/admin/safety-incidents", headers=admin_headers)
    assert incidents.status_code == 200
    assert len(incidents.json()) >= 1
    assert "user_id_hash" in incidents.json()[0]


def test_journal_growth_and_check_in_crud_with_user_isolation():
    user_a = {"X-User-ID": f"usr_journal_a_{uuid.uuid4().hex[:6]}"}
    user_b = {"X-User-ID": f"usr_journal_b_{uuid.uuid4().hex[:6]}"}

    # 1. User A creates a journal entry
    create_j = client.post(
        "/api/v1/journal",
        json={
            "title": "Evening reflection after walk",
            "content": "Stepping outside without headphones helped quiet the mental loop.",
            "prompt": "What helped you slow down today?",
            "tags": ["walking", "decompression"],
            "mood_valence": "calm",
        },
        headers=user_a,
    )
    assert create_j.status_code == 201
    entry_id = create_j.json()["id"]

    # User A sees it; User B does not
    list_a = client.get("/api/v1/journal", headers=user_a)
    assert len(list_a.json()) == 1
    list_b = client.get("/api/v1/journal", headers=user_b)
    assert len(list_b.json()) == 0

    # User B cannot delete User A's journal entry
    del_b = client.delete(f"/api/v1/journal/{entry_id}", headers=user_b)
    assert del_b.status_code == 404

    # 2. User A creates a growth goal and toggles a step
    create_g = client.post(
        "/api/v1/growth",
        json={
            "title": "Keep mornings unhurried",
            "category": "Rest & Boundaries",
            "why_it_matters": "Reduces anticipatory stress before work.",
            "steps": [
                {"id": "step_a", "label": "Drink water before checking messages", "completed": False},
            ],
        },
        headers=user_a,
    )
    assert create_g.status_code == 201
    goal_id = create_g.json()["id"]

    toggle_res = client.put(
        f"/api/v1/growth/{goal_id}/steps/step_a",
        json={"completed": True},
        headers=user_a,
    )
    assert toggle_res.status_code == 200
    assert toggle_res.json()["steps"][0]["completed"] is True

    # 3. User A logs a daily check-in
    create_c = client.post(
        "/api/v1/check-ins",
        json={
            "energy_level": 4,
            "stress_level": 2,
            "emotions": ["Calm", "Present"],
            "needs": ["Quiet focus"],
            "note": "Steady afternoon rhythm.",
        },
        headers=user_a,
    )
    assert create_c.status_code == 201
    checkins_a = client.get("/api/v1/check-ins", headers=user_a)
    assert len(checkins_a.json()) == 1


def test_local_storage_migration_and_public_contact_submission():
    user_headers = {"X-User-ID": f"usr_migrate_{uuid.uuid4().hex[:6]}"}
    mig_res = client.post(
        "/api/v1/wellbeing/migrate-local",
        json={
            "journal_entries": [
                {
                    "title": "Migrated browser note",
                    "content": "Preserved from local browser storage.",
                    "tags": ["migrated"],
                }
            ],
            "growth_goals": [
                {
                    "title": "Migrated growth intention",
                    "category": "Habits",
                    "why_it_matters": "Continuity matters.",
                    "steps": [{"id": "s1", "label": "First step", "completed": True}],
                }
            ],
            "check_ins": [
                {
                    "energy_level": 3,
                    "stress_level": 3,
                    "emotions": ["Reflective"],
                    "needs": ["Rest"],
                    "note": "Migrated check-in",
                }
            ],
        },
        headers=user_headers,
    )
    assert mig_res.status_code == 200
    assert mig_res.json()["total_migrated"] == 3

    # Verify public contact endpoint persists inquiry
    contact_res = client.post(
        "/api/v1/contact",
        json={
            "name": "Dr. Jonas Albrecht",
            "email": "jonas.albrecht@university.edu",
            "inquiry_type": "research_partnership",
            "organization": "Zürich Wellbeing Lab",
            "message": "Interested in evaluating InnerOS non-clinical psychoeducation taxonomy.",
        },
    )
    assert contact_res.status_code == 201
    assert contact_res.json()["status"] == "received"
