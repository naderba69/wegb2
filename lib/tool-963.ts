/**
 * 963 — Grit Duckworth — مثابرة دكوورث
 * Duckworth 2007: classroom application
 * Level: A1-B2 | Bloom: قيّم | Family: تلقين
 */
export const TOOL_963 = { id: 963, titleDe: "Grit Duckworth", titleAr: "مثابرة دكوورث", family: "تلقين", bloom: "قيّم", level: "A1-B2", research: "Duckworth 2007", desc: "Grit Duckworth" } as const;
export function tool963Gain(a:boolean):number{return a?1.2:1.0;}
export function tool963Check(v:number):boolean{return v>0;}
