"""Tests for InnerOS Companion Modes, Tone Modulation, Multilingual Dialogue,
Session Persistence, Streaming Responses, and Provider Benchmarking.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.gateways.ai.base import ConversationMode


client = TestClient(app)


def test_list_modes():
    res = client.get("/api/v1/companion/modes")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 5
    mode_ids = [m["id"] for m in data]
    assert "just_listen" in mode_ids
    assert "help_me_understand" in mode_ids
    assert "help_me_solve" in mode_ids
    assert "teach_me" in mode_ids
    assert "help_me_settle" in mode_ids


def test_mode_just_listen():
    res = client.post(
        "/api/v1/companion/chat",
        json={
            "session_id": "test_session_listen",
            "utterance": "I feel so exhausted and unheard today.",
            "mode": "just_listen",
            "language": "en",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["mode_used"] == "just_listen"
    assert data["advice_omitted"] is True
    assert "advice" in data["reply"].lower() or "holding" in data["reply"].lower()
    assert "not going to offer advice" in data["reply"].lower() or "holding this space" in data["reply"].lower() or "no advice" in data["reply"].lower()


def test_mode_help_me_understand():
    res = client.post(
        "/api/v1/companion/chat",
        json={
            "session_id": "test_session_understand",
            "utterance": "My manager asked for a status update and I felt immediately furious and guarded.",
            "mode": "help_me_understand",
            "language": "en",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["mode_used"] == "help_me_understand"
    assert "?" in data["reply"]  # Contains thoughtful clarifying question


def test_mode_help_me_solve():
    res = client.post(
        "/api/v1/companion/chat",
        json={
            "session_id": "test_session_solve",
            "utterance": "I have 4 conflicting deliverables due by tomorrow morning and I am paralyzed.",
            "mode": "help_me_solve",
            "language": "en",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["mode_used"] == "help_me_solve"
    assert "step" in data["reply"].lower() or "micro-step" in data["reply"].lower()


def test_mode_teach_me():
    res = client.post(
        "/api/v1/companion/chat",
        json={
            "session_id": "test_session_teach",
            "utterance": "Why does my mind keep creating catastrophic worst-case scenarios?",
            "mode": "teach_me",
            "language": "en",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["mode_used"] == "teach_me"
    assert "acceptance and commitment" in data["reply"].lower() or "act" in data["reply"].lower() or "defusion" in data["reply"].lower() or "polyvagal" in data["reply"].lower()


def test_mode_help_me_settle():
    res = client.post(
        "/api/v1/companion/chat",
        json={
            "session_id": "test_session_settle",
            "utterance": "My chest is tight, heart is racing, and I can't catch my breath.",
            "mode": "help_me_settle",
            "language": "en",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["mode_used"] == "help_me_settle"
    assert "inhale" in data["reply"].lower() or "breath" in data["reply"].lower() or "shoulders" in data["reply"].lower()


def test_user_advice_rejection_overrides_solve_mode():
    """If user says they don't want advice, mode must automatically switch to just_listen."""
    res = client.post(
        "/api/v1/companion/chat",
        json={
            "session_id": "test_session_rejection",
            "utterance": "I don't want advice, please just listen to me without fixing anything.",
            "mode": "help_me_solve",  # User or UI set solve, but utterance explicitly rejects advice
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["mode_used"] == "just_listen"
    assert data["advice_omitted"] is True


def test_multilingual_spanish_companion():
    res = client.post(
        "/api/v1/companion/chat",
        json={
            "session_id": "test_session_es",
            "utterance": "Hoy fue un día agotador en el trabajo.",
            "mode": "just_listen",
            "language": "es",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert "espacio" in data["reply"].lower() or "consejo" in data["reply"].lower() or "estoy aquí" in data["reply"].lower()


def test_multilingual_german_companion():
    res = client.post(
        "/api/v1/companion/chat",
        json={
            "session_id": "test_session_de",
            "utterance": "Ich fühle mich heute sehr gestresst.",
            "mode": "help_me_settle",
            "language": "de",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert "atme" in data["reply"].lower() or "schultern" in data["reply"].lower() or "körper" in data["reply"].lower()


def test_session_history_and_clearing():
    session_id = "test_session_persistence_001"
    # Send a turn
    client.post(
        "/api/v1/companion/chat",
        json={
            "session_id": session_id,
            "utterance": "Remember this turn for my session history.",
            "mode": "just_listen",
        },
    )

    # Retrieve history
    history_res = client.get(f"/api/v1/companion/sessions/{session_id}")
    assert history_res.status_code == 200
    history_data = history_res.json()
    assert history_data["session_id"] == session_id
    assert len(history_data["messages"]) >= 2  # user + assistant

    # Clear history
    clear_res = client.delete(f"/api/v1/companion/sessions/{session_id}")
    assert clear_res.status_code == 200
    assert clear_res.json()["status"] == "cleared"

    # Verify history is now empty
    history_res2 = client.get(f"/api/v1/companion/sessions/{session_id}")
    assert len(history_res2.json()["messages"]) == 0


def test_streaming_chat_endpoint():
    res = client.post(
        "/api/v1/companion/chat/stream",
        json={
            "session_id": "test_session_stream",
            "utterance": "Please guide me in a streaming fashion.",
            "mode": "just_listen",
        },
    )
    assert res.status_code == 200
    assert "text/event-stream" in res.headers["content-type"]
    body = res.text
    assert "data:" in body
    assert "[DONE]" in body


def test_model_benchmarking_endpoint():
    res = client.post(
        "/api/v1/companion/benchmark",
        json={
            "prompt": "I am feeling overwhelmed by conflicting team expectations.",
            "mode": "help_me_settle",
            "language": "en",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert "results" in data
    assert len(data["results"]) >= 2
    providers_tested = [r["provider_name"] for r in data["results"]]
    assert "synthetic" in providers_tested
    assert "mock-fast" in providers_tested
    for r in data["results"]:
        assert r["latency_ms"] >= 0
        assert r["is_safe"] is True
