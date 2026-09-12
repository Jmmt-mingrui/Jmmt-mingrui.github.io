---
layout: default
title: 文章
---

<h1 class="page-title">文章</h1>
<p class="page-lede">一共 {{ site.posts.size }} 篇。</p>

{% if site.posts.size > 0 %}
  {% for post in site.posts %}
    {% capture this_year %}{{ post.date | date: "%Y" }}{% endcapture %}
    {% capture previous_year %}{{ post.previous.date | date: "%Y" }}{% endcapture %}
    {% if forloop.first or this_year != previous_year %}
      <h2 class="archive-year">{{ this_year }}</h2>
      <ul class="archive-list">
    {% endif %}

      <li>
        <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%m-%d" }}</time>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        {% if post.category %}<span class="tag">{{ post.category }}</span>{% endif %}
      </li>

    {% if forloop.last or this_year != site.posts[forloop.index].date | date: "%Y" %}
      </ul>
    {% endif %}
  {% endfor %}
{% else %}
  <p class="empty-note">还没有文章。新建 <code>_posts/2026-09-12-标题.md</code>，写好 frontmatter 推送即可。</p>
{% endif %}
