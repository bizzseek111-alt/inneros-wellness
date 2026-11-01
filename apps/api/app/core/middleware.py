"""InnerOS Security & Privacy Middleware.
Enforces request timing, security response headers, and zero-PII audit logging.
"""

import time
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.observability import logger


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Injects defensive HTTP security headers into all API responses."""

    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response


class SafeAuditLoggingMiddleware(BaseHTTPMiddleware):
    """Logs incoming requests without exposing payload content or PII to stdout."""

    async def dispatch(self, request: Request, call_next):
        start_time = time.perf_counter()

        response: Response = await call_next(request)

        duration_ms = (time.perf_counter() - start_time) * 1000.0

        # Structured metadata without logging request bodies
        extra = {
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "duration_ms": round(duration_ms, 2),
            "client_ip": request.client.host if request.client else "unknown",
        }

        # User ID hash if present
        user_id = request.headers.get("X-User-ID")
        if user_id:
            extra["user_id_present"] = True

        logger.info(
            f"HTTP {request.method} {request.url.path} -> {response.status_code} ({duration_ms:.2f}ms)",
            extra={"extra": extra},
        )

        return response
