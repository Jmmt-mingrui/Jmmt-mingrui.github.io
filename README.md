# Personal Archive Starter

一个不带任何个人信息的独立博客起点。视觉参考“温暖、有点玩心、但仍以长期写作和项目记录为中心”的个人站。

## 页面

- `/`：首页与内容入口
- `/writing`：文章占位页
- `/projects`：项目占位页
- `/research`：研究和学习占位页
- `/archive`：内容目录、项目卡模板与 RSS 说明
- `/about`：关于页填写提示

## 你需要填写的内容目录

内容目录在 `content/`。目前前端仍显示占位内容，下一步可把 Markdown 解析和页面数据接入这些目录。

- `content/posts/`：文章
- `content/projects/`：项目
- `content/research/`：研究与文献
- `content/now/`：短更新与周记

## 项目架构

```text
app/                    页面与视觉组件
  components/           全站复用外壳
  writing/              文章入口
  projects/             项目入口
  research/             研究入口
  archive/              内容填充说明
  about/                关于页
content/                你未来写入的 Markdown 内容
public/                 图标和公开静态资源
.openai/hosting.json    站点托管配置
```

## 下一步

1. 先把 `content/` 中对应目录的 README 看一遍。
2. 补上自己的内容后，把 Markdown 内容接入页面。
3. 再添加 RSS、评论、搜索和自定义域名。
