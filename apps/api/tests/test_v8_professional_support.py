"""Automated Test Suite for Weebly V8 Wellbeing, Early Support & Professional Layer (Modules 8 & 12).

Verifies:
1. Parent observation diary recording
2. Strict rejection of diagnostic labels (non-clinical ethical boundary)
3. Teacher classroom observation forms
4. Professional clinician profile registration
5. Authorized early support case management with consent
6. Safeguarding exception: caregiver harm notification suppression
7. Case-level privacy: notes accessible exclusively to authorized clinicians
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_parent_observation_records_factual_behavior(client):
    """Verifies that parents can record factual observations without diagnostic claims."""
    req = {
        "child_id": "child_zara_demo",
        "category": "focus",
        "observation_text": "Completed the 12-mango sharing puzzle with Kai. Took a 5-minute movement break between lessons.",
        "context_setting": "homework",
        "accommodations_tried": "Visual timer and high-contrast text",
    }
    headers = {"X-User-Id": "caregiver_fatima_demo"}
    res = client.post("/api/v1/support/parent-observations", json=req, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["child_id"] == "child_zara_demo"
    assert data["is_diagnostic"] is False
    assert data["category"] == "focus"

    # List observations
    list_res = client.get(
        "/api/v1/support/parent-observations?child_id=child_zara_demo",
        headers=headers,
    )
    assert list_res.status_code == 200
    obs_list = list_res.json()
    assert len(obs_list) >= 1


def test_parent_observation_strictly_rejects_diagnostic_labels(client):
    """Ethical Boundary Test: Verifies that diagnostic terms (e.g., ADHD, autism) are rejected."""
    bad_req = {
        "child_id": "child_zara_demo",
        "category": "focus",
        "observation_text": "I suspect my child has severe ADHD disorder and clinical anxiety.",
        "context_setting": "home",
    }
    headers = {"X-User-Id": "caregiver_fatima_demo"}
    res = client.post("/api/v1/support/parent-observations", json=bad_req, headers=headers)
    assert res.status_code == 400
    assert "Diagnostic terms and psychological labels are prohibited" in res.json()["detail"]


def test_teacher_classroom_observation(client):
    """Verifies that teachers can record classroom engagement notes."""
    req = {
        "student_id": "student_ali_demo",
        "classroom_id": "class_grade4_oakridge",
        "domain": "engagement",
        "observation_text": "Ali participated enthusiastically in the photosynthesis science quest.",
        "supports_offered": "Provided peer collaboration during drawing challenge",
    }
    headers = {"X-User-Id": "teacher_ahmed_demo"}
    res = client.post("/api/v1/support/teacher-observations", json=req, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["student_id"] == "student_ali_demo"
    assert data["classroom_id"] == "class_grade4_oakridge"


def test_professional_registration_and_clinical_case_management(client):
    """Verifies professional credential registration, case creation, and clinical notes."""
    # 1. Register licensed child psychologist
    prof_req = {
        "full_name": "Dr. Sarah Jenkins, Ph.D.",
        "license_number": "PSY-88291-PK",
        "issuing_authority": "Pakistan Psychological Association / Punjab Healthcare Commission",
        "jurisdiction": "Punjab",
        "specialties": ["Child Development", "Learning Accommodations", "Neurodiversity Affirming Care"],
    }
    prof_headers = {"X-User-Id": "clinician_sarah_demo"}
    reg_res = client.post("/api/v1/support/professionals/register", json=prof_req, headers=prof_headers)
    assert reg_res.status_code == 200
    prof_data = reg_res.json()
    assert prof_data["verification_status"] == "verified"

    # 2. Initiate support case with parental consent
    case_req = {
        "child_pseudonym_id": "child_pseudonym_k7",
        "referral_source": "school",
        "parental_consent_verified": True,
        "caregiver_harm_suspected": False,
        "initial_notes": "School educator requested developmental speech and reading observation review.",
    }
    case_res = client.post("/api/v1/support/cases", json=case_req)
    assert case_res.status_code == 200
    case_data = case_res.json()
    case_id = case_data["id"]
    assert case_data["status"] == "intake"
    assert case_data["caregiver_harm_suspected"] is False

    # 3. Verified clinician authors protected clinical note
    note_req = {
        "note_type": "intake_review",
        "content": "Reviewed school observations and parent diary. Recommended multi-sensory math practice and untimed reading.",
    }
    note_res = client.post(
        f"/api/v1/support/cases/{case_id}/notes",
        json=note_req,
        headers=prof_headers,
    )
    assert note_res.status_code == 200
    note_data = note_res.json()
    assert note_data["case_id"] == case_id
    assert note_data["access_restricted_to_clinicians"] is True

    # 4. Verified clinician can view case notes
    view_res = client.get(
        f"/api/v1/support/cases/{case_id}/notes",
        headers=prof_headers,
    )
    assert view_res.status_code == 200
    assert len(view_res.json()) >= 1

    # 5. Unauthorized non-clinician is rejected with HTTP 403 Forbidden
    unauth_headers = {"X-User-Id": "unauthorized_parent_or_staff"}
    unauth_res = client.get(
        f"/api/v1/support/cases/{case_id}/notes",
        headers=unauth_headers,
    )
    assert unauth_res.status_code == 403
    assert "Restricted Clinical Data" in unauth_res.json()["detail"]


def test_safeguarding_caregiver_harm_exception(client):
    """Safeguarding Invariant: If suspected source of harm is caregiver, case flags exception."""
    case_req = {
        "child_pseudonym_id": "child_pseudonym_alert9",
        "referral_source": "school",
        "parental_consent_verified": False,
        "caregiver_harm_suspected": True,  # Caregiver harm exception
        "initial_notes": "Child disclosed physical abuse at home. Caregiver notification suppressed.",
    }
    case_res = client.post("/api/v1/support/cases", json=case_req)
    assert case_res.status_code == 200
    case_data = case_res.json()
    assert case_data["caregiver_harm_suspected"] is True
    # Invariant: Does not fail on missing parental consent when caregiver harm is suspected
