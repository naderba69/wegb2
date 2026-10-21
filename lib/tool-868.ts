/**
 * 868 — Bizarreness Effect — أثر غرابة
 * McDaniel 1986: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: الذاكرة
 */
export const TOOL_868 = { id: 868, titleDe: "Bizarreness Effect", titleAr: "أثر غرابة", family: "الذاكرة", bloom: "فهم", level: "A1-B2", research: "McDaniel 1986", desc: "Bizarreness Effect" } as const;
export function tool868Gain(a:boolean):number{return a?1.2:1.0;}
export function tool868Check(v:number):boolean{return v>0;}
