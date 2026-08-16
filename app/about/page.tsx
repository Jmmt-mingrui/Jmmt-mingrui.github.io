import { SiteShell } from "../components/site-shell";

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="about-page">
        <div className="about-stamp" aria-hidden="true"><span>YOUR<br />STORY</span></div>
        <div>
          <p className="eyebrow">ABOUT / 关于</p>
          <h1>这里留给你，而不是留给一份标准简历。</h1>
          <p className="about-lead">可以写你在做什么、关心什么、如何联系，也可以只留一句现在的自我描述。</p>
          <div className="about-prompts">
            <p><span>01</span> 一句话：我是谁，正在做什么？</p>
            <p><span>02</span> 三个入口：GitHub、邮箱、你愿意公开的社交链接。</p>
            <p><span>03</span> 一段现在时：最近在学习、制作或寻找什么？</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
