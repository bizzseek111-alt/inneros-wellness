"use client";

import React from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { ReminderManager } from "@/components/reminders/ReminderManager";

export default function RemindersPage() {
  return (
    <SanctuaryShell>
      <div className="max-w-5xl mx-auto py-2">
        <ReminderManager />
      </div>
    </SanctuaryShell>
  );
}
