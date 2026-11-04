import pytest
from app.db.database import SessionLocal
from app.db.models import EducationalQuestionModel, EducationalActivityEventModel

def test_question_bank_exact_distribution_and_schema():
    session = SessionLocal()
    try:
        count = session.query(EducationalQuestionModel).count()
        assert count == 3000, f"Expected 3000 questions in database, found {count}"

        # Category breakdowns
        expected_cats = {
            "emotional_vocabulary": 400,
            "language_and_communication": 400,
            "cognitive_development": 450,
            "science_and_discovery": 350,
            "social_skills": 350,
            "mathematics": 350,
            "life_skills": 300,
            "creativity": 250,
            "routines_and_executive_skills": 150,
        }

        for cat, expected in expected_cats.items():
            actual = session.query(EducationalQuestionModel).filter_by(category=cat).count()
            assert actual == expected, f"Category {cat} expected {expected}, got {actual}"

        # Test first approved/published question contains trilingual scripts
        first_q = session.query(EducationalQuestionModel).filter_by(review_status="published").first()
        assert first_q is not None
        assert len(first_q.text_en) > 5
        assert len(first_q.text_ur) > 5
        assert len(first_q.text_pa) > 5
        assert first_q.correct_answer_or_rubric is not None
        assert first_q.curriculum_version == "v2.4.0"

        # Test review status distribution
        published = session.query(EducationalQuestionModel).filter_by(review_status="published").count()
        assert published >= 100, "Investor demonstration requires at least 100 published approved questions"

    finally:
        session.close()

def test_educational_activity_event_recording():
    import uuid
    session = SessionLocal()
    unique_id = f"evt_test_{uuid.uuid4().hex[:8]}"
    try:
        event = EducationalActivityEventModel(
            id=unique_id,
            student_pseudonymous_id="std_pseudonymous_test",
            activity_id="q_math_0001",
            learning_objective="Equal partition division into 3 groups",
            completion_status="completed",
            hints_used_count=1,
            language_used="ur",
            duration_seconds=150,
            curriculum_version="v2.4.0",
        )
        session.add(event)
        session.commit()

        retrieved = session.query(EducationalActivityEventModel).filter_by(id=unique_id).first()
        assert retrieved is not None
        assert retrieved.student_pseudonymous_id == "std_pseudonymous_test"
        assert retrieved.learning_objective == "Equal partition division into 3 groups"
        assert retrieved.hints_used_count == 1
    finally:
        session.close()
