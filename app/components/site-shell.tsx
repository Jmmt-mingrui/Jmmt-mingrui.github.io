"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useSyncExternalStore, useState } from "react";
import { PreferencesProvider, useSitePreferences } from "./site-preferences";
import { siteConfig } from "../site-config";

const copy = {
  zh: {
    name: siteConfig.title,
    home: "首页",
    dark: "切换深色背景",
    light: "切换浅色背景",
    switchLanguage: "切换语言",
    running: (days: number) => `已运行 ${days} 天`,
    copyright: "版权所有，转载与分享请注明出处",
  },
  en: {
    name: siteConfig.title,
    home: "Home",
    dark: "Switch to dark background",
    light: "Switch to light background",
    switchLanguage: "Switch language",
    running: (days: number) => `Running for ${days} days`,
    copyright: "All rights reserved. Please credit when sharing.",
  },
} as const;

function LanguageIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h7m-3.5-2v2m0 0c0 3-1.5 5.5-4 7m4-7c.9 2.7 2.4 5 4.5 7M13 19c1.1-3.3 2.5-6.4 4.1-9.2a1 1 0 0 1 1.8 0C20.5 12.6 21.9 15.7 23 19m-8-3h6" /></svg>;
}

function ThemeIcon({ night }: { night: boolean }) {
  return night
    ? <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
    : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.7 15.4A8.5 8.5 0 0 1 8.6 3.3 8.5 8.5 0 1 0 20.7 15.4Z" /></svg>;
}

// 顶部背景：左右两个 50vw 的虚线网格块，白色方块 + 虚线分隔（完全按 diygod.cc 的 HTML 结构重建）。
const GRID_ROWS = 6;
const GRID_CELLS = 9;

function GridBlock({ side }: { side: "left" | "right" }) {
  return (
    <div className={`grid-block grid-block-${side}`}>
      <div className="grid-block-mask" aria-hidden="true" />
      <div className="grid-block-cells">
        {Array.from({ length: GRID_ROWS }, (_, row) => (
          <div className="grid-row" key={row}>
            {Array.from({ length: GRID_CELLS }, (_, cell) => <div className="grid-cell" key={cell} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

function GridBackdrop() {
  return (
    <div className="grid-backdrop" aria-hidden="true">
      <GridBlock side="left" />
      <GridBlock side="right" />
    </div>
  );
}

const SITE_BIRTH = new Date(siteConfig.startedAt).getTime();
const DAY_MS = 86_400_000;
const noopSubscribe = () => () => {};

// 运行天数：按天粒度变化，作为外部“时钟”读取，避免在渲染期调用不纯函数。
const runningDaysSnapshot = () => Math.max(1, Math.floor((Date.now() - SITE_BIRTH) / DAY_MS));

function SiteChrome({ children }: { children: ReactNode }) {
  const { language, setLanguage, theme, toggleTheme } = useSitePreferences();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [languageSuggestionOpen, setLanguageSuggestionOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = copy[language];
  const runningDays = useSyncExternalStore(noopSubscribe, runningDaysSnapshot, () => 1);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const browserLanguage = window.navigator.language.toLowerCase();
    const hasLanguageChoice = window.localStorage.getItem("archive-language");
    const suggestionDismissed = window.localStorage.getItem("archive-language-suggestion-dismissed");
    if (!browserLanguage.startsWith("zh") && !hasLanguageChoice && suggestionDismissed !== "true") {
      const frame = window.requestAnimationFrame(() => setLanguageSuggestionOpen(true));
      return () => window.cancelAnimationFrame(frame);
    }
  }, []);
  const chooseLanguage = (nextLanguage: "zh" | "en") => {
    setLanguage(nextLanguage);
    setLanguageMenuOpen(false);
  };

  const acceptEnglishSuggestion = () => {
    chooseLanguage("en");
    setLanguageSuggestionOpen(false);
  };

  const dismissLanguageSuggestion = (forever: boolean) => {
    if (forever) window.localStorage.setItem("archive-language-suggestion-dismissed", "true");
    setLanguageSuggestionOpen(false);
  };

  return (
    <div className="site-frame">
      <GridBackdrop />
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <Link className="wordmark" href="/" aria-label={t.home}>
          <span className="wordmark-dot" aria-hidden="true" />
          {t.name}
        </Link>
        <div className="header-tools">
          <button className="icon-button theme-button" type="button" onClick={toggleTheme} aria-label={theme === "light" ? t.dark : t.light} title={theme === "light" ? t.dark : t.light}>
            <ThemeIcon night={theme === "night"} />
          </button>
          <div className="language-control">
            <button className="language-button" type="button" id="langToggle" aria-haspopup="true" aria-expanded={languageMenuOpen} aria-label={t.switchLanguage} onClick={() => setLanguageMenuOpen((open) => !open)}>
              <LanguageIcon />
              <span className={`language-chevron ${languageMenuOpen ? "is-open" : ""}`} aria-hidden="true">⌄</span>
            </button>
            {languageMenuOpen ? <div className="language-menu" role="menu" aria-label={t.switchLanguage}>
              <button className={language === "zh" ? "is-active" : ""} type="button" role="menuitem" onClick={() => chooseLanguage("zh")}>中文</button>
              <button className={language === "en" ? "is-active" : ""} type="button" role="menuitem" onClick={() => chooseLanguage("en")}>English</button>
            </div> : null}
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="footer-name"><span className="wordmark-dot" aria-hidden="true" /> {t.name}</div>
        <p className="footer-item">{t.running(runningDays)}</p>
        <p className="footer-item">© {new Date().getFullYear()} {siteConfig.name} · {t.copyright}</p>
        <Link className="footer-item" href="/sitemap.xml">Sitemap</Link>
      </footer>
      {languageSuggestionOpen ? (
        <aside className="language-suggestion" role="dialog" aria-modal="true" aria-labelledby="language-suggestion-title">
          <button className="language-suggestion-backdrop" type="button" aria-label="Close" onClick={() => dismissLanguageSuggestion(false)} />
          <div className="language-suggestion-card">
            <h2 id="language-suggestion-title">Switch to English?</h2>
            <p>Your browser is not in Chinese.</p>
            <div>
              <button type="button" onClick={acceptEnglishSuggestion}>Yes</button>
              <button type="button" onClick={() => dismissLanguageSuggestion(false)}>No</button>
              <button type="button" onClick={() => dismissLanguageSuggestion(true)}>Don&apos;t ask again</button>
            </div>
          </div>
        </aside>
      ) : null}
    </div>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return <PreferencesProvider><SiteChrome>{children}</SiteChrome></PreferencesProvider>;
}
