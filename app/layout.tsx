import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hi, Jmmt-mingrui",
  description: "一个等待被填充的个人博客与公开档案。",
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
