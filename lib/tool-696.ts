/**
 * 696 — Noticing Pragmatics — انتباه تداولية
 * Bardovi-Harlig 2001: classroom application
 * Level: B1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_696 = { id: 696, titleDe: "Noticing Pragmatics", titleAr: "انتباه تداولية", family: "SLA", bloom: "فهم", level: "B1-B2", research: "Bardovi-Harlig 2001", desc: "Noticing Pragmatics" } as const;
export function tool696Gain(a:boolean):number{return a?1.2:1.0;}
export function tool696Check(v:number):boolean{return v>0;}
