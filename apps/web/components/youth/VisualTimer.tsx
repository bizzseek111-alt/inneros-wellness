"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Sparkles, CheckCircle2 } from "lucide-react";

interface VisualTimerProps {
  initialMinutes?: number;
  label?: string;
  onFinish?: () => void;
  className?: string;
}

export const VisualTimer: React.FC<VisualTimerProps> = ({
  initialMinutes = 5,
  label = "Focus & Calm Timer",
  onFinish,
  className = "",
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      timerRef.current = setTimeout(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && remainingSeconds === 0) {
      setIsRunning(false);
      setIsCompleted(true);
      if (onFinish) onFinish();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, remainingSeconds, onFinish]);

  const handleSelectMinutes = (mins: number) => {
    setIsRunning(false);
    setIsCompleted(false);
    setTotalSeconds(mins * 60);
    setRemainingSeconds(mins * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setRemainingSeconds(totalSeconds);
  };

  const progressPercent = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return (
    <div className={`p-6 rounded-[28px] bg-white border border-[#E2E8F0] shadow-sm text-center space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#718096]">
          {label}
        </span>
        <span className="text-xs font-bold text-[#36A871] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          ADHD-Friendly Disc
        </span>
      </div>

      {/* Visual Disc Timer (SVG Circular Progress Disc) */}
      <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="50"
            className="stroke-[#F2EBD7]"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            className="stroke-[#38A8F8] transition-all duration-1000 ease-linear"
            strokeWidth="12"
            strokeDasharray={314.159}
            strokeDashoffset={314.159 - (314.159 * progressPercent) / 100}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Digital Reading */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isCompleted ? (
            <div className="flex flex-col items-center text-emerald-600 animate-fade-in">
              <CheckCircle2 className="w-8 h-8 mb-1" />
              <span className="text-xs font-bold">Well Done!</span>
            </div>
          ) : (
            <>
              <span className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
                {formattedTime}
              </span>
              <span className="text-[11px] font-semibold text-[#718096]">
                {isRunning ? "Time Flowing" : "Paused"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Presets (2m, 5m, 10m, 15m) */}
      <div className="flex justify-center gap-1.5 pt-1">
        {[2, 5, 10, 15].map((mins) => (
          <button
            key={mins}
            onClick={() => handleSelectMinutes(mins)}
            className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
              totalSeconds === mins * 60
                ? "bg-[#E0F1FE] text-[#0C436F] border-[#38A8F8]"
                : "bg-white text-[#4A5568] border-[#E2E8F0] hover:bg-[#FDFBF4]"
            }`}
          >
            {mins}m
          </button>
        ))}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center space-x-3 pt-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-6 py-2.5 rounded-full font-bold text-sm flex items-center space-x-2 transition-all shadow-sm ${
            isRunning
              ? "bg-amber-500 hover:bg-amber-600 text-white"
              : "bg-[#0E87E3] hover:bg-[#0C436F] text-white"
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>{remainingSeconds === totalSeconds ? "Start" : "Resume"}</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-full border border-[#E2E8F0] bg-white text-[#718096] hover:text-[#1A202C] hover:bg-[#F2EBD7] transition-colors"
          title="Reset Timer"
          aria-label="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
