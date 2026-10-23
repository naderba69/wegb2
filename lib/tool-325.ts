/**
 * 325 — Proverbs Sprichwörter — الأمثال
 * Family: Narrative | Bloom: فهم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_325 = {
  id: 325,
  titleDe: "Proverbs Sprichwörter",
  titleAr: "الأمثال",
  family: "Narrative",
  bloom: "فهم",
  level: "B1-B2",
  research: "Mieder 2004",
  desc: "Proverbs Sprichwörter applied in classroom",
} as const;

export function tool325Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool325Check(v: number): boolean { return v>0; }
