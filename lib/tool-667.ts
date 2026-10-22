/**
 * 667 — Iconicity Perniss — أيقونية
 * Perniss 2010: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_667 = { id: 667, titleDe: "Iconicity Perniss", titleAr: "أيقونية", family: "SLA", bloom: "فهم", level: "A1-B2", research: "Perniss 2010", desc: "Iconicity Perniss" } as const;
export function tool667Gain(a:boolean):number{return a?1.2:1.0;}
export function tool667Check(v:number):boolean{return v>0;}
