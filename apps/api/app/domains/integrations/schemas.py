"""Integrations Domain Schemas.
Data contracts for user-controlled third-party archive import, OAuth 2.0 connectors,
client-side and server-side PII scrubbing, prompt-injection defense, and candidate memory staging.
"""

from enum import Enum
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class ImportSource(str, Enum):
    CHATGPT_EXPORT = "chatgpt_export"
    CLAUDE_EXPORT = "claude_export"
    CALENDAR_ICS = "calendar_ics"
    CALENDAR_GOOGLE_OAUTH = "calendar_google_oauth"
    DOCUMENT_MARKDOWN = "document_markdown"
    DOCUMENT_TXT = "document_txt"
    DOCUMENT_PDF = "document_pdf"
    JOURNAL_NOTES = "journal_notes"
    HEALTH_NOTES = "health_notes"  # Backward compatibility


class ImportBatchStatus(str, Enum):
    UPLOADED = "uploaded"
    PARSED = "parsed"
    REVIEW_READY = "review_ready"
    CONFIRMED = "confirmed"
    REVOKED = "revoked"


class CandidateMemoryItem(BaseModel):
    """Candidate memory extracted from imported context requiring explicit user confirmation."""
    candidate_id: str
    category: str  # Maps to official InnerOS MemoryCategory
    record_type: str = "stored_fact"  # "stored_fact" or "tentative_ai_interpretation"
    fact_statement: str
    confidence_score: float = 0.9
    source_quote: str
    is_sensitive: bool = False
    approved_by_user: bool = False


class ParsedItem(BaseModel):
    """A single conversation, document section, or calendar event within an import batch."""
    item_id: str
    title: str
    date_timestamp: Optional[str] = None
    original_length: int
    raw_content: str
    scrubbed_content: str
    detected_pii: List[str] = Field(default_factory=list)
    prompt_injection_detected: bool = False
    prompt_injection_flags: List[str] = Field(default_factory=list)
    selected_for_import: bool = True
    suggested_memories: List[CandidateMemoryItem] = Field(default_factory=list)


# --- Backward Compatible Snippet & Preview Models ---

class SanitizedSnippet(BaseModel):
    source_index: int
    original_length: int
    scrubbed_snippet: str
    detected_pii_entities: List[str] = Field(default_factory=list)
    suggested_memory_category: str = "work_life"
    prompt_injection_neutralized: bool = False


class ImportPreviewRequest(BaseModel):
    source: ImportSource
    raw_sample_text: str
    filename: Optional[str] = None
    extract_candidate_memories: Optional[bool] = True


class ImportPreviewResponse(BaseModel):
    source: ImportSource
    total_tokens_estimated: int
    pii_redacted_count: int
    snippets: List[SanitizedSnippet]
    candidate_memories: List[CandidateMemoryItem] = Field(default_factory=list)
    prompt_injections_neutralized_count: int = 0
    ready_for_user_approval: bool = True


# --- Full 8-Step Pipeline Batch Models ---

class ImportUploadRequest(BaseModel):
    source: ImportSource
    filename: str
    raw_payload_text: str  # Base64 or utf-8 encoded string content
    custom_redaction_terms: Optional[List[str]] = Field(default_factory=list)


class ImportBatchResponse(BaseModel):
    batch_id: str
    user_id: str
    source: ImportSource
    filename: str
    total_items: int
    selected_items: int
    pii_redacted_count: int
    prompt_injections_neutralized_count: int
    items: List[ParsedItem]
    status: ImportBatchStatus
    created_at: datetime


class BatchSelectionUpdateRequest(BaseModel):
    """Updates which items are selected or excluded by user."""
    item_ids_to_include: List[str]
    item_ids_to_exclude: List[str]


class ConfirmImportRequest(BaseModel):
    """Explicit user confirmation committing approved candidate memories to long-term memory."""
    approved_candidate_ids: List[str]
    rejected_candidate_ids: Optional[List[str]] = Field(default_factory=list)


class ConfirmImportResponse(BaseModel):
    batch_id: str
    committed_memories_count: int
    rejected_count: int
    created_memory_ids: List[str]
    provenance_source: str
    message: str


# --- OAuth 2.0 & Cloud Connector Models ---

class OAuthConnection(BaseModel):
    connection_id: str
    user_id: str
    provider: str  # "google_calendar", "notion_phase2", etc.
    status: str    # "connected", "expired", "revoked", "paused"
    scopes: List[str]
    account_email: Optional[str] = None
    is_read_only: bool = True
    sync_interval_hours: int = 12
    last_synced_at: Optional[datetime] = None
    created_at: datetime


class CalendarEventItem(BaseModel):
    event_id: str
    summary: str
    start_time: str
    end_time: str
    is_busy: bool = True
    buffer_needed_min: Optional[int] = 15
    location: Optional[str] = None
    requires_rest_window: bool = False


class CalendarSyncResponse(BaseModel):
    connection_id: str
    synced_events_count: int
    upcoming_events: List[CalendarEventItem]
    circadian_conflicts_detected: int
    last_synced_at: datetime


class PhaseTwoArchitectureSpec(BaseModel):
    provider: str
    category: str
    read_only_invariant: bool
    permission_scopes: List[str]
    zero_training_guarantee: str
    local_enclave_model: str
    threat_model_summary: str
