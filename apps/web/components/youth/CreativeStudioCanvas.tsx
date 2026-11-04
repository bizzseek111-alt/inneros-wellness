"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Palette,
  Eraser,
  RotateCcw,
  Download,
  Sparkles,
  CheckCircle2,
  Volume2,
  ArrowLeft,
  Check,
  Award,
} from "lucide-react";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";
import { useYouth } from "./YouthContext";

interface CreativeStudioCanvasProps {
  initialActivity?: string; // e.g. "draw-dinosaur"
  onComplete?: () => void;
}

const PALETTE_COLORS = [
  { name: "Forest Slate", hex: "#0F172A" },
  { name: "Dino Green", hex: "#10B981" },
  { name: "Sky Blue", hex: "#0284C7" },
  { name: "Sunshine Yellow", hex: "#F59E0B" },
  { name: "Coral Peach", hex: "#F43F5E" },
  { name: "Soft Lavender", hex: "#8B5CF6" },
  { name: "Berry Pink", hex: "#EC4899" },
  { name: "Earth Brown", hex: "#78350F" },
];

const DINOSAUR_STEPS = [
  {
    step: 1,
    title: "Step 1: Big Oval Body",
    instruction: "Draw a big rounded potato or oval in the center for the dinosaur's belly!",
    ur: "سب سے پہلے ڈائنوسار کے پیٹ کے لیے درمیان میں ایک بڑا گول دائرہ یا آلو بنائیں!",
    pa: "سب توں پہلاں ڈائنوسار دے پیٹ لئی وچکار اک وڈا گول انڈا بناؤ!",
  },
  {
    step: 2,
    title: "Step 2: Tall Curving Neck",
    instruction: "Draw two smooth lines curving up from the front of the body for a friendly long neck!",
    ur: "اب جسم کے آگے سے دو مڑی ہوئی لکیریں اوپر لے جائیں تاکہ لمبی گردن بن سکے!",
    pa: "ہن پنڈے دے اگوں دو لمیاں لکیراں اتے نوں لجا کے گردن بناؤ!",
  },
  {
    step: 3,
    title: "Step 3: Smiling Head & Eye",
    instruction: "Add a friendly oval head at the top with a big dot for an eye and a sweet smile!",
    ur: "گردن کے اوپر ایک گول چہرہ بنائیں جس میں مسکراتی ہوئی آنکھ اور پیاری مسکان ہو!",
    pa: "گردن اتے اک سوہنا جیا گول منہ بناؤ تے اکھ اتے مسکان پاؤ!",
  },
  {
    step: 4,
    title: "Step 4: Sturdy Tree-Trunk Legs",
    instruction: "Draw four strong column legs at the bottom so your dinosaur can stamp and walk!",
    ur: "نیچے چار مضبوط ٹانگیں بنائیں تاکہ آپ کا ڈائنوسار مزے سے چل سکے!",
    pa: "تھلے چار پکے پیر بناؤ تاں جے ڈائنوسار چھلانگاں مار سکے!",
  },
  {
    step: 5,
    title: "Step 5: Swishing Tail & Colorful Spots",
    instruction: "Draw a tapering tail at the back and decorate your dino with colorful dots and scales!",
    ur: "پیچھے ایک لہراتی دم بنائیں اور اپنے ڈائنوسار کو خوبصورت رنگین نقطوں سے سجائیں!",
    pa: "پچھے اک سوہنی پوچھل بناؤ تے رنگ برنگے نشان لاؤ!",
  },
];

