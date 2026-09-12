---
layout: default
title: 项目
---

<h1 class="page-title">项目</h1>
<p class="page-lede">参与过或维护中的开源项目。项目数据写在 <code>_data/projects.yml</code>，增删一条就够。</p>

<div class="project-list">
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
