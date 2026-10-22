/**
 * 410 — Learner Uptake — التقاط المتعلّم
 * Lyster 2007: classroom application with tasks
 * Level: A1-B2 | Bloom: حلّل | Family: SLA
 */
export const TOOL_410 = {
  id: 410,
  titleDe: "Learner Uptake",
  titleAr: "التقاط المتعلّم",
  family: "SLA",
  bloom: "حلّل",
  level: "A1-B2",
  research: "Lyster 2007",
  desc: "Learner Uptake classroom",
} as const;
export function tool410Gain(a:boolean):number{return a?1.2:1.0;}
export function tool410Check(v:number):boolean{return v>0;}
