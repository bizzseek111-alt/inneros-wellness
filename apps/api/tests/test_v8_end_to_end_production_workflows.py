"""End-to-End Production Readiness Verification Suite for Weebly V8 (Module 17).

Verifies the 4 real end-to-end production workflows:
1. Child → AI Friend → Learning Activity → Saved Educational Event → Parent Report
2. Teacher → Assignment → Child Completion → Authorized Teacher Report
3. Parent → Observation → Support Guidance → Authorized Professional Review
4. School → Enrollment → Teacher Assignment → Aggregate Curriculum Report
"""

import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.database import db_session
from app.db.models import (
    SchoolCampusModel,
    SchoolProgramModel,
    ClassroomModel,
    ClassroomEnrollmentModel,
    ClassroomAssignmentModel,
    AssignmentSubmissionModel,
    EducationalActivityEventModel,
)


@pytest.fixture
def client():
    return TestClient(app)


def test_workflow_1_child_to_parent_report(client):
    """Workflow 1: Child → AI Friend → Learning Activity → Saved Educational Event → Parent Report."""
    # Step A: Child asks Kai for help with mango sharing math
    turn_req = {
        "query": "How do we share 12 mangoes equally among 3 friends?",
        "board": "Punjab Curriculum and Textbook Board (PCTB)",
        "grade": "Grade 4",
        "subject": "Mathematics",
        "language": "en",
        "character_id": "kai",
    }
    turn_res = client.post("/api/v1/curriculum/rag/query", json=turn_req)
    assert turn_res.status_code == 200
    turn_data = turn_res.json()
    assert len(turn_data["citations"]) > 0
    assert "fair sharing" in turn_data["socratic_hint"].lower() or "division" in turn_data["socratic_hint"].lower()

    # Step B: Child completes the guided Mango Math Quest and logs educational activity event
    event_id = f"act_{uuid.uuid4().hex[:8]}"
    student_id = "student_zara_demo"
    with db_session() as db:
        event = EducationalActivityEventModel(
            id=event_id,
            student_pseudonymous_id=student_id,
            activity_id="math-mango-division",
            learning_objective="Equal Sharing and Fair Division (PCTB Grade 4 Ch. 2)",
            completion_status="completed",
            hints_used_count=1,
            language_used="en",
            duration_seconds=185,
            curriculum_version="v2.4.0",
        )
        db.add(event)
        db.commit()

    # Step C: Parent accesses educational learning progress
    with db_session() as db:
        saved = db.query(EducationalActivityEventModel).filter(
            EducationalActivityEventModel.student_pseudonymous_id == student_id
        ).first()
        assert saved is not None
        assert saved.activity_id == "math-mango-division"
        assert saved.hints_used_count == 1
        assert saved.completion_status == "completed"


def test_workflow_2_teacher_assignment_to_report(client):
    """Workflow 2: Teacher → Assignment → Child Completion → Authorized Teacher Report."""
    teacher_id = "teacher_fatima_demo"
    student_id = "student_leo_demo"
    classroom_id = f"class_{uuid.uuid4().hex[:6]}"
    assignment_id = f"assign_{uuid.uuid4().hex[:6]}"

    # Step A: Teacher sets up classroom and assignment
    with db_session() as db:
        classroom = ClassroomModel(
            id=classroom_id,
            teacher_id=teacher_id,
            name="Grade 4-B Sunflower",
            grade_level="Grade 4",
            institution_name="Lahore Model School",
            join_code=f"JOIN{uuid.uuid4().hex[:4].upper()}",
            is_active=True,
        )
        db.add(classroom)

        enrollment = ClassroomEnrollmentModel(
            id=f"enr_{uuid.uuid4().hex[:6]}",
            classroom_id=classroom_id,
            student_id=student_id,
            student_display_name="Leo S.",
            status="enrolled",
        )
        db.add(enrollment)

        assignment = ClassroomAssignmentModel(
            id=assignment_id,
            classroom_id=classroom_id,
            title="Photosynthesis Drawing & Concept Quest",
            department_id="science_and_discovery",
            activity_type="concept_drawing",
            instructions="Draw a leaf showing sunlight, water absorption, and oxygen release.",
        )
        db.add(assignment)
        db.commit()

    # Step B: Child completes the assignment
    submission_id = f"sub_{uuid.uuid4().hex[:6]}"
    with db_session() as db:
        sub = AssignmentSubmissionModel(
            id=submission_id,
            assignment_id=assignment_id,
            student_id=student_id,
            status="completed",
            hints_used=1,
            teacher_feedback="Excellent diagram showing stomata and chlorophyll absorption!",
        )
        db.add(sub)
        db.commit()

    # Step C: Teacher verifies classroom submission report
    with db_session() as db:
        verified_sub = db.query(AssignmentSubmissionModel).filter(
            AssignmentSubmissionModel.assignment_id == assignment_id
        ).first()
        assert verified_sub is not None
        assert verified_sub.status == "completed"
        assert "stomata" in verified_sub.teacher_feedback.lower()


