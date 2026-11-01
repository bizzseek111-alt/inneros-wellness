"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Globe,
  Sliders,
  Play,
  Pause,
  MessageSquare,
  PhoneOff,
  HelpCircle,
  ChevronDown,
  Check,
  Eye,
  EyeOff,
  Activity,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import {
  VoiceCompanionOrb,
  VoiceCompanionVisualState,
} from "./VoiceCompanionOrb";
import {
  api,
  VoiceProfile,
  LanguageInfo,
  VoiceTurnResponse,
  VoiceEvaluationResponse,
} from "@/lib/api-client";
import {
  SEEDED_VOICE_PROFILES,
  SEEDED_VOICE_LANGUAGES,
} from "@/lib/voice-seed";

interface TranscriptMessage {
  id: string;
  sender: "user" | "companion" | "system";
  text: string;
  timestamp: string;
  isPartial?: boolean;
  isCrisisEscalation?: boolean;
}

export const RealtimeVoiceCompanion: React.FC = () => {
  // Voice State Machine
  const [visualState, setVisualState] = useState<VoiceCompanionVisualState>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [textFallbackMode, setTextFallbackMode] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Audio & Hardware State
  const [micPermission, setMicPermission] = useState<"prompt" | "granted" | "denied">("prompt");
  const [audioLevel, setAudioLevel] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "reconnecting" | "offline">("connected");
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const currentAudioElementRef = useRef<HTMLAudioElement | null>(null);

  // Profiles & Languages
  const [profiles, setProfiles] = useState<VoiceProfile[]>(SEEDED_VOICE_PROFILES);
  const [selectedVoice, setSelectedVoice] = useState<VoiceProfile>(SEEDED_VOICE_PROFILES[0]);
  const [languages, setLanguages] = useState<LanguageInfo[]>(SEEDED_VOICE_LANGUAGES);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageInfo>(SEEDED_VOICE_LANGUAGES[0]);

  // Transcripts & Chat
  const [transcripts, setTranscripts] = useState<TranscriptMessage[]>([
    {
      id: "init_msg",
      sender: "companion",
      text: "Welcome to your voice sanctuary. I am here to listen with calm, nonjudgmental presence. Take your time.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [typedInput, setTypedInput] = useState("");
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState("Sanctuary presence ready. Press space to begin speaking.");

  // Modals & Panels
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isEvaluationDrawerOpen, setIsEvaluationDrawerOpen] = useState(false);
  const [languageSearch, setLanguageSearch] = useState("");
  const [evaluationResults, setEvaluationResults] = useState<VoiceEvaluationResponse | null>(null);
  const [crisisAlert, setCrisisAlert] = useState<VoiceTurnResponse | null>(null);

  // Fetch profiles and languages from backend
  useEffect(() => {
    async function loadData() {
      try {
        const [profData, langData] = await Promise.all([
          api.getVoiceProfiles().catch(() => null),
          api.getVoiceLanguages().catch(() => null),
        ]);
        if (profData && profData.length > 0) {
          setProfiles(profData);
          setSelectedVoice(profData[0]);
        }
        if (langData && langData.length > 0) {
          setLanguages(langData);
          setSelectedLanguage(langData[0]);
        }
      } catch (err) {
        console.warn("Using offline voice seed data:", err);
      }
    }
    loadData();
  }, []);

  // Keyboard accessibility shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in input
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        handleToggleMute();
      } else if (e.key.toLowerCase() === "i") {
        e.preventDefault();
        handleBargeInInterruption();
      } else if (e.key.toLowerCase() === "t") {
        e.preventDefault();
        setTextFallbackMode((prev) => !prev);
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleEndConversation();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMuted, visualState]);

  // Request Microphone Permissions
  const handleRequestMicrophone = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;
        setMicPermission("granted");
        setVisualState("listening");
        setScreenReaderAnnouncement("Microphone connected. Active listening enabled.");

        // Initialize Web Audio Context for volume reactive visualizer
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          const ctx = new AudioCtx();
          audioContextRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateAudioLevel = () => {
            if (visualState === "listening" || visualState === "speaking") {
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
              const avg = sum / dataArray.length;
              setAudioLevel(avg / 128); // 0.0 to 1.0
            } else {
              setAudioLevel(0);
            }
            requestAnimationFrame(updateAudioLevel);
          };
          requestAnimationFrame(updateAudioLevel);
        } catch (e) {
          console.warn("Web Audio API analyzer unavailable:", e);
        }
      }
    } catch (err: any) {
      console.warn("Microphone permission denied:", err);
      setMicPermission("denied");
      setVisualState("resting");
      setTextFallbackMode(true);
      setScreenReaderAnnouncement("Microphone permission denied. Switched to text fallback mode.");
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVisualState("listening");
      setScreenReaderAnnouncement("Microphone unmuted. Listening.");
    } else {
      setIsMuted(true);
      setVisualState("muted");
      setScreenReaderAnnouncement("Microphone muted. Privacy protected.");
    }
  };

  // Barge-In Interruption: User speaks while companion speaks
  const handleBargeInInterruption = async () => {
    if (visualState !== "speaking") return;

    // Immediately halt companion audio playback
    if (currentAudioElementRef.current) {
      currentAudioElementRef.current.pause();
      currentAudioElementRef.current.currentTime = 0;
    }

    setVisualState("interrupted");
    setScreenReaderAnnouncement("Companion speech interrupted. Resumed listening.");

    try {
      await api.interruptVoiceSession("session_active_voice", 0);
    } catch (e) {
      console.warn(e);
    }

    // Smooth calm recovery back to listening
    setTimeout(() => {
      setVisualState(isMuted ? "muted" : "listening");
    }, 450);
  };

  // Execute Voice Turn (Send user utterance or text)
  const handleSendTurn = async (utteranceText?: string) => {
    const textToSend = utteranceText || typedInput;
    if (!textToSend.trim()) return;

    // Append user message
    const userMsg: TranscriptMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setTranscripts((prev) => [...prev, userMsg]);
    setTypedInput("");
    setVisualState("thinking");
    setScreenReaderAnnouncement(`Synthesizing response for: ${textToSend}`);

    try {
      const turnResponse: VoiceTurnResponse = await api.executeVoiceTurn({
        userUtterance: textToSend,
        voiceId: selectedVoice.id,
        language: selectedLanguage.code,
        sessionId: "sess_voice_current",
      });

      // Handle Crisis Escalation
      if (turnResponse.is_safety_escalation) {
        setCrisisAlert(turnResponse);
        setVisualState("resting");
        const crisisMsg: TranscriptMessage = {
          id: `crisis_${Date.now()}`,
          sender: "companion",
          text: turnResponse.transcript_companion,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isCrisisEscalation: true,
        };
        setTranscripts((prev) => [...prev, crisisMsg]);
        setScreenReaderAnnouncement("Emergency safety escalation triggered. Emergency resources displayed.");
        return;
      }

      // Handle Clarification Fallback (Low confidence / noisy audio)
      if (turnResponse.clarification_requested) {
        setVisualState("listening");
        const clarMsg: TranscriptMessage = {
          id: `clar_${Date.now()}`,
          sender: "companion",
          text: turnResponse.transcript_companion,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setTranscripts((prev) => [...prev, clarMsg]);
        setScreenReaderAnnouncement(`Clarification requested: ${turnResponse.transcript_companion}`);
        return;
      }

      // Companion Speaking Turn
      const compMsg: TranscriptMessage = {
        id: `comp_${Date.now()}`,
        sender: "companion",
        text: turnResponse.transcript_companion,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setTranscripts((prev) => [...prev, compMsg]);
      setVisualState("speaking");
      setScreenReaderAnnouncement(`Companion says: ${turnResponse.transcript_companion}`);

      // Play Synthetic Audio if available and browser allows
      if (turnResponse.audio_base64 && typeof window !== "undefined") {
        try {
          const audio = new Audio(`data:audio/mp3;base64,${turnResponse.audio_base64}`);
          currentAudioElementRef.current = audio;
          audio.onended = () => {
            if (visualState === "speaking") {
              setVisualState(isMuted ? "muted" : "listening");
              setScreenReaderAnnouncement("Companion finished speaking. Listening.");
            }
          };
          audio.play().catch(() => {
            // Audio autoplay blocked in background; fallback cleanly
            setTimeout(() => {
              setVisualState(isMuted ? "muted" : "listening");
            }, turnResponse.duration_estimate_sec * 1000);
          });
        } catch (e) {
          setTimeout(() => {
            setVisualState(isMuted ? "muted" : "listening");
          }, turnResponse.duration_estimate_sec * 1000);
        }
      } else {
        setTimeout(() => {
          setVisualState(isMuted ? "muted" : "listening");
        }, turnResponse.duration_estimate_sec * 1000);
      }
    } catch (err) {
      console.error(err);
      setVisualState("idle");
    }
  };

  // End Conversation
  const handleEndConversation = () => {
    if (currentAudioElementRef.current) {
      currentAudioElementRef.current.pause();
    }
    setVisualState("resting");
    setScreenReaderAnnouncement("Conversation concluded peacefully. Sanctuary resting.");
  };

  // Load Evaluation Harness Benchmarks
  const handleOpenEvaluationDrawer = async () => {
    setIsEvaluationDrawerOpen(true);
    try {
      const data = await api.getVoiceEvaluationBenchmarks();
      setEvaluationResults(data);
    } catch (e) {
      console.warn("Using offline evaluation summary");
    }
  };

  const isRTL = selectedLanguage.direction === "rtl";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="max-w-4xl mx-auto space-y-6 flex flex-col items-center relative"
    >
      {/* Hidden Accessible Screen-Reader Live Region */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {screenReaderAnnouncement}
      </div>

      {/* 1. Header Toolbar with Non-Clinical Safety & Language Badges */}
      <div className="w-full p-4 rounded-2xl bg-midnight-950/90 border border-white/[0.08] backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400">
              Low-Latency Audio Sanctuary
            </span>
            <span className="text-zinc-600">&bull;</span>
            <span className="text-[10px] font-mono text-zinc-400">24 kHz Pacing</span>
          </div>
          <h1 className="text-lg sm:text-xl font-serif text-ivory-100 font-medium">
            Real-Time Voice Companion
          </h1>
        </div>

        {/* Configuration Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Voice Selector Badge */}
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-midnight-900 border border-white/[0.1] hover:border-teal-500/50 text-xs text-ivory-200 transition-all flex items-center space-x-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-mono text-[11px]">{selectedVoice.name}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>

          {/* Language Selector Badge */}
          <button
            onClick={() => setIsLanguageModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-midnight-900 border border-white/[0.1] hover:border-teal-500/50 text-xs text-ivory-200 transition-all flex items-center space-x-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-lavender-400" />
            <span className="font-mono text-[11px]">{selectedLanguage.name}</span>
            <Badge
              variant={selectedLanguage.tier === "tier_1_clinically_reviewed" ? "teal" : selectedLanguage.tier === "tier_2_qualified_regional" ? "lavender" : "neutral"}
              size="sm"
            >
              {selectedLanguage.tier === "tier_1_clinically_reviewed" ? "Tier 1" : selectedLanguage.tier === "tier_2_qualified_regional" ? "Tier 2" : "Beta"}
            </Badge>
          </button>

          {/* Robustness Benchmark Button */}
          <Button
            size="xs"
            variant="ghost"
            onClick={handleOpenEvaluationDrawer}
            leftIcon={<Activity className="w-3.5 h-3.5" />}
          >
            Benchmarks
          </Button>
        </div>
      </div>

      {/* 2. Mandatory Non-Diagnostic Clinical Safety Notice */}
      <div className="w-full px-4 py-2 rounded-xl bg-midnight-900/60 border border-white/[0.04] flex items-center justify-between text-[11px] text-zinc-400">
        <span className="flex items-center space-x-1.5">
          <Shield className="w-3.5 h-3.5 text-teal-400/80 flex-shrink-0" />
          <span>Non-Clinical Boundary: InnerOS never infers mental-health diagnoses or emotions from vocal features.</span>
        </span>
        <span className="font-mono text-[10px] text-zinc-500 hidden md:inline">WCAG 2.2 AA Compliant</span>
      </div>

      {/* 3. Crisis Alert Interception Banner (High Priority) */}
      {crisisAlert && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full p-5 rounded-2xl bg-rose-950/40 border border-rose-500/60 shadow-2xl space-y-3"
        >
          <div className="flex items-center space-x-2 text-rose-300">
            <ShieldAlert className="w-5 h-5 animate-pulse text-rose-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider font-mono">
              Emergency Human Support Interception Active
            </h3>
          </div>
          <p className="text-xs text-rose-100 font-light leading-relaxed">
            {crisisAlert.transcript_companion}
          </p>
          <div className="grid sm:grid-cols-2 gap-2 pt-1">
            {crisisAlert.safety_resources.map((res, i) => (
              <div key={i} className="p-3 rounded-xl bg-midnight-950 border border-rose-800/40 text-xs">
                <span className="font-semibold text-rose-200 block">{res.name}</span>
                <span className="font-mono text-ivory-100 text-[11px]">{res.contact}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 flex justify-end">
            <Button size="xs" variant="ghost" onClick={() => setCrisisAlert(null)}>
              Dismiss Notice
            </Button>
          </div>
        </motion.div>
      )}

      {/* 4. Central Living Voice Orb Sanctuary Canvas */}
      <div className="w-full py-8 sm:py-12 rounded-3xl bg-midnight-950 border border-white/[0.08] shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
        {/* Living Responsive Voice Orb */}
        <VoiceCompanionOrb
          state={visualState}
          audioLevel={audioLevel}
          prefersReducedMotion={prefersReducedMotion}
          onClick={() => {
            if (visualState === "speaking") {
              handleBargeInInterruption();
            } else if (micPermission === "prompt") {
              handleRequestMicrophone();
            } else {
              handleToggleMute();
            }
          }}
        />

        {/* Microphone Permission Prompt or Denied Alert */}
        {micPermission === "prompt" && (
          <div className="mt-4 p-3 rounded-xl bg-midnight-900 border border-teal-500/30 flex items-center space-x-3 text-xs text-ivory-200">
            <Mic className="w-4 h-4 text-teal-400 animate-pulse" />
            <span>Enable microphone for seamless vocal turn-taking.</span>
            <Button size="xs" variant="primary" onClick={handleRequestMicrophone}>
              Allow Microphone
            </Button>
          </div>
        )}

        {micPermission === "denied" && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center space-x-2 text-xs text-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>Microphone blocked in browser. Using text fallback mode below.</span>
          </div>
        )}

        {/* 5. Primary Audio Control Bar (Accessible & Keyboard-Navigable) */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 z-10">
          {/* Mute Button */}
          <button
            onClick={handleToggleMute}
            className={`p-3.5 rounded-2xl border transition-all flex items-center space-x-2 ${
              isMuted
                ? "bg-rose-950/80 border-rose-700 text-rose-200 shadow-lg shadow-rose-950/40"
                : "bg-midnight-900 border-white/[0.1] text-ivory-200 hover:border-white/[0.25]"
            }`}
            title={isMuted ? "Unmute Microphone (Space)" : "Mute Microphone (Space)"}
            aria-label={isMuted ? "Unmute Microphone" : "Mute Microphone"}
          >
            {isMuted ? <MicOff className="w-5 h-5 text-rose-400" /> : <Mic className="w-5 h-5 text-teal-400" />}
          </button>

          {/* Barge-In Interrupt Button (Active during speech) */}
          <button
            onClick={handleBargeInInterruption}
            disabled={visualState !== "speaking"}
            className={`px-5 py-3.5 rounded-2xl border text-xs font-medium transition-all flex items-center space-x-2 ${
              visualState === "speaking"
                ? "bg-amber-950/80 border-amber-500 text-amber-200 shadow-lg shadow-amber-950/50 cursor-pointer animate-pulse"
                : "bg-midnight-900/50 border-white/[0.04] text-zinc-600 cursor-not-allowed"
            }`}
            title="Interrupt companion speech (Key 'I')"
            aria-label="Interrupt companion speech"
          >
            <VolumeX className="w-4 h-4" />
            <span>Interrupt Voice</span>
          </button>

          {/* Simulate Voice Turn Button (For Testing/Offline Verification) */}
          <button
            onClick={() => handleSendTurn("I had a demanding cross-functional critique today.")}
            className="px-5 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center space-x-2 shadow-lg shadow-teal-900/40 transition-all"
            aria-label="Simulate test reflection utterance"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simulate Voice Reflection</span>
          </button>

          {/* Text Fallback Toggle Button */}
          <button
            onClick={() => setTextFallbackMode(!textFallbackMode)}
            className={`p-3.5 rounded-2xl border transition-all ${
              textFallbackMode
                ? "bg-teal-950 border-teal-500 text-teal-200"
                : "bg-midnight-900 border-white/[0.1] text-ivory-200 hover:border-white/[0.25]"
            }`}
            title="Toggle Text Fallback Mode (Key 'T')"
            aria-label="Toggle Text Fallback Mode"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* End Conversation Button */}
          <button
            onClick={handleEndConversation}
            className="p-3.5 rounded-2xl bg-midnight-900 border border-white/[0.1] text-zinc-400 hover:text-rose-400 hover:border-rose-800 transition-all"
            title="End Voice Sanctuary (Escape)"
            aria-label="End Voice Sanctuary"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="mt-3 text-[10px] font-mono text-zinc-500 hidden sm:flex items-center space-x-3">
          <span>Space: Mute</span>
          <span>&bull;</span>
          <span>I: Interrupt</span>
          <span>&bull;</span>
          <span>T: Text Mode</span>
          <span>&bull;</span>
          <span>Esc: End</span>
        </div>
      </div>

      {/* 6. Text Fallback Input Strip (Always Available) */}
      {textFallbackMode && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-4 rounded-2xl bg-midnight-950 border border-teal-500/30 shadow-xl space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold text-ivory-100 flex items-center space-x-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
              <span>Quiet Text Fallback Mode</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              When speaking aloud is not comfortable
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder={`Type a reflection in ${selectedLanguage.name}...`}
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendTurn()}
              className="flex-1 bg-midnight-900 border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-ivory-100 focus:outline-none focus:border-teal-500"
            />
            <Button size="sm" variant="primary" onClick={() => handleSendTurn()}>
              Reflect
            </Button>
          </div>
        </motion.div>
      )}

      {/* 7. Live Streaming Transcripts Ledger */}
      <div className="w-full p-6 rounded-3xl bg-midnight-950 border border-white/[0.08] shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs text-zinc-400">
          <span className="font-semibold text-ivory-100 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <span>Streaming Dialogue Transcript</span>
          </span>
          <span className="font-mono text-[10px] text-zinc-500">
            Real-Time Turn History &bull; Non-Persistent in Incognito
          </span>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {transcripts.map((t) => (
            <div
              key={t.id}
              className={`p-3.5 rounded-2xl text-xs space-y-1 transition-all ${
                t.sender === "user"
                  ? "bg-midnight-900 border border-white/[0.06] ml-6 sm:ml-12"
                  : t.isCrisisEscalation
                  ? "bg-rose-950/60 border border-rose-500/40 text-rose-100"
                  : "bg-midnight-900/60 border border-teal-800/30 mr-6 sm:mr-12"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span className={t.sender === "user" ? "text-ivory-200" : "text-teal-400"}>
                  {t.sender === "user" ? "You (Vocal Input)" : "InnerOS Companion"}
                </span>
                <span>{t.timestamp}</span>
              </div>
              <p className="text-ivory-100 font-light leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Voice Profile Selector Modal */}
      {isVoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-midnight-950 border border-teal-500/40 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-serif text-ivory-100 flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-teal-400" />
                <span>Select Voice Presence</span>
              </h3>
              <Button size="xs" variant="ghost" onClick={() => setIsVoiceModalOpen(false)}>
                Close
              </Button>
            </div>

            <div className="grid gap-2.5">
              {profiles.map((p) => {
                const isSelected = selectedVoice.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedVoice(p);
                      setIsVoiceModalOpen(false);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                      isSelected
                        ? "bg-teal-950 border-teal-400 shadow-lg shadow-teal-950/50"
                        : "bg-midnight-900 border-white/[0.06] hover:border-white/[0.2]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-ivory-100">{p.name}</span>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-mono text-zinc-400">{p.language}</span>
                        {isSelected && <Check className="w-4 h-4 text-teal-400" />}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 font-light">{p.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {p.tone_characteristics.map((tc) => (
                        <span
                          key={tc}
                          className="text-[9px] font-mono px-2 py-0.5 rounded bg-midnight-950 border border-white/[0.06] text-zinc-400"
                        >
                          #{tc}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 9. Language Selector Modal (30 Languages with Tiers) */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl p-6 rounded-3xl bg-midnight-950 border border-teal-500/40 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <h3 className="text-base font-serif text-ivory-100 flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-lavender-400" />
                  <span>Multilingual Architecture (30 Languages)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Language tiers reflect clinical review status, not merely cloud speech API support.
                </p>
              </div>
              <Button size="xs" variant="ghost" onClick={() => setIsLanguageModalOpen(false)}>
                Close
              </Button>
            </div>

            {/* Search Filter */}
            <input
              type="text"
              placeholder="Search language or dialect..."
              value={languageSearch}
              onChange={(e) => setLanguageSearch(e.target.value)}
              className="w-full text-xs bg-midnight-900 border border-white/[0.1] rounded-xl px-4 py-2 text-ivory-100 focus:outline-none focus:border-teal-500"
            />

            <div className="grid gap-2 max-h-96 overflow-y-auto pr-1">
              {languages
                .filter(
                  (l) =>
                    l.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
                    l.native_name.toLowerCase().includes(languageSearch.toLowerCase()) ||
                    l.code.toLowerCase().includes(languageSearch.toLowerCase())
                )
                .map((lang) => {
                  const isSelected = selectedLanguage.code === lang.code;
                  return (
                    <div
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setIsLanguageModalOpen(false);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                        isSelected
                          ? "bg-teal-950 border-teal-400 shadow-md shadow-teal-950"
                          : "bg-midnight-900 border-white/[0.06] hover:border-white/[0.2]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-xs text-ivory-100">
                            {lang.name} ({lang.native_name})
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">{lang.code.toUpperCase()}</span>
                        </div>
                        <Badge
                          variant={lang.tier === "tier_1_clinically_reviewed" ? "teal" : lang.tier === "tier_2_qualified_regional" ? "lavender" : "neutral"}
                          size="sm"
                        >
                          {lang.tier === "tier_1_clinically_reviewed" ? "Tier 1: Reviewed" : lang.tier === "tier_2_qualified_regional" ? "Tier 2: Qualified" : "Beta"}
                        </Badge>
                      </div>

                      {lang.caveats && (
                        <p className="text-[11px] text-zinc-400 font-light">{lang.caveats}</p>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* 10. Voice Evaluation Benchmark Results Drawer */}
      {isEvaluationDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl p-6 rounded-3xl bg-midnight-950 border border-teal-500/40 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <h3 className="text-base font-serif text-ivory-100 flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-teal-400" />
                  <span>Voice Robustness & Dialect Benchmark Suite</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Verifies Urdu/Bulgarian dialects, code-switching, low SNR noise fallback, and streaming crisis checks.
                </p>
              </div>
              <Button size="xs" variant="ghost" onClick={() => setIsEvaluationDrawerOpen(false)}>
                Close
              </Button>
            </div>

            {evaluationResults ? (
              <div className="space-y-4">
                {/* Stats Summary Bar */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-midnight-900 border border-white/[0.06]">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Total Fixtures</span>
                    <span className="text-xl font-serif text-ivory-100 font-semibold">{evaluationResults.total_cases}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-midnight-900 border border-white/[0.06]">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Passing Cases</span>
                    <span className="text-xl font-serif text-teal-400 font-semibold">{evaluationResults.passed_cases}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-midnight-900 border border-white/[0.06]">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Pass Rate</span>
                    <span className="text-xl font-serif text-teal-400 font-semibold">{evaluationResults.pass_rate_pct}%</span>
                  </div>
                </div>

                {/* Fixture Cases Scrollable List */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
                  {evaluationResults.results.map((res: any) => (
                    <div
                      key={res.case_id}
                      className="p-3 rounded-xl bg-midnight-900/80 border border-white/[0.04] space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-teal-300 font-medium">{res.case_id}</span>
                        <Badge variant={res.passed ? "teal" : "emergency"} size="sm">
                          {res.passed ? "Passed" : "Failed"}
                        </Badge>
                      </div>
                      <p className="text-zinc-400 text-[11px] font-light">
                        Response: {res.response_transcript_preview}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-zinc-400 text-xs">
                Loading automated evaluation benchmarks...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
