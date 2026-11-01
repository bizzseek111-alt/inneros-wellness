"use client";

import React, { useState } from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { KnowledgeLibrary } from "@/components/knowledge/KnowledgeLibrary";
import { KnowledgeAdminDashboard } from "@/components/knowledge/KnowledgeAdminDashboard";
import { Library, UserCheck, BookOpen } from "lucide-react";

export default function KnowledgePage() {
  const [viewMode, setViewMode] = useState<"library" | "admin">("library");

  return (
    <SanctuaryShell>
      <div className="max-w-6xl mx-auto space-y-6 pb-8">
        {/* Friendly Knowledge Header */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-[#285B55] text-[14px] font-medium">
              <Library className="w-4 h-4" />
              <span>Explore</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#263330]">
              Helpful Psychology & Wellbeing Guides
            </h1>
            <p className="text-[15px] text-[#52625E]">
              Practical, evidence-informed exercises and reflections for everyday stress, sleep, and emotional clarity.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-[#FAF8F4] p-1.5 rounded-2xl border border-[#E6E0D6] self-start sm:self-auto">
            <button
              onClick={() => setViewMode("library")}
              className={`px-4 py-2 rounded-xl text-[14px] font-medium transition-all flex items-center space-x-2 ${
                viewMode === "library"
                  ? "bg-[#285B55] text-white shadow-sm"
                  : "text-[#52625E] hover:text-[#263330]"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Guides & Exercises</span>
            </button>

            <button
              onClick={() => setViewMode("admin")}
              className={`px-4 py-2 rounded-xl text-[14px] font-medium transition-all flex items-center space-x-2 ${
                viewMode === "admin"
                  ? "bg-[#285B55] text-white shadow-sm"
                  : "text-[#52625E] hover:text-[#263330]"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Library Curation</span>
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
