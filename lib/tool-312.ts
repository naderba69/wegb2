/**
 * 312 — Pragmatic Competence — الكفاءة التداولية
 * Thomas 1983: applied to German teaching — classroom integration via tasks
 * Level: B1-B2 | Bloom: طبّق | Family: SLA
 */
export const TOOL_312 = {
  id: 312,
  titleDe: "Pragmatic Competence",
  titleAr: "الكفاءة التداولية",
  family: "SLA",
  bloom: "طبّق",
  level: "B1-B2",
  research: "Thomas 1983",
  desc: "Pragmatic Competence applied in classroom",
} as const;
export function tool312Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool312Check(v: number): boolean { return v>0; }
