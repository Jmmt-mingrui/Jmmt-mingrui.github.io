"use client";

import Link from "next/link";
import { Fragment } from "react";
import { PostCard } from "./post-card";
import { ProjectCard } from "./project-card";
import { ScrollReveal } from "./scroll-reveal";
import { useSitePreferences } from "./site-preferences";
import type { PostSummary } from "../lib/posts";
import { projects } from "../lib/projects";
import { siteConfig } from "../site-config";

const content = {
  zh: {
    tagline: "在这里写下你想留住的事。",
    bio: "这是一段留给你的简短介绍：你在做什么、关心什么，或最近正在探索什么。没有准备好也没关系，直接把这行替换掉就行。",
    writingKicker: "我写的文章",
    articles: "文章",
    categories: "分类：",
    tags: "标签：",
    moreArticles: "查看所有文章",
    collectionIntro: "《趣谈网络协议》云网络篇学习笔记：从虚拟网卡到 VXLAN，把云网络的四件大事（互通、SDN、安全、QoS、隔离）逐一拆开。",
    projectKicker: "我做的项目",
    projects: "项目",
    moreProjects: "查看所有项目",
  },
  en: {
    tagline: "A place for the things you want to keep.",
    bio: "This is your short introduction: what you make, what you care about, or what you are exploring lately. You can replace it whenever you are ready.",
    writingKicker: "WHAT I WRITE",
    articles: "Articles",
    categories: "Categories: ",
    tags: "Tags: ",
    moreArticles: "View all articles",
    collectionIntro: "Study notes for the cloud-network chapters of 《趣谈网络协议》: from virtual NICs to VXLAN, unpacking connectivity, SDN, security, QoS and isolation one by one.",
    projectKicker: "WHAT I MAKE",
    projects: "Projects",
    moreProjects: "View all projects",
  },
} as const;

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

function DividerBadge({ label }: { label: string }) {
  return (
    <div className="section-divider" role="presentation">
      <span className="section-divider-line" aria-hidden="true" />
      <span className="section-divider-badge">
        {label}
        <span className="section-divider-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" /></svg>
        </span>
      </span>
    </div>
  );
}

interface HomeContentProps {
  posts: PostSummary[];
  covers: Record<string, string>;
  categories: Array<[string, number]>;
  tags: Array<[string, number]>;
}

export function HomeContent({ posts, covers, categories, tags }: HomeContentProps) {
  const { language } = useSitePreferences();
  const t = content[language];

  return (
    <>
      <section className="reference-hero">
        <div className="reference-hero-copy">
          <h1>{siteConfig.title}</h1>
          <p className="reference-tagline">{t.tagline}</p>
          <p className="reference-bio">{t.bio}</p>
          <div className="social-row" aria-label="社交链接">
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><GitHubIcon /></a>
          </div>
        </div>
        <img className="avatar-image" src={siteConfig.avatar} alt={siteConfig.name} width={460} height={460} />
      </section>

      <ScrollReveal>
        <DividerBadge label={t.writingKicker} />
        <section className="reference-section" id="articles">
          <h2>{t.articles}</h2>
          <p className="collection-intro">{t.collectionIntro}</p>
          <div className="taxonomy">
            <p>{t.categories}{categories.map(([name, count], i) => (
              <Fragment key={name}>{i > 0 ? "、" : null}<Link href={`/writing?category=${encodeURIComponent(name)}`}>{name} ({count})</Link></Fragment>
            ))}</p>
            <p>{t.tags}{tags.map(([name, count], i) => (
              <Fragment key={name}>{i > 0 ? "、" : null}<Link href={`/writing?tag=${encodeURIComponent(name)}`}>#{name} ({count})</Link></Fragment>
            ))}</p>
          </div>
          <div className="post-list">
            {posts.map((post) => <PostCard key={post.slug} post={post} cover={covers[post.slug]} language={language} />)}
          </div>
          <div className="more-link-row">
            <Link className="more-link" href="/writing">{t.moreArticles}</Link>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={60}>
        <DividerBadge label={t.projectKicker} />
        <section className="reference-section project-section" id="projects">
          <h2>{t.projects}</h2>
          <div className="project-reference-grid">
            {projects.map((project) => <ProjectCard key={project.key} project={project} />)}
          </div>
          <div className="more-link-row">
            <Link className="more-link" href="/projects">{t.moreProjects}</Link>
          </div>
        </section>
      </ScrollReveal>

    </>
  );
}
