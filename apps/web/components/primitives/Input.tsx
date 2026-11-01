"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, leftElement, rightElement, id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    return (
      <div className="w-full space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[#263330]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-4 flex items-center pointer-events-none text-[#52625E]">
              {leftElement}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full rounded-2xl bg-white border border-[#DCD7CE] text-[#263330] placeholder:text-[#7F8E8A] text-base px-4 py-3 min-h-[48px] transition-all duration-200 shadow-sm",
              "focus:outline-none focus:border-[#285B55] focus:ring-2 focus:ring-[#285B55]/20",
              leftElement && "pl-11",
              rightElement && "pr-11",
              error && "border-[#9B1C31] focus:border-[#9B1C31] focus:ring-[#9B1C31]/20",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-4 flex items-center text-[#52625E]">
              {rightElement}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-sm text-[#9B1C31] font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-sm text-[#52625E]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
