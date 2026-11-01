"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  RefreshCw,
  Shield,
  AlertTriangle,
  Lock,
  Trash2,
  Sliders,
  Sparkles,
  Volume2,
  BookOpen,
  Compass,
  CheckCircle2,
  HeartHandshake,
  Ear,
  HelpCircle,
  Wrench,
  Wind,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api, ConversationMode, ChatResponse } from "@/lib/api-client";
import { Badge } from "@/components/primitives/Badge";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  recalledMemoryCount?: number;
  isCrisis?: boolean;
  adviceOmitted?: boolean;
  modeApplied?: ConversationMode;
  timestamp: string;
}

interface CompanionInterfaceProps {
  onTriggerEmergencyModal: (msg?: string) => void;
}

const MODES: Array<{
  id: ConversationMode;
  label: string;
  icon: React.ElementType;
  badge: string;
  description: string;
  allowsAdvice: boolean;
}> = [
  {
    id: "just_listen",
    label: "Just Listen",
    icon: Ear,
    badge: "Zero Advice",
    description: "Holding compassionate emotional space. Reflects feelings without fixing.",
    allowsAdvice: false,
  },
  {
    id: "help_me_understand",
    label: "Help Me Understand",
    icon: HelpCircle,
    badge: "Clarifying Questions",
    description: "Gently untangles conflicting emotions, bodily sensations, and core needs.",
    allowsAdvice: false,
  },
  {
    id: "help_me_solve",
    label: "Help Me Solve",
    icon: Wrench,
    badge: "Micro-Steps",
    description: "Collaborative, values-aligned action breakdown for overwhelming tasks.",
    allowsAdvice: true,
  },
  {
    id: "teach_me",
    label: "Teach Me",
    icon: BookOpen,
    badge: "Psychoeducation",
    description: "Evidence-informed concepts: ACT cognitive defusion & Polyvagal biology.",
    allowsAdvice: true,
  },
  {
    id: "help_me_settle",
    label: "Help Me Settle",
    icon: Wind,
    badge: "Somatic Pacing",
    description: "Guided 4-4-4-4 Box Breathing and physical sensory grounding.",
    allowsAdvice: true,
  },
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
  { code: "ja", label: "日本語" },
];

