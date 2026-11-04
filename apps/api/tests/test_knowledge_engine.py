"""Automated Test Suite for the InnerOS Psychology Knowledge Engine.
Verifies taxonomy coverage across 17 departments, evidence-quality grading,
context-sensitive retrieval quality, source provenance and APA citations,
pop-psychology distinction, prohibited clinical outputs, rights licensing, and review workflows.
"""

import pytest
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from app.main import app
from app.domains.knowledge.schemas import (
    PsychologyDepartment,
    EvidenceQualityLevel,
    ReviewStatus,
)
from app.domains.knowledge.taxonomy import PSYCHOLOGY_TAXONOMY
from app.domains.knowledge.orchestrator import knowledge_orchestrator

client = TestClient(app)


# 1. Department Taxonomy Verification (17 Major Fields)
def test_all_17_psychology_departments_in_taxonomy():
    assert len(PSYCHOLOGY_TAXONOMY) == 17
    expected_depts = [
        "clinical", "counseling", "cognitive", "behavioral", "social",
        "personality", "developmental", "relationship_family_intimacy",
        "organizational", "health", "neuropsychology", "addiction",
        "trauma_crisis", "cultural", "educational", "performance_sport", "positive",
    ]
    for dept_str in expected_depts:
        dept_enum = PsychologyDepartment(dept_str)
        assert dept_enum in PSYCHOLOGY_TAXONOMY
        info = PSYCHOLOGY_TAXONOMY[dept_enum]
        assert info.name is not None and len(info.name) > 0
        assert len(info.core_theories) > 0
        assert len(info.sample_subfields) > 0
        b_lower = info.non_clinical_boundary.lower()
        assert any(neg in b_lower for neg in ["not", "zero", "does not", "never", "no "])


def test_api_list_departments():
    res = client.get("/api/v1/knowledge/departments")
    assert res.status_code == 200
    depts = res.json()
    assert len(depts) == 17
    dept_names = [d["name"] for d in depts]
    assert "Clinical Psychology" in dept_names
    assert "Positive Psychology & Wellbeing Science" in dept_names
    assert "Neuropsychology & Affective Neuroscience" in dept_names
    assert "Relationship, Family & Intimacy Psychology" in dept_names


def test_api_get_department_details():
    res = client.get("/api/v1/knowledge/departments/clinical")
    assert res.status_code == 200
    data = res.json()
    assert data["department"] == "clinical"
    assert "Cognitive Behavioral Therapy (CBT)" in data["core_theories"]
    assert "Zero autonomous diagnosis" in data["non_clinical_boundary"]


