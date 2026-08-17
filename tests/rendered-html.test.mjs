import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), developmentPreviewMeta);
});

test("renders article detail page from markdown", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/writing/24-cloud-vm-network", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /第24讲 云中网络：自己拿地成本高，购买公寓更灵活/); // 标题
  assert.match(html, /思考题深度解析/); // ReactMarkdown 渲染的正文小节
  assert.match(html, /class="article-cover"/); // 封面图已渲染
  // 第 24 讲正文不放图片：正文图片数应为 0（封面不计入）
  assert.equal([...html.matchAll(/<img src="\/assets\/[^"]+\.png"[^>]*loading="lazy"/g)].length, 0);
});

test("renders body images for posts 25-28", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  // 各篇 md 里的图片引用数（含带空格文件名的），渲染后必须全部解析为资源地址
  const expected = {
    "25-software-defined-network": 5,
    "26-cloud-network-security": 4,
    "27-cloud-network-qos": 2,
    "28-gre-vxlan": 6,
  };

  for (const [slug, count] of Object.entries(expected)) {
    const response = await worker.fetch(
      new Request(`http://localhost/writing/${slug}`, {
        headers: { accept: "text/html" },
      }),
      {
        ASSETS: {
          fetch: async () => new Response("Not found", { status: 404 }),
        },
      },
      {
        waitUntil() {},
        passThroughOnException() {},
      },
    );

    assert.equal(response.status, 200);
    const html = await response.text();
    assert.doesNotMatch(html, /<img src="\.\//); // 不允许出现未解析的相对路径
    assert.equal(
      [...html.matchAll(/<img src="\/assets\/[^"]+\.png"[^>]*loading="lazy"/g)].length,
      count,
      `${slug} 应渲染 ${count} 张正文图片`,
    );
  }
});
