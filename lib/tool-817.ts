/**
 * 817 — Corrective Feedback Ellis — تغذية تصحيحية إليس
 * Ellis 2009: classroom application
 * Level: A1-B2 | Bloom: طبّق | Family: SLA
 */
export const TOOL_817 = { id: 817, titleDe: "Corrective Feedback Ellis", titleAr: "تغذية تصحيحية إليس", family: "SLA", bloom: "طبّق", level: "A1-B2", research: "Ellis 2009", desc: "Corrective Feedback Ellis" } as const;
export function tool817Gain(a:boolean):number{return a?1.2:1.0;}
export function tool817Check(v:number):boolean{return v>0;}
