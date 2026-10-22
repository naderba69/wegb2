/**
 * 404 — Clarification Request — طلب توضيح
 * Lyster 1998: classroom application with tasks
 * Level: A1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_404 = {
  id: 404,
  titleDe: "Clarification Request",
  titleAr: "طلب توضيح",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "Lyster 1998",
  desc: "Clarification Request classroom",
} as const;
export function tool404Gain(a:boolean):number{return a?1.2:1.0;}
export function tool404Check(v:number):boolean{return v>0;}
