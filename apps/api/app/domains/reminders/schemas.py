"""Reminders Domain Schemas.
Data contracts for mindful check-in reminders, proactive buddy prompts,
time-zone-aware circadian quiet hours, lockscreen sanitization, and delivery history.
"""

from enum import Enum
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class ReminderType(str, Enum):
    MINDFUL_CHECKIN = "mindful_checkin"
    BREATHWORK_PAUSE = "breathwork_pause"
    EVENING_REFLECTION = "evening_reflection"
    HYDRATION_STRETCH = "hydration_stretch"
    MOOD_JOURNALING = "mood_journaling"
    READING_LEARNING = "reading_learning"
    HABIT_ROUTINE = "habit_routine"
    APPOINTMENT_PREP = "appointment_prep"
    GOAL_FOLLOWUP = "goal_followup"


class NotificationChannel(str, Enum):
    IN_APP = "in_app"
    WEB_PUSH = "web_push"
    EMAIL = "email"


class NotificationPriority(str, Enum):
    WELLBEING_PROMPT = "wellbeing_prompt"      # Subject to quiet hours & frequency limits
    OPERATIONAL_ACCOUNT = "operational_account"  # System/security notices
    EMERGENCY_SAFETY = "emergency_safety"      # Bypasses quiet hours, crisis contacts


class DeliveryStatus(str, Enum):
    SCHEDULED = "scheduled"
    DELIVERED = "delivered"
    SNOOZED = "snoozed"
    DISMISSED = "dismissed"
    SUPPRESSED_QUIET_HOURS = "suppressed_quiet_hours"
    SKIPPED_THROTTLED = "skipped_throttled"
    FAILED = "failed"
    MISSED_NO_DANGER = "missed_no_danger"  # Safety invariant: missed checkin != crisis


class RecurrenceRule(str, Enum):
    ONCE = "once"
    DAILY = "daily"
    WEEKDAYS = "weekdays"
    WEEKENDS = "weekends"
    WEEKLY = "weekly"
    CUSTOM = "custom"


class QuietHoursSettings(BaseModel):
    enabled: bool = True
    start_time: str = "22:00"  # 24-hr format HH:MM
    end_time: str = "07:30"
    timezone: str = "America/New_York"
    suppress_audio: bool = True
    allow_emergency_safety: bool = True  # Safety alerts bypass quiet hours
    max_prompts_per_day: int = 3         # Strict attention throttle


class ReminderItem(BaseModel):
    id: str
    user_id: str
    title: str
    reminder_type: ReminderType
    prompt_text: str                     # In-app rich prompt
    sanitized_lockscreen_text: str       # Non-stigmatizing, privacy-safe for push/lockscreen
    cron_or_time: str                    # e.g. "08:30" or ISO datetime for one-time
    recurrence: RecurrenceRule = RecurrenceRule.DAILY
    target_date: Optional[str] = None    # YYYY-MM-DD for one-time
    timezone: str = "America/New_York"
    channels: List[NotificationChannel] = [NotificationChannel.IN_APP]
    priority: NotificationPriority = NotificationPriority.WELLBEING_PROMPT
    is_active: bool = True
    is_paused: bool = False
    snoozed_until: Optional[datetime] = None
    last_delivered_at: Optional[datetime] = None
    target_goal_or_event: Optional[str] = None
    buffer_minutes: Optional[int] = None # Buffer for appointment prep
    created_at: datetime
    updated_at: Optional[datetime] = None


class ReminderCreateRequest(BaseModel):
    title: str
    reminder_type: ReminderType
    prompt_text: str
    sanitized_lockscreen_text: Optional[str] = None  # Auto-generated if omitted
    cron_or_time: str
    recurrence: Optional[RecurrenceRule] = RecurrenceRule.DAILY
    target_date: Optional[str] = None
    timezone: Optional[str] = "America/New_York"
    channels: Optional[List[NotificationChannel]] = [NotificationChannel.IN_APP]
    priority: Optional[NotificationPriority] = NotificationPriority.WELLBEING_PROMPT
    target_goal_or_event: Optional[str] = None
    buffer_minutes: Optional[int] = None


class ReminderUpdateRequest(BaseModel):
    title: Optional[str] = None
    prompt_text: Optional[str] = None
    sanitized_lockscreen_text: Optional[str] = None
    cron_or_time: Optional[str] = None
    recurrence: Optional[RecurrenceRule] = None
    target_date: Optional[str] = None
    timezone: Optional[str] = None
    channels: Optional[List[NotificationChannel]] = None
    is_active: Optional[bool] = None
    is_paused: Optional[bool] = None
    target_goal_or_event: Optional[str] = None
    buffer_minutes: Optional[int] = None


class InAppNotification(BaseModel):
    id: str
    user_id: str
    reminder_id: Optional[str] = None
    title: str
    sanitized_lockscreen_preview: str
    full_body_content: str
    channel: NotificationChannel = NotificationChannel.IN_APP
    priority: NotificationPriority = NotificationPriority.WELLBEING_PROMPT
    status: DeliveryStatus = DeliveryStatus.DELIVERED
    read: bool = False
    is_dismissed: bool = False
    created_at: datetime
    delivered_at: Optional[datetime] = None
    retry_count: int = 0
    idempotency_key: Optional[str] = None
    behavioral_safety_tag: str = "autonomous_buddy_consent_verified"


class SnoozeRequest(BaseModel):
    minutes: int = Field(default=15, ge=5, le=1440)  # 5 mins to 24 hours
    preset: Optional[str] = None  # e.g. "15m", "1h", "tomorrow_morning"


class DispatchReminderRequest(BaseModel):
    idempotency_key: str
    channel_override: Optional[NotificationChannel] = None
    simulate_failure: Optional[bool] = False


class DispatchResult(BaseModel):
    job_id: str
    reminder_id: str
    status: DeliveryStatus
    channel: NotificationChannel
    sanitized_text_sent: str
    private_details_held_in_app: bool
    is_quiet_hours_suppressed: bool
    retry_count: int
    dispatched_at: datetime
    audit_log_id: str
    message: str


class NotificationAuditLogItem(BaseModel):
    id: str
    user_id: str
    reminder_id: Optional[str] = None
    event_type: str  # scheduled, dispatched, snoozed, dismissed, suppressed, missed_cleared
    channel: Optional[NotificationChannel] = None
    status: DeliveryStatus
    details: Dict[str, Any]
    timestamp: datetime
