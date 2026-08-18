"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "zh" | "en";
type Theme = "light" | "night";

type Preferences = {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
};

const PreferencesContext = createContext<Preferences | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("zh");
  const [theme, setTheme] = useState<Theme>("light");
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("archive-language");
    const savedTheme = window.localStorage.getItem("archive-theme");

    const restorePreferences = window.requestAnimationFrame(() => {
      if (savedLanguage === "zh" || savedLanguage === "en") setLanguageState(savedLanguage);
      if (savedTheme === "light" || savedTheme === "night") setTheme(savedTheme);
      setPreferencesLoaded(true);
    });

    return () => window.cancelAnimationFrame(restorePreferences);
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

  const value = useMemo<Preferences>(() => ({
    language,
    setLanguage: (nextLanguage) => setLanguageState(nextLanguage),
    theme,
    toggleTheme: () => {
      const nextTheme = theme === "light" ? "night" : "light";
      const transitionDocument = document as Document & { startViewTransition?: (update: () => void) => void };
      if (transitionDocument.startViewTransition) transitionDocument.startViewTransition(() => setTheme(nextTheme));
      else setTheme(nextTheme);
    },
  }), [language, theme]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function useSitePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("useSitePreferences must be used inside PreferencesProvider");
  return context;
}
