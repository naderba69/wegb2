/**
 * 285 — Guidance Fading — تلاشي التوجيه
 * Renkl 2004: full guidance → faded → independent
 * Level: A1-B1 | Bloom: طبّق | Family: طرائق
 */
export const TOOL_285 = {
  id: 285,
  titleDe: "Guidance Fading",
  titleAr: "تلاشي التوجيه",
  family: "طرائق",
  bloom: "طبّق",
  level: "A1-B1",
  research: "Renkl 2004",
  desc: "full guidance → faded → independent",
} as const;

export function tool285Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool285Check(v: number): boolean { return v > 0; }
