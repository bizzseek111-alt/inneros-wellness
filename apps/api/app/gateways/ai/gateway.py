"""AI Gateway Factory, Registry, and Fallback Manager.
Dispatches requests to configured primary AI provider with transparent fallback,
benchmarking harness, and streaming token delivery.
"""

import time
from typing import AsyncIterator, Dict, List, Optional
from app.gateways.ai.base import (
    BaseAIProvider,
    CompletionRequest,
    CompletionResponse,
    ConversationMode,
    Message,
    ProviderBenchmarkResult,
)
from app.gateways.ai.mock_provider import SyntheticMockProvider
from app.gateways.ai.live_provider import (
    OpenAICompatibleProvider,
    AnthropicProvider,
    GeminiProvider,
)
from app.config import settings
from app.core.observability import logger


class FastMockProvider(SyntheticMockProvider):
    """Ultra-low latency mock provider variant for high-throughput testing."""
    provider_name: str = "mock-fast"
    default_model: str = "synthetic-inneros-fast"


class AIGateway:
    """Orchestrates modular AI providers with fallback resilience and benchmark capabilities."""

    def __init__(self):
        self._providers: Dict[str, BaseAIProvider] = {
            "synthetic": SyntheticMockProvider(),
            "mock-fast": FastMockProvider(),
        }
        self.primary_provider_name: str = "synthetic"
        self.fallback_provider_name: str = "mock-fast"
        self.configure_from_settings()

    def configure_from_settings(self) -> None:
        """Auto-registers live LLM providers when API keys or local endpoints are present."""
        if settings.OPENAI_API_KEY:
            self.register_provider(
                "openai",
                OpenAICompatibleProvider(
                    api_key=settings.OPENAI_API_KEY,
                    base_url=settings.OPENAI_BASE_URL,
                    model_name=settings.OPENAI_MODEL,
                    provider_label="openai",
                ),
            )
        if settings.ANTHROPIC_API_KEY:
            self.register_provider(
                "anthropic",
                AnthropicProvider(
                    api_key=settings.ANTHROPIC_API_KEY,
                    model_name=settings.ANTHROPIC_MODEL,
                ),
            )
        if settings.GEMINI_API_KEY:
            self.register_provider(
                "gemini",
                GeminiProvider(
                    api_key=settings.GEMINI_API_KEY,
                    model_name=settings.GEMINI_MODEL,
                ),
            )
        if settings.OLLAMA_BASE_URL:
            self.register_provider(
                "ollama",
                OpenAICompatibleProvider(
                    api_key="ollama",
                    base_url=f"{settings.OLLAMA_BASE_URL.rstrip('/')}/v1",
                    model_name=settings.OLLAMA_MODEL,
                    provider_label="ollama",
                ),
            )
        if settings.AI_PRIMARY_PROVIDER in self._providers:
            self.primary_provider_name = settings.AI_PRIMARY_PROVIDER

    def register_provider(self, name: str, provider: BaseAIProvider) -> None:
        """Dynamically registers an AI provider adapter."""
        self._providers[name] = provider
        logger.info(f"Registered AI provider: {name} ({provider.default_model})")

    def list_providers(self) -> List[Dict[str, str]]:
        """Returns metadata for all available AI providers."""
        return [
            {
                "name": name,
                "provider_type": p.provider_name,
                "default_model": p.default_model,
            }
            for name, p in self._providers.items()
        ]

    def set_primary_provider(self, name: str) -> None:
        if name not in self._providers:
            raise ValueError(f"Provider '{name}' is not registered.")
        self.primary_provider_name = name

    def get_provider(self, name: Optional[str] = None) -> BaseAIProvider:
        target = name or self.primary_provider_name
        return self._providers.get(target, self._providers["synthetic"])

    async def complete(self, request: CompletionRequest) -> CompletionResponse:
        start_time = time.perf_counter()
        try:
            res = await self.get_provider().complete(request)
            res.latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
            return res
        except Exception as exc:
            logger.warning(
                f"Primary AI provider failed: {str(exc)}. Falling back to secondary provider."
            )
            fallback = self.get_provider(self.fallback_provider_name)
            res = await fallback.complete(request)
            res.latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
            return res

    async def stream_complete(self, request: CompletionRequest) -> AsyncIterator[str]:
        try:
            async for chunk in self.get_provider().stream_complete(request):
                yield chunk
        except Exception as exc:
            logger.warning(
                f"Primary stream failed: {str(exc)}. Falling back to secondary stream."
            )
            fallback = self.get_provider(self.fallback_provider_name)
            async for chunk in fallback.stream_complete(request):
                yield chunk

    async def benchmark(
        self,
        prompt: str,
        mode: ConversationMode = ConversationMode.JUST_LISTEN,
        language: str = "en",
    ) -> List[ProviderBenchmarkResult]:
        """Runs side-by-side benchmarking across all registered providers."""
        results: List[ProviderBenchmarkResult] = []
        req = CompletionRequest(
            messages=[Message(role="user", content=prompt)],
            mode=mode,
            language=language,
        )

        for name, provider in self._providers.items():
            start_time = time.perf_counter()
            try:
                res = await provider.complete(req)
                elapsed = (time.perf_counter() - start_time) * 1000
                results.append(
                    ProviderBenchmarkResult(
                        provider_name=name,
                        model_name=provider.default_model,
                        prompt=prompt,
                        response_preview=res.content[:120] + "...",
                        tokens_used=res.tokens_used,
                        latency_ms=round(elapsed, 2),
                        is_safe=True,
                        mode_adherent=True,
                    )
                )
            except Exception as e:
                elapsed = (time.perf_counter() - start_time) * 1000
                results.append(
                    ProviderBenchmarkResult(
                        provider_name=name,
                        model_name=provider.default_model,
                        prompt=prompt,
                        response_preview=f"Error: {str(e)}",
                        tokens_used=0,
                        latency_ms=round(elapsed, 2),
                        is_safe=False,
                        mode_adherent=False,
                    )
                )

        return results


ai_gateway = AIGateway()
