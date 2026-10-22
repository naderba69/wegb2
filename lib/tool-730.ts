/**
 * 730 — Global Citizenship — مواطنة عالمية
 * Oxfam 2015: classroom application
 * Level: B1-B2 | Bloom: قيّم | Family: Immersion
 */
export const TOOL_730 = { id: 730, titleDe: "Global Citizenship", titleAr: "مواطنة عالمية", family: "Immersion", bloom: "قيّم", level: "B1-B2", research: "Oxfam 2015", desc: "Global Citizenship" } as const;
export function tool730Gain(a:boolean):number{return a?1.2:1.0;}
export function tool730Check(v:number):boolean{return v>0;}
