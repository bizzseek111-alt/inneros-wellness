"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Wind,
  ShieldCheck,
  ExternalLink,
  Play,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Award,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api-client";

interface Citation {
  apa_citation: string;
  doi_or_url?: string;
  study_type: string;
  replication_status: string;
}

interface KnowledgeRecord {
  id: string;
  department: string;
  subfield: string;
  title: string;
  short_summary: string;
  full_explanation: string;
  theoretical_models: string[];
  key_takeaways: string[];
  practical_reflection_prompts?: string[];
  evidence_level: string;
  is_peer_reviewed_scientific: boolean;
  citations: Citation[];
  usage_restrictions: {
    non_clinical_disclaimer: string;
  };
}

import { SEEDED_CLIENT_RECORDS } from "@/lib/knowledge-seed";

export const KnowledgeLibrary: React.FC = () => {
  const [records, setRecords] = useState<KnowledgeRecord[]>(SEEDED_CLIENT_RECORDS as any);
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Pause">("Inhale");
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getKnowledgeRecords();
        if (data && data.length > 0) {
          setRecords(data);
        }
      } catch (e) {
        // Fallback local list already active
      }
    }
    load();
  }, []);

  // 4-4-4-4 Box Breathing timer
  useEffect(() => {
    if (!timerRunning) return;
    const phases: Array<"Inhale" | "Hold" | "Exhale" | "Pause"> = ["Inhale", "Hold", "Exhale", "Pause"];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % phases.length;
      setBreathPhase(phases[idx]);
    }, 4000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const filtered = records.filter((r) => {
    if (selectedDept === "all") return true;
    return r.department === selectedDept;
  });

  const getEvidenceBadge = (level: string, isScientific: boolean) => {
    if (!isScientific || level === "level_7_trade_pop_psychology") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/60 border border-amber-700/60 text-amber-300 flex items-center space-x-1">
          <AlertTriangle className="w-2.5 h-2.5" />
          <span>Level 7: Trade Pop-Psychology</span>
        </span>
      );
    }
    if (level === "level_1_meta_analysis") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-950/60 border border-teal-600/60 text-teal-300 flex items-center space-x-1">
          <Award className="w-2.5 h-2.5" />
          <span>Level 1: Meta-Analysis</span>
        </span>
      );
    }
    if (level === "level_2_rct") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950/60 border border-indigo-600/60 text-indigo-300">
          Level 2: RCT Evidence
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-700 text-zinc-300">
        {level.replace("level_", "Level ").replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Interactive Breathwork Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-950/40 via-midnight-950 to-midnight-900 border border-teal-700/40 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-900/60 border border-teal-600/60 text-teal-300">
              Neuropsychology • Vagal Brake Somatic Exercise
            </span>
            <h3 className="text-xl font-serif font-bold text-ivory-100 flex items-center space-x-2">
              <Wind className="w-5 h-5 text-teal-400" />
              <span>4-4-4-4 Box Breathing Cadence</span>
            </h3>
            <p className="text-xs text-ivory-300/80 leading-relaxed">
              Box breathing stimulates the afferent vagus nerve and activates the parasympathetic ventral vagal complex, stabilizing heart rate variability and down-regulating acute sympathetic cortisol release.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center shrink-0">
            {timerRunning ? (
              <div className="flex flex-col items-center space-y-3">
                <motion.div
                  animate={{
                    scale: breathPhase === "Inhale" ? 1.25 : breathPhase === "Exhale" ? 0.85 : 1.1,
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="w-24 h-24 rounded-full bg-teal-950 border-2 border-teal-400 flex items-center justify-center text-center shadow-[0_0_24px_rgba(52,134,128,0.4)]"
                >
                  <span className="text-xs font-semibold text-teal-200 tracking-wide font-mono">{breathPhase}</span>
                </motion.div>
                <button
                  onClick={() => setTimerRunning(false)}
                  className="text-xs text-ivory-300/60 hover:text-ivory-100 underline"
                >
                  Stop Cadence
                </button>
              </div>
            ) : (
              <button
                onClick={() => setTimerRunning(true)}
                className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center space-x-2 shadow-lg shadow-teal-950 transition-all hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Begin Guided Breathing</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Department Filter Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-serif font-bold text-ivory-100">
            Evidence-Backed Frameworks ({filtered.length})
          </h3>
          <span className="text-[11px] font-mono text-teal-400/80">
            APA 7th Edition Provenance • Zero Invented Citations
          </span>
        </div>

        <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar text-xs">
          {[
            { id: "all", label: "All Evidence" },
            { id: "clinical", label: "Clinical" },
            { id: "neuropsychology", label: "Neuropsychology" },
            { id: "relationship_family_intimacy", label: "Relationship & Intimacy" },
            { id: "positive", label: "Positive Psychology" },
            { id: "counseling", label: "Counseling & Motivation" },
            { id: "cognitive", label: "Cognitive Reappraisal" },
            { id: "behavioral", label: "Behavioral" },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDept(d.id)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all border ${
                selectedDept === d.id
                  ? "bg-teal-950/80 border-teal-500 text-teal-200 shadow-sm"
                  : "bg-midnight-950 border-white/[0.08] text-ivory-300/60 hover:text-ivory-100"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((record) => {
          const isExpanded = expandedRecordId === record.id;
          return (
            <div
              key={record.id}
              className={`p-5 rounded-2xl border transition-all ${
                isExpanded
                  ? "bg-midnight-950 border-teal-500/50 md:col-span-2 shadow-2xl"
                  : "bg-midnight-950/70 border-white/[0.08] hover:border-white/20"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase text-teal-400 tracking-wider">
                  {record.department.replace(/_/g, " ")} • {record.subfield}
                </span>
                {getEvidenceBadge(record.evidence_level, record.is_peer_reviewed_scientific)}
              </div>

              <h4 className="font-serif font-bold text-ivory-100 text-base mb-1.5">
                {record.title}
              </h4>

              <p className="text-xs text-ivory-300/80 leading-relaxed mb-3">
                {record.short_summary}
              </p>

              {/* Theoretical Models Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {record.theoretical_models.map((tm, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] border border-white/[0.06] text-ivory-200"
                  >
                    {tm}
                  </span>
                ))}
              </div>

              {/* Expandable Section */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-3 border-t border-white/[0.08]"
                  >
                    <div>
                      <h5 className="text-[11px] font-mono uppercase tracking-wider text-teal-400 mb-1">
                        In-Depth Scientific Mechanism
                      </h5>
                      <p className="text-xs text-ivory-200 leading-relaxed bg-midnight-900/60 p-3 rounded-xl border border-white/[0.04]">
                        {record.full_explanation}
                      </p>
                    </div>

                    {record.practical_reflection_prompts && record.practical_reflection_prompts.length > 0 && (
                      <div>
                        <h5 className="text-[11px] font-mono uppercase tracking-wider text-teal-400 mb-1">
                          Personal Reflection Inquiries
                        </h5>
                        <ul className="space-y-1.5">
                          {record.practical_reflection_prompts.map((p, pIdx) => (
                            <li
                              key={pIdx}
                              className="text-xs text-ivory-200 flex items-start space-x-2 bg-midnight-900/40 p-2 rounded-lg"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Verified APA Citations */}
                    <div>
                      <h5 className="text-[11px] font-mono uppercase tracking-wider text-teal-400 mb-1">
                        Source Provenance & Literature Citation
                      </h5>
                      <div className="space-y-2">
                        {record.citations.map((c, cIdx) => (
                          <div
                            key={cIdx}
                            className="text-xs bg-midnight-900/80 border border-white/[0.06] p-2.5 rounded-xl font-mono text-ivory-200"
                          >
                            <p className="font-sans leading-relaxed">{c.apa_citation}</p>
                            {c.doi_or_url && (
                              <div className="pt-1 mt-1 border-t border-white/[0.04] text-[10px]">
                                <a
                                  href={c.doi_or_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-teal-400 hover:underline inline-flex items-center space-x-1"
                                >
                                  <span>{c.doi_or_url}</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Card Footer */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-[11px] text-ivory-300/50 font-mono">
                  {record.citations.length} Verified Citation{record.citations.length > 1 ? "s" : ""}
                </span>

                <button
                  onClick={() => setExpandedRecordId(isExpanded ? null : record.id)}
                  className="text-teal-400 hover:text-teal-300 font-mono text-xs flex items-center space-x-1"
                >
                  <span>{isExpanded ? "Collapse" : "Explore Scientific Mechanism"}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
