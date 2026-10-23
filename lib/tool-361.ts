/**
 * 361 — Uptake & Repair — الالتقاط والإصلاح
 * Family: SLA | Bloom: حلّل | Level: A2-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_361 = {
  id: 361,
  titleDe: "Uptake & Repair",
  titleAr: "الالتقاط والإصلاح",
  family: "SLA",
  bloom: "حلّل",
  level: "A2-B2",
  research: "Lyster 1998",
  desc: "Uptake & Repair classroom application",
} as const;

export function tool361Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool361Check(v: number): boolean { return v>0; }
