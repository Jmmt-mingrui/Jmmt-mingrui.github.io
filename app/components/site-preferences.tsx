"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "zh" | "en";
type Theme = "light" | "night";

type Preferences = {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  playTap: () => void;
};

const PreferencesContext = createContext<Preferences | null>(null);

function playTone(kind: "tap" | "theme" | "sound") {
  if (typeof window === "undefined") return;
  const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const now = context.currentTime;
  const notes = kind === "theme" ? [392, 523.25] : kind === "sound" ? [659.25, 523.25] : [523.25];

  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = now + index * 0.055;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.08, start + 0.1);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.035, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.18);
  });

  window.setTimeout(() => void context.close(), 350);
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("zh");
  const [theme, setTheme] = useState<Theme>("light");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("archive-language");
    const savedTheme = window.localStorage.getItem("archive-theme");
    const savedSound = window.localStorage.getItem("archive-sound");
    if (savedLanguage === "zh" || savedLanguage === "en") setLanguageState(savedLanguage);
    if (savedTheme === "light" || savedTheme === "night") setTheme(savedTheme);
    if (savedSound === "on" || savedSound === "off") setSoundEnabled(savedSound === "on");
    setPreferencesLoaded(true);
  }, []);

  useEffect(() => {
    if (!preferencesLoaded) return;
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    window.localStorage.setItem("archive-language", language);
  }, [language, preferencesLoaded]);

  useEffect(() => {
    if (!preferencesLoaded) return;
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("archive-theme", theme);
  }, [preferencesLoaded, theme]);

  useEffect(() => {
    if (!preferencesLoaded) return;
    window.localStorage.setItem("archive-sound", soundEnabled ? "on" : "off");
  }, [preferencesLoaded, soundEnabled]);

  const value = useMemo<Preferences>(() => ({
    language,
    setLanguage: (nextLanguage) => {
      if (soundEnabled) playTone("tap");
      setLanguageState(nextLanguage);
    },
    theme,
    toggleTheme: () => {
      if (soundEnabled) playTone("theme");
      const nextTheme = theme === "light" ? "night" : "light";
      const transitionDocument = document as Document & { startViewTransition?: (update: () => void) => void };
      if (transitionDocument.startViewTransition) transitionDocument.startViewTransition(() => setTheme(nextTheme));
      else setTheme(nextTheme);
    },
    soundEnabled,
    toggleSound: () => {
      playTone("sound");
      setSoundEnabled((enabled) => !enabled);
    },
    playTap: () => { if (soundEnabled) playTone("tap"); },
  }), [language, soundEnabled, theme]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function useSitePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("useSitePreferences must be used inside PreferencesProvider");
  return context;
}
