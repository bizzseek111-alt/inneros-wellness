"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "teal" | "lavender" | "indigo" | "ivory" | "emergency";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "neutral",
  size = "md",
  children,
  ...props
}) => {
  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  const variantStyles = {
    neutral: "bg-white/[0.06] text-ivory-300 border border-white/[0.1]",
    teal: "bg-teal-950/70 text-teal-300 border border-teal-700/50",
    lavender: "bg-lavender-950/60 text-lavender-200 border border-lavender-700/50",
    indigo: "bg-indigo-950/70 text-indigo-200 border border-indigo-700/50",
    ivory: "bg-ivory-100 text-midnight-950 border border-ivory-300 font-medium",
    emergency: "bg-rose-950/70 text-rose-300 border border-rose-800/60 font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full tracking-wide transition-colors",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
