/**
 * 763 — Linguistic Landscape — مشهد لغوي
 * Gorter 2006: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: Immersion
 */
export const TOOL_763 = { id: 763, titleDe: "Linguistic Landscape", titleAr: "مشهد لغوي", family: "Immersion", bloom: "فهم", level: "A1-B2", research: "Gorter 2006", desc: "Linguistic Landscape" } as const;
export function tool763Gain(a:boolean):number{return a?1.2:1.0;}
export function tool763Check(v:number):boolean{return v>0;}
