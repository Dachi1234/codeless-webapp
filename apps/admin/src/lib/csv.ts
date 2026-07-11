const FORMULA_PREFIX = /^[=+\-@\t\r]/;

export function csvCell(value: unknown): string {
  const raw = value === null || value === undefined ? "" : String(value);
  const safe = FORMULA_PREFIX.test(raw) ? `'${raw}` : raw;

  if (/[",\n\r]/.test(safe)) {
    return `"${safe.replace(/"/g, '""')}"`;
  }

  return safe;
}
