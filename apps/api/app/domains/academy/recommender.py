"""Recommendation Engine for InnerOS Kids Development Academy.

Provides evidence-informed, non-diagnostic module recommendations based on:
- Target age band (2-5, 6-9, 10-12, 13-18)
- Learner or caregiver chosen goals (e.g., focus, friendship, calm, sleep, emotional literacy)
- Learning history / uncompleted modules
- Sensory and accessibility preferences (low-stimulation, dyslexia-friendly)

STRICT ETHICAL INVARIANT:
- Does NOT calculate or output IQ scores.
- Does NOT compute ADHD, autism, depression, or anxiety probability scores.
- Does NOT diagnose or predict clinical conditions.
"""

from typing import List, Dict, Set
from app.domains.academy.schemas import (
    CurriculumModule,
    RecommendationRequest,
    RecommendationResponse,
    ApprovalStatus,
)

# Goal mapping to relevant departments or keywords
GOAL_KEYWORD_MAP: Dict[str, Set[str]] = {
    "calm": {"self_regulation_coping", "healthy_habits_sleep", "breath", "calm", "soothe", "pause"},
    "focus": {"executive_functioning", "attention_planning", "adhd_friendly_support", "focus", "timer", "schedule"},
    "friendship": {"friendship_relationships", "empathy", "communication_skills", "kindness", "play", "boundary"},
    "emotions": {"emotional_intelligence", "emotional_vocabulary", "feelings", "affect", "labeling", "anger", "sad"},
    "safety": {"personal_safety_boundaries", "digital_safety", "bullying_prevention_help", "consent", "trusted adult"},
    "resilience": {"resilience_setbacks", "confidence_self_esteem", "growth", "try again", "grit", "mistakes"},
    "sensory": {"autism_friendly_support", "inclusive_learning_accessibility", "sensory", "quiet", "break"},
    "sleep": {"healthy_habits_sleep", "winddown", "bedtime", "rest"},
}


def recommend_modules(
    request: RecommendationRequest,
    all_modules: List[CurriculumModule],
    include_drafts: bool = True,
) -> RecommendationResponse:
    """Recommend modules ranked by age compatibility, goal match, and sensory fit."""
    target_age = request.age_range.strip()
    completed_set = set(request.completed_module_ids or [])
    chosen_goals_lower = [g.lower().strip() for g in (request.chosen_goals or [])]

    # Filter base pool
    pool: List[CurriculumModule] = []
    for mod in all_modules:
        if not include_drafts and mod.approval_status != ApprovalStatus.PUBLISHED:
            continue
        pool.append(mod)

    scored: List[tuple] = []
    for mod in pool:
        score = 0.0

        # Age matching: highest weight
        if mod.target_age_range == target_age:
            score += 50.0
        else:
            # Partial adjacent match
            score += 5.0

        # Completed module penalty (promote fresh learning experiences)
        if mod.module_id in completed_set:
            score -= 30.0
        else:
            score += 15.0

        # Goal alignment
        mod_text = f"{mod.department_id.value} {mod.title_en} {mod.developmental_objective}".lower()
        matched_goals = 0
        for goal in chosen_goals_lower:
            keywords = GOAL_KEYWORD_MAP.get(goal, {goal})
            if any(k in mod_text for k in keywords):
                score += 20.0
                matched_goals += 1

        # Sensory preferences
        if request.sensory_preference == "low_stimulation":
            if (
                mod.accessibility_adaptations.sensory
                and "low-stimulation" in mod.accessibility_adaptations.sensory.lower()
            ) or mod.department_id.value in ["self_regulation_coping", "autism_friendly_support"]:
                score += 10.0

        scored.append((score, mod))

    # Sort descending by score
    scored.sort(key=lambda x: x[0], reverse=True)
    recommended = [m for _, m in scored]

    age_band_labels = {
        "2-5": "Early Childhood (Ages 2–5)",
        "6-9": "Junior Young (Ages 6–9)",
        "10-12": "Junior Older (Ages 10–12)",
        "13-18": "Youth & Adolescents (Ages 13–18)",
    }
    age_display = age_band_labels.get(target_age, f"Age Group {target_age}")

    goals_str = ", ".join(request.chosen_goals) if request.chosen_goals else "holistic emotional growth"
    reason = (
        f"Selected {len(recommended)} evidence-aligned learning modules tailored for {age_display}, "
        f"focused on {goals_str}, prioritizing uncompleted lessons and your sensory comfort preferences."
    )

    return RecommendationResponse(
        recommended_modules=recommended[:8],  # Return top 8 best recommendations
        primary_recommendation_reason=reason,
        age_band_display=age_display,
    )
