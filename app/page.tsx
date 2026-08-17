"use client";

import { useState } from "react";
import { SiteShell } from "./components/site-shell";
import { ScrollReveal } from "./components/scroll-reveal";
import { useSitePreferences } from "./components/site-preferences";
import cover24 from "../content/posts/24-cloud-vm-network/趣谈网络协议.png?url";
import cover25 from "../content/posts/25-software-defined-network/趣谈网络协议.png?url";
import cover26 from "../content/posts/26-cloud-network-security/趣谈网络协议.png?url";
import cover27 from "../content/posts/27-cloud-network-qos/趣谈网络协议.png?url";
import cover28 from "../content/posts/28-gre-vxlan/趣谈网络协议.png?url";
import projectEino from "../content/projects/eino-ext.png?url";
import projectDoris from "../content/projects/doris-mcp-server.png?url";
import projectVelo from "../content/projects/velodb-mcp-server.png?url";
import projectMicro from "../content/projects/microservices-go-start.jpg?url";

const content = {
  zh: {
    tagline: "在这里写下你想留住的事。",
    bio: "这是一段留给你的简短介绍：你在做什么、关心什么，或最近正在探索什么。没有准备好也没关系，直接把这行替换掉就行。",
    avatar: "头像\n待补",
    writingKicker: "我写的文章",
    articles: "文章",
    categories: "分类：",
    category: "学习笔记",
    tags: "标签：",
    tag: "#网络协议",
    moreArticles: "查看所有文章",
    collectionIntro: "《趣谈网络协议》云网络篇学习笔记：从虚拟网卡到 VXLAN，把云网络的四件大事（互通、SDN、安全、QoS、隔离）逐一拆开。",
    projectKicker: "我做的项目",
    projects: "项目",
    projectList: [
      { key: "eino", name: "eino-ext", description: "Eino 框架的各类扩展组件：模型接入、工具集成与编排能力" },
      { key: "doris", name: "doris-mcp-server", description: "Apache Doris 的 MCP Server，让 AI 应用通过标准接口查询 Doris" },
      { key: "velodb", name: "velodb-mcp-server", description: "VeloDB Cloud 与 Enterprise 的 MCP Server，接入云原生实时分析数据库" },
      { key: "microservices", name: "microservices-go-Start", description: "微服务实战 Go 完整示例代码，从零搭建一套微服务体系" },
    ],
    moreProjects: "查看所有项目",
    friendsKicker: "我认识的人",
    friends: "友链朋友圈",
    friendsIntro: "这里会收集朋友们最新发布的文章。先把朋友站点和 RSS 补上，它就会慢慢变成一个会更新的小圈子。",
    friendName: "朋友的名字",
    friendDescription: "这是一篇来自朋友博客的文章摘要待补。",
    friendPost: "朋友的最新文章标题",
    friendTime: "刚刚 · 日期待补",
    friendTabs: { subscribed: "订阅", active: "活跃", posts: "日志" },
    friendTabHints: {
      subscribed: "已收录的朋友站点",
      active: "最近有更新的朋友站点",
      posts: "朋友们最新发布的文章",
    },
    friendFooter: "等待第一位朋友的 RSS 更新……",
    visitFriend: "查看原文",
    read: "阅读：",
    posts: [
      { title: "第24讲 云中网络：自己拿地成本高，购买公寓更灵活", slug: "24-cloud-vm-network", summary: "云计算如何用虚拟化技术在物理机上“切出”虚拟机：从 TUN/TAP 虚拟网卡原理，到桥接与 NAT 两种互通方式，再到 VLAN 隔离的局限。", date: "2026-04-19", category: "学习笔记", tag: "虚拟化" },
      { title: "第25讲 软件定义网络：共享基础设施的小区物业管理办法", slug: "25-software-defined-network", summary: "软件定义网络（SDN）如何把网络的控制权集中起来：控制面与转发面分离、OpenFlow 与 OpenvSwitch 的流表机制，以及虚拟网络与物理网络的解耦。", date: "2026-04-19", category: "学习笔记", tag: "SDN" },
      { title: "第26讲 云中的网络安全：虽然不是土豪，也需要基本安全和保障", slug: "26-cloud-network-security", summary: "云上虚拟机如何做基本的安全防护：安全组与 ACL 的由来、Netfilter 五个钩子与 iptables 四表五链，以及 SNAT / DNAT 实现内外网互通。", date: "2026-04-26", category: "学习笔记", tag: "网络安全" },
      { title: "第27讲 云中的网络QoS：邻居疯狂下电影，我该怎么办？", slug: "27-cloud-network-qos", summary: "邻居虚拟机疯狂下电影把带宽占满怎么办：QoS 流量控制原理，从 TC 排队规则（SFQ、TBF）到 HTB 分层令牌桶，再到 OVS 上精准限速。", date: "2026-05-19", category: "学习笔记", tag: "QoS" },
      { title: "第28讲 云中网络的隔离GRE、VXLAN：虽然住一个小区，也要保护隐私", slug: "28-gre-vxlan", summary: "VLAN 只有 4096 个 ID，公有云百万租户怎么隔离：GRE 与 VXLAN 隧道封装、Overlay 网络、VTEP 的封装解封装，以及 OVS 多流表转发流水线。", date: "2026-05-20", category: "学习笔记", tag: "VXLAN" },
    ],
    pendingDate: "日期待补",
  },
  en: {
    tagline: "A place for the things you want to keep.",
    bio: "This is your short introduction: what you make, what you care about, or what you are exploring lately. You can replace it whenever you are ready.",
    avatar: "Avatar\npending",
    writingKicker: "WHAT I WRITE",
    articles: "Articles",
    categories: "Categories: ",
    category: "Category pending",
    tags: "Tags: ",
    tag: "#tag-pending",
    moreArticles: "View all articles",
    collectionIntro: "Study notes for the cloud-network chapters of 《趣谈网络协议》: from virtual NICs to VXLAN, unpacking connectivity, SDN, security, QoS and isolation one by one.",
    projectKicker: "WHAT I MAKE",
    projects: "Projects",
    projectList: [
      { key: "eino", name: "eino-ext", description: "Various extensions for the Eino framework" },
      { key: "doris", name: "doris-mcp-server", description: "Apache Doris MCP Server" },
      { key: "velodb", name: "velodb-mcp-server", description: "MCP Server for VeloDB Cloud & Enterprise" },
      { key: "microservices", name: "microservices-go-Start", description: "Complete code for the microservices-go" },
    ],
    moreProjects: "View all projects",
    friendsKicker: "PEOPLE I KNOW",
    friends: "Friends’ circle",
    friendsIntro: "A stream for your friends’ newest posts. Add their sites and RSS feeds first, then let this little circle update over time.",
    friendName: "Friend name pending",
    friendDescription: "An excerpt from a friend’s latest post goes here.",
    friendPost: "The latest post from this friend",
    friendTime: "Just now · Date pending",
    friendTabs: { subscribed: "Subscribed", active: "Active", posts: "Posts" },
    friendTabHints: {
      subscribed: "Sites collected in your circle",
      active: "Friends with recent updates",
      posts: "The newest posts from friends",
    },
    friendFooter: "Waiting for the first friend RSS update…",
    visitFriend: "Open post",
    read: "Read: ",
    posts: [
      { title: "第24讲 云中网络：自己拿地成本高，购买公寓更灵活", slug: "24-cloud-vm-network", summary: "How cloud computing carves VMs out of a physical host with virtualization: TUN/TAP virtual NICs, bridge vs NAT connectivity, and the limits of VLAN isolation.", date: "2026-04-19", category: "学习笔记", tag: "虚拟化" },
      { title: "第25讲 软件定义网络：共享基础设施的小区物业管理办法", slug: "25-software-defined-network", summary: "How SDN centralizes network control: control/forwarding plane separation, OpenFlow & OpenvSwitch flow tables, and decoupling virtual networks from physical ones.", date: "2026-04-19", category: "学习笔记", tag: "SDN" },
      { title: "第26讲 云中的网络安全：虽然不是土豪，也需要基本安全和保障", slug: "26-cloud-network-security", summary: "Basic security for cloud VMs: security groups & ACLs, Netfilter's five hooks and iptables' four tables, plus SNAT / DNAT for private-to-public connectivity.", date: "2026-04-26", category: "学习笔记", tag: "网络安全" },
      { title: "第27讲 云中的网络QoS：邻居疯狂下电影，我该怎么办？", slug: "27-cloud-network-qos", summary: "What to do when a neighbour VM hogs all the bandwidth: QoS traffic shaping, TC queueing (SFQ, TBF), the HTB token bucket, and per-tenant shaping in OVS.", date: "2026-05-19", category: "学习笔记", tag: "QoS" },
      { title: "第28讲 云中网络的隔离GRE、VXLAN：虽然住一个小区，也要保护隐私", slug: "28-gre-vxlan", summary: "How to isolate millions of tenants beyond VLAN's 4096 IDs: GRE & VXLAN tunnelling, overlay networks, VTEP encapsulation, and OVS multi-table pipelines.", date: "2026-05-20", category: "学习笔记", tag: "VXLAN" },
    ],
    pendingDate: "Date pending",
  },
} as const;

