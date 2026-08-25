"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PostCard } from "./post-card";
import { useSitePreferences } from "./site-preferences";
import type { SearchablePostSummary } from "../lib/posts";

const copy = {
  zh: {
    title: "文章",
    searchLabel: "搜索关键词",
    searchPlaceholder: "从文章标题和内容中查找关键词",
    count: (n: number) => `${n} 篇文章`,
    empty: "没有匹配的文章，换个关键词试试。",
  },
  en: {
    title: "Articles",
    searchLabel: "Search keywords",
    searchPlaceholder: "Search article titles and content",
    count: (n: number) => `${n} articles`,
    empty: "No matching posts. Try another keyword.",
  },
} as const;

export function WritingList({ posts, covers, activeFilter }: { posts: SearchablePostSummary[]; covers: Record<string, string>; activeFilter?: string }) {
  const { language } = useSitePreferences();
  const [query, setQuery] = useState("");
  const label = copy[language];

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(language === "zh" ? "zh-CN" : "en");
    if (!normalizedQuery) return posts;
    return posts.filter((post) =>
      [post.title, post.summary, post.category, ...post.tags, post.searchText]
        .join(" ")
        .toLocaleLowerCase(language === "zh" ? "zh-CN" : "en")
        .includes(normalizedQuery),
    );
  }, [language, posts, query]);

  return (
    <section className="writing-page">
      <h2>{label.title}</h2>
      {activeFilter ? <p className="writing-active-filter"><span>{activeFilter}</span><Link href="/writing">清除筛选 ×</Link></p> : null}
      <div className="writing-search">
        <label htmlFor="writing-search-input">{label.searchLabel}</label>
        <input
          id="writing-search-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={label.searchPlaceholder}
          autoComplete="off"
        />
        <p className="writing-search-count" aria-live="polite">{label.count(filtered.length)}</p>
        {filtered.length === 0 ? <p className="writing-search-empty">{label.empty}</p> : null}
      </div>
      <div className="post-list">
        {filtered.map((post) => <PostCard key={post.slug} post={post} cover={covers[post.slug]} language={language} />)}
      </div>
    </section>
  );
}
