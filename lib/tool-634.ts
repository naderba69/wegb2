/**
 * 634 — Transferability — قابلية نقل
 * Kellerman 1983: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_634 = { id: 634, titleDe: "Transferability", titleAr: "قابلية نقل", family: "SLA", bloom: "فهم", level: "A1-B2", research: "Kellerman 1983", desc: "Transferability" } as const;
export function tool634Gain(a:boolean):number{return a?1.2:1.0;}
export function tool634Check(v:number):boolean{return v>0;}