export const CreativeStudioCanvas: React.FC<CreativeStudioCanvasProps> = ({
  initialActivity = "draw-dinosaur",
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { locale } = useYouth();

  const [activeColor, setActiveColor] = useState<string>("#10B981");
  const [lineWidth, setLineWidth] = useState<number>(6);
  const [isErasing, setIsErasing] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Initialize canvas size and background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI and headless fallback
    const rect = canvas.getBoundingClientRect();
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const width = rect.width > 0 ? rect.width : 760;
    const height = rect.height > 0 ? rect.height : 480;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Initial white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = isErasing ? "#FFFFFF" : activeColor;
    ctx.lineWidth = isErasing ? lineWidth * 2.5 : lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.closePath();
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, rect.width, rect.height);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "my-weebly-dinosaur.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleSpeakStep = (stepIdx: number) => {
    const step = DINOSAUR_STEPS[stepIdx];
    const text =
      locale === "ur"
        ? `${step.title}: ${step.ur}`
        : locale === "pa"
        ? `${step.title}: ${step.pa}`
        : `${step.title}: ${step.instruction}`;
    voiceSynthesizer.speak(text, {
      characterId: "mia",
      locale: locale === "ur" ? "ur-PK" : locale === "pa" ? "pa-PK" : "en-US",
    });
  };

  const handleNextStep = () => {
    if (currentStepIndex < DINOSAUR_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      handleSpeakStep(nextIdx);
    } else {
      setIsFinished(true);
      if (onComplete) onComplete();
      voiceSynthesizer.speak(
        locale === "ur"
          ? "ماشاءاللہ! آپ کا ڈائنوسار شاندار لگ رہا ہے۔ آپ نے بہترین تخلیق کی ہے!"
          : "Hooray! What an incredible friendly dinosaur! You did an amazing job creating art with Mia!",
        { characterId: "mia" }
      );
    }
  };

  const activeStep = DINOSAUR_STEPS[currentStepIndex];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar: Back Button + Mia Intro + Speech Instruction */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-pink-50 border-2 border-pink-200">
        <div className="flex items-center space-x-3">
          <Link
            href="/youth/dashboard"
            className="p-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 shadow-2xs font-bold text-xs inline-flex items-center space-x-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit to Magic Home</span>
          </Link>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">🎨</span>
              <h2 className="text-base font-black text-slate-900">
                Creative Studio: Guided Dino Drawing
              </h2>
            </div>
            <p className="text-xs text-pink-900 font-medium">
              Guided by Mia &bull; Ages 4–12 &bull; 10 Mins
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleSpeakStep(currentStepIndex)}
          className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-black shadow-xs flex items-center space-x-2 transition-transform active:scale-95"
        >
          <Volume2 className="w-4 h-4" />
          <span>Listen to Mia</span>
        </button>
      </div>

      {/* Step Guide Banner */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <span className="text-[10px] font-black uppercase tracking-wider text-pink-600">
            {activeStep.title} (Step {currentStepIndex + 1} of {DINOSAUR_STEPS.length})
          </span>
          <p className="text-sm font-bold text-slate-800 leading-relaxed">
            {locale === "ur" ? activeStep.ur : locale === "pa" ? activeStep.pa : activeStep.instruction}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {currentStepIndex > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Previous Step
            </button>
          )}

          <button
            type="button"
            onClick={handleNextStep}
            className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-black shadow-xs transition-transform active:scale-95 flex items-center space-x-1.5"
          >
            <span>{currentStepIndex === DINOSAUR_STEPS.length - 1 ? "Finish Artwork! 🎉" : "Next Step"}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative rounded-[36px] bg-white border-4 border-amber-200 shadow-md p-4 flex flex-col items-center">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-[400px] sm:h-[480px] rounded-2xl border-2 border-slate-100 cursor-crosshair touch-none bg-white"
        />

        {/* Celebration Overlay when Finished */}
        {isFinished && (
          <div className="absolute inset-4 rounded-2xl bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-6 animate-fade-in">
            <div className="p-8 rounded-[32px] bg-white border-2 border-amber-300 shadow-xl max-w-md text-center space-y-4">
              <span className="text-5xl block animate-bounce">🦖 ⭐</span>
              <h3 className="text-2xl font-black text-slate-900">Masterpiece Completed!</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                You created a beautiful dinosaur! You can download your drawing or start an offline paper project with your family.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-black shadow-xs flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Save Drawing</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFinished(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Keep Drawing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drawing Tool Palette */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Color Palette */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider hidden sm:inline">
            Colors:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PALETTE_COLORS.map((col) => (
              <button
                key={col.hex}
                type="button"
                onClick={() => {
                  setActiveColor(col.hex);
                  setIsErasing(false);
                }}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  !isErasing && activeColor === col.hex
                    ? "scale-115 border-slate-900 shadow-xs ring-2 ring-amber-300"
                    : "border-white hover:scale-105"
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
                aria-label={`Select ${col.name}`}
              />
            ))}
          </div>
        </div>

        {/* Brush Sizes */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider hidden sm:inline">
            Size:
          </span>
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
            {[
              { label: "S", size: 4 },
              { label: "M", size: 8 },
              { label: "L", size: 16 },
            ].map((b) => (
              <button
                key={b.size}
                type="button"
                onClick={() => setLineWidth(b.size)}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                  lineWidth === b.size
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions: Eraser, Clear, Save */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsErasing(!isErasing)}
            className={`p-2.5 rounded-xl border text-xs font-black flex items-center space-x-1.5 transition-colors ${
              isErasing
                ? "bg-rose-100 border-rose-300 text-rose-800"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
            title="Eraser tool"
          >
            <Eraser className="w-4 h-4" />
            <span className="hidden sm:inline">Eraser</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold flex items-center space-x-1.5 transition-colors"
            title="Clear canvas"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black flex items-center space-x-1.5 transition-colors"
            title="Download drawing"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
