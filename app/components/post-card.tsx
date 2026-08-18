import Link from "next/link";
import type { PostSummary } from "../lib/posts";

// 全宽贴纸文章卡（对齐参考站 diygod.cc）：标题+箭头、三行摘要、日期·分类·标签、右侧方形缩略图。
export function PostCard({ post, cover }: { post: PostSummary; cover?: string }) {
  return (
    <article className="post-card">
      <div className="post-card-sheet" aria-hidden="true" />
      <div className="post-card-frame" aria-hidden="true" />
      <div className="post-card-inner">
        <div className="post-card-copy">
          <h3 className="post-card-title">
            <Link href={`/writing/${post.slug}`}>{post.title}<span className="post-card-arrow" aria-hidden="true">↗</span></Link>
          </h3>
          <p className="post-card-excerpt">{post.summary}</p>
          <div className="post-card-meta">
            {post.date} · <Link href={`/writing/${post.slug}`}>{post.category}</Link>
            {post.tags.map((tag) => <span key={tag}> · <Link href={`/writing/${post.slug}`}>#{tag}</Link></span>)}
          </div>
        </div>
        {cover ? (
          <Link className="post-card-thumb" href={`/writing/${post.slug}`} aria-label={post.title}>
            <img src={cover} alt="" loading="lazy" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
