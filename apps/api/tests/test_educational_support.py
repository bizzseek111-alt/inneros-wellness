"""Automated Test Suite for InnerOS Educational Support Center.

Verifies:
1. Module A: ADHD-friendly visual task breakdowns & micro-steps
2. Module B: Autism-friendly AAC picture communication symbols & sensory settings
3. Module C: Multi-modal learning differences accommodations
4. Module D: Cognitive development games & special interest filtering
5. Module E: Caregiver guidance, co-regulation, and IEP collaboration
6. Non-diagnostic invariant: Rejects any attempt to score or diagnose ADHD/autism
7. Non-punitive progress tracking: Demonstrated educational skills only
"""

import pytest


def test_get_adhd_task_breakdowns(client):
    """Verifies retrieval of ADHD-friendly visual schedules and micro-steps."""
    res = client.get("/api/v1/educational-support/tasks")
    assert res.status_code == 200
    tasks = res.json()
    assert len(tasks) >= 2

    # Verify morning task and micro-steps
    morning = next(t for t in tasks if t["category"] == "morning")
    assert len(morning["micro_steps"]) >= 3
    for step in morning["micro_steps"]:
        assert step["visual_icon"] != ""
        assert step["title"] != ""
        assert step["title_ur"] != ""
        assert step["title_pa"] != ""


def test_get_autism_aac_symbols(client):
    """Verifies picture AAC communication symbols with multi-language phrases
    and respectful boundary setting (choice-based consent, no forced eye contact).
    """
    res = client.get("/api/v1/educational-support/aac-symbols")
    assert res.status_code == 200
    symbols = res.json()
    assert len(symbols) >= 6

    # Verify sensory, physical need, and social boundary cards are present
    categories = [s["category"] for s in symbols]
    assert "sensory" in categories
    assert "physical_need" in categories
    assert "social_boundaries" in categories

    # Verify respectful boundary card (Listening looking away / Not right now)
    boundary_cards = [s for s in symbols if s["category"] == "social_boundaries"]
    assert any("Looking Away" in s["label_en"] or "Not Right Now" in s["label_en"] for s in boundary_cards)


def test_classroom_accommodations(client):
    """Verifies teacher accommodation suggestions and IEP-ready strategies."""
    res = client.get("/api/v1/educational-support/accommodations")
    assert res.status_code == 200
    accommodations = res.json()
    assert len(accommodations) >= 3

    # Verify sensory regulation and task chunking accommodations
    titles = [a["title"] for a in accommodations]
    assert any("Fidget" in t for t in titles)
    assert any("Chunked" in t for t in titles)
    assert any("Transition" in t for t in titles)

    for acc in accommodations:
        assert len(acc["printable_iep_note"]) > 10
        assert len(acc["why_it_helps"]) > 10


def test_cognitive_games_special_interests(client):
    """Verifies untimed cognitive games and special interest filtering."""
    res = client.get("/api/v1/educational-support/games?special_interest=space")
    assert res.status_code == 200
    games = res.json()
    assert len(games) >= 1
    assert games[0]["special_interest"] == "space"
    assert "Space" in games[0]["title"] or "Astronaut" in games[0]["title"]


def test_caregiver_guidance_articles(client):
    """Verifies neurodiversity-affirming caregiver guidance and assessment referral advice."""
    res = client.get("/api/v1/educational-support/guidance")
    assert res.status_code == 200
    articles = res.json()
    assert len(articles) >= 3

    categories = [a["category"] for a in articles]
    assert "co_regulation" in categories
    assert "routine_building" in categories
    assert "referral_guidance" in categories

    # Verify professional disclaimer is present on all guidance articles
    for art in articles:
        assert "qualified developmental pediatrician" in art["professional_disclaimer"].lower()


def test_record_demonstrated_skill_success(client):
    """Verifies recording of valid, non-diagnostic demonstrated educational skill."""
    res = client.post(
        "/api/v1/educational-support/skill-milestone",
        params={
            "child_id_hash": "child_hash_test_1",
            "skill_key": "completed_morning_visual_sequence",
            "skill_category": "executive_function",
            "notes": "Child independently checked off 4 morning steps using the star disc timer.",
        },
    )
    assert res.status_code == 200
    record = res.json()
    assert record["skill_key"] == "completed_morning_visual_sequence"
    assert record["skill_category"] == "executive_function"

    # Fetch back
    get_res = client.get("/api/v1/educational-support/skills/child_hash_test_1")
    assert get_res.status_code == 200
    skills = get_res.json()
    assert len(skills) >= 1
    assert skills[0]["skill_key"] == "completed_morning_visual_sequence"


def test_reject_diagnostic_and_probability_scores(client):
    """CRITICAL INVARIANT TEST:
    Verifies that any attempt to record diagnostic labels, ADHD/autism probability scores,
    or compliance/masking grades is strictly rejected with HTTP 400 Bad Request.
    """
    forbidden_attempts = [
        ("adhd_probability_high", "diagnostic_inference"),
        ("autism_spectrum_severity_score", "clinical_label"),
        ("compliance_grade_normal", "behavioral_compliance"),
        ("cured_neurodivergence", "clinical_treatment"),
    ]

    for key, cat in forbidden_attempts:
        res = client.post(
            "/api/v1/educational-support/skill-milestone",
            params={
                "child_id_hash": "child_hash_test_2",
                "skill_key": key,
                "skill_category": cat,
            },
        )
        assert res.status_code == 400
        assert "strictly prohibited" in res.json()["detail"].lower()


def test_sensory_profile_persistence(client):
    """Verifies child sensory preferences (sound, low motion, calm color, dyslexic font)."""
    child_id = "child_sensory_test"
    payload = {
        "sound_volume_level": 30,
        "low_motion_enabled": True,
        "calm_color_filter": True,
        "high_contrast_enabled": False,
        "open_dyslexic_font": True,
        "text_size_multiplier": 1.25,
    }
    put_res = client.put(
        f"/api/v1/educational-support/sensory-profile/{child_id}",
        json=payload,
    )
    assert put_res.status_code == 200
    data = put_res.json()
    assert data["open_dyslexic_font"] is True
    assert data["low_motion_enabled"] is True
    assert data["sound_volume_level"] == 30

    get_res = client.get(f"/api/v1/educational-support/sensory-profile/{child_id}")
    assert get_res.status_code == 200
    assert get_res.json()["open_dyslexic_font"] is True


def test_regulatory_notice_and_ethics(client):
    """Verifies explicit non-clinical disclosure, ethics, and professional review requirements."""
    res = client.get("/api/v1/educational-support/regulatory-notice")
    assert res.status_code == 200
    notice = res.json()
    assert "Non-Medical" in notice["classification"]
    assert "PROHIBITED" in notice["diagnostic_claim_policy"]
    assert "PROHIBITED" in notice["treatment_claim_policy"]
    assert "stimming" in notice["behavioral_ethics"].lower()
    assert "specialist review" in notice["professional_review_status"].lower()
