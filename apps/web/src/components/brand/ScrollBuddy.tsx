"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

// Eye centres in the mascot's viewBox (0 0 29 26).
const EYES = [
  { cx: 9.03, cy: 12.93 },
  { cx: 19.38, cy: 12.93 },
];
const EYE_LINE = 12.93; // vertical axis the eyes blink around

// The bracket-face outline path, copied verbatim from the brand Mascot.
const FACE_PATH =
  "M19.6456 23.0954C18.4731 23.0954 17.4396 23.3233 16.5453 23.7792C15.6509 24.2153 15.0746 24.7902 14.8162 25.5038H13.4747C12.8189 23.8982 11.2786 23.0954 8.85395 23.0954H5.12754C3.31898 23.0954 2.01723 22.689 1.22226 21.8763C0.407417 21.0636 0 19.7751 0 18.011V16.7622H1.96754V18.1002C1.96754 18.9723 2.16628 19.6067 2.56376 20.0031C2.96124 20.3995 3.60717 20.5978 4.50151 20.5978H9.68868C10.5234 20.5978 11.2985 20.7762 12.014 21.133C12.7096 21.4898 13.425 22.0646 14.1604 22.8575H14.369C15.164 22.0448 15.8994 21.4699 16.5751 21.133C17.2508 20.7762 17.9762 20.5978 18.7513 20.5978H24.2664C25.1806 20.5978 25.8365 20.3995 26.234 20.0031C26.6513 19.6067 26.86 18.9723 26.86 18.1002V16.7622H28.8275V18.1299C28.8275 19.9337 28.44 21.2123 27.6649 21.9655C26.8898 22.7187 25.5682 23.0954 23.7 23.0954H19.6456ZM23.7 2.4084C25.5682 2.4084 26.8898 2.78502 27.6649 3.53826C28.44 4.29151 28.8275 5.57004 28.8275 7.37387V8.7416H26.86V7.4036C26.86 6.53142 26.6513 5.89711 26.234 5.50067C25.8365 5.10422 25.1806 4.906 24.2664 4.906H18.7513C17.9762 4.906 17.2508 4.73751 16.5751 4.40053C15.8994 4.04373 15.164 3.45898 14.369 2.64627H14.1604C13.425 3.43916 12.7096 4.014 12.014 4.3708C11.2985 4.7276 10.5234 4.906 9.68868 4.906H4.50151C3.60717 4.906 2.96124 5.10422 2.56376 5.50067C2.16628 5.89711 1.96754 6.53142 1.96754 7.4036V8.7416H0V7.4928C0 5.7088 0.407417 4.42036 1.22226 3.62747C2.01723 2.81476 3.31898 2.4084 5.12754 2.4084H8.85395C11.2786 2.4084 12.8189 1.6056 13.4747 0H14.8162C15.0746 0.7136 15.6509 1.29836 16.5453 1.75427C17.4396 2.19036 18.4731 2.4084 19.6456 2.4084H23.7Z";

/**
 * A companion mascot that slides in on the left once you scroll past the hero,
 * tracks the cursor with its eyes, blinks excitedly over the register section,
 * and returns "home" (slides away) when you scroll back to the top. Purely
 * decorative and pointer-events-none, so it can never intercept clicks.
 */
