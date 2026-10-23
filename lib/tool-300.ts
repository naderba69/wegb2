/**
 * 300 — Grit & Perseverance — المثابرة
 * Family: تلقين | Bloom: قيّم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_300 = {
  id: 300,
  titleDe: "Grit & Perseverance",
  titleAr: "المثابرة",
  family: "تلقين",
  bloom: "قيّم",
  level: "A1-B2",
  research: "Duckworth 2007",
  desc: "perseverance + passion long-term",
} as const;

export function tool300Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool300Check(v: number): boolean { return v > 0; }
