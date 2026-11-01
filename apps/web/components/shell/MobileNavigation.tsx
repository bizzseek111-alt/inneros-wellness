"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, Compass, Layers, Shield, Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  activeTab?: string;
  onOpenMemory: () => void;
  onOpenHotlines: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeTab = "companion",
  onOpenMemory,
  onOpenHotlines,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-midnight-950/90 backdrop-blur-xl border-t border-white/[0.08] px-4 py-2">
      <div className="flex items-center justify-around">
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-colors",
            activeTab === "companion" ? "text-teal-400 font-semibold" : "text-zinc-400"
          )}
        >
          <MessageSquare className="w-4 h-4 mb-1" />
          <span>Sanctuary</span>
        </Link>

        <Link
          href="/explore"
          className={cn(
            "flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-colors",
            activeTab === "explore" ? "text-teal-400 font-semibold" : "text-zinc-400"
          )}
        >
          <Compass className="w-4 h-4 mb-1" />
          <span>Directions</span>
        </Link>

        <Link
          href="/design-system"
          className={cn(
            "flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-colors",
            activeTab === "design-system" ? "text-teal-400 font-semibold" : "text-zinc-400"
          )}
        >
          <Layers className="w-4 h-4 mb-1" />
          <span>Tokens</span>
        </Link>

        <button
          onClick={onOpenMemory}
          className="flex flex-col items-center py-1 px-3 text-[10px] font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <Database className="w-4 h-4 mb-1 text-lavender-400" />
          <span>Memory</span>
        </button>

        <button
          onClick={onOpenHotlines}
          className="flex flex-col items-center py-1 px-3 text-[10px] font-medium text-rose-400 hover:text-rose-300 transition-colors"
        >
          <Shield className="w-4 h-4 mb-1" />
          <span>988</span>
        </button>
      </div>
    </nav>
  );
};
