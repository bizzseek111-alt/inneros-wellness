/**
 * InnerOS Client API Library.
 * Communicates with FastAPI backend with streaming dialogue support,
 * conversation modes, session persistence, and automatic offline fallbacks.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export type ConversationMode =
  | "just_listen"
  | "help_me_understand"
  | "help_me_solve"
  | "teach_me"
  | "help_me_settle";

export interface HealthResponse {
  status: string;
  version: string;
  environment: string;
  subsystems: Record<string, string>;
}

export interface CrisisResource {
  country_code: string;
  country_name: string;
  phone: string;
  text_channel?: string;
  website: string;
  description: string;
  languages?: string[];
  is_24_7?: boolean;
}

export interface SafetyEvaluation {
  is_safe_to_proceed: boolean;
  risk_level: string;
  primary_category: string;
  matched_heuristics: string[];
  de_escalation_message?: string;
  crisis_resources: CrisisResource[];
  requires_human_escalation: boolean;
  refuse_advice?: boolean;
}

export interface ChatResponse {
  session_id: string;
  reply: string;
  mode_used: ConversationMode;
  safety_evaluation: SafetyEvaluation;
  recalled_memory_count: number;
  provider_used: string;
  model_used: string;
  timestamp: string;
  advice_omitted?: boolean;
}

export interface ModeMetadata {
  id: ConversationMode;
  name: string;
  intent: string;
  allows_advice: boolean;
  best_for: string;
}

export interface SessionHistoryItem {
  role: string;
  content: string;
  timestamp?: string;
  is_crisis?: boolean;
  recalled_memory_count?: number;
}

export interface SessionHistoryResponse {
  session_id: string;
  mode: ConversationMode;
  messages: SessionHistoryItem[];
  created_at: string;
  updated_at: string;
}

export interface BenchmarkResult {
  provider_name: string;
  model_name: string;
  prompt: string;
  response_preview: string;
  tokens_used: number;
  latency_ms: number;
  is_safe: boolean;
  mode_adherent: boolean;
}

export interface MemoryProvenance {
  source_session_id?: string;
  source_type: string;
  source_quote?: string;
  extracted_by: string;
  extracted_at: string;
}

export interface MemoryRecord {
  id: string;
  user_id: string;
  category: string;
  record_type: "stored_fact" | "tentative_ai_interpretation";
  status: "suggested" | "confirmed" | "rejected" | "archived";
  fact_statement: string;
  fact_text?: string;
  consent_level?: string;
  raw_context?: string;
  confidence_score: number;
  certainty_level: "tentative" | "moderate" | "high" | "user_verified";
  provenance: MemoryProvenance;
  emotional_valence?: string;
  is_sensitive: boolean;
  user_consent_verified: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  expires_at?: string;
  next_review_due_at?: string;
}

export interface MemoryItem {
  id: string;
  user_id: string;
  category: string;
  fact_text: string;
  fact_statement?: string;
  emotional_valence?: string;
  consent_level?: string;
  created_at: string;
  tags: string[];
}

export interface LifeGraphNode {
  id: string;
  user_id: string;
  label: string;
  node_type: "role" | "habit" | "goal" | "relationship" | "stress_trigger" | "coping_strategy" | "life_event" | "value" | "health_context";
  description: string;
  linked_memory_id?: string;
  record_type: "stored_fact" | "tentative_ai_interpretation";
  emotional_charge: "positive" | "neutral" | "challenging";
  is_tentative: boolean;
  created_at: string;
}

export interface LifeGraphEdge {
  id: string;
  user_id: string;
  source_node_id: string;
  target_node_id: string;
  relation: string;
  confidence: number;
  is_tentative: boolean;
  created_at: string;
}

export interface LifeGraphResponse {
  nodes: LifeGraphNode[];
  edges: LifeGraphEdge[];
  total_nodes: number;
  total_edges: number;
  facts_count: number;
  tentative_count: number;
}

export interface UserMemoryConsent {
  user_id: string;
  allow_memory_system: boolean;
  is_memory_recording_paused: boolean;
  sensitive_health_consent_granted: boolean;
  allowed_categories: string[];
  auto_expire_tentative_days: number;
  require_confirmation_for_all_suggestions: boolean;
  updated_at: string;
}

export interface MemoryAuditLogEntry {
  id: string;
  user_id: string;
  action: string;
  target_id?: string;
  target_type: string;
  actor: string;
  details: Record<string, any>;
  timestamp: string;
}

export interface DataExportBundle {
  user_id: string;
  export_timestamp: string;
  format_version: string;
  encryption_status: string;
  memory_records: MemoryRecord[];
  life_graph_nodes: LifeGraphNode[];
  life_graph_edges: LifeGraphEdge[];
  consent_settings: UserMemoryConsent;
  audit_trail: MemoryAuditLogEntry[];
  summary_stats: Record<string, any>;
}

export interface VoiceProfile {
  id: string;
  name: string;
  language: string;
  gender: string;
  sample_rate_hz: number;
  tone_characteristics: string[];
  pitch_semitones: number;
  speed_multiplier: number;
  regional_accent?: string;
  description: string;
}

export interface LanguageInfo {
  code: string;
  name: string;
  native_name: string;
  tier: "tier_1_clinically_reviewed" | "tier_2_qualified_regional" | "tier_3_experimental";
  direction: "ltr" | "rtl";
  dialects: string[];
  clinical_safety_reviewed: boolean;
  caveats?: string;
}

export interface VoiceTurnResponse {
  turn_id: string;
  transcript_user: string;
  transcript_companion: string;
  audio_base64?: string;
  audio_format: string;
  duration_estimate_sec: number;
  is_safety_escalation: boolean;
  safety_resources: Array<{ name: string; contact: string }>;
  clarification_requested: boolean;
  confidence_score: number;
  non_diagnostic_notice: string;
  interruption_acknowledged: boolean;
}

export interface VoiceEvaluationResponse {
  total_cases: number;
  passed_cases: number;
  pass_rate_pct: number;
  priority_languages_tested: string[];
  results: any[];
}

export interface KnowledgeTopic {
  id: string;
  category: string;
  title: string;
  short_summary: string;
  full_explanation: string;
  key_takeaways: string[];
  citations: Array<{
    title: string;
    authors: string;
    year: number;
    journal_or_publisher: string;
    doi_or_url?: string;
  }>;
  tags: string[];
}

export type ReminderType =
  | "mindful_checkin"
  | "breathwork_pause"
  | "evening_reflection"
  | "hydration_stretch"
  | "mood_journaling"
  | "reading_learning"
  | "habit_routine"
  | "appointment_prep"
  | "goal_followup";

export type NotificationChannel = "in_app" | "web_push" | "email";
export type NotificationPriority = "wellbeing_prompt" | "operational_account" | "emergency_safety";
export type DeliveryStatus =
  | "scheduled"
  | "delivered"
  | "snoozed"
  | "dismissed"
  | "suppressed_quiet_hours"
  | "skipped_throttled"
  | "failed"
  | "missed_no_danger";

export type RecurrenceRule = "once" | "daily" | "weekdays" | "weekends" | "weekly" | "custom";

export interface ReminderItem {
  id: string;
  user_id: string;
  title: string;
  reminder_type: ReminderType;
  prompt_text: string;
  sanitized_lockscreen_text: string;
  cron_or_time: string;
  recurrence: RecurrenceRule;
  target_date?: string;
  timezone: string;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  is_active: boolean;
  is_paused: boolean;
  snoozed_until?: string | null;
  last_delivered_at?: string | null;
  target_goal_or_event?: string | null;
  buffer_minutes?: number | null;
  created_at: string;
  updated_at?: string;
}

export interface QuietHoursSettings {
  enabled: boolean;
  start_time: string;
  end_time: string;
  timezone: string;
  suppress_audio: boolean;
  allow_emergency_safety: boolean;
  max_prompts_per_day: number;
}

export interface InAppNotification {
  id: string;
  user_id: string;
  reminder_id?: string;
  title: string;
  sanitized_lockscreen_preview: string;
  full_body_content: string;
  channel: NotificationChannel;
  priority: NotificationPriority;
  status: DeliveryStatus;
  read: boolean;
  is_dismissed: boolean;
  created_at: string;
  delivered_at?: string;
  retry_count: number;
  idempotency_key?: string;
  behavioral_safety_tag: string;
}

export interface DispatchResult {
  job_id: string;
  reminder_id: string;
  status: DeliveryStatus;
  channel: NotificationChannel;
  sanitized_text_sent: string;
  private_details_held_in_app: boolean;
  is_quiet_hours_suppressed: boolean;
  retry_count: number;
  dispatched_at: string;
  audit_log_id: string;
  message: string;
}

export interface NotificationAuditLogItem {
  id: string;
  user_id: string;
  reminder_id?: string;
  event_type: string;
  channel?: string;
  status: string;
  details: Record<string, any>;
  timestamp: string;
}

export type ImportSourceType =
  | "chatgpt_export"
  | "claude_export"
  | "calendar_ics"
  | "calendar_google_oauth"
  | "document_markdown"
  | "document_txt"
  | "document_pdf"
  | "journal_notes";

export interface CandidateMemoryItem {
  candidate_id: string;
  category: string;
  record_type: string;
  fact_statement: string;
  confidence_score: number;
  source_quote: string;
  is_sensitive: boolean;
  approved_by_user: boolean;
}

export interface ParsedItem {
  item_id: string;
  title: string;
  date_timestamp?: string;
  original_length: number;
  raw_content: string;
  scrubbed_content: string;
  detected_pii: string[];
  prompt_injection_detected: boolean;
  prompt_injection_flags: string[];
  selected_for_import: boolean;
  suggested_memories: CandidateMemoryItem[];
}

export interface ImportBatchResponse {
  batch_id: string;
  user_id: string;
  source: ImportSourceType;
  filename: string;
  total_items: number;
  selected_items: number;
  pii_redacted_count: number;
  prompt_injections_neutralized_count: number;
  items: ParsedItem[];
  status: "uploaded" | "parsed" | "review_ready" | "confirmed" | "revoked";
  created_at: string;
}

export interface ConfirmImportResponse {
  batch_id: string;
  committed_memories_count: number;
  rejected_count: number;
  created_memory_ids: string[];
  provenance_source: string;
  message: string;
}

export interface OAuthConnection {
  connection_id: string;
  user_id: string;
  provider: string;
  status: "connected" | "expired" | "revoked" | "paused";
  scopes: string[];
  account_email?: string;
  is_read_only: boolean;
  sync_interval_hours: number;
  last_synced_at?: string;
  created_at: string;
}

export interface CalendarEventItem {
  event_id: string;
  summary: string;
  start_time: string;
  end_time: string;
  is_busy: boolean;
  buffer_needed_min?: number;
  location?: string;
  requires_rest_window: boolean;
}

export interface CalendarSyncResponse {
  connection_id: string;
  synced_events_count: number;
  upcoming_events: CalendarEventItem[];
  circadian_conflicts_detected: number;
  last_synced_at: string;
}

export interface PhaseTwoArchitectureSpec {
  provider: string;
  category: string;
  read_only_invariant: boolean;
  permission_scopes: string[];
  zero_training_guarantee: string;
  local_enclave_model: string;
  threat_model_summary: string;
}

export const api = {
  async getHealth(): Promise<HealthResponse> {
    const res = await fetch(`${API_BASE}/api/v1/health`, { cache: "no-store" });
    if (!res.ok) throw new Error("API unhealthy");
    return res.json();
  },

  async sendChatMessage(params: {
    sessionId?: string;
    utterance: string;
    mode?: ConversationMode;
    warmthLevel?: number;
    directnessLevel?: number;
    allowAdvice?: boolean;
    language?: string;
    countryCode?: string;
  }): Promise<ChatResponse> {
    const res = await fetch(`${API_BASE}/api/v1/companion/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: params.sessionId || "session_default",
        utterance: params.utterance,
        mode: params.mode || "just_listen",
        tone: {
          warmth_level: params.warmthLevel ?? 0.8,
          directness_level: params.directnessLevel ?? 0.5,
          allow_advice: params.allowAdvice ?? (params.mode !== "just_listen"),
        },
        language: params.language || "en",
        country_code: params.countryCode || "US",
      }),
    });
    if (!res.ok) throw new Error(`Chat request failed with status ${res.status}`);
    return res.json();
  },

  async streamChatMessage(
    params: {
      sessionId?: string;
      utterance: string;
      mode?: ConversationMode;
      warmthLevel?: number;
      directnessLevel?: number;
      allowAdvice?: boolean;
      language?: string;
      countryCode?: string;
    },
    onChunk: (chunk: string) => void,
    onDone: () => void,
    onError: (err: Error) => void
  ): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/companion/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: params.sessionId || "session_default",
          utterance: params.utterance,
          mode: params.mode || "just_listen",
          tone: {
            warmth_level: params.warmthLevel ?? 0.8,
            directness_level: params.directnessLevel ?? 0.5,
            allow_advice: params.allowAdvice ?? (params.mode !== "just_listen"),
          },
          language: params.language || "en",
          country_code: params.countryCode || "US",
          stream: true,
        }),
      });

      if (!res.ok) throw new Error(`Stream failed with status ${res.status}`);
      if (!res.body) throw new Error("No response body for streaming");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            if (dataStr === "[DONE]") {
              onDone();
              return;
            }
            onChunk(dataStr.replace(/\\n/g, "\n"));
          }
        }
      }
      onDone();
    } catch (err: any) {
      onError(err);
    }
  },

  async getConversationModes(): Promise<ModeMetadata[]> {
    const res = await fetch(`${API_BASE}/api/v1/companion/modes`);
    if (!res.ok) throw new Error("Failed to fetch modes");
    return res.json();
  },

  async getSessionHistory(sessionId: string): Promise<SessionHistoryResponse> {
    const res = await fetch(`${API_BASE}/api/v1/companion/sessions/${sessionId}`);
    if (!res.ok) throw new Error("Failed to fetch session");
    return res.json();
  },

  async clearSessionHistory(sessionId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/api/v1/companion/sessions/${sessionId}`, {
      method: "DELETE",
    });
    return res.ok;
  },

  async benchmarkModels(params: {
    prompt: string;
    mode?: ConversationMode;
    language?: string;
  }): Promise<{ benchmark_prompt: string; results: BenchmarkResult[] }> {
    const res = await fetch(`${API_BASE}/api/v1/companion/benchmark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: params.prompt,
        mode: params.mode || "just_listen",
        language: params.language || "en",
      }),
    });
    if (!res.ok) throw new Error("Benchmark request failed");
    return res.json();
  },

  async getMemories(): Promise<MemoryItem[]> {
    const res = await fetch(`${API_BASE}/api/v1/memory/records`);
    if (!res.ok) throw new Error("Failed to fetch memories");
    return res.json();
  },

  async getMemoryRecords(params?: {
    category?: string;
    status?: string;
    recordType?: string;
    query?: string;
  }): Promise<MemoryRecord[]> {
    const url = new URL(`${API_BASE}/api/v1/memory/records`);
    if (params?.category && params.category !== "all") url.searchParams.set("category", params.category);
    if (params?.status && params.status !== "all") url.searchParams.set("status", params.status);
    if (params?.recordType && params.recordType !== "all") url.searchParams.set("record_type", params.recordType);
    if (params?.query) url.searchParams.set("query", params.query);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch memory records");
    return res.json();
  },

  async createMemoryRecord(data: {
    category: string;
    fact_statement: string;
    record_type?: string;
    status?: string;
    emotional_valence?: string;
    tags?: string[];
  }): Promise<MemoryRecord> {
    const res = await fetch(`${API_BASE}/api/v1/memory/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to create memory record");
    }
    return res.json();
  },

  async updateMemoryRecord(id: string, data: Partial<MemoryRecord>): Promise<MemoryRecord> {
    const res = await fetch(`${API_BASE}/api/v1/memory/records/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update memory record");
    return res.json();
  },

  async forgetMemory(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/api/v1/memory/records/${id}`, {
      method: "DELETE",
    });
    return res.status === 204;
  },

  async handleSuggestionAction(
    id: string,
    action: "confirm" | "reject",
    adjustedStatement?: string,
  ): Promise<MemoryRecord> {
    const res = await fetch(`${API_BASE}/api/v1/memory/records/${id}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        adjusted_statement: adjustedStatement,
      }),
    });
    if (!res.ok) throw new Error(`Failed to ${action} suggestion`);
    return res.json();
  },

  async getLifeGraph(): Promise<LifeGraphResponse> {
    const res = await fetch(`${API_BASE}/api/v1/memory/life-graph`);
    if (!res.ok) throw new Error("Failed to fetch Life Graph");
    return res.json();
  },

  async createLifeGraphNode(data: {
    label: string;
    node_type: string;
    description: string;
    record_type?: string;
    emotional_charge?: string;
  }): Promise<LifeGraphNode> {
    const res = await fetch(`${API_BASE}/api/v1/memory/life-graph/nodes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create Life Graph node");
    return res.json();
  },

  async deleteLifeGraphNode(nodeId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/api/v1/memory/life-graph/nodes/${nodeId}`, {
      method: "DELETE",
    });
    return res.status === 204;
  },

  async createLifeGraphEdge(data: {
    source_node_id: string;
    target_node_id: string;
    relation: string;
  }): Promise<LifeGraphEdge> {
    const res = await fetch(`${API_BASE}/api/v1/memory/life-graph/edges`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create Life Graph edge");
    return res.json();
  },

  async deleteLifeGraphEdge(edgeId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/api/v1/memory/life-graph/edges/${edgeId}`, {
      method: "DELETE",
    });
    return res.status === 204;
  },

  async getMemoryConsent(): Promise<UserMemoryConsent> {
    const res = await fetch(`${API_BASE}/api/v1/memory/consent`);
    if (!res.ok) throw new Error("Failed to fetch consent settings");
    return res.json();
  },

  async updateMemoryConsent(data: Partial<UserMemoryConsent>): Promise<UserMemoryConsent> {
    const res = await fetch(`${API_BASE}/api/v1/memory/consent`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update consent settings");
    return res.json();
  },

  async pauseMemory(): Promise<UserMemoryConsent> {
    const res = await fetch(`${API_BASE}/api/v1/memory/pause`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to pause memory");
    return res.json();
  },

  async resumeMemory(): Promise<UserMemoryConsent> {
    const res = await fetch(`${API_BASE}/api/v1/memory/resume`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to resume memory");
    return res.json();
  },

  async purgeAllMemory(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/memory/purge-all`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to purge all memory");
    return res.json();
  },

  async exportPersonalData(): Promise<DataExportBundle> {
    const res = await fetch(`${API_BASE}/api/v1/memory/export`);
    if (!res.ok) throw new Error("Failed to export personal data");
    return res.json();
  },

  async getMemoryAuditLogs(): Promise<MemoryAuditLogEntry[]> {
    const res = await fetch(`${API_BASE}/api/v1/memory/audit-logs`);
    if (!res.ok) throw new Error("Failed to fetch memory audit logs");
    return res.json();
  },

  async getKnowledgeTopics(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/knowledge/records`);
    if (!res.ok) throw new Error("Failed to fetch topics");
    return res.json();
  },

  async getKnowledgeRecords(params?: {
    department?: string;
    reviewStatus?: string;
    peerReviewedOnly?: boolean;
  }): Promise<any[]> {
    const url = new URL(`${API_BASE}/api/v1/knowledge/records`);
    if (params?.department) url.searchParams.set("department", params.department);
    if (params?.reviewStatus) url.searchParams.set("review_status", params.reviewStatus);
    if (params?.peerReviewedOnly) url.searchParams.set("peer_reviewed_only", "true");
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch knowledge records");
    return res.json();
  },

  async getPsychologyDepartments(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/knowledge/departments`);
    if (!res.ok) throw new Error("Failed to fetch psychology departments");
    return res.json();
  },

  async getKnowledgeAuditSummary(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/knowledge/audit-summary`);
    if (!res.ok) throw new Error("Failed to fetch knowledge audit summary");
    return res.json();
  },

  async submitKnowledgeReview(recordId: string, reviewData: {
    reviewer_id: string;
    reviewer_name: string;
    reviewer_credentials: string;
    decision: string;
    notes: string;
    next_review_months?: number;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/knowledge/records/${recordId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });
    if (!res.ok) throw new Error("Failed to submit review decision");
    return res.json();
  },

  async retrieveKnowledgeContext(params: {
    utterance: string;
    emotionalState?: string;
    conversationMode?: string;
    department?: string;
    peerReviewedOnly?: boolean;
    maxRecords?: number;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/knowledge/retrieve-context`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error("Failed to retrieve knowledge context");
    return res.json();
  },

  async getVoiceProfiles(): Promise<VoiceProfile[]> {
    const res = await fetch(`${API_BASE}/api/v1/voice/profiles`);
    if (!res.ok) throw new Error("Failed to fetch voice profiles");
    return res.json();
  },

  async getVoiceLanguages(): Promise<LanguageInfo[]> {
    const res = await fetch(`${API_BASE}/api/v1/voice/languages`);
    if (!res.ok) throw new Error("Failed to fetch languages");
    return res.json();
  },

  async executeVoiceTurn(params: {
    userUtterance?: string;
    audioBase64?: string;
    voiceId?: string;
    language?: string;
    isInterruption?: boolean;
    sessionId?: string;
  }): Promise<VoiceTurnResponse> {
    const res = await fetch(`${API_BASE}/api/v1/voice/turn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_utterance: params.userUtterance,
        audio_base64: params.audioBase64,
        voice_id: params.voiceId,
        language: params.language,
        is_interruption: params.isInterruption,
        session_id: params.sessionId,
      }),
    });
    if (!res.ok) throw new Error("Voice turn failed");
    return res.json();
  },

  async interruptVoiceSession(sessionId: string, playbackPositionMs: number = 0): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/voice/session/interruption`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        playback_position_ms: playbackPositionMs,
      }),
    });
    if (!res.ok) throw new Error("Interruption request failed");
    return res.json();
  },

  async getVoiceEvaluationBenchmarks(): Promise<VoiceEvaluationResponse> {
    const res = await fetch(`${API_BASE}/api/v1/voice/evaluation/benchmarks`);
    if (!res.ok) throw new Error("Failed to fetch voice benchmarks");
    return res.json();
  },

  async getReminders(): Promise<ReminderItem[]> {
    const res = await fetch(`${API_BASE}/api/v1/reminders`);
    if (!res.ok) throw new Error("Failed to fetch reminders");
    return res.json();
  },

  async createReminder(data: {
    title: string;
    reminder_type: string;
    prompt_text: string;
    sanitized_lockscreen_text?: string;
    cron_or_time: string;
    recurrence?: string;
    target_date?: string;
    timezone?: string;
    channels?: string[];
    priority?: string;
    target_goal_or_event?: string;
    buffer_minutes?: number;
  }): Promise<ReminderItem> {
    const res = await fetch(`${API_BASE}/api/v1/reminders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to create reminder");
    }
    return res.json();
  },

  async updateReminder(id: string, data: Partial<ReminderItem>): Promise<ReminderItem> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update reminder");
    return res.json();
  },

  async deleteReminder(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/${id}`, {
      method: "DELETE",
    });
    return res.status === 204;
  },

  async snoozeReminder(id: string, minutes: number = 15): Promise<ReminderItem> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/${id}/snooze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ minutes }),
    });
    if (!res.ok) throw new Error("Failed to snooze reminder");
    return res.json();
  },

  async dismissReminder(id: string): Promise<ReminderItem> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/${id}/dismiss`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to dismiss reminder");
    return res.json();
  },

  async dispatchReminder(
    id: string,
    idempotencyKey: string,
    channelOverride?: string,
    simulateFailure?: boolean,
  ): Promise<DispatchResult> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/${id}/dispatch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idempotency_key: idempotencyKey,
        channel_override: channelOverride,
        simulate_failure: simulateFailure,
      }),
    });
    if (!res.ok) throw new Error("Failed to dispatch reminder");
    return res.json();
  },

  async reportMissedCheckin(id: string, reason: string = "user_engaged_in_life"): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/${id}/missed?reason=${encodeURIComponent(reason)}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to report missed checkin");
    return res.json();
  },

  async getQuietHours(): Promise<QuietHoursSettings> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/quiet-hours`);
    if (!res.ok) throw new Error("Failed to fetch quiet hours");
    return res.json();
  },

  async updateQuietHours(settings: QuietHoursSettings): Promise<QuietHoursSettings> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/quiet-hours`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error("Failed to update quiet hours");
    return res.json();
  },

  async getNotifications(unreadOnly: boolean = false): Promise<InAppNotification[]> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/notifications?unread_only=${unreadOnly}`);
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return res.json();
  },

  async markNotificationRead(id: string): Promise<InAppNotification> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/notifications/${id}/read`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to mark notification read");
    return res.json();
  },

  async dismissNotification(id: string): Promise<InAppNotification> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/notifications/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to dismiss notification");
    return res.json();
  },

  async clearAllNotifications(): Promise<{ cleared_count: number }> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/notifications`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to clear notifications");
    return res.json();
  },

  async getReminderAuditLogs(limit: number = 50): Promise<NotificationAuditLogItem[]> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/audit-logs?limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch reminder audit logs");
    return res.json();
  },

  async previewImport(data: { source: string; raw_sample_text: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/integrations/import/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Import preview failed");
    return res.json();
  },

  async uploadImportBatch(data: {
    source: string;
    filename: string;
    raw_payload_text: string;
    custom_redaction_terms?: string[];
  }): Promise<ImportBatchResponse> {
    const res = await fetch(`${API_BASE}/api/v1/integrations/import/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Import upload failed");
    return res.json();
  },

  async getStagedBatch(batchId: string): Promise<ImportBatchResponse> {
    const res = await fetch(`${API_BASE}/api/v1/integrations/import/batches/${batchId}`);
    if (!res.ok) throw new Error("Failed to fetch staged batch");
    return res.json();
  },

  async updateBatchSelection(
    batchId: string,
    includeIds: string[],
    excludeIds: string[],
  ): Promise<ImportBatchResponse> {
    const res = await fetch(`${API_BASE}/api/v1/integrations/import/batches/${batchId}/selection`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item_ids_to_include: includeIds,
        item_ids_to_exclude: excludeIds,
      }),
    });
    if (!res.ok) throw new Error("Failed to update batch selection");
    return res.json();
  },

  async confirmImportBatch(
    batchId: string,
    approvedCandidateIds: string[],
    rejectedCandidateIds?: string[],
  ): Promise<ConfirmImportResponse> {
    const res = await fetch(`${API_BASE}/api/v1/integrations/import/batches/${batchId}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        approved_candidate_ids: approvedCandidateIds,
        rejected_candidate_ids: rejectedCandidateIds,
      }),
    });
    if (!res.ok) throw new Error("Failed to confirm import batch");
    return res.json();
  },

  async revokeImportBatch(batchId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/integrations/import/batches/${batchId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to revoke import batch");
    return res.json();
  },

  async listOAuthConnections(): Promise<OAuthConnection[]> {
    const res = await fetch(`${API_BASE}/api/v1/integrations/oauth/connections`);
    if (!res.ok) throw new Error("Failed to list OAuth connections");
    return res.json();
  },

  async initiateOAuth(provider: string = "google_calendar"): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/integrations/oauth/initiate?provider=${provider}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to initiate OAuth");
    return res.json();
  },

  async completeOAuthCallback(provider: string, code: string, stateToken: string): Promise<OAuthConnection> {
    const res = await fetch(`${API_BASE}/api/v1/integrations/oauth/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, code, state_token: stateToken }),
    });
    if (!res.ok) throw new Error("Failed to complete OAuth callback");
    return res.json();
  },

  async syncGoogleCalendar(connectionId: string): Promise<CalendarSyncResponse> {
    const res = await fetch(`${API_BASE}/api/v1/integrations/oauth/sync/${connectionId}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to sync calendar");
    return res.json();
  },

  async revokeOAuthConnection(connectionId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/integrations/oauth/${connectionId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to revoke connection");
    return res.json();
  },

  async getPhase2ArchitectureSpecs(): Promise<PhaseTwoArchitectureSpec[]> {
    const res = await fetch(`${API_BASE}/api/v1/integrations/phase2-architecture`);
    if (!res.ok) throw new Error("Failed to fetch Phase 2 specifications");
    return res.json();
  },
};
