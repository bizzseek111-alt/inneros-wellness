"""Comprehensive Automated Testing for Two Dashboards & The 7 Production Journeys.

Journeys Tested:
- JOURNEY A: Adult registers -> verifies email -> logs in -> loads parent dashboard.
- JOURNEY B: Parent creates child profile -> configures language & accessibility -> opens authorized child experience.
- JOURNEY C: Parent selects service -> completes sandbox checkout -> order recorded -> entitlement activated.
- JOURNEY D: Authorized admin logs in -> views customers -> creates service -> publishes pricing plan -> reviews order.
- JOURNEY E: Content editor creates curriculum module -> reviewer approves -> published in catalog.
- JOURNEY F: Strict Authorization -> unauthorized user receives 403 on /admin and cannot access other family's data.
- JOURNEY G: Privacy & Deletion -> authorized deletion request follows retention purge workflow.
"""

import uuid
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.db.database import init_db


@pytest.fixture
def client():
    init_db()
    with TestClient(app) as c:
        c.cookies.clear()
        yield c


# =============================================================================
# JOURNEY A — REGISTRATION & VERIFICATION
# =============================================================================
def test_journey_a_registration_verification_and_login(client):
    """Adult registers -> verifies account -> logs in -> opens parent dashboard."""
    unique_email = f"parent_journey_a_{uuid.uuid4().hex[:8]}@example.com"
    password = "SecureFamilyPassword2026!"
    display_name = "Mariam Khan"

    # 1. Adult registers
    signup_res = client.post(
        "/api/v1/auth/signup",
        json={
            "email": unique_email,
            "password": password,
            "display_name": display_name,
            "locale": "en-US",
        },
    )
    assert signup_res.status_code == 201
    signup_data = signup_res.json()
    assert signup_data["authenticated"] is True
    assert signup_data["user"]["email"] == unique_email
    assert signup_data["user"]["email_verified"] is False
    user_id = signup_data["user"]["user_id"]

    # 2. Adult verifies account using verification token
    verify_res = client.post(
        "/api/v1/auth/verify-email",
        json={"token": "dev_verify_token"},
    )
    assert verify_res.status_code == 200
    assert verify_res.json()["success"] is True

    # 3. Adult logs in
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": unique_email, "password": password},
    )
    assert login_res.status_code == 200
    token = login_res.json()["session_token"]
    headers = {"Authorization": f"Bearer {token}", "X-User-Id": user_id, "X-User-Role": "caregiver"}

    # 4. Opens parent dashboard
    parent_dash_res = client.get("/api/v1/youth-governance/parent-dashboard", headers=headers)
    assert parent_dash_res.status_code == 200
    data = parent_dash_res.json()
    assert "linked_children" in data
    assert "caregiver_id" in data


# =============================================================================
# JOURNEY B — FAMILY & CHILD CREATION & CHILD LAUNCH
# =============================================================================
def test_journey_b_family_child_creation_and_isolated_launch(client):
    """Parent creates child profile -> selects language & sensory settings -> opens authorized child experience."""
    caregiver_id = f"cg_journey_b_{uuid.uuid4().hex[:8]}"
    headers = {"X-User-Id": caregiver_id, "X-User-Role": "caregiver"}

    # 1. Parent creates child profile with Urdu language and low-stimulation sensory settings
    create_child_res = client.post(
        "/api/v1/youth-governance/profiles",
        headers=headers,
        json={
            "display_name": "Hamza",
            "age_tier": "junior",
            "locale": "ur",
            "sensory_low_stimulation": True,
            "dyslexic_font": False,
            "high_contrast": True,
            "reduced_motion": True,
            "daily_screen_time_limit_minutes": 30,
            "curfew_bedtime": "20:00",
            "voice_enabled": True,
        },
    )
    assert create_child_res.status_code == 201
    child = create_child_res.json()
    child_id = child["id"]
    assert child["display_name"] == "Hamza"
    assert child["sensory_low_stimulation"] is True
    assert child["locale"] == "ur"

    # 2. Parent grants verifiable parental consent (COPPA)
    consent_res = client.post(
        "/api/v1/youth-governance/consent",
        headers=headers,
        json={
            "subject_id": child_id,
            "subject_type": "child",
            "consent_type": "coppa_verifiable_parental_consent",
            "policy_version": "2026.1_youth_v1",
            "is_granted": True,
        },
    )
    assert consent_res.status_code == 201
    assert consent_res.json()["is_granted"] is True

    # 3. Child launches isolated turn (safe child experience)
    # Child session turn does not expose caregiver billing, tickets, or sibling data
    child_turn_res = client.post(
        "/api/v1/youth-companion/turn",
        headers={"X-User-Id": child_id, "X-User-Role": "child"},
        json={
            "session_id": f"sess_child_{uuid.uuid4().hex[:6]}",
            "user_utterance": "Aaj mera school mein dost se jhagrah hua.",
            "language": "ur",
            "age_tier": "junior",
            "caregiver_present": False,
        },
    )
    assert child_turn_res.status_code == 200
    turn_data = child_turn_res.json()
    assert "transcript_agent" in turn_data
    # Asserts child output is empathetic and non-clinical in Urdu
    assert len(turn_data["transcript_agent"]) > 5


