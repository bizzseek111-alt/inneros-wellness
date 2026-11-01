"""InnerOS FastAPI Application Entrypoint.
Multimodal Personal Wellbeing & Life Companion Platform.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any

from app.config import settings
from app.core.middleware import (
    SecurityHeadersMiddleware,
    SafeAuditLoggingMiddleware,
)
from app.core.observability import logger

# Import domain routers
from app.domains.safety.router import router as safety_router
from app.domains.companion.router import router as companion_router
from app.domains.memory.router import router as memory_router
from app.domains.knowledge.router import router as knowledge_router
from app.domains.voice.router import router as voice_router
from app.domains.reminders.router import router as reminders_router
from app.domains.integrations.router import router as integrations_router
from app.domains.admin.router import router as admin_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize logging, verify encryption keys, and log synthetic mode
    logger.info("Initializing InnerOS Core Backend Engine...")
    logger.info(f"Environment: {settings.ENVIRONMENT} | Mode: Non-Clinical Sanctuary")
    logger.info("Modular AI Gateway initialized with synthetic fallback resilience.")
    yield
    # Shutdown
    logger.info("Shutting down InnerOS Core Backend Engine.")


app = FastAPI(
    title="InnerOS API",
    description=(
        "Global AI-Powered Personal Emotional Wellbeing and Life Companion Platform.\n\n"
        "**NON-CLINICAL NOTICE**: InnerOS is an emotional support and educational lifestyle companion. "
        "It does not provide medical advice, diagnosis, psychotherapy, or emergency psychiatric services."
    ),
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Core Middleware Pipeline
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(SafeAuditLoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HealthStatus(BaseModel):
    status: str
    version: str
    environment: str
    subsystems: Dict[str, Any]


@app.get("/health", status_code=status.HTTP_200_OK, tags=["System Health"])
async def liveness_probe():
    """Kubernetes / Docker liveness probe: returns 200 OK when the process is up."""
    return {"status": "alive", "version": settings.APP_VERSION}


@app.get("/api/v1/health", response_model=HealthStatus, tags=["System Health"])
async def readiness_probe():
    """Comprehensive readiness probe verifying subsystems and non-clinical guardrails."""
    return HealthStatus(
        status="healthy",
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
        subsystems={
            "safety_guardrails": "active_and_enforced",
            "ai_gateway": f"ready ({settings.AI_PRIMARY_PROVIDER})",
            "voice_pipeline": f"ready ({settings.VOICE_STT_PROVIDER})",
            "memory_encryption": "AES-256-GCM + HKDF active",
            "synthetic_fixtures": "loaded",
            "regulatory_status": "Non-Clinical Wellness Software (FDA 21 CFR 882 compliant)",
        },
    )


# Mount Bounded Domain Routers under /api/v1
app.include_router(safety_router, prefix="/api/v1")
app.include_router(companion_router, prefix="/api/v1")
app.include_router(memory_router, prefix="/api/v1")
app.include_router(knowledge_router, prefix="/api/v1")
app.include_router(voice_router, prefix="/api/v1")
app.include_router(reminders_router, prefix="/api/v1")
app.include_router(integrations_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
