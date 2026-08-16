import { SiteShell } from "../components/site-shell";

const directories = [
  ["content/posts/", "正式文章：技术、随笔、教程、复盘"],
  ["content/projects/", "项目说明、截图、链接和阶段记录"],
  ["content/research/", "文献、实验、研究问题和调研"],
  ["content/now/", "短更新、周记、正在做的事"],
];

export default function ArchivePage() {
  return (
    <SiteShell>
      <section className="archive-page">
        <p className="eyebrow">ARCHIVE / 使用说明</p>
        <h1>一个空站点，最好的开始方式。</h1>
        <p className="archive-intro">先按下面的目录把内容放进去。现在页面显示的是占位内容，后续只要把真实数据接进来即可。</p>
        <div className="directory-list">
          {directories.map(([path, description]) => <article key={path}><code>{path}</code><p>{description}</p></article>)}
        </div>
        <section className="rss-note" id="rss">
          <span aria-hidden="true">◔</span>
          <div><h2>RSS 留在这里</h2><p>等文章内容接入后，生成 <code>/feed.xml</code>；读者可以把它订阅到 Folo、Feedly 或 Inoreader。</p></div>
        </section>
        <section className="project-template" id="projects">
          <p className="eyebrow">项目卡模板</p>
          <pre>{`title: 项目名称\nstatus: 进行中 | 已完成 | 归档\nsummary: 用一句话说明它\nlinks: [GitHub, 在线地址]\nreflection: 这次最值得留下的经验`}</pre>
        </section>
      </section>
    </SiteShell>
  );
}
