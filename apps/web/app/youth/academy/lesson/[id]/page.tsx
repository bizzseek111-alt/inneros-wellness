"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  Edit3,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Play,
  Pause,
  Award,
  Globe,
  Heart,
  Eye,
} from "lucide-react";
import { YouthShell } from "@/components/youth/YouthShell";
import { useYouth } from "@/components/youth/YouthContext";
import { apiClient, CurriculumModule } from "@/lib/api-client";

// Safe fallback lesson for static generation / offline preview
const FALLBACK_LESSON: CurriculumModule = {
  module_id: "mod_early_01",
  department_id: "self_regulation_coping",
  title_en: "Lumi's Cozy Bunny Breaths",
  title_ur: "لومی کے خرگوش جیسے پرسکون سانس",
  title_pa: "لومی دے سکھ ساہ لیند دا طریقہ",
  target_age_range: "2-5",
  difficulty: "gentle",
  developmental_objective: "Learn somatic diaphragmatic regulation through playful animal imagery with a caregiver.",
  research_references: [
    "Harvard Center on the Developing Child: InBrief on Executive Function (2011)",
    "Porges, S. W. (2011). The Polyvagal Theory: Neurophysiological Foundations of Emotions",
    "CASEL (2020) Core SEL Competencies: Self-Management",
  ],
  evidence_strength: "level_1_meta_analysis",
  reviewer_name: "Multidisciplinary Clinical Review Board",
  approval_status: "draft",
  version: "1.0.0",
  recommended_session_duration_min: 7,
  accessibility_adaptations: {
    visual: "High-contrast calming pastel tones, large touch targets, picture cues",
    auditory: "Gentle rabbit sniffing sound cue and soothing caregiver voiceover",
    motor: "Single-tap breathing balloon",
    sensory: "Low visual flicker, calm ambient palette, zero sudden chimes",
    cognitive: "One clear step at a time, visual repeat loop",
  },
  interactive_story: {
    title_en: "Lumi in the Clover Meadow",
    title_ur: "شبنم کے باغ میں لومی",
    title_pa: "پُھلاں والی پیلی وچ لومی",
    story_text_en: "Lumi is feeling a little fluttery inside, like a butterfly doing flips. Let's take three quick bunny sniffs through our nose, and one long gentle sigh out like blowing a dandelion puff.",
    story_text_ur: "لومی کے سینے میں تتلیوں جیسی ہلچل ہے۔ آئیے لومی کے ساتھ خرگوش کی طرح ناک سے تین چھوٹے چھوٹے سانس لیں اور منہ سے ہلکی سی پھونک کی طرح سانس باہر نکالیں۔",
    story_text_pa: "لومی دے سینے وچ نکی جہی تتلی اُڈدی محسوس ہو رہی اے۔ آؤ رل کے خرگوش وانگوں نک راہیں ترے نکے نکے ساہ لئیے تے منہ توں ہولی ہولی باہر کڈھیے۔",
    character_name: "Lumi",
    choices: [
      {
        choice_id: "sniff_bunny",
        text_en: "Take 3 bunny sniffs together",
        text_ur: "تین بار خرگوش کی طرح سانس لینا",
        text_pa: "ترے واری خرگوش وانگوں ساہ کھچنا",
        reflection_feedback: "Notice your shoulders dropping and softening.",
      },
      {
        choice_id: "hug_caregiver",
        text_en: "Give your caregiver a soft gentle squeeze",
        text_ur: "اپنے ابو یا امی کا ہاتھ نرمی سے تھامنا",
        text_pa: "اپنے ابو یا امی دا ہتھ پیار نال پھڑنا",
        reflection_feedback: "Warm hugs release oxytocin and bring safe grounding.",
      },
    ],
  },
  voice_based_activity: {
    title: "Bunny Sniff Pacing",
    audio_prompt_en: "Sniff, sniff, sniff... and a gentle sigh out.",
    audio_prompt_ur: "سونگھیں، سونگھیں، سونگھیں... اور لمبا سکھ کا سانس باہر۔",
    audio_prompt_pa: "سُنگھو، سُنگھو، سُنگھو... تے ہولی ہولی ساہ باہر۔",
    guided_exercise_type: "bunny_breaths",
    pacing_seconds: 40,
  },
  text_based_activity: {
    title: "Meadow Picture & Word Tap",
    prompt_en: "How does your tummy feel right now?",
    prompt_ur: "اب آپ کا پیٹ کیسا محسوس کر رہا ہے؟",
    prompt_pa: "ہن تواڈا پیٹ کیویں محسوس کر رہیا اے؟",
    suggested_chips: ["Warm & Soft", "Calmer", "Still wiggly", "Cozy"],
    reflective_guidance: "All feelings are welcome in Lumi's meadow.",
  },
  offline_activity: {
    title: "Dandelion Cloud Game",
    instructions_en: "Hold an imaginary dandelion between your fingers. Take 3 soft sniffs of flowers, then gently blow the seeds into the sky.",
    instructions_ur: "ہاتھ میں ایک خیالی پھول پکڑیں۔ تین بار سونگھیں اور پھر نرمی سے پھونک مار کر بیج اڑائیں۔",
    instructions_pa: "ہتھ وچ اک خیالی پُھل پھڑو۔ ترے واری سُنگھو تے فیر پیار نال پھوک مار کے بیج اڈاؤ۔",
    materials_needed: ["Imagination", "Comfortable blanket"],
    caregiver_or_peer_role: "Caregiver breathes along at the same tempo, modeling calm.",
  },
  knowledge_check: {
    question_en: "When we feel wiggly or upset, what can our bunny breaths do?",
    question_ur: "جب ہمیں بے چینی محسوس ہو تو خرگوش والے سانس کیا کرتے ہیں؟",
    question_pa: "جدوں سانوں بے چینی ہووے تاں خرگوش والے ساہ کیہ کردے نیں؟",
    options: [
      { id: "o1", text: "Help our body feel safe, calm, and cozy", is_helpful: "true" },
      { id: "o2", text: "Make us run as fast as a car", is_helpful: "false" },
    ],
    affirmation_en: "Your breath is your secret superpower anytime you need calm!",
    affirmation_ur: "آپ کا سانس آپ کی اندرونی طاقت ہے جو ہمیشہ آپ کے ساتھ ہے!",
    affirmation_pa: "تواڈا ساہ تواڈی لُکی ہوئی طاقت اے جہڑی ہمیشاں تواڈے نال اے!",
  },
  non_diagnostic_progress_indicator: "Demonstrated early diaphragmatic regulation through playful animal breathing.",
  is_published: false,
  created_at: "",
  updated_at: "",
};

