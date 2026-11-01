"use client";

import React from "react";
import { X, Phone, MessageSquare, ExternalLink, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  customMessage?: string;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  customMessage,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg bg-zinc-950 border border-rose-900/60 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
          >
            {/* Top Alert Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2.5 text-rose-400">
                <ShieldAlert className="w-6 h-6 shrink-0" />
                <h3 className="text-lg font-semibold tracking-tight text-rose-200">
                  Immediate Support & Helplines
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Non-Clinical Notice */}
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-200/90 text-sm mb-5 leading-relaxed">
              {customMessage || (
                <span>
                  <strong>InnerOS is an emotional wellbeing companion, not a crisis medical service.</strong> If you or someone you know is in distress or experiencing thoughts of self-harm, please reach out to trained human support immediately. These services are free, confidential, and available 24/7.
                </span>
              )}
            </div>

            {/* Helpline Cards */}
            <div className="space-y-3">
              {/* 988 US / Canada */}
              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-zinc-100 flex items-center space-x-2">
                    <span>988 Suicide & Crisis Lifeline</span>
                    <span className="text-[10px] bg-emerald-950 border border-emerald-800 text-emerald-400 px-1.5 py-0.5 rounded">
                      US & Canada
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">Call or Text 988 • 24/7 Free & Confidential</p>
                </div>
                <a
                  href="tel:988"
                  className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call 988</span>
                </a>
              </div>

              {/* Crisis Text Line */}
              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-zinc-100">Crisis Text Line</div>
                  <p className="text-xs text-zinc-400 mt-0.5">Text HOME to 741741</p>
                </div>
                <a
                  href="sms:741741?body=HOME"
                  className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center space-x-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Text Now</span>
                </a>
              </div>

              {/* International Befrienders */}
              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-zinc-100">International Support (32 Countries)</div>
                  <p className="text-xs text-zinc-400 mt-0.5">Befrienders Worldwide Directory</p>
                </div>
                <a
                  href="https://www.befrienders.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center space-x-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Find Local</span>
                </a>
              </div>
            </div>

            {/* Footer Dismiss */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200"
              >
                Return to Sanctuary
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
