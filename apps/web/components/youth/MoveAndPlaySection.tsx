"use client";

import React, { useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowLeft,
  Volume2,
  ShieldCheck,
} from "lucide-react";
import { useYouth } from "@/components/youth/YouthContext";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";

export const FOOTBALL_DRILLS = [
  {
    step: 1,
    title: "Drill 1: High Knees & Flamingo Balance Warm-Up",
    instruction: "Stand tall! Lift your right knee high to your hip for 5 seconds, then switch to your left leg like a gentle flamingo.",
    ur: "سیدھے کھڑے ہوں! اپنا دایاں گھٹنا اوپر اٹھائیں اور 5 سیکنڈ بیلنس بنائیں، پھر بایاں پاؤں اٹھائیں۔",
    pa: "سدھے کھلوو! پہلاں سجا گوڈا اتے چکو 5 سیکنڈ لئی، فیر کھبا گوڈا چکو۔",
    tip: "Keep your chest high and breathe slowly through your nose.",
    emoji: "🦩",
  },
  {
    step: 2,
    title: "Drill 2: The Inside Foot Pass Touch",
    instruction: "Place a soft ball or rolled socks in front of you. Tap it gently with the flat inside part of your sneaker.",
    ur: "ایک نرم گیند اپنے سامنے رکھیں۔ اپنے جوتے کے اندرونی حصے سے گیند کو پیار سے آگے بڑھائیں۔",
    pa: "اک نرم گیند اگے رکھو تے جوتی دے اندرلے پاسے نال ہولی جئی کِک مارو۔",
    tip: "Never kick with only your toes! The inside of your foot gives you super control.",
    emoji: "👟",
  },
  {
    step: 3,
    title: "Drill 3: Toe Taps & Little Dance",
    instruction: "Alternate tapping the top of the ball with the bottom of your right foot, then your left foot, like a light dance!",
    ur: "باری باری اپنے دائیں اور بائیں جوتے کے تلوے سے گیند کے اوپر ہلکا سا ہاتھ یا پاؤں چھوئیں جیسے رقص کر رہے ہوں۔",
    pa: "واری واری سجے تے کھبے پیر نال گیند نوں اتے توں چھوہو، جیویں ہلکا ناچ ہووے۔",
    tip: "Count 10 light taps together out loud!",
    emoji: "⚽",
  },
  {
    step: 4,
    title: "Drill 4: Sportsmanship & Team High Five",
    instruction: "Raise your hands, give your teammate or family member an imaginary high-five, and say 'Great game, friend!'",
    ur: "دونوں ہاتھ اٹھائیں، اپنے ساتھی کو ہائی فائیو دیں اور کہیں 'بہت زبردست کھیل، دوست!'",
    pa: "دونوں ہتھ اتے چکو، اپنے یار نوں تالی مارو تے آکھو 'شاباش دوست!'",
    tip: "True champions celebrate their friends and play with kind hearts.",
    emoji: "🤝",
  },
];

export function MoveAndPlaySection({ onBack }: { onBack: () => void }) {
  const { locale } = useYouth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const activeDrill = FOOTBALL_DRILLS[currentStep];

  const handleSpeakDrill = () => {
    const text =
      locale === "ur"
        ? `${activeDrill.title}. ${activeDrill.ur}`
        : locale === "pa"
        ? `${activeDrill.title}. ${activeDrill.pa}`
        : `${activeDrill.title}. ${activeDrill.instruction} Coach Tip: ${activeDrill.tip}`;

    voiceSynthesizer.speak(text, {
      lang: locale === "ur" ? "ur-PK" : locale === "pa" ? "pa-PK" : "en-US",
    });
  };

  const handleNextDrill = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }
    if (currentStep < FOOTBALL_DRILLS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowCelebration(true);
      try {
        fetch("/api/educational/activity-events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_pseudonymous_id: "std_weebly_child",
            student_name: "Child (Weebly Sanctuary)",
            activity_id: "act_football_fundamentals",
            activity_title: "Move & Play: Football Fundamentals Drills",
            category: "physical_health_and_movement",
            learning_objective: "Gross motor coordination, balance, and sportsmanship high-five",
            completion_status: "completed",
            hints_used_count: 0,
            language_used: locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en",
            duration_seconds: 120,
            curriculum_version: "v3.0.0",
          }),
        }).catch(() => {});
      } catch {
        // Non-blocking
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>Back to Play Room</span>
        </button>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-black">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>Move &amp; Play: Sports Fundamentals</span>
        </div>
      </div>

      {/* Main Interactive Card */}
      <div className="rounded-[36px] bg-white border-2 border-emerald-200 p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs">
              <span>Drill {currentStep + 1} of {FOOTBALL_DRILLS.length}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {activeDrill.title}
            </h2>
          </div>

          <button
            onClick={handleSpeakDrill}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm active:scale-95 transition-all self-start sm:self-auto"
          >
            <Volume2 className="w-4 h-4" />
            <span>Hear Coach Instructions</span>
          </button>
        </div>

        {/* Drill Hero Display */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-8 text-center space-y-4">
          <div className="text-7xl sm:text-8xl animate-bounce">
            {activeDrill.emoji}
          </div>

          <p className="text-lg sm:text-xl font-extrabold text-slate-800 max-w-xl mx-auto leading-relaxed">
            {locale === "ur"
              ? activeDrill.ur
              : locale === "pa"
              ? activeDrill.pa
              : activeDrill.instruction}
          </p>

          <div className="p-4 rounded-2xl bg-white/80 border border-emerald-200 max-w-md mx-auto text-xs font-bold text-emerald-900 flex items-center justify-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Safety Tip: {activeDrill.tip}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-5 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-black text-sm disabled:opacity-40 hover:bg-slate-50 transition-all"
          >
            Previous Drill
          </button>

          <button
            onClick={handleNextDrill}
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm shadow-md hover:opacity-95 active:scale-95 transition-all"
          >
            <span>
              {currentStep === FOOTBALL_DRILLS.length - 1
                ? "Finish Football Mission!"
                : "I Did It! Next Drill"}
            </span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* Completion Modal */}
      {showCelebration && (
        <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto text-3xl">
            🏆
          </div>
          <h3 className="text-2xl sm:text-3xl font-black">
            Awesome Job, Sports Champion!
          </h3>
          <p className="text-sm sm:text-base font-medium max-w-md mx-auto text-emerald-50">
            You completed the Football Fundamentals drill with great balance, focus, and sportsmanship!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setCurrentStep(0);
                setShowCelebration(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs"
            >
              Play Drills Again
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl bg-white text-emerald-800 font-black text-xs shadow-md"
            >
              Back to Play Room
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
