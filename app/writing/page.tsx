import Link from "next/link";
import { SiteShell } from "../components/site-shell";

const posts = [
  {
    date: "2026-04-19",
    title: "第24讲 云中网络：自己拿地成本高，购买公寓更灵活",
    slug: "24-cloud-vm-network",
    summary: "云计算如何用虚拟化技术在物理机上“切出”虚拟机：从 TUN/TAP 虚拟网卡原理，到桥接与 NAT 两种互通方式，再到 VLAN 隔离的局限，一步步理解云网络要解决的共享、互通、隔离、灵活四大痛点。",
  },
  {
    date: "2026-04-19",
    title: "第25讲 软件定义网络：共享基础设施的小区物业管理办法",
    slug: "25-software-defined-network",
    summary: "软件定义网络（SDN）如何把网络的控制权集中起来：控制面与转发面分离、OpenFlow 与 OpenvSwitch 的流表机制、VLAN 端口类型与网卡绑定，以及虚拟网络与物理网络的彻底解耦。",
  },
  {
    date: "2026-04-26",
    title: "第26讲 云中的网络安全：虽然不是土豪，也需要基本安全和保障",
    slug: "26-cloud-network-security",
    summary: "云上虚拟机如何做基本的安全防护：安全组与 ACL 的由来、Netfilter 的五个钩子与 iptables 四表五链，以及 SNAT / DNAT 如何让私网虚拟机出网和对外提供服务。",
  },
  {
    date: "2026-05-19",
    title: "第27讲 云中的网络QoS：邻居疯狂下电影，我该怎么办？",
    slug: "27-cloud-network-qos",
    summary: "邻居虚拟机疯狂下电影把带宽占满了怎么办：QoS 流量控制原理，从 TC 的无类别与有类别排队规则（SFQ、TBF、HTB），到 OVS 上结合流表为不同租户精准限速。",
  },
  {
    date: "2026-05-20",
    title: "第28讲 云中网络的隔离GRE、VXLAN：虽然住一个小区，也要保护隐私",
    slug: "28-gre-vxlan",
    summary: "VLAN 只有 4096 个 ID，公有云百万租户怎么隔离：GRE 与 VXLAN 隧道封装技术、Overlay 网络、VTEP 的封装解封装与 ARP 广播学习，以及 OVS 多流表转发流水线。",
  },
];

export default function WritingPage() {
  return (
    <SiteShell>
      <section className="inner-hero inner-hero-yellow">
        <p className="eyebrow">WRITING / 文章</p>
        <h1>《趣谈网络协议》云网络篇学习笔记</h1>
        <p>第一个合集：从虚拟网卡到 VXLAN，把云网络的互通、SDN、安全、QoS 与隔离逐一拆开。正文与图片存放在 <code>content/posts/</code>。</p>
      </section>
      <section className="placeholder-list" aria-label="文章列表">
        {posts.map((post) => (
          <article key={post.title}>
            <span>{post.date}</span>
            <h2><Link href={`/writing/${post.slug}`}>{post.title}<span aria-hidden="true"> ↗</span></Link></h2>
            <p>{post.summary}</p>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
