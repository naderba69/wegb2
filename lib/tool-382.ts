/**
 * 382 — Skill Acquisition — اكتساب المهارة
 * DeKeyser 2015: classroom application with task integration
 * Level: A2-B2 | Bloom: طبّق | Family: SLA
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
