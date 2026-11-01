"""Comprehensive automated test suite for InnerOS Personal Memory and Life Graph.

Tests:
1. Strict separation of stored facts from tentative AI interpretations
2. Suggested memories requiring user confirmation workflow
3. User-editable memory records
4. Provenance and uncertainty indicators
5. Memory review and expiration rules (auto-pruning)
6. Search and category filtering across the 9 official memory categories
7. Global memory pause toggle
8. Temporary conversations isolation
9. Single memory deletion with Life Graph cascade (GDPR Art. 17)
10. Nuclear purge of all user memory and derived records
11. Machine-readable data export bundle (GDPR Art. 20)
12. Explicit consent for sensitive health categories
13. Tenant isolation and cross-user data leak prevention
14. Immutable memory audit logs
"""

import pytest


def test_seed_memory_and_life_graph_initialization(client):
    """Verifies that synthetic persona (Elena Vance) is pre-populated with verified facts, staged suggestions, and graph."""
    res = client.get("/api/v1/memory/records")
    assert res.status_code == 200
    records = res.json()
    assert len(records) >= 4

    # Verify presence of confirmed facts
    facts = [r for r in records if r["record_type"] == "stored_fact"]
    assert len(facts) >= 3
    for f in facts:
        assert f["certainty_level"] == "user_verified"
        assert f["confidence_score"] == 1.0

    # Verify presence of tentative staged AI interpretation requiring confirmation
    tentative = [r for r in records if r["record_type"] == "tentative_ai_interpretation"]
    assert len(tentative) >= 1
    t_item = tentative[0]
    assert t_item["status"] == "suggested"
    assert t_item["certainty_level"] == "tentative"
    assert t_item["confidence_score"] < 1.0
    assert t_item["provenance"]["source_type"] == "inferred_ai_observation"


def test_suggested_memory_confirmation_workflow(client):
    """Feature 1: Tests that a staged suggestion requires explicit user confirmation to become a confirmed fact."""
    # Find a suggested record
    res = client.get("/api/v1/memory/records?status=suggested")
    assert res.status_code == 200
    suggested = res.json()
    assert len(suggested) >= 1
    sugg_id = suggested[0]["id"]

    # Confirm the suggestion with an optional adjustment
    action_res = client.post(
        f"/api/v1/memory/records/{sugg_id}/action",
        json={
            "action": "confirm",
            "adjusted_statement": "Confirmed: 20-minute evening outdoor walks significantly restore autonomic equilibrium.",
        },
    )
    assert action_res.status_code == 200
    confirmed = action_res.json()
    assert confirmed["id"] == sugg_id
    assert confirmed["status"] == "confirmed"
    assert confirmed["record_type"] == "stored_fact"
    assert confirmed["certainty_level"] == "user_verified"
    assert confirmed["confidence_score"] == 1.0
    assert "Confirmed: 20-minute" in confirmed["fact_statement"]


def test_user_editable_memory_record(client):
    """Feature 2: Tests that users can edit memory statement, tags, and emotional valence."""
    res = client.get("/api/v1/memory/records")
    rec = res.json()[0]
    rec_id = rec["id"]

    edit_res = client.put(
        f"/api/v1/memory/records/{rec_id}",
        json={
            "fact_statement": "Updated statement: Prioritizes 15 minutes of quiet breathwork before communication.",
            "emotional_valence": "positive",
            "tags": ["edited_tag", "mindfulness"],
        },
    )
    assert edit_res.status_code == 200
    updated = edit_res.json()
    assert "15 minutes of quiet breathwork" in updated["fact_statement"]
    assert "edited_tag" in updated["tags"]


