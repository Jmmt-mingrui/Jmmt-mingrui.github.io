import { getPosts } from "../lib/posts";
import { siteConfig } from "../site-config";

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;",
  })[character] ?? character);
}

export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const items = getPosts().map((post) => {
    const url = new URL(`/writing/${post.slug}`, origin).href;
    return `<item><title>${escapeXml(post.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${new Date(`${post.date}T00:00:00+08:00`).toUTCString()}</pubDate><category>${escapeXml(post.category)}</category><description>${escapeXml(post.summary)}</description></item>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(siteConfig.title)}</title><link>${origin}</link><description>${escapeXml(siteConfig.description)}</description><language>${siteConfig.language}</language>${items}</channel></rss>`;
  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600",
    },
  });
}
