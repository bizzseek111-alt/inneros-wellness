"use client";

import React, { useState, useEffect } from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";
import { Target, Plus } from "lucide-react";
import { prototypeService, GrowthGoal } from "@/lib/prototype-service";
import { api } from "@/lib/api-client";

export default function GrowthPage() {
  const [goals, setGoals] = useState<GrowthGoal[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [intention, setIntention] = useState("");
  const [coreValue, setCoreValue] = useState("Kindness & Balance");

  useEffect(() => {
    let mounted = true;
    api
      .getGrowthGoals()
      .then((rows) => {
        if (!mounted) return;
        const mapped: GrowthGoal[] = rows.map((r: any) => ({
          id: r.id,
          horizonTitle: r.title,
          category: (r.category || "boundaries") as any,
          intention: r.why_it_matters || "Moving forward at a sustainable, compassionate pace.",
          coreValue: r.category || "Rest & Boundaries",
          status: (r.status || "active") as any,
          reflectionNotes: "Saved in your personal sanctuary.",
          milestones: Array.isArray(r.steps) ? r.steps : [],
        }));
        setGoals(mapped);
      })
      .catch(() => {
        if (mounted) {
          setGoals(prototypeService.getState().goals);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const toggleMilestone = async (goalId: string, milestoneId: string) => {
    try {
      const updated = await api.toggleGrowthStep(goalId, milestoneId);
      setGoals((prev) =>
        prev.map((g) =>
          g.id === goalId
            ? {
                ...g,
                milestones: Array.isArray(updated.steps) ? updated.steps : g.milestones,
              }
            : g
        )
      );
    } catch {
      const state = prototypeService.getState();
      const targetGoal = state.goals.find((g) => g.id === goalId);
      if (targetGoal) {
        const ms = targetGoal.milestones.find((m) => m.id === milestoneId);
        if (ms) ms.completed = !ms.completed;
        prototypeService.saveState(state);
        setGoals([...state.goals]);
      }
    }
  };

  const handleCreateGoal = async () => {
    if (!title.trim() || !intention.trim()) return;

    const initialSteps = [
      { id: `m_${Date.now()}_1`, label: "Practice one small step this week", completed: false },
      { id: `m_${Date.now()}_2`, label: "Reflect on what felt helpful without judgment", completed: false },
    ];

    try {
      const created = await api.createGrowthGoal({
        title,
        category: coreValue || "Rest & Boundaries",
        why_it_matters: intention,
        steps: initialSteps,
      });
      const mappedGoal: GrowthGoal = {
        id: created.id,
        horizonTitle: created.title,
        category: "boundaries",
        intention: created.why_it_matters,
        coreValue: created.category,
        status: "active",
        reflectionNotes: "Started with a gentle intention today.",
        milestones: created.steps || initialSteps,
      };
      setGoals((prev) => [mappedGoal, ...prev]);
    } catch {
      const state = prototypeService.getState();
      const newGoal: GrowthGoal = {
        id: `goal_${Date.now()}`,
        horizonTitle: title,
        category: "boundaries",
        intention,
        coreValue,
        status: "active",
        reflectionNotes: "Started with a gentle intention today.",
        milestones: initialSteps,
      };
      state.goals.push(newGoal);
      prototypeService.saveState(state);
      setGoals([...state.goals]);
    }

    setIsAdding(false);
    setTitle("");
    setIntention("");
  };

  return (
    <SanctuaryShell>
      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        {/* Header */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-[#285B55] text-[14px] font-medium">
              <Target className="w-4 h-4" />
              <span>My Growth</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#263330]">
              Personal Intentions & Gentle Steps
            </h1>
            <p className="text-[15px] text-[#52625E] leading-relaxed">
              Move toward what matters to you at a calm, realistic pace—with no streaks, pressure, or guilt.
            </p>
          </div>

          <Button
            size="md"
            variant="primary"
            onClick={() => setIsAdding(!isAdding)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {isAdding ? "Cancel" : "Add New Goal"}
          </Button>
        </div>

        {/* New Goal Creator */}
        {isAdding && (
          <div className="p-6 rounded-3xl bg-white border border-[#285B55]/40 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#F3EFE8] pb-3">
              <span className="text-[16px] font-serif font-medium text-[#263330]">
                Set a New Personal Intention
              </span>
              <Badge variant="sage" size="sm">
                At Your Own Pace
              </Badge>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="What would you like to focus on? (e.g., Protecting Quiet Evenings)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-[16px] font-medium bg-[#FAF8F4] border border-[#D5CFC2] rounded-2xl px-4 py-3 text-[#263330] focus:outline-none focus:border-[#285B55]"
              />

              <input
                type="text"
                placeholder="Why does this matter to you? (e.g., Rest, Family, Peace of Mind)"
                value={coreValue}
                onChange={(e) => setCoreValue(e.target.value)}
                className="w-full text-[15px] bg-[#FAF8F4] border border-[#D5CFC2] rounded-2xl px-4 py-2.5 text-[#263330] focus:outline-none focus:border-[#285B55]"
              />

              <textarea
                rows={3}
                placeholder="Describe how you’d like to approach this gently..."
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                className="w-full text-[15px] leading-relaxed bg-[#FAF8F4] border border-[#D5CFC2] rounded-2xl p-4 text-[#263330] focus:outline-none focus:border-[#285B55]"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2.5">
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleCreateGoal}>
                Save Intention
              </Button>
            </div>
          </div>
        )}

        {/* Growth Goals List */}
        <div className="space-y-5">
          {goals.map((g) => (
            <div
              key={g.id}
              className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F3EFE8] pb-4 gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-[13.5px] text-[#52625E]">
                    <span className="text-[#285B55] font-medium capitalize">
                      {g.category}
                    </span>
                    <span>&bull;</span>
                    <span>Important value: {g.coreValue}</span>
                  </div>
                  <h3 className="text-xl font-serif font-medium text-[#263330] mt-1">
                    {g.horizonTitle}
                  </h3>
                </div>
                <Badge variant="sage" size="sm">
                  Active Focus
                </Badge>
              </div>

              <p className="text-[16px] text-[#263330] leading-relaxed">
                {g.intention}
              </p>

              {/* Small Steps Checklist */}
              <div className="space-y-2.5 pt-1">
                <span className="text-[14px] font-medium text-[#52625E]">
                  Small Steps (Click to mark complete)
                </span>
                <div className="space-y-2">
                  {g.milestones.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleMilestone(g.id, m.id)}
                      className="w-full flex items-center space-x-3.5 p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] hover:border-[#285B55]/50 transition-all text-left group"
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[12px] shrink-0 transition-colors ${
                          m.completed
                            ? "bg-[#285B55] text-white border border-[#285B55]"
                            : "border border-[#D5CFC2] bg-white group-hover:border-[#285B55]"
                        }`}
                      >
                        {m.completed ? "✓" : ""}
                      </div>
                      <span
                        className={`text-[15px] transition-colors ${
                          m.completed
                            ? "line-through text-[#7A8A85]"
                            : "text-[#263330]"
                        }`}
                      >
                        {m.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reflection Note */}
              <div className="pt-3 border-t border-[#F3EFE8] text-[14px] text-[#52625E] flex items-center justify-between">
                <span>Note: &ldquo;{g.reflectionNotes}&rdquo;</span>
                <span className="text-[#285B55] font-medium">No rush</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SanctuaryShell>
  );
}
