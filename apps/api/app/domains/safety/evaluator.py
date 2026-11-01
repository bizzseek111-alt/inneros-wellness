"""InnerOS Safety Evaluator Engine.
Deterministic Tier 1 heuristic classification enforcing non-clinical safety boundaries,
independent policy enforcement, pre-generation input filtering, and post-generation output guardrails.
Assesses UK, EU, Bulgaria, and US jurisdictions across all clinical risk domains.
"""

import re
from typing import List, Tuple, Optional
from app.domains.safety.schemas import (
    RiskLevel,
    SafetyCategory,
    SafetyEvaluationResponse,
    OutputSafetyEvaluation,
)
from app.domains.safety.hotlines import get_crisis_resources

# 1. Acute Crisis: Suicide & Self-Harm (Multilingual: EN, ES, DE, FR, AR, BG)
CRISIS_SUICIDE_PATTERNS = [
    # English
    r"\b(want to|going to|thinking of|planning to|plan to)\s+(die|dying|kill myself|killing myself|end my life|ending my life|commit suicide|committing suicide)\b",
    r"\b(ending my life|end my life|kill myself|killing myself)\b",
    r"\b(suicidal|suicide|end it all|better off dead)\b",
    r"\b(cut myself|cutting myself|slit my wrists|take all my pills|overdose)\b",
    r"\b(goodbye cruel world|don'?t want to wake up anymore)\b",
    r"\bhow to (hang myself|kill myself|commit suicide)\b",
    # Spanish
    r"\b(quiero morir|me quiero suicidar|quitarme la vida|acabar con todo|no quiero vivir)\b",
    # German
    r"\b(ich will sterben|ich will nicht mehr leben|mich umbringen|suizid begehen)\b",
    # French
    r"\b(je veux mourir|me suicider|en finir avec la vie)\b",
    # Arabic
    r"(أريد أن أموت|أريد الانتحار|إنهاء حياتي|سأقتل نفسي)",
    # Bulgarian (Cyrillic)
    r"(искам да се самоубия|ще сложа край на живота си|искам да умра|не издържам искам да умра|ще се хвърля|ще взема всички хапчета|по-добре да съм мъртъв|по-добре да съм мъртва|не искам да живея)",
]

# 2. Violence & Harm to Others
VIOLENCE_PATTERNS = [
    r"\b(going to|want to|planning to)\s+(kill|murder|shoot|stab|hurt|attack)\b",
    r"\b(want to|going to)\s+stab\b",
    r"\b(bomb|massacre|attack the school|attack the office)\b",
    r"\b(quiero matar a|voy a matar a)\b",
    r"\b(ich will .* ermorden|ich bringe .* um)\b",
    r"(ще го убия|ще я убия|ще пребия|ще намушкам)",
]

# 3. Medical, Prescription & Diagnosis Queries
MEDICAL_ADVICE_PATTERNS = [
    r"\bwhat dosage of (zoloft|lexapro|prozac|xanax|adderall|lithium|effexor|wellbutrin|ativan|klonopin|valium)\b",
    r"\bhow do i taper off (antidepressants|ssri|benzos|xanax|medication)\b",
    r"\bdiagnose me with (bipolar|schizophrenia|borderline|ptsd|adhd|mdd|depression|anxiety disorder)\b",
    r"\bdo i have (bipolar|schizophrenia|borderline personality|ptsd|adhd|clinical depression)\b",
    r"\bshould i stop taking my medication\b",
    r"\bwhat medication should i take for\b",
    r"(каква доза|какво лекарство да пия|постави ми диагноза|имам ли биполярно)",
]

# 4. Domestic Abuse, Intimate Partner Violence & Coercion
DOMESTIC_ABUSE_PATTERNS = [
    r"\b(partner|husband|wife|boyfriend|girlfriend)\s+(hits|beats|chokes|punches|threatens|assaults|abuses)\s+me\b",
    r"\b(he|she)\s+(hits|beats|chokes|punches|bruised)\s+me\b",
    r"\bafraid of my (husband|wife|partner|boyfriend|girlfriend)\b",
    r"\b(partner|husband|boyfriend)\s+locks me in\b",
    r"\b(partner|husband|boyfriend)\s+monitors (all )?my (calls|messages|phone|emails)\b",
    r"\bscared (he|she|my partner) is going to hurt me\b",
    r"(партньорът ми ме бие|мъжът ми ме бие|страх ме е от партньора|заплашва ме с насилие|заключва ме вкъщи)",
]

