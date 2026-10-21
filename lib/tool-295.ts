/**
 * 295 — SDT Motivation — الدافعية الذاتية
 * Deci 2000: autonomy + competence + relatedness
 * Level: A0-B2 | Bloom: فهم | Family: تلقين
 */
export const TOOL_295 = {
  id: 295,
  titleDe: "SDT Motivation",
  titleAr: "الدافعية الذاتية",
  family: "تلقين",
  bloom: "فهم",
  level: "A0-B2",
  research: "Deci 2000",
  desc: "autonomy + competence + relatedness",
} as const;

export function tool295Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool295Check(v: number): boolean { return v > 0; }
