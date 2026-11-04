"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Download, Share2, PlusSquare, X, Check, Sparkles, Smartphone, Monitor } from "lucide-react";
import { usePwa } from "./PwaContext";

export const InstallPromptModal: React.FC = () => {
  const { canInstall, isIos, isStandalone, promptInstall, dismissInstall, isInstallDismissed } = usePwa();
  const [isOpen, setIsOpen] = useState(false);
  const [isChildSession, setIsChildSession] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if in child session or child routes
    const isChildRoute = pathname?.startsWith("/youth") || pathname?.startsWith("/kids");
    const activeChildId = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("inneros_active_child_id") : null;
    setIsChildSession(Boolean(isChildRoute || activeChildId));
  }, [pathname]);

  // Never nag or disrupt children, standalone users, or users who dismissed the prompt
  if (isStandalone || isInstallDismissed || isChildSession) {
    return null;
  }

  // Trigger banner only if install is available or on iOS Safari
  const shouldOffer = canInstall || isIos;
  if (!shouldOffer) {
    return null;
  }

  const handleInstallClick = async () => {
    if (canInstall) {
      const accepted = await promptInstall();
      if (!accepted) {
        dismissInstall();
      }
    } else if (isIos) {
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* Floating Non-Intrusive Banner in corner */}
      <aside aria-label="Install application" className="fixed bottom-4 left-4 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-auto">
        <div className="bg-white/95 text-[#0F172A] backdrop-blur-md p-4 rounded-3xl shadow-xl border border-teal-200 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#0F172A]">Install Weebly</h4>
              <p className="text-[11px] text-[#64748B]">Faster offline access & fullscreen</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              Install
            </button>
            <button
              onClick={dismissInstall}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              aria-label="Dismiss installation prompt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* iOS & Desktop Step-by-Step Guidance Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-base text-[#0F172A]">Install on Your Device</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isIos ? (
              <div className="space-y-4 text-xs sm:text-sm text-[#334155]">
                <p className="text-slate-600">
                  To install Weebly on your iPhone or iPad for offline use:
                </p>
                <div className="space-y-3 bg-[#F8FAFC] p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-bold">
                      1
                    </div>
                    <span>
                      Tap the <strong className="text-teal-700 inline-flex items-center gap-1">Share <Share2 className="w-3.5 h-3.5 inline" /></strong> button in Safari toolbar.
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-bold">
                      2
                    </div>
                    <span>
                      Scroll down and tap <strong className="text-teal-700 inline-flex items-center gap-1">Add to Home Screen <PlusSquare className="w-3.5 h-3.5 inline" /></strong>.
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-bold">
                      3
                    </div>
                    <span>
                      Tap <strong>Add</strong> in the top right corner.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs sm:text-sm text-[#334155]">
                <p className="text-slate-600">
                  On Chrome or Edge, click the <strong>Install</strong> icon on the right side of the URL address bar or use the browser menu.
                </p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">Offline tools included</span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  dismissInstall();
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
