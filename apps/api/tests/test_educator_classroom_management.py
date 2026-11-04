"""Tests for Educator & Classroom Cohort Management Domain."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_create_and_list_classrooms():
    create_payload = {
        "name": "Room 5A Oak Cohort",
        "grade_level": "Grade 5 (Ages 9-11)",
        "institution_name": "Weebly Beacon Academy",
    }
    res = client.post("/api/v1/educational-support/classrooms?teacher_id=usr_teacher_smith", json=create_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Room 5A Oak Cohort"
    assert data["join_code"].startswith("WB-")
    assert data["teacher_id"] == "usr_teacher_smith"
    cls_id = data["id"]

    # List classrooms for teacher
    list_res = client.get("/api/v1/educational-support/classrooms?teacher_id=usr_teacher_smith")
    assert list_res.status_code == 200
    classes = list_res.json()
    assert any(c["id"] == cls_id for c in classes)


def test_enroll_student_in_classroom():
    enroll_payload = {
        "classroom_id": "cls_demo_sunflower",
        "student_display_name": "Tariq Jr.",
    }
    res = client.post("/api/v1/educational-support/classrooms/enroll", json=enroll_payload)
    assert res.status_code == 200
    enr_data = res.json()
    assert enr_data["student_display_name"] == "Tariq Jr."
    assert enr_data["status"] == "enrolled"

    # List students
    students_res = client.get("/api/v1/educational-support/classrooms/cls_demo_sunflower/students")
    assert students_res.status_code == 200
    students = students_res.json()
    assert len(students) >= 1


def test_create_and_list_classroom_assignments():
    assign_payload = {
        "classroom_id": "cls_demo_sunflower",
        "title": "Feelings Wheel: Afternoon Reset",
        "department_id": "emotional_intelligence",
        "activity_type": "feelings_wheel",
        "instructions": "Select three emotional vocabulary terms describing your afternoon energy.",
        "due_date": "Today 3:00 PM",
    }
    res = client.post("/api/v1/educational-support/classrooms/assignments", json=assign_payload)
    assert res.status_code == 200
    asgn_data = res.json()
    assert asgn_data["title"] == "Feelings Wheel: Afternoon Reset"
    asgn_id = asgn_data["id"]

    # List assignments
    list_res = client.get("/api/v1/educational-support/classrooms/cls_demo_sunflower/assignments")
    assert list_res.status_code == 200
    assignments = list_res.json()
    assert any(a["id"] == asgn_id for a in assignments)


def test_classroom_climate_privacy_protection():
    res = client.get("/api/v1/educational-support/classrooms/cls_demo_sunflower/climate")
    assert res.status_code == 200
    climate = res.json()
    assert "calm_percentage" in climate
    assert "restless_percentage" in climate
    assert "privacy_notice" in climate
    # Strict invariant: no raw child journal entries or private chats exposed
    assert "journal_entries" not in climate
    assert "chat_messages" not in climate
    assert "private" in climate["privacy_notice"].lower()
