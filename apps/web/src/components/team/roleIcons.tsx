/**
 * Accent colours per orbiting role, in the same order as the translated
 * `team.members` array: Analyst, Designer, Developer, QA, Stakeholder.
 * The PM core keeps the brand orange.
 */
export const TEAM_ACCENTS = ["#5B8DEF", "#9B6DFF", "#3DDC84", "#F5A524", "#E23B3B"];

/**
 * Simple stroke icons so each node reads as an actual role at a glance rather
 * than an abstract shape.
 */
export function RoleIcon({ index, className }: { index: number; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (index) {
    // Analyst — bar chart / requirements
    case 0:
      return (
        <svg {...common} aria-hidden>
          <path d="M4 20V10M9 20V4M14 20v-7M19 20V8" />
          <path d="M3 20h18" opacity={0.5} />
        </svg>
      );
    // Designer — pen nib
    case 1:
      return (
        <svg {...common} aria-hidden>
          <path d="M12 3l7 7-9 9-5 1 1-5 6-6z" />
          <path d="M11 6l7 7" opacity={0.5} />
          <circle cx="9" cy="15" r="1.1" />
        </svg>
      );
    // Developer — code brackets
    case 2:
      return (
        <svg {...common} aria-hidden>
          <path d="M8.5 8L4 12l4.5 4M15.5 8L20 12l-4.5 4" />
          <path d="M13 6l-2 12" opacity={0.5} />
        </svg>
      );
    // QA — checked shield / testing
    case 3:
      return (
        <svg {...common} aria-hidden>
          <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    // Stakeholder — briefcase / business
    default:
      return (
        <svg {...common} aria-hidden>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
          <path d="M3 12h18" opacity={0.5} />
        </svg>
      );
  }
}
