/**
 * 306 — Socio-Affective — اجتماعية-وجدانية
 * Oxford 1990: cooperation, empathizing, anxiety reduction
 * Level: A0-B2 | Bloom: طبّق | Family: SLA
 */
export const TOOL_306 = {
  id: 306,
  titleDe: "Socio-Affective",
  titleAr: "اجتماعية-وجدانية",
  family: "SLA",
  bloom: "طبّق",
  level: "A0-B2",
  research: "Oxford 1990",
  desc: "cooperation, empathizing, anxiety reduction",
} as const;

export function tool306Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool306Check(v: number): boolean { return v > 0; }
