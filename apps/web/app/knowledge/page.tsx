"use client";

import React, { useState } from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { KnowledgeLibrary } from "@/components/knowledge/KnowledgeLibrary";
import { KnowledgeAdminDashboard } from "@/components/knowledge/KnowledgeAdminDashboard";
import { Badge } from "@/components/primitives/Badge";
import { Library, ShieldCheck, UserCheck, BookOpen } from "lucide-react";

export default function KnowledgePage() {
  const [viewMode, setViewMode] = useState<"library" | "admin">("library");

  return (
    <SanctuaryShell>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Knowledge Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.08] pb-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-mono uppercase tracking-widest">
              <Library className="w-4 h-4" />
              <span>Evidence-Based Psychology Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-normal text-ivory-100 tracking-tight">
              Psychology Knowledge & Provenance Engine
            </h1>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-midnight-950 p-1 rounded-2xl border border-white/10 self-start sm:self-auto">
            <button
              onClick={() => setViewMode("library")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center space-x-1.5 ${
                viewMode === "library"
                  ? "bg-teal-900/60 border border-teal-500/50 text-teal-200 shadow-sm"
                  : "text-ivory-300/60 hover:text-ivory-100"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Evidence Sanctuary</span>
            </button>

            <button
              onClick={() => setViewMode("admin")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center space-x-1.5 ${
                viewMode === "admin"
                  ? "bg-indigo-900/60 border border-indigo-500/50 text-indigo-200 shadow-sm"
                  : "text-ivory-300/60 hover:text-ivory-100"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Reviewer Admin</span>
            </button>
          </div>
        </div>

        {/* View Switch */}
        {viewMode === "library" ? (
          <KnowledgeLibrary />
        ) : (
          <KnowledgeAdminDashboard />
        )}
      </div>
    </SanctuaryShell>
  );
}