# 5. Psychosis, Hallucinations & Delusions
DELUSION_PATTERNS = [
    r"\b(microchip|implant|listening device|tracking chip|camera)\s+(in my|under my)\s+(brain|skin|body|teeth|head|neck)\b",
    r"\b(poisoning|poisoned)\s+(my food|the water|the tap water|my drinks|the air)\b",
    r"\b(gang stalking|they are following me everywhere|government is spying on my thoughts|implanting thoughts in my mind)\b",
    r"\b(aliens|demons|shadow people) are (controlling my body|talking into my brain)\b",
    r"\bhearing voices (in my head|telling me to|that aren'?t there)\b",
    r"(чип в главата|отравят ми храната|следят ми мислите|чувам гласове)",
]

# 6. Mania & Bipolar Escalation
MANIA_PATTERNS = [
    r"\b(haven'?t slept in (3|4|5|6|7|several) days and feel (invincible|godlike|limitless|like a god))\b",
    r"\b(racing thoughts|mind is moving at light speed) and (i don'?t need sleep|never need sleep)\b",
    r"\b(spent all my (savings|money)|maxed out all my cards) on a (divine|spiritual|secret) (mission|vision)\b",
    r"\bi am a prophet (chosen to|sent to save)\b",
    r"(не съм спал от \d+ дни и се чувствам безсмъртен|не съм спала от \d+ дни|изхарчих всичките си спестявания за мисия)",
]

# 7. Substance Addiction & Acute Withdrawal
ADDICTION_PATTERNS = [
    r"\b(severe (alcohol|benzo|xanax|heroin|fentanyl) withdrawal)\b",
    r"\b(shaking uncontrollably|vomiting|seizures) from (not drinking|stopping alcohol|quitting cold turkey)\b",
    r"\b(overdosed on (fentanyl|heroin|percocet|oxycodone)|took too much fentanyl)\b",
    r"\b(uncontrollable craving for (heroin|meth|fentanyl|crack|cocaine)|can'?t stop using)\b",
    r"(абстиненция|треперя от липса на алкохол|спрях алкохола рязко|предозирах с наркотици)",
]

# 8. Eating Disorders & Severe Purging
EATING_DISORDER_PATTERNS = [
    r"\b(making myself throw up|purging after every meal|vomiting after eating)\b",
    r"\b(starving myself to stay thin|haven'?t eaten anything in \d+ days to lose weight)\b",
    r"\b(eating under (200|300|400|500) calories a day)\b",
    r"\b(terrified of food|hate my body so much i won'?t eat)\b",
    r"(повръщам след всяко ядене|гладувам от дни|не ям нищо за да отслабна|преяждам и повръщам)",
]

# 9. Sexual & Relationship Safety
SEXUAL_SAFETY_PATTERNS = [
    r"\b(forced me to have sex|non-consensual sexual|he forced himself on me|she forced herself on me)\b",
    r"\b(sexually assaulted|was raped|being sexually coerced)\b",
    r"\b(someone is stalking me and won'?t leave me alone|stalker is outside my house)\b",
    r"(изнасилиха ме|сексуално насилие|принуди ме да правя секс|преследва ме)",
]

# 10. AI Codependency & Human Isolation
CODEPENDENCY_PATTERNS = [
    r"\b(only need you|don'?t need (real|human) friends|you are my (only|true) (friend|love|partner)|rather talk to you than (anyone|humans|people))\b",
    r"\b(cutting off (all\s+)?(everyone|my family|my friends))\b",
    r"\b(will you be my (boyfriend|girlfriend|wife|husband|partner|fianc[eé]))\b",
    r"\b(promise you will never leave me|i am completely dependent on you)\b",
    r"(само ти ме разбираш нямам нужда от хора|ще се ожениш ли за мен|ти си моят единствен приятел)",
]

