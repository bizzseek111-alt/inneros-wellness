"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Mic,
  CheckCircle2,
  X,
  Play,
  RotateCcw,
  Shield,
  BookOpen,
} from "lucide-react";
import { CharacterAvatar } from "../youth/friends/CharacterAvatar";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";

interface TutorialStep {
  stepNumber: number;
  title: string;
  badge: string;
  description: string;
  actionPrompt: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    stepNumber: 1,
    title: "Meet Kai, Your Curious Learning Guide",
    badge: "Step 1: Introduction",
    description: "Kai is an encouraging synthetic AI companion who breaks tricky questions into bite-sized steps so children build authentic confidence.",
    actionPrompt: "Tap 'Say Hello' to hear Kai greet you.",
  },
  {
    stepNumber: 2,
    title: "Tap Talk & Push-to-Talk Voice",
    badge: "Step 2: Voice Deck",
    description: "No confusing menus. Children simply press the large glowing microphone and speak naturally without needing fluent reading skills.",
    actionPrompt: "Tap the microphone to simulate speaking a question.",
  },
  {
    stepNumber: 3,
    title: "Ask a Learning Question in English",
    badge: "Step 3: English Practice",
    description: "Child says: 'Help me with maths.' Kai understands the intent and opens the math practice question bank automatically.",
    actionPrompt: "Listen to Kai confirm the math mission aloud.",
  },
  {
    stepNumber: 4,
    title: "Switch Seamlessly to Pakistani Urdu",
    badge: "Step 4: Urdu Pakistan",
    description: "Child says: 'Mujhe kahani sunayein' (مجھے کہانی سنائیں). The system automatically switches to Urdu speech and Nastaliq script.",
    actionPrompt: "Tap to hear Kai transition smoothly into Urdu.",
  },
  {
    stepNumber: 5,
    title: "Demonstrate Verified Pakistani Punjabi",
    badge: "Step 5: Majhi Dialect",
    description: "Child speaks Majhi Punjabi: 'Mainu koi khed khilao'. Weebly responds with culturally verified Pakistani Punjabi phonology.",
    actionPrompt: "Tap to listen to verified Pakistani Punjabi speech.",
  },
  {
    stepNumber: 6,
    title: "Complete an Interactive Activity",
    badge: "Step 6: Curriculum Mission",
    description: "Child solves a Fair-Share Division problem from Weebly's 3,000-question curriculum library across 9 developmental domains.",
    actionPrompt: "Select the correct answer to complete the milestone.",
  },
  {
    stepNumber: 7,
    title: "Parent Intelligence & Educational Summary",
    badge: "Step 7: Privacy & Safeguarding",
    description: "Activity event recorded with zero audio leaks, zero persistent profiling, and zero psychological diagnoses for parents and teachers.",
    actionPrompt: "Review the verified parent summary card below.",
  },
];

