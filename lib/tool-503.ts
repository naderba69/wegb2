/**
 * 503 — Self-Paced Reading — قراءة ذاتية السرعة
 * Jiang 2007: classroom application
 * Level: B1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_503 = { id: 503, titleDe: "Self-Paced Reading", titleAr: "قراءة ذاتية السرعة", family: "SLA", bloom: "فهم", level: "B1-B2", research: "Jiang 2007", desc: "Self-Paced Reading" } as const;
export function tool503Gain(a:boolean):number{return a?1.2:1.0;}
export function tool503Check(v:number):boolean{return v>0;}
