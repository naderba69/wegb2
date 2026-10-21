/**
 * 406 — Elicitation Feedback — استنباط تصحيحي
 * Lyster 1998: classroom application with tasks
 * Level: A2-B2 | Bloom: أنشئ | Family: SLA
 */
export const TOOL_406 = {
  id: 406,
  titleDe: "Elicitation Feedback",
  titleAr: "استنباط تصحيحي",
  family: "SLA",
  bloom: "أنشئ",
  level: "A2-B2",
  research: "Lyster 1998",
  desc: "Elicitation Feedback classroom",
} as const;
export function tool406Gain(a:boolean):number{return a?1.2:1.0;}
export function tool406Check(v:number):boolean{return v>0;}
