import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import test from "node:test";

test("renders production metadata and the reference-style home sections", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html", "x-forwarded-host": "blog.example", "x-forwarded-proto": "https" },
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
  assert.match(html, /<meta name="description" content="Jmmt-mingrui 的个人博客/);
  assert.match(html, /<meta property="og:image" content="https:\/\/blog\.example\/og\.png"/);
  assert.match(html, /<link rel="alternate" type="application\/rss\+xml" href="https:\/\/blog\.example\/feed"/);
  assert.doesNotMatch(html, /codex-preview/);
  assert.doesNotMatch(html, /id="friends"/);
  // 首页所有带 cover.png 的文章卡片都渲染右侧方形缩略图（数量随内容变化）
  const visibleCoverCount = readdirSync(new URL("../content/posts", import.meta.url), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md")
    .map((entry) => {
      const source = readFileSync(new URL(`../content/posts/${entry.name}`, import.meta.url), "utf8");
      const date = /^date:\s*(.+)$/m.exec(source)?.[1] ?? "";
      return { slug: entry.name.slice(0, -3), date };
    })
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7)
    .filter(({ slug }) => ["png", "jpg", "jpeg", "webp", "avif"].some((extension) => existsSync(new URL(`../content/posts/${slug}/cover.${extension}`, import.meta.url))))
    .length;
  assert.equal([...html.matchAll(/<a[^>]*class="post-card-thumb"[^>]*><img src="\/assets\//g)].length, visibleCoverCount);
  // 首页项目区渲染四个真实项目卡，均链接到 GitHub 仓库（外链新开窗口）
  assert.equal([...html.matchAll(/<a class="reference-project" href="https:\/\/github\.com\//g)].length, 4);
  assert.equal([...html.matchAll(/<a class="reference-project"[^>]*target="_blank"/g)].length, 4);
  // 四张项目封面图全部渲染（小图可能被 vite 内联为 data URI，两种形式都接受）
  assert.equal([...html.matchAll(/<img src="(?:\/assets\/[^"]+|data:image\/[^"]+)" alt="[^"]* logo"/g)].length, 4);
});

test("renders article detail page from markdown", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/writing/24-cloud-vm-network", {
      headers: { accept: "text/html", "x-forwarded-host": "blog.example", "x-forwarded-proto": "https" },
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
  assert.match(html, /<meta property="og:title" content="第24讲 云中网络：自己拿地成本高，购买公寓更灵活"/);
  assert.match(html, /<meta name="twitter:title" content="第24讲 云中网络：自己拿地成本高，购买公寓更灵活"/);
  assert.match(html, /<meta property="og:image" content="https:\/\/blog\.example\/assets\/[^\"]+\.png"/);
  assert.doesNotMatch(html, /og\.png/);
  assert.match(html, /思考题深度解析/); // ReactMarkdown 渲染的正文小节
  assert.match(html, /<details class="article-toc">/);
  assert.match(html, /<nav aria-label="文章目录">/);
  assert.match(html, /href="#section-\d+"/);
  assert.match(html, /<h2 id="section-\d+">/);
  assert.doesNotMatch(html, /article-cover/); // 详情页不再有头图
  // 正文图片（含带空格文件名的）必须全部渲染并解析为资源地址，共 11 张
  assert.equal([...html.matchAll(/<img src="\/assets\/[^"]+\.png"[^>]*loading="lazy"/g)].length, 11);
});

test("clears inherited social images when an article has no cover", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("http://localhost/writing/from-toolcall-to-claw", {
      headers: { accept: "text/html", "x-forwarded-host": "blog.example", "x-forwarded-proto": "https" },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<meta property="og:title" content="从ToolCall开始组装自己的Claw"/);
  assert.match(html, /<meta name="twitter:card" content="summary"/);
  assert.doesNotMatch(html, /<meta property="og:image"/);
  assert.doesNotMatch(html, /<meta name="twitter:image"/);
});

test("renders the reference-style searchable writing index", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("http://localhost/writing", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<label for="writing-search-input">搜索关键词<\/label>/);
  assert.match(html, /placeholder="从文章标题和内容中查找关键词"/);
  const articleCount = readdirSync(new URL("../content/posts", import.meta.url))
    .filter((name) => name.endsWith(".md") && name !== "README.md").length;
  assert.match(html, new RegExp(`${articleCount} 篇文章`));
  assert.match(html, /Context Engineering/); // 正文搜索索引随页面数据下发

  const filteredResponse = await worker.fetch(
    new Request("http://localhost/writing?tag=Eino", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const filteredHtml = await filteredResponse.text();
  const einoCount = readdirSync(new URL("../content/posts", import.meta.url))
    .filter((name) => name.endsWith(".md") && name !== "README.md")
    .filter((name) => /^\s*- Eino\s*$/m.test(readFileSync(new URL(`../content/posts/${name}`, import.meta.url), "utf8"))).length;
  assert.match(filteredHtml, /<span>#Eino<\/span>/);
  assert.match(filteredHtml, new RegExp(`${einoCount} 篇文章`));
  assert.match(filteredHtml, /href="\/writing">清除筛选/);
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
