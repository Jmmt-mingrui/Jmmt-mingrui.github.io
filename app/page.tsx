import { SiteShell } from "./components/site-shell";

const emptySections = [
  {
    eyebrow: "01 / 写作",
    title: "第一篇文章，还在路上",
    description: "把 source 中的想法、踩坑和结论写进来。这里会自动成为你长期可检索的公开笔记。",
    href: "/writing",
    action: "查看文章目录",
    tone: "sun",
  },
  {
    eyebrow: "02 / 项目",
    title: "项目集等待收录",
    description: "每个项目只需要写清：它解决什么、你做了什么、现在走到了哪里。",
    href: "/projects",
    action: "整理项目入口",
    tone: "blue",
  },
  {
    eyebrow: "03 / 研究",
    title: "研究与学习，慢慢沉淀",
    description: "论文笔记、实验记录、问题清单和阶段复盘，都可以留在这里。",
    href: "/research",
    action: "打开研究目录",
    tone: "pink",
  },
];

export default function Home() {
  return (
    <SiteShell>
      <section className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">PERSONAL ARCHIVE / 01</p>
          <h1>
            把正在发生的事，
            <br />
            写成以后仍然想
            <span className="headline-mark">回来的地方。</span>
          </h1>
          <p className="hero-text">
            这里暂时还没有自我介绍、履历或文章。它已经准备好，等你把自己的问题、项目、研究和生活一点点放进来。
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/about">
              从「关于」开始 <span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" href="/archive">
              看看站点目录 <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="hero-orbit" aria-label="一个等待被填充的个人档案">
          <div className="orbit-sticker sticker-one">notes</div>
          <div className="orbit-sticker sticker-two">work in progress</div>
          <div className="sun-face">
            <span className="sun-eye sun-eye-left" />
            <span className="sun-eye sun-eye-right" />
            <span className="sun-smile" />
          </div>
          <div className="orbit-ring orbit-ring-one" />
          <div className="orbit-ring orbit-ring-two" />
          <div className="orbit-dots" />
          <p className="orbit-caption">
            YOUR
            <br />
            LITTLE
            <br />
            UNIVERSE
          </p>
        </div>
      </section>

      <section className="index-section">
        <div className="section-heading">
          <p className="eyebrow">START HERE</p>
          <h2>先把你的内容世界分成三块。</h2>
          <p>不急着写得完整，先开始记录。后面的分类、归档、RSS 和站点地图都会从这里长出来。</p>
        </div>
        <div className="empty-grid">
          {emptySections.map((section) => (
            <article className={`empty-card empty-card-${section.tone}`} key={section.title}>
              <p>{section.eyebrow}</p>
              <h3>{section.title}</h3>
              <span className="card-squiggle" aria-hidden="true" />
              <p className="card-description">{section.description}</p>
              <a href={section.href}>{section.action} <span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="archive-callout">
        <div>
          <p className="eyebrow">OPEN, NOT FINISHED</p>
          <h2>这个博客不需要等“准备好了”才开始。</h2>
        </div>
        <p>
          每一条笔记、每一个项目和每次改变想法的时刻，都会成为未来回看时的坐标。
          <a href="/archive">去查看填充指南 →</a>
        </p>
      </section>
    </SiteShell>
  );
}
