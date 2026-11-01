"use client";

import React from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { LifeGraphVisualizer } from "@/components/memory/LifeGraphVisualizer";

export default function MemoryLifeGraphPage() {
  return (
    <SanctuaryShell>
      <div className="max-w-6xl mx-auto space-y-6">
        <LifeGraphVisualizer />
      </div>
    </SanctuaryShell>
  );
}
