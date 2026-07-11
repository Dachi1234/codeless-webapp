"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { ensureScrollTrigger, gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect reduced-motion: skip inertia scrolling entirely.
    if (reduced) return;
    ensureScrollTrigger();

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const onRaf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    // Smoothly handle in-page anchor links via Lenis (no native-scroll conflict).
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -72 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(onRaf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  return <>{children}</>;
}
