/**
 * 637 — Linguistic Proximity — تقارب لغوي
 * Westergaard 2019: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_637 = { id: 637, titleDe: "Linguistic Proximity", titleAr: "تقارب لغوي", family: "SLA", bloom: "فهم", level: "A1-B2", research: "Westergaard 2019", desc: "Linguistic Proximity" } as const;
export function tool637Gain(a:boolean):number{return a?1.2:1.0;}
export function tool637Check(v:number):boolean{return v>0;}
