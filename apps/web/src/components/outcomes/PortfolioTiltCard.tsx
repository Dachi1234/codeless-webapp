"use client";

import { usePointerTilt } from "@/lib/motion/usePointerTilt";

type PortfolioTiltCardProps = {
  disabled: boolean;
  eyebrow: string;
  role: string;
  project: string;
  shipped: string;
  highlights: string[];
};

export function PortfolioTiltCard({
  disabled,
  eyebrow,
  role,
  project,
  shipped,
  highlights,
}: PortfolioTiltCardProps) {
  const tilt = usePointerTilt(disabled);

  return (
    <article
      {...tilt}
      className="group relative mx-auto w-full max-w-lg rounded-[2rem] border border-orange/45 bg-navy-950/95 p-6 shadow-glow transition-transform duration-200 ease-out [transform:perspective(1100px)_rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))] [transform-style:preserve-3d] sm:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-50 transition-opacity group-hover:opacity-80"
        style={{
          background:
            "radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(255,107,61,0.28), transparent 42%)",
        }}
      />

      <div className="relative [transform:translateZ(30px)]">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-orange">
            {eyebrow}
          </span>
          <span className="flex items-center gap-2 rounded-full border border-success/35 bg-success/10 px-3 py-1 text-[11px] font-semibold text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            {shipped}
          </span>
        </div>

        <div className="mt-12">
          <p className="text-sm uppercase tracking-[0.15em] text-muted">{role}</p>
          <h3 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">{project}</h3>
        </div>

        <div className="mt-10 grid gap-3">
          {highlights.map((highlight, index) => (
            <div
              key={highlight}
              className="flex items-center gap-3 border-t border-white/10 pt-3 text-sm text-muted"
            >
              <span className="font-mono text-xs text-orange">
                {String(index + 1).padStart(2, "0")}
              </span>
              {highlight}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