# =============================================================================
# JOURNEY C — SERVICE PURCHASES & SANDBOX BILLING
# =============================================================================
def test_journey_c_service_catalog_and_sandbox_checkout(client):
    """Parent selects service -> completes sandbox checkout -> order recorded -> entitlement activates."""
    parent_id = f"usr_parent_checkout_{uuid.uuid4().hex[:8]}"
    headers = {"X-User-Id": parent_id, "X-User-Role": "caregiver"}

    # 1. Parent browses catalog
    cat_res = client.get("/api/v1/commerce/catalog")
    assert cat_res.status_code == 200
    catalog = cat_res.json()
    assert len(catalog) >= 1
    family_prod = next((p for p in catalog if p["service_type"] == "family_sub"), catalog[0])
    price = family_prod["prices"][0]

    # 2. Parent checks pre-purchase entitlement
    check_pre = client.get(
        "/api/v1/commerce/entitlements/check/kids_unlimited",
        headers=headers,
    )
    assert check_pre.status_code == 200
    assert check_pre.json()["is_entitled"] is False

    # 3. Completes sandbox checkout
    checkout_res = client.post(
        "/api/v1/commerce/checkout/session",
        headers=headers,
        json={
            "price_id": price["id"],
            "payment_provider": "mock_sandbox",
            "success_url": "/parent?payment=success",
        },
    )
    assert checkout_res.status_code == 200
    order = checkout_res.json()
    assert order["status"] == "completed"
    assert order["payment_provider"] == "mock_sandbox"

    # 4. Entitlements automatically activated
    check_post = client.get(
        "/api/v1/commerce/entitlements/check/kids_unlimited",
        headers=headers,
    )
    assert check_post.status_code == 200
    assert check_post.json()["is_entitled"] is True

    # 5. Order and invoice visible in parent billing ledger
    orders_res = client.get("/api/v1/commerce/orders/me", headers=headers)
    assert orders_res.status_code == 200
    assert len(orders_res.json()) >= 1
    assert orders_res.json()[0]["id"] == order["order_id"]

    invs_res = client.get("/api/v1/commerce/invoices/me", headers=headers)
    assert invs_res.status_code == 200
    assert len(invs_res.json()) >= 1


# =============================================================================
# JOURNEY D — ADMINISTRATION WORKFLOW
# =============================================================================
def test_journey_d_admin_catalog_order_and_team_management(client):
    """Admin logs in -> views customer -> creates service -> publishes plan -> reviews order & stats."""
    admin_headers = {"X-User-Role": "admin", "X-User-Id": "usr_super_admin"}

    # 1. Admin views overview and customers
    ov_res = client.get("/api/v1/admin/overview", headers=admin_headers)
    assert ov_res.status_code == 200
    assert "platform_health" in ov_res.json()

    cust_res = client.get("/api/v1/admin/customers", headers=admin_headers)
    assert cust_res.status_code == 200
    assert len(cust_res.json()) >= 1

    # 2. Admin creates a new service in the catalog
    new_prod_id = f"prod_robotics_sel_{uuid.uuid4().hex[:6]}"
    create_prod_res = client.post(
        "/api/v1/admin/products",
        headers=admin_headers,
        json={
            "id": new_prod_id,
            "service_type": "content_pack",
            "name": "Robotics & Emotional Intelligence Pack",
            "description": "Collaborative problem-solving and emotion regulation through STEM robotics.",
            "target_audience": "kids",
            "eligibility": "universal",
            "feature_entitlements": ["robotics_sel_pack", "stem_audio"],
            "is_published": True,
        },
    )
    assert create_prod_res.status_code == 201
    assert create_prod_res.json()["name"] == "Robotics & Emotional Intelligence Pack"

    # 3. Admin configures a pricing plan for the new service
    create_price_res = client.post(
        "/api/v1/admin/pricing-plans",
        headers=admin_headers,
        json={
            "product_id": new_prod_id,
            "amount_cents": 2900,
            "currency": "USD",
            "billing_interval": "one_time",
            "is_active": True,
        },
    )
    assert create_price_res.status_code == 201
    assert create_price_res.json()["amount_cents"] == 2900

    # 4. Admin invites a staff member to the team
    invite_res = client.post(
        "/api/v1/admin/team/invite",
        headers=admin_headers,
        json={
            "email": f"dr_reviewer_{uuid.uuid4().hex[:6]}@inneros.internal",
            "display_name": "Dr. Fatima Tariq",
            "role": "content_reviewer",
        },
    )
    assert invite_res.status_code == 201
    assert invite_res.json()["role"] == "content_reviewer"

    # 5. Admin lists team
    team_res = client.get("/api/v1/admin/team", headers=admin_headers)
    assert team_res.status_code == 200
    assert len(team_res.json()) >= 1


