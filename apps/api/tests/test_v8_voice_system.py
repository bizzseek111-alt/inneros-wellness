"""Automated Test Suite for Weebly V8 Voice System & Provider Abstraction (Module 14).

Verifies:
1. Character voice profiles for Kai, Mia, Lumi, Zayn
2. Provider abstraction (OpenAI Realtime, ElevenLabs, Azure AI Speech, Web Speech)
3. Pakistani Punjabi native speaker validation requirement
4. Speech synthesis latency SLA and multi-tier fallback
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_voice_profiles_retrieval(client):
    """Verifies that all 4 original characters have approved voice configurations."""
    res = client.get("/api/v1/voice-system/profiles")
    assert res.status_code == 200
    profiles = res.json()
    assert len(profiles) == 4

    char_ids = {p["character_id"] for p in profiles}
    assert char_ids == {"kai", "mia", "lumi", "zayn"}

    kai = next(p for p in profiles if p["character_id"] == "kai")
    assert kai["character_name"] == "Kai"
    assert kai["primary_provider"] == "openai_realtime"
    assert kai["voice_id"] == "alloy"
    assert "en" in kai["languages_supported"]
    assert "ur" in kai["languages_supported"]
    assert "pa" in kai["languages_supported"]
    assert kai["native_speaker_validated"] is True

    mia = next(p for p in profiles if p["character_id"] == "mia")
    assert mia["primary_provider"] == "elevenlabs"

    lumi = next(p for p in profiles if p["character_id"] == "lumi")
    assert lumi["primary_provider"] == "azure_speech"
    assert "ur-PK" in lumi["voice_id"]


def test_voice_provider_evaluations(client):
    """Verifies documented evaluations for OpenAI, ElevenLabs, Azure Speech, and WebSpeech."""
    res = client.get("/api/v1/voice-system/evaluations")
    assert res.status_code == 200
    evals = res.json()
    assert len(evals) == 4

    providers = {e["provider"] for e in evals}
    assert providers == {"openai_realtime", "elevenlabs", "azure_speech", "webspeech"}

    for ev in evals:
        assert ev["naturalness_score_mos"] >= 4.0
        assert ev["mean_latency_ms"] < 400
        assert len(ev["punjabi_native_review"]) > 10


def test_voice_synthesis_fallback_and_webspeech(client):
    """Verifies voice synthesis request routing and client-side WebSpeech fallback."""
    req = {
        "character_id": "kai",
        "text": "Hello! I am Kai. Let's do some fun math together!",
        "language": "en",
        "preferred_provider": "webspeech",
    }
    res = client.post("/api/v1/voice-system/synthesize", json=req)
    assert res.status_code == 200
    data = res.json()
    assert data["character_id"] == "kai"
    assert data["provider_used"] == "webspeech"
    assert data["is_client_webspeech_recommended"] is True
    assert data["latency_ms"] < 200
