#!/usr/bin/env python3
"""从 Notion 桌面版本地数据库重建「从ToolCall开始组装自己的Claw」为博客 Markdown。"""
import sqlite3, json, re

DB = "/Users/lenovo/Library/Application Support/Notion/notion.db"
PAGE = "7262bac0-3a83-825e-89b3-8136c3999a1e"
OUT = "/Users/lenovo/folder/mingrui-blog/content/posts/from-toolcall-to-claw.md"

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
    """把 Notion 富文本 properties 转成 markdown 文本。"""
    try:
        p = json.loads(props) if props else {}
        segs = p.get("title") or []
    except Exception:
        return ""
    parts = []
    for seg in segs:
        text = seg[0]
        if not text:
            continue
        styles = seg[1] if len(seg) > 1 else []
        if "c" in styles:
            text = f"`{text}`"
        if "a" in styles:
            href = next((s[1] for s in seg if isinstance(s, list) and s and s[0] == "a"), None)
            if href:
                text = f"[{text}]({href})"
        if "b" in styles:
            text = f"**{text}**"
        if "i" in styles:
            text = f"*{text}*"
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
    """把 table 及其 table_row 子块渲染成 markdown 表格。"""
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
        if i == 0:
            header = cells
        else:
            lines.append(cells)
    if not header: return ""
    md = ["| " + " | ".join(header) + " |", "|" + "|".join([" --- "] * len(header)) + "|"]
    for l in lines:
        md.append("| " + " | ".join(l) + " |")
    return "\n".join(md)

def render(pid, depth=0, out=None, seen=None):
    if out is None: out = []
    if seen is None: seen = set()
    for b in children(pid):
        if b["id"] in seen: continue
        seen.add(b["id"])
        t = b["type"]
        if t == "header": out.append("## " + rich(b["properties"]))
        elif t == "sub_header": out.append("### " + rich(b["properties"]))
        elif t == "sub_sub_header": out.append("#### " + rich(b["properties"]))
        elif t == "header_4": out.append("##### " + rich(b["properties"]))
        elif t == "text":
            text = rich(b["properties"])
            if text and text != "‣": out.append(text)
        elif t == "bulleted_list":
            text = rich(b["properties"])
            if text: out.append("- " + text)
        elif t == "numbered_list":
            text = rich(b["properties"])
            if text: out.append("1. " + text)
        elif t == "code":
            props = json.loads(b["properties"]) if b["properties"] else {}
            code = "".join(seg[0] for seg in (props.get("title") or []))
            lang = "".join(seg[0] for seg in (props.get("language") or [])) or ""
            lang = lang.lower().replace("plain text", "").replace(" ", "")
            if code.strip():
                out.append(f"```{lang}\n{code.strip()}\n```")
        elif t == "table":
            md = render_table(b)
            if md: out.append(md)
        elif t == "callout":
            text = rich(b["properties"])
            if text: out.append(f"> 💡 {text}")
        elif t == "divider": out.append("---")
        elif t == "external_object_instance": out.append("")  # 嵌入占位，跳过
        elif t == "image": out.append("")  # 图片暂跳过
        # 递归渲染子块（列表嵌套等）
        render(b["id"], depth + 1, out, seen)
    return out

body = "\n\n".join(line for line in render(PAGE) if line.strip())

# 清理连续空行与多余分隔线
body = re.sub(r"\n{3,}", "\n\n", body)
body = re.sub(r"(---\n)+---", "---", body)

summary = ("从 ToolCall 出发，自底向上拆解 Agent 的构建全过程：字符串处理本质、ReAct 循环、"
           "Reflection 与 Plan-and-Execute、多智能体协作，再到 Context Engineering 与 Harness Engineering 的工程化实践，"
           "以及 Skill 封装、OpenClaw 产品化和 Typer / Jinja2 / Textual 等落地工具。")

fm = f"""---
title: 从ToolCall开始组装自己的Claw
date: 2026-05-31
category: 学习笔记
tags:
  - AI
  - Agent
summary: {summary}
---

"""
with open(OUT, "w", encoding="utf-8") as f:
    f.write(fm + body + "\n")

print("写入:", OUT)
print("正文字数:", len(body))
print("--- 前 1200 字符 ---")
print(body[:1200])
