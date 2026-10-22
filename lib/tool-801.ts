/**
 * 801 — Sociocultural Scaffolding — سقالة اجتماعية
 * Wood 1976: classroom application
 * Level: A1-B2 | Bloom: طبّق | Family: SLA
 */
export const TOOL_801 = { id: 801, titleDe: "Sociocultural Scaffolding", titleAr: "سقالة اجتماعية", family: "SLA", bloom: "طبّق", level: "A1-B2", research: "Wood 1976", desc: "Sociocultural Scaffolding" } as const;
export function tool801Gain(a:boolean):number{return a?1.2:1.0;}
export function tool801Check(v:number):boolean{return v>0;}
