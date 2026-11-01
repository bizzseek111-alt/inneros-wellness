"use client";

import React, { useState } from "react";
import { X, Sparkles, Clock, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GentleReminderProps {
  title?: string;
  message?: string;
  timeContext?: string;
  onAcknowledge?: () => void;
  className?: string;
}

export const GentleReminderBanner: React.FC<GentleReminderProps> = ({
  title = "Circadian Pacing",
  message = "You have been in focused flow for 90 minutes. A brief 2-minute gaze into the distance restores visual accommodation and autonomic tone.",
  timeContext = "Midday Anchor",
  onAcknowledge,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onAcknowledge?.();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className={cn(
          "rounded-2xl p-4 bg-gradient-to-r from-midnight-850 via-midnight-800 to-indigo-950/40 border border-indigo-700/30 shadow-md relative overflow-hidden",
          className
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-800/40 text-indigo-300 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-ivory-100">{title}</span>
                <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.05] px-1.5 py-0.5 rounded flex items-center space-x-1">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{timeContext}</span>
                </span>
              </div>
              <p className="text-xs text-ivory-300/90 leading-relaxed max-w-xl">{message}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleDismiss}
              className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-ivory-200 border border-white/[0.08] transition-colors flex items-center space-x-1"
            >
              <Check className="w-3 h-3 text-teal-400" />
              <span>Acknowledge</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
