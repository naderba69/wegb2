/**
 * 766 — Translingual Practice — ممارسة عبر لغوية
 * Canagarajah 2013: classroom application
 * Level: B1-B2 | Bloom: أنشئ | Family: SLA
 */
export const TOOL_766 = { id: 766, titleDe: "Translingual Practice", titleAr: "ممارسة عبر لغوية", family: "SLA", bloom: "أنشئ", level: "B1-B2", research: "Canagarajah 2013", desc: "Translingual Practice" } as const;
export function tool766Gain(a:boolean):number{return a?1.2:1.0;}
export function tool766Check(v:number):boolean{return v>0;}
