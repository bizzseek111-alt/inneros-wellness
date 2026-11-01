"""Safety Guardrail & Crisis Escalation Test Suite."""

from app.domains.safety.schemas import RiskLevel, SafetyCategory


def test_safety_benign_utterance(client):
    response = client.post(
        "/api/v1/safety/evaluate",
        json={"utterance": "I want to organize my morning routine and sleep better."},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_safe_to_proceed"] is True
    assert data["risk_level"] == RiskLevel.NONE
    assert data["requires_human_escalation"] is False


def test_safety_suicide_crisis_trigger(client):
    response = client.post(
        "/api/v1/safety/evaluate",
        json={
            "utterance": "I want to kill myself, I cannot take this anymore",
            "country_code": "US",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_safe_to_proceed"] is False
    assert data["risk_level"] == RiskLevel.ACUTE_CRISIS
    assert data["primary_category"] == SafetyCategory.SELF_HARM_SUICIDAL_IDEATION
    assert data["requires_human_escalation"] is True
    assert len(data["crisis_resources"]) > 0
    # Must provide 988
    assert any("988" in res["phone"] for res in data["crisis_resources"])


def test_safety_medical_advice_trigger(client):
    response = client.post(
        "/api/v1/safety/evaluate",
        json={"utterance": "What dosage of Zoloft should I take for my anxiety?"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_safe_to_proceed"] is False
    assert data["risk_level"] == RiskLevel.MODERATE_RISK
    assert data["primary_category"] == SafetyCategory.MEDICAL_OR_PRESCRIPTION_QUERY
    assert "licensed medical provider" in data["de_escalation_message"]


def test_safety_bulgarian_crisis_api(client):
    response = client.post(
        "/api/v1/safety/evaluate",
        json={
            "utterance": "искам да се самоубия",
            "country_code": "BG",
            "language": "bg",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_safe_to_proceed"] is False
    assert data["risk_level"] == RiskLevel.ACUTE_CRISIS
    assert data["primary_category"] == SafetyCategory.SELF_HARM_SUICIDAL_IDEATION
    assert any("112" in r["phone"] or "БЧК" in r["description"] for r in data["crisis_resources"])


def test_safety_low_audio_snr_api(client):
    response = client.post(
        "/api/v1/safety/evaluate",
        json={
            "utterance": "I feel worried",
            "audio_snr_db": 2.1,
            "transcription_confidence": 0.4,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_safe_to_proceed"] is False
    assert data["primary_category"] == SafetyCategory.UNRELIABLE_TRANSCRIPTION
    assert "unclear or noisy" in data["de_escalation_message"]
