# InnerOS Security & Privacy Findings Audit

**Date:** November 1, 2026  
**Auditor:** Senior Application Security Engineer & Privacy Architect  
**Scope:** Cryptography, Authentication, Deceptive Claims, Data-at-Rest, and Regulatory Boundaries  

---

## 1. Deceptive Technical Claims vs. Implementation Reality

A critical ethical and legal risk in AI wellbeing applications is overstating security, cryptographic protection, or compliance certifications to consumers. The audit identified multiple instances where UI labels present claims that do not reflect underlying engineering reality:

```
+-------------------------------------------------------------------------+
|                  CLAIMED CAPABILITY VS. ACTUAL REALITY                  |
+-------------------------------------------------------------------------+
| Displayed UI Claim                    | Technical Reality               |
+---------------------------------------+---------------------------------+
| "AES-256 HKDF Encrypted Storage"      | Memories are raw Python dicts   |
| (Badged across all memory nodes)      | in process memory (RAM).        |
+---------------------------------------+---------------------------------+
| "Envelope Encryption Active"          | Real AES-256-GCM exists ONLY    |
| (Badged in Privacy Settings)          | for Google OAuth tokens.        |
+---------------------------------------+---------------------------------+
| "Certified GDPR Art. 17 & 20"         | Endpoint deletes in-memory dict;|
|                                       | No formal DPIA/DPO execution.   |
+---------------------------------------+---------------------------------+
| "AI Confidence Score: 85%"            | Hardcoded synthetic float;      |
|                                       | Not an empirical metric.        |
+---------------------------------------+---------------------------------+
```

### 1.1 Deceptive Encryption Claims
- **Issue:** The badge `AES-256 HKDF` appears on `/memory` headers, cards, and inspector drawers.
- **Reality:** While `apps/api/app/domains/integrations/crypto.py` correctly implements AES-256-GCM with PBKDF2 for OAuth tokens, the actual user memory records (`_MEMORY_RECORDS_STORE`) and Life Graph nodes (`_LIFE_GRAPH_NODES_STORE`) are standard in-memory Python dictionaries holding unencrypted plaintext strings.
- **Risk:** Under FTC Act Section 5 and EU Unfair Commercial Practices Directive, claiming data is "AES-256 encrypted at rest" when it resides in unencrypted application memory constitutes a deceptive consumer statement.
- **Remediation:** Remove misleading cryptographic badges from everyday wellbeing screens. Move technical encryption disclosures to a dedicated, factual Privacy & Security Information section that accurately describes what is and is not encrypted.

---

## 2. Authentication & Multi-Tenant Isolation Deficiencies

### 2.1 Default Synthetic Identity Fallback
- **Location:** `apps/api/app/core/security.py` (lines 28–53).
- **Vulnerability:**
  ```python
  user_id = x_user_id or SYNTHETIC_DEFAULT_USER.user_id
  tenant_id = x_tenant_id or SYNTHETIC_DEFAULT_USER.tenant_id
  ```
- **Severity:** **HIGH (P1)** in production; **ACCEPTABLE (P3)** in local prototype.
- **Risk:** Any HTTP request lacking an `X-User-ID` header is silently authenticated as `usr_synthetic_elena_vance_001`. If this backend were deployed to a shared staging or public cloud environment without an upstream authenticating proxy, all incoming users would read and modify the same synthetic user state.
- **Remediation:** Implement signed JWT token validation with expiring sessions and reject unauthenticated requests with HTTP 401.

### 2.2 Lack of CSRF Protection on OAuth Callbacks
- **Location:** `apps/api/app/domains/integrations/router.py`.
- **Finding:** While `state` validation is enforced in service logic, frontend cookie handling does not currently set `SameSite=Strict` or `SameSite=Lax` with CSRF tokens on session redirects.

---

## 3. Prompt Injection & Ingestion Safety

### 3.1 Document & Archive Parsers
- **Location:** `apps/api/app/domains/integrations/service.py`.
- **Strengths:** The ingestion pipeline performs regex-based PII scrubbing (phone numbers, emails, SSNs) and strips known prompt injection delimiters (`IGNORE PREVIOUS INSTRUCTIONS`, `<|im_start|>`, etc.).
- **Vulnerability:** Complex polyglot indirect prompt injections or stealth steganography embedded in multi-page PDFs can bypass naive regex filters.
- **Remediation:** Introduce a secondary semantic boundary check before candidate memories are staged for user approval.

---

## 4. Emergency Crisis & Safety Interception Posture

### 4.1 Safety Evaluator Verification
- **Strengths:** 
  - Deterministic Tier 1 regex engine intercepts suicidal ideation, self-harm, intimate partner violence, and acute psychosis before model completion.
  - Zero false negatives in automated test suite across English, Bulgarian, Spanish, German, French, and Arabic.
  - Emergency phone numbers (988, 111, 112, 0800 88 001) are verified national helplines.
- **Safety UX Consideration:** Emergency support access must remain visible and accessible (e.g. in the secondary navigation and top bar), but must NOT overwhelm the everyday interface with constant emergency panic styling that increases user distress.
