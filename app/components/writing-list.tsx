"use client";

import { useMemo, useState } from "react";
import { PostCard } from "./post-card";
import { useSitePreferences } from "./site-preferences";
import type { PostSummary } from "../lib/posts";

const copy = {
  zh: {
    title: "文章",
    description: "所有值得留住的念头。目前是《趣谈网络协议》云网络篇学习笔记：从虚拟网卡到 VXLAN，把云网络的互通、SDN、安全、QoS 与隔离逐一拆开。",
    searchPlaceholder: "从文章标题、摘要和标签中查找关键词",
    count: (n: number) => `${n} 篇文章`,
    empty: "没有匹配的文章，换个关键词试试。",
  },
  en: {
    title: "Articles",
    description: "Everything worth keeping. Currently the cloud-network chapters of 《趣谈网络协议》: connectivity, SDN, security, QoS and isolation.",
    searchPlaceholder: "Search titles, summaries and tags",
    count: (n: number) => `${n} articles`,
    empty: "No matching posts. Try another keyword.",
  },
} as const;

export function WritingList({ posts, covers }: { posts: PostSummary[]; covers: Record<string, string> }) {
  const { language } = useSitePreferences();
  const [query, setQuery] = useState("");
  const label = copy[language];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((post) =>
      [post.title, post.summary, post.category, ...post.tags].join(" ").toLowerCase().includes(q),
    );
  }, [posts, query]);

  return (
    <section className="writing-page">
      <h2>{label.title}</h2>
      <p>{label.description}</p>
      <div className="writing-search">
        <label className="sr-only" htmlFor="writing-search-input">{label.searchPlaceholder}</label>
        <input
          id="writing-search-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={label.searchPlaceholder}
        />
        <p className="writing-search-count">{label.count(filtered.length)}</p>
        {filtered.length === 0 ? <p className="writing-search-empty">{label.empty}</p> : null}
      </div>
      <div className="post-list">
        {filtered.map((post) => <PostCard key={post.slug} post={post} cover={covers[post.slug]} />)}
      </div>
    </section>
  );
}
