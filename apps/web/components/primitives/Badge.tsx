"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "sage" | "teal" | "lavender" | "indigo" | "ivory" | "peach" | "emergency";
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
    sm: "text-xs px-3 py-1",
    md: "text-sm px-3.5 py-1.5",
  };

  const variantStyles = {
    neutral: "bg-[#F3EFE8] text-[#52625E] border border-[#E2DDD2]",
    sage: "bg-[#E8F1EB] text-[#1F4742] border border-[#CBE0D3]",
    teal: "bg-[#E8F1EB] text-[#1F4742] border border-[#CBE0D3]",
    lavender: "bg-[#EDE8F5] text-[#423166] border border-[#D8CEEA]",
    indigo: "bg-[#EDE8F5] text-[#423166] border border-[#D8CEEA]",
    ivory: "bg-white text-[#263330] border border-[#E2DDD2] shadow-sm",
    peach: "bg-[#F7E7E2] text-[#7D402D] border border-[#E8CEC5]",
    emergency: "bg-[#FDF2F2] text-[#9B1C31] border border-[#F2C9CE] font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full transition-colors",
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
