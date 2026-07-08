import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  title: string;
  subtitle?: string;
  orange?: boolean;
  className?: string;
  align?: "center" | "left";
};

export function SectionHeading({
  label,
  title,
  subtitle,
  orange = true,
  className,
  align = "center",
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <Reveal>
        <span className={orange ? "eyebrow-orange" : "eyebrow"}>{label}</span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "max-w-2xl text-base leading-relaxed text-muted sm:text-lg",
              align === "center" && "mx-auto",
            )}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
