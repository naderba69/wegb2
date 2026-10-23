/**
 * 359 — Intelligibility ELF — المفهومية كلغة مشتركة
 * Family: SLA | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_359 = {
  id: 359,
  titleDe: "Intelligibility ELF",
  titleAr: "المفهومية كلغة مشتركة",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "Jenkins 2000",
  desc: "Intelligibility ELF classroom application",
} as const;

export function tool359Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool359Check(v: number): boolean { return v>0; }
