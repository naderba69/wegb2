/**
 * 191 — Spaced vs Massed Contrast — التباعد مقابل الحشد
 * Cepeda et al. 2008 meta-analysis: spaced > massed, optimal gap ~10-30% of retention interval
 * Level: A1-B2 | Bloom: فهم | Family: الذاكرة
 */
export const TOOL_191 = {
  id: 191,
  titleDe: "Abstand vs Masse",
  titleAr: "التباعد مقابل الحشد",
  family: "الذاكرة",
  bloom: "فهم",
  level: "A1-B2",
  research: "Cepeda 2008, d=0.42",
  rule: "gap = retentionInterval * 0.2",
} as const;

export function spacedGap(retentionDays: number): number {
  return Math.max(1, Math.round(retentionDays * 0.2));
}
export function isMassed(lastGapDays: number, retentionDays: number): boolean {
  return lastGapDays < spacedGap(retentionDays) * 0.5;
}
