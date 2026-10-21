/**
 * 347 — Semantik Polysemie — تعدد المعاني
 * Lakoff 1987: classroom-ready application with tasks
 * Level: B1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_347 = {
  id: 347,
  titleDe: "Semantik Polysemie",
  titleAr: "تعدد المعاني",
  family: "SLA",
  bloom: "فهم",
  level: "B1-B2",
  research: "Lakoff 1987",
  desc: "Semantik Polysemie classroom application",
} as const;
export function tool347Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool347Check(v: number): boolean { return v>0; }
