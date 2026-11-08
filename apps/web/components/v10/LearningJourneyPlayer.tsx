"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LearningJourney,
  JourneyStageId,
} from "@/lib/v10-journey-engine";
import { CompanionPortrait } from "@/components/v9/CompanionPortrait";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";
import {
  Play,
  Pause,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Bookmark,
  Volume2,
  Sparkles,
  BookOpen,
  Gamepad2,
  Hammer,
  Heart,
  X,
} from "lucide-react";

const STAGES: Array<{ id: JourneyStageId; label: string; icon: any; subtitle: string }> = [
  { id: "watch", label: "1. Watch", icon: Play, subtitle: "Animated Story & Visual Intro" },
  { id: "learn", label: "2. Learn", icon: BookOpen, subtitle: "Companion Guide & Examples" },
  { id: "play", label: "3. Play", icon: Gamepad2, subtitle: "Interactive Practice" },
  { id: "implement", label: "4. Implement", icon: Hammer, subtitle: "Project or Real-World Task" },
  { id: "reflect", label: "5. Reflect", icon: Heart, subtitle: "Child Choice & Adult Note" },
];

const AAC_QUICK_BAR = [
  { label: "Read Aloud", phrase: "Please read this to me.", emoji: "🔊" },
  { label: "I Need a Hint", phrase: "Can I have a helpful hint?", emoji: "💡" },
  { label: "Take a Break", phrase: "I want to pause and take a calm breath.", emoji: "🌿" },
  { label: "I Did It!", phrase: "I finished this step!", emoji: "🌟" },
];

interface LearningJourneyPlayerProps {
  journey: LearningJourney;
  initialStage?: JourneyStageId;
  locale?: "en" | "ur" | "pa";
  onExit?: () => void;
  onCompleted?: (journeyId: string) => void;
}

