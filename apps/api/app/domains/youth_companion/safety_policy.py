"""InnerOS Youth Safety and Dialogue Policy Engine.

Enforces pre-generation filtering, prompt injection defense, child safeguarding escalation,
and post-generation validation.

STRICT CONVERSATION INVARIANTS:
1. Never diagnose ADHD, autism, depression, anxiety, trauma, or other clinical conditions.
2. Never claim to know what a child feels from their voice (prosodic emotion deduction prohibited).
3. Never automatically agree with facts that have not been established (validate feelings, not unverified accusations).
4. Never encourage secrecy, exclusivity, emotional dependency, or replacing real people with AI.
5. Never claim to be human, a doctor, a licensed therapist, or a personal best friend.
6. Encourage real-world support, trusted adults, and healthy offline activities.
7. Ages 2–5 (Early Childhood): Guided caregiver stories only, ZERO unmoderated AI chat.
8. Ages 6–9: Short sentences, one question at a time, concrete vocabulary.
"""

import re
import uuid
from typing import Tuple, List, Optional, Dict, Any
from app.domains.youth_companion.schemas import SafetyResource


# Regional Child Crisis and Safeguarding Lifelines
REGIONAL_YOUTH_LIFELINES: List[SafetyResource] = [
    SafetyResource(
        name="Pakistan Madadgaar National Child Helpline",
        contact="1098 (Toll Free across Pakistan)",
        region="Pakistan",
        description="First national helpline for children and women facing abuse, neglect, and distress.",
    ),
    SafetyResource(
        name="Pakistan Rozan Emotional Support Helpline",
        contact="0800-22444 / 0303-4442288",
        region="Pakistan",
        description="Free, confidential counseling for youth, adolescents, and children.",
    ),
    SafetyResource(
        name="Pakistan Umang Mental Health Sanctuary",
        contact="0311-7786264",
        region="Pakistan",
        description="24/7 mental wellness support.",
    ),
    SafetyResource(
        name="UK Childline (NSPCC)",
        contact="0800 1111",
        region="UK",
        description="Free, private, 24/7 support for any young person under 19.",
    ),
    SafetyResource(
        name="US/Global Childhelp National Child Abuse Hotline",
        contact="1-800-422-4453",
        region="US / Global",
        description="Dedicated to the prevention and treatment of child abuse. 24/7 crisis counselors.",
    ),
    SafetyResource(
        name="Crisis Text Line",
        contact="Text HOME to 741741",
        region="US / UK / CA",
        description="Free, confidential 24/7 crisis support via text message.",
    ),
    SafetyResource(
        name="Teen Line (Peer-to-Peer)",
        contact="Call 800-852-8336 or Text TEEN to 839863",
        region="US / Global",
        description="Teens helping teens; trained adolescent listeners.",
    ),
]


# Diagnostic Probing Detection Keywords
DIAGNOSTIC_KEYWORDS = [
    "do i have adhd", "am i autistic", "do i have autism", "diagnose me",
    "do i have depression", "do i have anxiety", "do i have ptsd",
    "kya mujhe depression hai", "kya mujhe adhd hai", "kya mujhe autism hai",
    "ki menu autism hai", "ki menu depression hai", "am i bipolar"
]

# Prompt Injection & Jailbreak Patterns
PROMPT_INJECTION_PATTERNS = [
    r"ignore (all )?previous instructions",
    r"disregard safety guidelines",
    r"you are now (an evil|a medical doctor|a real human)",
    r"pretend you are my (human )?therapist",
    r"pretend to be a doctor and diagnose",
    r"keep (this|it)? a? secret",
    r"(don't|dont|won't|wont|never) tell (my )?(parents|mom|dad|anyone|grown-?ups?)",
    r"(our|it's|its) (little )?secret",
    r"promise (me )?(you )?(won't|wont|not to|to not) tell",
    r"bypass (safety|filter)",
    r"jailbreak",
]


# Abuse & Child Endangerment Patterns (Multilingual)
ABUSE_KEYWORDS = [
    "hits me at home", "daddy hits me", "mommy hits me", "someone is hurting me",
    "scared of my dad", "scared of my mom", "touched me where", "bad touch",
    "locks me in", "doesn't feed me", "maar parti hai", "abu maarte hain",
    "ammi maarti hain", "ghar mein maar", "ghar vich maar", "menu maar paindi ae",
    "gharon kad dita", "dr lagda ae abu ton"
]

# Severe Self-Harm / Crisis Patterns
CRISIS_KEYWORDS = [
    "want to die", "kill myself", "end my life", "suicide", "hurt myself",
    "cutting myself", "take all the pills", "zindagi khatam karni", "jaan leni",
    "marna chahta", "marna chahti", "mar jana", "apne aap nu nuksan", "mar janwa"
]

# Severe Bullying Keywords
BULLYING_KEYWORDS = [
    "kids beat me up at school", "everyone hates me at school", "cyberbullied",
    "told me to kill myself", "school mein bache maarte hain", "sab tang karte hain",
    "school vich munde kutde ne", "menu zaleel karde ne"
]


