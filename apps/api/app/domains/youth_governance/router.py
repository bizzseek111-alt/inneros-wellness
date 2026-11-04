"""FastAPI Router for InnerOS Kids & Youth Governance, Safeguarding & Privacy.

Prefix: `/api/v1/youth-governance`
Tags: ["Youth Governance, Safeguarding & Privacy"]
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Request, status

from app.core.security import UserContext, UserRole, get_current_user, require_role
from app.domains.youth_governance.schemas import (
    ChildProfileCreate,
    ChildProfileUpdate,
    ChildProfileResponse,
    CaregiverChildLinkCreate,
    CaregiverChildLinkResponse,
    ConsentRecordCreate,
    ConsentRecordResponse,
    YouthActivityCreate,
    YouthActivityResponse,
    VoiceSessionMetadataCreate,
    VoiceSessionMetadataResponse,
    SafetyEscalationIncidentCreate,
    SafetyEscalationIncidentUpdate,
    SafetyEscalationIncidentResponse,
    ReferralResourceCreate,
    ReferralResourceResponse,
    DeletionRequestCreate,
    DeletionRequestResponse,
    ParentDashboardSummary,
    AdminDashboardSummary,
)
from app.domains.youth_governance.service import youth_governance_service

router = APIRouter(prefix="/youth-governance", tags=["Youth Governance, Safeguarding & Privacy"])


# -----------------------------------------------------------------------------
# 1. Child Profiles & Caregiver Links
# -----------------------------------------------------------------------------

@router.post("/profiles", response_model=ChildProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_child_profile(
    data: ChildProfileCreate,
    current_user: UserContext = Depends(get_current_user),
):
    """Creates a minimized child profile linked to the authenticated caregiver."""
    return youth_governance_service.create_child_profile(guardian_id=current_user.user_id, data=data)


@router.get("/profiles/{child_id}", response_model=ChildProfileResponse)
async def get_child_profile(
    child_id: str,
    current_user: UserContext = Depends(get_current_user),
):
    """Retrieves child profile details enforcing object-level caregiver or oversight authorization."""
    return youth_governance_service.get_child_profile(child_id=child_id, requester=current_user)


@router.put("/profiles/{child_id}", response_model=ChildProfileResponse)
async def update_child_profile(
    child_id: str,
    updates: ChildProfileUpdate,
    current_user: UserContext = Depends(get_current_user),
):
    """Updates child profile settings (screen time, sensory mode, language) by verified caregiver."""
    return youth_governance_service.update_child_profile(
        child_id=child_id, updates=updates, guardian_id=current_user.user_id
    )


@router.delete("/profiles/{child_id}")
async def delete_child_profile_endpoint(
    child_id: str,
    current_user: UserContext = Depends(get_current_user),
):
    """Deletes an authorized child profile by verified caregiver."""
    success = youth_governance_service.delete_child_profile(child_id=child_id, guardian_id=current_user.user_id)
    return {"success": success, "deleted_child_id": child_id}


@router.get("/guardians/{guardian_id}/children", response_model=List[ChildProfileResponse])
async def list_children_for_guardian(
    guardian_id: str,
    current_user: UserContext = Depends(get_current_user),
):
    """Lists all verified child profiles linked to a guardian."""
    # Ensure caregiver can only view their own children unless admin
    effective_guardian = guardian_id if current_user.role == UserRole.ADMIN else current_user.user_id
    return youth_governance_service.list_children_for_guardian(guardian_id=effective_guardian)


@router.post("/caregiver-links", response_model=CaregiverChildLinkResponse, status_code=status.HTTP_201_CREATED)
async def link_caregiver_to_child(
    data: CaregiverChildLinkCreate,
    current_user: UserContext = Depends(get_current_user),
):
    """Attests and verifies caregiver parental authority over a child profile."""
    return youth_governance_service.link_caregiver(caregiver_id=current_user.user_id, data=data)


# -----------------------------------------------------------------------------
# 2. Consent & Assent Workflows
# -----------------------------------------------------------------------------

@router.post("/consent", response_model=ConsentRecordResponse, status_code=status.HTTP_201_CREATED)
async def record_consent(
    data: ConsentRecordCreate,
    request: Request,
    current_user: UserContext = Depends(get_current_user),
):
    """Records Verifiable Parental Consent (COPPA/GDPR-K) or Teen Digital Assent."""
    client_ip = request.client.host if request.client else None
    return youth_governance_service.record_consent(
        data=data, signatory_user_id=current_user.user_id, ip_address=client_ip
    )


@router.post("/consent/{consent_id}/revoke", response_model=dict)
async def revoke_consent(
    consent_id: str,
    current_user: UserContext = Depends(get_current_user),
):
    """Revokes a previously granted parental consent or digital assent."""
    success = youth_governance_service.revoke_consent(
        consent_id=consent_id, requester_user_id=current_user.user_id
    )
    return {"success": success, "consent_id": consent_id, "status": "revoked"}


@router.get("/consent/{subject_id}", response_model=List[ConsentRecordResponse])
async def list_consent_history(
    subject_id: str,
    current_user: UserContext = Depends(get_current_user),
):
    """Retrieves full consent versioning and revocation audit trail for a child or teen."""
    return youth_governance_service.list_consents_for_subject(subject_id=subject_id)


# -----------------------------------------------------------------------------
# 3. Learning Activities & Progress
# -----------------------------------------------------------------------------

@router.post("/activities", response_model=YouthActivityResponse, status_code=status.HTTP_201_CREATED)
async def record_activity(
    data: YouthActivityCreate,
    current_user: UserContext = Depends(get_current_user),
):
    """Records completion of an educational lesson stage without clinical labeling."""
    return youth_governance_service.record_activity(data=data)


@router.get("/activities/{child_id}", response_model=List[YouthActivityResponse])
async def list_activities_for_child(
    child_id: str,
    current_user: UserContext = Depends(get_current_user),
):
    """Lists educational milestones for a child profile with object-level authorization."""
    return youth_governance_service.list_activities_for_child(child_id=child_id, requester=current_user)


# -----------------------------------------------------------------------------
# 4. Voice Session Metadata (Zero Raw Audio Persistence)
# -----------------------------------------------------------------------------

@router.post("/voice-metadata", response_model=VoiceSessionMetadataResponse, status_code=status.HTTP_201_CREATED)
async def record_voice_session_metadata(
    data: VoiceSessionMetadataCreate,
    current_user: UserContext = Depends(get_current_user),
):
    """Records technical latency and duration metrics. Strictly verifies no raw audio is saved."""
    return youth_governance_service.record_voice_metadata(data=data)


# -----------------------------------------------------------------------------
# 5. Safety Escalation & Safeguarding (Restricted Role Access)
# -----------------------------------------------------------------------------

@router.post("/safety-incidents", response_model=SafetyEscalationIncidentResponse, status_code=status.HTTP_201_CREATED)
async def create_safety_incident(
    data: SafetyEscalationIncidentCreate,
):
    """Trips safety circuit breaker and records restricted safeguarding incident for clinical review."""
    return youth_governance_service.create_safety_incident(data=data)


@router.get("/safety-incidents", response_model=List[SafetyEscalationIncidentResponse])
async def list_safety_incidents(
    current_user: UserContext = Depends(get_current_user),
):
    """Lists safety escalation incidents. Restricted strictly to safeguarding, clinician, and admin roles."""
    return youth_governance_service.list_safety_incidents(requester=current_user)


@router.put("/safety-incidents/{incident_id}", response_model=SafetyEscalationIncidentResponse)
async def update_safety_incident(
    incident_id: str,
    updates: SafetyEscalationIncidentUpdate,
    current_user: UserContext = Depends(get_current_user),
):
    """Assigns certified reviewer and records clinical resolution or referral status."""
    return youth_governance_service.update_safety_incident(
        incident_id=incident_id, updates=updates, reviewer=current_user
    )


# -----------------------------------------------------------------------------
# 6. Referral Directory Management
# -----------------------------------------------------------------------------

@router.get("/referrals", response_model=List[ReferralResourceResponse])
async def list_referral_resources(
    country_code: Optional[str] = Query(None, description="ISO country code: PK, US, GB, CA, GLOBAL"),
):
    """Returns verified 24/7 crisis hotlines and youth distress services."""
    return youth_governance_service.list_referrals(country_code=country_code)


@router.post("/referrals", response_model=ReferralResourceResponse, status_code=status.HTTP_201_CREATED)
async def create_referral_resource(
    data: ReferralResourceCreate,
    current_user: UserContext = Depends(require_role([UserRole.ADMIN, UserRole.SAFEGUARDING])),
):
    """Registers a verified crisis support service in the directory."""
    return youth_governance_service.create_referral(data=data)


# -----------------------------------------------------------------------------
# 7. Right to be Forgotten / Deletion Schedules
# -----------------------------------------------------------------------------

@router.post("/retention/delete", response_model=DeletionRequestResponse)
async def request_data_deletion(
    data: DeletionRequestCreate,
    current_user: UserContext = Depends(get_current_user),
):
    """Executes Right-to-be-Forgotten deletion under COPPA / GDPR-K, purging all profile records."""
    return youth_governance_service.request_deletion(data=data, requester_id=current_user.user_id)


# -----------------------------------------------------------------------------
# 8. Dashboards Aggregations
# -----------------------------------------------------------------------------

@router.get("/parent-dashboard", response_model=ParentDashboardSummary)
async def get_parent_dashboard(
    current_user: UserContext = Depends(get_current_user),
):
    """Aggregates child progress, screen-time boundaries, and family exercises for the caregiver."""
    return youth_governance_service.get_parent_dashboard(caregiver_id=current_user.user_id)


@router.get("/admin-dashboard", response_model=AdminDashboardSummary)
async def get_admin_dashboard(
    current_user: UserContext = Depends(get_current_user),
):
    """Aggregates platform statistics, safety queues, voice provider latency, and feature flags."""
    return youth_governance_service.get_admin_dashboard(requester=current_user)
