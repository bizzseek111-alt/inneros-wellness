"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  HelpCircle,
  MessageSquare,
  Send,
  Sliders,
  ChevronLeft,
  ShieldAlert,
  AlertCircle,
  Info,
  Clock,
} from "lucide-react";
import { YouthShell } from "@/components/youth/YouthShell";
import { useYouth } from "@/components/youth/YouthContext";
import { AI_FRIENDS, CHARACTER_LIST, CharacterId } from "@/lib/friends-data";
import { CharacterAvatar } from "@/components/youth/friends/CharacterAvatar";
import { CharacterVisualState } from "@/components/youth/friends/KaiCharacter";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";

function FriendsRoomContent() {
  const { ageTier, locale, setLocale } = useYouth();
  const searchParams = useSearchParams();

  // Character selection (default to Kai as specified)
  const initialChar = (searchParams.get("friend") as CharacterId) || "kai";
  const [selectedCharacterId, setSelectedCharacterId] = useState<CharacterId>(
    AI_FRIENDS[initialChar] ? initialChar : "kai"
  );
  const activeChar = AI_FRIENDS[selectedCharacterId];

  // Conversation & Audio States
  const [visualState, setVisualState] = useState<CharacterVisualState>("idle");
  const [micPermission, setMicPermission] = useState<"prompt" | "granted" | "denied">("prompt");
  const [isMicListening, setIsMicListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [companionReply, setCompanionReply] = useState(activeChar.voiceProfile.samplePhrases.en);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [volumeLevel, setVolumeLevel] = useState(85);
  const [isMuted, setIsMuted] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [turnCount, setTurnCount] = useState(0);
  const [windDownNotice, setWindDownNotice] = useState<string | null>(null);
  const [crisisAlert, setCrisisAlert] = useState<string | null>(null);
  const [safetyResources, setSafetyResources] = useState<any[]>([]);
  const [waveformBars, setWaveformBars] = useState<number[]>([30, 45, 60, 80, 55, 40, 70, 85, 50, 35]);

  const recognitionRef = useRef<any>(null);
  const sessionIdRef = useRef<string>(`friends_${Date.now()}`);

  // Greeting update on character change
  useEffect(() => {
    const char = AI_FRIENDS[selectedCharacterId];
    const phrase =
      locale === "ur"
        ? char.voiceProfile.samplePhrases.ur
        : locale === "pa"
        ? char.voiceProfile.samplePhrases.pa
        : char.voiceProfile.samplePhrases.en;
    setCompanionReply(phrase);
    setLiveTranscript("");
    setCrisisAlert(null);
  }, [selectedCharacterId, locale]);

  // Waveform animation
  useEffect(() => {
    if (visualState !== "listening" && visualState !== "speaking") return;
    const interval = setInterval(() => {
      setWaveformBars(
        Array.from({ length: 14 }, () => Math.floor(15 + Math.random() * 85))
      );
    }, 110);
    return () => clearInterval(interval);
  }, [visualState]);

  // Request Microphone
  const handleRequestMicrophone = async () => {
    if (typeof window === "undefined") return;

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicPermission("granted");
        startSpeechRecognition();
      }
    } catch {
      setMicPermission("denied");
    }
  };

  const startSpeechRecognition = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setCompanionReply("Speech recognition is not supported in this browser. You can type to me below!");
      return;
    }

    try {
      if (recognitionRef.current) recognitionRef.current.abort();

      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;

      if (locale === "ur" || locale === "ur-Latn") {
        rec.lang = "ur-PK";
      } else if (locale === "pa") {
        rec.lang = "pa-PK";
      } else {
        rec.lang = "en-US";
      }

      rec.onstart = () => {
        setIsMicListening(true);
        setVisualState("listening");
      };

      rec.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setLiveTranscript(transcript);

        if (event.results[0].isFinal) {
          sendUtterance(transcript);
        }
      };

      rec.onerror = () => {
        setIsMicListening(false);
        setVisualState("idle");
      };

      rec.onend = () => {
        setIsMicListening(false);
        if (visualState === "listening") {
          setVisualState("idle");
        }
      };

      rec.start();
      recognitionRef.current = rec;
    } catch {
      setIsMicListening(false);
      setVisualState("idle");
    }
  };

  const handleToggleMic = () => {
    if (micPermission !== "granted") {
      handleRequestMicrophone();
      return;
    }

    if (isMicListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsMicListening(false);
      setVisualState("idle");
    } else {
      startSpeechRecognition();
    }
  };

  const speakReply = async (text: string) => {
    if (isMuted) return;
    setVisualState("speaking");
    await voiceSynthesizer.speak({
      characterId: selectedCharacterId,
      text,
      locale,
      volume: volumeLevel / 100,
      onStart: () => setVisualState("speaking"),
      onEnd: () => setVisualState("idle"),
      onError: () => setVisualState("idle"),
    });
  };

  const sendUtterance = async (messageText: string) => {
    if (!messageText.trim()) return;

    // Halt existing speech and mic
    voiceSynthesizer.stop();
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsMicListening(false);
    setVisualState("thinking");
    setLiveTranscript(messageText);

    try {
      const res = await fetch("/api/youth/friends/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character_id: selectedCharacterId,
          message: messageText,
          language: locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en",
          age_tier: ageTier,
          session_id: sessionIdRef.current,
          turn_count: turnCount,
        }),
      });

      if (!res.ok) throw new Error("Turn failed");
      const data = await res.json();

      setCompanionReply(data.reply);
      setTurnCount(data.turn_count || turnCount + 1);
      setWindDownNotice(data.wind_down_notice || null);

      if (data.is_safety_escalation) {
        setCrisisAlert(data.reply);
        setSafetyResources(data.safety_resources || []);
        setVisualState("idle");
        return;
      }

      speakReply(data.reply);
    } catch {
      // Local graceful fallback
      const fallback =
        selectedCharacterId === "kai"
          ? "I hear you! That's a great thought. Let's look at the very first step together!"
          : "I'm right here with you! Let's take a calm pause together.";
      setCompanionReply(fallback);
      speakReply(fallback);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    sendUtterance(textInput);
    setTextInput("");
  };

  const handleReplay = () => {
    speakReply(companionReply);
  };

  const handleClarify = () => {
    const clarifyPrompt =
      locale === "ur"
        ? "کیا آپ اسے مزید آسان الفاظ میں سمجھا سکتے ہیں؟"
        : locale === "pa"
        ? "کی تسیں ایہنوں تھوڑا ہور سوکھا کر کے سمجھا سکدے او؟"
        : "Can you explain that in a simpler way, please?";
    sendUtterance(clarifyPrompt);
  };

  const handleStopSpeaking = () => {
    voiceSynthesizer.stop();
    setVisualState("idle");
  };

  return (
    <YouthShell
      activeScreen="voice"
      title={`${activeChar.name}'s Voice Room`}
      subtitle={`Talk naturally with ${activeChar.name} in English, Urdu, or Pakistani Punjabi.`}
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Navigation & Character Switcher Ribbon */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <Link
            href="/youth/dashboard"
            className="flex items-center space-x-1.5 text-xs font-black text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          {/* Character Switcher Pill Strip */}
          <div className="flex items-center space-x-2 overflow-x-auto p-1 bg-slate-100 rounded-2xl">
            {CHARACTER_LIST.map((char) => {
              const isSelected = char.id === selectedCharacterId;
              return (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => {
                    voiceSynthesizer.stop();
                    setSelectedCharacterId(char.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 shrink-0 ${
                    isSelected
                      ? "bg-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                  style={{
                    color: isSelected ? char.accentColor : undefined,
                  }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: char.accentColor }} />
                  <span>{char.name}</span>
                </button>
              );
            })}
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-1 text-xs font-black">
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                locale === "en" ? "bg-amber-100 text-amber-900" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale("ur")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                locale === "ur" ? "bg-amber-100 text-amber-900" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              اردو
            </button>
            <button
              type="button"
              onClick={() => setLocale("pa")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                locale === "pa" ? "bg-amber-100 text-amber-900" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              پنجابی
            </button>
          </div>
        </div>

        {/* Crisis Alert Banner */}
        {crisisAlert && (
          <div className="p-5 rounded-3xl bg-rose-50 border-2 border-rose-200 text-rose-900 space-y-3 animate-fade-in shadow-sm">
            <div className="flex items-start space-x-3">
              <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-black text-sm">We Care About You</h4>
                <p className="text-xs leading-relaxed">{crisisAlert}</p>
              </div>
            </div>
            {safetyResources.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-rose-200/60">
                {safetyResources.map((res: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-2xl bg-white border border-rose-200 text-xs space-y-1">
                    <p className="font-black text-rose-950">{res.name}</p>
                    <p className="font-extrabold text-rose-600 text-sm">{res.phone}</p>
                    <p className="text-[11px] text-slate-500">{res.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Session Limit Wind-Down Notice */}
        {windDownNotice && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center space-x-2 text-xs font-bold animate-fade-in">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{windDownNotice}</span>
          </div>
        )}

        {/* Main Stage: Large Animated Character & Waveform */}
        <div
          className={`relative rounded-[40px] bg-gradient-to-b ${activeChar.bgGradient} border-2 border-white shadow-xl p-8 flex flex-col items-center text-center space-y-6 overflow-hidden`}
        >
          {/* Status Badge */}
          <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-2xs text-xs font-black">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                visualState === "listening"
                  ? "bg-emerald-500 animate-ping"
                  : visualState === "speaking"
                  ? "bg-amber-500 animate-pulse"
                  : visualState === "thinking"
                  ? "bg-purple-500 animate-bounce"
                  : "bg-slate-300"
              }`}
            />
            <span className="capitalize text-slate-700">
              {visualState === "listening"
                ? "Listening to you..."
                : visualState === "speaking"
                ? `${activeChar.name} is speaking...`
                : visualState === "thinking"
                ? `${activeChar.name} is thinking...`
                : "Ready to talk"}
            </span>
          </div>

          {/* Hero Character Avatar */}
          <div className="relative py-2">
            <CharacterAvatar
              characterId={selectedCharacterId}
              state={visualState}
              size="hero"
              interactive
              onClick={handleToggleMic}
            />
          </div>

          {/* Audio Waveform Visualizer */}
          <div className="flex items-center justify-center space-x-1.5 h-10 w-full max-w-xs">
            {waveformBars.map((height, idx) => (
              <span
                key={idx}
                className="w-1.5 rounded-full transition-all duration-100"
                style={{
                  height: `${height}%`,
                  backgroundColor:
                    visualState === "listening"
                      ? "#10B981"
                      : visualState === "speaking"
                      ? activeChar.accentColor
                      : "#CBD5E1",
                }}
              />
            ))}
          </div>

          {/* Subtitles & Response Bubble */}
          {showSubtitles && (
            <div className="w-full max-w-xl space-y-3">
              {liveTranscript && (
                <div className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 text-xs text-slate-600 font-semibold italic text-start">
                  <span className="font-extrabold text-slate-400 not-italic block text-[10px] uppercase">
                    You said:
                  </span>
                  &ldquo;{liveTranscript}&rdquo;
                </div>
              )}

              <div className="p-5 rounded-3xl bg-white shadow-sm border border-slate-200 text-sm sm:text-base text-slate-800 font-bold leading-relaxed text-start relative group">
                <span
                  className="font-black text-[11px] uppercase tracking-wider block mb-1"
                  style={{ color: activeChar.accentColor }}
                >
                  {activeChar.name}:
                </span>
                <p className={locale === "ur" || locale === "pa" ? "font-serif text-lg leading-loose" : ""}>
                  {companionReply}
                </p>
              </div>
            </div>
          )}

          {/* Quick Action Chips (Test Phrases & Helpers) */}
          <div className="w-full max-w-xl flex flex-wrap gap-2 justify-center pt-2">
            {activeChar.suggestedQuestions[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"]?.map(
              (q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendUtterance(q)}
                  className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-xs font-bold text-slate-700 border border-slate-200 shadow-2xs hover:scale-102 active:scale-98 transition-all"
                >
                  &ldquo;{q}&rdquo;
                </button>
              )
            )}
          </div>
        </div>

        {/* Voice Control Deck */}
        <div className="p-6 rounded-[32px] bg-white border border-slate-200 shadow-sm space-y-5">
          {/* Big Push-to-Talk Microphone Centerpiece */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <button
              type="button"
              onClick={handleToggleMic}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                isMicListening
                  ? "bg-rose-500 hover:bg-rose-600 text-white scale-110 animate-pulse"
                  : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hover:scale-105 active:scale-95"
              }`}
              aria-label={isMicListening ? "Stop listening" : "Tap to talk"}
            >
              {isMicListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
            <p className="text-xs font-extrabold text-slate-700">
              {micPermission === "denied"
                ? "Microphone access blocked (use text box below)"
                : isMicListening
                ? "Listening... Tap to stop"
                : "Tap to Speak with " + activeChar.name}
            </p>
          </div>

          {/* Secondary Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            {/* Say It Again / Replay & Clarify Buttons */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleReplay}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center space-x-1.5 transition-colors"
                title="Hear character speak again"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Say it again</span>
              </button>

              <button
                type="button"
                onClick={handleClarify}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center space-x-1.5 transition-colors"
                title="Ask character to explain in simpler words"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>I didn&apos;t understand</span>
              </button>

              {visualState === "speaking" && (
                <button
                  type="button"
                  onClick={handleStopSpeaking}
                  className="px-3 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-black transition-colors"
                >
                  Stop
                </button>
              )}
            </div>

            {/* Volume & Subtitles Toggles */}
            <div className="flex items-center space-x-4">
              {/* Volume Slider */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-slate-500 hover:text-slate-800 transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volumeLevel}
                  onChange={(e) => {
                    setVolumeLevel(Number(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-20 accent-amber-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Subtitles Toggle */}
              <button
                type="button"
                onClick={() => setShowSubtitles(!showSubtitles)}
                className={`text-xs font-black px-2.5 py-1 rounded-lg border transition-colors ${
                  showSubtitles
                    ? "bg-slate-800 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-300"
                }`}
              >
                Subtitles: {showSubtitles ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* Text Fallback Input Box for Quiet Rooms or Non-Verbal Kids */}
          <form onSubmit={handleTextSubmit} className="pt-2 flex items-center space-x-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={`Type a message to ${activeChar.name}...`}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              disabled={!textInput.trim()}
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all disabled:opacity-40 flex items-center space-x-1.5 shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </YouthShell>
  );
}

export default function TalkingAIFriendsRoomPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center p-6 text-center">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading AI Friends Room...</p>
        </div>
      }
    >
      <FriendsRoomContent />
    </React.Suspense>
  );
}
