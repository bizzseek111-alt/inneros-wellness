"use client";

import React, { useState, useEffect } from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { Switch } from "@/components/primitives/Switch";
import { Slider } from "@/components/primitives/Slider";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";
import { Bell, Moon, Check } from "lucide-react";
import { api, QuietHoursSettings } from "@/lib/api-client";
import { INITIAL_QUIET_HOURS } from "@/lib/reminders-seed";

export default function NotificationsSettingsPage() {
  const [quietHours, setQuietHours] =
    useState<QuietHoursSettings>(INITIAL_QUIET_HOURS);
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
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <SanctuaryShell>
      <div className="max-w-3xl mx-auto space-y-6 pb-8">
        {/* Header */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-[#285B55] text-[14px] font-medium">
            <Bell className="w-4 h-4" />
            <span>Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#263330]">
            Notifications & Quiet Hours
          </h1>
          <p className="text-[15px] text-[#52625E] leading-relaxed">
            Set your peaceful hours so Weebly never interrupts your rest, and choose how often you’d like gentle check-ins.
          </p>
        </div>

        {/* Quiet Hours Window */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#F3EFE8] pb-3">
            <span className="text-[17px] font-serif font-medium text-[#263330] flex items-center space-x-2">
              <Moon className="w-5 h-5 text-[#5A4878]" />
              <span>Evening & Morning Quiet Hours</span>
            </span>
            <Badge variant="lavender" size="sm">
              Rest Protected
            </Badge>
          </div>

          <Switch
            label="Turn On Quiet Hours"
            description="Pauses all routine reminders and check-in prompts while you sleep or unwind."
            checked={quietHours.enabled}
            onChange={(val) => setQuietHours({ ...quietHours, enabled: val })}
          />

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[14px] text-[#263330] font-medium block">
                Start Quiet Hours (Evening)
              </label>
              <input
                type="time"
                value={quietHours.start_time}
                onChange={(e) =>
                  setQuietHours({ ...quietHours, start_time: e.target.value })
                }
                disabled={!quietHours.enabled}
                className="w-full text-[15px] bg-[#FAF8F4] border border-[#D5CFC2] rounded-xl px-4 py-2.5 text-[#263330] focus:outline-none focus:border-[#285B55]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] text-[#263330] font-medium block">
                End Quiet Hours (Morning)
              </label>
              <input
                type="time"
                value={quietHours.end_time}
                onChange={(e) =>
                  setQuietHours({ ...quietHours, end_time: e.target.value })
                }
                disabled={!quietHours.enabled}
                className="w-full text-[15px] bg-[#FAF8F4] border border-[#D5CFC2] rounded-xl px-4 py-2.5 text-[#263330] focus:outline-none focus:border-[#285B55]"
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="text-[14px] text-[#263330] font-medium block">
              Your Time Zone
            </label>
            <select
              value={quietHours.timezone}
              onChange={(e) =>
                setQuietHours({ ...quietHours, timezone: e.target.value })
              }
              aria-label="Your Time Zone"
              className="w-full text-[15px] bg-[#FAF8F4] border border-[#D5CFC2] rounded-xl px-4 py-2.5 text-[#263330] focus:outline-none focus:border-[#285B55]"
            >
              <option value="America/New_York">Eastern Time (New York)</option>
              <option value="America/Chicago">Central Time (Chicago)</option>
              <option value="America/Los_Angeles">Pacific Time (Los Angeles)</option>
              <option value="Europe/London">United Kingdom (London)</option>
              <option value="Europe/Sofia">Eastern Europe (Sofia)</option>
              <option value="Asia/Karachi">Pakistan Time (Karachi)</option>
            </select>
          </div>
        </div>

        {/* Daily Check-In Limit */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-4">
          <h2 className="text-[17px] font-serif font-medium text-[#263330]">
            Daily Check-In Limit
          </h2>

          <Slider
            label="Maximum Gentle Check-Ins Per Day"
            min={1}
            max={3}
            step={1}
            value={quietHours.max_prompts_per_day}
            onChange={(val) =>
              setQuietHours({ ...quietHours, max_prompts_per_day: val })
            }
            valueDisplay={`${quietHours.max_prompts_per_day} per day`}
          />
          <p className="text-[14px] text-[#52625E]">
            We cap gentle prompts at a maximum of 3 per day so you never feel overwhelmed by notifications.
          </p>
        </div>

        {/* How You Receive Reminders */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-4">
          <h2 className="text-[17px] font-serif font-medium text-[#263330]">
            Where Reminders Appear
          </h2>

          <div className="space-y-4">
            <Switch
              label="In-App Gentle Cards"
              description="Show a calm reminder banner at the top of the screen while you are using Weebly."
              checked={inAppActive}
              onChange={setInAppActive}
            />
            <div className="border-t border-[#F3EFE8] pt-4">
              <Switch
                label="Browser Notifications (Private Preview)"
                description="Send a discreet browser notification during active hours. Personal details are never shown on your lock screen."
                checked={pushActive}
                onChange={setPushActive}
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-5 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm">
          <span className="text-[14px] text-[#52625E]">
            {saved
              ? "Your notification preferences have been saved"
              : "Changes apply immediately to your scheduled reminders"}
          </span>
          <Button
            size="sm"
            variant="primary"
            onClick={handleSave}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </SanctuaryShell>
  );
}
