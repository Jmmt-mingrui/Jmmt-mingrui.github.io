"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { PreferencesProvider, useSitePreferences } from "./site-preferences";

const copy = {
  zh: {
    name: "Hi, [你的名字]",
    home: "首页",
    articles: "文章",
    projects: "项目",
    about: "关于",
    soundOn: "关闭音效",
    soundOff: "开启音效",
    dark: "切换深色背景",
    light: "切换浅色背景",
    switchLanguage: "切换语言",
    running: "站点已运行：从你发布第一篇文章那天开始计算",
    copyright: "内容与版权声明待补",
  },
  en: {
    name: "Hi, [your name]",
    home: "Home",
    articles: "Articles",
    projects: "Projects",
    about: "About",
    soundOn: "Disable sounds",
    soundOff: "Enable sounds",
    dark: "Switch to dark background",
    light: "Switch to light background",
    switchLanguage: "Switch language",
    running: "Running since your first published post",
    copyright: "Content and copyright notice pending",
  },
} as const;

function LanguageIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h7m-3.5-2v2m0 0c0 3-1.5 5.5-4 7m4-7c.9 2.7 2.4 5 4.5 7M13 19c1.1-3.3 2.5-6.4 4.1-9.2a1 1 0 0 1 1.8 0C20.5 12.6 21.9 15.7 23 19m-8-3h6" /></svg>;
}

function SoundIcon({ muted }: { muted: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z" />{muted ? <path d="m16 9 5 5m0-5-5 5" /> : <><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18 6a8.5 8.5 0 0 1 0 12" /></>}</svg>;
}

function ThemeIcon({ night }: { night: boolean }) {
  return night
    ? <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
    : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.7 15.4A8.5 8.5 0 0 1 8.6 3.3 8.5 8.5 0 1 0 20.7 15.4Z" /></svg>;
}

function SiteChrome({ children }: { children: ReactNode }) {
  const { language, setLanguage, theme, toggleTheme, soundEnabled, toggleSound, playTap } = useSitePreferences();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const t = copy[language];
  const navigation = [
    [t.home, "/"],
    [t.articles, "/writing"],
    [t.projects, "/projects"],
    [t.about, "/about"],
  ] as const;

  const chooseLanguage = (nextLanguage: "zh" | "en") => {
    setLanguage(nextLanguage);
    setLanguageMenuOpen(false);
  };

  return (
    <div className="site-frame">
      <div className="ambient-backdrop" aria-hidden="true" />
      <header className="site-header">
        <a className="wordmark" href="/" aria-label={t.home} onClick={playTap}>
          <span className="wordmark-dot" aria-hidden="true" />
          {t.name}
        </a>
        <nav aria-label={language === "zh" ? "主导航" : "Main navigation"}>
          {navigation.map(([label, href]) => <a href={href} key={href} onClick={playTap}>{label}</a>)}
        </nav>
        <div className="header-tools">
          <button className="icon-button sound-button" type="button" onClick={toggleSound} aria-label={soundEnabled ? t.soundOn : t.soundOff} title={soundEnabled ? t.soundOn : t.soundOff}>
            <SoundIcon muted={!soundEnabled} />
          </button>
          <button className="icon-button theme-button" type="button" onClick={toggleTheme} aria-label={theme === "light" ? t.dark : t.light} title={theme === "light" ? t.dark : t.light}>
            <ThemeIcon night={theme === "night"} />
          </button>
          <div className="language-control">
            <button className="language-button" type="button" id="langToggle" aria-haspopup="true" aria-expanded={languageMenuOpen} aria-label={t.switchLanguage} onClick={() => { playTap(); setLanguageMenuOpen((open) => !open); }}>
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
        <p>{t.running}</p>
        <p>© {new Date().getFullYear()} {language === "zh" ? "[你的名字]" : "[your name]"} · {t.copyright}</p>
        <a href="/archive" onClick={playTap}>Sitemap</a>
      </footer>
    </div>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return <PreferencesProvider><SiteChrome>{children}</SiteChrome></PreferencesProvider>;
}
