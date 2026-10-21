/**
 * 345 — Nebensatz Syntax — الجملة الفرعية
 * Diehl 2000: classroom-ready application with tasks
 * Level: B1-B2 | Bloom: حلّل | Family: SLA
 */
export const TOOL_345 = {
  id: 345,
  titleDe: "Nebensatz Syntax",
  titleAr: "الجملة الفرعية",
  family: "SLA",
  bloom: "حلّل",
  level: "B1-B2",
  research: "Diehl 2000",
  desc: "Nebensatz Syntax classroom application",
} as const;
export function tool345Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool345Check(v: number): boolean { return v>0; }
