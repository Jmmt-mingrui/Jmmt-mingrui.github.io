import { SiteShell } from "../components/site-shell";

export default function WritingPage() {
  return (
    <SiteShell>
      <section className="inner-hero inner-hero-yellow">
        <p className="eyebrow">WRITING / 文章</p>
        <h1>所有值得留住的念头，都从一篇小文章开始。</h1>
        <p>把 Markdown 文件放进 <code>content/posts/</code>。首篇文章写好后，把它的标题、日期、摘要和标签填到这里。</p>
      </section>
      <section className="placeholder-list" aria-label="文章占位列表">
        <article><span>未发布</span><h2>第一篇文章</h2><p>用它写一个你最近真正想弄明白的问题。</p></article>
        <article><span>未发布</span><h2>一次踩坑记录</h2><p>把背景、过程、结论和你下次会怎么做写清楚。</p></article>
        <article><span>未发布</span><h2>一份长期笔记</h2><p>允许它不完整，之后不断补充和修正。</p></article>
      </section>
    </SiteShell>
  );
}
