"""Companion dialogue and safety circuit-breaker test suite."""

def test_companion_normal_chat(client):
    response = client.post(
        "/api/v1/companion/chat",
        json={
            "utterance": "I've been feeling stressed by all my design deadlines lately.",
            "tone": {"mode": "grounding", "warmth_level": 0.8, "brevity_level": 0.5},
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert len(data["reply"]) > 10
    assert data["safety_evaluation"]["is_safe_to_proceed"] is True
    assert data["recalled_memory_count"] > 0


def test_companion_crisis_circuit_breaker(client):
    # Tests that when acute crisis is detected, LLM is bypassed and crisis resources returned
    response = client.post(
        "/api/v1/companion/chat",
        json={
            "utterance": "I'm thinking of ending my life tonight.",
            "country_code": "US",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["safety_evaluation"]["is_safe_to_proceed"] is False
    assert data["provider_used"] == "safety_circuit_breaker"
    assert data["model_used"] == "deterministic-heuristics"
    assert "crisis resources" in data["reply"].lower() or "not alone" in data["reply"].lower()