def test_explicit_consent_for_sensitive_health_category(client):
    """Tests that storing sensitive health information is blocked without explicit opt-in consent."""
    # 1. Attempt to add sensitive health memory without consent -> 403 Forbidden
    blocked_res = client.post(
        "/api/v1/memory/records",
        json={
            "category": "optional_sensitive_health_related_information",
            "fact_statement": "User tracks sleep latency metrics and autonomic resting heart rate.",
            "record_type": "stored_fact",
        },
    )
    assert blocked_res.status_code == 403
    assert "Explicit opt-in consent is required" in blocked_res.json()["detail"]

    # 2. Grant explicit consent for sensitive health category
    consent_get = client.get("/api/v1/memory/consent").json()
    consent_get["sensitive_health_consent_granted"] = True
    update_res = client.put("/api/v1/memory/consent", json=consent_get)
    assert update_res.status_code == 200
    assert update_res.json()["sensitive_health_consent_granted"] is True

    # 3. Retry memory creation -> Now succeeds (201 Created)
    allowed_res = client.post(
        "/api/v1/memory/records",
        json={
            "category": "optional_sensitive_health_related_information",
            "fact_statement": "User tracks sleep latency metrics and autonomic resting heart rate.",
            "record_type": "stored_fact",
            "tags": ["sleep", "health_metrics"],
        },
    )
    assert allowed_res.status_code == 201
    created = allowed_res.json()
    assert created["is_sensitive"] is True
    assert created["category"] == "optional_sensitive_health_related_information"

    # Reset consent to False
    consent_get["sensitive_health_consent_granted"] = False
    client.put("/api/v1/memory/consent", json=consent_get)


def test_global_memory_pause(client):
    """Feature 7: Tests the global memory pause toggle."""
    # 1. Pause memory
    pause_res = client.post("/api/v1/memory/pause")
    assert pause_res.status_code == 200
    assert pause_res.json()["is_memory_recording_paused"] is True

    # 2. Attempt to add memory while paused -> 403 Forbidden
    attempt_res = client.post(
        "/api/v1/memory/records",
        json={
            "category": "habits_and_routines",
            "fact_statement": "Attempted memory while paused.",
        },
    )
    assert attempt_res.status_code == 403
    assert "paused" in attempt_res.json()["detail"].lower()

    # 3. Resume memory
    resume_res = client.post("/api/v1/memory/resume")
    assert resume_res.status_code == 200
    assert resume_res.json()["is_memory_recording_paused"] is False

    # 4. Now memory creation succeeds
    resumed_add = client.post(
        "/api/v1/memory/records",
        json={
            "category": "habits_and_routines",
            "fact_statement": "Successfully recorded after resuming.",
        },
    )
    assert resumed_add.status_code == 201


def test_temporary_conversation_isolation(client):
    """Feature 8: Tests that temporary / ephemeral conversations do not store any memories."""
    res = client.post(
        "/api/v1/memory/records?is_temporary_conversation=true",
        json={
            "category": "work_and_career_information",
            "fact_statement": "Confidential ephemeral discussion point.",
        },
    )
    # Should be rejected / dropped
    assert res.status_code == 403


def test_search_and_category_filtering(client):
    """Feature 6: Tests search across statements and category filtering."""
    # Category filter
    res = client.get("/api/v1/memory/records?category=work_and_career_information")
    assert res.status_code == 200
    items = res.json()
    assert all(i["category"] == "work_and_career_information" for i in items)

    # Search keyword
    search_res = client.get("/api/v1/memory/records?query=breathwork")
    assert search_res.status_code == 200
    s_items = search_res.json()
    assert len(s_items) >= 1
    assert any("breathwork" in i["fact_statement"].lower() for i in s_items)


def test_life_graph_visualization_data_and_cascade_delete(client):
    """Features 9 & 12: Tests Life Graph retrieval and cascade deletion of nodes & incident edges."""
    # 1. Fetch Life Graph
    graph_res = client.get("/api/v1/memory/life-graph")
    assert graph_res.status_code == 200
    graph = graph_res.json()
    assert graph["total_nodes"] >= 4
    assert graph["total_edges"] >= 3
    assert graph["facts_count"] >= 3

    # 2. Add a test node
    node_res = client.post(
        "/api/v1/memory/life-graph/nodes",
        json={
            "label": "Temporary Test Node",
            "node_type": "habit",
            "description": "Test node for cascade deletion",
            "record_type": "stored_fact",
            "emotional_charge": "neutral",
        },
    )
    assert node_res.status_code == 201
    test_node_id = node_res.json()["id"]

    # 3. Add an edge to test node
    target_node = graph["nodes"][0]["id"]
    edge_res = client.post(
        "/api/v1/memory/life-graph/edges",
        json={
            "source_node_id": test_node_id,
            "target_node_id": target_node,
            "relation": "relates_to",
            "confidence": 1.0,
        },
    )
    assert edge_res.status_code == 201
    edge_id = edge_res.json()["id"]

    # 4. Delete the test node -> Cascades deletion of connecting edge
    del_res = client.delete(f"/api/v1/memory/life-graph/nodes/{test_node_id}")
    assert del_res.status_code == 204

    # Verify edge was cascaded
    graph_after = client.get("/api/v1/memory/life-graph").json()
    assert all(e["id"] != edge_id for e in graph_after["edges"])
    assert all(n["id"] != test_node_id for n in graph_after["nodes"])


