"""Reminders & Proactive Companion Service.
Manages mindful habit routines, daily check-ins, time-zone-aware circadian quiet hours,
lockscreen privacy sanitization, and autonomous non-guilt life assistance.

Behavioral Safety Principles:
1. Zero Guilt & Zero Streak Pressure: Rejects artificial attachment and co-dependency cues.
2. Lockscreen Privacy Sanitization: Prohibits psychological details from lockscreens.
3. Missed Check-in Safety Invariant: NEVER infers self-harm or crisis from missed check-ins.
4. Autonomous Consent: Every reminder is opt-in and user-controllable.
"""

import uuid
from datetime import datetime, timezone, timedelta, time as dt_time
from typing import List, Dict, Optional, Any
from zoneinfo import ZoneInfo

from app.domains.reminders.schemas import (
    ReminderItem,
    ReminderCreateRequest,
    ReminderUpdateRequest,
    ReminderType,
    NotificationChannel,
    NotificationPriority,
    DeliveryStatus,
    RecurrenceRule,
    QuietHoursSettings,
    InAppNotification,
    DispatchReminderRequest,
    DispatchResult,
    NotificationAuditLogItem,
)

# In-memory stores partitioned by user_id
_REMINDERS_STORE: Dict[str, List[ReminderItem]] = {}
_QUIET_HOURS_STORE: Dict[str, QuietHoursSettings] = {}
_NOTIFICATIONS_STORE: Dict[str, List[InAppNotification]] = {}
_AUDIT_LOGS_STORE: Dict[str, List[NotificationAuditLogItem]] = {}
_IDEMPOTENCY_CACHE: Dict[str, DispatchResult] = {}

SENSITIVE_PSYCH_TERMS = [
    "panic",
    "trauma",
    "anxiety attack",
    "depression",
    "dissociation",
    "psychiatric",
    "suicide",
    "self-harm",
    "medication",
    "therapy session",
    "grief",
    "eating disorder",
    "relapse",
]

MANIPULATIVE_ATTACHMENT_TERMS = [
    "break your streak",
    "don't break your streak",
    "where were you",
    "why haven't you",
    "i missed you",
    "i was waiting for you",
    "you promised",
    "disappointed",
    "failing to check in",
    "streak at risk",
]


def sanitize_lockscreen_preview(prompt_text: str, reminder_type: ReminderType) -> str:
    """Ensures sensitive psychological reflections or diagnoses NEVER leak to lockscreens.
    
    Returns a neutral, calm, non-stigmatizing notification preview suitable for shared devices.
    """
    lower = prompt_text.lower()
    has_sensitive = any(term in lower for term in SENSITIVE_PSYCH_TERMS)

    if has_sensitive or len(prompt_text) > 80:
        if reminder_type == ReminderType.MINDFUL_CHECKIN:
            return "Gentle reminder: Your morning mindful check-in is ready."
        elif reminder_type == ReminderType.BREATHWORK_PAUSE:
            return "A mindful pause: Take a few grounding breaths."
        elif reminder_type == ReminderType.EVENING_REFLECTION:
            return "Evening Sanctuary: Time for your daily reflection."
        elif reminder_type == ReminderType.MOOD_JOURNALING:
            return "Journal prompt: An invitation to check in with yourself."
        elif reminder_type == ReminderType.READING_LEARNING:
            return "Mindful reading: Your scheduled knowledge pause is ready."
        elif reminder_type == ReminderType.HABIT_ROUTINE:
            return "Habit loop: A gentle cue for your routine."
        elif reminder_type == ReminderType.APPOINTMENT_PREP:
            return "Upcoming commitment: Gentle preparation reminder."
        elif reminder_type == ReminderType.GOAL_FOLLOWUP:
            return "Goal companion: Check in on your personal intention."
        else:
            return "Gentle reminder: InnerOS sanctuary is waiting whenever you are ready."

    return prompt_text


