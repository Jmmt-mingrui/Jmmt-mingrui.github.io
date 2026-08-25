import { SiteShell } from "../components/site-shell";

const directories: ReadonlyArray<{ path: string; description: string; id?: string }> = [
  { path: "content/posts/", description: "正式文章：技术、随笔、教程、复盘" },
  { path: "content/projects/", description: "项目说明、截图、链接和阶段记录" },
  { path: "content/research/", description: "文献、实验、研究问题和调研" },
  { path: "content/now/", description: "短更新、周记、正在做的事" },
  { path: "content/friends/", description: "朋友站点、简介和 RSS 订阅地址", id: "friends" },
];

export default function ArchivePage() {
  return (
    <SiteShell>
      <section className="archive-page">
        <p className="eyebrow">ARCHIVE / 内容目录</p>
        <h1>内容从 GitHub 出发，在这里汇合。</h1>
        <p className="archive-intro">文章、项目和图片都由仓库里的内容文件生成；提交到主分支后会自动检查并更新站点。</p>
        <div className="directory-list">
          {directories.map(({ path, description, id }) => <article id={id} key={path}><code>{path}</code><p>{description}</p></article>)}
        </div>
        <section className="rss-note" id="rss">
          <span aria-hidden="true">◔</span>
          <div><h2>RSS 订阅</h2><p><a href="/feed">订阅 <code>/feed</code></a>，可在 Folo、Feedly 或 Inoreader 中持续接收新文章。</p></div>
        </section>
        <section className="project-template" id="projects">
          <p className="eyebrow">项目卡模板</p>
          <pre>{`title: 项目名称\nstatus: 进行中 | 已完成 | 归档\nsummary: 用一句话说明它\nlinks: [GitHub, 在线地址]\nreflection: 这次最值得留下的经验`}</pre>
        </section>
      </section>
    </SiteShell>
  );
}