# 2. Context-Sensitive Retrieval Quality
def test_context_retrieval_for_cognitive_rumination():
    res = client.post(
        "/api/v1/knowledge/retrieve-context",
        json={
            "utterance": "I can't stop having anxious thoughts and ruminating about my failure",
            "emotional_state": "anxiety",
            "conversation_mode": "teach_me",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["retrieved_count"] >= 1
    # Check that ACT cognitive defusion or Polyvagal was prioritized
    retrieved_ids = [r["id"] for r in data["records"]]
    assert "record_act_cognitive_defusion" in retrieved_ids or "record_polyvagal_vagal_brake" in retrieved_ids
    # Check APA citation inclusion in context synthesis
    assert "Hayes" in data["context_synthesis"] or "Porges" in data["context_synthesis"]
    # Check non-clinical orchestrator notice
    assert "not a licensed human psychologist" in data["orchestrator_notice"].lower()


def test_context_retrieval_for_somatic_settling():
    res = client.post(
        "/api/v1/knowledge/retrieve-context",
        json={
            "utterance": "My heart is beating fast and I feel intense physical panic sensations",
            "emotional_state": "panic_sensations",
            "conversation_mode": "help_me_settle",
        },
    )
    assert res.status_code == 200
    data = res.json()
    retrieved_ids = [r["id"] for r in data["records"]]
    assert "record_polyvagal_vagal_brake" in retrieved_ids


# 3. Source Provenance and Citation Integrity
def test_source_provenance_and_citations():
    records = knowledge_orchestrator.list_records(peer_reviewed_only=True)
    assert len(records) >= 5
    for r in records:
        assert len(r.citations) >= 1
        cit = r.citations[0]
        # Must have valid APA citation format
        assert "(" in cit.apa_citation and ")" in cit.apa_citation
        assert cit.study_type in ["meta_analysis", "systematic_review", "rct", "longitudinal_cohort", "clinical_consensus", "trade_book"]
        assert cit.replication_status in ["replicated", "established_consensus", "preliminary", "under_debate"]

        # Publications metadata
        assert len(r.publications) >= 1
        pub = r.publications[0]
        assert pub.authors is not None and len(pub.authors) >= 1
        assert pub.year > 1900
        assert pub.publisher_or_journal is not None


# 4. Evidence-Quality Classification & Pop-Psychology Distinction
def test_scientific_vs_pop_psychology_distinction():
    all_records = knowledge_orchestrator.list_records()
    pop_records = [r for r in all_records if r.evidence_level == EvidenceQualityLevel.LEVEL_7_TRADE_POP_PSYCHOLOGY]
    assert len(pop_records) >= 1
    for pop_rec in pop_records:
        # Must be explicitly marked as not peer-reviewed scientific literature
        assert pop_rec.is_peer_reviewed_scientific is False
        assert pop_rec.rights_and_licensing.license_type == "academic_fair_use_summary"
        # Must not be allowed in autonomous companion chat
        assert pop_rec.usage_restrictions.allowed_in_companion_chat is False
        assert "Trade self-help publication" in pop_rec.usage_restrictions.non_clinical_disclaimer

    # Verify search with peer_reviewed_only=True excludes pop-psychology
    filtered_res = client.get("/api/v1/knowledge/search?peer_reviewed_only=true")
    assert filtered_res.status_code == 200
    for r in filtered_res.json():
        assert r["is_peer_reviewed_scientific"] is True
        assert r["evidence_level"] != "level_7_trade_pop_psychology"


# 5. Prohibited Clinical Outputs & Boundaries
def test_prohibited_clinical_diagnoses_and_prescriptions():
    records = knowledge_orchestrator.list_records()
    for r in records:
        # Non-negotiable restrictions
        assert r.usage_restrictions.prohibited_for_diagnosis is True
        assert r.usage_restrictions.prohibited_for_prescription is True

        # Textual audit: Ensure knowledge text never claims to diagnose or prescribe
        full_text = f"{r.title} {r.short_summary} {r.full_explanation}".lower()
        assert "i diagnose" not in full_text
        assert "prescribe 50mg" not in full_text
        assert "dosage of" not in full_text
        assert "stop taking your medication" not in full_text


# 6. Rights and Licensing Verification
def test_rights_and_licensing_integrity():
    records = knowledge_orchestrator.list_records()
    for r in records:
        lic = r.rights_and_licensing
        assert lic.rights_verified is True
        assert lic.copyright_owner is not None
        assert lic.license_type in [
            "open_access_cc_by",
            "academic_fair_use_summary",
            "original_proprietary",
            "commercial_rights_verified",
            "public_domain",
        ]


# 7. Content Review & Approval Lifecycle Workflow
def test_review_action_workflow():
    record_id = "record_act_cognitive_defusion"
    # Submit review decision
    res = client.post(
        f"/api/v1/knowledge/records/{record_id}/review",
        json={
            "reviewer_id": "rev_dr_test_reviewer",
            "reviewer_name": "Dr. Alex Taylor, PhD",
            "reviewer_credentials": "PhD in Cognitive Science, Board Reviewer",
            "decision": "approved_for_companion",
            "notes": "Verified annual re-certification. Citations and non-clinical guardrails confirmed.",
            "next_review_months": 12,
        },
        headers={"X-User-Role": "content_reviewer"},
    )
    assert res.status_code == 200

    data = res.json()
    assert data["review_status"] == "approved_for_companion"
    latest_review = data["review_history"][-1]
    assert latest_review["reviewer_name"] == "Dr. Alex Taylor, PhD"
    assert latest_review["review_decision"] == "approved_for_companion"


def test_expired_knowledge_record_withheld_from_companion():
    """If a record's review due date has passed, it must not be served to the companion."""
    record = knowledge_orchestrator.get_record("record_attachment_adult_security")
    assert record is not None
    # Temporarily set review date into the past
    original_due = record.next_review_due_at
    try:
        record.next_review_due_at = datetime.now(timezone.utc) - timedelta(days=10)
        # Attempt retrieval
        retrieval = knowledge_orchestrator.retrieve_context(
            utterance="I have an anxious attachment style in relationships",
            emotional_state="relationship_conflict",
            max_records=5,
        )
        retrieved_ids = [r.id for r in retrieval.records]
        assert "record_attachment_adult_security" not in retrieved_ids
    finally:
        # Restore review date
        record.next_review_due_at = original_due


# 8. Quality Assurance and Licensing Audit Summary
def test_admin_quality_audit_summary():
    res = client.get("/api/v1/knowledge/audit-summary")
    assert res.status_code == 200
    audit = res.json()
    assert audit["total_records"] >= 7
    assert audit["scientific_peer_reviewed_count"] >= 6
    assert audit["trade_pop_psychology_count"] >= 1
    assert "by_department" in audit
    assert "by_evidence_tier" in audit
    assert "by_review_status" in audit
    assert "orchestrator_notice" in audit
    assert "not a licensed human psychologist" in audit["orchestrator_notice"].lower()
