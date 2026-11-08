import { CharacterId, AI_FRIENDS } from "./friends-data";

export interface SpeakOptions {
  characterId: CharacterId;
  text: string;
  locale?: string;
  volume?: number; // 0 to 1
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

class VoiceSynthesizer {
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private activeAudio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private isAudioUnlocked = false;
  private neuralTtsAvailable: boolean | null = null;

  private unlockAudioContext() {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx && !this.audioContext) {
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext && this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }
      this.isAudioUnlocked = true;
    } catch {
      // Audio context unlock failed or not permitted yet
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return [];
    }
    return window.speechSynthesis.getVoices();
  }

  public findBestVoice(locale: string = "en", preferredGender: "female" | "male" | "child" = "female"): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices();
    if (voices.length === 0) return null;

    const normalizedLocale = locale.toLowerCase();

    // 1. Exact match (e.g. ur-PK, pa-PK, en-US)
    const exact = voices.find((v) => v.lang.toLowerCase() === normalizedLocale);
    if (exact) return exact;

    // 2. Language prefix match (e.g. 'ur' matches 'ur', 'pa' matches 'pa')
    const langPrefix = normalizedLocale.split("-")[0];
    const prefixMatch = voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
    if (prefixMatch) return prefixMatch;

    // 3. For Pakistani Punjabi, fallback to Urdu phonetics if native pa voice is not installed in OS
    if (langPrefix === "pa") {
      const urduFallback = voices.find((v) => v.lang.toLowerCase().startsWith("ur"));
      if (urduFallback) return urduFallback;
    }

    // 4. For English, look for friendly or young-sounding voice
    if (langPrefix === "en") {
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Samantha") ||
            v.name.includes("Karen") ||
            v.name.includes("Victoria") ||
            v.name.includes("Natural") ||
            v.name.includes("Zira") ||
            v.name.includes("Google US English"))
      );
      if (preferred) return preferred;
    }

    // Default to first matching general voice
    return voices.find((v) => v.lang.startsWith("en")) || voices[0] || null;
  }

  public stop() {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.src = "";
      } catch {
        // ignore
      }
      this.activeAudio = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.activeUtterance = null;
  }

  private async tryNeuralTts(options: SpeakOptions, volume: number): Promise<boolean> {
    if (typeof window === "undefined" || this.neuralTtsAvailable === false) {
      return false;
    }
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);
      const res = await fetch("/api/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: options.text,
          character: options.characterId,
          language: options.locale || "en",
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.status === 204) {
        this.neuralTtsAvailable = false;
        return false;
      }
      if (!res.ok) {
        return false;
      }

      const blob = await res.blob();
      if (!blob || blob.size === 0) return false;

      this.neuralTtsAvailable = true;
      const url = URL.createObjectURL(blob);
      return await new Promise<boolean>((resolve) => {
        const audio = new Audio(url);
        audio.volume = volume;
        this.activeAudio = audio;
        audio.onplay = () => {
          options.onStart?.();
        };
        audio.onended = () => {
          URL.revokeObjectURL(url);
          this.activeAudio = null;
          options.onEnd?.();
          resolve(true);
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          this.activeAudio = null;
          resolve(false);
        };
        audio.play().catch(() => {
          URL.revokeObjectURL(url);
          this.activeAudio = null;
          resolve(false);
        });
      });
    } catch {
      return false;
    }
  }

  public speak(
    optionsOrText: SpeakOptions | string,
    legacyOptions?: {
      characterId?: CharacterId;
      locale?: string;
      lang?: string;
      rate?: number;
      pitch?: number;
      volume?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (error: any) => void;
    }
  ): Promise<void> {
    const options: SpeakOptions =
      typeof optionsOrText === "string"
        ? {
            characterId: legacyOptions?.characterId || "kai",
            text: optionsOrText,
            locale: legacyOptions?.locale || legacyOptions?.lang || "en",
            volume: legacyOptions?.volume,
            onStart: legacyOptions?.onStart,
            onEnd: legacyOptions?.onEnd,
            onError: legacyOptions?.onError,
          }
        : optionsOrText;

    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        resolve();
        return;
      }

      this.unlockAudioContext();
      this.stop();

      const charDef = AI_FRIENDS[options.characterId] || AI_FRIENDS.kai;
      const locale = options.locale || "en";
      const volume = options.volume !== undefined ? options.volume : 0.9;

      // First try free-tier Azure Neural TTS if configured on server
      this.tryNeuralTts(options, volume).then((playedNeural) => {
        if (playedNeural) {
          resolve();
          return;
        }

        if (!("speechSynthesis" in window)) {
          // Fallback: Web Audio melodic utterance indicator
          this.playMelodicChime(charDef.voiceProfile.pitch, options.onStart, () => {
            options.onEnd?.();
            resolve();
          });
          return;
        }

        const utterance = new SpeechSynthesisUtterance(options.text);
        utterance.pitch = legacyOptions?.pitch !== undefined ? legacyOptions.pitch : charDef.voiceProfile.pitch;
        utterance.rate = legacyOptions?.rate !== undefined ? legacyOptions.rate : charDef.voiceProfile.rate;
        utterance.volume = volume;

        // Assign matched language code
        if (locale === "ur" || locale === "ur-Latn") {
          utterance.lang = "ur-PK";
        } else if (locale === "pa" || locale === "pa-Latn") {
          utterance.lang = "pa-PK";
        } else {
          utterance.lang = "en-US";
        }

        const voice = this.findBestVoice(utterance.lang);
        if (voice) {
          utterance.voice = voice;
        }

        utterance.onstart = () => {
          options.onStart?.();
        };

        utterance.onend = () => {
          this.activeUtterance = null;
          options.onEnd?.();
          resolve();
        };

        utterance.onerror = (e) => {
          this.activeUtterance = null;
          options.onError?.(e);
          options.onEnd?.();
          resolve();
        };

        this.activeUtterance = utterance;

        // Chrome bug workaround: voices occasionally don't trigger if speak is called synchronously before getVoices
        try {
          window.speechSynthesis.speak(utterance);
        } catch {
          this.playMelodicChime(charDef.voiceProfile.pitch, options.onStart, () => {
            options.onEnd?.();
            resolve();
          });
        }
      });
    });
  }

  /**
   * Generates a warm, synthesized audio chime for environments without browser speech voices
   */
  public playMelodicChime(pitchMultiplier: number = 1.0, onStart?: () => void, onEnd?: () => void) {
    if (typeof window === "undefined") {
      onEnd?.();
      return;
    }
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        onEnd?.();
        return;
      }
      const ctx = this.audioContext || new AudioCtx();
      this.audioContext = ctx;

      onStart?.();
      const now = ctx.currentTime;
      const baseFreq = 260 * pitchMultiplier;

      // 3 pleasant harmonic tones simulating speech cadences
      [0, 0.16, 0.32].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(baseFreq * (1 + idx * 0.25), now + offset);

        gain.gain.setValueAtTime(0.001, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.2, now + offset + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.2);
      });

      setTimeout(() => {
        onEnd?.();
      }, 600);
    } catch {
      onEnd?.();
    }
  }

  public playVoiceSample(characterId: CharacterId, locale: "en" | "ur" | "pa" = "en"): Promise<void> {
    const charDef = AI_FRIENDS[characterId] || AI_FRIENDS.kai;
    const phrase = charDef.voiceProfile.samplePhrases[locale] || charDef.voiceProfile.samplePhrases.en;
    return this.speak({
      characterId,
      text: phrase,
      locale,
    });
  }
}

export const voiceSynthesizer = new VoiceSynthesizer();
