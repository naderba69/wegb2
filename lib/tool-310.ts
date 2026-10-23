/**
 * 310 — Test-Taking Strategies — استراتيجيات الاختبار
 * Family: تقويم | Bloom: طبّق | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_310 = {
  id: 310,
  titleDe: "Test-Taking Strategies",
  titleAr: "استراتيجيات الاختبار",
  family: "تقويم",
  bloom: "طبّق",
  level: "B1-B2",
  research: "Cohen 2006",
  desc: "time management, educated guessing, elimination",
} as const;

export function tool310Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool310Check(v: number): boolean { return v > 0; }
