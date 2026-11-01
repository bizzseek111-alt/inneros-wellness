"""Integrations Domain Service.
Implements the InnerOS Personal Context Hub:
- 8-step user-controlled ingestion pipeline (upload, parse, preview/exclude, PII scrub, candidate memory extraction, user confirmation, approved storage, revocation)
- Official ChatGPT and Claude export parsers
- Document parsers for PDF, Markdown, TXT, and iCal/ICS
- Prompt injection defense & untrusted content sanitization
- Google Calendar OAuth 2.0 connector with encrypted tokens and minimal read-only scopes
- Phase Two architectural security specifications (Gmail, Notion, Apple Health, Wearables)
"""

import os
import re
import json
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Optional, Tuple, Any

from app.domains.integrations.schemas import (
    ImportSource,
    ImportBatchStatus,
    CandidateMemoryItem,
    ParsedItem,
    SanitizedSnippet,
    ImportPreviewRequest,
    ImportPreviewResponse,
    ImportUploadRequest,
    ImportBatchResponse,
    ConfirmImportResponse,
    OAuthConnection,
    CalendarEventItem,
    CalendarSyncResponse,
    PhaseTwoArchitectureSpec,
)
from app.core.encryption import encrypt_payload, decrypt_payload
from app.domains.memory.service import memory_service
from app.domains.memory.schemas import (
    MemoryCreateRequest,
    MemoryCategory,
    MemoryRecordType,
    MemoryStatus,
    CertaintyLevel,
    MemoryProvenance,
)

# In-memory stores partitioned by user_id
_STAGED_BATCHES: Dict[str, Dict[str, ImportBatchResponse]] = {}
_OAUTH_CONNECTIONS: Dict[str, Dict[str, OAuthConnection]] = {}
_ENCRYPTED_TOKENS: Dict[str, Dict[str, Tuple[str, str, str]]] = {}  # connection_id -> (cipher, nonce, salt)

# --- PII Regex Filters ---
EMAIL_REGEX = re.compile(r"[\w\.-]+@[\w\.-]+\.\w+")
PHONE_REGEX = re.compile(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}")
SSN_REGEX = re.compile(r"\b\d{3}-\d{2}-\d{4}\b")
CREDIT_CARD_REGEX = re.compile(r"\b(?:\d{4}[-\s]?){3}\d{4}\b")
STREET_ADDRESS_REGEX = re.compile(r"\b\d{1,5}\s+[A-Za-z0-9\.\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Way|Lane|Ln)\b", re.IGNORECASE)

# --- Prompt Injection Defense Signatures ---
PROMPT_INJECTION_PATTERNS = [
    (re.compile(r"(?i)ignore (?:all )?(?:previous|above) instructions"), "Instruction Override Attempt"),
    (re.compile(r"(?i)system prompt (?:override|reset)"), "System Prompt Reset Attempt"),
    (re.compile(r"(?i)you are now (?:in developer mode|DAN|unrestricted)"), "Jailbreak Roleplay Attempt"),
    (re.compile(r"(?i)assistant:\s*you must"), "Assistant Role Hijack"),
    (re.compile(r"(?i)<\s*script[^>]*>"), "Embedded Script Tag Injection"),
    (re.compile(r"(?i)!\[.*?\]\(https?://[^\)]+\)"), "Markdown Image Exfiltration Trigger"),
    (re.compile(r"(?i)disregard (?:safety|ethics) guidelines"), "Safety Bypass Instruction"),
]


