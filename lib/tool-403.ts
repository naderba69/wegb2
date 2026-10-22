/**
 * 403 — Prompt Feedback — التلميح التصحيحي
 * Lyster 1998: classroom application with tasks
 * Level: A2-B2 | Bloom: أنشئ | Family: SLA
 */
export const TOOL_403 = {
  id: 403,
  titleDe: "Prompt Feedback",
  titleAr: "التلميح التصحيحي",
  family: "SLA",
  bloom: "أنشئ",
  level: "A2-B2",
  research: "Lyster 1998",
  desc: "Prompt Feedback classroom",
} as const;
export function tool403Gain(a:boolean):number{return a?1.2:1.0;}
export function tool403Check(v:number):boolean{return v>0;}
