"""Automated Test Suite for InnerOS Proactive Companion & Everyday Assistance Module.
Tests:
- Reminders CRUD, recurrence rules, and buffer minutes
- Behavioral ethics & non-guilt policy enforcement
- Lockscreen privacy sanitization (no sensitive psychological terms leaked)
- Circadian quiet hours timezone calculations and suppression
- Emergency safety bypass of quiet hours
- Idempotent background job dispatch and retry resilience
- Snooze and dismiss lifecycle
- Missed check-in safety invariant (missed != danger)
- In-app notification center and audit logs
"""

from datetime import datetime, timezone
from zoneinfo import ZoneInfo
from app.domains.reminders.schemas import (
    ReminderType,
    NotificationChannel,
    NotificationPriority,
    DeliveryStatus,
    QuietHoursSettings,
)
from app.domains.reminders.service import (
    is_in_quiet_hours,
    sanitize_lockscreen_preview,
    validate_buddy_message_ethics,
)


def test_reminders_list_and_seed(client):
    """Verifies synthetic user has initialized routines."""
    res = client.get("/api/v1/reminders")
    assert res.status_code == 200
    reminders = res.json()
    assert len(reminders) >= 4
    titles = [r["title"] for r in reminders]
    assert "Morning Breath & Grounding" in titles
    assert "Evening Sanctuary Reflection" in titles


def test_reminder_crud_with_buffer_and_recurrence(client):
    """Creates, reads, updates, and deletes an appointment buffer reminder."""
    create_res = client.post(
        "/api/v1/reminders",
        json={
            "title": "Therapy Decompression Buffer",
            "reminder_type": "appointment_prep",
            "prompt_text": "Sit in silence for 10 minutes and sip water after your session.",
            "cron_or_time": "2026-11-06 16:00",
            "recurrence": "once",
            "target_date": "2026-11-06",
            "buffer_minutes": 15,
            "target_goal_or_event": "Post-Therapy Integration",
        },
    )
    assert create_res.status_code == 201
    created = create_res.json()
    rem_id = created["id"]
    assert created["buffer_minutes"] == 15
    assert created["recurrence"] == "once"
    assert created["is_active"] is True

    # Update reminder
    up_res = client.put(
        f"/api/v1/reminders/{rem_id}",
        json={"is_paused": True, "buffer_minutes": 20},
    )
    assert up_res.status_code == 200
    updated = up_res.json()
    assert updated["is_paused"] is True
    assert updated["buffer_minutes"] == 20

    # Delete reminder
    del_res = client.delete(f"/api/v1/reminders/{rem_id}")
    assert del_res.status_code == 204


def test_behavioral_ethics_anti_guilt_rejection(client):
    """Enforces non-manipulative companion design: rejects streak anxiety or guilt trips."""
    guilt_res = client.post(
        "/api/v1/reminders",
        json={
            "title": "Don't break your streak!",
            "reminder_type": "habit_routine",
            "prompt_text": "You missed yesterday, where were you? Don't break your streak!",
            "cron_or_time": "18:00",
        },
    )
    assert guilt_res.status_code == 422
    err_detail = guilt_res.json()["detail"]
    assert "Behavioral Ethics Policy" in err_detail
    assert "break your streak" in err_detail


def test_lockscreen_privacy_sanitization(client):
    """Ensures sensitive psychological terms are scrubbed from external lockscreens."""
    res = client.post(
        "/api/v1/reminders",
        json={
            "title": "Panic Sensation Journal",
            "reminder_type": "mood_journaling",
            "prompt_text": "Reflect on the panic attack symptoms, trauma memory, and medication adjustment today.",
            "cron_or_time": "20:00",
        },
    )
    assert res.status_code == 201
    data = res.json()
    # Prompt text remains preserved for in-app sanctuary
    assert "panic attack" in data["prompt_text"]
    # Lockscreen text MUST be sanitized
    assert "panic" not in data["sanitized_lockscreen_text"].lower()
    assert "trauma" not in data["sanitized_lockscreen_text"].lower()
    assert "medication" not in data["sanitized_lockscreen_text"].lower()
    assert "Journal prompt" in data["sanitized_lockscreen_text"]


def test_circadian_quiet_hours_engine():
    """Validates timezone-aware quiet hours calculations."""
    settings = QuietHoursSettings(
        enabled=True,
        start_time="22:00",
        end_time="07:30",
        timezone="America/New_York",
        allow_emergency_safety=True,
    )
    tz = ZoneInfo("America/New_York")

    # 23:30 NY time -> in quiet hours
    dt_quiet_night = datetime(2026, 11, 1, 23, 30, tzinfo=tz)
    assert is_in_quiet_hours(settings, dt_quiet_night) is True

    # 06:15 NY time -> in quiet hours
    dt_quiet_morning = datetime(2026, 11, 2, 6, 15, tzinfo=tz)
    assert is_in_quiet_hours(settings, dt_quiet_morning) is True

    # 14:00 NY time -> outside quiet hours
    dt_awake_afternoon = datetime(2026, 11, 1, 14, 0, tzinfo=tz)
    assert is_in_quiet_hours(settings, dt_awake_afternoon) is False


