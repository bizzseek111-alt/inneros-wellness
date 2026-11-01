"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Mic,
  MicOff,
  VolumeX,
  Sparkles,
  Shield,
  AlertTriangle,
  Globe,
  Sliders,
  Pause,
  Play,
  MessageSquare,
  PhoneOff,
  ChevronDown,
  Check,
  X,
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
  const [visualState, setVisualState] = useState<VoiceCompanionVisualState>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const [textFallbackMode, setTextFallbackMode] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const [micPermission, setMicPermission] = useState<"prompt" | "granted" | "denied">("prompt");
  const [audioLevel, setAudioLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const currentAudioElementRef = useRef<HTMLAudioElement | null>(null);

  const [profiles, setProfiles] = useState<VoiceProfile[]>(SEEDED_VOICE_PROFILES);
  const [selectedVoice, setSelectedVoice] = useState<VoiceProfile>(SEEDED_VOICE_PROFILES[0]);
  const [languages, setLanguages] = useState<LanguageInfo[]>(SEEDED_VOICE_LANGUAGES);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageInfo>(SEEDED_VOICE_LANGUAGES[0]);

  const [transcripts, setTranscripts] = useState<TranscriptMessage[]>([
    {
      id: "init_msg",
      sender: "companion",
      text: "Hello Elena. I am your AI voice companion. Take a slow breath and speak whenever you feel ready.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [typedInput, setTypedInput] = useState("");
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState(
    "Voice companion ready. Press space to toggle microphone."
  );

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [languageSearch, setLanguageSearch] = useState("");
  const [crisisAlert, setCrisisAlert] = useState<VoiceTurnResponse | null>(null);

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
        // Offline voice seed fallback
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
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

  const handleRequestMicrophone = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;
        setMicPermission("granted");
        setVisualState("listening");
        setScreenReaderAnnouncement("Microphone enabled. Listening to you.");

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
              setAudioLevel(avg / 128);
            } else {
              setAudioLevel(0);
            }
            requestAnimationFrame(updateAudioLevel);
          };
          requestAnimationFrame(updateAudioLevel);
        } catch (e) {
          // Web Audio analyzer fallback
        }
      }
    } catch (err: any) {
      setMicPermission("denied");
      setVisualState("resting");
      setTextFallbackMode(true);
      setScreenReaderAnnouncement("Microphone unavailable. Switched to written input below.");
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVisualState("listening");
      setScreenReaderAnnouncement("Microphone unmuted. Listening.");
    } else {
      setIsMuted(true);
      setVisualState("muted");
      setScreenReaderAnnouncement("Microphone muted.");
    }
  };

  const handleTogglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      setVisualState(isMuted ? "muted" : "listening");
      setScreenReaderAnnouncement("Conversation resumed.");
    } else {
      if (currentAudioElementRef.current) {
        currentAudioElementRef.current.pause();
      }
      setIsPaused(true);
      setVisualState("resting");
      setScreenReaderAnnouncement("Conversation paused.");
    }
  };

  const handleBargeInInterruption = async () => {
    if (visualState !== "speaking") return;

    if (currentAudioElementRef.current) {
      currentAudioElementRef.current.pause();
      currentAudioElementRef.current.currentTime = 0;
    }

    setVisualState("interrupted");
    setScreenReaderAnnouncement("Companion paused speaking to listen to you.");

    try {
      await api.interruptVoiceSession("session_active_voice", 0);
    } catch (e) {
      // ignore offline
    }

    setTimeout(() => {
      setVisualState(isMuted ? "muted" : "listening");
    }, 450);
  };

  const handleSendTurn = async (utteranceText?: string) => {
    const textToSend = utteranceText || typedInput;
    if (!textToSend.trim()) return;

    const userMsg: TranscriptMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setTranscripts((prev) => [...prev, userMsg]);
    setTypedInput("");
    setVisualState("thinking");
    setScreenReaderAnnouncement(`Reflecting on: ${textToSend}`);

    try {
      const turnResponse: VoiceTurnResponse = await api.executeVoiceTurn({
        userUtterance: textToSend,
        voiceId: selectedVoice.id,
        language: selectedLanguage.code,
        sessionId: "sess_voice_current",
      });

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
        setScreenReaderAnnouncement("Important support resources shared.");
        return;
      }

      if (turnResponse.clarification_requested) {
        setVisualState("listening");
        const clarMsg: TranscriptMessage = {
          id: `clar_${Date.now()}`,
          sender: "companion",
          text: turnResponse.transcript_companion,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setTranscripts((prev) => [...prev, clarMsg]);
        return;
      }

      const compMsg: TranscriptMessage = {
        id: `comp_${Date.now()}`,
        sender: "companion",
        text: turnResponse.transcript_companion,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setTranscripts((prev) => [...prev, compMsg]);
      setVisualState("speaking");
      setScreenReaderAnnouncement(`Companion says: ${turnResponse.transcript_companion}`);

      if (turnResponse.audio_base64 && typeof window !== "undefined") {
        try {
          const audio = new Audio(`data:audio/mp3;base64,${turnResponse.audio_base64}`);
          currentAudioElementRef.current = audio;
          audio.onended = () => {
            if (visualState === "speaking") {
              setVisualState(isMuted ? "muted" : "listening");
            }
          };
          audio.play().catch(() => {
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
      setVisualState("idle");
    }
  };

  const handleEndConversation = () => {
    if (currentAudioElementRef.current) {
      currentAudioElementRef.current.pause();
    }
    setVisualState("resting");
    setScreenReaderAnnouncement("Voice conversation ended peacefully.");
  };

  const isRTL = selectedLanguage.direction === "rtl";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="max-w-4xl mx-auto space-y-6 flex flex-col items-center relative"
    >
      {/* Screen-Reader Live Region */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {screenReaderAnnouncement}
      </div>

      {/* 1. Warm Header Bar */}
      <div className="w-full p-5 rounded-3xl bg-white border border-[#E6E1D8] shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-serif font-semibold text-[#263330]">
              Voice Companion
            </h1>
            <Badge variant="teal" size="sm">
              AI Companion
            </Badge>
          </div>
          <p className="text-sm text-[#52625E]">
            Speak naturally and take pauses whenever you need
          </p>
        </div>

        {/* Voice, Language & Mode Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="px-3.5 py-2 min-h-[40px] rounded-xl bg-[#FAF8F4] border border-[#DDD7CC] hover:border-[#285B55] text-xs font-medium text-[#263330] transition-all flex items-center space-x-2"
          >
            <Sliders className="w-4 h-4 text-[#285B55]" />
            <span>Voice: {selectedVoice.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#52625E]" />
          </button>

          <button
            onClick={() => setIsLanguageModalOpen(true)}
            className="px-3.5 py-2 min-h-[40px] rounded-xl bg-[#FAF8F4] border border-[#DDD7CC] hover:border-[#285B55] text-xs font-medium text-[#263330] transition-all flex items-center space-x-2"
          >
            <Globe className="w-4 h-4 text-[#553E82]" />
            <span>{selectedLanguage.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#52625E]" />
          </button>

          <Link
            href="/companion/chat"
            className="px-3.5 py-2 min-h-[40px] rounded-xl bg-[#E8F1EB] hover:bg-[#D5E6DC] text-[#1F4742] border border-[#CBE0D3] text-xs font-medium flex items-center space-x-1.5 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-[#285B55]" />
            <span>Switch to Text Chat</span>
          </Link>
        </div>
      </div>

      {/* 2. Crisis Support Notice (When Triggered) */}
      {crisisAlert && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full p-6 rounded-3xl bg-[#FDF2F2] border border-[#F2C9CE] shadow-card space-y-4"
        >
          <div className="flex items-center space-x-2.5 text-[#9B1C31]">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h3 className="text-base font-serif font-semibold">
              Immediate Human Support Resources
            </h3>
          </div>
          <p className="text-base text-[#263330] leading-relaxed">
            {crisisAlert.transcript_companion}
          </p>
          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            {crisisAlert.safety_resources.map((res, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border border-[#F2C9CE]">
                <span className="font-semibold text-[#9B1C31] block text-sm">{res.name}</span>
                <span className="text-[#263330] text-sm mt-0.5 block">{res.contact}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 flex justify-end">
            <Button size="xs" variant="outline" onClick={() => setCrisisAlert(null)}>
              Close Notice
            </Button>
          </div>
        </motion.div>
      )}

      {/* 3. Main Voice Companion Sanctuary Canvas */}
      <div className="w-full py-10 sm:py-12 px-6 rounded-3xl bg-white border border-[#E6E1D8] shadow-card flex flex-col items-center justify-center relative overflow-hidden">
        {/* Soft Gradient Companion Orb */}
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

        {/* Microphone Permission Prompt */}
        {micPermission === "prompt" && (
          <div className="mt-4 p-4 rounded-2xl bg-[#E8F1EB]/70 border border-[#CBE0D3] flex flex-wrap items-center justify-center gap-3 text-sm text-[#1F4742]">
            <Mic className="w-4 h-4 text-[#285B55]" />
            <span>Enable your microphone when you are ready to talk aloud.</span>
            <Button size="xs" variant="primary" onClick={handleRequestMicrophone}>
              Enable Microphone
            </Button>
          </div>
        )}

        {micPermission === "denied" && (
          <div className="mt-4 p-4 rounded-2xl bg-[#F7E7E2] border border-[#E8CEC5] flex items-center space-x-2.5 text-sm text-[#7D402D]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Microphone access is off. You can type below instead.</span>
          </div>
        )}

        {/* 4. Accessible Primary Voice Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 z-10">
          {/* Mute / Unmute */}
          <button
            onClick={handleToggleMute}
            className={`px-5 py-3 min-h-[48px] rounded-2xl border font-medium text-sm transition-all flex items-center space-x-2 ${
              isMuted
                ? "bg-[#FDF2F2] border-[#F2C9CE] text-[#9B1C31]"
                : "bg-[#285B55] border-[#285B55] text-white hover:bg-[#1F4742] shadow-sm"
            }`}
            title={isMuted ? "Unmute microphone" : "Mute microphone"}
            aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
          >
            {isMuted ? (
              <>
                <MicOff className="w-5 h-5" />
                <span>Unmute</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>Microphone On</span>
              </>
            )}
          </button>

          {/* Pause / Resume */}
          <button
            onClick={handleTogglePause}
            className="px-4 py-3 min-h-[48px] rounded-2xl bg-[#FAF8F4] hover:bg-[#F3EFE8] border border-[#DDD7CC] text-[#263330] text-sm font-medium transition-all flex items-center space-x-2"
            title={isPaused ? "Resume conversation" : "Pause conversation"}
          >
            {isPaused ? <Play className="w-4 h-4 text-[#285B55]" /> : <Pause className="w-4 h-4 text-[#52625E]" />}
            <span>{isPaused ? "Resume" : "Pause"}</span>
          </button>

          {/* Interrupt Speech (When Companion is Speaking) */}
          {visualState === "speaking" && (
            <button
              onClick={handleBargeInInterruption}
              className="px-4 py-3 min-h-[48px] rounded-2xl bg-[#F7E7E2] border border-[#E8CEC5] text-[#7D402D] text-sm font-medium transition-all flex items-center space-x-2"
            >
              <VolumeX className="w-4 h-4" />
              <span>Interrupt</span>
            </button>
          )}

          {/* Try Sample Voice Prompt */}
          <button
            onClick={() => handleSendTurn("I have been carrying a lot on my mind today and want to slow down.")}
            className="px-4 py-3 min-h-[48px] rounded-2xl bg-[#E8F1EB] hover:bg-[#D5E6DC] border border-[#CBE0D3] text-[#1F4742] font-medium text-sm flex items-center space-x-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#285B55]" />
            <span>Share a Thought</span>
          </button>

          {/* Toggle Text Input */}
          <button
            onClick={() => setTextFallbackMode(!textFallbackMode)}
            className={`px-4 py-3 min-h-[48px] rounded-2xl border text-sm font-medium transition-all flex items-center space-x-2 ${
              textFallbackMode
                ? "bg-[#EDE8F5] border-[#D0C4E8] text-[#423166]"
                : "bg-[#FAF8F4] border-[#DDD7CC] text-[#263330] hover:bg-[#F3EFE8]"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Type Instead</span>
          </button>

          {/* End Conversation */}
          <button
            onClick={handleEndConversation}
            className="px-4 py-3 min-h-[48px] rounded-2xl bg-white hover:bg-[#FDF2F2] border border-[#DDD7CC] hover:border-[#F2C9CE] text-[#52625E] hover:text-[#9B1C31] text-sm font-medium transition-all flex items-center space-x-2"
            title="End voice session"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End</span>
          </button>
        </div>
      </div>

      {/* 5. Optional Text Fallback Input */}
      {textFallbackMode && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-5 rounded-3xl bg-white border border-[#E6E1D8] shadow-soft space-y-3"
        >
          <div className="flex items-center justify-between text-sm text-[#52625E]">
            <span className="font-medium text-[#263330] flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-[#285B55]" />
              <span>Write to your voice companion</span>
            </span>
            <span className="text-xs">Ideal when you prefer not to speak out loud</span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder={`Write what is on your mind...`}
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendTurn()}
              className="flex-1 bg-[#FAF8F4] border border-[#DDD7CC] rounded-2xl px-4 py-3 min-h-[48px] text-base text-[#263330] focus:outline-none focus:border-[#285B55]"
            />
            <Button size="md" variant="primary" onClick={() => handleSendTurn()}>
              Send
            </Button>
          </div>
        </motion.div>
      )}

      {/* 6. Readable Conversation Transcripts */}
      <div className="w-full p-6 rounded-3xl bg-white border border-[#E6E1D8] shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-[#F3EFE8] pb-3">
          <h3 className="text-base font-serif font-semibold text-[#263330]">
            Conversation Transcript
          </h3>
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="text-xs font-medium text-[#285B55] hover:underline"
          >
            {showTranscript ? "Hide transcript" : "Show transcript"}
          </button>
        </div>

        {showTranscript && (
          <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
            {transcripts.map((t) => (
              <div
                key={t.id}
                className={`p-4 rounded-2xl text-base space-y-1 transition-all ${
                  t.sender === "user"
                    ? "bg-[#E8F1EB]/70 border border-[#CBE0D3] text-[#1F4742] ml-4 sm:ml-10"
                    : t.isCrisisEscalation
                    ? "bg-[#FDF2F2] border border-[#F2C9CE] text-[#263330]"
                    : "bg-[#FAF8F4] border border-[#E6E1D8] text-[#263330] mr-4 sm:mr-10"
                }`}
              >
                <div className="flex items-center justify-between text-xs text-[#52625E]">
                  <span className="font-medium text-[#285B55]">
                    {t.sender === "user" ? "You" : "InnerOS Companion"}
                  </span>
                  <span>{t.timestamp}</span>
                </div>
                <p className="leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Voice Profile Selector Modal */}
      {isVoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263330]/40 backdrop-blur-xs">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#FAF8F4] border border-[#E6E1D8] shadow-elevated space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E6E1D8] pb-3">
              <h3 className="text-lg font-serif font-semibold text-[#263330]">
                Choose Companion Voice
              </h3>
              <button
                onClick={() => setIsVoiceModalOpen(false)}
                className="p-2 rounded-xl bg-white border border-[#DDD7CC] text-[#52625E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid gap-3">
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
                        ? "bg-[#E8F1EB] border-[#285B55] shadow-xs"
                        : "bg-white border-[#E6E1D8] hover:border-[#285B55]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-base text-[#263330]">{p.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-[#52625E]">{p.language}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#285B55]" />}
                      </div>
                    </div>
                    <p className="text-sm text-[#52625E] leading-relaxed">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.tone_characteristics.map((tc) => (
                        <span
                          key={tc}
                          className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF8F4] border border-[#E2DDD2] text-[#52625E]"
                        >
                          {tc}
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

      {/* 8. Language Selector Modal */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263330]/40 backdrop-blur-xs">
          <div className="w-full max-w-xl p-6 rounded-3xl bg-[#FAF8F4] border border-[#E6E1D8] shadow-elevated space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E6E1D8] pb-3">
              <div>
                <h3 className="text-lg font-serif font-semibold text-[#263330]">
                  Select Language
                </h3>
                <p className="text-sm text-[#52625E]">
                  Choose your preferred language for voice and text
                </p>
              </div>
              <button
                onClick={() => setIsLanguageModalOpen(false)}
                className="p-2 rounded-xl bg-white border border-[#DDD7CC] text-[#52625E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Search language..."
              value={languageSearch}
              onChange={(e) => setLanguageSearch(e.target.value)}
              className="w-full text-base bg-white border border-[#DDD7CC] rounded-2xl px-4 py-2.5 text-[#263330] focus:outline-none focus:border-[#285B55]"
            />

            <div className="grid gap-2.5 max-h-96 overflow-y-auto pr-1">
              {languages
                .filter(
                  (l) =>
                    l.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
                    l.native_name.toLowerCase().includes(languageSearch.toLowerCase())
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
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-[#E8F1EB] border-[#285B55]"
                          : "bg-white border-[#E6E1D8] hover:border-[#285B55]/50"
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-base text-[#263330]">
                          {lang.name} ({lang.native_name})
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#285B55]" />}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
