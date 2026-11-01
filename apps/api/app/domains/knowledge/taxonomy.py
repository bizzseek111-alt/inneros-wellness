"""Psychology Department Taxonomy Engine.
Comprehensive taxonomy accommodating the 17 major fields of psychology,
their theoretical models, subdisciplines, and explicit non-clinical boundaries.
"""

from typing import Dict, List
from app.domains.knowledge.schemas import (
    PsychologyDepartment,
    DepartmentTaxonomyInfo,
)

PSYCHOLOGY_TAXONOMY: Dict[PsychologyDepartment, DepartmentTaxonomyInfo] = {
    PsychologyDepartment.CLINICAL: DepartmentTaxonomyInfo(
        department=PsychologyDepartment.CLINICAL,
        name="Clinical Psychology",
        scope_description=(
            "Evidence-based understanding of mental distress, psychopathology mechanisms, and therapeutic frameworks (CBT, ACT, DBT). "
            "In InnerOS, restricted strictly to psychoeducation, symptom awareness, and grounding."
        ),
        core_theories=[
            "Cognitive Behavioral Therapy (CBT)",
            "Acceptance and Commitment Therapy (ACT)",
            "Dialectical Behavior Therapy (DBT)",
            "Psychodynamic & Object Relations Theory",
        ],
        sample_subfields=["Cognitive restructuring", "Defusion", "Exposure principles", "Distress tolerance"],
        non_clinical_boundary="Zero autonomous diagnosis of DSM/ICD disorders. Zero prescription or medication management.",
    ),
    PsychologyDepartment.COUNSELING: DepartmentTaxonomyInfo(
        department=PsychologyDepartment.COUNSELING,
        name="Counseling Psychology",
        scope_description="Focuses on facilitating personal and interpersonal functioning across life spans, emphasizing emotional growth, strengths, and life transitions.",
        core_theories=["Person-Centered Therapy (Carl Rogers)", "Existential Psychology", "Solution-Focused Brief Therapy (SFBT)"],
        sample_subfields=["Unconditional positive regard", "Empathic reflection", "Life transition navigation"],
        non_clinical_boundary="Does not replace a licensed professional counselor for severe distress or relational abuse.",
    ),
    PsychologyDepartment.COGNITIVE: DepartmentTaxonomyInfo(
        department=PsychologyDepartment.COGNITIVE,
        name="Cognitive Psychology",
        scope_description="Scientific study of mental processes including attention, memory, perception, language, problem solving, and cognitive biases.",
        core_theories=["Dual-Process Theory (System 1 & System 2)", "Working Memory Model (Baddeley)", "Schema Theory"],
        sample_subfields=["Attentional control", "Cognitive reappraisal", "Memory consolidation", "Heuristics and biases"],
        non_clinical_boundary="Educational exploration of thinking patterns, not neuropsychological diagnostic evaluation.",
    ),
    PsychologyDepartment.BEHAVIORAL: DepartmentTaxonomyInfo(
        department=PsychologyDepartment.BEHAVIORAL,
        name="Behavioral Psychology",
        scope_description="Mechanisms of learning, conditioning, habit formation, environmental cueing, and behavioral reinforcement.",
        core_theories=["Operant Conditioning (Skinner)", "Classical Conditioning (Pavlov)", "Behavioral Activation"],
        sample_subfields=["Habit loops (Cue-Routine-Reward)", "Stimulus control", "Extinction and reinforcement schedules"],
        non_clinical_boundary="Used for personal productivity and self-care pacing; not aversion therapy or clinical behavior modification.",
    ),
    PsychologyDepartment.SOCIAL: DepartmentTaxonomyInfo(
        department=PsychologyDepartment.SOCIAL,
        name="Social Psychology",
        scope_description="Investigation of how individuals' thoughts, feelings, and behaviors are influenced by actual, imagined, or implied presence of others.",
        core_theories=["Social Identity Theory (Tajfel)", "Cognitive Dissonance (Festinger)", "Attribution Theory"],
        sample_subfields=["Fundamental attribution error", "Conformity and group dynamics", "Intergroup bias"],
        non_clinical_boundary="Does not take sides in external legal or domestic disputes; educational analysis of interpersonal dynamics only.",
    ),
    PsychologyDepartment.PERSONALITY: DepartmentTaxonomyInfo(
        department=PsychologyDepartment.PERSONALITY,
        name="Personality Psychology",
        scope_description="Empirical study of characteristic patterns of thinking, feeling, and behaving across the lifespan.",
        core_theories=["Five-Factor Model (Big Five / OCEAN)", "HEXACO Model", "Trait vs. State Theory"],
        sample_subfields=["Neuroticism and emotional stability", "Introversion / Extraversion", "Trait conscientiousness"],
        non_clinical_boundary="Educational self-reflection only; does not issue diagnostic personality disorder evaluations.",
    ),
    PsychologyDepartment.DEVELOPMENTAL: DepartmentTaxonomyInfo(
        department=PsychologyDepartment.DEVELOPMENTAL,
        name="Developmental Psychology",
        scope_description="Understanding growth, change, and consistency from infancy through older adulthood.",
        core_theories=["Psychosocial Stages (Erik Erikson)", "Cognitive Development (Piaget)", "Life-Span Developmental Theory (Baltes)"],
        sample_subfields=["Identity formation in adulthood", "Generativity vs. Stagnation", "Neuroplasticity in aging"],
        non_clinical_boundary="Educational context for life stages; not developmental pediatric diagnostic assessments.",
    ),
    PsychologyDepartment.RELATIONSHIP_FAMILY_INTIMACY: DepartmentTaxonomyInfo(
        department=PsychologyDepartment.RELATIONSHIP_FAMILY_INTIMACY,
        name="Relationship, Family & Intimacy Psychology",
        scope_description="Dynamics of interpersonal attachment, marital/couple communication, family systems, boundaries, and emotional intimacy.",
        core_theories=["Attachment Theory (Bowlby, Ainsworth)", "Sound Relationship House (Gottman)", "Family Systems Theory (Bowen)"],
        sample_subfields=["Attachment styles (Secure, Anxious, Avoidant)", "Four Horsemen of communication", "Differentiation of self"],
        non_clinical_boundary="Facilitates personal communication skills; does not provide formal couples therapy or mediate custody/divorce.",
    ),
    PsychologyDepartment.ORGANIZATIONAL: DepartmentTaxonomyInfo(
        department=PsychologyDepartment.ORGANIZATIONAL,
        name="Organizational & Occupational Psychology",
        scope_description="Application of psychological principles to workplace performance, leadership, team dynamics, work-life balance, and occupational burnout.",
        core_theories=["Job Demands-Resources Model (JD-R)", "Psychological Safety (Edmondson)", "Leader-Member Exchange (LMX)"],
        sample_subfields=["Burnout prevention", "Boundary negotiation", "Impostor phenomenon in leadership"],
        non_clinical_boundary="Assists with personal workplace boundary setting; does not provide legal labor counsel or HR mediation.",
    ),
    PsychologyDepartment.HEALTH: DepartmentTaxonomyInfo(
        department=PsychologyDepartment.HEALTH,
        name="Health Psychology",
        scope_description="Study of psychological and behavioral processes in health, illness, and healthcare, emphasizing the biopsychosocial model.",
        core_theories=["Biopsychosocial Model (Engel)", "Allostatic Load Theory (McEwen)", "Health Belief Model"],
        sample_subfields=["Circadian rhythm regulation", "Chronic stress physiology", "Psychoneuroimmunology"],
        non_clinical_boundary="Does not diagnose medical ailments, prescribe diets, or alter medical treatment regimens.",
    ),
    PsychologyDepartment.NEUROPSYCHOLOGY: DepartmentTaxonomyInfo(
        department=PsychologyDepartment.NEUROPSYCHOLOGY,
        name="Neuropsychology & Affective Neuroscience",
        scope_description="Exploration of the brain structures, neurochemical pathways, and nervous system dynamics governing emotion and executive function.",
        core_theories=["Polyvagal Theory (Porges)", "Affective Neuroscience (Panksepp)", "Triune Brain & Executive Function Networks"],
        sample_subfields=["Amygdala reactivity & vagal tone", "Prefrontal down-regulation", "Neuroplasticity in self-regulation"],
        non_clinical_boundary="Purely psychoeducational brain science; never diagnoses concussion, stroke, epilepsy, or dementia.",
    ),
    PsychologyDepartment.ADDICTION: DepartmentTaxonomyInfo(
        department=PsychologyDepartment.ADDICTION,
        name="Addiction & Recovery Psychology",
        scope_description="Mechanisms of compulsive behaviors, dopamine reward circuitry, craving tolerance, and harm reduction.",
        core_theories=["Transtheoretical Model of Change (Prochaska & DiClemente)", "Harm Reduction Model", "Relapse Prevention (Marlatt)"],
        sample_subfields=["Urge surfing", "Stages of change", "Trigger mapping and habit substitution"],
        non_clinical_boundary="Educational support and habit grounding only. Does not manage acute chemical withdrawal, detox, or medical addiction treatment.",
    ),
    PsychologyDepartment.TRAUMA_CRISIS: DepartmentTaxonomyInfo(
        department=PsychologyDepartment.TRAUMA_CRISIS,
        name="Trauma & Crisis Psychology",
        scope_description="Understanding the impact of overwhelming life events, acute stress responses, somatic trauma holding, and crisis de-escalation.",
        core_theories=["Window of Tolerance (Siegel)", "Somatic Experiencing (Levine)", "Trauma-Informed Care Principles (SAMHSA)"],
        sample_subfields=["Nervous system hyperarousal & hypoarousal", "Sensory grounding", "Psychological First Aid"],
        non_clinical_boundary="Hard boundary: InnerOS does NOT conduct trauma reprocessing (e.g. EMDR, prolonged exposure). Hands off immediately to crisis resources during acute crisis.",
    ),
    PsychologyDepartment.CULTURAL: DepartmentTaxonomyInfo(
        department=PsychologyDepartment.CULTURAL,
        name="Cultural & Cross-Cultural Psychology",
        scope_description="Examination of how cultural contexts, collective values, acculturation, and social diversity shape psychological processes and emotional expression.",
        core_theories=["Cultural Dimensions Theory (Hofstede)", "Acculturation Framework (Berry)", "Collectivism vs. Individualism"],
        sample_subfields=["Intergenerational cultural conflict", "Somatic vs. cognitive idioms of distress", "Cross-cultural emotional display rules"],
        non_clinical_boundary="Does not stereotype or pathologize cultural traditions; cultural humility and context-aware reflection only.",
    ),
    PsychologyDepartment.EDUCATIONAL: DepartmentTaxonomyInfo(
        department=PsychologyDepartment.EDUCATIONAL,
        name="Educational Psychology & Learning Sciences",
        scope_description="How humans learn, retain information, and develop cognitive resilience in academic and intellectual contexts.",
        core_theories=["Zone of Proximal Development (Vygotsky)", "Cognitive Load Theory (Sweller)", "Growth Mindset (Dweck)"],
        sample_subfields=["Spaced repetition", "Metacognition and self-regulated learning", "Extrinsic vs. intrinsic motivation in learning"],
        non_clinical_boundary="Supports study pacing and intellectual reflection; does not diagnose learning disabilities (e.g. dyslexia).",
    ),
    PsychologyDepartment.PERFORMANCE_SPORT: DepartmentTaxonomyInfo(
        department=PsychologyDepartment.PERFORMANCE_SPORT,
        name="Performance & Sport Psychology",
        scope_description="Optimization of mental focus, arousal control, deliberate practice, and cognitive endurance under high stakes.",
        core_theories=["Yerkes-Dodson Law (Arousal & Performance)", "Deliberate Practice (Ericsson)", "Mental Rehearsal / Motor Imagery"],
        sample_subfields=["Choking under pressure", "Pre-performance routines", "Attentional narrowing under stress"],
        non_clinical_boundary="Mindset coaching and somatic pre-event grounding; not clinical treatment for performance phobias.",
    ),
    PsychologyDepartment.POSITIVE: DepartmentTaxonomyInfo(
        department=PsychologyDepartment.POSITIVE,
        name="Positive Psychology & Wellbeing Science",
        scope_description="Scientific investigation of what makes life worth living, flourishing, meaningful engagement, and positive emotional states.",
        core_theories=["Broaden-and-Build Theory (Fredrickson)", "PERMA Wellbeing Model (Seligman)", "Flow Theory (Csikszentmihalyi)"],
        sample_subfields=["Savoring and gratitude practices", "Character strengths (VIA)", "Eudaimonic vs. hedonic wellbeing"],
        non_clinical_boundary="Promotes intentional reflection on values and gratitude; never forces toxic positivity or invalidates genuine grief.",
    ),
}


def get_taxonomy_department(dept: PsychologyDepartment) -> DepartmentTaxonomyInfo:
    return PSYCHOLOGY_TAXONOMY[dept]


def list_all_taxonomy_departments() -> List[DepartmentTaxonomyInfo]:
    return list(PSYCHOLOGY_TAXONOMY.values())
