/**
 * 320 — Lexical Bundles — الحزم المعجمية
 * Family: طرائق | Bloom: تذكّر | Level: A2-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_320 = {
  id: 320,
  titleDe: "Lexical Bundles",
  titleAr: "الحزم المعجمية",
  family: "طرائق",
  bloom: "تذكّر",
  level: "A2-B2",
  research: "Biber 1999",
  desc: "Lexical Bundles applied in classroom",
} as const;

export function tool320Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool320Check(v: number): boolean { return v>0; }
