"use client";

import { useState } from "react";
import { SiteShell } from "./components/site-shell";
import { useSitePreferences } from "./components/site-preferences";

const content = {
  zh: {
    tagline: "在这里写下你想留住的事。",
    bio: "这是一段留给你的简短介绍：你在做什么、关心什么，或最近正在探索什么。没有准备好也没关系，直接把这行替换掉就行。",
    avatar: "头像\n待补",
    writingKicker: "我写的文章",
    articles: "文章",
    categories: "分类：",
    category: "分类待补",
    tags: "标签：",
    tag: "#标签待补",
    moreArticles: "查看所有文章",
    projectKicker: "我做的项目",
    projects: "项目",
    cover: "项目封面待补",
    projectName: "项目名称待补",
    projectDescription: "一句话描述待补",
    moreProjects: "查看所有项目",
    friendsKicker: "我认识的人",
    friends: "友链朋友圈",
    friendsIntro: "这里会收集朋友们最新发布的文章。先把朋友站点和 RSS 补上，它就会慢慢变成一个会更新的小圈子。",
    friendName: "朋友的名字",
    friendDescription: "这是一篇来自朋友博客的文章摘要待补。",
    friendPost: "朋友的最新文章标题",
    friendTime: "刚刚 · 日期待补",
    friendTabs: { subscribed: "订阅", active: "活跃", posts: "日志" },
    friendTabHints: {
      subscribed: "已收录的朋友站点",
      active: "最近有更新的朋友站点",
      posts: "朋友们最新发布的文章",
    },
    friendFooter: "等待第一位朋友的 RSS 更新……",
    visitFriend: "查看原文",
    read: "阅读：",
    posts: [
      ["第一篇文章的标题", "在 content/posts 中新建一篇 Markdown 后，把标题、摘要、日期和封面填到这里。"],
      ["一次项目记录的标题", "可以记录做了什么、碰到什么问题，以及最终留下了什么结论。"],
      ["一个值得回看的想法", "不需要写得很正式。短笔记、清单、复盘和随手记录都可以成为文章。"],
      ["还没有发生的下一篇", "这里是预留位置：等你开始发布内容后，它会替换成真正的文章列表。"],
    ],
    pendingDate: "日期待补",
  },
  en: {
    tagline: "A place for the things you want to keep.",
    bio: "This is your short introduction: what you make, what you care about, or what you are exploring lately. You can replace it whenever you are ready.",
    avatar: "Avatar\npending",
    writingKicker: "WHAT I WRITE",
    articles: "Articles",
    categories: "Categories: ",
    category: "Category pending",
    tags: "Tags: ",
    tag: "#tag-pending",
    moreArticles: "View all articles",
    projectKicker: "WHAT I MAKE",
    projects: "Projects",
    cover: "Project cover pending",
    projectName: "Project name pending",
    projectDescription: "One-line description pending",
    moreProjects: "View all projects",
    friendsKicker: "PEOPLE I KNOW",
    friends: "Friends’ circle",
    friendsIntro: "A stream for your friends’ newest posts. Add their sites and RSS feeds first, then let this little circle update over time.",
    friendName: "Friend name pending",
    friendDescription: "An excerpt from a friend’s latest post goes here.",
    friendPost: "The latest post from this friend",
    friendTime: "Just now · Date pending",
    friendTabs: { subscribed: "Subscribed", active: "Active", posts: "Posts" },
    friendTabHints: {
      subscribed: "Sites collected in your circle",
      active: "Friends with recent updates",
      posts: "The newest posts from friends",
    },
    friendFooter: "Waiting for the first friend RSS update…",
    visitFriend: "Open post",
    read: "Read: ",
    posts: [
      ["The title of your first post", "Create a Markdown file in content/posts, then add its title, excerpt, date, and cover here."],
      ["The record of a project", "Write down what you built, the problems you met, and the conclusions that stayed with you."],
      ["A thought worth revisiting", "It does not have to be formal. Notes, lists, recaps, and quick observations all belong here."],
      ["The next post that has not happened yet", "This is a reserved spot. Once you publish, it will become a real entry in your article list."],
    ],
    pendingDate: "Date pending",
  },
} as const;

const tones = ["sky", "lemon", "violet", "rose"] as const;
const friendModes = ["subscribed", "active", "posts"] as const;
type FriendMode = (typeof friendModes)[number];

