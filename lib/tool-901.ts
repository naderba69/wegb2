/**
 * 901 — Clipping Lappe — اقتطاع لابي
 * Lappe 2007: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_901 = { id: 901, titleDe: "Clipping Lappe", titleAr: "اقتطاع لابي", family: "SLA", bloom: "فهم", level: "A1-B2", research: "Lappe 2007", desc: "Clipping Lappe" } as const;
export function tool901Gain(a:boolean):number{return a?1.2:1.0;}
export function tool901Check(v:number):boolean{return v>0;}