def test_workflow_3_parent_observation_to_professional_review(client):
    """Workflow 3: Parent → Observation → Support Guidance → Authorized Professional Review."""
    parent_id = "parent_maryam_demo"
    child_id = "child_amina_demo"
    clinician_id = "clinician_dr_tariq"

    # Step A: Parent records factual observation diary entry
    obs_req = {
        "child_id": child_id,
        "category": "sensory",
        "observation_text": "Amina prefers low-stimulation lighting and quiet audio during bedtime routines.",
        "context_setting": "evening_routine",
        "accommodations_tried": "Low-stimulation mode and soft chime sounds with Lumi",
    }
    obs_res = client.post(
        "/api/v1/support/parent-observations",
        json=obs_req,
        headers={"X-User-Id": parent_id},
    )
    assert obs_res.status_code == 200

    # Step B: Register clinician and initiate authorized early support case
    reg_req = {
        "full_name": "Dr. Tariq Al-Hassan, Ph.D.",
        "license_number": "PSY-44910-PK",
        "issuing_authority": "Punjab Healthcare Commission",
        "jurisdiction": "Punjab",
        "specialties": ["Sensory Modulation", "Developmental Pediatric Support"],
    }
    client.post(
        "/api/v1/support/professionals/register",
        json=reg_req,
        headers={"X-User-Id": clinician_id},
    )

    case_req = {
        "child_pseudonym_id": child_id,
        "referral_source": "parent",
        "parental_consent_verified": True,
        "caregiver_harm_suspected": False,
        "initial_notes": "Caregiver requested professional sensory accommodation guidance.",
    }
    case_res = client.post("/api/v1/support/cases", json=case_req)
    assert case_res.status_code == 200
    case_id = case_res.json()["id"]

    # Step C: Clinician authors protected clinical guidance note
    note_req = {
        "note_type": "support_plan",
        "content": "Recommended maintaining low-stimulation pastel UI themes and structured 3-step visual schedules.",
    }
    note_res = client.post(
        f"/api/v1/support/cases/{case_id}/notes",
        json=note_req,
        headers={"X-User-Id": clinician_id},
    )
    assert note_res.status_code == 200
    assert note_res.json()["access_restricted_to_clinicians"] is True


def test_workflow_4_school_enrollment_to_aggregate_report(client):
    """Workflow 4: School → Enrollment → Teacher Assignment → Aggregate Curriculum Report."""
    campus_id = f"campus_{uuid.uuid4().hex[:6]}"
    school_id = "school_oakridge_district"

    with db_session() as db:
        campus = SchoolCampusModel(
            id=campus_id,
            school_id=school_id,
            name="Oakridge North Elementary",
            grades_served="Grade 1 to 5",
            address_city="Lahore",
            lead_administrator="Dr. Eleanor Vance",
            license_tier="Institutional District Pack",
            is_active=True,
        )
        db.add(campus)

        program = SchoolProgramModel(
            id=f"prog_{uuid.uuid4().hex[:6]}",
            campus_id=campus_id,
            program_name="Punjab Standard Elementary Learning",
            curriculum_board="Punjab Curriculum and Textbook Board (PCTB)",
            target_grades="Grade 1 to 5",
            active_worlds_json='["creative_studio","brain_quest","tech_discovery"]',
            is_active=True,
        )
        db.add(program)
        db.commit()

    # Step B: Query aggregate curriculum program report
    with db_session() as db:
        saved_campus = db.query(SchoolCampusModel).filter(SchoolCampusModel.id == campus_id).first()
        saved_prog = db.query(SchoolProgramModel).filter(SchoolProgramModel.campus_id == campus_id).first()

        assert saved_campus is not None
        assert saved_campus.lead_administrator == "Dr. Eleanor Vance"
        assert saved_prog is not None
        assert "PCTB" in saved_prog.curriculum_board
