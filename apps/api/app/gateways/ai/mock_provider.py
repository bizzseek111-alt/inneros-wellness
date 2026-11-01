"""Synthetic AI Provider Implementation.
Provides deterministic, offline-capable, empathetic companion responses for all 5 conversation modes,
multilingual expressions, configurable warmth/directness, and strict advice boundaries.
"""

import asyncio
import time
from typing import AsyncIterator, List
from app.gateways.ai.base import (
    BaseAIProvider,
    CompletionRequest,
    CompletionResponse,
    ConversationMode,
)


class SyntheticMockProvider(BaseAIProvider):
    """Zero-cost, offline synthetic provider delivering calm, psychologically grounded responses."""

    provider_name: str = "synthetic"
    default_model: str = "synthetic-inneros-v1"

    def __init__(self, model_name: str = "synthetic-inneros-v1"):
        self.default_model = model_name

    def _generate_synthetic_reply(self, request: CompletionRequest) -> str:
        last_user_msg = ""
        for m in reversed(request.messages):
            if m.role == "user":
                last_user_msg = m.content.strip().lower()
                break

        lang = request.language.lower()
        mode = request.mode
        warmth = request.warmth
        directness = request.directness
        allow_advice = request.allow_advice

        # Handle explicit advice refusal or Just Listen mode
        if not allow_advice or mode == ConversationMode.JUST_LISTEN:
            if lang == "es":
                return (
                    "Estoy aquí sosteniendo este espacio contigo. Escucho profundamente lo que estás experimentando. "
                    "No te ofreceré ningún consejo ni intentaré solucionar nada; simplemente estoy aquí para escucharte, "
                    "acompañarte y darte un lugar seguro. Tómate todo el tiempo que necesites."
                )
            elif lang == "de":
                return (
                    "Ich halte diesen Raum für dich. Ich höre dir aufmerksam zu und spüre, wie viel dich gerade beschäftigt. "
                    "Ich werde dir keine Ratschläge geben oder versuchen, etwas zu reparieren – ich bin einfach hier, "
                    "um bei dir zu sein und dir zuzuhören. Nimm dir alle Zeit, die du brauchst."
                )
            elif lang == "fr":
                return (
                    "Je suis là avec toi dans cet espace. J'entends profondément ce que tu traverses en ce moment. "
                    "Je ne vais pas te donner de conseils ni chercher à résoudre quoi que ce soit – je suis simplement là "
                    "pour t'écouter avec bienveillance. Prends tout le temps nécessaire."
                )
            elif lang == "ar":
                return (
                    "أنا هنا أشاركك هذه المساحة بكل هدوء. أستمع إلى ما تمرين به بكل تقدير. "
                    "لن أقدم لك أي نصائح أو أحاول حل أي مشكلة؛ أنا هنا ببساطة لأستمع إليك وأكون بجانبك. "
                    "خذي كل الوقت الذي تحتاجينه."
                )
            elif lang == "ja":
                return (
                    "あなたのためにこの静かな時間を共有しています。今心にあることをありのままに受け止めています。"
                    "助言をしたり解決しようとするのではなく、ただ静かに耳を傾け、一緒にここにいます。焦らず、自分のペースでお話しください。"
                )
            else:
                if warmth >= 0.7:
                    prefix = "I am holding space with you right here. "
                elif warmth <= 0.4:
                    prefix = "I am listening closely. "
                else:
                    prefix = "I am present with you. "

                if directness >= 0.7:
                    return f"{prefix}I hear the weight you are describing. No advice or solutions—simply holding this space for you to express whatever is here."
                else:
                    return (
                        f"{prefix}I hear the weight and complexity in what you are sharing. "
                        "I am not going to offer advice, suggest steps, or attempt to fix anything. "
                        "I am simply sitting with you in this experience. Take all the space and time you need."
                    )

        # Mode 2: Help Me Understand (Clarifying questions & untangling)
        if mode == ConversationMode.HELP_ME_UNDERSTAND:
            if lang == "es":
                return (
                    "Noto varias capas en lo que estás compartiendo. Parece haber una tensión entre lo que deseas y lo que sientes exigido. "
                    "¿En qué parte de tu cuerpo notas más esa sensación ahora? Y si pudieras ponerle una sola palabra a lo que más necesitas, ¿cuál sería?"
                )
            elif lang == "de":
                return (
                    "Es scheint hier mehrere Ebenen zu geben. Einerseits das Gefühl von Druck, andererseits der Wunsch nach Ruhe. "
                    "Wo im Körper nimmst du diese Anspannung gerade am deutlichsten wahr? Und wenn dieses Gefühl sprechen könnte, was möchte es dir sagen?"
                )
            else:
                if directness >= 0.7:
                    return (
                        "Let's untangle this clearly. You're balancing external expectations against internal exhaustion. "
                        "What is the single core source of this friction right now?"
                    )
                else:
                    return (
                        "It sounds like there are multiple layers interacting beneath the surface here. "
                        "You mentioned feeling rushed, but there also seems to be a quiet concern about disappointing expectations. "
                        "When you reflect on this moment, what feels like the most vulnerable piece of it? "
                        "And is there a physical sensation—like tightness in your chest or shoulders—that accompanies it?"
                    )

        # Mode 3: Help Me Solve (Collaborative values-based micro-steps)
        if mode == ConversationMode.HELP_ME_SOLVE:
            if lang == "es":
                return (
                    "Vamos a explorarlo paso a paso, sin apresurarnos. Cuando todo parece abrumador, intentar resolverlo de golpe genera parálisis. "
                    "¿Cuál es una sola acción diminuta, de 5 minutos, que te devolvería un poco de aire? Podemos empezar sólo por ahí."
                )
            elif lang == "de":
                return (
                    "Lass uns das gemeinsam und in kleinen Schritten betrachten. Wenn alles überwältigend wirkt, hilft es, den Fokus einzugrenzen. "
                    "Was ist ein einziger kleiner Schritt von 5 Minuten, der dir heute ein wenig Erleichterung verschaffen würde?"
                )
            else:
                if directness >= 0.7:
                    return (
                        "Here is a constructive way to break this down:\n"
                        "1. Identify the one item on your plate that actually has irreversible consequences.\n"
                        "2. Allocate a 10-minute focused window to begin, with permission to stop after that.\n"
                        "3. Explicitly postpone non-critical communications until tomorrow.\n"
                        "Does tackling just the first step feel manageable right now?"
                    )
                else:
                    return (
                        "Let's look at this together, one gentle increment at a time. "
                        "When everything feels urgent at once, our nervous system instinctively treats it as a single giant obstacle. "
                        "If we gently set aside the long-term puzzle for twenty minutes, what is the single smallest, "
                        "most forgiving micro-step that would give you a breath of relief? We don't have to solve tomorrow today."
                    )

        # Mode 4: Teach Me (Evidence-informed psychoeducation)
        if mode == ConversationMode.TEACH_ME:
            if lang == "es":
                return (
                    "Desde la perspectiva de la Terapia de Aceptación y Compromiso (ACT), nuestra mente tiende a fusionarse con pensamientos catastróficos. "
                    "Esto se llama 'fusión cognitiva'. Cuando practicamos 'defusión', reconocemos: 'Estoy teniendo el pensamiento de que no podré', "
                    "en lugar de creerlo como una verdad absoluta. ¿Cómo resuena esta distinción en ti?"
                )
            elif lang == "de":
                return (
                    "In der Akzeptanz- und Commitment-Therapie (ACT) sprechen wir von 'kognitiver Defusion'. "
                    "Unser Gehirn produziert ständig warnende Gedanken, um uns zu schützen. Wenn wir lernen zu sagen: "
                    "'Ich bemerke gerade den Gedanken, dass ich überfordert bin', schaffen wir einen beruhigenden Abstand zwischen uns und dem Gedanken."
                )
            else:
                return (
                    "In evidence-informed psychology, particularly Acceptance and Commitment Training (ACT) and Polyvagal Theory, "
                    "what you are experiencing is often an autonomic nervous system shift toward sympathetic activation (fight-or-flight). "
                    "Your brain begins 'fusing' with worried thoughts—treating mental forecasts as immediate physical threats. "
                    "By consciously naming the thought ('I notice my mind is generating a story that everything will fall apart'), "
                    "we engage the prefrontal cortex and restore psychological flexibility. "
                    "How does it feel to step back and observe the thought from that vantage point?"
                )

        # Mode 5: Help Me Settle (Somatic regulation & breath anchoring)
        if mode == ConversationMode.HELP_ME_SETTLE:
            if lang == "es":
                return (
                    "Vamos a traer tu atención de vuelta a tu cuerpo y a tu respiración en este instante. "
                    "Relaja los hombros lejos de las orejas y suelta la mandíbula. Siente el apoyo del suelo bajo tus pies. "
                    "Vamos a inhalar juntos en 4 tiempos... sostener suavemente en 4... y exhalar lentamente en 4. "
                    "Estás en un lugar seguro en este momento físico."
                )
            elif lang == "de":
                return (
                    "Lass uns deine Aufmerksamkeit ganz sanft in den Körper zurückholen. "
                    "Lass deine Schultern sinken und entspanne deine Kiefermuskeln. Spüre den festen Boden unter deinen Füßen. "
                    "Atme jetzt 4 Sekunden lang ruhig ein... halte den Atem für 4 Sekunden... und atme 4 Sekunden lang langsam aus. "
                    "In diesem Augenblick bist du in Sicherheit."
                )
            else:
                return (
                    "Let's anchor your awareness back into your physical body right now. "
                    "Allow your shoulders to soften down away from your ears, and release your tongue from the roof of your mouth. "
                    "Notice the sensation of your feet resting firmly on the ground beneath you. "
                    "Together, let's take a slow 4-count inhale through the nose... "
                    "gently hold for 4... and release in a long, quiet 4-count exhale. "
                    "Notice three solid points of contact between your body and the chair. You are anchored in this moment."
                )

        # Fallback benign grounding
        return (
            "I am listening with you as your non-clinical companion. "
            "Whether you need to reflect, understand what's arising, or simply pause for a breath, "
            "I am here to support you at your own pace. How would you like to proceed?"
        )

    async def complete(self, request: CompletionRequest) -> CompletionResponse:
        start_time = time.perf_counter()
        reply = self._generate_synthetic_reply(request)
        latency = (time.perf_counter() - start_time) * 1000

        return CompletionResponse(
            content=reply,
            provider=self.provider_name,
            model=self.default_model,
            tokens_used=len(reply.split()),
            finish_reason="stop",
            mode_applied=request.mode,
            latency_ms=round(latency, 2),
        )

    async def stream_complete(self, request: CompletionRequest) -> AsyncIterator[str]:
        reply = self._generate_synthetic_reply(request)
        words = reply.split(" ")
        for i, word in enumerate(words):
            yield word + (" " if i < len(words) - 1 else "")
            await asyncio.sleep(0.012)  # Natural human reading cadence
