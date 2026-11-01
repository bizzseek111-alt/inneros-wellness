"""Reminders Domain API Router.
Endpoints for user mindful check-in reminders, proactive buddy assistance,
circadian quiet hours policy, snooze/dismiss actions, and in-app notification center.
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.domains.reminders.schemas import (
    ReminderItem,
    ReminderCreateRequest,
    ReminderUpdateRequest,
    QuietHoursSettings,
    InAppNotification,
    SnoozeRequest,
    DispatchReminderRequest,
    DispatchResult,
    NotificationAuditLogItem,
)
from app.domains.reminders.service import reminders_service
from app.core.security import get_current_user, UserContext

router = APIRouter(prefix="/reminders", tags=["Reminders & Habits"])


# --- Reminders CRUD ---

@router.get("", response_model=List[ReminderItem])
async def list_reminders(user: UserContext = Depends(get_current_user)):
    """Returns active and scheduled reminders for the authenticated user."""
    return reminders_service.list_reminders(user.user_id)


@router.post("", response_model=ReminderItem, status_code=status.HTTP_201_CREATED)
async def create_reminder(
    req: ReminderCreateRequest,
    user: UserContext = Depends(get_current_user),
):
    """Creates a new mindful reminder or routine checkpoint."""
    try:
        return reminders_service.create_reminder(user.user_id, req)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        )


@router.get("/quiet-hours", response_model=QuietHoursSettings)
async def get_quiet_hours(user: UserContext = Depends(get_current_user)):
    """Returns the user's circadian quiet hours policy and sleep protection settings."""
    return reminders_service.get_quiet_hours(user.user_id)


@router.put("/quiet-hours", response_model=QuietHoursSettings)
async def update_quiet_hours(
    settings: QuietHoursSettings,
    user: UserContext = Depends(get_current_user),
):
    """Updates circadian quiet hours window and daily frequency limits."""
    return reminders_service.update_quiet_hours(user.user_id, settings)


@router.get("/notifications", response_model=List[InAppNotification])
async def list_notifications(
    unread_only: bool = Query(False, description="Filter for unread notifications only"),
    user: UserContext = Depends(get_current_user),
):
    """Returns items in the user's in-app notification center."""
    return reminders_service.list_notifications(user.user_id, unread_only=unread_only)


@router.post("/notifications/{notification_id}/read", response_model=InAppNotification)
async def mark_notification_read(
    notification_id: str,
    user: UserContext = Depends(get_current_user),
):
    """Marks a notification as read in the in-app notification center."""
    notif = reminders_service.mark_notification_read(user.user_id, notification_id)
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return notif


@router.delete("/notifications/{notification_id}", response_model=InAppNotification)
async def dismiss_notification(
    notification_id: str,
    user: UserContext = Depends(get_current_user),
):
    """Dismisses a notification from the center."""
    notif = reminders_service.dismiss_notification(user.user_id, notification_id)
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return notif


@router.delete("/notifications", response_model=Dict[str, int])
async def clear_all_notifications(user: UserContext = Depends(get_current_user)):
    """Clears all notifications from the user's in-app notification center."""
    cleared = reminders_service.clear_all_notifications(user.user_id)
    return {"cleared_count": cleared}


@router.get("/audit-logs", response_model=List[NotificationAuditLogItem])
async def get_audit_logs(
    limit: int = Query(50, ge=1, le=200),
    user: UserContext = Depends(get_current_user),
):
    """Returns immutable audit logs of notification delivery, quiet hours suppression, and dismissals."""
    return reminders_service.get_audit_history(user.user_id, limit=limit)


@router.get("/push-subscriptions", response_model=List[Dict[str, Any]])
async def list_push_subscriptions(user: UserContext = Depends(get_current_user)):
    """Returns registered Web Push (VAPID) subscriptions for the authenticated user."""
    from app.core.dispatcher import notification_dispatcher
    subs = notification_dispatcher.list_push_subscriptions(user.user_id)
    return [s.model_dump(mode="json") for s in subs]


