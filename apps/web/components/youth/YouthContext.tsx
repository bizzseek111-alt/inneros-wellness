"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { YouthLocale, YOUTH_LOCALES, YOUTH_STRINGS, YouthLocaleMeta } from "@/lib/youth-i18n";
import { YouthAgeTier } from "@/design-system/tokens";

export interface YouthContextType {
  ageTier: YouthAgeTier;
  setAgeTier: (tier: YouthAgeTier) => void;
  locale: YouthLocale;
  setLocale: (loc: YouthLocale) => void;
  localeMeta: YouthLocaleMeta;
  t: (key: string) => string;
  isLowStimulation: boolean;
  toggleLowStimulation: () => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  isReducedMotion: boolean;
  toggleReducedMotion: () => void;
  fontSize: "normal" | "large" | "extra-large";
  setFontSize: (size: "normal" | "large" | "extra-large") => void;
  isDyslexicFont: boolean;
  toggleDyslexicFont: () => void;
  isAudioMuted: boolean;
  toggleAudioMute: () => void;
}

const YouthContext = createContext<YouthContextType | undefined>(undefined);

export const YouthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ageTier, setAgeTier] = useState<YouthAgeTier>("junior");
  const [locale, setLocale] = useState<YouthLocale>("en");
  const [isLowStimulation, setIsLowStimulation] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "extra-large">("normal");
  const [isDyslexicFont, setIsDyslexicFont] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Load saved preferences if available in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedTier = localStorage.getItem("inneros_youth_tier") as YouthAgeTier;
        if (savedTier) setAgeTier(savedTier);

        const savedLocale = localStorage.getItem("inneros_youth_locale") as YouthLocale;
        if (savedLocale && YOUTH_LOCALES[savedLocale]) setLocale(savedLocale);

        const savedLowStim = localStorage.getItem("inneros_youth_lowstim") === "true";
        setIsLowStimulation(savedLowStim);

        const savedHighContrast = localStorage.getItem("inneros_youth_highcontrast") === "true";
        setIsHighContrast(savedHighContrast);

        const savedReducedMotion = localStorage.getItem("inneros_youth_reducedmotion") === "true";
        setIsReducedMotion(savedReducedMotion);
      } catch (e) {
        // Fallback for SSR or sandboxed storage
      }
    }
  }, []);

  const handleSetAgeTier = (tier: YouthAgeTier) => {
    setAgeTier(tier);
    try {
      localStorage.setItem("inneros_youth_tier", tier);
    } catch (e) {}
  };

  const handleSetLocale = (loc: YouthLocale) => {
    setLocale(loc);
    try {
      localStorage.setItem("inneros_youth_locale", loc);
    } catch (e) {}
  };

  const toggleLowStimulation = () => {
    setIsLowStimulation((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("inneros_youth_lowstim", String(next));
      } catch (e) {}
      return next;
    });
  };

  const toggleHighContrast = () => {
    setIsHighContrast((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("inneros_youth_highcontrast", String(next));
      } catch (e) {}
      return next;
    });
  };

  const toggleReducedMotion = () => {
    setIsReducedMotion((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("inneros_youth_reducedmotion", String(next));
      } catch (e) {}
      return next;
    });
  };

  const toggleDyslexicFont = () => setIsDyslexicFont((prev) => !prev);
  const toggleAudioMute = () => setIsAudioMuted((prev) => !prev);

  const localeMeta = YOUTH_LOCALES[locale] || YOUTH_LOCALES.en;

  const t = (key: string): string => {
    return YOUTH_STRINGS[locale]?.[key] || YOUTH_STRINGS.en[key] || key;
  };

  return (
    <YouthContext.Provider
      value={{
        ageTier,
        setAgeTier: handleSetAgeTier,
        locale,
        setLocale: handleSetLocale,
        localeMeta,
        t,
        isLowStimulation,
        toggleLowStimulation,
        isHighContrast,
        toggleHighContrast,
        isReducedMotion,
        toggleReducedMotion,
        fontSize,
        setFontSize,
        isDyslexicFont,
        toggleDyslexicFont,
        isAudioMuted,
        toggleAudioMute,
      }}
    >
      <div
        dir={localeMeta.dir}
        lang={localeMeta.code}
        className={`transition-colors duration-300 ${
          isLowStimulation ? "low-stimulation-theme" : ""
        } ${isHighContrast ? "high-contrast-theme" : ""} ${
          isReducedMotion ? "reduce-motion-active" : ""
        } ${isDyslexicFont ? "font-dyslexic" : ""}`}
        style={{
          fontFamily: localeMeta.fontFamily,
        }}
      >
        {children}
      </div>
    </YouthContext.Provider>
  );
};

const DEFAULT_YOUTH_CONTEXT: YouthContextType = {
  ageTier: "junior",
  setAgeTier: () => {},
  locale: "en",
  setLocale: () => {},
  localeMeta: YOUTH_LOCALES.en,
  t: (key: string) => YOUTH_STRINGS.en[key] || key,
  isLowStimulation: false,
  toggleLowStimulation: () => {},
  isHighContrast: false,
  toggleHighContrast: () => {},
  isReducedMotion: false,
  toggleReducedMotion: () => {},
  fontSize: "normal",
  setFontSize: () => {},
  isDyslexicFont: false,
  toggleDyslexicFont: () => {},
  isAudioMuted: false,
  toggleAudioMute: () => {},
};

export const useYouth = (): YouthContextType => {
  const context = useContext(YouthContext);
  return context || DEFAULT_YOUTH_CONTEXT;
};
