"use client";

import React from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { KnowledgeAdminDashboard } from "@/components/knowledge/KnowledgeAdminDashboard";
import { UserCheck } from "lucide-react";

export default function AdminKnowledgePage() {
  return (
    <SanctuaryShell>
      <div className="max-w-6xl mx-auto space-y-6 pb-8">
        <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-[#285B55] text-[14px] font-medium">
            <UserCheck className="w-4 h-4" />
            <span>Reviewer Governance Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#263330] tracking-tight">
            Psychology Knowledge Library — Editorial & Academic Review
          </h1>
          <p className="text-[15px] text-[#52625E] leading-relaxed">
            Inspect peer-reviewed psychology records, evidence quality tiers, non-clinical disclaimers, and annual review status.
          </p>
        </div>

        <KnowledgeAdminDashboard />
      </div>
    </SanctuaryShell>
  );
}
