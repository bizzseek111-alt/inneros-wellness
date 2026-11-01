# InnerOS: Security, Privacy & Consent Architecture

## 1. Principles of Sanctuary Computing

InnerOS is designed under the philosophy of **Sanctuary Computing**: an individual's innermost emotional thoughts, reflections, and vulnerabilities require a higher standard of confidentiality and agency than standard consumer applications.

---

## 2. Threat Model (STRIDE)

| Threat | Vulnerability Target | InnerOS Mitigation |
| :--- | :--- | :--- |
| **Spoofing** | Attacker impersonating user | Scoped short-lived JWTs, optional WebAuthn/Passkey authentication, session binding. |
| **Tampering** | Interception of memory graphs or journals | TLS 1.3 in transit; AES-256-GCM envelope encryption at rest; SHA-256 content hashes. |
| **Repudiation** | Denying consent change | Append-only cryptographically linked Consent Ledger. |
| **Information Disclosure** | Database dump leaking intimate journals | Envelope encryption where user records cannot be decrypted without user-derived key; PostgreSQL Row Level Security (RLS). |
| **Denial of Service** | Spammed audio/LLM synthesis | Token-bucket rate limiting per user/IP; tiered quota enforcement. |
| **Elevation of Privilege** | Cross-tenant memory access | Multi-tenant schema separation with mandatory tenant UUID context injection in all queries. |

---

## 3. Tenant & User Isolation

### 3.1 PostgreSQL Row Level Security (RLS)
All tables containing user or memory data declare tenant and user ownership:

```sql
ALTER TABLE user_memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_memory_isolation_policy ON user_memories
    FOR ALL
    USING (user_id = current_setting('app.current_user_id')::uuid);
```

Before any database query in FastAPI, the session dependency executes:
```python
db.execute(text("SET LOCAL app.current_user_id = :user_id"), {"user_id": current_user.id})
```

---

## 4. Encryption Architecture

InnerOS employs a **Two-Tier Envelope Encryption** scheme:

```
+-------------------------------------------------------+
| Key Management Service (KMS) or Local HSM             |
|   Master Key (MK)                                     |
+---------------------------|---------------------------+
                            |
                            v
+-------------------------------------------------------+
| Key Derivation Function (HKDF-SHA256)                 |
|   Inputs: Master Key + User UUID + User Salt          |
|   Output: Per-User Data Encryption Key (DEK)          |
+---------------------------|---------------------------+
                            |
                            v
+-------------------------------------------------------+
| AES-256-GCM Encrypt / Decrypt                         |
|   Payload: Journal text, Memory reflections, Notes    |
|   Output: Encrypted Ciphertext + Auth Tag + IV        |
+-------------------------------------------------------+
```

### Encryption Invariant
- Vector embeddings in `pgvector` encode high-level semantic dimensions for search, while the raw text content is encrypted.
- No database administrator viewing database backups can read raw diary entries in plain text.

---

## 5. User Agency & Consent Ledger

### 5.1 Granular Consent Categories
Users retain granular control over every cognitive capability:
1. `store_conversational_history`: Retain working session context.
2. `derive_long_term_memory`: Extract facts for the life graph.
3. `voice_audio_processing`: Stream audio to voice models without saving raw audio.
4. `integration_calendar_sync`: Cross-reference calendar events for gentle preparation prompts.

### 5.2 The "Forget Me" Protocol (GDPR Article 17)
When a user clicks "Delete Memory" or "Purge Account":
1. The memory node is deleted from the relational table.
2. The vector embedding is deleted from `pgvector`.
3. Any graph adjacency edges referencing the node are severed.
4. An immutable audit record `{"event": "MEMORY_DELETED", "memory_id_hash": "..."}` is logged.

---

## 6. Zero-Data-Leakage Logging

Standard web frameworks frequently leak sensitive query parameters or request bodies to stdout and log aggregators (e.g. Datadog, CloudWatch).
InnerOS utilizes a custom `PIIScrubbingLoggingMiddleware`:
- Request bodies for `/api/v1/companion/chat` and `/api/v1/memory` are marked as **SensitivePayload**.
- Logs record only request metadata (User UUID hash, response status code, latency, token count, safety score).
- Plaintext user thoughts and audio buffers are never output to application logs.
