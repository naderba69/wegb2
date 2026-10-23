/**
 * 358 — Fluency vs Accuracy — الطلاقة مقابل الدقة
 * Family: SLA | Bloom: حلّل | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
