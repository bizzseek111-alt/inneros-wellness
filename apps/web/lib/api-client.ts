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
  detected_emotion?: string;
  detected_language?: string;
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
      headers: this.getAuthHeaders(),
      credentials: "include",
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
        headers: this.getAuthHeaders(),
        credentials: "include",
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
    const res = await fetch(`${API_BASE}/api/v1/companion/modes`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch modes");
    return res.json();
  },

  async getSessionHistory(sessionId: string): Promise<SessionHistoryResponse> {
    const res = await fetch(`${API_BASE}/api/v1/companion/sessions/${sessionId}`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch session");
    return res.json();
  },

  async clearSessionHistory(sessionId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/api/v1/companion/sessions/${sessionId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
      credentials: "include",
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
      headers: this.getAuthHeaders(),
      credentials: "include",
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
    const res = await fetch(`${API_BASE}/api/v1/memory/records`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
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
    const res = await fetch(url.toString(), {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
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
      headers: this.getAuthHeaders(),
      credentials: "include",
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
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update memory record");
    return res.json();
  },

  async forgetMemory(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/api/v1/memory/records/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
      credentials: "include",
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
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({
        action,
        adjusted_statement: adjustedStatement,
      }),
    });
    if (!res.ok) throw new Error(`Failed to ${action} suggestion`);
    return res.json();
  },

  async getLifeGraph(): Promise<LifeGraphResponse> {
    const res = await fetch(`${API_BASE}/api/v1/memory/life-graph`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
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
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create Life Graph node");
    return res.json();
  },

  async deleteLifeGraphNode(nodeId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/api/v1/memory/life-graph/nodes/${nodeId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
      credentials: "include",
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
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create Life Graph edge");
    return res.json();
  },

  async deleteLifeGraphEdge(edgeId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/api/v1/memory/life-graph/edges/${edgeId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    return res.status === 204;
  },

  async getMemoryConsent(): Promise<UserMemoryConsent> {
    const res = await fetch(`${API_BASE}/api/v1/memory/consent`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch consent settings");
    return res.json();
  },

  async updateMemoryConsent(data: Partial<UserMemoryConsent>): Promise<UserMemoryConsent> {
    const res = await fetch(`${API_BASE}/api/v1/memory/consent`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update consent settings");
    return res.json();
  },

  async updateConsentSettings(data: Partial<UserMemoryConsent>): Promise<UserMemoryConsent> {
    return this.updateMemoryConsent(data);
  },

  async pauseMemory(): Promise<UserMemoryConsent> {
    const res = await fetch(`${API_BASE}/api/v1/memory/pause`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to pause memory");
    return res.json();
  },

  async resumeMemory(): Promise<UserMemoryConsent> {
    const res = await fetch(`${API_BASE}/api/v1/memory/resume`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to resume memory");
    return res.json();
  },

  async purgeAllMemory(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/memory/purge-all`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
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
    const res = await fetch(`${API_BASE}/api/v1/voice/evaluation/benchmarks`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch voice benchmarks");
    return res.json();
  },

  async synthesizeSpeech(params: {
    text: string;
    voiceId?: string;
    language?: string;
    speed?: number;
  }): Promise<{ audio_base64: string; format: string; duration_estimate_sec: number }> {
    const res = await fetch(`${API_BASE}/api/v1/voice/synthesize`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({
        text: params.text,
        voice_id: params.voiceId || "voice_sanctuary_calm",
        language: params.language || "en-US",
        speed: params.speed || 1.0,
      }),
    });
    if (!res.ok) throw new Error("Voice synthesis failed");
    return res.json();
  },

  async getReminders(): Promise<ReminderItem[]> {
    const res = await fetch(`${API_BASE}/api/v1/reminders`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
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
      headers: this.getAuthHeaders(),
      credentials: "include",
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
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update reminder");
    return res.json();
  },

  async deleteReminder(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    return res.status === 204;
  },

  async snoozeReminder(id: string, minutes: number = 15): Promise<ReminderItem> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/${id}/snooze`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({ minutes }),
    });
    if (!res.ok) throw new Error("Failed to snooze reminder");
    return res.json();
  },

  async dismissReminder(id: string): Promise<ReminderItem> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/${id}/dismiss`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
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
      headers: this.getAuthHeaders(),
      credentials: "include",
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
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to report missed checkin");
    return res.json();
  },

  async getQuietHours(): Promise<QuietHoursSettings> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/quiet-hours`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch quiet hours");
    return res.json();
  },

  async updateQuietHours(settings: QuietHoursSettings): Promise<QuietHoursSettings> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/quiet-hours`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error("Failed to update quiet hours");
    return res.json();
  },

  async getNotifications(unreadOnly: boolean = false): Promise<InAppNotification[]> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/notifications?unread_only=${unreadOnly}`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return res.json();
  },

  async markNotificationRead(id: string): Promise<InAppNotification> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/notifications/${id}/read`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to mark notification read");
    return res.json();
  },

  async dismissNotification(id: string): Promise<InAppNotification> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/notifications/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to dismiss notification");
    return res.json();
  },

  async clearAllNotifications(): Promise<{ cleared_count: number }> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/notifications`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to clear notifications");
    return res.json();
  },

  async getReminderAuditLogs(limit: number = 50): Promise<NotificationAuditLogItem[]> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/audit-logs?limit=${limit}`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch reminder audit logs");
    return res.json();
  },

  async registerPushSubscription(payload: {
    endpoint: string;
    p256dh_key?: string;
    auth_key?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/push-subscriptions`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to register push subscription");
    return res.json();
  },

  async getNotificationOutbox(limit: number = 50): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/reminders/outbox?limit=${limit}`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch notification outbox");
    return res.json();
  },

  async previewImport(data: { source: string; raw_sample_text: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/integrations/import/preview`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
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
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Import upload failed");
    return res.json();
  },

  async getStagedBatch(batchId: string): Promise<ImportBatchResponse> {
    const res = await fetch(`${API_BASE}/api/v1/integrations/import/batches/${batchId}`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
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
      headers: this.getAuthHeaders(),
      credentials: "include",
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
      headers: this.getAuthHeaders(),
      credentials: "include",
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
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to revoke import batch");
    return res.json();
  },

  async listOAuthConnections(): Promise<OAuthConnection[]> {
    const res = await fetch(`${API_BASE}/api/v1/integrations/oauth/connections`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to list OAuth connections");
    return res.json();
  },

  async initiateOAuth(provider: string = "google_calendar"): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/integrations/oauth/initiate?provider=${provider}`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to initiate OAuth");
    return res.json();
  },

  async completeOAuthCallback(provider: string, code: string, stateToken: string): Promise<OAuthConnection> {
    const res = await fetch(`${API_BASE}/api/v1/integrations/oauth/callback`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({ provider, code, state_token: stateToken }),
    });
    if (!res.ok) throw new Error("Failed to complete OAuth callback");
    return res.json();
  },

  async syncGoogleCalendar(connectionId: string): Promise<CalendarSyncResponse> {
    const res = await fetch(`${API_BASE}/api/v1/integrations/oauth/sync/${connectionId}`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to sync calendar");
    return res.json();
  },

  async revokeOAuthConnection(connectionId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/integrations/oauth/${connectionId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to revoke connection");
    return res.json();
  },

  async getPhase2ArchitectureSpecs(): Promise<PhaseTwoArchitectureSpec[]> {
    const res = await fetch(`${API_BASE}/api/v1/integrations/phase2-architecture`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch Phase 2 specifications");
    return res.json();
  },

  // ---------------------------------------------------------------------------
  // Authentication & Session Identity
  // ---------------------------------------------------------------------------
  getStoredSessionToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("inneros_auth_token_v1");
  },

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const token = this.getStoredSessionToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  },

  async signup(data: {
    email: string;
    password: string;
    display_name: string;
    locale?: string;
    role?: string;
    age_tier?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Signup failed");
    }
    const payload = await res.json();
    if (typeof window !== "undefined" && payload.session_token) {
      window.localStorage.setItem("inneros_auth_token_v1", payload.session_token);
      window.localStorage.setItem("inneros_user_profile_v1", JSON.stringify(payload.user));
    }
    return payload;
  },

  async login(data: { email: string; password: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Invalid email or password");
    }
    const payload = await res.json();
    if (typeof window !== "undefined" && payload.session_token) {
      window.localStorage.setItem("inneros_auth_token_v1", payload.session_token);
      window.localStorage.setItem("inneros_user_profile_v1", JSON.stringify(payload.user));
    }
    return payload;
  },

  async logout(): Promise<void> {
    await fetch(`${API_BASE}/api/v1/auth/logout`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
    }).catch(() => {});
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("inneros_auth_token_v1");
      window.localStorage.removeItem("inneros_user_profile_v1");
    }
  },

  async getMe(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch current user profile");
    return res.json();
  },

  // ---------------------------------------------------------------------------
  // Wellbeing: Journal, Personal Growth Goals, Daily Check-Ins & Migration
  // ---------------------------------------------------------------------------
  async getJournalEntries(tag?: string): Promise<any[]> {
    const url = new URL(`${API_BASE}/api/v1/journal`);
    if (tag) url.searchParams.set("tag", tag);
    const res = await fetch(url.toString(), {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to load journal entries");
    return res.json();
  },

  async createJournalEntry(data: {
    id?: string;
    title: string;
    content: string;
    prompt?: string;
    tags?: string[];
    mood_valence?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/journal`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to save journal entry");
    return res.json();
  },

  async deleteJournalEntry(entryId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/api/v1/journal/${entryId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    return res.status === 204;
  },

  async getGrowthGoals(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/growth`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to load growth goals");
    return res.json();
  },

  async createGrowthGoal(data: {
    id?: string;
    title: string;
    category: string;
    why_it_matters: string;
    steps: Array<{ id: string; label: string; completed: boolean }>;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/growth`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create growth goal");
    return res.json();
  },

  async toggleGrowthStep(goalId: string, stepId: string, completed?: boolean): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/growth/${goalId}/steps/${stepId}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({ completed }),
    });
    if (!res.ok) throw new Error("Failed to update step");
    return res.json();
  },

  async deleteGrowthGoal(goalId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/api/v1/growth/${goalId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    return res.status === 204;
  },

  async getCheckIns(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/check-ins`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to load check-ins");
    return res.json();
  },

  async createCheckIn(data: {
    energy_level: number;
    stress_level: number;
    emotions: string[];
    needs: string[];
    note: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/check-ins`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to save check-in");
    return res.json();
  },

  async migrateLocalBrowserData(payload: {
    journal_entries: any[];
    growth_goals: any[];
    check_ins: any[];
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/wellbeing/migrate-local`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to migrate local browser data");
    return res.json();
  },

  async submitContactForm(data: {
    name: string;
    email: string;
    inquiry_type: string;
    organization?: string;
    message: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to submit contact form");
    }
    return res.json();
  },

  // ---------------------------------------------------------------------------
  // Admin & Operations Console
  // ---------------------------------------------------------------------------
  async getAdminOverview(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/overview`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to load admin overview");
    return res.json();
  },

  async getFeatureFlags(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/admin/feature-flags`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to load feature flags");
    return res.json();
  },

  async updateFeatureFlag(flagKey: string, enabled: boolean): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/feature-flags/${flagKey}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({ enabled }),
    });
    if (!res.ok) throw new Error("Failed to update feature flag");
    return res.json();
  },

  async getSafetyIncidents(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/admin/safety-incidents`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to load anonymized safety incidents");
    return res.json();
  },

  async getAdminAuditLogs(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/admin/audit-logs`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to load audit logs");
    return res.json();
  },

  // ---------------------------------------------------------------------------
  // Commerce & Customer Portal Methods
  // ---------------------------------------------------------------------------
  async getCommerceCatalog(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/commerce/catalog`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch commerce catalog");
    return res.json();
  },

  async createCheckoutSession(params: {
    price_id: string;
    payment_provider?: string;
    success_url?: string;
    cancel_url?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/commerce/checkout/session`, {
      method: "POST",
      headers: { ...this.getAuthHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error("Failed to create checkout session");
    return res.json();
  },

  async getUserSubscriptions(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/commerce/subscriptions/me`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch user subscriptions");
    return res.json();
  },

  async cancelUserSubscription(subscriptionId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/commerce/subscriptions/${subscriptionId}/cancel`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to cancel subscription");
    return res.json();
  },

  async submitSupportTicket(payload: {
    subject: string;
    category?: string;
    priority?: string;
    message: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/commerce/support/tickets`, {
      method: "POST",
      headers: { ...this.getAuthHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to submit support ticket");
    return res.json();
  },

  async getUserSupportTickets(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/commerce/support/tickets/me`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch user support tickets");
    return res.json();
  },

  // ---------------------------------------------------------------------------
  // Admin Console 23-Section APIs
  // ---------------------------------------------------------------------------
  async getAdminCustomers(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/admin/customers`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getAdminFamilies(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/admin/families`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getAdminChildProfiles(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/admin/child-profiles`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getAdminTeenProfiles(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/admin/teen-profiles`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getAdminSchools(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/admin/schools`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getAdminProducts(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/admin/products`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getAdminPricingPlans(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/admin/pricing-plans`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getAdminOrders(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/admin/orders`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  },

  async processAdminRefund(orderId: string, reason?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/orders/${orderId}/refund`, {
      method: "POST",
      headers: { ...this.getAuthHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ reason: reason || "Administrative refund" }),
    });
    if (!res.ok) throw new Error("Failed to process refund");
    return res.json();
  },

  async getAdminSubscriptions(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/admin/subscriptions`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getAdminPayments(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/admin/payments`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getAdminSupportTickets(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/admin/support-tickets`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  },

  async updateAdminSupportTicket(ticketId: string, patch: { status?: string; assigned_to?: string; resolution_notes?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/support-tickets/${ticketId}`, {
      method: "PATCH",
      headers: { ...this.getAuthHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error("Failed to update support ticket");
    return res.json();
  },

  async getAdminBusinessReport(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/reports/business`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return null;
    return res.json();
  },

  async getAdminAiUsage(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/ai-usage`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return null;
    return res.json();
  },

  async getAdminVoiceProviders(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/admin/voice-providers`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getAdminCurriculum(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/curriculum`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return null;
    return res.json();
  },

  async getAdminActivities(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/activities`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return null;
    return res.json();
  },

  async getAdminTranslations(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/translations`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return null;
    return res.json();
  },

  async getAdminSettings(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/settings`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return null;
    return res.json();
  },

  async getAdminRolesPermissions(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/roles-permissions`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return null;
    return res.json();
  },

  async getAdminTeam(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/admin/team`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  },

  async inviteAdminTeam(data: { email: string; display_name: string; role: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/team/invite`, {
      method: "POST",
      headers: { ...this.getAuthHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to invite team member");
    return res.json();
  },

  async updateAdminTeamRole(userId: string, data: { role: string; is_active?: boolean }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/team/${userId}/role`, {
      method: "PATCH",
      headers: { ...this.getAuthHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update staff role");
    return res.json();
  },

  async createAdminProduct(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/products`, {
      method: "POST",
      headers: { ...this.getAuthHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create product");
    return res.json();
  },

  async updateAdminProduct(productId: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/products/${productId}`, {
      method: "PUT",
      headers: { ...this.getAuthHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update product");
    return res.json();
  },

  async createAdminPricingPlan(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/pricing-plans`, {
      method: "POST",
      headers: { ...this.getAuthHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create pricing plan");
    return res.json();
  },

  async updateAdminPricingPlan(priceId: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/pricing-plans/${priceId}`, {
      method: "PUT",
      headers: { ...this.getAuthHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update pricing plan");
    return res.json();
  },

  async getContentApprovalQueue(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/admin/content-approval/queue`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  },

  async submitContentApprovalAction(data: { module_id: string; decision: string; reviewer_notes: string; reviewer_credentials?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/content-approval/action`, {
      method: "POST",
      headers: { ...this.getAuthHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to submit content approval");
    return res.json();
  },

  async getAdminSafeguardingCases(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/admin/safeguarding/cases`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  },

  async updateAdminSafeguardingCase(caseId: string, data: { resolution_status: string; resolution_notes: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/safeguarding/cases/${caseId}`, {
      method: "PATCH",
      headers: { ...this.getAuthHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update safeguarding case");
    return res.json();
  },

  async toggleAdminVoiceProvider(providerName: string): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/voice-providers/${encodeURIComponent(providerName)}/toggle`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to toggle voice provider");
    return res.json();
  },

  async updateAdminSettings(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/admin/settings`, {
      method: "PUT",
      headers: { ...this.getAuthHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update platform settings");
    return res.json();
  },

  async getUserOrders(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/commerce/orders/me`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getUserInvoices(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/commerce/invoices/me`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  },

  async deleteChildProfile(childId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/youth-governance/profiles/${childId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to delete child profile");
    return res.json();
  },


  // -------------------------------------------------------------
  // InnerOS Youth Sanctuary & Child-Safe Multilingual API Methods
  // -------------------------------------------------------------
  async executeYouthTurn(payload: {
    session_id: string;
    user_utterance?: string;
    audio_base64?: string;
    language?: string;
    age_tier?: string;
    is_interruption?: boolean;
    confidence_score?: number;
    caregiver_present?: boolean;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/youth-companion/turn`, {
      method: "POST",
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to process youth conversation turn");
    }
    return res.json();
  },

  async interruptYouthAudio(sessionId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/youth-companion/interrupt`, {
      method: "POST",
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ session_id: sessionId }),
    });
    if (!res.ok) throw new Error("Failed to interrupt youth audio");
    return res.json();
  },

  async getYouthLanguages(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/youth-companion/languages`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch youth languages");
    return res.json();
  },

  async getYouthBenchmarks(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/youth-companion/benchmarks`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch youth speech benchmarks");
    return res.json();
  },

  // -------------------------------------------------------------
  // Educational Support & Neurodiversity-Affirming API Methods
  // -------------------------------------------------------------
  async getEducationalTasks(category?: string): Promise<any[]> {
    const url = category
      ? `${API_BASE}/api/v1/educational-support/tasks?category=${category}`
      : `${API_BASE}/api/v1/educational-support/tasks`;
    const res = await fetch(url, { headers: this.getAuthHeaders(), credentials: "include" });
    if (!res.ok) throw new Error("Failed to load educational tasks");
    return res.json();
  },

  async getAACSymbols(category?: string): Promise<any[]> {
    const url = category
      ? `${API_BASE}/api/v1/educational-support/aac-symbols?category=${category}`
      : `${API_BASE}/api/v1/educational-support/aac-symbols`;
    const res = await fetch(url, { headers: this.getAuthHeaders(), credentials: "include" });
    if (!res.ok) throw new Error("Failed to load AAC symbols");
    return res.json();
  },

  async getClassroomAccommodations(area?: string): Promise<any[]> {
    const url = area
      ? `${API_BASE}/api/v1/educational-support/accommodations?area=${area}`
      : `${API_BASE}/api/v1/educational-support/accommodations`;
    const res = await fetch(url, { headers: this.getAuthHeaders(), credentials: "include" });
    if (!res.ok) throw new Error("Failed to load classroom accommodations");
    return res.json();
  },

  async getCognitiveGames(domain?: string, specialInterest?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (domain) params.append("domain", domain);
    if (specialInterest) params.append("special_interest", specialInterest);
    const url = `${API_BASE}/api/v1/educational-support/games?${params.toString()}`;
    const res = await fetch(url, { headers: this.getAuthHeaders(), credentials: "include" });
    if (!res.ok) throw new Error("Failed to load cognitive games");
    return res.json();
  },

  async getCaregiverGuidance(category?: string): Promise<any[]> {
    const url = category
      ? `${API_BASE}/api/v1/educational-support/guidance?category=${category}`
      : `${API_BASE}/api/v1/educational-support/guidance`;
    const res = await fetch(url, { headers: this.getAuthHeaders(), credentials: "include" });
    if (!res.ok) throw new Error("Failed to load caregiver guidance");
    return res.json();
  },

  async recordSkillMilestone(payload: {
    child_id_hash: string;
    skill_key: string;
    skill_category: string;
    notes?: string;
  }): Promise<any> {
    const params = new URLSearchParams({
      child_id_hash: payload.child_id_hash,
      skill_key: payload.skill_key,
      skill_category: payload.skill_category,
      notes: payload.notes || "",
    });
    const res = await fetch(`${API_BASE}/api/v1/educational-support/skill-milestone?${params.toString()}`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to record skill milestone");
    }
    return res.json();
  },

  async getDemonstratedSkills(childIdHash: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/educational-support/skills/${childIdHash}`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch demonstrated skills");
    return res.json();
  },

  async getSensoryProfile(childIdHash: string): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/educational-support/sensory-profile/${childIdHash}`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch sensory profile");
    return res.json();
  },

  async updateSensoryProfile(childIdHash: string, profile: any): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/educational-support/sensory-profile/${childIdHash}`, {
      method: "PUT",
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error("Failed to update sensory profile");
    return res.json();
  },

  async getRegulatoryNotice(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/educational-support/regulatory-notice`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch regulatory notice");
    return res.json();
  },

  // ==========================================
  // EDUCATOR & CLASSROOM COHORT API
  // ==========================================
  async createClassroom(payload: { name: string; grade_level?: string; institution_name?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/educational-support/classrooms`, {
      method: "POST",
      headers: { ...this.getAuthHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create classroom cohort");
    return res.json();
  },

  async listClassrooms(teacherId: string = "usr_teacher_demo"): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/educational-support/classrooms?teacher_id=${encodeURIComponent(teacherId)}`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch educator classrooms");
    return res.json();
  },

  async enrollClassroomStudent(payload: { classroom_id: string; student_display_name: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/educational-support/classrooms/enroll`, {
      method: "POST",
      headers: { ...this.getAuthHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to enroll student");
    return res.json();
  },

  async listClassroomStudents(classroomId: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/educational-support/classrooms/${encodeURIComponent(classroomId)}/students`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch classroom students");
    return res.json();
  },

  async createClassroomAssignment(payload: {
    classroom_id: string;
    title: string;
    department_id?: string;
    activity_type?: string;
    instructions?: string;
    due_date?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/educational-support/classrooms/assignments`, {
      method: "POST",
      headers: { ...this.getAuthHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create classroom assignment");
    return res.json();
  },

  async listClassroomAssignments(classroomId: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/educational-support/classrooms/${encodeURIComponent(classroomId)}/assignments`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch classroom assignments");
    return res.json();
  },

  async getClassroomClimate(classroomId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/educational-support/classrooms/${encodeURIComponent(classroomId)}/climate`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch classroom climate");
    return res.json();
  },

  // ==========================================
  // INNEROS KIDS DEVELOPMENT ACADEMY API
  // ==========================================
  async getAcademyDepartments(): Promise<DepartmentInfo[]> {
    const res = await fetch(`${API_BASE}/api/v1/academy/departments`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch curriculum departments");
    return res.json();
  },

  async getAcademyModules(params?: {
    department_id?: string;
    age_band?: string;
    approval_status?: string;
    is_reviewer?: boolean;
  }): Promise<CurriculumModule[]> {
    const query = new URLSearchParams();
    if (params?.department_id) query.append("department_id", params.department_id);
    if (params?.age_band) query.append("age_band", params.age_band);
    if (params?.approval_status) query.append("approval_status", params.approval_status);
    if (params?.is_reviewer !== undefined) query.append("is_reviewer", String(params.is_reviewer));

    const url = `${API_BASE}/api/v1/academy/modules${query.toString() ? `?${query.toString()}` : ""}`;
    const res = await fetch(url, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch curriculum modules");
    return res.json();
  },

  async getAcademyModule(moduleId: string, is_reviewer: boolean = true): Promise<CurriculumModule> {
    const res = await fetch(`${API_BASE}/api/v1/academy/modules/${moduleId}?is_reviewer=${is_reviewer}`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Failed to fetch curriculum module ${moduleId}`);
    }
    return res.json();
  },

  async createAcademyModule(data: any): Promise<CurriculumModule> {
    const res = await fetch(`${API_BASE}/api/v1/academy/modules`, {
      method: "POST",
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to create curriculum module");
    }
    return res.json();
  },

  async updateAcademyModule(moduleId: string, data: any): Promise<CurriculumModule> {
    const res = await fetch(`${API_BASE}/api/v1/academy/modules/${moduleId}`, {
      method: "PUT",
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to update curriculum module");
    }
    return res.json();
  },

  async approveAcademyModule(moduleId: string, action: ApprovalActionRequest): Promise<ApprovalActionResponse> {
    const res = await fetch(`${API_BASE}/api/v1/academy/modules/${moduleId}/approve`, {
      method: "POST",
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(action),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to submit approval action");
    }
    return res.json();
  },

  async getAcademyRecommendations(
    req: RecommendationRequest,
    is_reviewer: boolean = true
  ): Promise<RecommendationResponse> {
    const res = await fetch(`${API_BASE}/api/v1/academy/recommendations?is_reviewer=${is_reviewer}`, {
      method: "POST",
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(req),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to fetch recommendations");
    }
    return res.json();
  },

  async publishAllDemonstrationLessons(): Promise<{ status: string; published_count: number }> {
    const res = await fetch(`${API_BASE}/api/v1/academy/dev/publish-all`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to publish demonstration lessons");
    return res.json();
  },

  // ==========================================
  // YOUTH GOVERNANCE, SAFEGUARDING & PRIVACY
  // ==========================================
  async getParentDashboard(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/youth-governance/parent-dashboard`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch parent dashboard");
    return res.json();
  },

  async getAdminDashboard(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/youth-governance/admin-dashboard`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch admin dashboard");
    return res.json();
  },

  async createChildProfile(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/youth-governance/profiles`, {
      method: "POST",
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to create child profile");
    }
    return res.json();
  },

  async updateChildProfile(childId: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/youth-governance/profiles/${childId}`, {
      method: "PUT",
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to update child profile");
    }
    return res.json();
  },

  async requestChildDataDeletion(childId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/youth-governance/retention/delete`, {
      method: "POST",
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ target_id: childId, request_type: "child_account_deletion" }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to execute data deletion");
    }
    return res.json();
  },

  async getReferrals(countryCode?: string): Promise<any[]> {
    const url = countryCode
      ? `${API_BASE}/api/v1/youth-governance/referrals?country_code=${countryCode}`
      : `${API_BASE}/api/v1/youth-governance/referrals`;
    const res = await fetch(url, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch referral directory");
    return res.json();
  },

  async getYouthSafetyIncidents(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/v1/youth-governance/safety-incidents`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch safety incidents");
    return res.json();
  },

  async updateYouthSafetyIncident(incidentId: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/youth-governance/safety-incidents/${incidentId}`, {
      method: "PUT",
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update safety incident");
    return res.json();
  },
};

export interface DepartmentInfo {
  id: string;
  name: string;
  name_ur: string;
  name_pa: string;
  description: string;
  competency_domain: string;
  evidence_framework: string;
  color_accent: string;
}

export interface InteractiveChoice {
  choice_id: string;
  text_en: string;
  text_ur: string;
  text_pa: string;
  reflection_feedback: string;
}

export interface InteractiveStory {
  title_en: string;
  title_ur: string;
  title_pa: string;
  story_text_en: string;
  story_text_ur: string;
  story_text_pa: string;
  character_name: string;
  choices: InteractiveChoice[];
}

export interface VoiceActivity {
  title: string;
  audio_prompt_en: string;
  audio_prompt_ur: string;
  audio_prompt_pa: string;
  guided_exercise_type: string;
  pacing_seconds: number;
}

export interface TextActivity {
  title: string;
  prompt_en: string;
  prompt_ur: string;
  prompt_pa: string;
  suggested_chips: string[];
  reflective_guidance: string;
}

export interface OfflineActivity {
  title: string;
  instructions_en: string;
  instructions_ur: string;
  instructions_pa: string;
  materials_needed: string[];
  caregiver_or_peer_role: string;
}

export interface KnowledgeCheckOption {
  id: string;
  text: string;
  is_helpful: string;
}

export interface KnowledgeCheck {
  question_en: string;
  question_ur: string;
  question_pa: string;
  options: KnowledgeCheckOption[];
  affirmation_en: string;
  affirmation_ur: string;
  affirmation_pa: string;
}

export interface AccessibilityAdaptations {
  visual: string;
  auditory: string;
  motor: string;
  sensory: string;
  cognitive: string;
}

export interface CurriculumModule {
  module_id: string;
  department_id: string;
  title_en: string;
  title_ur: string;
  title_pa: string;
  target_age_range: string;
  difficulty: string;
  developmental_objective: string;
  research_references: string[];
  evidence_strength: string;
  reviewer_name: string;
  approval_status: "draft" | "under_review" | "approved_pending_clinical_signoff" | "published" | "archived";
  version: string;
  recommended_session_duration_min: number;
  accessibility_adaptations: AccessibilityAdaptations;
  interactive_story: InteractiveStory;
  voice_based_activity: VoiceActivity;
  text_based_activity: TextActivity;
  offline_activity: OfflineActivity;
  knowledge_check: KnowledgeCheck;
  non_diagnostic_progress_indicator: string;
  safety_and_escalation?: Record<string, any>;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecommendationRequest {
  age_range: string;
  chosen_goals: string[];
  completed_module_ids?: string[];
  sensory_preference?: string;
  language?: string;
}

export interface RecommendationResponse {
  recommended_modules: CurriculumModule[];
  primary_recommendation_reason: string;
  age_band_display: string;
}

export interface ApprovalActionRequest {
  module_id: string;
  target_status: string;
  reviewer_name: string;
  reviewer_notes: string;
  signed_clinical_disclaimer?: boolean;
}

export interface ApprovalActionResponse {
  module_id: string;
  previous_status: string;
  new_status: string;
  timestamp: string;
  message: string;
}

export const apiClient = api;
export default api;