interface InteractiveProductTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveProductTutorial: React.FC<InteractiveProductTutorialProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentStep = TUTORIAL_STEPS[currentStepIndex];

  const handlePlayStepAudio = () => {
    setIsPlayingAudio(true);
    let speechText = "";
    let speechLang = "en-US";

    if (currentStepIndex === 0) {
      speechText = "Hi there! I'm Kai. What exciting question are we exploring together today?";
      speechLang = "en-US";
    } else if (currentStepIndex === 1) {
      speechText = "I'm listening! Just tell me what you want to learn or play.";
      speechLang = "en-US";
    } else if (currentStepIndex === 2) {
      speechText = "Let's do some fun math together! I am opening your math practice right now.";
      speechLang = "en-US";
    } else if (currentStepIndex === 3) {
      speechText = "جی بالکل! اب ہم اردو میں بات کریں گے۔ آپ آج مجھ سے کیا پوچھنا چاہتے ہیں؟";
      speechLang = "ur-PK";
    } else if (currentStepIndex === 4) {
      speechText = "سلام جی! میں کائی آں۔ اج اسیں کیہڑا سبق مل کے سمجھنا اے؟";
      speechLang = "pa-PK";
    } else if (currentStepIndex === 5) {
      speechText = "Shabash! Great job solving the math puzzle!";
      speechLang = "en-US";
    } else {
      speechText = "Milestone recorded securely for your parent summary.";
      speechLang = "en-US";
    }

    voiceSynthesizer.speak(speechText, {
      characterId: "kai",
      locale: speechLang,
      onEnd: () => setIsPlayingAudio(false),
    });
  };

  const handleNext = () => {
    voiceSynthesizer.stop();
    setIsPlayingAudio(false);
    if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    voiceSynthesizer.stop();
    setIsPlayingAudio(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in text-[#0F172A]"
    >
      <div className="bg-white rounded-[36px] max-w-2xl w-full p-6 sm:p-8 border-2 border-amber-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-100 text-amber-900 border border-amber-200">
              {currentStep.badge}
            </span>
            <span className="text-xs text-slate-500 font-bold">
              {currentStepIndex + 1} of {TUTORIAL_STEPS.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Title & Description */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
            {currentStep.title}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {currentStep.description}
          </p>
        </div>

        {/* Interactive Step Sandbox Content */}
        <div className="p-6 rounded-[28px] bg-gradient-to-b from-amber-50/80 to-orange-50/40 border border-amber-200 text-center space-y-5">
          {/* Step 1-5 Character Centerpiece */}
          {currentStepIndex <= 4 && (
            <div className="flex flex-col items-center justify-center space-y-3">
              <CharacterAvatar
                characterId="kai"
                state={isPlayingAudio ? "speaking" : "idle"}
                size="md"
              />

              <button
                type="button"
                onClick={handlePlayStepAudio}
                className={`px-5 py-2.5 rounded-2xl font-black text-xs flex items-center space-x-2 transition-all shadow-md ${
                  isPlayingAudio
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-amber-500 hover:bg-amber-600 text-white hover:scale-105"
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlayingAudio ? "Kai is Speaking..." : currentStep.actionPrompt}</span>
              </button>
            </div>
          )}

          {/* Step 6: Interactive Math Question */}
          {currentStepIndex === 5 && (
            <div className="space-y-4 text-start">
              <div className="p-4 rounded-2xl bg-white border border-amber-200 space-y-2">
                <span className="text-[11px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                  Math Curriculum Question #q_math_0001
                </span>
                <p className="text-sm font-bold text-slate-900">
                  Ayan has 12 fresh mangoes. He wants to share them equally between 3 cousins. How many mangoes does each cousin receive?
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[3, 4, 6].map((ans) => (
                  <button
                    key={ans}
                    type="button"
                    onClick={() => {
                      setSelectedAnswer(ans);
                      if (ans === 4) handlePlayStepAudio();
                    }}
                    className={`py-3 rounded-xl border-2 font-black text-sm transition-all ${
                      selectedAnswer === ans
                        ? ans === 4
                          ? "bg-emerald-500 text-white border-emerald-600 shadow-md"
                          : "bg-rose-100 text-rose-800 border-rose-300"
                        : "bg-white hover:bg-amber-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    {ans} Mangoes {ans === 4 && selectedAnswer === 4 ? "✓" : ""}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Parent Summary Preview */}
          {currentStepIndex === 6 && (
            <div className="space-y-3 text-start">
              <div className="p-4 rounded-2xl bg-white border border-emerald-200 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                    [OBSERVED FACT]
                  </span>
                  <span className="text-xs font-bold text-slate-400">Just Now</span>
                </div>
                <p className="text-xs font-bold text-slate-800">
                  Completed Fair-Share Division milestone. Solved question on first attempt with zero hints requested.
                </p>
                <div className="flex gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span><strong>Duration:</strong> 120s</span>
                  <span><strong>Domain:</strong> Mathematics</span>
                  <span><strong>Safeguarding:</strong> Safe</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-30 flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center space-x-2 shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <span>{currentStepIndex === TUTORIAL_STEPS.length - 1 ? "Finish Tutorial" : "Next Step"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
