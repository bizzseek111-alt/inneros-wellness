"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  MessageCircle,
  Gamepad2,
  Volume2,
  Lock,
  X,
  Shield,
  ArrowRight,
  Sparkles,
  Users,
  GraduationCap,
  Settings,
  TrendingUp,
} from "lucide-react";
import { LumiMascot } from "./LumiMascot";
import { useYouth } from "./YouthContext";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";

interface ChildNavigationShellProps {
  children: React.ReactNode;
  activeTab?: "home" | "talk" | "play";
  showBackButton?: boolean;
  backHref?: string;
}

export const ChildNavigationShell: React.FC<ChildNavigationShellProps> = ({
  children,
  activeTab,
  showBackButton = false,
  backHref = "/youth/dashboard",
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale } = useYouth();

  // Parental Gate Modal State
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);
  const [gateAnswer, setGateAnswer] = useState("");
  const [gateError, setGateError] = useState(false);
  const [isGateUnlocked, setIsGateUnlocked] = useState(false);

  // Deterministic math challenge: 6 x 7 = 42
  const NUM_A = 6;
  const NUM_B = 7;
  const CORRECT_ANSWER = 42;

  // Determine active tab from prop or pathname
  const currentTab =
    activeTab ||
    (pathname?.includes("/friends")
      ? "talk"
      : pathname?.includes("/play") ||
        pathname?.includes("/stories") ||
        pathname?.includes("/activities") ||
        pathname?.includes("/emotions") ||
        pathname?.includes("/routines")
      ? "play"
      : "home");

  const handleSpokenInstructions = () => {
    let text = "Hi! Tap a friend to start talking, or press the big microphone button to say what you want to do!";
    if (locale === "ur") {
      text = "سلام! بات شروع کرنے کے لیے کسی بھی دوست پر ٹیپ کریں، یا بڑا مائیک کا بٹن دبا کر بولیں!";
    } else if (locale === "pa") {
      text = "سلام جی! گلاں کرن لئی کسے وی دوست تے ٹیپ کرو، یا وڈا مائیک دبا کے بولو!";
    }
    voiceSynthesizer.speak(text, { lang: locale === "ur" ? "ur-PK" : locale === "pa" ? "pa-PK" : "en-US" });
  };

  const handleVerifyGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(gateAnswer.trim(), 10) === CORRECT_ANSWER) {
      setIsGateUnlocked(true);
      setGateError(false);
    } else {
      setGateError(true);
      setGateAnswer("");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#0F172A] flex flex-col justify-between selection:bg-amber-200">
      {/* 1. Ultra-Clean Child Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-100 px-4 py-3 sm:px-6 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Logo & Mascot */}
          <Link
            href="/youth/dashboard"
            className="flex items-center space-x-2.5 rtl:space-x-reverse group hover:opacity-90 transition-opacity"
            aria-label="Weebly Home"
          >
            <LumiMascot size="sm" state="idle" />
            <div>
              <span className="text-xl sm:text-2xl font-black text-amber-500 tracking-tight block leading-none">
                weebly
              </span>
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider block">
                Magic Learning
              </span>
            </div>
          </Link>

          {/* Right Action Controls: Audio Spoken Help + Language + Discrete Parent Lock */}
          <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
            {/* Spoken Instructions Button */}
            <button
              type="button"
              onClick={handleSpokenInstructions}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-black flex items-center space-x-1.5 transition-all shadow-2xs hover:scale-105 active:scale-95"
              title="Hear instructions aloud"
              aria-label="Listen to voice instructions"
            >
              <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="hidden sm:inline">Help</span>
            </button>

            {/* Language Quick Switch */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-full text-[11px] font-black">
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`px-2 py-1 rounded-full transition-all ${
                  locale === "en" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale("ur")}
                className={`px-2 py-1 rounded-full transition-all ${
                  locale === "ur" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                اردو
              </button>
              <button
                type="button"
                onClick={() => setLocale("pa")}
                className={`px-2 py-1 rounded-full transition-all ${
                  locale === "pa" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                پنجابی
              </button>
            </div>

            {/* Discreet Parental Gate Lock Icon */}
            <button
              type="button"
              onClick={() => {
                setIsGateUnlocked(false);
                setGateAnswer("");
                setGateError(false);
                setIsParentGateOpen(true);
              }}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Parents & Educators Gate"
              aria-label="Parent and Educator Gate"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-1 pb-28 pt-4 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        {children}
      </main>

      {/* 3. Pre-Reader Child Bottom Navigation Bar (HOME, TALK, PLAY) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2 sm:py-3 shadow-lg"
        aria-label="Child Navigation"
      >
        <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
          {/* HOME BUTTON */}
          <Link
            href="/youth/dashboard"
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all ${
              currentTab === "home"
                ? "bg-amber-500 text-white shadow-md scale-102 font-black"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-bold"
            }`}
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs uppercase tracking-wider">Home</span>
          </Link>

          {/* TALK BUTTON */}
          <Link
            href="/youth/friends"
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all ${
              currentTab === "talk"
                ? "bg-amber-500 text-white shadow-md scale-102 font-black"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-bold"
            }`}
          >
            <MessageCircle className="w-6 h-6 mb-1" />
            <span className="text-xs uppercase tracking-wider">Talk</span>
          </Link>

          {/* PLAY BUTTON */}
          <Link
            href="/youth/play"
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all ${
              currentTab === "play"
                ? "bg-amber-500 text-white shadow-md scale-102 font-black"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-bold"
            }`}
          >
            <Gamepad2 className="w-6 h-6 mb-1" />
            <span className="text-xs uppercase tracking-wider">Play</span>
          </Link>
        </div>
      </nav>

      {/* 4. Discreet Parental Gate Modal */}
      {isParentGateOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 text-[#0F172A]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-800">
                <Shield className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-black">Parents & Educators</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsParentGateOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isGateUnlocked ? (
              <form onSubmit={handleVerifyGate} className="space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  To protect child safety and keep this space focused on learning, please solve this simple question to unlock adult settings:
                </p>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-2">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                    Parental Verification Challenge
                  </p>
                  <p className="text-2xl font-black text-amber-950">
                    What is {NUM_A} &times; {NUM_B}?
                  </p>
                </div>

                <div className="space-y-2">
                  <input
                    type="number"
                    value={gateAnswer}
                    onChange={(e) => setGateAnswer(e.target.value)}
                    placeholder="Enter answer"
                    className="w-full text-center py-3 px-4 rounded-2xl border border-slate-300 text-lg font-black focus:outline-none focus:ring-2 focus:ring-amber-500"
                    autoFocus
                  />
                  {gateError && (
                    <p className="text-xs font-bold text-rose-600 text-center">
                      Incorrect answer. Please try again.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm transition-all shadow-md"
                >
                  Unlock Adult Portals
                </button>
              </form>
            ) : (
              <div className="space-y-3 animate-fade-in">
                <p className="text-xs text-emerald-700 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-center">
                  Verification successful. Choose where to go:
                </p>

                <div className="space-y-2 pt-1">
                  <Link
                    href="/parent"
                    onClick={() => setIsParentGateOpen(false)}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-slate-800 transition-colors font-bold text-sm group"
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-indigo-600" />
                      <span>Parent Dashboard & Settings</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <Link
                    href="/teacher"
                    onClick={() => setIsParentGateOpen(false)}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-slate-800 transition-colors font-bold text-sm group"
                  >
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="w-5 h-5 text-emerald-600" />
                      <span>Teacher & Classroom Portal</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setIsParentGateOpen(false)}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-slate-800 transition-colors font-bold text-sm group"
                  >
                    <div className="flex items-center space-x-3">
                      <Settings className="w-5 h-5 text-slate-700" />
                      <span>Business Administration</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <Link
                    href="/investor-demo"
                    onClick={() => setIsParentGateOpen(false)}
                    className="p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center justify-between text-amber-900 transition-colors font-bold text-sm group"
                  >
                    <div className="flex items-center space-x-3">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                      <span>Investor Interactive Demo</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
