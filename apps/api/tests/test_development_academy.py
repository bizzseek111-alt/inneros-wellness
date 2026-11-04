"""Comprehensive Test Suite for InnerOS Kids Development Academy.

Verifies:
1. 25 Curriculum Departments metadata, evidence frameworks, and translations.
2. 20 Original Demonstration Lessons (5 per age band: 2-5, 6-9, 10-12, 13-18).
3. 18 Core Module Attributes (research citations, trilingual story, voice exercise,
   text exercise, offline activity, knowledge check, non-diagnostic indicator).
4. Gating & CMS Approval Workflow (drafts hidden from child accounts, reviewer workflow).
5. Personalized Recommendation Engine (age, chosen goals, sensory preferences).
6. Strict Invariants: Rejection of IQ scores, diagnostic probabilities, and clinical claims.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.domains.academy.schemas import ApprovalStatus, EvidenceStrengthLevel

client = TestClient(app)


def test_list_all_25_departments():
    """Verify that all 25 curriculum departments are exposed with evidence frameworks and translations."""
    response = client.get("/api/v1/academy/departments")
    assert response.status_code == 200
    departments = response.json()
    assert len(departments) == 25

    # Check key departments exist
    dept_ids = {d["id"] for d in departments}
    expected_depts = [
        "emotional_intelligence",
        "emotional_vocabulary",
        "self_regulation_coping",
        "empathy",
        "friendship_relationships",
        "confidence_self_esteem",
        "resilience_setbacks",
        "communication_skills",
        "critical_thinking",
        "problem_solving",
        "executive_functioning",
        "attention_planning",
        "memory_learning_strategies",
        "language_development",
        "creativity_curiosity",
        "personal_safety_boundaries",
        "bullying_prevention_help",
        "digital_safety",
        "healthy_habits_sleep",
        "caregiver_child_relationships",
        "positive_parenting",
        "adhd_friendly_support",
        "autism_friendly_support",
        "inclusive_learning_accessibility",
        "adolescent_mental_health_literacy",
    ]
    for ed in expected_depts:
        assert ed in dept_ids

    # Validate trilingual labels & evidence frameworks on a sample department
    sample = next(d for d in departments if d["id"] == "self_regulation_coping")
    assert "خود اختیاری" in sample["name_ur"]
    assert "اپنے آپ نوں سنبھالن" in sample["name_pa"]
    assert "Harvard Center on the Developing Child" in sample["evidence_framework"]


def test_20_demonstration_lessons_exist():
    """Verify that all 20 demonstration lessons exist across the 4 age bands (5 per band)."""
    response = client.get("/api/v1/academy/modules?is_reviewer=true")
    assert response.status_code == 200
    modules = response.json()
    assert len(modules) >= 20

    age_counts = {"2-5": 0, "6-9": 0, "10-12": 0, "13-18": 0}
    for m in modules:
        target_age = m["target_age_range"]
        if target_age in age_counts:
            age_counts[target_age] += 1

    assert age_counts["2-5"] == 5
    assert age_counts["6-9"] == 5
    assert age_counts["10-12"] == 5
    assert age_counts["13-18"] == 5


def test_demonstration_lesson_attributes_integrity():
    """Verify that demonstration lessons contain all 18 required attributes and trilingual content."""
    response = client.get("/api/v1/academy/modules?is_reviewer=true")
    modules = response.json()

    for m in modules:
        # Check required fields
        assert m["module_id"]
        assert m["department_id"]
        assert m["title_en"]
        assert m["title_ur"]
        assert m["title_pa"]
        assert m["target_age_range"] in ["2-5", "6-9", "10-12", "13-18"]
        assert len(m["research_references"]) >= 2
        assert m["evidence_strength"] in [e.value for e in EvidenceStrengthLevel]
        assert m["recommended_session_duration_min"] > 0
        assert m["non_diagnostic_progress_indicator"]

        # Check accessibility adaptations
        acc = m["accessibility_adaptations"]
        assert acc["visual"]
        assert acc["auditory"]
        assert acc["motor"]
        assert acc["sensory"]
        assert acc["cognitive"]

        # Check interactive story
        story = m["interactive_story"]
        assert story["title_en"]
        assert story["story_text_en"]
        assert story["story_text_ur"]
        assert story["story_text_pa"]
        assert len(story["choices"]) >= 2

        # Check voice activity
        voice = m["voice_based_activity"]
        assert voice["audio_prompt_en"]
        assert voice["audio_prompt_ur"]
        assert voice["audio_prompt_pa"]
        assert voice["guided_exercise_type"]

        # Check text activity
        text_act = m["text_based_activity"]
        assert text_act["prompt_en"]
        assert text_act["prompt_ur"]
        assert text_act["prompt_pa"]

        # Check offline activity
        offline = m["offline_activity"]
        assert offline["instructions_en"]
        assert offline["instructions_ur"]
        assert offline["instructions_pa"]

        # Check knowledge check
        check = m["knowledge_check"]
        assert check["question_en"]
        assert check["question_ur"]
        assert check["question_pa"]
        assert len(check["options"]) >= 2
        assert check["affirmation_en"]


def test_content_gating_and_reviewer_access():
    """Verify that unapproved draft lessons are gated from learners and visible only to reviewers."""
    # Attempting to fetch a draft module as a standard learner (is_reviewer=false) should return 403
    response = client.get("/api/v1/academy/modules/mod_early_01?is_reviewer=false")
    assert response.status_code == 403
    assert "pending clinical multidisciplinary signoff" in response.json()["detail"]

    # As a reviewer, access must succeed
    reviewer_resp = client.get("/api/v1/academy/modules/mod_early_01?is_reviewer=true")
    assert reviewer_resp.status_code == 200
    assert reviewer_resp.json()["module_id"] == "mod_early_01"


def test_reviewer_cms_approval_workflow():
    """Verify reviewer approval workflow: transitioning draft -> approved -> published."""
    # 1. Create a new module in draft status
    new_module_data = {
        "module_id": "mod_test_custom_01",
        "department_id": "friendship_relationships",
        "title_en": "Sharing the Playground Swing",
        "title_ur": "جھولے بانٹنے کا خوبصورت ہنر",
        "title_pa": "پینگاں سانجھیاں کرن دا ہنر",
        "target_age_range": "6-9",
        "difficulty": "gentle",
        "developmental_objective": "Practice taking turns and respectful waiting without anxiety.",
        "research_references": [
            "Parten, M. B. (1932). Social participation among preschool children.",
            "CASEL (2020) Relationship Skills.",
        ],
        "evidence_strength": "level_2_controlled_trial",
        "reviewer_name": "Dr. Sarah Khan, Clinical Lead",
        "recommended_session_duration_min": 8,
        "interactive_story": {
            "title_en": "Lumi at the Park",
            "title_ur": "لومی پارک میں",
            "title_pa": "لومی پارک وچ",
            "story_text_en": "Lumi sees another friend waiting for the swing.",
            "story_text_ur": "لومی نے دیکھا کہ ایک دوست جھولے کا انتظار کر رہا ہے۔",
            "story_text_pa": "لومی ویکھدا اے کہ اک سنگی جھولے دی واری اُڈیک رہیا اے۔",
            "choices": [
                {
                    "choice_id": "c1",
                    "text_en": "Offer to count 10 pushes together",
                    "text_ur": "دس گننے کی پیشکش کرنا",
                    "text_pa": "دس گنن دی پیشکش کرنی",
                    "reflection_feedback": "Counting turns creates fair and joyful play.",
                },
                {
                    "choice_id": "c2",
                    "text_en": "Ask if they want to push together",
                    "text_ur": "ساتھ جھولا دینے کا پوچھنا",
                    "text_pa": "رل کے جھولن دا پچھنا",
                    "reflection_feedback": "Cooperative play deepens friendships.",
                },
            ],
        },
        "voice_based_activity": {
            "title": "Turn-taking Voice Echo",
            "audio_prompt_en": "Say: 'Your turn next, my friend!'",
            "audio_prompt_ur": "بولیں: 'اگلی باری آپ کی ہے، دوست!'",
            "audio_prompt_pa": "بولو: 'اگلی واری تیری اے، سنگی!'",
            "guided_exercise_type": "voice_reflection",
            "pacing_seconds": 30,
        },
        "text_based_activity": {
            "title": "Kind Words Box",
            "prompt_en": "What words make sharing easier?",
            "prompt_ur": "کون سے الفاظ بانٹنے کو آسان بناتے ہیں؟",
            "prompt_pa": "کیہڑے لفظ سانجھ نوں سوکھا بناؤندے نیں؟",
            "suggested_chips": ["Together", "After me", "Your turn"],
            "reflective_guidance": "Sharing is a gift of trust.",
        },
        "offline_activity": {
            "title": "Kitchen Utensil Turn Game",
            "instructions_en": "Take turns rolling a soft ball with a caregiver.",
            "instructions_ur": "والدین کے ساتھ نرم گیند سے باری باری کھیلیں۔",
            "instructions_pa": "والدین نال نرم گیند نال واری واری کھیڈو۔",
            "materials_needed": ["Soft ball or rolled socks"],
            "caregiver_or_peer_role": "Caregiver models patient turn-taking.",
        },
        "knowledge_check": {
            "question_en": "When a friend waits for a toy, what can we do?",
            "question_ur": "جب کوئی دوست کھلونے کا انتظار کرے تو ہم کیا کر سکتے ہیں؟",
            "question_pa": "جدوں کوئی سنگی کھڈونے دی واری اُڈیکے تاں اسیں کیہ کر سکدے ہاں؟",
            "options": [
                {"id": "o1", "text": "Set a gentle timer and take turns", "is_helpful": "true"},
                {"id": "o2", "text": "Ignore them completely", "is_helpful": "false"},
            ],
            "affirmation_en": "Taking turns helps everyone feel included!",
            "affirmation_ur": "باری لینے سے سب کو خوشی ملتی ہے!",
            "affirmation_pa": "واری لین نال ساریاں نوں خوشی ملدی اے!",
        },
        "non_diagnostic_progress_indicator": "Completed sharing reflection and cooperative playground scenario.",
    }

    create_resp = client.post("/api/v1/academy/modules", json=new_module_data)
    assert create_resp.status_code == 201
    created = create_resp.json()
    assert created["module_id"] == "mod_test_custom_01"
    assert created["approval_status"] == "draft"
    assert created["is_published"] is False

    # 2. Update metadata
    update_resp = client.put(
        "/api/v1/academy/modules/mod_test_custom_01",
        json={"recommended_session_duration_min": 12, "version": "1.1.0"},
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["recommended_session_duration_min"] == 12
    assert update_resp.json()["version"] == "1.1.0"

    # 3. Transition status to PUBLISHED via approval workflow
    approve_payload = {
        "module_id": "mod_test_custom_01",
        "target_status": "published",
        "reviewer_name": "Dr. Sarah Khan, Clinical Lead",
        "reviewer_notes": "Passed all developmental psychology criteria and multilingual audit.",
        "signed_clinical_disclaimer": True,
    }
    approve_resp = client.post("/api/v1/academy/modules/mod_test_custom_01/approve", json=approve_payload)
    assert approve_resp.status_code == 200
    assert approve_resp.json()["new_status"] == "published"

    # 4. Standard learner (is_reviewer=false) can now access the published module!
    learner_resp = client.get("/api/v1/academy/modules/mod_test_custom_01?is_reviewer=false")
    assert learner_resp.status_code == 200
    assert learner_resp.json()["is_published"] is True


def test_recommendation_engine():
    """Verify that personalized recommendations rank modules by age, chosen goals, and sensory preferences."""
    rec_payload = {
        "age_range": "10-12",
        "chosen_goals": ["focus", "calm"],
        "completed_module_ids": ["mod_junior_old_01"],
        "sensory_preference": "low_stimulation",
        "language": "en",
    }
    response = client.post("/api/v1/academy/recommendations?is_reviewer=true", json=rec_payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["recommended_modules"]) > 0
    assert "Junior Older (Ages 10–12)" in data["age_band_display"]
    # The top recommended modules should prioritize age 10-12
    top_mod = data["recommended_modules"][0]
    assert top_mod["target_age_range"] == "10-12"
    # Completed module should not be ranked first
    assert top_mod["module_id"] != "mod_junior_old_01"


def test_prohibited_diagnostic_invariants():
    """Verify strict ethical invariants: rejection of IQ scores and diagnostic probability requests."""
    # Attempt to create a module with IQ score language
    bad_module_data = {
        "module_id": "mod_prohibited_01",
        "department_id": "executive_functioning",
        "title_en": "Cognitive IQ Test for Children",
        "title_ur": "ٹیسٹ",
        "title_pa": "ٹیسٹ",
        "target_age_range": "6-9",
        "developmental_objective": "Calculate estimated IQ score from response time.",
        "research_references": ["Invalid"],
        "evidence_strength": "level_3_field_pilot",
        "reviewer_name": "Unauthorized",
        "interactive_story": {
            "title_en": "Story",
            "title_ur": "کہانی",
            "title_pa": "کہانی",
            "story_text_en": "Story calculating your child's ADHD probability score.",
            "story_text_ur": "کہانی",
            "story_text_pa": "کہانی",
            "choices": [],
        },
        "voice_based_activity": {
            "title": "V",
            "audio_prompt_en": "P",
            "audio_prompt_ur": "P",
            "audio_prompt_pa": "P",
            "guided_exercise_type": "voice",
        },
        "text_based_activity": {"title": "T", "prompt_en": "T", "prompt_ur": "T", "prompt_pa": "T"},
        "offline_activity": {"title": "O", "instructions_en": "O", "instructions_ur": "O", "instructions_pa": "O"},
        "knowledge_check": {
            "question_en": "Q",
            "question_ur": "Q",
            "question_pa": "Q",
            "options": [],
            "affirmation_en": "A",
            "affirmation_ur": "A",
            "affirmation_pa": "A",
        },
        "non_diagnostic_progress_indicator": "IQ score estimated at 110",
    }

    resp = client.post("/api/v1/academy/modules", json=bad_module_data)
    assert resp.status_code == 400
    assert "violates InnerOS Kids ethical boundaries" in resp.json()["detail"]


def test_publish_all_demonstration_helper():
    """Verify development helper publishes all demonstration lessons."""
    resp = client.post("/api/v1/academy/dev/publish-all")
    assert resp.status_code == 200
    assert resp.json()["status"] == "success"
    assert resp.json()["published_count"] >= 20

    # Now standard learners can view modules
    learner_resp = client.get("/api/v1/academy/modules?is_reviewer=false")
    assert learner_resp.status_code == 200
    assert len(learner_resp.json()) >= 20
