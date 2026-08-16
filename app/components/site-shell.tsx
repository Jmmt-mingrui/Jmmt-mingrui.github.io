import type { ReactNode } from "react";

const navigation = [
  ["首页", "/"],
  ["文章", "/writing"],
  ["项目", "/projects"],
  ["友邻", "/archive"],
  ["关于", "/about"],
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-frame">
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="返回首页">
          <span className="wordmark-dot" aria-hidden="true" />
          Hi, [你的名字]
        </a>
        <nav aria-label="主导航">
          {navigation.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
        </nav>
        <div className="header-tools" aria-label="外观与语言占位">
          <span aria-hidden="true">◐</span><span>中</span>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="footer-name"><span className="wordmark-dot" aria-hidden="true" /> Hi, [你的名字]</div>
        <p>站点已运行：从你发布第一篇文章那天开始计算</p>
        <p>© {new Date().getFullYear()} [你的名字] · 内容与版权声明待补</p>
        <a href="/archive">Sitemap</a>
      </footer>
    </div>
  );
}
