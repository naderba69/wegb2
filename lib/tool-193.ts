/**
 * 193 — Forward Testing Effect — أثر الاختبار الأمامي
 * Pastötter & Bäuml 2014: testing old material potentiates learning of new material
 * Level: B2 | Bloom: طبّق | Family: طرائق
 */
export const TOOL_193 = {
  id: 193,
  titleDe: "Vorwärts-Testeffekt",
  titleAr: "أثر الاختبار الأمامي",
  family: "طرائق",
  bloom: "طبّق",
  level: "B2",
  research: "Pastötter 2014",
  effect: "+15-25% new learning after test",
} as const;

export function shouldPreTest(newBlockDay: number, lastTestDay: number): boolean {
  return newBlockDay - lastTestDay <= 2; // test recent before new
}
export function forwardGain(tested: boolean): number {
  return tested ? 1.2 : 1.0;
}
