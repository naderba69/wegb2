/**
 * 635 — Markedness — تميّز
 * Eckman 1977: classroom application
 * Level: B1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_635 = { id: 635, titleDe: "Markedness", titleAr: "تميّز", family: "SLA", bloom: "فهم", level: "B1-B2", research: "Eckman 1977", desc: "Markedness" } as const;
export function tool635Gain(a:boolean):number{return a?1.2:1.0;}
export function tool635Check(v:number):boolean{return v>0;}
