/**
 * 360 — Corrective Feedback Lyster — التغذية التصحيحية
 * Family: SLA | Bloom: طبّق | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_360 = {
  id: 360,
  titleDe: "Corrective Feedback Lyster",
  titleAr: "التغذية التصحيحية",
  family: "SLA",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Lyster 2007",
  desc: "Corrective Feedback Lyster classroom application",
} as const;

export function tool360Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool360Check(v: number): boolean { return v>0; }
