"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}) => {
  return (
    <label
      className={cn(
        "flex items-center justify-between cursor-pointer select-none group",
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
    >
      {(label || description) && (
        <div className="mr-3">
          {label && (
            <span className="text-xs font-medium text-ivory-200 group-hover:text-ivory-100 transition-colors">
              {label}
            </span>
          )}
          {description && (
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{description}</p>
          )}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-white/[0.1] transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500",
          checked ? "bg-teal-600" : "bg-midnight-950/90"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5",
            checked ? "translate-x-4.5" : "translate-x-0.5"
          )}
        />
      </button>
    </label>
  );
};
