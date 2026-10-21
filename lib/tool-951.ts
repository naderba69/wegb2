/**
 * 951 — Motivation Dörnyei 2 — دافعية دورنيي 2
 * Dörnyei 2005: classroom application
 * Level: A1-B2 | Bloom: قيّم | Family: تلقين
 */
export const TOOL_951 = { id: 951, titleDe: "Motivation Dörnyei 2", titleAr: "دافعية دورنيي 2", family: "تلقين", bloom: "قيّم", level: "A1-B2", research: "Dörnyei 2005", desc: "Motivation Dörnyei 2" } as const;
export function tool951Gain(a:boolean):number{return a?1.2:1.0;}
export function tool951Check(v:number):boolean{return v>0;}
