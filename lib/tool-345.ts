/**
 * 345 — Nebensatz Syntax — الجملة الفرعية
 * Family: SLA | Bloom: حلّل | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
