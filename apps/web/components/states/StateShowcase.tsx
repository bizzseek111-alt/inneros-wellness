"use client";

import React, { useState } from "react";
import { Sparkles, RefreshCw, AlertCircle, CheckCircle2, Feather, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/primitives/Button";

export type StateView = "empty" | "loading" | "error" | "success";

interface StateShowcaseProps {
  className?: string;
}

export const StateShowcase: React.FC<StateShowcaseProps> = ({ className }) => {
  const [activeState, setActiveState] = useState<StateView>("empty");

  return (
    <div className={cn("space-y-4", className)}>
      {/* State Switcher Tabs */}
      <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-midnight-900/90 border border-white/[0.08] w-fit">
        {(["empty", "loading", "error", "success"] as StateView[]).map((st) => (
          <button
            key={st}
            onClick={() => setActiveState(st)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all select-none",
              activeState === st
                ? "bg-teal-950/80 text-teal-200 border border-teal-700/60 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
            )}
          >
            {st} State
          </button>
        ))}
      </div>

      {/* State Content Canvas */}
      <div className="rounded-2xl p-8 bg-midnight-800/80 border border-white/[0.08] min-h-[260px] flex items-center justify-center">
        {/* 1. Empty State */}
        {activeState === "empty" && (
          <div className="text-center max-w-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-midnight-900 border border-white/[0.08] flex items-center justify-center mx-auto text-teal-400">
              <Feather className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-ivory-100 font-sans-ui">
              Clean Sanctuary Slate
            </h4>
            <p className="text-xs text-ivory-400 leading-relaxed">
              No reflective journal records have been stored yet. Your thoughts remain entirely your own until you choose to capture them.
            </p>
            <div className="pt-2">
              <Button size="sm" variant="calm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Record First Reflection
              </Button>
            </div>
          </div>
        )}

        {/* 2. Loading State */}
        {activeState === "loading" && (
          <div className="w-full max-w-md space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/[0.05] animate-pulse" />
              <div className="space-y-1.5 flex-1">
                <div className="w-32 h-3.5 bg-white/[0.06] rounded-md animate-pulse" />
                <div className="w-20 h-2.5 bg-white/[0.04] rounded-md animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-3 bg-white/[0.05] rounded-md animate-pulse" />
              <div className="w-5/6 h-3 bg-white/[0.05] rounded-md animate-pulse" />
              <div className="w-3/4 h-3 bg-white/[0.04] rounded-md animate-pulse" />
            </div>
            <div className="flex items-center justify-center text-xs text-lavender-300/70 space-x-2 pt-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Attuning to your emotional rhythm...</span>
            </div>
          </div>
        )}

        {/* 3. Error State */}
        {activeState === "error" && (
          <div className="text-center max-w-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/40 border border-rose-800/40 flex items-center justify-center mx-auto text-rose-300">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-ivory-100 font-sans-ui">
              Connection Momentarily Paused
            </h4>
            <p className="text-xs text-ivory-400 leading-relaxed">
              We were unable to reach the neural synthesis engine. Your existing thoughts remain secure in local encrypted storage.
            </p>
            <div className="pt-2">
              <Button size="sm" variant="outline" leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
                Reconnect to Sanctuary
              </Button>
            </div>
          </div>
        )}

        {/* 4. Success State */}
        {activeState === "success" && (
          <div className="text-center max-w-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-950/70 border border-teal-700/50 flex items-center justify-center mx-auto text-teal-300 shadow-[0_0_20px_rgba(52,134,128,0.25)]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-ivory-100 font-sans-ui">
              Resonance Anchored
            </h4>
            <p className="text-xs text-ivory-400 leading-relaxed">
              Your evening reflection has been encrypted with your personal key and woven into your private life graph.
            </p>
            <div className="pt-2">
              <Button size="sm" variant="primary">
                Continue Evening Routine
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
