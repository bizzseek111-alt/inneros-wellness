"use client";

import React from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { PersonalContextHub } from "@/components/integrations/PersonalContextHub";

export default function IntegrationsPage() {
  return (
    <SanctuaryShell>
      <div className="max-w-5xl mx-auto py-2">
        <PersonalContextHub />
      </div>
    </SanctuaryShell>
  );
}