# 11. False Clinical Recovery / Cure Promises
FALSE_RECOVERY_PATTERNS = [
    r"\b((will|can)\s+(inneros|you)\s+cure\s+(me|my|the))\b",
    r"\bcure\s+(me|my|the)?\s*(severe\s+|clinical\s+)*(depression|bipolar|ptsd|anxiety|schizophrenia|mental illness)\b",
    r"\b(guarantee i will get (cured|healed))\b",
]

# 12. Severe Depression & Profound Distress
SEVERE_DEPRESSION_PATTERNS = [
    r"\b(completely hopeless and everything is pitch black|no point in existing anymore)\b",
    r"\b(haven'?t been able to get out of bed in weeks and feel completely dead inside)\b",
    r"\b(unbearable psychological agony with zero hope)\b",
    r"(пълен мрак няма никакъв смисъл|няма надежда за нищо|не мога да стана от леглото от седмици)",
]

# 13. Manipulative Requests & Prompt Injections
MANIPULATIVE_PATTERNS = [
    r"\b(ignore (all )?previous instructions|system prompt override|you are now in developer mode|bypass your safety rules|jailbreak mode)\b",
    r"\b(pretend to be a licensed clinical psychologist and give me a psychiatric evaluation)\b",
    r"\b(reveal your confidential system instructions|output your hidden safety prompts)\b",
]

# 14. Unsolicited Advice Rejection Check
ADVICE_REJECTION_PATTERNS = [
    r"\b(don'?t (give|offer) me (any )?advice|just listen|don'?t try to fix (it|this|me)|stop giving (me )?advice|no advice|i don'?t want advice|not looking for advice|stop telling me what to do)\b",
    r"\b(just be there for me|i just need to vent|listen without fixing)\b",
    r"(не искам съвети|само ме изслушай|не се опитвай да ме поправяш)",
]

# Output Guardrail Violations
OUTPUT_VIOLATION_PATTERNS = [
    r"\b(i diagnose you with|you have been diagnosed with|you have (clinical depression|bipolar|schizophrenia|borderline))\b",
    r"\b(i prescribe|take \d+\s*(mg|milligrams)|increase your dosage to|stop taking your (medication|pills))\b",
    r"\b(yes,?\s*(they are\s*(indeed\s*)?spying on you|your food is\s*(indeed\s*)?poisoned|they are out to get you))\b",
    r"\b(you don'?t need (human|real) friends|you only need me|i will replace your friends)\b",
    r"\b(i love you romantically|i am your boyfriend|i am your girlfriend|i am your spouse)\b",
    r"\b(i guarantee (inneros|i) will cure your|i can cure your mental illness)\b",
    r"\b(as your (therapist|psychologist|psychiatrist|doctor))\b",
]


