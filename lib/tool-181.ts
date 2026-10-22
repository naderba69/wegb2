/**
 * 181 — Optimal Spaced Interval (FSRS) — الفاصل الأمثل
 * Based on Wozniak & Cedar 2023: optimal interval = stability * ln(retention)
 * Integrated into lib/srs.ts via getOptimalInterval()
 * Level: B2 | Bloom: طبّق | Family: الذاكرة
 */
export const TOOL_181 = {
  id: 181,
  titleDe: "Optimales Intervall (FSRS)",
  titleAr: "الفاصل الأمثل",
  family: "الذاكرة",
  bloom: "طبّق",
  level: "B2",
  research: "Wozniak 1990, FSRS 2023",
  formel: "I = S * ln(R) / ln(0.9)",
} as const;

export function getOptimalInterval(stability: number, desiredRetention = 0.9): number {
  // FSRS simplified: stability in days, desired retention 0.9
  const k = Math.log(desiredRetention) / Math.log(0.9);
  return Math.max(1, Math.round(stability * k));
}

export function isOptimalDue(lastReview: Date, stability: number, now = new Date()): boolean {
  const optimal = getOptimalInterval(stability);
  const daysSince = (now.getTime() - lastReview.getTime()) / 86400000;
  return daysSince >= optimal * 0.9; // 10% early is ok (desirable difficulty)
}
