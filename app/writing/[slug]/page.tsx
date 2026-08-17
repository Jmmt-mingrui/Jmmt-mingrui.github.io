import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { SiteShell } from "../../components/site-shell";
import { getPost, getPostCoverUrl, getPosts, resolveImage } from "../../lib/posts";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return (
      <SiteShell>
        <section className="article-page">
          <header className="article-header">
            <p className="eyebrow">WRITING / 文章</p>
            <h1>文章不存在</h1>
            <p className="article-meta">没有找到这篇笔记，它可能已被移动或删除。</p>
            <p><Link href="/writing">返回文章列表 →</Link></p>
          </header>
        </section>
      </SiteShell>
    );
  }

  const cover = getPostCoverUrl(post.slug);

  return (
    <SiteShell>
      <section className="article-page">
        <header className="article-header">
          <p className="eyebrow">WRITING / 文章</p>
          <h1>{post.title}</h1>
          <p className="article-meta">{post.date} · {post.category} · {post.tags.join("、")}</p>
        </header>
        {cover ? <img className="article-cover" src={cover} alt={post.title} /> : null}
        <div className="article-body">
          <ReactMarkdown
            components={{
              img: ({ src, alt }) => <img src={resolveImage(post.slug, src ?? "")} alt={alt ?? ""} loading="lazy" />,
              a: ({ href, children }) => <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}>{children}</a>,
            }}
          >
            {post.body}
          </ReactMarkdown>
        </div>
      </section>
    </SiteShell>
  );
}
