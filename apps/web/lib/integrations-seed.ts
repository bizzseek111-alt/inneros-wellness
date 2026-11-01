/**
 * Integrations and Personal Context Hub Seed Data.
 * Provides synthetic export archives, sample PII scrubbing, and Phase 2 architecture specs.
 */

import {
  ImportBatchResponse,
  OAuthConnection,
  CalendarEventItem,
  PhaseTwoArchitectureSpec,
} from "./api-client";

export const SAMPLE_CHATGPT_JSON = JSON.stringify(
  [
    {
      id: "conv_gpt_01",
      title: "Discussing daily grounding habits and career goals",
      create_time: 1728000000,
      mapping: {
        node_1: {
          message: {
            author: { role: "user" },
            content: {
              parts: [
                "My goal is to transition to design architecture. I practice 10-minute breathwork every morning. " +
                  "My email is elena.designer@agency.example.com and phone is 212-555-0144.",
              ],
            },
          },
        },
        node_2: {
          message: {
            author: { role: "assistant" },
            content: {
              parts: [
                "That's an inspiring goal! Consistent morning grounding will support your cognitive pacing.",
              ],
            },
          },
        },
      },
    },
    {
      id: "conv_gpt_02",
      title: "Coping with presentation anxiety before client pitches",
      create_time: 1728100000,
      mapping: {
        node_3: {
          message: {
            author: { role: "user" },
            content: {
              parts: [
                "When I feel overwhelmed at work, stepping outside and box breathing helps me calm down. " +
                  "My address is 450 Broadway St, New York, NY 10013.",
              ],
            },
          },
        },
      },
    },
  ],
  null,
  2
);

export const SAMPLE_CLAUDE_JSON = JSON.stringify(
  [
    {
      uuid: "claude_uuid_99",
      name: "Reflecting on Work Boundaries and Saying No",
      created_at: "2026-10-15T18:00:00Z",
      chat_messages: [
        {
          sender: "human",
          text: "I struggle to say no when asked to take on extra weekend projects. As a design lead, I want to protect my evening recovery routine.",
        },
        {
          sender: "assistant",
          text: "Setting clear, compassionate boundaries is a skill that protects both your craft and nervous system.",
        },
      ],
    },
  ],
  null,
  2
);

export const SAMPLE_MARKDOWN_DOC = `# Therapy Integration & Personal Values
Date: 2026-10-22
Author: Elena Vance

## Core Personal Goal
My goal is to build emotional resilience and maintain consistent somatic pacing during high-velocity design sprints.

## Habits and Grounding
Every morning I drink ceremonial matcha and take three slow, grounding breaths before opening email or Slack.
When anxious, box breathing (4-4-4-4) restores my parasympathetic state.

## Boundary Notes
Client calls after 18:30 violate my evening sanctuary window. Contact: assistant.alex@work.example.com.`;

export const INITIAL_STAGED_BATCH: ImportBatchResponse = {
  batch_id: "batch_sample_gpt_elena",
  user_id: "usr_synthetic_elena_vance_001",
  source: "chatgpt_export",
  filename: "conversations.json",
  total_items: 2,
  selected_items: 2,
  pii_redacted_count: 3,
  prompt_injections_neutralized_count: 0,
  status: "review_ready",
  created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  items: [
    {
      item_id: "item_conv_gpt_01",
      title: "Discussing daily grounding habits and career goals",
      date_timestamp: "2026-10-04T00:00:00Z",
      original_length: 260,
      raw_content:
        "User: My goal is to transition to design architecture. I practice 10-minute breathwork every morning. My email is elena.designer@agency.example.com and phone is 212-555-0144.\n\nAssistant: That's an inspiring goal! Consistent morning grounding will support your cognitive pacing.",
      scrubbed_content:
        "User: My goal is to transition to design architecture. I practice 10-minute breathwork every morning. My email is [EMAIL_REDACTED] and phone is [PHONE_REDACTED].\n\nAssistant: That's an inspiring goal! Consistent morning grounding will support your cognitive pacing.",
      detected_pii: ["elena.designer@agency.example.com", "212-555-0144"],
      prompt_injection_detected: false,
      prompt_injection_flags: [],
      selected_for_import: true,
      suggested_memories: [
        {
          candidate_id: "cand_goal_01",
          category: "personal_goals",
          record_type: "stored_fact",
          fact_statement: "Personal Goal: User is transitioning to design architecture",
          confidence_score: 0.94,
          source_quote: "My goal is to transition to design architecture",
          is_sensitive: false,
          approved_by_user: true,
        },
        {
          candidate_id: "cand_habit_01",
          category: "habits_and_routines",
          record_type: "stored_fact",
          fact_statement: "Habit/Routine: User practices '10-minute breathwork every morning'",
          confidence_score: 0.92,
          source_quote: "I practice 10-minute breathwork every morning",
          is_sensitive: false,
          approved_by_user: true,
        },
      ],
    },
    {
      item_id: "item_conv_gpt_02",
      title: "Coping with presentation anxiety before client pitches",
      date_timestamp: "2026-10-05T03:46:40Z",
      original_length: 210,
      raw_content:
        "User: When I feel overwhelmed at work, stepping outside and box breathing helps me calm down. My address is 450 Broadway St, New York, NY 10013.",
      scrubbed_content:
        "User: When I feel overwhelmed at work, stepping outside and box breathing helps me calm down. My address is [STREET_ADDRESS_REDACTED].",
      detected_pii: ["450 Broadway St, New York, NY 10013"],
      prompt_injection_detected: false,
      prompt_injection_flags: [],
      selected_for_import: true,
      suggested_memories: [
        {
          candidate_id: "cand_coping_02",
          category: "coping_preferences",
          record_type: "stored_fact",
          fact_statement: "Coping Preference: User finds 'stepping outside and box breathing' grounding",
          confidence_score: 0.95,
          source_quote: "stepping outside and box breathing helps me calm down",
          is_sensitive: false,
          approved_by_user: true,
        },
      ],
    },
  ],
};