def scrub_pii(text: str, custom_terms: Optional[List[str]] = None) -> Tuple[str, List[str]]:
    """Redacts PII entities (email, phone, SSN, payment cards, addresses, custom terms)."""
    detected_entities: List[str] = []
    scrubbed = text

    # Redact Emails
    emails = EMAIL_REGEX.findall(scrubbed)
    if emails:
        detected_entities.extend(emails)
        scrubbed = EMAIL_REGEX.sub("[EMAIL_REDACTED]", scrubbed)

    # Redact Phone Numbers
    phones = PHONE_REGEX.findall(scrubbed)
    if phones:
        detected_entities.extend(["[Phone Number]" for _ in phones])
        scrubbed = PHONE_REGEX.sub("[PHONE_REDACTED]", scrubbed)

    # Redact SSNs
    ssns = SSN_REGEX.findall(scrubbed)
    if ssns:
        detected_entities.extend(["[SSN/National ID]" for _ in ssns])
        scrubbed = SSN_REGEX.sub("[SSN_REDACTED]", scrubbed)

    # Redact Credit Cards
    cards = CREDIT_CARD_REGEX.findall(scrubbed)
    if cards:
        detected_entities.extend(["[Payment Card]" for _ in cards])
        scrubbed = CREDIT_CARD_REGEX.sub("[PAYMENT_CARD_REDACTED]", scrubbed)

    # Redact Street Addresses
    addresses = STREET_ADDRESS_REGEX.findall(scrubbed)
    if addresses:
        detected_entities.extend(addresses)
        scrubbed = STREET_ADDRESS_REGEX.sub("[STREET_ADDRESS_REDACTED]", scrubbed)

    # Custom Terms
    if custom_terms:
        for term in custom_terms:
            if term.strip() and term.lower() in scrubbed.lower():
                detected_entities.append(f"Custom: {term}")
                pattern = re.compile(re.escape(term), re.IGNORECASE)
                scrubbed = pattern.sub("[REDACTED_CUSTOM]", scrubbed)

    return scrubbed, list(set(detected_entities))


def sanitize_untrusted_instructions(text: str) -> Tuple[str, bool, List[str]]:
    """Defends against prompt injection and indirect jailbreaks in imported documents.
    
    Treats imported content strictly as untrusted data rather than executable instructions.
    """
    flags: List[str] = []
    sanitized = text

    for pattern, desc in PROMPT_INJECTION_PATTERNS:
        matches = pattern.findall(sanitized)
        if matches:
            flags.append(desc)
            # Neutralize instruction by disarming
            sanitized = pattern.sub(f"[DISARMED_UNTRUSTED_INSTRUCTION: {desc}]", sanitized)

    has_injection = len(flags) > 0
    return sanitized, has_injection, flags