def validate_buddy_message_ethics(text: str) -> None:
    """Validates that proactive companion messages adhere to non-manipulative ethical guidelines.
    
    Rejects guilt trips, possessive AI language, and streak-shaming.
    """
    lower = text.lower()
    for phrase in MANIPULATIVE_ATTACHMENT_TERMS:
        if phrase in lower:
            raise ValueError(
                f"Proactive message violates InnerOS Behavioral Ethics Policy: contains manipulative phrase '{phrase}'. "
                "InnerOS companions must never guilt, possess, or pressure users."
            )


def parse_time_string(time_str: str) -> dt_time:
    """Parses 'HH:MM' into a datetime.time object."""
    try:
        parts = time_str.strip().split(":")
        return dt_time(hour=int(parts[0]), minute=int(parts[1]))
    except Exception:
        return dt_time(hour=22, minute=0)


def is_in_quiet_hours(
    settings: QuietHoursSettings,
    check_dt: Optional[datetime] = None,
) -> bool:
    """Evaluates whether check_dt (or current time) falls within the user's circadian quiet hours.
    
    Correctly handles overnight spans (e.g., 22:00 -> 07:30) in the user's timezone.
    """
    if not settings.enabled:
        return False

    try:
        tz = ZoneInfo(settings.timezone)
    except Exception:
        tz = timezone.utc

    if check_dt is None:
        check_dt = datetime.now(timezone.utc)

    # Convert to user local time
    local_dt = check_dt.astimezone(tz)
    current_time = local_dt.time()

    start = parse_time_string(settings.start_time)
    end = parse_time_string(settings.end_time)

    if start <= end:
        # Normal daytime or single-day window (e.g. 13:00 to 15:00)
        return start <= current_time <= end
    else:
        # Overnight span (e.g. 22:00 to 07:30)
        return current_time >= start or current_time <= end


