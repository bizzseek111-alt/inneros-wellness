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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E4E0D8] px-4 py-2">
      <div className="flex items-center justify-around">
        <Link
          href="/dashboard"
          className={cn(
            "flex flex-col items-center py-1 px-3 text-xs font-medium transition-colors",
            activeTab === "companion" ? "text-[#285B55] font-semibold" : "text-[#52625E]"
          )}
        >
          <MessageSquare className="w-4 h-4 mb-1" />
          <span>Sanctuary</span>
        </Link>

        <Link
          href="/explore"
          className={cn(
            "flex flex-col items-center py-1 px-3 text-xs font-medium transition-colors",
            activeTab === "explore" ? "text-[#285B55] font-semibold" : "text-[#52625E]"
          )}
        >
          <Compass className="w-4 h-4 mb-1" />
          <span>Directions</span>
        </Link>

        <Link
          href="/design-system"
          className={cn(
            "flex flex-col items-center py-1 px-3 text-xs font-medium transition-colors",
            activeTab === "design-system" ? "text-[#285B55] font-semibold" : "text-[#52625E]"
          )}
        >
          <Layers className="w-4 h-4 mb-1" />
          <span>Tokens</span>
        </Link>

        <button
          onClick={onOpenMemory}
          className="flex flex-col items-center py-1 px-3 text-xs font-medium text-[#52625E] hover:text-[#263330] transition-colors"
        >
          <Database className="w-4 h-4 mb-1 text-[#553E82]" />
          <span>Memory</span>
        </button>

        <button
          onClick={onOpenHotlines}
          className="flex flex-col items-center py-1 px-3 text-xs font-medium text-[#9B1C31] hover:opacity-80 transition-colors"
        >
          <Shield className="w-4 h-4 mb-1" />
          <span>988</span>
        </button>
      </div>
    </nav>
  );
};
