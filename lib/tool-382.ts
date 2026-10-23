/**
 * 382 — Skill Acquisition — اكتساب المهارة
 * Family: SLA | Bloom: طبّق | Level: A2-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_382 = {
  id: 382,
  titleDe: "Skill Acquisition",
  titleAr: "اكتساب المهارة",
  family: "SLA",
  bloom: "طبّق",
  level: "A2-B2",
  research: "DeKeyser 2015",
  desc: "Skill Acquisition classroom",
} as const;

export function tool382Gain(a: boolean): number { return a?1.2:1.0; }
export function tool382Check(v:number):boolean { return v>0; }
