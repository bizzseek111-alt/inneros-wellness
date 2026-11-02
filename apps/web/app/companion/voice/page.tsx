"use client";

import React from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { RealtimeVoiceCompanion } from "@/components/voice/RealtimeVoiceCompanion";

export default function VoiceCompanionPage() {
  return (
    <SanctuaryShell>
      <div className="w-full pt-1 sm:pt-3">
        <RealtimeVoiceCompanion />
      </div>
    </SanctuaryShell>
  );
}