function HomeContent() {
  const { language, playTap } = useSitePreferences();
  const [friendMode, setFriendMode] = useState<FriendMode>("subscribed");
  const t = content[language];

  return (
    <>
      <section className="reference-hero">
        <div className="reference-hero-copy">
          <h1>Hi, [{language === "zh" ? "你的名字" : "your name"}]</h1>
          <p className="reference-tagline">{t.tagline}</p>
          <p className="reference-bio">{t.bio}</p>
          <div className="social-row" aria-label={language === "zh" ? "社交链接占位" : "Social link placeholders"}>
            <a href="/archive#rss" aria-label="RSS" onClick={playTap}>◔</a>
            <a href="/about" aria-label="X" onClick={playTap}>𝕏</a>
            <a href="/about" aria-label="GitHub" onClick={playTap}>⌘</a>
            <a href="/about" aria-label="Telegram" onClick={playTap}>➤</a>
            <a href="/about" aria-label={language === "zh" ? "邮箱" : "Email"} onClick={playTap}>✉</a>
          </div>
        </div>
        <div className="avatar-stub" aria-label={t.avatar.replace("\n", " ")}>
          <div className="avatar-stub-grid" />
          <span>{t.avatar.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</span>
        </div>
      </section>

      <section className="reference-section" id="articles">
        <p className="section-kicker">{t.writingKicker}</p>
        <h2>{t.articles}</h2>
        <div className="taxonomy">
          <p>{t.categories}<a href="/writing" onClick={playTap}>{t.category} (0)</a>、<a href="/writing" onClick={playTap}>{t.category} (0)</a>、<a href="/writing" onClick={playTap}>{t.category} (0)</a></p>
          <p>{t.tags}<a href="/writing" onClick={playTap}>{t.tag} (0)</a>、<a href="/writing" onClick={playTap}>{t.tag} (0)</a></p>
        </div>
        <div className="post-list">
          {t.posts.map(([title, excerpt], index) => (
            <article className="post-preview" key={title}>
              <div className="post-copy">
                <h3><a href="/writing" onClick={playTap}>{title}<span aria-hidden="true"> ↗</span></a></h3>
                <p>{excerpt}</p>
                <small>{t.pendingDate} · <a href="/writing" onClick={playTap}>{t.category}</a>{index === 0 ? <> · <a href="/writing" onClick={playTap}>{t.tag}</a></> : null}</small>
              </div>
              <a className={`post-cover post-cover-${tones[index]}`} href="/writing" aria-label={`${t.read}${title}`} onClick={playTap}>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </a>
            </article>
          ))}
        </div>
        <a className="more-link" href="/writing" onClick={playTap}>{t.moreArticles} <span aria-hidden="true">↗</span></a>
      </section>

      <section className="reference-section project-section" id="projects">
        <p className="section-kicker">{t.projectKicker}</p>
        <h2>{t.projects}</h2>
        <div className="project-reference-grid">
          {Array.from({ length: 6 }, (_, index) => (
            <a className="reference-project" href="/projects" key={index} onClick={playTap}>
              <div className={`project-image project-image-${(index % 6) + 1}`}><span>{t.cover}</span></div>
              <h3>{t.projectName} <span aria-hidden="true">↗</span></h3>
              <p>{t.projectDescription}</p>
            </a>
          ))}
        </div>
        <a className="more-link" href="/projects" onClick={playTap}>{t.moreProjects} <span aria-hidden="true">↗</span></a>
      </section>

      <section className="reference-section friend-section" id="friends">
        <p className="section-kicker">{t.friendsKicker}</p>
        <div className="friend-heading">
          <div>
            <h2>{t.friends}</h2>
            <p>{t.friendsIntro}</p>
          </div>
          <span className="friend-count" aria-label={language === "zh" ? "朋友链接占位数量" : "Friend link placeholders"}><i aria-hidden="true" />00</span>
        </div>
        <div className="friend-circle">
          <div className="friend-tabs" role="tablist" aria-label={t.friends}>
            {friendModes.map((mode) => (
              <button className={friendMode === mode ? "is-active" : ""} type="button" role="tab" aria-selected={friendMode === mode} key={mode} onClick={() => { playTap(); setFriendMode(mode); }}>
                <span>{t.friendTabs[mode]}</span><b>00</b>
              </button>
            ))}
            <p>{t.friendTabHints[friendMode]}</p>
          </div>
          <div className="friend-feed" aria-live="polite">
            {Array.from({ length: 4 }, (_, index) => (
              <article className={`friend-feed-item friend-feed-item-${index + 1}`} key={index}>
                <span className="friend-avatar" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div className="friend-feed-copy">
                  <p><strong>{t.friendName}</strong><time>{t.friendTime}</time></p>
                  <h3>{t.friendPost}</h3>
                  <small>{t.friendDescription}</small>
                </div>
                <a className="friend-visit" href="/archive#friends" aria-label={`${t.visitFriend}: ${t.friendPost}`} onClick={playTap}><b aria-hidden="true">↗</b></a>
              </article>
            ))}
          </div>
          <p className="friend-footer"><span aria-hidden="true">~</span>{t.friendFooter}</p>
        </div>
      </section>
    </>
  );
}

export default function Home() {
  return <SiteShell><HomeContent /></SiteShell>;
}
