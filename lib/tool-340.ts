/**
 * 340 — Plurilingualism — تعدد اللغات
 * Family: SLA | Bloom: فهم | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_340 = {
  id: 340,
  titleDe: "Plurilingualism",
  titleAr: "تعدد اللغات",
  family: "SLA",
  bloom: "فهم",
  level: "A0-B2",
  research: "CEFR Companion 2018",
  desc: "Plurilingualism applied in classroom",
} as const;

export function tool340Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool340Check(v: number): boolean { return v>0; }