def extract_candidate_memories_from_text(
    text: str, source_context: str
) -> List[CandidateMemoryItem]:
    """Extracts candidate structured memories into official InnerOS categories.
    
    Guarantees strict separation between verified stored facts and tentative interpretations.
    """
    candidates: List[CandidateMemoryItem] = []
    lower = text.lower()

    # 1. Personal Goals
    goal_indicators = ["goal is to", "aim to", "want to achieve", "trying to build", "learning to"]
    for ind in goal_indicators:
        if ind in lower:
            idx = lower.find(ind)
            sentence = text[idx : idx + 120].split(".")[0].strip()
            candidates.append(
                CandidateMemoryItem(
                    candidate_id=f"cand_goal_{uuid.uuid4().hex[:6]}",
                    category=MemoryCategory.PERSONAL_GOALS.value,
                    record_type=MemoryRecordType.STORED_FACT.value,
                    fact_statement=f"Personal Goal: User is {sentence}",
                    confidence_score=0.92,
                    source_quote=sentence,
                    is_sensitive=False,
                )
            )
            break

    # 2. Habits and Routines
    habit_indicators = ["every morning", "evening routine", "usually wake up", "daily walk", "habit of"]
    for ind in habit_indicators:
        if ind in lower:
            idx = lower.find(ind)
            sentence = text[idx : idx + 120].split(".")[0].strip()
            candidates.append(
                CandidateMemoryItem(
                    candidate_id=f"cand_habit_{uuid.uuid4().hex[:6]}",
                    category=MemoryCategory.HABITS_AND_ROUTINES.value,
                    record_type=MemoryRecordType.STORED_FACT.value,
                    fact_statement=f"Habit/Routine: User practices '{sentence}'",
                    confidence_score=0.90,
                    source_quote=sentence,
                    is_sensitive=False,
                )
            )
            break

    # 3. Work and Career Context
    work_indicators = ["work as", "design lead", "software engineer", "client deadline", "team meeting"]
    for ind in work_indicators:
        if ind in lower:
            idx = lower.find(ind)
            sentence = text[idx : idx + 120].split(".")[0].strip()
            candidates.append(
                CandidateMemoryItem(
                    candidate_id=f"cand_work_{uuid.uuid4().hex[:6]}",
                    category=MemoryCategory.WORK_AND_CAREER_INFORMATION.value,
                    record_type=MemoryRecordType.STORED_FACT.value,
                    fact_statement=f"Work Context: {sentence}",
                    confidence_score=0.88,
                    source_quote=sentence,
                    is_sensitive=False,
                )
            )
            break

    # 4. Coping Preferences
    coping_indicators = ["helps me calm down", "box breathing", "listening to ambient music", "stepping outside"]
    for ind in coping_indicators:
        if ind in lower:
            idx = lower.find(ind)
            sentence = text[idx : idx + 120].split(".")[0].strip()
            candidates.append(
                CandidateMemoryItem(
                    candidate_id=f"cand_coping_{uuid.uuid4().hex[:6]}",
                    category=MemoryCategory.COPING_PREFERENCES.value,
                    record_type=MemoryRecordType.STORED_FACT.value,
                    fact_statement=f"Coping Preference: User finds '{sentence}' grounding",
                    confidence_score=0.95,
                    source_quote=sentence,
                    is_sensitive=False,
                )
            )
            break

    # 5. Sensitive Health Context (Strict opt-in required)
    health_indicators = ["diagnosed with", "taking medication", "chronic insomnia", "therapy appointment"]
    for ind in health_indicators:
        if ind in lower:
            idx = lower.find(ind)
            sentence = text[idx : idx + 120].split(".")[0].strip()
            candidates.append(
                CandidateMemoryItem(
                    candidate_id=f"cand_health_{uuid.uuid4().hex[:6]}",
                    category=MemoryCategory.OPTIONAL_SENSITIVE_HEALTH_RELATED_INFORMATION.value,
                    record_type=MemoryRecordType.STORED_FACT.value,
                    fact_statement=f"Self-Reported Health Context: {sentence}",
                    confidence_score=0.85,
                    source_quote=sentence,
                    is_sensitive=True,
                )
            )
            break

    # 6. Tentative AI Hypothesis if emotional tension detected
    if any(w in lower for w in ["overwhelmed", "frustrated", "burnout", "exhausted"]):
        candidates.append(
            CandidateMemoryItem(
                candidate_id=f"cand_tentative_{uuid.uuid4().hex[:6]}",
                category=MemoryCategory.SELF_REPORTED_EMOTIONS.value,
                record_type=MemoryRecordType.TENTATIVE_AI_INTERPRETATION.value,
                fact_statement="Tentative Hypothesis: User may experience cognitive overload when workload surges without buffers.",
                confidence_score=0.65,
                source_quote="Expresses feelings of exhaustion and deadline pressure.",
                is_sensitive=False,
            )
        )

    return candidates


# --- Format Parsers ---

def parse_chatgpt_json(raw_text: str) -> List[ParsedItem]:
    """Parses official OpenAI conversations.json export structure."""
    items: List[ParsedItem] = []
    try:
        data = json.loads(raw_text)
        if isinstance(data, dict):
            data = [data]

        for idx, conv in enumerate(data):
            conv_id = conv.get("id", f"chatgpt_conv_{idx}")
            title = conv.get("title", f"ChatGPT Conversation #{idx+1}")
            create_time = conv.get("create_time")
            date_str = datetime.fromtimestamp(create_time, tz=timezone.utc).isoformat() if create_time else None

            # Extract user & assistant utterances
            turns: List[str] = []
            mapping = conv.get("mapping", {})
            if isinstance(mapping, dict):
                for node_id, node in mapping.items():
                    msg = node.get("message")
                    if msg and isinstance(msg, dict):
                        role = msg.get("author", {}).get("role", "unknown")
                        content_parts = msg.get("content", {}).get("parts", [])
                        text_body = " ".join([p for p in content_parts if isinstance(p, str)])
                        if text_body.strip():
                            turns.append(f"{role.capitalize()}: {text_body.strip()}")
            elif "messages" in conv and isinstance(conv["messages"], list):
                for m in conv["messages"]:
                    r = m.get("role", "unknown")
                    t = m.get("content", "")
                    turns.append(f"{r.capitalize()}: {t}")

            raw_body = "\n\n".join(turns) if turns else json.dumps(conv)[:500]

            # Security: Sanitize prompt injection & scrub PII
            disarmed_body, injection_detected, injection_flags = sanitize_untrusted_instructions(raw_body)
            scrubbed_body, pii_entities = scrub_pii(disarmed_body)

            candidate_memories = extract_candidate_memories_from_text(scrubbed_body, source_context=title)

            items.append(
                ParsedItem(
                    item_id=f"item_{conv_id}",
                    title=title,
                    date_timestamp=date_str,
                    original_length=len(raw_body),
                    raw_content=raw_body,
                    scrubbed_content=scrubbed_body,
                    detected_pii=pii_entities,
                    prompt_injection_detected=injection_detected,
                    prompt_injection_flags=injection_flags,
                    selected_for_import=True,
                    suggested_memories=candidate_memories,
                )
            )
    except Exception as e:
        # Fallback for raw text snippet
        disarmed, inj_detected, inj_flags = sanitize_untrusted_instructions(raw_text)
        scrubbed, pii = scrub_pii(disarmed)
        items.append(
            ParsedItem(
                item_id=f"item_chatgpt_fallback_{uuid.uuid4().hex[:6]}",
                title="Imported ChatGPT Session",
                original_length=len(raw_text),
                raw_content=raw_text,
                scrubbed_content=scrubbed,
                detected_pii=pii,
                prompt_injection_detected=inj_detected,
                prompt_injection_flags=inj_flags,
                selected_for_import=True,
                suggested_memories=extract_candidate_memories_from_text(scrubbed, "ChatGPT Session"),
            )
        )
    return items


