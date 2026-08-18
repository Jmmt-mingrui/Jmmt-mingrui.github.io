// 构建期内容加载器：只在服务端组件中使用（严禁被 "use client" 模块引用，
// 否则会把全部 markdown 打进客户端 bundle）。
//
// Worker 运行时没有 node:fs，因此所有文章与图片都通过 import.meta.glob
// 在构建期打包，?raw 取正文、?url 取静态资源地址。

const mdFiles = import.meta.glob("../../content/posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const imageFiles = import.meta.glob("../../content/posts/*/*.png", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

// 封面约定：content/posts/<slug>/cover.png（可选，缺省时首页回退到色块占位）
const coverFiles = import.meta.glob("../../content/posts/*/cover.png", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  summary: string;
  body: string;
}

// 首页/列表页用的轻量摘要，不含正文
// （posts.ts 含 ?raw 正文，只能被服务端组件引用；客户端组件通过 props 接收这些数据）
export interface PostSummary {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  summary: string;
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

function parseFrontmatter(path: string, raw: string): Post | null {
  const match = FRONTMATTER_RE.exec(raw);
  if (!match) return null; // 无 frontmatter（如 README.md）直接过滤
  const frontmatter = match[1];
  // 去掉与标题重复的 H1；图片引用目标里的空格按 CommonMark 必须转义，
  // 否则 `![a](./x/image 1.png)` 整行会被当成普通文本丢弃，这里统一编码为 %20。
  const body = match[2]
    .replace(/^#\s+[^\n]+\n\n?/, "")
    .replace(/!\[[^\]]*\]\(([^)]*)\)/g, (ref, dest) => ref.replace(dest, dest.replace(/ /g, "%20")));

  const fields: Record<string, string> = {};
  const tags: string[] = [];
  for (const line of frontmatter.split(/\r?\n/)) {
    if (/^\s*-\s+/.test(line)) {
      tags.push(line.replace(/^\s*-\s+/, ""));
    } else if (line.includes(": ")) {
      const colon = line.indexOf(": ");
      fields[line.slice(0, colon)] = line.slice(colon + 2);
    }
  }

  return {
    slug: path.split("/").pop()!.replace(/\.md$/, ""),
    title: fields.title ?? "",
    date: fields.date ?? "",
    category: fields.category ?? "",
    tags,
    summary: fields.summary ?? "",
    body,
  };
}

const posts: Post[] = Object.entries(mdFiles)
  .map(([path, raw]) => parseFrontmatter(path, raw))
  .filter((post): post is Post => post !== null)
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export function getPosts(): Post[] {
  return posts;
}

export function getPostSummaries(): PostSummary[] {
  return posts.map(({ slug, title, date, category, tags, summary }) => ({
    slug,
    title,
    date,
    category,
    tags,
    summary,
  }));
}

export function getPostCovers(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(coverFiles).map(([path, url]) => [path.split("/").at(-2)!, url]),
  );
}

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

// markdown 里的图片引用形如 `./<slug>/image 1.png`，转成 glob 打包出的资源地址；
// 未命中时原样透传，避免渲染时报错。
export function resolveImage(slug: string, src: string): string {
  const rest = decodeURIComponent(src.replace(/^\.\//, "")); // %20 还原成文件名里的空格
  return imageFiles[`../../content/posts/${rest}`] ?? imageFiles[`../../content/posts/${slug}/${rest}`] ?? src;
}

