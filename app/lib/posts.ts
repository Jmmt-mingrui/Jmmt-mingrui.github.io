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

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  body: string;
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

function parseFrontmatter(path: string, raw: string): Post | null {
  const match = FRONTMATTER_RE.exec(raw);
  if (!match) return null; // 无 frontmatter（如 README.md）直接过滤
  const frontmatter = match[1];
  const body = match[2].replace(/^#\s+[^\n]+\n\n?/, ""); // 去掉与标题重复的 H1

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

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

// markdown 里的图片引用形如 `./<slug>/image 1.png`，转成 glob 打包出的资源地址；
// 未命中时原样透传，避免渲染时报错。
export function resolveImage(slug: string, src: string): string {
  const rest = src.replace(/^\.\//, "");
  return imageFiles[`../../content/posts/${slug}/${rest}`] ?? src;
}

// 文章封面（目前只有第 24 讲有）。
export function getPostCoverUrl(slug: string): string | undefined {
  return imageFiles[`../../content/posts/${slug}/趣谈网络协议.png`];
}
