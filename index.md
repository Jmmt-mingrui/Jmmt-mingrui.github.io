---
layout: default
title: 首页
---

<div class="hero">
  <h1>写代码是热爱，写到世界充满爱！</h1>
</div>

<div class="section">
  <div class="section-head">
    <h2>最新文章</h2>
    <a href="{{ '/archive' | relative_url }}">全部文章</a>
  </div>

  {% if site.posts.size > 0 %}
  <div class="post-list">
    {% for post in site.posts limit:5 %}
      {% include post-card.html post=post %}
    {% endfor %}
  </div>
  {% else %}
  <p class="empty-note">还没有文章。把 Markdown 放进 <code>_posts/</code> 目录推送上来，它会立刻出现在这里。</p>
  {% endif %}
</div>

<div class="section">
  <div class="section-head">
    <h2>项目</h2>
    <a href="{{ '/projects' | relative_url }}">全部项目</a>
  </div>

  <div class="project-grid">
    {% for project in site.data.projects limit:3 %}
    <a class="project-card" href="{{ project.url }}" target="_blank" rel="noopener">
      <img src="{{ project.image | relative_url }}" alt="{{ project.name }}" loading="lazy">
      <div class="project-card-body">
        <h3>{{ project.name }}</h3>
        <p>{{ project.description }}</p>
      </div>
    </a>
    {% endfor %}
  </div>
</div>
