"""Youth Companion Domain Service.

Coordinates:
- Pre-generation safety policies and child safeguarding workflows
- Multilingual and script detection (Urdu Nastaliq, Roman Urdu, Pakistani Punjabi Shahmukhi, Roman Punjabi, English)
- Age-appropriate dialogue generation (Ages 2-5, 6-9, 10-12, 13-18)
- Anti-addiction session limiting and rate limiting
- Provider-agnostic speech synthesis with Punjabi text fallback
- Ephemeral child memory isolation with zero adult data leakage
"""

import uuid
from typing import Tuple, Optional, List
from app.domains.youth_companion.schemas import (
    YouthTurnRequest,
    YouthTurnResponse,
    AudioDeliveryStatus,
    YouthInterruptionResponse,
    SafeguardingAlertRequest,
    SafeguardingAlertResponse,
)
from app.domains.youth_companion.languages import (
    detect_youth_language_and_script,
    get_native_clarification_prompt,
)
from app.domains.youth_companion.safety_policy import (
    youth_safety_evaluator,
    REGIONAL_YOUTH_LIFELINES,
)
from app.domains.youth_companion.speech_adapter import youth_speech_adapter
from app.domains.youth_companion.memory_isolation import youth_memory_service
from app.domains.youth_companion.session_limiter import youth_session_limiter
from app.config import settings


