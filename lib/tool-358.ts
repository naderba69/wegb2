/**
 * 358 — Fluency vs Accuracy — الطلاقة مقابل الدقة
 * Housen 2009: classroom-ready application with tasks
 * Level: A1-B2 | Bloom: حلّل | Family: SLA
 */
export const TOOL_358 = {
  id: 358,
  titleDe: "Fluency vs Accuracy",
  titleAr: "الطلاقة مقابل الدقة",
  family: "SLA",
  bloom: "حلّل",
  level: "A1-B2",
  research: "Housen 2009",
  desc: "Fluency vs Accuracy classroom application",
} as const;
export function tool358Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool358Check(v: number): boolean { return v>0; }
