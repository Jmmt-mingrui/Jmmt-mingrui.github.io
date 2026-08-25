#!/usr/bin/env python3
"""从 Notion 本地缓存重建 Eino 合集有内容的子页面。"""
import sqlite3, json, re, datetime

DB = "/Users/lenovo/Library/Application Support/Notion/notion.db"
BASE = "/Users/lenovo/folder/mingrui-blog/content/posts"
ICON = "/tmp/eino_icon.png"

db = sqlite3.connect(DB)
db.row_factory = sqlite3.Row
rows = db.execute("SELECT id, type, properties, content, format, created_time FROM block WHERE alive=1").fetchall()
by_id = {r["id"]: r for r in rows}

def children(pid):
    out = []
    b = by_id.get(pid)
    if b and b["content"]:
        try: cids = json.loads(b["content"])
        except Exception: cids = []
        for cid in cids:
            if cid in by_id: out.append(by_id[cid])
    return out

def rich(props):
    try:
        p = json.loads(props) if props else {}
        segs = p.get("title") or []
    except Exception:
        return ""
    parts = []
    for seg in segs:
        text = seg[0]
        if not text: continue
        styles = seg[1] if len(seg) > 1 else []
        if "c" in styles: text = f"`{text}`"
        if "a" in styles:
            href = next((s[1] for s in seg if isinstance(s, list) and s and s[0] == "a"), None)
            if href: text = f"[{text}]({href})"
        if "b" in styles: text = f"**{text}**"
        if "i" in styles: text = f"*{text}*"
        parts.append(text)
    return "".join(parts).strip()

def cell_text(props):
    try:
        p = json.loads(props) if props else {}
    except Exception:
        return ""
    out = []
    for key, segs in p.items():
        for seg in segs:
            text = seg[0]
            if not text: continue
            styles = seg[1] if len(seg) > 1 else []
            if "b" in styles: text = f"**{text}**"
            if "c" in styles: text = f"`{text}`"
            if "a" in styles:
                href = next((s[1] for s in seg if isinstance(s, list) and s and s[0] == "a"), None)
                if href: text = f"[{text}]({href})"
            out.append(text)
    return "".join(out).replace("\n", " ")

def render_table(block):
    order = []
    if block["format"]:
        try:
            fmt = json.loads(block["format"])
            order = fmt.get("table_block_column_order") or []
        except Exception: pass
    trs = children(block["id"])
    if not trs: return ""
    lines = []
    header = None
    for i, tr in enumerate(trs):
        props = json.loads(tr["properties"]) if tr["properties"] else {}
        if order:
            cells = [cell_text(json.dumps({k: props.get(k, [])})) for k in order]
        else:
            cells = [cell_text(json.dumps({k: v})) for k, v in props.items()]
        if i == 0: header = cells
        else: lines.append(cells)
    if not header: return ""
    md = ["| " + " | ".join(header) + " |", "|" + "|".join([" --- "] * len(header)) + "|"]
    for l in lines: md.append("| " + " | ".join(l) + " |")
    return "\n".join(md)

def render(pid, seen=None):
    out = []
    seen = seen or set()
    for b in children(pid):
        if b["id"] in seen: continue
        seen.add(b["id"])
        t = b["type"]
        text = rich(b["properties"])
        if t == "header": out.append("## " + text)
        elif t == "sub_header": out.append("### " + text)
        elif t == "sub_sub_header": out.append("#### " + text)
        elif t == "header_4": out.append("##### " + text)
        elif t == "text":
            if text and text != "‣": out.append(text)
        elif t == "bulleted_list":
            if text: out.append("- " + text)
        elif t == "numbered_list":
            if text: out.append("1. " + text)
        elif t == "code":
            props = json.loads(b["properties"]) if b["properties"] else {}
            code = "".join(seg[0] for seg in (props.get("title") or []))
            lang = "".join(seg[0] for seg in (props.get("language") or [])) or ""
            lang = lang.lower().replace("plain text", "").replace(" ", "")
            if code.strip(): out.append(f"```{lang}\n{code.strip()}\n```")
        elif t == "table":
            md = render_table(b)
            if md: out.append(md)
        elif t == "callout":
            if text: out.append(f"> 💡 {text}")
        elif t == "divider": out.append("---")
        out += render(b["id"], seen)
    return out

def build(page_id, slug, title, date, tags, summary, category="学习笔记"):
    body = "\n\n".join(l for l in render(page_id) if l.strip())
    body = re.sub(r"\n{3,}", "\n\n", body)
    body = re.sub(r"(---\n)+---", "---", body)
    fm = f"""---
title: {title}
date: {date}
category: {category}
tags:
{chr(10).join('  - ' + t for t in tags)}
summary: {summary}
---

"""
    path = f"{BASE}/{slug}.md"
    with open(path, "w", encoding="utf-8") as f:
        f.write(fm + body + "\n")
    # cover
    import shutil, os
    os.makedirs(f"{BASE}/{slug}", exist_ok=True)
    shutil.copy(ICON, f"{BASE}/{slug}/cover.png")
    print(f"✓ {slug}.md ({len(body)} chars, {body.count(chr(10))} lines)")

# 1) 加餐：MultiAgent
build("7ce2bac0-3a83-821c-b6ec-01976189ad7b", "eino-multiagent",
      "加餐：MultiAgent（MoE 编排）", "2026-03-17",
      ["Eino", "AI", "Agent"],
      "Eino 入门合集的加餐：为什么单个 Agent 的力量是有限的，以及 MoE（混合专家）编排如何通过\"门控路由 + 专家激活\"让多个专业模型协作处理复杂任务。")

# 2) 食用前须知（合集前言）
build("c5a2bac0-3a83-8242-9c18-0141d8df5613", "eino-preface",
      "Eino 入门：食用前须知", "2026-03-17",
      ["Eino", "AI", "教程"],
      "Eino 入门教程的前言：适合有一定 Go 基础的读者；Eino 以日为单位快速迭代，学会看文档、用工具比死记知识更重要。")

print("done")
