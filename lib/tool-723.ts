/**
 * 723 — Educational Data Mining — تنقيب بيانات
 * Baker 2010: classroom application
 * Level: A1-B2 | Bloom: حلّل | Family: تقويم
 */
export const TOOL_723 = { id: 723, titleDe: "Educational Data Mining", titleAr: "تنقيب بيانات", family: "تقويم", bloom: "حلّل", level: "A1-B2", research: "Baker 2010", desc: "Educational Data Mining" } as const;
export function tool723Gain(a:boolean):number{return a?1.2:1.0;}
export function tool723Check(v:number):boolean{return v>0;}
