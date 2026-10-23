/**
 * 314 — Politeness Theory — نظرية التأدب
 * Family: SLA | Bloom: فهم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_314 = {
  id: 314,
  titleDe: "Politeness Theory",
  titleAr: "نظرية التأدب",
  family: "SLA",
  bloom: "فهم",
  level: "B1-B2",
  research: "Brown 1987",
  desc: "Politeness Theory applied in classroom",
} as const;

export function tool314Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool314Check(v: number): boolean { return v>0; }
