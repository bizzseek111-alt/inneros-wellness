"use client";

import React from "react";
import { CharacterId } from "@/lib/friends-data";
import { KaiCharacter, CharacterVisualState } from "./KaiCharacter";
import { MiaCharacter } from "./MiaCharacter";
import { LumiCharacter } from "./LumiCharacter";
import { ZaynCharacter } from "./ZaynCharacter";

interface CharacterAvatarProps {
  characterId: CharacterId;
  state?: CharacterVisualState;
  size?: "sm" | "md" | "lg" | "hero";
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  characterId,
  state = "idle",
  size = "md",
  interactive = false,
  onClick,
  className = "",
}) => {
  switch (characterId) {
    case "kai":
      return (
        <KaiCharacter
          state={state}
          size={size}
          interactive={interactive}
          onClick={onClick}
          className={className}
        />
      );
    case "mia":
      return (
        <MiaCharacter
          state={state}
          size={size}
          interactive={interactive}
          onClick={onClick}
          className={className}
        />
      );
    case "lumi":
      return (
        <LumiCharacter
          state={state}
          size={size}
          interactive={interactive}
          onClick={onClick}
          className={className}
        />
      );
    case "zayn":
      return (
        <ZaynCharacter
          state={state}
          size={size}
          interactive={interactive}
          onClick={onClick}
          className={className}
        />
      );
    default:
      return (
        <KaiCharacter
          state={state}
          size={size}
          interactive={interactive}
          onClick={onClick}
          className={className}
        />
      );
  }
};
