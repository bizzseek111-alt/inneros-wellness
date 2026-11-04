"use client";

import React from "react";
import { PwaProvider } from "./PwaContext";
import { OfflineBanner } from "./OfflineBanner";
import { PwaUpdateToast } from "./PwaUpdateToast";
import { InstallPromptModal } from "./InstallPromptModal";

export const PwaClientRegistrar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PwaProvider>
      <OfflineBanner />
      {children}
      <PwaUpdateToast />
      <InstallPromptModal />
    </PwaProvider>
  );
};
