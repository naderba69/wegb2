/**
 * 565 — Telecollaboration adv — تعاون عن بعد متقدم
 * Helm 2013: classroom application
 * Level: B1-B2 | Bloom: أنشئ | Family: Immersion
 */
export const TOOL_565 = { id: 565, titleDe: "Telecollaboration adv", titleAr: "تعاون عن بعد متقدم", family: "Immersion", bloom: "أنشئ", level: "B1-B2", research: "Helm 2013", desc: "Telecollaboration adv" } as const;
export function tool565Gain(a:boolean):number{return a?1.2:1.0;}
export function tool565Check(v:number):boolean{return v>0;}
