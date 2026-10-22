/**
 * 811 — Noticing Schmidt — انتباه شميت
 * Schmidt 1990: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_811 = { id: 811, titleDe: "Noticing Schmidt", titleAr: "انتباه شميت", family: "SLA", bloom: "فهم", level: "A1-B2", research: "Schmidt 1990", desc: "Noticing Schmidt" } as const;
export function tool811Gain(a:boolean):number{return a?1.2:1.0;}
export function tool811Check(v:number):boolean{return v>0;}
