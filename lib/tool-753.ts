/**
 * 753 — Translanguaging Pedagogy — بيداغوجيا ترجمة
 * García 2017: classroom application
 * Level: A1-B2 | Bloom: أنشئ | Family: طرائق
 */
export const TOOL_753 = { id: 753, titleDe: "Translanguaging Pedagogy", titleAr: "بيداغوجيا ترجمة", family: "طرائق", bloom: "أنشئ", level: "A1-B2", research: "García 2017", desc: "Translanguaging Pedagogy" } as const;
export function tool753Gain(a:boolean):number{return a?1.2:1.0;}
export function tool753Check(v:number):boolean{return v>0;}
