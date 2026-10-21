/**
 * 611 — Sociocultural Theory — نظرية اجتماعية ثقافية
 * Lantolf 2006: classroom application
 * Level: B1-B2 | Bloom: حلّل | Family: SLA
 */
export const TOOL_611 = { id: 611, titleDe: "Sociocultural Theory", titleAr: "نظرية اجتماعية ثقافية", family: "SLA", bloom: "حلّل", level: "B1-B2", research: "Lantolf 2006", desc: "Sociocultural Theory" } as const;
export function tool611Gain(a:boolean):number{return a?1.2:1.0;}
export function tool611Check(v:number):boolean{return v>0;}
