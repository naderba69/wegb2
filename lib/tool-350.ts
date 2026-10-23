/**
 * 350 — Turn-Taking Discourse — تناوب الأدوار
 * Family: طرائق | Bloom: طبّق | Level: A2-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_350 = {
  id: 350,
  titleDe: "Turn-Taking Discourse",
  titleAr: "تناوب الأدوار",
  family: "طرائق",
  bloom: "طبّق",
  level: "A2-B2",
  research: "Sacks 1974",
  desc: "Turn-Taking Discourse classroom application",
} as const;

export function tool350Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool350Check(v: number): boolean { return v>0; }
