/**
 * 655 — Phrasal Verbs Garnier — أفعال مركبة
 * Garnier 2013: classroom application
 * Level: B1-B2 | Bloom: طبّق | Family: SLA
 */
export const TOOL_655 = { id: 655, titleDe: "Phrasal Verbs Garnier", titleAr: "أفعال مركبة", family: "SLA", bloom: "طبّق", level: "B1-B2", research: "Garnier 2013", desc: "Phrasal Verbs Garnier" } as const;
export function tool655Gain(a:boolean):number{return a?1.2:1.0;}
export function tool655Check(v:number):boolean{return v>0;}
