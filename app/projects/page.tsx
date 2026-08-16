import { SiteShell } from "../components/site-shell";

export default function ProjectsPage() {
  return (
    <SiteShell>
      <section className="inner-hero inner-hero-blue">
        <p className="eyebrow">PROJECTS / 项目</p>
        <h1>做过的东西，不该只躺在提交记录里。</h1>
        <p>每个项目一张卡片：链接、状态、一句话说明，再加上一段真正有价值的复盘。</p>
      </section>
      <section className="project-grid" aria-label="项目占位卡">
        {["正在酝酿", "正在制作", "已归档"].map((status, index) => (
          <article className={`project-placeholder project-placeholder-${index + 1}`} key={status}>
            <span>{status}</span>
            <div className="project-shape" aria-hidden="true" />
            <h2>项目名称</h2>
            <p>这里写它为谁解决了什么问题，以及你最想让人看到的一个细节。</p>
            <a href="/archive#projects">填写项目模板 ↗</a>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
