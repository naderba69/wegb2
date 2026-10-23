/**
 * 317 — Genre Analysis — تحليل النوع النصي
 * Family: طرائق | Bloom: حلّل | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_317 = {
  id: 317,
  titleDe: "Genre Analysis",
  titleAr: "تحليل النوع النصي",
  family: "طرائق",
  bloom: "حلّل",
  level: "B1-B2",
  research: "Swales 1990",
  desc: "Genre Analysis applied in classroom",
} as const;

export function tool317Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool317Check(v: number): boolean { return v>0; }
