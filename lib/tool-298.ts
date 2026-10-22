/**
 * 298 — Relatedness Support — دعم الترابط
 * Deci 2000: belonging, connection to teacher/peers
 * Level: A0-B2 | Bloom: فهم | Family: تلقين
 */
export const TOOL_298 = {
  id: 298,
  titleDe: "Relatedness Support",
  titleAr: "دعم الترابط",
  family: "تلقين",
  bloom: "فهم",
  level: "A0-B2",
  research: "Deci 2000",
  desc: "belonging, connection to teacher/peers",
} as const;

export function tool298Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool298Check(v: number): boolean { return v > 0; }
