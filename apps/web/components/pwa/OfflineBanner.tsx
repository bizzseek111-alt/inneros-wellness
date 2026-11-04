"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { WifiOff, CheckCircle2, ArrowRight } from "lucide-react";
import { usePwa } from "./PwaContext";

export const OfflineBanner: React.FC = () => {
  const { isOnline } = usePwa();
  const [wasOffline, setWasOffline] = useState(false);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
      setShowRestored(false);
    } else if (wasOffline) {
      setShowRestored(true);
      const timer = setTimeout(() => {
        setShowRestored(false);
        setWasOffline(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (!isOnline) {
    return (
      <aside aria-label="Network status" className="fixed top-2 inset-x-3 z-50 flex justify-center pointer-events-none">
        <div className="pointer-events-auto max-w-md w-full bg-slate-900/95 text-white backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700/60 flex items-center justify-between text-xs sm:text-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <div className="flex items-center space-x-1.5 font-medium">
              <WifiOff className="w-4 h-4 text-amber-300" />
              <span>Offline Mode Active</span>
            </div>
          </div>
          <Link
            href="/offline"
            className="inline-flex items-center space-x-1 text-teal-300 hover:text-teal-200 font-semibold underline underline-offset-2 ml-3"
          >
            <span>Open Offline Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>
    );
  }

  if (showRestored) {
    return (
      <aside aria-label="Network status" className="fixed top-2 inset-x-3 z-50 flex justify-center pointer-events-none">
        <div className="pointer-events-auto bg-emerald-900/90 text-white backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-emerald-700/60 flex items-center space-x-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>Connection Restored — Live Services Ready</span>
        </div>
      </aside>
    );
  }

  return null;
};
