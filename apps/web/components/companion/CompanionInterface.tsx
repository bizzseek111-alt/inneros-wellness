"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Send,
  RefreshCw,
  Shield,
  AlertTriangle,
  Trash2,
  Sliders,
  Sparkles,
  BookOpen,
  Ear,
  HelpCircle,
  Wrench,
  Wind,
  Mic,
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
    badge: "No Advice",
    description: "I will simply listen and reflect your feelings without trying to fix anything.",
    allowsAdvice: false,
  },
  {
    id: "help_me_understand",
    label: "Help Me Understand",
    icon: HelpCircle,
    badge: "Gentle Questions",
    description: "We will gently explore what you are feeling and what matters most right now.",
    allowsAdvice: false,
  },
  {
    id: "help_me_solve",
    label: "Help Me Solve",
    icon: Wrench,
    badge: "Small Steps",
    description: "Together we can break down an overwhelming situation into calm, manageable steps.",
    allowsAdvice: true,
  },
  {
    id: "teach_me",
    label: "Teach Me",
    icon: BookOpen,
    badge: "Psychology",
    description: "Learn practical, evidence-informed psychology concepts for everyday life.",
    allowsAdvice: true,
  },
  {
    id: "help_me_settle",
    label: "Help Me Settle",
    icon: Wind,
    badge: "Grounding",
    description: "Slow breathing and sensory grounding exercises to help your body feel settled.",
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
        "Hello Elena. I am your AI wellbeing companion. I am not a human therapist or doctor, but I am here as a quiet, supportive space to listen, untangle thoughts, or help you settle. How are you feeling right now?",
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  useEffect(() => {
    if (messages.length > 1 || streamingContent) {
      scrollToBottom();
    }
  }, [messages, streamingContent]);

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
        // Keep initial welcome on offline fallback
      }
    }
    loadHistory();
    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  const handleClearSession = async () => {
    if (window.confirm("Start a fresh conversation? Your current messages in this view will be cleared.")) {
      try {
        await api.clearSessionHistory(sessionId);
      } catch (e) {
        // offline clear
      }
      setMessages([
        {
          id: `welcome_reset_${Date.now()}`,
          role: "assistant",
          content: "We have a fresh page. Take your time—I am right here whenever you want to share.",
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
      const isCrisis =
        text.toLowerCase().includes("die") ||
        text.toLowerCase().includes("suicide") ||
        text.toLowerCase().includes("kill myself");

      const offlineReply = isCrisis
        ? "I hear how much pain you are carrying. Please know you are not alone—please reach out to 988 or trusted human support right away."
        : "I am right here with you. Let's take a slow breath together. What feels most important to share in this moment?";

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
    <div
      className="flex-1 flex flex-col h-full max-w-4xl w-full mx-auto space-y-4"
      role="region"
      aria-label="Conversation with your InnerOS AI companion"
    >
      {/* Top Companion Header & Controls */}
      <div className="flex flex-wrap items-center justify-between p-4 sm:p-5 rounded-[28px] peopleflow-card border border-white/80 shadow-subtle gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#D9F296]/40 border border-[#D9F296] flex items-center justify-center text-[#1A1E1C]">
            <Sparkles className="w-5 h-5 text-[#285B55]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-serif font-semibold text-[#1A1E1C]">
                Companion Conversation
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#D9F296] text-[#1A1E1C]">
                Active Sanctuary
              </span>
            </div>
            <p className="text-xs text-[#4A5752]">
              Supportive space for reflection &bull; Not a medical service
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Switch to Voice Mode */}
          <Link
            href="/companion/voice"
            className="px-3.5 py-2 min-h-[40px] rounded-full bg-[#CBD8F6]/40 hover:bg-[#CBD8F6]/70 text-[#1A1E1C] border border-[#CBD8F6] text-xs font-medium flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <Mic className="w-4 h-4 text-[#465B8C]" />
            <span>Switch to Voice</span>
          </Link>

          {/* Language Selector */}
          <select
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            className="text-xs min-h-[40px] bg-white border border-[#1A1E1C]/10 text-[#1A1E1C] rounded-full px-3.5 py-2 focus:outline-none focus:border-[#285B55] shadow-xs"
            aria-label="Select conversation language"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>

          {/* Tone & Style Drawer Toggle */}
          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`px-3.5 py-2 min-h-[40px] rounded-full border text-xs font-medium transition-all flex items-center space-x-1.5 shadow-xs ${
              showConfig
                ? "bg-[#EAE4F7] border-[#EAE4F7] text-[#1A1E1C]"
                : "bg-white border-[#1A1E1C]/10 text-[#4A5752] hover:text-[#1A1E1C]"
            }`}
            title="Adjust companion warmth and style"
            aria-expanded={showConfig}
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden sm:inline">Tone &amp; Style</span>
          </button>

          {/* Fresh Conversation */}
          <button
            onClick={handleClearSession}
            className="p-2.5 min-h-[40px] min-w-[40px] rounded-full bg-white border border-[#1A1E1C]/10 text-[#687670] hover:text-[#9B1C31] hover:bg-[#FDF2F2] transition-colors flex items-center justify-center shadow-xs"
            title="Start a fresh conversation"
            aria-label="Clear conversation history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tone & Style Sliders Drawer */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white/95 rounded-[28px] p-5 shadow-subtle border border-white/80 space-y-4 peopleflow-card"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between text-sm text-[#263330] mb-1.5">
                  <span className="font-medium">Warmth &amp; Gentleness</span>
                  <span className="font-semibold text-[#285B55]">{Math.round(warmth * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={warmth}
                  onChange={(e) => setWarmth(parseFloat(e.target.value))}
                  className="w-full accent-[#285B55] cursor-pointer"
                  aria-label="Companion warmth"
                />
                <p className="text-xs text-[#52625E] mt-1">
                  Adjust from calm and matter-of-fact to deeply warm and reassuring.
                </p>
              </div>

              <div>
                <div className="flex justify-between text-sm text-[#263330] mb-1.5">
                  <span className="font-medium">Directness</span>
                  <span className="font-semibold text-[#553E82]">{Math.round(directness * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={directness}
                  onChange={(e) => setDirectness(parseFloat(e.target.value))}
                  className="w-full accent-[#553E82] cursor-pointer"
                  aria-label="Companion directness"
                />
                <p className="text-xs text-[#52625E] mt-1">
                  Adjust from open, spacious reflection to clear, practical focus.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5 Conversation Modes Selector */}
      <div className="space-y-2">
        <div
          className="flex overflow-x-auto gap-2 pb-1 no-scrollbar"
          role="tablist"
          aria-label="How would you like me to support you?"
        >
          {MODES.map((m) => {
            const Icon = m.icon;
            const isActive = currentMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setCurrentMode(m.id)}
                role="tab"
                aria-selected={isActive}
                className={`flex items-center space-x-2 px-4 py-2 min-h-[40px] rounded-full text-xs sm:text-sm font-medium shrink-0 transition-all border shadow-xs ${
                  isActive
                    ? "bg-[#1A1E1C] border-[#1A1E1C] text-white"
                    : "bg-white border-[#1A1E1C]/10 text-[#1A1E1C] hover:bg-[#F9FBFA]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#9EE838]" : "text-[#285B55]"}`} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mode Intent Guidance */}
        <div className="text-xs sm:text-sm px-4 py-2.5 rounded-2xl bg-[#CDE5D3]/40 border border-[#CDE5D3] text-[#1A1E1C] flex flex-wrap items-center justify-between gap-2">
          <span>{activeModeData.description}</span>
          {!activeModeData.allowsAdvice && (
            <span className="text-xs font-semibold bg-[#FFFFFF] px-2.5 py-0.5 rounded-full border border-[#CDE5D3] text-[#1A1E1C]">
              Listening only &bull; No unsolicited advice
            </span>
          )}
        </div>
      </div>

      {/* Spacious PeopleFlow Conversation Feed */}
      <div
        className="flex-1 overflow-y-auto space-y-4 p-4 sm:p-6 rounded-[32px] peopleflow-card border border-white/80 bg-white/95 min-h-[380px] max-h-[520px] shadow-subtle"
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
              transition={{ duration: 0.2 }}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-3xl px-5 py-4 text-base leading-relaxed ${
                  isUser
                    ? "bg-[#1A1E1C] text-white rounded-br-sm shadow-xs"
                    : m.isCrisis
                    ? "bg-[#FDF2F2] border border-[#F2C9CE] text-[#1A1E1C] rounded-bl-sm"
                    : "bg-white border border-[#1A1E1C]/8 text-[#1A1E1C] rounded-bl-sm shadow-xs"
                }`}
              >
                {m.content}
              </div>

              {/* Subtle, friendly message footer */}
              <div className="flex items-center space-x-2.5 mt-1.5 px-2 text-xs text-[#687670]">
                <span>{isUser ? "Elena (You)" : "InnerOS Companion"} &bull; {m.timestamp}</span>
                {!isUser && m.adviceOmitted && (
                  <span className="text-[#285B55] font-medium">
                    &bull; Just listening
                  </span>
                )}
                {m.isCrisis && (
                  <span className="text-[#9B1C31] flex items-center space-x-1 font-medium">
                    <span>&bull;</span>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Support resources shared</span>
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Streaming Message */}
        {isStreaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-start"
          >
            <div className="max-w-[85%] rounded-3xl px-5 py-4 text-base leading-relaxed bg-white border border-[#CDE5D3] text-[#1A1E1C] rounded-bl-sm shadow-xs">
              {streamingContent}
              <span className="inline-block w-2 h-4 bg-[#285B55] ml-1.5 animate-pulse rounded-xs" />
            </div>
            <div className="flex items-center space-x-2 mt-1.5 px-2 text-xs text-[#285B55]">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Responding thoughtfully...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Gentle Conversation Starter Chips */}
      <div className="flex flex-wrap gap-2">
        {[
          "I don't want advice right now, I just need to vent.",
          "Help me understand why today felt overwhelming.",
          "Can we break a big task into small, calm steps?",
          "Guide me through a slow breathing exercise.",
        ].map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            disabled={isStreaming}
            className="text-xs sm:text-sm px-3.5 py-1.5 rounded-full bg-white hover:bg-[#D9F296]/60 border border-[#1A1E1C]/10 text-[#1A1E1C] transition-all shadow-xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Warm, Rounded Input Composer */}
      <div className="relative flex items-center bg-white border border-[#1A1E1C]/15 focus-within:border-[#285B55] focus-within:ring-2 focus-within:ring-[#285B55]/15 rounded-full p-2 pl-5 shadow-surface transition-all">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={`Write what is on your mind (${activeModeData.label})...`}
          rows={1}
          className="w-full bg-transparent resize-none text-base text-[#1A1E1C] placeholder:text-[#83918B] py-1.5 focus:outline-none max-h-32"
          aria-label="Write a message to your companion"
        />

        <div className="flex items-center space-x-2 shrink-0 pr-1">
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isStreaming}
            className="p-3 min-h-[44px] min-w-[44px] rounded-full bg-[#1A1E1C] hover:bg-[#285B55] disabled:opacity-30 text-white transition-all shadow-sm flex items-center justify-center"
            title="Send message"
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

      {/* Reassuring Footer */}
      <div className="text-center text-xs text-[#687670] flex items-center justify-center space-x-2 pt-1">
        <Shield className="w-3.5 h-3.5 text-[#285B55]" />
        <span>
          InnerOS is an AI companion, not a medical professional. If you are in crisis, please call 988 or 112.
        </span>
      </div>
    </div>
  );
};
