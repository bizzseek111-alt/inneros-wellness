"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Send, Mic, Sparkles, User, Smile, ArrowLeft, Shield, AlertTriangle, ShieldAlert } from "lucide-react";
import { YouthShell } from "@/components/youth/YouthShell";
import { LumiMascot } from "@/components/youth/LumiMascot";
import { useYouth } from "@/components/youth/YouthContext";
import { apiClient } from "@/lib/api-client";

interface ChatMessage {
  id: string;
  sender: "child" | "lumi";
  text: string;
  time: string;
  isSafety?: boolean;
  resources?: any[];
}

export default function YouthChatRoomPage() {
  const { ageTier, locale, localeMeta, t } = useYouth();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_1",
      sender: "lumi",
      text: locale === "ur"
        ? "سلام دوست! آپ اپنے دل کی کوئی بھی بات یہاں لکھ سکتے ہیں۔"
        : locale === "pa"
        ? "سلام جی! تسیں اپنے دل دی کوئی وی گل ایتھے لکھ سکدے او۔"
        : locale === "ur-Latn"
        ? "Hello dost! Aap apne dil ki koi bhi baat yahan likh sakte hain."
        : "Hello friend! You can write anything on your mind, pick a gentle question below, or take a calm breath with me.",
      time: "Just now",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const sessionIdRef = useRef<string>(`ysess_chat_${Date.now()}`);

  const promptChips = [
    locale === "ur" ? "مجھے اسکول جانے سے ڈر لگتا ہے" : locale === "pa" ? "مینوں سکول جان توں ڈر لگدا اے" : "I feel nervous about tomorrow at school",
    locale === "ur" ? "کیا ہم پرسکون سانس لے سکتے ہیں؟" : "Can we do a 4-second box breath?",
    "Maine kya kiya hai?",
    "I had a misunderstanding with my friend",
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const childMsg: ChatMessage = {
      id: `child_${Date.now()}`,
      sender: "child",
      text,
      time: "Now",
    };
    setMessages((prev) => [...prev, childMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await apiClient.executeYouthTurn({
        session_id: sessionIdRef.current,
        user_utterance: text,
        language: locale,
        age_tier: ageTier === "little" ? "early" : ageTier === "teen" ? "teen" : "junior_young",
        caregiver_present: ageTier === "little",
      });

      const lumiMsg: ChatMessage = {
        id: response.turn_id || `lumi_${Date.now()}`,
        sender: "lumi",
        text: response.transcript_agent,
        time: "Just now",
        isSafety: response.is_safety_escalation,
        resources: response.safety_resources,
      };

      setMessages((prev) => [...prev, lumiMsg]);
    } catch (e: any) {
      // Local fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `lumi_${Date.now()}`,
          sender: "lumi",
          text: "I hear you, friend. Take a slow, quiet breath. You are safe here.",
          time: "Just now",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <YouthShell
      activeScreen="chat"
      title="Text Chat with Lumi"
      subtitle="A quiet, pressure-free space to write your thoughts and questions in English, Urdu, or Punjabi."
    >
      <div className="max-w-2xl mx-auto space-y-4 flex flex-col h-[650px] bg-white rounded-[32px] border border-[#E2E8F0] shadow-sm p-4 sm:p-6">
        {/* Chat Header info */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
            <LumiMascot size="sm" state={isTyping ? "listening" : "idle"} />
            <div>
              <span className="font-extrabold text-sm text-[#0F172A] block">Lumi Companion</span>
              <span className="text-[11px] text-[#36A871] font-bold block">Online &bull; Safe Sanctuary</span>
            </div>
          </div>
          <Link
            href="/youth/voice"
            className="px-3 py-1.5 rounded-full bg-[#E0F1FE] text-[#0C436F] hover:bg-[#B9E2FE] text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <Mic className="w-3.5 h-3.5 text-[#0E87E3]" />
            <span>Switch to Voice</span>
          </Link>
        </div>

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((m) => {
            const isChild = m.sender === "child";
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isChild ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-[24px] p-4 text-sm font-semibold leading-relaxed ${
                    isChild
                      ? "bg-[#0E87E3] text-white rounded-br-xs"
                      : m.isSafety
                      ? "bg-rose-50 border-2 border-rose-300 text-rose-950 rounded-bl-xs"
                      : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] rounded-bl-xs"
                  }`}
                >
                  {m.isSafety && (
                    <div className="flex items-center space-x-1.5 text-rose-700 font-extrabold mb-1">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>Dedicated Support Sanctuary</span>
                    </div>
                  )}
                  <p>{m.text}</p>
                  {m.resources && m.resources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-rose-200 text-xs font-bold space-y-1">
                      <span className="block text-rose-900">Immediate Lifelines:</span>
                      {m.resources.slice(0, 3).map((r, i) => (
                        <div key={i} className="text-rose-800">
                          &bull; {r.name}: {r.contact}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-[#94A3B8] font-bold mt-1 px-1">
                  {m.time}
                </span>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-2 text-xs text-[#64748B] font-bold p-2 bg-[#F8FAFC] rounded-2xl w-fit">
              <span className="animate-pulse">Lumi is listening carefully...</span>
            </div>
          )}
        </div>

        {/* Prompt starter chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="px-3 py-1.5 rounded-full bg-[#FEFDF8] border border-[#CBD5E1] text-[11px] font-bold text-[#475569] hover:bg-[#E0F1FE] hover:text-[#0C436F] transition-all text-start"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="flex items-center space-x-2 pt-2 border-t border-[#E2E8F0]">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Type your message to Lumi here..."
            className="flex-1 px-4 py-3 rounded-2xl border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0E87E3] bg-[#FEFDF8]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isTyping}
            className="p-3 rounded-2xl bg-[#0E87E3] hover:bg-[#0C436F] text-white disabled:opacity-40 transition-colors shadow-xs"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </YouthShell>
  );
}