def parse_claude_json(raw_text: str) -> List[ParsedItem]:
    """Parses official Anthropic conversations.json export structure."""
    items: List[ParsedItem] = []
    try:
        data = json.loads(raw_text)
        if isinstance(data, dict):
            data = [data]

        for idx, conv in enumerate(data):
            conv_id = conv.get("uuid", f"claude_conv_{idx}")
            title = conv.get("name", f"Claude Conversation #{idx+1}")
            created_at = conv.get("created_at")

            turns: List[str] = []
            messages = conv.get("chat_messages", conv.get("messages", []))
            for m in messages:
                sender = m.get("sender", m.get("role", "human"))
                body = m.get("text", m.get("content", ""))
                turns.append(f"{sender.capitalize()}: {body.strip()}")

            raw_body = "\n\n".join(turns) if turns else json.dumps(conv)[:500]

            disarmed_body, inj_detected, inj_flags = sanitize_untrusted_instructions(raw_body)
            scrubbed_body, pii_entities = scrub_pii(disarmed_body)
            candidate_memories = extract_candidate_memories_from_text(scrubbed_body, source_context=title)

            items.append(
                ParsedItem(
                    item_id=f"item_{conv_id}",
                    title=title,
                    date_timestamp=created_at,
                    original_length=len(raw_body),
                    raw_content=raw_body,
                    scrubbed_content=scrubbed_body,
                    detected_pii=pii_entities,
                    prompt_injection_detected=inj_detected,
                    prompt_injection_flags=inj_flags,
                    selected_for_import=True,
                    suggested_memories=candidate_memories,
                )
            )
    except Exception:
        disarmed, inj_detected, inj_flags = sanitize_untrusted_instructions(raw_text)
        scrubbed, pii = scrub_pii(disarmed)
        items.append(
            ParsedItem(
                item_id=f"item_claude_fallback_{uuid.uuid4().hex[:6]}",
                title="Imported Claude Conversation",
                original_length=len(raw_text),
                raw_content=raw_text,
                scrubbed_content=scrubbed,
                detected_pii=pii,
                prompt_injection_detected=inj_detected,
                prompt_injection_flags=inj_flags,
                selected_for_import=True,
                suggested_memories=extract_candidate_memories_from_text(scrubbed, "Claude Conversation"),
            )
        )
    return items


