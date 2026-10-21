/**
 * 959 — Self-Determination Deci — تقرير ذاتي ديسي
 * Deci 1985: classroom application
 * Level: A1-B2 | Bloom: حلّل | Family: تلقين
 */
export const TOOL_959 = { id: 959, titleDe: "Self-Determination Deci", titleAr: "تقرير ذاتي ديسي", family: "تلقين", bloom: "حلّل", level: "A1-B2", research: "Deci 1985", desc: "Self-Determination Deci" } as const;
export function tool959Gain(a:boolean):number{return a?1.2:1.0;}
export function tool959Check(v:number):boolean{return v>0;}
