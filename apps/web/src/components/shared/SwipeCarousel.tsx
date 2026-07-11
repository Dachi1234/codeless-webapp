"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SwipeCarouselProps = {
  count: number;
  /** Renders one full-width panel. `active` is true for the snapped panel. */
  renderPanel: (index: number, active: boolean) => ReactNode;
  renderHeader?: (active: number) => ReactNode;
  renderFooter?: (active: number) => ReactNode;
  panelClassName?: string;
  scrollerClassName?: string;
  className?: string;
  ariaLabel?: string;
};

/**
 * Native horizontal swipe carousel: real finger-swipe with CSS scroll-snap and
 * momentum — no scroll hijacking. The snapped panel index is derived from
 * `scrollLeft` and exposed to the header/footer/panels so they can react
 * (progress steppers, dots, per-panel animations).
 */
export function SwipeCarousel({
  count,
  renderPanel,
  renderHeader,
  renderFooter,
  panelClassName,
  scrollerClassName,
  className,
  ariaLabel,
}: SwipeCarouselProps) {
  const [active, setActive] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const onScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const width = first?.offsetWidth || el.clientWidth || 1;
    const idx = Math.max(0, Math.min(count - 1, Math.round(el.scrollLeft / width)));
    setActive((current) => (current === idx ? current : idx));
  }, [count]);

  return (
    <div className={className}>
      {renderHeader?.(active)}
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        role="group"
        aria-label={ariaLabel}
        className={cn(
          "flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          scrollerClassName,
        )}
      >
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className={cn("w-full shrink-0 snap-center", panelClassName)}>
            {renderPanel(index, index === active)}
          </div>
        ))}
      </div>
      {renderFooter?.(active)}
    </div>
  );
}

/** Shared dot progress indicator for the carousels. */
export function CarouselDots({ count, active }: { count: number; active: number }) {
  return (
    <div className="mt-6 flex items-center justify-center gap-2" aria-hidden>
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className="h-1.5 rounded-full bg-orange transition-all duration-300"
          style={{ width: index === active ? 24 : 6, opacity: index === active ? 1 : 0.3 }}
        />
      ))}
    </div>
  );
}
