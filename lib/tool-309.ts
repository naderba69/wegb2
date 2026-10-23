/**
 * 309 — Social Strategies — الاجتماعية
 * Family: SLA | Bloom: طبّق | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_309 = {
  id: 309,
  titleDe: "Social Strategies",
  titleAr: "الاجتماعية",
  family: "SLA",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Oxford 1990",
  desc: "asking questions, cooperating",
} as const;

export function tool309Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool309Check(v: number): boolean { return v > 0; }
