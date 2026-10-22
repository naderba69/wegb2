/**
 * 794 — Semiotics — سيمياء
 * van Lier 2004: classroom application
 * Level: B1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_794 = { id: 794, titleDe: "Semiotics", titleAr: "سيمياء", family: "SLA", bloom: "فهم", level: "B1-B2", research: "van Lier 2004", desc: "Semiotics" } as const;
export function tool794Gain(a:boolean):number{return a?1.2:1.0;}
export function tool794Check(v:number):boolean{return v>0;}
