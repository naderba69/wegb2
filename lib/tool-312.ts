/**
 * 312 — Pragmatic Competence — الكفاءة التداولية
 * Family: SLA | Bloom: طبّق | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
