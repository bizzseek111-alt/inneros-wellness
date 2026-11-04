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
} from "lucide-react";
import { YouthShell } from "@/components/youth/YouthShell";
import { LumiMascot } from "@/components/youth/LumiMascot";
import { useYouth } from "@/components/youth/YouthContext";
import { apiClient } from "@/lib/api-client";

export default function YouthVoiceRoomPage() {
  const { ageTier, locale, localeMeta, t, setLocale } = useYouth();

  const [micState, setMicState] = useState<"idle" | "listening" | "thinking" | "speaking" | "paused">("idle");
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

  const sessionIdRef = useRef<string>(`ysess_${Date.now()}`);
  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Initial greeting based on locale
  useEffect(() => {
    if (locale === "ur") {
      setCompanionReply("ہیلو دوست! میں لومی ہوں۔ میں آپ کی بات سننے کے لیے تیار ہوں۔ مائیک دبائیں اور بولنا شروع کریں۔");
    } else if (locale === "pa") {
      setCompanionReply("سلام جی! میں لومی آں۔ تہاڈی گل سنن لئی حاضر آں۔ مائیک نوں دبو تے بولو۔");
      setVoiceNotice("Pakistani Punjabi (Shahmukhi) TTS voice is in research qualification. Lumi provides verified text with screen-reader support.");
    } else if (locale === "ur-Latn") {
      setCompanionReply("Hello dost! Main Lumi hoon. Aap ki baat sunne ke liye tayyar hoon. Mic daba kar bolein.");
    } else {
      setCompanionReply("Hi there! I am Lumi. I'm here to listen. Tap the microphone whenever you want to talk.");
      setVoiceNotice(null);
    }
  }, [locale]);

  // Request browser microphone with iOS AudioContext unlock & offline awareness
  const handleRequestMicrophone = async () => {
    if (typeof window === "undefined") return;

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setCompanionReply("Live voice conversations require an active connection. Feel free to use our offline stories or calming breaths while disconnected.");
      return;
    }

    try {
      // iOS Safari AudioContext unlock on direct touch gesture
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
    } catch (e) {
      setMicPermission("denied");
    }
  };

  const startSpeechRecognition = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setCompanionReply("Your web browser does not support SpeechRecognition. You can use the Text Chat button below.");
      return;
    }

    try {
      if (recognitionRef.current) recognitionRef.current.abort();

      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = locale === "ur" || locale === "pa" ? "ur-PK" : "en-US";

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
    } catch (err) {
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
    } catch (e) {
      // safe fallback
    }
    setMicState("idle");
  };

  const handleReplay = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(companionReply);
      utterance.rate = 0.9;
      utterance.pitch = 1.1; // Gentle friendly pitch
      if (locale === "ur" || locale === "pa") {
        utterance.lang = "ur-PK";
      } else {
        utterance.lang = "en-US";
      }
      utterance.onstart = () => setMicState("speaking");
      utterance.onend = () => setMicState("idle");
      window.speechSynthesis.speak(utterance);
    }
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

      // Handle Safety Escalation
      if (response.is_safety_escalation) {
        setCrisisAlert(response.transcript_agent);
        setSafetyResources(response.safety_resources || []);
        setMicState("idle");
        return;
      }

      // Handle Low Confidence Clarification
      if (response.clarification_requested) {
        setClarificationActive(true);
        setMicState("idle");
        return;
      }

      // Handle Voice Transparency / Unsupported Fallback
      if (response.audio_status === "unsupported_voice_fallback_text") {
        setVoiceNotice(response.voice_unavailable_reason || "Voice playback unavailable; text provided in native script.");
        setMicState("idle");
        return;
      } else {
        setVoiceNotice(null);
      }

      setMicState("speaking");

      // Play Synthesized Audio if provided or speak via Web Speech
      if (response.audio_base64) {
        const audio = new Audio(`data:audio/${response.audio_format};base64,${response.audio_base64}`);
        audioPlayerRef.current = audio;
        audio.onended = () => setMicState("idle");
        audio.play().catch(() => {
          speakViaWebSpeech(response.transcript_agent);
        });
      } else {
        speakViaWebSpeech(response.transcript_agent);
      }
    } catch (err: any) {
      // Offline fallback
      setCompanionReply("I heard you, friend! Let's take a calm pause together.");
      setMicState("idle");
    }
  };

  const speakViaWebSpeech = (textToSpeak: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(textToSpeak);
      u.rate = 0.9;
      u.pitch = 1.1;
      u.onend = () => setMicState("idle");
      window.speechSynthesis.speak(u);
    } else {
      setTimeout(() => setMicState("idle"), 2500);
    }
  };

  const loadBenchmarks = async () => {
    try {
      const data = await apiClient.getYouthBenchmarks();
      setBenchmarksData(data);
      setShowBenchmarks(true);
    } catch (e) {
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
                    <div key={i} className="p-3 bg-white rounded-xl border border-rose-200 text-xs text-rose-900">
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
            <span>Sound was a bit quiet or noisy. Lumi wants to be completely sure without guessing!</span>
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
            <Globe className="w-4 h-4 text-[#0E87E3]" />
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
                    ? "bg-[#0E87E3] text-white shadow-xs"
                    : "bg-[#F8FAFC] text-[#4A5568] hover:bg-[#E2E8F0]"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mascot Centerpiece responding to Voice State */}
        <div className="py-2">
          <LumiMascot
            size="hero"
            state={
              micState === "listening"
                ? "listening"
                : micState === "speaking"
                ? "speaking"
                : micState === "thinking"
                ? "calming"
                : "idle"
            }
          />
        </div>

        {/* Companion Spoken Reply Bubble */}
        <div className="w-full p-6 sm:p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-sm space-y-4 text-start">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E87E3]">
              Lumi Says
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E0F1FE] text-[#0C436F]">
              {localeMeta.nativeName}
            </span>
          </div>

          <p className="text-lg sm:text-xl font-bold text-[#0F172A] leading-relaxed">
            &ldquo;{companionReply}&rdquo;
          </p>

          {/* Replay and Pause Controls */}
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              onClick={handleReplay}
              className="px-4 py-2 rounded-full border border-[#CBD5E1] bg-white hover:bg-[#FDFBF4] text-xs font-bold text-[#4A5568] flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay</span>
            </button>
            <button
              onClick={handleStop}
              className="px-4 py-2 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 flex items-center space-x-1.5 transition-colors"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Stop / Interrupt</span>
            </button>
          </div>
        </div>

        {/* Live Heard Transcription Bubble */}
        {liveTranscript && (
          <div className="w-full p-4 rounded-2xl bg-[#E0F1FE] border border-[#B9E2FE] text-xs text-[#0C436F] font-semibold flex items-center space-x-2 animate-fade-in text-start">
            <Mic className="w-4 h-4 text-[#0E87E3] shrink-0 animate-pulse" />
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
                : "bg-[#0E87E3] hover:bg-[#0C436F] text-white hover:scale-105"
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

        {/* Navigation & Benchmarks Drawer Links */}
        <div className="pt-4 flex flex-wrap justify-center items-center gap-4 text-xs font-bold">
          <Link
            href="/youth/chat"
            className="inline-flex items-center space-x-1.5 text-[#0E87E3] hover:underline"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Switch to Text Chat</span>
          </Link>
          <span className="text-[#CBD5E1]">&bull;</span>
          <button
            onClick={loadBenchmarks}
            className="text-[#64748B] hover:text-[#0F172A] underline"
          >
            Speech Benchmarks & Dialect Audit
          </button>
        </div>

        {/* Benchmarks Modal/Drawer */}
        {showBenchmarks && (
          <div className="w-full p-6 rounded-[28px] bg-white border border-[#CBD5E1] shadow-lg text-start space-y-4 animate-fade-in mt-4">
            <div className="flex items-center justify-between border-b pb-3 border-[#E2E8F0]">
              <h3 className="text-base font-extrabold text-[#0F172A]">
                Provider Benchmarks: Child Speech, Accents & Privacy
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