type LessonStage = "story" | "voice" | "text" | "offline" | "check" | "completed";

export default function YouthLessonPlayerPage() {
  const params = useParams();
  const moduleId = (params?.id as string) || "mod_early_01";
  const { locale: contextLocale } = useYouth();

  const [lesson, setLesson] = useState<CurriculumModule>(FALLBACK_LESSON);
  const [activeStage, setActiveStage] = useState<LessonStage>("story");
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "ur" | "pa">("en");
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  // Stage 1 Interactive Story State
  const [selectedStoryChoice, setSelectedStoryChoice] = useState<string | null>(null);

  // Stage 2 Voice Activity State
  const [isExercising, setIsExercising] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(30);

  // Stage 3 Text Activity State
  const [selectedWordChips, setSelectedWordChips] = useState<string[]>([]);
  const [textReflection, setTextReflection] = useState("");

  // Stage 5 Knowledge Check State
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [checkSubmitted, setCheckSubmitted] = useState(false);

  // Initialize language from context
  useEffect(() => {
    if (contextLocale === "ur") setSelectedLanguage("ur");
    else if (contextLocale === "pa") setSelectedLanguage("pa");
    else setSelectedLanguage("en");
  }, [contextLocale]);

  // Load lesson from API
  useEffect(() => {
    async function fetchLesson() {
      try {
        const data = await apiClient.getAcademyModule(moduleId, true);
        if (data) {
          setLesson(data);
          setTimerSeconds(data.voice_based_activity.pacing_seconds || 30);
        }
      } catch (err) {
        console.warn("Using fallback lesson:", err);
      }
    }
    fetchLesson();
  }, [moduleId]);

  // Pacing Timer for Voice Activity
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isExercising && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsExercising(false);
    }
    return () => clearInterval(interval);
  }, [isExercising, timerSeconds]);

  const getStoryTitle = () => {
    if (selectedLanguage === "ur") return lesson.interactive_story.title_ur || lesson.interactive_story.title_en;
    if (selectedLanguage === "pa") return lesson.interactive_story.title_pa || lesson.interactive_story.title_en;
    return lesson.interactive_story.title_en;
  };

  const getStoryText = () => {
    if (selectedLanguage === "ur") return lesson.interactive_story.story_text_ur || lesson.interactive_story.story_text_en;
    if (selectedLanguage === "pa") return lesson.interactive_story.story_text_pa || lesson.interactive_story.story_text_en;
    return lesson.interactive_story.story_text_en;
  };

  const getVoicePrompt = () => {
    if (selectedLanguage === "ur") return lesson.voice_based_activity.audio_prompt_ur || lesson.voice_based_activity.audio_prompt_en;
    if (selectedLanguage === "pa") return lesson.voice_based_activity.audio_prompt_pa || lesson.voice_based_activity.audio_prompt_en;
    return lesson.voice_based_activity.audio_prompt_en;
  };

  const getTextPrompt = () => {
    if (selectedLanguage === "ur") return lesson.text_based_activity.prompt_ur || lesson.text_based_activity.prompt_en;
    if (selectedLanguage === "pa") return lesson.text_based_activity.prompt_pa || lesson.text_based_activity.prompt_en;
    return lesson.text_based_activity.prompt_en;
  };

  const getOfflineInstructions = () => {
    if (selectedLanguage === "ur") return lesson.offline_activity.instructions_ur || lesson.offline_activity.instructions_en;
    if (selectedLanguage === "pa") return lesson.offline_activity.instructions_pa || lesson.offline_activity.instructions_en;
    return lesson.offline_activity.instructions_en;
  };

  const getCheckQuestion = () => {
    if (selectedLanguage === "ur") return lesson.knowledge_check.question_ur || lesson.knowledge_check.question_en;
    if (selectedLanguage === "pa") return lesson.knowledge_check.question_pa || lesson.knowledge_check.question_en;
    return lesson.knowledge_check.question_en;
  };

  const getCheckAffirmation = () => {
    if (selectedLanguage === "ur") return lesson.knowledge_check.affirmation_ur || lesson.knowledge_check.affirmation_en;
    if (selectedLanguage === "pa") return lesson.knowledge_check.affirmation_pa || lesson.knowledge_check.affirmation_en;
    return lesson.knowledge_check.affirmation_en;
  };

  const toggleChip = (chip: string) => {
    setSelectedWordChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  return (
    <YouthShell>
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Link
              href="/youth/academy"
              className="p-2 rounded-xl bg-card border border-border hover:bg-muted text-muted-foreground transition"
              title="Return to Academy"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold">
                  Ages {lesson.target_age_range}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {lesson.recommended_session_duration_min} min
                </span>
              </div>
              <h1 className="text-xl font-bold text-foreground mt-0.5">
                {selectedLanguage === "ur" ? lesson.title_ur : selectedLanguage === "pa" ? lesson.title_pa : lesson.title_en}
              </h1>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border">
            <button
              onClick={() => setSelectedLanguage("en")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedLanguage === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setSelectedLanguage("ur")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold font-urdu transition ${
                selectedLanguage === "ur" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              اردو
            </button>
            <button
              onClick={() => setSelectedLanguage("pa")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold font-urdu transition ${
                selectedLanguage === "pa" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              پنجابی
            </button>
          </div>
        </div>

        {/* Stage Navigation Stepper */}
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {[
            { id: "story", label: "Story", icon: BookOpen },
            { id: "voice", label: "Voice", icon: Volume2 },
            { id: "text", label: "Reflect", icon: Edit3 },
            { id: "offline", label: "Play", icon: Flame },
            { id: "check", label: "Affirm", icon: CheckCircle2 },
          ].map((stage) => {
            const Icon = stage.icon;
            const isActive = activeStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id as LessonStage)}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold"
                    : "bg-card border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[11px]">{stage.label}</span>
              </button>
            );
          })}
        </div>

        {/* STAGE 1: INTERACTIVE STORY */}
        {activeStage === "story" && (
          <div className="rounded-3xl bg-card border border-border p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">
                  Stage 1 • Interactive Illustrated Story
                </span>
                <h2 className="text-2xl font-extrabold text-foreground">{getStoryTitle()}</h2>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-base leading-relaxed text-foreground">
              {getStoryText()}
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                What does Lumi choose to do?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lesson.interactive_story.choices.map((choice) => {
                  const isSelected = selectedStoryChoice === choice.choice_id;
                  const choiceLabel =
                    selectedLanguage === "ur"
                      ? choice.text_ur
                      : selectedLanguage === "pa"
                      ? choice.text_pa
                      : choice.text_en;
                  return (
                    <button
                      key={choice.choice_id}
                      onClick={() => setSelectedStoryChoice(choice.choice_id)}
                      className={`p-4 rounded-2xl border text-left transition space-y-2 ${
                        isSelected
                          ? "bg-primary/10 border-primary text-foreground shadow-xs"
                          : "bg-card border-border hover:border-border/80 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="text-sm font-semibold">{choiceLabel}</div>
                      {isSelected && (
                        <div className="text-xs text-primary font-medium p-2 rounded-xl bg-background border border-primary/20">
                          {choice.reflection_feedback}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setActiveStage("voice")}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition"
              >
                Next: Voice Activity →
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: VOICE SOMATIC ACTIVITY */}
        {activeStage === "voice" && (
          <div className="rounded-3xl bg-card border border-border p-8 shadow-xs space-y-6 text-center">
            <div className="max-w-md mx-auto space-y-2">
              <span className="text-xs uppercase tracking-wider font-bold text-teal-600 dark:text-teal-400">
                Stage 2 • Guided Voice & Somatic Reset
              </span>
              <h2 className="text-2xl font-extrabold text-foreground">
                {lesson.voice_based_activity.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getVoicePrompt()}
              </p>
            </div>

            {/* Breathing Animation Circle */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div
                className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-1000 ${
                  isExercising
                    ? "scale-110 bg-teal-100 dark:bg-teal-950/70 border-4 border-teal-500 shadow-lg"
                    : "scale-95 bg-muted/60 border-2 border-border"
                }`}
              >
                <div className="space-y-1">
                  <Volume2 className={`w-8 h-8 mx-auto ${isExercising ? "text-teal-600 animate-pulse" : "text-muted-foreground"}`} />
                  <div className="text-xl font-mono font-bold text-foreground">
                    {timerSeconds}s
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => setIsExercising(!isExercising)}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition flex items-center gap-2"
                >
                  {isExercising ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isExercising ? "Pause Guided Pacing" : "Begin Somatic Pacing"}</span>
                </button>
                <button
                  onClick={() => {
                    setIsExercising(false);
                    setTimerSeconds(lesson.voice_based_activity.pacing_seconds || 30);
                  }}
                  className="p-2.5 rounded-xl border border-border hover:bg-muted text-muted-foreground"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-border">
              <button
                onClick={() => setActiveStage("story")}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                ← Back to Story
              </button>
              <button
                onClick={() => setActiveStage("text")}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition"
              >
                Next: Reflection Box →
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: TEXT REFLECTION ACTIVITY */}
        {activeStage === "text" && (
          <div className="rounded-3xl bg-card border border-border p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-purple-600 dark:text-purple-400">
                  Stage 3 • Gentle Expression & Vocabulary
                </span>
                <h2 className="text-2xl font-extrabold text-foreground">
                  {lesson.text_based_activity.title}
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-foreground">
                {getTextPrompt()}
              </p>

              {lesson.text_based_activity.suggested_chips.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs text-muted-foreground">Tap words that feel true right now:</span>
                  <div className="flex flex-wrap gap-2">
                    {lesson.text_based_activity.suggested_chips.map((chip) => {
                      const isSelected = selectedWordChips.includes(chip);
                      return (
                        <button
                          key={chip}
                          onClick={() => toggleChip(chip)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                            isSelected
                              ? "bg-purple-600 text-white shadow-xs"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {chip}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <textarea
                value={textReflection}
                onChange={(e) => setTextReflection(e.target.value)}
                placeholder="Write, draw ideas, or share your thoughts here (optional)..."
                rows={3}
                className="w-full p-4 rounded-2xl bg-muted/30 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />

              {lesson.text_based_activity.reflective_guidance && (
                <p className="text-xs text-muted-foreground italic">
                  💡 {lesson.text_based_activity.reflective_guidance}
                </p>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t border-border">
              <button
                onClick={() => setActiveStage("voice")}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                ← Back to Voice
              </button>
              <button
                onClick={() => setActiveStage("offline")}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition"
              >
                Next: Offline Play →
              </button>
            </div>
          </div>
        )}

        {/* STAGE 4: OFFLINE CAREGIVER / PEER PLAY */}
        {activeStage === "offline" && (
          <div className="rounded-3xl bg-card border border-border p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400">
                  Stage 4 • Real-World Offline Connection
                </span>
                <h2 className="text-2xl font-extrabold text-foreground">
                  {lesson.offline_activity.title}
                </h2>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-4">
              <div>
                <h3 className="text-xs uppercase tracking-wider font-bold text-amber-800 dark:text-amber-300">
                  Activity Instructions
                </h3>
                <p className="text-base text-foreground mt-1 leading-relaxed">
                  {getOfflineInstructions()}
                </p>
              </div>

              {lesson.offline_activity.materials_needed.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-muted-foreground">What you will need:</h4>
                  <ul className="list-disc list-inside text-xs text-foreground mt-1 space-y-0.5">
                    {lesson.offline_activity.materials_needed.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2 border-t border-amber-200/40 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200">
                <span className="font-bold">Caregiver / Peer Partner: </span>
                <span>{lesson.offline_activity.caregiver_or_peer_role}</span>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-border">
              <button
                onClick={() => setActiveStage("text")}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                ← Back to Reflect
              </button>
              <button
                onClick={() => setActiveStage("check")}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition"
              >
                Next: Affirmation Check →
              </button>
            </div>
          </div>
        )}

        {/* STAGE 5: KNOWLEDGE CHECK & AFFIRMATION */}
        {activeStage === "check" && (
          <div className="rounded-3xl bg-card border border-border p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
                  Stage 5 • Non-Diagnostic Knowledge Affirmation
                </span>
                <h2 className="text-2xl font-extrabold text-foreground">
                  Check In & Affirm
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-base font-bold text-foreground">
                {getCheckQuestion()}
              </p>

              <div className="space-y-3">
                {lesson.knowledge_check.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSelectedOptionId(opt.id);
                        setCheckSubmitted(true);
                      }}
                      className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold transition flex items-center justify-between ${
                        isSelected
                          ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200"
                          : "bg-card border-border hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      <span>{opt.text}</span>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {checkSubmitted && (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Learning Celebration!</span>
                  </div>
                  <p className="text-sm leading-relaxed">{getCheckAffirmation()}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t border-border">
              <button
                onClick={() => setActiveStage("offline")}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                ← Back to Play
              </button>
              <button
                onClick={() => setActiveStage("completed")}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition"
              >
                Complete Lesson 🎉
              </button>
            </div>
          </div>
        )}

        {/* COMPLETED STAGE */}
        {activeStage === "completed" && (
          <div className="rounded-3xl bg-card border border-border p-10 shadow-xs text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-3xl font-extrabold text-foreground">
                Wonderful Exploration!
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You completed this session at your own pace. Every small moment of reflection helps build emotional safety and resilience.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border max-w-lg mx-auto text-xs text-muted-foreground">
              <span className="font-bold text-foreground">Demonstrated Learning: </span>
              <span>{lesson.non_diagnostic_progress_indicator}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/youth/academy"
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition"
              >
                Explore More Academy Lessons
              </Link>
              <button
                onClick={() => {
                  setActiveStage("story");
                  setSelectedStoryChoice(null);
                  setSelectedOptionId(null);
                  setCheckSubmitted(false);
                }}
                className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Replay Lesson
              </button>
            </div>
          </div>
        )}

        {/* Collapsible Evidence, Pedagogy & Clinical Governance Drawer */}
        <div className="rounded-2xl bg-card border border-border shadow-xs overflow-hidden">
          <button
            onClick={() => setEvidenceOpen(!evidenceOpen)}
            className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-foreground hover:bg-muted/40 transition"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Evidence Framework & Multidisciplinary Review Details</span>
            </div>
            {evidenceOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {evidenceOpen && (
            <div className="p-6 border-t border-border space-y-4 text-xs bg-muted/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-foreground mb-1">Developmental Objective</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {lesson.developmental_objective}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Evidence Level & Governance</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Evidence Strength: </span>
                    {lesson.evidence_strength.replace(/_/g, " ")}
                    <br />
                    <span className="font-semibold text-foreground">Reviewer: </span>
                    {lesson.reviewer_name}
                    <br />
                    <span className="font-semibold text-foreground">Approval Status: </span>
                    {lesson.approval_status}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-1">Scientific Research References</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {lesson.research_references.map((ref, idx) => (
                    <li key={idx}>{ref}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-1">Accessibility Adaptations</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-[11px] text-muted-foreground">
                  <div className="p-2.5 rounded-xl bg-card border border-border">
                    <span className="font-bold text-foreground">Visual: </span>
                    {lesson.accessibility_adaptations.visual}
                  </div>
                  <div className="p-2.5 rounded-xl bg-card border border-border">
                    <span className="font-bold text-foreground">Auditory: </span>
                    {lesson.accessibility_adaptations.auditory}
                  </div>
                  <div className="p-2.5 rounded-xl bg-card border border-border">
                    <span className="font-bold text-foreground">Motor: </span>
                    {lesson.accessibility_adaptations.motor}
                  </div>
                  <div className="p-2.5 rounded-xl bg-card border border-border">
                    <span className="font-bold text-foreground">Sensory: </span>
                    {lesson.accessibility_adaptations.sensory}
                  </div>
                  <div className="p-2.5 rounded-xl bg-card border border-border">
                    <span className="font-bold text-foreground">Cognitive: </span>
                    {lesson.accessibility_adaptations.cognitive}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </YouthShell>
  );
}
