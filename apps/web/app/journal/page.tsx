"use client";

import React, { useState, useEffect } from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";
import { BookOpen, Lock, Sparkles, Trash2, Plus, Calendar, Tag, ShieldCheck, Check } from "lucide-react";
import { prototypeService, JournalEntry } from "@/lib/prototype-service";

const GUIDED_PROMPTS = [
  {
    title: "ACT Thought Defusion",
    prompt: "Write down the thought that felt heaviest today. Prefix it with: 'I notice I am having the thought that...'",
  },
  {
    title: "Three Small Micro-Moments",
    prompt: "What were three small moments of beauty, quiet, or kindness that occurred today?",
  },
  {
    title: "Evening Surrender",
    prompt: "What is one responsibility or worry that you can intentionally release until tomorrow?",
  },
];

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [valence, setValence] = useState<"reflective" | "calm" | "overwhelmed" | "grateful" | "restless">("reflective");
  const [somaticFocus, setSomaticFocus] = useState("Calm and centered breathing");
  const [tagInput, setTagInput] = useState("daily_reflection");

  useEffect(() => {
    setEntries(prototypeService.getState().journal);
  }, []);

  const handleSaveEntry = () => {
    if (!title.trim() || !content.trim()) return;

    const newEntry = prototypeService.addJournalEntry({
      title,
      content,
      valence,
      energyScore: 7,
      somaticFocus,
      tags: tagInput.split(",").map((t) => t.trim()).filter(Boolean),
    });

    setEntries((prev) => [newEntry, ...prev]);
    setIsCreating(false);
    setTitle("");
    setContent("");
  };

  const handleDelete = (id: string) => {
    prototypeService.deleteJournalEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const applyPrompt = (p: typeof GUIDED_PROMPTS[0]) => {
    setTitle(p.title);
    setContent(p.prompt + "\n\n");
    setIsCreating(true);
  };

  return (
    <SanctuaryShell>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.08] pb-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-mono uppercase tracking-widest">
              <BookOpen className="w-4 h-4" />
              <span>Personal Diary & Reflection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-normal text-ivory-100 tracking-tight">
              Encrypted Sanctuary Journal
            </h1>
            <p className="text-xs sm:text-sm text-ivory-400 font-light leading-relaxed">
              Private reflective writing protected by AES-256-GCM envelope encryption. Never scanned for advertising or shared.
            </p>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsCreating(!isCreating)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            {isCreating ? "Cancel" : "New Entry"}
          </Button>
        </div>

        {/* Guided Prompts Carousel Strip */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono text-zinc-500 uppercase">Evidence-Informed Guided Prompts</span>
          <div className="grid sm:grid-cols-3 gap-3">
            {GUIDED_PROMPTS.map((gp, i) => (
              <div
                key={i}
                onClick={() => applyPrompt(gp)}
                className="p-4 rounded-2xl bg-midnight-900/80 border border-white/[0.06] hover:border-teal-600/50 transition-all cursor-pointer space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ivory-100 group-hover:text-teal-300 transition-colors">
                    {gp.title}
                  </span>
                  <Sparkles className="w-3 h-3 text-teal-400" />
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-snug">{gp.prompt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* New Reflection Composer Form */}
        {isCreating && (
          <div className="p-6 rounded-3xl bg-midnight-900 border border-teal-700/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="text-xs font-semibold text-ivory-100 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                <span>New Encrypted Reflection</span>
              </span>
              <Badge variant="teal" size="sm">
                AES-256 GCM
              </Badge>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Reflection Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-base font-serif font-medium bg-midnight-950 border border-white/[0.1] rounded-xl px-4 py-2 text-ivory-100 focus:outline-none focus:border-teal-500"
              />

              <div className="grid sm:grid-cols-2 gap-3">
                <select
                  value={valence}
                  onChange={(e) => setValence(e.target.value as any)}
                  className="rounded-xl bg-midnight-950 border border-white/[0.1] text-xs text-ivory-200 px-3 py-2 focus:outline-none focus:border-teal-500"
                >
                  <option value="reflective">Valence: Reflective & Contemplative</option>
                  <option value="calm">Valence: Calm & Grounded</option>
                  <option value="grateful">Valence: Grateful & Savoring</option>
                  <option value="overwhelmed">Valence: Overwhelmed & Releasing</option>
                  <option value="restless">Valence: Restless & Seeking Rest</option>
                </select>

                <input
                  type="text"
                  placeholder="Somatic bodily note (e.g. Jaw loose, shoulders dropped)"
                  value={somaticFocus}
                  onChange={(e) => setSomaticFocus(e.target.value)}
                  className="rounded-xl bg-midnight-950 border border-white/[0.1] text-xs text-ivory-200 px-3 py-2 focus:outline-none focus:border-teal-500"
                />
              </div>

              <textarea
                rows={5}
                placeholder="Unpack your thoughts with honest presence..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-sm leading-relaxed bg-midnight-950 border border-white/[0.1] rounded-xl p-4 text-ivory-100 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <Button size="sm" variant="ghost" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleSaveEntry} leftIcon={<Check className="w-3.5 h-3.5" />}>
                Encrypt & Save Reflection
              </Button>
            </div>
          </div>
        )}

        {/* Existing Journal Entries List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Journal Timeline ({entries.length} reflections)</span>
            <span className="font-mono text-[10px]">GDPR Right to be Forgotten Active</span>
          </div>

          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-6 rounded-3xl bg-midnight-900/80 border border-white/[0.08] hover:border-white/[0.14] transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-mono text-[10px] text-zinc-500 flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{entry.date}</span>
                      </span>
                      <span className="text-zinc-600">&bull;</span>
                      <Badge variant="lavender" size="sm">
                        {entry.valence}
                      </Badge>
                      <span className="text-[10px] text-zinc-500 font-mono flex items-center space-x-1">
                        <Lock className="w-2.5 h-2.5 text-teal-400" />
                        <span>Encrypted</span>
                      </span>
                    </div>
                    <h3 className="text-lg font-serif font-medium text-ivory-100">{entry.title}</h3>
                  </div>

                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-white/[0.04] transition-colors"
                    title="Permanently Delete Reflection (GDPR Article 17)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-ivory-300 font-light leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </p>

                <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500">
                  <span>Somatic Note: {entry.somaticFocus}</span>
                  <div className="flex gap-1">
                    {entry.tags.map((t) => (
                      <span key={t} className="bg-midnight-950 px-2 py-0.5 rounded text-zinc-400 font-mono text-[10px]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SanctuaryShell>
  );
}
