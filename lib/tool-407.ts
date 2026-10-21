/**
 * 407 — Metalinguistic Feedback — ما وراء لغوي
 * Lyster 1998: classroom application with tasks
 * Level: B1-B2 | Bloom: حلّل | Family: SLA
 */
export const TOOL_407 = {
  id: 407,
  titleDe: "Metalinguistic Feedback",
  titleAr: "ما وراء لغوي",
  family: "SLA",
  bloom: "حلّل",
  level: "B1-B2",
  research: "Lyster 1998",
  desc: "Metalinguistic Feedback classroom",
} as const;
export function tool407Gain(a:boolean):number{return a?1.2:1.0;}
export function tool407Check(v:number):boolean{return v>0;}