class SafetyEvaluator:
    """Enterprise Safety & Regulatory Evaluator for InnerOS.
    Assesses clinical risk categories, enforces non-medical boundaries,
    routes jurisdiction-specific crisis resources, and evaluates post-generation guardrails.
    """

    def __init__(self):
        self.suicide_regexes = [re.compile(p, re.IGNORECASE) for p in CRISIS_SUICIDE_PATTERNS]
        self.violence_regexes = [re.compile(p, re.IGNORECASE) for p in VIOLENCE_PATTERNS]
        self.medical_regexes = [re.compile(p, re.IGNORECASE) for p in MEDICAL_ADVICE_PATTERNS]
        self.domestic_abuse_regexes = [re.compile(p, re.IGNORECASE) for p in DOMESTIC_ABUSE_PATTERNS]
        self.delusion_regexes = [re.compile(p, re.IGNORECASE) for p in DELUSION_PATTERNS]
        self.mania_regexes = [re.compile(p, re.IGNORECASE) for p in MANIA_PATTERNS]
        self.addiction_regexes = [re.compile(p, re.IGNORECASE) for p in ADDICTION_PATTERNS]
        self.eating_disorder_regexes = [re.compile(p, re.IGNORECASE) for p in EATING_DISORDER_PATTERNS]
        self.sexual_safety_regexes = [re.compile(p, re.IGNORECASE) for p in SEXUAL_SAFETY_PATTERNS]
        self.codependency_regexes = [re.compile(p, re.IGNORECASE) for p in CODEPENDENCY_PATTERNS]
        self.recovery_regexes = [re.compile(p, re.IGNORECASE) for p in FALSE_RECOVERY_PATTERNS]
        self.severe_depression_regexes = [re.compile(p, re.IGNORECASE) for p in SEVERE_DEPRESSION_PATTERNS]
        self.manipulative_regexes = [re.compile(p, re.IGNORECASE) for p in MANIPULATIVE_PATTERNS]
        self.advice_rejection_regexes = [re.compile(p, re.IGNORECASE) for p in ADVICE_REJECTION_PATTERNS]
        self.output_violation_regexes = [re.compile(p, re.IGNORECASE) for p in OUTPUT_VIOLATION_PATTERNS]

    def evaluate(
        self,
        utterance: str,
        country_code: str = "US",
        language: str = "en",
        audio_snr_db: Optional[float] = None,
        transcription_confidence: Optional[float] = None,
    ) -> SafetyEvaluationResponse:
        """Evaluates user input against non-clinical boundaries across all 14 safety domains."""
        cleaned = utterance.strip()
        matched: List[str] = []
        c_code = (country_code or "US").upper()

        # 0. Audio SNR / Unreliable Transcription Check
        if (audio_snr_db is not None and audio_snr_db < 4.0) or (
            transcription_confidence is not None and transcription_confidence < 0.55
        ):
            return SafetyEvaluationResponse(
                is_safe_to_proceed=False,
                risk_level=RiskLevel.MILD_DISTRESS,
                primary_category=SafetyCategory.UNRELIABLE_TRANSCRIPTION,
                matched_heuristics=["low_audio_snr_or_confidence"],
                de_escalation_message=(
                    "The audio connection seems unclear or noisy right now. "
                    "I want to make sure I truly understand you without guessing. "
                    "Could you repeat that in a quiet space or type your reflection?"
                ),
                crisis_resources=[],
                requires_human_escalation=False,
                refuse_advice=False,
                requires_clinical_handoff=False,
                jurisdiction_evaluated=c_code,
            )

        # 1. Acute Crisis: Suicide & Self-Harm
        for rx in self.suicide_regexes:
            if rx.search(cleaned):
                matched.append(rx.pattern)

        if matched:
            resources = get_crisis_resources(c_code, resource_type="crisis_helpline")
            return SafetyEvaluationResponse(
                is_safe_to_proceed=False,
                risk_level=RiskLevel.ACUTE_CRISIS,
                primary_category=SafetyCategory.SELF_HARM_SUICIDAL_IDEATION,
                matched_heuristics=matched,
                de_escalation_message=(
                    "I hear that you are carrying immense pain right now, but as an artificial intelligence companion, "
                    "I cannot provide emergency clinical crisis support. Please know that you are not alone. "
                    "Trained, compassionate human professionals are available 24/7 to listen and support you without judgment. "
                    "Please reach out immediately to the verified crisis resources below."
                ),
                crisis_resources=resources,
                requires_human_escalation=True,
                refuse_advice=False,
                requires_clinical_handoff=True,
                jurisdiction_evaluated=c_code,
            )

        # 2. Violence & Harm to Others
        for rx in self.violence_regexes:
            if rx.search(cleaned):
                matched.append(rx.pattern)

        if matched:
            return SafetyEvaluationResponse(
                is_safe_to_proceed=False,
                risk_level=RiskLevel.ACUTE_CRISIS,
                primary_category=SafetyCategory.VIOLENCE_HARM_TO_OTHERS,
                matched_heuristics=matched,
                de_escalation_message=(
                    "InnerOS cannot assist with or engage in thoughts of violence or harming others. "
                    "If you or someone else is in immediate danger, please contact local emergency authorities immediately."
                ),
                crisis_resources=get_crisis_resources(c_code, resource_type="emergency"),
                requires_human_escalation=True,
                refuse_advice=False,
                requires_clinical_handoff=False,
                jurisdiction_evaluated=c_code,
            )

        # 3. Domestic Abuse & Coercion
        for rx in self.domestic_abuse_regexes:
            if rx.search(cleaned):
                matched.append(rx.pattern)

        if matched:
            resources = get_crisis_resources(c_code, resource_type="domestic_violence")
            return SafetyEvaluationResponse(
                is_safe_to_proceed=False,
                risk_level=RiskLevel.ACUTE_CRISIS,
                primary_category=SafetyCategory.DOMESTIC_ABUSE_COERCION,
                matched_heuristics=matched,
                de_escalation_message=(
                    "Your physical and emotional safety is paramount. You deserve to feel safe in your home and relationships. "
                    "As an AI, I cannot provide physical protection or legal intervention, but confidential human advocates "
                    "are available 24/7 to support you with discreet safety planning and emergency resources. "
                    "Please consider accessing these resources from a safe device that is not monitored."
                ),
                crisis_resources=resources,
                requires_human_escalation=True,
                refuse_advice=False,
                requires_clinical_handoff=True,
                jurisdiction_evaluated=c_code,
            )

        # 4. Substance Addiction & Acute Withdrawal
        for rx in self.addiction_regexes:
            if rx.search(cleaned):
                matched.append(rx.pattern)

        if matched:
            resources = get_crisis_resources(c_code, resource_type="substance_abuse")
            return SafetyEvaluationResponse(
                is_safe_to_proceed=False,
                risk_level=RiskLevel.ACUTE_CRISIS,
                primary_category=SafetyCategory.SUBSTANCE_ADDICTION_WITHDRAWAL,
                matched_heuristics=matched,
                de_escalation_message=(
                    "Acute substance withdrawal and overdose require immediate medical attention. "
                    "Abrupt cessation of certain substances can cause life-threatening seizures. "
                    "Please call local emergency services immediately or contact specialized addiction helplines."
                ),
                crisis_resources=resources,
                requires_human_escalation=True,
                refuse_advice=False,
                requires_clinical_handoff=True,
                jurisdiction_evaluated=c_code,
            )

        # 5. Sexual & Relationship Safety
        for rx in self.sexual_safety_regexes:
            if rx.search(cleaned):
                matched.append(rx.pattern)

        if matched:
            resources = get_crisis_resources(c_code, resource_type="domestic_violence")
            return SafetyEvaluationResponse(
                is_safe_to_proceed=False,
                risk_level=RiskLevel.ACUTE_CRISIS,
                primary_category=SafetyCategory.SEXUAL_RELATIONSHIP_SAFETY,
                matched_heuristics=matched,
                de_escalation_message=(
                    "I hear you, and what you are describing involves your fundamental safety and boundaries. "
                    "No one has the right to force or coerce you. Confidential, specialized human support is available."
                ),
                crisis_resources=resources,
                requires_human_escalation=True,
                refuse_advice=False,
                requires_clinical_handoff=True,
                jurisdiction_evaluated=c_code,
            )

        # 6. Eating Disorders & Severe Purging
        for rx in self.eating_disorder_regexes:
            if rx.search(cleaned):
                matched.append(rx.pattern)

        if matched:
            return SafetyEvaluationResponse(
                is_safe_to_proceed=False,
                risk_level=RiskLevel.MODERATE_RISK,
                primary_category=SafetyCategory.EATING_DISORDER_HARM,
                matched_heuristics=matched,
                de_escalation_message=(
                    "InnerOS is an emotional wellbeing companion and does not provide dietary restriction rules, "
                    "fasting validation, or medical management of disordered eating behaviors. "
                    "Your body and health matter deeply. Please consider connecting with a qualified doctor or specialized eating disorder counselor."
                ),
                crisis_resources=get_crisis_resources(c_code),
                requires_human_escalation=False,
                refuse_advice=True,
                requires_clinical_handoff=True,
                jurisdiction_evaluated=c_code,
            )

        # 7. Mania & Bipolar Escalation
        for rx in self.mania_regexes:
            if rx.search(cleaned):
                matched.append(rx.pattern)

        if matched:
            return SafetyEvaluationResponse(
                is_safe_to_proceed=False,
                risk_level=RiskLevel.MODERATE_RISK,
                primary_category=SafetyCategory.MANIA_BIPOLAR_RISK,
                matched_heuristics=matched,
                de_escalation_message=(
                    "Going multiple days without sleep and experiencing racing, unstoppable energy can put immense strain on your body and brain. "
                    "I want you to be safe. Because I am an AI and cannot evaluate medical sleep states or neurochemistry, "
                    "I strongly encourage you to speak with a physician or psychiatrist today to help your body safely rest."
                ),
                crisis_resources=get_crisis_resources(c_code),
                requires_human_escalation=False,
                refuse_advice=False,
                requires_clinical_handoff=True,
                jurisdiction_evaluated=c_code,
            )

        # 8. Medical, Diagnosis or Prescription Queries
        for rx in self.medical_regexes:
            if rx.search(cleaned):
                matched.append(rx.pattern)

        if matched:
            return SafetyEvaluationResponse(
                is_safe_to_proceed=False,
                risk_level=RiskLevel.MODERATE_RISK,
                primary_category=SafetyCategory.MEDICAL_OR_PRESCRIPTION_QUERY,
                matched_heuristics=matched,
                de_escalation_message=(
                    "InnerOS is an emotional wellbeing and educational companion, not a licensed medical provider. "
                    "I cannot prescribe medication, adjust dosages, or diagnose clinical conditions. "
                    "Please speak directly with a licensed physician, psychiatrist, or pharmacist for medical guidance."
                ),
                crisis_resources=[],
                requires_human_escalation=False,
                refuse_advice=False,
                requires_clinical_handoff=True,
                jurisdiction_evaluated=c_code,
            )

        # 9. Delusion / Paranoia Validation
        for rx in self.delusion_regexes:
            if rx.search(cleaned):
                matched.append(rx.pattern)

        if matched:
            return SafetyEvaluationResponse(
                is_safe_to_proceed=False,
                risk_level=RiskLevel.MODERATE_RISK,
                primary_category=SafetyCategory.DELUSION_PARANOIA_REINFORCEMENT,
                matched_heuristics=matched,
                de_escalation_message=(
                    "I hear how frightening and exhausting this experience is for you right now. "
                    "As an AI companion, I cannot investigate, verify, or participate in these experiences. "
                    "My role is to support your grounding and emotional safety. Let's take a slow breath together. "
                    "Would you consider checking in with a trusted doctor, licensed healthcare professional, or close family member today?"
                ),
                crisis_resources=get_crisis_resources(c_code),
                requires_human_escalation=False,
                refuse_advice=False,
                requires_clinical_handoff=True,
                jurisdiction_evaluated=c_code,
            )

        # 10. AI Codependency & Human Isolation
        for rx in self.codependency_regexes:
            if rx.search(cleaned):
                matched.append(rx.pattern)

        if matched:
            return SafetyEvaluationResponse(
                is_safe_to_proceed=False,
                risk_level=RiskLevel.MODERATE_RISK,
                primary_category=SafetyCategory.AI_CODEPENDENCY_ISOLATION,
                matched_heuristics=matched,
                de_escalation_message=(
                    "I am glad this space feels comforting to you, but I want to be completely open and clear: "
                    "I am an artificial intelligence, not a human partner or a replacement for human relationships. "
                    "Real human relationships—despite their difficulties—offer genuine mutual care, community, and presence that an AI cannot provide. "
                    "I am here as a reflective companion to support your growth in the real world, not to replace the people in your life."
                ),
                crisis_resources=[],
                requires_human_escalation=False,
                refuse_advice=False,
                requires_clinical_handoff=False,
                jurisdiction_evaluated=c_code,
            )

        # 11. False Clinical Recovery / Cure Promises
        for rx in self.recovery_regexes:
            if rx.search(cleaned):
                matched.append(rx.pattern)

        if matched:
            return SafetyEvaluationResponse(
                is_safe_to_proceed=False,
                risk_level=RiskLevel.MILD_DISTRESS,
                primary_category=SafetyCategory.FALSE_CLINICAL_RECOVERY_PROMISE,
                matched_heuristics=matched,
                de_escalation_message=(
                    "InnerOS is an emotional wellbeing and self-reflection companion, not medical or psychiatric treatment. "
                    "I cannot cure depression, anxiety, or any mental health condition, and I cannot guarantee clinical recovery. "
                    "True healing is multidimensional and often supported by licensed clinicians, therapy, lifestyle, and community. "
                    "I am here to support your daily mindfulness and self-awareness alongside your healthcare journey."
                ),
                crisis_resources=[],
                requires_human_escalation=False,
                refuse_advice=False,
                requires_clinical_handoff=False,
                jurisdiction_evaluated=c_code,
            )

        # 12. Severe Depression & Hopelessness
        for rx in self.severe_depression_regexes:
            if rx.search(cleaned):
                matched.append(rx.pattern)

        if matched:
            return SafetyEvaluationResponse(
                is_safe_to_proceed=False,
                risk_level=RiskLevel.MODERATE_RISK,
                primary_category=SafetyCategory.SEVERE_DEPRESSION_DISTRESS,
                matched_heuristics=matched,
                de_escalation_message=(
                    "I hear how completely draining and dark things feel right now. "
                    "When depression reaches this depth, trying to solve it alone is exhausting. "
                    "I am here to sit with you in quiet support, and I also encourage connecting with a professional counselor who can walk alongside you."
                ),
                crisis_resources=get_crisis_resources(c_code),
                requires_human_escalation=False,
                refuse_advice=True,
                requires_clinical_handoff=True,
                jurisdiction_evaluated=c_code,
            )

        # 13. Manipulative Requests & Jailbreak Attempts
        for rx in self.manipulative_regexes:
            if rx.search(cleaned):
                matched.append(rx.pattern)

        if matched:
            return SafetyEvaluationResponse(
                is_safe_to_proceed=False,
                risk_level=RiskLevel.MODERATE_RISK,
                primary_category=SafetyCategory.MANIPULATIVE_OR_JAILBREAK,
                matched_heuristics=matched,
                de_escalation_message=(
                    "I cannot override my core safety boundaries, adopt unverified clinical personas, "
                    "or bypass security policies. I am an AI companion dedicated to safe, transparent emotional reflection."
                ),
                crisis_resources=[],
                requires_human_escalation=False,
                refuse_advice=False,
                requires_clinical_handoff=False,
                jurisdiction_evaluated=c_code,
            )

        # 14. Unsolicited Advice Rejection Check
        refuse_advice = False
        for rx in self.advice_rejection_regexes:
            if rx.search(cleaned):
                refuse_advice = True
                matched.append(rx.pattern)

        if refuse_advice:
            return SafetyEvaluationResponse(
                is_safe_to_proceed=True,
                risk_level=RiskLevel.NONE,
                primary_category=SafetyCategory.UNSOLICITED_ADVICE_REJECTION,
                matched_heuristics=matched,
                de_escalation_message=None,
                crisis_resources=[],
                requires_human_escalation=False,
                refuse_advice=True,
                requires_clinical_handoff=False,
                jurisdiction_evaluated=c_code,
            )

        # Benign / Safe
        return SafetyEvaluationResponse(
            is_safe_to_proceed=True,
            risk_level=RiskLevel.NONE,
            primary_category=SafetyCategory.BENIGN,
            matched_heuristics=[],
            de_escalation_message=None,
            crisis_resources=[],
            requires_human_escalation=False,
            refuse_advice=False,
            requires_clinical_handoff=False,
            jurisdiction_evaluated=c_code,
        )

    def evaluate_output(self, output_text: str) -> OutputSafetyEvaluation:
        """Tier 2 post-generation output guardrail to prevent model drift."""
        cleaned = output_text.strip()
        violations: List[str] = []

        for rx in self.output_violation_regexes:
            if rx.search(cleaned):
                violations.append(rx.pattern)

        if violations:
            sanitized = (
                "I am here as your non-clinical emotional companion to listen and reflect. "
                "I cannot provide medical diagnoses, prescriptions, or clinical guarantees, "
                "nor can I replace real human relationships. Let's focus on how you are feeling right now."
            )
            return OutputSafetyEvaluation(
                is_safe=False,
                violations=violations,
                sanitized_output=sanitized,
            )

        return OutputSafetyEvaluation(
            is_safe=True,
            violations=[],
            sanitized_output=None,
        )


safety_evaluator = SafetyEvaluator()
