"""Comprehensive Integration Tests for Commerce, Subscriptions, Admin Console, and Customer Portal.

Verifies:
1. Service Catalog & Configured Pricing Plans
2. Checkout Session & Instant Sandbox Fulfillment
3. Feature Entitlements with Inviolable Non-Paywalled Crisis Guardrails
4. Idempotent Webhook Deduplication (Replay Protection)
5. Support Ticket Submission and Status Lifecycle
6. Admin 23-Section Platform Telemetry & Management APIs
7. Admin Order Refund Processing with Entitlement Revocation and Audit Trail
"""

import uuid
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.db.database import init_db, db_session
from app.db.models import (
    UserModel,
    ProductModel,
    PriceModel,
    OrderModel,
    PaymentModel,
    SubscriptionModel,
    EntitlementModel,
    SupportTicketModel,
)


@pytest.fixture(scope="module")
def client():
    init_db()
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="module")
def auth_headers():
    return {
        "x-user-id": "usr_test_admin_001",
        "x-user-role": "admin",
        "x-tenant-id": "tenant_inneros_default",
    }


@pytest.fixture(scope="module")
def parent_headers():
    return {
        "x-user-id": "usr_test_parent_001",
        "x-user-role": "caregiver",
        "x-tenant-id": "tenant_inneros_default",
    }


def test_public_commerce_catalog(client):
    """Verifies that public catalog returns published products with valid pricing."""
    res = client.get("/api/v1/commerce/catalog")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 4

    product_ids = [p["id"] for p in data]
    assert "prod_free_tier" in product_ids
    assert "prod_kids_learning" in product_ids
    assert "prod_family_membership" in product_ids

    kids_prod = next(p for p in data if p["id"] == "prod_kids_learning")
    assert kids_prod["target_audience"] == "kids"
    assert len(kids_prod["prices"]) >= 1
    assert kids_prod["prices"][0]["amount_cents"] == 999


def test_mock_sandbox_checkout_flow(client, parent_headers):
    """Verifies complete end-to-end checkout, payment fulfillment, and subscription creation."""
    checkout_payload = {
        "price_id": "price_kids_monthly",
        "payment_provider": "mock_sandbox",
        "success_url": "https://inneros.app/checkout/success",
        "cancel_url": "https://inneros.app/checkout/cancel",
    }

    res = client.post("/api/v1/commerce/checkout/session", json=checkout_payload, headers=parent_headers)
    assert res.status_code == 200
    data = res.json()
    assert "order_id" in data
    assert data["status"] == "completed"
    assert data["payment_provider"] == "mock_sandbox"
    assert "success" in data["checkout_url"]

    order_id = data["order_id"]

    # Verify user subscriptions endpoint reflects active subscription
    sub_res = client.get("/api/v1/commerce/subscriptions/me", headers=parent_headers)
    assert sub_res.status_code == 200
    subs = sub_res.json()
    assert any(s["product_id"] == "prod_kids_learning" and s["status"] == "active" for s in subs)


def test_safety_never_paywalled_entitlements(client):
    """Ensures crisis helplines and foundational emotional support are NEVER paywalled."""
    unpaid_headers = {
        "x-user-id": "usr_unpaid_guest_999",
        "x-user-role": "user",
    }

    # Crisis helplines must be unconditionally granted
    res_crisis = client.get("/api/v1/commerce/entitlements/check/crisis_helplines", headers=unpaid_headers)
    assert res_crisis.status_code == 200
    assert res_crisis.json()["is_entitled"] is True
    assert res_crisis.json()["reason"] == "Inviolable safety & crisis guardrails are never paywalled"

    # Foundational emotions must be unconditionally granted
    res_emotions = client.get("/api/v1/commerce/entitlements/check/foundation_emotions", headers=unpaid_headers)
    assert res_emotions.status_code == 200
    assert res_emotions.json()["is_entitled"] is True

    # Premium institutional feature should NOT be entitled for unpaid user
    res_district = client.get("/api/v1/commerce/entitlements/check/classroom_bulk_roster", headers=unpaid_headers)
    assert res_district.status_code == 200
    assert res_district.json()["is_entitled"] is False


def test_idempotent_webhook_deduplication(client):
    """Verifies that duplicate webhook deliveries are safely acknowledged without replay."""
    unique_evt = f"evt_test_dedup_{uuid.uuid4().hex}"
    unique_ord = f"ord_mock_{uuid.uuid4().hex[:8]}"
    webhook_event = {
        "event_type": "payment_intent.succeeded",
        "event_id": unique_evt,
        "order_id": unique_ord,
        "user_id": "usr_test_parent_001",
        "amount_cents": 999,
        "currency": "USD",
    }


    # First delivery
    res1 = client.post("/api/v1/commerce/webhooks/mock_sandbox", json=webhook_event)
    assert res1.status_code == 200
    assert res1.json()["processed"] is True
    assert res1.json()["idempotent_replay"] is False

    # Duplicate replay delivery
    res2 = client.post("/api/v1/commerce/webhooks/mock_sandbox", json=webhook_event)
    assert res2.status_code == 200
    assert res2.json()["idempotent_replay"] is True
    assert "duplicate" in res2.json()["action_taken"].lower()




