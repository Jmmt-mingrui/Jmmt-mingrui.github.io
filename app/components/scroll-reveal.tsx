"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * 滚动进入视口时淡入上移的容器。
 * 尊重 prefers-reduced-motion：系统要求减弱动效时直接显示，不做动画。
 */
export function ScrollReveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.classList.add("is-revealed");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            element.classList.add("is-revealed");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`scroll-reveal ${className}`} style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}
