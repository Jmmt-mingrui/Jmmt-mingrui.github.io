import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "./site-config";
import { getRequestOrigin } from "./lib/request-url";

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getRequestOrigin();
  const socialImage = new URL("/og.png", origin).href;
  return {
    metadataBase: new URL(origin),
    title: { default: siteConfig.title, template: `%s · ${siteConfig.name}` },
    description: siteConfig.description,
    alternates: { canonical: "/", types: { "application/rss+xml": "/feed" } },
    openGraph: {
      type: "website",
      locale: "zh_CN",
      title: siteConfig.title,
      description: siteConfig.description,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
      images: [socialImage],
    },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
