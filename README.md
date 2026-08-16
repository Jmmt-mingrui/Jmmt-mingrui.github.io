# Mingrui Blog

一个不带任何个人信息的独立博客起点。首页采用 `diygod.cc` 当前的结构语言：白底、896px 内容列、简介与头像位、文章列表、项目网格和简洁页脚；但没有复制其头像、文字、文章、项目或图片。

## 技术栈

- Next.js 16 与 React 19
- Vinext、Vite 与 Cloudflare Workers
- Tailwind CSS 4
- Drizzle ORM（按需启用 D1）

## 本地开发

需要 Node.js 22.13 或更高版本。首次运行先按锁文件安装依赖：

```bash
npm run install:ci
npm run dev
```

提交前可运行完整检查：

```bash
npm run lint
npm test
```

`npm test` 会先构建生产产物、验证 Worker 与托管清单，再执行渲染测试。

## 页面

- `/`：首页与内容入口
- `/writing`：文章占位页
- `/projects`：项目占位页
- `/research`：研究和学习占位页
- `/archive`：内容目录、项目卡模板与 RSS 说明
- `/about`：关于页填写提示

## 你需要填写的内容目录

内容目录在 `content/`。目前页面是可替换的占位内容；先把 Markdown 放进这些目录，下一步再把它们接成自动文章列表、详情页、标签、RSS。

- `content/posts/`：文章
- `content/projects/`：项目
- `content/research/`：研究与文献
- `content/now/`：短更新与周记
- `content/friends/`：朋友站点、简介与 RSS 地址

## 项目架构

```text
app/                      页面与视觉组件
  components/site-shell   顶部导航与页脚
  page.tsx                首页：简介、文章、项目
  writing/                文章入口
  projects/               项目入口
  research/               研究入口
  archive/                内容填充说明
  about/                  关于页
content/                  你未来写入的 Markdown 内容
  posts/                  正式文章
  projects/               项目资料
  research/               学习与研究笔记
  now/                    短更新与周记
  friends/                朋友站点与 RSS 资料
public/                   你将来放头像、文章封面、项目图片
.openai/hosting.json      托管配置
```

## 下一步

1. 先把 `content/` 中对应目录的 README 看一遍，并把头像放到 `public/`。
2. 补上自己的内容后，把 Markdown 内容接入页面。
3. 再添加文章详情、RSS、评论、搜索和自定义域名。
