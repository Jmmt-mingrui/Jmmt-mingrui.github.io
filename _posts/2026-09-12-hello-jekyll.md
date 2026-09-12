---
layout: post
title: "第一篇：怎么写文章"
date: 2026-09-12
category: 笔记
tags:
  - 博客
  - Jekyll
summary: 记一下这个站的发布流程，免得以后隔久了忘了怎么发。
---

把这个站改成静态之后，发文章只剩三步，我把流程记在这里备查。

## 新建文件

在 `_posts/` 下建一个 Markdown 文件，**文件名必须带日期**：

```text
_posts/2026-09-12-文章标题.md
```

日期决定了文章排序和最终链接。标题部分建议用英文短横线连接，会得到干净的 URL：

```text
https://你的域名/writing/文章标题
```

## 写 frontmatter

文件开头用 `---` 包起来的这段是文章的配置：

```yaml
---
layout: post
title: "第一篇：怎么写文章"
date: 2026-09-12
category: 笔记
tags:
  - 博客
  - Jekyll
summary: 摘要，会出现在首页卡片、RSS 和分享卡片里。
cover: /assets/images/og.png
---
```

`cover` 不写就用站点的默认分享图；写了的话，首页卡片列表也会显示缩略图。正文里的图片建议放在 `assets/images/` 下，用相对路径引用：

```markdown
![示意图](/assets/images/screenshot.png)
```

## 推送

```bash
git add _posts/
git commit -m "post: 文章标题"
git push
```

推上去之后 GitHub Pages 会自动构建，通常一分钟内在 `https://你的域名` 就能看到。构建日志在仓库的 Actions 标签页里。

## 需要目录的话

想在文章里插一段自动生成的目录，在想要展示目录的位置加：

```markdown
* TOC
{:toc}
```

## 本地预览（可选）

一般直接用线上构建就够了，不用装 Ruby。想本地看效果的话：

```bash
gem install jekyll bundler
jekyll serve
```

然后打开 `http://localhost:4000`。

---

这篇是示例，随时可以删掉。
