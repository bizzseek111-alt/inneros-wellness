"""FastAPI Router for InnerOS Kids Development Academy.

Provides REST endpoints for:
- 25 Evidence-Informed Curriculum Departments
- 20 Original Demonstration Lessons (5 per age band: 2-5, 6-9, 10-12, 13-18)
- Content Reviewer / CMS Approval Workflow
- Personalized Non-Diagnostic Recommendations
- Strict Ethical Invariants (Rejection of IQ tests, diagnostic scoring, or cures)
"""

from typing import List, Optional
from fastapi import APIRouter, Query, status

from app.domains.academy.schemas import (
    DepartmentInfo,
    CurriculumModule,
    CurriculumModuleCreate,
    CurriculumModuleUpdate,
    ApprovalActionRequest,
    ApprovalActionResponse,
    RecommendationRequest,
    RecommendationResponse,
)
from app.domains.academy.service import academy_service

router = APIRouter(prefix="/academy", tags=["Youth Development Academy"])


@router.get("/departments", response_model=List[DepartmentInfo])
async def list_departments():
    """List all 25 evidence-informed curriculum departments."""
    return academy_service.list_departments()


@router.get("/modules", response_model=List[CurriculumModule])
async def list_modules(
    department_id: Optional[str] = Query(None, description="Filter by department ID"),
    age_band: Optional[str] = Query(None, description="Filter by age band: '2-5', '6-9', '10-12', '13-18'"),
    approval_status: Optional[str] = Query(None, description="Filter by status: 'draft', 'published', etc."),
    is_reviewer: bool = Query(False, description="When true, reveals draft and unapproved content"),
):
    """List curriculum modules with role-aware publication gating."""
    return academy_service.list_modules(
        department_id=department_id,
        age_band=age_band,
        approval_status=approval_status,
        is_reviewer=is_reviewer,
    )


@router.get("/modules/{module_id}", response_model=CurriculumModule)
async def get_module(
    module_id: str,
    is_reviewer: bool = Query(False, description="Reviewer authorization toggle"),
):
    """Retrieve full curriculum module details by ID."""
    return academy_service.get_module(module_id=module_id, is_reviewer=is_reviewer)


@router.post("/modules", response_model=CurriculumModule, status_code=status.HTTP_201_CREATED)
async def create_module(
    data: CurriculumModuleCreate,
    reviewer_name: Optional[str] = Query("Curriculum Reviewer"),
):
    """Create a new curriculum module (initial status: DRAFT)."""
    return academy_service.create_module(data=data, reviewer_name=reviewer_name)


@router.put("/modules/{module_id}", response_model=CurriculumModule)
async def update_module(
    module_id: str,
    updates: CurriculumModuleUpdate,
):
    """Update metadata, translation, or content of an existing curriculum module."""
    return academy_service.update_module(module_id=module_id, updates=updates)


@router.post("/modules/{module_id}/approve", response_model=ApprovalActionResponse)
async def approve_module(
    module_id: str,
    action: ApprovalActionRequest,
):
    """Content management workflow: Approve, transition status, and publish/archive curriculum content."""
    # Ensure module_id matches payload
    action.module_id = module_id
    return academy_service.approve_module(action=action)


@router.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(
    request: RecommendationRequest,
    is_reviewer: bool = Query(False),
):
    """Generate personalized module recommendations based on age, goals, and sensory preferences."""
    return academy_service.get_recommendations(request=request, is_reviewer=is_reviewer)


@router.post("/dev/publish-all", response_model=dict)
async def publish_all_demonstration_lessons():
    """Development helper: Publish all demonstration lessons for previewing."""
    count = academy_service.publish_all_demonstration_lessons()
    return {"status": "success", "published_count": count}
