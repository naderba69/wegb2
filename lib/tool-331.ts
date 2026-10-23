/**
 * 331 — Media Literacy — محو الأمية الإعلامية
 * Family: Immersion | Bloom: حلّل | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_331 = {
  id: 331,
  titleDe: "Media Literacy",
  titleAr: "محو الأمية الإعلامية",
  family: "Immersion",
  bloom: "حلّل",
  level: "B1-B2",
  research: "Hobbs 2010",
  desc: "Media Literacy applied in classroom",
} as const;

export function tool331Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool331Check(v: number): boolean { return v>0; }
