/**
 * 560 — Rater Training — تدريب مقيم
 * McNamara 1996: classroom application
 * Level: B1-B2 | Bloom: طبّق | Family: تقويم
 */
export const TOOL_560 = { id: 560, titleDe: "Rater Training", titleAr: "تدريب مقيم", family: "تقويم", bloom: "طبّق", level: "B1-B2", research: "McNamara 1996", desc: "Rater Training" } as const;
export function tool560Gain(a:boolean):number{return a?1.2:1.0;}
export function tool560Check(v:number):boolean{return v>0;}
