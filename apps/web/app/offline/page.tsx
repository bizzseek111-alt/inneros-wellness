"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  WifiOff,
  RefreshCw,
  Wind,
  Smile,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Breathe In" | "Hold" | "Breathe Out" | "Rest">("Breathe In");
  const [breathTimer, setBreathTimer] = useState(4);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Box breathing cycle (4s in, 4s hold, 4s out, 4s rest)
    const phases: Array<"Breathe In" | "Hold" | "Breathe Out" | "Rest"> = [
      "Breathe In",
      "Hold",
      "Breathe Out",
      "Rest",
    ];
    let currentIdx = 0;
    let timer = 4;

    const interval = setInterval(() => {
      timer -= 1;
      if (timer <= 0) {
        currentIdx = (currentIdx + 1) % phases.length;
        setBreathPhase(phases[currentIdx]);
        timer = 4;
      }
      setBreathTimer(timer);
    }, 1000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.href = "/";
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between p-4 sm:p-8">
      {/* Top Bar */}
      <header className="max-w-3xl mx-auto w-full flex items-center justify-between pb-6 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-bold shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-[#0F172A]">Weebly Sanctuary</h1>
            <p className="text-xs text-[#64748B]">Offline Mindfulness & Routines</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              isOnline
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Connection Restored
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                Offline Mode
              </>
            )}
          </span>
        </div>
      </header>

      {/* Main Sanctuary Offline Content */}
      <main className="max-w-3xl mx-auto w-full my-auto py-8 space-y-8">
        {/* Connection Notice Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <WifiOff className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              You&apos;re Gently Unplugged
            </h2>
            <p className="text-sm text-[#475569] max-w-md mx-auto">
              Live AI voice companion and payment services pause while offline. Your local calming
              tools, visual schedules, and saved stories remain ready for you right now.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Check Connection
            </button>
            <Link
              href="/youth/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] font-semibold text-sm transition-colors"
            >
              Cached Kids Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Local Calm Tool: Box Breathing */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#0F172A]">Calming Box Breathing</h3>
                <p className="text-xs text-[#64748B]">Gentle 4-4-4-4 nervous system regulation</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-teal-50 text-teal-700 px-2.5 py-1 rounded-lg">
              {breathTimer}s
            </span>
          </div>

          {/* Animated Breathing Orb */}
          <div className="flex flex-col items-center justify-center py-6">
            <div
              className={`w-36 h-36 rounded-full flex items-center justify-center text-center transition-all duration-1000 shadow-md ${
                breathPhase === "Breathe In"
                  ? "scale-110 bg-teal-100 border-4 border-teal-500 text-teal-900"
                  : breathPhase === "Hold"
                  ? "scale-105 bg-indigo-100 border-4 border-indigo-500 text-indigo-900"
                  : breathPhase === "Breathe Out"
                  ? "scale-90 bg-amber-100 border-4 border-amber-500 text-amber-900"
                  : "scale-100 bg-slate-100 border-4 border-slate-400 text-slate-800"
              }`}
            >
              <div>
                <span className="block text-base font-bold">{breathPhase}</span>
                <span className="text-xs font-medium opacity-80">{breathTimer} seconds</span>
              </div>
            </div>
            <p className="text-xs text-[#64748B] mt-4 text-center">
              Works completely offline. No microphone or data transmission required.
            </p>
          </div>
        </div>

        {/* Available Offline Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/youth/emotions"
            className="p-5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-teal-300 transition-all shadow-xs flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#0F172A] group-hover:text-teal-700 transition-colors">
                Feelings Explorer
              </h4>
              <p className="text-xs text-[#64748B] mt-1">
                Identify and label emotions with the offline wheel.
              </p>
            </div>
          </Link>

          <Link
            href="/youth/routines"
            className="p-5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-teal-300 transition-all shadow-xs flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#0F172A] group-hover:text-teal-700 transition-colors">
                Visual Schedules
              </h4>
              <p className="text-xs text-[#64748B] mt-1">
                Follow your morning and evening First/Then cards.
              </p>
            </div>
          </Link>

          <Link
            href="/youth/stories"
            className="p-5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-teal-300 transition-all shadow-xs flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#0F172A] group-hover:text-teal-700 transition-colors">
                Saved Stories
              </h4>
              <p className="text-xs text-[#64748B] mt-1">
                Read calming developmental narratives offline.
              </p>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer Safety Note */}
      <footer className="max-w-3xl mx-auto w-full pt-6 border-t border-[#E2E8F0] text-center text-xs text-[#64748B] flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-teal-600" />
        <span>Weebly Zero-Disclosed-Data Cache Policy — No private notes are stored offline.</span>
      </footer>
    </div>
  );
}
