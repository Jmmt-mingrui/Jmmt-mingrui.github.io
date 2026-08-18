import { SiteShell } from "../components/site-shell";
import { PostCard } from "../components/post-card";
import { getPostCovers, getPosts } from "../lib/posts";

export default function WritingPage() {
  const posts = getPosts();
  const covers = getPostCovers();
  return (
    <SiteShell>
      <section className="inner-hero inner-hero-yellow">
        <p className="eyebrow">WRITING / 文章</p>
        <h1>所有值得留住的念头</h1>
        <p>目前是《趣谈网络协议》云网络篇学习笔记：从虚拟网卡到 VXLAN，把云网络的互通、SDN、安全、QoS 与隔离逐一拆开。</p>
      </section>
      <section className="writing-list" aria-label="文章列表">
        <div className="post-list">
          {posts.map((post) => (
            <PostCard key={post.slug} post={{ slug: post.slug, title: post.title, date: post.date, category: post.category, tags: post.tags, summary: post.summary }} cover={covers[post.slug]} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
