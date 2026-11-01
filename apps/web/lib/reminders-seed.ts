/**
 * Reminders and Proactive Companion Synthetic Seed Data.
 * Matches backend synthetic state for Elena Vance.
 */

export interface ReminderItem {
  id: string;
  user_id: string;
  title: string;
  reminder_type:
    | "mindful_checkin"
    | "breathwork_pause"
    | "evening_reflection"
    | "hydration_stretch"
    | "mood_journaling"
    | "reading_learning"
    | "habit_routine"
    | "appointment_prep"
    | "goal_followup";
  prompt_text: string;
  sanitized_lockscreen_text: string;
  cron_or_time: string;
  recurrence: "once" | "daily" | "weekdays" | "weekends" | "weekly" | "custom";
  target_date?: string;
  timezone: string;
  channels: ("in_app" | "web_push" | "email")[];
  priority: "wellbeing_prompt" | "operational_account" | "emergency_safety";
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
  channel: "in_app" | "web_push" | "email";
  priority: "wellbeing_prompt" | "operational_account" | "emergency_safety";
  status: "scheduled" | "delivered" | "snoozed" | "dismissed" | "suppressed_quiet_hours" | "failed" | "missed_no_danger";
  read: boolean;
  is_dismissed: boolean;
  created_at: string;
  delivered_at?: string;
  retry_count: number;
  idempotency_key?: string;
  behavioral_safety_tag: string;
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

export const INITIAL_QUIET_HOURS: QuietHoursSettings = {
  enabled: true,
  start_time: "22:00",
  end_time: "07:30",
  timezone: "America/New_York",
  suppress_audio: true,
  allow_emergency_safety: true,
  max_prompts_per_day: 3,
};

export const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: "rem_morning_seed",
    user_id: "usr_synthetic_elena_vance_001",
    title: "Morning Breath & Grounding",
    reminder_type: "mindful_checkin",
    prompt_text: "Notice your breath without trying to change it. Anchor into 3 slow physical sensations in your posture.",
    sanitized_lockscreen_text: "Morning Check-in: Take a slow breath whenever you are ready.",
    cron_or_time: "08:30",
    recurrence: "daily",
    timezone: "America/New_York",
    channels: ["in_app", "web_push"],
    priority: "wellbeing_prompt",
    is_active: true,
    is_paused: false,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    last_delivered_at: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: "rem_midday_seed",
    user_id: "usr_synthetic_elena_vance_001",
    title: "Midday Re-center Pause",
    reminder_type: "breathwork_pause",
    prompt_text: "Step away from your screen for 2 minutes. Relax the muscles in your jaw, soften your shoulders, and exhale completely.",
    sanitized_lockscreen_text: "A mindful pause: Take a few grounding breaths.",
    cron_or_time: "14:00",
    recurrence: "weekdays",
    timezone: "America/New_York",
    channels: ["in_app"],
    priority: "wellbeing_prompt",
    is_active: true,
    is_paused: false,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    last_delivered_at: new Date(Date.now() - 28 * 3600000).toISOString(),
  },
  {
    id: "rem_evening_seed",
    user_id: "usr_synthetic_elena_vance_001",
    title: "Evening Sanctuary Reflection",
    reminder_type: "evening_reflection",
    prompt_text: "What went well today, and what can you gently set down for tomorrow? A quiet moment before your sleep window begins.",
    sanitized_lockscreen_text: "Evening Sanctuary: Time for your daily reflection.",
    cron_or_time: "21:15",
    recurrence: "daily",
    timezone: "America/New_York",
    channels: ["in_app", "web_push"],
    priority: "wellbeing_prompt",
    is_active: true,
    is_paused: false,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    last_delivered_at: new Date(Date.now() - 14 * 3600000).toISOString(),
  },
  {
    id: "rem_walk_seed",
    user_id: "usr_synthetic_elena_vance_001",
    title: "Somatic Walking Follow-up",
    reminder_type: "goal_followup",
    prompt_text: "Check in on your personal intention: 20-minute evening walk in the park without headphones or notifications.",
    sanitized_lockscreen_text: "Goal companion: Check in on your personal intention.",
    cron_or_time: "17:30",
    recurrence: "daily",
    timezone: "America/New_York",
    channels: ["in_app"],
    priority: "wellbeing_prompt",
    is_active: true,
    is_paused: false,
    target_goal_or_event: "Somatic Walking Routine",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "rem_reading_seed",
    user_id: "usr_synthetic_elena_vance_001",
    title: "Weekly Psychology Reading",
    reminder_type: "reading_learning",
    prompt_text: "Explore 1 research-backed insight from ACT or Cognitive Defusion in your psychology library.",
    sanitized_lockscreen_text: "Mindful reading: Your scheduled knowledge pause is ready.",
    cron_or_time: "10:00",
    recurrence: "weekly",
    timezone: "America/New_York",
    channels: ["in_app"],
    priority: "wellbeing_prompt",
    is_active: true,
    is_paused: false,
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: "rem_appt_seed",
    user_id: "usr_synthetic_elena_vance_001",
    title: "Peer Mentorship Catch-up Buffer",
    reminder_type: "appointment_prep",
    prompt_text: "Take 10 minutes to breathe, review your notes, and hydrate before connecting with Sarah.",
    sanitized_lockscreen_text: "Upcoming commitment: Gentle preparation reminder.",
    cron_or_time: "2026-11-04 14:00",
    recurrence: "once",
    target_date: "2026-11-04",
    timezone: "America/New_York",
    channels: ["in_app", "email"],
    priority: "wellbeing_prompt",
    is_active: true,
    is_paused: false,
    target_goal_or_event: "Design Mentorship Session",
    buffer_minutes: 15,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
];

