/**
 * 791 — Deaf Bilingualism — ثنائية صم
 * Mayer 2007: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_791 = { id: 791, titleDe: "Deaf Bilingualism", titleAr: "ثنائية صم", family: "SLA", bloom: "فهم", level: "A1-B2", research: "Mayer 2007", desc: "Deaf Bilingualism" } as const;
export function tool791Gain(a:boolean):number{return a?1.2:1.0;}
export function tool791Check(v:number):boolean{return v>0;}
