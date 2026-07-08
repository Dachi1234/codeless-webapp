const STYLES: Record<string, string> = {
  NEW: "bg-orange/15 text-orange border-orange/30",
  CONTACTED: "bg-success/15 text-success border-success/30",
  ARCHIVED: "bg-white/5 text-muted border-white/15",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        STYLES[status] ?? STYLES.ARCHIVED
      }`}
    >
      {status}
    </span>
  );
}
