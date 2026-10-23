/**
 * 323 — Collocation Deep — التصاحب العميق
 * Family: طرائق | Bloom: طبّق | Level: A2-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_323 = {
  id: 323,
  titleDe: "Collocation Deep",
  titleAr: "التصاحب العميق",
  family: "طرائق",
  bloom: "طبّق",
  level: "A2-B2",
  research: "Lewis 2000",
  desc: "Collocation Deep applied in classroom",
} as const;

export function tool323Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool323Check(v: number): boolean { return v>0; }
