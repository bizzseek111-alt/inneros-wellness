"use client";

import React from "react";
import { X, Phone, MessageSquare, ExternalLink, HeartHandshake } from "lucide-react";
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263330]/45 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="support-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-xl bg-[#FAF8F4] border border-[#E6E1D8] rounded-3xl p-6 sm:p-8 shadow-elevated relative overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-[#F7E7E2] border border-[#E8CEC5] flex items-center justify-center text-[#9B1C31] shrink-0">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <h3
                    id="support-modal-title"
                    className="text-xl font-serif font-semibold text-[#263330]"
                  >
                    You Are Not Alone — Human Support
                  </h3>
                  <p className="text-sm text-[#52625E]">
                    Free, confidential 24/7 support from caring professionals
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 min-h-[40px] min-w-[40px] rounded-xl bg-white border border-[#E4E0D8] text-[#52625E] hover:text-[#263330] flex items-center justify-center"
                aria-label="Close support dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reassuring Non-Clinical Notice */}
            <div className="p-4 rounded-2xl bg-[#F7E7E2]/70 border border-[#E8CEC5] text-[#263330] text-base mb-6 leading-relaxed">
              {customMessage || (
                <span>
                  <strong>InnerOS is an AI companion for everyday reflection, not a medical or emergency service.</strong> If you are going through a difficult moment or feeling unsafe, please connect with a real person below right now.
                </span>
              )}
            </div>

            {/* Helpline Cards */}
            <div className="space-y-3.5">
              {/* 988 US / Canada */}
              <div className="p-4 rounded-2xl bg-white border border-[#E6E1D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div>
                  <div className="font-semibold text-[#263330] flex items-center space-x-2">
                    <span>988 Suicide & Crisis Lifeline</span>
                    <span className="text-xs bg-[#E8F1EB] border border-[#CBE0D3] text-[#1F4742] px-2.5 py-0.5 rounded-full font-medium">
                      US & Canada
                    </span>
                  </div>
                  <p className="text-sm text-[#52625E] mt-1">
                    Call or Text 988 &bull; 24/7 Free & Confidential
                  </p>
                </div>
                <a
                  href="tel:988"
                  className="px-4 py-2.5 min-h-[44px] rounded-xl bg-[#285B55] hover:bg-[#1F4742] text-white text-sm font-medium flex items-center justify-center space-x-2 transition-colors shrink-0"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call 988</span>
                </a>
              </div>

              {/* UK NHS & Samaritans */}
              <div className="p-4 rounded-2xl bg-white border border-[#E6E1D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div>
                  <div className="font-semibold text-[#263330] flex items-center space-x-2">
                    <span>Samaritans & NHS Mental Health</span>
                    <span className="text-xs bg-[#EDE8F5] border border-[#D8CEEA] text-[#423166] px-2.5 py-0.5 rounded-full font-medium">
                      United Kingdom
                    </span>
                  </div>
                  <p className="text-sm text-[#52625E] mt-1">
                    Call 116 123 (Samaritans) or 111 (NHS) &bull; Text SHOUT to 85258
                  </p>
                </div>
                <a
                  href="tel:116123"
                  className="px-4 py-2.5 min-h-[44px] rounded-xl bg-[#E8F1EB] hover:bg-[#D5E6DC] text-[#1F4742] border border-[#CBE0D3] text-sm font-medium flex items-center justify-center space-x-2 transition-colors shrink-0"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call 116 123</span>
                </a>
              </div>

              {/* Europe & Bulgaria */}
              <div className="p-4 rounded-2xl bg-white border border-[#E6E1D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div>
                  <div className="font-semibold text-[#263330] flex items-center space-x-2">
                    <span>European & Bulgarian Support</span>
                    <span className="text-xs bg-[#F7E7E2] border border-[#E8CEC5] text-[#7D402D] px-2.5 py-0.5 rounded-full font-medium">
                      EU & Bulgaria
                    </span>
                  </div>
                  <p className="text-sm text-[#52625E] mt-1">
                    112 (Emergency) &bull; 0800 88 001 (БЧК Support) &bull; 116 123 (Emotional Support)
                  </p>
                </div>
                <a
                  href="tel:112"
                  className="px-4 py-2.5 min-h-[44px] rounded-xl bg-[#E8F1EB] hover:bg-[#D5E6DC] text-[#1F4742] border border-[#CBE0D3] text-sm font-medium flex items-center justify-center space-x-2 transition-colors shrink-0"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call 112</span>
                </a>
              </div>

              {/* International Directory */}
              <div className="p-4 rounded-2xl bg-white border border-[#E6E1D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div>
                  <div className="font-semibold text-[#263330]">Find A Helpline (130+ Countries)</div>
                  <p className="text-sm text-[#52625E] mt-1">
                    Verified local crisis lines worldwide via Befrienders & Find A Helpline
                  </p>
                </div>
                <a
                  href="https://findahelpline.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 min-h-[44px] rounded-xl bg-white hover:bg-[#F3EFE8] text-[#263330] border border-[#DDD8CE] text-sm font-medium flex items-center justify-center space-x-2 transition-colors shrink-0"
                >
                  <span>Open Directory</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E6E1D8] flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 min-h-[44px] rounded-2xl bg-white border border-[#DDD8CE] text-[#263330] text-sm font-medium hover:bg-[#F3EFE8]"
              >
                Return to InnerOS
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
