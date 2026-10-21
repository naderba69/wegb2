/**
 * 378 — Noticing Hypothesis Adv — فرضية الانتباه متقدم
 * Schmidt 2001: classroom application with task integration
 * Level: A2-B1 | Bloom: حلّل | Family: SLA
 */
export const TOOL_378 = {
  id: 378,
  titleDe: "Noticing Hypothesis Adv",
  titleAr: "فرضية الانتباه متقدم",
  family: "SLA",
  bloom: "حلّل",
  level: "A2-B1",
  research: "Schmidt 2001",
  desc: "Noticing Hypothesis Adv classroom",
} as const;
export function tool378Gain(a: boolean): number { return a?1.2:1.0; }
export function tool378Check(v:number):boolean { return v>0; }