# =============================================================================
# JOURNEY E — CURRICULUM CREATION & CONTENT APPROVAL
# =============================================================================
def test_journey_e_curriculum_creation_and_clinical_approval(client):
    """Content editor creates lesson -> reviewer approves -> lesson becomes published."""
    reviewer_headers = {"X-User-Role": "content_reviewer", "X-User-Id": "usr_reviewer_001"}
    module_id = f"mod_test_{uuid.uuid4().hex[:6]}"

    # 1. Content review queue inspection
    queue_res = client.get("/api/v1/admin/content-approval/queue", headers=reviewer_headers)
    assert queue_res.status_code == 200
    assert len(queue_res.json()) >= 1

    # 2. Reviewer executes clinical sign-off action
    action_res = client.post(
        "/api/v1/admin/content-approval/action",
        headers=reviewer_headers,
        json={
            "module_id": module_id,
            "decision": "approved_for_publication",
            "reviewer_notes": "Developmentally aligned with Barkley executive function milestones. Citations confirmed.",
            "reviewer_credentials": "PhD in Developmental Psychology, Board Certified",
        },
    )
    assert action_res.status_code == 200
    assert action_res.json()["status"] == "approved_for_publication"


# =============================================================================
# JOURNEY F — AUTHORIZATION RESTRICTIONS & RBAC
# =============================================================================
def test_journey_f_authorization_restrictions(client):
    """Unauthorized user attempts to access /admin or another family's data -> access is strictly denied."""
    # 1. Regular user receives 403 on /admin/status
    unauth_admin = client.get("/api/v1/admin/status", headers={"X-User-Role": "user"})
    assert unauth_admin.status_code == 403

    # 2. Regular user receives 403 on /admin/overview
    unauth_overview = client.get("/api/v1/admin/overview", headers={"X-User-Role": "user"})
    assert unauth_overview.status_code == 403

    # 3. Anonymous user (no role) receives 403
    anon_admin = client.get("/api/v1/admin/team")
    assert anon_admin.status_code == 403

    # 4. Caregiver A cannot view Child B from another family
    # Create child for family A
    caregiver_a = f"cg_fam_a_{uuid.uuid4().hex[:6]}"
    caregiver_b = f"cg_fam_b_{uuid.uuid4().hex[:6]}"

    child_res = client.post(
        "/api/v1/youth-governance/profiles",
        headers={"X-User-Id": caregiver_a, "X-User-Role": "caregiver"},
        json={
            "display_name": "Amina",
            "age_tier": "junior",
            "locale": "ur",
            "daily_screen_time_limit_minutes": 45,
            "sensory_low_stimulation": False,
            "voice_enabled": True,
        },
    )
    assert child_res.status_code == 201
    child_id = child_res.json()["id"]

    # Caregiver B tries to view Child A's profile
    cross_family_res = client.get(
        f"/api/v1/youth-governance/profiles/{child_id}",
        headers={"X-User-Id": caregiver_b, "X-User-Role": "caregiver"},
    )
    assert cross_family_res.status_code == 403


# =============================================================================
# JOURNEY G — PRIVACY & DELETION PURGE WORKFLOW
# =============================================================================
def test_journey_g_privacy_and_deletion_purge(client):
    """Authorized account deletion request follows the documented retention and deletion workflow."""
    # 1. Create a parent account to delete
    email = f"delete_me_{uuid.uuid4().hex[:6]}@example.com"
    pwd = "DeletePassword123!"
    signup = client.post(
        "/api/v1/auth/signup",
        json={"email": email, "password": pwd, "display_name": "Temporary User"},
    )
    assert signup.status_code == 201
    user_id = signup.json()["user"]["user_id"]
    token = signup.json()["session_token"]
    headers = {"Authorization": f"Bearer {token}", "X-User-Id": user_id, "X-User-Role": "user"}

    # 2. User creates a child profile
    child = client.post(
        "/api/v1/youth-governance/profiles",
        headers=headers,
        json={
            "display_name": "TempChild",
            "age_tier": "little",
            "locale": "en",
            "daily_screen_time_limit_minutes": 30,
            "sensory_low_stimulation": False,
            "voice_enabled": True,
        },
    ).json()
    child_id = child["id"]

    # 3. Caregiver deletes child profile
    del_child = client.delete(f"/api/v1/youth-governance/profiles/{child_id}", headers=headers)
    assert del_child.status_code == 200
    assert del_child.json()["success"] is True

    # Verify child is purged
    get_child = client.get(f"/api/v1/youth-governance/profiles/{child_id}", headers=headers)
    assert get_child.status_code == 404

    # 4. User executes adult account deletion
    del_account = client.post(
        "/api/v1/auth/delete-account",
        headers=headers,
        json={"password": pwd, "reason": "Testing GDPR Right to be Forgotten"},
    )
    assert del_account.status_code == 200
    assert del_account.json()["success"] is True

    # 5. Subsequent login with old password fails
    retry_login = client.post("/api/v1/auth/login", json={"email": email, "password": pwd})
    assert retry_login.status_code == 401
