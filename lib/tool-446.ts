/**
 * 446 — Metaphor Awareness — وعي الاستعارة
 * Littlemore 2004: classroom application
 * Level: B1-B2 | Bloom: حلّل | Family: طرائق
 */
export const TOOL_446 = { id: 446, titleDe: "Metaphor Awareness", titleAr: "وعي الاستعارة", family: "طرائق", bloom: "حلّل", level: "B1-B2", research: "Littlemore 2004", desc: "Metaphor Awareness" } as const;
export function tool446Gain(a:boolean):number{return a?1.2:1.0;}
export function tool446Check(v:number):boolean{return v>0;}
