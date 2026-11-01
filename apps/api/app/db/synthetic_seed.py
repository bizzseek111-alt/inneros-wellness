"""InnerOS Synthetic Data Seeder.
Generates 100% synthetic persona fixtures for local development and CI testing.
NO real patient data or PII is used.
"""

from typing import Dict, Any


SYNTHETIC_PERSONA: Dict[str, Any] = {
    "user_id": "usr_synthetic_elena_vance_001",
    "name": "Elena Vance",
    "preferred_name": "Elena",
    "role": "Staff Product Designer",
    "primary_goals": [
        "Reduce late-night rumination after complex cross-functional alignment meetings",
        "Build a sustainable morning grounding routine before screen exposure",
        "Cultivate emotional self-compassion when projects pivot rapidly",
    ],
    "life_graph_nodes": [
        {"id": "node_work_lead", "label": "Design Systems Lead", "type": "role"},
        {"id": "node_habit_walk", "label": "Sunset 20-min Nature Walk", "type": "habit"},
        {"id": "node_stressor_reviews", "label": "Back-to-Back Critiques", "type": "stress_trigger"},
        {"id": "node_value_craft", "label": "Deep Focus Craftsmanship", "type": "core_value"},
    ],
    "life_graph_edges": [
        {"source": "node_work_lead", "relation": "generates", "target": "node_stressor_reviews"},
        {"source": "node_habit_walk", "relation": "de_escalates", "target": "node_stressor_reviews"},
        {"source": "node_value_craft", "relation": "anchors", "target": "node_habit_walk"},
    ],
    "synthetic_journal_reflections": [
        {
            "date": "2026-10-28",
            "mood_valence": "reflective",
            "score": 7.5,
            "entry": "Felt a surge of anxiety around 3 PM during the quarterly roadmap review. Used 4-4-4-4 box breathing in my chair without anyone noticing. Dropped my shoulders and returned to presence.",
        },
        {
            "date": "2026-10-30",
            "mood_valence": "calm",
            "score": 8.5,
            "entry": "Took the full 20-minute walk at dusk. The autumn air was crisp. Realized that not every design comment requires an immediate rebuttal. Defusion is helping me listen without defensive urgency.",
        },
    ],
}


def get_synthetic_seed_data() -> Dict[str, Any]:
    return SYNTHETIC_PERSONA


if __name__ == "__main__":
    import json
    print(json.dumps(get_synthetic_seed_data(), indent=2))
