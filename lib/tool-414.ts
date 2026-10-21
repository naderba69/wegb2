/**
 * 414 — Comprehensible Output — إخراج مفهوم
 * Swain 1985: classroom application with tasks
 * Level: A2-B2 | Bloom: طبّق | Family: SLA
 */
export const TOOL_414 = {
  id: 414,
  titleDe: "Comprehensible Output",
  titleAr: "إخراج مفهوم",
  family: "SLA",
  bloom: "طبّق",
  level: "A2-B2",
  research: "Swain 1985",
  desc: "Comprehensible Output classroom",
} as const;
export function tool414Gain(a:boolean):number{return a?1.2:1.0;}
export function tool414Check(v:number):boolean{return v>0;}
