---
layout: default
title: 项目
title_en: Projects
---

<h1 class="page-title"><span class="zh-only">项目</span><span class="en-only">Projects</span></h1>
<p class="page-lede">
  <span class="zh-only">参与过或维护中的开源项目。项目数据写在 <code>_data/projects.yml</code>，增删一条就够。</span>
  <span class="en-only">Open-source projects I contribute to or maintain. Data lives in <code>_data/projects.yml</code> — add or remove an entry, that's it.</span>
</p>

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