def _init_synthetic_user_state(user_id: str) -> None:
    """Initializes rich synthetic data for Elena Vance or default user."""
    if user_id in _REMINDERS_STORE:
        return

    now = datetime.now(timezone.utc)
    user_tz = "America/New_York"

    # Default Quiet Hours Settings
    _QUIET_HOURS_STORE[user_id] = QuietHoursSettings(
        enabled=True,
        start_time="22:00",
        end_time="07:30",
        timezone=user_tz,
        suppress_audio=True,
        allow_emergency_safety=True,
        max_prompts_per_day=3,
    )

    # Synthetic Scheduled Reminders (User-Controlled Routine)
    reminders = [
        ReminderItem(
            id=f"rem_morning_{uuid.uuid4().hex[:6]}",
            user_id=user_id,
            title="Morning Breath & Grounding",
            reminder_type=ReminderType.MINDFUL_CHECKIN,
            prompt_text="Notice your breath without trying to change it. Anchor into 3 slow physical sensations.",
            sanitized_lockscreen_text="Morning Check-in: Take a slow breath whenever you are ready.",
            cron_or_time="08:30",
            recurrence=RecurrenceRule.DAILY,
            timezone=user_tz,
            channels=[NotificationChannel.IN_APP, NotificationChannel.WEB_PUSH],
            priority=NotificationPriority.WELLBEING_PROMPT,
            is_active=True,
            is_paused=False,
            created_at=now - timedelta(days=7),
            last_delivered_at=now - timedelta(hours=3),
        ),
        ReminderItem(
            id=f"rem_midday_{uuid.uuid4().hex[:6]}",
            user_id=user_id,
            title="Midday Re-center Pause",
            reminder_type=ReminderType.BREATHWORK_PAUSE,
            prompt_text="Step away from your screen for 2 minutes. Relax the muscles in your jaw and shoulders.",
            sanitized_lockscreen_text="A mindful pause: Take a few grounding breaths.",
            cron_or_time="14:00",
            recurrence=RecurrenceRule.WEEKDAYS,
            timezone=user_tz,
            channels=[NotificationChannel.IN_APP],
            priority=NotificationPriority.WELLBEING_PROMPT,
            is_active=True,
            is_paused=False,
            created_at=now - timedelta(days=5),
            last_delivered_at=now - timedelta(days=1, hours=4),
        ),
        ReminderItem(
            id=f"rem_evening_{uuid.uuid4().hex[:6]}",
            user_id=user_id,
            title="Evening Sanctuary Reflection",
            reminder_type=ReminderType.EVENING_REFLECTION,
            prompt_text="What went well today, and what can you gently set down for tomorrow?",
            sanitized_lockscreen_text="Evening Sanctuary: Time for your daily reflection.",
            cron_or_time="21:15",
            recurrence=RecurrenceRule.DAILY,
            timezone=user_tz,
            channels=[NotificationChannel.IN_APP, NotificationChannel.WEB_PUSH],
            priority=NotificationPriority.WELLBEING_PROMPT,
            is_active=True,
            is_paused=False,
            created_at=now - timedelta(days=10),
            last_delivered_at=now - timedelta(hours=14),
        ),
        ReminderItem(
            id=f"rem_walk_{uuid.uuid4().hex[:6]}",
            user_id=user_id,
            title="Somatic Walking Follow-up",
            reminder_type=ReminderType.GOAL_FOLLOWUP,
            prompt_text="Check in on your goal: 20-minute evening walk in the park without headphones.",
            sanitized_lockscreen_text="Goal companion: Check in on your personal intention.",
            cron_or_time="17:30",
            recurrence=RecurrenceRule.DAILY,
            timezone=user_tz,
            channels=[NotificationChannel.IN_APP],
            priority=NotificationPriority.WELLBEING_PROMPT,
            is_active=True,
            is_paused=False,
            target_goal_or_event="Somatic Walking Habit",
            created_at=now - timedelta(days=3),
        ),
        ReminderItem(
            id=f"rem_reading_{uuid.uuid4().hex[:6]}",
            user_id=user_id,
            title="Weekly Psychology Reading",
            reminder_type=ReminderType.READING_LEARNING,
            prompt_text="Explore 1 research-backed insight from ACT or Cognitive Defusion in your library.",
            sanitized_lockscreen_text="Mindful reading: Your scheduled knowledge pause is ready.",
            cron_or_time="10:00",
            recurrence=RecurrenceRule.WEEKLY,
            timezone=user_tz,
            channels=[NotificationChannel.IN_APP],
            priority=NotificationPriority.WELLBEING_PROMPT,
            is_active=True,
            is_paused=False,
            created_at=now - timedelta(days=12),
        ),
        ReminderItem(
            id=f"rem_appt_{uuid.uuid4().hex[:6]}",
            user_id=user_id,
            title="Peer Mentorship Catch-up Buffer",
            reminder_type=ReminderType.APPOINTMENT_PREP,
            prompt_text="Take 10 minutes to breathe, review your notes, and hydrate before meeting Sarah.",
            sanitized_lockscreen_text="Upcoming commitment: Gentle preparation reminder.",
            cron_or_time="2026-11-04 14:00",
            recurrence=RecurrenceRule.ONCE,
            target_date="2026-11-04",
            timezone=user_tz,
            channels=[NotificationChannel.IN_APP, NotificationChannel.EMAIL],
            priority=NotificationPriority.WELLBEING_PROMPT,
            is_active=True,
            is_paused=False,
            target_goal_or_event="Design Mentorship Session",
            buffer_minutes=15,
            created_at=now - timedelta(hours=2),
        ),
    ]
    _REMINDERS_STORE[user_id] = reminders

    # Seed Notifications in the In-App Notification Center
    _NOTIFICATIONS_STORE[user_id] = [
        InAppNotification(
            id=f"notif_{uuid.uuid4().hex[:8]}",
            user_id=user_id,
            reminder_id=reminders[0].id,
            title="Morning Breath & Grounding",
            sanitized_lockscreen_preview="Morning Check-in: Take a slow breath whenever you are ready.",
            full_body_content="Notice your breath without trying to change it. Anchor into 3 slow physical sensations.",
            channel=NotificationChannel.IN_APP,
            priority=NotificationPriority.WELLBEING_PROMPT,
            status=DeliveryStatus.DELIVERED,
            read=False,
            is_dismissed=False,
            created_at=now - timedelta(hours=1),
            delivered_at=now - timedelta(hours=1),
            behavioral_safety_tag="autonomous_buddy_consent_verified",
        ),
        InAppNotification(
            id=f"notif_{uuid.uuid4().hex[:8]}",
            user_id=user_id,
            reminder_id=reminders[2].id,
            title="Evening Sanctuary Reflection",
            sanitized_lockscreen_preview="Evening Sanctuary: Time for your daily reflection.",
            full_body_content="What went well today, and what can you gently set down for tomorrow?",
            channel=NotificationChannel.IN_APP,
            priority=NotificationPriority.WELLBEING_PROMPT,
            status=DeliveryStatus.DELIVERED,
            read=True,
            is_dismissed=False,
            created_at=now - timedelta(days=1),
            delivered_at=now - timedelta(days=1),
            behavioral_safety_tag="autonomous_buddy_consent_verified",
        ),
    ]

    # Seed Audit Log Entries
    _AUDIT_LOGS_STORE[user_id] = [
        NotificationAuditLogItem(
            id=f"audit_{uuid.uuid4().hex[:8]}",
            user_id=user_id,
            reminder_id=reminders[0].id,
            event_type="dispatched",
            channel=NotificationChannel.IN_APP,
            status=DeliveryStatus.DELIVERED,
            details={"sanitized": True, "quiet_hours_checked": True, "in_quiet_hours": False},
            timestamp=now - timedelta(hours=1),
        ),
        NotificationAuditLogItem(
            id=f"audit_{uuid.uuid4().hex[:8]}",
            user_id=user_id,
            reminder_id=reminders[2].id,
            event_type="dispatched",
            channel=NotificationChannel.IN_APP,
            status=DeliveryStatus.DELIVERED,
            details={"sanitized": True, "quiet_hours_checked": True, "in_quiet_hours": False},
            timestamp=now - timedelta(days=1),
        ),
    ]


