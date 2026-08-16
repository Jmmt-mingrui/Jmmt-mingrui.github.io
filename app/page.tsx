import { SiteShell } from "./components/site-shell";

const posts = [
  { title: "第一篇文章的标题", excerpt: "在 content/posts 中新建一篇 Markdown 后，把标题、摘要、日期和封面填到这里。", date: "日期待补", category: "分类待补", tone: "sky" },
  { title: "一次项目记录的标题", excerpt: "可以记录做了什么、碰到什么问题，以及最终留下了什么结论。", date: "日期待补", category: "分类待补", tone: "lemon" },
  { title: "一个值得回看的想法", excerpt: "不需要写得很正式。短笔记、清单、复盘和随手记录都可以成为文章。", date: "日期待补", category: "分类待补", tone: "violet" },
  { title: "还没有发生的下一篇", excerpt: "这里是预留位置：等你开始发布内容后，它会替换成真正的文章列表。", date: "日期待补", category: "分类待补", tone: "rose" },
];

const projects = ["项目名称待补", "项目名称待补", "项目名称待补", "项目名称待补", "项目名称待补", "项目名称待补"];

export default function Home() {
  return (
    <SiteShell>
      <section className="reference-hero">
        <div className="reference-hero-copy">
          <h1>Hi, [你的名字]</h1>
          <p className="reference-tagline">在这里写下你想留住的事。</p>
          <p className="reference-bio">
            这是一段留给你的简短介绍：你在做什么、关心什么，或最近正在探索什么。没有准备好也没关系，直接把这行替换掉就行。
          </p>
          <div className="social-row" aria-label="社交链接占位">
            <a href="/archive#rss" aria-label="RSS 占位">◔</a>
            <a href="/about" aria-label="社交链接占位">𝕏</a>
            <a href="/about" aria-label="GitHub 占位">⌘</a>
            <a href="/about" aria-label="Telegram 占位">➤</a>
            <a href="/about" aria-label="邮箱占位">✉</a>
          </div>
        </div>
        <div className="avatar-stub" aria-label="头像待补">
          <div className="avatar-stub-grid" />
          <span>头像<br />待补</span>
        </div>
      </section>

      <section className="reference-section" id="articles">
        <p className="section-kicker">我写的文章</p>
        <h2>文章</h2>
        <div className="taxonomy">
          <p>分类：<a href="/writing">分类待补 (0)</a>、<a href="/writing">分类待补 (0)</a>、<a href="/writing">分类待补 (0)</a></p>
          <p>标签：<a href="/writing">#标签待补 (0)</a>、<a href="/writing">#标签待补 (0)</a></p>
        </div>
        <div className="post-list">
          {posts.map((post, index) => (
            <article className="post-preview" key={post.title}>
              <div className="post-copy">
                <h3><a href="/writing">{post.title}<span aria-hidden="true"> ↗</span></a></h3>
                <p>{post.excerpt}</p>
                <small>{post.date} · <a href="/writing">{post.category}</a>{index === 0 ? <> · <a href="/writing">#标签待补</a></> : null}</small>
              </div>
              <a className={`post-cover post-cover-${post.tone}`} href="/writing" aria-label={`阅读：${post.title}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </a>
            </article>
          ))}
        </div>
        <a className="more-link" href="/writing">查看所有文章 <span aria-hidden="true">↗</span></a>
      </section>

      <section className="reference-section project-section" id="projects">
        <p className="section-kicker">我做的项目</p>
        <h2>项目</h2>
        <div className="project-reference-grid">
          {projects.map((name, index) => (
            <a className="reference-project" href="/projects" key={`${name}-${index}`}>
              <div className={`project-image project-image-${(index % 6) + 1}`}><span>项目封面待补</span></div>
              <h3>{name} <span aria-hidden="true">↗</span></h3>
              <p>一句话描述待补</p>
            </a>
          ))}
        </div>
        <a className="more-link" href="/projects">查看所有项目 <span aria-hidden="true">↗</span></a>
      </section>
    </SiteShell>
  );
}
