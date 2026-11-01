"use client";

import React from "react";
import { Sparkles, Shield, Database, LifeBuoy, HeartHandshake } from "lucide-react";

interface TopBarProps {
  backendHealthy: boolean;
  onOpenMemory: () => void;
  onOpenHotlines: () => void;
  onOpenKnowledge: () => void;
  activeView: "companion" | "knowledge";
  setActiveView: (view: "companion" | "knowledge") => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  backendHealthy,
  onOpenMemory,
  onOpenHotlines,
  onOpenKnowledge,
  activeView,
  setActiveView,
}) => {
  return (
    <header className="border-b border-emerald-950/60 bg-black/40 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 py-3 flex items-center justify-between">
      {/* Brand & Sanctuary Breathing Node */}
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-emerald-950/80 border border-emerald-700/40">
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-breathe-slow shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold tracking-tight text-emerald-100 text-lg">InnerOS</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-emerald-800/60 bg-emerald-950/40 text-emerald-400 font-mono">
              v0.1.0-alpha
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 hidden sm:block">Personal Emotional Sanctuary & Life Companion</p>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center bg-zinc-900/80 border border-zinc-800 rounded-full p-1 text-xs">
        <button
          onClick={() => setActiveView("companion")}
          className={`px-3.5 py-1.5 rounded-full transition-all duration-200 flex items-center space-x-1.5 ${
            activeView === "companion"
              ? "bg-emerald-900/60 text-emerald-200 font-medium border border-emerald-700/50"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sanctuary</span>
        </button>
        <button
          onClick={() => setActiveView("knowledge")}
          className={`px-3.5 py-1.5 rounded-full transition-all duration-200 flex items-center space-x-1.5 ${
            activeView === "knowledge"
              ? "bg-emerald-900/60 text-emerald-200 font-medium border border-emerald-700/50"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <LifeBuoy className="w-3.5 h-3.5" />
          <span>Evidence Library</span>
        </button>
      </div>

      {/* System Health, Memory & Crisis Actions */}
      <div className="flex items-center space-x-2">
        {/* Backend Status indicator */}
        <div
          title={backendHealthy ? "FastAPI backend connected" : "Connecting to backend..."}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] bg-zinc-900/90 border border-zinc-800 text-zinc-300"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              backendHealthy
                ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                : "bg-amber-400 animate-ping"
            }`}
          />
          <span className="font-mono">{backendHealthy ? "API Live" : "API Offline"}</span>
        </div>

        {/* Memory & Consent Drawer Trigger */}
        <button
          onClick={onOpenMemory}
          className="p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-zinc-100 transition-colors"
          title="Memory Transparency Drawer & Consent"
        >
          <Database className="w-4 h-4 text-emerald-400" />
        </button>

        {/* Immediate Crisis Resources Hotline Button */}
        <button
          onClick={onOpenHotlines}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 text-rose-300 text-xs transition-colors"
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span className="font-medium">Crisis 988</span>
        </button>
      </div>
    </header>
  );
};
