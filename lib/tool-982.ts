/**
 * 982 — Inquiry-Based Learning — تعلم استقصائي
 * Spronken-Smith 2012: classroom application
 * Level: B1-B2 | Bloom: أنشئ | Family: طرائق
 */
export const TOOL_982 = { id: 982, titleDe: "Inquiry-Based Learning", titleAr: "تعلم استقصائي", family: "طرائق", bloom: "أنشئ", level: "B1-B2", research: "Spronken-Smith 2012", desc: "Inquiry-Based Learning" } as const;
export function tool982Gain(a:boolean):number{return a?1.2:1.0;}
export function tool982Check(v:number):boolean{return v>0;}
