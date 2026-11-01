"""Health probe test suite."""

def test_liveness_probe(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "alive"
    assert "version" in data


def test_readiness_probe(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "subsystems" in data
    assert data["subsystems"]["safety_guardrails"] == "active_and_enforced"
    assert "memory_encryption" in data["subsystems"]
