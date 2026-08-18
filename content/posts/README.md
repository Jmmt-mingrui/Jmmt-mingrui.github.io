# 文章

用于技术文章、随笔、教程和复盘。

## 如何新增一篇文章

**只需要在 `content/posts/` 下加一个 Markdown 文件，首页、写作页、详情页都会自动出现**（构建期由 `app/lib/posts.ts` 扫描）：

```text
content/posts/<slug>.md        # 文章正文（文件名即 slug，详情页地址 /writing/<slug>）
content/posts/<slug>/          # 可选：文章配图目录
content/posts/<slug>/cover.png # 可选：首页封面（缺省时首页显示色块占位）
```

frontmatter 字段（必需 `title`、`date`，其余可选）：

```markdown
---
title: 文章标题
date: 2026-04-19
category: 学习笔记
tags:
  - 网络协议
  - 云计算
summary: 一段不超过两行的摘要，会显示在首页和写作列表。
---

正文从这里开始，支持标准 Markdown（标题、列表、代码块、表格、图片）。
```

- 正文图片放在同名目录里，用相对路径引用即可（文件名带空格没问题，构建时会自动转义）：
  `![示意图](./<slug>/image 1.png)`
- 提交并推送 `main` 后：GitHub CI 自动 lint + 构建 + 渲染测试，VPS 定时任务约 3 分钟内自动部署上线。
- 不想要的文章加 `draft: true` 或直接删除文件即可。

## 现有内容

### 合集一：《趣谈网络协议》学习笔记

来自 Notion 数据库「刘超《趣谈网络协议》学习笔记」的导出，共 5 篇（第 24–28 讲，云网络篇）：

| 文件 | 标题 |
| --- | --- |
| `24-cloud-vm-network.md` | 第24讲 云中网络：自己拿地成本高，购买公寓更灵活 |
| `25-software-defined-network.md` | 第25讲 软件定义网络：共享基础设施的小区物业管理办法 |
| `26-cloud-network-security.md` | 第26讲 云中的网络安全：虽然不是土豪，也需要基本安全和保障 |
| `27-cloud-network-qos.md` | 第27讲 云中的网络QoS：邻居疯狂下电影，我该怎么办？ |
| `28-gre-vxlan.md` | 第28讲 云中网络的隔离GRE、VXLAN：虽然住一个小区，也要保护隐私 |
