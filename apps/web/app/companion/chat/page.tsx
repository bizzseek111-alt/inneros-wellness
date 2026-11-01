"use client";

import React, { useState } from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { CompanionInterface } from "@/components/companion/CompanionInterface";
import { EmergencyModal } from "@/components/safety/EmergencyModal";

export default function TextCompanionPage() {
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [crisisMsg, setCrisisMsg] = useState<string | undefined>();

  const handleTriggerEmergency = (msg?: string) => {
    setCrisisMsg(msg);
    setIsEmergencyOpen(true);
  };

  return (
    <SanctuaryShell>
      <div className="max-w-4xl mx-auto">
        <CompanionInterface onTriggerEmergencyModal={handleTriggerEmergency} />

        <EmergencyModal
          isOpen={isEmergencyOpen}
          onClose={() => setIsEmergencyOpen(false)}
          customMessage={crisisMsg}
        />
      </div>
    </SanctuaryShell>
  );
}
