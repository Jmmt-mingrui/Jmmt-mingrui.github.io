import { getPosts } from "../lib/posts";

export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const staticRoutes = ["/", "/writing", "/projects", "/about", "/archive"];
  const urls = [
    ...staticRoutes.map((path) => ({ path, date: null })),
    ...getPosts().map((post) => ({ path: `/writing/${post.slug}`, date: post.date })),
  ];
  const body = urls.map(({ path, date }) => `<url><loc>${new URL(path, origin).href}</loc>${date ? `<lastmod>${date}</lastmod>` : ""}</url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600",
    },
  });
}