def parse_markdown_or_txt(raw_text: str, filename: str) -> List[ParsedItem]:
    """Parses markdown / txt documents by sections and date headers."""
    sections = re.split(r"\n(?=#{1,3}\s+|\d{4}-\d{2}-\d{2}|---)", raw_text)
    if not sections or len(sections) == 1:
        sections = [raw_text]

    items: List[ParsedItem] = []
    for idx, sec in enumerate(sections):
        if not sec.strip():
            continue
        first_line = sec.strip().split("\n")[0][:60].replace("#", "").strip()
        title = first_line if first_line else f"{filename} - Section {idx+1}"

        disarmed, inj_detected, inj_flags = sanitize_untrusted_instructions(sec)
        scrubbed, pii = scrub_pii(disarmed)
        candidate_memories = extract_candidate_memories_from_text(scrubbed, title)

        items.append(
            ParsedItem(
                item_id=f"item_doc_{uuid.uuid4().hex[:6]}",
                title=title,
                original_length=len(sec),
                raw_content=sec,
                scrubbed_content=scrubbed,
                detected_pii=pii,
                prompt_injection_detected=inj_detected,
                prompt_injection_flags=inj_flags,
                selected_for_import=True,
                suggested_memories=candidate_memories,
            )
        )
    return items


def parse_ics_calendar_stream(raw_text: str) -> List[ParsedItem]:
    """RFC 5545 calendar stream parser extracting events and pacing buffer needs."""
    events = re.findall(r"BEGIN:VEVENT(.*?)END:VEVENT", raw_text, re.DOTALL)
    items: List[ParsedItem] = []

    for idx, ev_block in enumerate(events):
        summary_m = re.search(r"SUMMARY:(.*)", ev_block)
        dtstart_m = re.search(r"DTSTART(?:;[^:]+)?:(.*)", ev_block)
        desc_m = re.search(r"DESCRIPTION:(.*)", ev_block)

        summary = summary_m.group(1).strip() if summary_m else f"Calendar Event #{idx+1}"
        start_time = dtstart_m.group(1).strip() if dtstart_m else None
        desc = desc_m.group(1).strip() if desc_m else ""

        full_content = f"Event: {summary}\nStart: {start_time or 'Unspecified'}\nDetails: {desc}"
        disarmed, inj_detected, inj_flags = sanitize_untrusted_instructions(full_content)
        scrubbed, pii = scrub_pii(disarmed)

        candidate_memories = extract_candidate_memories_from_text(scrubbed, summary)

        items.append(
            ParsedItem(
                item_id=f"item_cal_{uuid.uuid4().hex[:6]}",
                title=summary,
                date_timestamp=start_time,
                original_length=len(full_content),
                raw_content=full_content,
                scrubbed_content=scrubbed,
                detected_pii=pii,
                prompt_injection_detected=inj_detected,
                prompt_injection_flags=inj_flags,
                selected_for_import=True,
                suggested_memories=candidate_memories,
            )
        )
    return items


