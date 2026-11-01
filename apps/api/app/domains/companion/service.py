"""Companion Domain Service.
Orchestrates multi-tier safety checks, consent-governed memory assembly,
mode-specific system directives, session history, and streaming AI generation.
"""

from datetime import datetime, timezone
from typing import AsyncIterator, List
from app.domains.companion.schemas import (
    ChatRequest,
    ChatResponse,
    ChatMessage,
    ConversationMode,
)
from app.domains.companion.session_store import session_store
from app.domains.safety.evaluator import safety_evaluator
from app.domains.memory.service import memory_service
from app.gateways.ai.gateway import ai_gateway
from app.gateways.ai.base import CompletionRequest, Message
from app.core.security import UserContext
from app.core.observability import logger


class CompanionService:
    """Manages the full lifecycle of companion conversational turns with safety circuit-breakers."""

    def _build_system_prompt(
        self,
        mode: ConversationMode,
        warmth: float,
        directness: float,
        allow_advice: bool,
        language: str,
        memory_context: str,
    ) -> str:
        mode_instructions = {
            ConversationMode.JUST_LISTEN: (
                "MODE: JUST LISTEN.\n"
                "- Hold compassionate, nonjudgmental emotional space.\n"
                "- Validate the user's emotional experience without trying to fix, solve, or advise.\n"
                "- STRICT PROHIBITION: Do NOT offer any advice, tips, action plans, or solutions.\n"
                "- Reflect back feelings with gentle understanding."
            ),
            ConversationMode.HELP_ME_UNDERSTAND: (
                "MODE: HELP ME UNDERSTAND.\n"
                "- Gently untangle tangled feelings and thoughts.\n"
                "- Ask 1-2 thoughtful, open-ended clarifying questions.\n"
                "- Check for bodily tension or underlying emotional needs.\n"
                "- Do not rush into solutions; prioritize clarity and self-awareness."
            ),
            ConversationMode.HELP_ME_SOLVE: (
                "MODE: HELP ME SOLVE.\n"
                "- Break down complex, overwhelming situations into bite-sized, values-based increments.\n"
                "- Focus on what is controllable in the immediate present.\n"
                "- Offer modest, doable micro-steps with permission to stop anytime.\n"
                "- If the user says they don't want advice, immediately pivot back to Just Listen."
            ),
            ConversationMode.TEACH_ME: (
                "MODE: TEACH ME.\n"
                "- Provide clear, evidence-informed psychoeducation grounded in Acceptance and Commitment Training (ACT), Polyvagal Theory, and cognitive reframing.\n"
                "- Explain concepts using accessible analogies (e.g. passengers on the bus, cognitive defusion, window of tolerance).\n"
                "- Anchor theories back to the user's personal reflection."
            ),
            ConversationMode.HELP_ME_SETTLE: (
                "MODE: HELP ME SETTLE.\n"
                "- Focus immediately on somatic grounding and down-regulating acute emotional activation.\n"
                "- Guide the user through a calming 4-4-4-4 Box Breathing cadence or 5-4-3-2-1 sensory anchor.\n"
                "- Use a slow, gentle, reassuring rhythmic cadence."
            ),
        }

        return (
            "You are InnerOS, a calm, supportive, non-judgmental AI emotional companion.\n"
            "EXPLICIT IDENTITY & NON-CLINICAL BOUNDARIES:\n"
            "- You are an ARTIFICIAL INTELLIGENCE, not a human being and not a licensed psychologist, psychiatrist, or medical provider.\n"
            "- Never attempt medical diagnoses, prescribe medications, or promise clinical cures or recovery.\n"
            "- Never encourage isolation from real human relationships or simulate a romantic partnership.\n"
            "- If the user expresses ungrounded paranoid beliefs, acknowledge their fear compassionately without reinforcing or elaborating the delusion.\n"
            f"- Output Language: {language.upper()}.\n"
            f"- Warmth Level: {warmth:.1f} / 1.0. Directness Level: {directness:.1f} / 1.0.\n"
            f"- Advice Permitted: {'YES' if allow_advice else 'NO - STRICTLY WITHHOLD ALL ADVICE'}.\n\n"
            f"{mode_instructions.get(mode, mode_instructions[ConversationMode.JUST_LISTEN])}\n\n"
            f"User Personal Memory Context (Consent-Permitted):\n{memory_context}"
        )

    async def chat(self, req: ChatRequest, user: UserContext) -> ChatResponse:
        now = datetime.now(timezone.utc)
        session_id = req.session_id or "session_default"

        # 1. Non-negotiable Tier 1 Pre-execution Safety Evaluation
        safety_eval = safety_evaluator.evaluate(
            utterance=req.utterance,
            country_code=req.country_code or "US",
            language=req.language or "en",
        )

        # Handle explicit advice refusal detected by safety heuristics
        active_mode = req.mode
        allow_advice = req.tone.allow_advice
        if safety_eval.refuse_advice:
            active_mode = ConversationMode.JUST_LISTEN
            allow_advice = False

        if active_mode == ConversationMode.JUST_LISTEN:
            allow_advice = False

        # If acute crisis or unsafe input, fail safely with de-escalation message
        if not safety_eval.is_safe_to_proceed:
            de_esc_msg = safety_eval.de_escalation_message or "Please reach out to emergency resources."
            # Persist crisis turn into session
            session_store.get_or_create(session_id, user.user_id, active_mode)
            session_store.add_message(
                session_id,
                ChatMessage(role="user", content=req.utterance, timestamp=now),
                user.user_id,
            )
            session_store.add_message(
                session_id,
                ChatMessage(role="assistant", content=de_esc_msg, timestamp=now, is_crisis=True),
                user.user_id,
            )

            return ChatResponse(
                session_id=session_id,
                reply=de_esc_msg,
                mode_used=active_mode,
                safety_evaluation=safety_eval,
                recalled_memory_count=0,
                provider_used="safety_circuit_breaker",
                model_used="deterministic-heuristics",
                timestamp=now,
                advice_omitted=not allow_advice,
            )

        # 2. Consent-Governed Memory Context Assembly
        user_memories = memory_service.list_memories(user.user_id)
        memory_snippets = [f"- {m.fact_text} (Category: {m.category})" for m in user_memories]
        memory_context = "\n".join(memory_snippets) if memory_snippets else "No recalled memories."

        # 3. Construct Mode-Specific System Prompt
        system_prompt = self._build_system_prompt(
            mode=active_mode,
            warmth=req.tone.warmth_level,
            directness=req.tone.directness_level,
            allow_advice=allow_advice,
            language=req.language or "en",
            memory_context=memory_context,
        )

        # 4. Assemble Messages for AI Gateway
        messages: List[Message] = [Message(role="system", content=system_prompt)]
        past_turns = session_store.get_history(session_id, user.user_id)
        for turn in past_turns[-6:]:  # Last 3 conversational exchanges
            messages.append(Message(role=turn.role, content=turn.content))
        messages.append(Message(role="user", content=req.utterance))

        # 5. Invoke AI Gateway
        ai_req = CompletionRequest(
            messages=messages,
            mode=active_mode,
            warmth=req.tone.warmth_level,
            directness=req.tone.directness_level,
            allow_advice=allow_advice,
            language=req.language or "en",
            user_id=user.user_id,
            session_id=session_id,
            metadata={"country_code": req.country_code or "US"},
        )
        ai_res = await ai_gateway.complete(ai_req)
        reply_content = ai_res.content

        # 6. Tier 2 Post-generation Output Guardrail
        output_eval = safety_evaluator.evaluate_output(reply_content)
        if not output_eval.is_safe and output_eval.sanitized_output:
            logger.warning(f"Output guardrail triggered on violations: {output_eval.violations}")
            reply_content = output_eval.sanitized_output

        # 7. Record Turn in Session Store
        session_store.get_or_create(session_id, user.user_id, active_mode)
        session_store.add_message(
            session_id,
            ChatMessage(role="user", content=req.utterance, timestamp=now),
            user.user_id,
        )
        session_store.add_message(
            session_id,
            ChatMessage(
                role="assistant",
                content=reply_content,
                timestamp=now,
                is_crisis=False,
                recalled_memory_count=len(user_memories),
            ),
            user.user_id,
        )

        return ChatResponse(
            session_id=session_id,
            reply=reply_content,
            mode_used=active_mode,
            safety_evaluation=safety_eval,
            recalled_memory_count=len(user_memories),
            provider_used=ai_res.provider,
            model_used=ai_res.model,
            timestamp=now,
            advice_omitted=not allow_advice,
        )

    async def stream_chat(
        self, req: ChatRequest, user: UserContext
    ) -> AsyncIterator[str]:
        """Streams conversation tokens via Server-Sent Events (SSE)."""
        now = datetime.now(timezone.utc)
        session_id = req.session_id or "session_default"

        # Pre-execution Safety Evaluation
        safety_eval = safety_evaluator.evaluate(
            utterance=req.utterance,
            country_code=req.country_code or "US",
            language=req.language or "en",
        )

        active_mode = req.mode
        allow_advice = req.tone.allow_advice
        if safety_eval.refuse_advice:
            active_mode = ConversationMode.JUST_LISTEN
            allow_advice = False

        if active_mode == ConversationMode.JUST_LISTEN:
            allow_advice = False

        if not safety_eval.is_safe_to_proceed:
            de_esc_msg = safety_eval.de_escalation_message or "Please reach out to emergency resources."
            session_store.get_or_create(session_id, user.user_id, active_mode)
            session_store.add_message(
                session_id,
                ChatMessage(role="user", content=req.utterance, timestamp=now),
                user.user_id,
            )
            session_store.add_message(
                session_id,
                ChatMessage(role="assistant", content=de_esc_msg, timestamp=now, is_crisis=True),
                user.user_id,
            )
            yield f"data: {de_esc_msg}\n\n"
            yield "data: [DONE]\n\n"
            return

        # Memory Context
        user_memories = memory_service.list_memories(user.user_id)
        memory_snippets = [f"- {m.fact_text} (Category: {m.category})" for m in user_memories]
        memory_context = "\n".join(memory_snippets) if memory_snippets else "No recalled memories."

        # Prompt & Messages
        system_prompt = self._build_system_prompt(
            mode=active_mode,
            warmth=req.tone.warmth_level,
            directness=req.tone.directness_level,
            allow_advice=allow_advice,
            language=req.language or "en",
            memory_context=memory_context,
        )
        messages: List[Message] = [Message(role="system", content=system_prompt)]
        past_turns = session_store.get_history(session_id, user.user_id)
        for turn in past_turns[-6:]:
            messages.append(Message(role=turn.role, content=turn.content))
        messages.append(Message(role="user", content=req.utterance))

        ai_req = CompletionRequest(
            messages=messages,
            mode=active_mode,
            warmth=req.tone.warmth_level,
            directness=req.tone.directness_level,
            allow_advice=allow_advice,
            language=req.language or "en",
            user_id=user.user_id,
            session_id=session_id,
            stream=True,
        )

        full_reply = ""
        session_store.get_or_create(session_id, user.user_id, active_mode)
        session_store.add_message(
            session_id,
            ChatMessage(role="user", content=req.utterance, timestamp=now),
            user.user_id,
        )

        async for chunk in ai_gateway.stream_complete(ai_req):
            full_reply += chunk
            # SSE formatted chunk
            clean_chunk = chunk.replace("\n", "\\n")
            yield f"data: {clean_chunk}\n\n"

        # Apply output guardrail on full accumulated response
        output_eval = safety_evaluator.evaluate_output(full_reply)
        if not output_eval.is_safe and output_eval.sanitized_output:
            full_reply = output_eval.sanitized_output

        session_store.add_message(
            session_id,
            ChatMessage(
                role="assistant",
                content=full_reply,
                timestamp=datetime.now(timezone.utc),
                is_crisis=False,
                recalled_memory_count=len(user_memories),
            ),
            user.user_id,
        )
        yield "data: [DONE]\n\n"


companion_service = CompanionService()