export const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: "notif_seed_01",
    user_id: "usr_synthetic_elena_vance_001",
    reminder_id: "rem_morning_seed",
    title: "Morning Breath & Grounding",
    sanitized_lockscreen_preview: "Morning Check-in: Take a slow breath whenever you are ready.",
    full_body_content: "Notice your breath without trying to change it. Anchor into 3 slow physical sensations in your posture.",
    channel: "in_app",
    priority: "wellbeing_prompt",
    status: "delivered",
    read: false,
    is_dismissed: false,
    created_at: new Date(Date.now() - 55 * 60000).toISOString(),
    delivered_at: new Date(Date.now() - 55 * 60000).toISOString(),
    retry_count: 0,
    behavioral_safety_tag: "autonomous_buddy_consent_verified",
  },
  {
    id: "notif_seed_02",
    user_id: "usr_synthetic_elena_vance_001",
    reminder_id: "rem_evening_seed",
    title: "Evening Sanctuary Reflection",
    sanitized_lockscreen_preview: "Evening Sanctuary: Time for your daily reflection.",
    full_body_content: "What went well today, and what can you gently set down for tomorrow? A quiet moment before your sleep window begins.",
    channel: "in_app",
    priority: "wellbeing_prompt",
    status: "delivered",
    read: true,
    is_dismissed: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    delivered_at: new Date(Date.now() - 86400000).toISOString(),
    retry_count: 0,
    behavioral_safety_tag: "autonomous_buddy_consent_verified",
  },
];

export const INITIAL_AUDIT_LOGS: NotificationAuditLogItem[] = [
  {
    id: "audit_seed_01",
    user_id: "usr_synthetic_elena_vance_001",
    reminder_id: "rem_morning_seed",
    event_type: "dispatched",
    channel: "in_app",
    status: "delivered",
    details: { sanitized: true, in_quiet_hours: false, retry_count: 0 },
    timestamp: new Date(Date.now() - 55 * 60000).toISOString(),
  },
  {
    id: "audit_seed_02",
    user_id: "usr_synthetic_elena_vance_001",
    reminder_id: "rem_evening_seed",
    event_type: "dispatched",
    channel: "in_app",
    status: "delivered",
    details: { sanitized: true, in_quiet_hours: false, retry_count: 0 },
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "audit_seed_03",
    user_id: "usr_synthetic_elena_vance_001",
    reminder_id: "rem_midday_seed",
    event_type: "checkin_missed_graceful",
    status: "missed_no_danger",
    details: { safety_invariant: "missed_checkin_does_not_equal_danger", emergency_alert_triggered: false },
    timestamp: new Date(Date.now() - 172800000).toISOString(),
  },
];
