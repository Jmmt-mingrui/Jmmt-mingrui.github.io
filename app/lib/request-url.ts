import { headers } from "next/headers";
import { siteConfig } from "../site-config";

export async function getRequestOrigin(): Promise<string> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  if (!host) return siteConfig.url;
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto")?.split(",", 1)[0];
  const protocol = forwardedProtocol ?? (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  return `${protocol}://${host}`;
}
