/**
 * 781 — Subtractive Bilingualism — ثنائية انتقاصية
 * Lambert 1974: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_781 = { id: 781, titleDe: "Subtractive Bilingualism", titleAr: "ثنائية انتقاصية", family: "SLA", bloom: "فهم", level: "A1-B2", research: "Lambert 1974", desc: "Subtractive Bilingualism" } as const;
export function tool781Gain(a:boolean):number{return a?1.2:1.0;}
export function tool781Check(v:number):boolean{return v>0;}
