"""Unit test suite for Knowledge, Voice, Reminders, Integrations, and Admin domains."""

def test_knowledge_domain(client):
    res = client.get("/api/v1/knowledge/topics")
    assert res.status_code == 200
    topics = res.json()
    assert len(topics) >= 2
    assert any("ACT" in t["title"] or "Defusion" in t["title"] for t in topics)

    exercises_res = client.get("/api/v1/knowledge/exercises")
    assert exercises_res.status_code == 200
    exercises = exercises_res.json()
    assert len(exercises) >= 2
    assert any("Box Breathing" in e["title"] for e in exercises)


def test_voice_domain(client):
    profiles_res = client.get("/api/v1/voice/profiles")
    assert profiles_res.status_code == 200
    profiles = profiles_res.json()
    assert len(profiles) >= 2

    synth_res = client.post(
        "/api/v1/voice/synthesize",
        json={"text": "Hello, welcome to your sanctuary."},
    )
    assert synth_res.status_code == 200
    assert "audio_base64" in synth_res.json()


def test_reminders_domain(client):
    res = client.get("/api/v1/reminders")
    assert res.status_code == 200
    reminders = res.json()
    assert len(reminders) >= 1

    create_res = client.post(
        "/api/v1/reminders",
        json={
            "title": "Evening Gratitude Pause",
            "reminder_type": "evening_reflection",
            "prompt_text": "Name 3 small moments of peace today.",
            "cron_or_time": "21:00",
        },
    )
    assert create_res.status_code == 201
    created_id = create_res.json()["id"]

    del_res = client.delete(f"/api/v1/reminders/{created_id}")
    assert del_res.status_code == 204


def test_integrations_domain_pii_scrubbing(client):
    res = client.post(
        "/api/v1/integrations/import/preview",
        json={
            "source": "chatgpt_export",
            "raw_sample_text": "Contact me at elena.work@example.com or 415-555-2671 about the project.",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["pii_redacted_count"] >= 2
    assert "[EMAIL_REDACTED]" in data["snippets"][0]["scrubbed_snippet"]


def test_admin_domain_and_gdpr_export(client):
    status_res = client.get("/api/v1/admin/status")
    assert status_res.status_code == 200
    assert status_res.json()["isolation_mode"] == "RowLevelSecurity"

    logs_res = client.get("/api/v1/admin/audit-logs")
    assert logs_res.status_code == 200
    assert len(logs_res.json()) >= 1

    export_res = client.get("/api/v1/admin/compliance-export")
    assert export_res.status_code == 200
    assert "gdpr_article_15_access" in export_res.json()
