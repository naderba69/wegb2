/**
 * 793 — Multimodality Kress — تعدد وسائط كريس
 * Kress 2010: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: طرائق
 */
export const TOOL_793 = { id: 793, titleDe: "Multimodality Kress", titleAr: "تعدد وسائط كريس", family: "طرائق", bloom: "فهم", level: "A1-B2", research: "Kress 2010", desc: "Multimodality Kress" } as const;
export function tool793Gain(a:boolean):number{return a?1.2:1.0;}
export function tool793Check(v:number):boolean{return v>0;}
