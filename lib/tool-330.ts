/**
 * 330 — Critical Thinking — التفكير النقدي
 * Family: تلقين | Bloom: قيّم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_330 = {
  id: 330,
  titleDe: "Critical Thinking",
  titleAr: "التفكير النقدي",
  family: "تلقين",
  bloom: "قيّم",
  level: "B1-B2",
  research: "Facione 1990",
  desc: "Critical Thinking applied in classroom",
} as const;

export function tool330Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool330Check(v: number): boolean { return v>0; }
