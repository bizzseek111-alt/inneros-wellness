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
        "flex items-center justify-between cursor-pointer select-none group py-1",
        disabled && "opacity-45 cursor-not-allowed",
        className
      )}
    >
      {(label || description) && (
        <div className="mr-4">
          {label && (
            <span className="text-base font-medium text-[#263330] group-hover:text-[#1F4742] transition-colors">
              {label}
            </span>
          )}
          {description && (
            <p className="text-sm text-[#52625E] mt-0.5 leading-relaxed">{description}</p>
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
          "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#285B55] focus-visible:ring-offset-2",
          checked ? "bg-[#285B55] border-[#285B55]" : "bg-[#DDD7CC] border-[#CFC8BC]"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5",
            checked ? "translate-x-5" : "translate-x-1"
          )}
        />
      </button>
    </label>
  );
};
