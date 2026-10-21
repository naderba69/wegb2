/**
 * 771 — Pluriliteracies — تعدد محويات
 * Meyer 2016: classroom application
 * Level: B1-B2 | Bloom: أنشئ | Family: طرائق
 */
export const TOOL_771 = { id: 771, titleDe: "Pluriliteracies", titleAr: "تعدد محويات", family: "طرائق", bloom: "أنشئ", level: "B1-B2", research: "Meyer 2016", desc: "Pluriliteracies" } as const;
export function tool771Gain(a:boolean):number{return a?1.2:1.0;}
export function tool771Check(v:number):boolean{return v>0;}
