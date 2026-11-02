"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Mic,
  MicOff,
  VolumeX,
  Sparkles,
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
  Volume2,
  Radio,
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
  emotion?: string;
  language?: string;
}

const LANGUAGE_SPEECH_MAP: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  ur: "ur-PK",
  bg: "bg-BG",
  ar: "ar-SA",
  hi: "hi-IN",
};

export const RealtimeVoiceCompanion: React.FC = () => {
  const [visualState, setVisualState] = useState<VoiceCompanionVisualState>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const [textFallbackMode, setTextFallbackMode] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const [micPermission, setMicPermission] = useState<"prompt" | "granted" | "denied">("prompt");
  const [audioLevel, setAudioLevel] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [detectedLanguageCode, setDetectedLanguageCode] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const currentAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSpeakingRef = useRef<boolean>(false);

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
    "Voice companion ready. Speak aloud or press Space to control microphone."
  );

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [languageSearch, setLanguageSearch] = useState("");
  const [crisisAlert, setCrisisAlert] = useState<VoiceTurnResponse | null>(null);

  // Keep track of speaking state in ref for event handlers
  useEffect(() => {
    isSpeakingRef.current = visualState === "speaking";
  }, [visualState]);

  // Load backend voice profiles and languages
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
        // Fallback to offline voice seeds
      }
    }
    loadData();
  }, []);

  // Barge-in interruption handler
  const handleBargeInInterruption = useCallback(async () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    if (currentAudioElementRef.current) {
      try {
        currentAudioElementRef.current.pause();
        currentAudioElementRef.current.currentTime = 0;
      } catch (e) {
        // Ignore audio element pause errors
      }
    }

    setVisualState("interrupted");
    setScreenReaderAnnouncement("Companion paused speaking to listen to you.");

    try {
      await api.interruptVoiceSession("session_active_voice", 0);
    } catch (e) {
      // Ignore offline interruption errors
    }

    setTimeout(() => {
      setVisualState(isMuted ? "muted" : "listening");
    }, 350);
  }, [isMuted]);

  // Send turn to backend companion
  const handleSendTurn = useCallback(
    async (utteranceText?: string) => {
      const textToSend = (utteranceText || typedInput).trim();
      if (!textToSend) return;

      // Immediately cancel any previous speech synthesis
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (currentAudioElementRef.current) {
        try {
          currentAudioElementRef.current.pause();
        } catch (e) {}
      }

      setLiveTranscript("");

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

        // 1. Safety Escalation
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

        // 2. Clarification Requested
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

        // 3. Companion Response & Emotional Understanding
        if (turnResponse.detected_emotion) {
          setCurrentEmotion(turnResponse.detected_emotion);
        }
        if (turnResponse.detected_language) {
          setDetectedLanguageCode(turnResponse.detected_language);
        }

        const compMsg: TranscriptMessage = {
          id: `comp_${Date.now()}`,
          sender: "companion",
          text: turnResponse.transcript_companion,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          emotion: turnResponse.detected_emotion,
          language: turnResponse.detected_language,
        };
        setTranscripts((prev) => [...prev, compMsg]);
        setVisualState("speaking");
        setScreenReaderAnnouncement(`Companion says: ${turnResponse.transcript_companion}`);

        // 4. Play Spoken Speech Aloud with Symmetrical Language Matching
        const companionText = turnResponse.transcript_companion;
        const matchedLangCode = turnResponse.detected_language || selectedLanguage.code;
        const targetLang = LANGUAGE_SPEECH_MAP[matchedLangCode] || "en-US";
        let speechPlayed = false;

        // A. Primary TTS: Web Speech Synthesis for high-fidelity natural friend speech
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(companionText);
            utterance.lang = targetLang;
            utterance.rate = selectedVoice.speed_multiplier || 0.95;
            utterance.pitch = 1.0;

            // Pick closest native voice for the matched language
            const voices = window.speechSynthesis.getVoices();
            const matchedVoice = voices.find(
              (v) =>
                v.lang.toLowerCase().startsWith(matchedLangCode.toLowerCase()) ||
                v.lang.toLowerCase().replace("_", "-").startsWith(matchedLangCode.toLowerCase())
            );
            if (matchedVoice) {
              utterance.voice = matchedVoice;
            }

            utterance.onstart = () => {
              setVisualState("speaking");
            };

            utterance.onend = () => {
              if (!isPaused) {
                setVisualState(isMuted ? "muted" : "listening");
              }
            };

            utterance.onerror = (e) => {
              console.warn("Speech synthesis notice:", e);
              if (!isPaused) {
                setVisualState(isMuted ? "muted" : "listening");
              }
            };

            window.speechSynthesis.speak(utterance);
            speechPlayed = true;
          } catch (e) {
            console.warn("Browser speech synthesis unavailable:", e);
          }
        }

        // B. Secondary / Backend Audio Fallback (Base64 WAV / MP3)
        if (!speechPlayed && turnResponse.audio_base64 && typeof window !== "undefined") {
          try {
            const isWav =
              turnResponse.audio_format === "wav" ||
              turnResponse.audio_base64.startsWith("UklGR");
            const mimeType = isWav ? "audio/wav" : "audio/mp3";
            const audio = new Audio(`data:${mimeType};base64,${turnResponse.audio_base64}`);
            currentAudioElementRef.current = audio;

            audio.onended = () => {
              if (!isPaused) {
                setVisualState(isMuted ? "muted" : "listening");
              }
            };

            await audio.play();
          } catch (audioErr) {
            // Timer fallback based on estimated response duration
            setTimeout(() => {
              if (!isPaused) {
                setVisualState(isMuted ? "muted" : "listening");
              }
            }, (turnResponse.duration_estimate_sec || 2.5) * 1000);
          }
        } else if (!speechPlayed) {
          // Visual timer fallback
          setTimeout(() => {
            if (!isPaused) {
              setVisualState(isMuted ? "muted" : "listening");
            }
          }, (turnResponse.duration_estimate_sec || 2.5) * 1000);
        }
      } catch (err) {
        console.error("Turn execution failed:", err);
        setVisualState(isMuted ? "muted" : "listening");
      }
    },
    [typedInput, selectedVoice, selectedLanguage, isPaused, isMuted]
  );

  // Initialize and maintain speech recognition
  const initSpeechRecognition = useCallback(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition API not supported in this browser environment.");
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = LANGUAGE_SPEECH_MAP[selectedLanguage.code] || "en-US";

      recognition.onstart = () => {
        setIsRecognitionActive(true);
      };

      recognition.onresult = (event: any) => {
        // Interruption detection: if companion is speaking and user begins talking, barge-in!
        if (isSpeakingRef.current) {
          handleBargeInInterruption();
        }

        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            final += res[0].transcript;
          } else {
            interim += res[0].transcript;
          }
        }

        const candidateText = (final || interim).trim();
        if (candidateText) {
          setLiveTranscript(candidateText);

          // Reset silence timer on every spoken word
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          // Auto-send turn when user pauses speaking
          silenceTimerRef.current = setTimeout(() => {
            if (candidateText.length > 1) {
              handleSendTurn(candidateText);
            }
          }, final ? 950 : 1600);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== "no-speech") {
          console.warn("Speech recognition event:", event.error);
        }
      };

      recognition.onend = () => {
        setIsRecognitionActive(false);
        // Automatically restart listening if still granted, unmuted, and unpaused
        if (micPermission === "granted" && !isMuted && !isPaused) {
          try {
            recognition.start();
          } catch (e) {
            // Already active or restarting
          }
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn("Could not start SpeechRecognition:", err);
    }
  }, [selectedLanguage, micPermission, isMuted, isPaused, handleBargeInInterruption, handleSendTurn]);

  // Request microphone permission and activate recognition
  const handleRequestMicrophone = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;
        setMicPermission("granted");
        setIsMuted(false);
        setVisualState("listening");
        setScreenReaderAnnouncement("Microphone enabled. Listening to you speak.");

        // Start Web Audio analyser for the visual orb wave
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
          // Audio context analyser fallback
        }

        // Initialize Speech Recognition
        initSpeechRecognition();
      }
    } catch (err: any) {
      setMicPermission("denied");
      setVisualState("resting");
      setTextFallbackMode(true);
      setScreenReaderAnnouncement("Microphone access unavailable. You can type below instead.");
    }
  };

  const handleToggleMute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      setVisualState("listening");
      setScreenReaderAnnouncement("Microphone unmuted. Listening.");
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {}
      } else {
        initSpeechRecognition();
      }
    } else {
      setIsMuted(true);
      setVisualState("muted");
      setLiveTranscript("");
      setScreenReaderAnnouncement("Microphone muted.");
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    }
  }, [isMuted, initSpeechRecognition]);

  const handleTogglePause = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      setVisualState(isMuted ? "muted" : "listening");
      setScreenReaderAnnouncement("Conversation resumed.");
      if (!isMuted && micPermission === "granted") {
        initSpeechRecognition();
      }
    } else {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (currentAudioElementRef.current) {
        currentAudioElementRef.current.pause();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsPaused(true);
      setVisualState("resting");
      setScreenReaderAnnouncement("Conversation paused.");
    }
  }, [isPaused, isMuted, micPermission, initSpeechRecognition]);

  const handleEndConversation = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (currentAudioElementRef.current) {
      currentAudioElementRef.current.pause();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setVisualState("resting");
    setLiveTranscript("");
    setScreenReaderAnnouncement("Voice conversation ended peacefully.");
  }, []);

  // Keyboard shortcut listener
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
  }, [handleToggleMute, handleBargeInInterruption, handleEndConversation]);

  // Restart recognition when language changes
  useEffect(() => {
    if (micPermission === "granted" && !isMuted && !isPaused) {
      initSpeechRecognition();
    }
  }, [selectedLanguage, micPermission, isMuted, isPaused, initSpeechRecognition]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const isRTL = selectedLanguage.direction === "rtl";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="max-w-4xl mx-auto pt-3 sm:pt-6 pb-16 space-y-6 flex flex-col items-center relative w-full"
    >
      {/* Screen-Reader Live Region */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {screenReaderAnnouncement}
      </div>

      {/* 1. PeopleFlow Bento Header Bar */}
      <div className="w-full p-5 rounded-[28px] bg-white border border-[#DCE7FE] shadow-[0_8px_30px_rgba(43,76,222,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold text-[#0F172A]">
              Voice Companion
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEF4FF] text-[#2B4CDE] border border-[#DCE7FE]">
              Empathetic Voice
            </span>
          </div>
          <p className="text-sm text-[#64748B]">
            Speak naturally like with a close friend &bull; Detects emotions and replies in your language
          </p>
        </div>

        {/* Voice, Language & Text Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="px-3.5 py-2 min-h-[40px] rounded-full bg-white hover:bg-[#F8FAFC] border border-[#DCE7FE] text-xs font-medium text-[#0F172A] transition-all flex items-center space-x-2 shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5 text-[#2B4CDE]" />
            <span>Voice: {selectedVoice.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
          </button>

          <button
            onClick={() => setIsLanguageModalOpen(true)}
            className="px-3.5 py-2 min-h-[40px] rounded-full bg-white hover:bg-[#F8FAFC] border border-[#DCE7FE] text-xs font-medium text-[#0F172A] transition-all flex items-center space-x-2 shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-[#2B4CDE]" />
            <span>{selectedLanguage.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
          </button>

          <Link
            href="/companion/chat"
            className="px-3.5 py-2 min-h-[40px] rounded-full bg-[#EEF4FF] hover:bg-[#DCE7FE] text-[#2B4CDE] border border-[#DCE7FE] text-xs font-medium flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#2B4CDE]" />
            <span>Text Chat</span>
          </Link>
        </div>
      </div>

      {/* 2. Crisis Support Notice (When Triggered) */}
      {crisisAlert && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full p-6 rounded-[28px] bg-[#FFF1F2] border border-[#FECDD3] shadow-card space-y-4"
        >
          <div className="flex items-center space-x-2.5 text-[#E11D48]">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h3 className="text-base font-semibold">
              Immediate Human Support Resources
            </h3>
          </div>
          <p className="text-base text-[#0F172A] leading-relaxed">
            {crisisAlert.transcript_companion}
          </p>
          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            {crisisAlert.safety_resources.map((res, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border border-[#FECDD3]">
                <span className="font-semibold text-[#E11D48] block text-sm">{res.name}</span>
                <span className="text-[#0F172A] text-sm mt-0.5 block">{res.contact}</span>
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

      {/* 3. Main Bento Sanctuary Voice Canvas */}
      <div className="w-full py-10 sm:py-14 px-6 rounded-[32px] bg-white border border-[#DCE7FE] shadow-[0_12px_36px_rgba(43,76,222,0.06)] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Soft Ambient Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F0F5FF]/60 via-transparent to-[#EEF4FF]/30 pointer-events-none" />

        {/* Dynamic State, Emotion & Matched Language Badges */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F8FAFC] border border-[#DCE7FE] text-xs text-[#0F172A] shadow-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                visualState === "listening"
                  ? "bg-[#2B4CDE] animate-ping"
                  : visualState === "speaking"
                  ? "bg-[#38BDF8] animate-pulse"
                  : visualState === "thinking"
                  ? "bg-[#8B5CF6] animate-spin"
                  : "bg-[#94A3B8]"
              }`}
            />
            <span className="font-semibold capitalize">{visualState}</span>
            <span className="text-[#94A3B8]">&bull;</span>
            <span className="text-[#475569]">
              {visualState === "listening"
                ? "Listening to you"
                : visualState === "speaking"
                ? "Companion speaking"
                : visualState === "thinking"
                ? "Listening like a friend..."
                : "Ready to talk"}
            </span>
          </div>

          {currentEmotion && (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#EEF4FF] border border-[#DCE7FE] text-xs text-[#2B4CDE] shadow-xs animate-fade-in font-medium">
              <span>Emotion:</span>
              <span className="font-bold">{currentEmotion}</span>
            </div>
          )}

          {detectedLanguageCode && (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-xs text-[#059669] shadow-xs">
              <Globe className="w-3.5 h-3.5 text-[#059669]" />
              <span className="font-medium text-[#047857]">Replying in:</span>
              <span className="font-bold uppercase">{detectedLanguageCode}</span>
            </div>
          )}
        </div>

        {/* 3D Soft Gradient Companion Orb (Borderless floating sphere) */}
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

        {/* Live Recognized Speech Bubble */}
        <AnimatePresence>
          {liveTranscript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 max-w-lg px-5 py-3 rounded-full bg-[#EEF4FF] border border-[#DCE7FE] text-sm text-[#0F172A] flex items-center space-x-2 shadow-xs"
            >
              <Mic className="w-4 h-4 text-[#2B4CDE] shrink-0 animate-pulse" />
              <span className="truncate">
                <strong className="font-semibold text-[#0F172A]">You:</strong> &ldquo;{liveTranscript}&rdquo;
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Microphone Permission Prompt */}
        {micPermission === "prompt" && (
          <div className="mt-6 p-4 rounded-2xl bg-[#EEF4FF] border border-[#DCE7FE] flex flex-wrap items-center justify-center gap-3 text-sm text-[#0F172A]">
            <Mic className="w-4 h-4 text-[#2B4CDE]" />
            <span>Enable microphone to talk freely with your AI companion.</span>
            <button
              onClick={handleRequestMicrophone}
              className="px-4 py-2 rounded-full bg-[#2B4CDE] text-white font-medium text-xs hover:bg-[#1E3A8A] transition-all shadow-sm"
            >
              Start Talking
            </button>
          </div>
        )}

        {micPermission === "denied" && (
          <div className="mt-6 p-4 rounded-2xl bg-[#FFF1F2] border border-[#FECDD3] flex items-center space-x-2.5 text-sm text-[#E11D48]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Microphone access was denied. You can still write messages below.</span>
          </div>
        )}

        {/* 4. Accessible Primary Voice Controls Dock */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 z-10">
          {/* Mute / Unmute Pill */}
          <button
            onClick={micPermission === "prompt" ? handleRequestMicrophone : handleToggleMute}
            className={`px-6 py-3.5 min-h-[48px] rounded-full font-medium text-sm transition-all flex items-center space-x-2.5 shadow-sm ${
              isMuted
                ? "bg-[#FFF1F2] border border-[#FECDD3] text-[#E11D48] hover:bg-[#FFE4E6]"
                : "bg-[#2B4CDE] text-white hover:bg-[#1E3A8A] shadow-md shadow-[#2B4CDE]/20"
            }`}
            title={isMuted ? "Unmute microphone (Space)" : "Mute microphone (Space)"}
            aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
          >
            {isMuted ? (
              <>
                <MicOff className="w-4 h-4 text-[#E11D48]" />
                <span>Microphone Muted</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-white animate-pulse" />
                <span>Listening Active</span>
              </>
            )}
          </button>

          {/* Pause / Resume */}
          <button
            onClick={handleTogglePause}
            className="px-4 py-3 min-h-[48px] rounded-full bg-[#FFFFFF] hover:bg-[#F9FBFA] border border-[#1A1E1C]/10 text-[#1A1E1C] text-sm font-medium transition-all flex items-center space-x-2 shadow-xs"
            title={isPaused ? "Resume conversation" : "Pause conversation"}
          >
            {isPaused ? <Play className="w-4 h-4 text-[#285B55]" /> : <Pause className="w-4 h-4 text-[#687670]" />}
            <span>{isPaused ? "Resume" : "Pause"}</span>
          </button>

          {/* Interrupt Speech (When Companion is Speaking) */}
          {visualState === "speaking" && (
            <button
              onClick={handleBargeInInterruption}
              className="px-4 py-3 min-h-[48px] rounded-full bg-[#F6D4DC]/60 hover:bg-[#F6D4DC] border border-[#F6D4DC] text-[#1A1E1C] text-sm font-medium transition-all flex items-center space-x-2 shadow-xs animate-bounce"
              title="Interrupt companion (I key)"
            >
              <VolumeX className="w-4 h-4 text-[#9B1C31]" />
              <span>Interrupt Companion</span>
            </button>
          )}

          {/* Toggle Written Input */}
          <button
            onClick={() => setTextFallbackMode(!textFallbackMode)}
            className={`px-4 py-3 min-h-[48px] rounded-full border text-sm font-medium transition-all flex items-center space-x-2 shadow-xs ${
              textFallbackMode
                ? "bg-[#EAE4F7] border-[#EAE4F7] text-[#1A1E1C]"
                : "bg-[#FFFFFF] border-[#1A1E1C]/10 text-[#1A1E1C] hover:bg-[#F9FBFA]"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#5D488A]" />
            <span>Type Instead</span>
          </button>

          {/* End Conversation */}
          <button
            onClick={handleEndConversation}
            className="px-4 py-3 min-h-[48px] rounded-full bg-[#FFFFFF] hover:bg-[#FDF2F2] border border-[#1A1E1C]/10 hover:border-[#F2C9CE] text-[#687670] hover:text-[#9B1C31] text-sm font-medium transition-all flex items-center space-x-2 shadow-xs"
            title="End voice session (Esc)"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End</span>
          </button>
        </div>

        {/* Quick Conversational Prompt Chips */}
        <div className="mt-8 flex flex-col items-center justify-center gap-2.5 max-w-2xl text-center">
          <span className="text-xs text-[#687670] font-medium">Speak naturally in any language or tap a friend thought:</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { text: "I had the most exhausting day at work and my boss yelled at me", label: "🇬🇧 English", emotion: "Exhaustion" },
              { text: "Main aaj bohot thak gaya hoon yaar, office mein bohot pressure tha", label: "🇵🇰 Urdu", emotion: "Thakan" },
              { text: "Hola amigo, hoy me siento triste y abrumado con todo lo que pasó", label: "🇪🇸 Español", emotion: "Tristeza" },
              { text: "Help me untangle what to focus on first", label: "💡 Clarity", emotion: "Overwhelm" },
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendTurn(prompt.text)}
                className="px-3.5 py-1.5 rounded-full bg-[#F0F5FF] hover:bg-[#EEF4FF] border border-[#DCE7FE] text-xs text-[#0F172A] transition-all shadow-xs text-left"
                title={prompt.text}
              >
                <span className="font-semibold text-[#2B4CDE]">{prompt.label}:</span> &ldquo;{prompt.text.slice(0, 36)}...&rdquo;
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Optional Text Fallback Input */}
      {textFallbackMode && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-5 rounded-[28px] bg-white border border-[#DCE7FE] shadow-[0_8px_30px_rgba(43,76,222,0.05)] space-y-3"
        >
          <div className="flex items-center justify-between text-sm text-[#64748B]">
            <span className="font-medium text-[#0F172A] flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-[#2B4CDE]" />
              <span>Write to your voice companion</span>
            </span>
            <span className="text-xs">Companion will speak response aloud in your language</span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Write what is on your mind in any language..."
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendTurn()}
              className="flex-1 bg-white border border-[#DCE7FE] rounded-full px-5 py-3 min-h-[48px] text-base text-[#0F172A] focus:outline-none focus:border-[#2B4CDE] shadow-xs"
            />
            <button
              onClick={() => handleSendTurn()}
              className="px-6 py-3 rounded-full bg-[#2B4CDE] hover:bg-[#1E3A8A] text-white font-medium text-sm transition-all shadow-sm"
            >
              Send
            </button>
          </div>
        </motion.div>
      )}

      {/* 6. Readable Conversation Transcripts */}
      <div className="w-full p-6 rounded-[28px] bg-white border border-[#DCE7FE] shadow-[0_8px_30px_rgba(43,76,222,0.05)] space-y-4">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-[#0F172A]">
              Conversation Transcript
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EEF4FF] text-[#2B4CDE] font-semibold border border-[#DCE7FE]">
              {transcripts.length} turns
            </span>
          </div>
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="text-xs font-semibold text-[#2B4CDE] hover:underline"
          >
            {showTranscript ? "Hide transcript" : "Show transcript"}
          </button>
        </div>

        {showTranscript && (
          <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
            {transcripts.map((t) => (
              <div
                key={t.id}
                className={`p-4 rounded-2xl text-base space-y-1.5 transition-all ${
                  t.sender === "user"
                    ? "bg-[#EEF4FF] border border-[#DCE7FE] text-[#0F172A] ml-4 sm:ml-12"
                    : t.isCrisisEscalation
                    ? "bg-[#FFF1F2] border border-[#FECDD3] text-[#0F172A]"
                    : "bg-white border border-[#E2E8F0] text-[#0F172A] mr-4 sm:mr-12 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between text-xs text-[#64748B]">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-[#0F172A]">
                      {t.sender === "user" ? "Elena (You)" : "InnerOS Companion"}
                    </span>
                    {t.emotion && (
                      <span className="px-2 py-0.5 rounded-full bg-[#EEF4FF] text-[#2B4CDE] font-semibold text-[11px] border border-[#DCE7FE]">
                        {t.emotion}
                      </span>
                    )}
                    {t.language && (
                      <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] font-bold text-[11px] uppercase border border-[#A7F3D0]">
                        {t.language}
                      </span>
                    )}
                  </div>
                  <span>{t.timestamp}</span>
                </div>
                <p className="leading-relaxed text-sm sm:text-base text-[#0F172A]">{t.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Voice Profile Selector Modal */}
      {isVoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg p-6 rounded-[28px] bg-white border border-[#DCE7FE] shadow-[0_20px_60px_rgba(43,76,222,0.15)] space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <h3 className="text-lg font-bold text-[#0F172A]">
                Choose Companion Voice
              </h3>
              <button
                onClick={() => setIsVoiceModalOpen(false)}
                className="p-2 rounded-full bg-[#F0F5FF] text-[#64748B] hover:bg-[#EEF4FF] hover:text-[#0F172A]"
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
                        ? "bg-[#EEF4FF] border-[#2B4CDE] shadow-xs"
                        : "bg-white border-[#E2E8F0] hover:border-[#2B4CDE]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-base text-[#0F172A]">{p.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-[#64748B]">{p.language}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#2B4CDE]" />}
                      </div>
                    </div>
                    <p className="text-sm text-[#64748B] leading-relaxed">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.tone_characteristics.map((tc) => (
                        <span
                          key={tc}
                          className="text-xs px-2.5 py-0.5 rounded-full bg-[#F0F5FF] text-[#2B4CDE] font-medium"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-xl p-6 rounded-[28px] bg-white border border-[#DCE7FE] shadow-[0_20px_60px_rgba(43,76,222,0.15)] space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">
                  Select Language
                </h3>
                <p className="text-sm text-[#64748B]">
                  Choose your preferred language for continuous voice &amp; speech synthesis
                </p>
              </div>
              <button
                onClick={() => setIsLanguageModalOpen(false)}
                className="p-2 rounded-full bg-[#F0F5FF] text-[#64748B] hover:bg-[#EEF4FF] hover:text-[#0F172A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Search language..."
              value={languageSearch}
              onChange={(e) => setLanguageSearch(e.target.value)}
              className="w-full text-base bg-white border border-[#DCE7FE] rounded-full px-5 py-2.5 text-[#0F172A] focus:outline-none focus:border-[#2B4CDE] shadow-xs"
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
                          ? "bg-[#EEF4FF] border-[#2B4CDE] shadow-xs"
                          : "bg-white border-[#E2E8F0] hover:border-[#2B4CDE]/50"
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-base text-[#0F172A]">
                          {lang.name} ({lang.native_name})
                        </span>
                        <span className="text-xs text-[#64748B] ml-2 block sm:inline">
                          Tier: {lang.tier.replace(/_/g, " ")}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#2B4CDE]" />}
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
