---
layout: default
title: 项目
title_en: Projects
---

<h1 class="page-title"><span class="zh-only">项目</span><span class="en-only">Projects</span></h1>
<p class="page-lede">
  <span class="zh-only">别人找我做的项目，以及参与或维护过的开源项目。项目数据写在 <code>_data/projects.yml</code>，增删一条就够。</span>
  <span class="en-only">Client work I was commissioned to build, plus open-source projects I contribute to. Data lives in <code>_data/projects.yml</code> — add or remove an entry, that's it.</span>
</p>

{% assign clientwork = site.data.projects | where: "type", "client" %}
{% assign opensource = site.data.projects | where_exp: "p", "p.type != 'client'" %}

{% if clientwork.size > 0 %}
<div class="home-section">
  <div class="section-head">
    <h2><span class="zh-only">交付项目</span><span class="en-only">Client Work</span></h2>
    <span class="section-count">{{ clientwork.size }}</span>
  </div>
  <div class="project-grid">
    {% for project in clientwork %}
      {% include project-card.html project=project %}
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
      {% include project-card.html project=project %}
    {% endfor %}
  </div>
</div>
