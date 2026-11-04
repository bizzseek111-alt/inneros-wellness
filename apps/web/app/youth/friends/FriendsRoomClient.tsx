"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  X,
  ShieldAlert,
  ArrowRight,
  Clock,
  Compass,
  Check,
} from "lucide-react";
import { ChildNavigationShell } from "@/components/youth/ChildNavigationShell";
import { useYouth } from "@/components/youth/YouthContext";
import { AI_FRIENDS, CHARACTER_LIST, CharacterId } from "@/lib/friends-data";
import { CharacterAvatar } from "@/components/youth/friends/CharacterAvatar";
import { CharacterVisualState } from "@/components/youth/friends/KaiCharacter";
import { voiceSynthesizer } from "@/lib/voice-synthesizer";

interface ToolAction {
  tool: string;
  route?: string;
  label: string;
  icon?: string;
  params?: Record<string, any>;
}

interface ChoiceOption {
  label: string;
  icon: string;
  action: ToolAction;
}

interface FriendsRoomClientProps {
  initialFriendId?: CharacterId;
  autoListen?: boolean;
}

export default function FriendsRoomClient({
  initialFriendId = "kai",
  autoListen = false,
}: FriendsRoomClientProps) {
  const router = useRouter();
  const { ageTier, locale, setLocale } = useYouth();

  // Selected Character
  const [selectedCharacterId, setSelectedCharacterId] = useState<CharacterId>(
    AI_FRIENDS[initialFriendId] ? initialFriendId : "kai"
  );
  const activeChar = AI_FRIENDS[selectedCharacterId];

  // Conversation & Audio States
  const [visualState, setVisualState] = useState<CharacterVisualState>("idle");
  const [micPermission, setMicPermission] = useState<"prompt" | "granted" | "denied">("prompt");
  const [isMicListening, setIsMicListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [companionReply, setCompanionReply] = useState(
    activeChar.voiceProfile.samplePhrases[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"]
  );
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [turnCount, setTurnCount] = useState(0);
  const [windDownNotice, setWindDownNotice] = useState<string | null>(null);
  const [crisisAlert, setCrisisAlert] = useState<string | null>(null);
  const [safetyResources, setSafetyResources] = useState<any[]>([]);
  const [waveformBars, setWaveformBars] = useState<number[]>([30, 45, 60, 80, 55, 40, 70, 85, 50, 35]);

  // AI-Powered Action Navigation State
  const [pendingAction, setPendingAction] = useState<ToolAction | null>(null);
  const [pendingChoices, setPendingChoices] = useState<ChoiceOption[] | null>(null);
  const [actionCountdown, setActionCountdown] = useState<number | null>(null);

  const recognitionRef = useRef<any>(null);
  const sessionIdRef = useRef<string>(`friends_${Date.now()}`);
  const autoRouteTimeoutRef = useRef<any>(null);

  // Update greeting when character or language changes
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
    setPendingAction(null);
    setPendingChoices(null);
  }, [selectedCharacterId, locale]);

  // Handle autoListen param
  useEffect(() => {
    if (autoListen) {
      const timer = setTimeout(() => {
        handleRequestMicrophone();
      }, 600);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoListen]);

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
      alert("Speech recognition is not supported in this browser. You can type below!");
      setIsKeyboardOpen(true);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      const langCode =
        locale === "ur"
          ? "ur-PK"
          : locale === "pa"
          ? "pa-PK"
          : activeChar.voiceProfile.langCodes.en;

      recognition.lang = langCode;

      recognition.onstart = () => {
        setIsMicListening(true);
        setVisualState("listening");
        setLiveTranscript("");
        setPendingAction(null);
        setPendingChoices(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setLiveTranscript(transcript);
      };

      recognition.onerror = () => {
        setIsMicListening(false);
        setVisualState("idle");
      };

      recognition.onend = () => {
        setIsMicListening(false);
        setVisualState("thinking");

        // Submit recognized utterance
        setLiveTranscript((latest) => {
          if (latest.trim()) {
            sendUtterance(latest.trim());
          } else {
            setVisualState("idle");
          }
          return latest;
        });
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsMicListening(false);
      setVisualState("idle");
    }
  };

  const handleToggleMic = () => {
    if (isMicListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsMicListening(false);
      setVisualState("thinking");
    } else {
      voiceSynthesizer.stop();
      handleRequestMicrophone();
    }
  };

  const speakReply = (text: string, onDone?: () => void) => {
    setVisualState("speaking");
    const langCode =
      locale === "ur"
        ? "ur-PK"
        : locale === "pa"
        ? "pa-PK"
        : activeChar.voiceProfile.langCodes.en;

    voiceSynthesizer.speak(text, {
      lang: langCode,
      rate: activeChar.voiceProfile.rate,
      pitch: activeChar.voiceProfile.pitch,
      onEnd: () => {
        setVisualState("idle");
        if (onDone) onDone();
      },
    });
  };

  const logEducationalActivity = async (action: ToolAction) => {
    try {
      await fetch("/api/educational/activity-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_pseudonymous_id: "std_weebly_child",
          student_name: "Child (Weebly Sanctuary)",
          activity_id: `act_${action.tool}`,
          activity_title: action.label,
          category: action.params?.category || action.tool,
          learning_objective: `Conversational tool trigger: ${action.tool}`,
          completion_status: "in_progress",
          language_used: locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en",
          duration_seconds: 45,
          curriculum_version: "v3.0.0",
        }),
      });
    } catch {
      // Non-blocking educational log
    }
  };

  const sendUtterance = async (messageText: string) => {
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
        speakReply(data.reply);
        return;
      }

      // Handle Language Switching Action
      if (data.action?.tool === "set_conversation_language") {
        const newLang = data.action.params?.language;
        if (newLang) {
          setLocale(newLang);
        }
      }

      // Handle Route Navigation Action
      if (data.action?.route) {
        setPendingAction(data.action);
        logEducationalActivity(data.action);
      } else {
        setPendingAction(null);
      }

      // Handle Ambiguous Choices
      if (data.choices && data.choices.length > 0) {
        setPendingChoices(data.choices);
      } else {
        setPendingChoices(null);
      }

      // Speak reply aloud
      speakReply(data.reply, () => {
        // If there's an action with a route, start smooth countdown or auto-route
        if (data.action?.route) {
          setActionCountdown(4);
        }
      });
    } catch {
      const fallback =
        selectedCharacterId === "kai"
          ? "I hear you! That's a great thought. Let's look at the very first step together!"
          : "I'm right here with you! Let's take a calm pause together.";
      setCompanionReply(fallback);
      speakReply(fallback);
    }
  };

  // Countdown auto-route effect
  useEffect(() => {
    if (actionCountdown === null) return;
    if (actionCountdown <= 0) {
      if (pendingAction?.route) {
        router.push(pendingAction.route);
      }
      return;
    }
    const timer = setTimeout(() => {
      setActionCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [actionCountdown, pendingAction, router]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    sendUtterance(textInput);
    setTextInput("");
  };

  const handleReplay = () => {
    speakReply(companionReply);
  };

  const handleStopSpeaking = () => {
    voiceSynthesizer.stop();
    setVisualState("idle");
    if (actionCountdown !== null) {
      setActionCountdown(null);
    }
  };

  const handleExecuteChoice = (choice: ChoiceOption) => {
    setPendingChoices(null);
    setPendingAction(choice.action);
    if (choice.action.route) {
      logEducationalActivity(choice.action);
      router.push(choice.action.route);
    }
  };

  return (
    <ChildNavigationShell activeTab="talk">
      <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
        {/* Top Character Switcher Ribbon & Big Exit Button */}
        <div className="flex items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          {/* Big Exit Button (X) back to Magic Home */}
          <Link
            href="/youth/dashboard"
            onClick={handleStopSpeaking}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center space-x-1.5 transition-all shadow-2xs hover:scale-105 active:scale-95"
            title="Exit to Magic Home"
            aria-label="Exit to Weebly Magic Home"
          >
            <X className="w-4 h-4 text-slate-700" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          {/* Character Switcher Strip */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto p-1 bg-slate-100 rounded-2xl">
            {CHARACTER_LIST.map((char) => {
              const isSelected = char.id === selectedCharacterId;
              return (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => {
                    handleStopSpeaking();
                    setSelectedCharacterId(char.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 shrink-0 ${
                    isSelected
                      ? "bg-white shadow-xs scale-102"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                  style={{
                    color: isSelected ? char.accentColor : undefined,
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: char.accentColor }}
                  />
                  <span>{char.name}</span>
                </button>
              );
            })}
          </div>

          {/* Subtitles & Keyboard Toggles */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              type="button"
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={`p-2 rounded-xl text-xs font-black border transition-colors ${
                showSubtitles
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-300"
              }`}
              title={showSubtitles ? "Turn subtitles off" : "Turn subtitles on"}
              aria-label="Toggle subtitles"
            >
              CC
            </button>

            <button
              type="button"
              onClick={() => setIsKeyboardOpen(!isKeyboardOpen)}
              className={`p-2 rounded-xl text-xs font-black border transition-colors ${
                isKeyboardOpen
                  ? "bg-amber-500 text-white border-amber-600"
                  : "bg-white text-slate-600 border-slate-300"
              }`}
              title="Toggle text typing"
              aria-label="Toggle typing keyboard"
            >
              <MessageSquare className="w-4 h-4" />
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

        {/* Anti-Addiction Wind-Down Notice */}
        {windDownNotice && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center space-x-2 text-xs font-bold animate-fade-in">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{windDownNotice}</span>
          </div>
        )}

        {/* AI Action Navigation Prompt Banner */}
        {pendingAction && pendingAction.route && (
          <div className="p-5 rounded-[32px] bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce-subtle">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{pendingAction.icon || "🚀"}</span>
              <div className="space-y-0.5 text-center sm:text-start">
                <h3 className="text-lg font-black">{pendingAction.label}</h3>
                <p className="text-xs text-amber-100 font-medium">
                  {activeChar.name} is ready to explore this with you!
                  {actionCountdown !== null && actionCountdown > 0 && ` (Opening in ${actionCountdown}s)`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => setActionCountdown(null)}
                className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors"
              >
                Stay Here
              </button>
              <Link
                href={pendingAction.route}
                onClick={handleStopSpeaking}
                className="px-5 py-2.5 rounded-xl bg-white text-amber-900 hover:bg-amber-50 text-xs font-black flex items-center space-x-1.5 shadow-md transition-all hover:scale-105"
              >
                <span>Open Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Ambiguous Intent Choices (Pre-Reader Selection) */}
        {pendingChoices && pendingChoices.length > 0 && (
          <div className="p-5 rounded-[32px] bg-amber-50 border-2 border-amber-200 shadow-sm space-y-3 animate-fade-in">
            <p className="text-center text-xs font-black text-amber-900 uppercase tracking-wider">
              Choose what you would like to do:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pendingChoices.map((choice, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleExecuteChoice(choice)}
                  className="p-4 rounded-2xl bg-white hover:bg-amber-100 border border-amber-200 shadow-xs flex items-center justify-center space-x-3 font-black text-sm text-slate-800 transition-all hover:scale-102"
                >
                  <span className="text-2xl">{choice.icon}</span>
                  <span>{choice.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Full-Screen Conversation Stage */}
        <div
          className={`relative rounded-[40px] bg-gradient-to-b ${activeChar.bgGradient} border-2 border-white shadow-xl p-6 sm:p-8 flex flex-col items-center text-center space-y-6 overflow-hidden`}
        >
          {/* Status Feedback Indicator */}
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
                : `Ready to talk with ${activeChar.name}`}
            </span>
          </div>

          {/* Large Hero Character Avatar */}
          <div className="relative py-2">
            <CharacterAvatar
              characterId={selectedCharacterId}
              state={visualState}
              size="hero"
              interactive
              onClick={handleToggleMic}
            />
          </div>

          {/* Waveform Bar Feedback */}
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

          {/* Friendly Suggested Questions / Action Chips */}
          <div className="w-full max-w-xl flex flex-wrap gap-2 justify-center pt-2">
            {activeChar.suggestedQuestions[locale === "ur" ? "ur" : locale === "pa" ? "pa" : "en"]?.map(
              (q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendUtterance(q)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-xs font-bold text-slate-700 border border-slate-200 shadow-2xs hover:scale-102 active:scale-98 transition-all"
                >
                  &ldquo;{q}&rdquo;
                </button>
              )
            )}
          </div>
        </div>

        {/* Big Push-to-Talk Microphone Centerpiece & Controls */}
        <div className="p-6 rounded-[32px] bg-white border border-slate-200 shadow-sm space-y-5">
          {/* Main Large Microphone Button */}
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
                ? "Microphone access blocked (use typing keyboard below)"
                : isMicListening
                ? "Listening... Tap to stop"
                : `Tap to Speak with ${activeChar.name}`}
            </p>
          </div>

          {/* Secondary Action Buttons (Replay, Stop Speaking) */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReplay}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center space-x-1.5 transition-colors"
              title="Hear character speak again"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Say it again</span>
            </button>

            {visualState === "speaking" && (
              <button
                type="button"
                onClick={handleStopSpeaking}
                className="px-4 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-black transition-colors"
              >
                Stop Talking
              </button>
            )}
          </div>

          {/* Text Typing Fallback Drawer */}
          {isKeyboardOpen && (
            <form onSubmit={handleTextSubmit} className="pt-3 flex items-center space-x-2 animate-fade-in">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={`Type a message to ${activeChar.name}...`}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                autoFocus
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
          )}
        </div>
      </div>
    </ChildNavigationShell>
  );
}
