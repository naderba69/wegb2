/**
 * 602 — CLIL Assessment — تقويم كليل
 * Llinares 2012: classroom application
 * Level: B1-B2 | Bloom: قيّم | Family: تقويم
 */
export const TOOL_602 = { id: 602, titleDe: "CLIL Assessment", titleAr: "تقويم كليل", family: "تقويم", bloom: "قيّم", level: "B1-B2", research: "Llinares 2012", desc: "CLIL Assessment" } as const;
export function tool602Gain(a:boolean):number{return a?1.2:1.0;}
export function tool602Check(v:number):boolean{return v>0;}
