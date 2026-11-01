"use client";

import React, { useState, useEffect } from "react";
import {
  GitBranch,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Search,
  Filter,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  PauseCircle,
  PlayCircle,
  Download,
  AlertTriangle,
  Clock,
  Layers,
  Heart,
  Briefcase,
  Target,
  Smile,
  Compass,
  Activity,
  User,
  Plus,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  initialActiveTab?: "graph" | "ledger" | "privacy";
}

export const LifeGraphVisualizer: React.FC<LifeGraphVisualizerProps> = ({
  initialActiveTab = "graph",
}) => {
  const [activeTab, setActiveTab] = useState<"graph" | "ledger" | "privacy">(initialActiveTab);
  const [nodes, setNodes] = useState<LifeGraphNode[]>(SEEDED_CLIENT_NODES);
  const [edges, setEdges] = useState<LifeGraphEdge[]>(SEEDED_CLIENT_EDGES);
  const [memories, setMemories] = useState<MemoryRecord[]>(SEEDED_CLIENT_MEMORIES);
  const [consent, setConsent] = useState<UserMemoryConsent>(SEEDED_CLIENT_CONSENT);
  const [auditLogs, setAuditLogs] = useState<MemoryAuditLogEntry[]>([]);

  // Selection & Inspector State
  const [selectedNode, setSelectedNode] = useState<LifeGraphNode | null>(SEEDED_CLIENT_NODES[0] || null);
  const [selectedMemory, setSelectedMemory] = useState<MemoryRecord | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [filterTentativeOnly, setFilterTentativeOnly] = useState(false);

  // Modals & Actions
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
  const [purgeConfirmText, setPurgeConfirmText] = useState("");
  const [isEditingStatement, setIsEditingStatement] = useState(false);
  const [editedStatement, setEditedStatement] = useState("");
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
      console.warn("Backend unavailable, using initial synthetic state:", err);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtered nodes
  const filteredNodes = nodes.filter((n) => {
    if (filterTentativeOnly && !n.is_tentative) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.label.toLowerCase().includes(q) || n.description.toLowerCase().includes(q);
    }
    return true;
  });

  // Filtered memory ledger
  const filteredMemories = memories.filter((m) => {
    if (selectedCategoryFilter !== "all" && m.category !== selectedCategoryFilter) return false;
    if (filterTentativeOnly && m.record_type !== "tentative_ai_interpretation") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.fact_statement.toLowerCase().includes(q) ||
        (m.tags && m.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  // Staged suggestions
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
          n.linked_memory_id === id ? { ...n, is_tentative: false, record_type: "stored_fact" } : n
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

  const handleDeleteNode = async (nodeId: string) => {
    try {
      await api.deleteLifeGraphNode(nodeId);
      setNodes((prev) => prev.filter((n) => n.id !== nodeId));
      setEdges((prev) => prev.filter((e) => e.source_node_id !== nodeId && e.target_node_id !== nodeId));
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
    } catch (err) {
      // Local fallback
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
    } catch (err) {
      setConsent((prev) => ({
        ...prev,
        sensitive_health_consent_granted: !prev.sensitive_health_consent_granted,
      }));
    }
  };

  const handleExportData = async () => {
    try {
      const bundle = await api.exportPersonalData();
      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inneros_personal_data_export_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      // Offline fallback bundle
      const fallbackBundle = {
        user_id: consent.user_id,
        export_timestamp: new Date().toISOString(),
        format_version: "2.0.0",
        memory_records: memories,
        life_graph_nodes: nodes,
        life_graph_edges: edges,
        consent_settings: consent,
      };
      const blob = new Blob([JSON.stringify(fallbackBundle, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inneros_personal_data_export_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleExecuteNuclearPurge = async () => {
    if (purgeConfirmText !== "PURGE MY MEMORY") return;
    setIsSubmitting(true);
    try {
      await api.purgeAllMemory();
      setNodes([]);
      setEdges([]);
      setMemories([]);
      setSelectedNode(null);
      setIsPurgeModalOpen(false);
      setPurgeConfirmText("");
    } catch (err) {
      console.error(err);
      setNodes([]);
      setEdges([]);
      setMemories([]);
      setSelectedNode(null);
      setIsPurgeModalOpen(false);
      setPurgeConfirmText("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNode = async () => {
    if (!newNodeLabel.trim()) return;
    try {
      const created = await api.createLifeGraphNode({
        label: newNodeLabel,
        node_type: newNodeType,
        description: newNodeDesc || "User defined entity",
        record_type: "stored_fact",
        emotional_charge: newNodeType === "stress_trigger" ? "challenging" : "positive",
      });
      setNodes((prev) => [...prev, created]);
      setSelectedNode(created);
      setIsAddingNodeModalOpen(false);
      setNewNodeLabel("");
      setNewNodeDesc("");
    } catch (err) {
      const fallbackNode: LifeGraphNode = {
        id: `node_user_${Date.now()}`,
        user_id: consent.user_id,
        label: newNodeLabel,
        node_type: newNodeType,
        description: newNodeDesc || "User defined entity",
        record_type: "stored_fact",
        emotional_charge: newNodeType === "stress_trigger" ? "challenging" : "positive",
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

  // Node position helper (geometric circle layout for calm visualization)
  const getNodeCoordinates = (index: number, total: number) => {
    const radius = 170;
    const centerX = 300;
    const centerY = 240;
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
        return <Briefcase className="w-3.5 h-3.5 text-teal-400" />;
      case "habit":
        return <Clock className="w-3.5 h-3.5 text-lavender-400" />;
      case "relationship":
        return <Heart className="w-3.5 h-3.5 text-rose-400" />;
      case "stress_trigger":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case "value":
        return <Compass className="w-3.5 h-3.5 text-cyan-400" />;
      case "goal":
        return <Target className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-teal-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Privacy & Governance Top Bar */}
      <div className="p-4 rounded-2xl bg-midnight-950/90 border border-white/[0.08] backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-semibold text-ivory-100 tracking-tight">
                Personal Memory & Life Graph Ledger
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-950/80 border border-teal-800/40 text-teal-300">
                AES-256 HKDF
              </span>
            </div>
            <p className="text-xs text-ivory-400 font-light">
              Explicit consent &bull; Facts strictly separated from AI hypotheses &bull; Zero secret profiling
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Pause Memory Toggle */}
          <button
            onClick={handleTogglePauseMemory}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center space-x-2 ${
              consent.is_memory_recording_paused
                ? "bg-amber-950/60 border-amber-600 text-amber-200 shadow-lg shadow-amber-950/50"
                : "bg-midnight-900 border-white/[0.1] text-ivory-200 hover:border-white/[0.2]"
            }`}
          >
            {consent.is_memory_recording_paused ? (
              <>
                <PauseCircle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Memory Recording Paused</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-3.5 h-3.5 text-teal-400" />
                <span>Active Recording</span>
              </>
            )}
          </button>

          {/* Export JSON Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleExportData}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export (Art. 20)
          </Button>

          {/* Nuclear Purge Button */}
          <Button
            size="sm"
            variant="emergency"
            onClick={() => setIsPurgeModalOpen(true)}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Purge All
          </Button>
        </div>
      </div>

      {/* 2. Staged Suggested Memories Banner (Requires User Confirmation!) */}
      {suggestedMemories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-amber-950/30 border border-amber-600/40 shadow-xl space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-400">
              <AlertTriangle className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider font-mono">
                {suggestedMemories.length} Tentative AI Hypothesis Awaiting Confirmation
              </span>
            </div>
            <span className="text-[10px] font-mono text-amber-300/70">
              InnerOS never converts AI observations into facts without approval
            </span>
          </div>

          <div className="grid gap-3">
            {suggestedMemories.map((sugg) => (
              <div
                key={sugg.id}
                className="p-4 rounded-xl bg-midnight-950/80 border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-amber-300">
                      Tentative Hypothesis ({Math.round(sugg.confidence_score * 100)}% Confidence)
                    </span>
                    <span className="text-xs text-zinc-400">&bull;</span>
                    <span className="text-xs text-zinc-400 font-mono">
                      Category: {sugg.category.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-xs text-ivory-100 font-medium">{sugg.fact_statement}</p>
                  {sugg.provenance?.source_quote && (
                    <p className="text-[11px] text-zinc-400 italic font-serif">
                      Quote trigger: &ldquo;{sugg.provenance.source_quote}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Button
                    size="xs"
                    variant="primary"
                    onClick={() => handleConfirmSuggestion(sugg.id)}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Confirm as Fact
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleRejectSuggestion(sugg.id)}
                    leftIcon={<XCircle className="w-3.5 h-3.5" />}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 3. Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/[0.08] pb-3">
        <button
          onClick={() => setActiveTab("graph")}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === "graph"
              ? "bg-teal-950/80 border border-teal-500 text-teal-200 shadow-lg shadow-teal-950/40"
              : "text-ivory-400 hover:text-ivory-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            <GitBranch className="w-3.5 h-3.5 text-teal-400" />
            <span>Interactive Life Graph ({nodes.length} Nodes &bull; {edges.length} Edges)</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("ledger")}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === "ledger"
              ? "bg-teal-950/80 border border-teal-500 text-teal-200 shadow-lg shadow-teal-950/40"
              : "text-ivory-400 hover:text-ivory-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Layers className="w-3.5 h-3.5 text-lavender-400" />
            <span>Memory Ledger ({memories.length} Records)</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("privacy")}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === "privacy"
              ? "bg-teal-950/80 border border-teal-500 text-teal-200 shadow-lg shadow-teal-950/40"
              : "text-ivory-400 hover:text-ivory-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Consent & Audit Trail</span>
          </div>
        </button>
      </div>

      {/* 4. Tab 1: Interactive Life Graph Visualization */}
      {activeTab === "graph" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Life Graph Canvas */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-midnight-950 border border-white/[0.08] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[540px]">
            {/* Canvas Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3 z-10">
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-semibold text-ivory-100">Life Graph Topology</span>
                <span className="text-[10px] font-mono text-zinc-500">&bull; Click node to inspect</span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="xs"
                  variant="primary"
                  onClick={() => setIsAddingNodeModalOpen(true)}
                  leftIcon={<Plus className="w-3 h-3" />}
                >
                  Add Entity
                </Button>
              </div>
            </div>

            {/* SVG Visualizer with Bezier Curves & Nodes */}
            <div className="relative w-full h-[420px] flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                {/* Render Directed Edges */}
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
                        stroke={edge.is_tentative ? "#f59e0b" : "url(#edgeGradient)"}
                        strokeWidth={edge.is_tentative ? 1.5 : 2}
                        strokeDasharray={edge.is_tentative ? "4 4" : "none"}
                        fill="none"
                        className="transition-all"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Render Positioned Nodes */}
              {nodes.map((node, index) => {
                const coords = getNodeCoordinates(index, nodes.length);
                const isSelected = selectedNode?.id === node.id;

                return (
                  <motion.div
                    key={node.id}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedNode(node)}
                    style={{
                      position: "absolute",
                      left: coords.x - 70,
                      top: coords.y - 35,
                      width: 140,
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer select-none transition-all shadow-xl backdrop-blur-md ${
                      isSelected
                        ? "bg-teal-950 border-teal-400 ring-2 ring-teal-500/50 scale-105 z-20"
                        : node.is_tentative
                        ? "bg-amber-950/60 border-dashed border-amber-500/60 text-amber-200 hover:border-amber-400"
                        : "bg-midnight-900/90 border-white/[0.1] text-ivory-200 hover:border-white/[0.3]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center space-x-1.5">
                        {getNodeIcon(node.node_type)}
                        <span className="text-[9px] font-mono uppercase tracking-wider text-ivory-400">
                          {node.node_type.replace(/_/g, " ")}
                        </span>
                      </div>
                      {node.is_tentative && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      )}
                    </div>
                    <h4 className="text-xs font-semibold text-ivory-100 truncate">{node.label}</h4>
                  </motion.div>
                );
              })}
            </div>

            {/* Canvas Legend */}
            <div className="flex flex-wrap items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] text-zinc-400">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 border border-teal-200" />
                  <span>Stored Ground Fact</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-dashed border-amber-200" />
                  <span>Tentative AI Hypothesis</span>
                </span>
              </div>
              <span className="font-mono text-[10px]">Causal / Mitigating Connections</span>
            </div>
          </div>

          {/* Node Inspector Drawer */}
          <div className="p-6 rounded-3xl bg-midnight-950 border border-white/[0.08] shadow-2xl space-y-4 flex flex-col justify-between">
            {selectedNode ? (
              <div className="space-y-4">
                <div className="border-b border-white/[0.08] pb-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 flex items-center space-x-1">
                      {getNodeIcon(selectedNode.node_type)}
                      <span>{selectedNode.node_type.replace(/_/g, " ")}</span>
                    </span>
                    <Badge
                      variant={selectedNode.is_tentative ? "lavender" : "teal"}
                      size="sm"
                    >
                      {selectedNode.is_tentative ? "Tentative Hypothesis" : "Confirmed Fact"}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-serif text-ivory-100 font-medium">
                    {selectedNode.label}
                  </h3>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    Context & Meaning
                  </span>
                  <p className="text-xs text-ivory-300 font-light leading-relaxed">
                    {selectedNode.description}
                  </p>
                </div>

                {/* Provenance Details */}
                <div className="p-3.5 rounded-2xl bg-midnight-900/80 border border-white/[0.06] space-y-2 text-xs">
                  <span className="text-[10px] font-mono uppercase text-lavender-400 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Provenance & Trust Score</span>
                  </span>

                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between text-zinc-400">
                      <span>Certainty:</span>
                      <span className="font-mono text-ivory-200">
                        {selectedNode.is_tentative ? "Tentative (<0.85)" : "User Verified (1.0)"}
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Derived From:</span>
                      <span className="font-mono text-ivory-200">
                        {selectedNode.linked_memory_id ? "Linked Memory Record" : "User Direct"}
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Storage Status:</span>
                      <span className="font-mono text-teal-400">AES-256 HKDF Encrypted</span>
                    </div>
                  </div>
                </div>

                {/* Connected Edges List */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    Relational Connections
                  </span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
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
                        const isSource = edge.source_node_id === selectedNode.id;

                        return (
                          <div
                            key={edge.id}
                            className="p-2.5 rounded-xl bg-midnight-900 border border-white/[0.04] flex items-center justify-between text-xs"
                          >
                            <span className="font-mono text-[10px] text-teal-400">
                              {isSource ? `&rarr; ${edge.relation}` : `&larr; ${edge.relation}`}
                            </span>
                            <span className="text-ivory-200 font-medium truncate max-w-[140px]">
                              {otherNode?.label || otherNodeId}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                <Sparkles className="w-8 h-8 mb-2 text-teal-500/40" />
                <p className="text-xs">Click any node on the Life Graph to inspect provenance and causal relationships.</p>
              </div>
            )}

            {/* Forget This Entity Button */}
            {selectedNode && (
              <div className="pt-4 border-t border-white/[0.08]">
                <Button
                  size="sm"
                  variant="emergency"
                  className="w-full"
                  onClick={() => handleDeleteNode(selectedNode.id)}
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Forget Entity (GDPR Art. 17)
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Tab 2: Memory Ledger */}
      {activeTab === "ledger" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-midnight-950 border border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3 flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search statements, context, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-ivory-100 placeholder-zinc-500 focus:outline-none w-full"
              />
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-midnight-900 border border-white/[0.1] rounded-xl px-3 py-1.5 text-ivory-200 focus:outline-none"
              >
                <option value="all">All 9 Categories</option>
                <option value="communication_preferences">Communication Preferences</option>
                <option value="personal_goals">Personal Goals</option>
                <option value="user_confirmed_life_events">Life Events</option>
                <option value="habits_and_routines">Habits & Routines</option>
                <option value="work_and_career_information">Work & Career</option>
                <option value="relationships_and_family_context">Relationships & Family</option>
                <option value="self_reported_emotions">Self-Reported Emotions</option>
                <option value="coping_preferences">Coping Preferences</option>
                <option value="optional_sensitive_health_related_information">Sensitive Health Context</option>
              </select>

              <label className="flex items-center space-x-2 text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterTentativeOnly}
                  onChange={(e) => setFilterTentativeOnly(e.target.checked)}
                  className="rounded border-zinc-700 text-teal-500 focus:ring-0"
                />
                <span>Tentative Only</span>
              </label>
            </div>
          </div>

          {/* Memory Records List */}
          <div className="grid gap-3">
            {filteredMemories.map((mem) => (
              <div
                key={mem.id}
                className="p-5 rounded-2xl bg-midnight-950/80 border border-white/[0.08] hover:border-white/[0.18] transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={mem.record_type === "stored_fact" ? "teal" : "lavender"}
                      size="sm"
                    >
                      {mem.record_type === "stored_fact" ? "Stored Fact" : "Tentative AI Hypothesis"}
                    </Badge>
                    <span className="text-xs font-mono text-zinc-400 uppercase">
                      {mem.category.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-[11px] text-zinc-400 font-mono">
                    <span>Certainty: {mem.certainty_level}</span>
                    <span>&bull;</span>
                    <span>Confidence: {Math.round(mem.confidence_score * 100)}%</span>
                  </div>
                </div>

                <p className="text-sm text-ivory-100 font-normal leading-relaxed">
                  {mem.fact_statement}
                </p>

                {mem.raw_context && (
                  <p className="text-xs text-zinc-400 font-light italic">
                    Context: {mem.raw_context}
                  </p>
                )}

                {/* Footer with Tags & Actions */}
                <div className="flex flex-wrap items-center justify-between pt-2 gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {mem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-midnight-900 border border-white/[0.06] text-zinc-400"
                      >
                        #{tag}
                      </span>
                    ))}
                    {mem.provenance?.source_quote && (
                      <span className="text-[10px] font-mono text-lavender-400/80 italic">
                        Verbatim quote recorded
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
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
            ))}
          </div>
        </div>
      )}

      {/* 6. Tab 3: Privacy, Consent & Audit Trail */}
      {activeTab === "privacy" && (
        <div className="space-y-6">
          {/* Consent Settings Card */}
          <div className="p-6 rounded-3xl bg-midnight-950 border border-white/[0.08] shadow-2xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-serif text-ivory-100">Granular Privacy & Consent Governance</h3>
              <p className="text-xs text-zinc-400">
                You maintain sovereign ownership of every memory node. Sensitive health tracking requires explicit opt-in.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs">
              {/* Sensitive Health Opt-in */}
              <div className="p-4 rounded-2xl bg-midnight-900 border border-white/[0.06] flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-semibold text-ivory-100 flex items-center space-x-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Optional Sensitive Health Context</span>
                  </span>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Allows companion to remember self-reported non-clinical sleep, stress sensitivity, or recovery habits.
                  </p>
                </div>
                <button
                  onClick={handleToggleSensitiveConsent}
                  className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                    consent.sensitive_health_consent_granted ? "bg-teal-500" : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      consent.sensitive_health_consent_granted ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Pause Memory Toggle */}
              <div className="p-4 rounded-2xl bg-midnight-900 border border-white/[0.06] flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-semibold text-ivory-100 flex items-center space-x-1.5">
                    <PauseCircle className="w-4 h-4 text-teal-400" />
                    <span>Global Memory Recording</span>
                  </span>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Temporarily freeze extraction without deleting existing memories or graph links.
                  </p>
                </div>
                <button
                  onClick={handleTogglePauseMemory}
                  className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                    !consent.is_memory_recording_paused ? "bg-teal-500" : "bg-amber-600"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      !consent.is_memory_recording_paused ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Immutable Audit Log Table */}
          <div className="p-6 rounded-3xl bg-midnight-950 border border-white/[0.08] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center space-x-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span className="font-semibold text-ivory-100">Immutable Memory Audit Log</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">Append-Only Trail (Tenant Isolated)</span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
              {auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-midnight-900 border border-white/[0.04] flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-midnight-950 border border-white/[0.1] text-teal-300">
                        {log.action}
                      </span>
                      <span className="text-ivory-200 font-mono text-[11px]">{log.target_type}</span>
                    </div>
                    <span className="text-zinc-500 text-[10px] font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()} &bull; {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-zinc-500 text-xs">
                  All memory lifecycle events (creation, confirmation, edit, forget) are logged here immutably.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. Nuclear Purge Confirmation Modal */}
      {isPurgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-midnight-950 border border-rose-500/50 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
              <h3 className="text-lg font-serif font-medium text-ivory-100">
                Execute Nuclear Memory Purge
              </h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              This action will permanently erase all memory records, Life Graph nodes, causal connections, and associated embeddings for your profile. <strong>This cannot be undone.</strong>
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-zinc-400 uppercase">
                Type &ldquo;PURGE MY MEMORY&rdquo; to confirm:
              </label>
              <input
                type="text"
                value={purgeConfirmText}
                onChange={(e) => setPurgeConfirmText(e.target.value)}
                placeholder="PURGE MY MEMORY"
                className="w-full text-xs font-mono bg-midnight-900 border border-rose-500/40 rounded-xl px-4 py-2.5 text-rose-200 focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button size="sm" variant="ghost" onClick={() => setIsPurgeModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="emergency"
                disabled={purgeConfirmText !== "PURGE MY MEMORY" || isSubmitting}
                onClick={handleExecuteNuclearPurge}
              >
                {isSubmitting ? "Purging..." : "Permanently Purge All Data"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Add Life Graph Entity Modal */}
      {isAddingNodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-midnight-950 border border-teal-500/40 shadow-2xl space-y-4">
            <h3 className="text-base font-serif text-ivory-100 flex items-center space-x-2">
              <Plus className="w-4 h-4 text-teal-400" />
              <span>Weave Entity into Life Graph</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 uppercase">Entity Label</label>
                <input
                  type="text"
                  placeholder="e.g. 15-min Morning Sunlight"
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                  className="w-full mt-1 bg-midnight-900 border border-white/[0.1] rounded-xl px-3 py-2 text-ivory-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 uppercase">Entity Type</label>
                <select
                  value={newNodeType}
                  onChange={(e) => setNewNodeType(e.target.value)}
                  className="w-full mt-1 bg-midnight-900 border border-white/[0.1] rounded-xl px-3 py-2 text-ivory-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="habit">Habit / Daily Routine</option>
                  <option value="role">Professional Role / Duty</option>
                  <option value="relationship">Relationship Anchor</option>
                  <option value="stress_trigger">Stressor / Cognitive Trigger</option>
                  <option value="value">Core Personal Value</option>
                  <option value="goal">Aspirational Goal</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 uppercase">Context & Significance</label>
                <textarea
                  rows={3}
                  placeholder="How does this entity impact your emotional wellbeing?"
                  value={newNodeDesc}
                  onChange={(e) => setNewNodeDesc(e.target.value)}
                  className="w-full mt-1 bg-midnight-900 border border-white/[0.1] rounded-xl p-3 text-ivory-100 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button size="sm" variant="ghost" onClick={() => setIsAddingNodeModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleCreateNode}>
                Weave Node
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
