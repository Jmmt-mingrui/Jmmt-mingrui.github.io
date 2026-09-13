---
layout: default
title: 项目
title_en: Projects
---

<h1 class="page-title"><span class="zh-only">项目</span><span class="en-only">Projects</span></h1>
<p class="page-lede">
  <span class="zh-only">参与过或维护中的开源项目，以及交付上线、正在生产环境跑的项目。项目数据写在 <code>_data/projects.yml</code>，增删一条就够。</span>
  <span class="en-only">Open-source projects I contribute to, plus delivered systems running in production. Data lives in <code>_data/projects.yml</code> — add or remove an entry, that's it.</span>
</p>

{% assign production = site.data.projects | where: "type", "production" %}
{% assign opensource = site.data.projects | where_exp: "p", "p.type != 'production'" %}

{% if production.size > 0 %}
<div class="home-section">
  <div class="section-head">
    <h2><span class="zh-only">生产项目</span><span class="en-only">In Production</span></h2>
    <span class="section-count">{{ production.size }}</span>
  </div>
  <div class="project-grid">
    {% for project in production %}
    <a class="project-card" href="{{ project.url }}" target="_blank" rel="noopener">
      <span class="project-badge"><span class="zh-only">生产</span><span class="en-only">LIVE</span></span>
      <img src="{{ project.image | relative_url }}" alt="{{ project.name }}" loading="lazy">
      <div class="project-card-body">
        <h3>{{ project.name }}</h3>
        <p>{{ project.description }}</p>
      </div>
    </a>
    {% endfor %}
  </div>
</div>
{% endif %}

<div class="home-section">
  <div class="section-head">
    <h2><span class="zh-only">开源项目</span><span class="en-only">Open Source</span></h2>
    <span class="section-count">{{ opensource.size }}</span>
  </div>
  <div class="project-grid">
    {% for project in opensource %}
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
