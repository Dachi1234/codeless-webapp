"use client";

import { useCallback, useRef } from "react";

export function usePointerTilt(disabled = false, maxDegrees = 8) {
  const frame = useRef<number | null>(null);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (disabled) return;
      const element = event.currentTarget;
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        element.style.setProperty("--tilt-x", `${-y * maxDegrees}deg`);
        element.style.setProperty("--tilt-y", `${x * maxDegrees}deg`);
        element.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`);
        element.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`);
      });
    },
    [disabled, maxDegrees],
  );

  const onPointerLeave = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (frame.current) cancelAnimationFrame(frame.current);
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
    event.currentTarget.style.setProperty("--glow-x", "50%");
    event.currentTarget.style.setProperty("--glow-y", "50%");
  }, []);

  return { onPointerMove, onPointerLeave };
}
