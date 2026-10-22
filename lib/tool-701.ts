/**
 * 701 — Genre Swales — نوع نصي سواليس
 * Swales 1990: classroom application
 * Level: B1-B2 | Bloom: حلّل | Family: طرائق
 */
export const TOOL_701 = { id: 701, titleDe: "Genre Swales", titleAr: "نوع نصي سواليس", family: "طرائق", bloom: "حلّل", level: "B1-B2", research: "Swales 1990", desc: "Genre Swales" } as const;
export function tool701Gain(a:boolean):number{return a?1.2:1.0;}
export function tool701Check(v:number):boolean{return v>0;}
