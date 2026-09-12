---
layout: post
title: "发文章完整指南：图片、push、commit 一次讲清"
date: 2026-09-12
category: 笔记
tags:
  - 博客
  - Jekyll
  - Git
summary: 从新建 Markdown、上传图片、到 commit 和 push 上线的完整流程，每一步都写清楚，照着做就行。
---

这份是给未来的自己看的说明书。以后想发文章，打开这篇照着走，不用再回忆细节。

整条链路就四步：

```text
写 Markdown  →  放图片  →  commit  →  push  →  等一分钟上线
```

## 第一步：新建文章文件

在仓库的 `_posts/` 目录下新建一个文件，**文件名必须带日期**，格式是：

```text
YYYY-MM-DD-标题.md
```

举例：

```text
_posts/2026-09-12-go-microservices.md
```

- 日期决定了文章的排序和链接
- 标题部分用英文小写 + 短横线连接（比如 `go-microservices`），会得到干净的 URL：`/writing/go-microservices`
- 别用中文或空格当文件名，链接会变得又长又乱

## 第二步：写 frontmatter

文件最开头用两行 `---` 夹起来的这段是配置，告诉 Jekyll 这篇文章的元信息：

```yaml
---
layout: post
title: "文章标题"
date: 2026-09-12
category: 笔记
tags:
  - Go
  - 微服务
summary: 一句话摘要，显示在首页卡片、RSS 和分享卡片里。
cover: /assets/images/posts/我的封面.png
---
```

每个字段的含义：

| 字段 | 必填 | 说明 |
|---|---|---|
| `layout` | 是 | 固定写 `post`，别删，删了文章页就没样式了 |
| `title` | 是 | 文章标题 |
| `date` | 是 | 发布日期，格式 `YYYY-MM-DD` |
| `category` | 否 | 分类，会显示成一个标签 |
| `tags` | 否 | 标签列表，每个前面一个 `- ` |
| `summary` | 否 | 摘要，首页卡片会显示它 |
| `cover` | 否 | 封面图路径，不写就用站点默认分享图 |

## 第三步：图片放哪、怎么引用

这是最容易搞错的地方，单独说清楚。

### 图片放在哪

图片和文章一起放在 GitHub 仓库里。建议统一放这个目录：

```text
assets/images/posts/
```

封面图和正文插图都放这里。比如你的封面叫 `go-cover.png`，就放在：

```text
assets/images/posts/go-cover.png
```

### 怎么把图片传上去

有两种方式，任选：

**方式 A：GitHub 网页拖拽（最省事）**

1. 打开仓库 `Jmmt-mingrui.github.io`
2. 点 **Add file → Upload files**
3. 把图片拖进去（可以一次拖多张）
4. 下方写一句提交说明，点 **Commit changes**

**方式 B：本地放进文件夹，随文章一起 push**

把图片直接复制到本地仓库的 `assets/images/posts/` 目录，然后和文章一起提交（见下一步）。

### 正文里怎么引用

用 Markdown 的图片语法，**路径最前面必须带 `/`**：

```markdown
![图片说明](/assets/images/posts/go-cover.png)
```

- 最前面的 `/` 表示从站点根目录开始找，**必须写**
- 方括号里是图片说明文字（图片加载失败时显示，也用于无障碍）

### 封面图怎么设置

在 frontmatter 里写 `cover` 字段：

```yaml
cover: /assets/images/posts/go-cover.png
```

写了对封面后，首页文章卡片会显示缩略图。不写就用站点默认的分享图。

### 三个必踩的坑

1. **少写斜杠**：写成 `assets/images/xxx.png`（没有开头的 `/`）会 404，一定要 `![](/assets/images/xxx.png)`
2. **路径和文件名大小写必须完全一致**：文件名是 `go-cover.png`，引用时就不能写 `go-cover.PNG`
3. **图片没传上去就引用**：先确认图片真的在仓库里（网页上能看到），再在文章里引用，否则永远是个裂图

## 第四步：commit 和 push

文章写好了、图片也放进 `assets/images/posts/` 了，接下来把它们提交到 GitHub。

### 方式 A：命令行（推荐，长期用）

在本地仓库目录下执行：

```bash
git add .
git commit -m "post: 发了一篇 Go 微服务的文章"
git push origin main
```

- `git add .` 把所有改动（新文章 + 新图片）加进暂存区
- `git commit` 把改动固化成本地的一次提交，`-m` 后面是提交说明
- `git push` 把本地提交推到 GitHub，这一步之后网站才会更新

### 方式 B：GitHub 网页直接编辑

不想用命令行的话，全程在网页完成：

1. 仓库页面 → **Add file → Create new file**
2. 文件名填 `_posts/2026-09-12-文章.md`（**一定要带 `_posts/` 前缀**，否则会放错位置）
3. 正文粘进去
4. 图片用 **Add file → Upload files** 单独传
5. 最后点 **Commit changes**

### push 之后

GitHub Pages 会自动构建，**通常一分钟内**在线上就能看到。想看构建日志，去仓库的 **Actions** 标签页。

> 小提示：如果 push 之后页面还是旧的，先别慌，等一两分钟再刷新。构建不是瞬间完成的。

## 常用补充

### 想要文章目录

在正文里想要目录出现的位置，加这一行：

```markdown
* TOC
{:toc}
```

它会根据你文章里的 `##` 标题自动生成目录。

### 本地预览（可选）

日常直接 push 看线上效果就够了，不需要装 Ruby。想本地看的话：

```bash
gem install jekyll bundler
jekyll serve
```

然后打开 `http://localhost:4000`。

---

## 一张图总结

```text
┌─────────────────────────────────────────┐
│  1. 建文件  _posts/日期-标题.md           │
│  2. 写配置  frontmatter（title/date…）    │
│  3. 放图片  assets/images/posts/xxx.png  │
│  4. 引用图  ![](/assets/images/posts/x)  │
│  5. commit  git add . && git commit      │
│  6. push    git push origin main         │
└─────────────────────────────────────────┘
```

这篇本身也是示例，看会之后随时可以删掉，或者改成你自己的第一篇。
