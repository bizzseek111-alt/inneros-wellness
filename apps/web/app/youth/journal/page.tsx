"use client";

import React, { useState } from "react";
import { PenTool, Lock, Heart, Sparkles, Check, Smile, Trash2 } from "lucide-react";
import { YouthShell } from "@/components/youth/YouthShell";

interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  prompt: string;
  content: string;
}

export default function YouthJournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "j1",
      date: "Today, 4:15 PM",
      mood: "Calm",
      prompt: "What made you smile today?",
      content: "I drew a funny cartoon cat during break and my classmate laughed with me. It felt warm.",
    },
  ]);

  const [currentPrompt, setCurrentPrompt] = useState("What is one expectation today that felt heavy, and how did you breathe through it?");
  const [journalContent, setJournalContent] = useState("");
  const [selectedMood, setSelectedMood] = useState("Reflective");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const prompts = [
    "What was the highlight of your day?",
    "What is one thing that felt hard today?",
    "Name someone who was kind to you recently.",
    "If you could whisper any wish to the stars, what would it be?",
  ];

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalContent.trim()) return;

    const newEntry: JournalEntry = {
      id: `j_${Date.now()}`,
      date: "Just now",
      mood: selectedMood,
      prompt: currentPrompt,
      content: journalContent.trim(),
    };

    setEntries([newEntry, ...entries]);
    setJournalContent("");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <YouthShell
      activeScreen="journal"
      title="Private Reflection Journal"
      subtitle="Your thoughts are yours alone. No grades, no ads, and zero judgment."
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Privacy Lock Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center space-x-2">
          <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Private Sanctuary: Your diary reflections are stored safely on your device.</span>
        </div>

        {/* Compose Form */}
        <form onSubmit={handleSaveEntry} className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#9868CE]">
              Daily Reflection
            </span>
            <div className="flex gap-1.5 text-xs font-bold">
              {["Calm", "Happy", "Reflective", "Tired"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMood(m)}
                  className={`px-3 py-1 rounded-full border transition-all ${
                    selectedMood === m
                      ? "bg-[#FAF7FD] text-[#43256A] border-[#9868CE]"
                      : "bg-[#FFFDF9] text-[#718096] border-[#E2E8F0]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#F2EBD7] space-y-1">
            <span className="text-xs font-bold text-[#718096]">Today’s Prompt:</span>
            <p className="text-sm font-bold text-[#0F172A]">{currentPrompt}</p>
          </div>

          {/* Random prompt picker */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {prompts.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentPrompt(p)}
                className="text-[11px] font-semibold text-[#0E87E3] hover:underline"
              >
                &bull; {p}
              </button>
            ))}
          </div>

          <textarea
            rows={5}
            required
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
            placeholder="Write your honest thoughts freely..."
            className="w-full p-4 rounded-2xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#9868CE]"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#718096]">
              {savedSuccess ? "Saved to your private vault!" : "Take your time."}
            </span>
            <button
              type="submit"
              disabled={!journalContent.trim()}
              className="px-6 py-2.5 rounded-full bg-[#9868CE] hover:bg-[#43256A] disabled:opacity-50 text-white font-extrabold text-xs transition-colors shadow-xs"
            >
              Save to Private Journal
            </button>
          </div>
        </form>

        {/* Existing Entries */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#718096]">
            Past Reflections
          </span>
          {entries.map((entry) => (
            <div key={entry.id} className="p-6 rounded-[24px] bg-white border border-[#E2E8F0] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-[#718096] font-semibold">
                <span>{entry.date}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F3EDFA] text-[#43256A] font-bold">
                  {entry.mood}
                </span>
              </div>
              <p className="text-xs font-bold text-[#4A5568] italic">&ldquo;{entry.prompt}&rdquo;</p>
              <p className="text-sm text-[#0F172A] leading-relaxed pt-1">{entry.content}</p>
            </div>
          ))}
        </div>
      </div>
    </YouthShell>
  );
}
