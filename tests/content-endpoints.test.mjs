import assert from "node:assert/strict";
import test from "node:test";

async function getWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("content-endpoints", `${process.pid}-${Date.now()}`);
  return (await import(workerUrl.href)).default;
}

const env = {
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
};
const context = { waitUntil() {}, passThroughOnException() {} };

test("serves RSS with generated article links", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(new Request("https://blog.example/feed"), env, context);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^application\/rss\+xml/);
  const xml = await response.text();
  assert.match(xml, /<rss version="2\.0">/);
  assert.match(xml, /https:\/\/blog\.example\/writing\/24-cloud-vm-network/);
});

test("serves XML sitemap with static and article routes", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(new Request("https://blog.example/sitemap.xml"), env, context);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^application\/xml/);
  const xml = await response.text();
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(xml, /https:\/\/blog\.example\/writing\/24-cloud-vm-network/);
});
