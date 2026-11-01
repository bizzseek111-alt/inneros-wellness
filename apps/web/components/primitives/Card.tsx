"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "interactive" | "subtle" | "sage" | "peach" | "lavender";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantStyles = {
      default: "bg-white border border-[#E6E1D8] shadow-card",
      elevated: "bg-white border border-[#DDD7CC] shadow-elevated",
      interactive:
        "bg-white border border-[#E6E1D8] hover:border-[#285B55]/40 hover:shadow-elevated transition-all duration-200 cursor-pointer",
      subtle: "bg-[#F3EFE8] border border-[#E6E1D8]",
      sage: "bg-[#E8F1EB] border border-[#CFE2D6]",
      peach: "bg-[#F7E7E2] border border-[#EAD2CA]",
      lavender: "bg-[#EDE8F5] border border-[#DDD4EB]",
    };

    return (
      <div
        ref={ref}
        className={cn("rounded-3xl p-6 text-[#263330]", variantStyles[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props} />
);
CardHeader.displayName = "CardHeader";

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-lg font-serif font-semibold text-[#263330] tracking-tight", className)} {...props} />
);
CardTitle.displayName = "CardTitle";

export const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-[#52625E] leading-relaxed", className)} {...props} />
);
CardDescription.displayName = "CardDescription";

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("text-base text-[#263330] leading-relaxed", className)} {...props} />
);
CardContent.displayName = "CardContent";

export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center pt-4 border-t border-[#EAE5DC]", className)} {...props} />
);
CardFooter.displayName = "CardFooter";
