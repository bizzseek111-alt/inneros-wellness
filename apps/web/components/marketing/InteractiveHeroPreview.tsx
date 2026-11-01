"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mic,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Ear,
  Compass,
  Wind,
  Volume2,
  Bookmark,
  ArrowRight,
  Pause,
  Play,
} from "lucide-react";
import { Badge } from "@/components/primitives/Badge";
import { trackMarketingEvent } from "@/lib/marketing-analytics";

type PreviewTab = "voice" | "chat" | "memory";
type CompanionModeId = "listen" | "understand" | "settle";

const MODE_PREVIEWS: Record<
  CompanionModeId,
  {
    label: string;
    badge: string;
    userPrompt: string;
    companionReply: string;
    memoryNote: string;
  }
> = {
  listen: {
    label: "Just Listen",
    badge: "No unsolicited advice",
    userPrompt:
      "I have three different deadlines tomorrow and I don’t want a productivity checklist right now—I just need a quiet place to vent.",
    companionReply:
      "I hear you. Carrying three competing deadlines at once is exhausting, and we don’t need to solve or organize anything right now. Take all the space you need—what part of today felt the heaviest?",
    memoryNote: "When feeling stretched thin by deadlines, prefers a calm listening space before jumping into action steps.",
  },
  understand: {
    label: "Help Me Understand",
    badge: "Gentle perspective",
    userPrompt:
      "Why do I always feel guilty taking an hour to rest in the evening even when my work is finished?",
    companionReply:
      "When your mind has been in high-focus mode all day, slowing down can sometimes feel unfamiliar—almost like you’re forgetting something. What usually runs through your thoughts in that first quiet ten minutes?",
    memoryNote: "Working on protecting evening wind-down time without self-criticism.",
  },
  settle: {
    label: "Help Me Settle",
    badge: "Slow grounding",
    userPrompt:
      "My shoulders are tense after a long meeting. Can we do a quick reset before I head home?",
    companionReply:
      "Of course. Let’s take sixty seconds together. Let your shoulders drop away from your ears, rest your hands comfortably, and take one slow breath in for four counts...",
    memoryNote: "Short shoulder-drop and breathing resets help transition between work and evening.",
  },
};

