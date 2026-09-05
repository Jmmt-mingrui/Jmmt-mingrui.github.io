# 文章

用于技术文章、随笔、教程和复盘。**写文章只需要往 `content/posts/` 加 Markdown 和图片，不用改任何页面代码** —— 首页卡片、写作列表、详情页、RSS、Sitemap 都会由构建期扫描自动生成。

## 一、新增一篇文章（三步）

### 1. 放正文：`content/posts/<slug>.md`

文件名即 slug，决定详情页地址 `/writing/<slug>`。文件开头是 YAML frontmatter：

```markdown
---
title: 文章标题
date: 2026-09-05
category: 学习笔记
tags:
  - AI
  - Agent
summary: 一两行的摘要，会显示在首页和写作列表。不能留空。
---

正文从这里开始，支持标准 Markdown：
- 标题用 # / ## / ###
- 代码块用 ``` 围栏（可标注语言）
- 表格、引用、加粗、链接都支持
```

> **必填字段：`title`、`date`、`category`、`summary`，缺一个 CI 就会失败。**
> `date` 必须写成 `YYYY-MM-DD`；`tags` 是可选的字符串列表。

### 2. 放图片

在正文同目录建一个同名文件夹 `<slug>/`，图片放里面：

| 用途 | 位置 | 说明 |
| --- | --- | --- |
| **封面**（首页卡片缩略图、分享图） | `content/posts/<slug>/cover.png` | 可选，建议方形图（如 512×512） |
| **正文配图** | `content/posts/<slug>/任意名字.png` | 可选，可多张 |

图片支持 PNG、JPG/JPEG、WebP、GIF、AVIF；封面不支持 GIF。`cover.png` 同时也能被正文引用。

### 3. 在正文里用相对路径引用图片

```markdown
![示意图](./<slug>/cover.png)
```

- 图片和 md 放同一个 `<slug>` 目录即可，文件名带空格、中文都没问题（构建时自动处理）。
- 引用路径写错、格式不支持时，CI 的内容检查会直接报错并给出具体文件。

## 二、提交与上线

```bash
git add content/posts/<slug>.md content/posts/<slug>/
git commit -m "docs: 新增文章 <标题>"
git push origin <你的分支名>
```

然后在 GitHub 上把分支合到 `main`（可在仓库里开 PR 合并）。合并后：

1. GitHub Actions 自动运行内容检查、lint、生产构建和渲染测试；
2. 构建器生成首页卡片、写作列表和 `/writing/<slug>` 详情页；
3. VPS 拉取 `origin/main`，验证成功后重启站点，约 3 分钟内上线。

不需要手动执行任何部署命令。

## 三、常见问题

- **本地想先检查一遍？** 运行 `npm run content:check`，它会校验所有文章的 frontmatter 和图片引用。
- **如何从别处批量导入？** 仓库 `scripts/` 下保留有从 Notion 本地缓存重建 Markdown 的辅助脚本（`notion-export.py`），按需使用。
- **文章的列表顺序？** 按 `date` 倒序展示。
