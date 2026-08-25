import { SiteShell } from "../components/site-shell";
import { WritingList } from "../components/writing-list";
import { getPostCovers, getSearchablePostSummaries } from "../lib/posts";

export default async function WritingPage({ searchParams }: { searchParams: Promise<{ category?: string; tag?: string }> }) {
  const { category, tag } = await searchParams;
  const posts = getSearchablePostSummaries().filter((post) =>
    (!category || post.category === category) && (!tag || post.tags.includes(tag)),
  );
  return (
    <SiteShell>
      <WritingList posts={posts} covers={getPostCovers()} activeFilter={category ? `分类：${category}` : tag ? `#${tag}` : undefined} />
    </SiteShell>
  );
}
