/**
 * 207 — Washback (Rückwirkung) — الأثر الارتجاعي للاختبار
 * Family: تقويم | Bloom: قيّم | Level: B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
