"use client";

import React, { useState, useEffect } from "react";
import {
  GitBranch,
  ShieldCheck,
  Sparkles,
  Search,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  PauseCircle,
  PlayCircle,
  Download,
  Clock,
  Layers,
  Heart,
  Briefcase,
  Target,
  Compass,
  Activity,
  Plus,
  Bookmark,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import {
  api,
  MemoryRecord,
  LifeGraphNode,
  LifeGraphEdge,
  UserMemoryConsent,
  MemoryAuditLogEntry,
} from "@/lib/api-client";
import {
  SEEDED_CLIENT_MEMORIES,
  SEEDED_CLIENT_NODES,
  SEEDED_CLIENT_EDGES,
  SEEDED_CLIENT_CONSENT,
} from "@/lib/memory-seed";

interface LifeGraphVisualizerProps {
  initialActiveTab?: "ledger" | "graph" | "privacy";
}

const HUMAN_CATEGORY_LABELS: Record<string, string> = {
  all: "All Memories",
  communication_preferences: "How I Like to Talk",
  personal_goals: "Personal Goals",
  user_confirmed_life_events: "Important Life Moments",
  habits_and_routines: "Routines & Habits",
  work_and_career_information: "Work & Daily Life",
  relationships_and_family_context: "Important People",
  self_reported_emotions: "Feelings Shared",
  coping_preferences: "What Helps Me Feel Calm",
  optional_sensitive_health_related_information: "Wellbeing & Rest Notes",
};

export const LifeGraphVisualizer: React.FC<LifeGraphVisualizerProps> = ({
  initialActiveTab = "ledger",
}) => {
  const [activeTab, setActiveTab] = useState<"ledger" | "graph" | "privacy">(
    initialActiveTab
  );
  const [nodes, setNodes] = useState<LifeGraphNode[]>(SEEDED_CLIENT_NODES);
  const [edges, setEdges] = useState<LifeGraphEdge[]>(SEEDED_CLIENT_EDGES);
  const [memories, setMemories] = useState<MemoryRecord[]>(SEEDED_CLIENT_MEMORIES);
  const [consent, setConsent] = useState<UserMemoryConsent>(SEEDED_CLIENT_CONSENT);
  const [auditLogs, setAuditLogs] = useState<MemoryAuditLogEntry[]>([]);

  // Selection & Inspector State
  const [selectedNode, setSelectedNode] = useState<LifeGraphNode | null>(
    SEEDED_CLIENT_NODES[0] || null
  );

  // Editing Memory State
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  const [editedStatement, setEditedStatement] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [filterTentativeOnly, setFilterTentativeOnly] = useState(false);

  // Modals & Actions
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
  const [purgeConfirmText, setPurgeConfirmText] = useState("");
  const [isAddingNodeModalOpen, setIsAddingNodeModalOpen] = useState(false);
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [newNodeType, setNewNodeType] = useState<any>("habit");
  const [newNodeDesc, setNewNodeDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load backend data
  const fetchData = async () => {
    try {
      const [graphData, mems, consentData, logs] = await Promise.all([
        api.getLifeGraph().catch(() => null),
        api.getMemoryRecords().catch(() => null),
        api.getMemoryConsent().catch(() => null),
        api.getMemoryAuditLogs().catch(() => []),
      ]);

      if (graphData && graphData.nodes) {
        setNodes(graphData.nodes);
        setEdges(graphData.edges);
        if (!selectedNode && graphData.nodes.length > 0) {
          setSelectedNode(graphData.nodes[0]);
        }
      }
      if (mems && mems.length > 0) setMemories(mems);
      if (consentData) setConsent(consentData);
      if (logs) setAuditLogs(logs);
    } catch (err) {
      console.warn("Backend unavailable, using initial state:", err);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtered memory list
  const filteredMemories = memories.filter((m) => {
    if (selectedCategoryFilter !== "all" && m.category !== selectedCategoryFilter)
      return false;
    if (filterTentativeOnly && m.record_type !== "tentative_ai_interpretation")
      return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.fact_statement.toLowerCase().includes(q) ||
        (m.tags && m.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  // Staged suggestions awaiting user approval
  const suggestedMemories = memories.filter((m) => m.status === "suggested");

  // Actions
  const handleConfirmSuggestion = async (id: string, customStatement?: string) => {
    try {
      await api.handleSuggestionAction(id, "confirm", customStatement);
      setMemories((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                status: "confirmed",
                record_type: "stored_fact",
                certainty_level: "user_verified",
                confidence_score: 1.0,
                fact_statement: customStatement || m.fact_statement,
              }
            : m
        )
      );
      setNodes((prev) =>
        prev.map((n) =>
          n.linked_memory_id === id
            ? { ...n, is_tentative: false, record_type: "stored_fact" }
            : n
        )
      );
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectSuggestion = async (id: string) => {
    try {
      await api.handleSuggestionAction(id, "reject");
      setMemories((prev) => prev.filter((m) => m.id !== id));
      setNodes((prev) => prev.filter((n) => n.linked_memory_id !== id));
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEditing = (mem: MemoryRecord) => {
    setEditingMemoryId(mem.id);
    setEditedStatement(mem.fact_statement);
  };

  const handleSaveEditedMemory = async (id: string) => {
    if (!editedStatement.trim()) return;
    try {
      await api.updateMemoryRecord(id, { fact_statement: editedStatement.trim() });
    } catch {
      // Local fallback
    }
    setMemories((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, fact_statement: editedStatement.trim() } : m
      )
    );
    setEditingMemoryId(null);
    setEditedStatement("");
  };

  const handleDeleteNode = async (nodeId: string) => {
    try {
      await api.deleteLifeGraphNode(nodeId);
      setNodes((prev) => prev.filter((n) => n.id !== nodeId));
      setEdges((prev) =>
        prev.filter(
          (e) => e.source_node_id !== nodeId && e.target_node_id !== nodeId
        )
      );
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMemory = async (memoryId: string) => {
    try {
      await api.forgetMemory(memoryId);
      setMemories((prev) => prev.filter((m) => m.id !== memoryId));
      setNodes((prev) => prev.filter((n) => n.linked_memory_id !== memoryId));
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePauseMemory = async () => {
    try {
      if (consent.is_memory_recording_paused) {
        const updated = await api.resumeMemory();
        setConsent(updated);
      } else {
        const updated = await api.pauseMemory();
        setConsent(updated);
      }
    } catch {
      setConsent((prev) => ({
        ...prev,
        is_memory_recording_paused: !prev.is_memory_recording_paused,
      }));
    }
  };

  const handleToggleSensitiveConsent = async () => {
    try {
      const updated = await api.updateMemoryConsent({
        sensitive_health_consent_granted: !consent.sensitive_health_consent_granted,
      });
      setConsent(updated);
    } catch {
      setConsent((prev) => ({
        ...prev,
        sensitive_health_consent_granted: !prev.sensitive_health_consent_granted,
      }));
    }
  };

  const handleExportData = async () => {
    try {
      const bundle = await api.exportPersonalData();
      const blob = new Blob([JSON.stringify(bundle, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inneros_memories_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      const fallbackBundle = {
        user_id: consent.user_id,
        export_timestamp: new Date().toISOString(),
        format_version: "2.0.0",
        memory_records: memories,
        life_graph_nodes: nodes,
        life_graph_edges: edges,
        consent_settings: consent,
      };
      const blob = new Blob([JSON.stringify(fallbackBundle, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inneros_memories_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleExecuteNuclearPurge = async () => {
    const normalized = purgeConfirmText.trim().toUpperCase();
    if (normalized !== "CLEAR ALL" && normalized !== "PURGE MY MEMORY") return;
    setIsSubmitting(true);
    try {
      await api.purgeAllMemory();
    } catch (err) {
      console.error(err);
    } finally {
      setNodes([]);
      setEdges([]);
      setMemories([]);
      setSelectedNode(null);
      setIsPurgeModalOpen(false);
      setPurgeConfirmText("");
      setIsSubmitting(false);
    }
  };

  const handleCreateNode = async () => {
    if (!newNodeLabel.trim()) return;
    try {
      const created = await api.createLifeGraphNode({
        label: newNodeLabel,
        node_type: newNodeType,
        description: newNodeDesc || "Added by you",
        record_type: "stored_fact",
        emotional_charge:
          newNodeType === "stress_trigger" ? "challenging" : "positive",
      });
      setNodes((prev) => [...prev, created]);
      setSelectedNode(created);
      setIsAddingNodeModalOpen(false);
      setNewNodeLabel("");
      setNewNodeDesc("");
    } catch {
      const fallbackNode: LifeGraphNode = {
        id: `node_user_${Date.now()}`,
        user_id: consent.user_id,
        label: newNodeLabel,
        node_type: newNodeType,
        description: newNodeDesc || "Added by you",
        record_type: "stored_fact",
        emotional_charge:
          newNodeType === "stress_trigger" ? "challenging" : "positive",
        is_tentative: false,
        created_at: new Date().toISOString(),
      };
      setNodes((prev) => [...prev, fallbackNode]);
      setSelectedNode(fallbackNode);
      setIsAddingNodeModalOpen(false);
      setNewNodeLabel("");
      setNewNodeDesc("");
    }
  };

  // Node position helper (calm circular layout)
  const getNodeCoordinates = (index: number, total: number) => {
    const radius = 165;
    const centerX = 300;
    const centerY = 230;
    if (total === 1) return { x: centerX, y: centerY };
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "role":
        return <Briefcase className="w-4 h-4 text-[#285B55]" />;
      case "habit":
        return <Clock className="w-4 h-4 text-[#5A4878]" />;
      case "relationship":
        return <Heart className="w-4 h-4 text-[#A4384B]" />;
      case "stress_trigger":
        return <Activity className="w-4 h-4 text-[#9A5B1A]" />;
      case "value":
        return <Compass className="w-4 h-4 text-[#285B55]" />;
      case "goal":
        return <Target className="w-4 h-4 text-[#285B55]" />;
      default:
        return <Bookmark className="w-4 h-4 text-[#285B55]" />;
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Warm Header Card */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F1EB] border border-[#CFE2D6] flex items-center justify-center text-[#285B55] flex-shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-medium text-[#263330]">
              Things I Remember
            </h1>
            <p className="text-[15px] text-[#52625E] mt-1 leading-relaxed">
              Your personal notes, preferences, and goals. You are always in control of what is saved, edited, or forgotten.
            </p>
          </div>
        </div>

        {/* Simple Human Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleTogglePauseMemory}
            className={`px-4 py-2.5 rounded-2xl border text-[14px] font-medium transition-all flex items-center space-x-2 ${
              consent.is_memory_recording_paused
                ? "bg-[#FDF3E3] border-[#F0D9B5] text-[#8F5319]"
                : "bg-[#E8F1EB] border-[#CFE2D6] text-[#285B55] hover:bg-[#D5E6DC]"
            }`}
          >
            {consent.is_memory_recording_paused ? (
              <>
                <PauseCircle className="w-4 h-4 text-[#B86E24]" />
                <span>Remembering Paused</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4 text-[#285B55]" />
                <span>Remembering Active</span>
              </>
            )}
          </button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportData}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download My Data
          </Button>

          <Button
            size="sm"
            variant="emergency"
            onClick={() => setIsPurgeModalOpen(true)}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* 2. Gentle Suggested Memories Card (Replaces Alarming Amber Warning) */}
      {suggestedMemories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-[#F7E7E2] border border-[#EED2C9] shadow-sm space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5 text-[#7A4434]">
              <Sparkles className="w-5 h-5 text-[#9A5542]" />
              <h2 className="text-[16px] font-serif font-medium text-[#263330]">
                Things you mentioned that you might like me to remember ({suggestedMemories.length})
              </h2>
            </div>
            <span className="text-[13px] text-[#52625E]">
              Nothing is saved to your memories without your permission
            </span>
          </div>

          <div className="grid gap-3">
            {suggestedMemories.map((sugg) => (
              <div
                key={sugg.id}
                className="p-5 rounded-2xl bg-white border border-[#E6E0D6] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <Badge variant="peach" size="sm">
                      Suggested Note
                    </Badge>
                    <span className="text-[13px] text-[#52625E] font-medium">
                      {HUMAN_CATEGORY_LABELS[sugg.category] ||
                        sugg.category.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-[16px] text-[#263330] font-medium leading-relaxed">
                    {sugg.fact_statement}
                  </p>
                  {sugg.provenance?.source_quote && (
                    <p className="text-[14px] text-[#52625E] italic font-serif">
                      From our conversation: &ldquo;{sugg.provenance.source_quote}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2.5 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleConfirmSuggestion(sugg.id)}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Save to Memories
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRejectSuggestion(sugg.id)}
                    leftIcon={<XCircle className="w-4 h-4" />}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 3. Friendly Navigation Tabs (List View Default, Connections Optional) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E6E0D6] pb-3">
        <button
          onClick={() => setActiveTab("ledger")}
          className={`px-4 py-2.5 rounded-2xl text-[14px] font-medium transition-all flex items-center space-x-2 ${
            activeTab === "ledger"
              ? "bg-[#285B55] text-white shadow-sm"
              : "bg-white border border-[#E6E0D6] text-[#52625E] hover:text-[#263330] hover:bg-[#F3EFE8]"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Saved Memories ({memories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("graph")}
          className={`px-4 py-2.5 rounded-2xl text-[14px] font-medium transition-all flex items-center space-x-2 ${
            activeTab === "graph"
              ? "bg-[#285B55] text-white shadow-sm"
              : "bg-white border border-[#E6E0D6] text-[#52625E] hover:text-[#263330] hover:bg-[#F3EFE8]"
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>View Connections ({nodes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("privacy")}
          className={`px-4 py-2.5 rounded-2xl text-[14px] font-medium transition-all flex items-center space-x-2 ${
            activeTab === "privacy"
              ? "bg-[#285B55] text-white shadow-sm"
              : "bg-white border border-[#E6E0D6] text-[#52625E] hover:text-[#263330] hover:bg-[#F3EFE8]"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Memory Settings & History</span>
        </button>
      </div>

      {/* 4. Tab 1 (Default): Readable Saved Memories List / Cards */}
      {activeTab === "ledger" && (
        <div className="space-y-5">
          {/* Search & Category Filter Bar */}
          <div className="p-4 rounded-2xl bg-white border border-[#E6E0D6] shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3 flex-1 min-w-[240px]">
              <Search className="w-5 h-5 text-[#7A8A85]" />
              <input
                type="text"
                placeholder="Search your saved memories or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-[15px] text-[#263330] placeholder-[#7A8A85] focus:outline-none w-full"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                aria-label="Filter memories by category"
                className="bg-[#FAF8F4] border border-[#E6E0D6] rounded-xl px-3.5 py-2 text-[14px] text-[#263330] focus:outline-none focus:border-[#285B55]"
              >
                {Object.entries(HUMAN_CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>

              <label className="flex items-center space-x-2 text-[14px] text-[#52625E] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filterTentativeOnly}
                  onChange={(e) => setFilterTentativeOnly(e.target.checked)}
                  className="rounded border-[#D5CFC2] text-[#285B55] focus:ring-[#285B55]"
                />
                <span>Unconfirmed suggestions only</span>
              </label>
            </div>
          </div>

          {/* Memory Cards List */}
          <div className="grid gap-4">
            {filteredMemories.map((mem) => {
              const isEditing = editingMemoryId === mem.id;
              return (
                <div
                  key={mem.id}
                  className="p-6 rounded-3xl bg-white border border-[#E6E0D6] hover:border-[#CFE2D6] transition-all shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F3EFE8] pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={
                          mem.record_type === "stored_fact" ? "sage" : "peach"
                        }
                        size="sm"
                      >
                        {mem.record_type === "stored_fact"
                          ? "Confirmed by You"
                          : "Suggested Note"}
                      </Badge>
                      <span className="text-[14px] font-medium text-[#52625E]">
                        {HUMAN_CATEGORY_LABELS[mem.category] ||
                          mem.category.replace(/_/g, " ")}
                      </span>
                    </div>

                    <span className="text-[13px] text-[#7A8A85]">
                      {mem.certainty_level === "user_verified"
                        ? "Shared directly by you"
                        : "Noted from conversation"}
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3 pt-1">
                      <textarea
                        rows={2}
                        value={editedStatement}
                        onChange={(e) => setEditedStatement(e.target.value)}
                        className="w-full rounded-2xl bg-[#FAF8F4] border border-[#285B55] p-3.5 text-[16px] text-[#263330] focus:outline-none"
                      />
                      <div className="flex items-center space-x-2">
                        <Button
                          size="xs"
                          variant="primary"
                          onClick={() => handleSaveEditedMemory(mem.id)}
                          leftIcon={<Check className="w-3.5 h-3.5" />}
                        >
                          Save Changes
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => setEditingMemoryId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[16.5px] text-[#263330] font-normal leading-relaxed">
                      {mem.fact_statement}
                    </p>
                  )}

                  {mem.raw_context && !isEditing && (
                    <p className="text-[14px] text-[#52625E] italic">
                      Note: {mem.raw_context}
                    </p>
                  )}

                  {/* Footer with Tags & Friendly Actions */}
                  <div className="flex flex-wrap items-center justify-between pt-2 gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {mem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[13px] px-3 py-1 rounded-full bg-[#FAF8F4] border border-[#E6E0D6] text-[#52625E]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2">
                      {!isEditing && (
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => handleStartEditing(mem)}
                          leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                        >
                          Edit
                        </Button>
                      )}
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleDeleteMemory(mem.id)}
                        leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                      >
                        Forget
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredMemories.length === 0 && (
              <div className="p-12 rounded-3xl bg-white border border-[#E6E0D6] text-center space-y-2">
                <p className="text-[16px] font-medium text-[#263330]">
                  No memories match your search
                </p>
                <p className="text-[14px] text-[#52625E]">
                  Try clearing your search filter or adding a new note.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Tab 2 (Optional): Visual Connections (Warm Light Life Graph) */}
      {activeTab === "graph" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Warm Light Graph Canvas */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[540px]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F3EFE8] pb-4 z-10">
              <div>
                <h3 className="text-[17px] font-serif font-medium text-[#263330]">
                  How Your Habits, Goals & People Connect
                </h3>
                <p className="text-[13.5px] text-[#52625E]">
                  Select any card below to see how it supports your everyday wellbeing
                </p>
              </div>

              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsAddingNodeModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Connection
              </Button>
            </div>

            {/* SVG Visualizer with Soft Sage & Lavender Curves */}
            <div className="relative w-full h-[420px] flex items-center justify-center bg-[#FAF8F4] rounded-2xl my-3 border border-[#F3EFE8]">
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="warmEdgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#285B55" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#7C639E" stopOpacity="0.35" />
                  </linearGradient>
                </defs>

                {edges.map((edge) => {
                  const sourceIndex = nodes.findIndex((n) => n.id === edge.source_node_id);
                  const targetIndex = nodes.findIndex((n) => n.id === edge.target_node_id);
                  if (sourceIndex === -1 || targetIndex === -1) return null;

                  const sourceCoords = getNodeCoordinates(sourceIndex, nodes.length);
                  const targetCoords = getNodeCoordinates(targetIndex, nodes.length);

                  return (
                    <g key={edge.id}>
                      <path
                        d={`M ${sourceCoords.x} ${sourceCoords.y} Q ${(sourceCoords.x + targetCoords.x) / 2} ${(sourceCoords.y + targetCoords.y) / 2 - 25} ${targetCoords.x} ${targetCoords.y}`}
                        stroke={edge.is_tentative ? "#D97706" : "url(#warmEdgeGradient)"}
                        strokeWidth={edge.is_tentative ? 1.75 : 2.25}
                        strokeDasharray={edge.is_tentative ? "5 5" : "none"}
                        fill="none"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Positioned Nodes */}
              {nodes.map((node, index) => {
                const coords = getNodeCoordinates(index, nodes.length);
                const isSelected = selectedNode?.id === node.id;

                return (
                  <motion.div
                    key={node.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedNode(node)}
                    style={{
                      position: "absolute",
                      left: coords.x - 75,
                      top: coords.y - 36,
                      width: 150,
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer select-none transition-all shadow-sm ${
                      isSelected
                        ? "bg-[#E8F1EB] border-[#285B55] ring-2 ring-[#285B55]/25 scale-105 z-20"
                        : node.is_tentative
                        ? "bg-[#F7E7E2] border-dashed border-[#D99B88] text-[#263330]"
                        : "bg-white border-[#E6E0D6] text-[#263330] hover:border-[#285B55]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center space-x-1.5">
                        {getNodeIcon(node.node_type)}
                        <span className="text-[12px] font-medium capitalize text-[#52625E]">
                          {node.node_type.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>
                    <h4 className="text-[14px] font-semibold text-[#263330] truncate">
                      {node.label}
                    </h4>
                  </motion.div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-between pt-2 text-[13px] text-[#52625E]">
              <div className="flex items-center space-x-5">
                <span className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#E8F1EB] border border-[#285B55]" />
                  <span>Confirmed by you</span>
                </span>
                <span className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#F7E7E2] border border-dashed border-[#9A5542]" />
                  <span>Suggested connection</span>
                </span>
              </div>
              <span>Click any item to view details</span>
            </div>
          </div>

          {/* Selected Node Details Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-5 flex flex-col justify-between">
            {selectedNode ? (
              <div className="space-y-4">
                <div className="border-b border-[#F3EFE8] pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium capitalize text-[#285B55] flex items-center space-x-1.5">
                      {getNodeIcon(selectedNode.node_type)}
                      <span>{selectedNode.node_type.replace(/_/g, " ")}</span>
                    </span>
                    <Badge
                      variant={selectedNode.is_tentative ? "peach" : "sage"}
                      size="sm"
                    >
                      {selectedNode.is_tentative ? "Suggested" : "Saved"}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-serif text-[#263330] font-medium">
                    {selectedNode.label}
                  </h3>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[13px] font-medium text-[#52625E]">
                    Why this matters to you
                  </span>
                  <p className="text-[15px] text-[#263330] leading-relaxed">
                    {selectedNode.description}
                  </p>
                </div>

                {/* Connected Items */}
                <div className="space-y-2 pt-2">
                  <span className="text-[13px] font-medium text-[#52625E]">
                    Connected with
                  </span>
                  <div className="space-y-2 max-h-44 overflow-y-auto">
                    {edges
                      .filter(
                        (e) =>
                          e.source_node_id === selectedNode.id ||
                          e.target_node_id === selectedNode.id
                      )
                      .map((edge) => {
                        const otherNodeId =
                          edge.source_node_id === selectedNode.id
                            ? edge.target_node_id
                            : edge.source_node_id;
                        const otherNode = nodes.find((n) => n.id === otherNodeId);

                        return (
                          <div
                            key={edge.id}
                            className="p-3 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] flex items-center justify-between text-[14px]"
                          >
                            <span className="text-[#285B55] font-medium capitalize">
                              {edge.relation.replace(/_/g, " ")}
                            </span>
                            <span className="text-[#263330] font-medium truncate max-w-[150px]">
                              {otherNode?.label || otherNodeId}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#52625E]">
                <Sparkles className="w-8 h-8 mb-2 text-[#285B55]/50" />
                <p className="text-[15px]">
                  Select any card on the canvas to see how it connects to your daily life.
                </p>
              </div>
            )}

            {selectedNode && (
              <div className="pt-4 border-t border-[#F3EFE8]">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleDeleteNode(selectedNode.id)}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                >
                  Remove This Connection
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Tab 3: Memory Settings & Activity History */}
      {activeTab === "privacy" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-medium text-[#263330]">
                Your Memory Preferences
              </h3>
              <p className="text-[15px] text-[#52625E]">
                Choose what your companion is allowed to remember from your conversations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Wellbeing & Rest Notes Opt-in */}
              <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[15px] font-semibold text-[#263330] block">
                    Remember Sleep & Stress Notes
                  </span>
                  <p className="text-[#52625E] text-[14px] leading-relaxed">
                    Allow your companion to remember sleep habits, energy patterns, or what helps you unwind.
                  </p>
                </div>
                <button
                  onClick={handleToggleSensitiveConsent}
                  aria-label="Toggle remembering sleep and stress notes"
                  className={`w-12 h-7 rounded-full transition-colors relative flex-shrink-0 ${
                    consent.sensitive_health_consent_granted
                      ? "bg-[#285B55]"
                      : "bg-[#D5CFC2]"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      consent.sensitive_health_consent_granted
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Pause Remembering */}
              <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[15px] font-semibold text-[#263330] block">
                    Remember New Things From Chats
                  </span>
                  <p className="text-[#52625E] text-[14px] leading-relaxed">
                    Turn this off anytime to chat without creating new memory suggestions.
                  </p>
                </div>
                <button
                  onClick={handleTogglePauseMemory}
                  aria-label="Toggle remembering new things"
                  className={`w-12 h-7 rounded-full transition-colors relative flex-shrink-0 ${
                    !consent.is_memory_recording_paused
                      ? "bg-[#285B55]"
                      : "bg-[#D5CFC2]"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      !consent.is_memory_recording_paused
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Memory Changes */}
          <div className="p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#F3EFE8] pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#285B55]" />
                <h3 className="text-[16px] font-serif font-medium text-[#263330]">
                  Recent Memory Activity
                </h3>
              </div>
              <span className="text-[13px] text-[#52625E]">
                A clear record of additions, edits, and deletions
              </span>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto">
              {auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E6E0D6] flex items-center justify-between text-[14px]"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge variant="sage" size="sm">
                        {log.action.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-[#263330] font-medium">
                        {log.target_type.replace(/_/g, " ")}
                      </span>
                    </div>
                    <span className="text-[#52625E] text-[13px]">
                      {new Date(log.timestamp).toLocaleTimeString()} &bull;{" "}
                      {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-[#52625E] text-[15px]">
                  Whenever you confirm, edit, or delete a memory, it will appear in your activity history here.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. Clear All Memories Modal */}
      {isPurgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263330]/40 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-xl space-y-4">
            <h3 className="text-xl font-serif font-medium text-[#263330]">
              Clear All Saved Memories?
            </h3>

            <p className="text-[15px] text-[#52625E] leading-relaxed">
              This will permanently remove all saved memories and connections from your profile.{" "}
              <strong>This action cannot be undone.</strong>
            </p>

            <div className="space-y-2">
              <label className="text-[14px] font-medium text-[#263330] block">
                Type <strong>CLEAR ALL</strong> to confirm:
              </label>
              <input
                type="text"
                value={purgeConfirmText}
                onChange={(e) => setPurgeConfirmText(e.target.value)}
                placeholder="CLEAR ALL"
                className="w-full text-[15px] bg-[#FAF8F4] border border-[#D5CFC2] rounded-xl px-4 py-2.5 text-[#263330] focus:outline-none focus:border-[#A4384B]"
              />
            </div>

            <div className="flex justify-end space-x-2.5 pt-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsPurgeModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="emergency"
                disabled={
                  (purgeConfirmText.trim().toUpperCase() !== "CLEAR ALL" &&
                    purgeConfirmText.trim().toUpperCase() !== "PURGE MY MEMORY") ||
                  isSubmitting
                }
                onClick={handleExecuteNuclearPurge}
              >
                {isSubmitting ? "Clearing..." : "Clear All Memories"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Add Connection Modal */}
      {isAddingNodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263330]/40 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-[#E6E0D6] shadow-xl space-y-4">
            <h3 className="text-xl font-serif font-medium text-[#263330] flex items-center space-x-2">
              <Plus className="w-5 h-5 text-[#285B55]" />
              <span>Add to Your Connections</span>
            </h3>

            <div className="space-y-4 text-[15px]">
              <div>
                <label className="text-[14px] font-medium text-[#263330] block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Morning Walk Outside"
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                  className="w-full bg-[#FAF8F4] border border-[#D5CFC2] rounded-xl px-3.5 py-2.5 text-[#263330] focus:outline-none focus:border-[#285B55]"
                />
              </div>

              <div>
                <label className="text-[14px] font-medium text-[#263330] block mb-1">
                  Category
                </label>
                <select
                  value={newNodeType}
                  onChange={(e) => setNewNodeType(e.target.value)}
                  className="w-full bg-[#FAF8F4] border border-[#D5CFC2] rounded-xl px-3.5 py-2.5 text-[#263330] focus:outline-none focus:border-[#285B55]"
                >
                  <option value="habit">Habit or Daily Routine</option>
                  <option value="role">Work or Daily Role</option>
                  <option value="relationship">Important Person</option>
                  <option value="stress_trigger">Common Source of Stress</option>
                  <option value="value">Personal Value</option>
                  <option value="goal">Personal Goal</option>
                </select>
              </div>

              <div>
                <label className="text-[14px] font-medium text-[#263330] block mb-1">
                  Why is this meaningful to you?
                </label>
                <textarea
                  rows={3}
                  placeholder="Add a short note about how this fits into your life..."
                  value={newNodeDesc}
                  onChange={(e) => setNewNodeDesc(e.target.value)}
                  className="w-full bg-[#FAF8F4] border border-[#D5CFC2] rounded-xl p-3.5 text-[#263330] focus:outline-none focus:border-[#285B55]"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2.5 pt-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsAddingNodeModalOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleCreateNode}>
                Save Connection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