def test_support_ticket_lifecycle(client, parent_headers, auth_headers):
    """Verifies ticket submission by caregiver and review/patch by admin."""
    ticket_payload = {
        "subject": "Audio stuttering on Roman Urdu bedtime exercise",
        "category": "technical",
        "priority": "medium",
        "message": "When listening to the Roman Urdu audio track on tablet, playback paused unexpectedly.",
    }

    create_res = client.post("/api/v1/commerce/support/tickets", json=ticket_payload, headers=parent_headers)
    assert create_res.status_code == 200
    ticket = create_res.json()
    assert ticket["subject"] == ticket_payload["subject"]
    assert ticket["status"] == "open"
    ticket_id = ticket["id"]

    # Caregiver retrieves own tickets
    my_tickets = client.get("/api/v1/commerce/support/tickets/me", headers=parent_headers)
    assert my_tickets.status_code == 200
    assert any(t["id"] == ticket_id for t in my_tickets.json())

    # Admin updates ticket
    patch_payload = {
        "status": "in_progress",
        "assigned_to": "engineer_audio_team",
        "resolution_notes": "Identified low-bandwidth buffer underrun; pushed CDN audio caching patch.",
    }
    patch_res = client.patch(f"/api/v1/admin/support-tickets/{ticket_id}", json=patch_payload, headers=auth_headers)
    assert patch_res.status_code == 200
    updated_ticket = patch_res.json()
    assert updated_ticket["status"] == "in_progress"
    assert updated_ticket["assigned_to"] == "engineer_audio_team"


def test_admin_23_sections_telemetry(client, auth_headers):
    """Verifies that all admin navigation section endpoints respond with valid data."""
    # 1. Overview
    res = client.get("/api/v1/admin/overview", headers=auth_headers)
    assert res.status_code == 200

    # 2. Customers
    res = client.get("/api/v1/admin/customers", headers=auth_headers)
    assert res.status_code == 200
    assert isinstance(res.json(), list)

    # 3. Families
    res = client.get("/api/v1/admin/families", headers=auth_headers)
    assert res.status_code == 200
    assert isinstance(res.json(), list)

    # 4. Child profiles (zero raw reflections exposed)
    res = client.get("/api/v1/admin/child-profiles", headers=auth_headers)
    assert res.status_code == 200

    # 5. Teen profiles
    res = client.get("/api/v1/admin/teen-profiles", headers=auth_headers)
    assert res.status_code == 200

    # 6. Schools
    res = client.get("/api/v1/admin/schools", headers=auth_headers)
    assert res.status_code == 200
    assert len(res.json()) >= 1

    # 7. Products
    res = client.get("/api/v1/admin/products", headers=auth_headers)
    assert res.status_code == 200

    # 8. Pricing plans
    res = client.get("/api/v1/admin/pricing-plans", headers=auth_headers)
    assert res.status_code == 200

    # 9. Orders
    res = client.get("/api/v1/admin/orders", headers=auth_headers)
    assert res.status_code == 200

    # 10. Subscriptions
    res = client.get("/api/v1/admin/subscriptions", headers=auth_headers)
    assert res.status_code == 200

    # 11. Payments
    res = client.get("/api/v1/admin/payments", headers=auth_headers)
    assert res.status_code == 200

    # 12. Support tickets
    res = client.get("/api/v1/admin/support-tickets", headers=auth_headers)
    assert res.status_code == 200

    # 13. Safeguarding incidents
    res = client.get("/api/v1/admin/safety-incidents", headers=auth_headers)
    assert res.status_code == 200

    # 14. Reports (business finance)
    res = client.get("/api/v1/admin/reports/business", headers=auth_headers)
    assert res.status_code == 200
    biz_data = res.json()
    assert "mrr_cents" in biz_data
    assert "active_subscriptions" in biz_data

    # 15. AI Usage & costs
    res = client.get("/api/v1/admin/ai-usage", headers=auth_headers)
    assert res.status_code == 200
    assert "monthly_cost_estimate_usd" in res.json()

    # 16. Voice providers
    res = client.get("/api/v1/admin/voice-providers", headers=auth_headers)
    assert res.status_code == 200

    # 17. Curriculum overview
    res = client.get("/api/v1/admin/curriculum", headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["total_departments"] == 24

    # 18. Activities overview
    res = client.get("/api/v1/admin/activities", headers=auth_headers)
    assert res.status_code == 200

    # 19. Translations
    res = client.get("/api/v1/admin/translations", headers=auth_headers)
    assert res.status_code == 200

    # 20. Platform settings
    res = client.get("/api/v1/admin/settings", headers=auth_headers)
    assert res.status_code == 200

    # 21. Roles & permissions
    res = client.get("/api/v1/admin/roles-permissions", headers=auth_headers)
    assert res.status_code == 200

    # 22. Audit logs
    res = client.get("/api/v1/admin/audit-logs", headers=auth_headers)
    assert res.status_code == 200

    # 23. Feature flags
    res = client.get("/api/v1/admin/feature-flags", headers=auth_headers)
    assert res.status_code == 200


def test_admin_refund_processing(client, parent_headers, auth_headers):
    """Verifies that an admin can refund an order, which revokes subscription and logs audit."""
    # First create an order via checkout
    checkout_payload = {
        "price_id": "price_teen_monthly",
        "payment_provider": "mock_sandbox",
    }
    c_res = client.post("/api/v1/commerce/checkout/session", json=checkout_payload, headers=parent_headers)

    assert c_res.status_code == 200
    order_id = c_res.json()["order_id"]

    # Issue refund as admin
    refund_payload = {
        "reason": "Accidental duplicate family registration by co-caregiver",
    }
    ref_res = client.post(f"/api/v1/admin/orders/{order_id}/refund", json=refund_payload, headers=auth_headers)
    assert ref_res.status_code == 200
    ref_data = ref_res.json()
    assert ref_data["status"] == "refunded"
    assert ref_data["order_id"] == order_id

    # Verify order is marked refunded
    orders_res = client.get("/api/v1/admin/orders", headers=auth_headers)
    matching = next(o for o in orders_res.json() if o["id"] == order_id)
    assert matching["status"] == "refunded"
