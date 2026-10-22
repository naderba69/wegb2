/**
 * 402 — Explicit Correction — تصحيح صريح
 * Lyster 1998: classroom application with tasks
 * Level: A1-B2 | Bloom: طبّق | Family: SLA
 */
export const TOOL_402 = {
  id: 402,
  titleDe: "Explicit Correction",
  titleAr: "تصحيح صريح",
  family: "SLA",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Lyster 1998",
  desc: "Explicit Correction classroom",
} as const;
export function tool402Gain(a:boolean):number{return a?1.2:1.0;}
export function tool402Check(v:number):boolean{return v>0;}
