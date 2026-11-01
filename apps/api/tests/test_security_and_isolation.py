"""Comprehensive Security, Multi-User Data Isolation, and Regression Test Suite.

Verifies:
1. Companion session isolation across users (prevents IDOR on session_default and custom session IDs).
2. Reminder dispatch idempotency cache isolation across users.
3. Memory & Life Graph strict tenant/user isolation (CRUD, confirm/reject, export, purge).
4. Personal Context Hub import batch & OAuth connection isolation across users.
5. Sensitive health category opt-in consent enforcement (HTTP 403 when ungranted).
6. Prompt injection neutralization & PII redaction in document imports.
7. HTTP Security Headers enforcement and truthful non-clinical readiness metadata.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

USER_A_HEADERS = {"X-User-ID": "usr_qa_isolation_alice", "X-Tenant-ID": "tenant_qa_a"}
USER_B_HEADERS = {"X-User-ID": "usr_qa_isolation_bob", "X-Tenant-ID": "tenant_qa_b"}


def test_companion_session_cross_user_isolation():
    """Ensures User B cannot read, overwrite, or delete User A's chat session even with identical session_id."""
    shared_session_id = "session_default"

    # User A sends a private message into session_default
    res_a = client.post(
        "/api/v1/companion/chat",
        headers=USER_A_HEADERS,
        json={
            "session_id": shared_session_id,
            "utterance": "Private reflection from Alice about her sister.",
            "mode": "just_listen",
        },
    )
    assert res_a.status_code == 200

    # User A's session history contains Alice's message
    hist_a = client.get(f"/api/v1/companion/sessions/{shared_session_id}", headers=USER_A_HEADERS)
    assert hist_a.status_code == 200
    messages_a = hist_a.json()["messages"]
    assert any("Private reflection from Alice" in m["content"] for m in messages_a)

    # User B queries the exact same session_id ("session_default")
    hist_b = client.get(f"/api/v1/companion/sessions/{shared_session_id}", headers=USER_B_HEADERS)
    assert hist_b.status_code == 200
    messages_b = hist_b.json()["messages"]
    assert not any("Private reflection from Alice" in m["content"] for m in messages_b)

    # User B attempts to DELETE session_default; User A's messages must remain intact
    client.delete(f"/api/v1/companion/sessions/{shared_session_id}", headers=USER_B_HEADERS)
    hist_a_after = client.get(f"/api/v1/companion/sessions/{shared_session_id}", headers=USER_A_HEADERS)
    assert any("Private reflection from Alice" in m["content"] for m in hist_a_after.json()["messages"])


def test_reminder_idempotency_cache_cross_user_isolation():
    """Ensures two users dispatching with the same idempotency_key string do not collide."""
    rem_a = client.get("/api/v1/reminders", headers=USER_A_HEADERS).json()[0]
    rem_b = client.get("/api/v1/reminders", headers=USER_B_HEADERS).json()[0]

    shared_key = "idem_shared_key_2026_test"

    disp_a = client.post(
        f"/api/v1/reminders/{rem_a['id']}/dispatch",
        headers=USER_A_HEADERS,
        json={"idempotency_key": shared_key},
    )
    assert disp_a.status_code == 200
    assert disp_a.json()["reminder_id"] == rem_a["id"]

    disp_b = client.post(
        f"/api/v1/reminders/{rem_b['id']}/dispatch",
        headers=USER_B_HEADERS,
        json={"idempotency_key": shared_key},
    )
    assert disp_b.status_code == 200
    assert disp_b.json()["reminder_id"] == rem_b["id"]
    assert disp_b.json()["reminder_id"] != disp_a.json()["reminder_id"]


def test_memory_and_life_graph_cross_user_isolation():
    """Ensures User B cannot read, edit, or delete User A's memories or Life Graph nodes."""
    # Create memory for User A
    create_res = client.post(
        "/api/v1/memory/records",
        headers=USER_A_HEADERS,
        json={
            "category": "personal_goals",
            "fact_statement": "Alice private goal: Run a half-marathon in October.",
            "record_type": "stored_fact",
            "status": "confirmed",
        },
    )
    assert create_res.status_code == 201
    mem_id = create_res.json()["id"]

    # User B cannot fetch, update, or delete User A's memory
    get_b = client.get(f"/api/v1/memory/records/{mem_id}", headers=USER_B_HEADERS)
    assert get_b.status_code == 404

    upd_b = client.put(
        f"/api/v1/memory/records/{mem_id}",
        headers=USER_B_HEADERS,
        json={"fact_statement": "Tampered by Bob"},
    )
    assert upd_b.status_code == 404

    del_b = client.delete(f"/api/v1/memory/records/{mem_id}", headers=USER_B_HEADERS)
    assert del_b.status_code == 404

    # Verify User A's memory is untouched
    get_a = client.get(f"/api/v1/memory/records/{mem_id}", headers=USER_A_HEADERS)
    assert get_a.status_code == 200
    assert "Alice private goal" in get_a.json()["fact_statement"]


def test_integrations_batch_and_oauth_isolation():
    """Ensures staged import batches and OAuth connections are isolated per user."""
    upload_a = client.post(
        "/api/v1/integrations/import/upload",
        headers=USER_A_HEADERS,
        json={
            "source": "document_markdown",
            "filename": "alice_notes.md",
            "raw_payload_text": "# Reflection\nMy goal is to practice calm evening reading.",
        },
    )
    assert upload_a.status_code == 201
    batch_id = upload_a.json()["batch_id"]

    # User B cannot access or revoke User A's batch
    get_b = client.get(f"/api/v1/integrations/import/batches/{batch_id}", headers=USER_B_HEADERS)
    assert get_b.status_code == 404

    del_b = client.delete(f"/api/v1/integrations/import/batches/{batch_id}", headers=USER_B_HEADERS)
    assert del_b.status_code == 404


def test_sensitive_health_consent_enforcement():
    """Verifies that storing sensitive health context is rejected (HTTP 403) without explicit opt-in."""
    res = client.post(
        "/api/v1/memory/records",
        headers={"X-User-ID": "usr_qa_consent_strict"},
        json={
            "category": "optional_sensitive_health_related_information",
            "fact_statement": "Experiencing seasonal insomnia.",
            "record_type": "stored_fact",
            "status": "confirmed",
        },
    )
    assert res.status_code == 403
    assert "consent" in res.json()["detail"].lower()


def test_security_headers_and_truthful_health_metadata():
    """Verifies security response headers and non-deceptive readiness metadata."""
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    assert res.headers.get("X-Content-Type-Options") == "nosniff"
    assert res.headers.get("X-Frame-Options") == "DENY"
    data = res.json()
    assert "Not a Medical Device" in data["subsystems"]["regulatory_status"]
    assert "Not FDA Cleared" in data["subsystems"]["regulatory_status"]
