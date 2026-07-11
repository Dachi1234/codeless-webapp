import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function ensureScrollTrigger() {
  if (typeof window !== "undefined" && !registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }

  return { gsap, ScrollTrigger };
}

export function refreshScrollTriggers() {
  if (typeof window === "undefined") return;
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

export { gsap, ScrollTrigger };
