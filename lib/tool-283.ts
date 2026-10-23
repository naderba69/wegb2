/**
 * 283 — Redundancy Principle — مبدأ التكرار الزائد
 * Family: طرائق | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_283 = {
  id: 283,
  titleDe: "Redundancy Principle",
  titleAr: "مبدأ التكرار الزائد",
  family: "طرائق",
  bloom: "فهم",
  level: "A1-B2",
  research: "Kalyuga 1999",
  desc: "redundant text+audio harms; choose one",
} as const;

export function tool283Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool283Check(v: number): boolean { return v > 0; }
