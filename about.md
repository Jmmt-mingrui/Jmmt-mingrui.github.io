---
layout: default
title: 关于
---

<h1 class="page-title">关于</h1>

我是 {{ site.author }}，计算机专业学生，2026 届秋季求职进行中。

这里是我记录东西的地方。内容大致分三类：

- **技术笔记** —— 遇到过的问题、查过的资料、想明白了的原理
- **开源项目** —— 参与和维护的项目，以及过程中踩的坑
- **杂想** —— 值得记下来的碎片

## 怎么找到我

- GitHub：[{{ site.author }}]({{ site.social.github }})
- 订阅：[RSS]({{ site.social.rss | relative_url }})

## 这个站是怎么搭的

静态站。**没有构建脚本，没有 `package.json`，没有 CI**：写好 Markdown 推到 GitHub，GitHub Pages 会自动用 Jekyll 生成页面。

想看或者想抄的话，源码就在 GitHub 上。
