"use client";

import React from "react";
import { ChildNavigationShell } from "./ChildNavigationShell";

export interface YouthShellProps {
  children: React.ReactNode;
  activeScreen?: string;
  title?: string;
  subtitle?: string;
}

/**
 * Weebly V9 Unified Child Shell:
 * Delegates all child and teen routes to ChildNavigationShell so that every
 * child-facing screen uses the clean 3-tab bottom bar (Home, Talk, Play),
 * spoken instructions button, language quick-switch, and math-gated Parental Lock.
 */
export const YouthShell: React.FC<YouthShellProps> = ({
  children,
  activeScreen,
  title,
  subtitle,
}) => {
  const activeTab =
    activeScreen === "voice" || activeScreen === "chat"
      ? "talk"
      : activeScreen === "dashboard"
      ? "home"
      : "play";

  return (
    <ChildNavigationShell activeTab={activeTab}>
      {(title || subtitle) && (
        <div className="mb-6 pb-4 border-b border-amber-100">
          {title && (
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </ChildNavigationShell>
  );
};
