"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { YouthProvider } from "@/components/youth/YouthContext";
import { ChildNavigationShell } from "@/components/youth/ChildNavigationShell";
import { CreativeStudioCanvas } from "@/components/youth/CreativeStudioCanvas";

export default function CreativeStudioStandalonePage() {
  return (
    <YouthProvider>
      <ChildNavigationShell activeTab="play">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Link
              href="/youth/play"
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
              <span>Back to Play Worlds</span>
            </Link>
          </div>
          <CreativeStudioCanvas initialActivity="draw-dinosaur" />
        </div>
      </ChildNavigationShell>
    </YouthProvider>
  );
}
