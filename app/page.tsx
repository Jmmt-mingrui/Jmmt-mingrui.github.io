import { SiteShell } from "./components/site-shell";
import { HomeContent } from "./components/home-content";
import { getPostCovers, getPostSummaries } from "./lib/posts";

// 首页为服务端组件：文章摘要、封面与分类/标签计数都来自 content/posts/*.md，
// 客户端组件通过 props 接收，避免把 markdown 正文打进客户端 bundle。
export default function Home() {
  const posts = getPostSummaries();

  const categoryCounts = new Map<string, number>();
  const tagCounts = new Map<string, number>();
  for (const post of posts) {
    categoryCounts.set(post.category, (categoryCounts.get(post.category) ?? 0) + 1);
    for (const tag of post.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  return (
    <SiteShell>
      <HomeContent
        posts={posts}
        covers={getPostCovers()}
        categories={[...categoryCounts.entries()]}
        tags={[...tagCounts.entries()]}
      />
    </SiteShell>
  );
}
