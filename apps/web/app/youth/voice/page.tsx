"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Pause,
  Play,
  Square,
  Globe,
  MessageSquare,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Info,
  CheckCircle2,
  Send,
  Eye,
  Sliders,
  HelpCircle,
} from "lucide-react";
import { YouthShell } from "@/components/youth/YouthShell";
import { LumiMascot } from "@/components/youth/LumiMascot";
import { useYouth } from "@/components/youth/YouthContext";
import { apiClient } from "@/lib/api-client";

export default function YouthVoiceRoomPage() {
  const { ageTier, locale, localeMeta, t, setLocale } = useYouth();

  const [micState, setMicState] = useState<
    "idle" | "listening" | "thinking" | "speaking" | "paused"
  >("idle");
  const [micPermission, setMicPermission] = useState<"prompt" | "granted" | "denied">("prompt");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [companionReply, setCompanionReply] = useState(
    "Hi there! I am Lumi. I am here to listen. You can tap the big microphone and tell me about your day."
  );
  const [crisisAlert, setCrisisAlert] = useState<string | null>(null);
  const [safetyResources, setSafetyResources] = useState<any[]>([]);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [clarificationActive, setClarificationActive] = useState(false);
  const [showBenchmarks, setShowBenchmarks] = useState(false);
  const [benchmarksData, setBenchmarksData] = useState<any | null>(null);

  // New Voice AI Enhancements
  const [volumeLevel, setVolumeLevel] = useState(85);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [voiceDeliveryMode, setVoiceDeliveryMode] = useState<"both" | "spoken_only" | "text_only">("both");
  const [waveformBars, setWaveformBars] = useState<number[]>([30, 45, 70, 85, 60, 40, 75, 90, 50, 35]);

  const sessionIdRef = useRef<string>(`ysess_${Date.now()}`);
  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Initial greeting based on locale
  useEffect(() => {
    if (locale === "ur") {
      setCompanionReply("ہیلو دوست! میں لومی ہوں۔ میں آپ کی بات سننے کے لیے تیار ہوں۔ مائیک دبائیں اور بولنا شروع کریں۔");
      setVoiceNotice(null);
    } else if (locale === "pa") {
      setCompanionReply("سلام جی! میں لومی آں۔ تہاڈی گل سنن لئی حاضر آں۔ مائیک نوں دبو تے بولو۔");
      setVoiceNotice(
        "Pakistani Punjabi (Shahmukhi) natural voice is in qualification. Lumi provides verified text with screen-reader support."
      );
    } else if (locale === "ur-Latn") {
      setCompanionReply("Hello dost! Main Lumi hoon. Aap ki baat sunne ke liye tayyar hoon. Mic daba kar bolein.");
      setVoiceNotice(null);
    } else {
      setCompanionReply("Hi there! I am Lumi. I'm here to listen. Tap the microphone whenever you want to talk.");
      setVoiceNotice(null);
    }
  }, [locale]);

  // Waveform animation during listening or speaking
  useEffect(() => {
    if (micState !== "listening" && micState !== "speaking") return;
    const interval = setInterval(() => {
      setWaveformBars(
        Array.from({ length: 12 }, () => Math.floor(20 + Math.random() * 80))
      );
    }, 120);
    return () => clearInterval(interval);
  }, [micState]);

  // Request browser microphone with iOS AudioContext unlock & offline awareness
  const handleRequestMicrophone = async () => {
    if (typeof window === "undefined") return;

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setCompanionReply(
        "Live voice conversations require an active internet connection. Feel free to use our offline stories or calming breaths while disconnected."
      );
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === "suspended") {
          await ctx.resume();
        }
      }

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
      setCompanionReply(
        "Your browser does not support Web Speech Recognition. You can type into the message box below to chat with Lumi."
      );
      return;
    }

    try {
      if (recognitionRef.current) recognitionRef.current.abort();

      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;

      // Locale-matched speech recognition
      if (locale === "ur" || locale === "ur-Latn") {
        rec.lang = "ur-PK";
      } else if (locale === "pa") {
        rec.lang = "pa-PK";
      } else {
        rec.lang = "en-US";
      }

      rec.onstart = () => {
        setMicState("listening");
        setClarificationActive(false);
      };

      rec.onresult = (event: any) => {
        let transcript = "";
        let confidence = 1.0;
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
          if (event.results[i][0].confidence) {
            confidence = event.results[i][0].confidence;
          }
        }
        setLiveTranscript(transcript);

        if (event.results[0].isFinal) {
          processChildUtterance(transcript, confidence);
        }
      };

      rec.onerror = () => {
        setMicState("idle");
      };

      rec.onend = () => {
        if (micState === "listening") {
          setMicState("idle");
        }
      };

      rec.start();
      recognitionRef.current = rec;
    } catch {
      setMicState("idle");
    }
  };

  const handleToggleMic = () => {
    if (micPermission !== "granted") {
      handleRequestMicrophone();
      return;
    }

    if (micState === "listening") {
      if (recognitionRef.current) recognitionRef.current.stop();
      setMicState("idle");
    } else {
      startSpeechRecognition();
    }
  };

  const handleStop = async () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    try {
      await apiClient.interruptYouthAudio(sessionIdRef.current);
    } catch {
      // safe fallback
    }
    setMicState("idle");
  };

  const handleReplay = () => {
    if (voiceDeliveryMode === "text_only") return;
    speakViaWebSpeech(companionReply);
  };

  const processChildUtterance = async (text: string, confidence: number = 1.0) => {
    setMicState("thinking");

    try {
      const response = await apiClient.executeYouthTurn({
        session_id: sessionIdRef.current,
        user_utterance: text,
        language: locale,
        age_tier: ageTier === "little" ? "early" : ageTier === "teen" ? "teen" : "junior_young",
        confidence_score: confidence,
        caregiver_present: ageTier === "little",
      });

      setCompanionReply(response.transcript_agent);

      // 1. Safety Escalation
      if (response.is_safety_escalation) {
        setCrisisAlert(response.transcript_agent);
        setSafetyResources(response.safety_resources || []);
        setMicState("idle");
        return;
      }

      // 2. Low Confidence Clarification
      if (response.clarification_requested) {
        setClarificationActive(true);
        setMicState("idle");
        return;
      }

      // 3. Pakistani Punjabi / Unsupported Fallback
      if (response.audio_status === "unsupported_voice_fallback_text") {
        setVoiceNotice(
          response.voice_unavailable_reason ||
            "Natural Pakistani Punjabi (Shahmukhi) TTS voice is in qualification. Lumi provides verified text with screen-reader support."
        );
        setMicState("idle");
        return;
      } else {
        setVoiceNotice(null);
      }

      // 4. Audio Playback according to delivery mode
      if (voiceDeliveryMode !== "text_only") {
        setMicState("speaking");
        if (response.audio_base64 && response.audio_status === "synthesized") {
          const audio = new Audio(
            `data:audio/${response.audio_format};base64,${response.audio_base64}`
          );
          audio.volume = volumeLevel / 100;
          audioPlayerRef.current = audio;
          audio.onended = () => setMicState("idle");
          audio.play().catch(() => {
            speakViaWebSpeech(response.transcript_agent);
          });
        } else {
          speakViaWebSpeech(response.transcript_agent);
        }
      } else {
        setMicState("idle");
      }
    } catch {
      try {
        const localTurn = await fetch("/api/youth/friends/turn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            character_id: "lumi",
            message: text,
            language: locale,
            age_tier: ageTier === "little" ? "little" : ageTier === "teen" ? "teen" : "junior",
          }),
        }).then((r) => r.json());

        setCompanionReply(localTurn.reply);
        if (voiceDeliveryMode !== "text_only") {
          setMicState("speaking");
          speakViaWebSpeech(localTurn.reply);
        } else {
          setMicState("idle");
        }
      } catch {
        const fallbackText = "I heard you, friend! Let's take a calm, gentle breath together.";
        setCompanionReply(fallbackText);
        speakViaWebSpeech(fallbackText);
        setMicState("idle");
      }
    }
  };

  const speakViaWebSpeech = (textToSpeak: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(textToSpeak);
      u.rate = 0.9;
      u.pitch = 1.1; // Gentle, friendly, child-appropriate pitch
      u.volume = volumeLevel / 100;

      // Match language code
      if (locale === "ur" || locale === "ur-Latn") {
        u.lang = "ur-PK";
      } else if (locale === "pa") {
        u.lang = "pa-PK";
      } else {
        u.lang = "en-US";
      }

      // Check available voices for warmest voice match
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const preferredVoice = voices.find(
          (v) =>
            v.lang.startsWith(u.lang) ||
            (u.lang.startsWith("ur") && v.lang.startsWith("ur"))
        );
        if (preferredVoice) {
          u.voice = preferredVoice;
        }
      }

      u.onstart = () => setMicState("speaking");
      u.onend = () => setMicState("idle");
      u.onerror = () => setMicState("idle");

      window.speechSynthesis.speak(u);
    } else {
      setTimeout(() => setMicState("idle"), 2500);
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const sentText = textInput.trim();
    setTextInput("");
    setLiveTranscript(sentText);
    processChildUtterance(sentText, 1.0);
  };

  const handleTestPhrase = (phraseText: string, phraseLocale: "en" | "ur" | "pa") => {
    setLocale(phraseLocale);
    setLiveTranscript(phraseText);
    processChildUtterance(phraseText, 1.0);
  };

  const loadBenchmarks = async () => {
    try {
      const data = await apiClient.getYouthBenchmarks();
      setBenchmarksData(data);
      setShowBenchmarks(true);
    } catch {
      setShowBenchmarks(true);
    }
  };

  return (
    <YouthShell
      activeScreen="voice"
      title="Voice Room with Lumi"
      subtitle="Speak freely in English, Urdu, or Pakistani Punjabi. Lumi is here to listen."
    >
      <div className="max-w-2xl mx-auto space-y-6 flex flex-col items-center text-center">
        {/* AI Friends Room Invitation Banner */}
        <Link
          href="/youth/friends"
          className="w-full p-4 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-pink-50 border-2 border-amber-200 hover:border-amber-400 transition-all flex items-center justify-between text-start shadow-xs group"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl group-hover:scale-110 transition-transform">🦊</span>
            <div>
              <p className="text-xs font-black text-amber-900 uppercase tracking-wide">
                New: AI Friends Room
              </p>
              <p className="text-xs font-bold text-slate-700">
                Talk with Kai (Homework Guide), Mia (Stories & Feelings), or Zayn (Explorer)
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-black shadow-xs shrink-0">
            Open Friends Room
          </span>
        </Link>

        {/* Child Safety Emergency Notice if Triggered */}
        {crisisAlert && (
          <div className="w-full p-6 rounded-[28px] bg-rose-50 border-2 border-rose-300 text-rose-950 text-start space-y-3 shadow-md animate-fade-in">
            <div className="flex items-center space-x-2 text-rose-700 font-extrabold text-base">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <span>Dedicated Child Support Sanctuary</span>
            </div>
            <p className="text-sm font-semibold leading-relaxed">{crisisAlert}</p>
            {safetyResources.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 block">
                  Free, Confidential Lifelines:
                </span>
                <div className="grid gap-2 sm:grid-cols-2">
                  {safetyResources.map((r, i) => (
                    <div
                      key={i}
                      className="p-3 bg-white rounded-xl border border-rose-200 text-xs text-rose-900"
                    >
                      <strong>{r.name}:</strong> {r.contact}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Low Confidence Clarification Alert */}
        {clarificationActive && (
          <div className="w-full p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold flex items-center space-x-2 animate-fade-in text-start">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Sound was a bit quiet or noisy. Lumi wants to be completely sure without guessing!
            </span>
          </div>
        )}

        {/* Transparent Voice Notice (e.g. Punjabi Text Fallback) */}
        {voiceNotice && (
          <div className="w-full p-4 rounded-2xl bg-sky-50 border border-sky-300 text-sky-950 text-xs font-semibold flex items-center space-x-2 animate-fade-in text-start">
            <Info className="w-4 h-4 text-sky-600 shrink-0" />
            <span>{voiceNotice}</span>
          </div>
        )}

        {/* Language Override Selector Bar */}
        <div className="w-full flex flex-wrap items-center justify-between p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs text-xs font-bold text-[#4A5568]">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Globe className="w-4 h-4 text-[#2B4CDE]" />
            <span>Speaking In:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { code: "en", label: "English" },
              { code: "ur", label: "اردو (Urdu)" },
              { code: "ur-Latn", label: "Roman Urdu" },
              { code: "pa", label: "پنجابی (Shahmukhi)" },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLocale(lang.code as any)}
                className={`px-3 py-1 rounded-full transition-all text-xs font-bold ${
                  locale === lang.code
                    ? "bg-[#2B4CDE] text-white shadow-xs"
                    : "bg-[#F8FAFC] text-[#4A5568] hover:bg-[#E2E8F0]"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mascot Centerpiece responding to Voice State */}
        <div className="py-2 flex flex-col items-center justify-center space-y-3">
          <LumiMascot
            size="hero"
            state={
              micState === "listening"
                ? "listening"
                : micState === "speaking"
                ? "speaking"
                : micState === "thinking"
                ? "thinking"
                : "idle"
            }
          />

          {/* Animated Audio Waveform when Speaking or Listening */}
          {(micState === "listening" || micState === "speaking") && (
            <div className="flex items-center justify-center space-x-1 h-8 pt-1">
              {waveformBars.map((height, i) => (
                <div
                  key={i}
                  style={{ height: `${height}%` }}
                  className={`w-1 rounded-full transition-all duration-100 ${
                    micState === "listening" ? "bg-rose-500" : "bg-[#2B4CDE]"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Companion Spoken Reply Bubble */}
        {showSubtitles && (
          <div className="w-full p-6 sm:p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-4 text-start">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2B4CDE]">
                Lumi Says
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EEF4FF] text-[#2B4CDE]">
                {localeMeta.nativeName}
              </span>
            </div>

            <p className="text-lg sm:text-xl font-bold text-[#0F172A] leading-relaxed">
              &ldquo;{companionReply}&rdquo;
            </p>

            {/* Replay, Stop, and Delivery Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleReplay}
                  className="px-3.5 py-1.5 rounded-full border border-[#CBD5E1] bg-white hover:bg-slate-50 text-xs font-bold text-[#4A5568] flex items-center space-x-1.5 transition-colors shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay</span>
                </button>
                <button
                  onClick={handleStop}
                  className="px-3.5 py-1.5 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 flex items-center space-x-1.5 transition-colors"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Stop / Interrupt</span>
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center space-x-2 text-xs text-[#64748B]">
                <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volumeLevel}
                  onChange={(e) => setVolumeLevel(Number(e.target.value))}
                  className="w-16 accent-[#2B4CDE] cursor-pointer"
                  aria-label="Volume level"
                />
              </div>
            </div>
          </div>
        )}

        {/* Live Heard Transcription Bubble */}
        {liveTranscript && (
          <div className="w-full p-4 rounded-2xl bg-[#EEF4FF] border border-[#DCE7FE] text-xs text-[#1E3A8A] font-semibold flex items-center space-x-2 animate-fade-in text-start">
            <Mic className="w-4 h-4 text-[#2B4CDE] shrink-0 animate-pulse" />
            <span>
              <strong>You said:</strong> &ldquo;{liveTranscript}&rdquo;
            </span>
          </div>
        )}

        {/* Big Tactile Microphone Control (Main CTA) */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleToggleMic}
            style={{ width: "96px", height: "96px" }}
            className={`rounded-full flex items-center justify-center transition-all shadow-lg mx-auto ${
              micState === "listening"
                ? "bg-rose-500 text-white animate-pulse ring-8 ring-rose-200 scale-105"
                : micState === "thinking"
                ? "bg-amber-400 text-amber-950 animate-bounce"
                : "bg-[#2B4CDE] hover:bg-[#1E3A8A] text-white hover:scale-105"
            }`}
            aria-label={micState === "listening" ? "Stop listening" : "Start speaking"}
          >
            {micState === "listening" ? (
              <MicOff className="w-10 h-10" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </button>

          <span className="text-xs font-extrabold text-[#4A5568] block">
            {micState === "listening"
              ? "Listening... Tap to finish"
              : micState === "thinking"
              ? "Lumi is thinking..."
              : "Tap the big mic to speak"}
          </span>
        </div>

        {/* Interactive Spoken Test Phrases (English, Urdu, Pakistani Punjabi) */}
        <div className="w-full p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2 text-start">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
            Try an interactive spoken example:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleTestPhrase("I don't understand this question.", "en")}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-[#2B4CDE] bg-[#F8FAFC] text-left text-xs text-[#0F172A] hover:bg-slate-50 transition-colors"
            >
              <span className="font-bold block text-[11px] text-[#2B4CDE]">English</span>
              &ldquo;I don&apos;t understand this question.&rdquo;
            </button>

            <button
              onClick={() => handleTestPhrase("مجھے یہ سوال سمجھ نہیں آ رہا۔", "ur")}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-[#2B4CDE] bg-[#F8FAFC] text-left text-xs text-[#0F172A] hover:bg-slate-50 transition-colors"
            >
              <span className="font-bold block text-[11px] text-[#16A34A]">اردو (Urdu)</span>
              &ldquo;مجھے یہ سوال سمجھ نہیں آ رہا۔&rdquo;
            </button>

            <button
              onClick={() => handleTestPhrase("Mainu homework samajh nahi aa reha.", "pa")}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-[#2B4CDE] bg-[#F8FAFC] text-left text-xs text-[#0F172A] hover:bg-slate-50 transition-colors"
            >
              <span className="font-bold block text-[11px] text-[#D97706]">پنجابی (Punjabi)</span>
              &ldquo;Mainu homework samajh nahi aa reha.&rdquo;
            </button>
          </div>
        </div>

        {/* Text-to-Voice Input Section */}
        <div className="w-full p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3 text-start">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-bold uppercase tracking-wider">Type to Lumi (Text-to-Voice)</span>
            <div className="flex items-center space-x-2">
              <span className="text-[11px]">Mode:</span>
              <select
                aria-label="Delivery mode"
                value={voiceDeliveryMode}
                onChange={(e) => setVoiceDeliveryMode(e.target.value as any)}
                className="px-2 py-0.5 rounded-lg border border-slate-200 text-xs font-semibold"
              >
                <option value="both">Speak &amp; Display</option>
                <option value="spoken_only">Spoken Only</option>
                <option value="text_only">Text Only</option>
              </select>
            </div>
          </div>

          <form onSubmit={handleSendText} className="flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your question or story here..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:outline-none focus:border-[#2B4CDE]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#2B4CDE] text-white hover:bg-[#1E3A8A] text-xs font-bold flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Navigation & Benchmarks Drawer Links */}
        <div className="pt-2 flex flex-wrap justify-center items-center gap-4 text-xs font-bold">
          <Link
            href="/youth/chat"
            className="inline-flex items-center space-x-1.5 text-[#2B4CDE] hover:underline"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Switch to Text Sandbox</span>
          </Link>
          <span className="text-[#CBD5E1]">&bull;</span>
          <button
            onClick={() => setShowSubtitles(!showSubtitles)}
            className="text-[#64748B] hover:text-[#0F172A] inline-flex items-center space-x-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showSubtitles ? "Hide Subtitles" : "Show Subtitles"}</span>
          </button>
          <span className="text-[#CBD5E1]">&bull;</span>
          <button
            onClick={loadBenchmarks}
            className="text-[#64748B] hover:text-[#0F172A] underline"
          >
            Speech Benchmarks &amp; Dialect Audit
          </button>
        </div>

        {/* Benchmarks Modal/Drawer */}
        {showBenchmarks && (
          <div className="w-full p-6 rounded-[28px] bg-white border border-[#CBD5E1] shadow-lg text-start space-y-4 animate-fade-in mt-4">
            <div className="flex items-center justify-between border-b pb-3 border-[#E2E8F0]">
              <h3 className="text-base font-extrabold text-[#0F172A]">
                Provider Benchmarks: Child Speech, Accents &amp; Privacy
              </h3>
              <button
                onClick={() => setShowBenchmarks(false)}
                className="text-xs font-bold text-gray-500 hover:text-gray-900"
              >
                Close ✕
              </button>
            </div>
            <p className="text-xs text-[#64748B]">
              Rigorous comparative audit across Whisper, Azure, Google Cloud, ElevenLabs, and Web Speech API.
            </p>
            {benchmarksData?.benchmarks && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-[#475569]">
                      <th className="py-2 text-start">Provider</th>
                      <th className="py-2 text-center">Child WER</th>
                      <th className="py-2 text-center">Accent Score</th>
                      <th className="py-2 text-center">Noise Score</th>
                      <th className="py-2 text-center">Latency P50</th>
                      <th className="py-2 text-center">COPPA Zero Retention</th>
                    </tr>
                  </thead>
                  <tbody>
                    {benchmarksData.benchmarks.map((b: any, idx: number) => (
                      <tr key={idx} className="border-b border-[#F1F5F9]">
                        <td className="py-2 font-bold text-[#0F172A]">{b.provider_name}</td>
                        <td className="py-2 text-center">{b.child_speech_wer_pct}%</td>
                        <td className="py-2 text-center">{b.accent_robustness_score}/100</td>
                        <td className="py-2 text-center">{b.noise_robustness_score}/100</td>
                        <td className="py-2 text-center">{b.latency_p50_ms}ms</td>
                        <td className="py-2 text-center">
                          {b.coppa_gdprk_zero_retention ? (
                            <span className="text-emerald-700 font-bold">✓ Guaranteed</span>
                          ) : (
                            <span className="text-amber-700 font-bold">Custom Contract</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {benchmarksData?.unsupported_capabilities && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                <strong>Explicit Unsupported Capabilities:</strong>
                <ul className="list-disc list-inside space-y-0.5">
                  {benchmarksData.unsupported_capabilities.map((u: string, idx: number) => (
                    <li key={idx}>{u}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </YouthShell>
  );
}