export const InteractiveHeroPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PreviewTab>("voice");
  const [selectedMode, setSelectedMode] = useState<CompanionModeId>("listen");
  const [orbListening, setOrbListening] = useState(true);
  const [memorySaved, setMemorySaved] = useState(false);

  const currentConversation = MODE_PREVIEWS[selectedMode];

  const handleTabChange = (tab: PreviewTab) => {
    setActiveTab(tab);
    trackMarketingEvent("interactive_demo_mode_switch", { tab });
  };

  return (
    <div className="rounded-[32px] bg-white border border-[#E2DDD2] shadow-lg overflow-hidden">
      {/* Top Preview Window Bar */}
      <div className="px-5 sm:px-7 py-4 bg-[#FAF8F4] border-b border-[#E6E0D6] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-3 h-3 rounded-full bg-[#CFE2D6]" />
          <div className="w-3 h-3 rounded-full bg-[#EED2C9]" />
          <div className="w-3 h-3 rounded-full bg-[#DDD4EC]" />
          <span className="text-[13.5px] font-medium text-[#52625E] pl-1">
            Interactive Companion Preview
          </span>
        </div>

        {/* Mode Switcher Pills */}
        <div
          role="tablist"
          aria-label="Companion Preview Modes"
          className="flex items-center bg-[#F3EFE8] p-1 rounded-2xl border border-[#E6E0D6]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "voice"}
            onClick={() => handleTabChange("voice")}
            className={`px-3.5 py-1.5 rounded-xl text-[13.5px] font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === "voice"
                ? "bg-[#285B55] text-white shadow-sm"
                : "text-[#52625E] hover:text-[#263330]"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "chat"}
            onClick={() => handleTabChange("chat")}
            className={`px-3.5 py-1.5 rounded-xl text-[13.5px] font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === "chat"
                ? "bg-[#285B55] text-white shadow-sm"
                : "text-[#52625E] hover:text-[#263330]"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Text Chat</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "memory"}
            onClick={() => handleTabChange("memory")}
            className={`px-3.5 py-1.5 rounded-xl text-[13.5px] font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === "memory"
                ? "bg-[#285B55] text-white shadow-sm"
                : "text-[#52625E] hover:text-[#263330]"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Memory</span>
          </button>
        </div>
      </div>

      {/* Preview Body */}
      <div className="p-6 sm:p-8">
        {/* TAB 1: CALM VOICE COMPANION ORB */}
        {activeTab === "voice" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Badge variant="sage" size="sm">
                  AI Companion
                </Badge>
                <span className="text-[13.5px] text-[#52625E]">
                  Voice: Sanctuary Calm &bull; Natural turn-taking
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOrbListening(!orbListening);
                  trackMarketingEvent("interactive_orb_state_change", {
                    listening: !orbListening,
                  });
                }}
                className="px-3 py-1.5 rounded-xl bg-[#FAF8F4] border border-[#E2DDD2] text-[13px] font-medium text-[#263330] hover:border-[#285B55] flex items-center space-x-1.5 transition-colors"
              >
                {orbListening ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[#285B55]" />
                    <span>Pause Preview</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-[#285B55]" />
                    <span>Resume Preview</span>
                  </>
                )}
              </button>
            </div>

            {/* Ambient Breathing Orb Visualization */}
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-5 bg-gradient-to-b from-[#FAF8F4] via-[#E8F1EB]/40 to-[#FAF8F4] rounded-3xl border border-[#EFECE6] px-4">
              <div className="relative flex items-center justify-center w-36 h-36">
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-tr from-[#CFE2D6] via-[#F7E7E2] to-[#EDE8F5] opacity-75 blur-xl transition-transform duration-1000 ${
                    orbListening ? "scale-110 animate-breathe" : "scale-95"
                  }`}
                />
                <div
                  className={`relative w-28 h-28 rounded-full bg-gradient-to-br from-[#E8F1EB] via-white to-[#F7E7E2] border-2 border-[#CFE2D6] shadow-md flex flex-col items-center justify-center transition-transform duration-700 ${
                    orbListening ? "scale-105" : "scale-100"
                  }`}
                >
                  <Volume2 className="w-7 h-7 text-[#285B55] mb-1" />
                  <div className="flex items-center space-x-1">
                    <span className="w-1 h-3 rounded-full bg-[#285B55]/70 animate-pulse" />
                    <span className="w-1 h-5 rounded-full bg-[#285B55] animate-pulse" />
                    <span className="w-1 h-3.5 rounded-full bg-[#285B55]/80 animate-pulse" />
                    <span className="w-1 h-2.5 rounded-full bg-[#285B55]/50 animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 max-w-md">
                <span className="text-[18px] font-serif font-medium text-[#263330] block">
                  {orbListening ? "Speaking Gently with You" : "Paused — Ready When You Are"}
                </span>
                <p className="text-[15px] text-[#52625E] italic font-serif leading-relaxed">
                  &ldquo;Take your time. There is no rush to explain everything at once—we can start wherever feels easiest.&rdquo;
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <span className="text-[13.5px] text-[#52625E]">
                Interruptible anytime &bull; Switch between voice and text in one tap
              </span>
              <Link
                href="/companion/voice"
                className="inline-flex items-center space-x-1.5 text-[14px] font-semibold text-[#285B55] hover:underline"
              >
                <span>Try Live Voice Companion</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* TAB 2: TEXT CONVERSATION & MODE PILLS */}
        {activeTab === "chat" && (
          <div className="space-y-5">
            {/* Interactive Mode Selector */}
            <div className="space-y-2">
              <span className="text-[13px] font-medium text-[#52625E] block">
                Choose how you want your companion to respond:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMode("listen")}
                  className={`px-3.5 py-2 rounded-xl text-[13.5px] font-medium border transition-all flex items-center space-x-1.5 ${
                    selectedMode === "listen"
                      ? "bg-[#285B55] text-white border-[#285B55]"
                      : "bg-[#FAF8F4] text-[#52625E] border-[#E2DDD2] hover:text-[#263330]"
                  }`}
                >
                  <Ear className="w-3.5 h-3.5" />
                  <span>Just Listen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMode("understand")}
                  className={`px-3.5 py-2 rounded-xl text-[13.5px] font-medium border transition-all flex items-center space-x-1.5 ${
                    selectedMode === "understand"
                      ? "bg-[#285B55] text-white border-[#285B55]"
                      : "bg-[#FAF8F4] text-[#52625E] border-[#E2DDD2] hover:text-[#263330]"
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Help Me Understand</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMode("settle")}
                  className={`px-3.5 py-2 rounded-xl text-[13.5px] font-medium border transition-all flex items-center space-x-1.5 ${
                    selectedMode === "settle"
                      ? "bg-[#285B55] text-white border-[#285B55]"
                      : "bg-[#FAF8F4] text-[#52625E] border-[#E2DDD2] hover:text-[#263330]"
                  }`}
                >
                  <Wind className="w-3.5 h-3.5" />
                  <span>Help Me Settle</span>
                </button>
              </div>
            </div>

            {/* Simulated Chat Bubbles */}
            <div className="p-5 rounded-3xl bg-[#FAF8F4] border border-[#E6E0D6] space-y-4">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="max-w-[85%] p-4 rounded-2xl rounded-br-sm bg-[#E8F1EB] border border-[#CFE2D6] text-[15px] text-[#1F4742] leading-relaxed">
                  {currentConversation.userPrompt}
                </div>
              </div>

              {/* Companion Message */}
              <div className="flex justify-start">
                <div className="max-w-[90%] p-4 rounded-2xl rounded-bl-sm bg-white border border-[#E6E0D6] shadow-sm space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12.5px] font-semibold text-[#285B55]">
                      InnerOS &bull; {currentConversation.label}
                    </span>
                    <Badge variant="sage" size="sm">
                      {currentConversation.badge}
                    </Badge>
                  </div>
                  <p className="text-[15.5px] text-[#263330] leading-relaxed">
                    {currentConversation.companionReply}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[13.5px] text-[#52625E]">
                Switch modes anytime during a conversation
              </span>
              <Link
                href="/companion/chat"
                className="inline-flex items-center space-x-1.5 text-[14px] font-semibold text-[#285B55] hover:underline"
              >
                <span>Open Text Companion</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* TAB 3: USER-APPROVED MEMORY PREVIEW */}
        {activeTab === "memory" && (
          <div className="space-y-5">
            <div className="p-5 rounded-3xl bg-[#F7E7E2] border border-[#EED2C9] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] font-semibold text-[#7A4434] flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Suggested Note — Always Requires Your Approval</span>
                </span>
                <Badge variant="peach" size="sm">
                  {memorySaved ? "Saved by You" : "Awaiting Confirmation"}
                </Badge>
              </div>

              <p className="text-[15.5px] text-[#263330] font-medium leading-relaxed bg-white p-4 rounded-2xl border border-[#E6E0D6]">
                &ldquo;{currentConversation.memoryNote}&rdquo;
              </p>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[13px] text-[#52625E]">
                  InnerOS never builds hidden profiles or saves AI guesses as facts.
                </span>
                <button
                  type="button"
                  onClick={() => setMemorySaved(!memorySaved)}
                  className={`px-4 py-2 rounded-xl text-[13.5px] font-medium transition-all flex items-center space-x-1.5 ${
                    memorySaved
                      ? "bg-[#E8F1EB] text-[#1F4742] border border-[#CFE2D6]"
                      : "bg-[#285B55] text-white hover:bg-[#1F4742]"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{memorySaved ? "Confirmed in Memories" : "Approve Memory"}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[13.5px] text-[#52625E]">
                View, edit, pause, or delete any memory in one click
              </span>
              <Link
                href="/memory"
                className="inline-flex items-center space-x-1.5 text-[14px] font-semibold text-[#285B55] hover:underline"
              >
                <span>Explore Things I Remember</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
