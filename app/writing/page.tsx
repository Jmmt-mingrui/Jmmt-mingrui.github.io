import Link from "next/link";
import { SiteShell } from "../components/site-shell";
import { getPosts } from "../lib/posts";

export default function WritingPage() {
  const posts = getPosts();
  return (
    <SiteShell>
      <section className="inner-hero inner-hero-yellow">
        <p className="eyebrow">WRITING / 文章</p>
        <h1>《趣谈网络协议》云网络篇学习笔记</h1>
        <p>第一个合集：从虚拟网卡到 VXLAN，把云网络的互通、SDN、安全、QoS 与隔离逐一拆开。正文与图片存放在 <code>content/posts/</code>。</p>
      </section>
      <section className="placeholder-list" aria-label="文章列表">
        {posts.map((post) => (
          <article key={post.slug}>
            <span>{post.date}</span>
            <h2><Link href={`/writing/${post.slug}`}>{post.title}<span aria-hidden="true"> ↗</span></Link></h2>
            <p>{post.summary}</p>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
