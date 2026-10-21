/**
 * 293 — Attribution Theory — نظرية العزو
 * Weiner 1985: attribute success to effort/strategy not luck
 * Level: B1-B2 | Bloom: حلّل | Family: تلقين
 */
export const TOOL_293 = {
  id: 293,
  titleDe: "Attribution Theory",
  titleAr: "نظرية العزو",
  family: "تلقين",
  bloom: "حلّل",
  level: "B1-B2",
  research: "Weiner 1985",
  desc: "attribute success to effort/strategy not luck",
} as const;

export function tool293Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool293Check(v: number): boolean { return v > 0; }
