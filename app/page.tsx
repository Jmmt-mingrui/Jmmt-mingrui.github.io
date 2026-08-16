"use client";

import { SiteShell } from "./components/site-shell";
import { useSitePreferences } from "./components/site-preferences";

const content = {
  zh: {
    eyebrow: "你好，今天也来留下一点什么。",
    title: ["[你的名字]", "的小小生活站"],
    intro: "这里不是履历，也不急着证明什么。它收集正在发生的事、还没想明白的念头，以及以后回头看会觉得有趣的碎片。",
    note: "把这段换成你的自我介绍，或者留空，先从第一篇文章开始。",
    now: "现在进行时",
    nowDate: "日期待补",
    nowItems: [
      ["在看", "一部电影 / 一个频道 / 一段风景", "content/watching"],
      ["在读", "一本书 / 一篇长文 / 一个新问题", "content/reading"],
      ["正在做", "一个项目 / 一次尝试 / 一个小练习", "content/now"],
    ],
    writingKicker: "最近文章",
    articles: "写下来的东西",
    articleNote: "文章都从 content/posts 开始。先随意记录，目录会慢慢变成自己的索引。",
    featuredLabel: "置顶 · 等待第一篇",
    featuredTitle: "把第一个值得留下的瞬间，写在这里",
    featuredText: "可以是一段近况、一场旅行、一次失败后的复盘，或只是今天突然想明白的一件小事。",
    writeFirst: "去写第一篇",
    allArticles: "查看全部文章",
    articleRows: [
      ["01", "下一篇文章的标题", "一句话摘要待补", "日期待补"],
      ["02", "一次项目记录的标题", "做了什么、为什么做、最后学到了什么。", "日期待补"],
      ["03", "一个值得回看的想法", "短笔记和随手记录也很重要。", "日期待补"],
    ],
    projectKicker: "最近制作",
    projects: "正在长出来的项目",
    projectText: "不必等到项目完成才放上来。草稿、实验和失败的版本，都值得占一个位置。",
    projectLabels: ["一个网页实验", "一个长期项目", "一个小工具"],
    projectDescriptions: ["封面和说明待补", "先写下它解决的问题", "可以从一行想法开始"],
    allProjects: "进入项目页",
    friendKicker: "朋友动态",
    friends: "朋友们最近在做什么？",
    friendsText: "这里以后可以接入朋友博客的 RSS：不是冷冰冰的链接墙，而是一条会缓慢更新的小小动态流。",
    subscribe: "订阅",
    active: "活跃",
    updates: "动态",
    friendRows: [
      ["朋友站点待补", "等待第一位朋友的 RSS", "添加链接后，这里会显示对方的最新文章。"],
      ["小圈子待补", "下一条动态还没出现", "朋友的头像、文章标题和更新时间会留在这里。"],
      ["你的第一位朋友", "等待被收录", "可以先只填名称和网址，RSS 以后再接。"],
    ],
    manageFriends: "去补充朋友链接",
    archiveHint: "从这里开始，慢慢把生活存下来。",
  },
  en: {
    eyebrow: "Hello. Leave a small trace of today.",
    title: ["[your name]", "’s little life archive"],
    intro: "This is not a résumé and it does not need to prove anything. It keeps what is happening, thoughts still in progress, and fragments that may become meaningful later.",
    note: "Replace this with your introduction — or leave it blank and start with the first post.",
    now: "NOW",
    nowDate: "Date pending",
    nowItems: [
      ["Watching", "A film / a channel / a view", "content/watching"],
      ["Reading", "A book / a long read / a new question", "content/reading"],
      ["Making", "A project / an experiment / a tiny practice", "content/now"],
    ],
    writingKicker: "RECENT WRITING",
    articles: "Things worth writing down",
    articleNote: "Every post begins in content/posts. Start loosely; the folder will slowly become your own index.",
    featuredLabel: "PINNED · WAITING FOR THE FIRST POST",
    featuredTitle: "Put the first moment you want to keep here",
    featuredText: "It could be an update, a trip, a lesson from getting something wrong, or simply a thought that arrived today.",
    writeFirst: "Write the first post",
    allArticles: "See all articles",
    articleRows: [
      ["01", "The title of your next post", "A short summary pending", "Date pending"],
      ["02", "The record of a project", "What you made, why, and what stayed with you.", "Date pending"],
      ["03", "A thought worth revisiting", "Short notes and small observations count, too.", "Date pending"],
    ],
    projectKicker: "RECENT MAKING",
    projects: "Projects still growing",
    projectText: "A project does not need to be finished before it belongs here. Drafts, experiments, and failed versions deserve a place too.",
    projectLabels: ["A web experiment", "A long-term project", "A small utility"],
    projectDescriptions: ["Cover and description pending", "Start with the problem it solves", "One line of an idea is enough"],
    allProjects: "Visit projects",
    friendKicker: "FRIEND ACTIVITY",
    friends: "What are friends making lately?",
    friendsText: "This can later connect to your friends’ RSS feeds: not a frozen wall of links, but a small, gently moving stream of updates.",
    subscribe: "Subscribed",
    active: "Active",
    updates: "Updates",
    friendRows: [
      ["Friend site pending", "Waiting for the first friend RSS", "Once you add a link, their latest post can appear here."],
      ["Circle pending", "The next update has not arrived", "A friend’s avatar, post title, and time will live here."],
      ["Your first friend", "Waiting to be collected", "Start with a name and URL; RSS can come later."],
    ],
    manageFriends: "Add friend links",
    archiveHint: "Start here, and slowly save a life.",
  },
} as const;