export function LearningJourneyPlayer({
  journey,
  initialStage = "watch",
  locale = "en",
  onExit,
  onCompleted,
}: LearningJourneyPlayerProps) {
  const [activeStage, setActiveStage] = useState<JourneyStageId>(initialStage);
  const [completedStages, setCompletedStages] = useState<JourneyStageId[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  // Stage-specific interactive state
  const [watchSlideIdx, setWatchSlideIdx] = useState(0);
  const [learnAnswerIdx, setLearnAnswerIdx] = useState<number | null>(null);
  const [playRoundIdx, setPlayRoundIdx] = useState(0);
  const [playSelectedChoice, setPlaySelectedChoice] = useState<string | null>(null);
  const [playShowHint, setPlayShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [selectedReflection, setSelectedReflection] = useState<string | null>(null);
  const [caregiverNote, setCaregiverNote] = useState("");
  const [journeyFinished, setJourneyFinished] = useState(false);

  const stageIdx = STAGES.findIndex((s) => s.id === activeStage);

  // Restore saved progress from localStorage if available
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`weebly_v10_jprog_${journey.journey_id}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.current_stage && !initialStage) {
          setActiveStage(parsed.current_stage);
        }
        if (Array.isArray(parsed.completed_stages)) {
          setCompletedStages(parsed.completed_stages);
        }
        if (parsed.reflection_response) {
          setSelectedReflection(parsed.reflection_response);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, [journey.journey_id, initialStage]);

  const speakText = (text: string) => {
    if (isPaused) return;
    setIsSpeaking(true);
    voiceSynthesizer.speak(text, {
      characterId: journey.learn_content.mentor,
      locale,
      onEnd: () => setIsSpeaking(false),
    });
  };

  const handleCurrentStageAudio = () => {
    if (activeStage === "watch") {
      speakText(journey.watch_content.narration_script[locale]);
    } else if (activeStage === "learn") {
      speakText(journey.learn_content.explanation[locale]);
    } else if (activeStage === "play") {
      const round = journey.play_activity.rounds[playRoundIdx];
      speakText(round ? round.prompt : journey.play_activity.instructions);
    } else if (activeStage === "implement") {
      speakText(`${journey.implementation_task.title}. ${journey.implementation_task.step_by_step.join(" ")}`);
    } else {
      speakText(journey.reflection.child_prompt);
    }
  };

  const persistProgress = async (
    nextStage: JourneyStageId,
    nextCompleted: JourneyStageId[],
    status: "in_progress" | "completed" = "in_progress"
  ) => {
    const payload = {
      journey_id: journey.journey_id,
      current_stage: nextStage,
      completed_stages: nextCompleted,
      reflection_response: selectedReflection || undefined,
      caregiver_observation: caregiverNote.trim() || undefined,
      status,
      language_used: locale,
    };

    try {
      localStorage.setItem(`weebly_v10_jprog_${journey.journey_id}`, JSON.stringify(payload));
    } catch {
      // ignore
    }

    try {
      await fetch("/api/youth/journeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (status === "completed") {
        await fetch("/api/educational/activity-events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activity_id: journey.journey_id,
            activity_title: `Journey: ${journey.title}`,
            category: journey.subject.toLowerCase().replace(/\s+/g, "_"),
            learning_objective: journey.learning_objective,
            completion_status: "completed",
            hints_used_count: hintsUsed,
            language_used: locale,
            duration_seconds: 300,
            curriculum_version: journey.version,
          }),
        });
      }
    } catch {
      // local storage already saved
    }
  };

  const handleMarkStageAndAdvance = async () => {
    const updatedCompleted = Array.from(new Set([...completedStages, activeStage]));
    setCompletedStages(updatedCompleted);

    if (stageIdx < STAGES.length - 1) {
      const nextStage = STAGES[stageIdx + 1].id;
      setActiveStage(nextStage);
      await persistProgress(nextStage, updatedCompleted, "in_progress");
    } else {
      setJourneyFinished(true);
      await persistProgress("reflect", updatedCompleted, "completed");
      onCompleted?.(journey.journey_id);
    }
  };

  const handleSaveForLater = async () => {
    await persistProgress(activeStage, completedStages, "in_progress");
    setSaveBanner("Progress saved! You can resume from this exact stage anytime.");
    setTimeout(() => setSaveBanner(null), 3500);
  };

  const currentRound = journey.play_activity.rounds[playRoundIdx] || journey.play_activity.rounds[0];

  return (
    <div className="rounded-[32px] bg-white border-2 border-slate-900 p-5 sm:p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-6">
      {/* Top Bar: Title, Metadata & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-extrabold">
              {journey.subject} • Ages {journey.age_band} ({journey.grade})
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
              {journey.estimated_duration}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
            {journey.title}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            <strong>Objective:</strong> {journey.learning_objective}
          </p>
        </div>

        {/* Player Controls: Audio, Pause, Replay, Save, Exit */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCurrentStageAudio}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? "Speaking..." : "Audio Guide"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const nextPaused = !isPaused;
              setIsPaused(nextPaused);
              if (nextPaused) voiceSynthesizer.stop();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span>{isPaused ? "Resume" : "Pause"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setWatchSlideIdx(0);
              setLearnAnswerIdx(null);
              setPlayRoundIdx(0);
              setPlaySelectedChoice(null);
              handleCurrentStageAudio();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay</span>
          </button>

          <button
            type="button"
            onClick={handleSaveForLater}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold"
          >
            <Bookmark className="w-4 h-4" />
            <span>Save</span>
          </button>

          {onExit && (
            <button
              type="button"
              onClick={() => {
                voiceSynthesizer.stop();
                onExit();
              }}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold"
            >
              <X className="w-4 h-4" />
              <span>Exit</span>
            </button>
          )}
        </div>
      </div>

      {saveBanner && (
        <div
          role="status"
          className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveBanner}</span>
        </div>
      )}

      {/* 5-Stage Stepper (Flexible — Child or Educator can jump or skip to any stage) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" role="tablist" aria-label="Learning Journey Stages">
        {STAGES.map((stage) => {
          const Icon = stage.icon;
          const isCurrent = activeStage === stage.id;
          const isDone = completedStages.includes(stage.id);
          return (
            <button
              key={stage.id}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              onClick={() => setActiveStage(stage.id)}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                isCurrent
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : isDone
                  ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                  : "bg-[#FAF7F2] border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className="w-4 h-4" />
                {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
              <div className="mt-2">
                <div className="text-xs font-extrabold">{stage.label}</div>
                <div className="text-[10px] opacity-80 truncate">{stage.subtitle}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Pause Overlay */}
      {isPaused ? (
        <div className="p-10 rounded-3xl bg-[#FAF7F2] border border-slate-200 text-center space-y-4">
          <h3 className="text-2xl font-extrabold text-slate-900">Journey Paused — Take a Calm Breath</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Stretch your arms, take a sip of water, and press Resume whenever you are ready to continue.
          </p>
          <button
            type="button"
            onClick={() => setIsPaused(false)}
            className="px-6 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold"
          >
            Resume Journey
          </button>
        </div>
      ) : journeyFinished ? (
        <div className="p-8 rounded-3xl bg-emerald-50 border-2 border-emerald-500 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Journey Complete! Recorded in Your Skills Passport
          </h3>
          <p className="text-sm text-slate-700 max-w-lg mx-auto">
            You practiced <strong>{journey.developmental_skill}</strong> in <strong>{journey.title}</strong>.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/youth/passport"
              className="px-6 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold"
            >
              Open My Skills &amp; Creations Passport →
            </Link>
            <button
              type="button"
              onClick={() => {
                setJourneyFinished(false);
                setActiveStage("watch");
              }}
              className="px-5 py-3 rounded-2xl bg-white border border-slate-300 text-slate-800 text-xs font-bold"
            >
              Replay Any Stage
            </button>
          </div>
        </div>
      ) : (
        /* Active Stage Viewport */
        <div className="rounded-3xl bg-[#FAF7F2] border border-[#E7E0D6] p-6 sm:p-8 space-y-6">
          {/* STAGE 1: WATCH */}
          {activeStage === "watch" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                  Stage 1 • Watch &amp; Listen ({watchSlideIdx + 1} of {journey.watch_content.slides.length})
                </span>
                <button
                  type="button"
                  onClick={() => speakText(journey.watch_content.narration_script[locale])}
                  className="text-xs font-bold text-indigo-700 hover:underline inline-flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Read Story Aloud</span>
                </button>
              </div>

              <div className="rounded-2xl bg-white border-2 border-slate-900 p-6 sm:p-8 text-center space-y-3">
                <div className="text-3xl sm:text-4xl font-extrabold py-3 px-6 rounded-2xl bg-amber-50 border border-amber-200 inline-block">
                  {journey.watch_content.slides[watchSlideIdx].visual_cue}
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {journey.watch_content.slides[watchSlideIdx].heading}
                </h3>
                <p className="text-base text-slate-700 max-w-xl mx-auto">
                  {journey.watch_content.slides[watchSlideIdx].caption}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  disabled={watchSlideIdx === 0}
                  onClick={() => setWatchSlideIdx((i) => Math.max(0, i - 1))}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold disabled:opacity-40"
                >
                  ← Previous Slide
                </button>
                <div className="flex gap-1.5">
                  {journey.watch_content.slides.map((s, idx) => (
                    <button
                      key={s.slide_number}
                      type="button"
                      onClick={() => setWatchSlideIdx(idx)}
                      className={`w-8 h-2.5 rounded-full ${
                        watchSlideIdx === idx ? "bg-slate-900" : "bg-slate-300"
                      }`}
                      aria-label={`Slide ${s.slide_number}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (watchSlideIdx < journey.watch_content.slides.length - 1) {
                      setWatchSlideIdx((i) => i + 1);
                    } else {
                      handleMarkStageAndAdvance();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  {watchSlideIdx < journey.watch_content.slides.length - 1
                    ? "Next Slide →"
                    : "Continue to Learn →"}
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: LEARN */}
          {activeStage === "learn" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200">
                <CompanionPortrait character={journey.learn_content.mentor} size={76} />
                <div className="space-y-1">
                  <span className="text-xs font-extrabold uppercase text-indigo-600">
                    Stage 2 • Guided Explanation with {journey.learn_content.mentor.toUpperCase()}
                  </span>
                  <p className="text-base font-medium text-slate-800 leading-relaxed">
                    {journey.learn_content.explanation[locale]}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {journey.learn_content.visual_examples.map((ex) => (
                  <div key={ex.label} className="p-4 rounded-2xl bg-white border border-slate-200">
                    <div className="text-xs font-extrabold text-indigo-700 uppercase">{ex.label}</div>
                    <div className="text-sm font-semibold text-slate-800 mt-1">{ex.detail}</div>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-white border-2 border-slate-900 space-y-3">
                <div className="text-xs font-extrabold uppercase text-slate-500">Quick Check</div>
                <h4 className="text-base font-bold text-slate-900">
                  {journey.learn_content.check_question.prompt}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {journey.learn_content.check_question.options.map((opt, idx) => {
                    const selected = learnAnswerIdx === idx;
                    const isCorrect = idx === journey.learn_content.check_question.correct_index;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setLearnAnswerIdx(idx)}
                        className={`p-3.5 rounded-xl border text-left text-xs font-bold transition ${
                          selected
                            ? isCorrect
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-amber-100 text-amber-900 border-amber-400"
                            : "bg-[#FAF7F2] border-slate-300 text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {learnAnswerIdx !== null && (
                  <p className="text-xs font-bold text-emerald-800 pt-1">
                    {learnAnswerIdx === journey.learn_content.check_question.correct_index
                      ? `🌟 ${journey.learn_content.check_question.encouragement}`
                      : "Good try! Look at the visual examples above and tap another choice."}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STAGE 3: PLAY */}
          {activeStage === "play" && currentRound && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-emerald-700">
                  Stage 3 • Interactive Play (Round {playRoundIdx + 1} of {journey.play_activity.rounds.length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPlayShowHint(true);
                    setHintsUsed((h) => h + 1);
                  }}
                  className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold"
                >
                  💡 Show Friendly Hint
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-white border-2 border-slate-900 space-y-4">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {currentRound.prompt}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentRound.choices.map((choice) => {
                    const isPicked = playSelectedChoice === choice;
                    const isRight = choice === currentRound.correct_choice;
                    return (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => setPlaySelectedChoice(choice)}
                        className={`p-4 rounded-2xl border-2 text-sm font-extrabold transition ${
                          isPicked
                            ? isRight
                              ? "bg-emerald-600 text-white border-emerald-700"
                              : "bg-amber-50 text-amber-900 border-amber-400"
                            : "bg-[#FAF7F2] border-slate-300 text-slate-900 hover:border-slate-900"
                        }`}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>

                {playShowHint && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
                    <strong>Hint:</strong> {currentRound.hint}
                  </div>
                )}

                {playSelectedChoice && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold text-slate-700">
                      {playSelectedChoice === currentRound.correct_choice
                        ? "🎉 Awesome job! You solved this round!"
                        : "Almost there! Try another option or tap the hint button."}
                    </span>
                    {playSelectedChoice === currentRound.correct_choice &&
                      playRoundIdx < journey.play_activity.rounds.length - 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setPlayRoundIdx((i) => i + 1);
                            setPlaySelectedChoice(null);
                            setPlayShowHint(false);
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                        >
                          Next Round →
                        </button>
                      )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STAGE 4: IMPLEMENT */}
          {activeStage === "implement" && (
            <div className="space-y-5">
              <span className="text-xs font-extrabold uppercase text-amber-800">
                Stage 4 • Implement &amp; Create ({journey.implementation_task.title})
              </span>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Step-by-Step Hands-On Application
                </h3>
                <div className="space-y-2.5">
                  {journey.implementation_task.step_by_step.map((step, idx) => {
                    const checked = checkedSteps.includes(idx);
                    return (
                      <button
                        key={step}
                        type="button"
                        onClick={() =>
                          setCheckedSteps((prev) =>
                            prev.includes(idx) ? prev.filter((x) => x !== idx) : [...prev, idx]
                          )
                        }
                        className={`w-full p-3.5 rounded-xl border text-left text-sm font-semibold flex items-center gap-3 transition ${
                          checked
                            ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                            : "bg-[#FAF7F2] border-slate-200 text-slate-800"
                        }`}
                      >
                        <span className="w-6 h-6 rounded-full bg-white border border-slate-300 flex items-center justify-center text-xs font-bold">
                          {checked ? "✓" : idx + 1}
                        </span>
                        <span>{step}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900">
                  <strong>Offline Family / Classroom Option:</strong>{" "}
                  {journey.implementation_task.offline_alternative}
                </div>

                {journey.implementation_task.creator_tool_link && (
                  <div className="pt-2">
                    <Link
                      href={journey.implementation_task.creator_tool_link}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Open Linked Studio Tool →</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STAGE 5: REFLECT */}
          {activeStage === "reflect" && (
            <div className="space-y-5">
              <span className="text-xs font-extrabold uppercase text-pink-700">
                Stage 5 • Child Reflection &amp; Optional Adult Observation
              </span>

              <div className="p-6 rounded-2xl bg-white border-2 border-slate-900 space-y-4">
                <h3 className="text-lg font-extrabold text-slate-900">
                  {journey.reflection.child_prompt}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {journey.reflection.child_response_choices.map((choice) => (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => setSelectedReflection(choice.label)}
                      className={`p-4 rounded-2xl border-2 text-center transition ${
                        selectedReflection === choice.label
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-[#FAF7F2] border-slate-200 text-slate-800 hover:border-slate-900"
                      }`}
                    >
                      <div className="text-2xl">{choice.emoji_or_symbol}</div>
                      <div className="text-xs font-extrabold mt-1.5">{choice.label}</div>
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-600">
                    Optional Caregiver / Teacher Observation Note ({journey.reflection.caregiver_teacher_observation_prompt}):
                  </label>
                  <input
                    type="text"
                    value={caregiverNote}
                    onChange={(e) => setCaregiverNote(e.target.value)}
                    placeholder="Add a brief factual observation for the family or classroom log..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AAC / Inclusive Tap-to-Speak Communication Strip */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            AAC Quick Voice:
          </span>
          {AAC_QUICK_BAR.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => speakText(item.phrase)}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1"
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Bottom Navigation: Previous / Skip / Next */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={stageIdx === 0}
            onClick={() => setActiveStage(STAGES[Math.max(0, stageIdx - 1)].id)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 disabled:opacity-40 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {stageIdx < STAGES.length - 1 && (
            <button
              type="button"
              onClick={() => setActiveStage(STAGES[stageIdx + 1].id)}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              Skip Stage
            </button>
          )}

          <button
            type="button"
            onClick={handleMarkStageAndAdvance}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5"
          >
            <span>{stageIdx === STAGES.length - 1 ? "Complete Journey ✓" : "Complete & Next"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
