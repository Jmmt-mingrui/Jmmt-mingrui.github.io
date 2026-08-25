import type { Metadata } from "next";
import Link from "next/link";
import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { SiteShell } from "../../components/site-shell";
import { getPost, getPostCovers, getPosts, resolveImage } from "../../lib/posts";
import { getRequestOrigin } from "../../lib/request-url";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

function plainText(children: ReactNode): string {
  return Children.toArray(children).map((child) => {
    if (typeof child === "string" || typeof child === "number") return String(child);
    if (isValidElement<{ children?: ReactNode }>(child)) return plainText(child.props.children);
    return "";
  }).join("");
}

function headingId(line: number | undefined) {
  return `section-${line ?? 0}`;
}

function getTableOfContents(body: string) {
  return body.split(/\r?\n/).flatMap((line, index) => {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) return [];
    return [{
      depth: match[1].length,
      id: headingId(index + 1),
      label: match[2].replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`~]/g, ""),
    }];
  });
}

function formatChineseDate(date: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  return match ? `${match[1]}年${Number(match[2])}月${Number(match[3])}日` : date;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "文章不存在", robots: { index: false, follow: false } };
  const origin = await getRequestOrigin();
  const cover = getPostCovers()[slug];
  const image = cover ? new URL(cover, origin).href : undefined;
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/writing/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: `${post.date}T00:00:00+08:00`,
      tags: post.tags,
      images: image ? [image] : [],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: post.title,
      description: post.summary,
      images: image ? [image] : [],
    },
  };
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

  const tableOfContents = getTableOfContents(post.body);

  return (
    <SiteShell>
      <section className="article-page">
        <header className="article-header">
          <h1>{post.title}</h1>
          <p className="article-meta">{formatChineseDate(post.date)} · <Link href={`/writing?category=${encodeURIComponent(post.category)}`}>{post.category}</Link>{post.tags.map((tag) => <span key={tag}> · <Link href={`/writing?tag=${encodeURIComponent(tag)}`}>#{tag}</Link></span>)}</p>
        </header>
        {tableOfContents.length ? (
          <details className="article-toc">
            <summary><span>目录</span><small>展开</small></summary>
            <nav aria-label="文章目录">
              {tableOfContents.map((item) => (
                <a className={item.depth === 3 ? "is-subsection" : undefined} href={`#${item.id}`} key={`${item.id}-${item.label}`}>{item.label}</a>
              ))}
            </nav>
          </details>
        ) : null}
        <div className="article-body">
          <ReactMarkdown
            components={{
              h2: ({ children, node }) => <h2 id={headingId(node?.position?.start.line)}>{plainText(children)}</h2>,
              h3: ({ children, node }) => <h3 id={headingId(node?.position?.start.line)}>{plainText(children)}</h3>,
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
