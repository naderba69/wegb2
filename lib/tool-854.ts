/**
 * 854 — Interleaving Rohrer — تداخل
 * Rohrer 2012: classroom application
 * Level: A1-B2 | Bloom: حلّل | Family: الذاكرة
 */
export const TOOL_854 = { id: 854, titleDe: "Interleaving Rohrer", titleAr: "تداخل", family: "الذاكرة", bloom: "حلّل", level: "A1-B2", research: "Rohrer 2012", desc: "Interleaving Rohrer" } as const;
export function tool854Gain(a:boolean):number{return a?1.2:1.0;}
export function tool854Check(v:number):boolean{return v>0;}
