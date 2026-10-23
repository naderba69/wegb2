/**
 * 349 — Pragmatik Implicature — الاستلزام
 * Family: SLA | Bloom: حلّل | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_349 = {
  id: 349,
  titleDe: "Pragmatik Implicature",
  titleAr: "الاستلزام",
  family: "SLA",
  bloom: "حلّل",
  level: "B1-B2",
  research: "Grice 1975",
  desc: "Pragmatik Implicature classroom application",
} as const;

export function tool349Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool349Check(v: number): boolean { return v>0; }
