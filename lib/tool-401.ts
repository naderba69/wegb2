/**
 * 401 — Recast Feedback — التغذية الاسترجاعية
 * Lyster 1998: classroom application with tasks
 * Level: A1-B2 | Bloom: طبّق | Family: SLA
 */
export const TOOL_401 = {
  id: 401,
  titleDe: "Recast Feedback",
  titleAr: "التغذية الاسترجاعية",
  family: "SLA",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Lyster 1998",
  desc: "Recast Feedback classroom",
} as const;
export function tool401Gain(a:boolean):number{return a?1.2:1.0;}
export function tool401Check(v:number):boolean{return v>0;}
