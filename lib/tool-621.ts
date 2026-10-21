/**
 * 621 — Articulatory Phonology — صوتيات نطقية
 * Browman 1992: classroom application
 * Level: A0-A2 | Bloom: فهم | Family: SLA
 */
export const TOOL_621 = { id: 621, titleDe: "Articulatory Phonology", titleAr: "صوتيات نطقية", family: "SLA", bloom: "فهم", level: "A0-A2", research: "Browman 1992", desc: "Articulatory Phonology" } as const;
export function tool621Gain(a:boolean):number{return a?1.2:1.0;}
export function tool621Check(v:number):boolean{return v>0;}
