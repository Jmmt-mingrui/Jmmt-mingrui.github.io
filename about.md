---
layout: default
title: 关于
title_en: About
---

<h1 class="page-title"><span class="zh-only">关于</span><span class="en-only">About</span></h1>

<div class="zh-only" markdown="1">
我是 {{ site.author }}，计算机专业学生，2026 届秋季求职进行中。

这里是我记录东西的地方。内容大致分三类：

- **技术笔记** —— 遇到过的问题、查过的资料、想明白了的原理
- **开源项目** —— 参与和维护的项目，以及过程中踩的坑
- **杂想** —— 值得记下来的碎片

## 怎么找到我

- GitHub：[{{ site.author }}]({{ site.social.github }})
- LinkedIn：[Mingrui Li]({{ site.social.linkedin }})
- 订阅：[RSS]({{ site.social.rss | relative_url }})

## 这个站是怎么搭的

静态站。**没有构建脚本，没有 `package.json`，没有 CI**：写好 Markdown 推到 GitHub，GitHub Pages 会自动用 Jekyll 生成页面。

想看或者想抄的话，源码就在 GitHub 上。
</div>

<div class="en-only" markdown="1">
I'm {{ site.author }}, a computer science student in the class of 2026, currently going through autumn recruiting.

This is where I write things down. Roughly three kinds of content:

- **Tech notes** — problems I ran into, references I dug through, concepts that finally clicked
- **Open source** — projects I contribute to and maintain, plus the pitfalls along the way
- **Misc thoughts** — fragments worth keeping

## Find me

- GitHub: [{{ site.author }}]({{ site.social.github }})
- LinkedIn: [Mingrui Li]({{ site.social.linkedin }})
- Subscribe: [RSS]({{ site.social.rss | relative_url }})

## How this site is built

Static site. **No build scripts, no `package.json`, no CI**: write Markdown, push to GitHub, and GitHub Pages renders it with Jekyll.

The source is on GitHub if you want to look — or copy.
</div>
