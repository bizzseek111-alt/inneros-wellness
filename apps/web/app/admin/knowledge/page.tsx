"use client";

import React from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { KnowledgeAdminDashboard } from "@/components/knowledge/KnowledgeAdminDashboard";
import { ShieldCheck, UserCheck } from "lucide-react";

export default function AdminKnowledgePage() {
  return (
    <SanctuaryShell>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono uppercase tracking-widest">
              <UserCheck className="w-4 h-4" />
              <span>Reviewer Admin Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-normal text-ivory-100 tracking-tight">
              Psychology Knowledge Engine — Clinical & Academic Review
            </h1>
          </div>
        </div>

        <KnowledgeAdminDashboard />
      </div>
    </SanctuaryShell>
  );
}
