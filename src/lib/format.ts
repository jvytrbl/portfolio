// Deterministic formatting (fixed locale + UTC) so server-rendered output
// never differs from what the browser would produce.

const monthYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "2026-09-01T00:00:00.000Z" → "Sep 2026" */
export function formatDate(iso: string): string {
  return monthYear.format(new Date(iso));
}

/** "2024-03" → "Mar 2024" */
export function formatYearMonth(value: string): string {
  return monthYear.format(new Date(`${value}-01T00:00:00Z`));
}

/** "2024-03", undefined → "Mar 2024 – Present" (en dash for ranges) */
export function formatPeriod(start: string, end?: string): string {
  return `${formatYearMonth(start)} – ${end ? formatYearMonth(end) : "Present"}`;
}
