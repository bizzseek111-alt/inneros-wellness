"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "calm" | "emergency";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 select-none active:scale-[0.98]";

    const sizeStyles = {
      xs: "text-[11px] px-2.5 py-1 rounded-lg gap-1.5",
      sm: "text-xs px-3 py-1.5 rounded-xl gap-2",
      md: "text-sm px-4 py-2.5 rounded-xl gap-2",
      lg: "text-base px-6 py-3.5 rounded-2xl gap-2.5",
    };

    const variantStyles = {
      primary:
        "bg-teal-600 hover:bg-teal-500 text-white shadow-sm hover:shadow-md hover:shadow-teal-900/20 focus-visible:ring-teal-500",
      secondary:
        "bg-midnight-800 hover:bg-midnight-700 text-ivory-100 border border-white/[0.08] hover:border-white/[0.14] focus-visible:ring-indigo-400",
      outline:
        "bg-transparent hover:bg-white/[0.04] text-ivory-200 border border-white/[0.12] hover:border-white/[0.22] focus-visible:ring-teal-400",
      ghost:
        "bg-transparent hover:bg-white/[0.06] text-ivory-300 hover:text-ivory-100 focus-visible:ring-lavender-400",
      calm:
        "bg-indigo-900/40 hover:bg-indigo-900/60 text-indigo-200 border border-indigo-700/40 hover:border-indigo-600/60 focus-visible:ring-indigo-400",
      emergency:
        "bg-rose-950/60 hover:bg-rose-900/70 text-rose-200 border border-rose-800/60 hover:border-rose-700 focus-visible:ring-rose-500",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
