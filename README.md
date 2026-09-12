# Mingrui Blog

Jmmt-mingrui 的个人博客。**静态站，零依赖，没有构建脚本，没有 CI。**

上一版是 Next.js 16 + Cloudflare Workers 的方案，依赖近 800MB、装包要十几分钟，对于一个写 Markdown 的博客来说太重了，所以换掉了。旧版本保留在 `nextjs-legacy` 分支。

## 发一篇新文章

在 `_posts/` 下新建带日期的 Markdown 文件：

```text
_posts/2026-09-12-文章标题.md
```

开头写 frontmatter：

```markdown
---
layout: post
title: "文章标题"
date: 2026-09-12
category: 笔记
tags:
  - 标签一
  - 标签二
summary: 一句话摘要，用于首页、RSS 和分享卡片。
cover: /assets/images/cover.png
---
```

然后提交推送。GitHub Pages 会自动用 Jekyll 重新生成，一分钟内生效。

详细的写作说明见 [这篇示例文章](https://github.com/Jmmt-mingrui/mingrui-blog/blob/main/_posts/2026-09-12-hello-jekyll.md)。

## 改个人信息

| 想改什么 | 改哪里 |
|---|---|
| 站名、头像、简介 | `_config.yml` |
| 首页标语 | `index.md` |
| 导航栏 | `_config.yml` 的 `navigation` |
| 项目列表 | `_data/projects.yml` |
| 关于页文案 | `about.md` |
| 样式 | `assets/css/style.css` |

### 改首页时注意

frontmatter 里的 `layout: default` **别删**。删掉它页面就不会套用站点框架，CSS、导航、页脚和深色模式全都会消失，只剩一段裸 HTML。

（保险起见，`_config.yml` 的 `defaults` 里已经给所有页面兜底设了 `default` 布局，但显式写上更清楚。）

另一个坑：hero 的标题要用 `<h1>`，因为样式选择器写的是 `.hero h1`，改成 `h2` 会让字号和字距失效。

## 目录结构

```text
_config.yml          站点配置：站名、导航、permalink、插件
_data/projects.yml   项目列表数据
_layouts/            default.html / post.html
_includes/           head、header、footer、文章卡片
assets/css/style.css 全部样式（约 300 行，无外部依赖）
assets/images/       头像、分享图、封面
_posts/              Markdown 文章
index.md             首页
archive.md           文章归档
projects.md          项目页
about.md             关于页
404.md               404 页
```

## 自动生成的东西

不用配置，开箱就有：

- `/feed.xml`：订阅源（Atom 格式），`jekyll-feed` 生成
- `/sitemap.xml`：站点地图，`jekyll-sitemap` 生成

## 自定义域名

仓库根目录放一个 `CNAME` 文件，内容写域名：

```text
example.com
```

然后到域名 DNS 商那里加一条记录：

| 主机记录 | 类型 | 记录值 |
|---|---|---|
| `@` | A | `185.199.108.153`（另有 .109/.110/.111 三条） |
| `www` | CNAME | `Jmmt-mingrui.github.io` |

设置完之后，把 `_config.yml` 里的 `url` 改成 `https://你的域名`，RSS 里的链接才会是绝对的。仓库 Settings → Pages → Custom domain 里也填一次，并勾选 Enforce HTTPS。

## 本地预览（可选）

日常直接推送看线上效果就行，不需要装 Ruby。想本地跑起来：

```bash
bundle install   # 需要有 Gemfile，或用 ruby -S gem install jekyll
bundle exec jekyll serve
```

打开 http://localhost:4000。

## 为什么没有外部字体和 CDN

样式全在本地，字体用系统自带的苹方 / 微软雅黑。引入 Google Fonts 之类会让国内访问卡在等待第三方资源上，不值得为了一点字形差异冒这个险。
