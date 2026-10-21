/**
 * 573 — Empathy in Language — تعاطف لغوي
 * Dewaele 2011: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: Immersion
 */
export const TOOL_573 = { id: 573, titleDe: "Empathy in Language", titleAr: "تعاطف لغوي", family: "Immersion", bloom: "فهم", level: "A1-B2", research: "Dewaele 2011", desc: "Empathy in Language" } as const;
export function tool573Gain(a:boolean):number{return a?1.2:1.0;}
export function tool573Check(v:number):boolean{return v>0;}