const nowTones = ["sun", "sky", "berry"] as const;
const projectTones = ["coral", "blue", "lime"] as const;

function Arrow() {
  return <span className="arrow" aria-hidden="true">↗</span>;
}

function HomeContent() {
  const { language, playTap } = useSitePreferences();
  const t = content[language];

  return (
    <>
      <section className="garden-intro">
        <div className="intro-copy">
          <p className="intro-eyebrow"><span className="status-dot" aria-hidden="true" />{t.eyebrow}</p>
          <h1>{t.title.map((line) => <span key={line}>{line}</span>)}</h1>
          <p className="intro-lead">{t.intro}</p>
          <p className="intro-note">{t.note}</p>
          <div className="intro-links" aria-label={language === "zh" ? "社交链接占位" : "Social link placeholders"}>
            <a href="/archive#rss" onClick={playTap}>RSS <Arrow /></a>
            <a href="/about" onClick={playTap}>GitHub <Arrow /></a>
            <a href="/about" onClick={playTap}>{language === "zh" ? "联系我" : "Contact"} <Arrow /></a>
          </div>
        </div>
        <aside className="intro-orbit" aria-label={t.now}>
          <div className="orbit-tape">NOW · NOW · NOW · NOW ·</div>
          <div className="orbit-sun" aria-hidden="true"><span /></div>
          <div className="orbit-note"><b>{t.now}</b><span>{t.nowDate}</span></div>
          <div className="orbit-sticker" aria-hidden="true">✳</div>
        </aside>
      </section>

      <section className="now-section" aria-labelledby="now-title">
        <div className="section-topline">
          <p className="section-kicker">01 / {t.now}</p>
          <p>{t.archiveHint}</p>
        </div>
        <div className="now-grid">
          {t.nowItems.map(([title, description, folder], index) => (
            <a className={`now-card now-card-${nowTones[index]}`} href="/about" key={title} onClick={playTap}>
              <span className="now-index">0{index + 1}</span>
              <div><p>{title}</p><h2>{description}</h2></div>
              <small>{folder} <Arrow /></small>
            </a>
          ))}
        </div>
      </section>

      <section className="story-section" id="articles">
        <div className="section-heading">
          <div><p className="section-kicker">02 / {t.writingKicker}</p><h2>{t.articles}</h2></div>
          <p>{t.articleNote}</p>
        </div>
        <div className="story-layout">
          <article className="featured-story">
            <div className="feature-visual" aria-hidden="true"><span>01</span><i /><b /></div>
            <div className="feature-copy">
              <p>{t.featuredLabel}</p>
              <h3>{t.featuredTitle}</h3>
              <div><span>{t.featuredText}</span><a href="/writing" onClick={playTap}>{t.writeFirst} <Arrow /></a></div>
            </div>
          </article>
          <div className="story-rail">
            {t.articleRows.map(([number, title, excerpt, date]) => (
              <a className="story-row" href="/writing" key={number} onClick={playTap}>
                <span>{number}</span>
                <div><h3>{title}</h3><p>{excerpt}</p></div>
                <small>{date}<Arrow /></small>
              </a>
            ))}
            <a className="text-link" href="/writing" onClick={playTap}>{t.allArticles} <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="making-section" id="projects">
        <div className="section-heading">
          <div><p className="section-kicker">03 / {t.projectKicker}</p><h2>{t.projects}</h2></div>
          <p>{t.projectText}</p>
        </div>
        <div className="making-grid">
          {t.projectLabels.map((name, index) => (
            <a className={`making-card making-card-${projectTones[index]}`} href="/projects" key={name} onClick={playTap}>
              <div className="making-art" aria-hidden="true"><i /><b /><span>{String(index + 1).padStart(2, "0")}</span></div>
              <p>PROJECT / 0{index + 1}</p>
              <h3>{name} <Arrow /></h3>
              <small>{t.projectDescriptions[index]}</small>
            </a>
          ))}
        </div>
        <a className="text-link project-more" href="/projects" onClick={playTap}>{t.allProjects} <Arrow /></a>
      </section>

      <section className="friends-stream" id="friends">
        <div className="friend-banner">
          <div><p className="section-kicker">04 / {t.friendKicker}</p><h2>{t.friends}</h2><p>{t.friendsText}</p></div>
          <div className="friend-stats" aria-label={t.friendKicker}>
            <span><b>00</b>{t.subscribe}</span><span><b>00</b>{t.active}</span><span><b>00</b>{t.updates}</span>
          </div>
        </div>
        <div className="friend-stream-list">
          {t.friendRows.map(([name, title, text], index) => (
            <article className="friend-update" key={name}>
              <span className={`stream-avatar stream-avatar-${index + 1}`} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div className="stream-copy"><p>{name}<span> · RSS pending</span></p><h3>{title}</h3><small>{text}</small></div>
              <span className="stream-time">--:--</span>
            </article>
          ))}
        </div>
        <a className="text-link friend-more" href="/archive#friends" onClick={playTap}>{t.manageFriends} <Arrow /></a>
      </section>
    </>
  );
}

export default function Home() {
  return <SiteShell><HomeContent /></SiteShell>;
}
