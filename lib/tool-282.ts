/**
 * 282 — Split-Attention — انقسام الانتباه
 * Ayres 2005: integrate text+diagram; avoid split source
 * Level: A1-B2 | Bloom: فهم | Family: طرائق
 */
export const TOOL_282 = {
  id: 282,
  titleDe: "Split-Attention",
  titleAr: "انقسام الانتباه",
  family: "طرائق",
  bloom: "فهم",
  level: "A1-B2",
  research: "Ayres 2005",
  desc: "integrate text+diagram; avoid split source",
} as const;

export function tool282Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool282Check(v: number): boolean { return v > 0; }
