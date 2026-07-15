"use client";

import { useEffect, useRef, type Ref } from "react";
import { motion } from "framer-motion";
import { ensureScrollTrigger, refreshScrollTriggers } from "@/lib/motion/gsap";

export type ShredderCopy = {
  label: string;
  title: string;
  paperLabel: string;
  paperLines: string[];
  shredLabel: string;
  outcomes: string[];
};

// Paper-shred confetti palette: three warm paper tones + one brand-orange fleck.
const SHRED_COLORS = ["#ECE8DD", "#D8D3C6", "#C2BDB0", "#FF6B3D"];

function PaperSheet({
  paperLabel,
  paperLines,
  innerRef,
}: {
  paperLabel: string;
  paperLines: string[];
  innerRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={innerRef}
      className="w-full rounded-t-md bg-paper px-7 py-6 text-navy-950 shadow-[0_20px_50px_rgba(0,0,0,0.45)] will-change-transform"
    >
      <div className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-navy-950/45">
        {paperLabel}
      </div>
      <div className="font-display text-lg font-semibold leading-[1.75] sm:text-xl">
        {paperLines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </div>
  );
}

function ShredderBar({ innerRef }: { innerRef?: Ref<HTMLDivElement> }) {
  return (
    <div
      ref={innerRef}
      className="relative h-6 rounded-[5px] bg-gradient-to-b from-[#2a2f3d] to-[#12151f] shadow-[0_10px_30px_rgba(0,0,0,0.6),inset_0_2px_0_rgba(255,255,255,0.06)]"
    >
      <div className="absolute inset-x-3 top-1/2 h-[3px] -translate-y-1/2 rounded-[2px] bg-[repeating-linear-gradient(90deg,#0E1526_0_9px,transparent_9px_15px)]" />
    </div>
  );
}

function Outcomes({ shredLabel, outcomes }: { shredLabel: string; outcomes: string[] }) {
  return (
    <div data-shred-outcomes className="mt-9 text-center">
      <div
        data-out
        className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-orange-bright opacity-0"
      >
        {shredLabel}
      </div>
      <div className="flex flex-col gap-2.5 font-display text-xl font-extrabold sm:text-2xl md:text-[1.8rem]">
        {outcomes.map((outcome, index) => (
          <span
            key={outcome}
            data-out
            className={`opacity-0 ${index === outcomes.length - 1 ? "text-orange" : "text-ink"}`}
          >
            {outcome}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Desktop `full` tier: a 220vh section with a CSS-sticky stage (matching the
 * original prototype), driving a canvas paper-shred burst from scroll progress.
 * Uses sticky + ScrollTrigger progress (not GSAP pin) so it plays nicely with
 * the Lenis smooth-scroll wrapper.
 */
export function CompareShredder({ copy }: { copy: ShredderCopy }) {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const outsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const paper = paperRef.current;
    const bar = barRef.current;
    const outsWrap = outsRef.current;
    if (!root || !canvas || !paper || !bar || !outsWrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const outs = Array.from(outsWrap.querySelectorAll<HTMLElement>("[data-out]"));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const sizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    type Part = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      w: number;
      h: number;
      rot: number;
      vr: number;
      life: number;
      color: string;
    };
    const parts: Part[] = [];

    const emit = (count: number) => {
      const canvasRect = canvas.getBoundingClientRect();
      const barRect = bar.getBoundingClientRect();
      const y = barRect.top - canvasRect.top + barRect.height;
      const x0 = barRect.left - canvasRect.left;
      const w = barRect.width;
      for (let i = 0; i < count; i += 1) {
        parts.push({
          x: x0 + Math.random() * w,
          y: y + Math.random() * 6,
          vx: (Math.random() - 0.5) * 1.3,
          vy: 1 + Math.random() * 2.2,
          w: 3 + Math.random() * 4,
          h: 12 + Math.random() * 22,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.22,
          life: 1,
          color: SHRED_COLORS[(Math.random() * SHRED_COLORS.length) | 0]!,
        });
      }
    };

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = parts.length - 1; i >= 0; i -= 1) {
        const p = parts[i]!;
        p.vy += 0.05;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= 0.006;
        if (p.life <= 0 || p.y > height + 40) {
          parts.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    let fired = false;
    const { gsap, ScrollTrigger } = ensureScrollTrigger();
    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        const consumed = Math.min(p / 0.42, 1);
        paper.style.transform = `translateY(${consumed * 300}px)`;
        paper.style.opacity = String(1 - Math.max(0, (consumed - 0.7) / 0.3));

        if (p > 0.4 && !fired) {
          emit(70);
          fired = true;
        }
        if (p < 0.35) fired = false;
        if (p > 0.36 && p < 0.55 && Math.random() < 0.5) emit(2);

        outs.forEach((out, index) => {
          const start = 0.5 + index * 0.08;
          const t = Math.min(Math.max((p - start) / 0.12, 0), 1);
          out.style.opacity = String(t);
          out.style.transform = `translateY(${(1 - t) * 16}px)`;
        });
      },
    });

    refreshScrollTriggers();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", sizeCanvas);
      trigger.kill();
      gsap.set(paper, { clearProps: "all" });
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      id="compare"
      ref={rootRef}
      className="relative h-[220vh]"
      aria-labelledby="compare-title"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden bg-navy-950 px-5">
        <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 z-10 h-full w-full" />

        <div className="relative z-20 flex w-full max-w-[520px] flex-col items-center">
          <div className="mb-6 text-center sm:mb-9">
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-orange">
              {copy.label}
            </div>
            <h2 id="compare-title" className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              {copy.title}
            </h2>
          </div>

          <div className="w-full">
            <div className="flex h-[210px] items-end justify-center overflow-hidden">
              <PaperSheet innerRef={paperRef} paperLabel={copy.paperLabel} paperLines={copy.paperLines} />
            </div>
            <ShredderBar innerRef={barRef} />
            <div ref={outsRef}>
              <Outcomes shredLabel={copy.shredLabel} outcomes={copy.outcomes} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** `lite` tier: same story without the canvas/pin — reveal on scroll. */
export function CompareShredderLite({ copy }: { copy: ShredderCopy }) {
  return (
    <section id="compare" className="section py-20 sm:py-28" aria-labelledby="compare-title">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-orange">
          {copy.label}
        </div>
        <h2 id="compare-title" className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
          {copy.title}
        </h2>

        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 0.35, y: 40 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <PaperSheet paperLabel={copy.paperLabel} paperLines={copy.paperLines} />
        </motion.div>
        <div className="mt-1">
          <ShredderBar />
        </div>

        <div className="mt-8">
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-orange-bright">
            {copy.shredLabel}
          </div>
          <div className="flex flex-col gap-2.5 font-display text-xl font-extrabold sm:text-2xl">
            {copy.outcomes.map((outcome, index) => (
              <motion.span
                key={outcome}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={index === copy.outcomes.length - 1 ? "text-orange" : "text-ink"}
              >
                {outcome}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** `static` tier: accessible before/after lists, no motion. */
export function CompareShredderStatic({ copy }: { copy: ShredderCopy }) {
  return (
    <section id="compare" className="section py-20 sm:py-24" aria-labelledby="compare-title">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-orange">
          {copy.label}
        </div>
        <h2 id="compare-title" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {copy.title}
        </h2>
      </div>
      <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-muted">
            {copy.paperLabel}
          </p>
          <ul className="space-y-2 text-muted line-through">
            {copy.paperLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div className="card-us p-6">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-orange-bright">
            {copy.shredLabel}
          </p>
          <ul className="space-y-2 font-semibold text-ink">
            {copy.outcomes.map((outcome, index) => (
              <li key={outcome} className={index === copy.outcomes.length - 1 ? "text-orange" : ""}>
                {outcome}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