const tones = ["sky", "lemon", "violet", "rose"] as const;
const friendModes = ["subscribed", "active", "posts"] as const;
type FriendMode = (typeof friendModes)[number];

// 每篇文章的封面图（?url 打包出的静态资源地址）
const covers: Record<string, string> = {
  "24-cloud-vm-network": cover24,
  "25-software-defined-network": cover25,
  "26-cloud-network-security": cover26,
  "27-cloud-network-qos": cover27,
  "28-gre-vxlan": cover28,
};

// 项目卡的跳转地址与封面图（key 与 content.*.projectList 对应）
const projectLinks: Record<string, { href: string; image: string }> = {
  eino: { href: "https://github.com/cloudwego/eino-ext", image: projectEino },
  doris: { href: "https://github.com/apache/doris-mcp-server", image: projectDoris },
  velodb: { href: "https://github.com/velodb/velodb-mcp-server", image: projectVelo },
  microservices: { href: "https://github.com/Jmmt-mingrui/microservices-go-Start", image: projectMicro },
};

function HomeContent() {
  const { language, playTap } = useSitePreferences();
  const [friendMode, setFriendMode] = useState<FriendMode>("subscribed");
  const t = content[language];

  return (
    <>
      <section className="reference-hero">
        <div className="reference-hero-copy">
          <h1>Hi, Jmmt-mingrui</h1>
          <p className="reference-tagline">{t.tagline}</p>
          <p className="reference-bio">{t.bio}</p>
          <div className="social-row" aria-label={language === "zh" ? "社交链接占位" : "Social link placeholders"}>
            <a href="/archive#rss" aria-label="RSS" onClick={playTap}>◔</a>
            <a href="/about" aria-label="X" onClick={playTap}>𝕏</a>
            <a href="https://github.com/Jmmt-mingrui" target="_blank" rel="noopener noreferrer" aria-label="GitHub" onClick={playTap}>⌘</a>
            <a href="/about" aria-label="Telegram" onClick={playTap}>➤</a>
            <a href="/about" aria-label={language === "zh" ? "邮箱" : "Email"} onClick={playTap}>✉</a>
          </div>
        </div>
        <div className="avatar-stub" aria-label={t.avatar.replace("\n", " ")}>
          <div className="avatar-stub-grid" />
          <span>{t.avatar.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</span>
        </div>
      </section>

      <ScrollReveal>
        <section className="reference-section" id="articles">
          <p className="section-kicker">{t.writingKicker}</p>
          <h2>{t.articles}</h2>
          <p className="collection-intro">{t.collectionIntro}</p>
          <div className="taxonomy">
            <p>{t.categories}<a href="/writing" onClick={playTap}>学习笔记 (5)</a></p>
            <p>{t.tags}<a href="/writing" onClick={playTap}>网络协议 (5)</a>、<a href="/writing" onClick={playTap}>云计算 (5)</a></p>
          </div>
          <div className="post-list">
            {t.posts.map((post, index) => (
              <article className="post-preview" key={post.title}>
                <div className="post-preview-sheet" aria-hidden="true" />
                <div className="post-preview-frame" aria-hidden="true" />
                <div className="post-preview-inner">
                  <div className="post-copy">
                    <h3><a href={`/writing/${post.slug}`} onClick={playTap}>{post.title}<span aria-hidden="true"> ↗</span></a></h3>
                    <p>{post.summary}</p>
                    <small>{post.date} · <a href={`/writing/${post.slug}`} onClick={playTap}>{post.category}</a> · <a href={`/writing/${post.slug}`} onClick={playTap}>{post.tag}</a></small>
                  </div>
                  <a className={`post-cover post-cover-${tones[index % tones.length]}`} href={`/writing/${post.slug}`} aria-label={`${t.read}${post.title}`} onClick={playTap}>
                    {covers[post.slug] ? <img src={covers[post.slug]} alt="" /> : <span>{String(index + 1).padStart(2, "0")}</span>}
                  </a>
                </div>
              </article>
            ))}
          </div>
          <a className="more-link" href="/writing" onClick={playTap}>{t.moreArticles} <span aria-hidden="true">↗</span></a>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={60}>
        <section className="reference-section project-section" id="projects">
          <p className="section-kicker">{t.projectKicker}</p>
          <h2>{t.projects}</h2>
          <div className="project-reference-grid">
            {t.projectList.map((project) => {
              const link = projectLinks[project.key];
              return (
                <a className="reference-project" href={link.href} target="_blank" rel="noopener noreferrer" key={project.key} onClick={playTap}>
                  <div className="project-image"><img src={link.image} alt={`${project.name} logo`} loading="lazy" /></div>
                  <h3>{project.name} <span aria-hidden="true">↗</span></h3>
                  <p>{project.description}</p>
                </a>
              );
            })}
          </div>
          <a className="more-link" href="/projects" onClick={playTap}>{t.moreProjects} <span aria-hidden="true">↗</span></a>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={120}>
        <section className="reference-section friend-section" id="friends">
        <p className="section-kicker">{t.friendsKicker}</p>
        <div className="friend-heading">
          <div>
            <h2>{t.friends}</h2>
            <p>{t.friendsIntro}</p>
          </div>
          <span className="friend-count" aria-label={language === "zh" ? "朋友链接占位数量" : "Friend link placeholders"}><i aria-hidden="true" />00</span>
        </div>
        <div className="friend-circle">
          <div className="friend-tabs" role="tablist" aria-label={t.friends}>
            {friendModes.map((mode) => (
              <button className={friendMode === mode ? "is-active" : ""} type="button" role="tab" aria-selected={friendMode === mode} key={mode} onClick={() => { playTap(); setFriendMode(mode); }}>
                <span>{t.friendTabs[mode]}</span><b>00</b>
              </button>
            ))}
            <p>{t.friendTabHints[friendMode]}</p>
          </div>
          <div className="friend-feed" aria-live="polite">
            {Array.from({ length: 4 }, (_, index) => (
              <article className={`friend-feed-item friend-feed-item-${index + 1}`} key={index}>
                <span className="friend-avatar" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div className="friend-feed-copy">
                  <p><strong>{t.friendName}</strong><time>{t.friendTime}</time></p>
                  <h3>{t.friendPost}</h3>
                  <small>{t.friendDescription}</small>
                </div>
                <a className="friend-visit" href="/archive#friends" aria-label={`${t.visitFriend}: ${t.friendPost}`} onClick={playTap}><b aria-hidden="true">↗</b></a>
              </article>
            ))}
          </div>
          <p className="friend-footer"><span aria-hidden="true">~</span>{t.friendFooter}</p>
        </div>
        </section>
      </ScrollReveal>
    </>
  );
}

export default function Home() {
  return <SiteShell><HomeContent /></SiteShell>;
}
