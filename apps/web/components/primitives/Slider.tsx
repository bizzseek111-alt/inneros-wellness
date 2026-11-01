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
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("w-full space-y-2", className)}>
      {(label || valueDisplay !== undefined) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-medium text-ivory-300">{label}</span>}
          {valueDisplay !== undefined && (
            <span className="font-mono text-teal-300">{valueDisplay}</span>
          )}
        </div>
      )}
      <div className="relative flex items-center h-5 select-none touch-none">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 bg-midnight-950/80 rounded-full appearance-none cursor-pointer border border-white/[0.08] focus:outline-none accent-teal-400"
        />
      </div>
    </div>
  );
};
