"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  valueDisplay?: string | number;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  valueDisplay,
  className,
}) => {
  return (
    <div className={cn("w-full space-y-2.5", className)}>
      {(label || valueDisplay !== undefined) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="font-medium text-[#263330]">{label}</span>}
          {valueDisplay !== undefined && (
            <span className="font-medium text-[#285B55] bg-[#E8F1EB] px-2.5 py-0.5 rounded-full text-xs">
              {valueDisplay}
            </span>
          )}
        </div>
      )}
      <div className="relative flex items-center h-6 select-none touch-none">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-[#E8E3D9] rounded-full appearance-none cursor-pointer focus:outline-none accent-[#285B55]"
        />
      </div>
    </div>
  );
};
