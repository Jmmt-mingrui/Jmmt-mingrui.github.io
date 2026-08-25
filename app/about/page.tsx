import { SiteShell } from "../components/site-shell";
import { siteConfig } from "../site-config";

const startedYear = new Date(siteConfig.startedAt).getFullYear();

export default function AboutPage() {
  return (
    <SiteShell>
      <article className="about-page">
        <h1>关于</h1>
        <details className="article-toc about-toc">
          <summary><span>目录</span><small>展开</small></summary>
          <nav aria-label="关于页目录">
            <a href="#profile">我</a>
            <a href="#contact">找到我</a>
            <a href="#site">本站</a>
          </nav>
        </details>

        <section className="about-section" id="profile">
          <h2>我</h2>
          <ul>
            <li>{siteConfig.title}</li>
            <li>{siteConfig.description}</li>
            <li>在这里记录技术学习、开源项目和长期思考。</li>
          </ul>
        </section>

        <section className="about-section" id="contact">
          <h2>找到我</h2>
          <div className="about-contact-group">
            <h3>🍃 动态与代码</h3>
            <ul><li><a href={siteConfig.github} target="_blank" rel="noopener noreferrer">GitHub @{siteConfig.name}</a></li></ul>
          </div>
          <div className="about-contact-group">
            <h3>◔ 订阅</h3>
            <ul><li><a href="/feed">博客 RSS</a></li></ul>
          </div>
        </section>

        <section className="about-section" id="site">
          <h2>本站</h2>
          <ul>
            <li>{startedYear} 年创建</li>
            <li>使用 Markdown、Next.js、Vinext 与 Cloudflare Workers 构建</li>
            <li>文章和图片提交到 GitHub 后自动检查、构建与发布</li>
          </ul>
        </section>
      </article>
    </SiteShell>
  );
}
