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
  title = "Gentle Pause",
  message = "Take a slow breath and let your shoulders soften. You don't have to carry everything at once.",
  timeContext = "Today's check-in",
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
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25 }}
        className={cn(
          "rounded-3xl p-5 sm:p-6 bg-[#EDE8F5]/75 border border-[#D8CEEA] shadow-soft relative overflow-hidden",
          className
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-2xl bg-white border border-[#D8CEEA] text-[#553E82] shrink-0 mt-0.5 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-serif font-semibold text-[#263330]">{title}</span>
                <span className="text-xs font-medium text-[#553E82] bg-white/80 px-2.5 py-0.5 rounded-full border border-[#D8CEEA] flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{timeContext}</span>
                </span>
              </div>
              <p className="text-base text-[#263330] leading-relaxed max-w-2xl">{message}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
            <button
              onClick={handleDismiss}
              className="text-sm font-medium px-4 py-2 min-h-[40px] rounded-xl bg-white hover:bg-[#FAF8F4] text-[#263330] border border-[#D8CEEA] transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <Check className="w-4 h-4 text-[#285B55]" />
              <span>Thank you</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 min-h-[40px] min-w-[40px] rounded-xl text-[#52625E] hover:text-[#263330] hover:bg-white/60 transition-colors flex items-center justify-center"
              title="Dismiss reminder"
              aria-label="Dismiss reminder"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
