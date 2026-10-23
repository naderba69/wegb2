/**
 * 321 — Phraseology — علم العبارات
 * Family: طرائق | Bloom: فهم | Level: A2-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_321 = {
  id: 321,
  titleDe: "Phraseology",
  titleAr: "علم العبارات",
  family: "طرائق",
  bloom: "فهم",
  level: "A2-B2",
  research: "Cowie 1998",
  desc: "Phraseology applied in classroom",
} as const;

export function tool321Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool321Check(v: number): boolean { return v>0; }
