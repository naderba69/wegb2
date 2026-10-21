/**
 * 570 — Intercultural Sensitivity — حساسية ثقافية
 * Bennett 1993: classroom application
 * Level: B1-B2 | Bloom: قيّم | Family: Immersion
 */
export const TOOL_570 = { id: 570, titleDe: "Intercultural Sensitivity", titleAr: "حساسية ثقافية", family: "Immersion", bloom: "قيّم", level: "B1-B2", research: "Bennett 1993", desc: "Intercultural Sensitivity" } as const;
export function tool570Gain(a:boolean):number{return a?1.2:1.0;}
export function tool570Check(v:number):boolean{return v>0;}
