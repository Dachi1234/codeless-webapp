"use client";

import { useEffect, useRef, useState } from "react";

export type OutcomeStat = {
  value: number;
  suffix: string;
  label: string;
};

function Counter({ stat, reducedMotion }: { stat: OutcomeStat; reducedMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(reducedMotion ? stat.value : 0);

  useEffect(() => {
    if (reducedMotion) {
      setValue(stat.value);
      return;
    }

    const element = ref.current;
    if (!element) return;

    let animationFrame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const started = performance.now();
        const duration = 900;
        const tick = (now: number) => {
          const progress = Math.min(1, (now - started) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(stat.value * eased));
          if (progress < 1) animationFrame = requestAnimationFrame(tick);
        };
        animationFrame = requestAnimationFrame(tick);
      },
      { threshold: 0.45 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [reducedMotion, stat.value]);

  return (
    <div ref={ref} className="border-t border-white/15 pt-5">
      <p className="font-display text-5xl font-extrabold tracking-tight text-ink sm:text-6xl">
        {value}
        <span className="ml-1 text-2xl text-orange sm:text-3xl">{stat.suffix}</span>
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{stat.label}</p>
    </div>
  );
}

export function OutcomeCounters({
  stats,
  reducedMotion,
}: {
  stats: OutcomeStat[];
  reducedMotion: boolean;
}) {
  return (
    <div className="grid gap-7 sm:grid-cols-3">
      {stats.map((stat) => (
        <Counter key={`${stat.value}-${stat.label}`} stat={stat} reducedMotion={reducedMotion} />
      ))}
    </div>
  );
}
