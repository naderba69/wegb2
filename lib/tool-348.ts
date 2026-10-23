/**
 * 348 — Konnotation — الدلالة الإيحائية
 * Family: SLA | Bloom: فهم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_348 = {
  id: 348,
  titleDe: "Konnotation",
  titleAr: "الدلالة الإيحائية",
  family: "SLA",
  bloom: "فهم",
  level: "B1-B2",
  research: "Leech 1981",
  desc: "Konnotation classroom application",
} as const;

export function tool348Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool348Check(v: number): boolean { return v>0; }
