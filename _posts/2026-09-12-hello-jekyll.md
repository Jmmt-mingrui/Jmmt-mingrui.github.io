---
layout: post
title: "How to Publish a Post: Images, Commits & Push, Explained Once"
date: 2026-09-12
category: Notes
tags:
  - Blog
  - Jekyll
  - Git
summary: The complete flow from creating a Markdown file, uploading images, to committing and pushing it live. For my future self who will forget all of this in three months.
---

> This one is written for my future self. Next time I want to publish something, open this post and follow it.

## The Whole Pipeline

It's really just four steps:

```text
write Markdown  →  add images  →  commit  →  push  →  live in about a minute
```

No database, no CMS admin panel, no build configuration. Jekyll runs automatically on GitHub Pages — whatever you push is what gets served.

## 1. Create the File

Create a new `.md` file under `_posts/`. **The filename must include the date**:

```text
_posts/2026-09-12-go-microservices.md
```

The date determines sorting and the URL. Use lowercase English plus hyphens for the title part to get a clean URL: `/writing/go-microservices`. Don't use Chinese characters or spaces — the link becomes long and ugly.

## 2. Write the Frontmatter

The block between the two `---` lines at the top of the file is the configuration:

```yaml
---
layout: post
title: "Post Title"
date: 2026-09-12
category: Notes
tags:
  - Go
  - Microservices
summary: A one-line summary, shown on the homepage list and in RSS.
cover: /assets/images/posts/my-cover.png
---
```

| Field | Required | What it does |
|---|---|---|
| `layout` | Yes | Always `post`. Delete it and the page renders unstyled — a pitfall I've hit before |
| `title` | Yes | The post title |
| `date` | Yes | Publish date, `YYYY-MM-DD` |
| `category` | No | Category, displayed as a tag |
| `tags` | No | List of tags |
| `summary` | No | Summary for the homepage list and share cards |
| `cover` | No | Cover image path; falls back to the site default if omitted |

## 3. Images

This is the step where things go wrong most often.

### Where to put them

Keep images in the repo alongside the posts, under one directory:

```text
assets/images/posts/
```

Cover images and inline figures both go here.

### How to upload

**Drag and drop on the web** (easiest): repo page → Add file → Upload files → drag them in → Commit.

**Local copy**: copy the images into `assets/images/posts/` in your local clone and push them together with the post (see next step).

### How to reference them

Use standard Markdown image syntax in the body, **the path must start with `/`**:

```markdown
![alt text](/assets/images/posts/go-cover.png)
```

For the cover, set the `cover` field in frontmatter:

```yaml
cover: /assets/images/posts/go-cover.png
```

### Three pitfalls you WILL hit

1. **Missing leading slash**: `assets/images/xxx.png` (no `/` at the start) gives a 404
2. **Case mismatch**: the file is `go-cover.png` but you reference `go-cover.PNG` — also a 404
3. **Referencing before uploading**: make sure the image is actually in the repo before you reference it, otherwise it stays a broken image forever

## 4. Commit and Push

Post written, images in place — time to send it to GitHub.

### Command line (recommended)

```bash
git add .
git commit -m "post: published a post about Go microservices"
git push origin main
```

What each command does:

- `git add .` — stage all changes (new post + new images)
- `git commit` — freeze them into a local commit
- `git push` — push to GitHub; the site only updates after this step

### Editing on the web

If you'd rather not touch the terminal:

1. Repo → Add file → Create new file
2. Name it `_posts/2026-09-12-title.md` (**the `_posts/` prefix is mandatory**)
3. Paste the body
4. Upload images separately via Upload files
5. Commit changes

### After pushing

GitHub Pages builds automatically — usually **live within a minute**. Build logs are under the repo's Actions tab.

> If the page still shows the old version after a push, wait a minute or two and refresh. Builds aren't instant.

## Extras

### Table of contents

To insert an auto-generated TOC in the body, add this where you want it:

```markdown
* TOC
{:toc}
```

kramdown generates it from the `##` headings.

### Local preview

For day-to-day use, just push and check the live site. To run locally:

```bash
gem install jekyll bundler
jekyll serve
```

Then open `http://localhost:4000`.

## Recap

```text
1. create file   _posts/date-title.md
2. frontmatter   title / date / tags...
3. add images    assets/images/posts/xxx.png
4. reference     ![](/assets/images/posts/xxx.png)
5. commit        git add . && git commit -m "..."
6. push          git push origin main
```

Six steps. There is no step seven.