export const INITIAL_OAUTH_CONNECTIONS: OAuthConnection[] = [
  {
    connection_id: "conn_google_calendar_elena",
    user_id: "usr_synthetic_elena_vance_001",
    provider: "google_calendar",
    status: "connected",
    scopes: ["https://www.googleapis.com/auth/calendar.events.readonly"],
    account_email: "elena.vance@agency.example.com",
    is_read_only: true,
    sync_interval_hours: 12,
    last_synced_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
];

export const INITIAL_CALENDAR_EVENTS: CalendarEventItem[] = [
  {
    event_id: "ev_01",
    summary: "Q4 Design Systems Executive Review",
    start_time: new Date(Date.now() + 3600000 * 3).toISOString(),
    end_time: new Date(Date.now() + 3600000 * 4.5).toISOString(),
    is_busy: true,
    buffer_needed_min: 20,
    location: "Google Meet / Boardroom",
    requires_rest_window: true,
  },
  {
    event_id: "ev_02",
    summary: "1:1 Mentorship with Junior Product Designer",
    start_time: new Date(Date.now() + 3600000 * 6).toISOString(),
    end_time: new Date(Date.now() + 3600000 * 6.75).toISOString(),
    is_busy: true,
    buffer_needed_min: 10,
    location: "Studio A",
    requires_rest_window: false,
  },
];

export const PHASE_TWO_SPECS: PhaseTwoArchitectureSpec[] = [
  {
    provider: "Gmail & Outlook",
    category: "Productivity & Communication",
    read_only_invariant: true,
    permission_scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
    zero_training_guarantee: "Processed in ephemeral server memory. Zero raw email text stored or used for model training.",
    local_enclave_model: "Client-side subject & sender filtering; zero autonomous sending capability in application code.",
    threat_model_summary: "Strict read-only OAuth tokens. Content evaluated as untrusted data against prompt injections.",
  },
  {
    provider: "Notion",
    category: "Knowledge & Notes",
    read_only_invariant: true,
    permission_scopes: ["pages.read"],
    zero_training_guarantee: "Selected subpages only; user grants explicit granular page permissions during OAuth handshake.",
    local_enclave_model: "Page-tree whitelisting; pages with sensitive tags can be excluded with a single toggle.",
    threat_model_summary: "Webhook verification with HMAC SHA-256 signatures; markdown injection disarming.",
  },
  {
    provider: "Apple Health & HealthKit",
    category: "Somatic & Biometric",
    read_only_invariant: true,
    permission_scopes: ["HKQuantityTypeIdentifierHeartRateVariabilitySDNN", "HKCategoryTypeIdentifierSleepAnalysis"],
    zero_training_guarantee: "Biometrics processed strictly on-device inside Apple Secure Enclave. Zero cloud storage of raw biometric streams.",
    local_enclave_model: "On-device summary synthesis; only high-level somatic pacing state (e.g. 'rested', 'sympathetic_activation') shared with companion.",
    threat_model_summary: "HIPAA-compatible on-device isolation. Non-diagnostic disclaimer enforced on all biometrics.",
  },
  {
    provider: "Wearables (Oura, Whoop, Garmin)",
    category: "Sleep Pacing & Recovery",
    read_only_invariant: true,
    permission_scopes: ["daily_readiness.read", "sleep.read"],
    zero_training_guarantee: "Aggregate recovery scores used solely to dynamically adjust companion tone and morning quiet hours.",
    local_enclave_model: "Differential privacy injection on score boundaries; zero raw sensor streaming.",
    threat_model_summary: "OAuth token encryption with user-derived HKDF DEK. Rate-limited passive sync.",
  },
  {
    provider: "Work & Collaboration (Slack, Jira, GitHub)",
    category: "Workload & Burnout Defense",
    read_only_invariant: true,
    permission_scopes: ["users.profile.read", "channels.read"],
    zero_training_guarantee: "Focus pacing and meeting overload detection. Prohibits employer surveillance or productivity tracking.",
    local_enclave_model: "Local calendar blocking without transmitting meeting notes or colleague messages.",
    threat_model_summary: "Tenant isolation with row-level security. Explicit prohibition against manager-facing analytics.",
  },
];
