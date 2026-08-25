import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";

const postsDir = new URL("../content/posts/", import.meta.url);
const required = ["title", "date", "category", "summary"];
const allowedImages = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);
const errors = [];

for (const entry of readdirSync(postsDir, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith(".md") || entry.name === "README.md") continue;

  const slug = entry.name.slice(0, -3);
  const source = readFileSync(new URL(entry.name, postsDir), "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(source);
  if (!match) {
    errors.push(`${entry.name}: 缺少有效的 YAML frontmatter`);
    continue;
  }

  const fields = Object.fromEntries(
    match[1].split(/\r?\n/).flatMap((line) => {
      const separator = line.indexOf(":");
      return separator > 0 ? [[line.slice(0, separator).trim(), line.slice(separator + 1).trim()]] : [];
    }),
  );

  for (const key of required) {
    if (!fields[key]) errors.push(`${entry.name}: frontmatter 缺少 ${key}`);
  }
  if (fields.date && !/^\d{4}-\d{2}-\d{2}$/.test(fields.date)) {
    errors.push(`${entry.name}: date 必须使用 YYYY-MM-DD`);
  }

  for (const imageMatch of match[2].matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
    const rawPath = imageMatch[1].trim().replace(/^<|>$/g, "").split(/[?#]/, 1)[0];
    if (/^(?:https?:|data:|\/)/.test(rawPath)) continue;
    const decoded = decodeURIComponent(rawPath);
    const relative = decoded.replace(/^\.\//, "");
    const resolved = join(postsDir.pathname, relative.startsWith(`${slug}/`) ? relative : `${slug}/${relative}`);
    if (!allowedImages.has(extname(resolved).toLowerCase())) {
      errors.push(`${entry.name}: 不支持的图片格式 ${rawPath}`);
    } else if (!existsSync(resolved)) {
      errors.push(`${entry.name}: 找不到图片 ${rawPath}`);
    }
  }
}

if (errors.length) {
  console.error(`内容检查失败（${errors.length} 项）：\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log("内容检查通过");
