/**
 * 459 — Questioning Taxonomy — تصنيف الأسئلة
 * Bloom 1956: classroom application
 * Level: A1-B2 | Bloom: حلّل | Family: طرائق
 */
export const TOOL_459 = { id: 459, titleDe: "Questioning Taxonomy", titleAr: "تصنيف الأسئلة", family: "طرائق", bloom: "حلّل", level: "A1-B2", research: "Bloom 1956", desc: "Questioning Taxonomy" } as const;
export function tool459Gain(a:boolean):number{return a?1.2:1.0;}
export function tool459Check(v:number):boolean{return v>0;}