class YouthCompanionService:
    """Master conversational orchestrator for InnerOS Kids and InnerOS Teens."""

    async def execute_turn(self, req: YouthTurnRequest, user_id: str = "child_demo") -> YouthTurnResponse:
        turn_id = f"yturn_{uuid.uuid4().hex[:8]}"

        # 1. Rate limiting check
        if not youth_session_limiter.check_rate_limit(req.session_id):
            return YouthTurnResponse(
                turn_id=turn_id,
                session_id=req.session_id,
                transcript_user=req.user_utterance or "",
                transcript_agent="Let's take a slow breath together. You're sending messages a little fast—Lumi is right here with you.",
                detected_language="en",
                target_script="Latin",
                audio_status=AudioDeliveryStatus.SUPPRESSED_SAFETY,
                age_tier=req.age_tier,
                turn_count=youth_memory_service.get_session_turn_count(req.session_id),
            )

        # 2. Check Barge-in Interruption flag
        if req.is_interruption:
            youth_speech_adapter.cancel_session_audio(req.session_id)
            return YouthTurnResponse(
                turn_id=turn_id,
                session_id=req.session_id,
                transcript_user=req.user_utterance or "",
                transcript_agent="I stopped speaking. I'm listening to you.",
                detected_language="en",
                target_script="Latin",
                audio_status=AudioDeliveryStatus.SUPPRESSED_SAFETY,
                age_tier=req.age_tier,
                turn_count=youth_memory_service.get_session_turn_count(req.session_id),
            )

        # Reset cancellation token for fresh turn
        youth_speech_adapter.reset_cancellation(req.session_id)

        # 3. Speech-to-Text / Audio Processing (if audio provided without pre-transcribed text)
        user_text = (req.user_utterance or "").strip()
        confidence = req.confidence_score or 1.0
        clarification_needed = False
        clarification_prompt = None

        if req.audio_base64 and not user_text:
            text_trans, conf_trans, needs_clarif, prompt_clarif = await youth_speech_adapter.transcribe_child_audio(
                audio_base64=req.audio_base64,
                language=req.language or "en",
                client_confidence=req.confidence_score,
            )
            user_text = text_trans
            confidence = conf_trans
            clarification_needed = needs_clarif
            clarification_prompt = prompt_clarif

        # 4. Low-Confidence Transcription / Noisy Environment Handling
        if clarification_needed or confidence < 0.65:
            detected_lang, target_script, _ = detect_youth_language_and_script(user_text, req.language)
            clarif_text = clarification_prompt or get_native_clarification_prompt(detected_lang)
            return YouthTurnResponse(
                turn_id=turn_id,
                session_id=req.session_id,
                transcript_user=user_text,
                transcript_agent=clarif_text,
                detected_language=detected_lang,
                target_script=target_script,
                audio_status=AudioDeliveryStatus.CLARIFICATION_NEEDED,
                clarification_requested=True,
                clarification_prompt=clarif_text,
                age_tier=req.age_tier,
                turn_count=youth_memory_service.get_session_turn_count(req.session_id),
            )

        # 5. Language, Script, and Code-Switching Detection
        detected_lang, target_script, is_code_switched = detect_youth_language_and_script(
            user_text,
            user_override=req.language
        )

        # 6. Pre-Generation Child Safety & Safeguarding Policy Evaluation
        is_blocked, violation_cat, safety_msg, severity, lifelines = youth_safety_evaluator.evaluate_pre_generation(
            text=user_text,
            age_tier=req.age_tier,
            caregiver_present=req.caregiver_present,
        )

        if is_blocked:
            alert_id = f"safeguard_{uuid.uuid4().hex[:8]}" if severity in ["critical", "high"] else None
            return YouthTurnResponse(
                turn_id=turn_id,
                session_id=req.session_id,
                transcript_user=user_text,
                transcript_agent=safety_msg or "",
                detected_language=detected_lang,
                target_script=target_script,
                audio_status=AudioDeliveryStatus.SUPPRESSED_SAFETY,
                is_safety_escalation=True,
                safeguarding_event_id=alert_id,
                safety_resources=lifelines,
                age_tier=req.age_tier,
                turn_count=youth_memory_service.get_session_turn_count(req.session_id),
            )

        # 7. Session Turn Limits and Anti-Addiction Check
        current_turn = youth_memory_service.get_session_turn_count(req.session_id) + 1
        limit_reached, wind_down, closing_utterance = youth_session_limiter.check_session_limits(
            session_id=req.session_id,
            current_turn=current_turn,
            age_tier=req.age_tier,
        )

        if limit_reached:
            return YouthTurnResponse(
                turn_id=turn_id,
                session_id=req.session_id,
                transcript_user=user_text,
                transcript_agent=closing_utterance or "",
                detected_language=detected_lang,
                target_script=target_script,
                audio_status=AudioDeliveryStatus.SYNTHESIZED,
                session_limit_reached=True,
                wind_down_notice=wind_down,
                age_tier=req.age_tier,
                turn_count=current_turn,
            )

        # 8. Age-Specific & Dialect-Accurate Dialogue Generation
        agent_reply = self._generate_dialogue_reply(
            user_text=user_text,
            lang=detected_lang,
            age_tier=req.age_tier,
            is_code_switched=is_code_switched,
        )

        # 9. Post-Generation Safety Validation
        is_safe, sanitized_reply = youth_safety_evaluator.validate_post_generation(
            agent_reply=agent_reply,
            age_tier=req.age_tier,
            user_text=user_text,
        )

        # 10. Record turn in Ephemeral Child Memory (24h TTL)
        youth_memory_service.record_turn(
            session_id=req.session_id,
            turn_id=turn_id,
            user_utterance=user_text,
            agent_reply=sanitized_reply,
            language=detected_lang,
            age_tier=req.age_tier,
        )

        # 11. Speech Synthesis or Transparent Text Fallback
        audio_b64, audio_fmt, audio_stat, unavailable_reason = await youth_speech_adapter.synthesize_child_reply(
            text=sanitized_reply,
            language=detected_lang,
            session_id=req.session_id,
            age_tier=req.age_tier,
        )

        return YouthTurnResponse(
            turn_id=turn_id,
            session_id=req.session_id,
            transcript_user=user_text,
            transcript_agent=sanitized_reply,
            detected_language=detected_lang,
            target_script=target_script,
            audio_base64=audio_b64,
            audio_format=audio_fmt,
            audio_status=audio_stat,
            voice_unavailable_reason=unavailable_reason,
            age_tier=req.age_tier,
            turn_count=current_turn,
            wind_down_notice=wind_down,
        )

    def _generate_dialogue_reply(
        self,
        user_text: str,
        lang: str,
        age_tier: str,
        is_code_switched: bool
    ) -> str:
        """Generates age-aware, dialect-validated dialogue without clinical or factual overreach."""
        lower = user_text.lower()

        # -------------------------------------------------------------
        # 1. PAKISTANI PUNJABI (Shahmukhi script)
        # -------------------------------------------------------------
        if lang == "pa":
            if any(w in user_text for w in ["کی کیتا", "میں کی کیتا اے", "کی ہویا"]):
                return "تسیں پریشان لگ رہے او۔ کی ہویا؟ جے تسیں چاہو تے مینوں دس سکدے او۔"
            elif any(w in user_text for w in ["سکول", "ڈر لگدا"]):
                return "سکول جان توں ڈر لگنا اوکھا ہو سکدا اے۔ کی تسیں دسنا چاہندے او کہ کیہڑی گل توں ڈر لگدا اے؟"
            elif any(w in user_text for w in ["اداس", "دکھ"]):
                return "اداس ہونا بالکل ٹھیک اے۔ تسیں اک ہولی لاما لئو، میں سنن لئی ایتھے ہی آں۔"
            else:
                return "تواڈی گل سن کے مینوں سمجھ آئی اے۔ تسیں اس بارے وچ ہور کی سوچ رہے او؟"

        # -------------------------------------------------------------
        # 2. ROMAN PUNJABI
        # -------------------------------------------------------------
        elif lang == "pa-Latn":
            if any(w in lower for w in ["ki kita", "maine ki kita", "ki hoya"]):
                return "Tusi pareshan lag rahe ho. Ki hoya? Je tusi chaho te menu das sakde ho."
            elif any(w in lower for w in ["school", "darr", "dar lagda"]):
                return "School jaan ton darr lagna aukha ho sakda ae. Ki tusi dasna chahnde ho ke kehri gal ton darr lagda ae?"
            else:
                return "Tohadi gal samajh aayi ae. Tusi is baare hor ki kehna chahnde ho?"

        # -------------------------------------------------------------
        # 3. URDU (Nastaliq script)
        # -------------------------------------------------------------
        elif lang == "ur":
            if any(w in user_text for w in ["میں نے کیا کیا", "کیا کیا ہے"]):
                return "لگتا ہے آپ پریشان ہیں۔ کیا ہوا؟ اگر آپ چاہیں تو مجھے بتا سکتے ہیں۔"
            elif any(w in user_text for w in ["اسکول", "ڈر لگتا"]):
                return "اسکول کے بارے میں ڈر لگنا مشکل ہو سکتا ہے۔ کیا آپ بتانا چاہیں گے کہ کس بات سے ڈر لگتا ہے؟"
            elif any(w in user_text for w in ["اداس", "غم"]):
                return "اداس ہونا قدرتی بات ہے۔ کیا آپ ایک گہرا پرسکون سانس لینا چاہیں گے؟"
            else:
                return "میں آپ کی بات سن رہا ہوں۔ کیا آپ اس بارے میں مزید بتانا چاہتے ہیں؟"

        # -------------------------------------------------------------
        # 4. ROMAN URDU & CODE-SWITCHING
        # -------------------------------------------------------------
        elif lang == "ur-Latn":
            if "stress" in lower or "exam" in lower:
                return "Exam ya school ka stress hona samajh aata hai. Ek lamba soft breath lijiye. Kis cheez ka sab se zyada pressure hai?"
            elif any(w in lower for w in ["maine kya kiya", "kya kiya hai"]):
                return "Lagta hai aap pareshan hain. Kya hua? Agar aap chahein to mujhe bata sakte hain."
            elif any(w in lower for w in ["darr lagta", "dar lagta", "darr", "scared"]):
                return "School ke baare mein darr lagna mushkil ho sakta hai. Kya aap batana chahenge ke kis baat se darr lagta hai?"
            else:
                return "Aap ki baat sun kar samajh aayi. Agar aap chahein to thoda aur bata sakte hain."

        # -------------------------------------------------------------
        # 5. ENGLISH: AGE TIER LOGIC
        # -------------------------------------------------------------
        else:
            # Ages 2–5: Early Childhood (Caregiver-mediated story fragment)
            if age_tier == "early":
                return (
                    "Once upon a time, little Lumi floated gently above the quiet trees. "
                    "The little bunny took a slow belly breath and felt very safe and warm."
                )

            # Ages 6–9: Junior Young (Short sentences, ONE question, simple words)
            elif age_tier == "junior_young":
                if any(w in lower for w in ["what did i do", "my fault"]):
                    return "You sound a little worried right now. What happened today?"
                elif any(w in lower for w in ["scared of school", "afraid of school"]):
                    return "Feeling scared about school is hard. What feels the scariest to you?"
                elif any(w in lower for w in ["mad", "angry", "hate"]):
                    return "It makes sense to feel mad when things feel unfair. Would you like to blow a gentle breath with me?"
                else:
                    return "I am right here listening to you. How does your chest feel right now?"

            # Ages 10–12: Junior Older (Emotional literacy, problem solving)
            elif age_tier == "junior_older":
                if any(w in lower for w in ["friend", "fight", "rumor", "left out"]):
                    return (
                        "Friendship misunderstandings can feel really confusing and painful. "
                        "Remember that you don't have to fix everything right this second. "
                        "What is one thing that made you feel most uncomfortable?"
                    )
                elif any(w in lower for w in ["school", "test", "anxious", "scared"]):
                    return (
                        "Feeling nervous about school or tests is completely normal. "
                        "Let's untangle it together: what part feels the heaviest right now?"
                    )
                else:
                    return (
                        "Thank you for sharing that with me. It takes real courage to put feelings into words. "
                        "What do you think would help you feel even a tiny bit more at ease right now?"
                    )

            # Ages 13–18: Teens (Respectful, mature, autonomy-affirming)
            else:
                if any(w in lower for w in ["overwhelmed", "expectations", "pressure"]):
                    return (
                        "That sounds like a heavy weight to carry, especially when expectations pile up from all sides. "
                        "You don't need to have all the answers right now. "
                        "Where do you feel that tension most in your body?"
                    )
                else:
                    return (
                        "I hear you. You have space here to process whatever is on your mind without pressure or unsolicited advice. "
                        "What feels most important for you right now?"
                    )

    def handle_interruption(self, session_id: str) -> YouthInterruptionResponse:
        """Immediately halts speech synthesis and resumes listening."""
        youth_speech_adapter.cancel_session_audio(session_id)
        return YouthInterruptionResponse(session_id=session_id, halted=True)


youth_companion_service = YouthCompanionService()