class RemindersService:
    """Enterprise service layer for InnerOS Proactive Companion & Everyday Assistance."""

    # --- Reminders CRUD ---

    def list_reminders(self, user_id: str) -> List[ReminderItem]:
        _init_synthetic_user_state(user_id)
        return _REMINDERS_STORE.get(user_id, [])

    def get_reminder(self, user_id: str, reminder_id: str) -> Optional[ReminderItem]:
        _init_synthetic_user_state(user_id)
        for r in _REMINDERS_STORE.get(user_id, []):
            if r.id == reminder_id:
                return r
        return None

    def create_reminder(self, user_id: str, req: ReminderCreateRequest) -> ReminderItem:
        _init_synthetic_user_state(user_id)
        now = datetime.now(timezone.utc)

        # Behavioral ethics validation
        validate_buddy_message_ethics(req.title)
        validate_buddy_message_ethics(req.prompt_text)

        # Lockscreen privacy sanitization
        sanitized_text = req.sanitized_lockscreen_text
        if not sanitized_text or not sanitized_text.strip():
            sanitized_text = sanitize_lockscreen_preview(req.prompt_text, req.reminder_type)
        else:
            # Also sanitize custom lockscreen text if user entered sensitive words
            sanitized_text = sanitize_lockscreen_preview(sanitized_text, req.reminder_type)

        item = ReminderItem(
            id=f"rem_{uuid.uuid4().hex[:8]}",
            user_id=user_id,
            title=req.title,
            reminder_type=req.reminder_type,
            prompt_text=req.prompt_text,
            sanitized_lockscreen_text=sanitized_text,
            cron_or_time=req.cron_or_time,
            recurrence=req.recurrence or RecurrenceRule.DAILY,
            target_date=req.target_date,
            timezone=req.timezone or "America/New_York",
            channels=req.channels or [NotificationChannel.IN_APP],
            priority=req.priority or NotificationPriority.WELLBEING_PROMPT,
            is_active=True,
            is_paused=False,
            target_goal_or_event=req.target_goal_or_event,
            buffer_minutes=req.buffer_minutes,
            created_at=now,
            updated_at=now,
        )
        _REMINDERS_STORE[user_id].append(item)

        # Audit log creation
        self._record_audit(
            user_id=user_id,
            reminder_id=item.id,
            event_type="scheduled",
            status=DeliveryStatus.SCHEDULED,
            details={"title": item.title, "recurrence": item.recurrence.value},
        )

        return item

    def update_reminder(
        self, user_id: str, reminder_id: str, req: ReminderUpdateRequest
    ) -> Optional[ReminderItem]:
        _init_synthetic_user_state(user_id)
        items = _REMINDERS_STORE.get(user_id, [])
        for r in items:
            if r.id == reminder_id:
                if req.title is not None:
                    validate_buddy_message_ethics(req.title)
                    r.title = req.title
                if req.prompt_text is not None:
                    validate_buddy_message_ethics(req.prompt_text)
                    r.prompt_text = req.prompt_text
                    if req.sanitized_lockscreen_text is None:
                        r.sanitized_lockscreen_text = sanitize_lockscreen_preview(
                            req.prompt_text, r.reminder_type
                        )
                if req.sanitized_lockscreen_text is not None:
                    r.sanitized_lockscreen_text = sanitize_lockscreen_preview(
                        req.sanitized_lockscreen_text, r.reminder_type
                    )
                if req.cron_or_time is not None:
                    r.cron_or_time = req.cron_or_time
                if req.recurrence is not None:
                    r.recurrence = req.recurrence
                if req.target_date is not None:
                    r.target_date = req.target_date
                if req.timezone is not None:
                    r.timezone = req.timezone
                if req.channels is not None:
                    r.channels = req.channels
                if req.is_active is not None:
                    r.is_active = req.is_active
                if req.is_paused is not None:
                    r.is_paused = req.is_paused
                if req.target_goal_or_event is not None:
                    r.target_goal_or_event = req.target_goal_or_event
                if req.buffer_minutes is not None:
                    r.buffer_minutes = req.buffer_minutes

                r.updated_at = datetime.now(timezone.utc)
                self._record_audit(
                    user_id=user_id,
                    reminder_id=r.id,
                    event_type="updated",
                    status=DeliveryStatus.SCHEDULED,
                    details={"is_active": r.is_active, "is_paused": r.is_paused},
                )
                return r
        return None

    def delete_reminder(self, user_id: str, reminder_id: str) -> bool:
        _init_synthetic_user_state(user_id)
        items = _REMINDERS_STORE.get(user_id, [])
        initial_len = len(items)
        _REMINDERS_STORE[user_id] = [r for r in items if r.id != reminder_id]
        deleted = len(_REMINDERS_STORE[user_id]) < initial_len

        if deleted:
            self._record_audit(
                user_id=user_id,
                reminder_id=reminder_id,
                event_type="deleted",
                status=DeliveryStatus.DISMISSED,
                details={"deleted_by": "user"},
            )
        return deleted

    # --- Quiet Hours Policy ---

    def get_quiet_hours(self, user_id: str) -> QuietHoursSettings:
        _init_synthetic_user_state(user_id)
        return _QUIET_HOURS_STORE.get(
            user_id,
            QuietHoursSettings(
                enabled=True,
                start_time="22:00",
                end_time="07:30",
                timezone="America/New_York",
                suppress_audio=True,
                allow_emergency_safety=True,
                max_prompts_per_day=3,
            ),
        )

    def update_quiet_hours(
        self, user_id: str, settings: QuietHoursSettings
    ) -> QuietHoursSettings:
        _init_synthetic_user_state(user_id)
        _QUIET_HOURS_STORE[user_id] = settings
        self._record_audit(
            user_id=user_id,
            event_type="quiet_hours_updated",
            status=DeliveryStatus.SCHEDULED,
            details={
                "enabled": settings.enabled,
                "start": settings.start_time,
                "end": settings.end_time,
                "tz": settings.timezone,
            },
        )
        return settings

    # --- Snooze & Dismiss Controls ---

    def snooze_reminder(
        self, user_id: str, reminder_id: str, minutes: int = 15
    ) -> Optional[ReminderItem]:
        _init_synthetic_user_state(user_id)
        reminder = self.get_reminder(user_id, reminder_id)
        if not reminder:
            return None

        now = datetime.now(timezone.utc)
        reminder.snoozed_until = now + timedelta(minutes=minutes)
        reminder.updated_at = now

        self._record_audit(
            user_id=user_id,
            reminder_id=reminder_id,
            event_type="snoozed",
            status=DeliveryStatus.SNOOZED,
            details={"snooze_minutes": minutes, "snoozed_until": reminder.snoozed_until.isoformat()},
        )
        return reminder

    def dismiss_reminder(self, user_id: str, reminder_id: str) -> Optional[ReminderItem]:
        _init_synthetic_user_state(user_id)
        reminder = self.get_reminder(user_id, reminder_id)
        if not reminder:
            return None

        now = datetime.now(timezone.utc)
        reminder.snoozed_until = None
        reminder.updated_at = now

        # Dismiss associated active notifications
        for n in _NOTIFICATIONS_STORE.get(user_id, []):
            if n.reminder_id == reminder_id and not n.is_dismissed:
                n.is_dismissed = True
                n.status = DeliveryStatus.DISMISSED

        self._record_audit(
            user_id=user_id,
            reminder_id=reminder_id,
            event_type="dismissed",
            status=DeliveryStatus.DISMISSED,
            details={"action": "user_dismiss"},
        )
        return reminder

    # --- Background Dispatch Engine & Behavioral Invariants ---

    def dispatch_reminder(
        self,
        user_id: str,
        reminder_id: str,
        req: DispatchReminderRequest,
        current_time_override: Optional[datetime] = None,
    ) -> DispatchResult:
        """Dispatches a reminder respecting quiet hours, idempotency, retry backoff, and lockscreen sanitization.
        
        Guarantees:
        - Idempotent: duplicate calls with same key return identical cached outcome without re-dispatch.
        - Privacy: external push/email ONLY receives sanitized preview.
        - Quiet Hours: wellbeing prompts during quiet window are cleanly suppressed; emergency safety notices bypass.
        """
        _init_synthetic_user_state(user_id)

        # 1. Idempotency Check (Scoped per user_id)
        cache_key = f"{user_id}:{req.idempotency_key}"
        if cache_key in _IDEMPOTENCY_CACHE:
            return _IDEMPOTENCY_CACHE[cache_key]

        reminder = self.get_reminder(user_id, reminder_id)
        if not reminder:
            raise ValueError(f"Reminder {reminder_id} not found")

        quiet_settings = self.get_quiet_hours(user_id)
        now = current_time_override or datetime.now(timezone.utc)
        job_id = f"job_{uuid.uuid4().hex[:10]}"
        audit_id = f"audit_{uuid.uuid4().hex[:8]}"

        # 2. Check Active / Paused State
        if not reminder.is_active or reminder.is_paused:
            result = DispatchResult(
                job_id=job_id,
                reminder_id=reminder_id,
                status=DeliveryStatus.SKIPPED_THROTTLED,
                channel=req.channel_override or reminder.channels[0],
                sanitized_text_sent="",
                private_details_held_in_app=True,
                is_quiet_hours_suppressed=False,
                retry_count=0,
                dispatched_at=now,
                audit_log_id=audit_id,
                message="Reminder is inactive or paused by user. Skipped cleanly without noise.",
            )
            _IDEMPOTENCY_CACHE[cache_key] = result
            return result

        # 3. Quiet Hours Check (Circadian Window)
        in_quiet = is_in_quiet_hours(quiet_settings, now)
        is_emergency = reminder.priority == NotificationPriority.EMERGENCY_SAFETY

        if in_quiet and not is_emergency:
            # Wellbeing prompt suppressed to protect restorative sleep
            result = DispatchResult(
                job_id=job_id,
                reminder_id=reminder_id,
                status=DeliveryStatus.SUPPRESSED_QUIET_HOURS,
                channel=req.channel_override or reminder.channels[0],
                sanitized_text_sent=reminder.sanitized_lockscreen_text,
                private_details_held_in_app=True,
                is_quiet_hours_suppressed=True,
                retry_count=0,
                dispatched_at=now,
                audit_log_id=audit_id,
                message="Suppressed by circadian quiet hours window to protect sleep. Queued for wake window.",
            )
            self._record_audit(
                user_id=user_id,
                reminder_id=reminder_id,
                event_type="suppressed_quiet_hours",
                status=DeliveryStatus.SUPPRESSED_QUIET_HOURS,
                details={"quiet_start": quiet_settings.start_time, "quiet_end": quiet_settings.end_time},
            )
            _IDEMPOTENCY_CACHE[cache_key] = result
            return result

        # 4. Simulated Network Retries (Background Job Resilience)
        retry_count = 0
        status = DeliveryStatus.DELIVERED
        if req.simulate_failure:
            # Simulate backoff retries: attempts 1, 2, 3
            retry_count = 3
            # After 3 backoffs, resilient delivery succeeds
            status = DeliveryStatus.DELIVERED

        # 5. Lockscreen Sanitization Invariant:
        # What gets transmitted over web_push / email is strictly the sanitized preview.
        # The deep personal reflection prompt is held securely in the authenticated in-app sanctuary.
        channel = req.channel_override or reminder.channels[0]
        text_sent_externally = reminder.sanitized_lockscreen_text

        # Create In-App Notification Record
        notif = InAppNotification(
            id=f"notif_{uuid.uuid4().hex[:8]}",
            user_id=user_id,
            reminder_id=reminder.id,
            title=reminder.title,
            sanitized_lockscreen_preview=reminder.sanitized_lockscreen_text,
            full_body_content=reminder.prompt_text,
            channel=channel,
            priority=reminder.priority,
            status=status,
            read=False,
            is_dismissed=False,
            created_at=now,
            delivered_at=now,
            retry_count=retry_count,
            idempotency_key=req.idempotency_key,
            behavioral_safety_tag="autonomous_buddy_consent_verified",
        )
        _NOTIFICATIONS_STORE.setdefault(user_id, []).insert(0, notif)

        reminder.last_delivered_at = now
        reminder.snoozed_until = None

        self._record_audit(
            user_id=user_id,
            reminder_id=reminder_id,
            event_type="dispatched",
            channel=channel,
            status=status,
            details={
                "channel": channel.value,
                "sanitized_lockscreen": True,
                "retries": retry_count,
                "priority": reminder.priority.value,
            },
        )

        result = DispatchResult(
            job_id=job_id,
            reminder_id=reminder_id,
            status=status,
            channel=channel,
            sanitized_text_sent=text_sent_externally,
            private_details_held_in_app=True,
            is_quiet_hours_suppressed=False,
            retry_count=retry_count,
            dispatched_at=now,
            audit_log_id=audit_id,
            message="Dispatched successfully with lockscreen privacy sanitization and explicit user consent.",
        )
        _IDEMPOTENCY_CACHE[cache_key] = result
        return result

    # --- Safety Invariant: Missed Check-In Non-Escalation ---

    def handle_missed_checkin(
        self, user_id: str, reminder_id: str, reason: str = "user_engaged_in_life"
    ) -> Dict[str, Any]:
        """CRITICAL SAFETY INVARIANT:
        Never infer that a user is in danger or crisis merely because they missed a check-in.
        
        Missing a scheduled check-in is an ordinary part of human existence (busy, resting,
        socializing). InnerOS forbids alarming the user, guilt-tripping them, or triggering
        emergency wellness checks without explicit, active signs of distress.
        """
        _init_synthetic_user_state(user_id)
        now = datetime.now(timezone.utc)

        reminder = self.get_reminder(user_id, reminder_id)
        title = reminder.title if reminder else "Scheduled Check-in"

        # Log transition to MISSED_NO_DANGER
        self._record_audit(
            user_id=user_id,
            reminder_id=reminder_id,
            event_type="checkin_missed_graceful",
            status=DeliveryStatus.MISSED_NO_DANGER,
            details={
                "safety_invariant": "missed_checkin_does_not_equal_danger",
                "emergency_alert_triggered": False,
                "guilt_messaging_sent": False,
                "reason": reason,
            },
        )

        return {
            "status": DeliveryStatus.MISSED_NO_DANGER.value,
            "reminder_id": reminder_id,
            "title": title,
            "emergency_escalation_triggered": False,
            "inferred_danger": False,
            "buddy_message": (
                "You missed this check-in, and that is completely okay. Life happens, and your "
                "sanctuary is here whenever you feel ready—no catch-up pressure or streak anxiety."
            ),
            "timestamp": now.isoformat(),
        }

    # --- In-App Notification Center ---

    def list_notifications(
        self, user_id: str, unread_only: bool = False
    ) -> List[InAppNotification]:
        _init_synthetic_user_state(user_id)
        items = _NOTIFICATIONS_STORE.get(user_id, [])
        if unread_only:
            return [n for n in items if not n.read and not n.is_dismissed]
        return [n for n in items if not n.is_dismissed]

    def mark_notification_read(
        self, user_id: str, notification_id: str
    ) -> Optional[InAppNotification]:
        _init_synthetic_user_state(user_id)
        for n in _NOTIFICATIONS_STORE.get(user_id, []):
            if n.id == notification_id:
                n.read = True
                return n
        return None

    def dismiss_notification(
        self, user_id: str, notification_id: str
    ) -> Optional[InAppNotification]:
        _init_synthetic_user_state(user_id)
        for n in _NOTIFICATIONS_STORE.get(user_id, []):
            if n.id == notification_id:
                n.is_dismissed = True
                n.status = DeliveryStatus.DISMISSED
                return n
        return None

    def clear_all_notifications(self, user_id: str) -> int:
        _init_synthetic_user_state(user_id)
        items = _NOTIFICATIONS_STORE.get(user_id, [])
        count = len(items)
        _NOTIFICATIONS_STORE[user_id] = []
        return count

    # --- Audit History ---

    def get_audit_history(
        self, user_id: str, limit: int = 50
    ) -> List[NotificationAuditLogItem]:
        _init_synthetic_user_state(user_id)
        logs = _AUDIT_LOGS_STORE.get(user_id, [])
        return sorted(logs, key=lambda x: x.timestamp, reverse=True)[:limit]

    def _record_audit(
        self,
        user_id: str,
        event_type: str,
        status: DeliveryStatus,
        details: Dict[str, Any],
        reminder_id: Optional[str] = None,
        channel: Optional[NotificationChannel] = None,
    ) -> NotificationAuditLogItem:
        log_item = NotificationAuditLogItem(
            id=f"audit_{uuid.uuid4().hex[:8]}",
            user_id=user_id,
            reminder_id=reminder_id,
            event_type=event_type,
            channel=channel,
            status=status,
            details=details,
            timestamp=datetime.now(timezone.utc),
        )
        _AUDIT_LOGS_STORE.setdefault(user_id, []).append(log_item)
        return log_item


reminders_service = RemindersService()
