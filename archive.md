---
layout: default
title: 文章
title_en: Writing
---

<h1 class="page-title"><span class="zh-only">文章</span><span class="en-only">Writing</span></h1>
<p class="page-lede">
  <span class="zh-only">一共 {{ site.posts.size }} 篇。</span>
  <span class="en-only">{{ site.posts.size }} post{% if site.posts.size != 1 %}s{% endif %} in total.</span>
</p>

{% include archive-list.html %}
