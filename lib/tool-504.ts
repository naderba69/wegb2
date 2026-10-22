/**
 * 504 — Eye-Tracking — تتبع العين
 * Roberts 2012: classroom application
 * Level: B1-B2 | Bloom: حلّل | Family: SLA
 */
export const TOOL_504 = { id: 504, titleDe: "Eye-Tracking", titleAr: "تتبع العين", family: "SLA", bloom: "حلّل", level: "B1-B2", research: "Roberts 2012", desc: "Eye-Tracking" } as const;
export function tool504Gain(a:boolean):number{return a?1.2:1.0;}
export function tool504Check(v:number):boolean{return v>0;}
