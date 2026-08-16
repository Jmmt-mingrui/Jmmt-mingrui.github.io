import { SiteShell } from "../components/site-shell";

export default function ResearchPage() {
  return (
    <SiteShell>
      <section className="inner-hero inner-hero-pink">
        <p className="eyebrow">RESEARCH / 研究</p>
        <h1>不只记录结论，也保留问题是怎么长出来的。</h1>
        <p>把文献、实验、技术调研和思考放到同一条可回溯的路径上。</p>
      </section>
      <section className="research-board">
        <article><b>文献</b><h2>还没有第一条文献卡</h2><p>记录核心问题、关键图表、你的判断和下一步要查什么。</p></article>
        <article><b>实验 / 调研</b><h2>还没有第一条过程记录</h2><p>记录条件、变化、异常和最初没有预料到的地方。</p></article>
        <article><b>问题池</b><h2>还没有待解决的问题</h2><p>把暂时答不上来的问题留在这里，别让它在聊天记录里消失。</p></article>
      </section>
    </SiteShell>
  );
}
