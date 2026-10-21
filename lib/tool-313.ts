/**
 * 313 — Speech Acts — الأفعال الكلامية
 * Austin 1962: applied to German teaching — classroom integration via tasks
 * Level: A2-B2 | Bloom: طبّق | Family: SLA
 */
export const TOOL_313 = {
  id: 313,
  titleDe: "Speech Acts",
  titleAr: "الأفعال الكلامية",
  family: "SLA",
  bloom: "طبّق",
  level: "A2-B2",
  research: "Austin 1962",
  desc: "Speech Acts applied in classroom",
} as const;
export function tool313Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool313Check(v: number): boolean { return v>0; }
