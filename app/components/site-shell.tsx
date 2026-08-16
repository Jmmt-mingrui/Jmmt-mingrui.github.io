import type { ReactNode } from "react";

const navigation = [
  ["文章", "/writing"],
  ["项目", "/projects"],
  ["研究", "/research"],
  ["归档", "/archive"],
  ["关于", "/about"],
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-frame">
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="返回首页">
          <span className="wordmark-star" aria-hidden="true">✦</span>
          未命名档案
        </a>
        <nav aria-label="主导航">
          {navigation.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
        </nav>
        <a className="rss-button" href="/archive#rss" aria-label="RSS 将在发布后出现在这里">
          <span className="rss-symbol" aria-hidden="true">◔</span>
          RSS
        </a>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <p>© {new Date().getFullYear()} 未命名档案 · 从一条记录开始</p>
        <div><a href="/about">关于</a><a href="/archive#rss">RSS</a><a href="/archive">站点地图</a></div>
      </footer>
    </div>
  );
}
