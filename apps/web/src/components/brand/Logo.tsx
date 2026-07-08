import { cn } from "@/lib/utils";
import { Mascot } from "./Mascot";

type LogoProps = {
  className?: string;
  markClassName?: string;
  wordmark?: boolean;
  glow?: boolean;
};

/** Horizontal lockup: bracket mascot + "CodeLess" wordmark (matched rounded sans). */
export function Logo({ className, markClassName, wordmark = true, glow = false }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Mascot className={cn("h-7 w-auto", markClassName)} glow={glow} />
      {wordmark && (
        <span className="font-display text-xl font-bold tracking-tight text-ink">
          Code<span className="text-ink">Less</span>
        </span>
      )}
    </span>
  );
}
