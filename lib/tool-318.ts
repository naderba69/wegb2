/**
 * 318 — Corpus-Based Learning — التعلّم بالمدونة
 * Family: طرائق | Bloom: فهم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_318 = {
  id: 318,
  titleDe: "Corpus-Based Learning",
  titleAr: "التعلّم بالمدونة",
  family: "طرائق",
  bloom: "فهم",
  level: "B1-B2",
  research: "Sinclair 1991",
  desc: "Corpus-Based Learning applied in classroom",
} as const;

export function tool318Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool318Check(v: number): boolean { return v>0; }