@router.post("/push-subscriptions", status_code=status.HTTP_201_CREATED)
async def register_push_subscription(
    payload: Dict[str, Any],
    user: UserContext = Depends(get_current_user),
):
    """Registers a browser Web Push subscription endpoint and keys for external reminder delivery."""
    from app.core.dispatcher import notification_dispatcher
    from app.config import settings
    endpoint = str(payload.get("endpoint") or "https://fcm.googleapis.com/fcm/send/inneros-browser-sub")
    keys = payload.get("keys") or {}
    p256dh = str(keys.get("p256dh") or payload.get("p256dh_key") or "BEl62iUYgUivxIkv69yViEuiBIa")
    auth = str(keys.get("auth") or payload.get("auth_key") or "auth_secret_token")
    sub = notification_dispatcher.register_push_subscription(
        user_id=user.user_id,
        endpoint=endpoint,
        p256dh_key=p256dh,
        auth_key=auth,
        user_agent=payload.get("user_agent"),
    )
    return {
        "subscription": sub.model_dump(mode="json"),
        "vapid_public_key": settings.VAPID_PUBLIC_KEY,
    }


@router.get("/outbox", response_model=List[Dict[str, Any]])
async def get_notification_outbox(
    limit: int = Query(50, ge=1, le=200),
    user: UserContext = Depends(get_current_user),
):
    """Returns the relational notification outbox (Email SMTP/Resend & Web Push VAPID deliveries) for the user."""
    from app.core.dispatcher import notification_dispatcher
    records = notification_dispatcher.list_outbox(user_id=user.user_id, limit=limit)
    return [r.model_dump(mode="json") for r in records]


@router.get("/{reminder_id}", response_model=ReminderItem)
async def get_reminder(
    reminder_id: str,
    user: UserContext = Depends(get_current_user),
):
    """Retrieves a single reminder schedule."""
    reminder = reminders_service.get_reminder(user.user_id, reminder_id)
    if not reminder:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reminder not found")
    return reminder


@router.put("/{reminder_id}", response_model=ReminderItem)
async def update_reminder(
    reminder_id: str,
    req: ReminderUpdateRequest,
    user: UserContext = Depends(get_current_user),
):
    """Updates an existing reminder schedule."""
    try:
        updated = reminders_service.update_reminder(user.user_id, reminder_id, req)
        if not updated:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reminder not found")
        return updated
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))


@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reminder(
    reminder_id: str,
    user: UserContext = Depends(get_current_user),
):
    """Deletes a reminder schedule."""
    deleted = reminders_service.delete_reminder(user.user_id, reminder_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reminder not found")
    return None


# --- Snooze, Dismiss, Dispatch & Behavioral Invariants ---

@router.post("/{reminder_id}/snooze", response_model=ReminderItem)
async def snooze_reminder(
    reminder_id: str,
    req: SnoozeRequest,
    user: UserContext = Depends(get_current_user),
):
    """Snoozes a reminder for a specified interval (default 15 minutes)."""
    item = reminders_service.snooze_reminder(user.user_id, reminder_id, minutes=req.minutes)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reminder not found")
    return item


@router.post("/{reminder_id}/dismiss", response_model=ReminderItem)
async def dismiss_reminder(
    reminder_id: str,
    user: UserContext = Depends(get_current_user),
):
    """Dismisses a current reminder alert."""
    item = reminders_service.dismiss_reminder(user.user_id, reminder_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reminder not found")
    return item


@router.post("/{reminder_id}/dispatch", response_model=DispatchResult)
async def dispatch_reminder(
    reminder_id: str,
    req: DispatchReminderRequest,
    user: UserContext = Depends(get_current_user),
):
    """Background dispatch job endpoint with idempotency, quiet hours check, and privacy sanitization."""
    try:
        return reminders_service.dispatch_reminder(user.user_id, reminder_id, req)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("/{reminder_id}/missed", response_model=Dict[str, Any])
async def handle_missed_checkin(
    reminder_id: str,
    reason: Optional[str] = Query("user_engaged_in_life"),
    user: UserContext = Depends(get_current_user),
):
    """Safety Invariant Endpoint:
    Gracefully handles missed check-in without false alarms or inferring crisis.
    """
    return reminders_service.handle_missed_checkin(user.user_id, reminder_id, reason=reason)
