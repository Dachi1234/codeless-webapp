"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ScrollProgressOptions = {
  /**
   * Called on every animation frame while the tracked element is on-screen.
   * Keep it cheap — this fires at display refresh rate. Read `progressRef`
   * inside a WebGL render loop instead of driving React state per frame.
   */
  onFrame?: (progress: number) => void;
};

/**
 * Tracks how far the viewport has scrolled through a tall container, returning
 * a 0..1 progress value. Designed for a native `position: sticky` stage inside
 * a taller wrapper — no scroll hijacking, no smooth-scroll coupling, so it is
 * robust on touch devices.
 *
 * The rAF loop only runs while the container intersects the viewport, so the
 * work (and any attached WebGL canvas) idles when the section is off-screen.
 */
export function useScrollProgress({ onFrame }: ScrollProgressOptions = {}) {
  const containerRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef(0);
  const [inView, setInView] = useState(false);
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;

  const setRef = useCallback((node: HTMLElement | null) => {
    containerRef.current = node;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId: number | null = null;
    let running = false;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const progress = distance <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / distance));
      progressRef.current = progress;
      onFrameRef.current?.(progress);
    };

    const loop = () => {
      measure();
      if (running) rafId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setInView(visible);
        if (visible) start();
        else stop();
      },
      { threshold: 0 },
    );

    observer.observe(el);
    measure();

    return () => {
      observer.disconnect();
      stop();
    };
  }, []);

  return { setContainerRef: setRef, progressRef, inView };
}
