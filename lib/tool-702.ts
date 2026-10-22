/**
 * 702 — Move Analysis — تحليل خطوات
 * Swales 2004: classroom application
 * Level: B1-B2 | Bloom: حلّل | Family: طرائق
 */
export const TOOL_702 = { id: 702, titleDe: "Move Analysis", titleAr: "تحليل خطوات", family: "طرائق", bloom: "حلّل", level: "B1-B2", research: "Swales 2004", desc: "Move Analysis" } as const;
export function tool702Gain(a:boolean):number{return a?1.2:1.0;}
export function tool702Check(v:number):boolean{return v>0;}
