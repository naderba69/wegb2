/**
 * 918 — Translanguaging Pedagogy 2 — بيداغوجيا ترجمة 2
 * García 2014: classroom application
 * Level: A1-B2 | Bloom: أنشئ | Family: طرائق
 */
export const TOOL_918 = { id: 918, titleDe: "Translanguaging Pedagogy 2", titleAr: "بيداغوجيا ترجمة 2", family: "طرائق", bloom: "أنشئ", level: "A1-B2", research: "García 2014", desc: "Translanguaging Pedagogy 2" } as const;
export function tool918Gain(a:boolean):number{return a?1.2:1.0;}
export function tool918Check(v:number):boolean{return v>0;}
