/**
 * 353 — Skimming Lesestrategie — التصفح السريع
 * Family: طرائق | Bloom: فهم | Level: A2-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_353 = {
  id: 353,
  titleDe: "Skimming Lesestrategie",
  titleAr: "التصفح السريع",
  family: "طرائق",
  bloom: "فهم",
  level: "A2-B2",
  research: "Grabe 2009",
  desc: "Skimming Lesestrategie classroom application",
} as const;

export function tool353Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool353Check(v: number): boolean { return v>0; }
