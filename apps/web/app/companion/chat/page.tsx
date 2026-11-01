"use client";

import React, { useState } from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { CompanionInterface } from "@/components/companion/CompanionInterface";
import { EmergencyModal } from "@/components/safety/EmergencyModal";
import { Badge } from "@/components/primitives/Badge";
import { MessageSquare, ShieldCheck, Database, Lock } from "lucide-react";

export default function TextCompanionPage() {
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [crisisMsg, setCrisisMsg] = useState<string | undefined>();

  const handleTriggerEmergency = (msg?: string) => {
    setCrisisMsg(msg);
    setIsEmergencyOpen(true);
  };

  return (
    <SanctuaryShell>
      <div className="max-w-4xl mx-auto space-y-4 flex flex-col h-[calc(100vh-140px)]">
        {/* Header Strip */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 shrink-0">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-teal-400" />
            <h1 className="text-lg font-serif font-semibold text-ivory-100">
              Text Sanctuary Dialogue
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="teal" size="sm">
              <span className="flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Encrypted Working Memory</span>
              </span>
            </Badge>
          </div>
        </div>

        {/* Companion Interactive Canvas */}
        <div className="flex-1 flex flex-col min-h-0 bg-midnight-900/60 border border-white/[0.08] rounded-3xl p-4 sm:p-6 overflow-hidden">
          <CompanionInterface onTriggerEmergencyModal={handleTriggerEmergency} />
        </div>

        {/* Emergency Modal */}
        <EmergencyModal
          isOpen={isEmergencyOpen}
          onClose={() => setIsEmergencyOpen(false)}
          customMessage={crisisMsg}
        />
      </div>
    </SanctuaryShell>
  );
}
