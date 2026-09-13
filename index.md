---
layout: default
title: 首页
title_en: Home
---

<div class="hero">
  <div class="hero-left">
    <h1 class="hero-hi">Hi, Mingrui</h1>
    <p class="hero-slogan">
      <span class="zh-only">写代码是热爱，写到世界充满爱！</span>
      <span class="en-only">Code with love, until the world is full of it.</span>
    </p>
    <div class="hero-social">
      {% if site.social.github %}<a href="{{ site.social.github }}" target="_blank" rel="noopener" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg></a>{% endif %}
      {% if site.social.rss %}<a href="{{ site.social.rss | relative_url }}" aria-label="RSS"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18c0 1.2-.98 2.18-2.18 2.18a2.18 2.18 0 0 1 0-4.36zM4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/></svg></a>{% endif %}
    </div>
  </div>
  <div class="hero-right">
    <img class="hero-photo" src="{{ site.avatar | relative_url }}" alt="{{ site.title }}" width="960" height="960">
  </div>
</div>

<section class="home-section">
  <div class="section-head">
    <h2><span class="zh-only">我写的文章</span><span class="en-only">Writing</span></h2>
    <a href="{{ '/archive' | relative_url }}"><span class="zh-only">全部 →</span><span class="en-only">All →</span></a>
  </div>
  {% if site.posts.size > 0 %}
  <div class="post-list">
    {% for post in site.posts limit:5 %}
      {% include post-card.html post=post %}
    {% endfor %}
  </div>
  {% else %}
  <p class="empty-note">
    <span class="zh-only">还没有文章。把 Markdown 放进 <code>_posts/</code> 目录推送上来，它会立刻出现在这里。</span>
    <span class="en-only">No posts yet. Drop a Markdown file into <code>_posts/</code> and push — it will show up here.</span>
  </p>
  {% endif %}
</section>

<section class="home-section">
  <div class="section-head">
    <h2><span class="zh-only">项目</span><span class="en-only">Projects</span></h2>
    <a href="{{ '/projects' | relative_url }}"><span class="zh-only">全部 →</span><span class="en-only">All →</span></a>
  </div>
  <div class="project-grid">
    {% for project in site.data.projects %}
    <a class="project-card" href="{{ project.url }}" target="_blank" rel="noopener">
      <img src="{{ project.image | relative_url }}" alt="{{ project.name }}" loading="lazy">
      <div class="project-card-body">
        <h3>{{ project.name }}</h3>
        <p>{{ project.description }}</p>
      </div>
    </a>
    {% endfor %}
  </div>
</section>
