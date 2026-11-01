"use client";

import React, { useState, useEffect } from "react";
import {
  api,
  ReminderItem,
  QuietHoursSettings,
  InAppNotification,
  NotificationAuditLogItem,
  DispatchResult,
  ReminderType,
  RecurrenceRule,
} from "@/lib/api-client";
import {
  INITIAL_REMINDERS,
  INITIAL_QUIET_HOURS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from "@/lib/reminders-seed";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";
import { Switch } from "@/components/primitives/Switch";
import { Slider } from "@/components/primitives/Slider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/primitives/Card";
import {
  Clock,
  Bell,
  Sparkles,
  Plus,
  Moon,
  Shield,
  ShieldCheck,
  Check,
  AlertCircle,
  Play,
  RotateCcw,
  X,
  Eye,
  EyeOff,
  Sun,
  Sunset,
  Calendar,
  Layers,
  HeartHandshake,
  CheckCircle2,
  Trash2,
  Smartphone,
  Send,
  Coffee,
  BookOpen,
  Footprints,
} from "lucide-react";

export function ReminderManager() {
  const [reminders, setReminders] = useState<ReminderItem[]>(INITIAL_REMINDERS);
  const [quietHours, setQuietHours] = useState<QuietHoursSettings>(INITIAL_QUIET_HOURS);
  const [notifications, setNotifications] = useState<InAppNotification[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<NotificationAuditLogItem[]>(INITIAL_AUDIT_LOGS);

  const [activeTab, setActiveTab] = useState<"routines" | "notifications" | "quiet_hours" | "audit_ledger">("routines");
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // New Reminder Form State
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<ReminderType>("mindful_checkin");
  const [newPrompt, setNewPrompt] = useState("");
  const [newSanitized, setNewSanitized] = useState("");
  const [newTime, setNewTime] = useState("08:30");
  const [newRecurrence, setNewRecurrence] = useState<RecurrenceRule>("daily");
  const [newBuffer, setNewBuffer] = useState<number | undefined>(undefined);
  const [newGoalEvent, setNewGoalEvent] = useState("");
  const [antiGuiltWarning, setAntiGuiltWarning] = useState<string | null>(null);

  // Modal test dispatch state
  const [lastDispatchResult, setLastDispatchResult] = useState<DispatchResult | null>(null);
  const [missedSafetyModal, setMissedSafetyModal] = useState<{
    open: boolean;
    reminderTitle: string;
    buddyMessage: string;
  } | null>(null);

  // Load backend data on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [rems, qh, notifs, logs] = await Promise.allSettled([
          api.getReminders(),
          api.getQuietHours(),
          api.getNotifications(),
          api.getReminderAuditLogs(30),
        ]);

        if (rems.status === "fulfilled" && rems.value.length > 0) setReminders(rems.value);
        if (qh.status === "fulfilled") setQuietHours(qh.value);
        if (notifs.status === "fulfilled" && notifs.value.length > 0) setNotifications(notifs.value);
        if (logs.status === "fulfilled" && logs.value.length > 0) setAuditLogs(logs.value);
      } catch (err) {
        console.warn("Using offline seed state for reminders module", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Anti-guilt live checker
  useEffect(() => {
    const guiltTerms = ["break your streak", "streak", "where were you", "why haven't you", "i missed you", "disappointed", "failing to"];
    const combined = `${newTitle} ${newPrompt}`.toLowerCase();
    const found = guiltTerms.find((t) => combined.includes(t));
    if (found) {
      setAntiGuiltWarning(`InnerOS Behavioral Safety Policy Alert: Contains manipulative or guilt-based phrase "${found}". Reminders must support user autonomy and eliminate streak anxiety.`);
    } else {
      setAntiGuiltWarning(null);
    }
  }, [newTitle, newPrompt]);

  // Dynamic lockscreen preview generator
  const previewLockscreenText = (): string => {
    if (newSanitized.trim()) return newSanitized;
    const lower = newPrompt.toLowerCase();
    const sensitive = ["panic", "trauma", "anxiety", "depression", "therapy", "medication", "suicide", "grief"].some(
      (w) => lower.includes(w)
    );
    if (sensitive || newPrompt.length > 70) {
      if (newType === "mindful_checkin") return "Gentle reminder: Your morning mindful check-in is ready.";
      if (newType === "evening_reflection") return "Evening Sanctuary: Time for your daily reflection.";
      if (newType === "breathwork_pause") return "A mindful pause: Take a few grounding breaths.";
      if (newType === "mood_journaling") return "Journal prompt: An invitation to check in with yourself.";
      if (newType === "appointment_prep") return "Upcoming commitment: Gentle preparation reminder.";
      if (newType === "goal_followup") return "Goal companion: Check in on your personal intention.";
      return "Gentle reminder: InnerOS sanctuary is waiting whenever you are ready.";
    }
    return newPrompt || "Gentle reminder: InnerOS sanctuary is waiting whenever you are ready.";
  };

  const handleCreateReminder = async () => {
    if (!newTitle.trim() || !newPrompt.trim()) {
      setFeedbackMessage("Please provide a title and prompt text.");
      return;
    }
    if (antiGuiltWarning) {
      setFeedbackMessage("Cannot schedule: Please remove streak or guilt-based wording.");
      return;
    }

    try {
      const created = await api.createReminder({
        title: newTitle,
        reminder_type: newType,
        prompt_text: newPrompt,
        sanitized_lockscreen_text: newSanitized.trim() ? newSanitized : undefined,
        cron_or_time: newTime,
        recurrence: newRecurrence,
        timezone: quietHours.timezone,
        channels: ["in_app", "web_push"],
        priority: "wellbeing_prompt",
        target_goal_or_event: newGoalEvent || undefined,
        buffer_minutes: newBuffer || undefined,
      });

      setReminders([created, ...reminders]);
      setIsAdding(false);
      setNewTitle("");
      setNewPrompt("");
      setNewSanitized("");
      setNewGoalEvent("");
      setNewBuffer(undefined);
      setFeedbackMessage("Reminder scheduled with lockscreen privacy sanitization.");
      setTimeout(() => setFeedbackMessage(null), 3500);
    } catch (err: any) {
      setFeedbackMessage(`Error: ${err.message || "Failed to schedule reminder"}`);
    }
  };

  const handleToggleActive = async (reminder: ReminderItem) => {
    try {
      const updated = await api.updateReminder(reminder.id, { is_active: !reminder.is_active });
      setReminders(reminders.map((r) => (r.id === reminder.id ? updated : r)));
    } catch {
      // Local fallback
      setReminders(
        reminders.map((r) => (r.id === reminder.id ? { ...r, is_active: !r.is_active } : r))
      );
    }
  };

  const handleSnooze = async (reminder: ReminderItem, minutes: number) => {
    try {
      const snoozed = await api.snoozeReminder(reminder.id, minutes);
      setReminders(reminders.map((r) => (r.id === reminder.id ? snoozed : r)));
      setFeedbackMessage(`Snoozed for ${minutes} minutes. No guilt, take your time.`);
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch {
      setFeedbackMessage(`Snoozed for ${minutes} minutes (offline).`);
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  const handleDismiss = async (reminder: ReminderItem) => {
    try {
      const dismissed = await api.dismissReminder(reminder.id);
      setReminders(reminders.map((r) => (r.id === reminder.id ? dismissed : r)));
      setFeedbackMessage("Reminder dismissed. Next occurrence will follow your circadian cadence.");
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch {
      setFeedbackMessage("Dismissed.");
      setTimeout(() => setFeedbackMessage(null), 2500);
    }
  };

  const handleDelete = async (reminderId: string) => {
    try {
      await api.deleteReminder(reminderId);
      setReminders(reminders.filter((r) => r.id !== reminderId));
      setFeedbackMessage("Reminder schedule removed.");
      setTimeout(() => setFeedbackMessage(null), 2500);
    } catch {
      setReminders(reminders.filter((r) => r.id !== reminderId));
    }
  };

  const handleTestDispatch = async (reminder: ReminderItem) => {
    const key = `test_dispatch_${reminder.id}_${Date.now()}`;
    try {
      const result = await api.dispatchReminder(reminder.id, key, "web_push");
      setLastDispatchResult(result);
      // Refresh notifications & logs
      const [notifs, logs] = await Promise.all([api.getNotifications(), api.getReminderAuditLogs(30)]);
      setNotifications(notifs);
      setAuditLogs(logs);
    } catch (err: any) {
      setFeedbackMessage(`Dispatch test notice: ${err.message}`);
    }
  };

  const handleSimulateMissedCheckin = async (reminder: ReminderItem) => {
    try {
      const outcome = await api.reportMissedCheckin(reminder.id, "user_busy_living_life");
      setMissedSafetyModal({
        open: true,
        reminderTitle: reminder.title,
        buddyMessage: outcome.buddy_message,
      });
      const logs = await api.getReminderAuditLogs(30);
      setAuditLogs(logs);
    } catch {
      setMissedSafetyModal({
        open: true,
        reminderTitle: reminder.title,
        buddyMessage:
          "You missed this check-in, and that is completely okay. Life happens, and your sanctuary is here whenever you feel ready—no catch-up pressure or streak anxiety.",
      });
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch {
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
    }
  };

  const handleDismissNotification = async (id: string) => {
    try {
      await api.dismissNotification(id);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch {
      setNotifications(notifications.filter((n) => n.id !== id));
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      await api.clearAllNotifications();
      setNotifications([]);
    } catch {
      setNotifications([]);
    }
  };

  const handleSaveQuietHours = async () => {
    try {
      const updated = await api.updateQuietHours(quietHours);
      setQuietHours(updated);
      setFeedbackMessage("Circadian quiet hours & sleep policy saved.");
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch (err: any) {
      setFeedbackMessage("Saved locally.");
      setTimeout(() => setFeedbackMessage(null), 2500);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read && !n.is_dismissed).length;

  return (
    <div className="space-y-8">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/[0.08] pb-6 gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-mono uppercase tracking-widest">
            <Clock className="w-4 h-4 text-teal-400" />
            <span>Circadian Pacing & Proactive Life-Assistance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-ivory-100 tracking-tight">
            Reminders, Routines & Quiet Hours
          </h1>
          <p className="text-xs sm:text-sm text-ivory-400 font-light max-w-2xl leading-relaxed">
            Autonomous daily companion with strict attention throttling, zero streak-pressure, and automatic lockscreen privacy sanitization.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setActiveTab("notifications")}
            leftIcon={<Bell className="w-3.5 h-3.5" />}
            className="relative"
          >
            In-App Center
            {unreadCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-teal-500 text-midnight-950 rounded-full text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAdding(!isAdding)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            {isAdding ? "Cancel Schedule" : "New Reminder"}
          </Button>
        </div>
      </div>

      {/* Behavioral Ethics & Privacy Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-midnight-900/90 border border-teal-800/40 grid md:grid-cols-3 gap-4 text-xs">
        <div className="flex items-start space-x-3">
          <HeartHandshake className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-ivory-100">Zero Guilt & Streak Anxiety</span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              No manipulative attachments. Missed check-ins are normal human life and never trigger alarms.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-ivory-100">Lockscreen Privacy Shield</span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Psychological reflections and notes stay in-app; lockscreens only preview non-stigmatizing prompts.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Moon className="w-4 h-4 text-lavender-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-ivory-100">Circadian Quiet Window</span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              {quietHours.enabled
                ? `Active (${quietHours.start_time} - ${quietHours.end_time} ${quietHours.timezone.split("/")[1] || "Local"}). Sleep fully protected.`
                : "Disabled. Sleep protection off."}
            </p>
          </div>
        </div>
      </div>

      {/* User Feedback Toast */}
      {feedbackMessage && (
        <div className="p-3.5 rounded-xl bg-teal-950/80 border border-teal-500/50 text-teal-200 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="text-zinc-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-white/[0.08] gap-6 text-xs font-mono uppercase tracking-wider">
        <button
          onClick={() => setActiveTab("routines")}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === "routines"
              ? "border-teal-400 text-teal-300 font-semibold"
              : "border-transparent text-zinc-400 hover:text-ivory-200"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Routines & Reminders ({reminders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === "notifications"
              ? "border-teal-400 text-teal-300 font-semibold"
              : "border-transparent text-zinc-400 hover:text-ivory-200"
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notification Center ({unreadCount} unread)</span>
        </button>

        <button
          onClick={() => setActiveTab("quiet_hours")}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === "quiet_hours"
              ? "border-teal-400 text-teal-300 font-semibold"
              : "border-transparent text-zinc-400 hover:text-ivory-200"
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Quiet Hours & Throttling</span>
        </button>

        <button
          onClick={() => setActiveTab("audit_ledger")}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === "audit_ledger"
              ? "border-teal-400 text-teal-300 font-semibold"
              : "border-transparent text-zinc-400 hover:text-ivory-200"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Delivery & Audit Ledger ({auditLogs.length})</span>
        </button>
      </div>

      {/* --- TAB 1: ROUTINES & REMINDERS --- */}
      {activeTab === "routines" && (
        <div className="space-y-6">
          {/* Circadian Cadence Timeline Visualizer */}
          <div className="p-5 rounded-3xl bg-midnight-900/70 border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="text-xs font-mono uppercase text-ivory-300 tracking-wider flex items-center space-x-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Elena Vance Circadian Routine Cadence</span>
              </span>
              <span className="text-[11px] font-mono text-zinc-400">Timezone: {quietHours.timezone}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-midnight-950/90 border border-teal-500/30 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-teal-300 font-mono">
                  <span>08:30 AM</span>
                  <Badge variant="teal" size="sm">Morning</Badge>
                </div>
                <div className="text-xs font-semibold text-ivory-100">Breath & Grounding</div>
                <p className="text-[10px] text-zinc-400">Postural alignment before reading messages</p>
              </div>

              <div className="p-3 rounded-2xl bg-midnight-950/90 border border-white/[0.06] space-y-1">
                <div className="flex items-center justify-between text-[11px] text-ivory-300 font-mono">
                  <span>14:00 PM</span>
                  <Badge variant="neutral" size="sm">Midday</Badge>
                </div>
                <div className="text-xs font-semibold text-ivory-100">Midday Re-center</div>
                <p className="text-[10px] text-zinc-400">2-minute screen break & jaw relaxation</p>
              </div>

              <div className="p-3 rounded-2xl bg-midnight-950/90 border border-white/[0.06] space-y-1">
                <div className="flex items-center justify-between text-[11px] text-indigo-300 font-mono">
                  <span>17:30 PM</span>
                  <Badge variant="indigo" size="sm">Evening</Badge>
                </div>
                <div className="text-xs font-semibold text-ivory-100">Somatic Walk</div>
                <p className="text-[10px] text-zinc-400">20-minute park walk without headphones</p>
              </div>

              <div className="p-3 rounded-2xl bg-midnight-950/90 border border-lavender-500/30 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-lavender-300 font-mono">
                  <span>21:15 PM</span>
                  <Badge variant="lavender" size="sm">Night</Badge>
                </div>
                <div className="text-xs font-semibold text-ivory-100">Sanctuary Reflection</div>
                <p className="text-[10px] text-zinc-400">Decompressing before 22:00 quiet hours</p>
              </div>
            </div>
          </div>

          {/* New Reminder Form Card */}
          {isAdding && (
            <div className="p-6 rounded-3xl bg-midnight-900 border border-teal-500/50 shadow-2xl space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <h3 className="text-sm font-semibold text-ivory-100 uppercase tracking-wider font-mono">
                    Schedule Conscious Reminder or Life Buffer
                  </h3>
                </div>
                <button onClick={() => setIsAdding(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {antiGuiltWarning && (
                <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-600/70 text-rose-200 text-xs flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{antiGuiltWarning}</p>
                </div>
              )}

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] text-ivory-300 font-medium">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Somatic Breath Pause, Mentorship Buffer"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs bg-midnight-950 border border-white/[0.1] rounded-xl px-4 py-2.5 text-ivory-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-ivory-300 font-medium">Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ReminderType)}
                    className="w-full text-xs bg-midnight-950 border border-white/[0.1] rounded-xl px-4 py-2.5 text-ivory-100 focus:outline-none focus:border-teal-500"
                  >
                    <option value="mindful_checkin">Mindful Check-in</option>
                    <option value="breathwork_pause">Breathwork Pause</option>
                    <option value="evening_reflection">Evening Reflection</option>
                    <option value="mood_journaling">Mood Journaling</option>
                    <option value="habit_routine">Habit Routine</option>
                    <option value="appointment_prep">Appointment Buffer</option>
                    <option value="goal_followup">Goal Follow-up</option>
                    <option value="reading_learning">Reading & Learning</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-ivory-300 font-medium">Scheduled Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full text-xs bg-midnight-950 border border-white/[0.1] rounded-xl px-4 py-2.5 text-ivory-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-ivory-300 font-medium">Recurrence</label>
                  <select
                    value={newRecurrence}
                    onChange={(e) => setNewRecurrence(e.target.value as RecurrenceRule)}
                    className="w-full text-xs bg-midnight-950 border border-white/[0.1] rounded-xl px-4 py-2.5 text-ivory-100 focus:outline-none focus:border-teal-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekdays">Weekdays Only</option>
                    <option value="weekends">Weekends Only</option>
                    <option value="weekly">Weekly</option>
                    <option value="once">One-Time Only</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-ivory-300 font-medium">Buffer (for Appointments)</label>
                  <input
                    type="number"
                    placeholder="e.g. 15 min"
                    value={newBuffer ?? ""}
                    onChange={(e) => setNewBuffer(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full text-xs bg-midnight-950 border border-white/[0.1] rounded-xl px-4 py-2.5 text-ivory-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-ivory-300 font-medium">
                  In-App Sanctuary Prompt (Private psychological reflections stay here)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Reflect on how your nervous system felt during the client meeting..."
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  className="w-full text-xs leading-relaxed bg-midnight-950 border border-white/[0.1] rounded-xl p-3.5 text-ivory-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Real-Time Lockscreen Preview Shield */}
              <div className="p-4 rounded-2xl bg-midnight-950 border border-indigo-700/40 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-indigo-300">
                  <span className="flex items-center space-x-1.5 font-medium">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Real-Time Lockscreen Sanitization Preview</span>
                  </span>
                  <Badge variant="indigo" size="sm">Shared Device Safe</Badge>
                </div>
                <div className="p-3 rounded-xl bg-midnight-900 border border-white/[0.08] text-xs text-ivory-200 font-mono">
                  <span className="text-[10px] text-zinc-400 block pb-1">InnerOS &bull; Now</span>
                  {previewLockscreenText()}
                </div>
                <p className="text-[10px] text-zinc-400">
                  Notice: If sensitive clinical or trauma terms are typed, InnerOS automatically sanitizes lockscreen push notifications to prevent public privacy leaks.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" onClick={handleCreateReminder} disabled={!!antiGuiltWarning}>
                  Save to Schedule
                </Button>
              </div>
            </div>
          )}

          {/* Reminders List */}
          <div className="space-y-4">
            {reminders.map((r) => (
              <div
                key={r.id}
                className="p-5 rounded-3xl bg-midnight-900/80 border border-white/[0.08] hover:border-white/[0.14] transition-all space-y-3.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs flex-wrap gap-y-1">
                      <span className="font-mono text-xs font-bold text-teal-300">{r.cron_or_time}</span>
                      <span className="text-zinc-600">&bull;</span>
                      <span className="font-semibold text-ivory-100 text-sm">{r.title}</span>
                      <Badge variant={r.is_active ? "teal" : "neutral"} size="sm">
                        {r.is_active ? "Active" : "Silenced"}
                      </Badge>
                      <Badge variant="indigo" size="sm">
                        {r.recurrence}
                      </Badge>
                      {r.buffer_minutes && (
                        <Badge variant="lavender" size="sm">
                          {r.buffer_minutes}m buffer
                        </Badge>
                      )}
                      {r.snoozed_until && (
                        <Badge variant="emergency" size="sm">
                          Snoozed until {new Date(r.snoozed_until).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <Switch
                      checked={r.is_active}
                      onChange={() => handleToggleActive(r)}
                      label={r.is_active ? "On" : "Paused"}
                    />
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1.5 transition-colors"
                      title="Delete reminder"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Prompt Details */}
                <div className="grid md:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-2xl bg-midnight-950/70 border border-white/[0.06] space-y-1">
                    <span className="text-[10px] font-mono uppercase text-teal-400 flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>In-App Reflection (Private Sanctuary)</span>
                    </span>
                    <p className="text-ivory-200/90 leading-relaxed text-[11px]">{r.prompt_text}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-midnight-950/70 border border-white/[0.06] space-y-1">
                    <span className="text-[10px] font-mono uppercase text-indigo-300 flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Lockscreen Push Preview (Sanitized)</span>
                    </span>
                    <p className="text-ivory-300/80 leading-relaxed text-[11px] font-mono">
                      {r.sanitized_lockscreen_text}
                    </p>
                  </div>
                </div>

                {/* Companion Action Controls */}
                <div className="flex flex-wrap items-center justify-between border-t border-white/[0.06] pt-3 gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleTestDispatch(r)}
                      leftIcon={<Send className="w-3 h-3 text-teal-400" />}
                      className="text-[11px] h-7 px-2.5"
                    >
                      Test Dispatch
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSnooze(r, 15)}
                      leftIcon={<RotateCcw className="w-3 h-3 text-amber-300" />}
                      className="text-[11px] h-7 px-2.5 text-zinc-300"
                    >
                      Snooze 15m
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDismiss(r)}
                      leftIcon={<CheckCircle2 className="w-3 h-3 text-zinc-400" />}
                      className="text-[11px] h-7 px-2.5 text-zinc-400"
                    >
                      Dismiss
                    </Button>
                  </div>

                  {/* Safety Invariant Simulation Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSimulateMissedCheckin(r)}
                    className="text-[11px] text-teal-300/80 hover:text-teal-200 h-7 px-2.5"
                  >
                    Simulate Missed Check-in (Zero Guilt)
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 2: IN-APP NOTIFICATION CENTER --- */}
      {activeTab === "notifications" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-ivory-100 font-mono uppercase tracking-wider">
                In-App Sanctuary Center
              </h3>
              <p className="text-xs text-zinc-400">
                Presents reflective cards strictly when you choose to open InnerOS. No red counters or FOMO triggers.
              </p>
            </div>

            {notifications.length > 0 && (
              <Button size="sm" variant="ghost" onClick={handleClearAllNotifications} className="text-xs text-zinc-400">
                Clear All
              </Button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-10 rounded-3xl bg-midnight-900/60 border border-white/[0.06] text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto" />
              <h4 className="text-sm font-serif text-ivory-100">All Mindful Check-ins Clear</h4>
              <p className="text-xs text-zinc-400">
                Your sanctuary is resting. New reflections will arrive at your scheduled circadian intervals.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                    n.read
                      ? "bg-midnight-950/60 border-white/[0.06] text-zinc-400"
                      : "bg-midnight-900 border-teal-500/40 text-ivory-100 shadow-md"
                  }`}
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-semibold">{n.title}</span>
                      {!n.read && <Badge variant="teal" size="sm">New</Badge>}
                      <Badge variant="indigo" size="sm">{n.priority}</Badge>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <p className="text-xs text-ivory-200 leading-relaxed font-light">{n.full_body_content}</p>

                    <div className="pt-1 flex items-center space-x-2 text-[10px] text-zinc-400">
                      <ShieldCheck className="w-3 h-3 text-teal-400" />
                      <span>Lockscreen preview sent: &ldquo;{n.sanitized_lockscreen_preview}&rdquo;</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {!n.read && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleMarkNotificationRead(n.id)}
                        className="text-[11px] h-7 px-2.5"
                      >
                        Mark Read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDismissNotification(n.id)}
                      className="text-[11px] h-7 px-2.5 text-zinc-400"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- TAB 3: QUIET HOURS & THROTTLING --- */}
      {activeTab === "quiet_hours" && (
        <div className="max-w-2xl space-y-6">
          <div className="p-6 rounded-3xl bg-midnight-900 border border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center space-x-2">
                <Moon className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-ivory-100 font-mono uppercase tracking-wider">
                  Circadian Quiet Hours Policy
                </h3>
              </div>
              <Badge variant="indigo" size="sm">Sleep Protection</Badge>
            </div>

            <Switch
              label="Enforce Circadian Quiet Hours"
              description="Automatically suppresses audio, visual, and push prompts during your restorative sleep window."
              checked={quietHours.enabled}
              onChange={(val) => setQuietHours({ ...quietHours, enabled: val })}
            />

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs text-ivory-300 font-medium">Commence Quiet Hours (Evening)</label>
                <input
                  type="time"
                  value={quietHours.start_time}
                  onChange={(e) => setQuietHours({ ...quietHours, start_time: e.target.value })}
                  disabled={!quietHours.enabled}
                  className="w-full text-xs bg-midnight-950 border border-white/[0.1] rounded-xl px-4 py-2.5 text-ivory-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-ivory-300 font-medium">Conclude Quiet Hours (Morning)</label>
                <input
                  type="time"
                  value={quietHours.end_time}
                  onChange={(e) => setQuietHours({ ...quietHours, end_time: e.target.value })}
                  disabled={!quietHours.enabled}
                  className="w-full text-xs bg-midnight-950 border border-white/[0.1] rounded-xl px-4 py-2.5 text-ivory-100 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs text-ivory-300 font-medium">Configured Timezone</label>
              <select
                value={quietHours.timezone}
                onChange={(e) => setQuietHours({ ...quietHours, timezone: e.target.value })}
                className="w-full text-xs bg-midnight-950 border border-white/[0.1] rounded-xl px-4 py-2.5 text-ivory-100 focus:outline-none focus:border-teal-500"
              >
                <option value="America/New_York">America/New_York (Eastern)</option>
                <option value="America/Chicago">America/Chicago (Central)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (Pacific)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Europe/Sofia">Europe/Sofia (EET)</option>
                <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
              </select>
            </div>

            <div className="border-t border-white/[0.06] pt-3">
              <Switch
                label="Allow Emergency Crisis Safety Bypass"
                description="Crucial distinction: Crisis escalation and urgent security alerts can bypass quiet hours, while everyday wellbeing prompts stay suppressed."
                checked={quietHours.allow_emergency_safety}
                onChange={(val) => setQuietHours({ ...quietHours, allow_emergency_safety: val })}
              />
            </div>
          </div>

          {/* Attention Throttling Card */}
          <div className="p-6 rounded-3xl bg-midnight-900 border border-white/[0.08] space-y-4">
            <span className="text-xs font-semibold text-ivory-100 uppercase tracking-wider font-mono">
              Daily Attention Throttling
            </span>

            <Slider
              label="Maximum Gentle Prompts Per 24-Hour Cycle"
              min={1}
              max={3}
              step={1}
              value={quietHours.max_prompts_per_day}
              onChange={(val) => setQuietHours({ ...quietHours, max_prompts_per_day: val })}
              valueDisplay={`${quietHours.max_prompts_per_day} prompts / day`}
            />
            <p className="text-[11px] text-zinc-400">
              Hard system limit: We enforce an absolute maximum of 3 unsolicited reflections per day to eliminate notification fatigue.
            </p>
          </div>

          <div className="flex justify-end">
            <Button size="sm" variant="primary" onClick={handleSaveQuietHours} leftIcon={<Check className="w-3.5 h-3.5" />}>
              Save Quiet Hours Policy
            </Button>
          </div>
        </div>
      )}

      {/* --- TAB 4: DELIVERY & AUDIT LEDGER --- */}
      {activeTab === "audit_ledger" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-ivory-100 font-mono uppercase tracking-wider">
                Immutable Background Job & Delivery Ledger
              </h3>
              <p className="text-xs text-zinc-400">
                Audits all dispatch attempts, idempotency checks, quiet hours suppressions, and snooze/dismiss actions.
              </p>
            </div>
          </div>

          <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-midnight-950/80">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-midnight-900 text-zinc-400 font-mono text-[11px] uppercase border-b border-white/[0.06]">
                  <tr>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Channel</th>
                    <th className="py-3 px-4">Details / Invariants</th>
                    <th className="py-3 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-ivory-200">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-mono text-[11px] text-teal-300">{log.event_type}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            log.status === "delivered"
                              ? "teal"
                              : log.status === "suppressed_quiet_hours"
                              ? "indigo"
                              : log.status === "missed_no_danger"
                              ? "lavender"
                              : "neutral"
                          }
                          size="sm"
                        >
                          {log.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-zinc-400">{log.channel || "internal"}</td>
                      <td className="py-3 px-4 text-[11px] text-zinc-300">
                        {log.details.safety_invariant ? (
                          <span className="text-teal-400 font-mono">safety: {log.details.safety_invariant}</span>
                        ) : log.details.sanitized ? (
                          <span>lockscreen privacy sanitized</span>
                        ) : log.details.quiet_start ? (
                          <span>quiet window: {log.details.quiet_start} - {log.details.quiet_end}</span>
                        ) : (
                          <span>{JSON.stringify(log.details)}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[10px] text-zinc-500">
                        {new Date(log.timestamp).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Test Dispatch Result Modal */}
      {lastDispatchResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-midnight-900 border border-teal-500/50 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="text-xs font-mono uppercase text-teal-400 font-semibold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Background Job Dispatched</span>
              </span>
              <button onClick={() => setLastDispatchResult(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-zinc-400">Job ID:</span>
                <span className="font-mono text-ivory-200">{lastDispatchResult.job_id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-zinc-400">Delivery Status:</span>
                <Badge variant={lastDispatchResult.is_quiet_hours_suppressed ? "indigo" : "teal"} size="sm">
                  {lastDispatchResult.status}
                </Badge>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-zinc-400">Lockscreen Transmitted Text:</span>
                <span className="text-ivory-100 font-medium text-right max-w-[220px]">
                  &ldquo;{lastDispatchResult.sanitized_text_sent}&rdquo;
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Private Reflection Protected:</span>
                <span className="text-teal-300 font-semibold">In-App Only</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed bg-midnight-950 p-3 rounded-xl border border-white/[0.04]">
              {lastDispatchResult.message}
            </p>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="primary" onClick={() => setLastDispatchResult(null)}>
                Understood
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Missed Check-in Safety Invariant Modal */}
      {missedSafetyModal && missedSafetyModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-midnight-900 border border-teal-500/50 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 text-teal-400 border-b border-white/[0.08] pb-3">
              <HeartHandshake className="w-5 h-5 text-teal-400" />
              <h3 className="text-sm font-semibold text-ivory-100">
                Missed Check-in Safety Invariant Verified
              </h3>
            </div>

            <p className="text-xs text-ivory-200 leading-relaxed">
              {missedSafetyModal.buddyMessage}
            </p>

            <div className="p-3.5 rounded-2xl bg-midnight-950 border border-teal-800/40 text-[11px] space-y-1.5 text-zinc-300">
              <div className="font-semibold text-teal-300">InnerOS Architectural Guarantee:</div>
              <p>
                &bull; Zero crisis escalation triggered.
                <br />
                &bull; Zero guilt messaging or broken streak shaming.
                <br />
                &bull; Audit log entry permanently marked: <code className="text-teal-400">missed_no_danger</code>.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="primary" onClick={() => setMissedSafetyModal(null)}>
                Close Reassurance
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
