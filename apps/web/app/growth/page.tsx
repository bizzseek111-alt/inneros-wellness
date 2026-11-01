"use client";

import React, { useState, useEffect } from "react";
import { SanctuaryShell } from "@/components/shell/SanctuaryShell";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";
import { Target, Heart, CheckCircle2, Circle, Plus, Compass, Sparkles, ArrowRight } from "lucide-react";
import { prototypeService, GrowthGoal } from "@/lib/prototype-service";

export default function GrowthPage() {
  const [goals, setGoals] = useState<GrowthGoal[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [intention, setIntention] = useState("");
  const [coreValue, setCoreValue] = useState("Intentional Craftsmanship");

  useEffect(() => {
    setGoals(prototypeService.getState().goals);
  }, []);

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const state = prototypeService.getState();
    const targetGoal = state.goals.find((g) => g.id === goalId);
    if (targetGoal) {
      const ms = targetGoal.milestones.find((m) => m.id === milestoneId);
      if (ms) ms.completed = !ms.completed;
      prototypeService.saveState(state);
      setGoals([...state.goals]);
    }
  };

  const handleCreateGoal = () => {
    if (!title.trim() || !intention.trim()) return;

    const state = prototypeService.getState();
    const newGoal: GrowthGoal = {
      id: `goal_${Date.now()}`,
      horizonTitle: title,
      category: "boundaries",
      intention,
      coreValue,
      status: "active",
      reflectionNotes: "Intention anchored today.",
      milestones: [
        { id: `m_${Date.now()}_1`, label: "Establish initial boundary ritual", completed: false },
        { id: `m_${Date.now()}_2`, label: "Notice bodily resistance without self-criticism", completed: false },
      ],
    };

    state.goals.push(newGoal);
    prototypeService.saveState(state);
    setGoals([...state.goals]);
    setIsAdding(false);
    setTitle("");
    setIntention("");
  };

  return (
    <SanctuaryShell>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.08] pb-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-mono uppercase tracking-widest">
              <Target className="w-4 h-4" />
              <span>Compassionate Growth Plans</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-normal text-ivory-100 tracking-tight">
              Values-Based Growth Horizons
            </h1>
            <p className="text-xs sm:text-sm text-ivory-400 font-light leading-relaxed">
              Pacing rooted in self-compassion rather than performance anxiety. Zero punitive streaks, zero gamified guilt.
            </p>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAdding(!isAdding)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            {isAdding ? "Cancel" : "New Horizon"}
          </Button>
        </div>

        {/* New Goal Creator */}
        {isAdding && (
          <div className="p-6 rounded-3xl bg-midnight-900 border border-teal-700/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="text-xs font-semibold text-ivory-100">Anchor New Growth Horizon</span>
              <Badge variant="teal" size="sm">
                Values Aligned
              </Badge>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Horizon Title (e.g. Non-Reactive Communication Pacing)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm font-medium bg-midnight-950 border border-white/[0.1] rounded-xl px-4 py-2.5 text-ivory-100 focus:outline-none focus:border-teal-500"
              />

              <input
                type="text"
                placeholder="Core Value (e.g. Biological Equilibrium, Sovereignty, Craft)"
                value={coreValue}
                onChange={(e) => setCoreValue(e.target.value)}
                className="w-full text-xs bg-midnight-950 border border-white/[0.1] rounded-xl px-4 py-2.5 text-ivory-100 focus:outline-none focus:border-teal-500"
              />

              <textarea
                rows={3}
                placeholder="Describe your compassionate intention for this area..."
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                className="w-full text-xs leading-relaxed bg-midnight-950 border border-white/[0.1] rounded-xl p-4 text-ivory-100 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleCreateGoal}>
                Save Growth Horizon
              </Button>
            </div>
          </div>
        )}

        {/* Growth Horizons Grid */}
        <div className="space-y-6">
          {goals.map((g) => (
            <div
              key={g.id}
              className="p-6 rounded-3xl bg-midnight-900/90 border border-white/[0.08] shadow-md space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.06] pb-4 gap-2">
                <div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-mono text-[10px] text-teal-400 uppercase tracking-widest">
                      Horizon &bull; {g.category}
                    </span>
                    <span className="text-zinc-600">&bull;</span>
                    <span className="text-xs text-zinc-400">Anchor: {g.coreValue}</span>
                  </div>
                  <h3 className="text-lg font-serif font-medium text-ivory-100 mt-1">
                    {g.horizonTitle}
                  </h3>
                </div>
                <Badge variant="teal" size="sm">
                  Active Practice
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-ivory-300 font-light leading-relaxed">
                {g.intention}
              </p>

              {/* Milestones Checklist */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-mono text-zinc-500 uppercase">
                  Intentional Milestones (Click to toggle)
                </span>
                <div className="space-y-2">
                  {g.milestones.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleMilestone(g.id, m.id)}
                      className="w-full flex items-center space-x-3 p-3 rounded-2xl bg-midnight-950/80 border border-white/[0.05] hover:border-white/[0.12] transition-all text-left group"
                    >
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 transition-colors ${
                          m.completed
                            ? "bg-teal-900 text-teal-300 border border-teal-600"
                            : "border border-zinc-600 group-hover:border-teal-400"
                        }`}
                      >
                        {m.completed ? "✓" : ""}
                      </div>
                      <span
                        className={`text-xs transition-colors ${
                          m.completed ? "line-through text-zinc-500" : "text-ivory-200"
                        }`}
                      >
                        {m.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reflection Notes */}
              <div className="pt-3 border-t border-white/[0.06] text-xs text-zinc-400 flex items-center justify-between">
                <span>Recent Insight: &ldquo;{g.reflectionNotes}&rdquo;</span>
                <span className="font-mono text-[10px] text-teal-400">Values Harmonized</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SanctuaryShell>
  );
}
