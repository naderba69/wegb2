/**
 * 671 — Pragmatic Markers — علامات تداولية
 * Brinton 1996: classroom application
 * Level: B1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_671 = { id: 671, titleDe: "Pragmatic Markers", titleAr: "علامات تداولية", family: "SLA", bloom: "فهم", level: "B1-B2", research: "Brinton 1996", desc: "Pragmatic Markers" } as const;
export function tool671Gain(a:boolean):number{return a?1.2:1.0;}
export function tool671Check(v:number):boolean{return v>0;}
