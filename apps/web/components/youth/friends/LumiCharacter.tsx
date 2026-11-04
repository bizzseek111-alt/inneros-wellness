"use client";

import React from "react";
import { LumiMascot, MascotState } from "../LumiMascot";
import { CharacterVisualState } from "./KaiCharacter";

interface LumiCharacterProps {
  state?: CharacterVisualState;
  size?: "sm" | "md" | "lg" | "hero";
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  label?: string;
}

export const LumiCharacter: React.FC<LumiCharacterProps> = ({
  state = "idle",
  size = "md",
  interactive = false,
  onClick,
  className = "",
  label = "Lumi the calm companion",
}) => {
  // Map CharacterVisualState to MascotState
  const mascotStateMap: Record<CharacterVisualState, MascotState> = {
    idle: "idle",
    listening: "listening",
    thinking: "thinking",
    speaking: "speaking",
    celebrating: "celebrating",
    paused: "calming",
  };

  return (
    <LumiMascot
      state={mascotStateMap[state] || "idle"}
      size={size}
      interactive={interactive}
      onClick={onClick}
      className={className}
      label={label}
    />
  );
};
