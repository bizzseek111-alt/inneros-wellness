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
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#285B55] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45 select-none active:scale-[0.99]";

    const sizeStyles = {
      xs: "text-xs px-3.5 py-2 min-h-[36px] rounded-xl gap-1.5",
      sm: "text-sm px-4 py-2.5 min-h-[40px] rounded-xl gap-2",
      md: "text-sm px-5 py-2.5 min-h-[44px] rounded-2xl gap-2",
      lg: "text-base px-6 py-3.5 min-h-[52px] rounded-2xl gap-2.5",
    };

    const variantStyles = {
      primary:
        "bg-[#285B55] hover:bg-[#1F4742] text-white shadow-sm hover:shadow-md",
      secondary:
        "bg-[#E8F1EB] hover:bg-[#D5E6DC] text-[#263330] border border-[#CBE0D3]",
      outline:
        "bg-white hover:bg-[#F3EFE8] text-[#263330] border border-[#DDD8CE] shadow-sm",
      ghost:
        "bg-transparent hover:bg-[#F3EFE8] text-[#52625E] hover:text-[#263330]",
      calm:
        "bg-[#EDE8F5] hover:bg-[#E1D9F0] text-[#423166] border border-[#D5CAE8]",
      emergency:
        "bg-[#FDF2F2] hover:bg-[#FCE4E4] text-[#9B1C31] border border-[#F2C9CE] font-semibold",
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
