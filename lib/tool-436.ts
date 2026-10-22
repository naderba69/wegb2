/**
 * 436 — Noticing Gaps Advanced — ملاحظة فجوات متقدم
 * Schmidt 2010: classroom application
 * Level: B1-B2 | Bloom: حلّل | Family: SLA
 */
export const TOOL_436 = { id: 436, titleDe: "Noticing Gaps Advanced", titleAr: "ملاحظة فجوات متقدم", family: "SLA", bloom: "حلّل", level: "B1-B2", research: "Schmidt 2010", desc: "Noticing Gaps Advanced" } as const;
export function tool436Gain(a:boolean):number{return a?1.2:1.0;}
export function tool436Check(v:number):boolean{return v>0;}
