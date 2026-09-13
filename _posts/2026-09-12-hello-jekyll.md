---
layout: post
title: "发文章完整指南：图片、push、commit 一次讲清"
date: 2026-09-12
category: 笔记
tags:
  - 博客
  - Jekyll
  - Git
summary: 从新建 Markdown、上传图片、到 commit 和 push 上线的完整流程。给三个月后忘了怎么发的自己。
---

> 这篇是给未来的自己看的。以后想发文章，打开这篇照着走。

## 整条链路

其实就四步：

```text
写 Markdown  →  放图片  →  commit  →  push  →  等一分钟上线
```

没有数据库，没有 CMS 后台，没有构建配置。Jekyll 在 GitHub Pages 上自动跑，推什么上去就是什么。

## 一、建文件

在 `_posts/` 下新建一个 `.md` 文件。**文件名必须带日期**：

```text
_posts/2026-09-12-go-microservices.md
```

日期决定排序和链接。标题部分用英文小写 + 短横线，会得到干净的 URL：`/writing/go-microservices`。别用中文或空格，链接会变得又长又乱。

## 二、写 frontmatter

文件最开头两行 `---` 之间是配置：

```yaml
---
layout: post
title: "文章标题"
date: 2026-09-12
category: 笔记
tags:
  - Go
  - 微服务
summary: 一句话摘要，显示在首页卡片和 RSS 里。
cover: /assets/images/posts/我的封面.png
---
```

| 字段 | 必填 | 干什么 |
|---|---|---|
| `layout` | 是 | 固定写 `post`。删了文章页就没样式——这是个踩过的坑 |
| `title` | 是 | 文章标题 |
| `date` | 是 | 发布日期，`YYYY-MM-DD` |
| `category` | 否 | 分类，显示成一个标签 |
| `tags` | 否 | 标签列表 |
| `summary` | 否 | 首页卡片和分享卡片的摘要 |
| `cover` | 否 | 封面图路径，不写用站点默认图 |

## 三、图片

这是最容易搞错的一步。

### 放哪

图片和文章一起放仓库里，统一丢这个目录：

```text
assets/images/posts/
```

封面图和正文插图都放这。

### 怎么传

**网页拖拽**（最省事）：仓库页面 → Add file → Upload files → 拖进去 → Commit。

**本地放文件夹**：把图片复制到本地仓库的 `assets/images/posts/`，和文章一起 push（见下一步）。

### 怎么引用

正文里用 Markdown 图片语法，**路径最前面必须带 `/`**：

```markdown
![图片说明](/assets/images/posts/go-cover.png)
```

封面在 frontmatter 里写 `cover` 字段：

```yaml
cover: /assets/images/posts/go-cover.png
```

### 三个必踩的坑

1. **少写斜杠**：`assets/images/xxx.png`（没有开头的 `/`）会 404
2. **大小写不一致**：文件是 `go-cover.png`，引用写成 `go-cover.PNG` 也会 404
3. **图没传就引用**：先确认图片真的在仓库里，再引用，否则永远是个裂图

## 四、commit 和 push

文章写好了，图片也放了，接下来提交到 GitHub。

### 命令行（推荐）

```bash
git add .
git commit -m "post: 发了一篇 Go 微服务的文章"
git push origin main
```

三条命令各干什么：

- `git add .` — 把所有改动（新文章 + 新图片）加进暂存区
- `git commit` — 固化成本地的一次提交
- `git push` — 推到 GitHub，这一步之后网站才更新

### 网页编辑

不想碰命令行也行：

1. 仓库 → Add file → Create new file
2. 文件名填 `_posts/2026-09-12-标题.md`（**一定要带 `_posts/` 前缀**）
3. 粘正文
4. 图片单独用 Upload files 传
5. Commit changes

### push 之后

GitHub Pages 自动构建，**通常一分钟内**线上就能看到。构建日志在仓库的 Actions 标签页。

> 如果 push 后页面还是旧的，等一两分钟再刷新。构建不是瞬间的。

## 补充

### 文章目录

想在正文里插一段自动目录，在目标位置加：

```markdown
* TOC
{:toc}
```

kramdown 会根据 `##` 标题自动生成。

### 本地预览

日常直接 push 看线上就够了。想本地跑：

```bash
gem install jekyll bundler
jekyll serve
```

打开 `http://localhost:4000`。

## 总结

```text
1. 建文件    _posts/日期-标题.md
2. 写配置    frontmatter（title / date / tags…）
3. 放图片    assets/images/posts/xxx.png
4. 引用图    ![](/assets/images/posts/xxx.png)
5. commit    git add . && git commit -m "..."
6. push      git push origin main
```

六步。没有第七步。
