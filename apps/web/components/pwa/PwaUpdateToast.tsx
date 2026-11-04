"use client";

import React, { useState } from "react";
import { Sparkles, RefreshCw, X } from "lucide-react";
import { usePwa } from "./PwaContext";

export const PwaUpdateToast: React.FC = () => {
  const { updateAvailable, applyUpdate } = usePwa();
  const [dismissed, setDismissed] = useState(false);

  if (!updateAvailable || dismissed) {
    return null;
  }

  return (
    <aside aria-label="Application update" className="fixed bottom-4 right-4 z-50 max-w-sm w-[calc(100vw-2rem)] sm:w-auto">
      <div className="bg-white text-[#0F172A] p-4 rounded-3xl shadow-2xl border border-teal-200/80 flex items-start space-x-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
        <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0 pr-1">
          <h4 className="font-bold text-sm text-[#0F172A]">Weebly Update Ready</h4>
          <p className="text-xs text-[#64748B] mt-0.5">
            A new version is available with improved mindfulness tools and stability.
          </p>
          <div className="flex items-center space-x-2 mt-3">
            <button
              onClick={applyUpdate}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Update Now
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
            >
              Later
            </button>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          aria-label="Dismiss update notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
