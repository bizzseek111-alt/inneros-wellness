"use client";

import React, { useState, useEffect } from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";
import { BookOpen, Sparkles, Trash2, Plus, Calendar, Check } from "lucide-react";
import { prototypeService, JournalEntry } from "@/lib/prototype-service";
import { api } from "@/lib/api-client";

const GUIDED_PROMPTS = [
  {
    title: "Stepping Back from a Heavy Thought",
    prompt: "Write down a thought that felt heavy today. Try starting with: 'I notice I’m having the thought that...'",
  },
  {
    title: "Three Small Good Moments",
    prompt: "What were three small moments of calm, comfort, or kindness you noticed today?",
  },
  {
    title: "Setting Down Today’s Worries",
    prompt: "What is one worry or task you can give yourself permission to set down until tomorrow?",
  },
];

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [valence, setValence] = useState<
    "reflective" | "calm" | "overwhelmed" | "grateful" | "restless"
  >("reflective");
  const [somaticFocus, setSomaticFocus] = useState("Slow, steady breathing");
  const [tagInput, setTagInput] = useState("reflection");

  useEffect(() => {
    let mounted = true;
    api
      .getJournalEntries()
      .then((rows) => {
        if (!mounted) return;
        const mapped: JournalEntry[] = rows.map((r: any) => ({
          id: r.id,
          title: r.title,
          content: r.content,
          date: new Date(r.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          valence: (r.mood_valence || "reflective") as any,
          energyScore: 7,
          somaticFocus: r.prompt || "Slow, steady breathing",
          isEncrypted: true,
          tags: Array.isArray(r.tags) ? r.tags : ["reflection"],
        }));
        setEntries(mapped);
      })
      .catch(() => {
        if (mounted) {
          setEntries(prototypeService.getState().journal);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveEntry = async () => {
    if (!title.trim() || !content.trim()) return;
    const parsedTags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const saved = await api.createJournalEntry({
        title,
        content,
        prompt: somaticFocus,
        tags: parsedTags,
        mood_valence: valence,
      });
      const mappedEntry: JournalEntry = {
        id: saved.id,
        title: saved.title,
        content: saved.content,
        date: new Date(saved.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        valence: (saved.mood_valence || valence) as any,
        energyScore: 7,
        somaticFocus: saved.prompt || somaticFocus,
        isEncrypted: true,
        tags: saved.tags || parsedTags,
      };
      setEntries((prev) => [mappedEntry, ...prev]);
    } catch {
      const newEntry = prototypeService.addJournalEntry({
        title,
        content,
        valence,
        energyScore: 7,
        somaticFocus,
        tags: parsedTags,
      });
      setEntries((prev) => [newEntry, ...prev]);
    }

    setIsCreating(false);
    setTitle("");
    setContent("");
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteJournalEntry(id);
    } catch {
      prototypeService.deleteJournalEntry(id);
    }
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const applyPrompt = (p: (typeof GUIDED_PROMPTS)[0]) => {
    setTitle(p.title);
    setContent(p.prompt + "\n\n");
    setIsCreating(true);
  };

  return (
    <SanctuaryShell>
      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        {/* Header */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-[#285B55] text-[14px] font-medium">
              <BookOpen className="w-4 h-4" />
              <span>My Journal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#263330]">
              Personal Reflections & Notes
            </h1>
            <p className="text-[15px] text-[#52625E] leading-relaxed">
              A quiet, private space to write down your thoughts, reflect on your day, or follow a gentle prompt.
            </p>
          </div>

          <Button
            size="md"
            variant="primary"
            onClick={() => setIsCreating(!isCreating)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {isCreating ? "Close Editor" : "Write New Entry"}
          </Button>
        </div>

        {/* Guided Prompts Strip */}
        <div className="space-y-2.5">
          <span className="text-[14px] font-medium text-[#52625E] px-1">
            Gentle Writing Prompts (Click any prompt to start)
          </span>
          <div className="grid sm:grid-cols-3 gap-4">
            {GUIDED_PROMPTS.map((gp, i) => (
              <button
                type="button"
                key={i}
                onClick={() => applyPrompt(gp)}
                className="p-5 rounded-3xl bg-white border border-[#E6E0D6] hover:border-[#285B55] transition-all text-left space-y-2 shadow-sm group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-serif font-medium text-[#263330] group-hover:text-[#285B55] transition-colors">
                    {gp.title}
                  </span>
                  <Sparkles className="w-4 h-4 text-[#285B55] flex-shrink-0" />
                </div>
                <p className="text-[14px] text-[#52625E] line-clamp-2 leading-relaxed">
                  {gp.prompt}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* New Reflection Composer Form */}
        {isCreating && (
          <div className="p-6 rounded-3xl bg-white border border-[#285B55]/40 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#F3EFE8] pb-3">
              <span className="text-[16px] font-serif font-medium text-[#263330]">
                New Journal Entry
              </span>
              <Badge variant="sage" size="sm">
                Private Entry
              </Badge>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Give your entry a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-[17px] font-serif font-medium bg-[#FAF8F4] border border-[#D5CFC2] rounded-2xl px-4 py-3 text-[#263330] focus:outline-none focus:border-[#285B55]"
              />

              <div className="grid sm:grid-cols-2 gap-3">
                <select
                  value={valence}
                  onChange={(e) => setValence(e.target.value as any)}
                  aria-label="How are you feeling?"
                  className="rounded-2xl bg-[#FAF8F4] border border-[#D5CFC2] text-[14px] text-[#263330] px-4 py-2.5 focus:outline-none focus:border-[#285B55]"
                >
                  <option value="reflective">Mood: Reflective & Thoughtful</option>
                  <option value="calm">Mood: Calm & Grounded</option>
                  <option value="grateful">Mood: Grateful & Appreciative</option>
                  <option value="overwhelmed">Mood: Overwhelmed & Letting Go</option>
                  <option value="restless">Mood: Restless & Looking for Rest</option>
                </select>

                <input
                  type="text"
                  placeholder="How does your body feel? (e.g., Shoulders relaxed)"
                  value={somaticFocus}
                  onChange={(e) => setSomaticFocus(e.target.value)}
                  className="rounded-2xl bg-[#FAF8F4] border border-[#D5CFC2] text-[14px] text-[#263330] px-4 py-2.5 focus:outline-none focus:border-[#285B55]"
                />
              </div>

              <textarea
                rows={6}
                placeholder="Write freely at your own pace..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-[16px] leading-relaxed bg-[#FAF8F4] border border-[#D5CFC2] rounded-2xl p-4 text-[#263330] focus:outline-none focus:border-[#285B55]"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2.5">
              <Button size="sm" variant="ghost" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleSaveEntry}
                leftIcon={<Check className="w-4 h-4" />}
              >
                Save Entry
              </Button>
            </div>
          </div>
        )}

        {/* Existing Journal Entries List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-[14px] text-[#52625E] px-1">
            <span>Saved Entries ({entries.length})</span>
            <span>You can delete any entry at any time</span>
          </div>

          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-6 rounded-3xl bg-white border border-[#E6E0D6] hover:border-[#CFE2D6] transition-all shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#52625E]">
                      <span className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#285B55]" />
                        <span>{entry.date}</span>
                      </span>
                      <span>&bull;</span>
                      <Badge variant="lavender" size="sm">
                        {entry.valence}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-serif font-medium text-[#263330]">
                      {entry.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 rounded-xl text-[#7A8A85] hover:text-[#A4384B] hover:bg-[#FDF2F2] transition-colors"
                    title="Delete Entry"
                    aria-label="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[16px] text-[#263330] leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </p>

                <div className="pt-3 border-t border-[#F3EFE8] flex flex-wrap items-center justify-between gap-2 text-[13.5px] text-[#52625E]">
                  <span>Body check-in: {entry.somaticFocus}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.tags.map((t) => (
                      <span
                        key={t}
                        className="bg-[#FAF8F4] border border-[#E6E0D6] px-2.5 py-0.5 rounded-full text-[#52625E] text-[13px]"
                      >
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