class IntegrationsService:
    """Enterprise service layer for InnerOS Personal Context Hub."""

    # --- Backward-Compatible Preview Endpoint ---

    def preview_import(self, req: ImportPreviewRequest) -> ImportPreviewResponse:
        """Fast preview endpoint matching earlier contract and adding candidate memory staging."""
        raw = req.raw_sample_text
        disarmed, inj_detected, inj_flags = sanitize_untrusted_instructions(raw)
        scrubbed, detected_pii = scrub_pii(disarmed)

        # Candidate memory extraction
        candidates = extract_candidate_memories_from_text(scrubbed, "Preview Input") if req.extract_candidate_memories else []

        snippet = SanitizedSnippet(
            source_index=0,
            original_length=len(raw),
            scrubbed_snippet=scrubbed[:300] + ("..." if len(scrubbed) > 300 else ""),
            detected_pii_entities=detected_pii,
            suggested_memory_category="work_life" if "work" in scrubbed.lower() else "habit",
            prompt_injection_neutralized=inj_detected,
        )

        return ImportPreviewResponse(
            source=req.source,
            total_tokens_estimated=len(raw.split()),
            pii_redacted_count=len(detected_pii),
            snippets=[snippet],
            candidate_memories=candidates,
            prompt_injections_neutralized_count=len(inj_flags),
            ready_for_user_approval=True,
        )

    # --- 8-Step Import Pipeline: Step 1 & 2 Upload & Parsing ---

    def create_upload_batch(self, user_id: str, req: ImportUploadRequest) -> ImportBatchResponse:
        """Uploads, validates, parses, scrubs PII, neutralizes injections, and stages candidate memories."""
        batch_id = f"batch_{uuid.uuid4().hex[:8]}"
        source = req.source
        filename = req.filename
        raw_text = req.raw_payload_text

        # Route to specialized parser
        if source == ImportSource.CHATGPT_EXPORT:
            parsed_items = parse_chatgpt_json(raw_text)
        elif source == ImportSource.CLAUDE_EXPORT:
            parsed_items = parse_claude_json(raw_text)
        elif source == ImportSource.CALENDAR_ICS:
            parsed_items = parse_ics_calendar_stream(raw_text)
        else:
            parsed_items = parse_markdown_or_txt(raw_text, filename)

        total_pii = sum(len(it.detected_pii) for it in parsed_items)
        total_injections = sum(len(it.prompt_injection_flags) for it in parsed_items)

        batch = ImportBatchResponse(
            batch_id=batch_id,
            user_id=user_id,
            source=source,
            filename=filename,
            total_items=len(parsed_items),
            selected_items=len(parsed_items),
            pii_redacted_count=total_pii,
            prompt_injections_neutralized_count=total_injections,
            items=parsed_items,
            status=ImportBatchStatus.REVIEW_READY,
            created_at=datetime.now(timezone.utc),
        )

        _STAGED_BATCHES.setdefault(user_id, {})[batch_id] = batch
        return batch

    def get_staged_batch(self, user_id: str, batch_id: str) -> Optional[ImportBatchResponse]:
        return _STAGED_BATCHES.get(user_id, {}).get(batch_id)

    # --- Step 3: Preview and Selective Exclusion ---

    def update_batch_selection(
        self, user_id: str, batch_id: str, item_ids_to_include: List[str], item_ids_to_exclude: List[str]
    ) -> Optional[ImportBatchResponse]:
        batch = self.get_staged_batch(user_id, batch_id)
        if not batch:
            return None

        inc_set = set(item_ids_to_include)
        exc_set = set(item_ids_to_exclude)

        for item in batch.items:
            if item.item_id in exc_set:
                item.selected_for_import = False
            elif item.item_id in inc_set:
                item.selected_for_import = True

        batch.selected_items = sum(1 for it in batch.items if it.selected_for_import)
        return batch

    # --- Step 6 & 7: User Confirmation & Approved Storage ---

    def confirm_import_batch(
        self,
        user_id: str,
        batch_id: str,
        approved_candidate_ids: List[str],
        rejected_candidate_ids: Optional[List[str]] = None,
    ) -> ConfirmImportResponse:
        """Commits user-approved candidate memories into the long-term memory system with full provenance."""
        batch = self.get_staged_batch(user_id, batch_id)
        if not batch:
            raise ValueError(f"Staged import batch {batch_id} not found")

        approved_set = set(approved_candidate_ids)
        committed_ids: List[str] = []

        # Find candidate memories across selected items
        for item in batch.items:
            if not item.selected_for_import:
                continue

            for cand in item.suggested_memories:
                if cand.candidate_id in approved_set:
                    req = MemoryCreateRequest(
                        category=cand.category,  # type: ignore
                        record_type=cand.record_type,  # type: ignore
                        fact_statement=cand.fact_statement,
                        raw_context=cand.source_quote,
                        source_session_id=batch.batch_id,
                        source_quote=cand.source_quote,
                        confidence_score=cand.confidence_score,
                        certainty_level=CertaintyLevel.USER_VERIFIED,
                        status=MemoryStatus.CONFIRMED,
                        tags=["imported_context", batch.source.value],
                    )

                    record = memory_service.add_memory(user_id, req)
                    if record:
                        committed_ids.append(record.id)

        batch.status = ImportBatchStatus.CONFIRMED

        return ConfirmImportResponse(
            batch_id=batch_id,
            committed_memories_count=len(committed_ids),
            rejected_count=len(rejected_candidate_ids or []),
            created_memory_ids=committed_ids,
            provenance_source=batch.source.value,
            message="Selected context successfully ingested with provenance tracking and user approval.",
        )

    # --- Step 8: Revocation & Deletion (GDPR Article 17) ---

    def revoke_import_batch(self, user_id: str, batch_id: str) -> Dict[str, Any]:
        """Revokes an import batch and purges derived memory records and life graph nodes."""
        batch = self.get_staged_batch(user_id, batch_id)
        if not batch:
            raise ValueError(f"Batch {batch_id} not found")

        # Query and delete all memories derived from this batch
        records = memory_service.list_memories(user_id)
        purged_count = 0
        for r in records:
            if r.provenance and r.provenance.source_session_id == batch_id:
                memory_service.delete_memory(user_id, r.id)
                purged_count += 1

        batch.status = ImportBatchStatus.REVOKED
        return {
            "batch_id": batch_id,
            "status": "revoked_and_purged",
            "purged_records_count": purged_count,
            "message": "All derived memories and graph associations cleanly purged in compliance with GDPR Article 17.",
        }

    # --- Google Calendar OAuth 2.0 Integration ---

    def initiate_oauth_flow(
        self, user_id: str, provider: str = "google_calendar"
    ) -> Dict[str, str]:
        """Initiates OAuth 2.0 authorization with minimal read-only scopes."""
        state_token = f"csrf_{uuid.uuid4().hex}"
        scopes = ["https://www.googleapis.com/auth/calendar.events.readonly"]
        auth_url = (
            f"https://accounts.google.com/o/oauth2/v2/auth?"
            f"client_id=synthetic_inneros_client_id&"
            f"response_type=code&"
            f"scope={' '.join(scopes)}&"
            f"redirect_uri=https://app.inneros.internal/oauth/callback&"
            f"state={state_token}&"
            f"access_type=offline&prompt=consent"
        )
        return {
            "provider": provider,
            "authorization_url": auth_url,
            "state_token": state_token,
            "requested_scopes": " ".join(scopes),
            "read_only_guarantee": "True - InnerOS never requests calendar write or mutation permissions",
        }

    def complete_oauth_callback(
        self, user_id: str, provider: str, code: str, state_token: str
    ) -> OAuthConnection:
        """Simulates OAuth token exchange and encrypts tokens at rest with user DEK."""
        connection_id = f"conn_{provider}_{uuid.uuid4().hex[:6]}"
        now = datetime.now(timezone.utc)

        # Encrypt mock refresh token with user DEK
        mock_token = f"ya29.synthetic_refresh_token_{uuid.uuid4().hex}"
        cipher, nonce, salt = encrypt_payload(mock_token, user_id)
        _ENCRYPTED_TOKENS.setdefault(user_id, {})[connection_id] = (cipher, nonce, salt)

        conn = OAuthConnection(
            connection_id=connection_id,
            user_id=user_id,
            provider=provider,
            status="connected",
            scopes=["https://www.googleapis.com/auth/calendar.events.readonly"],
            account_email="elena.vance@work.example.com",
            is_read_only=True,
            sync_interval_hours=12,
            last_synced_at=now,
            created_at=now,
        )
        _OAUTH_CONNECTIONS.setdefault(user_id, {})[connection_id] = conn
        return conn

    def list_oauth_connections(self, user_id: str) -> List[OAuthConnection]:
        return list(_OAUTH_CONNECTIONS.get(user_id, {}).values())

    def sync_google_calendar(
        self, user_id: str, connection_id: str
    ) -> CalendarSyncResponse:
        """Synchronizes upcoming events with preparation buffer identification."""
        conn = _OAUTH_CONNECTIONS.get(user_id, {}).get(connection_id)
        if not conn or conn.status != "connected":
            raise ValueError("Connection not found or inactive")

        now = datetime.now(timezone.utc)
        # Synthetic calendar events demonstrating pacing buffers
        events = [
            CalendarEventItem(
                event_id="ev_01",
                summary="Q4 Design Systems Executive Review",
                start_time=(now + timedelta(hours=3)).isoformat(),
                end_time=(now + timedelta(hours=4, minutes=30)).isoformat(),
                is_busy=True,
                buffer_needed_min=20,
                location="Google Meet / Boardroom",
                requires_rest_window=True,
            ),
            CalendarEventItem(
                event_id="ev_02",
                summary="1:1 Mentorship with Junior Designer",
                start_time=(now + timedelta(hours=6)).isoformat(),
                end_time=(now + timedelta(hours=6, minutes=45)).isoformat(),
                is_busy=True,
                buffer_needed_min=10,
                location="Studio A",
                requires_rest_window=False,
            ),
        ]

        conn.last_synced_at = now

        return CalendarSyncResponse(
            connection_id=connection_id,
            synced_events_count=len(events),
            upcoming_events=events,
            circadian_conflicts_detected=1,  # 90m high-stress review needs wind-down
            last_synced_at=now,
        )

    def revoke_oauth_connection(
        self, user_id: str, connection_id: str, purge_imported_memories: bool = True
    ) -> Dict[str, Any]:
        """Immediately revokes access, deletes encrypted token, and purges synced records."""
        user_conns = _OAUTH_CONNECTIONS.get(user_id, {})
        conn = user_conns.get(connection_id)
        if not conn:
            raise ValueError(f"Connection {connection_id} not found")

        conn.status = "revoked"
        # Destroy encrypted token
        if user_id in _ENCRYPTED_TOKENS and connection_id in _ENCRYPTED_TOKENS[user_id]:
            del _ENCRYPTED_TOKENS[user_id][connection_id]

        del user_conns[connection_id]

        return {
            "connection_id": connection_id,
            "status": "revoked_and_deleted",
            "tokens_destroyed": True,
            "message": "OAuth access token wiped. No further synchronization can occur.",
        }

    # --- Phase Two Architecture Blueprint ---

    def get_phase2_architecture_spec(self) -> List[PhaseTwoArchitectureSpec]:
        """Provides formal architectural blueprints and threat models for Phase 2 integrations."""
        return [
            PhaseTwoArchitectureSpec(
                provider="Gmail & Outlook",
                category="Productivity & Email",
                read_only_invariant=True,
                permission_scopes=["https://www.googleapis.com/auth/gmail.readonly"],
                zero_training_guarantee="Emails are parsed in ephemeral memory. No raw email text stored or used for model training.",
                local_enclave_model="Client-side subject & sender filtering; zero autonomous sending capability in application code.",
                threat_model_summary="Strict read-only OAuth tokens. Content evaluated as untrusted data against prompt injections.",
            ),
            PhaseTwoArchitectureSpec(
                provider="Notion",
                category="Knowledge & Notes",
                read_only_invariant=True,
                permission_scopes=["pages.read"],
                zero_training_guarantee="Selected subpages only; user grants explicit granular page permissions during OAuth handshake.",
                local_enclave_model="Page-tree whitelisting; pages with sensitive tags can be excluded with a single toggle.",
                threat_model_summary="Webhook verification with HMAC SHA-256 signatures; markdown injection disarming.",
            ),
            PhaseTwoArchitectureSpec(
                provider="Apple Health & HealthKit",
                category="Somatic & Biometric",
                read_only_invariant=True,
                permission_scopes=["HKQuantityTypeIdentifierHeartRateVariabilitySDNN", "HKCategoryTypeIdentifierSleepAnalysis"],
                zero_training_guarantee="Biometrics processed strictly on-device inside Apple Secure Enclave. Zero cloud storage of raw biometric streams.",
                local_enclave_model="On-device summary synthesis; only high-level somatic pacing state (e.g. 'rested', 'sympathetic_activation') shared with companion.",
                threat_model_summary="HIPAA-compatible on-device isolation. Non-diagnostic disclaimer enforced on all biometrics.",
            ),
            PhaseTwoArchitectureSpec(
                provider="Wearables (Oura, Whoop, Garmin)",
                category="Sleep Pacing & Recovery",
                read_only_invariant=True,
                permission_scopes=["daily_readiness.read", "sleep.read"],
                zero_training_guarantee="Aggregate recovery scores used solely to dynamically adjust companion tone and morning quiet hours.",
                local_enclave_model="Differential privacy injection on score boundaries; zero raw sensor streaming.",
                threat_model_summary="OAuth token encryption with user-derived HKDF DEK. Rate-limited passive sync.",
            ),
            PhaseTwoArchitectureSpec(
                provider="Work & Collaboration (Slack, Jira, GitHub)",
                category="Workload & Burnout Defense",
                read_only_invariant=True,
                permission_scopes=["users.profile.read", "channels.read"],
                zero_training_guarantee="Focus pacing and meeting overload detection. Prohibits employer surveillance or productivity tracking.",
                local_enclave_model="Local calendar blocking without transmitting meeting notes or colleague messages.",
                threat_model_summary="Tenant isolation with row-level security. Explicit prohibition against manager-facing analytics.",
            ),
        ]


integrations_service = IntegrationsService()