def test_dispatch_during_quiet_hours_suppression(client):
    """Wellbeing prompts in quiet hours are suppressed; emergency safety notices bypass."""
    # Seed or get a reminder
    reminders = client.get("/api/v1/reminders").json()
    rem = reminders[0]

    # Create an emergency safety reminder
    emerg_res = client.post(
        "/api/v1/reminders",
        json={
            "title": "Crisis Contact Outreach Follow-up",
            "reminder_type": "mindful_checkin",
            "prompt_text": "Gentle check on whether you connected with your counselor or support contact.",
            "cron_or_time": "03:00",
            "priority": "emergency_safety",
        },
    )
    assert emerg_res.status_code == 201
    emerg_id = emerg_res.json()["id"]

    # Test dispatching normal reminder during quiet hours (e.g. at 23:30 local)
    tz = ZoneInfo("America/New_York")
    from app.domains.reminders.service import reminders_service
    from app.domains.reminders.schemas import DispatchReminderRequest

    night_time = datetime(2026, 11, 1, 23, 30, tzinfo=tz)

    wellbeing_dispatch = reminders_service.dispatch_reminder(
        user_id=rem["user_id"],
        reminder_id=rem["id"],
        req=DispatchReminderRequest(idempotency_key="quiet_test_wb_001"),
        current_time_override=night_time,
    )
    assert wellbeing_dispatch.status == DeliveryStatus.SUPPRESSED_QUIET_HOURS
    assert wellbeing_dispatch.is_quiet_hours_suppressed is True

    # Emergency safety notice bypasses quiet hours
    emergency_dispatch = reminders_service.dispatch_reminder(
        user_id=rem["user_id"],
        reminder_id=emerg_id,
        req=DispatchReminderRequest(idempotency_key="quiet_test_em_001"),
        current_time_override=night_time,
    )
    assert emergency_dispatch.status == DeliveryStatus.DELIVERED
    assert emergency_dispatch.is_quiet_hours_suppressed is False


def test_idempotent_background_dispatch(client):
    """Ensures identical idempotency keys return identical cached response without duplicates."""
    reminders = client.get("/api/v1/reminders").json()
    rem_id = reminders[0]["id"]
    idemp_key = f"idemp_{datetime.now(timezone.utc).timestamp()}"

    res1 = client.post(
        f"/api/v1/reminders/{rem_id}/dispatch",
        json={"idempotency_key": idemp_key},
    )
    assert res1.status_code == 200
    data1 = res1.json()

    # Second call with same idempotency key
    res2 = client.post(
        f"/api/v1/reminders/{rem_id}/dispatch",
        json={"idempotency_key": idemp_key},
    )
    assert res2.status_code == 200
    data2 = res2.json()

    assert data1["job_id"] == data2["job_id"]
    assert data1["audit_log_id"] == data2["audit_log_id"]


def test_snooze_and_dismiss_lifecycle(client):
    """Validates snooze (15m, 60m) and dismiss controls."""
    reminders = client.get("/api/v1/reminders").json()
    rem_id = reminders[0]["id"]

    # Snooze for 45 minutes
    snooze_res = client.post(
        f"/api/v1/reminders/{rem_id}/snooze",
        json={"minutes": 45},
    )
    assert snooze_res.status_code == 200
    snoozed = snooze_res.json()
    assert snoozed["snoozed_until"] is not None

    # Dismiss clears snooze
    dismiss_res = client.post(f"/api/v1/reminders/{rem_id}/dismiss")
    assert dismiss_res.status_code == 200
    dismissed = dismiss_res.json()
    assert dismissed["snoozed_until"] is None


def test_missed_checkin_safety_invariant(client):
    """CRITICAL SAFETY INVARIANT TEST:
    Missing a check-in must NEVER infer crisis or trigger false emergency alerts.
    """
    reminders = client.get("/api/v1/reminders").json()
    rem_id = reminders[0]["id"]

    res = client.post(
        f"/api/v1/reminders/{rem_id}/missed?reason=user_busy_with_family",
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "missed_no_danger"
    assert data["emergency_escalation_triggered"] is False
    assert data["inferred_danger"] is False
    assert "completely okay" in data["buddy_message"]
    assert "no catch-up pressure or streak anxiety" in data["buddy_message"]

    # Verify audit log recorded safety invariant
    logs_res = client.get("/api/v1/reminders/audit-logs")
    assert logs_res.status_code == 200
    logs = logs_res.json()
    missed_logs = [l for l in logs if l["event_type"] == "checkin_missed_graceful"]
    assert len(missed_logs) >= 1
    assert missed_logs[0]["details"]["safety_invariant"] == "missed_checkin_does_not_equal_danger"
    assert missed_logs[0]["details"]["emergency_alert_triggered"] is False


def test_notification_center_read_and_clear(client):
    """Tests in-app notification center list, mark-read, and dismissal."""
    notifs_res = client.get("/api/v1/reminders/notifications")
    assert notifs_res.status_code == 200
    notifs = notifs_res.json()
    assert len(notifs) >= 1

    first_id = notifs[0]["id"]
    read_res = client.post(f"/api/v1/reminders/notifications/{first_id}/read")
    assert read_res.status_code == 200
    assert read_res.json()["read"] is True

    # Dismiss single notification
    del_res = client.delete(f"/api/v1/reminders/notifications/{first_id}")
    assert del_res.status_code == 200
    assert del_res.json()["is_dismissed"] is True
