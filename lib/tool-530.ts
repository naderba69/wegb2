/**
 * 530 — Contrastive Interlanguage adv — بينية تقابلية متقدم
 * Selinker 2014: classroom application with research-based tasks
 * Level: B1-B2 | Bloom: حلّل | Family: SLA
 */
export const TOOL_530 = { id: 530, titleDe: "Contrastive Interlanguage adv", titleAr: "بينية تقابلية متقدم", family: "SLA", bloom: "حلّل", level: "B1-B2", research: "Selinker 2014", desc: "Contrastive Interlanguage adv" } as const;
export function tool530Gain(a:boolean):number{return a?1.2:1.0;}
export function tool530Check(v:number):boolean{return v>0;}