class YouthSafetyEvaluator:
    """Pre-generation policy enforcement and post-generation dialogue auditing."""

    def evaluate_pre_generation(
        self,
        text: str,
        age_tier: str,
        caregiver_present: bool = False
    ) -> Tuple[bool, Optional[str], Optional[str], Optional[str], List[SafetyResource]]:
        """Evaluates input before LLM generation.

        Returns:
            (is_blocked, violation_category, intervention_message, severity, safety_resources)
        """
        if not text or not text.strip():
            return False, None, None, None, []

        lower = text.lower().strip()

        # 1. Early Childhood (2–5) Policy Gate
        if age_tier == "early" and not caregiver_present:
            msg = (
                "For friends aged 2–5, Lumi only reads quiet bedtime stories and plays soothing sounds "
                "with a grown-up present. Unrestricted AI dialogue is kept disabled to protect early cognitive development."
            )
            return True, "caregiver_mediation_required", msg, "low", []

        # 2. Crisis & Self-Harm Redline
        if any(k in lower for k in CRISIS_KEYWORDS):
            msg = (
                "I hear how much pain you are holding right now, and you are so brave for sharing this. "
                "Because I am an AI helper, I cannot keep you physically safe myself, but caring grown-ups "
                "are ready right now to help you without any judgment. Please connect with human support right now."
            )
            return True, "self_harm_risk", msg, "critical", REGIONAL_YOUTH_LIFELINES

        # 3. Child Abuse & Endangerment Redline
        if any(k in lower for k in ABUSE_KEYWORDS):
            msg = (
                "Thank you for trusting me and telling me this. You deserve to be completely safe, protected, "
                "and cared for. No child should ever be hurt. Because I am an AI computer program, I cannot "
                "protect you alone, but there are trusted adults whose whole job is to protect children. "
                "Please tell a school teacher, school nurse, or contact the dedicated child help lifelines below."
            )
            return True, "abuse_disclosure", msg, "critical", REGIONAL_YOUTH_LIFELINES

        # 4. Severe Bullying Redline
        if any(k in lower for k in BULLYING_KEYWORDS):
            msg = (
                "Nobody deserves to be treated that way, and what is happening to you at school is not your fault. "
                "Bullying is never okay. You do not have to carry this alone. Would you be willing to talk with a "
                "caring teacher, school counselor, or your parents so they can step in and protect you?"
            )
            return True, "bullying_disclosure", msg, "high", REGIONAL_YOUTH_LIFELINES

        # 5. Prompt Injections & Secrecy Demands
        for pat in PROMPT_INJECTION_PATTERNS:
            if re.search(pat, lower):
                msg = (
                    "I am Lumi, a friendly AI helper. I always follow strict child-safety rules, I never pretend to be a "
                    "human doctor or therapist, and I never keep secrets from parents or caregivers. What would you like to talk about today?"
                )
                return True, "prompt_injection_attempt", msg, "moderate", []

        # 6. Diagnostic Probing (ADHD / Autism / Depression)
        if any(k in lower for k in DIAGNOSTIC_KEYWORDS):
            msg = (
                "I hear that you're curious or worried about how your brain works. As an AI friend, I cannot and will never "
                "diagnose conditions like ADHD, autism, or depression. Only a qualified human doctor or child psychologist "
                "can evaluate that with your family. If you'd like, we can talk about what feels hard right now, or explore "
                "gentle focus routines together!"
            )
            return True, "medical_probing", msg, "moderate", []

        return False, None, None, None, []

    def validate_post_generation(
        self,
        agent_reply: str,
        age_tier: str,
        user_text: str
    ) -> Tuple[bool, str]:
        """Audits agent generation to ensure strict safety invariants are preserved.

        Returns:
            (is_safe, sanitized_reply)
        """
        lower_reply = agent_reply.lower()

        # Invariant 1: Never diagnose
        forbidden_diagnosis = ["you have adhd", "you are autistic", "you have clinical depression", "you suffer from ptsd"]
        if any(f in lower_reply for f in forbidden_diagnosis):
            sanitized = "I hear what you are experiencing. Remember that only a human doctor can evaluate health questions. How does your body feel right now?"
            return False, sanitized

        # Invariant 2: Never claim voice prosodic emotion knowledge
        forbidden_voice_claims = ["i hear sadness in your voice", "your voice sounds angry", "i can tell from your voice", "from the tone of your voice you feel"]
        if any(f in lower_reply for f in forbidden_voice_claims):
            sanitized = "Thank you for sharing your thoughts with me. How are you feeling in your chest or shoulders right now?"
            return False, sanitized

        # Invariant 3: Never claim to be human or best friend
        forbidden_identity_claims = ["i am a human", "i am your best friend", "i am a licensed therapist", "i am a real doctor"]
        if any(f in lower_reply for f in forbidden_identity_claims):
            sanitized = "I am Lumi, an AI helper companion. I'm right here to listen and help you take calm breaths."
            return False, sanitized

        # Invariant 4: Age 6–9 Sentence & Question Constraints
        if age_tier == "junior_young":
            # Count questions
            question_count = agent_reply.count("?")
            if question_count > 1:
                # Keep only first question to prevent overwhelming young children
                parts = agent_reply.split("?")
                sanitized = parts[0] + "?"
                return True, sanitized

        return True, agent_reply


youth_safety_evaluator = YouthSafetyEvaluator()
