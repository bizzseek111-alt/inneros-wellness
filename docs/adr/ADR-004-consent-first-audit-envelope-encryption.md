# ADR-004: Consent-First Audit & Envelope Encryption Strategy

## Status
Accepted

## Context
Emotional wellbeing notes, life events, and cognitive reflections are deeply personal data. Users must have total transparency, cryptographic security, and full autonomy over their memories, adhering strictly to global privacy frameworks (GDPR Article 17, California CCPA/CPRA).

## Decision
1. **Consent-Gated Processing**: The backend enforces a mandatory consent check on every memory write, retrieval, and third-party data integration.
2. **Two-Tier Envelope Encryption**:
   - Master Key stored in secure KMS / environment secret.
   - Per-user Data Encryption Keys (DEKs) derived using HKDF-SHA256 from the Master Key and the user's cryptographic salt.
   - Sensitive text fields (journal reflections, episodic memories) stored as AES-256-GCM ciphertexts.
3. **Immutable Consent & Audit Ledger**: Every grant, revocation, and deletion is recorded with cryptographic hashing.
4. **Zero-PII Logging**: Server logs redact emotional content, journal bodies, and voice buffers.

## Consequences
- Slightly higher CPU overhead during encryption/decryption (negligible with AES-NI hardware acceleration).
- Guarantees that database backups do not expose user reflections in cleartext.
- Enables instant, cryptographically verifiable "Right to be Forgotten".