export function ScrollBuddy() {
  const reduced = usePrefersReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const [visible, setVisible] = useState(false);
  const [excited, setExcited] = useState(false);

  // Eye position (tracking) + blink openness, applied together every frame.
  const track = useRef({ x: 0, y: 0 });
  const openness = useRef(1); // 1 = open, 0 = fully closed

  // Cursor-tracking eyes + blink render loop (no per-frame React re-renders).
  useEffect(() => {
    const target = { x: 0, y: 0 };
    let raf = 0;

    const aim = (px: number, py: number) => {
      const el = cardRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = px - cx;
      const dy = py - cy;
      const d = Math.hypot(dx, dy) || 1;
      const max = 1.9; // travel in viewBox units
      const strength = Math.min(1, d / 240);
      target.x = (dx / d) * max * strength;
      target.y = (dy / d) * max * strength;
    };

    const onMove = (e: MouseEvent) => {
      if (reduced) return;
      aim(e.clientX, e.clientY);
    };

    // Phones have no cursor: track the active touch point instead.
    const onTouch = (e: TouchEvent) => {
      if (reduced) return;
      const t = e.touches[0];
      if (t) aim(t.clientX, t.clientY);
    };

    const tick = () => {
      track.current.x += (target.x - track.current.x) * 0.15;
      track.current.y += (target.y - track.current.y) * 0.15;
      const g = eyesRef.current;
      if (g) {
        const s = openness.current;
        g.setAttribute(
          "transform",
          `translate(${track.current.x.toFixed(3)} ${track.current.y.toFixed(3)}) ` +
            `translate(0 ${EYE_LINE}) scale(1 ${s.toFixed(3)}) translate(0 ${-EYE_LINE})`,
        );
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchstart", onTouch);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  // Show after the hero; hide near the top ("jumps back to his place").
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Detect when the register section is on screen -> get excited.
  useEffect(() => {
    const el = document.getElementById("register");
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setExcited(entry.isIntersecting && entry.intersectionRatio > 0.25);
      },
      { threshold: [0, 0.25, 0.5] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Blink loop while excited ("hey, what are you waiting for?").
  useEffect(() => {
    if (!excited || reduced) {
      openness.current = 1;
      return;
    }
    let cancelled = false;

    const animate = (from: number, to: number, dur: number) =>
      new Promise<void>((resolve) => {
        const start = performance.now();
        const step = () => {
          if (cancelled) return resolve();
          const p = Math.min(1, (performance.now() - start) / dur);
          openness.current = from + (to - from) * p;
          if (p < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });

    const blinkOnce = async () => {
      await animate(1, 0.05, 90); // close
      await animate(0.05, 0.05, 60); // hold
      await animate(0.05, 1, 130); // open
    };

    const doubleBlink = async () => {
      await blinkOnce();
      if (cancelled) return;
      await new Promise((r) => setTimeout(r, 140));
      if (cancelled) return;
      await blinkOnce();
    };

    doubleBlink();
    const id = setInterval(doubleBlink, 2200);
    return () => {
      cancelled = true;
      clearInterval(id);
      openness.current = 1;
    };
  }, [excited, reduced]);

  return (
    // Outer element owns the positioning (bottom-right on mobile so it clears
    // the left-aligned content, left-centre on desktop) so framer's transform
    // on the inner element doesn't clobber it.
    <div className="pointer-events-none fixed bottom-4 right-3 z-40 lg:bottom-auto lg:left-4 lg:right-auto lg:top-1/2 lg:-translate-y-1/2">
      <motion.div
        ref={cardRef}
        initial={false}
        animate={
          visible
            ? { y: 0, opacity: 1, scale: excited ? 1.06 : 1 }
            : { y: 32, opacity: 0, scale: 0.8 }
        }
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <motion.div
          animate={reduced ? undefined : { y: [0, -10, 0] }}
          transition={reduced ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 rounded-full bg-orange/30 blur-3xl" />
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-navy/70 shadow-glow backdrop-blur lg:h-24 lg:w-24 lg:rounded-3xl">
            <svg
              viewBox="0 0 29 26"
              aria-hidden
              className="h-8 w-auto drop-shadow-[0_0_18px_rgba(255,107,61,0.6)] lg:h-14"
              fill="none"
            >
              <path d={FACE_PATH} fill="#FF6B3D" />
              <g ref={eyesRef}>
                {EYES.map((e, i) => (
                  <circle key={i} cx={e.cx} cy={e.cy} r={1.65} fill="#FF6B3D" />
                ))}
              </g>
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
