/**
 * 355 — Intensiv vs Extensiv Lesen — قراءة مركزة/موسعة
 * Family: طرائق | Bloom: حلّل | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_355 = {
  id: 355,
  titleDe: "Intensiv vs Extensiv Lesen",
  titleAr: "قراءة مركزة/موسعة",
  family: "طرائق",
  bloom: "حلّل",
  level: "A1-B2",
  research: "Day 1998",
  desc: "Intensiv vs Extensiv Lesen classroom application",
} as const;

export function tool355Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool355Check(v: number): boolean { return v>0; }
