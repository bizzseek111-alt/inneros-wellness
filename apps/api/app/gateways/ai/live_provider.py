"""Live HTTP AI Provider Adapters (OpenAI, Ollama/vLLM, Anthropic Claude, Google Gemini).

Implements BaseAIProvider using httpx.AsyncClient for non-blocking completion and SSE token streaming.
When live credentials are configured in Settings (or registered dynamically), the AIGateway routes
requests directly to the live LLM while retaining automatic circuit-breaker fallback.
"""

import json
import time
from typing import AsyncIterator, Dict, List, Optional
import httpx

from app.gateways.ai.base import (
    BaseAIProvider,
    CompletionRequest,
    CompletionResponse,
)
from app.core.observability import logger


class OpenAICompatibleProvider(BaseAIProvider):
    """Live provider for OpenAI API, local Ollama (/v1), vLLM, or Azure OpenAI endpoints."""

    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.openai.com/v1",
        model_name: str = "gpt-4o-mini",
        provider_label: str = "openai",
    ) -> None:
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.default_model = model_name
        self.provider_name = provider_label

    def _headers(self) -> Dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers

    async def complete(self, request: CompletionRequest) -> CompletionResponse:
        start_time = time.perf_counter()
        payload = {
            "model": self.default_model,
            "messages": [{"role": m.role, "content": m.content} for m in request.messages],
            "temperature": request.temperature,
            "max_tokens": request.max_tokens,
            "stream": False,
        }
        async with httpx.AsyncClient(timeout=25.0) as client:
            resp = await client.post(
                f"{self.base_url}/chat/completions",
                headers=self._headers(),
                json=payload,
            )
            resp.raise_for_status()
            data = resp.json()

        choices = data.get("choices") or []
        content = choices[0].get("message", {}).get("content", "") if choices else ""
        usage = data.get("usage") or {}
        tokens = usage.get("total_tokens") or len(content.split())
        latency = (time.perf_counter() - start_time) * 1000

        return CompletionResponse(
            content=content,
            provider=self.provider_name,
            model=data.get("model", self.default_model),
            tokens_used=tokens,
            finish_reason=choices[0].get("finish_reason", "stop") if choices else "stop",
            mode_applied=request.mode,
            latency_ms=round(latency, 2),
        )

    async def stream_complete(self, request: CompletionRequest) -> AsyncIterator[str]:
        payload = {
            "model": self.default_model,
            "messages": [{"role": m.role, "content": m.content} for m in request.messages],
            "temperature": request.temperature,
            "max_tokens": request.max_tokens,
            "stream": True,
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            async with client.stream(
                "POST",
                f"{self.base_url}/chat/completions",
                headers=self._headers(),
                json=payload,
            ) as resp:
                resp.raise_for_status()
                async for line in resp.aiter_lines():
                    if not line or not line.startswith("data:"):
                        continue
                    chunk_str = line[len("data:") :].strip()
                    if chunk_str == "[DONE]":
                        break
                    try:
                        chunk_json = json.loads(chunk_str)
                        delta = (
                            chunk_json.get("choices", [{}])[0]
                            .get("delta", {})
                            .get("content")
                        )
                        if delta:
                            yield delta
                    except Exception:
                        continue


class AnthropicProvider(BaseAIProvider):
    """Live provider for Anthropic Messages API (Claude 3.5 Sonnet / Haiku)."""

    provider_name: str = "anthropic"

    def __init__(
        self,
        api_key: str,
        model_name: str = "claude-3-5-sonnet-latest",
        base_url: str = "https://api.anthropic.com/v1",
    ) -> None:
        self.api_key = api_key
        self.default_model = model_name
        self.base_url = base_url.rstrip("/")

    def _headers(self) -> Dict[str, str]:
        return {
            "Content-Type": "application/json",
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
        }

    async def complete(self, request: CompletionRequest) -> CompletionResponse:
        start_time = time.perf_counter()
        system_prompt = ""
        chat_messages: List[Dict[str, str]] = []
        for m in request.messages:
            if m.role == "system":
                system_prompt += (m.content + "\n")
            else:
                chat_messages.append({"role": m.role, "content": m.content})

        if not chat_messages:
            chat_messages.append({"role": "user", "content": "Hello"})

        payload: Dict[str, object] = {
            "model": self.default_model,
            "max_tokens": request.max_tokens,
            "temperature": request.temperature,
            "messages": chat_messages,
        }
        if system_prompt.strip():
            payload["system"] = system_prompt.strip()

        async with httpx.AsyncClient(timeout=25.0) as client:
            resp = await client.post(
                f"{self.base_url}/messages",
                headers=self._headers(),
                json=payload,
            )
            resp.raise_for_status()
            data = resp.json()

        blocks = data.get("content") or []
        content = "".join(b.get("text", "") for b in blocks if b.get("type") == "text")
        usage = data.get("usage") or {}
        tokens = (usage.get("input_tokens", 0) + usage.get("output_tokens", 0)) or len(content.split())
        latency = (time.perf_counter() - start_time) * 1000

        return CompletionResponse(
            content=content,
            provider=self.provider_name,
            model=data.get("model", self.default_model),
            tokens_used=tokens,
            finish_reason=data.get("stop_reason", "stop"),
            mode_applied=request.mode,
            latency_ms=round(latency, 2),
        )

    async def stream_complete(self, request: CompletionRequest) -> AsyncIterator[str]:
        res = await self.complete(request)
        for word in res.content.split(" "):
            yield word + " "


class GeminiProvider(BaseAIProvider):
    """Live provider for Google Gemini Generative Language API."""

    provider_name: str = "gemini"

    def __init__(
        self,
        api_key: str,
        model_name: str = "gemini-2.0-flash",
    ) -> None:
        self.api_key = api_key
        self.default_model = model_name

    async def complete(self, request: CompletionRequest) -> CompletionResponse:
        start_time = time.perf_counter()
        system_instruction = ""
        contents = []
        for m in request.messages:
            if m.role == "system":
                system_instruction += m.content + "\n"
            else:
                role = "model" if m.role == "assistant" else "user"
                contents.append({"role": role, "parts": [{"text": m.content}]})

        payload: Dict[str, object] = {
            "contents": contents,
            "generationConfig": {
                "temperature": request.temperature,
                "maxOutputTokens": request.max_tokens,
            },
        }
        if system_instruction.strip():
            payload["systemInstruction"] = {"parts": [{"text": system_instruction.strip()}]}

        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{self.default_model}:generateContent?key={self.api_key}"
        )
        async with httpx.AsyncClient(timeout=25.0) as client:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
            data = resp.json()

        candidates = data.get("candidates") or []
        parts = candidates[0].get("content", {}).get("parts", []) if candidates else []
        content = "".join(p.get("text", "") for p in parts)
        latency = (time.perf_counter() - start_time) * 1000

        return CompletionResponse(
            content=content,
            provider=self.provider_name,
            model=self.default_model,
            tokens_used=len(content.split()),
            finish_reason="stop",
            mode_applied=request.mode,
            latency_ms=round(latency, 2),
        )

    async def stream_complete(self, request: CompletionRequest) -> AsyncIterator[str]:
        res = await self.complete(request)
        for word in res.content.split(" "):
            yield word + " "
