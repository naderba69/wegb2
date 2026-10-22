/**
 * 341 — Segmental Phonology — الصوتيات القطعية
 * Celce-Murcia 2010: classroom-ready application with tasks
 * Level: A1-A2 | Bloom: فهم | Family: SLA
 */
export const TOOL_341 = {
  id: 341,
  titleDe: "Segmental Phonology",
  titleAr: "الصوتيات القطعية",
  family: "SLA",
  bloom: "فهم",
  level: "A1-A2",
  research: "Celce-Murcia 2010",
  desc: "Segmental Phonology classroom application",
} as const;
export function tool341Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool341Check(v: number): boolean { return v>0; }