export const CompanionInterface: React.FC<CompanionInterfaceProps> = ({
  onTriggerEmergencyModal,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial_welcome",
      role: "assistant",
      content:
        "Welcome back to your sanctuary, Elena. I am your non-clinical AI emotional companion. I am not a human therapist or medical doctor, but I am here to listen, untangle, or settle with you. How are you experiencing this moment?",
      recalledMemoryCount: 2,
      modeApplied: "just_listen",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [currentMode, setCurrentMode] = useState<ConversationMode>("just_listen");
  const [warmth, setWarmth] = useState(0.8);
  const [directness, setDirectness] = useState(0.5);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [sessionId] = useState("session_default");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  // Load session history on mount
  useEffect(() => {
    let isMounted = true;
    async function loadHistory() {
      try {
        const historyData = await api.getSessionHistory(sessionId);
        if (isMounted && historyData?.messages && historyData.messages.length > 0) {
          const mapped: Message[] = historyData.messages.map((m, idx) => ({
            id: `hist_${idx}_${Date.now()}`,
            role: m.role as "user" | "assistant",
            content: m.content,
            isCrisis: m.is_crisis,
            recalledMemoryCount: m.recalled_memory_count,
            timestamp: m.timestamp
              ? new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }));
          setMessages(mapped);
        }
      } catch (err) {
        // Graceful offline fallback: keep default welcome
      }
    }
    loadHistory();
    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  const handleClearSession = async () => {
    if (window.confirm("Clear all conversation history in this session? This action cannot be undone.")) {
      try {
        await api.clearSessionHistory(sessionId);
      } catch (e) {
        // offline clear
      }
      setMessages([
        {
          id: `welcome_reset_${Date.now()}`,
          role: "assistant",
          content: "Conversation history cleared. I am right here with you whenever you are ready to begin anew.",
          modeApplied: currentMode,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isStreaming) return;

    const userMsgTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: userMsgTime,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsStreaming(true);
    setStreamingContent("");

    let accumulatedReply = "";

    try {
      await api.streamChatMessage(
        {
          sessionId,
          utterance: text,
          mode: currentMode,
          warmthLevel: warmth,
          directnessLevel: directness,
          language: currentLanguage,
          countryCode: "US",
        },
        (chunk) => {
          accumulatedReply += chunk;
          setStreamingContent(accumulatedReply);
        },
        () => {
          setIsStreaming(false);
          setStreamingContent("");
          const isCrisis =
            accumulatedReply.includes("crisis resources") ||
            accumulatedReply.includes("emergency") ||
            accumulatedReply.includes("988");

          setMessages((prev) => [
            ...prev,
            {
              id: `assistant_${Date.now()}`,
              role: "assistant",
              content: accumulatedReply,
              recalledMemoryCount: 2,
              isCrisis,
              modeApplied: currentMode,
              adviceOmitted: currentMode === "just_listen",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);

          if (isCrisis) {
            onTriggerEmergencyModal(accumulatedReply);
          }
        },
        (err) => {
          console.warn("Streaming failed, falling back to standard completion:", err);
          fallbackToStandardCompletion(text);
        }
      );
    } catch (e) {
      fallbackToStandardCompletion(text);
    }
  };

  const fallbackToStandardCompletion = async (text: string) => {
    try {
      const response: ChatResponse = await api.sendChatMessage({
        sessionId,
        utterance: text,
        mode: currentMode,
        warmthLevel: warmth,
        directnessLevel: directness,
        language: currentLanguage,
        countryCode: "US",
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant_${Date.now()}`,
          role: "assistant",
          content: response.reply,
          recalledMemoryCount: response.recalled_memory_count,
          isCrisis: !response.safety_evaluation.is_safe_to_proceed,
          modeApplied: response.mode_used,
          adviceOmitted: response.advice_omitted,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      if (!response.safety_evaluation.is_safe_to_proceed) {
        onTriggerEmergencyModal(response.safety_evaluation.de_escalation_message);
      }
    } catch (offlineErr) {
      // Local graceful emergency or reflection fallback
      const isCrisis =
        text.toLowerCase().includes("die") ||
        text.toLowerCase().includes("suicide") ||
        text.toLowerCase().includes("kill myself");

      const offlineReply = isCrisis
        ? "I hear your pain. Please know you are not alone. Please reach out to 988 or trusted human support immediately."
        : "I am right here with you in this sanctuary. Let's take a slow, deep breath together. What is one small thing within your control in this moment?";

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant_${Date.now()}`,
          role: "assistant",
          content: offlineReply,
          recalledMemoryCount: 2,
          isCrisis,
          modeApplied: currentMode,
          adviceOmitted: currentMode === "just_listen",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      if (isCrisis) {
        onTriggerEmergencyModal();
      }
    } finally {
      setIsStreaming(false);
      setStreamingContent("");
    }
  };

  const activeModeData = MODES.find((m) => m.id === currentMode) || MODES[0];

  return (
    <div className="flex-1 flex flex-col h-full max-w-4xl w-full mx-auto" role="region" aria-label="InnerOS Conversation Sanctuary">
      {/* Explicit AI Identity & Non-Clinical Safety Banner */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-white/[0.08] gap-2">
        <div className="flex items-center space-x-2">
          <Badge variant="teal" size="sm">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-teal-400" />
              <span className="font-mono">Explicit AI Identity • Non-Clinical</span>
            </span>
          </Badge>
          <span className="text-[11px] text-ivory-300/60 hidden sm:inline">
            Holds space without diagnosing or prescribing.
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <select
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            className="text-xs bg-midnight-950 border border-white/10 text-ivory-200 rounded-lg px-2 py-1 focus:outline-none focus:border-teal-500"
            aria-label="Select dialogue language"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>

          {/* Config & Calibration Toggle */}
          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center space-x-1 ${
              showConfig
                ? "bg-indigo-950/80 border-indigo-500/50 text-indigo-200"
                : "bg-midnight-950 border-white/10 text-ivory-300 hover:text-ivory-100"
            }`}
            title="Configure Warmth & Directness Calibration"
            aria-expanded={showConfig}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Calibration</span>
          </button>

          {/* Clear Session */}
          <button
            onClick={handleClearSession}
            className="p-1.5 rounded-lg bg-midnight-950 border border-white/10 text-ivory-300 hover:text-rose-300 hover:border-rose-800/40 transition-colors"
            title="Reset Conversation Session"
            aria-label="Clear conversation history"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Calibration Sliders Drawer */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-midnight-950/90 border border-white/[0.08] rounded-2xl p-4 mb-3 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-ivory-200 mb-1">
                  <span className="font-medium">Warmth Calibration</span>
                  <span className="font-mono text-teal-400">{Math.round(warmth * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={warmth}
                  onChange={(e) => setWarmth(parseFloat(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                  aria-label="Companion warmth calibration"
                />
                <p className="text-[10px] text-ivory-300/50 mt-1">
                  0% Objective/Reserved ↔ 100% Deeply Gentle/Reassuring
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs text-ivory-200 mb-1">
                  <span className="font-medium">Directness Calibration</span>
                  <span className="font-mono text-indigo-400">{Math.round(directness * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={directness}
                  onChange={(e) => setDirectness(parseFloat(e.target.value))}
                  className="w-full accent-indigo-400 cursor-pointer"
                  aria-label="Companion directness calibration"
                />
                <p className="text-[10px] text-ivory-300/50 mt-1">
                  0% Spacious/Exploratory ↔ 100% Crisp/Focused Reflection
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5 Conversation Modes Selector */}
      <div className="flex overflow-x-auto gap-2 pb-2 mb-3 no-scrollbar" role="tablist" aria-label="Conversation Modes">
        {MODES.map((m) => {
          const Icon = m.icon;
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setCurrentMode(m.id)}
              role="tab"
              aria-selected={isActive}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium shrink-0 transition-all border ${
                isActive
                  ? "bg-teal-950/60 border-teal-500/50 text-teal-200 shadow-[0_0_15px_rgba(52,134,128,0.2)]"
                  : "bg-midnight-950/70 border-white/[0.06] text-ivory-300/80 hover:text-ivory-100 hover:border-white/10"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-teal-400" : "text-ivory-300/60"}`} />
              <span>{m.label}</span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-mono ${
                  isActive ? "bg-teal-900/80 text-teal-300" : "bg-white/[0.04] text-ivory-300/40"
                }`}
              >
                {m.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mode Intent Guidance Banner */}
      <div className="text-[11px] px-3 py-1.5 rounded-xl bg-midnight-950/40 border border-white/[0.04] text-ivory-300/70 flex items-center justify-between mb-3">
        <span>{activeModeData.description}</span>
        {!activeModeData.allowsAdvice && (
          <span className="text-teal-400/90 font-mono text-[10px] shrink-0 ml-2">
            • Respects advice boundaries
          </span>
        )}
      </div>

      {/* Conversation Feed */}
      <div
        className="flex-1 overflow-y-auto space-y-4 mb-3 pr-2 scrollbar-thin scrollbar-thumb-white/10"
        role="log"
        aria-live="polite"
      >
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isUser
                    ? "bg-teal-950/50 border border-teal-700/40 text-ivory-100 rounded-br-sm"
                    : m.isCrisis
                    ? "bg-rose-950/50 border border-rose-700/60 text-rose-100 rounded-bl-sm"
                    : "bg-midnight-950/80 border border-white/[0.08] text-ivory-200 rounded-bl-sm shadow-md"
                }`}
              >
                {m.content}
              </div>

              {/* Message Metadata Badges */}
              <div className="flex items-center space-x-2 mt-1 px-1 text-[10px] text-ivory-300/50 font-mono">
                <span>{m.timestamp}</span>
                {!isUser && m.recalledMemoryCount !== undefined && m.recalledMemoryCount > 0 && (
                  <span className="text-teal-400/80 flex items-center space-x-1">
                    <span>•</span>
                    <span>{m.recalledMemoryCount} memories recalled</span>
                  </span>
                )}
                {!isUser && m.adviceOmitted && (
                  <span className="text-indigo-300/80 flex items-center space-x-1">
                    <span>•</span>
                    <span>Advice Withheld</span>
                  </span>
                )}
                {m.isCrisis && (
                  <span className="text-rose-400 flex items-center space-x-1 font-semibold">
                    <span>•</span>
                    <AlertTriangle className="w-3 h-3" />
                    <span>Crisis Intercept Active</span>
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Live Streaming Assistant Message */}
        {isStreaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-start"
          >
            <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-midnight-950/80 border border-teal-500/30 text-ivory-100 rounded-bl-sm shadow-lg">
              {streamingContent}
              <span className="inline-block w-1.5 h-3.5 bg-teal-400 ml-1 animate-pulse" />
            </div>
            <div className="flex items-center space-x-2 mt-1 px-1 text-[10px] text-teal-400/80 font-mono">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              <span>Streaming in {activeModeData.label} mode...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Contextual Quick Inquiries */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {[
          "I don't want advice, I just need to vent.",
          "Why did this critique trigger my defensiveness?",
          "Can we break this project into 5-minute micro-steps?",
          "Guide me through a 4-4-4-4 breathing anchor.",
        ].map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            disabled={isStreaming}
            className="text-xs px-2.5 py-1 rounded-full bg-midnight-950/80 hover:bg-midnight-900 border border-white/[0.06] text-ivory-300/70 hover:text-ivory-100 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <div className="relative flex items-center bg-midnight-950/90 border border-white/[0.1] focus-within:border-teal-500/60 rounded-2xl p-2 shadow-xl transition-all">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={`Reflect or speak with InnerOS (${activeModeData.label} mode)... [Shift + Enter for new line]`}
          rows={1}
          className="w-full bg-transparent resize-none text-sm text-ivory-100 placeholder:text-ivory-300/40 px-3 py-1.5 focus:outline-none max-h-32"
          aria-label="Message InnerOS companion"
        />

        <div className="flex items-center space-x-1.5 shrink-0 pr-1">
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isStreaming}
            className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-30 disabled:hover:bg-teal-600 text-white transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            title="Send Message"
            aria-label="Send message"
          >
            {isStreaming ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Non-Clinical Safeguard Footer */}
      <div className="mt-2 text-center text-[11px] text-ivory-300/40 flex items-center justify-center space-x-2">
        <Shield className="w-3.5 h-3.5 text-teal-400/70" />
        <span>Non-Clinical Sanctuary • Not for medical diagnoses or emergency response • Crisis? Dial 988</span>
      </div>
    </div>
  );
};
