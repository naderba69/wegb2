/**
 * 405 — Repetition Feedback — تكرار تصحيحي
 * Lyster 1998: classroom application with tasks
 * Level: A1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_405 = {
  id: 405,
  titleDe: "Repetition Feedback",
  titleAr: "تكرار تصحيحي",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "Lyster 1998",
  desc: "Repetition Feedback classroom",
} as const;
export function tool405Gain(a:boolean):number{return a?1.2:1.0;}
export function tool405Check(v:number):boolean{return v>0;}