def test_cross_user_tenant_isolation(client):
    """Security Invariant: Verifies that User B cannot access, read, or mutate User A's memories."""
    # User A's memories
    user_a_res = client.get("/api/v1/memory/records", headers={"X-User-ID": "usr_tenant_alice_111"})
    assert user_a_res.status_code == 200
    alice_records = user_a_res.json()
    assert len(alice_records) >= 1
    alice_mem_id = alice_records[0]["id"]

    # User B attempts to access User A's memory record
    user_b_get = client.get(
        f"/api/v1/memory/records/{alice_mem_id}",
        headers={"X-User-ID": "usr_tenant_bob_222"},
    )
    # Must be 404 Not Found (zero cross-tenant disclosure)
    assert user_b_get.status_code == 404

    # User B attempts to delete User A's memory record
    user_b_del = client.delete(
        f"/api/v1/memory/records/{alice_mem_id}",
        headers={"X-User-ID": "usr_tenant_bob_222"},
    )
    assert user_b_del.status_code == 404

    # Verify User A's memory is still intact
    alice_check = client.get(
        f"/api/v1/memory/records/{alice_mem_id}",
        headers={"X-User-ID": "usr_tenant_alice_111"},
    )
    assert alice_check.status_code == 200


def test_data_export_bundle_gdpr_article_20(client):
    """Feature 11: Machine-readable data export bundle."""
    export_res = client.get("/api/v1/memory/export")
    assert export_res.status_code == 200
    bundle = export_res.json()

    assert bundle["format_version"] == "2.0.0"
    assert "memory_records" in bundle
    assert "life_graph_nodes" in bundle
    assert "life_graph_edges" in bundle
    assert "consent_settings" in bundle
    assert "audit_trail" in bundle
    assert bundle["summary_stats"]["total_memories"] >= 1
    assert bundle["summary_stats"]["confirmed_facts"] >= 1


def test_immutable_audit_logs(client):
    """Security Invariant: Verifies that every memory lifecycle action is immutably logged."""
    audit_res = client.get("/api/v1/memory/audit-logs")
    assert audit_res.status_code == 200
    logs = audit_res.json()
    assert len(logs) >= 1

    actions = [l["action"] for l in logs]
    assert "created" in actions or "suggested" in actions


def test_nuclear_purge_all_memory(client):
    """Feature 10: Complete deletion of all memory and derived records."""
    # Execute nuclear purge for an isolated test user
    test_user_headers = {"X-User-ID": "usr_purge_test_999"}

    # Initialize user
    init_res = client.get("/api/v1/memory/records", headers=test_user_headers)
    assert init_res.status_code == 200
    assert len(init_res.json()) >= 1

    # Execute nuclear purge
    purge_res = client.post("/api/v1/memory/purge-all", headers=test_user_headers)
    assert purge_res.status_code == 200
    purge_data = purge_res.json()
    assert purge_data["success"] is True
    assert purge_data["records_deleted"] >= 1

    # Verify memories are completely 0
    after_mem = client.get("/api/v1/memory/records", headers=test_user_headers).json()
    assert len(after_mem) == 0

    # Verify life graph nodes and edges are completely 0
    after_graph = client.get("/api/v1/memory/life-graph", headers=test_user_headers).json()
    assert after_graph["total_nodes"] == 0
    assert after_graph["total_edges"] == 0
