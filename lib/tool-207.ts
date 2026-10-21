/**
 * 207 — Summative Washback — الأثر الارتجاعي للاختبار الختامي
 * Alderson 1993: test design drives learning behavior — align test to goals
 * Level: B2 | Bloom: قيّم | Family: تقويم
 */
export const TOOL_207 = {
  id: 207,
  titleDe: "Washback (Rückwirkung)",
  titleAr: "الأثر الارتجاعي للاختبار",
  family: "تقويم",
  bloom: "قيّم",
  level: "B2",
  research: "Alderson 1993",
  align: "Teste was du lehren willst",
} as const;

export function washbackAlignment(testCovers: string[], taught: string[]): number {
  if (!taught.length) return 0;
  return testCovers.filter(t => taught.includes(t)).length / taught.length;
}
export function needsRealignment(alignment: number): boolean {
  return alignment < 0.7;
}
