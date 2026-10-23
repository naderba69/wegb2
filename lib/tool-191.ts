/**
 * 191 — Abstand vs Masse — التباعد مقابل الحشد
 * Family: الذاكرة | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
