# InnerOS: Observability & Deployment Architecture

## 1. Observability Strategy

Because InnerOS operates in an intimate personal wellbeing domain, observability must balance **system reliability** with **strict privacy preservation**.

### 1.1 Metrics (Prometheus)
- `inneros_http_requests_total{method, endpoint, status}`
- `inneros_http_request_duration_seconds{endpoint, le}`
- `inneros_safety_evaluations_total{category, risk_level}`
- `inneros_llm_tokens_total{provider, model, direction}`
- `inneros_voice_synthesis_duration_seconds{provider}`

### 1.2 OpenTelemetry Tracing
- Distributed traces follow the request lifecycle from Next.js client -> FastAPI Ingress -> Safety Guardrail -> Vector Database -> LLM Gateway.
- Sensitive emotional text and memory bodies are **redacted** from span attributes (`db.statement` sanitized, `user.utterance` masked).

### 1.3 Health Probe Architecture
- `/health`: Liveness probe (returns HTTP 200 if process is responsive).
- `/api/v1/health`: Readiness probe (verifies database connectivity, vector index readiness, AI gateway fallback health, and safety engine status).

---

## 2. Containerization & Deployment

### 2.1 Multi-Container Architecture
```
                         +--------------------------+
                         | Ingress Controller (TLS) |
                         +------------+-------------+
                                      |
                 +--------------------+--------------------+
                 |                                         |
                 v                                         v
   +---------------------------+             +---------------------------+
   |  apps/web (Next.js Node)  |             |  apps/api (FastAPI Py)    |
   |  Replica Count: 3+        |             |  Replica Count: 3+        |
   |  Resources: 512MB / 0.5c  |             |  Resources: 1GB / 1.0c    |
   +---------------------------+             +-------------+-------------+
                                                           |
                                             +-------------+-------------+
                                             | PostgreSQL 16 + pgvector  |
                                             | Primary + Read Replica    |
                                             +---------------------------+
```

### 2.2 Continuous Integration & Delivery (CI/CD)
The automated pipeline executes on every pull request:
1. **Linting & Code Quality**: ESLint, Prettier, Ruff/Flake8, Typecheck (`tsc --noEmit`).
2. **Safety Regression Suite**: Automated test suite asserting that suicidal ideation, self-harm prompts, and medical advice requests trigger immediate de-escalation and helpline surfacing.
3. **Unit & Contract Testing**: Pytest for backend domains; Jest/Vitest for frontend components.
4. **Container Image Build**: Multi-stage distroless Docker image compilation with non-root user execution.
