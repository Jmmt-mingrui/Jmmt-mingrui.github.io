# Mingrui Blog

Jmmt-mingrui 的个人博客。页面结构与交互语言参考 `diygod.cc` 当前版本独立实现，保留本站自己的头像、简介、文章、项目和版权信息，不复制参考站内容或品牌素材。

## 内容发布

新增文章只需要提交 Markdown 和图片，不需要修改页面代码：

```text
content/posts/<slug>.md
content/posts/<slug>/cover.png
content/posts/<slug>/image-1.png
```

Markdown frontmatter 示例：

```md
---
title: 文章标题
date: 2026-08-25
category: 学习笔记
tags:
  - AI
  - Agent
summary: 首页、RSS 和分享卡片使用的摘要。
---
```

提交后会自动完成：

1. CI 检查 frontmatter、本地图片路径、代码和构建产物。
2. 构建器扫描 `content/posts/*.md`，生成首页卡片、文章列表和 `/writing/<slug>` 详情页。
3. `cover.*` 自动成为列表缩略图和文章分享图；正文相对图片自动打包。
4. RSS `/feed` 和站点地图 `/sitemap.xml` 自动包含新文章。
5. VPS 拉取 `origin/main`，验证成功后重启站点。

完整写作说明见 [`content/posts/README.md`](content/posts/README.md)。

## 个性化信息

站名、GitHub、头像、站点起始日期等集中在 [`app/site-config.ts`](app/site-config.ts)。首页文案位于 [`app/components/home-content.tsx`](app/components/home-content.tsx)，项目数据位于 [`app/lib/projects.ts`](app/lib/projects.ts)。

## 本地验证

需要 Node.js 22.13 或更高版本：

```bash
npm ci --no-audit --no-fund
npm run dev
npm run lint
npm test
```

`npm test` 会依次执行内容检查、生产构建、Worker 产物验证和渲染测试。

## 自动发布

GitHub Actions 在 PR 和 `main` 分支提交时执行 CI。生产 VPS 使用 pull 模式，不把 SSH 私钥交给 GitHub：

- `deploy/deploy-mingrui-blog.sh`：拉取 `origin/main`，检查干净工作区，按需安装依赖，构建和测试成功后重启服务。
- `deploy/mingrui-blog.service`：systemd 服务模板，监听 `127.0.0.1:8080`。
- `deploy/Caddyfile`：Caddy 反向代理模板。
- `deploy/crontab.example`：每三分钟触发一次部署检查。

服务器安装方式见 [`deploy/README.md`](deploy/README.md)。部署标记与密钥只存在服务器，不提交到仓库。

## 路由

- `/`：简介、最新七篇文章、项目与页脚
- `/writing`、`/writing/<slug>`：文章列表与详情
- `/projects`：项目列表
- `/about`：个性化关于页
- `/archive`：内容目录与写作入口
- `/feed`：RSS 2.0
- `/sitemap.xml`：XML Sitemap
