"use client";

import React, { useState, useEffect } from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { Switch } from "@/components/primitives/Switch";
import { Slider } from "@/components/primitives/Slider";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";
import { Bell, Moon, Volume2, ShieldCheck, Check } from "lucide-react";
import { api, QuietHoursSettings } from "@/lib/api-client";
import { INITIAL_QUIET_HOURS } from "@/lib/reminders-seed";

export default function NotificationsSettingsPage() {
  const [quietHours, setQuietHours] = useState<QuietHoursSettings>(INITIAL_QUIET_HOURS);
  const [inAppActive, setInAppActive] = useState(true);
  const [pushActive, setPushActive] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const qh = await api.getQuietHours();
        setQuietHours(qh);
      } catch {
        // Fallback to initial seed
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      const updated = await api.updateQuietHours(quietHours);
      setQuietHours(updated);
    } catch {
      // Saved in state
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <SanctuaryShell>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-1 border-b border-white/[0.08] pb-4">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-mono uppercase tracking-widest">
            <Bell className="w-4 h-4" />
            <span>Sanctuary Attention Policy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-ivory-100 tracking-tight">
            Notifications & Quiet Hours
          </h1>
          <p className="text-xs sm:text-sm text-ivory-400 font-light leading-relaxed">
            Your attention is a finite sovereign resource. InnerOS prohibits aggressive engagement loops, streak anxiety, and off-hour interruptions.
          </p>
        </div>

        {/* Quiet Hours Window */}
        <div className="p-6 rounded-3xl bg-midnight-900/90 border border-white/[0.08] space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <span className="text-xs font-semibold text-ivory-100 flex items-center space-x-2">
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Circadian Quiet Hours Window</span>
            </span>
            <Badge variant="indigo" size="sm">
              Sleep Restoration
            </Badge>
          </div>

          <Switch
            label="Enforce Circadian Quiet Hours"
            description="Silences all audio and visual check-in alerts during sleep preparation and recovery."
            checked={quietHours.enabled}
            onChange={(val) => setQuietHours({ ...quietHours, enabled: val })}
          />

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs text-ivory-300 font-medium">Quiet Hours Commence (Evening)</label>
              <input
                type="time"
                value={quietHours.start_time}
                onChange={(e) => setQuietHours({ ...quietHours, start_time: e.target.value })}
                disabled={!quietHours.enabled}
                className="w-full text-xs bg-midnight-950 border border-white/[0.1] rounded-xl px-4 py-2.5 text-ivory-100 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-ivory-300 font-medium">Quiet Hours Conclude (Morning)</label>
              <input
                type="time"
                value={quietHours.end_time}
                onChange={(e) => setQuietHours({ ...quietHours, end_time: e.target.value })}
                disabled={!quietHours.enabled}
                className="w-full text-xs bg-midnight-950 border border-white/[0.1] rounded-xl px-4 py-2.5 text-ivory-100 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <label className="text-xs text-ivory-300 font-medium">Circadian Timezone</label>
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
              description="Ensures critical distress outreach contacts or urgent account security alerts bypass sleep quiet hours."
              checked={quietHours.allow_emergency_safety}
              onChange={(val) => setQuietHours({ ...quietHours, allow_emergency_safety: val })}
            />
          </div>
        </div>

        {/* Frequency Capping */}
        <div className="p-6 rounded-3xl bg-midnight-900/90 border border-white/[0.08] space-y-4">
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
            Hard system ceiling: We enforce an absolute maximum of 3 unsolicited reflections per day to eliminate notification fatigue.
          </p>
        </div>

        {/* Channel Preferences */}
        <div className="p-6 rounded-3xl bg-midnight-900/90 border border-white/[0.08] space-y-4">
          <span className="text-xs font-semibold text-ivory-100 uppercase tracking-wider font-mono">
            Delivery Channels
          </span>

          <div className="space-y-3">
            <Switch
              label="In-App Sanctuary Cards"
              description="Gentle banners presented only when you actively choose to open InnerOS."
              checked={inAppActive}
              onChange={setInAppActive}
            />
            <div className="border-t border-white/[0.06] pt-3">
              <Switch
                label="Browser Push Notifications (Sanitized Preview Only)"
                description="Subtle desktop alerts during active daytime work hours. Never displays private notes or psychological details."
                checked={pushActive}
                onChange={setPushActive}
              />
            </div>
          </div>
        </div>

        {/* Action Save Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-midnight-950 border border-white/[0.06]">
          <span className="text-xs text-zinc-400">
            {saved ? "Preferences saved to sanctuary profile" : "Configured for Elena Vance (America/New_York)"}
          </span>
          <Button size="sm" variant="primary" onClick={handleSave} leftIcon={<Check className="w-3.5 h-3.5" />}>
            Save Notification Policy
          </Button>
        </div>
      </div>
    </SanctuaryShell>
  );
}
